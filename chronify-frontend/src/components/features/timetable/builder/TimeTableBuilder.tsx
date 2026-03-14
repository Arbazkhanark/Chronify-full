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
  type: 'STUDY' | 'CLASS' | 'PROJECT' | 'HEALTH' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP' | 'OTHER'
  category?: 'ACADEMIC' | 'PROFESSIONAL' | 'PERSONAL' | 'HEALTH' | 'OTHER'
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

// ==================== FIXED: Task Type Mapping Functions ====================

// Map UI task type to API task type (UPPERCASE)
const mapUITypeToAPIType = (uiType: TimeSlot['type']): ApiTask['type'] => {
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
    case 'task': return 'STUDY' // Default to STUDY
    case 'break': return 'OTHER'
    case 'commute': return 'OTHER'
    case 'free': return 'OTHER'
    case 'fixed': return 'OTHER'
    case 'other': return 'OTHER'
    default: return 'OTHER'
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

// ==================== END FIXED ====================

const API_BASE_URL = 'http://localhost:8181/v0/api'

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

  // ==================== NEW: Lock Confirmation State ====================
  const [showLockConfirm, setShowLockConfirm] = useState(false)
  const [lockConfirmed, setLockConfirmed] = useState(false)

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
  const [editingTask, setEditingTask] = useState<TimeSlot | null>(null)
  const [selectedFixedTime, setSelectedFixedTime] = useState<FixedTime | null>(null)
  const [showGoalsModal, setShowGoalsModal] = useState(false)
  const [selectedGoalForMilestone, setSelectedGoalForMilestone] = useState<Goal | null>(null)
  const [editingSleepSchedule, setEditingSleepSchedule] = useState<SleepSchedule | null>(null)
  
  const [taskCreationFlow, setTaskCreationFlow] = useState<'simple' | 'withGoal'>('simple')
  const [showTaskCreationDialog, setShowTaskCreationDialog] = useState(false)
  const [taskCreationContext, setTaskCreationContext] = useState<{day: string, time: string} | null>(null)
  
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

  useEffect(() => {
    fetchFullTimeTable()
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
      setTasks(tasks.filter(task => !task.isSleepTime))
    }
  }, [sleepSchedules, timeSettings.showSleepBlocks])

  useEffect(() => {
    setHasUnsavedChanges(tasks.length > 0 || fixedTimes.length > 0 || sleepSchedules.length > 0)
  }, [tasks, fixedTimes, sleepSchedules])

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
        
        // Process each day's slots
        const fixedTimesMap = new Map<string, FixedTime>()
        const sleepSchedulesMap = new Map<string, SleepSchedule>()
        const allTasks: TimeSlot[] = []
        
        apiData.forEach(dayData => {
          dayData.slots.forEach(slot => {
            // Handle FIXED slots
            if (slot.type === 'FIXED' && slot.fixedTimeId) {
              if (!fixedTimesMap.has(slot.fixedTimeId)) {
                // Determine the type based on title
                let type: FixedTime['type'] = 'OTHER'
                if (slot.title.toLowerCase().includes('college') || slot.title.toLowerCase().includes('lecture') || slot.title.toLowerCase().includes('class')) {
                  type = 'COLLEGE'
                } else if (slot.title.toLowerCase().includes('gym') || slot.title.toLowerCase().includes('workout')) {
                  type = 'WORKOUT'
                } else if (slot.title.toLowerCase().includes('office') || slot.title.toLowerCase().includes('work')) {
                  type = 'OFFICE'
                } else if (slot.title.toLowerCase().includes('meeting')) {
                  type = 'MEETING'
                } else if (slot.title.toLowerCase().includes('meal') || slot.title.toLowerCase().includes('lunch') || slot.title.toLowerCase().includes('breakfast') || slot.title.toLowerCase().includes('dinner')) {
                  type = 'MEAL'
                } else if (slot.title.toLowerCase().includes('sleep') || slot.title.toLowerCase().includes('bed')) {
                  type = 'SLEEP'
                }

                fixedTimesMap.set(slot.fixedTimeId, {
                  id: `fixed-${Date.now()}-${Math.random()}`,
                  serverId: slot.fixedTimeId,
                  title: slot.title,
                  description: slot.description || undefined,
                  days: [dayData.day],
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  type: type,
                  color: slot.color || getFixedTimeColor(type),
                  isEditable: true,
                  freePeriods: []
                })
              } else {
                // Add day to existing fixed time
                const existing = fixedTimesMap.get(slot.fixedTimeId)
                if (existing && !existing.days.includes(dayData.day)) {
                  existing.days.push(dayData.day)
                }
              }
            }
            
            // Handle FREE slots (these are free periods within fixed commitments)
            if (slot.type === 'FREE' && slot.fixedTimeId && slot.freePeriodId) {
              const fixedTime = fixedTimesMap.get(slot.fixedTimeId)
              if (fixedTime) {
                if (!fixedTime.freePeriods) {
                  fixedTime.freePeriods = []
                }
                
                // Check if free period already exists
                const existingFreePeriod = fixedTime.freePeriods.find(fp => fp.id === slot.freePeriodId)
                if (!existingFreePeriod) {
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
            
            // Handle SLEEP slots
            if (slot.type === 'SLEEP' && slot.sleepScheduleId) {
              if (!sleepSchedulesMap.has(slot.sleepScheduleId)) {
                // Parse sleep type from title
                let sleepType: 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE' = 'REGULAR'
                if (slot.title.toLowerCase().includes('late')) {
                  sleepType = 'LATE'
                } else if (slot.title.toLowerCase().includes('power') || slot.title.toLowerCase().includes('nap')) {
                  sleepType = 'POWER_NAP'
                } else if (slot.title.toLowerCase().includes('recovery')) {
                  sleepType = 'RECOVERY'
                } else if (slot.title.toLowerCase().includes('early')) {
                  sleepType = 'EARLY'
                }

                sleepSchedulesMap.set(slot.sleepScheduleId, {
                  id: slot.sleepScheduleId,
                  day: dayData.day,
                  bedtime: slot.startTime,
                  wakeTime: slot.endTime,
                  duration: slot.duration || calculateDuration(slot.startTime, slot.endTime),
                  isActive: true,
                  type: sleepType,
                  notes: slot.description || undefined,
                  color: slot.color || '#4B5563'
                })
              }
            }
            
            // Handle TASK slots - USING THE FIXED MAPPING FUNCTION
            const taskTypes = ['STUDY', 'PROJECT', 'CLASS', 'HEALTH', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT']
            if (taskTypes.includes(slot.type) && slot.taskId) {
              const taskType = mapAPITypeToUIType(slot.type)
              
              allTasks.push({
                id: slot.taskId,
                title: slot.title,
                subject: slot.subject || 'General',
                startTime: slot.startTime,
                endTime: slot.endTime,
                duration: slot.duration || calculateDuration(slot.startTime, slot.endTime),
                priority: (slot.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') || 'MEDIUM',
                color: slot.color || '#3B82F6',
                day: dayData.day,
                type: taskType,
                description: slot.description || undefined,
                serverId: slot.taskId,
                status: slot.status || 'PENDING',
                category: slot.category || 'ACADEMIC'
              })
            }
          })
        })
        
        // Convert maps to arrays
        const fixedTimesArray = Array.from(fixedTimesMap.values())
        const sleepSchedulesArray = Array.from(sleepSchedulesMap.values())
        
        setFixedTimes(fixedTimesArray)
        setSleepSchedules(sleepSchedulesArray)
        setTasks(allTasks)
        
        console.log('Loaded tasks:', allTasks)
        console.log('Loaded fixed times:', fixedTimesArray)
        console.log('Loaded sleep schedules:', sleepSchedulesArray)
        
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

  const calculateTaskSpan = (task: TimeSlot): number => {
    if (task.span) return task.span
    
    const startMinutes = convertTimeToMinutes(task.startTime)
    const endMinutes = convertTimeToMinutes(task.endTime)
    const duration = endMinutes - startMinutes
    return Math.max(1, Math.ceil(duration / timeSettings.interval))
  }

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60) % 24
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }

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
    
    const updatedGoals = goals.map(goal => {
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
      
      return {
        ...goal,
        completedHours,
        progress: Math.round(totalProgress),
        milestones: updatedMilestones,
        status: totalProgress >= 100 ? 'COMPLETED' : totalProgress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
        streak: newStreak,
        lastUpdated: new Date()
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
      
      if (wakeTimeMinutes < bedtimeMinutes) {
        const midnight = convertTimeToMinutes('24:00')
        const firstDayDuration = midnight - bedtimeMinutes
        
        sleepTasks.push({
          id: `sleep-${schedule.id}-part1`,
          title: schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
          subject: 'Rest',
          startTime: schedule.bedtime,
          endTime: '24:00',
          duration: firstDayDuration,
          priority: 'MEDIUM',
          color: schedule.color || '#4B5563',
          day: schedule.day,
          type: 'sleep',
          isSleepTime: true,
          sleepScheduleId: schedule.id,
          isCompleted: false
        })
        
        const nextDayIndex = (days.indexOf(schedule.day) + 1) % days.length
        const nextDay = days[nextDayIndex]
        
        sleepTasks.push({
          id: `sleep-${schedule.id}-part2`,
          title: schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
          subject: 'Rest',
          startTime: '00:00',
          endTime: schedule.wakeTime,
          duration: wakeTimeMinutes,
          priority: 'MEDIUM',
          color: schedule.color || '#4B5563',
          day: nextDay,
          type: 'sleep',
          isSleepTime: true,
          sleepScheduleId: schedule.id,
          isCompleted: false
        })
      } else {
        sleepTasks.push({
          id: `sleep-${schedule.id}`,
          title: schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
          subject: 'Rest',
          startTime: schedule.bedtime,
          endTime: schedule.wakeTime,
          duration: schedule.duration,
          priority: 'MEDIUM',
          color: schedule.color || '#4B5563',
          day: schedule.day,
          type: 'sleep',
          isSleepTime: true,
          sleepScheduleId: schedule.id,
          isCompleted: false
        })
      }
    })
    
    setTasks(prev => [...prev.filter(task => !task.isSleepTime), ...sleepTasks])
  }

  const handleDragEnd = (result: any) => {
    if (isLocked) return
    
    const { taskId, day, time, duration } = result
    
    const existingTask = tasks.find(t => t.id === taskId)
    if (existingTask?.isSleepTime) {
      toast.error('Sleep time blocks cannot be moved. Adjust sleep schedule instead.')
      return
    }
    
    const existingTaskIndex = tasks.findIndex(t => t.id === taskId)
    
    if (existingTaskIndex >= 0) {
      const updatedTasks = [...tasks]
      updatedTasks[existingTaskIndex] = {
        ...updatedTasks[existingTaskIndex],
        day,
        startTime: time,
        endTime: calculateEndTime(time, duration || updatedTasks[existingTaskIndex].duration),
        duration: duration || updatedTasks[existingTaskIndex].duration
      }
      setTasks(updatedTasks)
    } else {
      const goal = goals.find(g => g.id === taskId)
      const milestone = goal?.milestones.find(m => m.id === taskId)
      
      if (goal || milestone) {
        const newTaskObj: TimeSlot = {
          id: `task-${Date.now()}`,
          title: milestone ? milestone.title : goal!.title,
          subject: goal!.subject || goal!.title,
          startTime: time,
          endTime: calculateEndTime(time, 60),
          duration: 60,
          priority: goal!.priority,
          color: goal!.color,
          day,
          type: 'task',
          goalId: goal!.id,
          milestoneId: milestone?.id
        }
        setTasks([...tasks, newTaskObj])
        toast.success('Task added from goal')
      } else {
        const taskPool = getTaskPool()
        const taskFromPool = taskPool.find(t => t.id === taskId)
        
        if (taskFromPool) {
          const newTaskObj: TimeSlot = {
            ...taskFromPool,
            day,
            startTime: time,
            endTime: calculateEndTime(time, taskFromPool.duration),
            id: `task-${Date.now()}`
          }
          setTasks([...tasks, newTaskObj])
          toast.success('Task added from pool')
        }
      }
    }
  }

  const handleCellClick = (day: string, time: string) => {
    if (isLocked) return
    
    // Check if it's sleep time
    const isSleepTime = tasks.some(t => 
      t.day === day && 
      t.isSleepTime && 
      convertTimeToMinutes(t.startTime) <= convertTimeToMinutes(time) && 
      convertTimeToMinutes(t.endTime) > convertTimeToMinutes(time)
    )
    
    if (isSleepTime && timeSettings.autoLockSleep) {
      toast.warning('This is your scheduled sleep time. Please adjust your sleep schedule if you need to change this.')
      return
    }
    
    // Check if it's a fixed time slot
    const fixedTime = isTimeInFixedSlot(day, time)
    
    if (fixedTime) {
      const isInFreePeriod = fixedTime.freePeriods?.some(fp => 
        fp.day === day && isTimeInFreePeriodRange(time, fp.startTime, fp.endTime)
      )
      
      if (!isInFreePeriod) {
        setSelectedFixedTime(fixedTime)
        return
      }
    }

    setTaskCreationContext({ day, time })
    setShowTaskCreationDialog(true)
  }

  const isTimeInFreePeriodRange = (time: string, startTime: string, endTime: string): boolean => {
    const timeInMinutes = convertTimeToMinutes(time)
    const startMinutes = convertTimeToMinutes(startTime)
    const endMinutes = convertTimeToMinutes(endTime)
    return timeInMinutes >= startMinutes && timeInMinutes < endMinutes
  }

  const handleFixedTimeClick = (fixedTime: FixedTime) => {
    setSelectedFixedTime(fixedTime)
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const task: TimeSlot = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      subject: newTask.subject || 'General',
      startTime: newTask.startTime,
      endTime: calculateEndTime(newTask.startTime, newTask.duration),
      duration: newTask.duration,
      priority: newTask.priority,
      color: newTask.color,
      day: newTask.day,
      type: 'task',
      goalId: newTask.goalId || undefined,
      milestoneId: newTask.milestoneId || undefined,
      note: newTask.note,
      status: 'PENDING'
    }

    setTasks([...tasks, task])
    resetTaskForm()
    setShowAddTaskModal(false)
    toast.success('Task added successfully')
  }

  const handleAddTaskToCell = (flow: 'simple' | 'withGoal' = 'simple') => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }
    
    if (!taskCreationContext) {
      toast.error('No cell selected')
      return
    }

    let fixedCommitmentId: string | undefined = undefined
    let freePeriodId: string | undefined = undefined
    const fixedTime = isTimeInFixedSlot(taskCreationContext.day, taskCreationContext.time)
    if (fixedTime) {
      const freePeriod = fixedTime.freePeriods?.find(fp => 
        fp.day === taskCreationContext.day && 
        isTimeInFreePeriodRange(taskCreationContext.time, fp.startTime, fp.endTime)
      )
      if (freePeriod) {
        fixedCommitmentId = fixedTime.id
        freePeriodId = freePeriod.id
      }
    }

    const task: TimeSlot = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      subject: newTask.subject || 'General',
      startTime: taskCreationContext.time,
      endTime: calculateEndTime(taskCreationContext.time, newTask.duration),
      duration: newTask.duration,
      priority: newTask.priority,
      color: newTask.color,
      day: taskCreationContext.day,
      type: 'task',
      fixedCommitmentId,
      freePeriodId,
      goalId: newTask.goalId || undefined,
      milestoneId: newTask.milestoneId || undefined,
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

  const startTaskCreation = (flow: 'simple' | 'withGoal') => {
    setTaskCreationFlow(flow)
    if (taskCreationContext) {
      setNewTask({
        ...newTask,
        day: taskCreationContext.day,
        startTime: taskCreationContext.time,
        duration: timeSettings.interval
      })
    }
  }

  const handleEditTask = (task: TimeSlot) => {
    if (task.isSleepTime) {
      const sleepSchedule = sleepSchedules.find(s => s.id === task.sleepScheduleId)
      if (sleepSchedule) {
        setEditingSleepSchedule(sleepSchedule)
        setShowSleepScheduleModal(true)
      }
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
        updateSleepSchedule({
          ...sleepSchedule,
          isActive: false
        })
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
      id: `task-${Date.now()}`,
      title: `${task.title} (Copy)`
    }
    setTasks([...tasks, duplicatedTask])
    toast.success('Task duplicated')
  }

  const handleAddFixedTime = () => {
    if (!newFixedTime.title.trim()) {
      toast.error('Please enter a title')
      return
    }
    
    if (newFixedTime.days.length === 0) {
      toast.error('Please select at least one day')
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

    setFixedTimes([...fixedTimes, fixedTime])
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
    setShowAddFixedTimeModal(false)
    toast.success('Fixed commitment added')
  }

  const handleEditFixedTime = (fixedTime: FixedTime) => {
    setEditingFixedTime(fixedTime)
    setShowEditFixedTimeModal(true)
  }

  const handleSaveFixedTime = (updatedFixedTime: FixedTime) => {
    setFixedTimes(fixedTimes.map(ft => 
      ft.id === updatedFixedTime.id ? updatedFixedTime : ft
    ))
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
    
    const freePeriod = {
      id: `free-${Date.now()}-${newFreePeriod.day}`,
      title: newFreePeriod.title,
      startTime: newFreePeriod.startTime,
      endTime: newFreePeriod.endTime,
      duration: newFreePeriod.duration,
      day: newFreePeriod.day
    }
    
    const updatedFixedTime = {
      ...selectedFixedTimeForFreePeriod,
      freePeriods: [...(selectedFixedTimeForFreePeriod.freePeriods || []), freePeriod]
    }
    
    setFixedTimes(fixedTimes.map(ft => 
      ft.id === selectedFixedTimeForFreePeriod.id ? updatedFixedTime : ft
    ))
    
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

  const handleOpenFreePeriodModal = (fixedTime: FixedTime, day: string) => {
    setSelectedFixedTimeForFreePeriod(fixedTime)
    setNewFreePeriod({
      ...newFreePeriod,
      day: day
    })
    setShowAddFreePeriodModal(true)
  }

  const handleOpenSleepScheduleModal = () => {
    setShowSleepScheduleModal(true)
  }

  const handleSaveSleepSchedule = (schedule: SleepSchedule) => {
    const existingIndex = sleepSchedules.findIndex(s => s.id === schedule.id)
    
    if (existingIndex >= 0) {
      const updatedSchedules = [...sleepSchedules]
      updatedSchedules[existingIndex] = schedule
      setSleepSchedules(updatedSchedules)
      toast.success('Sleep schedule updated')
    } else {
      setSleepSchedules([...sleepSchedules, schedule])
      toast.success('Sleep schedule added')
    }
    
    setEditingSleepSchedule(null)
    setShowSleepScheduleModal(false)
    generateSleepTasks()
  }

  const updateSleepSchedule = (schedule: SleepSchedule) => {
    const existingIndex = sleepSchedules.findIndex(s => s.id === schedule.id)
    
    if (existingIndex >= 0) {
      const updatedSchedules = [...sleepSchedules]
      updatedSchedules[existingIndex] = schedule
      setSleepSchedules(updatedSchedules)
    }
    
    generateSleepTasks()
  }

  const handleDeleteSleepSchedule = (id: string) => {
    setSleepSchedules(sleepSchedules.filter(s => s.id !== id))
    setTasks(tasks.filter(task => task.sleepScheduleId !== id))
    setEditingSleepSchedule(null)
    setShowSleepScheduleModal(false)
    toast.success('Sleep schedule deleted')
  }

  // ==================== MODIFIED: Lock Timetable with Confirmation ====================
  const handleLockTimetable = () => {
    if (!hasUnsavedChanges) {
      toast.info('No changes to save')
      return
    }
    
    // Show confirmation dialog first
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

  // ==================== FIXED: prepareLockPayload with proper type mapping ====================
  const prepareLockPayload = () => {
    const apiFixedTimes: any[] = fixedTimes.map(ft => ({
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

    // FIXED: Map UI task types to API task types using the mapping function
    const apiTasks: any[] = tasks
      .filter(t => !t.isSleepTime)
      .map(task => {
        // Use the mapping function to convert UI type to API type
        const apiTaskType = mapUITypeToAPIType(task.type)

        const apiTask: any = {
          title: task.title,
          subject: task.subject,
          note: task.note,
          startTime: task.startTime,
          endTime: task.endTime,
          duration: task.duration,
          priority: task.priority,
          color: task.color,
          day: task.day,
          type: apiTaskType, // This is now properly mapped to uppercase
          category: task.category || 'ACADEMIC',
          status: task.status || 'PENDING'
        }

        if (task.goalId) {
          apiTask.goalId = task.goalId
        }
        if (task.milestoneId) {
          apiTask.milestoneId = task.milestoneId
        }
        if (task.fixedCommitmentId) {
          apiTask.fixedTimeId = task.fixedCommitmentId
        }
        if (task.completedAt) {
          apiTask.completedAt = task.completedAt
        }

        return apiTask
      })

    console.log('Prepared API Tasks with mapped types:', apiTasks.map(t => ({ title: t.title, type: t.type })))

    return {
      fixedTimes: apiFixedTimes,
      sleepSchedules: apiSleepSchedules,
      tasks: apiTasks
    }
  }
  // ==================== END FIXED ====================

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

      // Prepare the reset payload with correct structure
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
        // Clear local state
        setTasks([])
        setFixedTimes([])
        setSleepSchedules([])
        setHasUnsavedChanges(false)
        
        toast.success(data.message || `Timetable reset successfully! Deleted ${data.data.totalDeleted} items.`)
        
        // Refresh the timetable to show empty state
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

  const getTaskPool = () => {
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

  const getTasksForCell = (day: string, time: string) => {
    return tasks.filter(task => {
      if (task.day !== day) return false
      
      const taskStartMinutes = convertTimeToMinutes(task.startTime)
      const taskEndMinutes = convertTimeToMinutes(task.endTime)
      const cellMinutes = convertTimeToMinutes(time)
      
      return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
    })
  }

  const isTimeInFixedSlot = (day: string, time: string): FixedTime | null => {
    const timeInMinutes = convertTimeToMinutes(time)
    
    for (const ft of fixedTimes) {
      if (!ft.days.includes(day)) continue
      
      const startMinutes = convertTimeToMinutes(ft.startTime)
      const endMinutes = convertTimeToMinutes(ft.endTime)
      
      // Handle overnight fixed times
      if (endMinutes < startMinutes) {
        // Fixed time spans across midnight
        if (timeInMinutes >= startMinutes || timeInMinutes < endMinutes) {
          return ft
        }
      } else {
        // Normal fixed time
        if (timeInMinutes >= startMinutes && timeInMinutes < endMinutes) {
          return ft
        }
      }
    }
    return null
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
    return Math.ceil(duration / timeSettings.interval)
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

  const handleScheduleMilestone = (goal: Goal, milestone: Milestone) => {
    setSelectedGoalForMilestone(null)
    
    const day = 'MONDAY'
    const defaultTime = '10:00'
    
    const isSleepTime = tasks.some(t => 
      t.day === day && 
      t.isSleepTime && 
      convertTimeToMinutes(t.startTime) <= convertTimeToMinutes(defaultTime) && 
      convertTimeToMinutes(t.endTime) > convertTimeToMinutes(defaultTime)
    )
    
    if (isSleepTime && timeSettings.autoLockSleep) {
      toast.warning('This time conflicts with your sleep schedule. Please choose a different time or adjust your sleep schedule.')
      return
    }
    
    const task: TimeSlot = {
      id: `task-${Date.now()}`,
      title: milestone.title,
      subject: goal.subject || goal.title,
      startTime: defaultTime,
      endTime: calculateEndTime(defaultTime, 60),
      duration: 60,
      priority: goal.priority,
      color: goal.color,
      day: day,
      type: 'task',
      goalId: goal.id,
      milestoneId: milestone.id,
      status: 'PENDING'
    }

    setTasks([...tasks, task])
    toast.success(`Scheduled "${milestone.title}" for ${day.charAt(0) + day.slice(1).toLowerCase()} at ${formatTimeDisplay(defaultTime)}`)
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

  const cn = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ')
  }

  const sleepStats = getSleepStats()

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
            <Button variant="outline" onClick={() => {
              setShowTaskCreationDialog(true)
              setTaskCreationContext({ day: days[0], time: timeSlots[0] })
            }}>
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
              {days.map((day, index) => (
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
                      {day.charAt(0) + day.slice(1).toLowerCase()}
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
                {timeSlots.map((time, index) => (
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
                    {timeSlots.map((time, index) => (
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
              {days.map((day, dayIndex) => (
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
                        {day.charAt(0) + day.slice(1).toLowerCase()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {['SATURDAY', 'SUNDAY'].includes(day) ? "Weekend" : "Weekday"}
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    {timeSlots.map((time, timeIndex) => (
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
    const primaryTask = tasksInCell.find(task => 
      convertTimeToMinutes(task.startTime) === convertTimeToMinutes(time)
    ) || tasksInCell[0]
    
    const isFreePeriod = !!freePeriodInfo
    const isSleepTime = tasksInCell.some(t => t.isSleepTime)
    const sleepTask = tasksInCell.find(t => t.isSleepTime)
    
    return (
      <div
        className={cn(
          "relative border-r border-b border-gray-200 dark:border-gray-700 group transition-all duration-150",
          fixedTime && !isFreePeriod && getTimeSlotColor(fixedTime.type),
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
        {isExtendedTime(time) && !fixedTime && !primaryTask && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-[10px] text-yellow-600 dark:text-yellow-400 opacity-30">
              Extended
            </div>
          </div>
        )}

        {(time === '00:00' || time === '24:00') && !fixedTime && !primaryTask && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-[10px] text-purple-600 dark:text-purple-400 opacity-30">
              {time === '00:00' ? 'Start of Day' : 'End of Day'}
            </div>
          </div>
        )}

        {fixedTime && !isFreePeriod && !primaryTask && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center p-0.5 cursor-pointer" onClick={() => handleFixedTimeClick(fixedTime)}>
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

        {isFreePeriod && !primaryTask && !isSleepTime && (
          <div className="absolute inset-0 flex items-center justify-center p-0.5 cursor-pointer" onClick={() => handleCellClick(day, time)}>
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

        {isSleepTime && !primaryTask && sleepTask && (
          <div className="absolute inset-0 flex items-center justify-center p-0.5">
            <div className="text-[10px] font-medium text-center truncate px-0.5 text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-center gap-0.5">
                <Moon className="w-2.5 h-2.5" />
                <span>Sleep</span>
              </div>
              <div className="text-[8px] text-gray-500 dark:text-gray-400 mt-0.5">
                {Math.round(sleepTask.duration / 60)}h
              </div>
            </div>
          </div>
        )}

        {primaryTask && shouldShowTaskInCell(primaryTask, day, time) && !primaryTask.isSleepTime && (
          <TaskComponent 
            task={primaryTask} 
            day={day}
            time={time}
            cellWidth={cellWidth}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onDuplicate={handleDuplicateTask}
          />
        )}

        {sleepTask && shouldShowTaskInCell(sleepTask, day, time) && sleepTask.isSleepTime && (
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

        {tasksInCell.length > 1 && !primaryTask && !isSleepTime && (
          <div className="absolute bottom-0.5 right-0.5">
            <Badge variant="outline" className="text-[8px] px-1 py-0 dark:border-gray-600 dark:text-gray-400">
              +{tasksInCell.length - 1}
            </Badge>
          </div>
        )}

        {!isLocked && !fixedTime && !primaryTask && !isSleepTime && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80">
            <button
              className="p-1 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
              onClick={(e) => {
                e.stopPropagation()
                setTaskCreationContext({ day, time })
                setShowTaskCreationDialog(true)
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
          "absolute top-0.5 left-0.5 rounded border shadow-sm z-30 overflow-hidden cursor-pointer",
          "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all",
          sleepType.bgColor
        )}
        style={{ 
          height: `${timeSettings.cellHeight - 4}px`,
          width: `calc(${taskSpan} * ${cellWidth}px - 8px)`,
          borderLeft: `3px solid ${task.color}`,
        }}
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
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
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-gray-500 dark:text-gray-400">
                {Math.round(task.duration / 60)}h {task.duration % 60}m
              </span>
              {taskSpan > 1 && (
                <span className="text-[8px] text-gray-500 dark:text-gray-400">
                  {taskSpan}
                </span>
              )}
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
          "absolute top-0.5 left-0.5 rounded border shadow-sm z-30 overflow-hidden cursor-pointer",
          "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all",
          task.fixedCommitmentId && "border-green-300 dark:border-green-700",
          milestone && "border-purple-300 dark:border-purple-700"
        )}
        style={{ 
          height: `${timeSettings.cellHeight - 4}px`,
          width: `calc(${taskSpan} * ${cellWidth}px - 8px)`,
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
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
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
            <div className="flex items-center gap-3 mb-2">
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

        {/* ==================== MODIFIED: Lock Confirmation Dialog with improved width and scrollable height ==================== */}
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
                              {schedule.day.charAt(0) + schedule.day.slice(1).toLowerCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Icon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {formatTimeDisplay(schedule.bedtime)} - {formatTimeDisplay(schedule.wakeTime)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {Math.round(schedule.duration / 60)}h {schedule.duration % 60}m • {sleepType.label}
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
                                {ft.days.map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(', ')} • {formatTimeDisplay(ft.startTime)} - {formatTimeDisplay(ft.endTime)}
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
                                    Days: {[...new Set(ft.freePeriods.map(fp => fp.day.charAt(0) + fp.day.slice(1).toLowerCase()))].join(', ')}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
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
                      onClick={() => {
                        setShowTaskCreationDialog(true)
                        setTaskCreationContext({ day: 'MONDAY', time: '09:00' })
                      }}
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
                            onDragStart={(e) => {
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
                                onDragStart={(e) => {
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
                          onDragStart={(e) => {
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

      {/* Sleep Schedule Dialog */}
      <Dialog open={showSleepScheduleModal} onOpenChange={setShowSleepScheduleModal}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100">Sleep Schedule</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Manage your sleep schedule for each day
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="auto-lock-sleep" className="text-sm font-medium dark:text-gray-300">
                Auto-lock sleep hours
              </Label>
              <Switch
                id="auto-lock-sleep"
                checked={timeSettings.autoLockSleep}
                onCheckedChange={(checked) => setTimeSettings({...timeSettings, autoLockSleep: checked})}
              />
            </div>
            
            <div className="space-y-3">
              {days.map(day => {
                const schedule = sleepSchedules.find(s => s.day === day) || {
                  id: `temp-${day}`,
                  day,
                  bedtime: '23:00',
                  wakeTime: '07:00',
                  duration: 480,
                  isActive: true,
                  color: '#4B5563',
                  type: 'REGULAR' as const
                }
                
                return (
                  <div key={day} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium dark:text-gray-200">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
                      <Switch
                        checked={schedule.isActive}
                        onCheckedChange={(checked) => {
                          const updatedSchedule = { ...schedule, isActive: checked }
                          handleSaveSleepSchedule(updatedSchedule)
                        }}
                      />
                    </div>
                    
                    {schedule.isActive && (
                      <>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <Label className="text-xs dark:text-gray-400">Bedtime</Label>
                            <Input
                              type="time"
                              value={schedule.bedtime}
                              onChange={(e) => {
                                const updatedSchedule = { 
                                  ...schedule, 
                                  bedtime: e.target.value,
                                  duration: calculateDuration(e.target.value, schedule.wakeTime)
                                }
                                handleSaveSleepSchedule(updatedSchedule)
                              }}
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                            />
                          </div>
                          <div>
                            <Label className="text-xs dark:text-gray-400">Wake Time</Label>
                            <Input
                              type="time"
                              value={schedule.wakeTime}
                              onChange={(e) => {
                                const updatedSchedule = { 
                                  ...schedule, 
                                  wakeTime: e.target.value,
                                  duration: calculateDuration(schedule.bedtime, e.target.value)
                                }
                                handleSaveSleepSchedule(updatedSchedule)
                              }}
                              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                            />
                          </div>
                        </div>
                        
                        <div className="mb-2">
                          <Label className="text-xs dark:text-gray-400">Type</Label>
                          <Select
                            value={schedule.type}
                            onValueChange={(value: any) => {
                              const updatedSchedule = { ...schedule, type: value }
                              handleSaveSleepSchedule(updatedSchedule)
                            }}
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
                            value={schedule.notes || ''}
                            onChange={(e) => {
                              const updatedSchedule = { ...schedule, notes: e.target.value }
                              handleSaveSleepSchedule(updatedSchedule)
                            }}
                            placeholder="Add notes..."
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                          />
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Duration: {Math.floor(schedule.duration / 60)}h {schedule.duration % 60}m
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={() => setShowSleepScheduleModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Creation Dialog with Options */}
      <Dialog open={showTaskCreationDialog} onOpenChange={(open) => {
        setShowTaskCreationDialog(open)
        if (!open) {
          setTaskCreationContext(null)
          resetTaskForm()
        }
      }}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">
              Add Task to {taskCreationContext?.day.charAt(0) + taskCreationContext?.day.slice(1).toLowerCase()} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Choose how you want to add this task
            </DialogDescription>
          </DialogHeader>
          
          {taskCreationFlow === 'simple' ? (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Time Slot:</span> {taskCreationContext?.day.charAt(0) + taskCreationContext?.day.slice(1).toLowerCase()} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Task will be scheduled starting at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
                </p>
              </div>
              
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
                      <SelectItem value={timeSettings.interval.toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval} minutes</SelectItem>
                      <SelectItem value={(timeSettings.interval * 2).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 2} minutes</SelectItem>
                      <SelectItem value={(timeSettings.interval * 3).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 3} minutes</SelectItem>
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
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTaskCreationFlow('withGoal')
                    if (taskCreationContext) {
                      setNewTask({
                        ...newTask,
                        day: taskCreationContext.day,
                        startTime: taskCreationContext.time,
                        duration: timeSettings.interval
                      })
                    }
                  }}
                  className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Link to Goal
                </Button>
                <Button
                  onClick={() => handleAddTaskToCell('simple')}
                  className="flex-1"
                  disabled={!newTask.title.trim()}
                >
                  Add Task
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Time Slot:</span> {taskCreationContext?.day.charAt(0) + taskCreationContext?.day.slice(1).toLowerCase()} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Link this task to a goal or milestone to track progress
                </p>
              </div>
              
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
                      <SelectItem value={timeSettings.interval.toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval} minutes</SelectItem>
                      <SelectItem value={(timeSettings.interval * 2).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 2} minutes</SelectItem>
                      <SelectItem value={(timeSettings.interval * 3).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 3} minutes</SelectItem>
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
                <Button
                  variant="outline"
                  onClick={() => setTaskCreationFlow('simple')}
                  className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Simple Task
                </Button>
                <Button
                  onClick={() => handleAddTaskToCell('withGoal')}
                  className="flex-1"
                  disabled={!newTask.title.trim()}
                >
                  {newTask.goalId && newTask.goalId !== 'no-goal' ? 'Add Task with Goal' : 'Add Task'}
                </Button>
              </div>
            </div>
          )}
          
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
              Schedule tasks from your goals directly into your timetable
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
                        const task: TimeSlot = {
                          id: `task-${Date.now()}`,
                          title: goal.title,
                          subject: goal.subject || goal.title,
                          startTime: '10:00',
                          endTime: '11:00',
                          duration: 60,
                          priority: goal.priority,
                          color: goal.color,
                          day: 'MONDAY',
                          type: 'task',
                          goalId: goal.id,
                          status: 'PENDING'
                        }
                        setTasks([...tasks, task])
                        toast.success(`Scheduled "${goal.title}" for Monday at 10:00 AM`)
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
              const newTasks: TimeSlot[] = []
              goals.forEach(goal => {
                goal.milestones.forEach(milestone => {
                  if (!milestone.completed && !tasks.some(t => t.milestoneId === milestone.id)) {
                    const task: TimeSlot = {
                      id: `task-${Date.now()}`,
                      title: milestone.title,
                      subject: goal.subject || goal.title,
                      startTime: '10:00',
                      endTime: '11:00',
                      duration: 60,
                      priority: goal.priority,
                      color: goal.color,
                      day: 'MONDAY',
                      type: 'task',
                      goalId: goal.id,
                      milestoneId: milestone.id,
                      status: 'PENDING'
                    }
                    newTasks.push(task)
                  }
                })
              })
              
              if (newTasks.length > 0) {
                setTasks([...tasks, ...newTasks])
                toast.success(`Scheduled ${newTasks.length} milestones for Monday at 10:00 AM`)
              } else {
                toast.info('All milestones are already scheduled or completed!')
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
                  Click on a milestone to schedule it. It will be added to your timetable for Monday at 10:00 AM by default.
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
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Title *</label>
              <Input
                placeholder="e.g., College Hours, Office Time, Gym Session"
                value={newFixedTime.title}
                onChange={(e) => setNewFixedTime({...newFixedTime, title: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Description (Optional)</label>
              <Textarea
                placeholder="Brief description of this commitment"
                value={newFixedTime.description}
                onChange={(e) => setNewFixedTime({...newFixedTime, description: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time *</label>
                <Input
                  type="time"
                  value={newFixedTime.startTime}
                  onChange={(e) => setNewFixedTime({...newFixedTime, startTime: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">End Time *</label>
                <Input
                  type="time"
                  value={newFixedTime.endTime}
                  onChange={(e) => setNewFixedTime({...newFixedTime, endTime: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block dark:text-gray-300">Type *</label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                {FIXED_TIME_TYPES.filter(t => t.id !== 'SLEEP').map((type) => {
                  const Icon = type.icon
                  const isSelected = newFixedTime.type === type.id
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setNewFixedTime({...newFixedTime, type: type.id as FixedTime['type'], color: type.color})}
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
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const currentDays = newFixedTime.days
                      const newDays = currentDays.includes(day)
                        ? currentDays.filter(d => d !== day)
                        : [...currentDays, day]
                      setNewFixedTime({...newFixedTime, days: newDays})
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                      newFixedTime.days.includes(day)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                  >
                    {day.charAt(0) + day.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

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
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Title *</label>
                <Input
                  placeholder="e.g., College Hours, Office Time, Gym Session"
                  value={editingFixedTime.title}
                  onChange={(e) => setEditingFixedTime({...editingFixedTime, title: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Description (Optional)</label>
                <Textarea
                  placeholder="Brief description of this commitment"
                  value={editingFixedTime.description || ''}
                  onChange={(e) => setEditingFixedTime({...editingFixedTime, description: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time *</label>
                  <Input
                    type="time"
                    value={editingFixedTime.startTime}
                    onChange={(e) => setEditingFixedTime({...editingFixedTime, startTime: e.target.value})}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block dark:text-gray-300">End Time *</label>
                  <Input
                    type="time"
                    value={editingFixedTime.endTime}
                    onChange={(e) => setEditingFixedTime({...editingFixedTime, endTime: e.target.value})}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Type *</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                  {FIXED_TIME_TYPES.filter(t => t.id !== 'SLEEP').map((type) => {
                    const Icon = type.icon
                    const isSelected = editingFixedTime.type === type.id
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setEditingFixedTime({
                            ...editingFixedTime,
                            type: type.id as FixedTime['type'],
                            color: type.color
                          })
                        }}
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
                  {days.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const currentDays = editingFixedTime.days
                        const newDays = currentDays.includes(day)
                          ? currentDays.filter(d => d !== day)
                          : [...currentDays, day]
                        setEditingFixedTime({...editingFixedTime, days: newDays})
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                        editingFixedTime.days.includes(day)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      )}
                    >
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-medium text-yellow-700 dark:text-yellow-300">Note</span>
                </div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  You can edit fixed commitment details here. To add/remove free periods, 
                  use the "Add Free Period" button in the commitment details view.
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
                      {day.charAt(0) + day.slice(1).toLowerCase()}
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
                This free period will only apply to {newFreePeriod.day.charAt(0) + newFreePeriod.day.slice(1).toLowerCase()}. 
                You can add different free periods for different days within the same fixed commitment.
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
              Add Free Period for {newFreePeriod.day.charAt(0) + newFreePeriod.day.slice(1).toLowerCase()}
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
                      Display sleep schedule in timetable
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
                    <div className="font-medium dark:text-gray-300">Auto-Lock Sleep Hours</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Prevent scheduling tasks during sleep time
                    </div>
                  </div>
                  <Switch
                    checked={timeSettings.autoLockSleep}
                    onCheckedChange={(checked) => setTimeSettings({
                      ...timeSettings,
                      autoLockSleep: checked
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
      <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {editingTask ? 'Update task details' : 'Create a task to add to your timetable'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
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
                    {days.map(day => (
                      <SelectItem key={day} value={day} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {day.charAt(0) + day.slice(1).toLowerCase()}
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
            <Button onClick={() => {
              if (editingTask) {
                const updatedTask = {
                  ...editingTask,
                  ...newTask,
                  endTime: calculateEndTime(newTask.startTime, newTask.duration)
                }
                setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
                setEditingTask(null)
                setShowAddTaskModal(false)
                resetTaskForm()
                toast.success('Task updated')
              } else {
                handleAddTask()
              }
            }}>
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fixed Commitment Details Modal */}
      {selectedFixedTime && (
        <Dialog open={!!selectedFixedTime} onOpenChange={() => setSelectedFixedTime(null)}>
          <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800">
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
                    {selectedFixedTime.days.map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(', ')} • {formatTimeDisplay(selectedFixedTime.startTime)} - {formatTimeDisplay(selectedFixedTime.endTime)}
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
                              {day.charAt(0) + day.slice(1).toLowerCase()}
                            </h5>
                            <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">
                              {dayFreePeriods.length} period{dayFreePeriods.length > 1 ? 's' : ''}
                            </Badge>
                          </div>
                          {dayFreePeriods.map((fp, index) => (
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
                                {task.day.charAt(0) + task.day.slice(1).toLowerCase()} • {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
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

