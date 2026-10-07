// src/components/features/timetable/builder/TimeTableBuilder.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Clock, Plus, Save, Lock, Unlock, Grid, List, Zap, Download, Share2,
  Target, Book, Briefcase, GraduationCap, Home, AlertCircle, X, Settings, Bell,
  RefreshCw, Columns, Rows, Coffee, Wind, Maximize2, Eye, EyeOff, FileText, Printer,
  Image as ImageIcon, ChevronLeft, ChevronRight, GripVertical, MoreVertical, Trash2,
  Edit2, Copy, ChevronUp, ChevronDown, PlusCircle, MinusCircle, Users, Building, Car,
  Dumbbell, Utensils, Heart, Music, Gamepad2, Moon, Sun, CheckCircle2, TrendingUp,
  Award, Trophy, Flame, Star, School, User, ArrowRight, ArrowLeft, Bed, AlarmClock,
  MoonStar, Sunrise, Sunset, Loader2, CheckCircle, XCircle, AlertTriangle, Menu,
  Layers, CalendarDays, Sparkles, BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'

// ============ TYPES ============
interface TimeSlot {
  id: string; title: string; subject: string; startTime: string; endTime: string;
  duration: number; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; color: string;
  isCompleted?: boolean; day: string;
  type: 'task' | 'fixed' | 'break' | 'commute' | 'free' | 'class' | 'study' | 'health' | 'project' | 'meeting' | 'workout' | 'meal' | 'entertainment' | 'sleep' | 'other';
  isFreePeriod?: boolean; span?: number; fixedCommitmentId?: string; freePeriodId?: string;
  goalId?: string; milestoneId?: string; isSleepTime?: boolean; sleepScheduleId?: string;
  category?: string; note?: string; status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS';
  completedAt?: string; fixedTimeId?: string | null; serverId?: string; description?: string;
}

interface SleepSchedule {
  id: string; day: string; bedtime: string; wakeTime: string; duration: number;
  isActive: boolean; color: string;
  type: 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE'; notes?: string;
}

interface SleepDraftDay {
  isActive: boolean; bedtime: string; wakeTime: string;
  type: SleepSchedule['type']; notes: string;
}

interface Milestone {
  id: string; title: string; description: string; completed: boolean;
  targetDate: Date; progress: number; scheduledHours: number; completedHours: number;
}

interface Goal {
  id: string; title: string; description: string;
  category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: 'SHORT_TERM' | 'LONG_TERM'; targetDate: Date; createdAt: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  progress: number; totalHours: number; completedHours: number;
  milestones: Milestone[]; color: string; tags: string[]; isPublic: boolean;
  weeklyTarget: number; streak: number; lastUpdated: Date; subject: string; tasks: string[];
}

interface FixedTime {
  id: string; title: string; description?: string; days: string[];
  startTime: string; endTime: string;
  type: 'COLLEGE' | 'OFFICE' | 'SCHOOL' | 'COMMUTE' | 'FREE' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'FAMILY' | 'OTHER' | 'SLEEP';
  color?: string; isFreePeriod?: boolean; isEditable?: boolean; icon?: string;
  freePeriods?: { id: string; title: string; startTime: string; endTime: string; duration: number; day: string; }[];
  serverId?: string;
}

interface TimeSettings {
  startHour: number; endHour: number; interval: number;
  displayMode: 'vertical' | 'horizontal'; cellHeight: number;
  showWeekends: boolean; compactMode: boolean;
  extendedHours: { morning: boolean; evening: boolean; night: boolean; custom: string[]; };
  showSleepBlocks: boolean; autoLockSleep: boolean; show24Hours: boolean;
}

interface LockProgress {
  step: string; status: 'pending' | 'in-progress' | 'completed' | 'failed';
  message?: string; error?: string;
}

interface FullTimeTableSlot {
  startTime: string; endTime: string;
  type: 'FIXED' | 'FREE' | 'STUDY' | 'PROJECT' | 'CLASS' | 'HEALTH' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP' | 'OTHER';
  title: string; description?: string | null; fixedTimeId?: string; freePeriodId?: string;
  sleepScheduleId?: string; taskId?: string; color?: string;
  status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; category?: string; subject?: string;
  duration?: number;
}

interface FullTimeTableResponse { day: string; slots: FullTimeTableSlot[]; }

interface LockApiResponse {
  success: boolean; message: string;
  data: { fixedTimesCreated: number; sleepSchedulesCreated: number; tasksCreated: number; totalItems: number; };
}

interface ResetApiResponse {
  success: boolean; message: string;
  data: { fixedTimesDeleted: number; sleepSchedulesDeleted: number; tasksDeleted: number; totalDeleted: number; };
}

interface ResetPayload {
  confirm: boolean; resetTasks: boolean; resetFixedTimes: boolean; resetSleepSchedules: boolean;
}

interface PlacementResult { error?: string; fixedTimeId?: string; freePeriodId?: string; }

// ============ CONSTANTS ============
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
  { id: 'OTHER', label: 'Other', icon: Clock, color: '#6B7280' }
]

