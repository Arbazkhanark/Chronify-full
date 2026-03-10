// src/modules/sleep-schedule/sleep-schedule.repository.ts

import { prisma } from "../../config/prisma"
import { AppError } from "../../utils/AppError";
import { 
  CreateSleepScheduleDTO, 
  UpdateSleepScheduleDTO 
} from "./sleep-schedule.types"
import { Prisma } from "@prisma/client"

export class SleepScheduleRepository {
  // Create sleep schedule
  static async create(userId: string, data: CreateSleepScheduleDTO) {
    console.log("Creating sleep schedule with data:", data)
    const duration = this.calculateDuration(data.bedtime, data.wakeTime);
    console.log("Calculated duration (minutes):", duration)
    
    return prisma.sleepSchedule.create({
      data: {
        userId,
        day: data.day as any,
        bedtime: data.bedtime,
        wakeTime: data.wakeTime,
        duration,
        isActive: data.isActive ?? true,
        type: (data.type as any) ?? 'REGULAR',
        notes: data.notes,
        color: data.color ?? '#4B5563'
      }
    })
  }



    static async create1(userId: string, data: CreateSleepScheduleDTO) {
    console.log("🔍 [REPO] Creating sleep schedule for userId:", userId)
    console.log("🔍 [REPO] Data:", JSON.stringify(data, null, 2))
    
    // 🔥 CRITICAL: Check if user exists FIRST
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true }
    })
    
    console.log("🔍 [REPO] User found:", user ? `✅ ${user.email}` : "❌ NOT FOUND")
    
    if (!user) {
      throw new AppError(`User with ID ${userId} not found`, 404)
    }
    
    const duration = this.calculateDuration(data.bedtime, data.wakeTime)
    console.log("🔍 [REPO] Calculated duration:", duration, "minutes")
    
    try {
      const result = await prisma.sleepSchedule.create({
        data: {
          userId,
          day: data.day as any,
          bedtime: data.bedtime,
          wakeTime: data.wakeTime,
          duration,
          isActive: data.isActive ?? true,
          type: (data.type as any) ?? 'REGULAR',
          notes: data.notes,
          color: data.color ?? '#4B5563'
        }
      })
      
      console.log("✅ [REPO] Sleep schedule created successfully:", result.id)
      return result
    } catch (error) {
      console.error("❌ [REPO] Prisma error:", error)
      throw error
    }
  }



  // ✅ FIXED: Bulk create/update - NO UPSERT, use createMany + delete
  static async bulkUpsert(userId: string, schedules: CreateSleepScheduleDTO[]) {
    console.log(`📦 Bulk creating ${schedules.length} sleep schedules`)
    
    // First, delete ALL existing schedules for this user
    // (We're applying to all days, so replace everything)
    await prisma.sleepSchedule.deleteMany({
      where: { userId }
    })
    
    // Then create all new schedules
    const data = schedules.map(schedule => {
      const duration = this.calculateDuration(schedule.bedtime, schedule.wakeTime)
      return {
        userId,
        day: schedule.day as any,
        bedtime: schedule.bedtime,
        wakeTime: schedule.wakeTime,
        duration,
        isActive: schedule.isActive ?? true,
        type: (schedule.type as any) ?? 'REGULAR',
        notes: schedule.notes,
        color: schedule.color ?? '#4B5563'
      }
    })
    
    return prisma.sleepSchedule.createMany({
      data,
      skipDuplicates: false
    })
  }



  // Bulk update
static async bulkUpdate(
  userId: string,
  updates: Array<{
    scheduleId: string;
    bedtime?: string;
    wakeTime?: string;
    isActive?: boolean;
    type?: string;
    notes?: string | null;
    color?: string | null;
  }>
) {
  return prisma.$transaction(async (tx) => {
    const updated: any[] = [];

    for (const update of updates) {
      const { scheduleId, ...data } = update;

      // Ownership + existence check
      const existing = await tx.sleepSchedule.findFirst({
        where: { id: scheduleId, userId }
      });

      if (!existing) {
        throw new AppError(`Sleep schedule not found or not owned: ${scheduleId}`, 404);
      }

      // Recalculate duration if times changed
      let duration = existing.duration;
      if (data.bedtime || data.wakeTime) {
        const bedtime = data.bedtime || existing.bedtime;
        const wakeTime = data.wakeTime || existing.wakeTime;
        duration = this.calculateDuration(bedtime, wakeTime);
      }

      const updatedSchedule = await tx.sleepSchedule.update({
        where: { id: scheduleId },
        data: {
          ...data,
          duration,
          updatedAt: new Date()
        }
      });

      updated.push(updatedSchedule);
    }

    return updated;
  }, { timeout: 30000 });
}

