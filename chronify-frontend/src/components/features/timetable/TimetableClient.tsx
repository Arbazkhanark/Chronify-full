// src/app/dashboard/timetable/viewer/page.tsx
'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, Reorder } from 'framer-motion'
import {
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Book,
  Briefcase,
  GraduationCap,
  Home,
  Coffee,
  Dumbbell,
  Utensils,
  Heart,
  Gamepad2,
  TrendingUp,
  Users,
  Zap,
  Trash2,
  CalendarDays,
  RefreshCw,
  Settings,
  Bed,
  ArrowRight,
  Download,
  Printer,
  Eye,
  AlarmClock,
  Sunrise,
  Sunset,
  MoonStar,
  Car,
  FileCode,
  FileSpreadsheet,
  LayoutGrid,
  GripVertical,
  RotateCcw,
  MoveVertical,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { format } from 'date-fns'

// Utility function for className merging
const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ')
}

// ==================== Types ====================
interface TimeSlot {
  id: string
  title: string
  subject: string
  startTime: string
  endTime: string
  duration: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  color: string
  isCompleted?: boolean
  day: string
  type: 'task' | 'fixed' | 'break' | 'commute' | 'free' | 'class' | 'study' | 'health' | 'project' | 'meeting' | 'workout' | 'meal' | 'entertainment' | 'sleep' | 'other'
  isFreePeriod?: boolean
  span?: number
  fixedCommitmentId?: string
  freePeriodId?: string
  goalId?: string
  milestoneId?: string
  isSleepTime?: boolean
  sleepScheduleId?: string
  category?: string
  note?: string
  status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
  completedAt?: string
  fixedTimeId?: string | null
  serverId?: string
  description?: string
  gracePeriodEndsAt?: string
}

interface SleepSchedule {
  id: string
  day: string
  bedtime: string
  wakeTime: string
  duration: number
  isActive: boolean
  color: string
  type: 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE'
  notes?: string
}

interface Goal {
  id: string
  title: string
  description?: string
  category: string
  priority: string
  type: string
  status: string
  targetDate?: string
  progress?: number
  totalHours?: number
  completedHours?: number
  color: string
  subject?: string
  milestones?: any[]
}

interface FixedTime {
  id: string
  title: string
  description?: string
  days: string[]
  startTime: string
  endTime: string
  type: 'COLLEGE' | 'OFFICE' | 'SCHOOL' | 'COMMUTE' | 'FREE' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'FAMILY' | 'OTHER' | 'SLEEP'
  color?: string
  isFreePeriod?: boolean
  isEditable?: boolean
  icon?: string
  freePeriods?: {
    id: string
    title: string
    startTime: string
    endTime: string
    duration: number
    day: string
  }[]
  serverId?: string
}

interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
  totalHours: number
  completedHours: number
  completedToday: number
  upcomingTasks: number
  byPriority: Record<string, number>
  byDay: Record<string, number>
  byGoal: Record<string, number>
}

type SectionId = 'sleep' | 'fixed' | 'currentNext' | 'upcoming' | 'tasksByDay' | 'grid'

interface SectionMeta {
  id: SectionId
  title: string
  description: string
  icon: any
}

const ALL_SECTIONS: SectionMeta[] = [
  { id: 'sleep', title: 'Sleep Schedule', description: "Today's sleep card", icon: Bed },
  { id: 'fixed', title: 'Fixed Commitments', description: 'College, gym, office, etc.', icon: Clock },
  { id: 'currentNext', title: 'Current & Next', description: 'Live activity cards', icon: Zap },
  { id: 'upcoming', title: 'Upcoming Tasks', description: 'Day-by-day with Prev/Next', icon: TrendingUp },
  { id: 'tasksByDay', title: 'Tasks by Day', description: 'Weekly tabs', icon: CalendarDays },
  { id: 'grid', title: 'Timetable Grid', description: 'Main weekly timetable', icon: LayoutGrid },
]

const PRESET_LAYOUTS: { id: string; name: string; description: string; order: SectionId[] }[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Sleep → Fixed → Live → Upcoming → By Day → Grid',
    order: ['sleep', 'fixed', 'currentNext', 'upcoming', 'tasksByDay', 'grid'],
  },
  {
    id: 'gridFirst',
    name: 'Grid First',
    description: 'Timetable right at the top',
    order: ['grid', 'currentNext', 'sleep', 'fixed', 'upcoming', 'tasksByDay'],
  },
  {
    id: 'focusFirst',
    name: 'Focus First',
    description: 'Live & upcoming first',
    order: ['currentNext', 'upcoming', 'grid', 'sleep', 'fixed', 'tasksByDay'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Grid & Live only',
    order: ['grid', 'currentNext', 'sleep', 'fixed', 'upcoming', 'tasksByDay'],
  },
]

interface TimeSettings {
  startHour: number
  endHour: number
  interval: number
  cellHeight: number
  showWeekends: boolean
  compactMode: boolean
  extendedHours: {
    morning: boolean
    evening: boolean
    night: boolean
    custom: string[]
  }
  showSleepBlocks: boolean
  autoLockSleep: boolean
  show24Hours: boolean
  sectionOrder: SectionId[]
}

interface FullTimeTableSlot {
  startTime: string
  endTime: string
  type: string
  title: string
  description?: string | null
  fixedTimeId?: string
  freePeriodId?: string
  sleepScheduleId?: string
  taskId?: string
  color?: string
  status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  category?: string
  subject?: string
  duration?: number
  gracePeriodEndsAt?: string
}

interface FullTimeTableResponse {
  day: string
  date?: string
  slots: FullTimeTableSlot[]
}

interface Activity {
  id: string
  kind: 'task' | 'fixed' | 'sleep'
  title: string
  subtitle: string
  color: string
  day: string
  startTime: string
  endTime: string
  duration: number
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
  type: string
  sourceTask?: TimeSlot
  sourceFixed?: FixedTime
}

// ==================== Constants ====================
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8181/v0/api'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
const DAY_DISPLAY: Record<string, string> = {
  MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed',
  THURSDAY: 'Thu', FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
}
const DAY_FULL_DISPLAY: Record<string, string> = {
  MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday',
}

const FIXED_TIME_TYPES = [
  { id: 'COLLEGE', label: 'College/Class', icon: GraduationCap, color: '#EF4444' },
  { id: 'OFFICE', label: 'Office/Work', icon: Briefcase, color: '#3B82F6' },
  { id: 'SCHOOL', label: 'School', icon: Book, color: '#8B5CF6' },
  { id: 'COMMUTE', label: 'Commute', icon: Car, color: '#F59E0B' },
  { id: 'MEETING', label: 'Meeting', icon: Users, color: '#10B981' },
  { id: 'WORKOUT', label: 'Workout/Gym', icon: Dumbbell, color: '#EC4899' },
  { id: 'MEAL', label: 'Meal/Break', icon: Utensils, color: '#F97316' },
  { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Gamepad2, color: '#8B5CF6' },
  { id: 'FREE', label: 'Free Period', icon: Coffee, color: '#10B981' },
  { id: 'FAMILY', label: 'Family Time', icon: Home, color: '#F59E0B' },
  { id: 'HEALTH', label: 'Health/Self-care', icon: Heart, color: '#EC4899' },
  { id: 'SLEEP', label: 'Sleep/Rest', icon: Moon, color: '#4B5563' },
  { id: 'OTHER', label: 'Other', icon: Clock, color: '#6B7280' },
]

const SLEEP_TYPES = [
  { id: 'REGULAR', label: 'Regular Sleep', icon: Moon, color: '#4B5563' },
  { id: 'POWER_NAP', label: 'Power Nap', icon: AlarmClock, color: '#8B5CF6' },
  { id: 'RECOVERY', label: 'Recovery Sleep', icon: Heart, color: '#EC4899' },
  { id: 'EARLY', label: 'Early Bird', icon: Sunrise, color: '#F59E0B' },
  { id: 'LATE', label: 'Night Owl', icon: MoonStar, color: '#3B82F6' },
]

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
}

const CACHE_KEYS = {
  SETTINGS: 'timetable_viewer_settings',
}

const DEFAULT_SECTION_ORDER: SectionId[] = ['sleep', 'fixed', 'currentNext', 'upcoming', 'tasksByDay', 'grid']

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 1 day

// ==================== Helpers ====================
const convertToMinutes = (time: string): number => {
  if (!time) return 0
  const [h, m] = time.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

const calculateDuration = (startTime: string, endTime: string): number => {
  const s = convertToMinutes(startTime)
  const e = convertToMinutes(endTime)
  return e >= s ? e - s : 24 * 60 - s + e
}

const formatTimeDisplay = (time: string): string => {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  if (h === 24) return '12:00 AM'
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${period}`
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

const formatDurationShort = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h${mins}m`
}

const getFixedTimeColor = (type: string): string => {
  const ft = FIXED_TIME_TYPES.find((t) => t.id === type)
  return ft?.color || '#6B7280'
}

const getIconByType = (type: string): React.ReactElement => {
  const fixedTimeType = FIXED_TIME_TYPES.find((t) => t.id === type)
  if (fixedTimeType) {
    const Icon = fixedTimeType.icon
    return <Icon className="w-3 h-3" />
  }
  return <Clock className="w-3 h-3" />
}

const getTimeSlotColor = (type: string): string => {
  switch (type) {
    case 'COLLEGE': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30'
    case 'OFFICE': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30'
    case 'SCHOOL': return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/30'
    case 'COMMUTE': return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/30'
    case 'MEAL': return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30'
    case 'WORKOUT': return 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/30'
    case 'MEETING': return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30'
    case 'FREE': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30'
    case 'SLEEP': return 'bg-gray-100 border-gray-300 dark:bg-gray-800/50 dark:border-gray-700'
    default: return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
  }
}

const snapTimeToSlot = (time: string, interval: number): string => {
  const total = convertToMinutes(time)
  const snapped = Math.floor(total / interval) * interval
  return `${String(Math.floor(snapped / 60)).padStart(2, '0')}:${String(snapped % 60).padStart(2, '0')}`
}

const getUserIdentifier = (): string | null => {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem('access_token')
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length === 3) {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(decodeURIComponent(escape(atob(base64))))
      const id = payload.sub || payload.userId || payload.id || payload.user_id || payload.email
      if (id) return String(id)
    }
  } catch { /* ignore */ }
  let hash = 0
  for (let i = 0; i < token.length; i++) {
    hash = ((hash << 5) - hash) + token.charCodeAt(i)
    hash |= 0
  }
  return `token-${hash}`
}

