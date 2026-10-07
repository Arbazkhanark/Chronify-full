// src/modules/dashboard/dashboard.types.ts
export interface DashboardTask {
  id: string
  title: string
  subject?: string
  startTime: string
  endTime: string
  duration: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'MISSED' | 'SKIPPED' | 'DELAYED' | 'RESCHEDULED'
  category: string
  color: string
  goalId?: string
  goalTitle?: string
}

export interface DashboardGoal {
  id: string
  title: string
  category: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED'
  progress: number
  totalHours: number
  completedHours: number
  milestonesTotal: number
  milestonesCompleted: number
  targetDate: string | null
  color: string
}

export interface DashboardFixedTime {
  id: string
  title: string
  type: string
  startTime: string
  endTime: string
  days: string[]  // ["MON", "TUE"]
  color: string
}

export interface DashboardSleepNight {
  day: string       // "MON"
  dayFull: string   // "MONDAY"
  bedtime: string
  wakeTime: string
  duration: number  // minutes
  type: string
}

export interface DashboardWeeklyActivity {
  day: string          // "Mon"
  dayFull: string      // "MONDAY"
  date: string         // "2026-10-06"
  hours: number
  tasksCompleted: number
}

export interface DashboardInsights {
  mostProductiveDay: string | null
  mostProductiveTime: string | null
  averageFocusScore: number
  onTimeRate: number
}

export interface DashboardStats {
  activeGoals: number
  tasksTodayTotal: number
  tasksTodayCompleted: number
  completionRate: number
  weeklyHours: number
  currentStreak: number
  bestStreak: number
  avgSleepHours: number
}

export interface DashboardOverview {
  user: {
    id: string
    name: string
    email: string
    verified: boolean
    avatarUrl: string | null
  }
  date: string
  timezone: string
  stats: DashboardStats
  todayTasks: DashboardTask[]
  goals: DashboardGoal[]
  weeklyActivity: DashboardWeeklyActivity[]
  sleepSchedule: DashboardSleepNight[]
  fixedTimes: DashboardFixedTime[]
  insights: DashboardInsights
}











/* ---------------- Weekly Activity ---------------- */

export interface WeeklyActivityDay {
  day: string       // "Mon"
  dayFull: string   // "MONDAY"
  date: string      // "2026-10-06"
  hours: number
  tasksCompleted: number
}

export interface WeeklyActivityResponse {
  weekStart: string              // "2026-10-06" (Monday)
  weekEnd: string                // "2026-10-12" (Sunday)
  weekOffset: number             // 0 = this week, -1 = last week
  totalHours: number
  totalTasksCompleted: number
  averageHoursPerDay: number
  bestDay: WeeklyActivityDay | null
  days: WeeklyActivityDay[]
}

/* ---------------- Insights ---------------- */

export type InsightsRange = '4w' | '8w' | '12w' | 'all'

export interface PeakFocusWindow {
  startHour: number          // 0-23
  endHour: number            // 0-23
  label: string              // "6:00 PM – 8:00 PM"
  completions: number
}

export interface InsightsDayStat {
  dayFull: string            // "MONDAY"
  day: string                // "Mon"
  completions: number
  hours: number
}

export interface InsightsCategoryStat {
  category: string           // "ACADEMIC"
  completions: number
  hours: number
}

export interface InsightsResponse {
  range: InsightsRange
  rangeLabel: string         // "Last 8 weeks"
  fromDate: string           // "2026-08-15"
  toDate: string             // "2026-10-07"

  totalCompletedTasks: number
  totalCompletedHours: number

  mostProductiveDay: string | null           // "Wednesday"
  mostProductiveTime: string | null          // "6:00 PM – 8:00 PM"
  averageFocusScore: number                  // 0-10
  onTimeRate: number                         // 0-100

  peakFocusWindows: PeakFocusWindow[]        // top 3
  byDay: InsightsDayStat[]                   // sorted Mon..Sun
  byCategory: InsightsCategoryStat[]         // sorted by completions desc
}