// src/app/dashboard/timetable/builder/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Plus, 
  Save, 
  Lock, 
  Unlock,
  Grid,
  List,
  Zap,
  Download,
  Share2,
  Target,
  Book,
  Briefcase,
  GraduationCap,
  Home,
  AlertCircle,
  X,
  Settings,
  Bell,
  RefreshCw,
  Columns,
  Rows,
  Coffee,
  Wind,
  Maximize2,
  Eye,
  EyeOff,
  FileText,
  Printer,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  MoreVertical,
  Trash2,
  Edit2,
  Copy,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  MinusCircle,
  Users,
  Building,
  Car,
  Dumbbell,
  Utensils,
  Heart,
  Music,
  Gamepad2,
  Moon,
  Sun,
  CheckCircle2,
  TrendingUp,
  Award,
  Trophy,
  Flame,
  Star,
  School,
  User,
  ArrowRight,
  ArrowLeft,
  Bed,
  AlarmClock,
  MoonStar,
  Sunrise,
  Sunset,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'

// Types
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

// Editable copy of one day's sleep settings, used by the Sleep Schedule modal.
// Nothing here touches the real timetable until the user presses "Save".
interface SleepDraftDay {
  isActive: boolean
  bedtime: string
  wakeTime: string
  type: SleepSchedule['type']
  notes: string
}

interface Milestone {
  id: string
  title: string
  description: string
  completed: boolean
  targetDate: Date
  progress: number
  scheduledHours: number
  completedHours: number
}