const getTimetableCacheKey = (): string | null => {
  const id = getUserIdentifier()
  return id ? `chronify_timetable_viewer_${id}` : null
}

// ==================== Download Helpers ====================
const downloadCSV = (data: string[][], filename: string) => {
  const csv = data.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link); link.click(); document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

const downloadJSON = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link); link.click(); document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

const downloadICS = (
  tasks: TimeSlot[], fixedTimes: FixedTime[], sleepSchedules: SleepSchedule[], filename: string
) => {
  const lines: string[] = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Chronify AI//Timetable//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  ]
  const dayMap: Record<string, number> = {
    SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
  }
  const getDate = (day: string): string => {
    const now = new Date()
    let diff = dayMap[day] - now.getDay()
    if (diff < 0) diff += 7
    const d = new Date(now); d.setDate(d.getDate() + diff)
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  }
  const fmt = (t: string) => { const [h, m] = t.split(':').map(Number); return `${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00` }
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  tasks.filter((t) => !t.isSleepTime).forEach((t) => {
    const dt = getDate(t.day)
    lines.push('BEGIN:VEVENT', `UID:${t.id}@chronify.com`, `DTSTAMP:${now}`,
      `DTSTART;TZID=UTC:${dt}T${fmt(t.startTime)}`, `DTEND;TZID=UTC:${dt}T${fmt(t.endTime)}`,
      `SUMMARY:${t.title}`, `DESCRIPTION:${t.description || ''} - ${t.subject}`,
      `CATEGORIES:${t.type.toUpperCase()}`, 'END:VEVENT')
  })
  fixedTimes.forEach((ft) => ft.days.forEach((day) => {
    const dt = getDate(day)
    lines.push('BEGIN:VEVENT', `UID:${ft.id}-${day}@chronify.com`, `DTSTAMP:${now}`,
      `DTSTART;TZID=UTC:${dt}T${fmt(ft.startTime)}`, `DTEND;TZID=UTC:${dt}T${fmt(ft.endTime)}`,
      `SUMMARY:${ft.title}`, `DESCRIPTION:${ft.description || ''}`, `CATEGORIES:FIXED`, 'END:VEVENT')
  }))
  sleepSchedules.filter((s) => s.isActive).forEach((s) => {
    const dt = getDate(s.day)
    lines.push('BEGIN:VEVENT', `UID:sleep-${s.id}@chronify.com`, `DTSTAMP:${now}`,
      `DTSTART;TZID=UTC:${dt}T${fmt(s.bedtime)}`, `DTEND;TZID=UTC:${dt}T${fmt(s.wakeTime)}`,
      `SUMMARY:${s.type} Sleep`, `CATEGORIES:SLEEP`, 'END:VEVENT')
  })
  lines.push('END:VCALENDAR')
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link); link.click(); document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

