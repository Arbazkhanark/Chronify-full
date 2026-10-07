// src/app/dashboard/DashboardClient.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthService, type User } from '@/hooks/useAuth'
import { useVerification } from '@/hooks/useVerification'
import { useDashboard } from '@/hooks/useDashboard'
import { useWeeklyActivity } from '@/hooks/useWeeklyActivity'
import { useInsights, type InsightsRange } from '@/hooks/useInsights'
import {
  Target, CheckCircle2, Circle, Clock, Calendar, TrendingUp, Flame, Moon, Sun,
  BookOpen, Briefcase, Dumbbell, Heart, GraduationCap, Palette, Wallet, Users2,
  Settings, Plus, ArrowRight, Coffee, Car, Utensils, Gamepad2, Building2,
  Sparkles, ListChecks, BarChart3, Bed, ChevronRight, ChevronLeft, Loader2,
  ShieldAlert, ShieldCheck, X, RefreshCw, AlertCircle, Zap,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

/* ============================================================================
   TYPES
   ============================================================================ */

type GoalCategory =
  | 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL'
  | 'SKILL_DEVELOPMENT' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE'

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

type TaskStatus =
  | 'PENDING' | 'ONGOING' | 'COMPLETED'
  | 'MISSED' | 'SKIPPED' | 'DELAYED' | 'RESCHEDULED'

type FixedTimeType =
  | 'COLLEGE' | 'OFFICE' | 'SCHOOL' | 'COMMUTE' | 'MEETING'
  | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'FREE' | 'FAMILY'
  | 'HEALTH' | 'OTHER'

/* ============================================================================
   STYLE MAPS
   ============================================================================ */

const GOAL_CATEGORY_META: Record<
  GoalCategory,
  { icon: typeof Target; bg: string; text: string }
> = {
  ACADEMIC: { icon: GraduationCap, bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
  PROFESSIONAL: { icon: Briefcase, bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
  HEALTH: { icon: Heart, bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
  PERSONAL: { icon: Users2, bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
  SKILL_DEVELOPMENT: { icon: Sparkles, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
  FINANCIAL: { icon: Wallet, bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
  SOCIAL: { icon: Users2, bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400' },
  CREATIVE: { icon: Palette, bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
}

const FIXED_TYPE_META: Record<FixedTimeType, { icon: typeof Clock; color: string }> = {
  COLLEGE: { icon: GraduationCap, color: '#EF4444' },
  OFFICE: { icon: Briefcase, color: '#3B82F6' },
  SCHOOL: { icon: BookOpen, color: '#8B5CF6' },
  COMMUTE: { icon: Car, color: '#F59E0B' },
  MEETING: { icon: Users2, color: '#10B981' },
  WORKOUT: { icon: Dumbbell, color: '#EC4899' },
  MEAL: { icon: Utensils, color: '#F97316' },
  ENTERTAINMENT: { icon: Gamepad2, color: '#8B5CF6' },
  FREE: { icon: Coffee, color: '#10B981' },
  FAMILY: { icon: Building2, color: '#F59E0B' },
  HEALTH: { icon: Heart, color: '#EC4899' },
  OTHER: { icon: Clock, color: '#6B7280' },
}

const PRIORITY_BADGE: Record<Priority, string> = {
  LOW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const STATUS_BADGE: Record<TaskStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  ONGOING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  MISSED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  SKIPPED: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
  DELAYED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  RESCHEDULED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const CATEGORY_LABEL: Record<GoalCategory, string> = {
  ACADEMIC: 'Academic',
  PROFESSIONAL: 'Professional',
  HEALTH: 'Health',
  PERSONAL: 'Personal',
  SKILL_DEVELOPMENT: 'Skill Development',
  FINANCIAL: 'Financial',
  SOCIAL: 'Social',
  CREATIVE: 'Creative',
}

const CATEGORY_COLOR: Record<string, string> = {
  ACADEMIC: '#3B82F6',
  PROFESSIONAL: '#8B5CF6',
  HEALTH: '#EC4899',
  PERSONAL: '#10B981',
  LEARNING: '#F59E0B',
  BREAK: '#10B981',
  COMMUTE: '#F97316',
  PROJECT: '#6366F1',
  SLEEP: '#4B5563',
  OTHER: '#6B7280',
}

/* ============================================================================
   HELPERS
   ============================================================================ */

const formatTime = (time: string): string => {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const dh = h % 12 || 12
  return `${dh}:${String(m).padStart(2, '0')} ${period}`
}

const getInitials = (name?: string | null, email?: string | null): string => {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return 'U'
}

/* ============================================================================
   COMPONENT
   ============================================================================ */

export default function DashboardClient() {
  const router = useRouter()

  /* ------------------------------------------------------------------ */
  /* 1. ALL STATE HOOKS — no early returns above this block             */
  /* ------------------------------------------------------------------ */

  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [showVerifyBanner, setShowVerifyBanner] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)
  const [insightsRange, setInsightsRange] = useState<InsightsRange>('8w')

  /* ------------------------------------------------------------------ */
  /* 2. ALL EFFECT HOOKS                                                */
  /* ------------------------------------------------------------------ */

  // Auth
  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        const token = AuthService.getAccessToken()
        if (!token) {
          router.replace('/auth/login')
          return
        }
        const u = await AuthService.getCurrentUser()
        if (!mounted) return
        if (!u) {
          router.replace('/auth/login')
          return
        }
        setUser(u)
      } catch (e) {
        console.error(e)
        if (mounted) router.replace('/auth/login')
      } finally {
        if (mounted) setAuthLoading(false)
      }
    }
    void run()
    return () => {
      mounted = false
    }
  }, [router])

  // Dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])

  /* ------------------------------------------------------------------ */
  /* 3. ALL CUSTOM HOOKS (order matters!)                               */
  /* ------------------------------------------------------------------ */

  const {
    isVerified,
    isSending: isResendingVerification,
    sendVerificationEmail,
  } = useVerification({
    email: user?.email,
    onVerified: () => setUser(p => (p ? { ...p, verified: true } : p)),
  })

  const {
    data: overview,
    loading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useDashboard()

  const {
    data: weekly,
    loading: weeklyLoading,
    error: weeklyError,
    refetch: refetchWeekly,
  } = useWeeklyActivity(weekOffset)

  const {
    data: insights,
    loading: insightsLoading,
    error: insightsError,
    refetch: refetchInsights,
  } = useInsights(insightsRange)

  /* ------------------------------------------------------------------ */
  /* 4. ALL useMemo / useCallback — must run on EVERY render            */
  /*    This is where the bug was: useMemo was below the early returns  */
  /* ------------------------------------------------------------------ */

  // Week label — MUST be called before any `return`
  const weekLabel = useMemo(() => {
    if (!weekly) return ''
    const s = new Date(`${weekly.weekStart}T00:00:00`)
    const e = new Date(`${weekly.weekEnd}T00:00:00`)
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${fmt(s)} – ${fmt(e)}`
  }, [weekly])

  // Combined weekly activity (API vs overview fallback)
  const weeklyActivity = useMemo(() => {
    if (weekly?.days?.length) return weekly.days
    return overview?.weeklyActivity ?? []
  }, [weekly, overview])

  // Combined insights (API vs overview fallback)
  const insightsFinal = useMemo(() => {
    if (insights) {
      return {
        mostProductiveDay: insights.mostProductiveDay,
        mostProductiveTime: insights.mostProductiveTime,
        averageFocusScore: insights.averageFocusScore,
        onTimeRate: insights.onTimeRate,
        peakFocusWindows: insights.peakFocusWindows,
        byCategory: insights.byCategory,
        totalCompletedTasks: insights.totalCompletedTasks,
        totalCompletedHours: insights.totalCompletedHours,
        rangeLabel: insights.rangeLabel,
      }
    }
    return {
      mostProductiveDay: overview?.insights?.mostProductiveDay ?? null,
      mostProductiveTime: overview?.insights?.mostProductiveTime ?? null,
      averageFocusScore: overview?.insights?.averageFocusScore ?? 0,
      onTimeRate: overview?.insights?.onTimeRate ?? 0,
      peakFocusWindows: [] as { label: string; completions: number }[],
      byCategory: [] as { category: string; completions: number; hours: number }[],
      totalCompletedTasks: 0,
      totalCompletedHours: 0,
      rangeLabel: 'Last 8 weeks',
    }
  }, [insights, overview])

  // Derived values (safe with optional chaining)
  const goals = overview?.goals ?? []
  const tasks = overview?.todayTasks ?? []
  const fixedTimes = overview?.fixedTimes ?? []
  const sleepNights = overview?.sleepSchedule ?? []
  const stats = overview?.stats

  const streak = {
    current: stats?.currentStreak ?? 0,
    best: stats?.bestStreak ?? 0,
  }
  const weeklyHours = weekly?.totalHours ?? stats?.weeklyHours ?? 0
  const maxWeeklyHours = Math.max(...weeklyActivity.map(d => d.hours), 1)
  const tasksCompletedToday = stats?.tasksTodayCompleted ?? 0
  const completionRate = stats?.completionRate ?? 0
  const avgSleepHours = stats?.avgSleepHours ?? 0
  const activeGoalsCount = stats?.activeGoals ?? 0

  const displayName = user?.name || user?.email || ''
  const isNewUser = goals.length === 0 && tasks.length === 0
  const greeting = isNewUser ? 'Welcome to Chronify' : 'Welcome back'
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const statCards = [
    { label: 'Active Goals', value: activeGoalsCount, icon: Target, bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
    { label: 'Tasks Today', value: `${tasksCompletedToday}/${tasks.length}`, icon: ListChecks, bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: TrendingUp, bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
    { label: 'Weekly Hours', value: `${weeklyHours.toFixed(1)}h`, icon: Clock, bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Current Streak', value: `${streak.current}d`, icon: Flame, bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
    { label: 'Avg Sleep', value: `${avgSleepHours.toFixed(1)}h`, icon: Moon, bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-300' },
  ]

  /* ------------------------------------------------------------------ */
  /* 5. EVENT HANDLERS                                                  */
  /* ------------------------------------------------------------------ */

  const toggleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
  }

  const handleVerifyEmail = async () => {
    await sendVerificationEmail()
  }

  const handleRefreshAll = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([refetchOverview(), refetchWeekly(), refetchInsights()])
      toast.success('Dashboard refreshed')
    } catch {
      toast.error('Some data could not be refreshed')
    } finally {
      setIsRefreshing(false)
    }
  }

  /* ==================================================================== */
  /* 6. EARLY RETURNS — ALL HOOKS ABOVE THIS POINT, NONE BELOW           */
  /* ==================================================================== */

  if (authLoading || overviewLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Loading your dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (!user) return null

  if (overviewError || !overview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="max-w-md w-full border-red-200 dark:border-red-900/40">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Couldn&apos;t load dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {overviewError || 'Something went wrong. Please try again.'}
            </p>
            <Button onClick={handleRefreshAll} disabled={isRefreshing} className="gap-2">
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  /* ==================================================================== */
  /* 7. MAIN RENDER                                                      */
  /* ==================================================================== */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Verify banner */}
        {!isVerified && showVerifyBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-amber-300/70 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/50 shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-100 flex-1 min-w-0">
              <span className="font-semibold">Your account isn&apos;t verified yet.</span>{' '}
              Verify <span className="hidden sm:inline">{user.email}</span>
              <span className="sm:hidden">your email</span> to unlock messaging,
              connections &amp; full profile visibility.
            </p>
            <Button
              size="sm"
              onClick={handleVerifyEmail}
              disabled={isResendingVerification}
              className="bg-amber-600 hover:bg-amber-700 text-white h-7 px-2.5 text-xs flex-shrink-0"
            >
              {isResendingVerification ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Verify Now</span>
                  <span className="sm:hidden">Verify</span>
                </>
              )}
            </Button>
            <button
              onClick={() => setShowVerifyBanner(false)}
              className="p-1 text-amber-700/70 hover:text-amber-900 dark:text-amber-300/70 dark:hover:text-amber-100 flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              {overview.user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={overview.user.avatarUrl}
                  alt={displayName}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-base md:text-lg font-semibold shadow-sm">
                  {getInitials(user.name, user.email)}
                </div>
              )}
              {!isVerified && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                  <ShieldAlert className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 flex-wrap">
                <span>
                  {greeting}, {displayName}
                </span>
                {isVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                ) : (
                  <Badge
                    variant="outline"
                    className="text-[10px] gap-1 border-amber-300 text-amber-700 dark:border-amber-700/60 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                  >
                    <ShieldAlert className="w-3 h-3" /> Unverified
                  </Badge>
                )}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {today} ·{' '}
                {isNewUser
                  ? "Let's set up your first goal"
                  : "Here's your progress overview"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href="/dashboard/timetable/builder"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Build Timetable</span>
              <span className="sm:hidden">Timetable</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {statCards.map(stat => (
            <Card key={stat.label} className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-4.5 h-4.5 ${stat.text}`} />
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                        Today&apos;s Schedule
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {tasksCompletedToday} of {tasks.length} tasks completed
                      </p>
                    </div>
                    <Link
                      href="/dashboard/timetable"
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      View full timetable <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {tasks.length === 0 ? (
                    <div className="py-8 text-center">
                      <Calendar className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No tasks scheduled for today
                      </p>
                      <Link
                        href="/dashboard/timetable/builder"
                        className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add a task
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tasks.map(task => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                        >
                          {task.status === 'COMPLETED' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                          )}
                          <div
                            className="w-1 h-8 rounded-full flex-shrink-0"
                            style={{ backgroundColor: task.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                task.status === 'COMPLETED'
                                  ? 'text-gray-400 dark:text-gray-500 line-through'
                                  : 'text-gray-900 dark:text-gray-100'
                              }`}
                            >
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(task.startTime)} – {formatTime(task.endTime)}
                              </span>
                              {task.goalTitle && (
                                <span className="text-xs text-gray-400 dark:text-gray-500 truncate hidden sm:inline">
                                  · {task.goalTitle}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge
                              className={`${PRIORITY_BADGE[task.priority]} text-[10px] px-1.5 py-0 hidden sm:inline-flex`}
                            >
                              {task.priority}
                            </Badge>
                            <Badge
                              className={`${STATUS_BADGE[task.status]} text-[10px] px-1.5 py-0`}
                            >
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Goals */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                      Goals &amp; Milestones
                    </h2>
                    <Link
                      href="/dashboard/goals"
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      View all goals <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {goals.length === 0 ? (
                    <div className="py-8 text-center">
                      <Target className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">No goals yet</p>
                      <Link
                        href="/dashboard/goals/new"
                        className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Create your first goal
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {goals.map(goal => {
                        const cat = (goal.category as GoalCategory) || 'PERSONAL'
                        const meta = GOAL_CATEGORY_META[cat] || GOAL_CATEGORY_META.PERSONAL
                        const Icon = meta.icon
                        return (
                          <div
                            key={goal.id}
                            className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}
                                >
                                  <Icon className={`w-4 h-4 ${meta.text}`} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {goal.title}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {CATEGORY_LABEL[cat] || goal.category}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                className={`${PRIORITY_BADGE[goal.priority]} text-[10px] px-1.5 py-0 flex-shrink-0`}
                              >
                                {goal.priority}
                              </Badge>
                            </div>
                            <div className="mb-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {goal.progress}%
                                </span>
                              </div>
                              <Progress value={goal.progress} className="h-1.5" />
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>
                                {goal.completedHours}/{goal.totalHours}h logged
                              </span>
                              <span>
                                {goal.milestonesCompleted}/{goal.milestonesTotal} milestones
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Activity */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                        Weekly Activity
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setWeekOffset(o => o - 1)}
                        disabled={weekOffset <= -52}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[100px] text-center">
                        {weekLabel || `${weeklyHours.toFixed(1)}h total`}
                      </span>
                      <button
                        onClick={() => setWeekOffset(o => o + 1)}
                        disabled={weekOffset >= 52}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                  </div>

                  {weeklyLoading ? (
                    <div className="h-32 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  ) : weeklyError ? (
                    <div className="h-32 flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {weeklyError}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-end justify-between gap-2 h-32">
                        <AnimatePresence mode="wait">
                          {weeklyActivity.map(day => (
                            <motion.div
                              key={`${weekOffset}-${day.dayFull}`}
                              initial={{ opacity: 0, scaleY: 0.5 }}
                              animate={{ opacity: 1, scaleY: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="flex-1 flex flex-col items-center gap-2 origin-bottom"
                            >
                              <div className="w-full flex-1 flex items-end">
                                <div
                                  className="w-full rounded-t-md bg-blue-500 dark:bg-blue-600 transition-all"
                                  style={{
                                    height: `${Math.max(
                                      (day.hours / maxWeeklyHours) * 100,
                                      4
                                    )}%`,
                                  }}
                                  title={`${day.day}: ${day.hours}h · ${day.tasksCompleted} tasks`}
                                />
                              </div>
                              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                {day.day}
                              </span>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {(weekly?.totalHours ?? weeklyHours).toFixed(1)}h total
                        </span>
                        <span>
                          {weekly?.totalTasksCompleted ?? 0} tasks completed
                        </span>
                        {weekly?.bestDay && (
                          <span className="hidden sm:inline">
                            Best: {weekly.bestDay.day} ({weekly.bestDay.hours}h)
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Deep Insights */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                        Deep Insights
                      </h2>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        · {insightsFinal.rangeLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {(['4w', '8w', '12w', 'all'] as InsightsRange[]).map(r => (
                        <button
                          key={r}
                          onClick={() => setInsightsRange(r)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                            insightsRange === r
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {r === 'all' ? 'All' : r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {insightsLoading ? (
                    <div className="py-8 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  ) : insightsError ? (
                    <div className="py-8 flex flex-col items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {insightsError}
                      </p>
                    </div>
                  ) : insightsFinal.totalCompletedTasks === 0 ? (
                    <div className="py-8 text-center">
                      <BarChart3 className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Complete some tasks to unlock insights
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Tasks
                          </div>
                          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {insightsFinal.totalCompletedTasks}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Hours
                          </div>
                          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {insightsFinal.totalCompletedHours}h
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Focus score
                          </div>
                          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {insightsFinal.averageFocusScore}/10
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            On-time
                          </div>
                          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {insightsFinal.onTimeRate}%
                          </div>
                        </div>
                      </div>

                      {insightsFinal.peakFocusWindows.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Peak focus windows
                          </h3>
                          <div className="space-y-2">
                            {insightsFinal.peakFocusWindows.map((w, idx) => {
                              const max =
                                insightsFinal.peakFocusWindows[0].completions || 1
                              const pct = (w.completions / max) * 100
                              return (
                                <div key={idx} className="flex items-center gap-3">
                                  <span className="text-xs text-gray-600 dark:text-gray-400 w-32 flex-shrink-0">
                                    {w.label}
                                  </span>
                                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-10 text-right">
                                    {w.completions}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {insightsFinal.byCategory.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            By category
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {insightsFinal.byCategory.slice(0, 6).map(cat => (
                              <div
                                key={cat.category}
                                className="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800/50"
                              >
                                <div
                                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      CATEGORY_COLOR[cat.category] || '#6B7280',
                                  }}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate capitalize">
                                    {cat.category.toLowerCase().replace('_', ' ')}
                                  </div>
                                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                                    {cat.completions} tasks · {cat.hours}h
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Most productive day
                          </div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {insightsFinal.mostProductiveDay || '—'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Peak window
                          </div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {insightsFinal.mostProductiveTime || '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {!isVerified && (
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-amber-300/70 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-950/30">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                          Verify your account
                        </h3>
                        <p className="text-xs text-amber-800 dark:text-amber-200/90 mt-0.5">
                          Unlock messaging, connections, and full profile visibility.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={handleVerifyEmail}
                        disabled={isResendingVerification}
                        className="bg-amber-600 hover:bg-amber-700 text-white h-8 text-xs flex-1"
                      >
                        {isResendingVerification ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                            Send Verification Email
                          </>
                        )}
                      </Button>
                      <Link
                        href="/profile"
                        className="text-xs font-medium text-amber-800 dark:text-amber-200 hover:underline px-2 flex-shrink-0"
                      >
                        Open Profile
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Streak */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                        Consistency Streak
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Keep the momentum going
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {streak.current} days
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Current streak
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                        {streak.best}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Best streak
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sleep */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                        Sleep Schedule
                      </h2>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Avg {avgSleepHours.toFixed(1)}h
                    </span>
                  </div>
                  {sleepNights.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                      No sleep schedule configured
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {sleepNights.map(night => (
                        <div
                          key={night.dayFull}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-gray-500 dark:text-gray-400 w-9">
                            {night.day}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {formatTime(night.bedtime)} – {formatTime(night.wakeTime)}
                          </span>
                          <span className="text-gray-400 dark:text-gray-500">
                            {(night.duration / 60).toFixed(1)}h
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Fixed times */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                      Fixed Commitments
                    </h2>
                    <Link
                      href="/dashboard/timetable/builder"
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Manage
                    </Link>
                  </div>
                  {fixedTimes.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                      No fixed commitments yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {fixedTimes.map(fixedTime => {
                        const t = (fixedTime.type as FixedTimeType) || 'OTHER'
                        const meta = FIXED_TYPE_META[t] || FIXED_TYPE_META.OTHER
                        const Icon = meta.icon
                        return (
                          <div key={fixedTime.id} className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${meta.color}20` }}
                            >
                              <Icon className="w-4 h-4" style={{ color: meta.color }} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {fixedTime.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {formatTime(fixedTime.startTime)} –{' '}
                                {formatTime(fixedTime.endTime)} ·{' '}
                                {fixedTime.days.join(', ')}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Insights summary */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Productivity Insights
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Most productive day
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {insightsFinal.mostProductiveDay || '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Peak focus window
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {insightsFinal.mostProductiveTime || '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        Avg. focus score
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {insightsFinal.averageFocusScore > 0
                          ? `${insightsFinal.averageFocusScore}/10`
                          : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">
                        On-time completion
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {insightsFinal.onTimeRate > 0
                          ? `${insightsFinal.onTimeRate}%`
                          : '—'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/dashboard/goals/new"
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                    >
                      <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        New Goal
                      </span>
                    </Link>
                    <Link
                      href="/dashboard/timetable/builder"
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                    >
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Timetable
                      </span>
                    </Link>
                    <Link
                      href="/dashboard/tasks"
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                    >
                      <ListChecks className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Tasks
                      </span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                    >
                      <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Settings
                      </span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Onboarding — only for real new users */}
        {isNewUser && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/10">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                      Get started with Chronify
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      A few steps to set up your first week
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      step: 1,
                      title: 'Set a goal',
                      desc: 'Define what you want to achieve this month',
                      href: '/dashboard/goals/new',
                    },
                    {
                      step: 2,
                      title: 'Add fixed commitments',
                      desc: 'College, office hours, gym — mark what is fixed',
                      href: '/dashboard/timetable/builder',
                    },
                    {
                      step: 3,
                      title: 'Build your timetable',
                      desc: 'Fill in free periods with tasks from your goals',
                      href: '/dashboard/timetable/builder',
                    },
                    {
                      step: 4,
                      title: 'Track your progress',
                      desc: 'Come back daily to keep your streak alive',
                      href: '/dashboard',
                    },
                  ].map(item => (
                    <Link
                      key={item.step}
                      href={item.href}
                      className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {item.step}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.desc}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                        Start <ArrowRight className="w-3 h-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}