interface Goal {
  id: string
  title: string
  description: string
  category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  type: 'SHORT_TERM' | 'LONG_TERM'
  targetDate: Date
  createdAt: Date
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
  progress: number
  totalHours: number
  completedHours: number
  milestones: Milestone[]
  color: string
  tags: string[]
  isPublic: boolean
  weeklyTarget: number
  streak: number
  lastUpdated: Date
  subject: string
  tasks: string[]
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

interface TimeSettings {
  startHour: number
  endHour: number
  interval: number
  displayMode: 'vertical' | 'horizontal'
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
}

interface ApiTask {
  title: string
  subject: string
  note?: string
  startTime: string
  endTime: string
  duration: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  color?: string
  day: string
  // Must match backend Prisma `TimeSlotType` enum exactly — no 'OTHER' member exists.
  type: 'TASK' | 'FIXED' | 'BREAK' | 'COMMUTE' | 'FREE' | 'CLASS' | 'STUDY' | 'HEALTH' | 'PROJECT' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP'
  // Must match backend Prisma `TaskCategory` enum exactly.
  category?: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'LEARNING' | 'BREAK' | 'COMMUTE' | 'PROJECT' | 'SLEEP'
  goalId?: string | null
  milestoneId?: string | null
  fixedTimeId?: string | null
  status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
  completedAt?: string | null
}

interface ApiFixedTime {
  title: string
  description?: string
  days: string[]
  startTime: string
  endTime: string
  type: 'COLLEGE' | 'OFFICE' | 'SCHOOL' | 'COMMUTE' | 'FREE' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'FAMILY' | 'OTHER' | 'SLEEP'
  color?: string
  isEditable?: boolean
  freePeriods?: {
    title: string
    startTime: string
    endTime: string
    day: string
  }[]
}

interface ApiSleepSchedule {
  day: string
  bedtime: string
  wakeTime: string
  isActive: boolean
  type: 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE'
  notes?: string
  color?: string
  duration?: number
}

interface LockProgress {
  step: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  message?: string
  error?: string
}

interface FullTimeTableSlot {
  startTime: string
  endTime: string
  type: 'FIXED' | 'FREE' | 'STUDY' | 'PROJECT' | 'CLASS' | 'HEALTH' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP' | 'OTHER'
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
}

interface FullTimeTableResponse {
  day: string
  slots: FullTimeTableSlot[]
}

interface LockApiResponse {
  success: boolean
  message: string
  data: {
    fixedTimesCreated: number
    sleepSchedulesCreated: number
    tasksCreated: number
    totalItems: number
  }
}

interface ResetApiResponse {
  success: boolean
  message: string
  data: {
    fixedTimesDeleted: number
    sleepSchedulesDeleted: number
    tasksDeleted: number
    totalDeleted: number
  }
}

interface ResetPayload {
  confirm: boolean
  resetTasks: boolean
  resetFixedTimes: boolean
  resetSleepSchedules: boolean
}

// Result of checking whether a task can be placed at a given day/time.
interface PlacementResult {
  error?: string
  fixedTimeId?: string
  freePeriodId?: string
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

const TASK_TYPES = [
  { id: 'STUDY', label: 'Study', icon: Book },
  { id: 'CLASS', label: 'Class', icon: GraduationCap },
  { id: 'PROJECT', label: 'Project', icon: Target },
  { id: 'HEALTH', label: 'Health', icon: Heart },
  { id: 'MEETING', label: 'Meeting', icon: Users },
  { id: 'WORKOUT', label: 'Workout', icon: Dumbbell },
  { id: 'MEAL', label: 'Meal', icon: Utensils },
  { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Gamepad2 },
  { id: 'SLEEP', label: 'Sleep', icon: Moon },
  { id: 'OTHER', label: 'Other', icon: Clock }
]

// All 7 days, always. (The visible `days` list can hide weekends, but data
// like sleep schedules and fixed commitments must still work for them.)
const ALL_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
const MINUTES_IN_DAY = 24 * 60

// ==================== Task Type Mapping Functions ====================

// Map UI task type to API task type (UPPERCASE)
const mapUITypeToAPIType = (uiType: TimeSlot['type']): ApiTask['type'] => {
  // IMPORTANT: This must only ever return a value that exists in the
  // backend's Prisma `TimeSlotType` enum: TASK, FIXED, BREAK, COMMUTE,
  // FREE, CLASS, STUDY, HEALTH, PROJECT, MEETING, WORKOUT, MEAL,
  // ENTERTAINMENT, SLEEP. There is NO "OTHER" member — sending it causes
  // the backend's Zod validation to reject the whole /lock request.
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
    case 'other': return 'TASK' // No OTHER in backend enum — fall back to TASK
    default: return 'TASK'
  }
}

// Map API task type to UI task type (lowercase)
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

// "no-goal" / "no-milestone" are only UI placeholders for the Select — they
// must never be sent to the backend as real ids.
const cleanId = (value?: string | null): string | undefined => {
  if (!value || value === 'no-goal' || value === 'no-milestone') return undefined
  return value
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8181/v0/api'}`

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

  // Lock Confirmation State
  const [showLockConfirm, setShowLockConfirm] = useState(false)
  const [lockConfirmed, setLockConfirmed] = useState(false)

  // NEW: Problems found by the frontend BEFORE we ever call the lock API
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

  // Quick "Add Free Period" flow — carries the exact day/time the user clicked on
  const [showQuickFreePeriodModal, setShowQuickFreePeriodModal] = useState(false)
  const [quickFreePeriodContext, setQuickFreePeriodContext] = useState<{day: string, time: string, fixedTime: FixedTime} | null>(null)
  const [editingTask, setEditingTask] = useState<TimeSlot | null>(null)
  const [selectedFixedTime, setSelectedFixedTime] = useState<FixedTime | null>(null)
  const [showGoalsModal, setShowGoalsModal] = useState(false)
  const [selectedGoalForMilestone, setSelectedGoalForMilestone] = useState<Goal | null>(null)
  const [editingSleepSchedule, setEditingSleepSchedule] = useState<SleepSchedule | null>(null)

  // NEW: Draft state for the Sleep Schedule modal (applied only on "Save")
  const [sleepDraft, setSleepDraft] = useState<Record<string, SleepDraftDay>>({})
  const [sleepDraftDirty, setSleepDraftDirty] = useState(false)
  
  const [taskCreationFlow, setTaskCreationFlow] = useState<'simple' | 'withGoal'>('simple')
  const [showTaskCreationDialog, setShowTaskCreationDialog] = useState(false)
  const [taskCreationContext, setTaskCreationContext] = useState<{day: string, time: string} | null>(null)

  // Used to guarantee unique ids when several tasks are created in one go
  const idCounter = useRef(0)
  
  const [newFreePeriod, setNewFreePeriod] = useState({
    title: 'Free Period',
    startTime: '14:00',
    endTime: '15:00',
    duration: 60,
    day: 'MONDAY'
  })

  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    note: '',
    duration: 60,
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    color: '#3B82F6',
    day: 'MONDAY',
    startTime: '09:00',
    goalId: '',
    milestoneId: '',
    type: 'STUDY' as 'STUDY' | 'CLASS' | 'PROJECT' | 'HEALTH' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP' | 'OTHER',
    category: 'ACADEMIC' as 'ACADEMIC' | 'PROFESSIONAL' | 'PERSONAL' | 'HEALTH' | 'OTHER'
  })

  const [newFixedTime, setNewFixedTime] = useState({
    title: '',
    description: '',
    days: [] as string[],
    startTime: '09:00',
    endTime: '17:00',
    type: 'OTHER' as FixedTime['type'],
    color: '#6B7280',
    isEditable: true,
    freePeriods: [] as {id: string, title: string, startTime: string, endTime: string, duration: number, day: string}[]
  })

  const [timeSettings, setTimeSettings] = useState<TimeSettings>({
    startHour: 0,
    endHour: 24,
    interval: 60,
    displayMode: 'horizontal',
    cellHeight: 60,
    showWeekends: true,
    compactMode: false,
    extendedHours: {
      morning: false,
      evening: false,
      night: false,
      custom: []
    },
    showSleepBlocks: true,
    autoLockSleep: true,
    show24Hours: true
  })

  const getAuthToken = (): string => {
    const token = localStorage.getItem('access_token')
    return token ? `Bearer ${token}` : ''
  }

  // ==================== Local Draft Persistence (per-user) ====================
  // Prevents loss of unsaved timetable changes on refresh / network issues.
  // Each user gets their own localStorage key (derived from their auth token),
  // so multiple users on the same browser/device never see each other's drafts.

  const getUserIdentifier = (): string | null => {
    if (typeof window === 'undefined') return null
    const token = localStorage.getItem('access_token')
    if (!token) return null

    // Try to pull a stable user id (sub/id/email) out of a JWT payload
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(decodeURIComponent(escape(atob(base64))))
        const id = payload.sub || payload.userId || payload.id || payload.user_id || payload.email
        if (id) return String(id)
      }
    } catch (e) {
      // Not a decodable JWT — fall back to hashing the raw token below
    }

    // Fallback: stable hash of the token itself, so at least different
    // logins/users still end up with different, isolated draft keys.
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
    draftFixedTimes: FixedTime[],
    draftSleepSchedules: SleepSchedule[],
    draftTasks: TimeSlot[],
    draftTimeSettings: TimeSettings
  ) => {
    if (typeof window === 'undefined') return
    const key = getDraftStorageKey()
    if (!key) return
    try {
      const draft = {
        fixedTimes: draftFixedTimes,
        sleepSchedules: draftSleepSchedules,
        // Sleep-time blocks are regenerated automatically from sleepSchedules,
        // so we don't need to persist them separately.
        tasks: draftTasks.filter(t => !t.isSleepTime),
        timeSettings: draftTimeSettings,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem(key, JSON.stringify(draft))
    } catch (e) {
      console.error('Failed to save local timetable draft:', e)
    }
  }

  const loadDraftLocally = (): {
    fixedTimes: FixedTime[]
    sleepSchedules: SleepSchedule[]
    tasks: TimeSlot[]
    timeSettings?: TimeSettings
  } | null => {
    if (typeof window === 'undefined') return null
    const key = getDraftStorageKey()
    if (!key) return null
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      return JSON.parse(raw)
    } catch (e) {
      console.error('Failed to load local timetable draft:', e)
      return null
    }
  }

  const clearDraftLocally = () => {
    if (typeof window === 'undefined') return
    const key = getDraftStorageKey()
    if (!key) return
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('Failed to clear local timetable draft:', e)
    }
  }

  // On mount, prefer restoring an unsaved local draft (per logged-in user)
  // over re-fetching from the server.
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
      if (draft.timeSettings) {
        setTimeSettings(draft.timeSettings)
      }
      setIsLoading(false)
      toast.info('Restored your unsaved timetable from this device. Lock it to save permanently.')
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
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    if (timeSettings.showSleepBlocks) {
      generateSleepTasks()
    } else {
      setTasks(prev => prev.filter(task => !task.isSleepTime))
    }
  }, [sleepSchedules, timeSettings.showSleepBlocks])

  useEffect(() => {
    setHasUnsavedChanges(tasks.length > 0 || fixedTimes.length > 0 || sleepSchedules.length > 0)
  }, [tasks, fixedTimes, sleepSchedules])

  // Auto-save the in-progress timetable to localStorage (per user).
  useEffect(() => {
    if (isLoading) return
    if (isLocked) return
    saveDraftLocally(fixedTimes, sleepSchedules, tasks, timeSettings)
  }, [tasks, fixedTimes, sleepSchedules, timeSettings, isLoading, isLocked])

  // NEW: Every time the Sleep Schedule modal opens, build a fresh editable
  // draft from the real schedules. Edits stay in this draft until "Save".
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

  const fetchFullTimeTable = async () => {
    setIsLoading(true)
    try {
      const token = getAuthToken()
      if (!token) {
        toast.error('Please login to view timetable')
        setIsLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/time-table/full`, {
        headers: {
          'Authorization': token
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch timetable')
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        const apiData: FullTimeTableResponse[] = data.data
        
        // Clear existing data
        setTasks([])
        setFixedTimes([])
        setSleepSchedules([])
        
        const fixedTimesMap = new Map<string, FixedTime>()
        const sleepSlotsById = new Map<string, { day: string; slot: FullTimeTableSlot }[]>()
        const allTasks: TimeSlot[] = []

        // ---- Pass 1: FIXED slots (so FREE slots can always find their parent) ----
        apiData.forEach(dayData => {
          dayData.slots.forEach(slot => {
            if (slot.type === 'FIXED' && slot.fixedTimeId) {
              const existing = fixedTimesMap.get(slot.fixedTimeId)
              if (!existing) {
                const type = guessFixedTypeFromTitle(slot.title)
                fixedTimesMap.set(slot.fixedTimeId, {
                  id: `fixed-${Date.now()}-${Math.random()}`,
                  serverId: slot.fixedTimeId,
                  title: slot.title,
                  description: slot.description || undefined,
                  days: [dayData.day],
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  type,
                  color: slot.color || getFixedTimeColor(type),
                  isEditable: true,
                  freePeriods: []
                })
              } else if (!existing.days.includes(dayData.day)) {
                existing.days.push(dayData.day)
              }
            }
          })
        })

        // ---- Pass 2: FREE periods, SLEEP slots and TASK slots ----
        const taskTypes = ['STUDY', 'PROJECT', 'CLASS', 'HEALTH', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT']
        apiData.forEach(dayData => {
          dayData.slots.forEach(slot => {
            // FREE slots (free periods within fixed commitments)
            if (slot.type === 'FREE' && slot.fixedTimeId && slot.freePeriodId) {
              const fixedTime = fixedTimesMap.get(slot.fixedTimeId)
              if (fixedTime) {
                if (!fixedTime.freePeriods) fixedTime.freePeriods = []
                const exists = fixedTime.freePeriods.find(fp => fp.id === slot.freePeriodId)
                if (!exists) {
                  fixedTime.freePeriods.push({
                    id: slot.freePeriodId,
                    title: slot.title,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    duration: calculateDuration(slot.startTime, slot.endTime),
                    day: dayData.day
                  })
                }
              }
            }

            // SLEEP slots — collected first, merged below
            if (slot.type === 'SLEEP' && slot.sleepScheduleId) {
              const list = sleepSlotsById.get(slot.sleepScheduleId) || []
              list.push({ day: dayData.day, slot })
              sleepSlotsById.set(slot.sleepScheduleId, list)
            }

            // TASK slots
            if (taskTypes.includes(slot.type) && slot.taskId) {
              // A task that ends exactly at midnight can come back as "00:00";
              // inside the UI that must be "24:00" so it renders and validates.
              const endTime =
                slot.endTime === '00:00' && slot.startTime !== '00:00' ? '24:00' : slot.endTime

              allTasks.push({
                id: slot.taskId,
                title: slot.title,
                subject: slot.subject || 'General',
                startTime: slot.startTime,
                endTime,
                duration: slot.duration || calculateDuration(slot.startTime, endTime),
                priority: (slot.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') || 'MEDIUM',
                color: slot.color || '#3B82F6',
                day: dayData.day,
                type: mapAPITypeToUIType(slot.type),
                description: slot.description || undefined,
                serverId: slot.taskId,
                status: slot.status || 'PENDING',
                category: slot.category || 'ACADEMIC'
              })
            }
          })
        })

        // ---- Merge sleep slots into one schedule each ----
        // If the server split an overnight sleep in two (night part ending at
        // midnight + morning part starting at 00:00) we glue them back together
        // and keep the day the user chose for the schedule.
        const sleepSchedulesArray: SleepSchedule[] = []
        sleepSlotsById.forEach((entries, id) => {
          const first = entries[0]
          let day = first.day
          let bedtime = first.slot.startTime
          let wakeTime = first.slot.endTime

          if (entries.length > 1) {
            const night = entries.find(e =>
              (e.slot.endTime === '24:00' || e.slot.endTime === '00:00') && e.slot.startTime !== '00:00'
            )
            const morning = entries.find(e =>
              e.slot.startTime === '00:00' && e.slot.endTime !== '00:00' && e.slot.endTime !== '24:00'
            )
            if (night && morning) {
              day = night.day
              bedtime = night.slot.startTime
              wakeTime = morning.slot.endTime
            }
          }

          sleepSchedulesArray.push({
            id,
            day,
            bedtime,
            wakeTime,
            duration: calculateDuration(bedtime, wakeTime),
            isActive: true,
            type: guessSleepTypeFromTitle(first.slot.title),
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
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGoals = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/goals`, {
        headers: {
          'Authorization': token
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch goals')
      }
      
      const data = await response.json()
      
      if (data.success && data.data?.goals) {
        setGoals(data.data.goals)
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
      toast.error('Failed to load goals')
    }
  }

  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = convertTimeToMinutes(startTime)
    const end = convertTimeToMinutes(endTime)
    return end >= start ? end - start : (24 * 60 - start) + end
  }

  const getFixedTimeColor = (type: string): string => {
    const fixedTimeType = FIXED_TIME_TYPES.find(t => t.id === type)
    return fixedTimeType?.color || '#6B7280'
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const days = timeSettings.showWeekends 
    ? ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    : ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
  
  const generateTimeSlots = () => {
    let slots: string[] = []
    let actualStartHour = timeSettings.startHour
    let actualEndHour = timeSettings.endHour

    // Generate all 24 hours if show24Hours is true
    if (timeSettings.show24Hours) {
      actualStartHour = 0
      actualEndHour = 24
    }

    if (timeSettings.extendedHours.morning) {
      actualStartHour = Math.min(actualStartHour, 5)
    }

    if (timeSettings.extendedHours.evening) {
      actualEndHour = Math.max(actualEndHour, 22)
    }

    if (timeSettings.extendedHours.night) {
      actualEndHour = Math.max(actualEndHour, 23)
    }

    const customSlots = timeSettings.extendedHours.custom
    
    const totalMinutes = (actualEndHour - actualStartHour) * 60
    for (let i = 0; i <= totalMinutes; i += timeSettings.interval) {
      const hour = Math.floor(i / 60) + actualStartHour
      const minute = i % 60
      if (hour < 24) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(timeStr)
      }
    }

    // Add midnight if not included
    if (!slots.includes('00:00')) {
      slots.unshift('00:00')
    }

    // Add 24:00 if not included
    if (!slots.includes('24:00')) {
      slots.push('24:00')
    }

    const allSlots = [...slots, ...customSlots]
      .filter((slot, index, self) => self.indexOf(slot) === index)
      .sort((a, b) => {
        const [aHours, aMins] = a.split(':').map(Number)
        const [bHours, bMins] = b.split(':').map(Number)
        return (aHours * 60 + aMins) - (bHours * 60 + bMins)
      })

    return allSlots
  }

  const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots())

  useEffect(() => {
    setTimeSlots(generateTimeSlots())
  }, [timeSettings])

  const formatTimeDisplay = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number)
    if (hours === 24) {
      return '12:00 AM (Midnight)'
    }
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
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

  const calculateTaskSpan = (task: TimeSlot): number => {
    if (task.span) return task.span
    
    const startMinutes = convertTimeToMinutes(task.startTime)
    const endMinutes = convertTimeToMinutes(task.endTime)
    const duration = endMinutes - startMinutes
    return Math.max(1, Math.ceil(duration / timeSettings.interval))
  }

  // FIXED: a task that ends exactly at midnight now gets "24:00" instead of
  // "00:00". "00:00" is EARLIER than the start time, so the old code made
  // 11 PM – 12 AM tasks invisible (they never matched any cell).
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

  // Safely formats a day constant ("MONDAY" -> "Monday").
  const formatDayLabel = (day?: string): string => {
    if (!day) return ''
    return day.charAt(0) + day.slice(1).toLowerCase()
  }

  const cn = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ')
  }

  // Shows a toast with a short bullet list of problems.
  const showIssuesToast = (title: string, lines: string[]) => {
    toast.error(title, {
      description: (
        <div className="space-y-1 mt-1">
          {lines.slice(0, 5).map((line, i) => (
            <div key={i}>• {line}</div>
          ))}
          {lines.length > 5 && <div>…and {lines.length - 5} more</div>}
        </div>
      ),
      duration: 10000
    })
  }

  // ==================== Frontend validation helpers ====================
  // Everything below lets the UI refuse bad data BEFORE the user ever hits
  // "Lock", so the backend never has to reject the timetable.

  // A time that is used as an END (24:00 / 00:00 / 23:59 all mean "end of day").
  const toEndMinutes = (time: string): number => {
    const m = convertTimeToMinutes(time)
    return m === 0 || m === 1439 ? MINUTES_IN_DAY : m
  }

  // Minute ranges a fixed commitment occupies on each of its days.
  const getFixedIntervals = (ft: FixedTime): Array<[number, number]> => {
    const rawStart = convertTimeToMinutes(ft.startTime)
    const rawEnd = convertTimeToMinutes(ft.endTime)
    if (rawStart === rawEnd) return []
    if (rawEnd < rawStart && rawEnd !== 0) {
      // Overnight commitment (e.g. 22:00 -> 02:00)
      return [[0, rawEnd], [rawStart, MINUTES_IN_DAY]]
    }
    return [[rawStart, toEndMinutes(ft.endTime)]]
  }

  const getFreeIntervals = (ft: FixedTime, day: string): Array<[number, number]> => {
    return (ft.freePeriods || [])
      .filter(fp => fp.day === day)
      .map(fp => [convertTimeToMinutes(fp.startTime), toEndMinutes(fp.endTime)] as [number, number])
      .filter(([s, e]) => e > s)
  }

  // Is [a, b) completely covered by the union of the given intervals?
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

  // THE central check: can a task of `duration` minutes start at `startTime`
  // on `day`? Returns an error message, or (when OK) the fixed commitment /
  // free period it sits inside so the link is always saved correctly.
  const analyzePlacement = (
    day: string,
    startTime: string,
    duration: number,
    fixedList: FixedTime[] = fixedTimes
  ): PlacementResult => {
    const start = convertTimeToMinutes(startTime)

    if (start >= MINUTES_IN_DAY) {
      return { error: 'The 12:00 AM (end of day) slot cannot hold a task. Please pick a time before midnight.' }
    }
    if (!duration || duration <= 0) {
      return { error: 'Duration must be greater than 0 minutes.' }
    }
    const end = start + duration
    if (end > MINUTES_IN_DAY) {
      const maxFit = MINUTES_IN_DAY - start
      return {
        error: `This task would run past midnight (starts ${formatTimeDisplay(startTime)}, ${duration} min). Tasks cannot cross midnight — use ${maxFit} minutes or less, or start earlier.`
      }
    }

    let link: PlacementResult = {}
    for (const ft of fixedList) {
      if (!ft.days.includes(day)) continue
      const free = getFreeIntervals(ft, day)
      for (const [fs, fe] of getFixedIntervals(ft)) {
        const a = Math.max(start, fs)
        const b = Math.min(end, fe)
        if (a >= b) continue // no overlap with this commitment

        if (!isCovered(a, b, free)) {
          return {
            error: `Overlaps with fixed commitment "${ft.title}" (${formatTimeDisplay(ft.startTime)} – ${formatTimeDisplay(ft.endTime)}) on ${formatDayLabel(day)}. Add a free period inside it for this time first, or choose another time.`
          }
        }
        if (!link.fixedTimeId) {
          const fp = (ft.freePeriods || []).find(f =>
            f.day === day &&
            convertTimeToMinutes(f.startTime) <= a &&
            toEndMinutes(f.endTime) > a
          )
          link = { fixedTimeId: ft.id, freePeriodId: fp?.id }
        }
      }
    }
    return link
  }

  // Minute ranges of one day that a sleep schedule occupies.
  // Overnight sleep (23:00 -> 07:00) shows on the SAME day as two pieces:
  // the morning part (00:00 -> 07:00) and the night part (23:00 -> 24:00).
  const getSleepWindows = (bedtime: string, wakeTime: string): Array<[number, number]> => {
    const bed = convertTimeToMinutes(bedtime)
    const wake = convertTimeToMinutes(wakeTime)
    if (bed === wake) return []
    if (wake < bed) {
      return ([[0, wake], [bed, MINUTES_IN_DAY]] as Array<[number, number]>).filter(([s, e]) => e > s)
    }
    return [[bed, wake]]
  }

  const describeTask = (t: TimeSlot): string =>
    `"${t.title}" (${formatDayLabel(t.day)} ${formatTimeDisplay(t.startTime)} – ${formatTimeDisplay(t.endTime)})`

  // Real tasks (never the generated sleep blocks) that overlap this sleep window.
  const findTasksInSleepWindow = (day: string, bedtime: string, wakeTime: string): TimeSlot[] => {
    const windows = getSleepWindows(bedtime, wakeTime)
    return tasks.filter(t => {
      if (t.isSleepTime || t.day !== day) return false
      const ts = convertTimeToMinutes(t.startTime)
      const te = t.endTime === '24:00' || t.endTime === '00:00' ? MINUTES_IN_DAY : convertTimeToMinutes(t.endTime)
      return windows.some(([s, e]) => ts < e && te > s)
    })
  }

  // Free period must sit inside its fixed commitment, on one of its days, and
  // must not overlap another free period of the same day.
  const validateNewFreePeriod = (
    ft: FixedTime,
    fp: { day: string; startTime: string; endTime: string }
  ): string | null => {
    if (!ft.days.includes(fp.day)) {
      return `"${ft.title}" does not run on ${formatDayLabel(fp.day)}.`
    }
    const s = convertTimeToMinutes(fp.startTime)
    const e = toEndMinutes(fp.endTime)
    if (e <= s) return 'End time must be after start time.'
    const inside = getFixedIntervals(ft).some(([fs, fe]) => s >= fs && e <= fe)
    if (!inside) {
      return `Free period must be inside "${ft.title}" (${formatTimeDisplay(ft.startTime)} – ${formatTimeDisplay(ft.endTime)}).`
    }
    const overlaps = getFreeIntervals(ft, fp.day).some(([fs, fe]) => s < fe && e > fs)
    if (overlaps) {
      return `Another free period already exists on ${formatDayLabel(fp.day)} in that time range.`
    }
    return null
  }

  const validateFixedTimeDefinition = (ft: { title: string; startTime: string; endTime: string; days: string[] }): string | null => {
    if (!ft.title.trim()) return 'Please enter a title'
    if (ft.days.length === 0) return 'Please select at least one day'
    if (!ft.startTime || !ft.endTime) return 'Please set start and end time'
    if (ft.startTime === ft.endTime) return 'Start time and end time cannot be the same'
    return null
  }

  // Tasks that would START conflicting because of a change to fixed commitments
  // (new commitment, edited times/days, removed free period).
  const findNewTaskConflicts = (oldList: FixedTime[], newList: FixedTime[]): TimeSlot[] => {
    return tasks.filter(t => {
      if (t.isSleepTime) return false
      const before = analyzePlacement(t.day, t.startTime, t.duration, oldList)
      const after = analyzePlacement(t.day, t.startTime, t.duration, newList)
      return !before.error && !!after.error
    })
  }

  // Looks through the WHOLE timetable and lists everything the backend would
  // reject — shown to the user before the lock request is ever sent.
  const validateWholeTimetable = (): string[] => {
    const issues: string[] = []

    fixedTimes.forEach(ft => {
      const defError = validateFixedTimeDefinition(ft)
      if (defError) issues.push(`Fixed commitment "${ft.title || 'Untitled'}": ${defError}.`)
      ;(ft.freePeriods || []).forEach(fp => {
        const inside =
          ft.days.includes(fp.day) &&
          getFixedIntervals(ft).some(([fs, fe]) =>
            convertTimeToMinutes(fp.startTime) >= fs && toEndMinutes(fp.endTime) <= fe
          )
        if (!inside) {
          issues.push(`Free period "${fp.title}" (${formatDayLabel(fp.day)}) is outside its fixed commitment "${ft.title}". Remove it or edit the commitment.`)
        }
      })
    })

    tasks.filter(t => !t.isSleepTime).forEach(t => {
      const check = analyzePlacement(t.day, t.startTime, t.duration)
      if (check.error) issues.push(`Task ${describeTask(t)}: ${check.error}`)
    })

    sleepSchedules.filter(s => s.isActive).forEach(s => {
      if (s.bedtime === s.wakeTime) {
        issues.push(`Sleep on ${formatDayLabel(s.day)}: bedtime and wake time are the same.`)
      }
    })

    return issues
  }

  // First free slot (preferring 8 AM onwards) where a task of `duration`
  // fits without touching fixed commitments, other tasks or sleep.
  const findAvailableSlot = (
    duration: number,
    existingTasks: TimeSlot[]
  ): { day: string; time: string; link: PlacementResult } | null => {
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
          e > convertTimeToMinutes(t.startTime)
        )
        if (clashesTask) continue
        const clashesSleep = sleepSchedules.some(sl =>
          sl.isActive && sl.day === day &&
          getSleepWindows(sl.bedtime, sl.wakeTime).some(([ws, we]) => s < we && e > ws)
        )
        if (clashesSleep) continue
        return { day, time, link: check }
      }
    }
    return null
  }

  // Duration choices for the "add task" dialog — only options that still end
  // before midnight are offered.
  const getDurationOptions = (startTime: string): number[] => {
    const start = convertTimeToMinutes(startTime)
    const opts = [1, 2, 3, 4]
      .map(m => timeSettings.interval * m)
      .filter(d => start + d <= MINUTES_IN_DAY)
    if (opts.length === 0 && start < MINUTES_IN_DAY) return [MINUTES_IN_DAY - start]
    return opts
  }

  // ==================== Goals / stats ====================

  const getScheduledHoursByGoal = () => {
    const goalHours: Record<string, number> = {}
    
    tasks.forEach(task => {
      if (task.goalId && !task.isSleepTime) {
        if (!goalHours[task.goalId]) {
          goalHours[task.goalId] = 0
        }
        goalHours[task.goalId] += task.duration / 60
      }
    })
    
    return goalHours
  }

  const getSleepStats = () => {
    const activeSchedules = sleepSchedules.filter(s => s.isActive)
    const totalSleepHours = activeSchedules.reduce((sum, s) => sum + (s.duration / 60), 0)
    const avgSleepHours = activeSchedules.length > 0 ? totalSleepHours / activeSchedules.length : 0
    
    return {
      totalSleepHours,
      avgSleepHours,
      daysWithSleep: activeSchedules.length,
      recommendedHours: 8
    }
  }

  useEffect(() => {
    const scheduledHoursByGoal = getScheduledHoursByGoal()
    
    const updatedGoals: Goal[] = goals.map((goal): Goal => {
      const completedHours = scheduledHoursByGoal[goal.id] || 0
      
      const updatedMilestones = goal.milestones.map(milestone => {
        const milestoneTasks = tasks.filter(task => 
          task.goalId === goal.id && task.milestoneId === milestone.id
        )
        const milestoneHours = milestoneTasks.reduce((sum, task) => sum + (task.duration / 60), 0)
        
        return {
          ...milestone,
          completedHours: milestoneHours,
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
      const nextStatus: Goal['status'] = totalProgress >= 100
        ? 'COMPLETED'
        : totalProgress > 0
          ? 'IN_PROGRESS'
          : 'NOT_STARTED'

      return {
        ...goal,
        completedHours,
        progress: Math.round(totalProgress),
        milestones: updatedMilestones,
        status: nextStatus,
        streak: newStreak,
        lastUpdated: new Date()
      }
    })
    
    setGoals(updatedGoals)
  }, [tasks])

  // ==================== Sleep blocks ====================
  // FIXED: a sleep schedule now stays on the day the user picked.
  // Before, an overnight sleep put its long morning part (00:00 -> wake) on
  // the NEXT day, so "Monday" looked like "Tuesday". Now both pieces
  // (morning part + night part) are drawn on the selected day.
  const generateSleepTasks = () => {
    const sleepTasks: TimeSlot[] = []
    
    sleepSchedules.forEach(schedule => {
      if (!schedule.isActive) return
      
      const bedtimeMinutes = convertTimeToMinutes(schedule.bedtime)
      const wakeTimeMinutes = convertTimeToMinutes(schedule.wakeTime)
      if (bedtimeMinutes === wakeTimeMinutes) return

      const title = schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep'
      const base = {
        title,
        subject: 'Rest',
        priority: 'MEDIUM' as const,
        color: schedule.color || '#4B5563',
        day: schedule.day,
        type: 'sleep' as const,
        isSleepTime: true,
        sleepScheduleId: schedule.id,
        isCompleted: false
      }
      
      if (wakeTimeMinutes < bedtimeMinutes) {
        // Morning part: 00:00 -> wake time
        if (wakeTimeMinutes > 0) {
          sleepTasks.push({
            ...base,
            id: `sleep-${schedule.id}-morning`,
            startTime: '00:00',
            endTime: schedule.wakeTime,
            duration: wakeTimeMinutes
          })
        }
        // Night part: bedtime -> midnight
        sleepTasks.push({
          ...base,
          id: `sleep-${schedule.id}-night`,
          startTime: schedule.bedtime,
          endTime: '24:00',
          duration: MINUTES_IN_DAY - bedtimeMinutes
        })
      } else {
        sleepTasks.push({
          ...base,
          id: `sleep-${schedule.id}`,
          startTime: schedule.bedtime,
          endTime: schedule.wakeTime,
          duration: wakeTimeMinutes - bedtimeMinutes
        })
      }
    })
    
    setTasks(prev => [...prev.filter(task => !task.isSleepTime), ...sleepTasks])
  }

  // ==================== Task handlers ====================

  const getTaskPool = (): TimeSlot[] => {
    return [
      {
        id: 'pool-1',
        title: 'Study React Hooks',
        subject: 'Web Development',
        startTime: '',
        endTime: '',
        duration: 60,
        priority: 'HIGH' as const,
        color: '#3B82F6',
        day: '',
        type: 'study' as const
      },
      {
        id: 'pool-2',
        title: 'DSA Arrays Practice',
        subject: 'DSA',
        startTime: '',
        endTime: '',
        duration: 90,
        priority: 'CRITICAL' as const,
        color: '#EF4444',
        day: '',
        type: 'study' as const
      }
    ]
  }

  const handleDragEnd = (result: any) => {
    if (isLocked) return
    
    const { taskId, day, time, duration } = result
    
    const existingTask = tasks.find(t => t.id === taskId)
    if (existingTask?.isSleepTime) {
      toast.error('Sleep time blocks cannot be moved. Adjust sleep schedule instead.')
      return
    }

    const goal = goals.find(g => g.id === taskId)
    const milestone = goal?.milestones.find(m => m.id === taskId)
    const taskFromPool = getTaskPool().find(t => t.id === taskId)
    const finalDuration = duration || existingTask?.duration || taskFromPool?.duration || 60

    const check = analyzePlacement(day, time, finalDuration)
    if (check.error) {
      toast.error('Cannot place the task here', { description: check.error, duration: 7000 })
      return
    }
    
    const existingTaskIndex = tasks.findIndex(t => t.id === taskId)
    
    if (existingTaskIndex >= 0) {
      const updatedTasks = [...tasks]
      updatedTasks[existingTaskIndex] = {
        ...updatedTasks[existingTaskIndex],
        day,
        startTime: time,
        endTime: calculateEndTime(time, finalDuration),
        duration: finalDuration,
        fixedCommitmentId: check.fixedTimeId,
        freePeriodId: check.freePeriodId
      }
      setTasks(updatedTasks)
    } else if (goal || milestone) {
      const newTaskObj: TimeSlot = {
        id: newTaskId(),
        title: milestone ? milestone.title : goal!.title,
        subject: goal!.subject || goal!.title,
        startTime: time,
        endTime: calculateEndTime(time, finalDuration),
        duration: finalDuration,
        priority: goal!.priority,
        color: goal!.color,
        day,
        type: 'task',
        goalId: goal!.id,
        milestoneId: milestone?.id,
        fixedCommitmentId: check.fixedTimeId,
        freePeriodId: check.freePeriodId
      }
      setTasks([...tasks, newTaskObj])
      toast.success('Task added from goal')
    } else if (taskFromPool) {
      const newTaskObj: TimeSlot = {
        ...taskFromPool,
        day,
        startTime: time,
        endTime: calculateEndTime(time, taskFromPool.duration),
        id: newTaskId(),
        fixedCommitmentId: check.fixedTimeId,
        freePeriodId: check.freePeriodId
      }
      setTasks([...tasks, newTaskObj])
      toast.success('Task added from pool')
    }
  }

  // Opens the "add task" dialog for a given slot with sensible defaults.
  const openTaskDialog = (day: string, time: string) => {
    setNewTask(prev => ({
      ...prev,
      day,
      startTime: time,
      duration: Math.min(timeSettings.interval, Math.max(MINUTES_IN_DAY - convertTimeToMinutes(time), 1))
    }))
    setTaskCreationFlow('simple')
    setTaskCreationContext({ day, time })
    setShowTaskCreationDialog(true)
  }

  const handleCellClick = (day: string, time: string) => {
    if (isLocked) return

    if (convertTimeToMinutes(time) >= MINUTES_IN_DAY) {
      toast.info('This is the end-of-day marker. Pick a slot before midnight to add a task.')
      return
    }
    
    // NOTE: Tasks are ALLOWED during sleep time — we no longer block the click.

    const fixedTime = isTimeInFixedSlot(day, time)
    
    if (fixedTime) {
      const isInFreePeriod = fixedTime.freePeriods?.some(fp => 
        fp.day === day && isTimeInFreePeriodRange(time, fp.startTime, fp.endTime)
      )
      
      if (!isInFreePeriod) {
        // Quick "Add Free Period" modal, pre-filled with the clicked day/time
        const nextSlot = getNextTimeSlot(time)
        const defaultEnd = convertTimeToMinutes(nextSlot) === 0 ? '23:59' : nextSlot
        setNewFreePeriod({
          title: 'Free Period',
          startTime: time,
          endTime: defaultEnd,
          duration: timeSettings.interval,
          day: day
        })
        setQuickFreePeriodContext({ day, time, fixedTime })
        setShowQuickFreePeriodModal(true)
        return
      }
    }

    openTaskDialog(day, time)
  }

  const handleFixedTimeClick = (fixedTime: FixedTime) => {
    setSelectedFixedTime(fixedTime)
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const check = analyzePlacement(newTask.day, newTask.startTime, newTask.duration)
    if (check.error) {
      toast.error('Cannot add this task', { description: check.error, duration: 7000 })
      return
    }

    const task: TimeSlot = {
      id: newTaskId(),
      title: newTask.title,
      subject: newTask.subject || 'General',
      startTime: newTask.startTime,
      endTime: calculateEndTime(newTask.startTime, newTask.duration),
      duration: newTask.duration,
      priority: newTask.priority,
      color: newTask.color,
      day: newTask.day,
      type: 'task',
      fixedCommitmentId: check.fixedTimeId,
      freePeriodId: check.freePeriodId,
      goalId: cleanId(newTask.goalId),
      milestoneId: cleanId(newTask.milestoneId),
      note: newTask.note,
      status: 'PENDING'
    }

    setTasks([...tasks, task])
    resetTaskForm()
    setShowAddTaskModal(false)
    toast.success('Task added successfully')
  }

  const handleUpdateTask = () => {
    if (!editingTask) return
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const check = analyzePlacement(newTask.day, newTask.startTime, newTask.duration)
    if (check.error) {
      toast.error('Cannot save this change', { description: check.error, duration: 7000 })
      return
    }

    // Copy fields explicitly (newTask.type is the UPPERCASE API form while
    // TimeSlot.type is lowercase), keeping the task's own type and category.
    const updatedTask: TimeSlot = {
      ...editingTask,
      title: newTask.title,
      subject: newTask.subject,
      note: newTask.note,
      duration: newTask.duration,
      priority: newTask.priority,
      color: newTask.color,
      day: newTask.day,
      startTime: newTask.startTime,
      goalId: cleanId(newTask.goalId),
      milestoneId: cleanId(newTask.milestoneId),
      endTime: calculateEndTime(newTask.startTime, newTask.duration),
      fixedCommitmentId: check.fixedTimeId,
      freePeriodId: check.freePeriodId
    }
    setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
    setEditingTask(null)
    setShowAddTaskModal(false)
    resetTaskForm()
    toast.success('Task updated')
  }

  const handleAddTaskToCell = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }
    
    if (!taskCreationContext) {
      toast.error('No cell selected')
      return
    }

    const check = analyzePlacement(taskCreationContext.day, taskCreationContext.time, newTask.duration)
    if (check.error) {
      toast.error('Cannot add this task', { description: check.error, duration: 7000 })
      return
    }

    const task: TimeSlot = {
      id: newTaskId(),
      title: newTask.title,
      subject: newTask.subject || 'General',
      startTime: taskCreationContext.time,
      endTime: calculateEndTime(taskCreationContext.time, newTask.duration),
      duration: newTask.duration,
      priority: newTask.priority,
      color: newTask.color,
      day: taskCreationContext.day,
      type: 'task',
      fixedCommitmentId: check.fixedTimeId,
      freePeriodId: check.freePeriodId,
      goalId: cleanId(newTask.goalId),
      milestoneId: cleanId(newTask.milestoneId),
      note: newTask.note,
      status: 'PENDING'
    }

    setTasks([...tasks, task])
    resetTaskForm()
    setShowTaskCreationDialog(false)
    setTaskCreationContext(null)
    toast.success('Task added to timetable')
  }

  const resetTaskForm = () => {
    setNewTask({
      title: '',
      subject: '',
      note: '',
      duration: 60,
      priority: 'MEDIUM',
      color: '#3B82F6',
      day: 'MONDAY',
      startTime: '09:00',
      goalId: '',
      milestoneId: '',
      type: 'STUDY',
      category: 'ACADEMIC'
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
      title: task.title,
      subject: task.subject,
      note: task.note || '',
      duration: task.duration,
      priority: task.priority,
      color: task.color,
      day: task.day,
      startTime: task.startTime,
      goalId: task.goalId || '',
      milestoneId: task.milestoneId || '',
      type: 'STUDY',
      category: 'ACADEMIC'
    })
    setShowAddTaskModal(true)
  }

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task?.isSleepTime) {
      const sleepSchedule = sleepSchedules.find(s => s.id === task.sleepScheduleId)
      if (sleepSchedule) {
        setSleepSchedules(sleepSchedules.map(s =>
          s.id === sleepSchedule.id ? { ...s, isActive: false } : s
        ))
        toast.success('Sleep schedule deactivated')
      }
      return
    }
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success('Task deleted')
  }

  const handleDuplicateTask = (task: TimeSlot) => {
    if (task.isSleepTime) {
      toast.error('Cannot duplicate sleep tasks')
      return
    }
    
    const duplicatedTask = {
      ...task,
      id: newTaskId(),
      title: `${task.title} (Copy)`
    }
    setTasks([...tasks, duplicatedTask])
    toast.success('Task duplicated')
  }

  // ==================== Fixed commitment handlers ====================

  const resetNewFixedTime = () => {
    setNewFixedTime({
      title: '',
      description: '',
      days: [],
      startTime: '09:00',
      endTime: '17:00',
      type: 'OTHER',
      color: '#6B7280',
      isEditable: true,
      freePeriods: []
    })
  }

  const handleAddFixedTime = () => {
    const defError = validateFixedTimeDefinition(newFixedTime)
    if (defError) {
      toast.error(defError)
      return
    }

    const fixedTime: FixedTime = {
      id: `fixed-${Date.now()}-${Math.random()}`,
      title: newFixedTime.title,
      description: newFixedTime.description,
      days: newFixedTime.days,
      startTime: newFixedTime.startTime,
      endTime: newFixedTime.endTime,
      type: newFixedTime.type,
      color: newFixedTime.color,
      isEditable: newFixedTime.isEditable,
      freePeriods: newFixedTime.freePeriods || []
    }

    // Don't allow a commitment on top of tasks that already exist there.
    const newList = [...fixedTimes, fixedTime]
    const conflicts = findNewTaskConflicts(fixedTimes, newList)
    if (conflicts.length > 0) {
      showIssuesToast(
        `Cannot add "${fixedTime.title}" — tasks already exist in that time`,
        [
          ...conflicts.map(describeTask),
          'Delete or move these tasks first (or add a free period for them), then add the commitment.'
        ]
      )
      return
    }

    setFixedTimes(newList)
    resetNewFixedTime()
    setShowAddFixedTimeModal(false)
    toast.success('Fixed commitment added')
  }

  const handleEditFixedTime = (fixedTime: FixedTime) => {
    setEditingFixedTime(fixedTime)
    setShowEditFixedTimeModal(true)
  }

  const handleSaveFixedTime = (updatedFixedTime: FixedTime) => {
    const defError = validateFixedTimeDefinition(updatedFixedTime)
    if (defError) {
      toast.error(defError)
      return
    }

    // Free periods must still fit inside the (possibly changed) commitment
    const stray = (updatedFixedTime.freePeriods || []).filter(fp => {
      const inside =
        updatedFixedTime.days.includes(fp.day) &&
        getFixedIntervals(updatedFixedTime).some(([fs, fe]) =>
          convertTimeToMinutes(fp.startTime) >= fs && toEndMinutes(fp.endTime) <= fe
        )
      return !inside
    })
    if (stray.length > 0) {
      showIssuesToast(
        'Some free periods no longer fit this commitment',
        [
          ...stray.map(fp => `"${fp.title}" on ${formatDayLabel(fp.day)} (${formatTimeDisplay(fp.startTime)} – ${formatTimeDisplay(fp.endTime)})`),
          'Remove those free periods first, then change the days/time.'
        ]
      )
      return
    }

    const newList = fixedTimes.map(ft => ft.id === updatedFixedTime.id ? updatedFixedTime : ft)
    const conflicts = findNewTaskConflicts(fixedTimes, newList)
    if (conflicts.length > 0) {
      showIssuesToast(
        'This change would clash with existing tasks',
        [
          ...conflicts.map(describeTask),
          'Delete or move these tasks first, then save this change.'
        ]
      )
      return
    }

    setFixedTimes(newList)
    // keep the open details dialog in sync (e.g. after removing a free period)
    setSelectedFixedTime(prev => (prev && prev.id === updatedFixedTime.id ? updatedFixedTime : prev))
    setShowEditFixedTimeModal(false)
    setEditingFixedTime(null)
    toast.success('Fixed commitment updated')
  }

  const handleDeleteFixedTime = (id: string) => {
    setFixedTimes(fixedTimes.filter(ft => ft.id !== id))
    setSelectedFixedTime(null)
    toast.success('Fixed commitment deleted')
  }

  const handleAddFreePeriod = () => {
    if (!selectedFixedTimeForFreePeriod || !newFreePeriod.day) {
      toast.error('Please select a fixed commitment and day')
      return
    }
    if (!newFreePeriod.title.trim()) {
      toast.error('Please enter a title for the free period')
      return
    }

    const error = validateNewFreePeriod(selectedFixedTimeForFreePeriod, newFreePeriod)
    if (error) {
      toast.error('Cannot add free period', { description: error, duration: 6000 })
      return
    }
    
    const freePeriod = {
      id: `free-${Date.now()}-${newFreePeriod.day}`,
      title: newFreePeriod.title,
      startTime: newFreePeriod.startTime,
      endTime: newFreePeriod.endTime,
      duration: calculateDuration(newFreePeriod.startTime, newFreePeriod.endTime),
      day: newFreePeriod.day
    }
    
    const updatedFixedTime = {
      ...selectedFixedTimeForFreePeriod,
      freePeriods: [...(selectedFixedTimeForFreePeriod.freePeriods || []), freePeriod]
    }
    
    setFixedTimes(fixedTimes.map(ft => 
      ft.id === selectedFixedTimeForFreePeriod.id ? updatedFixedTime : ft
    ))
    setSelectedFixedTime(prev => (prev && prev.id === updatedFixedTime.id ? updatedFixedTime : prev))
    
    setNewFreePeriod({
      title: 'Free Period',
      startTime: '14:00',
      endTime: '15:00',
      duration: 60,
      day: 'MONDAY'
    })
    setShowAddFreePeriodModal(false)
    setSelectedFixedTimeForFreePeriod(null)
    toast.success('Free period added')
  }

  // Adds the free period using the exact day/time that was clicked, then
  // immediately opens the Add Task dialog for that same slot.
  const handleQuickAddFreePeriod = () => {
    if (!quickFreePeriodContext) return

    const { fixedTime, day } = quickFreePeriodContext

    if (!newFreePeriod.title.trim()) {
      toast.error('Please enter a title for the free period')
      return
    }

    const error = validateNewFreePeriod(fixedTime, { day, startTime: newFreePeriod.startTime, endTime: newFreePeriod.endTime })
    if (error) {
      toast.error('Cannot add free period', { description: error, duration: 6000 })
      return
    }

    const fpDuration = calculateDuration(newFreePeriod.startTime, newFreePeriod.endTime)
    const freePeriod = {
      id: `free-${Date.now()}-${day}`,
      title: newFreePeriod.title,
      startTime: newFreePeriod.startTime,
      endTime: newFreePeriod.endTime,
      duration: fpDuration,
      day: day
    }

    const updatedFixedTime = {
      ...fixedTime,
      freePeriods: [...(fixedTime.freePeriods || []), freePeriod]
    }

    setFixedTimes(fixedTimes.map(ft =>
      ft.id === fixedTime.id ? updatedFixedTime : ft
    ))

    toast.success(`Free period added on ${formatDayLabel(day)} at ${formatTimeDisplay(newFreePeriod.startTime)}`)

    setShowQuickFreePeriodModal(false)
    setQuickFreePeriodContext(null)

    // Let the user add a task into the free period they just created
    setNewTask(prev => ({
      ...prev,
      day,
      startTime: newFreePeriod.startTime,
      duration: Math.min(timeSettings.interval, fpDuration)
    }))
    setTaskCreationFlow('simple')
    setTaskCreationContext({ day, time: newFreePeriod.startTime })
    setShowTaskCreationDialog(true)
  }

  const handleOpenFreePeriodModal = (fixedTime: FixedTime, day: string) => {
    setSelectedFixedTimeForFreePeriod(fixedTime)
    setNewFreePeriod({
      ...newFreePeriod,
      day: day
    })
    setShowAddFreePeriodModal(true)
  }

  // ==================== Sleep schedule modal (draft + Save) ====================

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
        next[day] = {
          ...prev[day],
          isActive: true,
          bedtime: src.bedtime,
          wakeTime: src.wakeTime,
          type: src.type
        }
      })
      return next
    })
    setSleepDraftDirty(true)
    toast.info(`Applied ${formatTimeDisplay(src.bedtime)} → ${formatTimeDisplay(src.wakeTime)} to all days. Click Save to keep it.`)
  }

  const handleSleepModalOpenChange = (open: boolean) => {
    if (!open && sleepDraftDirty) {
      toast.info('Sleep schedule changes were not saved.')
    }
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
        errors.push(
          `${formatDayLabel(day)} (${formatTimeDisplay(draft.bedtime)} – ${formatTimeDisplay(draft.wakeTime)}): task ${conflicts.map(c => `"${c.title}" at ${formatTimeDisplay(c.startTime)}`).join(', ')} already scheduled. Delete or move it first.`
        )
        return
      }

      const schedule: SleepSchedule = {
        id: existing?.id ?? `sleep-${day}-${Date.now()}`,
        day,
        bedtime: draft.bedtime,
        wakeTime: draft.wakeTime,
        duration,
        isActive: true,
        color: existing?.color || '#4B5563',
        type: draft.type,
        notes: draft.notes.trim() ? draft.notes.trim() : undefined
      }
      nextSchedules.push(schedule)

      const label = `${formatDayLabel(day)}: ${formatTimeDisplay(draft.bedtime)} → ${formatTimeDisplay(draft.wakeTime)} (${Math.floor(duration / 60)}h ${duration % 60}m)`
      if (!existing || !existing.isActive) {
        changes.push(`${label} — added`)
      } else if (
        existing.bedtime !== schedule.bedtime ||
        existing.wakeTime !== schedule.wakeTime ||
        existing.type !== schedule.type ||
        (existing.notes || '') !== (schedule.notes || '')
      ) {
        changes.push(`${label} — updated`)
      }
    })

    if (errors.length > 0) {
      showIssuesToast('Sleep schedule not saved', errors)
      return
    }

    if (changes.length === 0) {
      toast.info('No changes to save')
      setSleepDraftDirty(false)
      setShowSleepScheduleModal(false)
      return
    }

    setSleepSchedules(nextSchedules)
    setSleepDraftDirty(false)
    setEditingSleepSchedule(null)
    setShowSleepScheduleModal(false)
    toast.success('Sleep schedule saved', {
      description: (
        <div className="space-y-1 mt-1">
          {changes.map((c, i) => (
            <div key={i}>• {c}</div>
          ))}
        </div>
      ),
      duration: 8000
    })
  }

  // ==================== Lock / unlock ====================

  const handleLockTimetable = () => {
    if (!hasUnsavedChanges) {
      toast.info('No changes to save')
      return
    }

    // Catch every problem on the frontend first — the server should never be
    // the one telling the user their timetable has conflicts.
    const issues = validateWholeTimetable()
    if (issues.length > 0) {
      setLockIssues(issues)
      setShowLockIssues(true)
      toast.error(`Fix ${issues.length} issue${issues.length > 1 ? 's' : ''} before locking`)
      return
    }
    
    // Show confirmation dialog
    setShowLockConfirm(true)
    setLockConfirmed(false)
  }

  const handleConfirmLock = () => {
    if (!lockConfirmed) {
      toast.error('Please confirm that you understand the lock will last for 1 week')
      return
    }
    
    setShowLockConfirm(false)
    setShowLockProgress(true)
    setIsLocking(true)
    setLockProgress([{ step: 'Saving Timetable', status: 'in-progress', message: 'Preparing data...' }])
    executeLockSequence()
  }

  const handleUnlockTimetable = () => {
    setIsLocked(false)
    setLockSuccess(false)
    toast.success('Timetable unlocked')
  }

  const executeLockSequence = async () => {
    try {
      const payload = prepareLockPayload()
      
      setLockProgress([{ 
        step: 'Saving Timetable', 
        status: 'in-progress', 
        message: 'Sending data to server...' 
      }])

      const result = await lockTimetable(payload)
      
      if (result.success) {
        setLockProgress([{ 
          step: 'Saving Timetable', 
          status: 'completed', 
          message: `Created ${result.data.totalItems} items` 
        }])
        
        setIsLocking(false)
        setLockSuccess(true)
        setIsLocked(true)
        setHasUnsavedChanges(false)
        toast.success(result.message || 'Timetable locked and saved successfully!')

        // The server now holds the authoritative saved timetable —
        // the local draft is no longer needed, so remove it.
        clearDraftLocally()

        await fetchFullTimeTable()
      } else {
        throw new Error(result.message || 'Failed to save timetable')
      }
    } catch (error) {
      console.error('Lock sequence failed:', error)
      
      setLockProgress([{ 
        step: 'Saving Timetable', 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }])
      
      setIsLocking(false)
      toast.error('Failed to save timetable. No changes were saved.')
    }
  }

  const prepareLockPayload = () => {
    const apiFixedTimes: any[] = fixedTimes.map(ft => ({
      // The backend uses this to link tasks (sent with the same fixedTimeId
      // value) to the FixedTime it creates in this same request.
      clientId: ft.id,
      title: ft.title,
      description: ft.description,
      days: ft.days,
      startTime: ft.startTime,
      endTime: ft.endTime,
      type: ft.type,
      color: ft.color,
      isEditable: ft.isEditable ?? true,
      freePeriods: ft.freePeriods?.map(fp => ({
        title: fp.title,
        startTime: fp.startTime,
        endTime: fp.endTime,
        day: fp.day
      })) || []
    }))

    const apiSleepSchedules: any[] = sleepSchedules.map(s => ({
      day: s.day,
      bedtime: s.bedtime,
      wakeTime: s.wakeTime,
      duration: s.duration,
      isActive: s.isActive,
      type: s.type,
      notes: s.notes,
      color: s.color
    }))

    const apiTasks: any[] = tasks
      .filter(t => !t.isSleepTime)
      .map(task => {
        // Always recompute which fixed commitment (if any) this task sits in,
        // so tasks loaded from the server or edited later are linked too.
        const link = analyzePlacement(task.day, task.startTime, task.duration)

        const apiTask: any = {
          title: task.title,
          subject: task.subject,
          note: task.note,
          startTime: task.startTime,
          // The UI uses "24:00" for "ends at midnight". Send "23:59" instead:
          // it is a valid HH:mm and still sorts after the start time.
          endTime: task.endTime === '24:00' ? '23:59' : task.endTime,
          duration: task.duration,
          priority: task.priority,
          color: task.color,
          day: task.day,
          type: mapUITypeToAPIType(task.type),
          category: task.category || 'ACADEMIC',
          status: task.status || 'PENDING'
        }

        const goalId = cleanId(task.goalId)
        const milestoneId = cleanId(task.milestoneId)
        if (goalId) apiTask.goalId = goalId
        if (milestoneId) apiTask.milestoneId = milestoneId
        if (link.fixedTimeId) apiTask.fixedTimeId = link.fixedTimeId
        if (task.completedAt) apiTask.completedAt = task.completedAt

        return apiTask
      })

    return {
      fixedTimes: apiFixedTimes,
      sleepSchedules: apiSleepSchedules,
      tasks: apiTasks
    }
  }

  const lockTimetable = async (payload: any): Promise<LockApiResponse> => {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Please login to save timetable')
    }

    const response = await fetch(`${API_BASE_URL}/time-table/lock`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to lock timetable: ${response.status}`)
    }

    const data = await response.json()
    return data
  }

  const handleResetTimetable = async () => {
    setShowResetConfirm(true)
  }

  const confirmReset = async () => {
    setShowResetConfirm(false)
    setIsResetting(true)
    
    try {
      const token = getAuthToken()
      if (!token) {
        toast.error('Please login to reset timetable')
        setIsResetting(false)
        return
      }

      const resetPayload: ResetPayload = {
        confirm: true,
        resetTasks: true,
        resetFixedTimes: true,
        resetSleepSchedules: true
      }

      const response = await fetch(`${API_BASE_URL}/time-table/reset`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resetPayload)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to reset timetable: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setTasks([])
        setFixedTimes([])
        setSleepSchedules([])
        setHasUnsavedChanges(false)

        // Also remove any locally saved draft so it doesn't come back
        // on the next refresh after an intentional reset.
        clearDraftLocally()
        
        toast.success(data.message || `Timetable reset successfully! Deleted ${data.data.totalDeleted} items.`)
        
        await fetchFullTimeTable()
      } else {
        throw new Error(data.message || 'Failed to reset timetable')
      }
    } catch (error) {
      console.error('Error resetting timetable:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to reset timetable')
    } finally {
      setIsResetting(false)
    }
  }

  // ==================== Grid helpers ====================

  const getTasksForCell = (day: string, time: string) => {
    return tasks.filter(task => {
      if (task.day !== day) return false
      
      const taskStartMinutes = convertTimeToMinutes(task.startTime)
      const taskEndMinutes = convertTimeToMinutes(task.endTime)
      const cellMinutes = convertTimeToMinutes(time)
      
      return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
    })
  }

  const getNextTimeSlot = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + timeSettings.interval
    const nextHours = Math.floor(totalMinutes / 60) % 24
    const nextMinutes = totalMinutes % 60
    return `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`
  }

  const shouldShowTaskInCell = (task: TimeSlot, day: string, time: string) => {
    if (task.day !== day) return false
    
    const taskStartMinutes = convertTimeToMinutes(task.startTime)
    const cellMinutes = convertTimeToMinutes(time)
    
    return taskStartMinutes === cellMinutes
  }

  const getTaskSpan = (task: TimeSlot) => {
    const startMinutes = convertTimeToMinutes(task.startTime)
    const endMinutes = convertTimeToMinutes(task.endTime)
    let duration = endMinutes - startMinutes
    if (duration < 0) {
      duration += 24 * 60 // Handle overnight tasks
    }
    return Math.max(1, Math.ceil(duration / timeSettings.interval))
  }

  // Size of a task/sleep block: it grows to the right in "horizontal" mode and
  // downwards in "vertical" mode (before, vertical mode drew it sideways).
  const getBlockSize = (span: number, cellWidth: number) => {
    if (timeSettings.displayMode === 'vertical') {
      return {
        height: `${span * timeSettings.cellHeight - 4}px`,
        width: `${cellWidth - 8}px`
      }
    }
    return {
      height: `${timeSettings.cellHeight - 4}px`,
      width: `calc(${span} * ${cellWidth}px - 8px)`
    }
  }

  const isExtendedTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    
    if (timeSettings.extendedHours.morning && hours < 8) {
      return true
    }
    
    if (timeSettings.extendedHours.evening && hours >= 18 && hours < 22) {
      return true
    }
    
    if (timeSettings.extendedHours.night && hours >= 22) {
      return true
    }
    
    if (timeSettings.extendedHours.custom.includes(time)) {
      return true
    }
    
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

  const getSleepTypeInfo = (type: string) => {
    return SLEEP_TYPES.find(t => t.id === type) || SLEEP_TYPES[0]
  }

  const getCategoryIcon = (category: Goal['category']) => {
    const cat = GOAL_CATEGORIES.find(c => c.id === category)
    if (cat) {
      const Icon = cat.icon
      return <Icon className="w-4 h-4" />
    }
    return <Target className="w-4 h-4" />
  }

  const getPriorityColor = (priority: Goal['priority']) => {
    switch(priority) {
      case 'CRITICAL': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      case 'HIGH': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
      case 'MEDIUM': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      case 'LOW': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    }
  }

  // Schedules goal/milestone items into the first slot that is actually free
  // (no fixed commitment, no other task, no sleep) instead of always using
  // "Monday 10:00", which used to collide with fixed commitments.
  const scheduleItems = (
    items: Array<{ title: string; subject: string; priority: Goal['priority']; color: string; goalId: string; milestoneId?: string }>
  ): TimeSlot[] => {
    const added: TimeSlot[] = []
    let failed = 0
    items.forEach(item => {
      const slot = findAvailableSlot(60, [...tasks, ...added])
      if (!slot) {
        failed += 1
        return
      }
      added.push({
        id: newTaskId(),
        title: item.title,
        subject: item.subject,
        startTime: slot.time,
        endTime: calculateEndTime(slot.time, 60),
        duration: 60,
        priority: item.priority,
        color: item.color,
        day: slot.day,
        type: 'task',
        goalId: item.goalId,
        milestoneId: item.milestoneId,
        fixedCommitmentId: slot.link.fixedTimeId,
        freePeriodId: slot.link.freePeriodId,
        status: 'PENDING'
      })
    })
    if (added.length > 0) {
      setTasks(prev => [...prev, ...added])
    }
    if (failed > 0) {
      toast.warning(`${failed} item${failed > 1 ? 's' : ''} could not be scheduled — no free 1-hour slot left. Free up some time or add free periods.`)
    }
    return added
  }

  const handleScheduleMilestone = (goal: Goal, milestone: Milestone) => {
    setSelectedGoalForMilestone(null)
    const added = scheduleItems([{
      title: milestone.title,
      subject: goal.subject || goal.title,
      priority: goal.priority,
      color: goal.color,
      goalId: goal.id,
      milestoneId: milestone.id
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

  const getFreePeriodsForDay = (fixedTime: FixedTime, day: string) => {
    return fixedTime.freePeriods?.filter(fp => fp.day === day) || []
  }

  const handleSaveTimeSettings = () => {
    setTimeSlots(generateTimeSlots())
    setShowTimeSettingsModal(false)
    toast.success('Display settings updated')
  }

  const toggleWeekends = () => {
    setTimeSettings({
      ...timeSettings,
      showWeekends: !timeSettings.showWeekends
    })
  }

  const handleExtendTime = (extensionType: 'morning' | 'evening' | 'night' | 'custom', customSlots?: string[]) => {
    const updatedExtendedHours = { ...timeSettings.extendedHours }
    
    switch(extensionType) {
      case 'morning':
        updatedExtendedHours.morning = !updatedExtendedHours.morning
        break
      case 'evening':
        updatedExtendedHours.evening = !updatedExtendedHours.evening
        break
      case 'night':
        updatedExtendedHours.night = !updatedExtendedHours.night
        break
      case 'custom':
        if (customSlots) {
          updatedExtendedHours.custom = customSlots
        }
        break
    }
    
    setTimeSettings({
      ...timeSettings,
      extendedHours: updatedExtendedHours
    })
    
    if (extensionType === 'custom') {
      setShowTimeExtensionModal(false)
    }
  }

  const handleAddCustomTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      const updatedCustom = [...timeSettings.extendedHours.custom, time]
        .filter((slot, index, self) => self.indexOf(slot) === index)
        .sort((a, b) => {
          const [aHours, aMins] = a.split(':').map(Number)
          const [bHours, bMins] = b.split(':').map(Number)
          return (aHours * 60 + aMins) - (bHours * 60 + bMins)
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

  const handleExportPDF = () => {
    toast.info('PDF export functionality will be implemented soon')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Timetable',
        text: 'Check out my weekly schedule!',
        url: window.location.href,
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

  // Live validation messages shown inside the dialogs (so the user sees the
  // problem immediately, instead of after pressing the button).
  const taskDialogError: string | undefined = taskCreationContext
    ? analyzePlacement(taskCreationContext.day, taskCreationContext.time, newTask.duration).error
    : undefined
  const editTaskError: string | undefined = showAddTaskModal
    ? analyzePlacement(newTask.day, newTask.startTime, newTask.duration).error
    : undefined

  // Fields shared by the "Add" and "Edit" fixed commitment dialogs.
  const renderFixedTimeFields = (
    value: { title: string; description?: string; startTime: string; endTime: string; type: FixedTime['type']; days: string[] },
    onChange: (patch: { title?: string; description?: string; startTime?: string; endTime?: string; type?: FixedTime['type']; color?: string; days?: string[] }) => void
  ) => (
    <>
      <div>
        <label className="text-sm font-medium mb-2 block dark:text-gray-300">Title *</label>
        <Input
          placeholder="e.g., College Hours, Office Time, Gym Session"
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium mb-2 block dark:text-gray-300">Description (Optional)</label>
        <Textarea
          placeholder="Brief description of this commitment"
          value={value.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time *</label>
          <Input
            type="time"
            value={value.startTime}
            onChange={(e) => onChange({ startTime: e.target.value })}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block dark:text-gray-300">End Time *</label>
          <Input
            type="time"
            value={value.endTime}
            onChange={(e) => onChange({ endTime: e.target.value })}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block dark:text-gray-300">Type *</label>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          {FIXED_TIME_TYPES.filter(t => t.id !== 'SLEEP').map((type) => {
            const Icon = type.icon
            const isSelected = value.type === type.id
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onChange({ type: type.id as FixedTime['type'], color: type.color })}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border transition-all",
                  isSelected 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500" 
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <div 
                  className="p-2 rounded-lg mb-2"
                  style={{ backgroundColor: `${type.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: type.color }} />
                </div>
                <span className={cn(
                  "text-xs text-center",
                  isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400"
                )}>
                  {type.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block dark:text-gray-300">Days *</label>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          {ALL_DAYS.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => {
                const newDays = value.days.includes(day)
                  ? value.days.filter(d => d !== day)
                  : [...value.days, day]
                onChange({ days: newDays })
              }}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                value.days.includes(day)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              {formatDayLabel(day)}
            </button>
          ))}
        </div>
      </div>
    </>
  )

  // Render functions for different views
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
            You don't have any scheduled items yet. Start by adding fixed commitments or tasks to build your schedule.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => setShowAddFixedTimeModal(true)}>
              <Clock className="w-4 h-4 mr-2" />
              Add Fixed Commitment
            </Button>
            <Button variant="outline" onClick={() => openTaskDialog(days[0], timeSlots[0])}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
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
              <div 
                className="flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4"
                style={{ width: cellWidth }}
              >
                <div className="font-bold text-gray-900 dark:text-gray-100">Time</div>
              </div>
              {days.map((day) => (
                <div
                  key={day}
                  className={cn(
                    "flex-shrink-0 p-4 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0",
                    ['SATURDAY', 'SUNDAY'].includes(day) ? "bg-blue-50 dark:bg-blue-900/30" : "bg-white dark:bg-gray-800"
                  )}
                  style={{ width: cellWidth }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className={cn(
                      "font-bold text-sm",
                      ['SATURDAY', 'SUNDAY'].includes(day) && "text-blue-700 dark:text-blue-300"
                    )}>
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
              <div 
                className="flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-r-2 border-gray-300 dark:border-gray-700"
                style={{ width: cellWidth }}
              >
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className={cn(
                      "flex items-center justify-center relative border-b border-gray-200 dark:border-gray-700",
                      isExtendedTime(time) && "bg-yellow-50 dark:bg-yellow-900/20",
                      time === '00:00' && "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
                      time === '24:00' && "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                    )}
                    style={{ height: `${timeSettings.cellHeight}px` }}
                  >
                    <div className={cn(
                      "text-xs font-semibold px-2 py-1 rounded-lg shadow-sm",
                      isExtendedTime(time) 
                        ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100"
                        : time === '00:00' || time === '24:00'
                        ? "bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    )}>
                      <div className="flex items-center gap-1">
                        {formatTimeDisplay(time)}
                        {isExtendedTime(time) && (
                          <Badge className="ml-1 text-[8px] bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100">
                            Ext
                          </Badge>
                        )}
                        {time === '00:00' && (
                          <Badge className="ml-1 text-[8px] bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-100">
                            Midnight
                          </Badge>
                        )}
                        {time === '24:00' && (
                          <Badge className="ml-1 text-[8px] bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-100">
                            End
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex bg-white dark:bg-gray-800">
                {days.map(day => (
                  <div 
                    key={day} 
                    className="flex-shrink-0 flex flex-col relative"
                    style={{ width: cellWidth }}
                  >
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
              <div 
                className="flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4"
                style={{ width: cellWidth }}
              >
                <div className="font-bold text-gray-900 dark:text-gray-100">Day / Time</div>
              </div>
              {timeSlots.map((time, index) => (
                <div
                  key={time}
                  className={cn(
                    "flex-shrink-0 p-2 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0",
                    isExtendedTime(time) ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-gray-50 dark:bg-gray-900",
                    time === '00:00' && "bg-purple-50 dark:bg-purple-900/20",
                    time === '24:00' && "bg-purple-50 dark:bg-purple-900/20"
                  )}
                  style={{ width: cellWidth }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        "font-bold text-xs",
                        isExtendedTime(time) ? "text-yellow-800 dark:text-yellow-100" : "text-gray-900 dark:text-gray-100",
                        time === '00:00' && "text-purple-800 dark:text-purple-100",
                        time === '24:00' && "text-purple-800 dark:text-purple-100"
                      )}>
                        {formatTimeDisplay(time)}
                      </span>
                      {isExtendedTime(time) && (
                        <Badge className="text-[8px] bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100">
                          Ext
                        </Badge>
                      )}
                    </div>
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
                  <div 
                    className="flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center p-4"
                    style={{ width: cellWidth, height: `${timeSettings.cellHeight}px` }}
                  >
                    <div className="text-center">
                      <div className={cn(
                        "font-bold text-sm",
                        ['SATURDAY', 'SUNDAY'].includes(day) && "text-blue-700 dark:text-blue-300"
                      )}>
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

  const TimeCell = ({ day, time, cellWidth }: { day: string; time: string; cellWidth: number }) => {
    const fixedTime = isTimeInFixedSlot(day, time)
    const freePeriodInfo = isTimeInFreePeriod(day, time)
    const tasksInCell = getTasksForCell(day, time)

    // FIXED: sleep blocks and real tasks are tracked separately. Before, a sleep
    // block could be picked as the "primary task" of a cell, which hid real
    // tasks that were placed inside sleep time.
    const regularTasks = tasksInCell.filter(t => !t.isSleepTime)
    const startingTasks = regularTasks.filter(t => convertTimeToMinutes(t.startTime) === convertTimeToMinutes(time))
    const hasRegular = regularTasks.length > 0
    const sleepTask = tasksInCell.find(t => t.isSleepTime)
    const isSleepTime = !!sleepTask
    const isFreePeriod = !!freePeriodInfo
    
    return (
      <div
        className={cn(
          "relative border-r border-b border-gray-200 dark:border-gray-700 group transition-all duration-150",
          fixedTime && !isFreePeriod ? getTimeSlotColor(fixedTime.type) : undefined,
          isFreePeriod && "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
          isExtendedTime(time) && !fixedTime && !isSleepTime && "bg-yellow-50/30 dark:bg-yellow-900/10",
          isSleepTime && "bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700",
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
        {isExtendedTime(time) && !fixedTime && !hasRegular && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-[10px] text-yellow-600 dark:text-yellow-400 opacity-30">
              Extended
            </div>
          </div>
        )}

        {(time === '00:00' || time === '24:00') && !fixedTime && !hasRegular && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-[10px] text-purple-600 dark:text-purple-400 opacity-30">
              {time === '00:00' ? 'Start of Day' : 'End of Day'}
            </div>
          </div>
        )}

        {fixedTime && !isFreePeriod && !hasRegular && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center p-0.5 cursor-pointer">
            <div className="text-[10px] font-medium text-center truncate px-0.5 text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-center gap-0.5">
                {getIconByType(fixedTime.type)}
                <span className="truncate max-w-[80px]">{fixedTime.title}</span>
              </div>
              <div className="text-[8px] text-gray-500 dark:text-gray-400 mt-0.5">
                Fixed
              </div>
            </div>
          </div>
        )}

        {isFreePeriod && !hasRegular && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center p-0.5 cursor-pointer">
            <div className="text-[10px] font-medium text-center truncate px-0.5 text-green-700 dark:text-green-400">
              <div className="flex items-center justify-center gap-0.5">
                <Coffee className="w-2.5 h-2.5" />
                <span>Free</span>
              </div>
              <div className="text-[8px] text-green-600 dark:text-green-400 mt-0.5">
                Click to add
              </div>
            </div>
          </div>
        )}

        {isSleepTime && !hasRegular && sleepTask && (
          <div className="absolute inset-0 flex items-center justify-center p-0.5 pointer-events-none">
            <div className="text-[10px] font-medium text-center truncate px-0.5 text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-center gap-0.5">
                <Moon className="w-2.5 h-2.5" />
                <span>Sleep</span>
              </div>
              <div className="text-[8px] text-gray-500 dark:text-gray-400 mt-0.5">
                Click to add a task
              </div>
            </div>
          </div>
        )}

        {sleepTask && shouldShowTaskInCell(sleepTask, day, time) && (
          <SleepTaskComponent 
            task={sleepTask}
            sleepSchedule={sleepSchedules.find(s => s.id === sleepTask.sleepScheduleId)}
            cellWidth={cellWidth}
            onEdit={() => {
              const schedule = sleepSchedules.find(s => s.id === sleepTask.sleepScheduleId)
              if (schedule) {
                setEditingSleepSchedule(schedule)
                setShowSleepScheduleModal(true)
              }
            }}
          />
        )}

        {startingTasks.map(task => (
          <TaskComponent 
            key={task.id}
            task={task} 
            day={day}
            time={time}
            cellWidth={cellWidth}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onDuplicate={handleDuplicateTask}
          />
        ))}

        {startingTasks.length > 1 && (
          <div className="absolute bottom-0.5 right-0.5 z-50">
            <Badge variant="outline" className="text-[8px] px-1 py-0 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
              {startingTasks.length} tasks
            </Badge>
          </div>
        )}

        {!isLocked && !fixedTime && !hasRegular && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80 pointer-events-none">
            <button
              className="pointer-events-auto p-1 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
              onClick={(e) => {
                e.stopPropagation()
                handleCellClick(day, time)
              }}
              title="Add Task"
            >
              <Plus className="w-2.5 h-2.5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>
    )
  }

  // Sleep block. It is only a visual band (pointer-events-none) so you can
  // still click through it to add tasks during sleep time; only the small
  // gear button opens the Sleep Schedule editor.
  const SleepTaskComponent = ({ 
    task, 
    sleepSchedule,
    cellWidth,
    onEdit 
  }: { 
    task: TimeSlot
    sleepSchedule?: SleepSchedule
    cellWidth: number
    onEdit: () => void
  }) => {
    const taskSpan = getTaskSpan(task)
    const sleepType = sleepSchedule ? getSleepTypeInfo(sleepSchedule.type) : SLEEP_TYPES[0]
    const Icon = sleepType.icon
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "absolute top-0.5 left-0.5 rounded border shadow-sm z-30 overflow-hidden pointer-events-none opacity-90",
          sleepType.bgColor
        )}
        style={{ 
          ...getBlockSize(taskSpan, cellWidth),
          borderLeft: `3px solid ${task.color}`,
        }}
      >
        <div className="p-1 h-full flex flex-col">
          <div className="flex items-start justify-between mb-0.5">
            <div className="flex items-center gap-0.5 min-w-0">
              <Icon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: sleepType.color }} />
              <h4 className="text-[10px] font-semibold truncate dark:text-gray-200">
                {sleepSchedule?.type === 'POWER_NAP' ? 'Nap' : 'Sleep'}
              </h4>
            </div>
            <button
              type="button"
              className="pointer-events-auto p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
              title="Edit sleep schedule"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Settings className="w-2.5 h-2.5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-gray-500 dark:text-gray-400">
                {Math.floor(task.duration / 60)}h {task.duration % 60}m
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const TaskComponent = ({ 
    task, 
    day,
    time,
    cellWidth,
    onEdit,
    onDelete,
    onDuplicate 
  }: { 
    task: TimeSlot
    day: string
    time: string
    cellWidth: number
    onEdit: (task: TimeSlot) => void
    onDelete: (taskId: string) => void
    onDuplicate: (task: TimeSlot) => void
  }) => {
    const taskSpan = getTaskSpan(task)
    const goal = task.goalId ? goals.find(g => g.id === task.goalId) : null
    const milestone = task.milestoneId && goal ? goal.milestones.find(m => m.id === task.milestoneId) : null
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "absolute top-0.5 left-0.5 rounded border shadow-sm z-40 overflow-hidden cursor-pointer bg-white dark:bg-gray-800",
          "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all",
          task.fixedCommitmentId && "border-green-300 dark:border-green-700",
          milestone ? "border-purple-300 dark:border-purple-700" : undefined
        )}
        style={{ 
          ...getBlockSize(taskSpan, cellWidth),
          borderLeft: `3px solid ${task.color}`,
          backgroundColor: task.fixedCommitmentId 
            ? `${task.color}15` 
            : milestone
            ? `${task.color}20`
            : `${task.color}10`
        }}
        onClick={(e) => {
          e.stopPropagation()
          onEdit(task)
        }}
      >
        <div className="p-1 h-full flex flex-col">
          <div className="flex items-start justify-between mb-0.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-0.5">
                <h4 className="text-[10px] font-semibold truncate dark:text-gray-200">{task.title}</h4>
                {task.fixedCommitmentId && (
                  <Badge variant="outline" className="text-[6px] px-0.5 py-0 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30">
                    FP
                  </Badge>
                )}
                {milestone && (
                  <Badge variant="outline" className="text-[6px] px-0.5 py-0 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/30">
                    M
                  </Badge>
                )}
              </div>
            </div>
            
            {!isLocked && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <button className="opacity-60 hover:opacity-100 transition-opacity p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <MoreVertical className="w-2.5 h-2.5 text-gray-600 dark:text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[120px] dark:bg-gray-800 dark:border-gray-700">
                  <DropdownMenuItem onClick={() => onEdit(task)} className="text-xs dark:text-gray-300 dark:hover:bg-gray-700">
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(task)} className="text-xs dark:text-gray-300 dark:hover:bg-gray-700">
                    <Copy className="w-3 h-3 mr-1" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-xs text-red-600 focus:text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[6px] px-0.5 py-0 dark:border-gray-600 dark:text-gray-400">
                {task.priority.charAt(0)}
              </Badge>
              <span className="text-[8px] text-gray-500 dark:text-gray-400">{task.duration}m</span>
            </div>
            
            {taskSpan > 1 && (
              <div className="text-[6px] text-gray-500 dark:text-gray-400 text-right mt-0.5">
                {taskSpan} slots
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Timetable Builder</h1>
              <Badge variant="outline" className="capitalize dark:border-gray-700 dark:text-gray-300">
                {userType}
              </Badge>
              {isLocked && (
                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  <Lock className="w-3 h-3 mr-1" />
                  Locked
                </Badge>
              )}
              {hasUnsavedChanges && !isLocked && (
                <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              {hasUnsavedChanges && !isLocked && !isLoading && (
                <Badge 
                  variant="outline" 
                  className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30"
                  title="Your changes are automatically saved on this device until you lock the timetable"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Saved on this device
                </Badge>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className="h-8 w-8"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {timeSettings.displayMode === 'vertical' 
                ? 'Weekdays as columns, time as rows' 
                : 'Weekdays as rows, time as columns'}
              {timeSettings.show24Hours && (
                <span className="ml-2 text-purple-600 dark:text-purple-400 font-medium">
                  • 24-hour view
                </span>
              )}
              {timeSlots.some(isExtendedTime) && (
                <span className="ml-2 text-yellow-600 dark:text-yellow-400 font-medium">
                  • Extended hours enabled
                </span>
              )}
              {timeSettings.showSleepBlocks && (
                <span className="ml-2 text-gray-600 dark:text-gray-400 font-medium">
                  • Sleep schedule active
                </span>
              )}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                  <FileText className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuItem onClick={() => setViewMode('pdf')} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                  <FileText className="w-4 h-4" />
                  View as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Download className="w-4 h-4" />
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Printer className="w-4 h-4" />
                  Print
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Share2 className="w-4 h-4" />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setShowGoalsModal(true)}
            >
              <Target className="w-4 h-4" />
              Schedule Goals
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setShowSleepScheduleModal(true)}
            >
              <Bed className="w-4 h-4" />
              Sleep Schedule
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setShowTimeSettingsModal(true)}
            >
              <Settings className="w-4 h-4" />
              Display Settings
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setShowTimeExtensionModal(true)}
            >
              <PlusCircle className="w-4 h-4" />
              Extend Time
            </Button>
            
            <Button 
              variant="outline" 
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={toggleWeekends}
            >
              {timeSettings.showWeekends ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide Weekends
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show Weekends
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              className={cn(
                "gap-2",
                timeSettings.show24Hours 
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700" 
                  : "dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
              onClick={() => setTimeSettings({...timeSettings, show24Hours: !timeSettings.show24Hours})}
            >
              <Clock className="w-4 h-4" />
              {timeSettings.show24Hours ? '24H View' : 'Custom Hours'}
            </Button>
            
            <Button 
              onClick={isLocked ? handleUnlockTimetable : handleLockTimetable}
              className={`gap-2 ${isLocked ? 'bg-green-600 hover:bg-green-700' : ''}`}
              disabled={isLocking}
            >
              {isLocking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : isLocked ? (
                <>
                  <Unlock className="w-4 h-4" />
                  Unlock
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Lock Timetable
                </>
              )}
            </Button>

            <Button
              variant="destructive"
              className="gap-2"
              onClick={handleResetTimetable}
              disabled={isLocking || isResetting}
            >
              {isResetting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </>
              )}
            </Button>
          </div>
        </div>

        {/* NEW: "Fix these before locking" dialog — shown BEFORE any API call */}
        <Dialog open={showLockIssues} onOpenChange={setShowLockIssues}>
          <DialogContent className="sm:max-w-lg md:max-w-xl bg-white dark:bg-gray-800 max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Fix these before locking
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Your timetable has {lockIssues.length} problem{lockIssues.length > 1 ? 's' : ''}. Nothing was sent to the server.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 py-2 pr-4 max-h-[50vh]">
              <ul className="space-y-2">
                {lockIssues.map((issue, i) => (
                  <li
                    key={i}
                    className="p-3 text-sm rounded-lg border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                  >
                    {issue}
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={() => setShowLockIssues(false)}>
                Got it, I'll fix them
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lock Confirmation Dialog */}
        <Dialog open={showLockConfirm} onOpenChange={setShowLockConfirm}>
          <DialogContent className="sm:max-w-lg md:max-w-xl bg-white dark:bg-gray-800 max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Lock Timetable Confirmation
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Please read carefully before locking your timetable
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="flex-1 py-4 pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                        Once locked, you won't be able to edit for 1 week!
                      </h4>
                      <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-500">•</span>
                          <span>Your timetable will be saved and locked for the next 7 days</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-500">•</span>
                          <span>You cannot add, edit, or delete any tasks during this period</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-500">•</span>
                          <span>Fixed commitments and sleep schedules become read-only</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-500">•</span>
                          <span>You can still view your timetable in read-only mode</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-500">•</span>
                          <span>After 7 days, you can unlock and make changes again</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    What will be saved:
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                    <li>• {tasks.filter(t => !t.isSleepTime).length} tasks</li>
                    <li>• {fixedTimes.length} fixed commitments</li>
                    <li>• {sleepSchedules.filter(s => s.isActive).length} active sleep schedules</li>
                    <li>• {fixedTimes.reduce((acc, ft) => acc + (ft.freePeriods?.length || 0), 0)} free periods</li>
                  </ul>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Checkbox 
                    id="lock-confirm" 
                    checked={lockConfirmed}
                    onCheckedChange={(checked) => setLockConfirmed(checked as boolean)}
                    className="mt-1 flex-shrink-0"
                  />
                  <Label 
                    htmlFor="lock-confirm" 
                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    I understand that once locked, I will not be able to make any changes to my timetable for the next 7 days. I have reviewed my schedule and confirm that it is correct.
                  </Label>
                </div>
              </div>
            </ScrollArea>
            
            <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowLockConfirm(false)
                  setLockConfirmed(false)
                }}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmLock}
                disabled={!lockConfirmed || isLocking}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                {isLocking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Locking...
                  </>
                ) : (
                  'Yes, Lock Timetable'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lock Progress Dialog */}
        <Dialog open={showLockProgress} onOpenChange={setShowLockProgress}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
                {lockSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Timetable Locked Successfully
                  </>
                ) : (
                  'Locking Timetable'
                )}
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                {lockSuccess 
                  ? 'Your timetable has been locked and saved to the server. You cannot make changes for the next 7 days.'
                  : 'Please wait while we lock your timetable. Do not close this window.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {lockProgress.map((step, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {step.status === 'pending' && (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                      )}
                      {step.status === 'in-progress' && (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      )}
                      {step.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {step.status === 'failed' && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        step.status === 'failed' ? "text-red-600 dark:text-red-400" : "dark:text-gray-300"
                      )}>
                        {step.step}
                      </span>
                    </div>
                    {step.message && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{step.message}</span>
                    )}
                  </div>
                  {step.status === 'in-progress' && (
                    <Progress value={50} className="h-1" />
                  )}
                  {step.error && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">{step.error}</p>
                  )}
                </div>
              ))}
            </div>
            
            <DialogFooter>
              {lockSuccess && (
                <Button onClick={() => setShowLockProgress(false)}>
                  Close
                </Button>
              )}
              {!lockSuccess && !isLocking && (
                <Button variant="outline" onClick={() => setShowLockProgress(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Confirmation Dialog */}
        <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Reset Timetable
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                This will permanently delete ALL your timetable data from the server. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to reset your timetable? This will delete:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <li>{fixedTimes.length} fixed commitments</li>
                <li>{sleepSchedules.length} sleep schedules</li>
                <li>{tasks.filter(t => !t.isSleepTime).length} tasks</li>
              </ul>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                This action cannot be undone!
              </p>
            </div>
            
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowResetConfirm(false)}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmReset}
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  'Yes, Reset Everything'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Mode Tabs */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              onClick={() => setViewMode('grid')}
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Grid className="w-4 h-4" />
              Grid View
            </Button>
            <Button
              variant={viewMode === 'pdf' ? "default" : "outline"}
              onClick={() => setViewMode('pdf')}
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FileText className="w-4 h-4" />
              PDF Preview
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={timeSettings.displayMode === 'vertical' ? "default" : "outline"}
              onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Columns className="w-4 h-4" />
              Vertical
            </Button>
            <Button
              variant={timeSettings.displayMode === 'horizontal' ? "default" : "outline"}
              onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Rows className="w-4 h-4" />
              Horizontal
            </Button>
          </div>
        </div>

        {viewMode === 'pdf' ? (
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">PDF Preview</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This feature will be implemented soon
              </p>
              <Button onClick={() => setViewMode('grid')}>
                Back to Grid View
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { 
                  label: 'Total Hours', 
                  value: `${(tasks.filter(t => !t.isSleepTime).reduce((sum, task) => sum + task.duration, 0) / 60).toFixed(1)}h`, 
                  icon: Clock,
                  iconBg: 'bg-gray-100 dark:bg-gray-800',
                  iconColor: 'text-gray-700 dark:text-gray-300'
                },
                { 
                  label: 'Tasks Planned', 
                  value: tasks.filter(t => !t.isSleepTime).length.toString(), 
                  icon: Grid,
                  iconBg: 'bg-blue-100 dark:bg-blue-900/30',
                  iconColor: 'text-blue-600 dark:text-blue-400'
                },
                { 
                  label: 'Goals Scheduled', 
                  value: `${tasks.filter(t => t.goalId).length}/${goals.length}`, 
                  icon: Target,
                  iconBg: 'bg-green-100 dark:bg-green-900/30',
                  iconColor: 'text-green-600 dark:text-green-400'
                },
                { 
                  label: 'Milestones', 
                  value: `${tasks.filter(t => t.milestoneId).length}/${goals.reduce((sum, g) => sum + g.milestones.length, 0)}`, 
                  icon: CheckCircle2,
                  iconBg: 'bg-purple-100 dark:bg-purple-900/30',
                  iconColor: 'text-purple-600 dark:text-purple-400'
                },
                { 
                  label: 'Sleep Hours', 
                  value: `${sleepStats.totalSleepHours.toFixed(1)}h`, 
                  icon: Moon,
                  iconBg: 'bg-gray-100 dark:bg-gray-800',
                  iconColor: 'text-gray-700 dark:text-gray-300'
                },
                { 
                  label: 'Avg Sleep', 
                  value: `${sleepStats.avgSleepHours.toFixed(1)}h`, 
                  icon: Bed,
                  iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
                  iconColor: 'text-indigo-600 dark:text-indigo-400'
                },
                { 
                  label: 'Fixed Commitments', 
                  value: fixedTimes.length.toString(), 
                  icon: Clock,
                  iconBg: 'bg-orange-100 dark:bg-orange-900/30',
                  iconColor: 'text-orange-600 dark:text-orange-400'
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
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

            {/* Sleep Schedule Summary */}
            {timeSettings.showSleepBlocks && sleepSchedules.length > 0 && (
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <Bed className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Sleep Schedule</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {sleepStats.daysWithSleep} days scheduled • Avg {sleepStats.avgSleepHours.toFixed(1)}h per night
                          {sleepStats.avgSleepHours < 7 && ' • Consider getting more rest'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 mr-2">
                        <Switch
                          checked={timeSettings.showSleepBlocks}
                          onCheckedChange={(checked) => setTimeSettings({...timeSettings, showSleepBlocks: checked})}
                          id="show-sleep"
                        />
                        <Label htmlFor="show-sleep" className="text-sm text-gray-600 dark:text-gray-400">
                          Show in timetable
                        </Label>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => setShowSleepScheduleModal(true)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Adjust Schedule
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {sleepSchedules.filter(s => s.isActive).slice(0, 4).map(schedule => {
                      const sleepType = getSleepTypeInfo(schedule.type)
                      const Icon = sleepType.icon
                      return (
                        <div key={schedule.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400" />
                            <span className="font-medium text-gray-800 dark:text-gray-300">
                              {formatDayLabel(schedule.day)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Icon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {formatTimeDisplay(schedule.bedtime)} - {formatTimeDisplay(schedule.wakeTime)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {Math.floor(schedule.duration / 60)}h {schedule.duration % 60}m • {sleepType.label}
                          </div>
                        </div>
                      )
                    })}
                    {sleepSchedules.filter(s => s.isActive).length > 4 && (
                      <div className="p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          +{sleepSchedules.filter(s => s.isActive).length - 4} more days
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Time Extension Summary */}
            {(timeSettings.extendedHours.morning || 
              timeSettings.extendedHours.evening || 
              timeSettings.extendedHours.night || 
              timeSettings.extendedHours.custom.length > 0) && (
              <Card className="border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                        <Clock className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">Extended Hours</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Additional time slots added to your schedule</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                      onClick={() => setShowTimeExtensionModal(true)}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add More
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {timeSettings.extendedHours.morning && (
                      <div className="p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 dark:bg-yellow-400" />
                          <span className="font-medium text-yellow-800 dark:text-yellow-300">Morning</span>
                        </div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-400">5:00 AM - 8:00 AM</div>
                      </div>
                    )}
                    
                    {timeSettings.extendedHours.evening && (
                      <div className="p-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-orange-500 dark:bg-orange-400" />
                          <span className="font-medium text-orange-800 dark:text-orange-300">Evening</span>
                        </div>
                        <div className="text-sm text-orange-700 dark:text-orange-400">6:00 PM - 10:00 PM</div>
                      </div>
                    )}
                    
                    {timeSettings.extendedHours.night && (
                      <div className="p-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400" />
                          <span className="font-medium text-purple-800 dark:text-purple-300">Night</span>
                        </div>
                        <div className="text-sm text-purple-700 dark:text-purple-400">10:00 PM - 12:00 AM</div>
                      </div>
                    )}
                    
                    {timeSettings.extendedHours.custom.length > 0 && (
                      <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                          <span className="font-medium text-blue-800 dark:text-blue-300">Custom Slots</span>
                          <Badge className="ml-2 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
                            {timeSettings.extendedHours.custom.length}
                          </Badge>
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-400">
                          {timeSettings.extendedHours.custom.slice(0, 3).map(time => (
                            <div key={time} className="flex items-center justify-between">
                              <span>{formatTimeDisplay(time)}</span>
                              <button
                                onClick={() => handleRemoveCustomTime(time)}
                                className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          {timeSettings.extendedHours.custom.length > 3 && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              +{timeSettings.extendedHours.custom.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fixed Commitments Summary */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Fixed Commitments</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add your regular commitments (college, office, gym, etc.) to mark them as unavailable. 
                      You can add free periods within these commitments for scheduling tasks.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                      {fixedTimes.length} commitments
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddFixedTimeModal(true)}
                      className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Fixed Commitment
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
                      Add your regular schedule items like college hours, office time, gym sessions, etc. 
                      These will be marked as unavailable for scheduling tasks.
                    </p>
                    <Button 
                      onClick={() => setShowAddFixedTimeModal(true)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Fixed Commitment
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {fixedTimes.map((ft, index) => (
                      <motion.div
                        key={ft.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-lg border ${getTimeSlotColor(ft.type)}`}
                        onClick={() => handleFixedTimeClick(ft)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${ft.color}20` }}
                            >
                              {getIconByType(ft.type)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium dark:text-gray-200 mb-1">{ft.title}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {ft.days.map(d => formatDayLabel(d)).join(', ')} • {formatTimeDisplay(ft.startTime)} - {formatTimeDisplay(ft.endTime)}
                              </div>
                              {ft.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{ft.description}</p>
                              )}
                              {(ft.freePeriods && ft.freePeriods.length > 0) && (
                                <div className="mt-2">
                                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30 text-xs">
                                    <Coffee className="w-2.5 h-2.5 mr-1" />
                                    {ft.freePeriods.length} free period{ft.freePeriods.length > 1 ? 's' : ''}
                                  </Badge>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Days: {Array.from(new Set(ft.freePeriods.map(fp => formatDayLabel(fp.day)))).join(', ')}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedFixedTimeForFreePeriod(ft)
                                  setNewFreePeriod({
                                    ...newFreePeriod,
                                    day: ft.days[0] || 'MONDAY'
                                  })
                                  setShowAddFreePeriodModal(true)
                                }}
                                className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                <Coffee className="w-4 h-4" />
                                Add Free Period
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditFixedTime(ft)
                                }}
                                className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit Commitment
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="dark:bg-gray-700" />
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteFixedTime(ft.id)
                                }}
                                className="gap-2 text-red-600 focus:text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: fixedTimes.length * 0.1 }}
                      className="p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                      onClick={() => setShowAddFixedTimeModal(true)}
                    >
                      <div className="flex flex-col items-center justify-center h-full py-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                          <Plus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1">Add Fixed Commitment</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          Add college hours, office time, gym sessions, etc.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Main Timetable Grid */}
            <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-0">
                {renderTimetableGrid()}
              </CardContent>
            </Card>

            {/* Task Pool with Goals */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-1">Task Pool & Goals</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drag tasks or goals to schedule them in your timetable
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => openTaskDialog('MONDAY', '09:00')}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Task
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowTimeExtensionModal(true)}
                      className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Time Slots
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowGoalsModal(true)}
                      className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Target className="w-4 h-4" />
                      Schedule Goals
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowSleepScheduleModal(true)}
                      className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Bed className="w-4 h-4" />
                      Sleep
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="goals" className="mb-6">
                  <TabsList className="dark:bg-gray-800 dark:border-gray-700">
                    <TabsTrigger value="goals" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
                      Goals & Milestones
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
                      Quick Tasks
                    </TabsTrigger>
                    <TabsTrigger value="sleep" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
                      Sleep Tips
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="goals" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {goals.map(goal => (
                        <div key={goal.id} className="space-y-2">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-move hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition-all"
                            draggable={!isLocked}
                            onDragStartCapture={(e: React.DragEvent<HTMLDivElement>) => {
                              e.dataTransfer.setData('text/plain', goal.id)
                              e.dataTransfer.setData('type', 'goal')
                              e.dataTransfer.effectAllowed = 'move'
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div 
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: goal.color }}
                                  />
                                  <h4 className="font-medium text-sm dark:text-gray-200">{goal.title}</h4>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                  Progress: {goal.progress}% • {goal.completedHours.toFixed(1)}/{goal.totalHours}h
                                </div>
                                <div className="flex items-center justify-between">
                                  <Badge className={getPriorityColor(goal.priority)}>
                                    {goal.priority}
                                  </Badge>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {goal.milestones.length} milestones
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                          
                          <div className="space-y-1 ml-4">
                            {goal.milestones.map(milestone => (
                              <motion.div
                                key={milestone.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-move hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-sm transition-all"
                                draggable={!isLocked}
                                onDragStartCapture={(e: React.DragEvent<HTMLDivElement>) => {
                                  e.dataTransfer.setData('text/plain', milestone.id)
                                  e.dataTransfer.setData('goalId', goal.id)
                                  e.dataTransfer.setData('type', 'milestone')
                                  e.dataTransfer.effectAllowed = 'move'
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                    <span className="text-xs font-medium dark:text-gray-300 truncate flex-1">
                                      {milestone.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {milestone.progress}%
                                    </span>
                                    <button
                                      onClick={() => handleScheduleMilestone(goal, milestone)}
                                      className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                      title="Schedule this milestone"
                                    >
                                      <ArrowRight className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                    </button>
                                  </div>
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
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-move hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition-all"
                          draggable={!isLocked}
                          onDragStartCapture={(e: React.DragEvent<HTMLDivElement>) => {
                            e.dataTransfer.setData('text/plain', task.id)
                            e.dataTransfer.setData('duration', task.duration.toString())
                            e.dataTransfer.effectAllowed = 'move'
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-medium text-sm dark:text-gray-200">{task.title}</div>
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: task.color }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                            <span>{task.subject}</span>
                            <span>{task.duration} minutes</span>
                          </div>
                          <div className="mt-2">
                            <Badge 
                              className={
                                task.priority === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                task.priority === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                                task.priority === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              }
                            >
                              {task.priority}
                            </Badge>
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
                          <div>
                            <h4 className="font-medium dark:text-gray-200">7-9 Hours</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Recommended for adults</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Most adults need 7-9 hours of sleep per night for optimal health and cognitive function.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <AlarmClock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h4 className="font-medium dark:text-gray-200">Consistent Schedule</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Even on weekends</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Going to bed and waking up at the same time helps regulate your body's internal clock.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-medium dark:text-gray-200">Power Naps</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">15-20 minutes</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Short naps can boost alertness and performance without interfering with nighttime sleep.
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

      {/* ==================== Sleep Schedule Dialog (draft + Save) ==================== */}
      {/* Closes via the Close button, the X, Esc, or by clicking outside. Changes are
          applied ONLY when you press "Save Sleep Schedule". */}
      <Dialog open={showSleepScheduleModal} onOpenChange={handleSleepModalOpenChange}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
              <Bed className="w-5 h-5" />
              Sleep Schedule
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Turn on the days you want, set the times, then click Save. You can set many days in one go.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            <div className="p-3 text-xs rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300">
              Sleep stays on the day you select (e.g. Monday 11 PM → 7 AM shows on Monday: 12 AM – 7 AM and 11 PM – 12 AM).
              If a task is already scheduled inside that window you must move or delete it first.
            </div>

            {ALL_DAYS.map(day => {
              const draft = sleepDraft[day]
              if (!draft) return null
              const duration = calculateDuration(draft.bedtime, draft.wakeTime)
              const sameTime = draft.bedtime === draft.wakeTime
              const conflicts = draft.isActive && !sameTime
                ? findTasksInSleepWindow(day, draft.bedtime, draft.wakeTime)
                : []
              
              return (
                <div
                  key={day}
                  className={cn(
                    "p-3 border rounded-lg",
                    conflicts.length > 0 || (draft.isActive && sameTime)
                      ? "border-red-300 dark:border-red-800/60"
                      : "border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium dark:text-gray-200">{formatDayLabel(day)}</span>
                    <Switch
                      checked={draft.isActive}
                      onCheckedChange={(checked) => updateSleepDraft(day, { isActive: checked })}
                    />
                  </div>
                  
                  {draft.isActive && (
                    <>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <Label className="text-xs dark:text-gray-400">Bedtime</Label>
                          <Input
                            type="time"
                            value={draft.bedtime}
                            onChange={(e) => updateSleepDraft(day, { bedtime: e.target.value })}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                          />
                        </div>
                        <div>
                          <Label className="text-xs dark:text-gray-400">Wake Time</Label>
                          <Input
                            type="time"
                            value={draft.wakeTime}
                            onChange={(e) => updateSleepDraft(day, { wakeTime: e.target.value })}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <Label className="text-xs dark:text-gray-400">Type</Label>
                        <Select
                          value={draft.type}
                          onValueChange={(value: any) => updateSleepDraft(day, { type: value })}
                        >
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
                        <Input
                          value={draft.notes}
                          onChange={(e) => updateSleepDraft(day, { notes: e.target.value })}
                          placeholder="Add notes..."
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                        />
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {sameTime ? 'Bedtime and wake time cannot be the same' : `Duration: ${Math.floor(duration / 60)}h ${duration % 60}m`}
                        </span>
                        <button
                          type="button"
                          onClick={() => applySleepToAllDays(day)}
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Apply to all days
                        </button>
                      </div>

                      {conflicts.length > 0 && (
                        <div className="mt-2 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-xs text-red-700 dark:text-red-300">
                          <div className="font-medium mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Cannot save — a task is already in this sleep time:
                          </div>
                          <ul className="space-y-0.5">
                            {conflicts.map(c => (
                              <li key={c.id}>• "{c.title}" ({formatTimeDisplay(c.startTime)} – {formatTimeDisplay(c.endTime)})</li>
                            ))}
                          </ul>
                          <div className="mt-1">Delete or move it from the timetable first, or change the sleep time.</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
          
          <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700 gap-2">
            <Button
              variant="outline"
              onClick={() => handleSleepModalOpenChange(false)}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </Button>
            <Button onClick={handleSaveSleepDraft} className="gap-2">
              <Save className="w-4 h-4" />
              Save Sleep Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Creation Dialog */}
      <Dialog open={showTaskCreationDialog} onOpenChange={(open) => {
        setShowTaskCreationDialog(open)
        if (!open) {
          setTaskCreationContext(null)
          resetTaskForm()
        }
      }}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">
              Add Task to {formatDayLabel(taskCreationContext?.day)} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {taskCreationFlow === 'simple'
                ? 'Choose how you want to add this task'
                : 'Link this task to a goal or milestone to track progress'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Time Slot:</span> {formatDayLabel(taskCreationContext?.day)} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Task will be scheduled starting at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
              </p>
            </div>

            {taskDialogError && (
              <div className="p-3 rounded-lg border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{taskDialogError}</span>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Task Title *</label>
              <Input
                placeholder="e.g., Study React, Complete Assignment"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Subject</label>
                <Input
                  placeholder="e.g., DSA, Web Dev"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Duration</label>
                <Select
                  value={newTask.duration.toString()}
                  onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {getDurationOptions(taskCreationContext?.time || '00:00').map(d => (
                      <SelectItem key={d} value={d.toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {d} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Priority</label>
              <Select
                value={newTask.priority}
                onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="LOW" className="dark:text-gray-300 dark:hover:bg-gray-700">Low</SelectItem>
                  <SelectItem value="MEDIUM" className="dark:text-gray-300 dark:hover:bg-gray-700">Medium</SelectItem>
                  <SelectItem value="HIGH" className="dark:text-gray-300 dark:hover:bg-gray-700">High</SelectItem>
                  <SelectItem value="CRITICAL" className="dark:text-gray-300 dark:hover:bg-gray-700">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {taskCreationFlow === 'withGoal' && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block dark:text-gray-300">Link to Goal (Optional)</label>
                  <Select
                    value={newTask.goalId}
                    onValueChange={(value) => {
                      setNewTask({
                        ...newTask,
                        goalId: value,
                        milestoneId: ''
                      })
                    }}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                      <SelectValue placeholder="Select a goal" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="no-goal" className="dark:text-gray-300 dark:hover:bg-gray-700">No Goal (Independent Task)</SelectItem>
                      {goals.map(goal => (
                        <SelectItem key={goal.id} value={goal.id} className="dark:text-gray-300 dark:hover:bg-gray-700">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: goal.color }}
                            />
                            {goal.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newTask.goalId && newTask.goalId !== 'no-goal' && (
                  <div>
                    <label className="text-sm font-medium mb-2 block dark:text-gray-300">Link to Milestone (Optional)</label>
                    <Select
                      value={newTask.milestoneId}
                      onValueChange={(value) => setNewTask({...newTask, milestoneId: value})}
                    >
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                        <SelectValue placeholder="Select a milestone" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        <SelectItem value="no-milestone" className="dark:text-gray-300 dark:hover:bg-gray-700">No Milestone (General Goal Task)</SelectItem>
                        {goals
                          .find(g => g.id === newTask.goalId)
                          ?.milestones.map(milestone => (
                            <SelectItem key={milestone.id} value={milestone.id} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                                {milestone.title}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Notes (Optional)</label>
              <Textarea
                placeholder="Add any notes..."
                value={newTask.note}
                onChange={(e) => setNewTask({...newTask, note: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                rows={2}
              />
            </div>
            
            <div className="flex gap-2">
              {taskCreationFlow === 'simple' ? (
                <Button
                  variant="outline"
                  onClick={() => setTaskCreationFlow('withGoal')}
                  className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Link to Goal
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setTaskCreationFlow('simple')}
                  className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Simple Task
                </Button>
              )}
              <Button
                onClick={handleAddTaskToCell}
                className="flex-1"
                disabled={!newTask.title.trim() || !!taskDialogError}
              >
                {taskCreationFlow === 'withGoal' && cleanId(newTask.goalId) ? 'Add Task with Goal' : 'Add Task'}
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowTaskCreationDialog(false)
                setTaskCreationContext(null)
                resetTaskForm()
              }}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goals Modal */}
      <Dialog open={showGoalsModal} onOpenChange={setShowGoalsModal}>
        <DialogContent className="sm:max-w-4xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100">Schedule Goals & Milestones</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Items are placed in the first free 1-hour slot that doesn't clash with fixed commitments, other tasks or sleep
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            {goals.map(goal => (
              <div key={goal.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                    <div>
                      <h3 className="font-medium dark:text-gray-200">{goal.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{goal.progress}% complete</span>
                        <span>•</span>
                        <span>{goal.completedHours.toFixed(1)}/{goal.totalHours}h</span>
                        <span>•</span>
                        <span>{getDaysUntilDeadline(goal.targetDate)} days left</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(goal.priority)}>
                    {goal.priority}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium dark:text-gray-300">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${goal.progress}%`,
                        backgroundColor: goal.color
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium dark:text-gray-200 mb-2">Milestones</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {goal.milestones.map(milestone => {
                      const isScheduled = tasks.some(t => 
                        t.goalId === goal.id && t.milestoneId === milestone.id
                      )
                      
                      return (
                        <div 
                          key={milestone.id}
                          className={`p-3 rounded-lg border ${isScheduled ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                <h5 className="font-medium text-sm dark:text-gray-200">{milestone.title}</h5>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                {milestone.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                {milestone.progress}%
                              </span>
                              {isScheduled && (
                                <Badge className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                  Scheduled
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {milestone.completedHours.toFixed(1)}/{milestone.scheduledHours}h
                            </div>
                            <div className="flex items-center gap-2">
                              {milestone.completed ? (
                                <Badge className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Completed
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                                  onClick={() => handleScheduleMilestone(goal, milestone)}
                                >
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Schedule
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {goal?.tasks?.length || 0} tasks scheduled from this goal
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => {
                        const added = scheduleItems([{
                          title: goal.title,
                          subject: goal.subject || goal.title,
                          priority: goal.priority,
                          color: goal.color,
                          goalId: goal.id
                        }])
                        if (added.length > 0) {
                          toast.success(`Scheduled "${goal.title}" for ${formatDayLabel(added[0].day)} at ${formatTimeDisplay(added[0].startTime)}`)
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Goal Task
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setShowGoalsModal(false)}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </Button>
            <Button onClick={() => {
              const pending: Array<{ title: string; subject: string; priority: Goal['priority']; color: string; goalId: string; milestoneId?: string }> = []
              goals.forEach(goal => {
                goal.milestones.forEach(milestone => {
                  if (!milestone.completed && !tasks.some(t => t.milestoneId === milestone.id)) {
                    pending.push({
                      title: milestone.title,
                      subject: goal.subject || goal.title,
                      priority: goal.priority,
                      color: goal.color,
                      goalId: goal.id,
                      milestoneId: milestone.id
                    })
                  }
                })
              })

              if (pending.length === 0) {
                toast.info('All milestones are already scheduled or completed!')
                return
              }
              const added = scheduleItems(pending)
              if (added.length > 0) {
                toast.success(`Scheduled ${added.length} milestone${added.length > 1 ? 's' : ''} in free slots`)
              }
            }}>
              <Zap className="w-4 h-4 mr-2" />
              Auto-Schedule All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Milestone Modal */}
      <Dialog open={!!selectedGoalForMilestone} onOpenChange={() => setSelectedGoalForMilestone(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Schedule Milestone from {selectedGoalForMilestone?.title}</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Select a milestone to schedule in your timetable
            </DialogDescription>
          </DialogHeader>
          
          {selectedGoalForMilestone && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Goal:</span> {selectedGoalForMilestone.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {selectedGoalForMilestone.progress}% complete • {selectedGoalForMilestone.completedHours.toFixed(1)}/{selectedGoalForMilestone.totalHours}h
                </p>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                {selectedGoalForMilestone.milestones.map(milestone => {
                  const isScheduled = tasks.some(t => t.milestoneId === milestone.id)
                  
                  return (
                    <div 
                      key={milestone.id}
                      className={`p-3 rounded-lg border ${isScheduled ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer'}`}
                      onClick={() => !isScheduled && handleScheduleMilestone(selectedGoalForMilestone, milestone)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                            <h5 className="font-medium text-sm dark:text-gray-200">{milestone.title}</h5>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {milestone.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {milestone.progress}%
                          </span>
                          {isScheduled && (
                            <Badge className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                              Scheduled
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {milestone.completedHours.toFixed(1)}/{milestone.scheduledHours}h
                        </div>
                        {milestone.completed ? (
                          <Badge className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        ) : isScheduled ? (
                          <Badge className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            Scheduled
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <ArrowRight className="w-3 h-3 mr-1" />
                            Schedule
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Click on a milestone to schedule it. It will be placed in the first free slot of your timetable.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedGoalForMilestone(null)}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedGoalForMilestone) {
                  const incompleteMilestone = selectedGoalForMilestone.milestones.find(m => !m.completed && !tasks.some(t => t.milestoneId === m.id))
                  if (incompleteMilestone) {
                    handleScheduleMilestone(selectedGoalForMilestone, incompleteMilestone)
                  } else {
                    toast.info('All milestones are already scheduled or completed!')
                  }
                }
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Schedule Next Milestone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Extension Modal */}
      <Dialog open={showTimeExtensionModal} onOpenChange={setShowTimeExtensionModal}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Extend Time Slots</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Add additional time slots to your schedule
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="font-medium dark:text-gray-200">Quick Extensions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={timeSettings.extendedHours.morning ? "default" : "outline"}
                  onClick={() => handleExtendTime('morning')}
                  className="flex-col h-auto py-3"
                >
                  <Sunrise className="w-5 h-5 mb-1" />
                  <span className="text-xs">Morning</span>
                  <span className="text-[10px] opacity-75">5 AM - 8 AM</span>
                </Button>
                
                <Button
                  variant={timeSettings.extendedHours.evening ? "default" : "outline"}
                  onClick={() => handleExtendTime('evening')}
                  className="flex-col h-auto py-3"
                >
                  <Sunset className="w-5 h-5 mb-1" />
                  <span className="text-xs">Evening</span>
                  <span className="text-[10px] opacity-75">6 PM - 10 PM</span>
                </Button>
                
                <Button
                  variant={timeSettings.extendedHours.night ? "default" : "outline"}
                  onClick={() => handleExtendTime('night')}
                  className="flex-col h-auto py-3 col-span-2"
                >
                  <MoonStar className="w-5 h-5 mb-1" />
                  <span className="text-xs">Night</span>
                  <span className="text-[10px] opacity-75">10 PM - 12 AM</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium dark:text-gray-200">Custom Time Slot</h3>
              <div className="flex gap-2">
                <Input
                  type="time"
                  placeholder="HH:MM"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  id="custom-time"
                />
                <Button 
                  onClick={() => {
                    const input = document.getElementById('custom-time') as HTMLInputElement
                    if (input.value) {
                      handleAddCustomTime(input.value)
                      input.value = ''
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              
              {timeSettings.extendedHours.custom.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm dark:text-gray-300">Added Slots</Label>
                  <div className="flex flex-wrap gap-2">
                    {timeSettings.extendedHours.custom.map(time => (
                      <Badge key={time} variant="secondary" className="px-2 py-1 gap-1">
                        {formatTimeDisplay(time)}
                        <button
                          onClick={() => handleRemoveCustomTime(time)}
                          className="ml-1 hover:text-red-500"
                        >
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
            <Button
              variant="outline"
              onClick={() => setShowTimeExtensionModal(false)}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Fixed Time Modal */}
      <Dialog open={showAddFixedTimeModal} onOpenChange={setShowAddFixedTimeModal}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100">Add Fixed Commitment</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Add your regular commitments like college hours, office time, gym sessions, etc.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            {renderFixedTimeFields(newFixedTime, (patch) => setNewFixedTime(prev => ({ ...prev, ...patch })))}

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-700 dark:text-blue-300">Free Periods</span>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                You can add free periods within this commitment after creating it. 
                These will allow scheduling tasks during fixed commitment hours.
              </p>
              <div className="text-xs text-blue-500 dark:text-blue-400">
                Note: Free periods are day-specific. You can add different free periods for different days.
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddFixedTimeModal(false)
                resetNewFixedTime()
              }}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button onClick={handleAddFixedTime}>
              Add Fixed Commitment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Fixed Time Modal */}
      <Dialog open={showEditFixedTimeModal} onOpenChange={setShowEditFixedTimeModal}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100">Edit Fixed Commitment</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Update your fixed commitment details
            </DialogDescription>
          </DialogHeader>
          
          {editingFixedTime && (
            <div className="space-y-6 py-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
              {renderFixedTimeFields(editingFixedTime, (patch) => setEditingFixedTime(prev => (prev ? { ...prev, ...patch } : prev)))}

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-medium text-yellow-700 dark:text-yellow-300">Note</span>
                </div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  You can edit fixed commitment details here. To add/remove free periods, 
                  use the "Add Free Period" button in the commitment details view.
                  Changes that would clash with existing tasks are blocked until you move those tasks.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditFixedTimeModal(false)
                setEditingFixedTime(null)
              }}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button onClick={() => editingFixedTime && handleSaveFixedTime(editingFixedTime)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Free Period Modal */}
      <Dialog open={showAddFreePeriodModal} onOpenChange={setShowAddFreePeriodModal}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Add Free Period</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Add a free period within "{selectedFixedTimeForFreePeriod?.title}" for a specific day
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedFixedTimeForFreePeriod && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Fixed Commitment:</span> {selectedFixedTimeForFreePeriod.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {formatTimeDisplay(selectedFixedTimeForFreePeriod.startTime)} - {formatTimeDisplay(selectedFixedTimeForFreePeriod.endTime)}
                </p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Title *</label>
              <Input
                placeholder="e.g., Free Period, Break, Study Time"
                value={newFreePeriod.title}
                onChange={(e) => setNewFreePeriod({...newFreePeriod, title: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Day *</label>
              <Select
                value={newFreePeriod.day}
                onValueChange={(value) => setNewFreePeriod({...newFreePeriod, day: value})}
              >
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Select the day for this free period. The free period will only apply to this specific day.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time *</label>
                <Input
                  type="time"
                  value={newFreePeriod.startTime}
                  onChange={(e) => setNewFreePeriod({...newFreePeriod, startTime: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">End Time *</label>
                <Input
                  type="time"
                  value={newFreePeriod.endTime}
                  onChange={(e) => setNewFreePeriod({...newFreePeriod, endTime: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
              <div className="flex items-center gap-2 mb-1">
                <Coffee className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-700 dark:text-green-400">Free Period Information</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                This free period will only apply to {formatDayLabel(newFreePeriod.day)}. 
                It must be inside the fixed commitment's time. You can add different free periods for different days.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddFreePeriodModal(false)
                setSelectedFixedTimeForFreePeriod(null)
              }}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button onClick={handleAddFreePeriod}>
              Add Free Period for {formatDayLabel(newFreePeriod.day)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Add Free Period Modal - opens when clicking a Fixed Commitment cell,
          pre-filled with the exact day + time slot that was clicked */}
      <Dialog open={showQuickFreePeriodModal} onOpenChange={(open) => {
        setShowQuickFreePeriodModal(open)
        if (!open) setQuickFreePeriodContext(null)
      }}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-green-600 dark:text-green-400" />
              Add Free Period
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {quickFreePeriodContext && (
                <>This slot is inside "{quickFreePeriodContext.fixedTime.title}". Add a free period here so you can schedule a task.</>
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
                  <span className="font-medium">Clicked Time:</span> {formatTimeDisplay(quickFreePeriodContext.time)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Fixed Commitment: {quickFreePeriodContext.fixedTime.title} ({formatTimeDisplay(quickFreePeriodContext.fixedTime.startTime)} - {formatTimeDisplay(quickFreePeriodContext.fixedTime.endTime)})
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Free Period Title *</label>
                <Input
                  placeholder="e.g., Lunch Break, Study Gap"
                  value={newFreePeriod.title}
                  onChange={(e) => setNewFreePeriod({...newFreePeriod, title: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time *</label>
                  <Input
                    type="time"
                    value={newFreePeriod.startTime}
                    onChange={(e) => setNewFreePeriod({...newFreePeriod, startTime: e.target.value})}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block dark:text-gray-300">End Time *</label>
                  <Input
                    type="time"
                    value={newFreePeriod.endTime}
                    onChange={(e) => setNewFreePeriod({...newFreePeriod, endTime: e.target.value})}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30 text-sm text-green-700 dark:text-green-400">
                After adding, you'll be able to immediately add a task into this free period — for {formatDayLabel(quickFreePeriodContext.day)}.
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (quickFreePeriodContext) {
                  setSelectedFixedTime(quickFreePeriodContext.fixedTime)
                }
                setShowQuickFreePeriodModal(false)
                setQuickFreePeriodContext(null)
              }}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              View Full Commitment
            </Button>
            <Button onClick={handleQuickAddFreePeriod}>
              <Coffee className="w-4 h-4 mr-2" />
              Add Free Period & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Settings Modal */}
      <Dialog open={showTimeSettingsModal} onOpenChange={setShowTimeSettingsModal}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100">Display Settings</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Customize how your timetable looks and functions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            <div className="space-y-4">
              <h3 className="font-medium dark:text-gray-200">Time Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time</label>
                  <Select
                    value={timeSettings.startHour.toString()}
                    onValueChange={(value) => setTimeSettings({
                      ...timeSettings,
                      startHour: parseInt(value)
                    })}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                      <SelectValue placeholder="Select start hour" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                        <SelectItem 
                          key={hour} 
                          value={hour.toString()}
                          className="dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block dark:text-gray-300">End Time</label>
                  <Select
                    value={timeSettings.endHour.toString()}
                    onValueChange={(value) => setTimeSettings({
                      ...timeSettings,
                      endHour: parseInt(value)
                    })}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                      <SelectValue placeholder="Select end hour" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {Array.from({ length: 24 }, (_, i) => i + 1).map(hour => (
                        <SelectItem 
                          key={hour} 
                          value={hour.toString()}
                          className="dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium dark:text-gray-200">Time Interval</h3>
              <div className="grid grid-cols-3 gap-2">
                {[30, 60, 120].map(interval => (
                  <Button
                    key={interval}
                    variant={timeSettings.interval === interval ? "default" : "outline"}
                    onClick={() => setTimeSettings({...timeSettings, interval})}
                    className="flex-col h-auto py-3 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <span className="font-medium">{interval} min</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {interval === 30 ? 'Detailed' : interval === 60 ? 'Standard' : 'Large'}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium dark:text-gray-200">Cell Height</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm dark:text-gray-300">Compact</span>
                  <span className="text-sm font-medium dark:text-gray-300">{timeSettings.cellHeight}px</span>
                  <span className="text-sm dark:text-gray-300">Spacious</span>
                </div>
                <Slider
                  value={[timeSettings.cellHeight]}
                  min={30}
                  max={100}
                  step={5}
                  onValueChange={(value) => setTimeSettings({
                    ...timeSettings,
                    cellHeight: value[0]
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium dark:text-gray-200">Display Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium dark:text-gray-300">Show Weekends</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Include Saturday and Sunday in timetable
                    </div>
                  </div>
                  <Switch
                    checked={timeSettings.showWeekends}
                    onCheckedChange={(checked) => setTimeSettings({
                      ...timeSettings,
                      showWeekends: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium dark:text-gray-300">Show Sleep Blocks</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Display sleep schedule in timetable (tasks can still be added during sleep)
                    </div>
                  </div>
                  <Switch
                    checked={timeSettings.showSleepBlocks}
                    onCheckedChange={(checked) => setTimeSettings({
                      ...timeSettings,
                      showSleepBlocks: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium dark:text-gray-300">24-Hour View</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Show all 24 hours of the day
                    </div>
                  </div>
                  <Switch
                    checked={timeSettings.show24Hours}
                    onCheckedChange={(checked) => setTimeSettings({
                      ...timeSettings,
                      show24Hours: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium dark:text-gray-300">Display Mode</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {timeSettings.displayMode === 'vertical' 
                        ? 'Weekdays as columns' 
                        : 'Weekdays as rows'}
                    </div>
                  </div>
                  <Select
                    value={timeSettings.displayMode}
                    onValueChange={(value: 'vertical' | 'horizontal') => 
                      setTimeSettings({...timeSettings, displayMode: value})
                    }
                  >
                    <SelectTrigger className="w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                      <SelectValue placeholder="Select display mode" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="vertical" className="dark:text-gray-300 dark:hover:bg-gray-700">Vertical (Weekdays as columns)</SelectItem>
                      <SelectItem value="horizontal" className="dark:text-gray-300 dark:hover:bg-gray-700">Horizontal (Weekdays as rows)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setShowTimeSettingsModal(false)}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTimeSettings}>
              Apply Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Task Modal */}
      <Dialog open={showAddTaskModal} onOpenChange={(open) => {
        setShowAddTaskModal(open)
        if (!open) {
          setEditingTask(null)
          resetTaskForm()
        }
      }}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {editingTask ? 'Update task details' : 'Create a task to add to your timetable'}
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
              <Input
                placeholder="e.g., Study React, Complete Assignment"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Subject</label>
                <Input
                  placeholder="e.g., DSA, Web Dev"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Day</label>
                <Select
                  value={newTask.day}
                  onValueChange={(value) => setNewTask({...newTask, day: value})}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                    <SelectValue placeholder="Select day" />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time</label>
                <Input
                  type="time"
                  value={newTask.startTime}
                  onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Duration</label>
                <Select
                  value={newTask.duration.toString()}
                  onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="30" className="dark:text-gray-300 dark:hover:bg-gray-700">30 minutes</SelectItem>
                    <SelectItem value="60" className="dark:text-gray-300 dark:hover:bg-gray-700">1 hour</SelectItem>
                    <SelectItem value="90" className="dark:text-gray-300 dark:hover:bg-gray-700">1.5 hours</SelectItem>
                    <SelectItem value="120" className="dark:text-gray-300 dark:hover:bg-gray-700">2 hours</SelectItem>
                    <SelectItem value="180" className="dark:text-gray-300 dark:hover:bg-gray-700">3 hours</SelectItem>
                    {![30, 60, 90, 120, 180].includes(newTask.duration) && (
                      <SelectItem value={newTask.duration.toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {newTask.duration} minutes
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Priority</label>
              <Select
                value={newTask.priority}
                onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                  <SelectValue placeholder="Select priority" />
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
              <Textarea
                placeholder="Add any notes..."
                value={newTask.note}
                onChange={(e) => setNewTask({...newTask, note: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddTaskModal(false)
                setEditingTask(null)
                resetTaskForm()
              }}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={editingTask ? handleUpdateTask : handleAddTask}
              disabled={!!editTaskError}
            >
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fixed Commitment Details Modal */}
      {selectedFixedTime && (
        <Dialog open={!!selectedFixedTime} onOpenChange={() => setSelectedFixedTime(null)}>
          <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">Fixed Commitment Details</DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                View and manage your fixed commitment
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${selectedFixedTime.color}20` }}
                >
                  {getIconByType(selectedFixedTime.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg dark:text-gray-200">{selectedFixedTime.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFixedTime.days.map(d => formatDayLabel(d)).join(', ')} • {formatTimeDisplay(selectedFixedTime.startTime)} - {formatTimeDisplay(selectedFixedTime.endTime)}
                  </p>
                  <Badge 
                    className="mt-2"
                    style={{ 
                      backgroundColor: `${selectedFixedTime.color}20`,
                      color: selectedFixedTime.color
                    }}
                  >
                    {selectedFixedTime.type}
                  </Badge>
                </div>
              </div>
              
              {selectedFixedTime.description && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedFixedTime.description}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium dark:text-gray-200">Free Periods</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => {
                      setSelectedFixedTimeForFreePeriod(selectedFixedTime)
                      setNewFreePeriod({
                        ...newFreePeriod,
                        day: selectedFixedTime.days[0] || 'MONDAY'
                      })
                      setShowAddFreePeriodModal(true)
                    }}
                  >
                    <Coffee className="w-3 h-3" />
                    Add Free Period
                  </Button>
                </div>
                
                {(!selectedFixedTime.freePeriods || selectedFixedTime.freePeriods.length === 0) ? (
                  <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
                    <Coffee className="w-6 h-6 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No free periods added. Add free periods to schedule tasks within this fixed commitment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Array.from(new Set(selectedFixedTime.freePeriods.map(fp => fp.day))).map(day => {
                      const dayFreePeriods = selectedFixedTime.freePeriods?.filter(fp => fp.day === day) || []
                      return (
                        <div key={day} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {formatDayLabel(day)}
                            </h5>
                            <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">
                              {dayFreePeriods.length} period{dayFreePeriods.length > 1 ? 's' : ''}
                            </Badge>
                          </div>
                          {dayFreePeriods.map((fp) => (
                            <div key={fp.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Coffee className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  <span className="font-medium text-green-700 dark:text-green-400">{fp.title}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    const updatedFreePeriods = selectedFixedTime.freePeriods?.filter(f => f.id !== fp.id) || []
                                    handleSaveFixedTime({
                                      ...selectedFixedTime,
                                      freePeriods: updatedFreePeriods
                                    })
                                  }}
                                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                  title="Remove free period"
                                >
                                  <X className="w-3 h-3 text-red-500 dark:text-red-400" />
                                </button>
                              </div>
                              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                                {formatTimeDisplay(fp.startTime)} - {formatTimeDisplay(fp.endTime)} ({fp.duration} minutes)
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium dark:text-gray-200">Tasks in Free Periods</h4>
                {tasks.filter(t => t.fixedCommitmentId === selectedFixedTime.id && !t.isSleepTime).length === 0 ? (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      No tasks scheduled in free periods yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasks
                      .filter(t => t.fixedCommitmentId === selectedFixedTime.id && !t.isSleepTime)
                      .map(task => (
                        <div key={task.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm dark:text-gray-200">{task.title}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {formatDayLabel(task.day)} • {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
                              </div>
                            </div>
                            <Badge 
                              className="text-xs"
                              style={{ backgroundColor: `${task.color}20`, color: task.color }}
                            >
                              {task.subject}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedFixedTime(null)}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleEditFixedTime(selectedFixedTime)
                  setSelectedFixedTime(null)
                }}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Edit Commitment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}