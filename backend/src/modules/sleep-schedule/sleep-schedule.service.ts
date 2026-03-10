// src/modules/sleep-schedule/sleep-schedule.service.ts
import { SleepScheduleRepository } from "./sleep-schedule.repository"
import { TaskRepository } from "../tasks/task.repository"
import {
  CreateSleepScheduleDTO,
  UpdateSleepScheduleDTO,
  SleepStats,
  ApplyToAllDTO
} from "./sleep-schedule.types"
import { AppError } from "../../utils/AppError"
import { logger } from "patal-log"
import { SleepScheduleAvailability } from "./sleep-schedule.availability"

export class SleepScheduleService {

  static async createSleepSchedule(userId: string, data: CreateSleepScheduleDTO) {
    logger.info("Creating sleep schedule", {
      functionName: "SleepScheduleService.createSleepSchedule",
      metadata: { userId, day: data.day }
    })

    // 🔥 CHECK EXISTING SCHEDULES BASED ON TYPE
    const existingSchedules = await SleepScheduleRepository.findAll(userId, {
      day: data.day,
      isActive: true
    })

    if (data.type === 'REGULAR' || data.type === 'EARLY' || data.type === 'LATE' || data.type === 'RECOVERY') {
      // ✅ REGULAR SLEEP - Only one allowed per day
      const existingRegular = existingSchedules.find(s =>
        s.type === 'REGULAR' || s.type === 'EARLY' || s.type === 'LATE' || s.type === 'RECOVERY'
      )

      if (existingRegular) {
        throw new AppError(
          `You already have a ${existingRegular.type.toLowerCase()} sleep schedule for ${data.day} from ${existingRegular.bedtime} to ${existingRegular.wakeTime}. Please update it instead of creating a new one.`,
          409,
          JSON.stringify({ existingSchedule: existingRegular })
        )
      }
    } else if (data.type === 'POWER_NAP') {
      // ✅ POWER NAP - Multiple allowed per day
      // Just check for overlapping time slots
      const overlappingNap = existingSchedules.find(s =>
        s.type === 'POWER_NAP' &&
        this.doTimeRangesOverlap(data.bedtime, data.wakeTime, s.bedtime, s.wakeTime)
      )

      if (overlappingNap) {
        throw new AppError(
          `This time overlaps with an existing power nap from ${overlappingNap.bedtime} to ${overlappingNap.wakeTime}. Please choose a different time.`,
          409,
          JSON.stringify({ existingSchedule: overlappingNap })
        )
      }
    }

    // Validate sleep duration
    this.validateSleepDuration(data.bedtime, data.wakeTime, data.type)

    // Create schedule
    const schedule = await SleepScheduleRepository.create(userId, data)

    // Generate sleep task
    // await this.generateSleepTask(userId, schedule)

    logger.info("Sleep schedule created successfully", {
      functionName: "SleepScheduleService.createSleepSchedule",
      metadata: { userId, scheduleId: schedule.id, day: schedule.day, type: schedule.type }
    })

    return schedule
  }




  // Bulk create/update sleep schedules
  static async bulkCreateSleepSchedules(userId: string, schedules: CreateSleepScheduleDTO[]) {
    logger.info("Bulk creating sleep schedules", {
      functionName: "SleepScheduleService.bulkCreateSleepSchedules",
      metadata: { userId, count: schedules.length }
    })

    // Validate all schedules
    for (const schedule of schedules) {
      this.validateSleepDuration(schedule.bedtime, schedule.wakeTime)
    }

    const createdSchedules = await SleepScheduleRepository.bulkUpsert(userId, schedules)

    // Regenerate all sleep tasks
    // await this.regenerateAllSleepTasks(userId)

    logger.info("Sleep schedules bulk created successfully", {
      functionName: "SleepScheduleService.bulkCreateSleepSchedules",
      metadata: { userId, count: createdSchedules.length }
    })

    return createdSchedules
  }


