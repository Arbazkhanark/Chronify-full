// src/modules/sleep-schedule/sleep-schedule.types.ts

export type SleepType = 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE'
export type SleepDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

export interface CreateSleepScheduleDTO {
  day: string
  bedtime: string
  wakeTime: string
  isActive?: boolean
  type?: SleepType
  notes?: string
  color?: string
// 🔥 Add these for better control
    allowOverlap?: boolean // Allow overlapping with existing tasks? (default: false)
  forceSchedule?: boolean // Force schedule even if slot is busy? (default: false)
}


export interface TimeSlotAvailability {
  isAvailable: boolean
  conflicts: {
    type: 'TASK' | 'FIXED' | 'SLEEP'
    title: string
    startTime: string
    endTime: string
    description?: string
  }[]
  alternativeSlots?: string[] // Suggested alternative times
}




export interface UpdateSleepScheduleDTO extends Partial<CreateSleepScheduleDTO> {
  duration?: number
}

export interface SleepScheduleResponse {
  id: string
  day: string
  bedtime: string
  wakeTime: string
  duration: number
  isActive: boolean
  type: SleepType
  notes?: string
  color: string
  createdAt: Date
  updatedAt: Date
}

export interface BulkSleepScheduleDTO {
  schedules: CreateSleepScheduleDTO[]
}

export interface SleepStats {
  totalSleepHours: number
  avgSleepHours: number
  daysWithSleep: number
  recommendedHours: number
  sleepQuality: 'OPTIMAL' | 'NEED_MORE' | 'TOO_MUCH' | 'INCONSISTENT'
  byDay: Record<string, number>
  byType: Record<string, number>
  streak: number
  consistency: number // 0-100
}

export interface ApplyToAllDTO {
  bedtime: string
  wakeTime: string
  type?: SleepType
  isActive?: boolean
  notes?: string
}