const SLEEP_TYPES = [
  { id: 'REGULAR', label: 'Regular Sleep', icon: Moon, color: '#4B5563', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'POWER_NAP', label: 'Power Nap', icon: AlarmClock, color: '#8B5CF6', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'RECOVERY', label: 'Recovery Sleep', icon: Heart, color: '#EC4899', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  { id: 'EARLY', label: 'Early Bird', icon: Sunrise, color: '#F59E0B', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  { id: 'LATE', label: 'Night Owl', icon: MoonStar, color: '#3B82F6', bgColor: 'bg-blue-100 dark:bg-blue-900/30' }
]

const GOAL_CATEGORIES = [
  { id: 'ACADEMIC', label: 'Academic', icon: School, color: '#3B82F6', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'PROFESSIONAL', label: 'Professional', icon: Briefcase, color: '#10B981', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  { id: 'HEALTH', label: 'Health & Fitness', icon: Heart, color: '#EF4444', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  { id: 'PERSONAL', label: 'Personal', icon: User, color: '#8B5CF6', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
  { id: 'SKILL', label: 'Skill Development', icon: Award, color: '#F59E0B', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 'FINANCIAL', label: 'Financial', icon: TrendingUp, color: '#6366F1', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { id: 'SOCIAL', label: 'Social', icon: Users, color: '#EC4899', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
  { id: 'CREATIVE', label: 'Creative', icon: Music, color: '#F97316', bgColor: 'bg-orange-50 dark:bg-orange-900/20' }
]

const ALL_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
const MINUTES_IN_DAY = 24 * 60

const mapUITypeToAPIType = (uiType: TimeSlot['type']): any => {
  switch(uiType) {
    case 'study': return 'STUDY'
    case 'class': return 'CLASS'
    case 'project': return 'PROJECT'
    case 'health': return 'HEALTH'
    case 'meeting': return 'MEETING'
    case 'workout': return 'WORKOUT'
    case 'meal': return 'MEAL'
    case 'entertainment': return 'ENTERTAINMENT'
    case 'sleep': return 'SLEEP'
    case 'task': return 'TASK'
    case 'break': return 'BREAK'
    case 'commute': return 'COMMUTE'
    case 'free': return 'FREE'
    case 'fixed': return 'FIXED'
    case 'other': return 'TASK'
    default: return 'TASK'
  }
}

const mapAPITypeToUIType = (apiType: string): TimeSlot['type'] => {
  switch(apiType) {
    case 'STUDY': return 'study'
    case 'CLASS': return 'class'
    case 'PROJECT': return 'project'
    case 'HEALTH': return 'health'
    case 'MEETING': return 'meeting'
    case 'WORKOUT': return 'workout'
    case 'MEAL': return 'meal'
    case 'ENTERTAINMENT': return 'entertainment'
    case 'SLEEP': return 'sleep'
    default: return 'task'
  }
}

const guessFixedTypeFromTitle = (title: string): FixedTime['type'] => {
  const t = title.toLowerCase()
  if (t.includes('college') || t.includes('lecture') || t.includes('class')) return 'COLLEGE'
  if (t.includes('gym') || t.includes('workout')) return 'WORKOUT'
  if (t.includes('office') || t.includes('work')) return 'OFFICE'
  if (t.includes('meeting')) return 'MEETING'
  if (t.includes('meal') || t.includes('lunch') || t.includes('breakfast') || t.includes('dinner')) return 'MEAL'
  if (t.includes('sleep') || t.includes('bed')) return 'SLEEP'
  return 'OTHER'
}

const guessSleepTypeFromTitle = (title: string): SleepSchedule['type'] => {
  const t = title.toLowerCase()
  if (t.includes('late')) return 'LATE'
  if (t.includes('power') || t.includes('nap')) return 'POWER_NAP'
  if (t.includes('recovery')) return 'RECOVERY'
  if (t.includes('early')) return 'EARLY'
  return 'REGULAR'
}

const cleanId = (value?: string | null): string | undefined => {
  if (!value || value === 'no-goal' || value === 'no-milestone') return undefined
  return value
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8181/v0/api'}`

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return isMobile
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function TimetableBuilderPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'pdf'>('grid')
  const [isLocked, setIsLocked] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [tasks, setTasks] = useState<TimeSlot[]>([])
  const [sleepSchedules, setSleepSchedules] = useState<SleepSchedule[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [fixedTimes, setFixedTimes] = useState<FixedTime[]>([])

  const [showLockProgress, setShowLockProgress] = useState(false)
  const [lockProgress, setLockProgress] = useState<LockProgress[]>([
    { step: 'Saving Timetable', status: 'pending' }
  ])
  const [isLocking, setIsLocking] = useState(false)
  const [lockSuccess, setLockSuccess] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isResetting, setIsResetting] = useState(false)

  const [showLockConfirm, setShowLockConfirm] = useState(false)
  const [lockConfirmed, setLockConfirmed] = useState(false)

  const [lockIssues, setLockIssues] = useState<string[]>([])
  const [showLockIssues, setShowLockIssues] = useState(false)

  const [userType, setUserType] = useState<'student' | 'professional' | 'jobseeker' | 'other'>('student')
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [showEditFixedTimeModal, setShowEditFixedTimeModal] = useState(false)
  const [showAddFixedTimeModal, setShowAddFixedTimeModal] = useState(false)
  const [editingFixedTime, setEditingFixedTime] = useState<FixedTime | null>(null)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showTimeSettingsModal, setShowTimeSettingsModal] = useState(false)
  const [showCellTaskModal, setShowCellTaskModal] = useState(false)
  const [showTimeExtensionModal, setShowTimeExtensionModal] = useState(false)
  const [showAddFreePeriodModal, setShowAddFreePeriodModal] = useState(false)
  const [showSleepScheduleModal, setShowSleepScheduleModal] = useState(false)
  const [selectedFixedTimeForFreePeriod, setSelectedFixedTimeForFreePeriod] = useState<FixedTime | null>(null)
  const [selectedCell, setSelectedCell] = useState<{day: string, time: string} | null>(null)

  const [showQuickFreePeriodModal, setShowQuickFreePeriodModal] = useState(false)
  const [quickFreePeriodContext, setQuickFreePeriodContext] = useState<{day: string, time: string, fixedTime: FixedTime} | null>(null)
  const [editingTask, setEditingTask] = useState<TimeSlot | null>(null)
  const [selectedFixedTime, setSelectedFixedTime] = useState<FixedTime | null>(null)
  const [showGoalsModal, setShowGoalsModal] = useState(false)
  const [selectedGoalForMilestone, setSelectedGoalForMilestone] = useState<Goal | null>(null)
  const [editingSleepSchedule, setEditingSleepSchedule] = useState<SleepSchedule | null>(null)

  const [sleepDraft, setSleepDraft] = useState<Record<string, SleepDraftDay>>({})
  const [sleepDraftDirty, setSleepDraftDirty] = useState(false)

  const [taskCreationFlow, setTaskCreationFlow] = useState<'simple' | 'withGoal'>('simple')
  const [showTaskCreationDialog, setShowTaskCreationDialog] = useState(false)
  const [taskCreationContext, setTaskCreationContext] = useState<{day: string, time: string} | null>(null)

  const idCounter = useRef(0)

  const isMobile = useIsMobile(768)
  const [mobileTab, setMobileTab] = useState<'timetable' | 'tasks' | 'goals' | 'sleep' | 'settings'>('timetable')
  const [mobileSelectedDay, setMobileSelectedDay] = useState<string>('MONDAY')
  const [showMobileMoreSheet, setShowMobileMoreSheet] = useState(false)
  const [showMobileLockSheet, setShowMobileLockSheet] = useState(false)

  const [newFreePeriod, setNewFreePeriod] = useState({
    title: 'Free Period', startTime: '14:00', endTime: '15:00',
    duration: 60, day: 'MONDAY'
  })

  const [newTask, setNewTask] = useState({
    title: '', subject: '', note: '', duration: 60,
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    color: '#3B82F6', day: 'MONDAY', startTime: '09:00',
    goalId: '', milestoneId: '',
    type: 'STUDY' as 'STUDY' | 'CLASS' | 'PROJECT' | 'HEALTH' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP' | 'OTHER',
    category: 'ACADEMIC' as 'ACADEMIC' | 'PROFESSIONAL' | 'PERSONAL' | 'HEALTH' | 'OTHER'
  })

  const [newFixedTime, setNewFixedTime] = useState({
    title: '', description: '', days: [] as string[],
    startTime: '09:00', endTime: '17:00',
    type: 'OTHER' as FixedTime['type'], color: '#6B7280',
    isEditable: true,
    freePeriods: [] as {id: string, title: string, startTime: string, endTime: string, duration: number, day: string}[]
  })

  const [timeSettings, setTimeSettings] = useState<TimeSettings>({
    startHour: 0, endHour: 24, interval: 60,
    displayMode: 'horizontal', cellHeight: 60,
    showWeekends: true, compactMode: false,
    extendedHours: { morning: false, evening: false, night: false, custom: [] },
    showSleepBlocks: true, autoLockSleep: true, show24Hours: true
  })

  const getAuthToken = (): string => {
    const token = localStorage.getItem('access_token')
    return token ? `Bearer ${token}` : ''
  }

  // ============ DRAFT STORAGE ============
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
    } catch (e) {}
    let hash = 0
    for (let i = 0; i < token.length; i++) {
      hash = ((hash << 5) - hash) + token.charCodeAt(i)
      hash |= 0
    }
    return `token-${hash}`
  }

  const getDraftStorageKey = (): string | null => {
    const userId = getUserIdentifier()
    if (!userId) return null
    return `chronify_timetable_draft_${userId}`
  }

  const saveDraftLocally = (
    draftFixedTimes: FixedTime[], draftSleepSchedules: SleepSchedule[],
    draftTasks: TimeSlot[], draftTimeSettings: TimeSettings
  ) => {
    if (typeof window === 'undefined') return
    const key = getDraftStorageKey()
    if (!key) return
    try {
      const draft = {
        fixedTimes: draftFixedTimes, sleepSchedules: draftSleepSchedules,
        tasks: draftTasks.filter(t => !t.isSleepTime),
        timeSettings: draftTimeSettings, savedAt: new Date().toISOString()
      }
      localStorage.setItem(key, JSON.stringify(draft))
    } catch (e) { console.error('Failed to save draft:', e) }
  }

  const loadDraftLocally = () => {
    if (typeof window === 'undefined') return null
    const key = getDraftStorageKey()
    if (!key) return null
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      return JSON.parse(raw)
    } catch (e) { return null }
  }

  const clearDraftLocally = () => {
    if (typeof window === 'undefined') return
    const key = getDraftStorageKey()
    if (!key) return
    try { localStorage.removeItem(key) } catch (e) {}
  }

  const initializeTimetable = async () => {
    setIsLoading(true)
    const draft = loadDraftLocally()
    const hasDraftContent = !!draft && (
      (draft.fixedTimes && draft.fixedTimes.length > 0) ||
      (draft.sleepSchedules && draft.sleepSchedules.length > 0) ||
      (draft.tasks && draft.tasks.length > 0)
    )

    if (hasDraftContent && draft) {
      setFixedTimes(draft.fixedTimes || [])
      setSleepSchedules(draft.sleepSchedules || [])
      setTasks(draft.tasks || [])
      if (draft.timeSettings) setTimeSettings(draft.timeSettings)
      setIsLoading(false)
      toast.info('Restored your unsaved timetable from this device.')
    } else {
      await fetchFullTimeTable()
    }
  }

  useEffect(() => {
    initializeTimetable()
    fetchGoals()
  }, [])

  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDarkMode)
    if (isDarkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [])

  useEffect(() => {
    if (timeSettings.showSleepBlocks) generateSleepTasks()
    else setTasks(prev => prev.filter(task => !task.isSleepTime))
  }, [sleepSchedules, timeSettings.showSleepBlocks])

  useEffect(() => {
    setHasUnsavedChanges(tasks.length > 0 || fixedTimes.length > 0 || sleepSchedules.length > 0)
  }, [tasks, fixedTimes, sleepSchedules])

  useEffect(() => {
    if (isLoading || isLocked) return
    saveDraftLocally(fixedTimes, sleepSchedules, tasks, timeSettings)
  }, [tasks, fixedTimes, sleepSchedules, timeSettings, isLoading, isLocked])

  useEffect(() => {
    if (!showSleepScheduleModal) return
    const draft: Record<string, SleepDraftDay> = {}
    ALL_DAYS.forEach(day => {
      const existing = sleepSchedules.find(s => s.day === day)
      draft[day] = {
        isActive: existing ? existing.isActive : false,
        bedtime: existing?.bedtime ?? '23:00',
        wakeTime: existing?.wakeTime ?? '07:00',
        type: existing?.type ?? 'REGULAR',
        notes: existing?.notes ?? ''
      }
    })
    setSleepDraft(draft)
    setSleepDraftDirty(false)
  }, [showSleepScheduleModal])

  useEffect(() => {
    if (!days.includes(mobileSelectedDay)) setMobileSelectedDay(days[0])
  }, [timeSettings.showWeekends])

  // ============ FETCH ============
  const fetchFullTimeTable = async () => {
    setIsLoading(true)
    try {
      const token = getAuthToken()
      if (!token) { toast.error('Please login to view timetable'); setIsLoading(false); return }

      const response = await fetch(`${API_BASE_URL}/time-table/full`, {
        headers: { 'Authorization': token }
      })
      if (!response.ok) throw new Error('Failed to fetch timetable')
      const data = await response.json()

      if (data.success && data.data) {
        const apiData: FullTimeTableResponse[] = data.data
        setTasks([]); setFixedTimes([]); setSleepSchedules([])

        const fixedTimesMap = new Map<string, FixedTime>()
        const sleepSlotsById = new Map<string, { day: string; slot: FullTimeTableSlot }[]>()
        const allTasks: TimeSlot[] = []

        apiData.forEach(dayData => {
          dayData.slots.forEach(slot => {
            if (slot.type === 'FIXED' && slot.fixedTimeId) {
              const existing = fixedTimesMap.get(slot.fixedTimeId)
              if (!existing) {
                const type = guessFixedTypeFromTitle(slot.title)
                fixedTimesMap.set(slot.fixedTimeId, {
                  id: `fixed-${Date.now()}-${Math.random()}`,
                  serverId: slot.fixedTimeId, title: slot.title,
                  description: slot.description || undefined,
                  days: [dayData.day], startTime: slot.startTime, endTime: slot.endTime,
                  type, color: slot.color || getFixedTimeColor(type),
                  isEditable: true, freePeriods: []
                })
              } else if (!existing.days.includes(dayData.day)) {
                existing.days.push(dayData.day)
              }
            }
          })
        })

        const taskTypes = ['STUDY', 'PROJECT', 'CLASS', 'HEALTH', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT']
        apiData.forEach(dayData => {
          dayData.slots.forEach(slot => {
            if (slot.type === 'FREE' && slot.fixedTimeId && slot.freePeriodId) {
              const fixedTime = fixedTimesMap.get(slot.fixedTimeId)
              if (fixedTime) {
                if (!fixedTime.freePeriods) fixedTime.freePeriods = []
                const exists = fixedTime.freePeriods.find(fp => fp.id === slot.freePeriodId)
                if (!exists) {
                  fixedTime.freePeriods.push({
                    id: slot.freePeriodId, title: slot.title,
                    startTime: slot.startTime, endTime: slot.endTime,
                    duration: calculateDuration(slot.startTime, slot.endTime),
                    day: dayData.day
                  })
                }
              }
            }

            if (slot.type === 'SLEEP' && slot.sleepScheduleId) {
              const list = sleepSlotsById.get(slot.sleepScheduleId) || []
              list.push({ day: dayData.day, slot })
              sleepSlotsById.set(slot.sleepScheduleId, list)
            }

            if (taskTypes.includes(slot.type) && slot.taskId) {
              const endTime = slot.endTime === '00:00' && slot.startTime !== '00:00' ? '24:00' : slot.endTime
              allTasks.push({
                id: slot.taskId, title: slot.title, subject: slot.subject || 'General',
                startTime: slot.startTime, endTime,
                duration: slot.duration || calculateDuration(slot.startTime, endTime),
                priority: (slot.priority as any) || 'MEDIUM',
                color: slot.color || '#3B82F6', day: dayData.day,
                type: mapAPITypeToUIType(slot.type),
                description: slot.description || undefined,
                serverId: slot.taskId, status: slot.status || 'PENDING',
                category: slot.category || 'ACADEMIC'
              })
            }
          })
        })

        const sleepSchedulesArray: SleepSchedule[] = []
        sleepSlotsById.forEach((entries, id) => {
          const first = entries[0]
          let day = first.day
          let bedtime = first.slot.startTime
          let wakeTime = first.slot.endTime

          if (entries.length > 1) {
            const night = entries.find(e =>
              (e.slot.endTime === '24:00' || e.slot.endTime === '00:00') && e.slot.startTime !== '00:00')
            const morning = entries.find(e =>
              e.slot.startTime === '00:00' && e.slot.endTime !== '00:00' && e.slot.endTime !== '24:00')
            if (night && morning) {
              day = night.day
              bedtime = night.slot.startTime
              wakeTime = morning.slot.endTime
            }
          }

          sleepSchedulesArray.push({
            id, day, bedtime, wakeTime,
            duration: calculateDuration(bedtime, wakeTime),
            isActive: true, type: guessSleepTypeFromTitle(first.slot.title),
            notes: first.slot.description || undefined,
            color: first.slot.color || '#4B5563'
          })
        })

        const fixedTimesArray = Array.from(fixedTimesMap.values())
        setFixedTimes(fixedTimesArray)
        setSleepSchedules(sleepSchedulesArray)
        setTasks(allTasks)

        if (fixedTimesArray.length === 0 && sleepSchedulesArray.length === 0 && allTasks.length === 0) {
          toast.info('No existing timetable found. Start building your schedule!')
        } else {
          toast.success(`Timetable loaded successfully with ${allTasks.length} tasks`)
        }
      }
    } catch (error) {
      console.error('Error fetching timetable:', error)
      toast.error('Failed to load timetable data')
    } finally { setIsLoading(false) }
  }

  const fetchGoals = async () => {
    try {
      const token = getAuthToken()
      if (!token) return
      const response = await fetch(`${API_BASE_URL}/goals`, { headers: { 'Authorization': token } })
      if (!response.ok) throw new Error('Failed to fetch goals')
      const data = await response.json()
      if (data.success && data.data?.goals) setGoals(data.data.goals)
    } catch (error) {
      console.error('Error fetching goals:', error)
    }
  }

  // ============ HELPERS ============
  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = convertTimeToMinutes(startTime)
    const end = convertTimeToMinutes(endTime)
    return end >= start ? end - start : (24 * 60 - start) + end  }

  const getFixedTimeColor = (type: string): string => {
    const fixedTimeType = FIXED_TIME_TYPES.find(t => t.id === type)
    return fixedTimeType?.color || '#6B7280'
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  const days = timeSettings.showWeekends
    ? ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    : ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

  const generateTimeSlots = () => {
    let slots: string[] = []
    let actualStartHour = timeSettings.startHour
    let actualEndHour = timeSettings.endHour

    if (timeSettings.show24Hours) { actualStartHour = 0; actualEndHour = 24 }
    if (timeSettings.extendedHours.morning) actualStartHour = Math.min(actualStartHour, 5)
    if (timeSettings.extendedHours.evening) actualEndHour = Math.max(actualEndHour, 22)
    if (timeSettings.extendedHours.night) actualEndHour = Math.max(actualEndHour, 23)

    const customSlots = timeSettings.extendedHours.custom
    const totalMinutes = (actualEndHour - actualStartHour) * 60
    for (let i = 0; i <= totalMinutes; i += timeSettings.interval) {
      const hour = Math.floor(i / 60) + actualStartHour
      const minute = i % 60
      if (hour < 24) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
      }
    }

    if (!slots.includes('00:00')) slots.unshift('00:00')
    if (!slots.includes('24:00')) slots.push('24:00')

    return [...slots, ...customSlots]
      .filter((slot, index, self) => self.indexOf(slot) === index)
      .sort((a, b) => {
        const [aH, aM] = a.split(':').map(Number)
        const [bH, bM] = b.split(':').map(Number)
        return (aH * 60 + aM) - (bH * 60 + bM)
      })
  }

  const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots())

  useEffect(() => { setTimeSlots(generateTimeSlots()) }, [timeSettings])

  const formatTimeDisplay = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number)
    if (hours === 24) return '12:00 AM (Midnight)'
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const formatTimeShort = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number)
    if (hours === 24) return '12AM'
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    if (minutes === 0) return `${displayHours}${period}`
    return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`
  }

  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const minutesToTime = (total: number): string => {
    if (total >= MINUTES_IN_DAY) return '24:00'
    const h = Math.floor(total / 60)
    const m = total % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    if (totalMinutes >= MINUTES_IN_DAY) return '24:00'
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }

  const newTaskId = (): string => {
    idCounter.current += 1
    return `task-${Date.now()}-${idCounter.current}`
  }

  const formatDayLabel = (day?: string): string => {
    if (!day) return ''
    return day.charAt(0) + day.slice(1).toLowerCase()
  }

  const formatDayShort = (day?: string): string => {
    if (!day) return ''
    return day.slice(0, 3)
  }

  const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ')

  const showIssuesToast = (title: string, lines: string[]) => {
    toast.error(title, {
      description: (
        <div className="space-y-1 mt-1">
          {lines.slice(0, 5).map((line, i) => <div key={i}>• {line}</div>)}
          {lines.length > 5 && <div>…and {lines.length - 5} more</div>}
        </div>
      ), duration: 10000
    })
  }

  const toEndMinutes = (time: string): number => {
    const m = convertTimeToMinutes(time)
    return m === 0 || m === 1439 ? MINUTES_IN_DAY : m
  }

  const getFixedIntervals = (ft: FixedTime): Array<[number, number]> => {
    const rawStart = convertTimeToMinutes(ft.startTime)
    const rawEnd = convertTimeToMinutes(ft.endTime)
    if (rawStart === rawEnd) return []
    if (rawEnd < rawStart && rawEnd !== 0) return [[0, rawEnd], [rawStart, MINUTES_IN_DAY]]
    return [[rawStart, toEndMinutes(ft.endTime)]]
  }

  const getFreeIntervals = (ft: FixedTime, day: string): Array<[number, number]> => {
    return (ft.freePeriods || [])
      .filter(fp => fp.day === day)
      .map(fp => [convertTimeToMinutes(fp.startTime), toEndMinutes(fp.endTime)] as [number, number])
      .filter(([s, e]) => e > s)
  }

  const isCovered = (a: number, b: number, intervals: Array<[number, number]>): boolean => {
    const sorted = [...intervals].sort((x, y) => x[0] - y[0])
    let cursor = a
    for (const [s, e] of sorted) {
      if (s > cursor) break
      cursor = Math.max(cursor, e)
      if (cursor >= b) return true
    }
    return cursor >= b
  }

  const isTimeInFixedSlot = (day: string, time: string): FixedTime | null => {
    const t = convertTimeToMinutes(time)
    for (const ft of fixedTimes) {
      if (!ft.days.includes(day)) continue
      if (getFixedIntervals(ft).some(([s, e]) => t >= s && t < e)) return ft
    }
    return null
  }

  const isTimeInFreePeriodRange = (time: string, startTime: string, endTime: string): boolean => {
    const t = convertTimeToMinutes(time)
    return t >= convertTimeToMinutes(startTime) && t < toEndMinutes(endTime)
  }

  const isTimeInFreePeriod = (day: string, time: string): {fixedTime: FixedTime, freePeriod: any} | null => {
    const fixedTime = isTimeInFixedSlot(day, time)
    if (!fixedTime) return null
    for (const fp of fixedTime.freePeriods || []) {
      if (fp.day === day && isTimeInFreePeriodRange(time, fp.startTime, fp.endTime)) {
        return { fixedTime, freePeriod: fp }
      }
    }
    return null
  }

  const analyzePlacement = (day: string, startTime: string, duration: number, fixedList: FixedTime[] = fixedTimes): PlacementResult => {
    const start = convertTimeToMinutes(startTime)
    if (start >= MINUTES_IN_DAY) return { error: 'The 12:00 AM slot cannot hold a task.' }
    if (!duration || duration <= 0) return { error: 'Duration must be greater than 0 minutes.' }
    const end = start + duration
    if (end > MINUTES_IN_DAY) {
      const maxFit = MINUTES_IN_DAY - start
      return { error: `This task would run past midnight. Use ${maxFit} minutes or less.` }
    }

    let link: PlacementResult = {}
    for (const ft of fixedList) {
      if (!ft.days.includes(day)) continue
      const free = getFreeIntervals(ft, day)
      for (const [fs, fe] of getFixedIntervals(ft)) {
        const a = Math.max(start, fs)
        const b = Math.min(end, fe)
        if (a >= b) continue
        if (!isCovered(a, b, free)) {
          return {
            error: `Overlaps with "${ft.title}" (${formatTimeDisplay(ft.startTime)} – ${formatTimeDisplay(ft.endTime)}) on ${formatDayLabel(day)}. Add a free period first.`
          }
        }
        if (!link.fixedTimeId) {
          const fp = (ft.freePeriods || []).find(f =>
            f.day === day && convertTimeToMinutes(f.startTime) <= a && toEndMinutes(f.endTime) > a)
          link = { fixedTimeId: ft.id, freePeriodId: fp?.id }
        }
      }
    }
    return link
  }

  const getSleepWindows = (bedtime: string, wakeTime: string): Array<[number, number]> => {
    const bed = convertTimeToMinutes(bedtime)
    const wake = convertTimeToMinutes(wakeTime)
    if (bed === wake) return []
    if (wake < bed) return ([[0, wake], [bed, MINUTES_IN_DAY]] as Array<[number, number]>).filter(([s, e]) => e > s)
    return [[bed, wake]]
  }

  const describeTask = (t: TimeSlot): string =>
    `"${t.title}" (${formatDayLabel(t.day)} ${formatTimeDisplay(t.startTime)} – ${formatTimeDisplay(t.endTime)})`

  const findTasksInSleepWindow = (day: string, bedtime: string, wakeTime: string): TimeSlot[] => {
    const windows = getSleepWindows(bedtime, wakeTime)
    return tasks.filter(t => {
      if (t.isSleepTime || t.day !== day) return false
      const ts = convertTimeToMinutes(t.startTime)
      const te = t.endTime === '24:00' || t.endTime === '00:00' ? MINUTES_IN_DAY : convertTimeToMinutes(t.endTime)
      return windows.some(([s, e]) => ts < e && te > s)
    })
  }

  const validateNewFreePeriod = (ft: FixedTime, fp: { day: string; startTime: string; endTime: string }): string | null => {
    if (!ft.days.includes(fp.day)) return `"${ft.title}" does not run on ${formatDayLabel(fp.day)}.`
    const s = convertTimeToMinutes(fp.startTime)
    const e = toEndMinutes(fp.endTime)
    if (e <= s) return 'End time must be after start time.'
    const inside = getFixedIntervals(ft).some(([fs, fe]) => s >= fs && e <= fe)
    if (!inside) return `Free period must be inside "${ft.title}".`
    const overlaps = getFreeIntervals(ft, fp.day).some(([fs, fe]) => s < fe && e > fs)
    if (overlaps) return `Another free period exists in that range.`
    return null
  }

  const validateFixedTimeDefinition = (ft: { title: string; startTime: string; endTime: string; days: string[] }): string | null => {
    if (!ft.title.trim()) return 'Please enter a title'
    if (ft.days.length === 0) return 'Please select at least one day'
    if (!ft.startTime || !ft.endTime) return 'Please set start and end time'
    if (ft.startTime === ft.endTime) return 'Start time and end time cannot be the same'
    return null
  }

  const findNewTaskConflicts = (oldList: FixedTime[], newList: FixedTime[]): TimeSlot[] => {
    return tasks.filter(t => {
      if (t.isSleepTime) return false
      const before = analyzePlacement(t.day, t.startTime, t.duration, oldList)
      const after = analyzePlacement(t.day, t.startTime, t.duration, newList)
      return !before.error && !!after.error
    })
  }

  const validateWholeTimetable = (): string[] => {
    const issues: string[] = []
    fixedTimes.forEach(ft => {
      const defError = validateFixedTimeDefinition(ft)
      if (defError) issues.push(`Fixed commitment "${ft.title || 'Untitled'}": ${defError}.`)
      ;(ft.freePeriods || []).forEach(fp => {
        const inside = ft.days.includes(fp.day) &&
          getFixedIntervals(ft).some(([fs, fe]) =>
            convertTimeToMinutes(fp.startTime) >= fs && toEndMinutes(fp.endTime) <= fe)
        if (!inside) issues.push(`Free period "${fp.title}" is outside "${ft.title}".`)
      })
    })
    tasks.filter(t => !t.isSleepTime).forEach(t => {
      const check = analyzePlacement(t.day, t.startTime, t.duration)
      if (check.error) issues.push(`Task ${describeTask(t)}: ${check.error}`)
    })
    sleepSchedules.filter(s => s.isActive).forEach(s => {
      if (s.bedtime === s.wakeTime) issues.push(`Sleep on ${formatDayLabel(s.day)}: bedtime and wake time are the same.`)
    })
    return issues
  }

  const findAvailableSlot = (duration: number, existingTasks: TimeSlot[]): { day: string; time: string; link: PlacementResult } | null => {
    const candidates = timeSlots.filter(t => t !== '24:00')
    const ordered = [
      ...candidates.filter(t => convertTimeToMinutes(t) >= 8 * 60),
      ...candidates.filter(t => convertTimeToMinutes(t) < 8 * 60)
    ]
    for (const day of days) {
      for (const time of ordered) {
        const check = analyzePlacement(day, time, duration)
        if (check.error) continue
        const s = convertTimeToMinutes(time)
        const e = s + duration
        const clashesTask = existingTasks.some(t =>
          !t.isSleepTime && t.day === day &&
          s < (t.endTime === '24:00' ? MINUTES_IN_DAY : convertTimeToMinutes(t.endTime)) &&
          e > convertTimeToMinutes(t.startTime))
        if (clashesTask) continue
        const clashesSleep = sleepSchedules.some(sl =>
          sl.isActive && sl.day === day &&
          getSleepWindows(sl.bedtime, sl.wakeTime).some(([ws, we]) => s < we && e > ws))
        if (clashesSleep) continue
        return { day, time, link: check }
      }
    }
    return null
  }

  const getDurationOptions = (startTime: string): number[] => {
    const start = convertTimeToMinutes(startTime)
    const opts = [1, 2, 3, 4].map(m => timeSettings.interval * m).filter(d => start + d <= MINUTES_IN_DAY)
    if (opts.length === 0 && start < MINUTES_IN_DAY) return [MINUTES_IN_DAY - start]
    return opts
  }

  const getDetailedDurationOptions = (): number[] => {
    return [5, 10, 15, 20, 25, 30, 45, 60, 75, 90, 120, 150, 180, 240]
  }

  // ============ GOALS / STATS ============
  const getScheduledHoursByGoal = () => {
    const goalHours: Record<string, number> = {}
    tasks.forEach(task => {
      if (task.goalId && !task.isSleepTime) {
        if (!goalHours[task.goalId]) goalHours[task.goalId] = 0
        goalHours[task.goalId] += task.duration / 60
      }
    })
    return goalHours
  }

  const getSleepStats = () => {
    const activeSchedules = sleepSchedules.filter(s => s.isActive)
    const totalSleepHours = activeSchedules.reduce((sum, s) => sum + (s.duration / 60), 0)
    const avgSleepHours = activeSchedules.length > 0 ? totalSleepHours / activeSchedules.length : 0
    return { totalSleepHours, avgSleepHours, daysWithSleep: activeSchedules.length, recommendedHours: 8 }
  }

  useEffect(() => {
    const scheduledHoursByGoal = getScheduledHoursByGoal()
    const updatedGoals: Goal[] = goals.map((goal): Goal => {
      const completedHours = scheduledHoursByGoal[goal.id] || 0
      const updatedMilestones = goal.milestones.map(milestone => {
        const milestoneTasks = tasks.filter(task => task.goalId === goal.id && task.milestoneId === milestone.id)
        const milestoneHours = milestoneTasks.reduce((sum, task) => sum + (task.duration / 60), 0)
        return {
          ...milestone, completedHours: milestoneHours,
          progress: milestoneHours > 0 ? Math.min(100, (milestoneHours / milestone.scheduledHours) * 100) : milestone.progress,
          completed: milestoneHours >= milestone.scheduledHours
        }
      })
      const totalMilestoneHours = updatedMilestones.reduce((sum, m) => sum + m.scheduledHours, 0)
      const completedMilestoneHours = updatedMilestones.reduce((sum, m) => sum + m.completedHours, 0)
      const milestoneProgress = totalMilestoneHours > 0 ? (completedMilestoneHours / totalMilestoneHours) * 100 : 0
      const timeProgress = goal.totalHours > 0 ? (completedHours / goal.totalHours) * 100 : 0
      const totalProgress = Math.min(100, milestoneProgress * 0.7 + timeProgress * 0.3)
      const today = new Date().toDateString()
      const lastUpdated = new Date(goal.lastUpdated).toDateString()
      const newStreak = today === lastUpdated ? goal.streak : goal.streak + 1
      const nextStatus: Goal['status'] = totalProgress >= 100 ? 'COMPLETED' : totalProgress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED'
      return {
        ...goal, completedHours, progress: Math.round(totalProgress),
        milestones: updatedMilestones, status: nextStatus,
        streak: newStreak, lastUpdated: new Date()
      }
    })
    setGoals(updatedGoals)
  }, [tasks])

  const generateSleepTasks = () => {
    const sleepTasks: TimeSlot[] = []
    sleepSchedules.forEach(schedule => {
      if (!schedule.isActive) return
      const bedtimeMinutes = convertTimeToMinutes(schedule.bedtime)
      const wakeTimeMinutes = convertTimeToMinutes(schedule.wakeTime)
      if (bedtimeMinutes === wakeTimeMinutes) return
      const title = schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep'
      const base = {
        title, subject: 'Rest', priority: 'MEDIUM' as const,
        color: schedule.color || '#4B5563', day: schedule.day,
        type: 'sleep' as const, isSleepTime: true,
        sleepScheduleId: schedule.id, isCompleted: false
      }
      if (wakeTimeMinutes < bedtimeMinutes) {
        if (wakeTimeMinutes > 0) {
          sleepTasks.push({ ...base, id: `sleep-${schedule.id}-morning`, startTime: '00:00', endTime: schedule.wakeTime, duration: wakeTimeMinutes })
        }
        sleepTasks.push({ ...base, id: `sleep-${schedule.id}-night`, startTime: schedule.bedtime, endTime: '24:00', duration: MINUTES_IN_DAY - bedtimeMinutes })
      } else {
        sleepTasks.push({ ...base, id: `sleep-${schedule.id}`, startTime: schedule.bedtime, endTime: schedule.wakeTime, duration: wakeTimeMinutes - bedtimeMinutes })
      }
    })
    setTasks(prev => [...prev.filter(task => !task.isSleepTime), ...sleepTasks])
  }

  const getTaskPool = (): TimeSlot[] => {
    return [
      { id: 'pool-1', title: 'Study React Hooks', subject: 'Web Development', startTime: '', endTime: '', duration: 60, priority: 'HIGH' as const, color: '#3B82F6', day: '', type: 'study' as const },
      { id: 'pool-2', title: 'DSA Arrays Practice', subject: 'DSA', startTime: '', endTime: '', duration: 90, priority: 'CRITICAL' as const, color: '#EF4444', day: '', type: 'study' as const }
    ]
  }

  // ============ TASK HANDLERS ============
  const openTaskDialog = (day: string, time: string) => {
    setNewTask(prev => ({
      ...prev, day, startTime: time,
      duration: Math.min(timeSettings.interval, Math.max(MINUTES_IN_DAY - convertTimeToMinutes(time), 1))
    }))
    setTaskCreationFlow('simple')
    setTaskCreationContext({ day, time })
    setShowTaskCreationDialog(true)
  }

  const handleCellClick = (day: string, time: string) => {
    if (isLocked) return
    if (convertTimeToMinutes(time) >= MINUTES_IN_DAY) {
      toast.info('This is the end-of-day marker. Pick a slot before midnight.')
      return
    }
    const fixedTime = isTimeInFixedSlot(day, time)
    if (fixedTime) {
      const isInFreePeriod = fixedTime.freePeriods?.some(fp =>
        fp.day === day && isTimeInFreePeriodRange(time, fp.startTime, fp.endTime))
      if (!isInFreePeriod) {
        const nextSlot = getNextTimeSlot(time)
        const defaultEnd = convertTimeToMinutes(nextSlot) === 0 ? '23:59' : nextSlot
        setNewFreePeriod({ title: 'Free Period', startTime: time, endTime: defaultEnd, duration: timeSettings.interval, day: day })
        setQuickFreePeriodContext({ day, time, fixedTime })
        setShowQuickFreePeriodModal(true)
        return
      }
    }
    openTaskDialog(day, time)
  }

  const handleFixedTimeClick = (fixedTime: FixedTime) => setSelectedFixedTime(fixedTime)

  const handleAddTask = () => {
    if (!newTask.title.trim()) { toast.error('Please enter a task title'); return }
    const check = analyzePlacement(newTask.day, newTask.startTime, newTask.duration)
    if (check.error) { toast.error('Cannot add this task', { description: check.error, duration: 7000 }); return }
    const task: TimeSlot = {
      id: newTaskId(), title: newTask.title, subject: newTask.subject || 'General',
      startTime: newTask.startTime, endTime: calculateEndTime(newTask.startTime, newTask.duration),
      duration: newTask.duration, priority: newTask.priority, color: newTask.color,
      day: newTask.day, type: 'task',
      fixedCommitmentId: check.fixedTimeId, freePeriodId: check.freePeriodId,
      goalId: cleanId(newTask.goalId), milestoneId: cleanId(newTask.milestoneId),
      note: newTask.note, status: 'PENDING'
    }
    setTasks([...tasks, task])
    resetTaskForm()
    setShowAddTaskModal(false)
    toast.success('Task added successfully')
  }

  const handleUpdateTask = () => {
    if (!editingTask) return
    if (!newTask.title.trim()) { toast.error('Please enter a task title'); return }
    const check = analyzePlacement(newTask.day, newTask.startTime, newTask.duration)
    if (check.error) { toast.error('Cannot save this change', { description: check.error, duration: 7000 }); return }
    const updatedTask: TimeSlot = {
      ...editingTask, title: newTask.title, subject: newTask.subject,
      note: newTask.note, duration: newTask.duration, priority: newTask.priority,
      color: newTask.color, day: newTask.day, startTime: newTask.startTime,
      goalId: cleanId(newTask.goalId), milestoneId: cleanId(newTask.milestoneId),
      endTime: calculateEndTime(newTask.startTime, newTask.duration),
      fixedCommitmentId: check.fixedTimeId, freePeriodId: check.freePeriodId
    }
    setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
    setEditingTask(null); setShowAddTaskModal(false); resetTaskForm()
    toast.success('Task updated')
  }

  const handleAddTaskToCell = () => {
    if (!newTask.title.trim()) { toast.error('Please enter a task title'); return }
    const day = newTask.day
    const time = newTask.startTime
    const check = analyzePlacement(day, time, newTask.duration)
    if (check.error) { toast.error('Cannot add this task', { description: check.error, duration: 7000 }); return }
    const task: TimeSlot = {
      id: newTaskId(), title: newTask.title, subject: newTask.subject || 'General',
      startTime: time, endTime: calculateEndTime(time, newTask.duration),
      duration: newTask.duration, priority: newTask.priority, color: newTask.color,
      day, type: 'task',
      fixedCommitmentId: check.fixedTimeId, freePeriodId: check.freePeriodId,
      goalId: cleanId(newTask.goalId), milestoneId: cleanId(newTask.milestoneId),
      note: newTask.note, status: 'PENDING'
    }
    setTasks([...tasks, task])
    resetTaskForm(); setShowTaskCreationDialog(false); setTaskCreationContext(null)
    if (isMobile) setMobileSelectedDay(day)
    toast.success(`Task added to ${formatDayLabel(day)} at ${formatTimeShort(time)}`)
  }

  const resetTaskForm = () => {
    setNewTask({
      title: '', subject: '', note: '', duration: 60, priority: 'MEDIUM',
      color: '#3B82F6', day: 'MONDAY', startTime: '09:00',
      goalId: '', milestoneId: '', type: 'STUDY', category: 'ACADEMIC'
    })
    setTaskCreationFlow('simple')
  }

  const handleEditTask = (task: TimeSlot) => {
    if (task.isSleepTime) {
      setEditingSleepSchedule(sleepSchedules.find(s => s.id === task.sleepScheduleId) || null)
      setShowSleepScheduleModal(true)
      return
    }
    setEditingTask(task)
    setNewTask({
      title: task.title, subject: task.subject, note: task.note || '',
      duration: task.duration, priority: task.priority, color: task.color,
      day: task.day, startTime: task.startTime,
      goalId: task.goalId || '', milestoneId: task.milestoneId || '',
      type: 'STUDY', category: 'ACADEMIC'
    })
    setShowAddTaskModal(true)
  }

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task?.isSleepTime) {
      const sleepSchedule = sleepSchedules.find(s => s.id === task.sleepScheduleId)
      if (sleepSchedule) {
        setSleepSchedules(sleepSchedules.map(s => s.id === sleepSchedule.id ? { ...s, isActive: false } : s))
        toast.success('Sleep schedule deactivated')
      }
      return
    }
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success('Task deleted')
  }

  const handleDuplicateTask = (task: TimeSlot) => {
    if (task.isSleepTime) { toast.error('Cannot duplicate sleep tasks'); return }
    const duplicatedTask = { ...task, id: newTaskId(), title: `${task.title} (Copy)` }
    setTasks([...tasks, duplicatedTask])
    toast.success('Task duplicated')
  }

  // ============ FIXED TIME HANDLERS ============
  const resetNewFixedTime = () => {
    setNewFixedTime({
      title: '', description: '', days: [], startTime: '09:00', endTime: '17:00',
      type: 'OTHER', color: '#6B7280', isEditable: true, freePeriods: []
    })
  }

  const handleAddFixedTime = () => {
    const defError = validateFixedTimeDefinition(newFixedTime)
    if (defError) { toast.error(defError); return }
    const fixedTime: FixedTime = {
      id: `fixed-${Date.now()}-${Math.random()}`,
      title: newFixedTime.title, description: newFixedTime.description,
      days: newFixedTime.days, startTime: newFixedTime.startTime, endTime: newFixedTime.endTime,
      type: newFixedTime.type, color: newFixedTime.color,
      isEditable: newFixedTime.isEditable, freePeriods: newFixedTime.freePeriods || []
    }
    const newList = [...fixedTimes, fixedTime]
    const conflicts = findNewTaskConflicts(fixedTimes, newList)
    if (conflicts.length > 0) {
      showIssuesToast(`Cannot add "${fixedTime.title}" — tasks exist in that time`,
        [...conflicts.map(describeTask), 'Delete or move them first.'])
      return
    }
    setFixedTimes(newList); resetNewFixedTime(); setShowAddFixedTimeModal(false)
    toast.success('Fixed commitment added')
  }

  const handleEditFixedTime = (fixedTime: FixedTime) => {
    setEditingFixedTime(fixedTime)
    setShowEditFixedTimeModal(true)
  }

  const handleSaveFixedTime = (updatedFixedTime: FixedTime) => {
    const defError = validateFixedTimeDefinition(updatedFixedTime)
    if (defError) { toast.error(defError); return }
    const stray = (updatedFixedTime.freePeriods || []).filter(fp => {
      const inside = updatedFixedTime.days.includes(fp.day) &&
        getFixedIntervals(updatedFixedTime).some(([fs, fe]) =>
          convertTimeToMinutes(fp.startTime) >= fs && toEndMinutes(fp.endTime) <= fe)
      return !inside
    })
    if (stray.length > 0) {
      showIssuesToast('Some free periods no longer fit',
        [...stray.map(fp => `"${fp.title}" on ${formatDayLabel(fp.day)}`), 'Remove them first.'])
      return
    }
    const newList = fixedTimes.map(ft => ft.id === updatedFixedTime.id ? updatedFixedTime : ft)
    const conflicts = findNewTaskConflicts(fixedTimes, newList)
    if (conflicts.length > 0) {
      showIssuesToast('This change clashes with existing tasks',
        [...conflicts.map(describeTask), 'Delete or move them first.'])
      return
    }
    setFixedTimes(newList)
    setSelectedFixedTime(prev => (prev && prev.id === updatedFixedTime.id ? updatedFixedTime : prev))
    setShowEditFixedTimeModal(false); setEditingFixedTime(null)
    toast.success('Fixed commitment updated')
  }

  const handleDeleteFixedTime = (id: string) => {
    setFixedTimes(fixedTimes.filter(ft => ft.id !== id))
    setSelectedFixedTime(null)
    toast.success('Fixed commitment deleted')
  }

  const handleAddFreePeriod = () => {
    if (!selectedFixedTimeForFreePeriod || !newFreePeriod.day) {
      toast.error('Please select a fixed commitment and day'); return
    }
    if (!newFreePeriod.title.trim()) { toast.error('Please enter a title'); return }
    const error = validateNewFreePeriod(selectedFixedTimeForFreePeriod, newFreePeriod)
    if (error) { toast.error('Cannot add free period', { description: error, duration: 6000 }); return }
    const freePeriod = {
      id: `free-${Date.now()}-${newFreePeriod.day}`,
      title: newFreePeriod.title, startTime: newFreePeriod.startTime,
      endTime: newFreePeriod.endTime,
      duration: calculateDuration(newFreePeriod.startTime, newFreePeriod.endTime),
      day: newFreePeriod.day
    }
    const updatedFixedTime = {
      ...selectedFixedTimeForFreePeriod,
      freePeriods: [...(selectedFixedTimeForFreePeriod.freePeriods || []), freePeriod]
    }
    setFixedTimes(fixedTimes.map(ft => ft.id === selectedFixedTimeForFreePeriod.id ? updatedFixedTime : ft))
    setSelectedFixedTime(prev => (prev && prev.id === updatedFixedTime.id ? updatedFixedTime : prev))
    setNewFreePeriod({ title: 'Free Period', startTime: '14:00', endTime: '15:00', duration: 60, day: 'MONDAY' })
    setShowAddFreePeriodModal(false); setSelectedFixedTimeForFreePeriod(null)
    toast.success('Free period added')
  }

  const handleQuickAddFreePeriod = () => {
    if (!quickFreePeriodContext) return
    const { fixedTime, day } = quickFreePeriodContext
    if (!newFreePeriod.title.trim()) { toast.error('Please enter a title'); return }
    const error = validateNewFreePeriod(fixedTime, { day, startTime: newFreePeriod.startTime, endTime: newFreePeriod.endTime })
    if (error) { toast.error('Cannot add free period', { description: error, duration: 6000 }); return }
    const fpDuration = calculateDuration(newFreePeriod.startTime, newFreePeriod.endTime)
    const freePeriod = {
      id: `free-${Date.now()}-${day}`,
      title: newFreePeriod.title, startTime: newFreePeriod.startTime,
      endTime: newFreePeriod.endTime, duration: fpDuration, day
    }
    const updatedFixedTime = { ...fixedTime, freePeriods: [...(fixedTime.freePeriods || []), freePeriod] }
    setFixedTimes(fixedTimes.map(ft => ft.id === fixedTime.id ? updatedFixedTime : ft))
    toast.success(`Free period added on ${formatDayLabel(day)} at ${formatTimeDisplay(newFreePeriod.startTime)}`)
    setShowQuickFreePeriodModal(false); setQuickFreePeriodContext(null)
    setNewTask(prev => ({
      ...prev, day, startTime: newFreePeriod.startTime,
      duration: Math.min(timeSettings.interval, fpDuration)
    }))
    setTaskCreationFlow('simple')
    setTaskCreationContext({ day, time: newFreePeriod.startTime })
    setShowTaskCreationDialog(true)
  }

  const handleOpenFreePeriodModal = (fixedTime: FixedTime, day: string) => {
    setSelectedFixedTimeForFreePeriod(fixedTime)
    setNewFreePeriod({ ...newFreePeriod, day })
    setShowAddFreePeriodModal(true)
  }

  // ============ SLEEP ============
  const updateSleepDraft = (day: string, patch: Partial<SleepDraftDay>) => {
    setSleepDraft(prev => ({ ...prev, [day]: { ...prev[day], ...patch } }))
    setSleepDraftDirty(true)
  }

  const applySleepToAllDays = (sourceDay: string) => {
    const src = sleepDraft[sourceDay]
    if (!src) return
    setSleepDraft(prev => {
      const next: Record<string, SleepDraftDay> = {}
      ALL_DAYS.forEach(day => {
        next[day] = { ...prev[day], isActive: true, bedtime: src.bedtime, wakeTime: src.wakeTime, type: src.type }
      })
      return next
    })
    setSleepDraftDirty(true)
    toast.info(`Applied to all days. Click Save to keep it.`)
  }

  const handleSleepModalOpenChange = (open: boolean) => {
    if (!open && sleepDraftDirty) toast.info('Sleep schedule changes were not saved.')
    if (!open) setEditingSleepSchedule(null)
    setShowSleepScheduleModal(open)
  }

  const handleSaveSleepDraft = () => {
    const errors: string[] = []
    const changes: string[] = []
    const nextSchedules: SleepSchedule[] = []

    ALL_DAYS.forEach(day => {
      const draft = sleepDraft[day]
      if (!draft) return
      const existing = sleepSchedules.find(s => s.day === day)

      if (!draft.isActive) {
        if (existing) {
          nextSchedules.push({ ...existing, isActive: false })
          if (existing.isActive) changes.push(`${formatDayLabel(day)}: sleep turned off`)
        }
        return
      }

      const duration = calculateDuration(draft.bedtime, draft.wakeTime)
      if (!draft.bedtime || !draft.wakeTime || draft.bedtime === draft.wakeTime || duration <= 0) {
        errors.push(`${formatDayLabel(day)}: bedtime and wake time cannot be the same.`)
        return
      }

      const conflicts = findTasksInSleepWindow(day, draft.bedtime, draft.wakeTime)
      if (conflicts.length > 0) {
        errors.push(`${formatDayLabel(day)}: task ${conflicts.map(c => `"${c.title}"`).join(', ')} already scheduled.`)
        return
      }

      const schedule: SleepSchedule = {
        id: existing?.id ?? `sleep-${day}-${Date.now()}`,
        day, bedtime: draft.bedtime, wakeTime: draft.wakeTime,
        duration, isActive: true, color: existing?.color || '#4B5563',
        type: draft.type, notes: draft.notes.trim() ? draft.notes.trim() : undefined
      }
      nextSchedules.push(schedule)

      const label = `${formatDayLabel(day)}: ${formatTimeDisplay(draft.bedtime)} → ${formatTimeDisplay(draft.wakeTime)}`
      if (!existing || !existing.isActive) changes.push(`${label} — added`)
      else if (existing.bedtime !== schedule.bedtime || existing.wakeTime !== schedule.wakeTime ||
        existing.type !== schedule.type || (existing.notes || '') !== (schedule.notes || '')) {
        changes.push(`${label} — updated`)
      }
    })

    if (errors.length > 0) { showIssuesToast('Sleep schedule not saved', errors); return }
    if (changes.length === 0) {
      toast.info('No changes to save'); setSleepDraftDirty(false); setShowSleepScheduleModal(false); return
    }

    setSleepSchedules(nextSchedules)
    setSleepDraftDirty(false); setEditingSleepSchedule(null); setShowSleepScheduleModal(false)
    toast.success('Sleep schedule saved', {
      description: (<div className="space-y-1 mt-1">{changes.map((c, i) => <div key={i}>• {c}</div>)}</div>),
      duration: 8000
    })
  }

  // ============ LOCK / UNLOCK ============
  const handleLockTimetable = () => {
    if (!hasUnsavedChanges) { toast.info('No changes to save'); return }
    const issues = validateWholeTimetable()
    if (issues.length > 0) {
      setLockIssues(issues); setShowLockIssues(true)
      toast.error(`Fix ${issues.length} issue${issues.length > 1 ? 's' : ''} before locking`)
      return
    }
    setShowLockConfirm(true); setLockConfirmed(false)
  }

  const handleConfirmLock = () => {
    if (!lockConfirmed) { toast.error('Please confirm the lock will last for 1 week'); return }
    setShowLockConfirm(false); setShowLockProgress(true); setIsLocking(true)
    setLockProgress([{ step: 'Saving Timetable', status: 'in-progress', message: 'Preparing data...' }])
    executeLockSequence()
  }

  const handleUnlockTimetable = () => {
    setIsLocked(false); setLockSuccess(false)
    toast.success('Timetable unlocked')
  }

  const executeLockSequence = async () => {
    try {
      const payload = prepareLockPayload()
      setLockProgress([{ step: 'Saving Timetable', status: 'in-progress', message: 'Sending data to server...' }])
      const result = await lockTimetable(payload)
      if (result.success) {
        setLockProgress([{ step: 'Saving Timetable', status: 'completed', message: `Created ${result.data.totalItems} items` }])
        setIsLocking(false); setLockSuccess(true); setIsLocked(true); setHasUnsavedChanges(false)
        toast.success(result.message || 'Timetable locked successfully!')
        clearDraftLocally()
        await fetchFullTimeTable()
      } else {
        throw new Error(result.message || 'Failed to save timetable')
      }
    } catch (error) {
      console.error('Lock sequence failed:', error)
      setLockProgress([{
        step: 'Saving Timetable', status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }])
      setIsLocking(false)
      toast.error('Failed to save timetable. No changes were saved.')
    }
  }

  const prepareLockPayload = () => {
    const apiFixedTimes: any[] = fixedTimes.map(ft => ({
      clientId: ft.id, title: ft.title, description: ft.description, days: ft.days,
      startTime: ft.startTime, endTime: ft.endTime, type: ft.type, color: ft.color,
      isEditable: ft.isEditable ?? true,
      freePeriods: ft.freePeriods?.map(fp => ({
        title: fp.title, startTime: fp.startTime, endTime: fp.endTime, day: fp.day
      })) || []
    }))

    const apiSleepSchedules: any[] = sleepSchedules.map(s => ({
      day: s.day, bedtime: s.bedtime, wakeTime: s.wakeTime, duration: s.duration,
      isActive: s.isActive, type: s.type, notes: s.notes, color: s.color
    }))

    const apiTasks: any[] = tasks.filter(t => !t.isSleepTime).map(task => {
      const link = analyzePlacement(task.day, task.startTime, task.duration)
      const apiTask: any = {
        title: task.title, subject: task.subject, note: task.note,
        startTime: task.startTime,
        endTime: task.endTime === '24:00' ? '23:59' : task.endTime,
        duration: task.duration, priority: task.priority, color: task.color,
        day: task.day, type: mapUITypeToAPIType(task.type),
        category: task.category || 'ACADEMIC', status: task.status || 'PENDING'
      }
      const goalId = cleanId(task.goalId)
      const milestoneId = cleanId(task.milestoneId)
      if (goalId) apiTask.goalId = goalId
      if (milestoneId) apiTask.milestoneId = milestoneId
      if (link.fixedTimeId) apiTask.fixedTimeId = link.fixedTimeId
      if (task.completedAt) apiTask.completedAt = task.completedAt
      return apiTask
    })

    return { fixedTimes: apiFixedTimes, sleepSchedules: apiSleepSchedules, tasks: apiTasks }
  }

  const lockTimetable = async (payload: any): Promise<LockApiResponse> => {
    const token = getAuthToken()
    if (!token) throw new Error('Please login to save timetable')
    const response = await fetch(`${API_BASE_URL}/time-table/lock`, {
      method: 'POST',
      headers: { 'Authorization': token, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to lock timetable: ${response.status}`)
    }
    return await response.json()
  }

  const handleResetTimetable = async () => setShowResetConfirm(true)

  const confirmReset = async () => {
    setShowResetConfirm(false); setIsResetting(true)
    try {
      const token = getAuthToken()
      if (!token) { toast.error('Please login to reset timetable'); setIsResetting(false); return }
      const resetPayload: ResetPayload = {
        confirm: true, resetTasks: true, resetFixedTimes: true, resetSleepSchedules: true
      }
      const response = await fetch(`${API_BASE_URL}/time-table/reset`, {
        method: 'DELETE',
        headers: { 'Authorization': token, 'Content-Type': 'application/json' },
        body: JSON.stringify(resetPayload)
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to reset: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setTasks([]); setFixedTimes([]); setSleepSchedules([]); setHasUnsavedChanges(false)
        clearDraftLocally()
        toast.success(data.message || `Timetable reset successfully!`)
        await fetchFullTimeTable()
      } else {
        throw new Error(data.message || 'Failed to reset timetable')
      }
    } catch (error) {
      console.error('Error resetting timetable:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to reset timetable')
    } finally { setIsResetting(false) }
  }

  // ============ CELL HELPERS ============
  const getTasksForCell = (day: string, time: string) => {
    return tasks.filter(task => {
      if (task.day !== day) return false
      const taskStartMinutes = convertTimeToMinutes(task.startTime)
      const taskEndMinutes = task.endTime === '24:00' ? MINUTES_IN_DAY : convertTimeToMinutes(task.endTime)
      const cellMinutes = convertTimeToMinutes(time)
      // Task overlaps this cell if taskEnd > cellStart AND taskStart < cellEnd
      const cellEndMinutes = cellMinutes + timeSettings.interval
      return taskEndMinutes > cellMinutes && taskStartMinutes < cellEndMinutes
    })
  }

  const getNextTimeSlot = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + timeSettings.interval
    const nextHours = Math.floor(totalMinutes / 60) % 24
    const nextMinutes = totalMinutes % 60
    return `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`
  }

  const getTaskSpan = (task: TimeSlot) => {
    const startMinutes = convertTimeToMinutes(task.startTime)
    const endMinutes = task.endTime === '24:00' ? MINUTES_IN_DAY : convertTimeToMinutes(task.endTime)
    let duration = endMinutes - startMinutes
    if (duration < 0) duration += 24 * 60
    return Math.max(1, Math.ceil(duration / timeSettings.interval))
  }

  const isExtendedTime = (time: string) => {
    const [hours] = time.split(':').map(Number)
    if (timeSettings.extendedHours.morning && hours < 8) return true
    if (timeSettings.extendedHours.evening && hours >= 18 && hours < 22) return true
    if (timeSettings.extendedHours.night && hours >= 22) return true
    if (timeSettings.extendedHours.custom.includes(time)) return true
    return false
  }

  const getIconByType = (type: string) => {
    const fixedTimeType = FIXED_TIME_TYPES.find(t => t.id === type)
    if (fixedTimeType) {
      const Icon = fixedTimeType.icon
      return <Icon className="w-3 h-3" />
    }
    return <Clock className="w-3 h-3" />
  }

  const getTimeSlotColor = (type: string) => {
    switch(type) {
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

  const getSleepTypeInfo = (type: string) => SLEEP_TYPES.find(t => t.id === type) || SLEEP_TYPES[0]

  const getPriorityColor = (priority: Goal['priority']) => {
    switch(priority) {
      case 'CRITICAL': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      case 'HIGH': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
      case 'MEDIUM': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      case 'LOW': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    }
  }

  const scheduleItems = (items: Array<{ title: string; subject: string; priority: Goal['priority']; color: string; goalId: string; milestoneId?: string }>): TimeSlot[] => {
    const added: TimeSlot[] = []
    let failed = 0
    items.forEach(item => {
      const slot = findAvailableSlot(60, [...tasks, ...added])
      if (!slot) { failed += 1; return }
      added.push({
        id: newTaskId(), title: item.title, subject: item.subject,
        startTime: slot.time, endTime: calculateEndTime(slot.time, 60),
        duration: 60, priority: item.priority, color: item.color,
        day: slot.day, type: 'task', goalId: item.goalId, milestoneId: item.milestoneId,
        fixedCommitmentId: slot.link.fixedTimeId, freePeriodId: slot.link.freePeriodId,
        status: 'PENDING'
      })
    })
    if (added.length > 0) setTasks(prev => [...prev, ...added])
    if (failed > 0) toast.warning(`${failed} item${failed > 1 ? 's' : ''} could not be scheduled.`)
    return added
  }

  const handleScheduleMilestone = (goal: Goal, milestone: Milestone) => {
    setSelectedGoalForMilestone(null)
    const added = scheduleItems([{
      title: milestone.title, subject: goal.subject || goal.title,
      priority: goal.priority, color: goal.color,
      goalId: goal.id, milestoneId: milestone.id
    }])
    if (added.length > 0) {
      const t = added[0]
      toast.success(`Scheduled "${milestone.title}" for ${formatDayLabel(t.day)} at ${formatTimeDisplay(t.startTime)}`)
    }
  }

  const getDaysUntilDeadline = (targetDate: Date) => {
    const today = new Date()
    const deadline = new Date(targetDate)
    const diffTime = deadline.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleSaveTimeSettings = () => {
    setTimeSlots(generateTimeSlots())
    setShowTimeSettingsModal(false)
    toast.success('Display settings updated')
  }

  const toggleWeekends = () => {
    setTimeSettings({ ...timeSettings, showWeekends: !timeSettings.showWeekends })
  }

  const handleExtendTime = (extensionType: 'morning' | 'evening' | 'night' | 'custom', customSlots?: string[]) => {
    const updatedExtendedHours = { ...timeSettings.extendedHours }
    switch(extensionType) {
      case 'morning': updatedExtendedHours.morning = !updatedExtendedHours.morning; break
      case 'evening': updatedExtendedHours.evening = !updatedExtendedHours.evening; break
      case 'night': updatedExtendedHours.night = !updatedExtendedHours.night; break
      case 'custom': if (customSlots) updatedExtendedHours.custom = customSlots; break
    }
    setTimeSettings({ ...timeSettings, extendedHours: updatedExtendedHours })
    if (extensionType === 'custom') setShowTimeExtensionModal(false)
  }

  const handleAddCustomTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      const updatedCustom = [...timeSettings.extendedHours.custom, time]
        .filter((slot, index, self) => self.indexOf(slot) === index)
        .sort((a, b) => {
          const [aH, aM] = a.split(':').map(Number)
          const [bH, bM] = b.split(':').map(Number)
          return (aH * 60 + aM) - (bH * 60 + bM)
        })
      handleExtendTime('custom', updatedCustom)
      toast.success(`Added custom time slot: ${formatTimeDisplay(time)}`)
    }
  }

  const handleRemoveCustomTime = (time: string) => {
    const updatedCustom = timeSettings.extendedHours.custom.filter(slot => slot !== time)
    handleExtendTime('custom', updatedCustom)
    toast.success(`Removed custom time slot: ${formatTimeDisplay(time)}`)
  }

  const handleExportPDF = () => toast.info('PDF export functionality will be implemented soon')
  const handlePrint = () => window.print()

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Timetable', text: 'Check out my weekly schedule!', url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const sleepStats = getSleepStats()

  const taskDialogError: string | undefined = taskCreationContext
    ? analyzePlacement(newTask.day, newTask.startTime, newTask.duration).error
    : undefined
  const editTaskError: string | undefined = showAddTaskModal
    ? analyzePlacement(newTask.day, newTask.startTime, newTask.duration).error
    : undefined

  // ============================================================
  // NEW LAYOUT: Tasks positioned by their ACTUAL time within the cell
  // ============================================================
  /**
   * For a given day cell starting at `cellTime` with duration `interval` minutes,
   * this returns every task that OVERLAPS the cell window, along with its
   * position (in % of the cell) and lane index (to avoid overlap).
   */
  const getCellLayout = (day: string, cellTime: string) => {
    const cellStart = convertTimeToMinutes(cellTime)
    const cellEnd = cellStart + timeSettings.interval

    // All non-sleep tasks that overlap this cell
    const overlapping = tasks
      .filter(t => {
        if (t.isSleepTime || t.day !== day) return false
        const s = convertTimeToMinutes(t.startTime)
        const e = t.endTime === '24:00' ? MINUTES_IN_DAY : convertTimeToMinutes(t.endTime)
        return e > cellStart && s < cellEnd
      })
      .sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))

    if (overlapping.length === 0) return { items: [], lanes: 0 }

    // Assign lanes to avoid visual overlap: tasks that overlap in time must be
    // on different lanes.
    type Item = { task: TimeSlot; lane: number; leftPct: number; widthPct: number }
    const items: Item[] = []

    for (const task of overlapping) {
      const s = Math.max(convertTimeToMinutes(task.startTime), cellStart)
      const e = Math.min(task.endTime === '24:00' ? MINUTES_IN_DAY : convertTimeToMinutes(task.endTime), cellEnd)
      const leftPct = ((s - cellStart) / timeSettings.interval) * 100
      const widthPct = Math.max(((e - s) / timeSettings.interval) * 100, 6)

      // Find a lane where this task does not overlap any existing item
      let lane = 0
      while (true) {
        const laneItems = items.filter(i => i.lane === lane)
        const overlapsLane = laneItems.some(i => {
          const is = convertTimeToMinutes(i.task.startTime)
          const ie = i.task.endTime === '24:00' ? MINUTES_IN_DAY : convertTimeToMinutes(i.task.endTime)
          return s < ie && e > is
        })
        if (!overlapsLane) break
        lane++
      }

      items.push({ task, lane, leftPct, widthPct })
    }

    const lanes = Math.max(...items.map(i => i.lane)) + 1
    return { items, lanes }
  }

  // ============================================================
  // TimeCell — desktop grid cell
  // ============================================================
  const TimeCell = ({ day, time, cellWidth }: { day: string; time: string; cellWidth: number }) => {
    const fixedTime = isTimeInFixedSlot(day, time)
    const freePeriodInfo = isTimeInFreePeriod(day, time)
    const sleepTask = tasks.find(t =>
      t.day === day && t.isSleepTime &&
      convertTimeToMinutes(t.startTime) <= convertTimeToMinutes(time) &&
      (t.endTime === '24:00' ? MINUTES_IN_DAY : convertTimeToMinutes(t.endTime)) > convertTimeToMinutes(time)
    )

    const { items, lanes } = getCellLayout(day, time)
    const isSleepTime = !!sleepTask
    const isFreePeriod = !!freePeriodInfo
    const hasRegular = items.length > 0

    const laneHeight = lanes > 0 ? (timeSettings.cellHeight - 4) / lanes : 0

    return (
      <div
        className={cn(
          "relative border-r border-b border-gray-200 dark:border-gray-700 group transition-all duration-150",
          fixedTime && !isFreePeriod ? getTimeSlotColor(fixedTime.type) : undefined,
          isFreePeriod && "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
          isExtendedTime(time) && !fixedTime && !isSleepTime && "bg-yellow-50/30 dark:bg-yellow-900/10",
          isSleepTime && !hasRegular && "bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700",
          "hover:bg-gray-50 dark:hover:bg-gray-800/50"
        )}
        style={{
          height: `${timeSettings.cellHeight}px`,
          width: `${cellWidth}px`,
          minWidth: `${cellWidth}px`,
          maxWidth: `${cellWidth}px`
        }}
        onClick={() => handleCellClick(day, time)}
      >
        {/* Background labels when cell is empty */}
        {isExtendedTime(time) && !fixedTime && !hasRegular && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-[10px] text-yellow-600 dark:text-yellow-400 opacity-30">Extended</div>
          </div>
        )}

        {(time === '00:00' || time === '24:00') && !fixedTime && !hasRegular && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-[10px] text-purple-600 dark:text-purple-400 opacity-30">
              {time === '00:00' ? 'Start of Day' : 'End of Day'}
            </div>
          </div>
        )}

        {/* Fixed commitment band */}
        {fixedTime && !isFreePeriod && !hasRegular && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center p-0.5 cursor-pointer pointer-events-none">
            <div className="text-[10px] font-medium text-center truncate px-0.5 text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-center gap-0.5">
                {getIconByType(fixedTime.type)}
                <span className="truncate max-w-[80px]">{fixedTime.title}</span>
              </div>
              <div className="text-[8px] text-gray-500 dark:text-gray-400 mt-0.5">Fixed</div>
            </div>
          </div>
        )}

        {/* Free period */}
        {isFreePeriod && !hasRegular && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center p-0.5 cursor-pointer pointer-events-none">
            <div className="text-[10px] font-medium text-center truncate px-0.5 text-green-700 dark:text-green-400">
              <div className="flex items-center justify-center gap-0.5">
                <Coffee className="w-2.5 h-2.5" />
                <span>Free</span>
              </div>
            </div>
          </div>
        )}

        {/* Sleep band — full width */}
        {isSleepTime && sleepTask && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute inset-x-0.5 top-0.5 bottom-0.5 rounded border-l-4 flex items-center justify-center opacity-70"
              style={{
                borderLeftColor: sleepTask.color,
                backgroundColor: `${sleepTask.color}15`
              }}
            >
              <div className="text-[9px] font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <Moon className="w-2.5 h-2.5" />
                <span>Sleep</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TASKS LAYERED BY THEIR ACTUAL TIME AND DURATION
            ============================================================ */}
        {items.map(({ task, lane, leftPct, widthPct }) => {
          const isMilestone = !!task.milestoneId
          const topPx = 2 + lane * laneHeight
          const heightPx = Math.max(laneHeight - 2, 16)
          const widthPx = (widthPct / 100) * cellWidth

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "absolute rounded border shadow-sm z-40 overflow-hidden cursor-pointer bg-white dark:bg-gray-800",
                "hover:shadow-md hover:z-50 transition-all",
                task.fixedCommitmentId && "border-green-400 dark:border-green-600",
                isMilestone && "border-purple-400 dark:border-purple-600"
              )}
              style={{
                top: `${topPx}px`,
                left: `calc(${leftPct}% + 1px)`,
                width: `calc(${widthPct}% - 2px)`,
                height: `${heightPx}px`,
                minWidth: '30px',
                borderLeft: `3px solid ${task.color}`,
                backgroundColor: `${task.color}18`,
              }}
              title={`${task.title} · ${formatTimeShort(task.startTime)}–${formatTimeShort(task.endTime)}`}
              onClick={(e) => {
                e.stopPropagation()
                handleEditTask(task)
              }}
            >
              <div className="p-0.5 h-full flex flex-col justify-center">
                <div className="flex items-center gap-0.5 min-w-0">
                  <h4 className="text-[9px] font-semibold truncate dark:text-gray-200 leading-tight">
                    {task.title}
                  </h4>
                  {task.fixedCommitmentId && (
                    <Badge variant="outline" className="text-[5px] px-0.5 py-0 bg-green-100 dark:bg-green-900/30 text-green-700 border-green-200 flex-shrink-0">
                      FP
                    </Badge>
                  )}
                  {isMilestone && (
                    <Badge variant="outline" className="text-[5px] px-0.5 py-0 bg-purple-100 dark:bg-purple-900/30 text-purple-700 border-purple-200 flex-shrink-0">
                      M
                    </Badge>
                  )}
                </div>
                <div className="text-[7px] text-gray-600 dark:text-gray-400 truncate">
                  {formatTimeShort(task.startTime)}–{formatTimeShort(task.endTime)} · {task.duration}m
                </div>
              </div>

              {/* Dropdown menu on hover - placed outside flow */}
              {!isLocked && (
                <div className="absolute top-0 right-0 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <button className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreVertical className="w-2.5 h-2.5 text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[120px] dark:bg-gray-800 dark:border-gray-700">
                      <DropdownMenuItem onClick={() => handleEditTask(task)} className="text-xs dark:text-gray-300 dark:hover:bg-gray-700">
                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateTask(task)} className="text-xs dark:text-gray-300 dark:hover:bg-gray-700">
                        <Copy className="w-3 h-3 mr-1" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-xs text-red-600 dark:text-red-400 dark:hover:bg-gray-700">
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </motion.div>
          )
        })}

        {/* Multi-task badge */}
        {items.length > 1 && (
          <div className="absolute bottom-0.5 right-0.5 z-50 pointer-events-none">
            <Badge variant="outline" className="text-[8px] px-1 py-0 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
              {items.length} tasks
            </Badge>
          </div>
        )}

        {/* Hover + button */}
        {!isLocked && !fixedTime && !hasRegular && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80 pointer-events-none">
            <button
              className="pointer-events-auto p-1 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md"
              onClick={(e) => { e.stopPropagation(); handleCellClick(day, time) }}
              title="Add Task"
            >
              <Plus className="w-2.5 h-2.5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>
    )
  }

  // ============================================================
  // Desktop grid
  // ============================================================
  const renderTimetableGrid = () => {
    const cellWidth = 140

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your timetable...</p>
          </div>
        </div>
      )
    }

    if (fixedTimes.length === 0 && tasks.length === 0 && sleepSchedules.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">No Timetable Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start by adding fixed commitments or tasks to build your schedule.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => setShowAddFixedTimeModal(true)}>
              <Clock className="w-4 h-4 mr-2" /> Add Fixed Commitment
            </Button>
            <Button variant="outline" onClick={() => openTaskDialog(days[0], timeSlots[0])}>
              <Plus className="w-4 h-4 mr-2" /> Add Task
            </Button>
          </div>
        </div>
      )
    }

    if (timeSettings.displayMode === 'vertical') {
      return (
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <div className="inline-block min-w-full">
            <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
              <div className="flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4" style={{ width: cellWidth }}>
                <div className="font-bold text-gray-900 dark:text-gray-100">Time</div>
              </div>
              {days.map((day) => (
                <div key={day}
                  className={cn("flex-shrink-0 p-4 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0",
                    ['SATURDAY', 'SUNDAY'].includes(day) ? "bg-blue-50 dark:bg-blue-900/30" : "bg-white dark:bg-gray-800")}
                  style={{ width: cellWidth }}>
                  <div className="flex flex-col items-center gap-1">
                    <span className={cn("font-bold text-sm", ['SATURDAY', 'SUNDAY'].includes(day) && "text-blue-700 dark:text-blue-300")}>
                      {formatDayLabel(day)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {['SATURDAY', 'SUNDAY'].includes(day) ? "Weekend" : "Weekday"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex">
              <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-r-2 border-gray-300 dark:border-gray-700" style={{ width: cellWidth }}>
                {timeSlots.map((time) => (
                  <div key={time}
                    className={cn("flex items-center justify-center relative border-b border-gray-200 dark:border-gray-700",
                      isExtendedTime(time) && "bg-yellow-50 dark:bg-yellow-900/20",
                      time === '00:00' && "bg-purple-50 dark:bg-purple-900/20",
                      time === '24:00' && "bg-purple-50 dark:bg-purple-900/20")}
                    style={{ height: `${timeSettings.cellHeight}px` }}>
                    <div className={cn("text-xs font-semibold px-2 py-1 rounded-lg shadow-sm",
                      isExtendedTime(time) ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100" :
                      time === '00:00' || time === '24:00' ? "bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100" :
                      "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300")}>
                      {formatTimeDisplay(time)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex bg-white dark:bg-gray-800">
                {days.map(day => (
                  <div key={day} className="flex-shrink-0 flex flex-col relative" style={{ width: cellWidth }}>
                    {timeSlots.map((time) => (
                      <TimeCell key={`${day}-${time}`} day={day} time={time} cellWidth={cellWidth} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <div className="inline-block min-w-full">
            <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
              <div className="flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4" style={{ width: cellWidth }}>
                <div className="font-bold text-gray-900 dark:text-gray-100">Day / Time</div>
              </div>
              {timeSlots.map((time, index) => (
                <div key={time}
                  className={cn("flex-shrink-0 p-2 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0",
                    isExtendedTime(time) ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-gray-50 dark:bg-gray-900",
                    time === '00:00' && "bg-purple-50 dark:bg-purple-900/20",
                    time === '24:00' && "bg-purple-50 dark:bg-purple-900/20")}
                  style={{ width: cellWidth }}>
                  <div className="flex flex-col items-center gap-1">
                    <span className={cn("font-bold text-xs",
                      isExtendedTime(time) ? "text-yellow-800 dark:text-yellow-100" : "text-gray-900 dark:text-gray-100",
                      time === '00:00' && "text-purple-800 dark:text-purple-100",
                      time === '24:00' && "text-purple-800 dark:text-purple-100")}>
                      {formatTimeDisplay(time)}
                    </span>
                    {index < timeSlots.length - 1 && (
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        to {formatTimeDisplay(getNextTimeSlot(time))}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              {days.map((day) => (
                <div key={day} className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center p-4"
                    style={{ width: cellWidth, height: `${timeSettings.cellHeight}px` }}>
                    <div className="text-center">
                      <div className={cn("font-bold text-sm", ['SATURDAY', 'SUNDAY'].includes(day) && "text-blue-700 dark:text-blue-300")}>
                        {formatDayLabel(day)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {['SATURDAY', 'SUNDAY'].includes(day) ? "Weekend" : "Weekday"}
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    {timeSlots.map((time) => (
                      <TimeCell key={`${day}-${time}`} day={day} time={time} cellWidth={cellWidth} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  }

  // ============================================================
  // Mobile helpers
  // ============================================================
  const renderMobileDayStrip = () => (
    <div className="sticky top-14 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 -mx-4 px-4 py-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {days.map((day) => {
          const dayTaskCount = tasks.filter(t => t.day === day && !t.isSleepTime).length
          const isSelected = mobileSelectedDay === day
          return (
            <button key={day} onClick={() => setMobileSelectedDay(day)}
              className={cn("flex-shrink-0 flex flex-col items-center justify-center min-w-[56px] h-14 rounded-xl transition-all active:scale-95",
                isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300")}>
              <span className="text-[10px] font-medium uppercase opacity-80">{formatDayShort(day)}</span>
              <span className={cn("text-sm font-bold mt-0.5", isSelected ? "text-white" : "")}>{dayTaskCount}</span>
            </button>
          )
        })}
      </div>
    </div>
  )

  const renderMobileTimetable = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      )
    }

    if (fixedTimes.length === 0 && tasks.length === 0 && sleepSchedules.length === 0) {
      return (
        <div className="text-center py-12 px-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Your timetable is empty</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs mx-auto">
            Start by adding a fixed commitment, or tap + to add a task
          </p>
          <Button onClick={() => setShowAddFixedTimeModal(true)} className="gap-2">
            <Clock className="w-4 h-4" /> Add Fixed Commitment
          </Button>
        </div>
      )
    }

    const dayTasks = tasks.filter(t => t.day === mobileSelectedDay)
    const dayFixed = fixedTimes.filter(ft => ft.days.includes(mobileSelectedDay))
    const daySleep = sleepSchedules.filter(s => s.day === mobileSelectedDay && s.isActive)

    return (
      <div className="pb-4">
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-none">
          <div className="flex-shrink-0 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40">
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              {dayTasks.filter(t => !t.isSleepTime).length} tasks
            </span>
          </div>
          {dayFixed.length > 0 && (
            <div className="flex-shrink-0 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40">
              <span className="text-xs font-medium text-orange-700 dark:text-orange-300">{dayFixed.length} fixed</span>
            </div>
          )}
          {daySleep.length > 0 && (
            <div className="flex-shrink-0 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {Math.floor(daySleep[0].duration / 60)}h sleep
              </span>
            </div>
          )}
        </div>

        <div className="relative px-4">
          {timeSlots.map((time, idx) => {
            const fixedTime = isTimeInFixedSlot(mobileSelectedDay, time)
            const freePeriodInfo = isTimeInFreePeriod(mobileSelectedDay, time)
            const { items } = getCellLayout(mobileSelectedDay, time)
            const sleepTask = tasks.find(t =>
              t.day === mobileSelectedDay && t.isSleepTime &&
              convertTimeToMinutes(t.startTime) <= convertTimeToMinutes(time) &&
              (t.endTime === '24:00' ? MINUTES_IN_DAY : convertTimeToMinutes(t.endTime)) > convertTimeToMinutes(time)
            )
            const isFreePeriod = !!freePeriodInfo
            const isLast = idx === timeSlots.length - 1

            const shouldShow = items.length > 0 || !!fixedTime || !!sleepTask || isFreePeriod ||
              time === '00:00' || time === '24:00'

            if (!shouldShow) return null

            return (
              <div key={time} className="flex gap-3 relative">
                <div className="flex-shrink-0 w-14 pt-2 pb-2 text-right">
                  <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 leading-tight">
                    {formatTimeShort(time)}
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-center relative">
                  <div className={cn("w-2.5 h-2.5 rounded-full mt-3.5 z-10 ring-4",
                    items.length > 0 ? "bg-blue-500 ring-blue-100 dark:ring-blue-900/40" :
                    fixedTime ? "bg-orange-400 ring-orange-100 dark:ring-orange-900/40" :
                    sleepTask ? "bg-gray-400 ring-gray-100 dark:ring-gray-800" :
                    "bg-gray-300 dark:bg-gray-600 ring-gray-100 dark:ring-gray-800")} />
                  {!isLast && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-800 -mt-1" />}
                </div>

                <div className="flex-1 min-w-0 pb-3 pt-2 space-y-2">
                  {fixedTime && !isFreePeriod && (
                    <button onClick={() => handleFixedTimeClick(fixedTime)}
                      className={cn("w-full text-left p-2.5 rounded-xl border active:scale-[0.98] transition", getTimeSlotColor(fixedTime.type))}>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: `${fixedTime.color}30` }}>
                          {getIconByType(fixedTime.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{fixedTime.title}</div>
                          <div className="text-[11px] text-gray-600 dark:text-gray-400">
                            {formatTimeShort(fixedTime.startTime)} – {formatTimeShort(fixedTime.endTime)} · Fixed
                          </div>
                        </div>
                      </div>
                    </button>
                  )}

                  {isFreePeriod && (
                    <button onClick={() => handleCellClick(mobileSelectedDay, time)}
                      className="w-full text-left p-2.5 rounded-xl border border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-900/20 active:scale-[0.98]">
                      <div className="flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-green-700 dark:text-green-300">
                            {freePeriodInfo?.freePeriod?.title || 'Free Period'}
                          </div>
                          <div className="text-[11px] text-green-600 dark:text-green-400">Tap to add a task</div>
                        </div>
                      </div>
                    </button>
                  )}

                  {sleepTask && (
                    <button onClick={() => {
                      const schedule = sleepSchedules.find(s => s.id === sleepTask.sleepScheduleId)
                      if (schedule) { setEditingSleepSchedule(schedule); setShowSleepScheduleModal(true) }
                    }}
                      className="w-full text-left p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100/80 dark:bg-gray-800/60 active:scale-[0.98]">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{sleepTask.title}</div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400">
                            {formatTimeShort(sleepTask.startTime)} – {formatTimeShort(sleepTask.endTime)}
                          </div>
                        </div>
                      </div>
                    </button>
                  )}

                  {/* ====== ALL TASKS IN THIS TIME WINDOW ====== */}
                  {items.map(({ task }) => {
                    const goal = task.goalId ? goals.find(g => g.id === task.goalId) : null
                    const milestone = task.milestoneId && goal ? goal.milestones.find(m => m.id === task.milestoneId) : null
                    return (
                      <button key={task.id} onClick={() => handleEditTask(task)}
                        className="w-full text-left p-3 rounded-xl border bg-white dark:bg-gray-800 shadow-sm active:scale-[0.98] transition border-l-4"
                        style={{ borderLeftColor: task.color, backgroundColor: `${task.color}12` }}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{task.title}</h4>
                              {task.fixedCommitmentId && (
                                <Badge variant="outline" className="text-[9px] px-1 py-0 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 flex-shrink-0">
                                  FP
                                </Badge>
                              )}
                              {milestone && (
                                <Badge variant="outline" className="text-[9px] px-1 py-0 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 flex-shrink-0">
                                  M
                                </Badge>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-600 dark:text-gray-400">
                              {formatTimeShort(task.startTime)} – {formatTimeShort(task.endTime)}
                              {task.subject && ` · ${task.subject}`}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <Badge variant="outline"
                              className={cn("text-[9px] px-1.5 py-0",
                                task.priority === 'CRITICAL' ? 'text-red-600 border-red-300 dark:text-red-400 dark:border-red-700' :
                                task.priority === 'HIGH' ? 'text-orange-600 border-orange-300 dark:text-orange-400 dark:border-orange-700' :
                                task.priority === 'MEDIUM' ? 'text-yellow-600 border-yellow-300 dark:text-yellow-400 dark:border-yellow-700' :
                                'text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-700')}>
                              {task.priority.charAt(0)}
                            </Badge>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">{task.duration}m</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}

                  {items.length === 0 && !fixedTime && !sleepTask && !isFreePeriod &&
                    time !== '24:00' && convertTimeToMinutes(time) < MINUTES_IN_DAY && (
                    <button onClick={() => handleCellClick(mobileSelectedDay, time)}
                      className="w-full text-left p-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-800/50">
                      <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                        <Plus className="w-3.5 h-3.5" />
                        <span className="text-xs">Add task at {formatTimeShort(time)}</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderMobileBottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {[
          { id: 'timetable', label: 'Schedule', icon: CalendarDays },
          { id: 'tasks', label: 'Tasks', icon: List },
          { id: 'goals', label: 'Goals', icon: Target },
          { id: 'sleep', label: 'Sleep', icon: Bed },
          { id: 'settings', label: 'More', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon
          const isActive = mobileTab === tab.id
          return (
            <button key={tab.id} onClick={() => setMobileTab(tab.id as any)}
              className={cn("flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors active:scale-95",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400")}>
              <div className={cn("p-1.5 rounded-lg transition-colors", isActive && "bg-blue-50 dark:bg-blue-900/30")}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )

  const renderMobileFAB = () => (
    <button onClick={() => {
      if (mobileTab === 'timetable') openTaskDialog(mobileSelectedDay, '09:00')
      else if (mobileTab === 'goals') setShowGoalsModal(true)
      else if (mobileTab === 'sleep') setShowSleepScheduleModal(true)
      else openTaskDialog(mobileSelectedDay, '09:00')
    }}
      className="fixed right-4 z-40 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center active:scale-95 transition-transform"
      style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
      aria-label="Add">
      <Plus className="w-6 h-6" />
    </button>
  )

  const renderMobileStats = () => {
    const stats = [
      { label: 'Hours', value: `${(tasks.filter(t => !t.isSleepTime).reduce((sum, task) => sum + task.duration, 0) / 60).toFixed(1)}h`, icon: Clock, color: 'text-gray-600 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-800' },
      { label: 'Tasks', value: tasks.filter(t => !t.isSleepTime).length.toString(), icon: Grid, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
      { label: 'Goals', value: `${tasks.filter(t => t.goalId).length}/${goals.length}`, icon: Target, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
      { label: 'Sleep', value: `${sleepStats.totalSleepHours.toFixed(1)}h`, icon: Moon, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
      { label: 'Fixed', value: fixedTimes.length.toString(), icon: Clock, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' }
    ]
    return (
      <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 pb-2 pt-2">
        {stats.map((stat, i) => (
          <div key={i} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className={`p-1.5 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderMobileTasksView = () => (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Tasks</h2>
        <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
          {tasks.filter(t => !t.isSleepTime).length} total
        </Badge>
      </div>

      {tasks.filter(t => !t.isSleepTime).length === 0 ? (
        <div className="text-center py-12">
          <List className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No tasks yet</p>
          <Button onClick={() => openTaskDialog(mobileSelectedDay, '09:00')} size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Add Task
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.filter(t => !t.isSleepTime)
            .sort((a, b) => {
              const dayOrder = ALL_DAYS.indexOf(a.day) - ALL_DAYS.indexOf(b.day)
              if (dayOrder !== 0) return dayOrder
              return convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime)
            })
            .map(task => {
              const goal = task.goalId ? goals.find(g => g.id === task.goalId) : null
              return (
                <div key={task.id}
                  className="p-3 rounded-xl border bg-white dark:bg-gray-800 border-l-4 border-gray-200 dark:border-gray-700"
                  style={{ borderLeftColor: task.color }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{task.title}</h4>
                      <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                        {formatDayShort(task.day)} · {formatTimeShort(task.startTime)} – {formatTimeShort(task.endTime)}
                      </div>
                      {goal && (
                        <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5">Goal: {goal.title}</div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                        <DropdownMenuItem onClick={() => handleEditTask(task)} className="text-xs dark:text-gray-300 dark:hover:bg-gray-700">
                          <Edit2 className="w-3 h-3 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTask(task)} className="text-xs dark:text-gray-300 dark:hover:bg-gray-700">
                          <Copy className="w-3 h-3 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-xs text-red-600 dark:text-red-400 dark:hover:bg-gray-700">
                          <Trash2 className="w-3 h-3 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )

  const renderMobileGoalsView = () => (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Goals</h2>
        <Button size="sm" variant="outline" onClick={() => setShowGoalsModal(true)} className="gap-1.5 dark:border-gray-700 dark:text-gray-300">
          <Zap className="w-3.5 h-3.5" /> Auto-schedule
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No goals yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map(goal => (
            <div key={goal.id} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: goal.color }} />
                  <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{goal.title}</h4>
                </div>
                <Badge className={cn("text-[10px] flex-shrink-0", getPriorityColor(goal.priority))}>
                  {goal.priority}
                </Badge>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400 mb-1">
                  <span>{goal.progress}% complete</span>
                  <span>{goal.completedHours.toFixed(1)}/{goal.totalHours}h</span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${goal.progress}%`, backgroundColor: goal.color }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{goal.milestones.length} milestones</span>
                <Button size="sm" variant="outline" className="h-7 px-2 text-xs dark:border-gray-700 dark:text-gray-300"
                  onClick={() => setSelectedGoalForMilestone(goal)}>
                  <Calendar className="w-3 h-3 mr-1" /> Schedule
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderMobileSleepView = () => (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sleep Schedule</h2>
        <Button size="sm" onClick={() => setShowSleepScheduleModal(true)} className="gap-1.5">
          <Settings className="w-3.5 h-3.5" /> Adjust
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800/40">
          <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{sleepStats.avgSleepHours.toFixed(1)}h</div>
          <div className="text-[11px] text-gray-600 dark:text-gray-400">Avg per night</div>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800/40">
          <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{sleepStats.daysWithSleep}/7</div>
          <div className="text-[11px] text-gray-600 dark:text-gray-400">Days scheduled</div>
        </div>
      </div>

      <div className="space-y-2">
        {ALL_DAYS.map(day => {
          const schedule = sleepSchedules.find(s => s.day === day)
          const isActive = schedule?.isActive
          return (
            <div key={day} className={cn("p-3 rounded-xl border flex items-center justify-between",
              isActive ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
              : "bg-gray-50/50 dark:bg-gray-800/20 border-gray-100 dark:border-gray-800")}>
              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatDayLabel(day)}</div>
                {isActive && schedule ? (
                  <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                    {formatTimeShort(schedule.bedtime)} – {formatTimeShort(schedule.wakeTime)} · {Math.floor(schedule.duration / 60)}h {schedule.duration % 60}m
                  </div>
                ) : (
                  <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Not scheduled</div>
                )}
              </div>
              {isActive ? (
                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px]">Active</Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] dark:border-gray-700 dark:text-gray-500">Off</Badge>
              )}
            </div>
          )
        })}
      </div>

      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40">
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-0.5">Tip</div>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 leading-relaxed">
              Most adults need 7-9 hours of sleep. Keep a consistent schedule even on weekends.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMobileSettingsView = () => (
    <div className="px-4 py-4 space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">More Options</h2>

      {/* LOCK BUTTON — prominent on mobile */}
      <button
        onClick={isLocked ? handleUnlockTimetable : handleLockTimetable}
        disabled={isLocking}
        className={cn(
          "w-full p-4 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition shadow-sm",
          isLocked
            ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
            : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
        )}
      >
        <div className="p-2.5 rounded-xl bg-white/20">
          {isLocked ? <Unlock className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-white" />}
        </div>
        <div className="text-left flex-1">
          <div className="text-base font-bold">
            {isLocked ? 'Unlock Timetable' : 'Lock Timetable'}
          </div>
          <div className="text-xs opacity-90">
            {isLocked ? 'Make changes again' : 'Save & lock for 1 week'}
          </div>
        </div>
        {isLocking && <Loader2 className="w-5 h-5 animate-spin text-white" />}
        {!isLocking && <ArrowRight className="w-5 h-5 text-white" />}
      </button>

      <button onClick={() => setShowAddFixedTimeModal(true)}
        className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-3 active:scale-[0.98]">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30"><Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Add Fixed Commitment</div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">College, office, gym etc.</div>
        </div>
      </button>

      <button onClick={() => setShowTimeSettingsModal(true)}
        className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-3 active:scale-[0.98]">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30"><Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" /></div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Display Settings</div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">Time range, interval, weekends</div>
        </div>
      </button>

      <button onClick={() => setShowTimeExtensionModal(true)}
        className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-3 active:scale-[0.98]">
        <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30"><PlusCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" /></div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Extend Time Slots</div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">Add early morning or late night</div>
        </div>
      </button>

      <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />

      <button onClick={handleShare}
        className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-3 active:scale-[0.98]">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"><Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" /></div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Share Timetable</div>
        </div>
      </button>

      <button onClick={handlePrint}
        className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-3 active:scale-[0.98]">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"><Printer className="w-4 h-4 text-gray-600 dark:text-gray-400" /></div>
        <div className="text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Print</div>
        </div>
      </button>

      <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />

      <button onClick={handleResetTimetable} disabled={isLocking || isResetting}
        className="w-full p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 flex items-center gap-3 active:scale-[0.98]">
        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40"><RefreshCw className="w-4 h-4 text-red-600 dark:text-red-400" /></div>
        <div className="text-left flex-1">
          <div className="text-sm font-medium text-red-800 dark:text-red-300">Reset Timetable</div>
          <div className="text-[11px] text-red-600 dark:text-red-400">Delete everything permanently</div>
        </div>
        {isResetting && <Loader2 className="w-4 h-4 animate-spin text-red-600" />}
      </button>
    </div>
  )

  // ============================================================
  // Mobile header — WITH prominent Lock button
  // ============================================================
  const renderMobileHeader = () => (
    <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 h-14 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0">
            <CalendarDays className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">Timetable</h1>
            <div className="flex items-center gap-1.5 -mt-0.5">
              {isLocked ? (
                <span className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              ) : hasUnsavedChanges ? (
                <span className="text-[10px] text-yellow-600 dark:text-yellow-400 flex items-center gap-0.5">
                  <AlertCircle className="w-2.5 h-2.5" /> Unsaved
                </span>
              ) : (
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  {tasks.filter(t => !t.isSleepTime).length} tasks
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Prominent LOCK / UNLOCK button in header */}
          <button
            onClick={isLocked ? handleUnlockTimetable : handleLockTimetable}
            disabled={isLocking}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95",
              isLocked
                ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                : "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
            )}
            aria-label={isLocked ? 'Unlock' : 'Lock'}
          >
            {isLocking ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isLocked ? (
              <Unlock className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
            <span>{isLocked ? 'Unlock' : 'Lock'}</span>
          </button>

          <button onClick={toggleDarkMode}
            className="p-2 rounded-lg active:bg-gray-100 dark:active:bg-gray-800" aria-label="Toggle dark mode">
            {darkMode ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
          </button>
          <button onClick={() => setShowMobileMoreSheet(true)}
            className="p-2 rounded-lg active:bg-gray-100 dark:active:bg-gray-800" aria-label="More options">
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  )

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200",
      isMobile ? "pb-20" : "p-4 md:p-6")}
      style={isMobile ? { minHeight: '100dvh' } : undefined}>

      {isMobile ? (
        <>
          {renderMobileHeader()}

          {mobileTab === 'timetable' && (
            <>
              {renderMobileStats()}
              {renderMobileDayStrip()}
              {renderMobileTimetable()}
            </>
          )}
          {mobileTab === 'tasks' && renderMobileTasksView()}
          {mobileTab === 'goals' && renderMobileGoalsView()}
          {mobileTab === 'sleep' && renderMobileSleepView()}
          {mobileTab === 'settings' && renderMobileSettingsView()}

          {renderMobileFAB()}
          {renderMobileBottomNav()}

          <Sheet open={showMobileMoreSheet} onOpenChange={setShowMobileMoreSheet}>
            <SheetContent side="right" className="w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
              <SheetHeader>
                <SheetTitle className="text-left dark:text-gray-100">Quick Actions</SheetTitle>
                <SheetDescription className="text-left text-xs dark:text-gray-400">Common actions</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-1.5">
                <button onClick={() => { isLocked ? handleUnlockTimetable() : handleLockTimetable(); setShowMobileMoreSheet(false) }}
                  className="w-full p-3 rounded-xl flex items-center gap-3 active:bg-gray-100 dark:active:bg-gray-800">
                  {isLocked ? <Unlock className="w-4 h-4 text-green-500" /> : <Lock className="w-4 h-4 text-blue-500" />}
                  <span className="text-sm dark:text-gray-200">{isLocked ? 'Unlock Timetable' : 'Lock Timetable'}</span>
                </button>
                <button onClick={() => { setShowAddFixedTimeModal(true); setShowMobileMoreSheet(false) }}
                  className="w-full p-3 rounded-xl flex items-center gap-3 active:bg-gray-100 dark:active:bg-gray-800">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm dark:text-gray-200">Add Fixed Commitment</span>
                </button>
                <button onClick={() => { setShowGoalsModal(true); setShowMobileMoreSheet(false) }}
                  className="w-full p-3 rounded-xl flex items-center gap-3 active:bg-gray-100 dark:active:bg-gray-800">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm dark:text-gray-200">Schedule Goals</span>
                </button>
                <button onClick={() => { setShowSleepScheduleModal(true); setShowMobileMoreSheet(false) }}
                  className="w-full p-3 rounded-xl flex items-center gap-3 active:bg-gray-100 dark:active:bg-gray-800">
                  <Bed className="w-4 h-4 text-purple-500" />
                  <span className="text-sm dark:text-gray-200">Sleep Schedule</span>
                </button>
                <button onClick={() => { setShowTimeSettingsModal(true); setShowMobileMoreSheet(false) }}
                  className="w-full p-3 rounded-xl flex items-center gap-3 active:bg-gray-100 dark:active:bg-gray-800">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm dark:text-gray-200">Display Settings</span>
                </button>
                <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
                <button onClick={() => { handleShare(); setShowMobileMoreSheet(false) }}
                  className="w-full p-3 rounded-xl flex items-center gap-3 active:bg-gray-100 dark:active:bg-gray-800">
                  <Share2 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm dark:text-gray-200">Share</span>
                </button>
                <button onClick={() => { handlePrint(); setShowMobileMoreSheet(false) }}
                  className="w-full p-3 rounded-xl flex items-center gap-3 active:bg-gray-100 dark:active:bg-gray-800">
                  <Printer className="w-4 h-4 text-blue-500" />
                  <span className="text-sm dark:text-gray-200">Print</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Timetable Builder</h1>
                  <Badge variant="outline" className="capitalize dark:border-gray-700 dark:text-gray-300">{userType}</Badge>
                  {isLocked && (
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      <Lock className="w-3 h-3 mr-1" /> Locked
                    </Badge>
                  )}
                  {hasUnsavedChanges && !isLocked && (
                    <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                      <AlertCircle className="w-3 h-3 mr-1" /> Unsaved Changes
                    </Badge>
                  )}
                  {hasUnsavedChanges && !isLocked && !isLoading && (
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30">
                      <Save className="w-3 h-3 mr-1" /> Saved on this device
                    </Badge>
                  )}
                  <Button variant="outline" size="icon" onClick={toggleDarkMode} className="h-8 w-8">
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {timeSettings.displayMode === 'vertical' ? 'Weekdays as columns, time as rows' : 'Weekdays as rows, time as columns'}
                  {timeSettings.show24Hours && (<span className="ml-2 text-purple-600 dark:text-purple-400 font-medium">• 24-hour view</span>)}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                      <FileText className="w-4 h-4" /> Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                    <DropdownMenuItem onClick={() => setViewMode('pdf')} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                      <FileText className="w-4 h-4" /> View as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportPDF} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                      <Download className="w-4 h-4" /> Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePrint} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                      <Printer className="w-4 h-4" /> Print
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                      <Share2 className="w-4 h-4" /> Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => setShowGoalsModal(true)}>
                  <Target className="w-4 h-4" /> Schedule Goals
                </Button>

                <Button variant="outline" className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => setShowSleepScheduleModal(true)}>
                  <Bed className="w-4 h-4" /> Sleep Schedule
                </Button>

                <Button variant="outline" className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => setShowTimeSettingsModal(true)}>
                  <Settings className="w-4 h-4" /> Display Settings
                </Button>

                <Button variant="outline" className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={toggleWeekends}>
                  {timeSettings.showWeekends ? (<><EyeOff className="w-4 h-4" /> Hide Weekends</>) : (<><Eye className="w-4 h-4" /> Show Weekends</>)}
                </Button>

                <Button
                  variant="outline"
                  className={cn("gap-2",
                    timeSettings.show24Hours
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700"
                      : "dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800")}
                  onClick={() => setTimeSettings({...timeSettings, show24Hours: !timeSettings.show24Hours})}>
                  <Clock className="w-4 h-4" />
                  {timeSettings.show24Hours ? '24H View' : 'Custom Hours'}
                </Button>

                <Button onClick={isLocked ? handleUnlockTimetable : handleLockTimetable}
                  className={`gap-2 ${isLocked ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  disabled={isLocking}>
                  {isLocking ? (<><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>)
                    : isLocked ? (<><Unlock className="w-4 h-4" /> Unlock</>)
                    : (<><Lock className="w-4 h-4" /> Lock Timetable</>)}
                </Button>

                <Button variant="destructive" className="gap-2" onClick={handleResetTimetable}
                  disabled={isLocking || isResetting}>
                  {isResetting ? (<><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</>)
                    : (<><RefreshCw className="w-4 h-4" /> Reset</>)}
                </Button>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border dark:border-gray-700">
              <div className="flex items-center gap-4">
                <Button variant={viewMode === 'grid' ? "default" : "outline"} onClick={() => setViewMode('grid')}
                  className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Grid className="w-4 h-4" /> Grid View
                </Button>
                <Button variant={viewMode === 'pdf' ? "default" : "outline"} onClick={() => setViewMode('pdf')}
                  className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                  <FileText className="w-4 h-4" /> PDF Preview
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button variant={timeSettings.displayMode === 'vertical' ? "default" : "outline"}
                  onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
                  className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Columns className="w-4 h-4" /> Vertical
                </Button>
                <Button variant={timeSettings.displayMode === 'horizontal' ? "default" : "outline"}
                  onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
                  className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Rows className="w-4 h-4" /> Horizontal
                </Button>
              </div>
            </div>

            {viewMode === 'pdf' ? (
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">PDF Preview</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">This feature will be implemented soon</p>
                  <Button onClick={() => setViewMode('grid')}>Back to Grid View</Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    { label: 'Total Hours', value: `${(tasks.filter(t => !t.isSleepTime).reduce((sum, task) => sum + task.duration, 0) / 60).toFixed(1)}h`, icon: Clock, iconBg: 'bg-gray-100 dark:bg-gray-800', iconColor: 'text-gray-700 dark:text-gray-300' },
                    { label: 'Tasks Planned', value: tasks.filter(t => !t.isSleepTime).length.toString(), icon: Grid, iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Goals Scheduled', value: `${tasks.filter(t => t.goalId).length}/${goals.length}`, icon: Target, iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400' },
                    { label: 'Milestones', value: `${tasks.filter(t => t.milestoneId).length}/${goals.reduce((sum, g) => sum + g.milestones.length, 0)}`, icon: CheckCircle2, iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
                    { label: 'Sleep Hours', value: `${sleepStats.totalSleepHours.toFixed(1)}h`, icon: Moon, iconBg: 'bg-gray-100 dark:bg-gray-800', iconColor: 'text-gray-700 dark:text-gray-300' },
                    { label: 'Avg Sleep', value: `${sleepStats.avgSleepHours.toFixed(1)}h`, icon: Bed, iconBg: 'bg-indigo-100 dark:bg-indigo-900/30', iconColor: 'text-indigo-600 dark:text-indigo-400' },
                    { label: 'Fixed Commitments', value: fixedTimes.length.toString(), icon: Clock, iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400' },
                  ].map((stat, index) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                          <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Fixed Commitments */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Fixed Commitments</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Add your regular commitments — you can add free periods within them for tasks.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                          {fixedTimes.length} commitments
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => setShowAddFixedTimeModal(true)}
                          className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                          <Plus className="w-4 h-4 mr-2" /> Add Fixed Commitment
                        </Button>
                      </div>
                    </div>

                    {fixedTimes.length === 0 ? (
                      <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                          <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">No Fixed Commitments Added</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                          Add your regular schedule items. They'll be marked unavailable for tasks.
                        </p>
                        <Button onClick={() => setShowAddFixedTimeModal(true)} className="gap-2">
                          <Plus className="w-4 h-4" /> Add Your First Fixed Commitment
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {fixedTimes.map((ft, index) => (
                          <motion.div key={ft.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-3 rounded-lg border cursor-pointer ${getTimeSlotColor(ft.type)}`}
                            onClick={() => handleFixedTimeClick(ft)}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: `${ft.color}20` }}>
                                  {getIconByType(ft.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium dark:text-gray-200 mb-1">{ft.title}</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {ft.days.map(d => formatDayLabel(d)).join(', ')} • {formatTimeDisplay(ft.startTime)} - {formatTimeDisplay(ft.endTime)}
                                  </div>
                                  {(ft.freePeriods && ft.freePeriods.length > 0) && (
                                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 text-xs">
                                      <Coffee className="w-2.5 h-2.5 mr-1" />
                                      {ft.freePeriods.length} free period{ft.freePeriods.length > 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedFixedTimeForFreePeriod(ft)
                                    setNewFreePeriod({ ...newFreePeriod, day: ft.days[0] || 'MONDAY' })
                                    setShowAddFreePeriodModal(true)
                                  }} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                                    <Coffee className="w-4 h-4" /> Add Free Period
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditFixedTime(ft) }}
                                    className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                                    <Edit2 className="w-4 h-4" /> Edit Commitment
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteFixedTime(ft.id) }}
                                    className="gap-2 text-red-600 dark:text-red-400 dark:hover:bg-gray-700">
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </motion.div>
                        ))}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: fixedTimes.length * 0.1 }}
                          className="p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                          onClick={() => setShowAddFixedTimeModal(true)}>
                          <div className="flex flex-col items-center justify-center h-full py-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                              <Plus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1">Add Fixed Commitment</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">College hours, office time, gym, etc.</p>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Main grid */}
                <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-0">{renderTimetableGrid()}</CardContent>
                </Card>

                {/* Task pool / goals section */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-1">Task Pool & Goals</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Drag tasks or goals to schedule them</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => openTaskDialog('MONDAY', '09:00')} className="gap-2">
                          <Plus className="w-4 h-4" /> Add Task
                        </Button>
                        <Button variant="outline" onClick={() => setShowTimeExtensionModal(true)}
                          className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                          <PlusCircle className="w-4 h-4" /> Add Time Slots
                        </Button>
                        <Button variant="outline" onClick={() => setShowGoalsModal(true)}
                          className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                          <Target className="w-4 h-4" /> Schedule Goals
                        </Button>
                        <Button variant="outline" onClick={() => setShowSleepScheduleModal(true)}
                          className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                          <Bed className="w-4 h-4" /> Sleep
                        </Button>
                      </div>
                    </div>

                    <Tabs defaultValue="goals" className="mb-6">
                      <TabsList className="dark:bg-gray-800 dark:border-gray-700">
                        <TabsTrigger value="goals" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">Goals & Milestones</TabsTrigger>
                        <TabsTrigger value="tasks" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">Quick Tasks</TabsTrigger>
                        <TabsTrigger value="sleep" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">Sleep Tips</TabsTrigger>
                      </TabsList>

                      <TabsContent value="goals" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {goals.map(goal => (
                            <div key={goal.id} className="space-y-2">
                              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                draggable={!isLocked}
                                onDragStartCapture={(e: React.DragEvent<HTMLDivElement>) => {
                                  e.dataTransfer.setData('text/plain', goal.id)
                                  e.dataTransfer.setData('type', 'goal')
                                }}>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: goal.color }} />
                                  <h4 className="font-medium text-sm dark:text-gray-200">{goal.title}</h4>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                  Progress: {goal.progress}% • {goal.completedHours.toFixed(1)}/{goal.totalHours}h
                                </div>
                                <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
                              </motion.div>
                              <div className="space-y-1 ml-4">
                                {goal.milestones.map(milestone => (
                                  <motion.div key={milestone.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                                    draggable={!isLocked}
                                    onDragStartCapture={(e: React.DragEvent<HTMLDivElement>) => {
                                      e.dataTransfer.setData('text/plain', milestone.id)
                                      e.dataTransfer.setData('goalId', goal.id)
                                      e.dataTransfer.setData('type', 'milestone')
                                    }}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        <span className="text-xs font-medium dark:text-gray-300 truncate">{milestone.title}</span>
                                      </div>
                                      <button onClick={() => handleScheduleMilestone(goal, milestone)}
                                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                                        <ArrowRight className="w-3 h-3 text-gray-500" />
                                      </button>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="tasks" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {getTaskPool().map((task, index) => (
                            <motion.div key={task.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                              draggable={!isLocked}
                              onDragStartCapture={(e: React.DragEvent<HTMLDivElement>) => {
                                e.dataTransfer.setData('text/plain', task.id)
                                e.dataTransfer.setData('duration', task.duration.toString())
                              }}>
                              <div className="flex items-start justify-between mb-2">
                                <div className="font-medium text-sm dark:text-gray-200">{task.title}</div>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.color }} />
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                <span>{task.subject}</span>
                                <span>{task.duration} minutes</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="sleep" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <h4 className="font-medium dark:text-gray-200">7-9 Hours</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Most adults need 7-9 hours per night for optimal health.
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                <AlarmClock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <h4 className="font-medium dark:text-gray-200">Consistent Schedule</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Keep the same bedtime even on weekends.
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                              </div>
                              <h4 className="font-medium dark:text-gray-200">Power Naps</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              15-20 min naps boost alertness.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}
          </motion.div>
        </>
      )}

      {/* ============================================================
          ALL DIALOGS (shared)
          ============================================================ */}

      {/* Lock Issues */}
      <Dialog open={showLockIssues} onOpenChange={setShowLockIssues}>
        <DialogContent className={cn("bg-white dark:bg-gray-800 max-h-[90vh] flex flex-col",
          isMobile ? "w-[95vw] max-w-md" : "sm:max-w-lg md:max-w-xl")}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Fix these before locking
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Your timetable has {lockIssues.length} problem{lockIssues.length > 1 ? 's' : ''}. Nothing was sent to the server.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 py-2 pr-4 max-h-[50vh]">
            <ul className="space-y-2">
              {lockIssues.map((issue, i) => (
                <li key={i} className="p-3 text-sm rounded-lg border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                  {issue}
                </li>
              ))}
            </ul>
          </ScrollArea>
          <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={() => setShowLockIssues(false)} className="w-full sm:w-auto">Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lock Confirmation */}
      <Dialog open={showLockConfirm} onOpenChange={setShowLockConfirm}>
        <DialogContent className={cn("bg-white dark:bg-gray-800 max-h-[90vh] flex flex-col",
          isMobile ? "w-[95vw] max-w-md" : "sm:max-w-lg md:max-w-xl")}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> Lock Timetable Confirmation
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Please read carefully before locking
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 py-4 pr-4">
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                      Once locked, you won't be able to edit for 1 week!
                    </h4>
                    <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                      <li>• Your timetable will be saved and locked for 7 days</li>
                      <li>• You cannot add/edit/delete tasks during this period</li>
                      <li>• After 7 days, you can unlock and make changes</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> What will be saved:
                </h4>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                  <li>• {tasks.filter(t => !t.isSleepTime).length} tasks</li>
                  <li>• {fixedTimes.length} fixed commitments</li>
                  <li>• {sleepSchedules.filter(s => s.isActive).length} active sleep schedules</li>
                  <li>• {fixedTimes.reduce((acc, ft) => acc + (ft.freePeriods?.length || 0), 0)} free periods</li>
                </ul>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Checkbox id="lock-confirm" checked={lockConfirmed}
                  onCheckedChange={(checked) => setLockConfirmed(checked as boolean)} className="mt-1 flex-shrink-0" />
                <Label htmlFor="lock-confirm" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  I understand that once locked, I cannot make changes for the next 7 days. I've reviewed my schedule.
                </Label>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className={cn("flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700 gap-2",
            isMobile && "flex-col-reverse")}>
            <Button variant="outline" onClick={() => { setShowLockConfirm(false); setLockConfirmed(false) }}
              className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              Cancel
            </Button>
            <Button onClick={handleConfirmLock} disabled={!lockConfirmed || isLocking}
              className={cn("bg-yellow-600 hover:bg-yellow-700 text-white", isMobile && "w-full")}>
              {isLocking ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" /> Locking...</>) : 'Yes, Lock Timetable'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lock Progress */}
      <Dialog open={showLockProgress} onOpenChange={setShowLockProgress}>
        <DialogContent className={cn("bg-white dark:bg-gray-800", isMobile ? "w-[95vw] max-w-md" : "sm:max-w-md")}>
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
              {lockSuccess ? (<><CheckCircle className="w-5 h-5 text-green-500" /> Timetable Locked Successfully</>) : 'Locking Timetable'}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {lockSuccess ? 'Your timetable has been locked and saved.' : 'Please wait while we lock your timetable.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {lockProgress.map((step, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {step.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />}
                    {step.status === 'in-progress' && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                    {step.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {step.status === 'failed' && <XCircle className="w-5 h-5 text-red-500" />}
                    <span className={cn("text-sm font-medium",
                      step.status === 'failed' ? "text-red-600 dark:text-red-400" : "dark:text-gray-300")}>
                      {step.step}
                    </span>
                  </div>
                  {step.message && <span className="text-xs text-gray-500 dark:text-gray-400">{step.message}</span>}
                </div>
                {step.status === 'in-progress' && <Progress value={50} className="h-1" />}
                {step.error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{step.error}</p>}
              </div>
            ))}
          </div>
          <DialogFooter>
            {(lockSuccess || !isLocking) && (
              <Button onClick={() => setShowLockProgress(false)} className="w-full sm:w-auto">Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className={cn("bg-white dark:bg-gray-800", isMobile ? "w-[95vw] max-w-md" : "sm:max-w-md")}>
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> Reset Timetable
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              This will permanently delete ALL your timetable data. Cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Are you sure? This will delete:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <li>{fixedTimes.length} fixed commitments</li>
              <li>{sleepSchedules.length} sleep schedules</li>
              <li>{tasks.filter(t => !t.isSleepTime).length} tasks</li>
            </ul>
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">This action cannot be undone!</p>
          </div>
          <DialogFooter className={cn("gap-2", isMobile && "flex-col-reverse")}>
            <Button variant="outline" onClick={() => setShowResetConfirm(false)}
              className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReset} disabled={isResetting} className={cn(isMobile && "w-full")}>
              {isResetting ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" /> Resetting...</>) : 'Yes, Reset Everything'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sleep Schedule Dialog */}
      <Dialog open={showSleepScheduleModal} onOpenChange={handleSleepModalOpenChange}>
        <DialogContent className={cn("bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col",
          isMobile ? "w-[95vw] max-w-md" : "sm:max-w-lg")}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
              <Bed className="w-5 h-5" /> Sleep Schedule
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Set the days and times, then click Save.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 overflow-y-auto pr-4">
            <div className="p-3 text-xs rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300">
              Sleep stays on the day you select. If a task is already scheduled inside that window, move it first.
            </div>
            {ALL_DAYS.map(day => {
              const draft = sleepDraft[day]
              if (!draft) return null
              const duration = calculateDuration(draft.bedtime, draft.wakeTime)
              const sameTime = draft.bedtime === draft.wakeTime
              const conflicts = draft.isActive && !sameTime
                ? findTasksInSleepWindow(day, draft.bedtime, draft.wakeTime) : []
              return (
                <div key={day} className={cn("p-3 border rounded-lg",
                  conflicts.length > 0 || (draft.isActive && sameTime)
                    ? "border-red-300 dark:border-red-800/60"
                    : "border-gray-200 dark:border-gray-700")}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium dark:text-gray-200">{formatDayLabel(day)}</span>
                    <Switch checked={draft.isActive}
                      onCheckedChange={(checked) => updateSleepDraft(day, { isActive: checked })} />
                  </div>
                  {draft.isActive && (
                    <>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <Label className="text-xs dark:text-gray-400">Bedtime</Label>
                          <Input type="time" value={draft.bedtime}
                            onChange={(e) => updateSleepDraft(day, { bedtime: e.target.value })}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                          <Label className="text-xs dark:text-gray-400">Wake Time</Label>
                          <Input type="time" value={draft.wakeTime}
                            onChange={(e) => updateSleepDraft(day, { wakeTime: e.target.value })}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                        </div>
                      </div>
                      <div className="mb-2">
                        <Label className="text-xs dark:text-gray-400">Type</Label>
                        <Select value={draft.type}
                          onValueChange={(value: any) => updateSleepDraft(day, { type: value })}>
                          <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {SLEEP_TYPES.map(type => (
                              <SelectItem key={type.id} value={type.id} className="dark:text-gray-300 dark:hover:bg-gray-700">
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs dark:text-gray-400">Notes (Optional)</Label>
                        <Input value={draft.notes}
                          onChange={(e) => updateSleepDraft(day, { notes: e.target.value })}
                          placeholder="Add notes..."
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {sameTime ? 'Bedtime and wake time cannot be the same' : `Duration: ${Math.floor(duration / 60)}h ${duration % 60}m`}
                        </span>
                        <button type="button" onClick={() => applySleepToAllDays(day)}
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          Apply to all days
                        </button>
                      </div>
                      {conflicts.length > 0 && (
                        <div className="mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-xs text-red-700 dark:text-red-300">
                          <div className="font-medium mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Cannot save — task already in this sleep time:
                          </div>
                          <ul className="space-y-0.5">
                            {conflicts.map(c => (
                              <li key={c.id}>• "{c.title}" ({formatTimeDisplay(c.startTime)} – {formatTimeDisplay(c.endTime)})</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
          <DialogFooter className={cn("flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700 gap-2",
            isMobile && "flex-col-reverse")}>
            <Button variant="outline" onClick={() => handleSleepModalOpenChange(false)}
              className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              Close
            </Button>
            <Button onClick={handleSaveSleepDraft} className={cn("gap-2", isMobile && "w-full")}>
              <Save className="w-4 h-4" /> Save Sleep Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Creation Dialog */}
      <Dialog open={showTaskCreationDialog} onOpenChange={(open) => {
        setShowTaskCreationDialog(open)
        if (!open) { setTaskCreationContext(null); resetTaskForm() }
      }}>
        <DialogContent className={cn("bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto",
          isMobile ? "w-[95vw] max-w-md" : "sm:max-w-md")}>
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Add Task</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {taskCreationFlow === 'simple' ? 'Pick a day, time and duration' : 'Link this task to a goal'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {taskDialogError && (
              <div className="p-3 rounded-lg border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{taskDialogError}</span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Task Title *</label>
              <Input placeholder="e.g., Study React" value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Subject</label>
                <Input placeholder="e.g., DSA" value={newTask.subject}
                  onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Priority</label>
                <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="LOW" className="dark:text-gray-300 dark:hover:bg-gray-700">Low</SelectItem>
                    <SelectItem value="MEDIUM" className="dark:text-gray-300 dark:hover:bg-gray-700">Medium</SelectItem>
                    <SelectItem value="HIGH" className="dark:text-gray-300 dark:hover:bg-gray-700">High</SelectItem>
                    <SelectItem value="CRITICAL" className="dark:text-gray-300 dark:hover:bg-gray-700">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30 space-y-3">
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300">When should this task happen?</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block text-gray-700 dark:text-gray-300">Day</label>
                  <Select value={newTask.day} onValueChange={(value) => setNewTask({...newTask, day: value})}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {days.map(day => (
                        <SelectItem key={day} value={day} className="dark:text-gray-300 dark:hover:bg-gray-700">
                          {formatDayLabel(day)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block text-gray-700 dark:text-gray-300">Start Time</label>
                  <Input type="time" value={newTask.startTime}
                    onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 h-9" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block text-gray-700 dark:text-gray-300">Duration (minutes)</label>
                <div className="flex flex-wrap gap-1.5">
                  {getDetailedDurationOptions().map(d => {
                    const startMins = convertTimeToMinutes(newTask.startTime)
                    if (startMins + d > MINUTES_IN_DAY) return null
                    const isSelected = newTask.duration === d
                    return (
                      <button key={d} type="button" onClick={() => setNewTask({...newTask, duration: d})}
                        className={cn("px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                          isSelected ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600")}>
                        {d}m
                      </button>
                    )
                  })}
                </div>
                <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-2">
                  Ends at <span className="font-semibold">{formatTimeShort(calculateEndTime(newTask.startTime, newTask.duration))}</span> on <span className="font-semibold">{formatDayLabel(newTask.day)}</span>
                </div>
              </div>
            </div>

            {taskCreationFlow === 'withGoal' && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block dark:text-gray-300">Link to Goal (Optional)</label>
                  <Select value={newTask.goalId}
                    onValueChange={(value) => setNewTask({...newTask, goalId: value, milestoneId: ''})}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                      <SelectValue placeholder="Select a goal" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="no-goal" className="dark:text-gray-300 dark:hover:bg-gray-700">No Goal</SelectItem>
                      {goals.map(goal => (
                        <SelectItem key={goal.id} value={goal.id} className="dark:text-gray-300 dark:hover:bg-gray-700">
                          {goal.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Notes (Optional)</label>
              <Textarea placeholder="Add any notes..." value={newTask.note}
                onChange={(e) => setNewTask({...newTask, note: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" rows={2} />
            </div>

            <div className={cn("flex gap-2", isMobile && "flex-col")}>
              {taskCreationFlow === 'simple' ? (
                <Button variant="outline" onClick={() => setTaskCreationFlow('withGoal')}
                  className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Target className="w-4 h-4 mr-2" /> Link to Goal
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setTaskCreationFlow('simple')}
                  className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Simple Task
                </Button>
              )}
              <Button onClick={handleAddTaskToCell} className="flex-1"
                disabled={!newTask.title.trim() || !!taskDialogError}>
                {taskCreationFlow === 'withGoal' && cleanId(newTask.goalId) ? 'Add Task with Goal' : 'Add Task'}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowTaskCreationDialog(false); setTaskCreationContext(null); resetTaskForm()
            }} className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Task Modal */}
      <Dialog open={showAddTaskModal} onOpenChange={(open) => {
        setShowAddTaskModal(open)
        if (!open) { setEditingTask(null); resetTaskForm() }
      }}>
        <DialogContent className={cn("bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto",
          isMobile ? "w-[95vw] max-w-md" : "sm:max-w-md")}>
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {editingTask ? 'Update task details' : 'Create a task'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editTaskError && (
              <div className="p-3 rounded-lg border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{editTaskError}</span>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Task Title *</label>
              <Input placeholder="e.g., Study React" value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Subject</label>
              <Input placeholder="e.g., DSA" value={newTask.subject}
                onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30 space-y-3">
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300">When should this task happen?</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block text-gray-700 dark:text-gray-300">Day</label>
                  <Select value={newTask.day} onValueChange={(value) => setNewTask({...newTask, day: value})}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {ALL_DAYS.map(day => (
                        <SelectItem key={day} value={day} className="dark:text-gray-300 dark:hover:bg-gray-700">
                          {formatDayLabel(day)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block text-gray-700 dark:text-gray-300">Start Time</label>
                  <Input type="time" value={newTask.startTime}
                    onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 h-9" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block text-gray-700 dark:text-gray-300">Duration (minutes)</label>
                <div className="flex flex-wrap gap-1.5">
                  {getDetailedDurationOptions().map(d => {
                    const startMins = convertTimeToMinutes(newTask.startTime)
                    if (startMins + d > MINUTES_IN_DAY) return null
                    const isSelected = newTask.duration === d
                    return (
                      <button key={d} type="button" onClick={() => setNewTask({...newTask, duration: d})}
                        className={cn("px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                          isSelected ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600")}>
                        {d}m
                      </button>
                    )
                  })}
                </div>
                <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-2">
                  Ends at <span className="font-semibold">{formatTimeShort(calculateEndTime(newTask.startTime, newTask.duration))}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Priority</label>
              <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="LOW" className="dark:text-gray-300 dark:hover:bg-gray-700">Low</SelectItem>
                  <SelectItem value="MEDIUM" className="dark:text-gray-300 dark:hover:bg-gray-700">Medium</SelectItem>
                  <SelectItem value="HIGH" className="dark:text-gray-300 dark:hover:bg-gray-700">High</SelectItem>
                  <SelectItem value="CRITICAL" className="dark:text-gray-300 dark:hover:bg-gray-700">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Notes (Optional)</label>
              <Textarea placeholder="Add any notes..." value={newTask.note}
                onChange={(e) => setNewTask({...newTask, note: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" rows={2} />
            </div>
          </div>
          <DialogFooter className={cn("gap-2", isMobile && "flex-col-reverse")}>
            <Button variant="outline" onClick={() => {
              setShowAddTaskModal(false); setEditingTask(null); resetTaskForm()
            }} className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              Cancel
            </Button>
            <Button onClick={editingTask ? handleUpdateTask : handleAddTask}
              disabled={!!editTaskError} className={cn(isMobile && "w-full")}>
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Fixed Time */}
      <Dialog open={showAddFixedTimeModal} onOpenChange={setShowAddFixedTimeModal}>
        <DialogContent className={cn("bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col",
          isMobile ? "w-[95vw] max-w-md" : "sm:max-w-lg")}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100">Add Fixed Commitment</DialogTitle>
            <DialogDescription className="dark:text-gray-400">Regular commitments like college, office, gym</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 overflow-y-auto pr-4">
            {renderFixedTimeFields(newFixedTime, (patch) => setNewFixedTime(prev => ({ ...prev, ...patch })))}
          </div>
          <DialogFooter className={cn("flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700 gap-2",
            isMobile && "flex-col-reverse")}>
            <Button variant="outline" onClick={() => { setShowAddFixedTimeModal(false); resetNewFixedTime() }}
              className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              Cancel
            </Button>
            <Button onClick={handleAddFixedTime} className={cn(isMobile && "w-full")}>
              Add Fixed Commitment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Fixed Time */}
      <Dialog open={showEditFixedTimeModal} onOpenChange={setShowEditFixedTimeModal}>
        <DialogContent className={cn("bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col",
          isMobile ? "w-[95vw] max-w-md" : "sm:max-w-lg")}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100">Edit Fixed Commitment</DialogTitle>
          </DialogHeader>
          {editingFixedTime && (
            <div className="space-y-6 py-4 overflow-y-auto pr-4">
              {renderFixedTimeFields(editingFixedTime, (patch) => setEditingFixedTime(prev => (prev ? { ...prev, ...patch } : prev)))}
            </div>
          )}
          <DialogFooter className={cn("flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700 gap-2",
            isMobile && "flex-col-reverse")}>
            <Button variant="outline" onClick={() => { setShowEditFixedTimeModal(false); setEditingFixedTime(null) }}
              className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              Cancel
            </Button>
            <Button onClick={() => editingFixedTime && handleSaveFixedTime(editingFixedTime)} className={cn(isMobile && "w-full")}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Free Period */}
      <Dialog open={showAddFreePeriodModal} onOpenChange={setShowAddFreePeriodModal}>
        <DialogContent className={cn("bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto",
          isMobile ? "w-[95vw] max-w-md" : "sm:max-w-md")}>
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Add Free Period</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Within "{selectedFixedTimeForFreePeriod?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedFixedTimeForFreePeriod && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Fixed:</span> {selectedFixedTimeForFreePeriod.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {formatTimeDisplay(selectedFixedTimeForFreePeriod.startTime)} - {formatTimeDisplay(selectedFixedTimeForFreePeriod.endTime)}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Title *</label>
              <Input placeholder="e.g., Free Period" value={newFreePeriod.title}
                onChange={(e) => setNewFreePeriod({...newFreePeriod, title: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Day *</label>
              <Select value={newFreePeriod.day} onValueChange={(value) => setNewFreePeriod({...newFreePeriod, day: value})}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {selectedFixedTimeForFreePeriod?.days.map(day => (
                    <SelectItem key={day} value={day} className="dark:text-gray-300 dark:hover:bg-gray-700">
                      {formatDayLabel(day)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start *</label>
                <Input type="time" value={newFreePeriod.startTime}
                  onChange={(e) => setNewFreePeriod({...newFreePeriod, startTime: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">End *</label>
                <Input type="time" value={newFreePeriod.endTime}
                  onChange={(e) => setNewFreePeriod({...newFreePeriod, endTime: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
              </div>
            </div>
          </div>
          <DialogFooter className={cn("gap-2", isMobile && "flex-col-reverse")}>
            <Button variant="outline" onClick={() => { setShowAddFreePeriodModal(false); setSelectedFixedTimeForFreePeriod(null) }}
              className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              Cancel
            </Button>
            <Button onClick={handleAddFreePeriod} className={cn(isMobile && "w-full")}>
              Add Free Period for {formatDayLabel(newFreePeriod.day)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Free Period */}
      <Dialog open={showQuickFreePeriodModal} onOpenChange={(open) => {
        setShowQuickFreePeriodModal(open)
        if (!open) setQuickFreePeriodContext(null)
      }}>
        <DialogContent className={cn("bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto",
          isMobile ? "w-[95vw] max-w-md" : "sm:max-w-md")}>
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-green-600" /> Add Free Period
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {quickFreePeriodContext && (
                <>This slot is inside "{quickFreePeriodContext.fixedTime.title}"</>
              )}
            </DialogDescription>
          </DialogHeader>
          {quickFreePeriodContext && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Day:</span> {formatDayLabel(quickFreePeriodContext.day)}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Time:</span> {formatTimeDisplay(quickFreePeriodContext.time)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Title *</label>
                <Input value={newFreePeriod.title}
                  onChange={(e) => setNewFreePeriod({...newFreePeriod, title: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start *</label>
                  <Input type="time" value={newFreePeriod.startTime}
                    onChange={(e) => setNewFreePeriod({...newFreePeriod, startTime: e.target.value})}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block dark:text-gray-300">End *</label>
                  <Input type="time" value={newFreePeriod.endTime}
                    onChange={(e) => setNewFreePeriod({...newFreePeriod, endTime: e.target.value})}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className={cn("gap-2", isMobile && "flex-col-reverse")}>
            <Button variant="outline" onClick={() => {
              if (quickFreePeriodContext) setSelectedFixedTime(quickFreePeriodContext.fixedTime)
              setShowQuickFreePeriodModal(false); setQuickFreePeriodContext(null)
            }} className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              View Commitment
            </Button>
            <Button onClick={handleQuickAddFreePeriod} className={cn(isMobile && "w-full")}>
              <Coffee className="w-4 h-4 mr-2" /> Add & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Extension */}
      <Dialog open={showTimeExtensionModal} onOpenChange={setShowTimeExtensionModal}>
        <DialogContent className={cn("bg-white dark:bg-gray-800", isMobile ? "w-[95vw] max-w-md" : "sm:max-w-md")}>
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Extend Time Slots</DialogTitle>
            <DialogDescription className="dark:text-gray-400">Add extra time slots</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="font-medium dark:text-gray-200">Quick Extensions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant={timeSettings.extendedHours.morning ? "default" : "outline"}
                  onClick={() => handleExtendTime('morning')} className="flex-col h-auto py-3">
                  <Sunrise className="w-5 h-5 mb-1" />
                  <span className="text-xs">Morning</span>
                  <span className="text-[10px] opacity-75">5 AM - 8 AM</span>
                </Button>
                <Button variant={timeSettings.extendedHours.evening ? "default" : "outline"}
                  onClick={() => handleExtendTime('evening')} className="flex-col h-auto py-3">
                  <Sunset className="w-5 h-5 mb-1" />
                  <span className="text-xs">Evening</span>
                  <span className="text-[10px] opacity-75">6 PM - 10 PM</span>
                </Button>
                <Button variant={timeSettings.extendedHours.night ? "default" : "outline"}
                  onClick={() => handleExtendTime('night')} className="flex-col h-auto py-3 col-span-2">
                  <MoonStar className="w-5 h-5 mb-1" />
                  <span className="text-xs">Night</span>
                  <span className="text-[10px] opacity-75">10 PM - 12 AM</span>
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium dark:text-gray-200">Custom Time Slot</h3>
              <div className="flex gap-2">
                <Input type="time" placeholder="HH:MM"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" id="custom-time" />
                <Button onClick={() => {
                  const input = document.getElementById('custom-time') as HTMLInputElement
                  if (input.value) { handleAddCustomTime(input.value); input.value = '' }
                }}>Add</Button>
              </div>
              {timeSettings.extendedHours.custom.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm dark:text-gray-300">Added Slots</Label>
                  <div className="flex flex-wrap gap-2">
                    {timeSettings.extendedHours.custom.map(time => (
                      <Badge key={time} variant="secondary" className="px-2 py-1 gap-1">
                        {formatTimeDisplay(time)}
                        <button onClick={() => handleRemoveCustomTime(time)} className="ml-1 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimeExtensionModal(false)}
              className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Settings */}
      <Dialog open={showTimeSettingsModal} onOpenChange={setShowTimeSettingsModal}>
        <DialogContent className={cn("bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col",
          isMobile ? "w-[95vw] max-w-md" : "sm:max-w-lg")}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100">Display Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4 overflow-y-auto pr-4">
            <div className="space-y-4">
              <h3 className="font-medium dark:text-gray-200">Time Interval</h3>
              <div className="grid grid-cols-3 gap-2">
                {[30, 60, 120].map(interval => (
                  <Button key={interval} variant={timeSettings.interval === interval ? "default" : "outline"}
                    onClick={() => setTimeSettings({...timeSettings, interval})}
                    className="flex-col h-auto py-3 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                    <span className="font-medium">{interval} min</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium dark:text-gray-200">Cell Height</h3>
              <Slider value={[timeSettings.cellHeight]} min={30} max={100} step={5}
                onValueChange={(value) => setTimeSettings({...timeSettings, cellHeight: value[0]})} />
            </div>
            <div className="space-y-4">
              <h3 className="font-medium dark:text-gray-200">Display Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium dark:text-gray-300">Show Weekends</div>
                  <Switch checked={timeSettings.showWeekends}
                    onCheckedChange={(checked) => setTimeSettings({...timeSettings, showWeekends: checked})} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium dark:text-gray-300">Show Sleep Blocks</div>
                  <Switch checked={timeSettings.showSleepBlocks}
                    onCheckedChange={(checked) => setTimeSettings({...timeSettings, showSleepBlocks: checked})} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium dark:text-gray-300">24-Hour View</div>
                  <Switch checked={timeSettings.show24Hours}
                    onCheckedChange={(checked) => setTimeSettings({...timeSettings, show24Hours: checked})} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className={cn("flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700 gap-2",
            isMobile && "flex-col-reverse")}>
            <Button variant="outline" onClick={() => setShowTimeSettingsModal(false)}
              className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              Cancel
            </Button>
            <Button onClick={handleSaveTimeSettings} className={cn(isMobile && "w-full")}>
              Apply Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goals Modal */}
      <Dialog open={showGoalsModal} onOpenChange={setShowGoalsModal}>
        <DialogContent className={cn("bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col",
          isMobile ? "w-[95vw] max-w-md" : "sm:max-w-4xl")}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100">Schedule Goals & Milestones</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Placed in the first free 1-hour slot with no conflicts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 overflow-y-auto pr-4">
            {goals.map(goal => (
              <div key={goal.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: goal.color }} />
                    <div>
                      <h3 className="font-medium dark:text-gray-200">{goal.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{goal.progress}% complete</span>
                        <span>•</span>
                        <span>{goal.completedHours.toFixed(1)}/{goal.totalHours}h</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
                </div>
                <div className="space-y-3">
                  {goal.milestones.map(milestone => (
                    <div key={milestone.id}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="font-medium text-sm dark:text-gray-200">{milestone.title}</span>
                      </div>
                      <Button size="sm" variant="outline" className="h-6 px-2 text-xs dark:border-gray-700 dark:text-gray-300"
                        onClick={() => handleScheduleMilestone(goal, milestone)}>
                        <Calendar className="w-3 h-3 mr-1" /> Schedule
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className={cn("flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700 gap-2",
            isMobile && "flex-col-reverse")}>
            <Button variant="outline" onClick={() => setShowGoalsModal(false)}
              className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              Close
            </Button>
            <Button className={cn(isMobile && "w-full")} onClick={() => {
              const pending: any[] = []
              goals.forEach(goal => {
                goal.milestones.forEach(milestone => {
                  if (!milestone.completed && !tasks.some(t => t.milestoneId === milestone.id)) {
                    pending.push({
                      title: milestone.title, subject: goal.subject || goal.title,
                      priority: goal.priority, color: goal.color,
                      goalId: goal.id, milestoneId: milestone.id
                    })
                  }
                })
              })
              if (pending.length === 0) { toast.info('All milestones are already scheduled!'); return }
              const added = scheduleItems(pending)
              if (added.length > 0) toast.success(`Scheduled ${added.length} milestone${added.length > 1 ? 's' : ''}`)
            }}>
              <Zap className="w-4 h-4 mr-2" /> Auto-Schedule All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Milestone modal */}
      <Dialog open={!!selectedGoalForMilestone} onOpenChange={() => setSelectedGoalForMilestone(null)}>
        <DialogContent className={cn("bg-white dark:bg-gray-800", isMobile ? "w-[95vw] max-w-md" : "sm:max-w-md")}>
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Schedule Milestone</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              From {selectedGoalForMilestone?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedGoalForMilestone && (
            <div className="space-y-2 py-4 max-h-60 overflow-y-auto">
              {selectedGoalForMilestone.milestones.map(milestone => {
                const isScheduled = tasks.some(t => t.milestoneId === milestone.id)
                return (
                  <div key={milestone.id}
                    className={cn("p-3 rounded-lg border cursor-pointer",
                      isScheduled ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300")}
                    onClick={() => !isScheduled && handleScheduleMilestone(selectedGoalForMilestone, milestone)}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="font-medium text-sm dark:text-gray-200">{milestone.title}</span>
                      {isScheduled && <Badge className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700">Scheduled</Badge>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedGoalForMilestone(null)}
              className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fixed Commitment Details */}
      {selectedFixedTime && (
        <Dialog open={!!selectedFixedTime} onOpenChange={() => setSelectedFixedTime(null)}>
          <DialogContent className={cn("bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto",
            isMobile ? "w-[95vw] max-w-md" : "sm:max-w-lg")}>
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">Fixed Commitment Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${selectedFixedTime.color}20` }}>
                  {getIconByType(selectedFixedTime.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg dark:text-gray-200">{selectedFixedTime.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFixedTime.days.map(d => formatDayLabel(d)).join(', ')} • {formatTimeDisplay(selectedFixedTime.startTime)} - {formatTimeDisplay(selectedFixedTime.endTime)}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium dark:text-gray-200">Free Periods</h4>
                  <Button size="sm" variant="outline" className="gap-2 dark:border-gray-700 dark:text-gray-300"
                    onClick={() => {
                      setSelectedFixedTimeForFreePeriod(selectedFixedTime)
                      setNewFreePeriod({...newFreePeriod, day: selectedFixedTime.days[0] || 'MONDAY'})
                      setShowAddFreePeriodModal(true)
                    }}>
                    <Coffee className="w-3 h-3" /> Add Free Period
                  </Button>
                </div>
                {(!selectedFixedTime.freePeriods || selectedFixedTime.freePeriods.length === 0) ? (
                  <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                    <Coffee className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">No free periods added.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Array.from(new Set(selectedFixedTime.freePeriods.map(fp => fp.day))).map(day => {
                      const dayFreePeriods = selectedFixedTime.freePeriods?.filter(fp => fp.day === day) || []
                      return (
                        <div key={day} className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatDayLabel(day)}</h5>
                          {dayFreePeriods.map((fp) => (
                            <div key={fp.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Coffee className="w-4 h-4 text-green-600" />
                                  <span className="font-medium text-green-700 dark:text-green-400">{fp.title}</span>
                                </div>
                                <button onClick={() => {
                                  const updatedFreePeriods = selectedFixedTime.freePeriods?.filter(f => f.id !== fp.id) || []
                                  handleSaveFixedTime({ ...selectedFixedTime, freePeriods: updatedFreePeriods })
                                }} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
                                  <X className="w-3 h-3 text-red-500" />
                                </button>
                              </div>
                              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                                {formatTimeDisplay(fp.startTime)} - {formatTimeDisplay(fp.endTime)} ({fp.duration} min)
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className={cn("gap-2", isMobile && "flex-col-reverse")}>
              <Button variant="outline" onClick={() => setSelectedFixedTime(null)}
                className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
                Close
              </Button>
              <Button variant="outline" onClick={() => { handleEditFixedTime(selectedFixedTime); setSelectedFixedTime(null) }}
                className={cn("dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700", isMobile && "w-full")}>
                Edit Commitment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )

  // ============ FIXED TIME FIELDS RENDERER ============
  function renderFixedTimeFields(
    value: { title: string; description?: string; startTime: string; endTime: string; type: FixedTime['type']; days: string[] },
    onChange: (patch: { title?: string; description?: string; startTime?: string; endTime?: string; type?: FixedTime['type']; color?: string; days?: string[] }) => void
  ) {
    return (
      <>
        <div>
          <label className="text-sm font-medium mb-2 block dark:text-gray-300">Title *</label>
          <Input placeholder="e.g., College Hours" value={value.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block dark:text-gray-300">Description (Optional)</label>
          <Textarea placeholder="Brief description" value={value.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" rows={2} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time *</label>
            <Input type="time" value={value.startTime}
              onChange={(e) => onChange({ startTime: e.target.value })}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block dark:text-gray-300">End Time *</label>
            <Input type="time" value={value.endTime}
              onChange={(e) => onChange({ endTime: e.target.value })}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block dark:text-gray-300">Type *</label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1">
            {FIXED_TIME_TYPES.filter(t => t.id !== 'SLEEP').map((type) => {
              const Icon = type.icon
              const isSelected = value.type === type.id
              return (
                <button key={type.id} type="button"
                  onClick={() => onChange({ type: type.id as FixedTime['type'], color: type.color })}
                  className={cn("flex flex-col items-center justify-center p-3 rounded-lg border transition-all",
                    isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300")}>
                  <div className="p-2 rounded-lg mb-2" style={{ backgroundColor: `${type.color}20` }}>
                    <Icon className="w-5 h-5" style={{ color: type.color }} />
                  </div>
                  <span className={cn("text-xs text-center", isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400")}>
                    {type.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block dark:text-gray-300">Days *</label>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map(day => (
              <button key={day} type="button"
                onClick={() => {
                  const newDays = value.days.includes(day) ? value.days.filter(d => d !== day) : [...value.days, day]
                  onChange({ days: newDays })
                }}
                className={cn("px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  value.days.includes(day) ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700")}>
                {formatDayLabel(day)}
              </button>
            ))}
          </div>
        </div>
      </>
    )
  }
}