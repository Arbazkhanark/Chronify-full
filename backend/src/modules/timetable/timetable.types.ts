// // src/modules/timetable/timetable.types.ts

// import { Priority, TaskStatus, TimeSlotType, TaskCategory } from '../tasks/task.types'
// import { SleepDay } from '../sleep-schedule/sleep-schedule.types'

// // ---------------------- ENUMS ----------------------
// export type TimableView = 'grid' | 'list'
// export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
// export type SmartDelayOptionType = 'immediate' | 'free-period' | 'evening' | 'next-day'

// // ---------------------- DTOs ----------------------
// export interface GetTimetableDTO {
//   day?: DayOfWeek
//   fromDate?: string
//   toDate?: string
//   showWeekends?: boolean
//   timeRangeStart?: number  // 6 = 6 AM
//   timeRangeEnd?: number    // 23 = 11 PM
//   compact?: boolean
// }

// export interface GetTimetableResponse {
//   day: DayOfWeek
//   date: string
//   isToday: boolean
//   tasks: TimetableTask[]
//   stats: {
//     total: number
//     completed: number
//     pending: number
//     inProgress: number
//     missed: number
//     totalHours: number
//     completedHours: number
//   }
// }

// export interface TimetableTask {
//   id: string
//   title: string
//   subject: string | null
//   startTime: string
//   endTime: string
//   duration: number
//   priority: Priority
//   color: string
//   day: DayOfWeek
//   type: TimeSlotType
//   category: TaskCategory
//   icon: string | null
//   status: TaskStatus
//   isCompleted: boolean
//   completedAt: Date | null
//   startedAt: Date | null
//   actualDuration: number | null
//   isRescheduled: boolean
//   originalStartTime: string | null
//   originalEndTime: string | null
//   originalDay: DayOfWeek | null
  
//   // Relations
//   goalId: string | null
//   goalTitle: string | null
//   milestoneId: string | null
//   fixedTimeId: string | null
//   fixedTimeTitle: string | null
  
//   // Metadata
//   notes: string | null
//   tags: string[]
//   location: string | null
  
//   // Grace period
//   gracePeriodEndsAt: Date | null
//   lastStatusUpdateAt: Date | null
  
//   // Feedback
//   focusScore: number | null
//   feedbackNotes: string | null
// }

// // ---------------------- SMART DELAY ----------------------
// export interface SmartDelayRequestDTO {
//   taskId: string
//   preferredDelay?: number  // minutes, default 30
// }

// export interface SmartDelayOption {
//   id: string
//   type: SmartDelayOption
//   day: DayOfWeek
//   startTime: string
//   endTime: string
//   duration: number
//   description: string
//   isAvailable: boolean
//   conflictReason?: string
// }

// export interface SmartDelayResponseDTO {
//   taskId: string
//   taskTitle: string
//   currentDay: DayOfWeek
//   currentStartTime: string
//   currentEndTime: string
//   duration: number
//   options: SmartDelayOption[]
//   canExtend: boolean
//   maxExtensionMinutes: number
//   bedtime: string
//   suggestion: string
// }

// export interface ApplySmartDelayDTO {
//   taskId: string
//   optionId: string
//   day: DayOfWeek
//   startTime: string
//   endTime: string
//   type: SmartDelayOption
// }

// // ---------------------- TASK FEEDBACK ----------------------
// export interface TaskFeedbackDTO {
//   taskId: string
//   focusLevel: number  // 1-10
//   completedWell: boolean
//   notes?: string
// }

// export interface TaskFeedbackResponse {
//   id: string
//   taskId: string
//   focusLevel: number
//   completedWell: boolean
//   notes: string | null
//   createdAt: Date
// }

// // ---------------------- GRACE PERIOD ----------------------
// export interface GracePeriodTask {
//   taskId: string
//   taskTitle: string
//   endTime: string
//   timeSinceEnd: number  // minutes
//   timeRemaining: number // minutes until grace period ends
//   status: TaskStatus
// }

