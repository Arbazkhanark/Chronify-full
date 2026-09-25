// src/app/dashboard/DashboardClient.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AuthService, type User } from '@/hooks/useAuth'
import {
  Target,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  TrendingUp,
  Flame,
  Moon,
  Sun,
  BookOpen,
  Briefcase,
  Dumbbell,
  Heart,
  GraduationCap,
  Palette,
  Wallet,
  Users2,
  Settings,
  Plus,
  ArrowRight,
  Coffee,
  Car,
  Utensils,
  Gamepad2,
  Building2,
  Sparkles,
  ListChecks,
  BarChart3,
  Bed,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

/* ============================================================================
   TYPES
   These intentionally mirror your Prisma models (Goal, Task, FixedTime,
   SleepSchedule, Streak) so that when the real endpoints exist, swapping the
   DUMMY_* constants below for actual `fetch(...)` calls is close to a
   drop-in replacement — the shapes the UI expects won't need to change.
   ============================================================================ */

type GoalCategory =
  | 'ACADEMIC'
  | 'PROFESSIONAL'
  | 'HEALTH'
  | 'PERSONAL'
  | 'SKILL_DEVELOPMENT'
  | 'FINANCIAL'
  | 'SOCIAL'
  | 'CREATIVE'

type GoalPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED'

interface DashboardGoal {
  id: string
  title: string
  category: GoalCategory
  priority: GoalPriority
  status: GoalStatus
  progress: number
  totalHours: number
  completedHours: number
  milestonesTotal: number
  milestonesCompleted: number
  targetDate: string
  color: string
}

type TaskStatus = 'PENDING' | 'ONGOING' | 'COMPLETED' | 'MISSED' | 'SKIPPED' | 'DELAYED' | 'RESCHEDULED'
type TaskCategory =
  | 'ACADEMIC'
  | 'PROFESSIONAL'
  | 'HEALTH'
  | 'PERSONAL'
  | 'LEARNING'
  | 'BREAK'
  | 'COMMUTE'
  | 'PROJECT'
  | 'SLEEP'
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

interface DashboardTask {
  id: string
  title: string
  subject?: string
  startTime: string
  endTime: string
  priority: Priority
  status: TaskStatus
  category: TaskCategory
  color: string
  goalTitle?: string
}

type FixedTimeType =
  | 'COLLEGE'
  | 'OFFICE'
  | 'SCHOOL'
  | 'COMMUTE'
  | 'MEETING'
  | 'WORKOUT'
  | 'MEAL'
  | 'ENTERTAINMENT'
  | 'FREE'
  | 'FAMILY'
  | 'HEALTH'
  | 'OTHER'

interface DashboardFixedTime {
  id: string
  title: string
  type: FixedTimeType
  startTime: string
  endTime: string
  days: string[]
  color: string
}

type SleepType = 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE'

interface DashboardSleepNight {
  day: string
  bedtime: string
  wakeTime: string
  duration: number
  type: SleepType
}

interface WeeklyActivityDay {
  day: string
  hours: number
  tasksCompleted: number
}

/* ============================================================================
   DUMMY DATA
   TODO: Replace each block below with a real API call once the endpoint is
   ready, e.g.:
     const res = await fetch(`${API_BASE_URL}/goals`, { headers: { Authorization: token } })
     const data = await res.json()
     setGoals(data.data.goals)
   The interfaces above already match the Prisma schema, so this should be a
   straightforward swap.
   ============================================================================ */

const DUMMY_GOALS: DashboardGoal[] = [
  {
    id: 'goal-1',
    title: 'Master Data Structures & Algorithms',
    category: 'ACADEMIC',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    progress: 62,
    totalHours: 120,
    completedHours: 74,
    milestonesTotal: 5,
    milestonesCompleted: 3,
    targetDate: '2026-12-15',
    color: '#3B82F6',
  },
  {
    id: 'goal-2',
    title: 'Ship Side Project MVP',
    category: 'PROFESSIONAL',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    progress: 40,
    totalHours: 80,
    completedHours: 32,
    milestonesTotal: 4,
    milestonesCompleted: 1,
    targetDate: '2026-11-01',
    color: '#8B5CF6',
  },
  {
    id: 'goal-3',
    title: 'Build a Strength Training Habit',
    category: 'HEALTH',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    progress: 75,
    totalHours: 40,
    completedHours: 30,
    milestonesTotal: 3,
    milestonesCompleted: 2,
    targetDate: '2026-10-20',
    color: '#EC4899',
  },
  {
    id: 'goal-4',
    title: 'Conversational Spanish',
    category: 'SKILL_DEVELOPMENT',
    priority: 'LOW',
    status: 'NOT_STARTED',
    progress: 10,
    totalHours: 60,
    completedHours: 6,
    milestonesTotal: 6,
    milestonesCompleted: 0,
    targetDate: '2027-03-01',
    color: '#F59E0B',
  },
]

const DUMMY_TASKS: DashboardTask[] = [
  {
    id: 't1',
    title: 'Deep Work: DSA — Graphs',
    subject: 'DSA',
    startTime: '09:00',
    endTime: '11:00',
    priority: 'HIGH',
    status: 'COMPLETED',
    category: 'ACADEMIC',
    color: '#3B82F6',
    goalTitle: 'Master Data Structures & Algorithms',
  },
  {
    id: 't2',
    title: 'Team Standup',
    subject: 'Work',
    startTime: '11:15',
    endTime: '11:30',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    category: 'PROFESSIONAL',
    color: '#8B5CF6',
  },
  {
    id: 't3',
    title: 'MVP: Auth Flow',
    subject: 'Side Project',
    startTime: '14:00',
    endTime: '16:00',
    priority: 'CRITICAL',
    status: 'ONGOING',
    category: 'PROJECT',
    color: '#8B5CF6',
    goalTitle: 'Ship Side Project MVP',
  },
  {
    id: 't4',
    title: 'Strength Training',
    subject: 'Gym',
    startTime: '18:00',
    endTime: '19:00',
    priority: 'MEDIUM',
    status: 'PENDING',
    category: 'HEALTH',
    color: '#EC4899',
    goalTitle: 'Build a Strength Training Habit',
  },
  {
    id: 't5',
    title: 'Spanish Practice',
    subject: 'Language',
    startTime: '20:00',
    endTime: '20:30',
    priority: 'LOW',
    status: 'PENDING',
    category: 'LEARNING',
    color: '#F59E0B',
  },
]

const DUMMY_FIXED_TIMES: DashboardFixedTime[] = [
  { id: 'f1', title: 'Office Hours', type: 'OFFICE', startTime: '09:00', endTime: '17:00', days: ['MON', 'TUE', 'WED', 'THU', 'FRI'], color: '#3B82F6' },
  { id: 'f2', title: 'Gym Session', type: 'WORKOUT', startTime: '18:00', endTime: '19:00', days: ['MON', 'WED', 'FRI'], color: '#EC4899' },
  { id: 'f3', title: 'Commute', type: 'COMMUTE', startTime: '08:15', endTime: '08:55', days: ['MON', 'TUE', 'WED', 'THU', 'FRI'], color: '#F59E0B' },
]

const DUMMY_SLEEP: DashboardSleepNight[] = [
  { day: 'MON', bedtime: '23:00', wakeTime: '07:00', duration: 480, type: 'REGULAR' },
  { day: 'TUE', bedtime: '23:15', wakeTime: '07:00', duration: 465, type: 'REGULAR' },
  { day: 'WED', bedtime: '23:00', wakeTime: '06:45', duration: 465, type: 'REGULAR' },
  { day: 'THU', bedtime: '23:30', wakeTime: '07:00', duration: 450, type: 'REGULAR' },
  { day: 'FRI', bedtime: '00:00', wakeTime: '07:30', duration: 450, type: 'LATE' },
  { day: 'SAT', bedtime: '00:30', wakeTime: '08:30', duration: 480, type: 'LATE' },
  { day: 'SUN', bedtime: '22:45', wakeTime: '07:15', duration: 510, type: 'REGULAR' },
]

const WEEKLY_ACTIVITY: WeeklyActivityDay[] = [
  { day: 'Mon', hours: 5.5, tasksCompleted: 4 },
  { day: 'Tue', hours: 4.0, tasksCompleted: 3 },
  { day: 'Wed', hours: 6.5, tasksCompleted: 5 },
  { day: 'Thu', hours: 3.5, tasksCompleted: 2 },
  { day: 'Fri', hours: 5.0, tasksCompleted: 4 },
  { day: 'Sat', hours: 2.0, tasksCompleted: 1 },
  { day: 'Sun', hours: 1.5, tasksCompleted: 1 },
]

const DUMMY_STREAK = {
  current: 12,
  best: 34,
}

const DUMMY_INSIGHTS = {
  mostProductiveDay: 'Wednesday',
  mostProductiveTime: '6:00 PM – 8:00 PM',
  averageFocusScore: 7.8,
  onTimeRate: 82,
}

/* ============================================================================
   STYLE / ICON MAPS
   ============================================================================ */

const GOAL_CATEGORY_META: Record<GoalCategory, { icon: typeof Target; bg: string; text: string }> = {
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

/* ============================================================================
   HELPERS
   ============================================================================ */

const formatTime = (time: string): string => {
  const [hoursStr, minutesStr] = time.split(':')
  const hours = Number(hoursStr)
  const minutes = Number(minutesStr)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

const getInitials = (name?: string, email?: string): string => {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return 'U'
}

export default function DashboardClient() {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  // Dummy-data state — swap the setters below for real API responses once
  // the corresponding backend endpoints exist.
  const [goals] = useState<DashboardGoal[]>(DUMMY_GOALS)
  const [tasks] = useState<DashboardTask[]>(DUMMY_TASKS)
  const [fixedTimes] = useState<DashboardFixedTime[]>(DUMMY_FIXED_TIMES)
  const [sleepNights] = useState<DashboardSleepNight[]>(DUMMY_SLEEP)

  useEffect(() => {
    let isMounted = true

    const fetchUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()

        if (!isMounted) return

        if (!currentUser) {
          router.push('/auth/login')
          return
        }

        setUser(currentUser)
      } catch (error: unknown) {
        console.error('Failed to fetch current user:', error)
        if (isMounted) router.push('/auth/login')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void fetchUser()

    return () => {
      isMounted = false
    }
  }, [router])

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])

  const toggleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const displayName = user.name || user.email
  const isNewUser = user.onboardingStep === 4
  const greeting = isNewUser ? 'Welcome to Chronify' : 'Welcome back'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  // Derived stats — computed from the dummy data above. Once real data is
  // wired in, these calculations stay exactly the same.
  const activeGoalsCount = goals.filter(g => g.status === 'IN_PROGRESS').length
  const tasksCompletedToday = tasks.filter(t => t.status === 'COMPLETED').length
  const completionRate = tasks.length > 0 ? Math.round((tasksCompletedToday / tasks.length) * 100) : 0
  const weeklyHours = WEEKLY_ACTIVITY.reduce((sum, d) => sum + d.hours, 0)
  const avgSleepHours = sleepNights.length > 0
    ? sleepNights.reduce((sum, s) => sum + s.duration, 0) / sleepNights.length / 60
    : 0
  const maxWeeklyHours = Math.max(...WEEKLY_ACTIVITY.map(d => d.hours), 1)

  const statCards = [
    { label: 'Active Goals', value: activeGoalsCount, icon: Target, bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
    { label: "Tasks Today", value: `${tasksCompletedToday}/${tasks.length}`, icon: ListChecks, bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: TrendingUp, bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
    { label: 'Weekly Hours', value: `${weeklyHours.toFixed(1)}h`, icon: Clock, bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Current Streak', value: `${DUMMY_STREAK.current}d`, icon: Flame, bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
    { label: 'Avg Sleep', value: `${avgSleepHours.toFixed(1)}h`, icon: Moon, bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-300' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-base md:text-lg font-semibold shadow-sm flex-shrink-0">
              {getInitials(user.name, user.email)}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {greeting}, {displayName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {today} · {isNewUser ? "Let's set up your first goal" : "Here's your progress overview"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {statCards.map(stat => (
            <Card key={stat.label} className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-4.5 h-4.5 ${stat.text}`} />
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100">Today's Schedule</h2>
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
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium truncate ${task.status === 'COMPLETED' ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                              {task.title}
                            </p>
                          </div>
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
                          <Badge className={`${PRIORITY_BADGE[task.priority]} text-[10px] px-1.5 py-0 hidden sm:inline-flex`}>
                            {task.priority}
                          </Badge>
                          <Badge className={`${STATUS_BADGE[task.status]} text-[10px] px-1.5 py-0`}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Goals & Milestones */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">Goals & Milestones</h2>
                    <Link
                      href="/dashboard/goals"
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      View all goals <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {goals.map(goal => {
                      const meta = GOAL_CATEGORY_META[goal.category]
                      const Icon = meta.icon
                      return (
                        <div
                          key={goal.id}
                          className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-4 h-4 ${meta.text}`} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{goal.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{CATEGORY_LABEL[goal.category]}</p>
                              </div>
                            </div>
                            <Badge className={`${PRIORITY_BADGE[goal.priority]} text-[10px] px-1.5 py-0 flex-shrink-0`}>
                              {goal.priority}
                            </Badge>
                          </div>

                          <div className="mb-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-gray-500 dark:text-gray-400">Progress</span>
                              <span className="font-medium text-gray-700 dark:text-gray-300">{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-1.5" />
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{goal.completedHours}/{goal.totalHours}h logged</span>
                            <span>{goal.milestonesCompleted}/{goal.milestonesTotal} milestones</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Activity */}
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Activity</h2>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{weeklyHours.toFixed(1)}h total</span>
                  </div>

                  <div className="flex items-end justify-between gap-2 h-32">
                    {WEEKLY_ACTIVITY.map(day => (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex-1 flex items-end">
                          <div
                            className="w-full rounded-t-md bg-blue-500 dark:bg-blue-600 transition-all"
                            style={{ height: `${Math.max((day.hours / maxWeeklyHours) * 100, 4)}%` }}
                            title={`${day.day}: ${day.hours}h · ${day.tasksCompleted} tasks`}
                          />
                        </div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Streak */}
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100">Consistency Streak</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Keep the momentum going</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{DUMMY_STREAK.current} days</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Current streak</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">{DUMMY_STREAK.best}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Best streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sleep Schedule */}
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <h2 className="font-semibold text-gray-900 dark:text-gray-100">Sleep Schedule</h2>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Avg {avgSleepHours.toFixed(1)}h</span>
                  </div>
                  <div className="space-y-2">
                    {sleepNights.map(night => (
                      <div key={night.day} className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400 w-9">{night.day}</span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {formatTime(night.bedtime)} – {formatTime(night.wakeTime)}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">{(night.duration / 60).toFixed(1)}h</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Fixed Commitments */}
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">Fixed Commitments</h2>
                    <Link href="/dashboard/timetable/builder" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      Manage
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {fixedTimes.map(fixedTime => {
                      const meta = FIXED_TYPE_META[fixedTime.type]
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
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{fixedTime.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(fixedTime.startTime)} – {formatTime(fixedTime.endTime)} · {fixedTime.days.join(', ')}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Productivity Insights */}
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Productivity Insights</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Most productive day</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{DUMMY_INSIGHTS.mostProductiveDay}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Peak focus window</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{DUMMY_INSIGHTS.mostProductiveTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Avg. focus score</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{DUMMY_INSIGHTS.averageFocusScore}/10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">On-time completion</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{DUMMY_INSIGHTS.onTimeRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
              <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                <CardContent className="p-5">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/dashboard/goals/new"
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                    >
                      <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">New Goal</span>
                    </Link>
                    <Link
                      href="/dashboard/timetable/builder"
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                    >
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Timetable</span>
                    </Link>
                    <Link
                      href="/dashboard/tasks"
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                    >
                      <ListChecks className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Tasks</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                    >
                      <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Settings</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Onboarding guide for brand-new users only */}
        {isNewUser && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
            <Card className="border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/10">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">Get started with Chronify</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">A few steps to set up your first week</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { step: 1, title: 'Set a goal', desc: 'Define what you want to achieve this month', href: '/dashboard/goals/new' },
                    { step: 2, title: 'Add fixed commitments', desc: 'College, office hours, gym — mark what is fixed', href: '/dashboard/timetable/builder' },
                    { step: 3, title: 'Build your timetable', desc: 'Fill in free periods with tasks from your goals', href: '/dashboard/timetable/builder' },
                    { step: 4, title: 'Track your progress', desc: 'Come back daily to keep your streak alive', href: '/dashboard' },
                  ].map(item => (
                    <Link
                      key={item.step}
                      href={item.href}
                      className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{item.step}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
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