  // Bulk update
static async bulkUpdateSleepSchedules(
  userId: string,
  updates: Array<{
    scheduleId: string;
    bedtime?: string;
    wakeTime?: string;
    isActive?: boolean;
    type?: 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE';
    notes?: string | null;
    color?: string | null;
  }>
) {
  logger.info("Bulk updating sleep schedules", {
    functionName: "SleepScheduleService.bulkUpdateSleepSchedules",
    metadata: { userId, count: updates.length }
  });

  const updatedSchedules = await SleepScheduleRepository.bulkUpdate(userId, updates);

  // Regenerate affected sleep tasks
  // await this.regenerateAllSleepTasks(userId);

  logger.info("Bulk sleep schedules updated successfully", {
    functionName: "SleepScheduleService.bulkUpdateSleepSchedules",
    metadata: { userId, count: updatedSchedules.length }
  });

  return updatedSchedules;
}

// Bulk delete
static async bulkDeleteSleepSchedules(userId: string, scheduleIds: string[]) {
  logger.info("Bulk deleting sleep schedules", {
    functionName: "SleepScheduleService.bulkDeleteSleepSchedules",
    metadata: { userId, count: scheduleIds.length }
  });

  const result = await SleepScheduleRepository.bulkDelete(userId, scheduleIds);

  // Clean up associated tasks
  // await TaskRepository.deleteBySleepScheduleIds(userId, scheduleIds);

  // Regenerate remaining sleep tasks
  // await this.regenerateAllSleepTasks(userId);

  logger.info("Bulk sleep schedules deleted successfully", {
    functionName: "SleepScheduleService.bulkDeleteSleepSchedules",
    metadata: { userId, deletedCount: result.count }
  });

  return result; // { count: number }
}



  // Get sleep schedule by ID
  static async getSleepSchedule(userId: string, scheduleId: string) {
    logger.info("Fetching sleep schedule", {
      functionName: "SleepScheduleService.getSleepSchedule",
      metadata: { userId, scheduleId }
    })

    const schedule = await SleepScheduleRepository.findById(scheduleId, userId)
    if (!schedule) {
      throw new AppError("Sleep schedule not found", 404)
    }

    return schedule
  }

  // Get sleep schedule by day
  static async getSleepScheduleByDay(userId: string, day: string) {
    logger.info("Fetching sleep schedule by day", {
      functionName: "SleepScheduleService.getSleepScheduleByDay",
      metadata: { userId, day }
    })

    const schedule = await SleepScheduleRepository.findByDay(userId, day)
    if (!schedule) {
      throw new AppError(`Sleep schedule for ${day} not found`, 404)
    }

    return schedule
  }

  // Get all sleep schedules
  static async getSleepSchedules(userId: string, filters?: { isActive?: boolean, type?: string }) {
    logger.info("Fetching sleep schedules", {
      functionName: "SleepScheduleService.getSleepSchedules",
      metadata: { userId, filters }
    })

    const schedules = await SleepScheduleRepository.findAll(userId, filters)

    return schedules
  }

  // Update sleep schedule
  static async updateSleepSchedule(userId: string, scheduleId: string, data: UpdateSleepScheduleDTO) {
    logger.info("Updating sleep schedule", {
      functionName: "SleepScheduleService.updateSleepSchedule",
      metadata: { userId, scheduleId, data }
    })

    // Check if schedule exists
    const existing = await SleepScheduleRepository.findById(scheduleId, userId)
    if (!existing) {
      throw new AppError("Sleep schedule not found", 404)
    }

    // Validate sleep duration if times changed
    if (data.bedtime || data.wakeTime) {
      const bedtime = data.bedtime || existing.bedtime
      const wakeTime = data.wakeTime || existing.wakeTime
      this.validateSleepDuration(bedtime, wakeTime)
    }

    const schedule = await SleepScheduleRepository.update(scheduleId, userId, data)

    // Update sleep task
    // await this.regenerateSleepTask(userId, schedule)

    logger.info("Sleep schedule updated successfully", {
      functionName: "SleepScheduleService.updateSleepSchedule",
      metadata: { userId, scheduleId }
    })

    return schedule
  }