// ==================== Main Component ====================
export default function TimetableViewerPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [tasks, setTasks] = useState<TimeSlot[]>([])
  const [sleepSchedules, setSleepSchedules] = useState<SleepSchedule[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [fixedTimes, setFixedTimes] = useState<FixedTime[]>([])
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [selectedTask, setSelectedTask] = useState<TimeSlot | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedUpcomingDayIndex, setSelectedUpcomingDayIndex] = useState<number>(() => {
    const jsDay = new Date().getDay()
    return jsDay === 0 ? 6 : jsDay - 1
  })
  const [nowMinutes, setNowMinutes] = useState<number>(() => {
    const n = new Date()
    return n.getHours() * 60 + n.getMinutes()
  })
  const [timeSettings, setTimeSettings] = useState<TimeSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CACHE_KEYS.SETTINGS)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (!Array.isArray(parsed.sectionOrder) || parsed.sectionOrder.length !== ALL_SECTIONS.length) {
            parsed.sectionOrder = DEFAULT_SECTION_ORDER
          } else {
            const ids = new Set(parsed.sectionOrder as SectionId[])
            ALL_SECTIONS.forEach((s) => { if (!ids.has(s.id)) parsed.sectionOrder.push(s.id) })
            parsed.sectionOrder = parsed.sectionOrder.filter((id: SectionId) =>
              ALL_SECTIONS.some((s) => s.id === id)
            )
          }
          if (parsed.timetablePosition === 'top' && !saved.includes('sectionOrder')) {
            parsed.sectionOrder = ['grid', 'sleep', 'fixed', 'currentNext', 'upcoming', 'tasksByDay']
          }
          delete parsed.timetablePosition
          return parsed
        } catch {}
      }
    }
    return {
      startHour: 0, endHour: 24, interval: 60, cellHeight: 60,
      showWeekends: true, compactMode: false,
      extendedHours: { morning: false, evening: false, night: false, custom: [] },
      showSleepBlocks: true, autoLockSleep: true, show24Hours: true,
      sectionOrder: DEFAULT_SECTION_ORDER,
    }
  })
  const [showSettings, setShowSettings] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showDownloadDialog, setShowDownloadDialog] = useState(false)
  const [showArrangeDialog, setShowArrangeDialog] = useState(false)
  const [isCompleting, setIsCompleting] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  // Live clock
  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setNowMinutes(n.getHours() * 60 + n.getMinutes())
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    localStorage.setItem(CACHE_KEYS.SETTINGS, JSON.stringify(timeSettings))
  }, [timeSettings])

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)
    if (isDark) document.documentElement.classList.add('dark')

    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        const parts = token.split('.')
        const payload = JSON.parse(window.atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
        setUserId(payload.userId || payload.sub || payload.email || null)
      } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    const cached = loadFromCache()
    if (cached) {
      setTasks(cached.tasks)
      setFixedTimes(cached.fixedTimes)
      setSleepSchedules(cached.sleepSchedules)
      setStats(cached.stats || null)
      setIsLoading(false)
      setIsInitialLoad(false)

      const age = Date.now() - cached.timestamp
      if (age < CACHE_TTL_MS) {
        console.log('✅ Using cached timetable (age:', Math.round(age / 1000 / 60), 'min)')
        return
      }
      console.log('⏳ Cache stale, refreshing from API...')
      fetchAllData(true)
      return
    }
    fetchAllData(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  useEffect(() => {
    generateTimeSlots()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSettings])

  const loadFromCache = () => {
    if (typeof window === 'undefined') return null
    const key = getTimetableCacheKey()
    if (!key) return null
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (!parsed || !parsed.data) return null
      return { ...parsed.data, timestamp: parsed.timestamp as number }
    } catch {
      return null
    }
  }

  const saveToCache = (
    tasksToSave: TimeSlot[],
    fixedTimesToSave: FixedTime[],
    sleepToSave: SleepSchedule[],
    statsToSave: TaskStats | null
  ) => {
    if (typeof window === 'undefined') return
    const key = getTimetableCacheKey()
    if (!key) return
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          timestamp: Date.now(),
          data: {
            tasks: tasksToSave,
            fixedTimes: fixedTimesToSave,
            sleepSchedules: sleepToSave,
            stats: statsToSave,
          },
        })
      )
    } catch (e) {
      console.error('Failed to save timetable cache', e)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  const getAuthToken = (): string => {
    const token = localStorage.getItem('access_token')
    return token ? `Bearer ${token}` : ''
  }

  const fetchAllData = async (forceRefresh = false): Promise<void> => {
    if (!forceRefresh) {
      const cached = loadFromCache()
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) return
    }
    setRefreshing(true)
    try {
      await Promise.all([
        fetchFullTimeTable(),
        fetchGoals(),
        fetchStats(),
      ])
    } catch (error) {
      console.error('Error fetching data', error)
    } finally {
      setRefreshing(false)
      setIsLoading(false)
      setIsInitialLoad(false)
    }
  }

  const fetchFullTimeTable = async (): Promise<void> => {
    try {
      const token = getAuthToken()
      if (!token) {
        toast.error('Please login to view timetable')
        setIsLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/time-table/full`, {
        headers: { Authorization: token },
      })
      if (!response.ok) throw new Error('Failed to fetch timetable')

      const data = await response.json()
      if (!data.success || !data.data) return

      const apiData: FullTimeTableResponse[] = data.data
      const newTasks: TimeSlot[] = []
      const newFixedTimesMap = new Map<string, FixedTime>()
      const newSleepSchedulesMap = new Map<string, SleepSchedule>()
      const seenTaskIds = new Set<string>()

      apiData.forEach((dayData) => {
        const day = dayData.day

        dayData.slots.forEach((slot) => {
          if (slot.type === 'FIXED' && slot.fixedTimeId) {
            if (!newFixedTimesMap.has(slot.fixedTimeId)) {
              let type: FixedTime['type'] = 'OTHER'
              const t = slot.title.toLowerCase()
              if (t.includes('college') || t.includes('lecture') || t.includes('class')) type = 'COLLEGE'
              else if (t.includes('gym') || t.includes('workout')) type = 'WORKOUT'
              else if (t.includes('office') || t.includes('work')) type = 'OFFICE'
              else if (t.includes('meeting')) type = 'MEETING'
              else if (t.includes('meal') || t.includes('lunch') || t.includes('breakfast') || t.includes('dinner')) type = 'MEAL'
              else if (t.includes('sleep') || t.includes('bed')) type = 'SLEEP'

              newFixedTimesMap.set(slot.fixedTimeId, {
                id: `fixed-${slot.fixedTimeId}`,
                serverId: slot.fixedTimeId,
                title: slot.title,
                description: slot.description || undefined,
                days: [day],
                startTime: slot.startTime,
                endTime: slot.endTime,
                type,
                color: slot.color || getFixedTimeColor(type),
                isEditable: true,
                freePeriods: [],
              })
            } else {
              const existing = newFixedTimesMap.get(slot.fixedTimeId)!
              if (!existing.days.includes(day)) existing.days.push(day)
            }
          }

          if (slot.type === 'FREE' && slot.fixedTimeId && slot.freePeriodId) {
            const ft = newFixedTimesMap.get(slot.fixedTimeId)
            if (ft) {
              if (!ft.freePeriods) ft.freePeriods = []
              if (!ft.freePeriods.find((fp) => fp.id === slot.freePeriodId)) {
                ft.freePeriods.push({
                  id: slot.freePeriodId,
                  title: slot.title,
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  duration: calculateDuration(slot.startTime, slot.endTime),
                  day,
                })
              }
            }
          }

          if (slot.type === 'SLEEP' && slot.sleepScheduleId) {
            if (!newSleepSchedulesMap.has(slot.sleepScheduleId)) {
              let sleepType: SleepSchedule['type'] = 'REGULAR'
              const t = slot.title.toLowerCase()
              if (t.includes('late')) sleepType = 'LATE'
              else if (t.includes('power') || t.includes('nap')) sleepType = 'POWER_NAP'
              else if (t.includes('recovery')) sleepType = 'RECOVERY'
              else if (t.includes('early')) sleepType = 'EARLY'

              newSleepSchedulesMap.set(slot.sleepScheduleId, {
                id: slot.sleepScheduleId,
                day,
                bedtime: slot.startTime,
                wakeTime: slot.endTime,
                duration: slot.duration || calculateDuration(slot.startTime, slot.endTime),
                isActive: true,
                type: sleepType,
                notes: slot.description || undefined,
                color: slot.color || '#4B5563',
              })
            }
          }

          const taskTypes = ['TASK', 'STUDY', 'PROJECT', 'CLASS', 'HEALTH', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT']
          if (taskTypes.includes(slot.type) && slot.taskId) {
            if (seenTaskIds.has(slot.taskId)) return
            seenTaskIds.add(slot.taskId)
            const typeMap: Record<string, TimeSlot['type']> = {
              TASK: 'task', STUDY: 'study', CLASS: 'class', PROJECT: 'project',
              HEALTH: 'health', MEETING: 'meeting', WORKOUT: 'workout',
              MEAL: 'meal', ENTERTAINMENT: 'entertainment',
            }
            newTasks.push({
              id: slot.taskId,
              title: slot.title,
              subject: slot.subject || 'General',
              startTime: slot.startTime,
              endTime: slot.endTime,
              duration: slot.duration || calculateDuration(slot.startTime, slot.endTime),
              priority: (slot.priority as TimeSlot['priority']) || 'MEDIUM',
              color: slot.color || '#3B82F6',
              day,
              type: typeMap[slot.type] || 'task',
              description: slot.description || undefined,
              serverId: slot.taskId,
              status: slot.status || 'PENDING',
              category: slot.category || 'ACADEMIC',
              gracePeriodEndsAt: slot.gracePeriodEndsAt,
            })
          }
        })
      })

      const fixedArr = Array.from(newFixedTimesMap.values())
      const sleepArr = Array.from(newSleepSchedulesMap.values())

      setTasks(newTasks)
      setFixedTimes(fixedArr)
      setSleepSchedules(sleepArr)
      saveToCache(newTasks, fixedArr, sleepArr, stats)
    } catch (error) {
      console.error('Error fetching timetable:', error)
      toast.error('Failed to load timetable data')
    }
  }

  const fetchGoals = async (): Promise<void> => {
    try {
      const token = getAuthToken()
      if (!token) return
      const response = await fetch(`${API_BASE_URL}/goals`, { headers: { Authorization: token } })
      if (!response.ok) return
      const data = await response.json()
      if (data.success && data.data?.goals) setGoals(data.data.goals)
    } catch (error) {
      console.error('Error fetching goals:', error)
    }
  }

  const fetchStats = async (): Promise<void> => {
    try {
      const token = getAuthToken()
      if (!token) return
      const response = await fetch(`${API_BASE_URL}/tasks/stats`, { headers: { Authorization: token } })
      if (!response.ok) return
      const data = await response.json()
      if (data.success && data.data) setStats(data.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleRefreshFromAPI = async () => {
    setRefreshing(true)
    toast.info('Fetching fresh data from server...')
    try {
      await Promise.all([fetchFullTimeTable(), fetchGoals(), fetchStats()])
      toast.success('Timetable refreshed from server')
    } catch {
      toast.error('Failed to refresh')
    } finally {
      setRefreshing(false)
    }
  }

  const fetchTaskById = async (taskId: string) => {
    const existing = tasks.find((t) => t.id === taskId)
    if (existing) {
      setSelectedTask(existing)
      setShowTaskDetails(true)
      return
    }
    try {
      const token = getAuthToken()
      if (!token) return
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: { Authorization: token },
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      if (data.success && data.data) {
        setSelectedTask(data.data)
        setShowTaskDetails(true)
      }
    } catch {
      toast.error('Failed to load task details')
    }
  }

  const markTaskComplete = async (taskId: string) => {
    setIsCompleting(taskId)
    try {
      const token = getAuthToken()
      if (!token) { toast.error('Please login'); return }
      const completedAt = new Date().toISOString()
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedAt }),
      })
      if (!response.ok) throw new Error()
      const data = await response.json()
      if (data.success) {
        toast.success('Task marked as complete!')
        const updated = tasks.map((t) =>
          t.id === taskId ? { ...t, status: 'COMPLETED' as const, isCompleted: true, completedAt } : t
        )
        setTasks(updated)
        saveToCache(updated, fixedTimes, sleepSchedules, stats)
        if (selectedTask?.id === taskId) {
          setSelectedTask({ ...selectedTask, status: 'COMPLETED', isCompleted: true, completedAt })
        }
        fetchStats()
      }
    } catch {
      toast.error('Failed to mark task as complete')
    } finally {
      setIsCompleting(null)
    }
  }

  const handleTaskClick = (taskId?: string) => {
    if (taskId) fetchTaskById(taskId)
  }

  const handleDownloadCSV = () => {
    const rows: string[][] = [
      ['Day', 'Start', 'End', 'Duration', 'Title', 'Subject', 'Type', 'Priority', 'Status', 'Category', 'Description'],
    ]
    tasks
      .filter((t) => !t.isSleepTime)
      .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || convertToMinutes(a.startTime) - convertToMinutes(b.startTime))
      .forEach((task) => {
        rows.push([
          DAY_FULL_DISPLAY[task.day], formatTimeDisplay(task.startTime), formatTimeDisplay(task.endTime),
          formatDuration(task.duration), task.title, task.subject, task.type.toUpperCase(),
          task.priority, task.status || 'PENDING', task.category || '', task.description || '',
        ])
      })
    fixedTimes.forEach((ft) => ft.days.forEach((day) => {
      rows.push([
        DAY_FULL_DISPLAY[day], formatTimeDisplay(ft.startTime), formatTimeDisplay(ft.endTime),
        formatDuration(calculateDuration(ft.startTime, ft.endTime)), ft.title, '',
        'FIXED', '', '', ft.type, ft.description || '',
      ])
    }))
    downloadCSV(rows, `timetable-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    toast.success('CSV downloaded!')
    setShowDownloadDialog(false)
  }

  const handleDownloadJSON = () => {
    downloadJSON(
      { exportedAt: new Date().toISOString(), tasks, fixedTimes, sleepSchedules, stats },
      `timetable-${format(new Date(), 'yyyy-MM-dd')}.json`
    )
    toast.success('JSON downloaded!')
    setShowDownloadDialog(false)
  }

  const handleDownloadICS = () => {
    downloadICS(tasks, fixedTimes, sleepSchedules, `timetable-${format(new Date(), 'yyyy-MM-dd')}.ics`)
    toast.success('ICS downloaded!')
    setShowDownloadDialog(false)
  }

  const handleDownloadPrint = () => {
    const w = window.open('', '_blank')
    if (!w) return
    const html = `
      <!DOCTYPE html><html><head><title>Timetable</title>
      <style>
        body{font-family:Arial;padding:20px;color:#333}
        h1{color:#1f2937;border-bottom:2px solid #3b82f6;padding-bottom:10px}
        h2{color:#374151;margin-top:30px}
        table{width:100%;border-collapse:collapse;margin-top:10px}
        th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px}
        th{background:#f3f4f6}
        tr:nth-child(even){background:#f9fafb}
      </style></head><body>
      <h1>📅 My Timetable</h1>
      <p>Generated on ${format(new Date(), 'EEEE, MMMM d, yyyy h:mm a')}</p>
      <h2>✅ Tasks</h2>
      <table><thead><tr><th>Day</th><th>Time</th><th>Duration</th><th>Title</th><th>Subject</th><th>Priority</th><th>Status</th></tr></thead><tbody>
      ${tasks.filter((t) => !t.isSleepTime).map((t) => `<tr><td>${DAY_FULL_DISPLAY[t.day]}</td><td>${formatTimeDisplay(t.startTime)} - ${formatTimeDisplay(t.endTime)}</td><td>${formatDuration(t.duration)}</td><td>${t.title}</td><td>${t.subject}</td><td>${t.priority}</td><td>${t.status || 'PENDING'}</td></tr>`).join('')}
      </tbody></table>
      <h2>📌 Fixed Commitments</h2>
      <table><thead><tr><th>Days</th><th>Time</th><th>Title</th><th>Type</th></tr></thead><tbody>
      ${fixedTimes.map((ft) => `<tr><td>${ft.days.map((d) => DAY_FULL_DISPLAY[d]).join(', ')}</td><td>${formatTimeDisplay(ft.startTime)} - ${formatTimeDisplay(ft.endTime)}</td><td>${ft.title}</td><td>${ft.type}</td></tr>`).join('')}
      </tbody></table>
      </body></html>`
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 500)
    setShowDownloadDialog(false)
  }

  const generateTimeSlots = (): void => {
    const slots: string[] = []
    let sH = timeSettings.startHour
    let eH = timeSettings.endHour
    if (timeSettings.show24Hours) { sH = 0; eH = 24 }
    if (timeSettings.extendedHours.morning) sH = Math.min(sH, 5)
    if (timeSettings.extendedHours.evening) eH = Math.max(eH, 22)
    if (timeSettings.extendedHours.night) eH = Math.max(eH, 23)
    const total = (eH - sH) * 60
    for (let i = 0; i <= total; i += timeSettings.interval) {
      const h = Math.floor(i / 60) + sH
      const m = i % 60
      if (h < 24) slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
    if (!slots.includes('00:00')) slots.unshift('00:00')
    if (!slots.includes('24:00')) slots.push('24:00')
    setTimeSlots(Array.from(new Set(slots)))
  }

  const isTimeInFixedSlot = (day: string, time: string): FixedTime | null => {
    const t = convertToMinutes(time)
    for (const ft of fixedTimes) {
      if (!ft.days.includes(day)) continue
      const s = convertToMinutes(ft.startTime)
      const e = convertToMinutes(ft.endTime)
      if (e < s) { if (t >= s || t < e) return ft }
      else { if (t >= s && t < e) return ft }
    }
    return null
  }

  const isTimeInFreePeriodRange = (time: string, start: string, end: string): boolean => {
    const t = convertToMinutes(time)
    return t >= convertToMinutes(start) && t < convertToMinutes(end)
  }

  const isTimeInFreePeriod = (day: string, time: string): { fixedTime: FixedTime; freePeriod: any } | null => {
    const ft = isTimeInFixedSlot(day, time)
    if (!ft) return null
    for (const fp of ft.freePeriods || []) {
      if (fp.day === day && isTimeInFreePeriodRange(time, fp.startTime, fp.endTime)) {
        return { fixedTime: ft, freePeriod: fp }
      }
    }
    return null
  }

  const getTasksForCell = (day: string, time: string): TimeSlot[] => {
    return tasks.filter((task) => {
      if (task.day !== day) return false
      const ts = convertToMinutes(task.startTime)
      const te = convertToMinutes(task.endTime)
      const tc = convertToMinutes(time)
      if (te < ts) return tc >= ts || tc < te
      return tc >= ts && tc < te
    })
  }

  const shouldShowTaskInCell = (task: TimeSlot, day: string, time: string): boolean => {
    if (task.day !== day) return false
    return snapTimeToSlot(task.startTime, timeSettings.interval) === time
  }

  const getTaskSpan = (task: TimeSlot): number => {
    const s = convertToMinutes(task.startTime)
    const e = convertToMinutes(task.endTime)
    let dur = e - s
    if (dur < 0) dur += 24 * 60
    const startSnapped = Math.floor(s / timeSettings.interval) * timeSettings.interval
    const endSnapped = Math.ceil((startSnapped + dur) / timeSettings.interval) * timeSettings.interval
    return Math.max(1, Math.ceil((endSnapped - startSnapped) / timeSettings.interval))
  }

  const getNextTimeSlot = (time: string): string => {
    const [h, m] = time.split(':').map(Number)
    const t = h * 60 + m + timeSettings.interval
    return `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
  }

  const isExtendedTime = (time: string): boolean => {
    const [h] = time.split(':').map(Number)
    if (timeSettings.extendedHours.morning && h < 8) return true
    if (timeSettings.extendedHours.evening && h >= 18 && h < 22) return true
    if (timeSettings.extendedHours.night && h >= 22) return true
    if (timeSettings.extendedHours.custom.includes(time)) return true
    return false
  }

  const getSleepStats = () => {
    const active = sleepSchedules.filter((s) => s.isActive)
    const total = active.reduce((sum, s) => sum + s.duration / 60, 0)
    return {
      totalSleepHours: total,
      avgSleepHours: active.length ? total / active.length : 0,
      daysWithSleep: active.length,
    }
  }

  const getSleepTypeInfo = (type: string) => SLEEP_TYPES.find((t) => t.id === type) || SLEEP_TYPES[0]

  const getTodayDayName = (): string => {
    const jsDay = new Date().getDay()
    return ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][jsDay]
  }

  const getFilteredDays = (): string[] =>
    timeSettings.showWeekends ? DAYS : DAYS.slice(0, 5)

  const getCurrentDay = (): string => {
    const map = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    return map[currentDate.getDay()]
  }

  const buildActivitiesForDay = useCallback((day: string): Activity[] => {
    const items: Activity[] = []

    tasks
      .filter((t) => t.day === day && !t.isSleepTime && t.status !== 'COMPLETED')
      .forEach((t) => {
        items.push({
          id: t.id,
          kind: 'task',
          title: t.title,
          subtitle: t.subject,
          color: t.color,
          day: t.day,
          startTime: t.startTime,
          endTime: t.endTime,
          duration: t.duration,
          priority: t.priority,
          status: t.status,
          type: t.type,
          sourceTask: t,
        })
      })

    fixedTimes
      .filter((ft) => ft.days.includes(day))
      .forEach((ft) => {
        items.push({
          id: `fixed-${ft.id}-${day}`,
          kind: 'fixed',
          title: ft.title,
          subtitle: `${ft.type.charAt(0)}${ft.type.slice(1).toLowerCase()}`,
          color: ft.color || '#6B7280',
          day,
          startTime: ft.startTime,
          endTime: ft.endTime,
          duration: calculateDuration(ft.startTime, ft.endTime),
          type: ft.type.toLowerCase(),
          sourceFixed: ft,
        })
      })

    const sleep = sleepSchedules.find((s) => s.day === day && s.isActive)
    if (sleep) {
      items.push({
        id: `sleep-${sleep.id}`,
        kind: 'sleep',
        title: sleep.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
        subtitle: getSleepTypeInfo(sleep.type).label,
        color: sleep.color || '#4B5563',
        day,
        startTime: sleep.bedtime,
        endTime: sleep.wakeTime,
        duration: sleep.duration,
        type: 'sleep',
      })
    }

    return items
  }, [tasks, fixedTimes, sleepSchedules])

  const isActivityRunningAt = (activity: Activity, day: string, minute: number): boolean => {
    if (activity.day !== day) return false
    const s = convertToMinutes(activity.startTime)
    const e = convertToMinutes(activity.endTime)
    if (e < s) return minute >= s || minute < e
    return minute >= s && minute < e
  }

  const getCurrentActivity = useCallback((): { activity: Activity | null; timeRemaining: number; progress: number } => {
    const day = getCurrentDay()
    const activities = buildActivitiesForDay(day)
    const current = activities.find((a) => isActivityRunningAt(a, day, nowMinutes))

    if (!current) return { activity: null, timeRemaining: 0, progress: 0 }

    const s = convertToMinutes(current.startTime)
    const e = convertToMinutes(current.endTime)
    let dur = e - s
    if (dur < 0) dur += 24 * 60
    let elapsed = nowMinutes - s
    if (elapsed < 0) elapsed += 24 * 60
    return {
      activity: current,
      timeRemaining: Math.max(0, dur - elapsed),
      progress: Math.min(100, Math.max(0, (elapsed / dur) * 100)),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildActivitiesForDay, currentDate, nowMinutes])

  const getNextActivity = useCallback((): { activity: Activity | null; timeUntil: number } => {
    const day = getCurrentDay()
    const activities = buildActivitiesForDay(day)
    const upcoming = activities
      .map((a) => ({ a, start: convertToMinutes(a.startTime) }))
      .filter((x) => x.start > nowMinutes)
      .sort((x, y) => x.start - y.start)

    if (upcoming.length === 0) return { activity: null, timeUntil: 0 }
    return { activity: upcoming[0].a, timeUntil: upcoming[0].start - nowMinutes }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildActivitiesForDay, currentDate, nowMinutes])

  const getTasksForDay = useCallback((day: string): TimeSlot[] => {
    return tasks
      .filter((t) => t.day === day && !t.isSleepTime && t.status !== 'COMPLETED')
      .sort((a, b) => convertToMinutes(a.startTime) - convertToMinutes(b.startTime))
  }, [tasks])

  const getFixedForDay = useCallback((day: string): FixedTime[] => {
    return fixedTimes.filter((ft) => ft.days.includes(day))
  }, [fixedTimes])

  const tasksByDay = useMemo(() => {
    const map: Record<string, TimeSlot[]> = {}
    DAYS.forEach((day) => { map[day] = getTasksForDay(day) })
    return map
  }, [getTasksForDay])

  const visibleDays = useMemo(() => getFilteredDays(), [timeSettings.showWeekends])
  const sleepStats = useMemo(() => getSleepStats(), [sleepSchedules])
  const currentActivityInfo = useMemo(() => getCurrentActivity(), [getCurrentActivity])
  const nextActivityInfo = useMemo(() => getNextActivity(), [getNextActivity])

  const todaySleep = useMemo(() => {
    const today = getTodayDayName()
    return sleepSchedules.find((s) => s.day === today && s.isActive)
  }, [sleepSchedules])

  const todayDayName = getTodayDayName()
  const currentActivityId = currentActivityInfo.activity?.id || null

  const selectedUpcomingDay = DAYS[selectedUpcomingDayIndex] || DAYS[0]
  const selectedUpcomingTasks = useMemo(
    () => getTasksForDay(selectedUpcomingDay),
    [getTasksForDay, selectedUpcomingDay]
  )
  const selectedUpcomingFixed = useMemo(
    () => getFixedForDay(selectedUpcomingDay),
    [getFixedForDay, selectedUpcomingDay]
  )

  const getUpcomingDayLabel = (): string => {
    const todayIdx = DAYS.indexOf(todayDayName)
    const diff = (selectedUpcomingDayIndex - todayIdx + 7) % 7
    const fullDay = DAY_FULL_DISPLAY[selectedUpcomingDay]
    if (diff === 0) return `Today (${fullDay})`
    if (diff === 1) return `Tomorrow (${fullDay})`
    return fullDay
  }

  const goPrevDay = () => setSelectedUpcomingDayIndex((i) => (i - 1 + 7) % 7)
  const goNextDay = () => setSelectedUpcomingDayIndex((i) => (i + 1) % 7)
  const goToday = () => {
    const todayIdx = DAYS.indexOf(todayDayName)
    setSelectedUpcomingDayIndex(todayIdx)
  }

  const currentClockLabel = useMemo(() => {
    const h = Math.floor(nowMinutes / 60)
    const m = nowMinutes % 60
    return formatTimeDisplay(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }, [nowMinutes])

  const handleReorder = (newOrder: SectionId[]) => {
    setTimeSettings((prev) => ({ ...prev, sectionOrder: newOrder }))
  }

  const applyPreset = (order: SectionId[], name: string) => {
    setTimeSettings((prev) => ({ ...prev, sectionOrder: [...order] }))
    toast.success(`Applied "${name}" layout`)
  }

  const resetLayout = () => {
    setTimeSettings((prev) => ({ ...prev, sectionOrder: [...DEFAULT_SECTION_ORDER] }))
    toast.success('Layout reset to default')
  }

  const getSectionMeta = (id: SectionId): SectionMeta => {
    return ALL_SECTIONS.find((s) => s.id === id) || ALL_SECTIONS[0]
  }

  const renderSleepSection = () => {
    if (!timeSettings.showSleepBlocks || !todaySleep) return null
    return (
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Bed className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Sleep Schedule — Today</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {DAY_FULL_DISPLAY[todaySleep.day]} •{' '}
                  {formatTimeDisplay(todaySleep.bedtime)} → {formatTimeDisplay(todaySleep.wakeTime)} •{' '}
                  {formatDuration(todaySleep.duration)} ({getSleepTypeInfo(todaySleep.type).label})
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Today's Sleep Duration</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {Math.floor(todaySleep.duration / 60)}h {todaySleep.duration % 60}m
              </div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Regular Sleep (weekly avg)</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {sleepStats.avgSleepHours.toFixed(1)}h
              </div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Days Scheduled</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {sleepStats.daysWithSleep} / 7
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderFixedSection = () => (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Fixed Commitments</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your regular commitments (college, office, gym, etc.)
            </p>
          </div>
          <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
            {fixedTimes.length} commitments
          </Badge>
        </div>
        {fixedTimes.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">No Fixed Commitments</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You don't have any fixed commitments added.
            </p>
            <Button onClick={() => (window.location.href = '/dashboard/timetable/builder')}>
              Go to Builder
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fixedTimes.map((ft, i) => {
              const isRunning = isActivityRunningAt(
                {
                  id: `fixed-${ft.id}-${todayDayName}`,
                  kind: 'fixed', title: ft.title, subtitle: '',
                  color: ft.color || '#6B7280', day: todayDayName,
                  startTime: ft.startTime, endTime: ft.endTime,
                  duration: calculateDuration(ft.startTime, ft.endTime),
                  type: ft.type.toLowerCase(),
                },
                todayDayName, nowMinutes
              )
              return (
                <motion.div
                  key={ft.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    `p-3 rounded-lg border ${getTimeSlotColor(ft.type)}`,
                    isRunning && 'ring-2 ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 shadow-lg'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${ft.color}20` }}>
                      {getIconByType(ft.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-medium dark:text-gray-200">{ft.title}</div>
                        {isRunning && (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50 text-[10px] px-1.5 py-0">
                            <span className="relative flex h-1.5 w-1.5 mr-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                            </span>
                            LIVE
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {ft.days.map((d) => d.charAt(0) + d.slice(1).toLowerCase()).join(', ')} •{' '}
                        {formatTimeDisplay(ft.startTime)} - {formatTimeDisplay(ft.endTime)}
                      </div>
                      {ft.freePeriods && ft.freePeriods.length > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30 text-xs"
                        >
                          <Coffee className="w-2.5 h-2.5 mr-1" />
                          {ft.freePeriods.length} free period{ft.freePeriods.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderCurrentNextSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className={cn(
        'dark:bg-gray-800 dark:border-gray-700',
        currentActivityInfo.activity && 'ring-2 ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded">
              <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            Current
            {currentActivityInfo.activity && (
              <Badge className="ml-auto bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50 text-[10px] px-1.5 py-0">
                <span className="relative flex h-1.5 w-1.5 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
                LIVE
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentActivityInfo.activity ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${currentActivityInfo.activity.color}20` }}
                >
                  {currentActivityInfo.activity.kind === 'fixed' ? (
                    <Clock className="w-4 h-4" />
                  ) : currentActivityInfo.activity.kind === 'sleep' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Book className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {currentActivityInfo.activity.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentActivityInfo.activity.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {currentActivityInfo.activity.priority && (
                      <Badge className={PRIORITY_COLORS[currentActivityInfo.activity.priority]}>
                        {currentActivityInfo.activity.priority}
                      </Badge>
                    )}
                    <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-400 capitalize">
                      {currentActivityInfo.activity.kind}
                    </Badge>
                    <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-400">
                      {formatTimeDisplay(currentActivityInfo.activity.startTime)} -{' '}
                      {formatTimeDisplay(currentActivityInfo.activity.endTime)}
                    </Badge>
                  </div>
                </div>
              </div>
              <Progress value={currentActivityInfo.progress} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                <span className="font-medium">{formatDuration(currentActivityInfo.timeRemaining)}</span>
              </div>
              {currentActivityInfo.activity.kind === 'task' && currentActivityInfo.activity.sourceTask && (
                <Button
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => markTaskComplete(currentActivityInfo.activity!.sourceTask!.id)}
                  disabled={isCompleting === currentActivityInfo.activity.sourceTask.id}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Complete
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">No Current Task</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
              <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nextActivityInfo.activity ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${nextActivityInfo.activity.color}20` }}
                >
                  {nextActivityInfo.activity.kind === 'fixed' ? (
                    <Clock className="w-4 h-4" />
                  ) : nextActivityInfo.activity.kind === 'sleep' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Book className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {nextActivityInfo.activity.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {nextActivityInfo.activity.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {nextActivityInfo.activity.priority && (
                      <Badge className={PRIORITY_COLORS[nextActivityInfo.activity.priority]}>
                        {nextActivityInfo.activity.priority}
                      </Badge>
                    )}
                    <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-400 capitalize">
                      {nextActivityInfo.activity.kind}
                    </Badge>
                    <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-400">
                      {formatTimeDisplay(nextActivityInfo.activity.startTime)} -{' '}
                      {formatTimeDisplay(nextActivityInfo.activity.endTime)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Starts in</span>
                <span className="font-medium">{formatDuration(nextActivityInfo.timeUntil)}</span>
              </div>
              {nextActivityInfo.activity.kind === 'task' && nextActivityInfo.activity.sourceTask && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={() => handleTaskClick(nextActivityInfo.activity!.sourceTask!.id)}
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">No Next Task</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderUpcomingSection = () => (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded">
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            {getUpcomingDayLabel()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goPrevDay}
              className="h-8 px-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToday}
              className="h-8 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goNextDay}
              className="h-8 px-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedUpcomingTasks.length === 0 && selectedUpcomingFixed.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">
              No tasks or commitments for {DAY_FULL_DISPLAY[selectedUpcomingDay]}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedUpcomingFixed.map((ft) => {
              const activityId = `fixed-${ft.id}-${selectedUpcomingDay}`
              const isLive = selectedUpcomingDay === todayDayName && currentActivityId === activityId
              return (
                <motion.div
                  key={`fixed-${ft.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-all',
                    isLive
                      ? 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-400/50'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${ft.color}20` }}
                  >
                    {getIconByType(ft.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{ft.title}</h4>
                      <Badge variant="outline" className="text-[10px] px-1 py-0 dark:border-gray-700 dark:text-gray-400 capitalize">
                        {ft.type.toLowerCase()}
                      </Badge>
                      {isLive && (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50 text-[10px] px-1.5 py-0">
                          <span className="relative flex h-1.5 w-1.5 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                          </span>
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTimeDisplay(ft.startTime)} - {formatTimeDisplay(ft.endTime)} •{' '}
                      {formatDuration(calculateDuration(ft.startTime, ft.endTime))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
            {selectedUpcomingTasks.map((task, i) => {
              const isLive = selectedUpcomingDay === todayDayName && currentActivityId === task.id
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                    isLive
                      ? 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-400/50'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  )}
                  onClick={() => handleTaskClick(task.id)}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${task.color}20` }}
                  >
                    <Book className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{task.title}</h4>
                      <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
                      {isLive && (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50 text-[10px] px-1.5 py-0">
                          <span className="relative flex h-1.5 w-1.5 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                          </span>
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)} •{' '}
                      {formatDuration(task.duration)}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderTasksByDaySection = () => (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded">
            <CalendarDays className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          </div>
          Tasks by Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={getCurrentDay()} className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto mb-4 dark:bg-gray-800 dark:border-gray-700">
            {visibleDays.map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="flex-1 dark:data-[state=active]:bg-gray-700 dark:text-gray-300"
              >
                {DAY_DISPLAY[day]}
              </TabsTrigger>
            ))}
          </TabsList>
          {visibleDays.map((day) => (
            <TabsContent key={day} value={day} className="mt-0">
              {tasksByDay[day]?.length > 0 ? (
                <div className="space-y-3">
                  {tasksByDay[day].map((task, i) => {
                    const isLive = day === todayDayName && currentActivityId === task.id
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                          isLive
                            ? 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-400/50'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        )}
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${task.color}20` }}
                        >
                          <Book className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{task.title}</h4>
                            <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
                            {isLive && (
                              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50 text-[10px] px-1.5 py-0">
                                <span className="relative flex h-1.5 w-1.5 mr-1">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                </span>
                                LIVE
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)} • {task.subject}
                          </div>
                        </div>
                        {task.status === 'COMPLETED' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              markTaskComplete(task.id)
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-gray-400 hover:text-green-500" />
                          </Button>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No tasks for {DAY_FULL_DISPLAY[day]}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )

  const renderGridSection = () => {
    if (
      tasks.length === 0 &&
      fixedTimes.length === 0 &&
      sleepSchedules.length === 0
    ) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
            No Timetable Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            You don't have any scheduled items yet.
          </p>
          <Button
            onClick={() =>
              (window.location.href = '/dashboard/timetable/builder')
            }
          >
            Go to Builder
          </Button>
        </div>
      )
    }

    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <CardContent className="p-0">
          {/* 🔥 MOBILE: Day-by-day timeline view */}
          <div className="md:hidden">
            <DayTimelineView
              visibleDays={visibleDays}
              tasks={tasks}
              fixedTimes={fixedTimes}
              sleepSchedules={sleepSchedules}
              todayDayName={todayDayName}
              nowMinutes={nowMinutes}
              timeSettings={timeSettings}
              onTaskClick={handleTaskClick}
              onComplete={markTaskComplete}
              isCompleting={isCompleting}
              formatTimeDisplay={formatTimeDisplay}
              formatDuration={formatDuration}
              getIconByType={getIconByType}
              getTimeSlotColor={getTimeSlotColor}
              getSleepTypeInfo={getSleepTypeInfo}
              cn={cn}
            />
          </div>

          {/* 💻 DESKTOP: Existing horizontal grid (unchanged) */}
          <div className="hidden md:block">
            <HorizontalTimetable
              timeSlots={timeSlots}
              visibleDays={visibleDays}
              tasks={tasks}
              fixedTimes={fixedTimes}
              timeSettings={timeSettings}
              getTasksForCell={getTasksForCell}
              getTaskSpan={getTaskSpan}
              shouldShowTaskInCell={shouldShowTaskInCell}
              isTimeInFixedSlot={isTimeInFixedSlot}
              isTimeInFreePeriod={isTimeInFreePeriod}
              getTimeSlotColor={getTimeSlotColor}
              getIconByType={getIconByType}
              formatDurationShort={formatDurationShort}
              onTaskClick={handleTaskClick}
              onComplete={markTaskComplete}
              isCompleting={isCompleting}
              isExtendedTime={isExtendedTime}
              getNextTimeSlot={getNextTimeSlot}
              cn={cn}
              todayDayName={todayDayName}
              nowMinutes={nowMinutes}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  const SECTION_RENDERERS: Record<SectionId, () => React.ReactNode> = {
    sleep: renderSleepSection,
    fixed: renderFixedSection,
    currentNext: renderCurrentNextSection,
    upcoming: renderUpcomingSection,
    tasksByDay: renderTasksByDaySection,
    grid: renderGridSection,
  }

  if (isLoading && isInitialLoad) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Loading Your Timetable
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your schedule...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Timetable Viewer</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(currentDate, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
              <div className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-xs font-semibold text-red-700 dark:text-red-300">
                  {currentClockLabel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => setShowArrangeDialog(true)}
                className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                title="Rearrange sections"
              >
                <MoveVertical className="w-4 h-4" />
                <span className="hidden sm:inline">Arrange</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className="h-9 w-9 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefreshFromAPI}
                disabled={refreshing}
                title="Fetch fresh data from server"
                className="h-9 w-9 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDownloadDialog(true)}
                className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowStats(!showStats)}
                className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Statistics</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettings(true)}
                className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {showStats && stats && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Task Statistics</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowStats(false)} className="h-8 w-8 p-0">
                    ×
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {timeSettings.sectionOrder.map((sectionId) => {
          const content = SECTION_RENDERERS[sectionId]?.()
          if (!content) return null
          return (
            <div key={sectionId}>
              {content}
            </div>
          )
        })}
      </main>

      {/* ============ Arrange Sections Dialog ============ */}
      <Dialog open={showArrangeDialog} onOpenChange={setShowArrangeDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="flex-shrink-0 p-6 pb-2">
            <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
              <MoveVertical className="w-5 h-5" />
              Arrange Sections
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Drag the rows below to reorder how your sections appear on the page.
              Your layout is saved automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-3 flex-shrink-0">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Quick Presets
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_LAYOUTS.map((preset) => {
                const isActive = JSON.stringify(preset.order) === JSON.stringify(timeSettings.sectionOrder)
                return (
                  <Button
                    key={preset.id}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => applyPreset(preset.order, preset.name)}
                    className={cn(
                      'justify-start h-auto py-2.5 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700',
                      isActive && 'ring-2 ring-blue-500'
                    )}
                  >
                    <div className="text-left">
                      <div className="text-xs font-semibold flex items-center gap-1">
                        {isActive && <Check className="w-3 h-3" />}
                        {preset.name}
                      </div>
                      <div className="text-[10px] opacity-70 leading-tight mt-0.5">
                        {preset.description}
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          <Separator className="dark:bg-gray-700" />

          <div className="px-6 pt-3 flex-shrink-0">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Custom Order (drag to reorder)
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-2 min-h-0" style={{ maxHeight: '45vh' }}>
            <Reorder.Group
              axis="y"
              values={timeSettings.sectionOrder}
              onReorder={handleReorder}
              className="space-y-2"
            >
              {timeSettings.sectionOrder.map((id) => {
                const meta = getSectionMeta(id)
                const Icon = meta.icon
                return (
                  <Reorder.Item
                    key={id}
                    value={id}
                    className="cursor-grab active:cursor-grabbing touch-none select-none"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {meta.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {meta.description}
                        </div>
                      </div>
                    </div>
                  </Reorder.Item>
                )
              })}
            </Reorder.Group>
          </div>

          <DialogFooter className="flex-shrink-0 p-6 pt-3 border-t border-gray-200 dark:border-gray-700 gap-2">
            <Button
              variant="outline"
              onClick={resetLayout}
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </Button>
            <Button onClick={() => setShowArrangeDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Details Dialog */}
      <Dialog open={showTaskDetails} onOpenChange={setShowTaskDetails}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Task Details</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              View detailed information about this task
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 py-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {selectedTask.title}
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={PRIORITY_COLORS[selectedTask.priority]}>{selectedTask.priority}</Badge>
                    <Badge className={STATUS_COLORS[selectedTask.status || 'PENDING']}>
                      {selectedTask.status || 'PENDING'}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Day</div>
                    <div className="font-medium dark:text-gray-100">{DAY_FULL_DISPLAY[selectedTask.day]}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Time</div>
                    <div className="font-medium dark:text-gray-100">
                      {formatTimeDisplay(selectedTask.startTime)} - {formatTimeDisplay(selectedTask.endTime)}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                    <div className="font-medium dark:text-gray-100">{formatDuration(selectedTask.duration)}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Subject</div>
                    <div className="font-medium dark:text-gray-100">{selectedTask.subject}</div>
                  </div>
                </div>
                {selectedTask.description && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Description</div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedTask.description}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {selectedTask && selectedTask.status !== 'COMPLETED' && (
              <Button
                onClick={() => {
                  markTaskComplete(selectedTask.id)
                  setShowTaskDetails(false)
                }}
                disabled={isCompleting === selectedTask.id}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowTaskDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Timetable
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">Choose a format to export</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 py-4">
            <Button
              variant="outline"
              className="justify-start gap-3 h-auto py-4 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={handleDownloadCSV}
            >
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <div className="font-medium">CSV / Excel</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Open in Excel / Sheets</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-3 h-auto py-4 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={handleDownloadICS}
            >
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-medium">ICS Calendar</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Import into Google / Apple / Outlook
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-3 h-auto py-4 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={handleDownloadJSON}
            >
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FileCode className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <div className="font-medium">JSON Data</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Raw data / backup</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-3 h-auto py-4 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={handleDownloadPrint}
            >
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Printer className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-left">
                <div className="font-medium">Print / PDF</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Print or save as PDF</div>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDownloadDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Timetable Settings</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Customize how your timetable looks
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-200 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                Section Order
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Rearrange sections to match your workflow. Use the <strong>Arrange</strong> button in the header to drag & drop.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSettings(false)
                    setShowArrangeDialog(true)
                  }}
                  className="flex-1 gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <MoveVertical className="w-4 h-4" />
                  Open Layout Editor
                </Button>
                <Button
                  variant="outline"
                  onClick={resetLayout}
                  className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  title="Reset to default order"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator className="dark:bg-gray-700" />

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-200">Display Options</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium dark:text-gray-300">Show Weekends</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Include Sat & Sun</div>
                </div>
                <Switch
                  checked={timeSettings.showWeekends}
                  onCheckedChange={(c) => setTimeSettings({ ...timeSettings, showWeekends: c })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium dark:text-gray-300">24-Hour View</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Show all 24 hours</div>
                </div>
                <Switch
                  checked={timeSettings.show24Hours}
                  onCheckedChange={(c) => setTimeSettings({ ...timeSettings, show24Hours: c })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium dark:text-gray-300">Show Sleep Blocks</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Display sleep in grid</div>
                </div>
                <Switch
                  checked={timeSettings.showSleepBlocks}
                  onCheckedChange={(c) => setTimeSettings({ ...timeSettings, showSleepBlocks: c })}
                />
              </div>
            </div>
            <Separator className="dark:bg-gray-700" />
            <div>
              <Label className="text-sm dark:text-gray-300">Time Interval</Label>
              <Select
                value={timeSettings.interval.toString()}
                onValueChange={(v) => setTimeSettings({ ...timeSettings, interval: parseInt(v) })}
              >
                <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm dark:text-gray-300">Cell Height</Label>
              <Select
                value={timeSettings.cellHeight.toString()}
                onValueChange={(v) => setTimeSettings({ ...timeSettings, cellHeight: parseInt(v) })}
              >
                <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="40">Compact (40px)</SelectItem>
                  <SelectItem value="60">Normal (60px)</SelectItem>
                  <SelectItem value="80">Comfortable (80px)</SelectItem>
                  <SelectItem value="100">Spacious (100px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ==================== Horizontal Grid (DESKTOP) ====================
function HorizontalTimetable({
  timeSlots, visibleDays, timeSettings,
  getTasksForCell, getTaskSpan, shouldShowTaskInCell,
  isTimeInFixedSlot, isTimeInFreePeriod,
  getTimeSlotColor, getIconByType, formatDurationShort,
  onTaskClick, onComplete, isCompleting, isExtendedTime, getNextTimeSlot, cn,
  todayDayName, nowMinutes,
}: any) {
  const cellWidth = 140
  const fmt = (time: string) => {
    const [h, m] = time.split(':').map(Number)
    if (h === 24) return '12:00 AM'
    const p = h >= 12 ? 'PM' : 'AM'
    return `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${p}`
  }

  const nowSlotIndex = timeSlots.findIndex((time: string, i: number) => {
    if (time === '24:00') return false
    const start = convertToMinutes(time)
    const end = i + 1 < timeSlots.length ? convertToMinutes(timeSlots[i + 1]) : start + timeSettings.interval
    return nowMinutes >= start && nowMinutes < end
  })

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
          <div className="flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4" style={{ width: cellWidth }}>
            <div className="font-bold text-gray-900 dark:text-gray-100">Day / Time</div>
          </div>
          {timeSlots.map((time: string, index: number) => {
            const isNowHeader = index === nowSlotIndex
            return (
              <div
                key={time}
                className={cn(
                  'flex-shrink-0 p-2 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0 relative',
                  isExtendedTime(time) ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-50 dark:bg-gray-900',
                  time === '00:00' && 'bg-purple-50 dark:bg-purple-900/20',
                  time === '24:00' && 'bg-purple-50 dark:bg-purple-900/20',
                  isNowHeader && 'bg-red-50 dark:bg-red-900/30 border-t-2 border-t-red-500'
                )}
                style={{ width: cellWidth }}
              >
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      'font-bold text-xs',
                      isExtendedTime(time) ? 'text-yellow-800 dark:text-yellow-100' : 'text-gray-900 dark:text-gray-100',
                      isNowHeader && 'text-red-700 dark:text-red-300'
                    )}
                  >
                    {fmt(time)}
                  </span>
                  {index < timeSlots.length - 1 && (
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      to {fmt(getNextTimeSlot(time))}
                    </span>
                  )}
                  {isNowHeader && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-1.5 py-0.5 rounded-full border border-red-300 dark:border-red-700 whitespace-nowrap">
                      NOW
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col">
          {visibleDays.map((day: string) => {
            const isTodayRow = day === todayDayName
            return (
              <div key={day} className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div
                  className={cn(
                    'flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 flex items-center justify-center p-4',
                    isTodayRow
                      ? 'bg-red-50 dark:bg-red-900/20'
                      : 'bg-white dark:bg-gray-800'
                  )}
                  style={{ width: cellWidth, height: `${timeSettings.cellHeight}px` }}
                >
                  <div className="text-center">
                    <div
                      className={cn(
                        'font-bold text-sm',
                        ['SATURDAY', 'SUNDAY'].includes(day) && 'text-blue-700 dark:text-blue-300',
                        isTodayRow && 'text-red-700 dark:text-red-300'
                      )}
                    >
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                      {isTodayRow && (
                        <span className="ml-1 text-[10px] font-normal">(Today)</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  {timeSlots.map((time: string, index: number) => {
                    const fixedTime = isTimeInFixedSlot(day, time)
                    const freePeriodInfo = isTimeInFreePeriod(day, time)
                    const tasksInCell = getTasksForCell(day, time)
                    const primaryTask = tasksInCell.find((t: TimeSlot) => shouldShowTaskInCell(t, day, time)) || tasksInCell[0]
                    const isFreePeriod = !!freePeriodInfo
                    const sleepTask = tasksInCell.find((t: TimeSlot) => t.isSleepTime)
                    const isSleepTime = !!sleepTask

                    const isNowCell = isTodayRow && index === nowSlotIndex

                    const liveTask = isNowCell && tasksInCell.find((t: TimeSlot) => {
                      const s = convertToMinutes(t.startTime)
                      const e = convertToMinutes(t.endTime)
                      const effEnd = e === 0 && s !== 0 ? 24 * 60 : e
                      return nowMinutes >= s && nowMinutes < effEnd
                    })

                    const liveFixed = isNowCell && fixedTime && (() => {
                      const s = convertToMinutes(fixedTime.startTime)
                      const e = convertToMinutes(fixedTime.endTime)
                      const effEnd = e === 0 && s !== 0 ? 24 * 60 : e
                      return nowMinutes >= s && nowMinutes < effEnd
                    })()

                    const isLive = !!(liveTask || liveFixed)

                    return (
                      <div
                        key={`${day}-${time}`}
                        className={cn(
                          'relative border-r border-b border-gray-200 dark:border-gray-700 group transition-all duration-150',
                          fixedTime && !isFreePeriod && getTimeSlotColor(fixedTime.type),
                          isFreePeriod && 'bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30',
                          isExtendedTime(time) && !fixedTime && !isSleepTime && 'bg-yellow-50/30 dark:bg-yellow-900/10',
                          isSleepTime && 'bg-gray-100/50 dark:bg-gray-800/50',
                          'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                          isLive && 'ring-2 ring-red-500 ring-inset z-10 bg-red-50/40 dark:bg-red-900/20',
                          isNowCell && !isLive && 'bg-red-50/30 dark:bg-red-900/10',
                          primaryTask && !primaryTask.isSleepTime && 'cursor-pointer'
                        )}
                        style={{ height: `${timeSettings.cellHeight}px`, width: cellWidth }}
                        onClick={() =>
                          primaryTask && !primaryTask.isSleepTime && primaryTask.id && onTaskClick(primaryTask.id)
                        }
                      >
                        {isNowCell && (
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 z-20" />
                        )}

                        {fixedTime && !isFreePeriod && !primaryTask && !isSleepTime && (
                          <div className="absolute inset-0 flex items-center justify-center p-0.5">
                            <div className={cn(
                              'text-[10px] font-medium text-center truncate px-0.5',
                              liveFixed ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'
                            )}>
                              <div className="flex items-center justify-center gap-0.5">
                                {getIconByType(fixedTime.type)}
                                <span className="truncate max-w-[80px]">{fixedTime.title}</span>
                              </div>
                              {liveFixed && (
                                <div className="text-[8px] text-red-600 dark:text-red-400 mt-0.5 font-bold flex items-center justify-center gap-0.5">
                                  <span className="relative flex h-1 w-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1 w-1 bg-red-500"></span>
                                  </span>
                                  LIVE
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {isFreePeriod && !primaryTask && !isSleepTime && (
                          <div className="absolute inset-0 flex items-center justify-center p-0.5">
                            <div className="text-[10px] font-medium text-center truncate px-0.5 text-green-700 dark:text-green-400">
                              <div className="flex items-center justify-center gap-0.5">
                                <Coffee className="w-2.5 h-2.5" />
                                <span>Free</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {primaryTask && shouldShowTaskInCell(primaryTask, day, time) && !primaryTask.isSleepTime && (
                          <TaskComponent
                            task={primaryTask}
                            cellHeight={timeSettings.cellHeight}
                            cellWidth={cellWidth}
                            taskSpan={getTaskSpan(primaryTask)}
                            onComplete={onComplete}
                            isCompleting={isCompleting}
                            formatDurationShort={formatDurationShort}
                            getIconByType={getIconByType}
                            cn={cn}
                            isLive={!!liveTask}
                          />
                        )}

                        {sleepTask && shouldShowTaskInCell(sleepTask, day, time) && (
                          <SleepTaskComponent
                            task={sleepTask}
                            cellHeight={timeSettings.cellHeight}
                            cellWidth={cellWidth}
                            taskSpan={getTaskSpan(sleepTask)}
                            formatDurationShort={formatDurationShort}
                            getIconByType={getIconByType}
                            cn={cn}
                            isLive={isNowCell && isSleepTime}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ==================== TaskComponent ====================
function TaskComponent({
  task, cellHeight, cellWidth, taskSpan,
  onComplete, isCompleting, formatDurationShort, getIconByType, cn,
  isLive,
}: any) {
  const isOverdue = task.gracePeriodEndsAt && new Date(task.gracePeriodEndsAt) < new Date() && task.status !== 'COMPLETED'
  const Icon = getIconByType('OTHER')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'absolute top-0.5 left-0.5 rounded border shadow-sm z-30 overflow-hidden cursor-pointer',
        'hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all',
        task.status === 'COMPLETED' && 'opacity-75',
        isOverdue && 'border-red-300 dark:border-red-700',
        isLive && 'ring-2 ring-red-500 shadow-lg shadow-red-500/20'
      )}
      style={{
        height: `${cellHeight - 4}px`,
        width: `calc(${taskSpan} * ${cellWidth}px - 8px)`,
        borderLeft: `3px solid ${task.color}`,
        backgroundColor: task.status === 'COMPLETED' ? '#10B98115' : `${task.color}15`,
      }}
    >
      <div className="p-1 h-full flex flex-col">
        <div className="flex items-start justify-between mb-0.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-0.5">
              {Icon}
              <h4
                className={cn(
                  'text-[10px] font-semibold truncate',
                  task.status === 'COMPLETED' ? 'text-gray-500 dark:text-gray-400 line-through' : 'dark:text-gray-200'
                )}
              >
                {task.title}
              </h4>
              {isLive && (
                <span className="relative flex h-1.5 w-1.5 ml-0.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
              )}
            </div>
          </div>
          {task.id && task.status !== 'COMPLETED' && (
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              onClick={(e) => { e.stopPropagation(); onComplete(task.id!) }}
              disabled={isCompleting === task.id}
            >
              {isCompleting === task.id ? (
                <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-500" />
              ) : (
                <CheckCircle2 className="w-2.5 h-2.5 text-green-500" />
              )}
            </button>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              task.priority === 'CRITICAL' ? 'bg-red-500'
                : task.priority === 'HIGH' ? 'bg-orange-500'
                : task.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
            )}
          />
          <span className="text-[8px] text-gray-500 dark:text-gray-400">
            {formatDurationShort(task.duration)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ==================== SleepTaskComponent ====================
function SleepTaskComponent({
  task, cellHeight, cellWidth, taskSpan,
  formatDurationShort, getIconByType, cn, isLive,
}: any) {
  const Icon = getIconByType('SLEEP')
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'absolute top-0.5 left-0.5 rounded border shadow-sm z-30 overflow-hidden',
        'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700',
        isLive && 'ring-2 ring-red-500 shadow-lg shadow-red-500/20'
      )}
      style={{
        height: `${cellHeight - 4}px`,
        width: `calc(${taskSpan} * ${cellWidth}px - 8px)`,
        borderLeft: `3px solid ${task.color}`,
      }}
    >
      <div className="p-1 h-full flex flex-col">
        <div className="flex items-center gap-0.5 mb-0.5">
          {Icon}
          <h4 className="text-[10px] font-semibold truncate text-gray-700 dark:text-gray-300">Sleep</h4>
          {isLive && (
            <span className="relative flex h-1.5 w-1.5 ml-0.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          <span className="text-[8px] text-gray-500 dark:text-gray-400">
            {formatDurationShort(task.duration)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ==================== DayTimelineView (MOBILE) ====================
interface DayTimelineViewProps {
  visibleDays: string[]
  tasks: TimeSlot[]
  fixedTimes: FixedTime[]
  sleepSchedules: SleepSchedule[]
  todayDayName: string
  nowMinutes: number
  timeSettings: TimeSettings
  onTaskClick: (taskId?: string) => void
  onComplete: (taskId: string) => void
  isCompleting: string | null
  formatTimeDisplay: (time: string) => string
  formatDuration: (minutes: number) => string
  getIconByType: (type: string) => React.ReactElement
  getTimeSlotColor: (type: string) => string
  getSleepTypeInfo: (type: string) => { label: string; icon: any; color: string }
  cn: (...classes: (string | boolean | undefined | null)[]) => string
}

function DayTimelineView({
  visibleDays,
  tasks,
  fixedTimes,
  sleepSchedules,
  todayDayName,
  nowMinutes,
  timeSettings,
  onTaskClick,
  onComplete,
  isCompleting,
  formatTimeDisplay,
  formatDuration,
  getIconByType,
  getTimeSlotColor,
  getSleepTypeInfo,
  cn,
}: DayTimelineViewProps) {
  const [expandedDay, setExpandedDay] = React.useState<string>(todayDayName)

  const isActivityLive = (day: string, startTime: string, endTime: string) => {
    if (day !== todayDayName) return false
    const s = convertToMinutes(startTime)
    const e = convertToMinutes(endTime)
    if (e < s) return nowMinutes >= s || nowMinutes < e
    return nowMinutes >= s && nowMinutes < e
  }

  const buildDayActivities = (day: string) => {
    const items: Array<{
      id: string
      kind: 'task' | 'fixed' | 'sleep' | 'free'
      title: string
      subtitle: string
      color: string
      startTime: string
      endTime: string
      duration: number
      type: string
      priority?: string
      status?: string
      taskId?: string
    }> = []

    tasks
      .filter((t) => t.day === day && !t.isSleepTime)
      .forEach((t) => {
        items.push({
          id: t.id,
          kind: 'task',
          title: t.title,
          subtitle: t.subject,
          color: t.color,
          startTime: t.startTime,
          endTime: t.endTime,
          duration: t.duration,
          type: t.type,
          priority: t.priority,
          status: t.status,
          taskId: t.id,
        })
      })

    fixedTimes
      .filter((ft) => ft.days.includes(day))
      .forEach((ft) => {
        const isFree = (ft.freePeriods || []).some((fp) => fp.day === day)
        items.push({
          id: `fixed-${ft.id}-${day}`,
          kind: isFree ? 'free' : 'fixed',
          title: ft.title,
          subtitle: `${ft.type.charAt(0)}${ft.type.slice(1).toLowerCase()}`,
          color: ft.color || '#6B7280',
          startTime: ft.startTime,
          endTime: ft.endTime,
          duration: calculateDuration(ft.startTime, ft.endTime),
          type: ft.type,
        })
      })

    const sleep = sleepSchedules.find((s) => s.day === day && s.isActive)
    if (sleep) {
      items.push({
        id: `sleep-${sleep.id}`,
        kind: 'sleep',
        title: sleep.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
        subtitle: getSleepTypeInfo(sleep.type).label,
        color: sleep.color || '#4B5563',
        startTime: sleep.bedtime,
        endTime: sleep.wakeTime,
        duration: sleep.duration,
        type: 'sleep',
      })
    }

    return items.sort(
      (a, b) => convertToMinutes(a.startTime) - convertToMinutes(b.startTime),
    )
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {visibleDays.map((day) => {
        const isToday = day === todayDayName
        const activities = buildDayActivities(day)
        const isExpanded = expandedDay === day
        const taskCount = activities.filter((a) => a.kind === 'task').length
        const completedCount = activities.filter(
          (a) => a.kind === 'task' && a.status === 'COMPLETED',
        ).length

        return (
          <div key={day} className="bg-white dark:bg-gray-800">
            {/* ---------- DAY HEADER ---------- */}
            <button
              type="button"
              onClick={() => setExpandedDay(isExpanded ? '' : day)}
              className={cn(
                'w-full flex items-center justify-between gap-3 p-4 text-left transition-colors',
                isToday && 'bg-red-50/50 dark:bg-red-900/10',
                !isExpanded && 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    'w-11 h-11 rounded-full flex flex-col items-center justify-center flex-shrink-0 border-2',
                    isToday
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300',
                  )}
                >
                  <span className="text-[9px] uppercase font-semibold leading-none">
                    {DAY_DISPLAY[day]}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={cn(
                        'text-sm font-semibold truncate',
                        isToday
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-gray-900 dark:text-gray-100',
                      )}
                    >
                      {DAY_FULL_DISPLAY[day]}
                    </h3>
                    {isToday && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex-shrink-0">
                        TODAY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {activities.length === 0
                      ? 'No activities'
                      : `${activities.length} ${
                          activities.length === 1 ? 'activity' : 'activities'
                        }${
                          taskCount > 0
                            ? ` • ${completedCount}/${taskCount} done`
                            : ''
                        }`}
                  </p>
                </div>
              </div>

              <ChevronRight
                className={cn(
                  'w-5 h-5 text-gray-400 flex-shrink-0 transition-transform',
                  isExpanded && 'rotate-90',
                )}
              />
            </button>

            {/* ---------- EXPANDED ACTIVITIES ---------- */}
            {isExpanded && (
              <div className="px-3 pb-3 space-y-1.5">
                {activities.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Nothing scheduled for {DAY_FULL_DISPLAY[day]}
                    </p>
                  </div>
                ) : (
                  activities.map((activity, idx) => {
                    const isLive = isActivityLive(
                      day,
                      activity.startTime,
                      activity.endTime,
                    )
                    const isCompleted =
                      activity.kind === 'task' &&
                      activity.status === 'COMPLETED'
                    const isTask = activity.kind === 'task'

                    return (
                      <motion.div
                        key={`${activity.id}-${idx}`}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => {
                          if (isTask && activity.taskId) {
                            onTaskClick(activity.taskId)
                          }
                        }}
                        className={cn(
                          'relative flex gap-3 p-3 rounded-xl border transition-all',
                          isLive
                            ? 'border-red-400 dark:border-red-700 bg-red-50/60 dark:bg-red-900/20 ring-2 ring-red-400/40'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50',
                          isTask && 'cursor-pointer active:scale-[0.99]',
                          isCompleted && 'opacity-60',
                        )}
                      >
                        <div
                          className="w-1 rounded-full flex-shrink-0 self-stretch"
                          style={{ backgroundColor: activity.color }}
                        />

                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: `${activity.color}20` }}
                        >
                          {activity.kind === 'sleep' ? (
                            <Moon className="w-4 h-4" style={{ color: activity.color }} />
                          ) : activity.kind === 'fixed' ? (
                            getIconByType(activity.type)
                          ) : activity.kind === 'free' ? (
                            <Coffee className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <Book className="w-4 h-4" style={{ color: activity.color }} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={cn(
                                'text-sm font-semibold truncate',
                                isCompleted
                                  ? 'text-gray-500 dark:text-gray-400 line-through'
                                  : 'text-gray-900 dark:text-gray-100',
                              )}
                            >
                              {activity.title}
                            </h4>

                            {isLive && (
                              <span className="flex items-center gap-1 flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/50">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                                </span>
                                LIVE
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeDisplay(activity.startTime)} –{' '}
                              {formatTimeDisplay(activity.endTime)}
                            </span>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span>{formatDuration(activity.duration)}</span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            {activity.subtitle && (
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                {activity.subtitle}
                              </span>
                            )}

                            {activity.priority && (
                              <span
                                className={cn(
                                  'text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase',
                                  activity.priority === 'CRITICAL'
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    : activity.priority === 'HIGH'
                                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                      : activity.priority === 'MEDIUM'
                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                                )}
                              >
                                {activity.priority}
                              </span>
                            )}
                          </div>
                        </div>

                        {isTask && activity.taskId && !isCompleted && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onComplete(activity.taskId!)
                            }}
                            disabled={isCompleting === activity.taskId}
                            className="self-center p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex-shrink-0"
                            aria-label="Mark complete"
                          >
                            {isCompleting === activity.taskId ? (
                              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-gray-400 hover:text-green-500" />
                            )}
                          </button>
                        )}

                        {isCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-green-500 self-center flex-shrink-0" />
                        )}
                      </motion.div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}