// Bulk delete
static async bulkDelete(userId: string, scheduleIds: string[]) {
  return prisma.$transaction(async (tx) => {
    // Verify ownership
    const existing = await tx.sleepSchedule.findMany({
      where: {
        id: { in: scheduleIds },
        userId
      },
      select: { id: true }
    });

    const foundIds = new Set(existing.map(s => s.id));
    const missing = scheduleIds.filter(id => !foundIds.has(id));

    if (missing.length > 0) {
      throw new AppError(
        `Some schedules not found or not owned: ${missing.join(", ")}`,
        404
      );
    }

    // Delete
    const result = await tx.sleepSchedule.deleteMany({
      where: {
        id: { in: scheduleIds },
        userId
      }
    });

    return result; // { count: number }
  }, { timeout: 30000 });
}



  // Find by ID
  static async findById(id: string, userId: string) {
    return prisma.sleepSchedule.findFirst({
      where: { id, userId }
    })
  }

  // Find by day
  static async findByDay(userId: string, day: string) {
    return prisma.sleepSchedule.findMany({
      where: { 
        userId, 
        day: day as any 
      },
      orderBy: { bedtime: 'asc' }
    })
  }

  // Find all for user
  // Find all for user with filters
  static async findAll(userId: string, filters?: { 
    day?: string, 
    isActive?: boolean, 
    type?: string 
  }) {
    const where: Prisma.SleepScheduleWhereInput = { userId }
    
    if (filters?.day) {
      where.day = filters.day as any
    }
    
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive
    }
    
    if (filters?.type) {
      where.type = filters.type as any
    }
    
    return prisma.sleepSchedule.findMany({
      where,
      orderBy: [
        { day: 'asc' },
        { bedtime: 'asc' }
      ]
    })
  }

  // Update sleep schedule
  static async update(id: string, userId: string, data: UpdateSleepScheduleDTO) {
    const updateData: any = { ...data }
    
    // Recalculate duration if times changed
    if (data.bedtime || data.wakeTime) {
      const existing = await this.findById(id, userId)
      if (existing) {
        const bedtime = data.bedtime || existing.bedtime
        const wakeTime = data.wakeTime || existing.wakeTime
        updateData.duration = this.calculateDuration(bedtime, wakeTime)
      }
    }
    
    return prisma.sleepSchedule.update({
      where: { id, userId },
      data: {
        ...updateData,
        day: data.day as any,
        type: data.type as any,
        updatedAt: new Date()
      }
    })
  }

  // Update by day
  static async updateByDay(userId: string, day: string, data: UpdateSleepScheduleDTO) {
    const updateData: any = { ...data }
    
    // Recalculate duration if times changed
    if (data.bedtime || data.wakeTime) {
      const existing = await this.findByDay(userId, day)
      if (existing) {
        const bedtime = data.bedtime || existing.bedtime
        const wakeTime = data.wakeTime || existing.wakeTime
        updateData.duration = this.calculateDuration(bedtime, wakeTime)
      }
    }
    
    return prisma.sleepSchedule.updateMany({
      where: {
          userId,
          day: day as any
      },
      data: {
        ...updateData,
        day: data.day as any,
        type: data.type as any,
        updatedAt: new Date()
      }
    })
  }

  // Delete sleep schedule
  static async delete(id: string, userId: string) {
    return prisma.sleepSchedule.delete({
      where: { id, userId }
    })
  }

  // Delete by day
  static async deleteByDay(userId: string, day: string) {
    return prisma.sleepSchedule.deleteMany({
      where: {
          userId,
          day: day as any
      }
    })
  }

  // Toggle active status
  static async toggleActive(id: string, userId: string, isActive: boolean) {
    return prisma.sleepSchedule.update({
      where: { id, userId },
      data: { isActive, updatedAt: new Date() }
    })
  }

  // Get sleep statistics
  static async getStats(userId: string, weeks: number = 4) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (weeks * 7))
    
    // Get all active sleep schedules
    const schedules = await prisma.sleepSchedule.findMany({
      where: { 
        userId,
        isActive: true
      }
    })
    
    // Get sleep tasks for the period
    const sleepTasks = await prisma.task.findMany({
      where: {
        userId,
        // isSleepTime: true,
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return {
      schedules,
      sleepTasks,
      totalSchedules: schedules.length
    }
  }

  // Helper: Calculate duration in minutes
  private static calculateDuration(bedtime: string, wakeTime: string): number {
    const bedMinutes = this.timeToMinutes(bedtime)
    const wakeMinutes = this.timeToMinutes(wakeTime)
    
    // Handle sleep across midnight
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
}