  // Update sleep schedule by day
  static async updateSleepScheduleByDay(userId: string, day: string, data: UpdateSleepScheduleDTO) {
    logger.info("Updating sleep schedule by day", {
      functionName: "SleepScheduleService.updateSleepScheduleByDay",
      metadata: { userId, day, data }
    })

    // Check if schedule exists
    const existing = await SleepScheduleRepository.findByDay(userId, day)
    if (!existing) {
      throw new AppError(`Sleep schedule for ${day} not found`, 404)
    }

    // Validate sleep duration if times changed
    if (data.bedtime || data.wakeTime) {
      const bedtime = data.bedtime || existing.bedtime
      const wakeTime = data.wakeTime || existing.wakeTime
      this.validateSleepDuration(bedtime, wakeTime)
    }

    const schedule = await SleepScheduleRepository.updateByDay(userId, day, data)

    // Update sleep task
    // await this.regenerateSleepTask(userId, schedule)

    return schedule
  }

  // Delete sleep schedule
  static async deleteSleepSchedule(userId: string, scheduleId: string) {
    logger.info("Deleting sleep schedule", {
      functionName: "SleepScheduleService.deleteSleepSchedule",
      metadata: { userId, scheduleId }
    })

    // Check if schedule exists
    const existing = await SleepScheduleRepository.findById(scheduleId, userId)
    if (!existing) {
      throw new AppError("Sleep schedule not found", 404)
    }

    // Delete associated sleep tasks
    // await TaskRepository.deleteBySleepSchedule(userId, scheduleId)

    await SleepScheduleRepository.delete(scheduleId, userId)

    logger.info("Sleep schedule deleted successfully", {
      functionName: "SleepScheduleService.deleteSleepSchedule",
      metadata: { userId, scheduleId }
    })
  }

  // Delete sleep schedule by day
  static async deleteSleepScheduleByDay(userId: string, day: string) {
    logger.info("Deleting sleep schedule by day", {
      functionName: "SleepScheduleService.deleteSleepScheduleByDay",
      metadata: { userId, day }
    })

    // Check if schedule exists
    const existing = await SleepScheduleRepository.findByDay(userId, day)
    if (!existing) {
      throw new AppError(`Sleep schedule for ${day} not found`, 404)
    }

    // Delete associated sleep tasks
    // await TaskRepository.deleteBySleepSchedule(userId, existing.id)

    await SleepScheduleRepository.deleteByDay(userId, day)

    logger.info("Sleep schedule deleted successfully", {
      functionName: "SleepScheduleService.deleteSleepScheduleByDay",
      metadata: { userId, day }
    })
  }

  // Toggle sleep schedule active status
  static async toggleSleepSchedule(userId: string, scheduleId: string, isActive: boolean) {
    logger.info("Toggling sleep schedule", {
      functionName: "SleepScheduleService.toggleSleepSchedule",
      metadata: { userId, scheduleId, isActive }
    })

    const schedule = await SleepScheduleRepository.toggleActive(scheduleId, userId, isActive)

    // Regenerate sleep tasks
    if (isActive) {
      // await this.regenerateSleepTask(userId, schedule)
    } else {
      // await TaskRepository.deleteBySleepSchedule(userId, scheduleId)
    }

    return schedule
  }

  // Apply schedule to all days
  static async applyToAllDays(userId: string, data: ApplyToAllDTO) {
    logger.info("Applying sleep schedule to all days", {
      functionName: "SleepScheduleService.applyToAllDays",
      metadata: { userId, data }
    })

    this.validateSleepDuration(data.bedtime, data.wakeTime)

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

    const schedules = days.map(day => ({
      day,
      bedtime: data.bedtime,
      wakeTime: data.wakeTime,
      isActive: data.isActive ?? true,
      type: data.type ?? 'REGULAR',
      notes: data.notes,
      color: '#4B5563'
    }))

    const createdSchedules = await SleepScheduleRepository.bulkUpsert(userId, schedules)

    // Regenerate all sleep tasks
    // await this.regenerateAllSleepTasks(userId)

    return createdSchedules
  }

