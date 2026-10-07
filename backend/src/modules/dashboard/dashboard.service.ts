// src/modules/dashboard/dashboard.service.ts
import { DashboardRepository } from "./dashboard.repository"
import {
  DashboardOverview,
  DashboardGoal,
  DashboardTask,
  DashboardWeeklyActivity,
  DashboardSleepNight,
  DashboardFixedTime,
  DashboardInsights,
  DashboardStats,
  WeeklyActivityResponse,
  WeeklyActivityDay,
  InsightsRange,
  InsightsResponse,
  InsightsDayStat,
  InsightsCategoryStat,
  PeakFocusWindow,
} from "./dashboard.types"
import { AppError } from "../../utils/AppError"
import { logger } from "patal-log"

const DAY_ORDER_FULL = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
] as const
type DayFull = typeof DAY_ORDER_FULL[number]

const DAY_SHORT: Record<DayFull, string> = {
  MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed',
  THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
}

const DAY_3LETTER: Record<DayFull, string> = {
  MONDAY: 'MON', TUESDAY: 'TUE', WEDNESDAY: 'WED',
  THURSDAY: 'THU', FRIDAY: 'FRI', SATURDAY: 'SAT', SUNDAY: 'SUN',
}

/* --------------- Time helpers --------------- */

const toMinutes = (t: string): number => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/** Day name (MONDAY..SUNDAY) in user's timezone */
const getDayNameInTz = (date: Date, timezone: string): DayFull => {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
  })
  return fmt.format(date).toUpperCase() as DayFull
}

/** Today's date as YYYY-MM-DD in user's tz */
const getTodayISOInTz = (timezone: string): string => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

/** Monday 00:00 of current week (as UTC instant corresponding to that local time) */
const getWeekStartUtc = (timezone: string): Date => {
  const now = new Date()
  // Get current date parts in user's tz
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    weekday: 'short',
  }).formatToParts(now)

  const get = (type: string) => parts.find(p => p.type === type)?.value || ''
  const year = Number(get('year'))
  const month = Number(get('month'))
  const day = Number(get('day'))
  const weekday = get('weekday') // "Mon" etc.

  const weekdayIdx = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(weekday)

  // Compute Monday of current week in user's tz
  const localMonday = new Date(Date.UTC(year, month - 1, day - weekdayIdx, 0, 0, 0))

  // Find offset between UTC and user tz at that moment
  const offsetMinutes = getTimezoneOffsetMinutes(timezone, localMonday)

  // The UTC instant that equals Monday 00:00 in user tz:
  return new Date(localMonday.getTime() - offsetMinutes * 60_000)
}

