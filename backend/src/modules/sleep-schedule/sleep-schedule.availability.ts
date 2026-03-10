// src/modules/sleep-schedule/sleep-schedule.availability.ts

import { prisma } from "../../config/prisma"
import { AppError } from "../../utils/AppError"

export class SleepScheduleAvailability {
  
  // 🔥 Main availability check function
  static async checkTimeSlotAvailability(
    userId: string,
    day: string,
    startTime: string,
    endTime: string,
    excludeSleepScheduleId?: string
  ): Promise<{
    isAvailable: boolean
    conflicts: any[]
    alternativeSlots: string[]
  }> {
    console.log(`🔍 Checking availability for ${day} at ${startTime}-${endTime}`)

    const conflicts = []

    // 1. CHECK FOR EXISTING SLEEP SCHEDULES (excluding current)
    const existingSleep = await prisma.sleepSchedule.findFirst({
      where: {
        userId,
        day: day as any,
        isActive: true,
        id: excludeSleepScheduleId ? { not: excludeSleepScheduleId } : undefined,
        OR: [
          {
            // Sleep starts during this period
            bedtime: { lte: startTime },
            wakeTime: { gt: startTime }
          },
          {
            // Sleep ends during this period
            bedtime: { lt: endTime },
            wakeTime: { gte: endTime }
          },
          {
            // Sleep completely within this period
            bedtime: { gte: startTime },
            wakeTime: { lte: endTime }
          }
        ]
      }
    })

    if (existingSleep) {
      conflicts.push({
        type: 'SLEEP',
        title: 'Existing Sleep Schedule',
        startTime: existingSleep.bedtime,
        endTime: existingSleep.wakeTime,
        description: `Already have sleep scheduled from ${existingSleep.bedtime} to ${existingSleep.wakeTime}`
      })
    }

    // 2. CHECK FOR FIXED COMMITMENTS (College, Office, etc.)
    const fixedTimes = await prisma.fixedTime.findMany({
      where: {
        userId,
        days: { has: day },
        isEditable: false
      },
      include: {
        freePeriods: true
      }
    })

    for (const fixed of fixedTimes) {
      // Check if sleep time overlaps with fixed commitment
      if (this.doTimeRangesOverlap(startTime, endTime, fixed.startTime, fixed.endTime)) {
        // Check if there's a free period within this fixed time
        const freePeriod = fixed.freePeriods?.find(fp => 
          fp.day === day && 
          this.isTimeWithinRange(startTime, fp.startTime, fp.endTime) &&
          this.isTimeWithinRange(endTime, fp.startTime, fp.endTime)
        )

        if (!freePeriod) {
          conflicts.push({
            type: 'FIXED',
            title: fixed.title,
            startTime: fixed.startTime,
            endTime: fixed.endTime,
            description: `This time is blocked for ${fixed.title}`
          })
        }
      }
    }

    // 3. CHECK FOR EXISTING TASKS (if not power nap or if user doesn't allow overlap)
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        day,
        isCompleted: false,
        // isSleepTime: false, // Don't check other sleep tasks (already checked)
        OR: [
          {
            startTime: { lte: startTime },
            endTime: { gt: startTime }
          },
          {
            startTime: { lt: endTime },
            endTime: { gte: endTime }
          },
          {
            startTime: { gte: startTime },
            endTime: { lte: endTime }
          }
        ]
      }
    })

    for (const task of tasks) {
      conflicts.push({
        type: 'TASK',
        title: task.title,
        startTime: task.startTime,
        endTime: task.endTime,
        description: `You have "${task.title}" scheduled at this time`
      })
    }

    // 4. GENERATE ALTERNATIVE SLOTS
    const alternativeSlots = await this.suggestAlternativeSlots(userId, day, startTime, endTime)

    return {
      isAvailable: conflicts.length === 0,
      conflicts,
      alternativeSlots
    }
  }

  // 🔥 Suggest alternative time slots
  static async suggestAlternativeSlots(
    userId: string,
    day: string,
    preferredStart: string,
    preferredEnd: string
  ): Promise<string[]> {
    const suggestions = []
    const duration = this.timeToMinutes(preferredEnd) - this.timeToMinutes(preferredStart)
    
    // Try slots before preferred time
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const start = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const end = this.calculateEndTime(start, duration)
        
        if (end > '24:00') continue
        
        const availability = await this.checkTimeSlotAvailability(userId, day, start, end)
        if (availability.isAvailable) {
          suggestions.push(`${start}-${end}`)
          if (suggestions.length >= 3) break
        }
      }
      if (suggestions.length >= 3) break
    }
    
    return suggestions
  }

  // 🔥 Helper: Check if time is within range
  private static isTimeWithinRange(time: string, start: string, end: string): boolean {
    const timeMinutes = this.timeToMinutes(time)
    const startMinutes = this.timeToMinutes(start)
    const endMinutes = this.timeToMinutes(end)
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes
  }

  // 🔥 Helper: Check if two time ranges overlap
  private static doTimeRangesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const s1 = this.timeToMinutes(start1)
    const e1 = this.timeToMinutes(end1)
    const s2 = this.timeToMinutes(start2)
    const e2 = this.timeToMinutes(end2)
    return s1 < e2 && s2 < e1
  }

  // 🔥 Helper: Convert time to minutes
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // 🔥 Helper: Calculate end time from start time and duration
  private static calculateEndTime(startTime: string, duration: number): string {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }
}