  // Get sleep statistics
  static async getSleepStatistics(userId: string, weeks: number = 4) {
    logger.info("Fetching sleep statistics", {
      functionName: "SleepScheduleService.getSleepStatistics",
      metadata: { userId, weeks }
    })

    const stats = await SleepScheduleRepository.getStats(userId, weeks)

    const totalSleepHours = stats.schedules.reduce((sum, s) => sum + (s.duration / 60), 0)
    const avgSleepHours = stats.schedules.length > 0 ? totalSleepHours / stats.schedules.length : 0

    // Calculate sleep quality
    let sleepQuality: 'OPTIMAL' | 'NEED_MORE' | 'TOO_MUCH' | 'INCONSISTENT' = 'OPTIMAL'

    if (stats.schedules.length < 7) {
      sleepQuality = 'INCONSISTENT'
    } else if (avgSleepHours < 7) {
      sleepQuality = 'NEED_MORE'
    } else if (avgSleepHours > 9) {
      sleepQuality = 'TOO_MUCH'
    }

    // Calculate consistency (percentage of days with active sleep schedule)
    const consistency = Math.round((stats.schedules.length / 7) * 100)

    // Calculate streak
    const streak = await this.calculateSleepStreak(userId)

    // Group by type
    const byType: Record<string, number> = {}
    stats.schedules.forEach(s => {
      byType[s.type] = (byType[s.type] || 0) + 1
    })

    // Group by day
    const byDay: Record<string, number> = {}
    stats.schedules.forEach(s => {
      byDay[s.day] = s.duration / 60
    })

    const result: SleepStats = {
      totalSleepHours,
      avgSleepHours,
      daysWithSleep: stats.schedules.length,
      recommendedHours: 8,
      sleepQuality,
      byDay,
      byType,
      streak,
      consistency
    }

    logger.info("Sleep statistics fetched successfully", {
      functionName: "SleepScheduleService.getSleepStatistics",
      metadata: { userId }
    })

    return result
  }

  // Regenerate all sleep tasks
  static async regenerateAllSleepTasks(userId: string) {
    logger.info("Regenerating all sleep tasks", {
      functionName: "SleepScheduleService.regenerateAllSleepTasks",
      metadata: { userId }
    })

    // Delete all existing sleep tasks
    // await TaskRepository.deleteAllSleepTasks(userId)

    // Get all active sleep schedules
    const schedules = await SleepScheduleRepository.findAll(userId, { isActive: true })

    // Create new sleep tasks for each schedule
    for (const schedule of schedules) {
      // await this.generateSleepTask(userId, schedule)
    }

    logger.info("All sleep tasks regenerated", {
      functionName: "SleepScheduleService.regenerateAllSleepTasks",
      metadata: { userId, count: schedules.length }
    })
  }

  // Generate sleep task for a schedule
  private static async generateSleepTask(userId: string, schedule: any) {
    const day = schedule.day.charAt(0) + schedule.day.slice(1, 3).toLowerCase()

    // Handle sleep across midnight
    const bedMinutes = this.timeToMinutes(schedule.bedtime)
    const wakeMinutes = this.timeToMinutes(schedule.wakeTime)

    if (wakeMinutes < bedMinutes) {
      // Sleep spans across midnight
      const midnight = this.timeToMinutes('24:00')
      const nextDay = this.getNextDay(day)

      // Create first part (bedtime to midnight)
      await TaskRepository.createSleepTask(userId, {
        title: this.getSleepTitle(schedule.type),
        subject: 'Sleep',
        startTime: schedule.bedtime,
        endTime: '24:00',
        duration: midnight - bedMinutes,
        color: schedule.color,
        day,
        sleepScheduleId: schedule.id,
        type: schedule.type
      })

      // Create second part (midnight to wake time)
      await TaskRepository.createSleepTask(userId, {
        title: this.getSleepTitle(schedule.type),
        subject: 'Sleep',
        startTime: '00:00',
        endTime: schedule.wakeTime,
        duration: wakeMinutes,
        color: schedule.color,
        day: nextDay,
        sleepScheduleId: schedule.id,
        type: schedule.type
      })
    } else {
      // Normal sleep within same day
      await TaskRepository.createSleepTask(userId, {
        title: this.getSleepTitle(schedule.type),
        subject: 'Sleep',
        startTime: schedule.bedtime,
        endTime: schedule.wakeTime,
        duration: schedule.duration,
        color: schedule.color,
        day,
        sleepScheduleId: schedule.id,
        type: schedule.type
      })
    }
  }