/** Offset in minutes for a given tz at a given date (positive = ahead of UTC) */
const getTimezoneOffsetMinutes = (timezone: string, at: Date): number => {
  const utcDate = new Date(at.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate = new Date(at.toLocaleString('en-US', { timeZone: timezone }))
  return (tzDate.getTime() - utcDate.getTime()) / 60_000
}









/* --------------- Main Service --------------- */

export class DashboardService {
  static async getOverview(userId: string): Promise<DashboardOverview> {
    logger.info('Building dashboard overview', {
      functionName: 'DashboardService.getOverview',
      metadata: { userId },
    })

    /* 1. User + Streak */
    const { user, streak } = await DashboardRepository.getUserOverview(userId)
    if (!user) throw new AppError('User not found', 404)

    const timezone = user.timezone || 'Asia/Kolkata'
    const todayISO = getTodayISOInTz(timezone)
    const todayDayName = getDayNameInTz(new Date(), timezone)
    const weekStart = getWeekStartUtc(timezone)
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

    /* 2. Fetch everything in parallel */
    const [goalsRaw, todayTasksRaw, weekTasks, sleepRaw, fixedRaw, insights] =
      await Promise.all([
        DashboardRepository.getUserGoals(userId),
        DashboardRepository.getTodayTasks(userId, todayDayName),
        DashboardRepository.getWeekTasks(userId, weekStart, weekEnd),
        DashboardRepository.getSleepSchedules(userId),
        DashboardRepository.getFixedTimes(userId),
        this.computeInsights(userId, timezone),
      ])

    /* 3. Goals — sort & take top 4 */
    const priorityWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 } as const
    const statusWeight = {
      IN_PROGRESS: 5, NOT_STARTED: 4, DELAYED: 3, COMPLETED: 2, FAILED: 1,
    } as const

    const sortedGoals = [...goalsRaw].sort((a, b) => {
      const sw = (statusWeight[b.status] ?? 0) - (statusWeight[a.status] ?? 0)
      if (sw !== 0) return sw
      return (priorityWeight[b.priority] ?? 0) - (priorityWeight[a.priority] ?? 0)
    })

    const goals: DashboardGoal[] = sortedGoals.slice(0, 4).map(g => {
      const milestonesTotal = g.milestones.length
      const milestonesCompleted = g.milestones.filter(m => m.completed).length
      const completedHours = g.milestones.reduce((s, m) => s + m.completedHours, 0)
      const msProgress = milestonesTotal > 0
        ? (milestonesCompleted / milestonesTotal) * 100
        : 0
      const hrProgress = g.totalHours > 0
        ? (completedHours / g.totalHours) * 100
        : 0
      const progress = Math.min(100, Math.round(msProgress * 0.7 + hrProgress * 0.3))

      return {
        id: g.id,
        title: g.title,
        category: g.category,
        priority: g.priority,
        status: g.status,
        progress,
        totalHours: g.totalHours,
        completedHours: Math.round(completedHours * 10) / 10,
        milestonesTotal,
        milestonesCompleted,
        targetDate: g.targetDate ? g.targetDate.toISOString().slice(0, 10) : null,
        color: g.color,
      }
    })

    const activeGoals = goalsRaw.filter(g => g.status === 'IN_PROGRESS').length

    /* 4. Today's tasks */
    const todayTasks: DashboardTask[] = todayTasksRaw.map(t => ({
      id: t.id,
      title: t.title,
      subject: t.subject || undefined,
      startTime: t.startTime,
      endTime: t.endTime,
      duration: t.duration,
      priority: t.priority,
      status: t.status,
      category: t.category,
      color: t.color,
      goalId: t.goalId || undefined,
      goalTitle: t.goal?.title || undefined,
    }))

    const tasksTodayTotal = todayTasks.length
    const tasksTodayCompleted = todayTasks.filter(t => t.status === 'COMPLETED').length
    const completionRate = tasksTodayTotal > 0
      ? Math.round((tasksTodayCompleted / tasksTodayTotal) * 100)
      : 0

    /* 5. Weekly activity */
    const weeklyBuckets: Record<DayFull, { hours: number; tasksCompleted: number }> = {
      MONDAY: { hours: 0, tasksCompleted: 0 },
      TUESDAY: { hours: 0, tasksCompleted: 0 },
      WEDNESDAY: { hours: 0, tasksCompleted: 0 },
      THURSDAY: { hours: 0, tasksCompleted: 0 },
      FRIDAY: { hours: 0, tasksCompleted: 0 },
      SATURDAY: { hours: 0, tasksCompleted: 0 },
      SUNDAY: { hours: 0, tasksCompleted: 0 },
    }

    weekTasks.forEach(t => {
      const dayUpper = t.day.toUpperCase() as DayFull
      if (weeklyBuckets[dayUpper]) {
        weeklyBuckets[dayUpper].hours += t.duration / 60
        if (t.status === 'COMPLETED') weeklyBuckets[dayUpper].tasksCompleted += 1
      }
    })

    // Compute dates for Mon..Sun of this week
    const weekStartLocal = new Date(weekStart.getTime() + getTimezoneOffsetMinutes(timezone, weekStart) * 60_000)

    const weeklyActivity: DashboardWeeklyActivity[] = DAY_ORDER_FULL.map((d, idx) => {
      const dayDate = new Date(weekStartLocal.getTime() + idx * 24 * 60 * 60 * 1000)
      const isoDate = `${dayDate.getUTCFullYear()}-${String(dayDate.getUTCMonth() + 1).padStart(2, '0')}-${String(dayDate.getUTCDate()).padStart(2, '0')}`
      return {
        day: DAY_SHORT[d],
        dayFull: d,
        date: isoDate,
        hours: Math.round(weeklyBuckets[d].hours * 10) / 10,
        tasksCompleted: weeklyBuckets[d].tasksCompleted,
      }
    })

    const weeklyHours = weeklyActivity.reduce((s, d) => s + d.hours, 0)

    /* 6. Sleep schedule */
    const sleepMap: Record<string, typeof sleepRaw[number]> = {}
    sleepRaw.forEach(s => { sleepMap[s.day] = s })

    const sleepSchedule: DashboardSleepNight[] = DAY_ORDER_FULL
      .filter(d => sleepMap[d])
      .map(d => {
        const s = sleepMap[d]
        return {
          day: DAY_3LETTER[d],
          dayFull: d,
          bedtime: s.bedtime,
          wakeTime: s.wakeTime,
          duration: s.duration,
          type: s.type,
        }
      })

    const avgSleepHours = sleepSchedule.length > 0
      ? sleepSchedule.reduce((s, n) => s + n.duration, 0) / sleepSchedule.length / 60
      : 0

    /* 7. Fixed times */
    const fixedTimes: DashboardFixedTime[] = fixedRaw.map(f => ({
      id: f.id,
      title: f.title,
      type: f.type,
      startTime: f.startTime,
      endTime: f.endTime,
      days: f.days.map(d => {
        const upper = d.toUpperCase() as DayFull
        return DAY_3LETTER[upper] ?? d.slice(0, 3).toUpperCase()
      }),
      color: f.color,
    }))

    /* 8. Stats */
    const stats: DashboardStats = {
      activeGoals,
      tasksTodayTotal,
      tasksTodayCompleted,
      completionRate,
      weeklyHours: Math.round(weeklyHours * 10) / 10,
      currentStreak: streak?.current ?? 0,
      bestStreak: streak?.best ?? 0,
      avgSleepHours: Math.round(avgSleepHours * 10) / 10,
    }

    logger.info('Dashboard overview built', {
      functionName: 'DashboardService.getOverview',
      metadata: { userId, tasksToday: tasksTodayTotal, goals: goals.length },
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        avatarUrl: user.avatarUrl ?? null,
      },
      date: todayISO,
      timezone,
      stats,
      todayTasks,
      goals,
      weeklyActivity,
      sleepSchedule,
      fixedTimes,
      insights,
    }
  }

  /* ============================================================
     INSIGHTS (separate helper — heavier query)
     ============================================================ */
  static async computeInsights(
    userId: string,
    timezone: string
  ): Promise<DashboardInsights> {
    const since = new Date(Date.now() - 56 * 24 * 60 * 60 * 1000) // 8 weeks
    const completed = await DashboardRepository.getRecentCompletedTasks(userId, since)

    if (completed.length === 0) {
      return {
        mostProductiveDay: null,
        mostProductiveTime: null,
        averageFocusScore: 0,
        onTimeRate: 0,
      }
    }

    /* Most productive day */
    const dayCount: Record<string, number> = {}
    completed.forEach(c => {
      const upper = c.day.toUpperCase()
      dayCount[upper] = (dayCount[upper] || 0) + 1
    })
    const topDayUpper = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0][0]
    const mostProductiveDay = topDayUpper.charAt(0) + topDayUpper.slice(1).toLowerCase()

    /* Most productive 2-hour window */
    const hourBuckets: Record<number, number> = {}
    completed.forEach(c => {
      const h = Math.floor(toMinutes(c.startTime) / 60)
      hourBuckets[h] = (hourBuckets[h] || 0) + 1
    })
    let bestStart = 0, bestSum = 0
    for (let h = 0; h < 24; h++) {
      const sum = (hourBuckets[h] || 0) + (hourBuckets[(h + 1) % 24] || 0)
      if (sum > bestSum) { bestSum = sum; bestStart = h }
    }
    const fmtHour = (h: number) => {
      const period = h >= 12 ? 'PM' : 'AM'
      const dh = h % 12 || 12
      return `${dh}:00 ${period}`
    }
    const mostProductiveTime = bestSum > 0
      ? `${fmtHour(bestStart)} – ${fmtHour((bestStart + 2) % 24)}`
      : null

    /* Average focus score (0-10), based on completed task duration */
    const avgDuration = completed.reduce((s, c) => s + c.duration, 0) / completed.length
    const averageFocusScore = Math.min(10, Math.round((avgDuration / 75) * 10 * 10) / 10)

    /* On-time rate: completed on same local day */
    const onTime = completed.filter(c => {
      if (!c.completedAt) return false
      const localDate = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
      }).format(c.completedAt)
      // If you had a scheduledDate field you'd compare; for now assume on-time
      return true
    }).length
    const onTimeRate = completed.length > 0
      ? Math.round((onTime / completed.length) * 100)
      : 0

    return {
      mostProductiveDay,
      mostProductiveTime,
      averageFocusScore,
      onTimeRate,
    }
  }








    /* =========================================================
     NEW: getWeeklyActivity
     ========================================================= */
  static async getWeeklyActivity(
    userId: string,
    weekOffset = 0
  ): Promise<WeeklyActivityResponse> {
    logger.info('Building weekly activity', {
      functionName: 'DashboardService.getWeeklyActivity',
      metadata: { userId, weekOffset },
    })

    const { user } = await DashboardRepository.getUserOverview(userId)
    if (!user) throw new AppError('User not found', 404)

    const timezone = user.timezone || 'Asia/Kolkata'

    // Base = Monday of current week (UTC instant)
    const baseMonday = getWeekStartUtc(timezone)

    // Shift by weekOffset weeks
    const weekStartUtc = new Date(
      baseMonday.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000
    )
    const weekEndUtc = new Date(weekStartUtc.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Fetch tasks
    const tasks = await DashboardRepository.getTasksInRange(
      userId,
      weekStartUtc,
      weekEndUtc
    )

    // Bucket by day
    const buckets: Record<DayFull, { hours: number; tasksCompleted: number }> = {
      MONDAY: { hours: 0, tasksCompleted: 0 },
      TUESDAY: { hours: 0, tasksCompleted: 0 },
      WEDNESDAY: { hours: 0, tasksCompleted: 0 },
      THURSDAY: { hours: 0, tasksCompleted: 0 },
      FRIDAY: { hours: 0, tasksCompleted: 0 },
      SATURDAY: { hours: 0, tasksCompleted: 0 },
      SUNDAY: { hours: 0, tasksCompleted: 0 },
    }

    tasks.forEach(t => {
      const upper = t.day.toUpperCase() as DayFull
      if (!buckets[upper]) return
      buckets[upper].hours += t.duration / 60
      if (t.status === 'COMPLETED') buckets[upper].tasksCompleted += 1
    })

    // Convert UTC week start → local date for labels
    const offsetMs =
      getTimezoneOffsetMinutes(timezone, weekStartUtc) * 60_000
    const weekStartLocal = new Date(weekStartUtc.getTime() + offsetMs)

    const days: WeeklyActivityDay[] = DAY_ORDER_FULL.map((d, idx) => {
      const dayDate = new Date(
        weekStartLocal.getTime() + idx * 24 * 60 * 60 * 1000
      )
      const isoDate = `${dayDate.getUTCFullYear()}-${String(
        dayDate.getUTCMonth() + 1
      ).padStart(2, '0')}-${String(dayDate.getUTCDate()).padStart(2, '0')}`

      return {
        day: DAY_SHORT[d],
        dayFull: d,
        date: isoDate,
        hours: Math.round(buckets[d].hours * 10) / 10,
        tasksCompleted: buckets[d].tasksCompleted,
      }
    })

    const totalHours = days.reduce((s, d) => s + d.hours, 0)
    const totalTasksCompleted = days.reduce((s, d) => s + d.tasksCompleted, 0)
    const averageHoursPerDay = totalHours / 7

    // Best day = most completed tasks, tie-break by hours
    const bestDay =
      [...days].sort(
        (a, b) =>
          b.tasksCompleted - a.tasksCompleted || b.hours - a.hours
      )[0] ?? null

    const isoStart = days[0].date
    const isoEnd = days[6].date

    return {
      weekStart: isoStart,
      weekEnd: isoEnd,
      weekOffset,
      totalHours: Math.round(totalHours * 10) / 10,
      totalTasksCompleted,
      averageHoursPerDay: Math.round(averageHoursPerDay * 10) / 10,
      bestDay: totalHours > 0 ? bestDay : null,
      days,
    }
  }

  /* =========================================================
     NEW: getInsights
     ========================================================= */
  static async getInsights(
    userId: string,
    range: InsightsRange = '8w'
  ): Promise<InsightsResponse> {
    logger.info('Building insights', {
      functionName: 'DashboardService.getInsights',
      metadata: { userId, range },
    })

    const { user } = await DashboardRepository.getUserOverview(userId)
    if (!user) throw new AppError('User not found', 404)

    const timezone = user.timezone || 'Asia/Kolkata'

    // Resolve range → (fromDate, toDate) in UTC
    const now = new Date()
    const toUtc = now

    let fromUtc: Date
    let rangeLabel: string
    switch (range) {
      case '4w':
        fromUtc = new Date(now.getTime() - 28 * 86400000)
        rangeLabel = 'Last 4 weeks'
        break
      case '12w':
        fromUtc = new Date(now.getTime() - 84 * 86400000)
        rangeLabel = 'Last 12 weeks'
        break
      case 'all':
        // Fall back to 1 year for safety
        fromUtc = new Date(now.getTime() - 365 * 86400000)
        rangeLabel = 'Last year'
        break
      case '8w':
      default:
        fromUtc = new Date(now.getTime() - 56 * 86400000)
        rangeLabel = 'Last 8 weeks'
        break
    }

    const completed = await DashboardRepository.getCompletedTasksInRange(
      userId,
      fromUtc,
      toUtc
    )

    // ISO dates for display
    const isoFrom = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(fromUtc)
    const isoTo = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(toUtc)

    const totalCompletedTasks = completed.length
    const totalCompletedHours =
      completed.reduce((s, c) => s + c.duration, 0) / 60

    /* ---------- Empty response ---------- */
    if (completed.length === 0) {
      return {
        range,
        rangeLabel,
        fromDate: isoFrom,
        toDate: isoTo,
        totalCompletedTasks: 0,
        totalCompletedHours: 0,
        mostProductiveDay: null,
        mostProductiveTime: null,
        averageFocusScore: 0,
        onTimeRate: 0,
        peakFocusWindows: [],
        byDay: DAY_ORDER_FULL.map(d => ({
          dayFull: d,
          day: DAY_SHORT[d],
          completions: 0,
          hours: 0,
        })),
        byCategory: [],
      }
    }

    /* ---------- 1. By day ---------- */
    const dayBuckets: Record<DayFull, { completions: number; hours: number }> = {
      MONDAY: { completions: 0, hours: 0 },
      TUESDAY: { completions: 0, hours: 0 },
      WEDNESDAY: { completions: 0, hours: 0 },
      THURSDAY: { completions: 0, hours: 0 },
      FRIDAY: { completions: 0, hours: 0 },
      SATURDAY: { completions: 0, hours: 0 },
      SUNDAY: { completions: 0, hours: 0 },
    }

    completed.forEach(c => {
      const upper = c.day.toUpperCase() as DayFull
      if (!dayBuckets[upper]) return
      dayBuckets[upper].completions += 1
      dayBuckets[upper].hours += c.duration / 60
    })

    const byDay: InsightsDayStat[] = DAY_ORDER_FULL.map(d => ({
      dayFull: d,
      day: DAY_SHORT[d],
      completions: dayBuckets[d].completions,
      hours: Math.round(dayBuckets[d].hours * 10) / 10,
    }))

    const topDay = [...byDay].sort(
      (a, b) => b.completions - a.completions
    )[0]

    const mostProductiveDay =
      topDay && topDay.completions > 0
        ? topDay.dayFull.charAt(0) +
          topDay.dayFull.slice(1).toLowerCase()
        : null

    /* ---------- 2. By category ---------- */
    const categoryBuckets: Record<
      string,
      { completions: number; hours: number }
    > = {}

    completed.forEach(c => {
      const cat = c.category || 'OTHER'
      if (!categoryBuckets[cat]) categoryBuckets[cat] = { completions: 0, hours: 0 }
      categoryBuckets[cat].completions += 1
      categoryBuckets[cat].hours += c.duration / 60
    })

    const byCategory: InsightsCategoryStat[] = Object.entries(categoryBuckets)
      .map(([category, v]) => ({
        category,
        completions: v.completions,
        hours: Math.round(v.hours * 10) / 10,
      }))
      .sort((a, b) => b.completions - a.completions)

    /* ---------- 3. Peak focus windows (2-hour sliding) ---------- */
    const hourBuckets: number[] = Array(24).fill(0)
    completed.forEach(c => {
      const h = Math.floor(toMinutes(c.startTime) / 60)
      hourBuckets[h] += 1
    })

    const fmtHour = (h: number) => {
      const period = h >= 12 ? 'PM' : 'AM'
      const dh = h % 12 || 12
      return `${dh}:00 ${period}`
    }

    const windows: PeakFocusWindow[] = []
    for (let h = 0; h < 24; h++) {
      const next = (h + 2) % 24
      const completions = hourBuckets[h] + hourBuckets[(h + 1) % 24]
      if (completions === 0) continue
      windows.push({
        startHour: h,
        endHour: next,
        label: `${fmtHour(h)} – ${fmtHour(next)}`,
        completions,
      })
    }

    const peakFocusWindows = [...windows]
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 3)

    const mostProductiveTime =
      peakFocusWindows.length > 0 ? peakFocusWindows[0].label : null

    /* ---------- 4. Focus score ---------- */
    // 75 min per task == 10/10. Longer tasks score higher.
    const avgDuration =
      completed.reduce((s, c) => s + c.duration, 0) / completed.length
    const averageFocusScore = Math.min(
      10,
      Math.round((avgDuration / 75) * 10 * 10) / 10
    )

    /* ---------- 5. On-time rate ---------- */
    // A task is "on-time" if completedAt falls on the same local calendar day
    // as its scheduled day (we don't store scheduledDate, so we approximate
    // using weekday match between scheduled "day" and completion weekday).
    let onTime = 0
    completed.forEach(c => {
      if (!c.completedAt) return
      const weekdayName = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'long',
      })
        .format(c.completedAt)
        .toUpperCase()
      if (weekdayName === c.day.toUpperCase()) onTime += 1
    })
    const onTimeRate =
      completed.length > 0 ? Math.round((onTime / completed.length) * 100) : 0

    return {
      range,
      rangeLabel,
      fromDate: isoFrom,
      toDate: isoTo,
      totalCompletedTasks,
      totalCompletedHours: Math.round(totalCompletedHours * 10) / 10,
      mostProductiveDay,
      mostProductiveTime,
      averageFocusScore,
      onTimeRate,
      peakFocusWindows,
      byDay,
      byCategory,
    }
  }








}