// // ---------------------- STATISTICS ----------------------
// export interface TimetableStats {
//   today: {
//     date: string
//     day: DayOfWeek
//     totalTasks: number
//     completedTasks: number
//     pendingTasks: number
//     inProgressTasks: number
//     missedTasks: number
//     completionRate: number
//     totalHours: number
//     completedHours: number
//   }
//   week: {
//     totalTasks: number
//     completedTasks: number
//     pendingTasks: number
//     missedTasks: number
//     completionRate: number
//     totalHours: number
//     completedHours: number
//     byDay: Record<DayOfWeek, number>
//   }
//   productivity: {
//     averageFocusScore: number
//     onTimeRate: number  // tasks completed on time vs delayed
//     rescheduledCount: number
//     skippedCount: number
//     mostProductiveDay: DayOfWeek | null
//     mostProductiveTime: string | null  // e.g., "09:00-11:00"
//   }
//   bedtime: {
//     bedtime: string
//     tasksCompletedBeforeBedtime: number
//     tasksCompletedAfterBedtime: number
//     completionRate: number
//   }
// }

// // ---------------------- BEDTIME ----------------------
// export interface BedtimeInfo {
//   userId: string
//   day: SleepDay
//   bedtime: string
//   wakeTime: string
//   duration: number
//   isActive: boolean
// }
















// src/modules/timetable/timetable.types.ts

import { Priority, TaskStatus, TimeSlotType, TaskCategory } from '../tasks/task.types'
import { SleepDay } from '../sleep-schedule/sleep-schedule.types'

// ---------------------- ENUMS ----------------------
export type TimableView = 'grid' | 'list'
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
export type SmartDelayOptionType = 'immediate' | 'free-period' | 'evening' | 'next-day'

// ---------------------- DTOs ----------------------
export interface GetTimetableDTO {
  day?: DayOfWeek
  fromDate?: string
  toDate?: string
  showWeekends?: boolean
  timeRangeStart?: number  // 6 = 6 AM
  timeRangeEnd?: number    // 23 = 11 PM
  compact?: boolean
}

export interface GetTimetableResponse {
  day: DayOfWeek
  date: string
  isToday: boolean
  tasks: TimetableTask[]
  stats: {
    total: number
    completed: number
    pending: number
    inProgress: number
    missed: number
    totalHours: number
    completedHours: number
  }
}

export interface TimetableTask {
  id: string
  title: string
  subject: string | null
  startTime: string
  endTime: string
  duration: number
  priority: Priority
  color: string
  day: DayOfWeek
  type: TimeSlotType
  category: TaskCategory
  icon: string | null
  status: TaskStatus
  isCompleted: boolean
  completedAt: Date | null
  startedAt: Date | null
  actualDuration: number | null
  isRescheduled: boolean
  originalStartTime: string | null
  originalEndTime: string | null
  originalDay: DayOfWeek | null
  
  // Relations
  goalId: string | null
  goalTitle: string | null
  milestoneId: string | null
  fixedTimeId: string | null
  fixedTimeTitle: string | null
  
  // Metadata
  notes: string | null
  tags: string[]
  location: string | null
  
  // Grace period
  gracePeriodEndsAt: Date | null
  lastStatusUpdateAt: Date | null
  
  // Feedback
  focusScore: number | null
  feedbackNotes: string | null
}

// ==================== 🎯 TASK STATUS UPDATE ====================
export interface UpdateTaskStatusDTO {
  taskId: string
  status: TaskStatus
  notes?: string
}

// ==================== ⏰ SIMPLE DELAY ====================
export interface SimpleDelayDTO {
  taskId: string
  minutes: number  // 5-180 minutes
}

// ==================== 🎯 RESCHEDULE TO FREE PERIOD ====================
export interface RescheduleToFreePeriodDTO {
  taskId: string
  fixedTimeId?: string
  freePeriodId?: string
}

// ==================== 📦 BULK OPERATIONS ====================
export interface BulkCompleteDTO {
  taskIds: string[]
  completedAt?: string  // ISO date string
}