  // Regenerate sleep task for a single schedule
  private static async regenerateSleepTask(userId: string, schedule: any) {
    // Delete existing sleep tasks for this schedule
    await TaskRepository.deleteBySleepSchedule(userId, schedule.id)

    // Create new sleep task
    if (schedule.isActive) {
      await this.generateSleepTask(userId, schedule)
    }
  }

  // Validate sleep duration
  private static validateSleepDuration1(bedtime: string, wakeTime: string) {
    const duration = this.calculateDuration(bedtime, wakeTime)
    const hours = duration / 60

    if (duration < 15) {
      throw new AppError("Sleep duration must be at least 15 minutes", 400)
    }

    if (duration > 720) { // 12 hours
      throw new AppError("Sleep duration cannot exceed 12 hours", 400)
    }

    // Check if it's a power nap
    if (duration <= 30 && hours < 1) {
      // Power nap is fine
    } else if (duration < 240) { // Less than 4 hours
      throw new AppError("Sleep duration should be at least 4 hours for regular sleep", 400)
    }
  }


  // 🔥 Update validation for power naps
  private static validateSleepDuration(bedtime: string, wakeTime: string, type?: string) {
    const duration = this.calculateDuration(bedtime, wakeTime)
    const hours = duration / 60

    // Power nap specific validation
    if (type === 'POWER_NAP') {
      if (duration < 5) {
        throw new AppError("Power nap must be at least 5 minutes", 400)
      }
      if (duration > 30) {
        throw new AppError("Power nap cannot exceed 30 minutes", 400)
      }
      return
    }

    // Regular sleep validation
    if (duration < 15) {
      throw new AppError("Sleep duration must be at least 15 minutes", 400)
    }

    if (duration > 720) { // 12 hours
      throw new AppError("Sleep duration cannot exceed 12 hours", 400)
    }

    if (duration < 240 && type !== 'POWER_NAP') { // Less than 4 hours
      throw new AppError("Sleep duration should be at least 4 hours for regular sleep", 400)
    }
  }

  // Calculate sleep streak
  private static async calculateSleepStreak(userId: string): Promise<number> {
    const schedules = await SleepScheduleRepository.findAll(userId, { isActive: true })
    return schedules.length // Simple streak for now
  }

  // Get sleep title based on type
  private static getSleepTitle(type: string): string {
    const titles: Record<string, string> = {
      'REGULAR': 'Sleep',
      'POWER_NAP': 'Power Nap',
      'RECOVERY': 'Recovery Sleep',
      'EARLY': 'Early Sleep',
      'LATE': 'Sleep'
    }
    return titles[type] || 'Sleep'
  }

  // Get next day
  private static getNextDay(currentDay: string): string {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const index = days.indexOf(currentDay)
    return days[(index + 1) % days.length]
  }

  // Helper: Calculate duration in minutes
  private static calculateDuration(bedtime: string, wakeTime: string): number {
    const bedMinutes = this.timeToMinutes(bedtime)
    const wakeMinutes = this.timeToMinutes(wakeTime)

    if (wakeMinutes < bedMinutes) {
      const midnight = 24 * 60
      return (midnight - bedMinutes) + wakeMinutes
    }

    return wakeMinutes - bedMinutes
  }

  // Helper: Convert time string to minutes
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }


    private static doTimeRangesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const s1 = this.timeToMinutes(start1)
    const e1 = this.timeToMinutes(end1)
    const s2 = this.timeToMinutes(start2)
    const e2 = this.timeToMinutes(end2)
    
    // Handle times that cross midnight
    const e1Adjusted = e1 < s1 ? e1 + (24 * 60) : e1
    const e2Adjusted = e2 < s2 ? e2 + (24 * 60) : e2
    const s1Adjusted = s1
    const s2Adjusted = s2
    
    return s1Adjusted < e2Adjusted && s2Adjusted < e1Adjusted
  }




}