export interface BulkDelayDTO {
  taskIds: string[]
  minutes: number  // 15-180 minutes
}

export interface BulkOperationResult {
  completed: number
  delayed: number
  failed: string[]
  tasks: TimetableTask[]
}

// ---------------------- SMART DELAY ----------------------
export interface SmartDelayRequestDTO {
  taskId: string
  preferredDelay?: number  // minutes, default 30
}

export interface SmartDelayOption {
  id: string
  type: SmartDelayOptionType
  day: DayOfWeek
  startTime: string
  endTime: string
  duration: number
  description: string
  isAvailable: boolean
  conflictReason?: string
}

export interface SmartDelayResponseDTO {
  taskId: string
  taskTitle: string
  currentDay: DayOfWeek
  currentStartTime: string
  currentEndTime: string
  duration: number
  options: SmartDelayOption[]
  canExtend: boolean
  maxExtensionMinutes: number
  bedtime: string
  suggestion: string
}

export interface ApplySmartDelayDTO {
  taskId: string
  optionId: string
  day: DayOfWeek
  startTime: string
  endTime: string
  type: SmartDelayOptionType
}

// ---------------------- TASK FEEDBACK ----------------------
export interface TaskFeedbackDTO {
  taskId: string
  focusLevel: number  // 1-10
  completedWell: boolean
  notes?: string
}

export interface TaskFeedbackResponse {
  id: string
  taskId: string
  focusLevel: number
  completedWell: boolean
  notes: string | null
  createdAt: Date
}

// ---------------------- GRACE PERIOD ----------------------
export interface GracePeriodTask {
  taskId: string
  taskTitle: string
  endTime: string
  timeSinceEnd: number  // minutes
  timeRemaining: number // minutes until grace period ends
  status: TaskStatus
}

// ---------------------- MISSED TASKS ----------------------
export interface MissedTask extends TimetableTask {
  canCompleteBeforeBedtime: boolean
}

// ---------------------- STATISTICS ----------------------
export interface TimetableStats {
  today: {
    date: string
    day: DayOfWeek
    totalTasks: number
    completedTasks: number
    pendingTasks: number
    inProgressTasks: number
    missedTasks: number
    completionRate: number
    totalHours: number
    completedHours: number
  }
  week: {
    totalTasks: number
    completedTasks: number
    pendingTasks: number
    missedTasks: number
    completionRate: number
    totalHours: number
    completedHours: number
    byDay: Record<DayOfWeek, number>
  }
  productivity: {
    averageFocusScore: number
    onTimeRate: number  // tasks completed on time vs delayed
    rescheduledCount: number
    skippedCount: number
    mostProductiveDay: DayOfWeek | null
    mostProductiveTime: string | null  // e.g., "09:00-11:00"
  }
  bedtime: {
    bedtime: string
    tasksCompletedBeforeBedtime: number
    tasksCompletedAfterBedtime: number
    completionRate: number
  }
}

// ---------------------- BEDTIME ----------------------
export interface BedtimeInfo {
  userId: string
  day: SleepDay
  bedtime: string
  wakeTime: string
  duration: number
  isActive: boolean
}

// ---------------------- TIMETABLE FILTERS ----------------------
export interface TimetableFilterDTO {
  day?: DayOfWeek
  week?: number  // week number
  month?: number // month number
  year?: number  // year
  status?: TaskStatus
  priority?: Priority
  type?: TimeSlotType
  category?: TaskCategory
  goalId?: string
  fixedTimeId?: string
  search?: string
}

// ---------------------- AUTO-REFRESH ----------------------
export interface AutoRefreshConfig {
  enabled: boolean
  interval: number  // seconds
  lastRefreshedAt: Date | null
}

// ---------------------- TIMETABLE SETTINGS ----------------------
export interface TimetableSettings {
  showWeekends: boolean
  compactMode: boolean
  timeRangeStart: number
  timeRangeEnd: number
  autoRefresh: boolean
  playSound: boolean
  showNotifications: boolean
  gracePeriodMinutes: number
}