// // src/app/dashboard/timetable/builder/page.tsx
// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { 
//   Calendar, 
//   Clock, 
//   Plus, 
//   Save, 
//   Lock, 
//   Unlock,
//   Grid,
//   List,
//   Zap,
//   Download,
//   Share2,
//   Target,
//   Book,
//   Briefcase,
//   GraduationCap,
//   Home,
//   AlertCircle,
//   X,
//   Settings,
//   Bell,
//   RefreshCw,
//   Columns,
//   Rows,
//   Coffee,
//   Wind,
//   Maximize2,
//   Eye,
//   EyeOff,
//   FileText,
//   Printer,
//   Image as ImageIcon,
//   ChevronLeft,
//   ChevronRight,
//   GripVertical,
//   MoreVertical,
//   Trash2,
//   Edit2,
//   Copy,
//   ChevronUp,
//   ChevronDown,
//   PlusCircle,
//   MinusCircle,
//   Users,
//   Building,
//   Car,
//   Dumbbell,
//   Utensils,
//   Heart,
//   Music,
//   Gamepad2,
//   Moon,
//   Sun,
//   CheckCircle2,
//   TrendingUp,
//   Award,
//   Trophy,
//   Flame,
//   Star,
//   School,
//   User,
//   ArrowRight,
//   ArrowLeft,
//   Bed,
//   AlarmClock,
//   MoonStar,
//   Sunrise,
//   Sunset,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   AlertTriangle
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Badge } from '@/components/ui/badge'
// import { Card, CardContent } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { 
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Switch } from '@/components/ui/switch'
// import { Label } from '@/components/ui/label'
// import { Slider } from '@/components/ui/slider'
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu'
// import { toast } from 'sonner'
// import { Progress } from '@/components/ui/progress'

// // Types
// interface TimeSlot {
//   id: string
//   title: string
//   subject: string
//   startTime: string
//   endTime: string
//   duration: number // in minutes
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   color: string
//   isCompleted?: boolean
//   day: string
//   type: 'task' | 'fixed' | 'break' | 'commute' | 'free' | 'class' | 'study' | 'health' | 'project' | 'meeting' | 'workout' | 'meal' | 'entertainment' | 'sleep'
//   isFreePeriod?: boolean
//   span?: number // Number of columns this task spans
//   fixedCommitmentId?: string // Link to fixed commitment if task is inside free period
//   goalId?: string // Link to goal
//   milestoneId?: string // Link to milestone within goal
//   isSleepTime?: boolean // Flag to identify sleep time blocks
//   sleepScheduleId?: string // Link to sleep schedule
//   category?: string
//   note?: string
//   status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
//   completedAt?: string
//   fixedTimeId?: string | null
// }

// interface SleepSchedule {
//   id: string
//   day: string // 'MONDAY', 'TUESDAY', etc.
//   bedtime: string // Time to go to sleep (e.g., "22:00")
//   wakeTime: string // Time to wake up (e.g., "06:00")
//   duration: number // Total sleep duration in minutes
//   isActive: boolean // Whether sleep schedule is enabled for this day
//   color: string // Color for sleep block
//   type: 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE'
//   notes?: string
// }

// interface Milestone {
//   id: string
//   title: string
//   description: string
//   completed: boolean
//   targetDate: Date
//   progress: number
//   scheduledHours: number
//   completedHours: number
// }

// interface Goal {
//   id: string
//   title: string
//   description: string
//   category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE'
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   type: 'SHORT_TERM' | 'LONG_TERM'
//   targetDate: Date
//   createdAt: Date
//   status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
//   progress: number // 0-100
//   totalHours: number
//   completedHours: number
//   milestones: Milestone[]
//   color: string
//   tags: string[]
//   isPublic: boolean
//   weeklyTarget: number // hours per week
//   streak: number // current streak in days
//   lastUpdated: Date
//   subject: string
//   tasks: string[] // task IDs
// }

// interface FixedTime {
//   id: string // Temporary client ID
//   title: string
//   description?: string
//   days: string[] // ['MONDAY', 'TUESDAY', ...]
//   startTime: string
//   endTime: string
//   type: 'COLLEGE' | 'OFFICE' | 'SCHOOL' | 'COMMUTE' | 'FREE' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'FAMILY' | 'OTHER' | 'SLEEP'
//   color?: string
//   isFreePeriod?: boolean // Only for free periods within fixed commitments
//   isEditable?: boolean // Only free periods can be edited for task scheduling
//   icon?: string
//   freePeriods?: { // Free periods within the fixed commitment - NOW DAY-SPECIFIC
//     id: string
//     title: string
//     startTime: string
//     endTime: string
//     duration: number
//     day: string // Added: Specific day for this free period
//   }[]
//   serverId?: string // Actual server UUID after creation
// }

// interface TimeSettings {
//   startHour: number // 0-23
//   endHour: number // 0-23
//   interval: number // minutes (15, 30, 60)
//   displayMode: 'vertical' | 'horizontal' // vertical: weekdays as columns, horizontal: weekdays as rows
//   cellHeight: number // Height of each time cell in pixels
//   showWeekends: boolean
//   compactMode: boolean
//   extendedHours: {
//     morning: boolean
//     evening: boolean
//     night: boolean
//     custom: string[] // custom time slots
//   }
//   showSleepBlocks: boolean // Whether to display sleep time blocks
//   autoLockSleep: boolean // Automatically lock sleep hours from scheduling
// }

// interface ApiTask {
//   title: string
//   subject: string
//   note?: string
//   startTime: string
//   endTime: string
//   duration: number
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   color?: string
//   day: string
//   type: 'STUDY' | 'CLASS' | 'PROJECT' | 'HEALTH' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP' | 'OTHER'
//   category?: 'ACADEMIC' | 'PROFESSIONAL' | 'PERSONAL' | 'HEALTH' | 'OTHER'
//   goalId?: string | null
//   milestoneId?: string | null
//   fixedTimeId?: string | null
//   status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
//   completedAt?: string | null
// }

// interface ApiFixedTime {
//   title: string
//   description?: string
//   days: string[]
//   startTime: string
//   endTime: string
//   type: 'COLLEGE' | 'OFFICE' | 'SCHOOL' | 'COMMUTE' | 'FREE' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'FAMILY' | 'OTHER' | 'SLEEP'
//   color?: string
//   isEditable?: boolean
//   freePeriods?: {
//     title: string
//     startTime: string
//     endTime: string
//     day: string
//   }[]
// }

// interface ApiSleepSchedule {
//   day: string
//   bedtime: string
//   wakeTime: string
//   isActive: boolean
//   type: 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE'
//   notes?: string
//   color?: string
//   duration?: number
// }

// interface LockProgress {
//   step: string
//   status: 'pending' | 'in-progress' | 'completed' | 'failed'
//   message?: string
//   error?: string
// }

// interface FullTimeTableSlot {
//   startTime: string
//   endTime: string
//   type: 'FIXED' | 'SLEEP' | 'TASK' | 'OTHER'
//   title: string
//   description?: string | null
//   fixedTimeId?: string
//   sleepScheduleId?: string
//   taskId?: string
// }

// interface FullTimeTableResponse {
//   day: string
//   slots: FullTimeTableSlot[]
// }

// interface LockApiResponse {
//   success: boolean
//   message: string
//   data: {
//     fixedTimesCreated: number
//     sleepSchedulesCreated: number
//     tasksCreated: number
//     totalItems: number
//   }
// }

// // Fixed Time Types with Icons
// const FIXED_TIME_TYPES = [
//   { id: 'COLLEGE', label: 'College/Class', icon: GraduationCap, color: '#EF4444' },
//   { id: 'OFFICE', label: 'Office/Work', icon: Briefcase, color: '#3B82F6' },
//   { id: 'SCHOOL', label: 'School', icon: Book, color: '#8B5CF6' },
//   { id: 'COMMUTE', label: 'Commute', icon: Car, color: '#F59E0B' },
//   { id: 'MEETING', label: 'Meeting', icon: Users, color: '#10B981' },
//   { id: 'WORKOUT', label: 'Workout/Gym', icon: Dumbbell, color: '#EC4899' },
//   { id: 'MEAL', label: 'Meal/Break', icon: Utensils, color: '#F97316' },
//   { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Gamepad2, color: '#8B5CF6' },
//   { id: 'FREE', label: 'Free Period', icon: Coffee, color: '#10B981' },
//   { id: 'FAMILY', label: 'Family Time', icon: Home, color: '#F59E0B' },
//   { id: 'HEALTH', label: 'Health/Self-care', icon: Heart, color: '#EC4899' },
//   { id: 'SLEEP', label: 'Sleep/Rest', icon: Moon, color: '#4B5563' },
//   { id: 'OTHER', label: 'Other', icon: Clock, color: '#6B7280' }
// ]

// // Sleep Types with Icons
// const SLEEP_TYPES = [
//   { id: 'REGULAR', label: 'Regular Sleep', icon: Moon, color: '#4B5563', bgColor: 'bg-gray-100 dark:bg-gray-800' },
//   { id: 'POWER_NAP', label: 'Power Nap', icon: AlarmClock, color: '#8B5CF6', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
//   { id: 'RECOVERY', label: 'Recovery Sleep', icon: Heart, color: '#EC4899', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
//   { id: 'EARLY', label: 'Early Bird', icon: Sunrise, color: '#F59E0B', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
//   { id: 'LATE', label: 'Night Owl', icon: MoonStar, color: '#3B82F6', bgColor: 'bg-blue-100 dark:bg-blue-900/30' }
// ]

// // Goal Categories with Icons
// const GOAL_CATEGORIES = [
//   { id: 'ACADEMIC', label: 'Academic', icon: School, color: '#3B82F6', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
//   { id: 'PROFESSIONAL', label: 'Professional', icon: Briefcase, color: '#10B981', bgColor: 'bg-green-50 dark:bg-green-900/20' },
//   { id: 'HEALTH', label: 'Health & Fitness', icon: Heart, color: '#EF4444', bgColor: 'bg-red-50 dark:bg-red-900/20' },
//   { id: 'PERSONAL', label: 'Personal', icon: User, color: '#8B5CF6', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
//   { id: 'SKILL', label: 'Skill Development', icon: Award, color: '#F59E0B', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
//   { id: 'FINANCIAL', label: 'Financial', icon: TrendingUp, color: '#6366F1', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
//   { id: 'SOCIAL', label: 'Social', icon: Users, color: '#EC4899', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
//   { id: 'CREATIVE', label: 'Creative', icon: Music, color: '#F97316', bgColor: 'bg-orange-50 dark:bg-orange-900/20' }
// ]

// // Task Types for API
// const TASK_TYPES = [
//   { id: 'STUDY', label: 'Study', icon: Book },
//   { id: 'CLASS', label: 'Class', icon: GraduationCap },
//   { id: 'PROJECT', label: 'Project', icon: Target },
//   { id: 'HEALTH', label: 'Health', icon: Heart },
//   { id: 'MEETING', label: 'Meeting', icon: Users },
//   { id: 'WORKOUT', label: 'Workout', icon: Dumbbell },
//   { id: 'MEAL', label: 'Meal', icon: Utensils },
//   { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Gamepad2 },
//   { id: 'SLEEP', label: 'Sleep', icon: Moon },
//   { id: 'OTHER', label: 'Other', icon: Clock }
// ]

// const API_BASE_URL = 'http://localhost:8181/v0/api'

// export default function TimetableBuilderClient() {
//   const [viewMode, setViewMode] = useState<'grid' | 'list' | 'pdf'>('grid')
//   const [isLocked, setIsLocked] = useState(false)
//   const [darkMode, setDarkMode] = useState(false)
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [tasks, setTasks] = useState<TimeSlot[]>([])
//   const [sleepSchedules, setSleepSchedules] = useState<SleepSchedule[]>([])
//   const [goals, setGoals] = useState<Goal[]>([])
//   const [fixedTimes, setFixedTimes] = useState<FixedTime[]>([])
  
//   // Lock progress states
//   const [showLockProgress, setShowLockProgress] = useState(false)
//   const [lockProgress, setLockProgress] = useState<LockProgress[]>([
//     { step: 'Saving Timetable', status: 'pending' }
//   ])
//   const [isLocking, setIsLocking] = useState(false)
//   const [lockSuccess, setLockSuccess] = useState(false)
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
//   const [showResetConfirm, setShowResetConfirm] = useState(false)

//   const [userType, setUserType] = useState<'student' | 'professional' | 'jobseeker' | 'other'>('student')
//   const [showSetupModal, setShowSetupModal] = useState(false)
//   const [showEditFixedTimeModal, setShowEditFixedTimeModal] = useState(false)
//   const [showAddFixedTimeModal, setShowAddFixedTimeModal] = useState(false)
//   const [editingFixedTime, setEditingFixedTime] = useState<FixedTime | null>(null)
//   const [showAddTaskModal, setShowAddTaskModal] = useState(false)
//   const [showTimeSettingsModal, setShowTimeSettingsModal] = useState(false)
//   const [showCellTaskModal, setShowCellTaskModal] = useState(false)
//   const [showTimeExtensionModal, setShowTimeExtensionModal] = useState(false)
//   const [showAddFreePeriodModal, setShowAddFreePeriodModal] = useState(false)
//   const [showSleepScheduleModal, setShowSleepScheduleModal] = useState(false)
//   const [selectedFixedTimeForFreePeriod, setSelectedFixedTimeForFreePeriod] = useState<FixedTime | null>(null)
//   const [selectedCell, setSelectedCell] = useState<{day: string, time: string} | null>(null)
//   const [editingTask, setEditingTask] = useState<TimeSlot | null>(null)
//   const [selectedFixedTime, setSelectedFixedTime] = useState<FixedTime | null>(null)
//   const [showGoalsModal, setShowGoalsModal] = useState(false)
//   const [selectedGoalForMilestone, setSelectedGoalForMilestone] = useState<Goal | null>(null)
//   const [editingSleepSchedule, setEditingSleepSchedule] = useState<SleepSchedule | null>(null)
  
//   // New state for task creation flow
//   const [taskCreationFlow, setTaskCreationFlow] = useState<'simple' | 'withGoal'>('simple')
//   const [showTaskCreationDialog, setShowTaskCreationDialog] = useState(false)
//   const [taskCreationContext, setTaskCreationContext] = useState<{day: string, time: string} | null>(null)
  
//   // New state for adding free period - includes specific day
//   const [newFreePeriod, setNewFreePeriod] = useState({
//     title: 'Free Period',
//     startTime: '14:00',
//     endTime: '15:00',
//     duration: 60,
//     day: 'MONDAY'
//   })

//   const [newTask, setNewTask] = useState({
//     title: '',
//     subject: '',
//     note: '',
//     duration: 60,
//     priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
//     color: '#3B82F6',
//     day: 'MONDAY',
//     startTime: '09:00',
//     goalId: '',
//     milestoneId: '',
//     type: 'STUDY' as 'STUDY' | 'CLASS' | 'PROJECT' | 'HEALTH' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP' | 'OTHER',
//     category: 'ACADEMIC' as 'ACADEMIC' | 'PROFESSIONAL' | 'PERSONAL' | 'HEALTH' | 'OTHER'
//   })

//   const [newFixedTime, setNewFixedTime] = useState({
//     title: '',
//     description: '',
//     days: [] as string[],
//     startTime: '09:00',
//     endTime: '17:00',
//     type: 'OTHER' as FixedTime['type'],
//     color: '#6B7280',
//     isEditable: true,
//     freePeriods: [] as {id: string, title: string, startTime: string, endTime: string, duration: number, day: string}[]
//   })

//   // Time settings state
//   const [timeSettings, setTimeSettings] = useState<TimeSettings>({
//     startHour: 8,
//     endHour: 18,
//     interval: 60,
//     displayMode: 'horizontal',
//     cellHeight: 80,
//     showWeekends: true,
//     compactMode: false,
//     extendedHours: {
//       morning: false,
//       evening: false,
//       night: false,
//       custom: []
//     },
//     showSleepBlocks: true,
//     autoLockSleep: true
//   })

//   // Get auth token from localStorage
//   const getAuthToken = (): string => {
//     const token = localStorage.getItem('access_token')
//     return token ? `Bearer ${token}` : ''
//   }

//   // Load initial data from API on mount
//   useEffect(() => {
//     fetchFullTimeTable()
//     fetchGoals()
//   }, [])

//   // Check for system dark mode preference
//   useEffect(() => {
//     const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
//     setDarkMode(isDarkMode)
    
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }, [])

//   // Generate sleep time tasks from schedules
//   useEffect(() => {
//     if (timeSettings.showSleepBlocks) {
//       generateSleepTasks()
//     } else {
//       setTasks(tasks.filter(task => !task.isSleepTime))
//     }
//   }, [sleepSchedules, timeSettings.showSleepBlocks])

//   // Track unsaved changes
//   useEffect(() => {
//     setHasUnsavedChanges(tasks.length > 0 || fixedTimes.length > 0 || sleepSchedules.length > 0)
//   }, [tasks, fixedTimes, sleepSchedules])

//   // Fetch full timetable
//   const fetchFullTimeTable = async () => {
//     try {
//       const token = getAuthToken()
//       if (!token) {
//         toast.error('Please login to view timetable')
//         return
//       }

//       const response = await fetch(`${API_BASE_URL}/time-table/full`, {
//         headers: {
//           'Authorization': token
//         }
//       })
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch timetable')
//       }
      
//       const data = await response.json()
      
//       if (data.success && data.data) {
//         // Convert API response to local state
//         const apiData: FullTimeTableResponse[] = data.data
        
//         // Extract fixed times
//         const fixedTimesMap = new Map<string, FixedTime>()
//         const sleepSchedulesMap = new Map<string, SleepSchedule>()
        
//         apiData.forEach(dayData => {
//           dayData.slots.forEach(slot => {
//             if (slot.type === 'FIXED' && slot.fixedTimeId && !fixedTimesMap.has(slot.fixedTimeId)) {
//               fixedTimesMap.set(slot.fixedTimeId, {
//                 id: `fixed-${Date.now()}-${Math.random()}`, // Generate temporary client ID
//                 serverId: slot.fixedTimeId,
//                 title: slot.title,
//                 description: slot.description || undefined,
//                 days: [dayData.day],
//                 startTime: slot.startTime,
//                 endTime: slot.endTime,
//                 type: slot.title.includes('College') ? 'COLLEGE' : 
//                       slot.title.includes('Gym') ? 'WORKOUT' : 'OTHER',
//                 color: slot.title.includes('College') ? '#3B82F6' : '#EF4444',
//                 isEditable: true,
//                 freePeriods: []
//               })
//             }
            
//             if (slot.type === 'SLEEP' && slot.sleepScheduleId && !sleepSchedulesMap.has(slot.sleepScheduleId)) {
//               const type = slot.title.includes('LATE') ? 'LATE' : 
//                           slot.title.includes('POWER') ? 'POWER_NAP' : 'REGULAR'
//               sleepSchedulesMap.set(slot.sleepScheduleId, {
//                 id: slot.sleepScheduleId,
//                 day: dayData.day,
//                 bedtime: slot.startTime,
//                 wakeTime: slot.endTime,
//                 duration: calculateDuration(slot.startTime, slot.endTime),
//                 isActive: true,
//                 color: '#4B5563',
//                 type: type as any,
//                 notes: slot.description || undefined
//               })
//             }
//           })
//         })
        
//         setFixedTimes(Array.from(fixedTimesMap.values()))
//         setSleepSchedules(Array.from(sleepSchedulesMap.values()))
//       }
//     } catch (error) {
//       console.error('Error fetching timetable:', error)
//       toast.error('Failed to load timetable data')
//     }
//   }

//   // Fetch goals
//   const fetchGoals = async () => {
//     try {
//       const token = getAuthToken()
//       if (!token) return

//       const response = await fetch(`${API_BASE_URL}/goals`, {
//         headers: {
//           'Authorization': token
//         }
//       })
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch goals')
//       }
      
//       const data = await response.json()
      
//       if (data.success && data.data?.goals) {
//         setGoals(data.data.goals)
//       }
//     } catch (error) {
//       console.error('Error fetching goals:', error)
//       toast.error('Failed to load goals')
//     }
//   }

//   const calculateDuration = (startTime: string, endTime: string): number => {
//     const start = convertTimeToMinutes(startTime)
//     const end = convertTimeToMinutes(endTime)
//     return end >= start ? end - start : (24 * 60 - start) + end
//   }

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode)
//     if (!darkMode) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }

//   const days = timeSettings.showWeekends 
//     ? ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
//     : ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
  
//   // Generate time slots based on settings with extensions
//   const generateTimeSlots = () => {
//     let slots: string[] = []
//     let actualStartHour = timeSettings.startHour
//     let actualEndHour = timeSettings.endHour

//     if (timeSettings.extendedHours.morning) {
//       actualStartHour = Math.min(actualStartHour, 5)
//     }

//     if (timeSettings.extendedHours.evening) {
//       actualEndHour = Math.max(actualEndHour, 22)
//     }

//     if (timeSettings.extendedHours.night) {
//       actualEndHour = Math.max(actualEndHour, 23)
//     }

//     const customSlots = timeSettings.extendedHours.custom
    
//     const totalMinutes = (actualEndHour - actualStartHour) * 60
//     for (let i = 0; i <= totalMinutes; i += timeSettings.interval) {
//       const hour = Math.floor(i / 60) + actualStartHour
//       const minute = i % 60
//       const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
//       if (hour < 24) {
//         slots.push(timeStr)
//       }
//     }

//     const allSlots = [...slots, ...customSlots]
//       .filter((slot, index, self) => self.indexOf(slot) === index)
//       .sort((a, b) => {
//         const [aHours, aMins] = a.split(':').map(Number)
//         const [bHours, bMins] = b.split(':').map(Number)
//         return (aHours * 60 + aMins) - (bHours * 60 + bMins)
//       })

//     return allSlots
//   }

//   const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots())

//   useEffect(() => {
//     setTimeSlots(generateTimeSlots())
//   }, [timeSettings])

//   const formatTimeDisplay = (time: string): string => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const period = hours >= 12 ? 'PM' : 'AM'
//     const displayHours = hours % 12 || 12
//     return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
//   }

//   const convertTimeToMinutes = (time: string): number => {
//     const [hours, minutes] = time.split(':').map(Number)
//     return hours * 60 + minutes
//   }

//   const calculateTaskSpan = (task: TimeSlot): number => {
//     if (task.span) return task.span
    
//     const startMinutes = convertTimeToMinutes(task.startTime)
//     const endMinutes = convertTimeToMinutes(task.endTime)
//     const duration = endMinutes - startMinutes
//     return Math.max(1, Math.ceil(duration / timeSettings.interval))
//   }

//   const calculateEndTime = (startTime: string, duration: number): string => {
//     const [hours, minutes] = startTime.split(':').map(Number)
//     const totalMinutes = hours * 60 + minutes + duration
//     const endHours = Math.floor(totalMinutes / 60)
//     const endMinutes = totalMinutes % 60
//     return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
//   }

//   const getScheduledHoursByGoal = () => {
//     const goalHours: Record<string, number> = {}
    
//     tasks.forEach(task => {
//       if (task.goalId && !task.isSleepTime) {
//         if (!goalHours[task.goalId]) {
//           goalHours[task.goalId] = 0
//         }
//         goalHours[task.goalId] += task.duration / 60
//       }
//     })
    
//     return goalHours
//   }

//   const getSleepStats = () => {
//     const activeSchedules = sleepSchedules.filter(s => s.isActive)
//     const totalSleepHours = activeSchedules.reduce((sum, s) => sum + (s.duration / 60), 0)
//     const avgSleepHours = activeSchedules.length > 0 ? totalSleepHours / activeSchedules.length : 0
    
//     return {
//       totalSleepHours,
//       avgSleepHours,
//       daysWithSleep: activeSchedules.length,
//       recommendedHours: 8
//     }
//   }

//   // Update goal completion based on scheduled tasks
//   useEffect(() => {
//     const scheduledHoursByGoal = getScheduledHoursByGoal()
    
//     const updatedGoals = goals.map(goal => {
//       const completedHours = scheduledHoursByGoal[goal.id] || 0
      
//       const updatedMilestones = goal.milestones.map(milestone => {
//         const milestoneTasks = tasks.filter(task => 
//           task.goalId === goal.id && task.milestoneId === milestone.id
//         )
//         const milestoneHours = milestoneTasks.reduce((sum, task) => sum + (task.duration / 60), 0)
        
//         return {
//           ...milestone,
//           completedHours: milestoneHours,
//           progress: milestoneHours > 0 ? Math.min(100, (milestoneHours / milestone.scheduledHours) * 100) : milestone.progress,
//           completed: milestoneHours >= milestone.scheduledHours
//         }
//       })

//       const totalMilestoneHours = updatedMilestones.reduce((sum, m) => sum + m.scheduledHours, 0)
//       const completedMilestoneHours = updatedMilestones.reduce((sum, m) => sum + m.completedHours, 0)
//       const milestoneProgress = totalMilestoneHours > 0 ? (completedMilestoneHours / totalMilestoneHours) * 100 : 0
      
//       const timeProgress = goal.totalHours > 0 ? (completedHours / goal.totalHours) * 100 : 0
      
//       const totalProgress = Math.min(100, milestoneProgress * 0.7 + timeProgress * 0.3)
      
//       const today = new Date().toDateString()
//       const lastUpdated = new Date(goal.lastUpdated).toDateString()
//       const newStreak = today === lastUpdated ? goal.streak : goal.streak + 1
      
//       return {
//         ...goal,
//         completedHours,
//         progress: Math.round(totalProgress),
//         milestones: updatedMilestones,
//         status: totalProgress >= 100 ? 'COMPLETED' : totalProgress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
//         streak: newStreak,
//         lastUpdated: new Date()
//       }
//     })
    
//     setGoals(updatedGoals)
//   }, [tasks])

//   // Generate sleep tasks from schedules
//   const generateSleepTasks = () => {
//     const sleepTasks: TimeSlot[] = []
    
//     sleepSchedules.forEach(schedule => {
//       if (!schedule.isActive) return
      
//       const bedtimeMinutes = convertTimeToMinutes(schedule.bedtime)
//       const wakeTimeMinutes = convertTimeToMinutes(schedule.wakeTime)
      
//       if (wakeTimeMinutes < bedtimeMinutes) {
//         const midnight = convertTimeToMinutes('24:00')
//         const firstDayDuration = midnight - bedtimeMinutes
        
//         sleepTasks.push({
//           id: `sleep-${schedule.id}-part1`,
//           title: schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
//           subject: 'Rest',
//           startTime: schedule.bedtime,
//           endTime: '24:00',
//           duration: firstDayDuration,
//           priority: 'MEDIUM',
//           color: schedule.color || '#4B5563',
//           day: schedule.day,
//           type: 'sleep',
//           isSleepTime: true,
//           sleepScheduleId: schedule.id,
//           isCompleted: false
//         })
        
//         const nextDayIndex = (days.indexOf(schedule.day) + 1) % days.length
//         const nextDay = days[nextDayIndex]
        
//         sleepTasks.push({
//           id: `sleep-${schedule.id}-part2`,
//           title: schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
//           subject: 'Rest',
//           startTime: '00:00',
//           endTime: schedule.wakeTime,
//           duration: wakeTimeMinutes,
//           priority: 'MEDIUM',
//           color: schedule.color || '#4B5563',
//           day: nextDay,
//           type: 'sleep',
//           isSleepTime: true,
//           sleepScheduleId: schedule.id,
//           isCompleted: false
//         })
//       } else {
//         sleepTasks.push({
//           id: `sleep-${schedule.id}`,
//           title: schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
//           subject: 'Rest',
//           startTime: schedule.bedtime,
//           endTime: schedule.wakeTime,
//           duration: schedule.duration,
//           priority: 'MEDIUM',
//           color: schedule.color || '#4B5563',
//           day: schedule.day,
//           type: 'sleep',
//           isSleepTime: true,
//           sleepScheduleId: schedule.id,
//           isCompleted: false
//         })
//       }
//     })
    
//     setTasks(prev => [...prev.filter(task => !task.isSleepTime), ...sleepTasks])
//   }

//   // Handle drag and drop
//   const handleDragEnd = (result: any) => {
//     if (isLocked) return
    
//     const { taskId, day, time, duration } = result
    
//     const existingTask = tasks.find(t => t.id === taskId)
//     if (existingTask?.isSleepTime) {
//       toast.error('Sleep time blocks cannot be moved. Adjust sleep schedule instead.')
//       return
//     }
    
//     const existingTaskIndex = tasks.findIndex(t => t.id === taskId)
    
//     if (existingTaskIndex >= 0) {
//       const updatedTasks = [...tasks]
//       updatedTasks[existingTaskIndex] = {
//         ...updatedTasks[existingTaskIndex],
//         day,
//         startTime: time,
//         endTime: calculateEndTime(time, duration || updatedTasks[existingTaskIndex].duration),
//         duration: duration || updatedTasks[existingTaskIndex].duration
//       }
//       setTasks(updatedTasks)
//     } else {
//       const goal = goals.find(g => g.id === taskId)
//       const milestone = goal?.milestones.find(m => m.id === taskId)
      
//       if (goal || milestone) {
//         const newTaskObj: TimeSlot = {
//           id: `task-${Date.now()}`,
//           title: milestone ? milestone.title : goal!.title,
//           subject: goal!.subject || goal!.title,
//           startTime: time,
//           endTime: calculateEndTime(time, 60),
//           duration: 60,
//           priority: goal!.priority,
//           color: goal!.color,
//           day,
//           type: 'task',
//           goalId: goal!.id,
//           milestoneId: milestone?.id
//         }
//         setTasks([...tasks, newTaskObj])
//         toast.success('Task added from goal')
//       } else {
//         const taskPool = getTaskPool()
//         const taskFromPool = taskPool.find(t => t.id === taskId)
        
//         if (taskFromPool) {
//           const newTaskObj: TimeSlot = {
//             ...taskFromPool,
//             day,
//             startTime: time,
//             endTime: calculateEndTime(time, taskFromPool.duration),
//             id: `task-${Date.now()}`
//           }
//           setTasks([...tasks, newTaskObj])
//           toast.success('Task added from pool')
//         }
//       }
//     }
//   }

//   // Handle cell click
//   const handleCellClick = (day: string, time: string) => {
//     if (isLocked) return
    
//     const isSleepTime = tasks.some(t => 
//       t.day === day && 
//       t.isSleepTime && 
//       convertTimeToMinutes(t.startTime) <= convertTimeToMinutes(time) && 
//       convertTimeToMinutes(t.endTime) > convertTimeToMinutes(time)
//     )
    
//     if (isSleepTime && timeSettings.autoLockSleep) {
//       toast.warning('This is your scheduled sleep time. Please adjust your sleep schedule if you need to change this.')
//       return
//     }
    
//     const fixedTime = isTimeInFixedSlot(day, time)
    
//     if (fixedTime) {
//       const isInFreePeriod = fixedTime.freePeriods?.some(fp => 
//         fp.day === day && isTimeInFreePeriodRange(time, fp.startTime, fp.endTime)
//       )
      
//       if (!isInFreePeriod) {
//         setSelectedFixedTime(fixedTime)
//         return
//       }
//     }

//     setTaskCreationContext({ day, time })
//     setShowTaskCreationDialog(true)
//   }

//   const isTimeInFreePeriodRange = (time: string, startTime: string, endTime: string): boolean => {
//     const timeInMinutes = convertTimeToMinutes(time)
//     const startMinutes = convertTimeToMinutes(startTime)
//     const endMinutes = convertTimeToMinutes(endTime)
//     return timeInMinutes >= startMinutes && timeInMinutes < endMinutes
//   }

//   const handleFixedTimeClick = (fixedTime: FixedTime) => {
//     setSelectedFixedTime(fixedTime)
//   }

//   const handleAddTask = () => {
//     if (!newTask.title.trim()) {
//       toast.error('Please enter a task title')
//       return
//     }

//     const task: TimeSlot = {
//       id: `task-${Date.now()}`,
//       title: newTask.title,
//       subject: newTask.subject || 'General',
//       startTime: newTask.startTime,
//       endTime: calculateEndTime(newTask.startTime, newTask.duration),
//       duration: newTask.duration,
//       priority: newTask.priority,
//       color: newTask.color,
//       day: newTask.day,
//       type: 'task',
//       goalId: newTask.goalId || undefined,
//       milestoneId: newTask.milestoneId || undefined,
//       note: newTask.note,
//       status: 'PENDING'
//     }

//     setTasks([...tasks, task])
//     resetTaskForm()
//     setShowAddTaskModal(false)
//     toast.success('Task added successfully')
//   }

//   const handleAddTaskToCell = (flow: 'simple' | 'withGoal' = 'simple') => {
//     if (!newTask.title.trim()) {
//       toast.error('Please enter a task title')
//       return
//     }
    
//     if (!taskCreationContext) {
//       toast.error('No cell selected')
//       return
//     }

//     let fixedCommitmentId: string | undefined = undefined
//     const fixedTime = isTimeInFixedSlot(taskCreationContext.day, taskCreationContext.time)
//     if (fixedTime) {
//       const isInFreePeriod = fixedTime.freePeriods?.some(fp => 
//         fp.day === taskCreationContext.day && 
//         isTimeInFreePeriodRange(taskCreationContext.time, fp.startTime, fp.endTime)
//       )
//       if (isInFreePeriod) {
//         fixedCommitmentId = fixedTime.id
//       }
//     }

//     const task: TimeSlot = {
//       id: `task-${Date.now()}`,
//       title: newTask.title,
//       subject: newTask.subject || 'General',
//       startTime: taskCreationContext.time,
//       endTime: calculateEndTime(taskCreationContext.time, newTask.duration),
//       duration: newTask.duration,
//       priority: newTask.priority,
//       color: newTask.color,
//       day: taskCreationContext.day,
//       type: 'task',
//       fixedCommitmentId,
//       goalId: newTask.goalId || undefined,
//       milestoneId: newTask.milestoneId || undefined,
//       note: newTask.note,
//       status: 'PENDING'
//     }

//     setTasks([...tasks, task])
//     resetTaskForm()
//     setShowTaskCreationDialog(false)
//     setTaskCreationContext(null)
//     toast.success('Task added to timetable')
//   }

//   const resetTaskForm = () => {
//     setNewTask({
//       title: '',
//       subject: '',
//       note: '',
//       duration: 60,
//       priority: 'MEDIUM',
//       color: '#3B82F6',
//       day: 'MONDAY',
//       startTime: '09:00',
//       goalId: '',
//       milestoneId: '',
//       type: 'STUDY',
//       category: 'ACADEMIC'
//     })
//     setTaskCreationFlow('simple')
//   }

//   const startTaskCreation = (flow: 'simple' | 'withGoal') => {
//     setTaskCreationFlow(flow)
//     if (taskCreationContext) {
//       setNewTask({
//         ...newTask,
//         day: taskCreationContext.day,
//         startTime: taskCreationContext.time,
//         duration: timeSettings.interval
//       })
//     }
//   }

//   const handleEditTask = (task: TimeSlot) => {
//     if (task.isSleepTime) {
//       const sleepSchedule = sleepSchedules.find(s => s.id === task.sleepScheduleId)
//       if (sleepSchedule) {
//         setEditingSleepSchedule(sleepSchedule)
//         setShowSleepScheduleModal(true)
//       }
//       return
//     }
    
//     setEditingTask(task)
//     setNewTask({
//       title: task.title,
//       subject: task.subject,
//       note: task.note || '',
//       duration: task.duration,
//       priority: task.priority,
//       color: task.color,
//       day: task.day,
//       startTime: task.startTime,
//       goalId: task.goalId || '',
//       milestoneId: task.milestoneId || '',
//       type: 'STUDY',
//       category: 'ACADEMIC'
//     })
//     setShowAddTaskModal(true)
//   }

//   const handleDeleteTask = (taskId: string) => {
//     const task = tasks.find(t => t.id === taskId)
//     if (task?.isSleepTime) {
//       const sleepSchedule = sleepSchedules.find(s => s.id === task.sleepScheduleId)
//       if (sleepSchedule) {
//         updateSleepSchedule({
//           ...sleepSchedule,
//           isActive: false
//         })
//         toast.success('Sleep schedule deactivated')
//       }
//       return
//     }
//     setTasks(tasks.filter(task => task.id !== taskId))
//     toast.success('Task deleted')
//   }

//   const handleDuplicateTask = (task: TimeSlot) => {
//     if (task.isSleepTime) {
//       toast.error('Cannot duplicate sleep tasks')
//       return
//     }
    
//     const duplicatedTask = {
//       ...task,
//       id: `task-${Date.now()}`,
//       title: `${task.title} (Copy)`
//     }
//     setTasks([...tasks, duplicatedTask])
//     toast.success('Task duplicated')
//   }

//   const handleAddFixedTime = () => {
//     if (!newFixedTime.title.trim()) {
//       toast.error('Please enter a title')
//       return
//     }
    
//     if (newFixedTime.days.length === 0) {
//       toast.error('Please select at least one day')
//       return
//     }

//     const fixedTime: FixedTime = {
//       id: `fixed-${Date.now()}-${Math.random()}`, // Generate temporary client ID
//       title: newFixedTime.title,
//       description: newFixedTime.description,
//       days: newFixedTime.days,
//       startTime: newFixedTime.startTime,
//       endTime: newFixedTime.endTime,
//       type: newFixedTime.type,
//       color: newFixedTime.color,
//       isEditable: newFixedTime.isEditable,
//       freePeriods: newFixedTime.freePeriods || []
//     }

//     setFixedTimes([...fixedTimes, fixedTime])
//     setNewFixedTime({
//       title: '',
//       description: '',
//       days: [],
//       startTime: '09:00',
//       endTime: '17:00',
//       type: 'OTHER',
//       color: '#6B7280',
//       isEditable: true,
//       freePeriods: []
//     })
//     setShowAddFixedTimeModal(false)
//     toast.success('Fixed commitment added')
//   }

//   const handleEditFixedTime = (fixedTime: FixedTime) => {
//     setEditingFixedTime(fixedTime)
//     setShowEditFixedTimeModal(true)
//   }

//   const handleSaveFixedTime = (updatedFixedTime: FixedTime) => {
//     setFixedTimes(fixedTimes.map(ft => 
//       ft.id === updatedFixedTime.id ? updatedFixedTime : ft
//     ))
//     setShowEditFixedTimeModal(false)
//     setEditingFixedTime(null)
//     toast.success('Fixed commitment updated')
//   }

//   const handleDeleteFixedTime = (id: string) => {
//     setFixedTimes(fixedTimes.filter(ft => ft.id !== id))
//     setSelectedFixedTime(null)
//     toast.success('Fixed commitment deleted')
//   }

//   const handleAddFreePeriod = () => {
//     if (!selectedFixedTimeForFreePeriod || !newFreePeriod.day) {
//       toast.error('Please select a fixed commitment and day')
//       return
//     }
    
//     const freePeriod = {
//       id: `free-${Date.now()}-${newFreePeriod.day}`,
//       title: newFreePeriod.title,
//       startTime: newFreePeriod.startTime,
//       endTime: newFreePeriod.endTime,
//       duration: newFreePeriod.duration,
//       day: newFreePeriod.day
//     }
    
//     const updatedFixedTime = {
//       ...selectedFixedTimeForFreePeriod,
//       freePeriods: [...(selectedFixedTimeForFreePeriod.freePeriods || []), freePeriod]
//     }
    
//     setFixedTimes(fixedTimes.map(ft => 
//       ft.id === selectedFixedTimeForFreePeriod.id ? updatedFixedTime : ft
//     ))
    
//     setNewFreePeriod({
//       title: 'Free Period',
//       startTime: '14:00',
//       endTime: '15:00',
//       duration: 60,
//       day: 'MONDAY'
//     })
//     setShowAddFreePeriodModal(false)
//     setSelectedFixedTimeForFreePeriod(null)
//     toast.success('Free period added')
//   }

//   const handleOpenFreePeriodModal = (fixedTime: FixedTime, day: string) => {
//     setSelectedFixedTimeForFreePeriod(fixedTime)
//     setNewFreePeriod({
//       ...newFreePeriod,
//       day: day
//     })
//     setShowAddFreePeriodModal(true)
//   }

//   const handleOpenSleepScheduleModal = () => {
//     setShowSleepScheduleModal(true)
//   }

//   const handleSaveSleepSchedule = (schedule: SleepSchedule) => {
//     const existingIndex = sleepSchedules.findIndex(s => s.id === schedule.id)
    
//     if (existingIndex >= 0) {
//       const updatedSchedules = [...sleepSchedules]
//       updatedSchedules[existingIndex] = schedule
//       setSleepSchedules(updatedSchedules)
//       toast.success('Sleep schedule updated')
//     } else {
//       setSleepSchedules([...sleepSchedules, schedule])
//       toast.success('Sleep schedule added')
//     }
    
//     setEditingSleepSchedule(null)
//     setShowSleepScheduleModal(false)
//     generateSleepTasks()
//   }

//   const updateSleepSchedule = (schedule: SleepSchedule) => {
//     const existingIndex = sleepSchedules.findIndex(s => s.id === schedule.id)
    
//     if (existingIndex >= 0) {
//       const updatedSchedules = [...sleepSchedules]
//       updatedSchedules[existingIndex] = schedule
//       setSleepSchedules(updatedSchedules)
//     }
    
//     generateSleepTasks()
//   }

//   const handleDeleteSleepSchedule = (id: string) => {
//     setSleepSchedules(sleepSchedules.filter(s => s.id !== id))
//     setTasks(tasks.filter(task => task.sleepScheduleId !== id))
//     setEditingSleepSchedule(null)
//     setShowSleepScheduleModal(false)
//     toast.success('Sleep schedule deleted')
//   }

//   const handleLockTimetable = () => {
//     if (!hasUnsavedChanges) {
//       toast.info('No changes to save')
//       return
//     }
//     setShowLockProgress(true)
//     setIsLocking(true)
//     setLockProgress([{ step: 'Saving Timetable', status: 'in-progress', message: 'Preparing data...' }])
//     executeLockSequence()
//   }

//   const handleUnlockTimetable = () => {
//     setIsLocked(false)
//     setLockSuccess(false)
//     toast.success('Timetable unlocked')
//   }

//   const executeLockSequence = async () => {
//     try {
//       // Prepare API payload
//       const payload = prepareLockPayload()
      
//       // Update progress
//       setLockProgress([{ 
//         step: 'Saving Timetable', 
//         status: 'in-progress', 
//         message: 'Sending data to server...' 
//       }])

//       // Call the consolidated lock API
//       const result = await lockTimetable(payload)
      
//       if (result.success) {
//         setLockProgress([{ 
//           step: 'Saving Timetable', 
//           status: 'completed', 
//           message: `Created ${result.data.totalItems} items` 
//         }])
        
//         setIsLocking(false)
//         setLockSuccess(true)
//         setIsLocked(true)
//         setHasUnsavedChanges(false)
//         toast.success(result.message || 'Timetable locked and saved successfully!')
        
//         // Refresh data
//         await fetchFullTimeTable()
//       } else {
//         throw new Error(result.message || 'Failed to save timetable')
//       }
//     } catch (error) {
//       console.error('Lock sequence failed:', error)
      
//       setLockProgress([{ 
//         step: 'Saving Timetable', 
//         status: 'failed', 
//         error: error instanceof Error ? error.message : 'Unknown error' 
//       }])
      
//       setIsLocking(false)
//       toast.error('Failed to save timetable. No changes were saved.')
//     }
//   }

//   const prepareLockPayload = () => {
//     // Prepare fixed times with free periods
//     const apiFixedTimes: any[] = fixedTimes.map(ft => ({
//       title: ft.title,
//       description: ft.description,
//       days: ft.days,
//       startTime: ft.startTime,
//       endTime: ft.endTime,
//       type: ft.type,
//       color: ft.color,
//       isEditable: ft.isEditable ?? true,
//       freePeriods: ft.freePeriods?.map(fp => ({
//         title: fp.title,
//         startTime: fp.startTime,
//         endTime: fp.endTime,
//         day: fp.day
//       })) || []
//     }))

//     // Prepare sleep schedules
//     const apiSleepSchedules: any[] = sleepSchedules.map(s => ({
//       day: s.day,
//       bedtime: s.bedtime,
//       wakeTime: s.wakeTime,
//       duration: s.duration,
//       isActive: s.isActive,
//       type: s.type,
//       notes: s.notes,
//       color: s.color
//     }))

//     // Prepare tasks (non-sleep)
//     const apiTasks: any[] = tasks
//       .filter(t => !t.isSleepTime)
//       .map(task => {
//         const apiTask: any = {
//           title: task.title,
//           subject: task.subject,
//           note: task.note,
//           startTime: task.startTime,
//           endTime: task.endTime,
//           duration: task.duration,
//           priority: task.priority,
//           color: task.color,
//           day: task.day,
//           type: 'STUDY', // Map based on task type
//           category: 'ACADEMIC',
//           status: task.status || 'PENDING'
//         }

//         if (task.goalId) {
//           apiTask.goalId = task.goalId
//         }
//         if (task.milestoneId) {
//           apiTask.milestoneId = task.milestoneId
//         }
//         if (task.completedAt) {
//           apiTask.completedAt = task.completedAt
//         }

//         return apiTask
//       })

//     return {
//       fixedTimes: apiFixedTimes,
//       sleepSchedules: apiSleepSchedules,
//       tasks: apiTasks
//     }
//   }

//   const lockTimetable = async (payload: any): Promise<LockApiResponse> => {
//     const token = getAuthToken()
//     if (!token) {
//       throw new Error('Please login to save timetable')
//     }

//     const response = await fetch(`${API_BASE_URL}/time-table/lock`, {
//       method: 'POST',
//       headers: {
//         'Authorization': token,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(payload)
//     })

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}))
//       throw new Error(errorData.message || `Failed to lock timetable: ${response.status}`)
//     }

//     const data = await response.json()
//     return data
//   }

//   const handleResetTimetable = async () => {
//     setShowResetConfirm(true)
//   }

//   const confirmReset = async () => {
//     setShowResetConfirm(false)
    
//     try {
//       toast.loading('Resetting timetable...')
      
//       const token = getAuthToken()
//       if (!token) {
//         toast.error('Please login to reset timetable')
//         return
//       }
      
//       // Delete all fixed times (this will cascade to free periods)
//       if (fixedTimes.length > 0) {
//         const fixedTimeIds = fixedTimes
//           .map(ft => ft.serverId || ft.id)
//           .filter(id => id && !id.startsWith('fixed-')) // Only send server IDs or non-temporary IDs
//         if (fixedTimeIds.length > 0) {
//           await fetch(`${API_BASE_URL}/fixed-times/bulk-delete`, {
//             method: 'POST',
//             headers: {
//               'Authorization': token,
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ fixedTimeIds })
//           })
//         }
//       }
      
//       // Delete all sleep schedules
//       if (sleepSchedules.length > 0) {
//         const scheduleIds = sleepSchedules.map(s => s.id)
//         await fetch(`${API_BASE_URL}/sleep-schedules/bulk-delete`, {
//           method: 'POST',
//           headers: {
//             'Authorization': token,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ scheduleIds })
//         })
//       }
      
//       // Delete all tasks
//       const taskIds = tasks.filter(t => !t.isSleepTime).map(t => t.id)
//       if (taskIds.length > 0) {
//         await fetch(`${API_BASE_URL}/tasks/bulk-delete`, {
//           method: 'POST',
//           headers: {
//             'Authorization': token,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ taskIds })
//         })
//       }
      
//       // Clear local state
//       setTasks([])
//       setFixedTimes([])
//       setSleepSchedules([])
//       setHasUnsavedChanges(false)
      
//       toast.success('Timetable reset successfully')
//     } catch (error) {
//       console.error('Error resetting timetable:', error)
//       toast.error('Failed to reset timetable')
//     }
//   }

//   const getTaskPool = () => {
//     return [
//       {
//         id: 'pool-1',
//         title: 'Study React Hooks',
//         subject: 'Web Development',
//         startTime: '',
//         endTime: '',
//         duration: 60,
//         priority: 'HIGH' as const,
//         color: '#3B82F6',
//         day: '',
//         type: 'task' as const
//       },
//       {
//         id: 'pool-2',
//         title: 'DSA Arrays Practice',
//         subject: 'DSA',
//         startTime: '',
//         endTime: '',
//         duration: 90,
//         priority: 'CRITICAL' as const,
//         color: '#EF4444',
//         day: '',
//         type: 'task' as const
//       }
//     ]
//   }

//   const getTasksForCell = (day: string, time: string) => {
//     return tasks.filter(task => {
//       if (task.day !== day) return false
      
//       const taskStartMinutes = convertTimeToMinutes(task.startTime)
//       const taskEndMinutes = convertTimeToMinutes(task.endTime)
//       const cellMinutes = convertTimeToMinutes(time)
      
//       return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
//     })
//   }

//   const isTimeInFixedSlot = (day: string, time: string): FixedTime | null => {
//     const timeInMinutes = convertTimeToMinutes(time)
    
//     for (const ft of fixedTimes) {
//       if (!ft.days.includes(day)) continue
      
//       const startMinutes = convertTimeToMinutes(ft.startTime)
//       const endMinutes = convertTimeToMinutes(ft.endTime)
      
//       if (timeInMinutes >= startMinutes && timeInMinutes < endMinutes) {
//         return ft
//       }
//     }
//     return null
//   }

//   const isTimeInFreePeriod = (day: string, time: string): {fixedTime: FixedTime, freePeriod: any} | null => {
//     const fixedTime = isTimeInFixedSlot(day, time)
//     if (!fixedTime) return null
    
//     for (const fp of fixedTime.freePeriods || []) {
//       if (fp.day === day && isTimeInFreePeriodRange(time, fp.startTime, fp.endTime)) {
//         return { fixedTime, freePeriod: fp }
//       }
//     }
//     return null
//   }

//   const getNextTimeSlot = (time: string): string => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const totalMinutes = hours * 60 + minutes + timeSettings.interval
//     const nextHours = Math.floor(totalMinutes / 60)
//     const nextMinutes = totalMinutes % 60
//     return `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`
//   }

//   const shouldShowTaskInCell = (task: TimeSlot, day: string, time: string) => {
//     if (task.day !== day) return false
    
//     const taskStartMinutes = convertTimeToMinutes(task.startTime)
//     const cellMinutes = convertTimeToMinutes(time)
    
//     return taskStartMinutes === cellMinutes
//   }

//   const getTaskSpan = (task: TimeSlot) => {
//     const startMinutes = convertTimeToMinutes(task.startTime)
//     const endMinutes = convertTimeToMinutes(task.endTime)
//     const duration = endMinutes - startMinutes
//     return Math.ceil(duration / timeSettings.interval)
//   }

//   const isExtendedTime = (time: string) => {
//     const [hours, minutes] = time.split(':').map(Number)
    
//     if (timeSettings.extendedHours.morning && hours < 8) {
//       return true
//     }
    
//     if (timeSettings.extendedHours.evening && hours >= 18 && hours < 22) {
//       return true
//     }
    
//     if (timeSettings.extendedHours.night && hours >= 22) {
//       return true
//     }
    
//     if (timeSettings.extendedHours.custom.includes(time)) {
//       return true
//     }
    
//     return false
//   }

//   const getFixedTimeColor = (type: string) => {
//     const fixedTimeType = FIXED_TIME_TYPES.find(t => t.id === type)
//     return fixedTimeType?.color || '#6B7280'
//   }

//   const getSleepTypeInfo = (type: string) => {
//     return SLEEP_TYPES.find(t => t.id === type) || SLEEP_TYPES[0]
//   }

//   const getCategoryIcon = (category: Goal['category']) => {
//     const cat = GOAL_CATEGORIES.find(c => c.id === category)
//     if (cat) {
//       const Icon = cat.icon
//       return <Icon className="w-4 h-4" />
//     }
//     return <Target className="w-4 h-4" />
//   }

//   const getPriorityColor = (priority: Goal['priority']) => {
//     switch(priority) {
//       case 'CRITICAL': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
//       case 'HIGH': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
//       case 'MEDIUM': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
//       case 'LOW': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
//       default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
//     }
//   }

//   const handleScheduleMilestone = (goal: Goal, milestone: Milestone) => {
//     setSelectedGoalForMilestone(null)
    
//     const day = 'MONDAY'
//     const defaultTime = '10:00'
    
//     const isSleepTime = tasks.some(t => 
//       t.day === day && 
//       t.isSleepTime && 
//       convertTimeToMinutes(t.startTime) <= convertTimeToMinutes(defaultTime) && 
//       convertTimeToMinutes(t.endTime) > convertTimeToMinutes(defaultTime)
//     )
    
//     if (isSleepTime && timeSettings.autoLockSleep) {
//       toast.warning('This time conflicts with your sleep schedule. Please choose a different time or adjust your sleep schedule.')
//       return
//     }
    
//     const task: TimeSlot = {
//       id: `task-${Date.now()}`,
//       title: milestone.title,
//       subject: goal.subject || goal.title,
//       startTime: defaultTime,
//       endTime: calculateEndTime(defaultTime, 60),
//       duration: 60,
//       priority: goal.priority,
//       color: goal.color,
//       day: day,
//       type: 'task',
//       goalId: goal.id,
//       milestoneId: milestone.id,
//       status: 'PENDING'
//     }

//     setTasks([...tasks, task])
//     toast.success(`Scheduled "${milestone.title}" for ${day.charAt(0) + day.slice(1).toLowerCase()} at ${formatTimeDisplay(defaultTime)}`)
//   }

//   const getDaysUntilDeadline = (targetDate: Date) => {
//     const today = new Date()
//     const deadline = new Date(targetDate)
//     const diffTime = deadline.getTime() - today.getTime()
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//   }

//   const getFreePeriodsForDay = (fixedTime: FixedTime, day: string) => {
//     return fixedTime.freePeriods?.filter(fp => fp.day === day) || []
//   }

//   const handleSaveTimeSettings = () => {
//     setTimeSlots(generateTimeSlots())
//     setShowTimeSettingsModal(false)
//     toast.success('Display settings updated')
//   }

//   const toggleWeekends = () => {
//     setTimeSettings({
//       ...timeSettings,
//       showWeekends: !timeSettings.showWeekends
//     })
//   }

//   const handleExtendTime = (extensionType: 'morning' | 'evening' | 'night' | 'custom', customSlots?: string[]) => {
//     const updatedExtendedHours = { ...timeSettings.extendedHours }
    
//     switch(extensionType) {
//       case 'morning':
//         updatedExtendedHours.morning = !updatedExtendedHours.morning
//         break
//       case 'evening':
//         updatedExtendedHours.evening = !updatedExtendedHours.evening
//         break
//       case 'night':
//         updatedExtendedHours.night = !updatedExtendedHours.night
//         break
//       case 'custom':
//         if (customSlots) {
//           updatedExtendedHours.custom = customSlots
//         }
//         break
//     }
    
//     setTimeSettings({
//       ...timeSettings,
//       extendedHours: updatedExtendedHours
//     })
    
//     if (extensionType === 'custom') {
//       setShowTimeExtensionModal(false)
//     }
//   }

//   const handleAddCustomTime = (time: string) => {
//     const [hours, minutes] = time.split(':').map(Number)
//     if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
//       const updatedCustom = [...timeSettings.extendedHours.custom, time]
//         .filter((slot, index, self) => self.indexOf(slot) === index)
//         .sort((a, b) => {
//           const [aHours, aMins] = a.split(':').map(Number)
//           const [bHours, bMins] = b.split(':').map(Number)
//           return (aHours * 60 + aMins) - (bHours * 60 + bMins)
//         })
      
//       handleExtendTime('custom', updatedCustom)
//       toast.success(`Added custom time slot: ${formatTimeDisplay(time)}`)
//     }
//   }

//   const handleRemoveCustomTime = (time: string) => {
//     const updatedCustom = timeSettings.extendedHours.custom.filter(slot => slot !== time)
//     handleExtendTime('custom', updatedCustom)
//     toast.success(`Removed custom time slot: ${formatTimeDisplay(time)}`)
//   }

//   const handleExportPDF = () => {
//     toast.info('PDF export functionality will be implemented soon')
//   }

//   const handlePrint = () => {
//     window.print()
//   }

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: 'My Timetable',
//         text: 'Check out my weekly schedule!',
//         url: window.location.href,
//       }).catch(() => {
//         navigator.clipboard.writeText(window.location.href)
//         toast.success('Link copied to clipboard!')
//       })
//     } else {
//       navigator.clipboard.writeText(window.location.href)
//       toast.success('Link copied to clipboard!')
//     }
//   }

//   // Render the timetable grid
//   const renderTimetableGrid = () => {
//     if (timeSettings.displayMode === 'vertical') {
//       return (
//         <div className="overflow-x-auto">
//           <div className="min-w-[800px]">
//             <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
//               <div className="w-24 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
//               {days.map((day, index) => (
//                 <div
//                   key={day}
//                   className={cn(
//                     "flex-1 p-4 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0",
//                     ['SATURDAY', 'SUNDAY'].includes(day) ? "bg-blue-50 dark:bg-blue-900/30" : "bg-white dark:bg-gray-800"
//                   )}
//                 >
//                   <div className="flex flex-col items-center gap-1">
//                     <span className={cn(
//                       "font-bold text-lg",
//                       ['SATURDAY', 'SUNDAY'].includes(day) && "text-blue-700 dark:text-blue-300"
//                     )}>
//                       {day.charAt(0) + day.slice(1).toLowerCase()}
//                     </span>
//                     <span className="text-sm text-gray-500 dark:text-gray-400">
//                       {['SATURDAY', 'SUNDAY'].includes(day) ? "Weekend" : "Weekday"}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex">
//               <div className="w-24 flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-r-2 border-gray-300 dark:border-gray-700">
//                 {timeSlots.map((time, index) => (
//                   <div
//                     key={time}
//                     className={cn(
//                       "flex items-center justify-center relative group border-b border-gray-200 dark:border-gray-700",
//                       isExtendedTime(time) && "bg-yellow-50 dark:bg-yellow-900/20"
//                     )}
//                     style={{ height: `${timeSettings.cellHeight}px` }}
//                   >
//                     <div className={cn(
//                       "text-sm font-semibold px-2 py-1 rounded-lg shadow-sm",
//                       isExtendedTime(time) 
//                         ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100" 
//                         : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
//                     )}>
//                       <div className="flex items-center gap-1">
//                         {formatTimeDisplay(time)}
//                         {isExtendedTime(time) && (
//                           <Badge className="ml-1 text-xs bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100">
//                             Ext
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex-1 flex bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
//                 {days.map(day => (
//                   <div key={day} className="flex-1 flex flex-col relative">
//                     {timeSlots.map((time, index) => (
//                       <TimeCell key={`${day}-${time}`} day={day} time={time} />
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )
//     } else {
//       return (
//         <div className="overflow-x-auto">
//           <div className="min-w-[1000px]">
//             <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
//               <div className="w-32 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
//                 <div className="font-bold text-gray-900 dark:text-gray-100">Day / Time</div>
//               </div>
//               {timeSlots.map((time, index) => (
//                 <div
//                   key={time}
//                   className={cn(
//                     "flex-1 p-4 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0",
//                     isExtendedTime(time) ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-gray-50 dark:bg-gray-900"
//                   )}
//                 >
//                   <div className="flex flex-col items-center gap-1">
//                     <div className="flex items-center gap-1">
//                       <span className={cn(
//                         "font-bold text-lg",
//                         isExtendedTime(time) ? "text-yellow-800 dark:text-yellow-100" : "text-gray-900 dark:text-gray-100"
//                       )}>
//                         {formatTimeDisplay(time)}
//                       </span>
//                       {isExtendedTime(time) && (
//                         <Badge className="text-xs bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100">
//                           Ext
//                         </Badge>
//                       )}
//                     </div>
//                     {index < timeSlots.length - 1 && (
//                       <span className="text-xs text-gray-500 dark:text-gray-400">
//                         to {formatTimeDisplay(getNextTimeSlot(time))}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex flex-col">
//               {days.map((day, dayIndex) => (
//                 <div key={day} className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0">
//                   <div 
//                     className="w-32 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center p-4"
//                     style={{ height: `${timeSettings.cellHeight}px` }}
//                   >
//                     <div className="text-center">
//                       <div className={cn(
//                         "font-bold text-lg",
//                         ['SATURDAY', 'SUNDAY'].includes(day) && "text-blue-700 dark:text-blue-300"
//                       )}>
//                         {day.charAt(0) + day.slice(1).toLowerCase()}
//                       </div>
//                       <div className="text-sm text-gray-500 dark:text-gray-400">
//                         {['SATURDAY', 'SUNDAY'].includes(day) ? "Weekend" : "Weekday"}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex-1 flex">
//                     {timeSlots.map((time, timeIndex) => (
//                       <TimeCell key={`${day}-${time}`} day={day} time={time} />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )
//     }
//   }

//   // Individual time cell component
//   const TimeCell = ({ day, time }: { day: string; time: string }) => {
//     const fixedTime = isTimeInFixedSlot(day, time)
//     const freePeriodInfo = isTimeInFreePeriod(day, time)
//     const tasksInCell = getTasksForCell(day, time)
//     const primaryTask = tasksInCell.find(task => 
//       convertTimeToMinutes(task.startTime) === convertTimeToMinutes(time)
//     ) || tasksInCell[0]
    
//     const isFreePeriod = !!freePeriodInfo
//     const isSleepTime = tasksInCell.some(t => t.isSleepTime)
//     const sleepTask = tasksInCell.find(t => t.isSleepTime)
    
//     return (
//       <div
//         className={cn(
//           "relative border-r border-b border-gray-200 dark:border-gray-700 group transition-all duration-150",
//           fixedTime && !isFreePeriod && getTimeSlotColor(fixedTime.type),
//           isFreePeriod && "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
//           isExtendedTime(time) && !fixedTime && !isSleepTime && "bg-yellow-50/30 dark:bg-yellow-900/10",
//           isSleepTime && "bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700",
//           "hover:bg-gray-50 dark:hover:bg-gray-800/50"
//         )}
//         style={{ 
//           height: `${timeSettings.cellHeight}px`,
//           minWidth: '120px'
//         }}
//         onClick={() => handleCellClick(day, time)}
//       >
//         {isExtendedTime(time) && !fixedTime && !primaryTask && !isSleepTime && (
//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//             <div className="text-xs text-yellow-600 dark:text-yellow-400 opacity-30">
//               Extended
//             </div>
//           </div>
//         )}

//         {fixedTime && !isFreePeriod && !primaryTask && !isSleepTime && (
//           <div className="absolute inset-0 flex items-center justify-center p-1 cursor-pointer" onClick={() => handleFixedTimeClick(fixedTime)}>
//             <div className="text-xs font-medium text-center truncate px-1 text-gray-700 dark:text-gray-300">
//               <div className="flex items-center justify-center gap-1">
//                 {getIconByType(fixedTime.type)}
//                 <span>{fixedTime.title}</span>
//               </div>
//               <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
//                 Fixed Commitment
//               </div>
//             </div>
//           </div>
//         )}

//         {isFreePeriod && !primaryTask && !isSleepTime && (
//           <div className="absolute inset-0 flex items-center justify-center p-1 cursor-pointer">
//             <div className="text-xs font-medium text-center truncate px-1 text-green-700 dark:text-green-400">
//               <div className="flex items-center justify-center gap-1">
//                 <Coffee className="w-3 h-3" />
//                 <span>Free Period</span>
//               </div>
//               <div className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">
//                 Click to add tasks
//               </div>
//             </div>
//           </div>
//         )}

//         {isSleepTime && !primaryTask && sleepTask && (
//           <div className="absolute inset-0 flex items-center justify-center p-1">
//             <div className="text-xs font-medium text-center truncate px-1 text-gray-700 dark:text-gray-300">
//               <div className="flex items-center justify-center gap-1">
//                 <Moon className="w-3 h-3" />
//                 <span>Sleep Time</span>
//               </div>
//               <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
//                 {formatTimeDisplay(sleepTask.startTime)} - {formatTimeDisplay(sleepTask.endTime)}
//               </div>
//             </div>
//           </div>
//         )}

//         {primaryTask && shouldShowTaskInCell(primaryTask, day, time) && !primaryTask.isSleepTime && (
//           <TaskComponent 
//             task={primaryTask} 
//             day={day}
//             time={time}
//             onEdit={handleEditTask}
//             onDelete={handleDeleteTask}
//             onDuplicate={handleDuplicateTask}
//           />
//         )}

//         {sleepTask && shouldShowTaskInCell(sleepTask, day, time) && sleepTask.isSleepTime && (
//           <SleepTaskComponent 
//             task={sleepTask}
//             sleepSchedule={sleepSchedules.find(s => s.id === sleepTask.sleepScheduleId)}
//             onEdit={() => {
//               const schedule = sleepSchedules.find(s => s.id === sleepTask.sleepScheduleId)
//               if (schedule) {
//                 setEditingSleepSchedule(schedule)
//                 setShowSleepScheduleModal(true)
//               }
//             }}
//           />
//         )}

//         {tasksInCell.length > 1 && !primaryTask && !isSleepTime && (
//           <div className="absolute bottom-1 right-1">
//             <Badge variant="outline" className="text-xs px-1 py-0 dark:border-gray-600 dark:text-gray-400">
//               +{tasksInCell.length - 1}
//             </Badge>
//           </div>
//         )}

//         {!isLocked && !fixedTime && !primaryTask && !isSleepTime && (
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80">
//             <div className="flex flex-col gap-1">
//               <button
//                 className="p-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   setTaskCreationContext({ day, time })
//                   setShowTaskCreationDialog(true)
//                 }}
//                 title="Add Task"
//               >
//                 <Plus className="w-3 h-3 text-gray-600 dark:text-gray-400" />
//               </button>
//             </div>
//           </div>
//         )}

//         {!isLocked && isFreePeriod && !primaryTask && !isSleepTime && (
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-green-50/80 dark:bg-green-900/20">
//             <div className="flex flex-col gap-1">
//               <button
//                 className="p-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   setTaskCreationContext({ day, time })
//                   setShowTaskCreationDialog(true)
//                 }}
//                 title="Add Task in Free Period"
//               >
//                 <Plus className="w-3 h-3 text-green-600 dark:text-green-400" />
//               </button>
//             </div>
//           </div>
//         )}

//         {isSleepTime && timeSettings.autoLockSleep && (
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-800/10 dark:bg-gray-900/30">
//             <div className="flex flex-col gap-1">
//               <button
//                 className="p-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   setShowSleepScheduleModal(true)
//                 }}
//                 title="Adjust Sleep Schedule"
//               >
//                 <Moon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   // Sleep Task Component
//   const SleepTaskComponent = ({ 
//     task, 
//     sleepSchedule,
//     onEdit 
//   }: { 
//     task: TimeSlot
//     sleepSchedule?: SleepSchedule
//     onEdit: () => void
//   }) => {
//     const sleepType = sleepSchedule ? getSleepTypeInfo(sleepSchedule.type) : SLEEP_TYPES[0]
//     const Icon = sleepType.icon
    
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className={cn(
//           "absolute top-0.5 left-0.5 right-0.5 rounded-lg border shadow-sm z-30 overflow-hidden cursor-pointer",
//           "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all",
//           sleepType.bgColor
//         )}
//         style={{ 
//           height: `${timeSettings.cellHeight - 4}px`,
//           width: `calc(${getTaskSpan(task)} * 100% - 4px)`,
//           borderLeft: `4px solid ${task.color}`,
//         }}
//         onClick={(e) => {
//           e.stopPropagation()
//           onEdit()
//         }}
//       >
//         <div className="p-2 h-full flex flex-col">
//           <div className="flex items-start justify-between mb-1">
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-1 mb-0.5">
//                 <Icon className="w-3 h-3" style={{ color: sleepType.color }} />
//                 <h4 className="text-xs font-semibold truncate dark:text-gray-200">
//                   {sleepSchedule?.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep'}
//                 </h4>
//               </div>
//               <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
//                 {sleepSchedule?.notes || 'Rest time'}
//               </p>
//             </div>
//           </div>
          
//           <div className="mt-auto space-y-1">
//             <div className="flex items-center justify-between">
//               <Badge variant="outline" className="text-[10px] px-1 py-0 dark:border-gray-600 dark:text-gray-400">
//                 {Math.round(task.duration / 60)}h {task.duration % 60}m
//               </Badge>
//               <span className="text-[10px] text-gray-500 dark:text-gray-400">
//                 {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
//               </span>
//             </div>
            
//             {sleepSchedule?.type && (
//               <div className="text-[8px] text-gray-500 dark:text-gray-400 text-right">
//                 {SLEEP_TYPES.find(t => t.id === sleepSchedule.type)?.label}
//               </div>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     )
//   }

//   // Task component
//   const TaskComponent = ({ 
//     task, 
//     day,
//     time,
//     onEdit,
//     onDelete,
//     onDuplicate 
//   }: { 
//     task: TimeSlot
//     day: string
//     time: string
//     onEdit: (task: TimeSlot) => void
//     onDelete: (taskId: string) => void
//     onDuplicate: (task: TimeSlot) => void
//   }) => {
//     const taskSpan = getTaskSpan(task)
//     const goal = task.goalId ? goals.find(g => g.id === task.goalId) : null
//     const milestone = task.milestoneId && goal ? goal.milestones.find(m => m.id === task.milestoneId) : null
    
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className={cn(
//           "absolute top-0.5 left-0.5 right-0.5 rounded-lg border shadow-sm z-30 overflow-hidden cursor-pointer",
//           "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all",
//           task.fixedCommitmentId && "border-green-300 dark:border-green-700",
//           milestone && "border-purple-300 dark:border-purple-700"
//         )}
//         style={{ 
//           height: `${timeSettings.cellHeight - 4}px`,
//           width: `calc(${taskSpan * 100}% - 4px)`,
//           borderLeft: `4px solid ${task.color}`,
//           backgroundColor: task.fixedCommitmentId 
//             ? `${task.color}15` 
//             : milestone
//             ? `${task.color}20`
//             : `${task.color}10`
//         }}
//         onClick={(e) => {
//           e.stopPropagation()
//           onEdit(task)
//         }}
//       >
//         <div className="p-2 h-full flex flex-col">
//           <div className="flex items-start justify-between mb-1">
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-1 mb-0.5">
//                 <h4 className="text-xs font-semibold truncate dark:text-gray-200">{task.title}</h4>
//                 {task.fixedCommitmentId && (
//                   <Badge variant="outline" className="ml-1 text-[8px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30">
//                     Free Period
//                   </Badge>
//                 )}
//                 {milestone && (
//                   <Badge variant="outline" className="ml-1 text-[8px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/30">
//                     Milestone
//                   </Badge>
//                 )}
//               </div>
//               <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
//                 {goal ? goal.title : task.subject}
//               </p>
//             </div>
            
//             {!isLocked && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
//                   <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
//                     <MoreVertical className="w-3 h-3 text-gray-600 dark:text-gray-400" />
//                   </button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-40 dark:bg-gray-800 dark:border-gray-700">
//                   <DropdownMenuItem onClick={() => onEdit(task)} className="dark:text-gray-300 dark:hover:bg-gray-700">
//                     <Edit2 className="w-4 h-4 mr-2" />
//                     Edit
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => onDuplicate(task)} className="dark:text-gray-300 dark:hover:bg-gray-700">
//                     <Copy className="w-4 h-4 mr-2" />
//                     Duplicate
//                   </DropdownMenuItem>
//                   <DropdownMenuItem 
//                     onClick={() => onDelete(task.id)}
//                     className="text-red-600 focus:text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
//                   >
//                     <Trash2 className="w-4 h-4 mr-2" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>

//           <div className="mt-auto space-y-1">
//             <div className="flex items-center justify-between">
//               <Badge variant="outline" className="text-[10px] px-1 py-0 dark:border-gray-600 dark:text-gray-400">
//                 {task.priority}
//               </Badge>
//               <span className="text-[10px] text-gray-500 dark:text-gray-400">{task.duration}m</span>
//             </div>
            
//             {taskSpan > 1 && (
//               <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
//                 {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
//               </div>
//             )}
            
//             {milestone && (
//               <div className="flex items-center gap-1">
//                 <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full rounded-full"
//                     style={{ 
//                       width: `${milestone.progress}%`,
//                       backgroundColor: task.color
//                     }}
//                   />
//                 </div>
//                 <span className="text-[8px] text-gray-500 dark:text-gray-400">
//                   {Math.round(milestone.progress)}%
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {taskSpan > 1 && (
//           <div className="absolute bottom-1 right-1">
//             <div className="text-[10px] text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-800/80 px-1 py-0.5 rounded">
//               {taskSpan} slots
//             </div>
//           </div>
//         )}
//       </motion.div>
//     )
//   }

//   const getIconByType = (type: string) => {
//     const fixedTimeType = FIXED_TIME_TYPES.find(t => t.id === type)
//     if (fixedTimeType) {
//       const Icon = fixedTimeType.icon
//       return <Icon className="w-4 h-4" />
//     }
//     return <Clock className="w-4 h-4" />
//   }

//   const getTimeSlotColor = (type: string) => {
//     switch(type) {
//       case 'COLLEGE': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30'
//       case 'OFFICE': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30'
//       case 'SCHOOL': return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/30'
//       case 'COMMUTE': return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/30'
//       case 'MEAL': return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30'
//       case 'WORKOUT': return 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/30'
//       case 'MEETING': return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30'
//       case 'FREE': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30'
//       case 'SLEEP': return 'bg-gray-100 border-gray-300 dark:bg-gray-800/50 dark:border-gray-700'
//       default: return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
//     }
//   }

//   const cn = (...classes: (string | boolean | undefined)[]) => {
//     return classes.filter(Boolean).join(' ')
//   }

//   const sleepStats = getSleepStats()

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-200">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className="max-w-7xl mx-auto space-y-6"
//       >
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Timetable Builder</h1>
//               <Badge variant="outline" className="capitalize dark:border-gray-700 dark:text-gray-300">
//                 {userType}
//               </Badge>
//               {isLocked && (
//                 <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
//                   <Lock className="w-3 h-3 mr-1" />
//                   Locked
//                 </Badge>
//               )}
//               {hasUnsavedChanges && !isLocked && (
//                 <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
//                   <AlertCircle className="w-3 h-3 mr-1" />
//                   Unsaved Changes
//                 </Badge>
//               )}
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={toggleDarkMode}
//                 className="h-8 w-8"
//               >
//                 {darkMode ? (
//                   <Sun className="h-4 w-4" />
//                 ) : (
//                   <Moon className="h-4 w-4" />
//                 )}
//               </Button>
//             </div>
//             <p className="text-gray-600 dark:text-gray-400">
//               {timeSettings.displayMode === 'vertical' 
//                 ? 'Weekdays as columns, time as rows' 
//                 : 'Weekdays as rows, time as columns'}
//               {timeSlots.some(isExtendedTime) && (
//                 <span className="ml-2 text-yellow-600 dark:text-yellow-400 font-medium">
//                   • Extended hours enabled
//                 </span>
//               )}
//               {timeSettings.showSleepBlocks && (
//                 <span className="ml-2 text-gray-600 dark:text-gray-400 font-medium">
//                   • Sleep schedule active
//                 </span>
//               )}
//             </p>
//           </div>
          
//           <div className="flex flex-wrap gap-3">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
//                   <FileText className="w-4 h-4" />
//                   Export
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
//                 <DropdownMenuItem onClick={() => setViewMode('pdf')} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
//                   <FileText className="w-4 h-4" />
//                   View as PDF
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={handleExportPDF} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
//                   <Download className="w-4 h-4" />
//                   Download PDF
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={handlePrint} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
//                   <Printer className="w-4 h-4" />
//                   Print
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={handleShare} className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
//                   <Share2 className="w-4 h-4" />
//                   Share
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
            
//             <Button 
//               variant="outline" 
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//               onClick={() => setShowGoalsModal(true)}
//             >
//               <Target className="w-4 h-4" />
//               Schedule Goals
//             </Button>
            
//             <Button 
//               variant="outline" 
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//               onClick={() => setShowSleepScheduleModal(true)}
//             >
//               <Bed className="w-4 h-4" />
//               Sleep Schedule
//             </Button>
            
//             <Button 
//               variant="outline" 
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//               onClick={() => setShowTimeSettingsModal(true)}
//             >
//               <Settings className="w-4 h-4" />
//               Display Settings
//             </Button>
            
//             <Button 
//               variant="outline" 
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//               onClick={() => setShowTimeExtensionModal(true)}
//             >
//               <PlusCircle className="w-4 h-4" />
//               Extend Time
//             </Button>
            
//             <Button 
//               variant="outline" 
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//               onClick={toggleWeekends}
//             >
//               {timeSettings.showWeekends ? (
//                 <>
//                   <EyeOff className="w-4 h-4" />
//                   Hide Weekends
//                 </>
//               ) : (
//                 <>
//                   <Eye className="w-4 h-4" />
//                   Show Weekends
//                 </>
//               )}
//             </Button>
            
//             <Button 
//               onClick={isLocked ? handleUnlockTimetable : handleLockTimetable}
//               className={`gap-2 ${isLocked ? 'bg-green-600 hover:bg-green-700' : ''}`}
//               disabled={isLocking}
//             >
//               {isLocking ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : isLocked ? (
//                 <>
//                   <Unlock className="w-4 h-4" />
//                   Unlock
//                 </>
//               ) : (
//                 <>
//                   <Lock className="w-4 h-4" />
//                   Lock Timetable
//                 </>
//               )}
//             </Button>

//             <Button
//               variant="destructive"
//               className="gap-2"
//               onClick={handleResetTimetable}
//               disabled={isLocking}
//             >
//               <RefreshCw className="w-4 h-4" />
//               Reset
//             </Button>
//           </div>
//         </div>

//         {/* Lock Progress Dialog */}
//         <Dialog open={showLockProgress} onOpenChange={setShowLockProgress}>
//           <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
//             <DialogHeader>
//               <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
//                 {lockSuccess ? (
//                   <>
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                     Timetable Saved Successfully
//                   </>
//                 ) : (
//                   'Saving Timetable'
//                 )}
//               </DialogTitle>
//               <DialogDescription className="dark:text-gray-400">
//                 {lockSuccess 
//                   ? 'Your timetable has been locked and saved to the server.'
//                   : 'Please wait while we save your timetable. Do not close this window.'}
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="space-y-4 py-4">
//               {lockProgress.map((step, index) => (
//                 <div key={index} className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       {step.status === 'pending' && (
//                         <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
//                       )}
//                       {step.status === 'in-progress' && (
//                         <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
//                       )}
//                       {step.status === 'completed' && (
//                         <CheckCircle className="w-5 h-5 text-green-500" />
//                       )}
//                       {step.status === 'failed' && (
//                         <XCircle className="w-5 h-5 text-red-500" />
//                       )}
//                       <span className={cn(
//                         "text-sm font-medium",
//                         step.status === 'failed' ? "text-red-600 dark:text-red-400" : "dark:text-gray-300"
//                       )}>
//                         {step.step}
//                       </span>
//                     </div>
//                     {step.message && (
//                       <span className="text-xs text-gray-500 dark:text-gray-400">{step.message}</span>
//                     )}
//                   </div>
//                   {step.status === 'in-progress' && (
//                     <Progress value={50} className="h-1" />
//                   )}
//                   {step.error && (
//                     <p className="text-xs text-red-500 dark:text-red-400 mt-1">{step.error}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
            
//             <DialogFooter>
//               {lockSuccess && (
//                 <Button onClick={() => setShowLockProgress(false)}>
//                   Close
//                 </Button>
//               )}
//               {!lockSuccess && !isLocking && (
//                 <Button variant="outline" onClick={() => setShowLockProgress(false)}>
//                   Close
//                 </Button>
//               )}
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Reset Confirmation Dialog */}
//         <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
//           <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
//             <DialogHeader>
//               <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
//                 <AlertTriangle className="w-5 h-5 text-yellow-500" />
//                 Reset Timetable
//               </DialogTitle>
//               <DialogDescription className="dark:text-gray-400">
//                 This will delete all your saved data from the server. This action cannot be undone.
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="py-4">
//               <p className="text-sm text-gray-700 dark:text-gray-300">
//                 Are you sure you want to reset your timetable? All fixed commitments, free periods, sleep schedules, and tasks will be permanently deleted.
//               </p>
//             </div>
            
//             <DialogFooter className="gap-2">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowResetConfirm(false)}
//                 className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={confirmReset}
//               >
//                 Reset
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* View Mode Tabs */}
//         <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border dark:border-gray-700">
//           <div className="flex items-center gap-4">
//             <Button
//               variant={viewMode === 'grid' ? "default" : "outline"}
//               onClick={() => setViewMode('grid')}
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               <Grid className="w-4 h-4" />
//               Grid View
//             </Button>
//             <Button
//               variant={viewMode === 'pdf' ? "default" : "outline"}
//               onClick={() => setViewMode('pdf')}
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               <FileText className="w-4 h-4" />
//               PDF Preview
//             </Button>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <Button
//               variant={timeSettings.displayMode === 'vertical' ? "default" : "outline"}
//               onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               <Columns className="w-4 h-4" />
//               Vertical
//             </Button>
//             <Button
//               variant={timeSettings.displayMode === 'horizontal' ? "default" : "outline"}
//               onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
//               className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               <Rows className="w-4 h-4" />
//               Horizontal
//             </Button>
//           </div>
//         </div>

//         {viewMode === 'pdf' ? (
//           /* PDF Preview View - Placeholder */
//           <Card className="border-gray-200 dark:border-gray-700">
//             <CardContent className="p-12 text-center">
//               <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
//               <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">PDF Preview</h3>
//               <p className="text-gray-600 dark:text-gray-400 mb-6">
//                 This feature will be implemented soon
//               </p>
//               <Button onClick={() => setViewMode('grid')}>
//                 Back to Grid View
//               </Button>
//             </CardContent>
//           </Card>
//         ) : (
//           /* Regular Edit View */
//           <>
//             {/* Stats */}
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
//               {[
//                 { 
//                   label: 'Total Hours', 
//                   value: `${(tasks.filter(t => !t.isSleepTime).reduce((sum, task) => sum + task.duration, 0) / 60).toFixed(1)}h`, 
//                   icon: Clock,
//                   iconBg: 'bg-gray-100 dark:bg-gray-800',
//                   iconColor: 'text-gray-700 dark:text-gray-300'
//                 },
//                 { 
//                   label: 'Tasks Planned', 
//                   value: tasks.filter(t => !t.isSleepTime).length.toString(), 
//                   icon: Grid,
//                   iconBg: 'bg-blue-100 dark:bg-blue-900/30',
//                   iconColor: 'text-blue-600 dark:text-blue-400'
//                 },
//                 { 
//                   label: 'Goals Scheduled', 
//                   value: `${tasks.filter(t => t.goalId).length}/${goals.length}`, 
//                   icon: Target,
//                   iconBg: 'bg-green-100 dark:bg-green-900/30',
//                   iconColor: 'text-green-600 dark:text-green-400'
//                 },
//                 { 
//                   label: 'Milestones', 
//                   value: `${tasks.filter(t => t.milestoneId).length}/${goals.reduce((sum, g) => sum + g.milestones.length, 0)}`, 
//                   icon: CheckCircle2,
//                   iconBg: 'bg-purple-100 dark:bg-purple-900/30',
//                   iconColor: 'text-purple-600 dark:text-purple-400'
//                 },
//                 { 
//                   label: 'Sleep Hours', 
//                   value: `${sleepStats.totalSleepHours.toFixed(1)}h`, 
//                   icon: Moon,
//                   iconBg: 'bg-gray-100 dark:bg-gray-800',
//                   iconColor: 'text-gray-700 dark:text-gray-300'
//                 },
//                 { 
//                   label: 'Avg Sleep', 
//                   value: `${sleepStats.avgSleepHours.toFixed(1)}h`, 
//                   icon: Bed,
//                   iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
//                   iconColor: 'text-indigo-600 dark:text-indigo-400'
//                 },
//                 { 
//                   label: 'Fixed Commitments', 
//                   value: fixedTimes.length.toString(), 
//                   icon: Clock,
//                   iconBg: 'bg-orange-100 dark:bg-orange-900/30',
//                   iconColor: 'text-orange-600 dark:text-orange-400'
//                 },
//               ].map((stat, index) => (
//                 <motion.div
//                   key={stat.label}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   whileHover={{ scale: 1.02 }}
//                   className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className={`p-2 rounded-lg ${stat.iconBg}`}>
//                       <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
//                     </div>
//                     <div>
//                       <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Sleep Schedule Summary */}
//             {timeSettings.showSleepBlocks && sleepSchedules.length > 0 && (
//               <Card className="border-gray-200 dark:border-gray-700">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
//                         <Bed className="w-5 h-5 text-gray-700 dark:text-gray-300" />
//                       </div>
//                       <div>
//                         <h3 className="font-medium text-gray-900 dark:text-gray-100">Sleep Schedule</h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {sleepStats.daysWithSleep} days scheduled • Avg {sleepStats.avgSleepHours.toFixed(1)}h per night
//                           {sleepStats.avgSleepHours < 7 && ' • Consider getting more rest'}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-1 mr-2">
//                         <Switch
//                           checked={timeSettings.showSleepBlocks}
//                           onCheckedChange={(checked) => setTimeSettings({...timeSettings, showSleepBlocks: checked})}
//                           id="show-sleep"
//                         />
//                         <Label htmlFor="show-sleep" className="text-sm text-gray-600 dark:text-gray-400">
//                           Show in timetable
//                         </Label>
//                       </div>
//                       <Button 
//                         variant="outline" 
//                         size="sm"
//                         className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//                         onClick={() => setShowSleepScheduleModal(true)}
//                       >
//                         <Settings className="w-4 h-4 mr-2" />
//                         Adjust Schedule
//                       </Button>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
//                     {sleepSchedules.filter(s => s.isActive).slice(0, 4).map(schedule => {
//                       const sleepType = getSleepTypeInfo(schedule.type)
//                       const Icon = sleepType.icon
//                       return (
//                         <div key={schedule.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
//                           <div className="flex items-center gap-2 mb-1">
//                             <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400" />
//                             <span className="font-medium text-gray-800 dark:text-gray-300">
//                               {schedule.day.charAt(0) + schedule.day.slice(1).toLowerCase()}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2 text-sm">
//                             <Icon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
//                             <span className="text-gray-700 dark:text-gray-300">
//                               {formatTimeDisplay(schedule.bedtime)} - {formatTimeDisplay(schedule.wakeTime)}
//                             </span>
//                           </div>
//                           <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                             {Math.round(schedule.duration / 60)}h {schedule.duration % 60}m • {sleepType.label}
//                           </div>
//                         </div>
//                       )
//                     })}
//                     {sleepSchedules.filter(s => s.isActive).length > 4 && (
//                       <div className="p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
//                         <span className="text-sm text-gray-500 dark:text-gray-400">
//                           +{sleepSchedules.filter(s => s.isActive).length - 4} more days
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Time Extension Summary */}
//             {(timeSettings.extendedHours.morning || 
//               timeSettings.extendedHours.evening || 
//               timeSettings.extendedHours.night || 
//               timeSettings.extendedHours.custom.length > 0) && (
//               <Card className="border-yellow-200 dark:border-yellow-800">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
//                         <Clock className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />
//                       </div>
//                       <div>
//                         <h3 className="font-medium text-gray-900 dark:text-gray-100">Extended Hours</h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">Additional time slots added to your schedule</p>
//                       </div>
//                     </div>
//                     <Button 
//                       variant="outline" 
//                       size="sm"
//                       className="border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
//                       onClick={() => setShowTimeExtensionModal(true)}
//                     >
//                       <PlusCircle className="w-4 h-4 mr-2" />
//                       Add More
//                     </Button>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
//                     {timeSettings.extendedHours.morning && (
//                       <div className="p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
//                         <div className="flex items-center gap-2 mb-1">
//                           <div className="w-2 h-2 rounded-full bg-yellow-500 dark:bg-yellow-400" />
//                           <span className="font-medium text-yellow-800 dark:text-yellow-300">Morning</span>
//                         </div>
//                         <div className="text-sm text-yellow-700 dark:text-yellow-400">5:00 AM - 8:00 AM</div>
//                       </div>
//                     )}
                    
//                     {timeSettings.extendedHours.evening && (
//                       <div className="p-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
//                         <div className="flex items-center gap-2 mb-1">
//                           <div className="w-2 h-2 rounded-full bg-orange-500 dark:bg-orange-400" />
//                           <span className="font-medium text-orange-800 dark:text-orange-300">Evening</span>
//                         </div>
//                         <div className="text-sm text-orange-700 dark:text-orange-400">6:00 PM - 10:00 PM</div>
//                       </div>
//                     )}
                    
//                     {timeSettings.extendedHours.night && (
//                       <div className="p-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
//                         <div className="flex items-center gap-2 mb-1">
//                           <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400" />
//                           <span className="font-medium text-purple-800 dark:text-purple-300">Night</span>
//                         </div>
//                         <div className="text-sm text-purple-700 dark:text-purple-400">10:00 PM - 12:00 AM</div>
//                       </div>
//                     )}
                    
//                     {timeSettings.extendedHours.custom.length > 0 && (
//                       <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
//                         <div className="flex items-center gap-2 mb-2">
//                           <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
//                           <span className="font-medium text-blue-800 dark:text-blue-300">Custom Slots</span>
//                           <Badge className="ml-2 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
//                             {timeSettings.extendedHours.custom.length}
//                           </Badge>
//                         </div>
//                         <div className="text-sm text-blue-700 dark:text-blue-400">
//                           {timeSettings.extendedHours.custom.slice(0, 3).map(time => (
//                             <div key={time} className="flex items-center justify-between">
//                               <span>{formatTimeDisplay(time)}</span>
//                               <button
//                                 onClick={() => handleRemoveCustomTime(time)}
//                                 className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
//                               >
//                                 <X className="w-3 h-3" />
//                               </button>
//                             </div>
//                           ))}
//                           {timeSettings.extendedHours.custom.length > 3 && (
//                             <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
//                               +{timeSettings.extendedHours.custom.length - 3} more
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Fixed Commitments Summary */}
//             <Card className="dark:bg-gray-800 dark:border-gray-700">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Fixed Commitments</h3>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       Add your regular commitments (college, office, gym, etc.) to mark them as unavailable. 
//                       You can add free periods within these commitments for scheduling tasks.
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
//                       {fixedTimes.length} commitments
//                     </Badge>
//                     <Button 
//                       variant="outline" 
//                       size="sm"
//                       onClick={() => setShowAddFixedTimeModal(true)}
//                       className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                     >
//                       <Plus className="w-4 h-4 mr-2" />
//                       Add Fixed Commitment
//                     </Button>
//                   </div>
//                 </div>
                
//                 {fixedTimes.length === 0 ? (
//                   <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
//                     <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
//                       <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
//                     </div>
//                     <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">No Fixed Commitments Added</h4>
//                     <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
//                       Add your regular schedule items like college hours, office time, gym sessions, etc. 
//                       These will be marked as unavailable for scheduling tasks.
//                     </p>
//                     <Button 
//                       onClick={() => setShowAddFixedTimeModal(true)}
//                       className="gap-2"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Your First Fixed Commitment
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                     {fixedTimes.map((ft, index) => (
//                       <motion.div
//                         key={ft.id}
//                         initial={{ opacity: 0, scale: 0.95 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ delay: index * 0.1 }}
//                         className={`p-3 rounded-lg border ${getTimeSlotColor(ft.type)}`}
//                         onClick={() => handleFixedTimeClick(ft)}
//                       >
//                         <div className="flex items-start justify-between">
//                           <div className="flex items-start gap-3">
//                             <div 
//                               className="p-2 rounded-lg"
//                               style={{ backgroundColor: `${ft.color}20` }}
//                             >
//                               {getIconByType(ft.type)}
//                             </div>
//                             <div className="flex-1">
//                               <div className="font-medium dark:text-gray-200 mb-1">{ft.title}</div>
//                               <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//                                 {ft.days.map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(', ')} • {formatTimeDisplay(ft.startTime)} - {formatTimeDisplay(ft.endTime)}
//                               </div>
//                               {ft.description && (
//                                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{ft.description}</p>
//                               )}
//                               {(ft.freePeriods && ft.freePeriods.length > 0) && (
//                                 <div className="mt-2">
//                                   <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30 text-xs">
//                                     <Coffee className="w-2.5 h-2.5 mr-1" />
//                                     {ft.freePeriods.length} free period{ft.freePeriods.length > 1 ? 's' : ''}
//                                   </Badge>
//                                   <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                     Days: {[...new Set(ft.freePeriods.map(fp => fp.day.charAt(0) + fp.day.slice(1).toLowerCase()))].join(', ')}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
//                                 <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//                               </button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end" className="w-48 dark:bg-gray-800 dark:border-gray-700">
//                               <DropdownMenuItem 
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   setSelectedFixedTimeForFreePeriod(ft)
//                                   setNewFreePeriod({
//                                     ...newFreePeriod,
//                                     day: ft.days[0] || 'MONDAY'
//                                   })
//                                   setShowAddFreePeriodModal(true)
//                                 }}
//                                 className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
//                               >
//                                 <Coffee className="w-4 h-4" />
//                                 Add Free Period
//                               </DropdownMenuItem>
//                               <DropdownMenuItem 
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   handleEditFixedTime(ft)
//                                 }}
//                                 className="gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
//                               >
//                                 <Edit2 className="w-4 h-4" />
//                                 Edit Commitment
//                               </DropdownMenuItem>
//                               <DropdownMenuSeparator className="dark:bg-gray-700" />
//                               <DropdownMenuItem 
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   handleDeleteFixedTime(ft.id)
//                                 }}
//                                 className="gap-2 text-red-600 focus:text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                                 Delete
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </div>
//                       </motion.div>
//                     ))}
                    
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: fixedTimes.length * 0.1 }}
//                       className="p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
//                       onClick={() => setShowAddFixedTimeModal(true)}
//                     >
//                       <div className="flex flex-col items-center justify-center h-full py-4">
//                         <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
//                           <Plus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//                         </div>
//                         <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1">Add Fixed Commitment</h4>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
//                           Add college hours, office time, gym sessions, etc.
//                         </p>
//                       </div>
//                     </motion.div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Main Timetable Grid */}
//             <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700">
//               <CardContent className="p-0">
//                 {renderTimetableGrid()}
//               </CardContent>
//             </Card>

//             {/* Fixed Commitment Details Modal */}
//             {selectedFixedTime && (
//               <Dialog open={!!selectedFixedTime} onOpenChange={() => setSelectedFixedTime(null)}>
//                 <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800">
//                   <DialogHeader>
//                     <DialogTitle className="dark:text-gray-100">Fixed Commitment Details</DialogTitle>
//                     <DialogDescription className="dark:text-gray-400">
//                       View and manage your fixed commitment
//                     </DialogDescription>
//                   </DialogHeader>
                  
//                   <div className="space-y-6 py-4">
//                     <div className="flex items-center gap-4">
//                       <div 
//                         className="p-3 rounded-lg"
//                         style={{ backgroundColor: `${selectedFixedTime.color}20` }}
//                       >
//                         {getIconByType(selectedFixedTime.type)}
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-medium text-lg dark:text-gray-200">{selectedFixedTime.title}</h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {selectedFixedTime.days.map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(', ')} • {formatTimeDisplay(selectedFixedTime.startTime)} - {formatTimeDisplay(selectedFixedTime.endTime)}
//                         </p>
//                         <Badge 
//                           className="mt-2"
//                           style={{ 
//                             backgroundColor: `${selectedFixedTime.color}20`,
//                             color: selectedFixedTime.color
//                           }}
//                         >
//                           {selectedFixedTime.type}
//                         </Badge>
//                       </div>
//                     </div>
                    
//                     {selectedFixedTime.description && (
//                       <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                         <p className="text-sm text-gray-600 dark:text-gray-400">{selectedFixedTime.description}</p>
//                       </div>
//                     )}
                    
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <h4 className="font-medium dark:text-gray-200">Free Periods</h4>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                           onClick={() => {
//                             setSelectedFixedTimeForFreePeriod(selectedFixedTime)
//                             setNewFreePeriod({
//                               ...newFreePeriod,
//                               day: selectedFixedTime.days[0] || 'MONDAY'
//                             })
//                             setShowAddFreePeriodModal(true)
//                           }}
//                         >
//                           <Coffee className="w-3 h-3" />
//                           Add Free Period
//                         </Button>
//                       </div>
                      
//                       {(!selectedFixedTime.freePeriods || selectedFixedTime.freePeriods.length === 0) ? (
//                         <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center">
//                           <Coffee className="w-6 h-6 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
//                           <p className="text-sm text-gray-600 dark:text-gray-400">
//                             No free periods added. Add free periods to schedule tasks within this fixed commitment.
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="space-y-3">
//                           {Array.from(new Set(selectedFixedTime.freePeriods.map(fp => fp.day))).map(day => {
//                             const dayFreePeriods = selectedFixedTime.freePeriods?.filter(fp => fp.day === day) || []
//                             return (
//                               <div key={day} className="space-y-2">
//                                 <div className="flex items-center justify-between">
//                                   <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                     {day.charAt(0) + day.slice(1).toLowerCase()}
//                                   </h5>
//                                   <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">
//                                     {dayFreePeriods.length} period{dayFreePeriods.length > 1 ? 's' : ''}
//                                   </Badge>
//                                 </div>
//                                 {dayFreePeriods.map((fp, index) => (
//                                   <div key={fp.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
//                                     <div className="flex items-center justify-between">
//                                       <div className="flex items-center gap-2">
//                                         <Coffee className="w-4 h-4 text-green-600 dark:text-green-400" />
//                                         <span className="font-medium text-green-700 dark:text-green-400">{fp.title}</span>
//                                       </div>
//                                       <button
//                                         onClick={() => {
//                                           const updatedFreePeriods = selectedFixedTime.freePeriods?.filter(f => f.id !== fp.id) || []
//                                           handleSaveFixedTime({
//                                             ...selectedFixedTime,
//                                             freePeriods: updatedFreePeriods
//                                           })
//                                         }}
//                                         className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
//                                       >
//                                         <X className="w-3 h-3 text-red-500 dark:text-red-400" />
//                                       </button>
//                                     </div>
//                                     <div className="text-sm text-green-600 dark:text-green-400 mt-1">
//                                       {formatTimeDisplay(fp.startTime)} - {formatTimeDisplay(fp.endTime)} ({fp.duration} minutes)
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )
//                           })}
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="space-y-3">
//                       <h4 className="font-medium dark:text-gray-200">Tasks in Free Periods</h4>
//                       {tasks.filter(t => t.fixedCommitmentId === selectedFixedTime.id && !t.isSleepTime).length === 0 ? (
//                         <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                           <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
//                             No tasks scheduled in free periods yet
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="space-y-2">
//                           {tasks
//                             .filter(t => t.fixedCommitmentId === selectedFixedTime.id && !t.isSleepTime)
//                             .map(task => (
//                               <div key={task.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
//                                 <div className="flex items-center justify-between">
//                                   <div>
//                                     <div className="font-medium text-sm dark:text-gray-200">{task.title}</div>
//                                     <div className="text-xs text-gray-600 dark:text-gray-400">
//                                       {task.day.charAt(0) + task.day.slice(1).toLowerCase()} • {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
//                                     </div>
//                                   </div>
//                                   <Badge 
//                                     className="text-xs"
//                                     style={{ backgroundColor: `${task.color}20`, color: task.color }}
//                                   >
//                                     {task.subject}
//                                   </Badge>
//                                 </div>
//                               </div>
//                             ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   <DialogFooter className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       onClick={() => setSelectedFixedTime(null)}
//                       className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                     >
//                       Close
//                     </Button>
//                     <Button
//                       variant="outline"
//                       onClick={() => {
//                         handleEditFixedTime(selectedFixedTime)
//                         setSelectedFixedTime(null)
//                       }}
//                       className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                     >
//                       Edit Commitment
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             )}

//             {/* Task Pool with Goals */}
//             <Card className="dark:bg-gray-800 dark:border-gray-700">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-1">Task Pool & Goals</h3>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       Drag tasks or goals to schedule them in your timetable
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Button 
//                       onClick={() => {
//                         setShowTaskCreationDialog(true)
//                         setTaskCreationContext({ day: 'MONDAY', time: '09:00' })
//                       }}
//                       className="gap-2"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Task
//                     </Button>
//                     <Button 
//                       variant="outline"
//                       onClick={() => setShowTimeExtensionModal(true)}
//                       className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                     >
//                       <PlusCircle className="w-4 h-4" />
//                       Add Time Slots
//                     </Button>
//                     <Button 
//                       variant="outline"
//                       onClick={() => setShowGoalsModal(true)}
//                       className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                     >
//                       <Target className="w-4 h-4" />
//                       Schedule Goals
//                     </Button>
//                     <Button 
//                       variant="outline"
//                       onClick={() => setShowSleepScheduleModal(true)}
//                       className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                     >
//                       <Bed className="w-4 h-4" />
//                       Sleep
//                     </Button>
//                   </div>
//                 </div>

//                 <Tabs defaultValue="goals" className="mb-6">
//                   <TabsList className="dark:bg-gray-800 dark:border-gray-700">
//                     <TabsTrigger value="goals" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
//                       Goals & Milestones
//                     </TabsTrigger>
//                     <TabsTrigger value="tasks" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
//                       Quick Tasks
//                     </TabsTrigger>
//                     <TabsTrigger value="sleep" className="dark:data-[state=active]:bg-gray-700 dark:text-gray-300">
//                       Sleep Tips
//                     </TabsTrigger>
//                   </TabsList>
                  
//                   <TabsContent value="goals" className="mt-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                       {goals.map(goal => (
//                         <div key={goal.id} className="space-y-2">
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-move hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition-all"
//                             draggable={!isLocked}
//                             onDragStart={(e) => {
//                               e.dataTransfer.setData('text/plain', goal.id)
//                               e.dataTransfer.setData('type', 'goal')
//                               e.dataTransfer.effectAllowed = 'move'
//                             }}
//                           >
//                             <div className="flex items-start justify-between mb-2">
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-2 mb-1">
//                                   <div 
//                                     className="w-2 h-2 rounded-full"
//                                     style={{ backgroundColor: goal.color }}
//                                   />
//                                   <h4 className="font-medium text-sm dark:text-gray-200">{goal.title}</h4>
//                                 </div>
//                                 <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
//                                   Progress: {goal.progress}% • {goal.completedHours.toFixed(1)}/{goal.totalHours}h
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                   <Badge className={getPriorityColor(goal.priority)}>
//                                     {goal.priority}
//                                   </Badge>
//                                   <span className="text-xs text-gray-500 dark:text-gray-400">
//                                     {goal.milestones.length} milestones
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           </motion.div>
                          
//                           <div className="space-y-1 ml-4">
//                             {goal.milestones.map(milestone => (
//                               <motion.div
//                                 key={milestone.id}
//                                 initial={{ opacity: 0, x: -10 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-move hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-sm transition-all"
//                                 draggable={!isLocked}
//                                 onDragStart={(e) => {
//                                   e.dataTransfer.setData('text/plain', milestone.id)
//                                   e.dataTransfer.setData('goalId', goal.id)
//                                   e.dataTransfer.setData('type', 'milestone')
//                                   e.dataTransfer.effectAllowed = 'move'
//                                 }}
//                               >
//                                 <div className="flex items-center justify-between">
//                                   <div className="flex items-center gap-2">
//                                     <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
//                                     <span className="text-xs font-medium dark:text-gray-300 truncate flex-1">
//                                       {milestone.title}
//                                     </span>
//                                   </div>
//                                   <div className="flex items-center gap-1">
//                                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                                       {milestone.progress}%
//                                     </span>
//                                     <button
//                                       onClick={() => handleScheduleMilestone(goal, milestone)}
//                                       className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
//                                       title="Schedule this milestone"
//                                     >
//                                       <ArrowRight className="w-3 h-3 text-gray-500 dark:text-gray-400" />
//                                     </button>
//                                   </div>
//                                 </div>
//                               </motion.div>
//                             ))}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </TabsContent>
                  
//                   <TabsContent value="tasks" className="mt-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                       {getTaskPool().map((task, index) => (
//                         <motion.div
//                           key={task.id}
//                           initial={{ opacity: 0, scale: 0.95 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           transition={{ delay: index * 0.1 }}
//                           className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-move hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition-all"
//                           draggable={!isLocked}
//                           onDragStart={(e) => {
//                             e.dataTransfer.setData('text/plain', task.id)
//                             e.dataTransfer.setData('duration', task.duration.toString())
//                             e.dataTransfer.effectAllowed = 'move'
//                           }}
//                         >
//                           <div className="flex items-start justify-between mb-2">
//                             <div className="font-medium text-sm dark:text-gray-200">{task.title}</div>
//                             <div 
//                               className="w-3 h-3 rounded-full"
//                               style={{ backgroundColor: task.color }}
//                             />
//                           </div>
//                           <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
//                             <span>{task.subject}</span>
//                             <span>{task.duration} minutes</span>
//                           </div>
//                           <div className="mt-2">
//                             <Badge 
//                               className={
//                                 task.priority === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
//                                 task.priority === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
//                                 task.priority === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
//                                 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
//                               }
//                             >
//                               {task.priority}
//                             </Badge>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </div>
//                   </TabsContent>
                  
//                   <TabsContent value="sleep" className="mt-4">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                       <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
//                         <div className="flex items-center gap-3 mb-2">
//                           <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
//                             <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                           </div>
//                           <div>
//                             <h4 className="font-medium dark:text-gray-200">7-9 Hours</h4>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">Recommended for adults</p>
//                           </div>
//                         </div>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Most adults need 7-9 hours of sleep per night for optimal health and cognitive function.
//                         </p>
//                       </div>
                      
//                       <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
//                         <div className="flex items-center gap-3 mb-2">
//                           <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
//                             <AlarmClock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//                           </div>
//                           <div>
//                             <h4 className="font-medium dark:text-gray-200">Consistent Schedule</h4>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">Even on weekends</p>
//                           </div>
//                         </div>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Going to bed and waking up at the same time helps regulate your body's internal clock.
//                         </p>
//                       </div>
                      
//                       <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
//                         <div className="flex items-center gap-3 mb-2">
//                           <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
//                             <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
//                           </div>
//                           <div>
//                             <h4 className="font-medium dark:text-gray-200">Power Naps</h4>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">15-20 minutes</p>
//                           </div>
//                         </div>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Short naps can boost alertness and performance without interfering with nighttime sleep.
//                         </p>
//                       </div>
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//               </CardContent>
//             </Card>
//           </>
//         )}
//       </motion.div>

//       {/* Sleep Schedule Dialog */}
//       <Dialog open={showSleepScheduleModal} onOpenChange={setShowSleepScheduleModal}>
//         <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
//           <DialogHeader className="flex-shrink-0">
//             <DialogTitle className="dark:text-gray-100">Sleep Schedule</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Manage your sleep schedule for each day
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//             <div className="flex items-center justify-between mb-2">
//               <Label htmlFor="auto-lock-sleep" className="text-sm font-medium dark:text-gray-300">
//                 Auto-lock sleep hours
//               </Label>
//               <Switch
//                 id="auto-lock-sleep"
//                 checked={timeSettings.autoLockSleep}
//                 onCheckedChange={(checked) => setTimeSettings({...timeSettings, autoLockSleep: checked})}
//               />
//             </div>
            
//             <div className="space-y-3">
//               {days.map(day => {
//                 const schedule = sleepSchedules.find(s => s.day === day) || {
//                   id: `temp-${day}`,
//                   day,
//                   bedtime: '23:00',
//                   wakeTime: '07:00',
//                   duration: 480,
//                   isActive: true,
//                   color: '#4B5563',
//                   type: 'REGULAR' as const
//                 }
                
//                 return (
//                   <div key={day} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-medium dark:text-gray-200">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
//                       <Switch
//                         checked={schedule.isActive}
//                         onCheckedChange={(checked) => {
//                           const updatedSchedule = { ...schedule, isActive: checked }
//                           handleSaveSleepSchedule(updatedSchedule)
//                         }}
//                       />
//                     </div>
                    
//                     {schedule.isActive && (
//                       <>
//                         <div className="grid grid-cols-2 gap-2 mb-2">
//                           <div>
//                             <Label className="text-xs dark:text-gray-400">Bedtime</Label>
//                             <Input
//                               type="time"
//                               value={schedule.bedtime}
//                               onChange={(e) => {
//                                 const updatedSchedule = { 
//                                   ...schedule, 
//                                   bedtime: e.target.value,
//                                   duration: calculateDuration(e.target.value, schedule.wakeTime)
//                                 }
//                                 handleSaveSleepSchedule(updatedSchedule)
//                               }}
//                               className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                             />
//                           </div>
//                           <div>
//                             <Label className="text-xs dark:text-gray-400">Wake Time</Label>
//                             <Input
//                               type="time"
//                               value={schedule.wakeTime}
//                               onChange={(e) => {
//                                 const updatedSchedule = { 
//                                   ...schedule, 
//                                   wakeTime: e.target.value,
//                                   duration: calculateDuration(schedule.bedtime, e.target.value)
//                                 }
//                                 handleSaveSleepSchedule(updatedSchedule)
//                               }}
//                               className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                             />
//                           </div>
//                         </div>
                        
//                         <div className="mb-2">
//                           <Label className="text-xs dark:text-gray-400">Type</Label>
//                           <Select
//                             value={schedule.type}
//                             onValueChange={(value: any) => {
//                               const updatedSchedule = { ...schedule, type: value }
//                               handleSaveSleepSchedule(updatedSchedule)
//                             }}
//                           >
//                             <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                               {SLEEP_TYPES.map(type => (
//                                 <SelectItem key={type.id} value={type.id} className="dark:text-gray-300 dark:hover:bg-gray-700">
//                                   {type.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
                        
//                         <div>
//                           <Label className="text-xs dark:text-gray-400">Notes (Optional)</Label>
//                           <Input
//                             value={schedule.notes || ''}
//                             onChange={(e) => {
//                               const updatedSchedule = { ...schedule, notes: e.target.value }
//                               handleSaveSleepSchedule(updatedSchedule)
//                             }}
//                             placeholder="Add notes..."
//                             className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                           />
//                         </div>
                        
//                         <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
//                           Duration: {Math.floor(schedule.duration / 60)}h {schedule.duration % 60}m
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
          
//           <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
//             <Button onClick={() => setShowSleepScheduleModal(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Task Creation Dialog with Options */}
//       <Dialog open={showTaskCreationDialog} onOpenChange={(open) => {
//         setShowTaskCreationDialog(open)
//         if (!open) {
//           setTaskCreationContext(null)
//           resetTaskForm()
//         }
//       }}>
//         <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
//           <DialogHeader>
//             <DialogTitle className="dark:text-gray-100">
//               Add Task to {taskCreationContext?.day.charAt(0) + taskCreationContext?.day.slice(1).toLowerCase()} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
//             </DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Choose how you want to add this task
//             </DialogDescription>
//           </DialogHeader>
          
//           {taskCreationFlow === 'simple' ? (
//             <div className="space-y-4 py-4">
//               <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4">
//                 <p className="text-sm text-gray-700 dark:text-gray-300">
//                   <span className="font-medium">Time Slot:</span> {taskCreationContext?.day.charAt(0) + taskCreationContext?.day.slice(1).toLowerCase()} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
//                 </p>
//                 <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                   Task will be scheduled starting at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
//                 </p>
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Task Title *</label>
//                 <Input
//                   placeholder="e.g., Study React, Complete Assignment"
//                   value={newTask.title}
//                   onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Subject</label>
//                   <Input
//                     placeholder="e.g., DSA, Web Dev"
//                     value={newTask.subject}
//                     onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Duration</label>
//                   <Select
//                     value={newTask.duration.toString()}
//                     onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
//                   >
//                     <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                       <SelectValue placeholder="Select duration" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                       <SelectItem value={timeSettings.interval.toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval} minutes</SelectItem>
//                       <SelectItem value={(timeSettings.interval * 2).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 2} minutes</SelectItem>
//                       <SelectItem value={(timeSettings.interval * 3).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 3} minutes</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Priority</label>
//                 <Select
//                   value={newTask.priority}
//                   onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
//                 >
//                   <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                     <SelectValue placeholder="Select priority" />
//                   </SelectTrigger>
//                   <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                     <SelectItem value="LOW" className="dark:text-gray-300 dark:hover:bg-gray-700">Low</SelectItem>
//                     <SelectItem value="MEDIUM" className="dark:text-gray-300 dark:hover:bg-gray-700">Medium</SelectItem>
//                     <SelectItem value="HIGH" className="dark:text-gray-300 dark:hover:bg-gray-700">High</SelectItem>
//                     <SelectItem value="CRITICAL" className="dark:text-gray-300 dark:hover:bg-gray-700">Critical</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Notes (Optional)</label>
//                 <Textarea
//                   placeholder="Add any notes..."
//                   value={newTask.note}
//                   onChange={(e) => setNewTask({...newTask, note: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   rows={2}
//                 />
//               </div>
              
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setTaskCreationFlow('withGoal')
//                     if (taskCreationContext) {
//                       setNewTask({
//                         ...newTask,
//                         day: taskCreationContext.day,
//                         startTime: taskCreationContext.time,
//                         duration: timeSettings.interval
//                       })
//                     }
//                   }}
//                   className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                 >
//                   <Target className="w-4 h-4 mr-2" />
//                   Link to Goal
//                 </Button>
//                 <Button
//                   onClick={() => handleAddTaskToCell('simple')}
//                   className="flex-1"
//                   disabled={!newTask.title.trim()}
//                 >
//                   Add Task
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4 py-4">
//               <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4">
//                 <p className="text-sm text-gray-700 dark:text-gray-300">
//                   <span className="font-medium">Time Slot:</span> {taskCreationContext?.day.charAt(0) + taskCreationContext?.day.slice(1).toLowerCase()} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
//                 </p>
//                 <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                   Link this task to a goal or milestone to track progress
//                 </p>
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Task Title *</label>
//                 <Input
//                   placeholder="e.g., Study React, Complete Assignment"
//                   value={newTask.title}
//                   onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Subject</label>
//                   <Input
//                     placeholder="e.g., DSA, Web Dev"
//                     value={newTask.subject}
//                     onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Duration</label>
//                   <Select
//                     value={newTask.duration.toString()}
//                     onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
//                   >
//                     <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                       <SelectValue placeholder="Select duration" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                       <SelectItem value={timeSettings.interval.toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval} minutes</SelectItem>
//                       <SelectItem value={(timeSettings.interval * 2).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 2} minutes</SelectItem>
//                       <SelectItem value={(timeSettings.interval * 3).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 3} minutes</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Priority</label>
//                 <Select
//                   value={newTask.priority}
//                   onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
//                 >
//                   <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                     <SelectValue placeholder="Select priority" />
//                   </SelectTrigger>
//                   <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                     <SelectItem value="LOW" className="dark:text-gray-300 dark:hover:bg-gray-700">Low</SelectItem>
//                     <SelectItem value="MEDIUM" className="dark:text-gray-300 dark:hover:bg-gray-700">Medium</SelectItem>
//                     <SelectItem value="HIGH" className="dark:text-gray-300 dark:hover:bg-gray-700">High</SelectItem>
//                     <SelectItem value="CRITICAL" className="dark:text-gray-300 dark:hover:bg-gray-700">Critical</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Link to Goal (Optional)</label>
//                 <Select
//                   value={newTask.goalId}
//                   onValueChange={(value) => {
//                     setNewTask({
//                       ...newTask,
//                       goalId: value,
//                       milestoneId: ''
//                     })
//                   }}
//                 >
//                   <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                     <SelectValue placeholder="Select a goal" />
//                   </SelectTrigger>
//                   <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                     <SelectItem value="no-goal" className="dark:text-gray-300 dark:hover:bg-gray-700">No Goal (Independent Task)</SelectItem>
//                     {goals.map(goal => (
//                       <SelectItem key={goal.id} value={goal.id} className="dark:text-gray-300 dark:hover:bg-gray-700">
//                         <div className="flex items-center gap-2">
//                           <div 
//                             className="w-2 h-2 rounded-full"
//                             style={{ backgroundColor: goal.color }}
//                           />
//                           {goal.title}
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {newTask.goalId && newTask.goalId !== 'no-goal' && (
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Link to Milestone (Optional)</label>
//                   <Select
//                     value={newTask.milestoneId}
//                     onValueChange={(value) => setNewTask({...newTask, milestoneId: value})}
//                   >
//                     <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                       <SelectValue placeholder="Select a milestone" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                       <SelectItem value="no-milestone" className="dark:text-gray-300 dark:hover:bg-gray-700">No Milestone (General Goal Task)</SelectItem>
//                       {goals
//                         .find(g => g.id === newTask.goalId)
//                         ?.milestones.map(milestone => (
//                           <SelectItem key={milestone.id} value={milestone.id} className="dark:text-gray-300 dark:hover:bg-gray-700">
//                             <div className="flex items-center gap-2">
//                               <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
//                               {milestone.title}
//                             </div>
//                           </SelectItem>
//                         ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Notes (Optional)</label>
//                 <Textarea
//                   placeholder="Add any notes..."
//                   value={newTask.note}
//                   onChange={(e) => setNewTask({...newTask, note: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   rows={2}
//                 />
//               </div>
              
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => setTaskCreationFlow('simple')}
//                   className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                 >
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Simple Task
//                 </Button>
//                 <Button
//                   onClick={() => handleAddTaskToCell('withGoal')}
//                   className="flex-1"
//                   disabled={!newTask.title.trim()}
//                 >
//                   {newTask.goalId && newTask.goalId !== 'no-goal' ? 'Add Task with Goal' : 'Add Task'}
//                 </Button>
//               </div>
//             </div>
//           )}
          
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowTaskCreationDialog(false)
//                 setTaskCreationContext(null)
//                 resetTaskForm()
//               }}
//               className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Goals Modal */}
//       <Dialog open={showGoalsModal} onOpenChange={setShowGoalsModal}>
//         <DialogContent className="sm:max-w-4xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
//           <DialogHeader className="flex-shrink-0">
//             <DialogTitle className="dark:text-gray-100">Schedule Goals & Milestones</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Schedule tasks from your goals directly into your timetable
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-6 py-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//             {goals.map(goal => (
//               <div key={goal.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <div 
//                       className="w-3 h-3 rounded-full"
//                       style={{ backgroundColor: goal.color }}
//                     />
//                     <div>
//                       <h3 className="font-medium dark:text-gray-200">{goal.title}</h3>
//                       <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                         <span>{goal.progress}% complete</span>
//                         <span>•</span>
//                         <span>{goal.completedHours.toFixed(1)}/{goal.totalHours}h</span>
//                         <span>•</span>
//                         <span>{getDaysUntilDeadline(goal.targetDate)} days left</span>
//                       </div>
//                     </div>
//                   </div>
//                   <Badge className={getPriorityColor(goal.priority)}>
//                     {goal.priority}
//                   </Badge>
//                 </div>
                
//                 <div className="mb-4">
//                   <div className="flex items-center justify-between text-sm mb-1">
//                     <span className="text-gray-600 dark:text-gray-400">Progress</span>
//                     <span className="font-medium dark:text-gray-300">{goal.progress}%</span>
//                   </div>
//                   <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                     <div 
//                       className="h-full rounded-full"
//                       style={{ 
//                         width: `${goal.progress}%`,
//                         backgroundColor: goal.color
//                       }}
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-3">
//                   <h4 className="font-medium dark:text-gray-200 mb-2">Milestones</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {goal.milestones.map(milestone => {
//                       const isScheduled = tasks.some(t => 
//                         t.goalId === goal.id && t.milestoneId === milestone.id
//                       )
                      
//                       return (
//                         <div 
//                           key={milestone.id}
//                           className={`p-3 rounded-lg border ${isScheduled ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'}`}
//                         >
//                           <div className="flex items-start justify-between mb-2">
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
//                                 <h5 className="font-medium text-sm dark:text-gray-200">{milestone.title}</h5>
//                               </div>
//                               <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
//                                 {milestone.description}
//                               </p>
//                             </div>
//                             <div className="flex items-center gap-1">
//                               <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
//                                 {milestone.progress}%
//                               </span>
//                               {isScheduled && (
//                                 <Badge className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
//                                   Scheduled
//                                 </Badge>
//                               )}
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center justify-between mt-2">
//                             <div className="text-xs text-gray-500 dark:text-gray-400">
//                               {milestone.completedHours.toFixed(1)}/{milestone.scheduledHours}h
//                             </div>
//                             <div className="flex items-center gap-2">
//                               {milestone.completed ? (
//                                 <Badge className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
//                                   <CheckCircle2 className="w-3 h-3 mr-1" />
//                                   Completed
//                                 </Badge>
//                               ) : (
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   className="h-6 px-2 text-xs dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                                   onClick={() => handleScheduleMilestone(goal, milestone)}
//                                 >
//                                   <Calendar className="w-3 h-3 mr-1" />
//                                   Schedule
//                                 </Button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>
                
//                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-gray-600 dark:text-gray-400">
//                       {goal?.tasks?.length || 0} tasks scheduled from this goal
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                       onClick={() => {
//                         const task: TimeSlot = {
//                           id: `task-${Date.now()}`,
//                           title: goal.title,
//                           subject: goal.subject || goal.title,
//                           startTime: '10:00',
//                           endTime: '11:00',
//                           duration: 60,
//                           priority: goal.priority,
//                           color: goal.color,
//                           day: 'MONDAY',
//                           type: 'task',
//                           goalId: goal.id,
//                           status: 'PENDING'
//                         }
//                         setTasks([...tasks, task])
//                         toast.success(`Scheduled "${goal.title}" for Monday at 10:00 AM`)
//                       }}
//                     >
//                       <Plus className="w-4 h-4 mr-2" />
//                       Schedule Goal Task
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
//             <Button
//               variant="outline"
//               onClick={() => setShowGoalsModal(false)}
//               className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               Close
//             </Button>
//             <Button onClick={() => {
//               const newTasks: TimeSlot[] = []
//               goals.forEach(goal => {
//                 goal.milestones.forEach(milestone => {
//                   if (!milestone.completed && !tasks.some(t => t.milestoneId === milestone.id)) {
//                     const task: TimeSlot = {
//                       id: `task-${Date.now()}`,
//                       title: milestone.title,
//                       subject: goal.subject || goal.title,
//                       startTime: '10:00',
//                       endTime: '11:00',
//                       duration: 60,
//                       priority: goal.priority,
//                       color: goal.color,
//                       day: 'MONDAY',
//                       type: 'task',
//                       goalId: goal.id,
//                       milestoneId: milestone.id,
//                       status: 'PENDING'
//                     }
//                     newTasks.push(task)
//                   }
//                 })
//               })
              
//               if (newTasks.length > 0) {
//                 setTasks([...tasks, ...newTasks])
//                 toast.success(`Scheduled ${newTasks.length} milestones for Monday at 10:00 AM`)
//               } else {
//                 toast.info('All milestones are already scheduled or completed!')
//               }
//             }}>
//               <Zap className="w-4 h-4 mr-2" />
//               Auto-Schedule All
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Schedule Milestone Modal */}
//       <Dialog open={!!selectedGoalForMilestone} onOpenChange={() => setSelectedGoalForMilestone(null)}>
//         <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
//           <DialogHeader>
//             <DialogTitle className="dark:text-gray-100">Schedule Milestone from {selectedGoalForMilestone?.title}</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Select a milestone to schedule in your timetable
//             </DialogDescription>
//           </DialogHeader>
          
//           {selectedGoalForMilestone && (
//             <div className="space-y-4 py-4">
//               <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                 <p className="text-sm text-gray-700 dark:text-gray-300">
//                   <span className="font-medium">Goal:</span> {selectedGoalForMilestone.title}
//                 </p>
//                 <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                   {selectedGoalForMilestone.progress}% complete • {selectedGoalForMilestone.completedHours.toFixed(1)}/{selectedGoalForMilestone.totalHours}h
//                 </p>
//               </div>
              
//               <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//                 {selectedGoalForMilestone.milestones.map(milestone => {
//                   const isScheduled = tasks.some(t => t.milestoneId === milestone.id)
                  
//                   return (
//                     <div 
//                       key={milestone.id}
//                       className={`p-3 rounded-lg border ${isScheduled ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer'}`}
//                       onClick={() => !isScheduled && handleScheduleMilestone(selectedGoalForMilestone, milestone)}
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-1">
//                             <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
//                             <h5 className="font-medium text-sm dark:text-gray-200">{milestone.title}</h5>
//                           </div>
//                           <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
//                             {milestone.description}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
//                             {milestone.progress}%
//                           </span>
//                           {isScheduled && (
//                             <Badge className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
//                               Scheduled
//                             </Badge>
//                           )}
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center justify-between mt-2">
//                         <div className="text-xs text-gray-500 dark:text-gray-400">
//                           {milestone.completedHours.toFixed(1)}/{milestone.scheduledHours}h
//                         </div>
//                         {milestone.completed ? (
//                           <Badge className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
//                             <CheckCircle2 className="w-3 h-3 mr-1" />
//                             Completed
//                           </Badge>
//                         ) : isScheduled ? (
//                           <Badge className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
//                             <Calendar className="w-3 h-3 mr-1" />
//                             Scheduled
//                           </Badge>
//                         ) : (
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             className="h-6 px-2 text-xs dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                           >
//                             <ArrowRight className="w-3 h-3 mr-1" />
//                             Schedule
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
              
//               <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
//                 <p className="text-sm text-yellow-700 dark:text-yellow-400">
//                   Click on a milestone to schedule it. It will be added to your timetable for Monday at 10:00 AM by default.
//                 </p>
//               </div>
//             </div>
//           )}
          
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setSelectedGoalForMilestone(null)}
//               className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               Close
//             </Button>
//             <Button
//               onClick={() => {
//                 if (selectedGoalForMilestone) {
//                   const incompleteMilestone = selectedGoalForMilestone.milestones.find(m => !m.completed && !tasks.some(t => t.milestoneId === m.id))
//                   if (incompleteMilestone) {
//                     handleScheduleMilestone(selectedGoalForMilestone, incompleteMilestone)
//                   } else {
//                     toast.info('All milestones are already scheduled or completed!')
//                   }
//                 }
//               }}
//             >
//               <Zap className="w-4 h-4 mr-2" />
//               Schedule Next Milestone
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Time Extension Modal */}
//       <Dialog open={showTimeExtensionModal} onOpenChange={setShowTimeExtensionModal}>
//         <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
//           <DialogHeader>
//             <DialogTitle className="dark:text-gray-100">Extend Time Slots</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Add additional time slots to your schedule
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-6 py-4">
//             <div className="space-y-4">
//               <h3 className="font-medium dark:text-gray-200">Quick Extensions</h3>
//               <div className="grid grid-cols-2 gap-3">
//                 <Button
//                   variant={timeSettings.extendedHours.morning ? "default" : "outline"}
//                   onClick={() => handleExtendTime('morning')}
//                   className="flex-col h-auto py-3"
//                 >
//                   <Sunrise className="w-5 h-5 mb-1" />
//                   <span className="text-xs">Morning</span>
//                   <span className="text-[10px] opacity-75">5 AM - 8 AM</span>
//                 </Button>
                
//                 <Button
//                   variant={timeSettings.extendedHours.evening ? "default" : "outline"}
//                   onClick={() => handleExtendTime('evening')}
//                   className="flex-col h-auto py-3"
//                 >
//                   <Sunset className="w-5 h-5 mb-1" />
//                   <span className="text-xs">Evening</span>
//                   <span className="text-[10px] opacity-75">6 PM - 10 PM</span>
//                 </Button>
                
//                 <Button
//                   variant={timeSettings.extendedHours.night ? "default" : "outline"}
//                   onClick={() => handleExtendTime('night')}
//                   className="flex-col h-auto py-3 col-span-2"
//                 >
//                   <MoonStar className="w-5 h-5 mb-1" />
//                   <span className="text-xs">Night</span>
//                   <span className="text-[10px] opacity-75">10 PM - 12 AM</span>
//                 </Button>
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <h3 className="font-medium dark:text-gray-200">Custom Time Slot</h3>
//               <div className="flex gap-2">
//                 <Input
//                   type="time"
//                   placeholder="HH:MM"
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   id="custom-time"
//                 />
//                 <Button 
//                   onClick={() => {
//                     const input = document.getElementById('custom-time') as HTMLInputElement
//                     if (input.value) {
//                       handleAddCustomTime(input.value)
//                       input.value = ''
//                     }
//                   }}
//                 >
//                   Add
//                 </Button>
//               </div>
              
//               {timeSettings.extendedHours.custom.length > 0 && (
//                 <div className="space-y-2">
//                   <Label className="text-sm dark:text-gray-300">Added Slots</Label>
//                   <div className="flex flex-wrap gap-2">
//                     {timeSettings.extendedHours.custom.map(time => (
//                       <Badge key={time} variant="secondary" className="px-2 py-1 gap-1">
//                         {formatTimeDisplay(time)}
//                         <button
//                           onClick={() => handleRemoveCustomTime(time)}
//                           className="ml-1 hover:text-red-500"
//                         >
//                           <X className="w-3 h-3" />
//                         </button>
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setShowTimeExtensionModal(false)}
//               className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Add Fixed Time Modal */}
//       <Dialog open={showAddFixedTimeModal} onOpenChange={setShowAddFixedTimeModal}>
//         <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
//           <DialogHeader className="flex-shrink-0">
//             <DialogTitle className="dark:text-gray-100">Add Fixed Commitment</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Add your regular commitments like college hours, office time, gym sessions, etc.
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-6 py-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//             <div>
//               <label className="text-sm font-medium mb-2 block dark:text-gray-300">Title *</label>
//               <Input
//                 placeholder="e.g., College Hours, Office Time, Gym Session"
//                 value={newFixedTime.title}
//                 onChange={(e) => setNewFixedTime({...newFixedTime, title: e.target.value})}
//                 className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//               />
//             </div>
            
//             <div>
//               <label className="text-sm font-medium mb-2 block dark:text-gray-300">Description (Optional)</label>
//               <Textarea
//                 placeholder="Brief description of this commitment"
//                 value={newFixedTime.description}
//                 onChange={(e) => setNewFixedTime({...newFixedTime, description: e.target.value})}
//                 className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 rows={2}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time *</label>
//                 <Input
//                   type="time"
//                   value={newFixedTime.startTime}
//                   onChange={(e) => setNewFixedTime({...newFixedTime, startTime: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">End Time *</label>
//                 <Input
//                   type="time"
//                   value={newFixedTime.endTime}
//                   onChange={(e) => setNewFixedTime({...newFixedTime, endTime: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-medium mb-2 block dark:text-gray-300">Type *</label>
//               <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//                 {FIXED_TIME_TYPES.filter(t => t.id !== 'SLEEP').map((type) => {
//                   const Icon = type.icon
//                   const isSelected = newFixedTime.type === type.id
//                   return (
//                     <button
//                       key={type.id}
//                       type="button"
//                       onClick={() => setNewFixedTime({...newFixedTime, type: type.id as FixedTime['type'], color: type.color})}
//                       className={cn(
//                         "flex flex-col items-center justify-center p-3 rounded-lg border transition-all",
//                         isSelected 
//                           ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500" 
//                           : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
//                       )}
//                     >
//                       <div 
//                         className="p-2 rounded-lg mb-2"
//                         style={{ backgroundColor: `${type.color}20` }}
//                       >
//                         <Icon className="w-5 h-5" style={{ color: type.color }} />
//                       </div>
//                       <span className={cn(
//                         "text-xs text-center",
//                         isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400"
//                       )}>
//                         {type.label}
//                       </span>
//                     </button>
//                   )
//                 })}
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-medium mb-2 block dark:text-gray-300">Days *</label>
//               <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//                 {days.map(day => (
//                   <button
//                     key={day}
//                     type="button"
//                     onClick={() => {
//                       const currentDays = newFixedTime.days
//                       const newDays = currentDays.includes(day)
//                         ? currentDays.filter(d => d !== day)
//                         : [...currentDays, day]
//                       setNewFixedTime({...newFixedTime, days: newDays})
//                     }}
//                     className={cn(
//                       "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
//                       newFixedTime.days.includes(day)
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                     )}
//                   >
//                     {day.charAt(0) + day.slice(1).toLowerCase()}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
//               <div className="flex items-center gap-2 mb-2">
//                 <Coffee className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                 <span className="font-medium text-blue-700 dark:text-blue-300">Free Periods</span>
//               </div>
//               <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
//                 You can add free periods within this commitment after creating it. 
//                 These will allow scheduling tasks during fixed commitment hours.
//               </p>
//               <div className="text-xs text-blue-500 dark:text-blue-400">
//                 Note: Free periods are day-specific. You can add different free periods for different days.
//               </div>
//             </div>
//           </div>
          
//           <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowAddFixedTimeModal(false)
//                 setNewFixedTime({
//                   title: '',
//                   description: '',
//                   days: [],
//                   startTime: '09:00',
//                   endTime: '17:00',
//                   type: 'OTHER',
//                   color: '#6B7280',
//                   isEditable: true,
//                   freePeriods: []
//                 })
//               }}
//               className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleAddFixedTime}>
//               Add Fixed Commitment
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Fixed Time Modal */}
//       <Dialog open={showEditFixedTimeModal} onOpenChange={setShowEditFixedTimeModal}>
//         <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
//           <DialogHeader className="flex-shrink-0">
//             <DialogTitle className="dark:text-gray-100">Edit Fixed Commitment</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Update your fixed commitment details
//             </DialogDescription>
//           </DialogHeader>
          
//           {editingFixedTime && (
//             <div className="space-y-6 py-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Title *</label>
//                 <Input
//                   placeholder="e.g., College Hours, Office Time, Gym Session"
//                   value={editingFixedTime.title}
//                   onChange={(e) => setEditingFixedTime({...editingFixedTime, title: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Description (Optional)</label>
//                 <Textarea
//                   placeholder="Brief description of this commitment"
//                   value={editingFixedTime.description || ''}
//                   onChange={(e) => setEditingFixedTime({...editingFixedTime, description: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   rows={2}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time *</label>
//                   <Input
//                     type="time"
//                     value={editingFixedTime.startTime}
//                     onChange={(e) => setEditingFixedTime({...editingFixedTime, startTime: e.target.value})}
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">End Time *</label>
//                   <Input
//                     type="time"
//                     value={editingFixedTime.endTime}
//                     onChange={(e) => setEditingFixedTime({...editingFixedTime, endTime: e.target.value})}
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Type *</label>
//                 <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//                   {FIXED_TIME_TYPES.filter(t => t.id !== 'SLEEP').map((type) => {
//                     const Icon = type.icon
//                     const isSelected = editingFixedTime.type === type.id
//                     return (
//                       <button
//                         key={type.id}
//                         type="button"
//                         onClick={() => {
//                           setEditingFixedTime({
//                             ...editingFixedTime,
//                             type: type.id as FixedTime['type'],
//                             color: type.color
//                           })
//                         }}
//                         className={cn(
//                           "flex flex-col items-center justify-center p-3 rounded-lg border transition-all",
//                           isSelected 
//                             ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500" 
//                             : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
//                         )}
//                       >
//                         <div 
//                           className="p-2 rounded-lg mb-2"
//                           style={{ backgroundColor: `${type.color}20` }}
//                         >
//                           <Icon className="w-5 h-5" style={{ color: type.color }} />
//                         </div>
//                         <span className={cn(
//                           "text-xs text-center",
//                           isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400"
//                         )}>
//                           {type.label}
//                         </span>
//                       </button>
//                     )
//                   })}
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Days *</label>
//                 <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//                   {days.map(day => (
//                     <button
//                       key={day}
//                       type="button"
//                       onClick={() => {
//                         const currentDays = editingFixedTime.days
//                         const newDays = currentDays.includes(day)
//                           ? currentDays.filter(d => d !== day)
//                           : [...currentDays, day]
//                         setEditingFixedTime({...editingFixedTime, days: newDays})
//                       }}
//                       className={cn(
//                         "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
//                         editingFixedTime.days.includes(day)
//                           ? "bg-blue-500 text-white"
//                           : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                       )}
//                     >
//                       {day.charAt(0) + day.slice(1).toLowerCase()}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
//                 <div className="flex items-center gap-2 mb-2">
//                   <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
//                   <span className="font-medium text-yellow-700 dark:text-yellow-300">Note</span>
//                 </div>
//                 <p className="text-sm text-yellow-600 dark:text-yellow-400">
//                   You can edit fixed commitment details here. To add/remove free periods, 
//                   use the "Add Free Period" button in the commitment details view.
//                 </p>
//               </div>
//             </div>
//           )}
          
//           <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowEditFixedTimeModal(false)
//                 setEditingFixedTime(null)
//               }}
//               className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               Cancel
//             </Button>
//             <Button onClick={() => editingFixedTime && handleSaveFixedTime(editingFixedTime)}>
//               Save Changes
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Add Free Period Modal */}
//       <Dialog open={showAddFreePeriodModal} onOpenChange={setShowAddFreePeriodModal}>
//         <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
//           <DialogHeader>
//             <DialogTitle className="dark:text-gray-100">Add Free Period</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Add a free period within "{selectedFixedTimeForFreePeriod?.title}" for a specific day
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             {selectedFixedTimeForFreePeriod && (
//               <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                 <p className="text-sm text-gray-700 dark:text-gray-300">
//                   <span className="font-medium">Fixed Commitment:</span> {selectedFixedTimeForFreePeriod.title}
//                 </p>
//                 <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                   {formatTimeDisplay(selectedFixedTimeForFreePeriod.startTime)} - {formatTimeDisplay(selectedFixedTimeForFreePeriod.endTime)}
//                 </p>
//               </div>
//             )}
            
//             <div>
//               <label className="text-sm font-medium mb-2 block dark:text-gray-300">Title *</label>
//               <Input
//                 placeholder="e.g., Free Period, Break, Study Time"
//                 value={newFreePeriod.title}
//                 onChange={(e) => setNewFreePeriod({...newFreePeriod, title: e.target.value})}
//                 className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium mb-2 block dark:text-gray-300">Day *</label>
//               <Select
//                 value={newFreePeriod.day}
//                 onValueChange={(value) => setNewFreePeriod({...newFreePeriod, day: value})}
//               >
//                 <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                   <SelectValue placeholder="Select day" />
//                 </SelectTrigger>
//                 <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                   {selectedFixedTimeForFreePeriod?.days.map(day => (
//                     <SelectItem key={day} value={day} className="dark:text-gray-300 dark:hover:bg-gray-700">
//                       {day.charAt(0) + day.slice(1).toLowerCase()}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                 Select the day for this free period. The free period will only apply to this specific day.
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time *</label>
//                 <Input
//                   type="time"
//                   value={newFreePeriod.startTime}
//                   onChange={(e) => setNewFreePeriod({...newFreePeriod, startTime: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">End Time *</label>
//                 <Input
//                   type="time"
//                   value={newFreePeriod.endTime}
//                   onChange={(e) => setNewFreePeriod({...newFreePeriod, endTime: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
//             </div>

//             <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
//               <div className="flex items-center gap-2 mb-1">
//                 <Coffee className="w-4 h-4 text-green-600 dark:text-green-400" />
//                 <span className="font-medium text-green-700 dark:text-green-400">Free Period Information</span>
//               </div>
//               <p className="text-sm text-green-600 dark:text-green-400">
//                 This free period will only apply to {newFreePeriod.day.charAt(0) + newFreePeriod.day.slice(1).toLowerCase()}. 
//                 You can add different free periods for different days within the same fixed commitment.
//               </p>
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowAddFreePeriodModal(false)
//                 setSelectedFixedTimeForFreePeriod(null)
//               }}
//               className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleAddFreePeriod}>
//               Add Free Period for {newFreePeriod.day.charAt(0) + newFreePeriod.day.slice(1).toLowerCase()}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Time Settings Modal */}
//       <Dialog open={showTimeSettingsModal} onOpenChange={setShowTimeSettingsModal}>
//         <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
//           <DialogHeader className="flex-shrink-0">
//             <DialogTitle className="dark:text-gray-100">Display Settings</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Customize how your timetable looks and functions
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-6 py-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
//             <div className="space-y-4">
//               <h3 className="font-medium dark:text-gray-200">Time Range</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time</label>
//                   <Select
//                     value={timeSettings.startHour.toString()}
//                     onValueChange={(value) => setTimeSettings({
//                       ...timeSettings,
//                       startHour: parseInt(value)
//                     })}
//                   >
//                     <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                       <SelectValue placeholder="Select start hour" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                       {Array.from({ length: 12 }, (_, i) => i + 5).map(hour => (
//                         <SelectItem 
//                           key={hour} 
//                           value={hour.toString()}
//                           className="dark:text-gray-300 dark:hover:bg-gray-700"
//                         >
//                           {hour}:00 {hour < 12 ? 'AM' : 'PM'}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">End Time</label>
//                   <Select
//                     value={timeSettings.endHour.toString()}
//                     onValueChange={(value) => setTimeSettings({
//                       ...timeSettings,
//                       endHour: parseInt(value)
//                     })}
//                   >
//                     <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                       <SelectValue placeholder="Select end hour" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                       {Array.from({ length: 12 }, (_, i) => i + 13).map(hour => (
//                         <SelectItem 
//                           key={hour} 
//                           value={hour.toString()}
//                           className="dark:text-gray-300 dark:hover:bg-gray-700"
//                         >
//                           {hour}:00 {hour < 12 ? 'AM' : 'PM'}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <h3 className="font-medium dark:text-gray-200">Time Interval</h3>
//               <div className="grid grid-cols-3 gap-2">
//                 {[30, 60, 120].map(interval => (
//                   <Button
//                     key={interval}
//                     variant={timeSettings.interval === interval ? "default" : "outline"}
//                     onClick={() => setTimeSettings({...timeSettings, interval})}
//                     className="flex-col h-auto py-3 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                   >
//                     <span className="font-medium">{interval} min</span>
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                       {interval === 30 ? 'Detailed' : interval === 60 ? 'Standard' : 'Large'}
//                     </span>
//                   </Button>
//                 ))}
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <h3 className="font-medium dark:text-gray-200">Cell Height</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm dark:text-gray-300">Compact</span>
//                   <span className="text-sm font-medium dark:text-gray-300">{timeSettings.cellHeight}px</span>
//                   <span className="text-sm dark:text-gray-300">Spacious</span>
//                 </div>
//                 <Slider
//                   value={[timeSettings.cellHeight]}
//                   min={40}
//                   max={120}
//                   step={10}
//                   onValueChange={(value) => setTimeSettings({
//                     ...timeSettings,
//                     cellHeight: value[0]
//                   })}
//                 />
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <h3 className="font-medium dark:text-gray-200">Display Options</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="font-medium dark:text-gray-300">Show Weekends</div>
//                     <div className="text-sm text-gray-500 dark:text-gray-400">
//                       Include Saturday and Sunday in timetable
//                     </div>
//                   </div>
//                   <Switch
//                     checked={timeSettings.showWeekends}
//                     onCheckedChange={(checked) => setTimeSettings({
//                       ...timeSettings,
//                       showWeekends: checked
//                     })}
//                   />
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="font-medium dark:text-gray-300">Show Sleep Blocks</div>
//                     <div className="text-sm text-gray-500 dark:text-gray-400">
//                       Display sleep schedule in timetable
//                     </div>
//                   </div>
//                   <Switch
//                     checked={timeSettings.showSleepBlocks}
//                     onCheckedChange={(checked) => setTimeSettings({
//                       ...timeSettings,
//                       showSleepBlocks: checked
//                     })}
//                   />
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="font-medium dark:text-gray-300">Auto-Lock Sleep Hours</div>
//                     <div className="text-sm text-gray-500 dark:text-gray-400">
//                       Prevent scheduling tasks during sleep time
//                     </div>
//                   </div>
//                   <Switch
//                     checked={timeSettings.autoLockSleep}
//                     onCheckedChange={(checked) => setTimeSettings({
//                       ...timeSettings,
//                       autoLockSleep: checked
//                     })}
//                   />
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="font-medium dark:text-gray-300">Display Mode</div>
//                     <div className="text-sm text-gray-500 dark:text-gray-400">
//                       {timeSettings.displayMode === 'vertical' 
//                         ? 'Weekdays as columns' 
//                         : 'Weekdays as rows'}
//                     </div>
//                   </div>
//                   <Select
//                     value={timeSettings.displayMode}
//                     onValueChange={(value: 'vertical' | 'horizontal') => 
//                       setTimeSettings({...timeSettings, displayMode: value})
//                     }
//                   >
//                     <SelectTrigger className="w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                       <SelectValue placeholder="Select display mode" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                       <SelectItem value="vertical" className="dark:text-gray-300 dark:hover:bg-gray-700">Vertical (Weekdays as columns)</SelectItem>
//                       <SelectItem value="horizontal" className="dark:text-gray-300 dark:hover:bg-gray-700">Horizontal (Weekdays as rows)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
//             <Button
//               variant="outline"
//               onClick={() => setShowTimeSettingsModal(false)}
//               className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleSaveTimeSettings}>
//               Apply Settings
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Add/Edit Task Modal */}
//       <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
//         <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
//           <DialogHeader>
//             <DialogTitle className="dark:text-gray-100">
//               {editingTask ? 'Edit Task' : 'Add New Task'}
//             </DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               {editingTask ? 'Update task details' : 'Create a task to add to your timetable'}
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             <div>
//               <label className="text-sm font-medium mb-2 block dark:text-gray-300">Task Title *</label>
//               <Input
//                 placeholder="e.g., Study React, Complete Assignment"
//                 value={newTask.title}
//                 onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//                 className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//               />
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Subject</label>
//                 <Input
//                   placeholder="e.g., DSA, Web Dev"
//                   value={newTask.subject}
//                   onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Day</label>
//                 <Select
//                   value={newTask.day}
//                   onValueChange={(value) => setNewTask({...newTask, day: value})}
//                 >
//                   <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                     <SelectValue placeholder="Select day" />
//                   </SelectTrigger>
//                   <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                     {days.map(day => (
//                       <SelectItem key={day} value={day} className="dark:text-gray-300 dark:hover:bg-gray-700">
//                         {day.charAt(0) + day.slice(1).toLowerCase()}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Start Time</label>
//                 <Input
//                   type="time"
//                   value={newTask.startTime}
//                   onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Duration</label>
//                 <Select
//                   value={newTask.duration.toString()}
//                   onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
//                 >
//                   <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                     <SelectValue placeholder="Select duration" />
//                   </SelectTrigger>
//                   <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                     <SelectItem value="30" className="dark:text-gray-300 dark:hover:bg-gray-700">30 minutes</SelectItem>
//                     <SelectItem value="60" className="dark:text-gray-300 dark:hover:bg-gray-700">1 hour</SelectItem>
//                     <SelectItem value="90" className="dark:text-gray-300 dark:hover:bg-gray-700">1.5 hours</SelectItem>
//                     <SelectItem value="120" className="dark:text-gray-300 dark:hover:bg-gray-700">2 hours</SelectItem>
//                     <SelectItem value="180" className="dark:text-gray-300 dark:hover:bg-gray-700">3 hours</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
            
//             <div>
//               <label className="text-sm font-medium mb-2 block dark:text-gray-300">Priority</label>
//               <Select
//                 value={newTask.priority}
//                 onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
//               >
//                 <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                   <SelectValue placeholder="Select priority" />
//                 </SelectTrigger>
//                 <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                   <SelectItem value="LOW" className="dark:text-gray-300 dark:hover:bg-gray-700">Low</SelectItem>
//                   <SelectItem value="MEDIUM" className="dark:text-gray-300 dark:hover:bg-gray-700">Medium</SelectItem>
//                   <SelectItem value="HIGH" className="dark:text-gray-300 dark:hover:bg-gray-700">High</SelectItem>
//                   <SelectItem value="CRITICAL" className="dark:text-gray-300 dark:hover:bg-gray-700">Critical</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <label className="text-sm font-medium mb-2 block dark:text-gray-300">Notes (Optional)</label>
//               <Textarea
//                 placeholder="Add any notes..."
//                 value={newTask.note}
//                 onChange={(e) => setNewTask({...newTask, note: e.target.value})}
//                 className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 rows={2}
//               />
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowAddTaskModal(false)
//                 setEditingTask(null)
//                 resetTaskForm()
//               }}
//               className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               Cancel
//             </Button>
//             <Button onClick={() => {
//               if (editingTask) {
//                 const updatedTask = {
//                   ...editingTask,
//                   ...newTask,
//                   endTime: calculateEndTime(newTask.startTime, newTask.duration)
//                 }
//                 setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
//                 setEditingTask(null)
//                 setShowAddTaskModal(false)
//                 resetTaskForm()
//                 toast.success('Task updated')
//               } else {
//                 handleAddTask()
//               }
//             }}>
//               {editingTask ? 'Update Task' : 'Add Task'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//       <div className="text-xs text-gray-500 dark:text-gray-500 text-center border-t border-gray-200 dark:border-gray-800 pt-6 mt-8">
//   <p>
//     Chronify AI Timetable Builder helps you create a personalized weekly schedule with fixed commitments, 
//     free periods, tasks from goals, and sleep schedules. Perfect for students managing college schedules, 
//     professionals organizing work tasks, and anyone wanting to optimize their daily routine. Features include 
//     drag-and-drop scheduling, day-specific free periods, sleep schedule integration, multiple view modes, 
//     and easy locking/unlocking of changes. Available for students, professionals, job seekers, and more.
//   </p>
//   <p className="mt-2">
//     Create your perfect schedule today with Chronify AI - the smart way to organize your time and achieve your goals.
//   </p>
// </div>
//     </div>
//   )
// }

































// // src/app/dashboard/timetable/builder/page.tsx
// 'use client'

// import React, { useState, useRef, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { 
//   Calendar, 
//   Clock, 
//   Plus, 
//   Save, 
//   Lock, 
//   Unlock,
//   Grid,
//   List,
//   Zap,
//   Download,
//   Share2,
//   Target,
//   Book,
//   Briefcase,
//   GraduationCap,
//   Home,
//   AlertCircle,
//   X,
//   Settings,
//   Bell,
//   RefreshCw,
//   Columns,
//   Rows,
//   Coffee,
//   Wind,
//   Maximize2,
//   Eye,
//   EyeOff,
//   FileText,
//   Printer,
//   Image as ImageIcon,
//   ChevronLeft,
//   ChevronRight,
//   GripVertical,
//   MoreVertical,
//   Trash2,
//   Edit2,
//   Copy,
//   ChevronUp,
//   ChevronDown,
//   PlusCircle,
//   MinusCircle,
//   Users,
//   Building,
//   Car,
//   Dumbbell,
//   Utensils,
//   Heart,
//   Music,
//   Gamepad2,
//   Moon,
//   Sun,
//   CheckCircle2,
//   TrendingUp,
//   Award,
//   Trophy,
//   Flame,
//   Star,
//   School,
//   User,
//   ArrowRight,
//   ArrowLeft,
//   Bed,
//   AlarmClock,
//   MoonStar,
//   Sunrise,
//   Sunset,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Menu,
//   Filter,
//   Search,
//   CalendarDays,
//   LayoutGrid,
//   LayoutList,
//   Maximize,
//   Minimize,
//   ZoomIn,
//   ZoomOut
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Badge } from '@/components/ui/badge'
// import { Card, CardContent } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { 
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Switch } from '@/components/ui/switch'
// import { Label } from '@/components/ui/label'
// import { Slider } from '@/components/ui/slider'
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu'
// import { toast } from 'sonner'
// import { Progress } from '@/components/ui/progress'
// import { cn } from '@/lib/utils'

// // Types remain the same as before...
// interface TimeSlot {
//   id: string
//   title: string
//   subject: string
//   startTime: string
//   endTime: string
//   duration: number
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   color: string
//   isCompleted?: boolean
//   day: string
//   type: 'task' | 'fixed' | 'break' | 'commute' | 'free' | 'class' | 'study' | 'health' | 'project' | 'meeting' | 'workout' | 'meal' | 'entertainment' | 'sleep'
//   isFreePeriod?: boolean
//   span?: number
//   fixedCommitmentId?: string
//   goalId?: string
//   milestoneId?: string
//   isSleepTime?: boolean
//   sleepScheduleId?: string
//   category?: string
//   note?: string
//   status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
//   completedAt?: string
//   fixedTimeId?: string | null
// }

// interface SleepSchedule {
//   id: string
//   day: string
//   bedtime: string
//   wakeTime: string
//   duration: number
//   isActive: boolean
//   color: string
//   type: 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE'
//   notes?: string
// }

// interface Milestone {
//   id: string
//   title: string
//   description: string
//   completed: boolean
//   targetDate: Date
//   progress: number
//   scheduledHours: number
//   completedHours: number
// }

// interface Goal {
//   id: string
//   title: string
//   description: string
//   category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE'
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   type: 'SHORT_TERM' | 'LONG_TERM'
//   targetDate: Date
//   createdAt: Date
//   status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
//   progress: number
//   totalHours: number
//   completedHours: number
//   milestones: Milestone[]
//   color: string
//   tags: string[]
//   isPublic: boolean
//   weeklyTarget: number
//   streak: number
//   lastUpdated: Date
//   subject: string
//   tasks: string[]
// }

// interface FixedTime {
//   id: string
//   title: string
//   description?: string
//   days: string[]
//   startTime: string
//   endTime: string
//   type: 'COLLEGE' | 'OFFICE' | 'SCHOOL' | 'COMMUTE' | 'FREE' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'FAMILY' | 'OTHER' | 'SLEEP'
//   color?: string
//   isFreePeriod?: boolean
//   isEditable?: boolean
//   icon?: string
//   freePeriods?: {
//     id: string
//     title: string
//     startTime: string
//     endTime: string
//     duration: number
//     day: string
//   }[]
//   serverId?: string
// }

// interface TimeSettings {
//   startHour: number
//   endHour: number
//   interval: number
//   displayMode: 'vertical' | 'horizontal'
//   cellHeight: number
//   showWeekends: boolean
//   compactMode: boolean
//   extendedHours: {
//     morning: boolean
//     evening: boolean
//     night: boolean
//     custom: string[]
//   }
//   showSleepBlocks: boolean
//   autoLockSleep: boolean
// }

// // Fixed Time Types with Icons
// const FIXED_TIME_TYPES = [
//   { id: 'COLLEGE', label: 'College', icon: GraduationCap, color: '#EF4444' },
//   { id: 'OFFICE', label: 'Office', icon: Briefcase, color: '#3B82F6' },
//   { id: 'SCHOOL', label: 'School', icon: Book, color: '#8B5CF6' },
//   { id: 'COMMUTE', label: 'Commute', icon: Car, color: '#F59E0B' },
//   { id: 'MEETING', label: 'Meeting', icon: Users, color: '#10B981' },
//   { id: 'WORKOUT', label: 'Gym', icon: Dumbbell, color: '#EC4899' },
//   { id: 'MEAL', label: 'Meal', icon: Utensils, color: '#F97316' },
//   { id: 'ENTERTAINMENT', label: 'Fun', icon: Gamepad2, color: '#8B5CF6' },
//   { id: 'FREE', label: 'Free', icon: Coffee, color: '#10B981' },
//   { id: 'FAMILY', label: 'Family', icon: Home, color: '#F59E0B' },
//   { id: 'HEALTH', label: 'Health', icon: Heart, color: '#EC4899' },
//   { id: 'SLEEP', label: 'Sleep', icon: Moon, color: '#4B5563' },
//   { id: 'OTHER', label: 'Other', icon: Clock, color: '#6B7280' }
// ]

// // Sleep Types with Icons
// const SLEEP_TYPES = [
//   { id: 'REGULAR', label: 'Regular Sleep', icon: Moon, color: '#4B5563', bgColor: 'bg-gray-100 dark:bg-gray-800' },
//   { id: 'POWER_NAP', label: 'Power Nap', icon: AlarmClock, color: '#8B5CF6', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
//   { id: 'RECOVERY', label: 'Recovery', icon: Heart, color: '#EC4899', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
//   { id: 'EARLY', label: 'Early Bird', icon: Sunrise, color: '#F59E0B', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
//   { id: 'LATE', label: 'Night Owl', icon: MoonStar, color: '#3B82F6', bgColor: 'bg-blue-100 dark:bg-blue-900/30' }
// ]

// // Goal Categories with Icons
// const GOAL_CATEGORIES = [
//   { id: 'ACADEMIC', label: 'Academic', icon: School, color: '#3B82F6', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
//   { id: 'PROFESSIONAL', label: 'Work', icon: Briefcase, color: '#10B981', bgColor: 'bg-green-50 dark:bg-green-900/20' },
//   { id: 'HEALTH', label: 'Health', icon: Heart, color: '#EF4444', bgColor: 'bg-red-50 dark:bg-red-900/20' },
//   { id: 'PERSONAL', label: 'Personal', icon: User, color: '#8B5CF6', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
//   { id: 'SKILL', label: 'Skills', icon: Award, color: '#F59E0B', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
//   { id: 'FINANCIAL', label: 'Money', icon: TrendingUp, color: '#6366F1', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
//   { id: 'SOCIAL', label: 'Social', icon: Users, color: '#EC4899', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
//   { id: 'CREATIVE', label: 'Creative', icon: Music, color: '#F97316', bgColor: 'bg-orange-50 dark:bg-orange-900/20' }
// ]

// const API_BASE_URL = 'http://localhost:8181/v0/api'

// export default function TimetableBuilderClient() {
//   const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid')
//   const [isLocked, setIsLocked] = useState(false)
//   const [darkMode, setDarkMode] = useState(false)
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [tasks, setTasks] = useState<TimeSlot[]>([])
//   const [sleepSchedules, setSleepSchedules] = useState<SleepSchedule[]>([])
//   const [goals, setGoals] = useState<Goal[]>([])
//   const [fixedTimes, setFixedTimes] = useState<FixedTime[]>([])
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [zoomLevel, setZoomLevel] = useState(1)
  
//   // Sample data for testing
//   useEffect(() => {
//     // Add sample fixed commitments
//     setFixedTimes([
//       {
//         id: 'fixed-1',
//         title: 'College Hours',
//         days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
//         startTime: '08:00',
//         endTime: '17:00',
//         type: 'COLLEGE',
//         color: '#EF4444',
//         isEditable: true,
//         freePeriods: [
//           {
//             id: 'free-1',
//             title: 'Lunch Break',
//             startTime: '12:00',
//             endTime: '13:00',
//             duration: 60,
//             day: 'MONDAY'
//           },
//           {
//             id: 'free-2',
//             title: 'Study Time',
//             startTime: '15:00',
//             endTime: '16:00',
//             duration: 60,
//             day: 'WEDNESDAY'
//           }
//         ]
//       }
//     ])

//     // Add sample sleep schedules
//     setSleepSchedules([
//       {
//         id: 'sleep-1',
//         day: 'MONDAY',
//         bedtime: '23:00',
//         wakeTime: '07:00',
//         duration: 480,
//         isActive: true,
//         color: '#4B5563',
//         type: 'REGULAR'
//       },
//       {
//         id: 'sleep-2',
//         day: 'TUESDAY',
//         bedtime: '23:30',
//         wakeTime: '07:30',
//         duration: 480,
//         isActive: true,
//         color: '#4B5563',
//         type: 'REGULAR'
//       }
//     ])

//     // Add sample tasks
//     setTasks([
//       {
//         id: 'task-1',
//         title: 'Complete DSA Assignment',
//         subject: 'Data Structures',
//         startTime: '09:00',
//         endTime: '11:00',
//         duration: 120,
//         priority: 'HIGH',
//         color: '#3B82F6',
//         day: 'MONDAY',
//         type: 'task',
//         status: 'PENDING'
//       },
//       {
//         id: 'task-2',
//         title: 'Study React Hooks',
//         subject: 'Web Development',
//         startTime: '14:00',
//         endTime: '15:30',
//         duration: 90,
//         priority: 'MEDIUM',
//         color: '#10B981',
//         day: 'TUESDAY',
//         type: 'task',
//         status: 'PENDING'
//       }
//     ])

//     // Add sample goals
//     setGoals([
//       {
//         id: 'goal-1',
//         title: 'Master DSA',
//         description: 'Complete all DSA topics',
//         category: 'ACADEMIC',
//         priority: 'HIGH',
//         type: 'LONG_TERM',
//         targetDate: new Date('2024-12-31'),
//         createdAt: new Date(),
//         status: 'IN_PROGRESS',
//         progress: 45,
//         totalHours: 100,
//         completedHours: 45,
//         milestones: [
//           {
//             id: 'milestone-1',
//             title: 'Arrays & Strings',
//             description: 'Complete all array problems',
//             completed: false,
//             targetDate: new Date('2024-06-30'),
//             progress: 70,
//             scheduledHours: 30,
//             completedHours: 21
//           },
//           {
//             id: 'milestone-2',
//             title: 'Linked Lists',
//             description: 'Master linked list operations',
//             completed: false,
//             targetDate: new Date('2024-07-31'),
//             progress: 40,
//             scheduledHours: 25,
//             completedHours: 10
//           }
//         ],
//         color: '#3B82F6',
//         tags: ['coding', 'interview'],
//         isPublic: true,
//         weeklyTarget: 10,
//         streak: 5,
//         lastUpdated: new Date(),
//         subject: 'Computer Science',
//         tasks: []
//       }
//     ])
//   }, [])

//   // Lock progress states
//   const [showLockProgress, setShowLockProgress] = useState(false)
//   const [lockProgress, setLockProgress] = useState<{step: string, status: string, message?: string}[]>([
//     { step: 'Saving Timetable', status: 'pending' }
//   ])
//   const [isLocking, setIsLocking] = useState(false)
//   const [lockSuccess, setLockSuccess] = useState(false)
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
//   const [showResetConfirm, setShowResetConfirm] = useState(false)

//   const [userType, setUserType] = useState<'student' | 'professional' | 'jobseeker' | 'other'>('student')
//   const [showSetupModal, setShowSetupModal] = useState(false)
//   const [showEditFixedTimeModal, setShowEditFixedTimeModal] = useState(false)
//   const [showAddFixedTimeModal, setShowAddFixedTimeModal] = useState(false)
//   const [editingFixedTime, setEditingFixedTime] = useState<FixedTime | null>(null)
//   const [showAddTaskModal, setShowAddTaskModal] = useState(false)
//   const [showTimeSettingsModal, setShowTimeSettingsModal] = useState(false)
//   const [showCellTaskModal, setShowCellTaskModal] = useState(false)
//   const [showTimeExtensionModal, setShowTimeExtensionModal] = useState(false)
//   const [showAddFreePeriodModal, setShowAddFreePeriodModal] = useState(false)
//   const [showSleepScheduleModal, setShowSleepScheduleModal] = useState(false)
//   const [selectedFixedTimeForFreePeriod, setSelectedFixedTimeForFreePeriod] = useState<FixedTime | null>(null)
//   const [selectedCell, setSelectedCell] = useState<{day: string, time: string} | null>(null)
//   const [editingTask, setEditingTask] = useState<TimeSlot | null>(null)
//   const [selectedFixedTime, setSelectedFixedTime] = useState<FixedTime | null>(null)
//   const [showGoalsModal, setShowGoalsModal] = useState(false)
//   const [selectedGoalForMilestone, setSelectedGoalForMilestone] = useState<Goal | null>(null)
//   const [editingSleepSchedule, setEditingSleepSchedule] = useState<SleepSchedule | null>(null)
//   const [taskCreationFlow, setTaskCreationFlow] = useState<'simple' | 'withGoal'>('simple')
//   const [showTaskCreationDialog, setShowTaskCreationDialog] = useState(false)
//   const [taskCreationContext, setTaskCreationContext] = useState<{day: string, time: string} | null>(null)

//   const [newFreePeriod, setNewFreePeriod] = useState({
//     title: 'Free Period',
//     startTime: '14:00',
//     endTime: '15:00',
//     duration: 60,
//     day: 'MONDAY'
//   })

//   const [newTask, setNewTask] = useState({
//     title: '',
//     subject: '',
//     note: '',
//     duration: 60,
//     priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
//     color: '#3B82F6',
//     day: 'MONDAY',
//     startTime: '09:00',
//     goalId: '',
//     milestoneId: '',
//     type: 'STUDY' as 'STUDY' | 'CLASS' | 'PROJECT' | 'HEALTH' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP' | 'OTHER',
//     category: 'ACADEMIC' as 'ACADEMIC' | 'PROFESSIONAL' | 'PERSONAL' | 'HEALTH' | 'OTHER'
//   })

//   const [newFixedTime, setNewFixedTime] = useState({
//     title: '',
//     description: '',
//     days: [] as string[],
//     startTime: '09:00',
//     endTime: '17:00',
//     type: 'OTHER' as FixedTime['type'],
//     color: '#6B7280',
//     isEditable: true,
//     freePeriods: [] as {id: string, title: string, startTime: string, endTime: string, duration: number, day: string}[]
//   })

//   // Time settings state
//   const [timeSettings, setTimeSettings] = useState<TimeSettings>({
//     startHour: 8,
//     endHour: 22,
//     interval: 60,
//     displayMode: 'horizontal',
//     cellHeight: 80,
//     showWeekends: true,
//     compactMode: false,
//     extendedHours: {
//       morning: false,
//       evening: false,
//       night: false,
//       custom: []
//     },
//     showSleepBlocks: true,
//     autoLockSleep: true
//   })

//   // Get auth token
//   const getAuthToken = (): string => {
//     const token = localStorage.getItem('access_token')
//     return token ? `Bearer ${token}` : ''
//   }

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode)
//     if (!darkMode) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }

//   // Check for system dark mode
//   useEffect(() => {
//     const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
//     setDarkMode(isDarkMode)
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark')
//     }
//   }, [])

//   // Days of week
//   const days = timeSettings.showWeekends 
//     ? ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
//     : ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

//   // Format time display
//   const formatTimeDisplay = (time: string): string => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const period = hours >= 12 ? 'PM' : 'AM'
//     const displayHours = hours % 12 || 12
//     return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
//   }

//   // Convert time to minutes
//   const convertTimeToMinutes = (time: string): number => {
//     const [hours, minutes] = time.split(':').map(Number)
//     return hours * 60 + minutes
//   }

//   // Generate time slots
//   const generateTimeSlots = () => {
//     const slots: string[] = []
//     let actualStartHour = timeSettings.startHour
//     let actualEndHour = timeSettings.endHour

//     if (timeSettings.extendedHours.morning) {
//       actualStartHour = Math.min(actualStartHour, 5)
//     }
//     if (timeSettings.extendedHours.evening) {
//       actualEndHour = Math.max(actualEndHour, 22)
//     }
//     if (timeSettings.extendedHours.night) {
//       actualEndHour = Math.max(actualEndHour, 23)
//     }

//     const totalMinutes = (actualEndHour - actualStartHour) * 60
//     for (let i = 0; i <= totalMinutes; i += timeSettings.interval) {
//       const hour = Math.floor(i / 60) + actualStartHour
//       const minute = i % 60
//       if (hour < 24) {
//         slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
//       }
//     }

//     return slots
//   }

//   const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots())

//   useEffect(() => {
//     setTimeSlots(generateTimeSlots())
//   }, [timeSettings])

//   // Calculate end time
//   const calculateEndTime = (startTime: string, duration: number): string => {
//     const [hours, minutes] = startTime.split(':').map(Number)
//     const totalMinutes = hours * 60 + minutes + duration
//     const endHours = Math.floor(totalMinutes / 60)
//     const endMinutes = totalMinutes % 60
//     return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
//   }

//   // Get next time slot
//   const getNextTimeSlot = (time: string): string => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const totalMinutes = hours * 60 + minutes + timeSettings.interval
//     const nextHours = Math.floor(totalMinutes / 60)
//     const nextMinutes = totalMinutes % 60
//     return `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`
//   }

//   // Check if time is in fixed slot
//   const isTimeInFixedSlot = (day: string, time: string): FixedTime | null => {
//     const timeInMinutes = convertTimeToMinutes(time)
//     for (const ft of fixedTimes) {
//       if (!ft.days.includes(day)) continue
//       const startMinutes = convertTimeToMinutes(ft.startTime)
//       const endMinutes = convertTimeToMinutes(ft.endTime)
//       if (timeInMinutes >= startMinutes && timeInMinutes < endMinutes) {
//         return ft
//       }
//     }
//     return null
//   }

//   // Check if time is in free period
//   const isTimeInFreePeriod = (day: string, time: string): {fixedTime: FixedTime, freePeriod: any} | null => {
//     const fixedTime = isTimeInFixedSlot(day, time)
//     if (!fixedTime) return null
//     for (const fp of fixedTime.freePeriods || []) {
//       if (fp.day === day) {
//         const timeInMinutes = convertTimeToMinutes(time)
//         const startMinutes = convertTimeToMinutes(fp.startTime)
//         const endMinutes = convertTimeToMinutes(fp.endTime)
//         if (timeInMinutes >= startMinutes && timeInMinutes < endMinutes) {
//           return { fixedTime, freePeriod: fp }
//         }
//       }
//     }
//     return null
//   }

//   // Get tasks for cell
//   const getTasksForCell = (day: string, time: string) => {
//     return tasks.filter(task => {
//       if (task.day !== day) return false
//       const taskStartMinutes = convertTimeToMinutes(task.startTime)
//       const taskEndMinutes = convertTimeToMinutes(task.endTime)
//       const cellMinutes = convertTimeToMinutes(time)
//       return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
//     })
//   }

//   // Check if task should show in cell
//   const shouldShowTaskInCell = (task: TimeSlot, day: string, time: string) => {
//     if (task.day !== day) return false
//     const taskStartMinutes = convertTimeToMinutes(task.startTime)
//     const cellMinutes = convertTimeToMinutes(time)
//     return taskStartMinutes === cellMinutes
//   }

//   // Get task span
//   const getTaskSpan = (task: TimeSlot) => {
//     const startMinutes = convertTimeToMinutes(task.startTime)
//     const endMinutes = convertTimeToMinutes(task.endTime)
//     const duration = endMinutes - startMinutes
//     return Math.ceil(duration / timeSettings.interval)
//   }

//   // Check if extended time
//   const isExtendedTime = (time: string) => {
//     const [hours] = time.split(':').map(Number)
//     if (timeSettings.extendedHours.morning && hours < 8) return true
//     if (timeSettings.extendedHours.evening && hours >= 18 && hours < 22) return true
//     if (timeSettings.extendedHours.night && hours >= 22) return true
//     if (timeSettings.extendedHours.custom.includes(time)) return true
//     return false
//   }

//   // Get icon by type
//   const getIconByType = (type: string) => {
//     const fixedTimeType = FIXED_TIME_TYPES.find(t => t.id === type)
//     if (fixedTimeType) {
//       const Icon = fixedTimeType.icon
//       return <Icon className="w-4 h-4" />
//     }
//     return <Clock className="w-4 h-4" />
//   }

//   // Get time slot color
//   const getTimeSlotColor = (type: string) => {
//     switch(type) {
//       case 'COLLEGE': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30'
//       case 'OFFICE': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30'
//       case 'SCHOOL': return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/30'
//       case 'COMMUTE': return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/30'
//       case 'MEAL': return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30'
//       case 'WORKOUT': return 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/30'
//       case 'MEETING': return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30'
//       case 'FREE': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30'
//       case 'SLEEP': return 'bg-gray-100 border-gray-300 dark:bg-gray-800/50 dark:border-gray-700'
//       default: return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
//     }
//   }

//   // Handle cell click
//   const handleCellClick = (day: string, time: string) => {
//     if (isLocked) return
    
//     const isSleepTime = tasks.some(t => 
//       t.day === day && 
//       t.isSleepTime && 
//       convertTimeToMinutes(t.startTime) <= convertTimeToMinutes(time) && 
//       convertTimeToMinutes(t.endTime) > convertTimeToMinutes(time)
//     )
    
//     if (isSleepTime && timeSettings.autoLockSleep) {
//       toast.warning('This is your scheduled sleep time')
//       return
//     }
    
//     const fixedTime = isTimeInFixedSlot(day, time)
//     if (fixedTime) {
//       const isInFreePeriod = fixedTime.freePeriods?.some(fp => 
//         fp.day === day && 
//         convertTimeToMinutes(time) >= convertTimeToMinutes(fp.startTime) && 
//         convertTimeToMinutes(time) < convertTimeToMinutes(fp.endTime)
//       )
//       if (!isInFreePeriod) {
//         setSelectedFixedTime(fixedTime)
//         return
//       }
//     }

//     setTaskCreationContext({ day, time })
//     setShowTaskCreationDialog(true)
//   }

//   // Handle add task
//   const handleAddTaskToCell = () => {
//     if (!newTask.title.trim()) {
//       toast.error('Please enter a task title')
//       return
//     }
    
//     if (!taskCreationContext) {
//       toast.error('No cell selected')
//       return
//     }

//     const fixedTime = isTimeInFixedSlot(taskCreationContext.day, taskCreationContext.time)
//     const fixedCommitmentId = fixedTime?.id

//     const task: TimeSlot = {
//       id: `task-${Date.now()}`,
//       title: newTask.title,
//       subject: newTask.subject || 'General',
//       startTime: taskCreationContext.time,
//       endTime: calculateEndTime(taskCreationContext.time, newTask.duration),
//       duration: newTask.duration,
//       priority: newTask.priority,
//       color: newTask.color,
//       day: taskCreationContext.day,
//       type: 'task',
//       fixedCommitmentId,
//       goalId: newTask.goalId || undefined,
//       milestoneId: newTask.milestoneId || undefined,
//       note: newTask.note,
//       status: 'PENDING'
//     }

//     setTasks([...tasks, task])
//     resetTaskForm()
//     setShowTaskCreationDialog(false)
//     setTaskCreationContext(null)
//     toast.success('Task added to timetable')
//   }

//   // Reset task form
//   const resetTaskForm = () => {
//     setNewTask({
//       title: '',
//       subject: '',
//       note: '',
//       duration: 60,
//       priority: 'MEDIUM',
//       color: '#3B82F6',
//       day: 'MONDAY',
//       startTime: '09:00',
//       goalId: '',
//       milestoneId: '',
//       type: 'STUDY',
//       category: 'ACADEMIC'
//     })
//   }

//   // Handle delete task
//   const handleDeleteTask = (taskId: string) => {
//     setTasks(tasks.filter(task => task.id !== taskId))
//     toast.success('Task deleted')
//   }

//   // Handle edit task
//   const handleEditTask = (task: TimeSlot) => {
//     setEditingTask(task)
//     setNewTask({
//       title: task.title,
//       subject: task.subject,
//       note: task.note || '',
//       duration: task.duration,
//       priority: task.priority,
//       color: task.color,
//       day: task.day,
//       startTime: task.startTime,
//       goalId: task.goalId || '',
//       milestoneId: task.milestoneId || '',
//       type: 'STUDY',
//       category: 'ACADEMIC'
//     })
//     setShowAddTaskModal(true)
//   }

//   // Handle duplicate task
//   const handleDuplicateTask = (task: TimeSlot) => {
//     const duplicatedTask = {
//       ...task,
//       id: `task-${Date.now()}`,
//       title: `${task.title} (Copy)`
//     }
//     setTasks([...tasks, duplicatedTask])
//     toast.success('Task duplicated')
//   }

//   // Handle add fixed time
//   const handleAddFixedTime = () => {
//     if (!newFixedTime.title.trim()) {
//       toast.error('Please enter a title')
//       return
//     }
//     if (newFixedTime.days.length === 0) {
//       toast.error('Please select at least one day')
//       return
//     }

//     const fixedTime: FixedTime = {
//       id: `fixed-${Date.now()}`,
//       title: newFixedTime.title,
//       description: newFixedTime.description,
//       days: newFixedTime.days,
//       startTime: newFixedTime.startTime,
//       endTime: newFixedTime.endTime,
//       type: newFixedTime.type,
//       color: newFixedTime.color,
//       isEditable: newFixedTime.isEditable,
//       freePeriods: []
//     }

//     setFixedTimes([...fixedTimes, fixedTime])
//     setNewFixedTime({
//       title: '',
//       description: '',
//       days: [],
//       startTime: '09:00',
//       endTime: '17:00',
//       type: 'OTHER',
//       color: '#6B7280',
//       isEditable: true,
//       freePeriods: []
//     })
//     setShowAddFixedTimeModal(false)
//     toast.success('Fixed commitment added')
//   }

//   // Handle delete fixed time
//   const handleDeleteFixedTime = (id: string) => {
//     setFixedTimes(fixedTimes.filter(ft => ft.id !== id))
//     setSelectedFixedTime(null)
//     toast.success('Fixed commitment deleted')
//   }

//   // Handle edit fixed time
//   const handleEditFixedTime = (fixedTime: FixedTime) => {
//     setEditingFixedTime(fixedTime)
//     setShowEditFixedTimeModal(true)
//   }

//   // Handle save fixed time
//   const handleSaveFixedTime = (updatedFixedTime: FixedTime) => {
//     setFixedTimes(fixedTimes.map(ft => 
//       ft.id === updatedFixedTime.id ? updatedFixedTime : ft
//     ))
//     setShowEditFixedTimeModal(false)
//     setEditingFixedTime(null)
//     toast.success('Fixed commitment updated')
//   }

//   // Handle add free period
//   const handleAddFreePeriod = () => {
//     if (!selectedFixedTimeForFreePeriod || !newFreePeriod.day) {
//       toast.error('Please select a fixed commitment and day')
//       return
//     }
    
//     const freePeriod = {
//       id: `free-${Date.now()}`,
//       title: newFreePeriod.title,
//       startTime: newFreePeriod.startTime,
//       endTime: newFreePeriod.endTime,
//       duration: newFreePeriod.duration,
//       day: newFreePeriod.day
//     }
    
//     const updatedFixedTime = {
//       ...selectedFixedTimeForFreePeriod,
//       freePeriods: [...(selectedFixedTimeForFreePeriod.freePeriods || []), freePeriod]
//     }
    
//     setFixedTimes(fixedTimes.map(ft => 
//       ft.id === selectedFixedTimeForFreePeriod.id ? updatedFixedTime : ft
//     ))
    
//     setNewFreePeriod({
//       title: 'Free Period',
//       startTime: '14:00',
//       endTime: '15:00',
//       duration: 60,
//       day: 'MONDAY'
//     })
//     setShowAddFreePeriodModal(false)
//     setSelectedFixedTimeForFreePeriod(null)
//     toast.success('Free period added')
//   }

//   // Handle save sleep schedule
//   const handleSaveSleepSchedule = (schedule: SleepSchedule) => {
//     const existingIndex = sleepSchedules.findIndex(s => s.id === schedule.id)
//     if (existingIndex >= 0) {
//       const updatedSchedules = [...sleepSchedules]
//       updatedSchedules[existingIndex] = schedule
//       setSleepSchedules(updatedSchedules)
//     } else {
//       setSleepSchedules([...sleepSchedules, schedule])
//     }
//     toast.success('Sleep schedule updated')
//     setEditingSleepSchedule(null)
//     setShowSleepScheduleModal(false)
//   }

//   // Handle delete sleep schedule
//   const handleDeleteSleepSchedule = (id: string) => {
//     setSleepSchedules(sleepSchedules.filter(s => s.id !== id))
//     toast.success('Sleep schedule deleted')
//   }

//   // Handle save time settings
//   const handleSaveTimeSettings = () => {
//     setTimeSlots(generateTimeSlots())
//     setShowTimeSettingsModal(false)
//     toast.success('Display settings updated')
//   }

//   // Handle extend time
//   const handleExtendTime = (extensionType: 'morning' | 'evening' | 'night' | 'custom', customSlots?: string[]) => {
//     const updatedExtendedHours = { ...timeSettings.extendedHours }
//     switch(extensionType) {
//       case 'morning':
//         updatedExtendedHours.morning = !updatedExtendedHours.morning
//         break
//       case 'evening':
//         updatedExtendedHours.evening = !updatedExtendedHours.evening
//         break
//       case 'night':
//         updatedExtendedHours.night = !updatedExtendedHours.night
//         break
//       case 'custom':
//         if (customSlots) {
//           updatedExtendedHours.custom = customSlots
//         }
//         break
//     }
//     setTimeSettings({ ...timeSettings, extendedHours: updatedExtendedHours })
//   }

//   // Handle lock timetable
//   const handleLockTimetable = () => {
//     setIsLocked(true)
//     setLockSuccess(true)
//     toast.success('Timetable locked')
//   }

//   // Handle unlock timetable
//   const handleUnlockTimetable = () => {
//     setIsLocked(false)
//     setLockSuccess(false)
//     toast.success('Timetable unlocked')
//   }

//   // Handle reset timetable
//   const handleResetTimetable = () => {
//     setShowResetConfirm(true)
//   }

//   // Confirm reset
//   const confirmReset = () => {
//     setTasks([])
//     setFixedTimes([])
//     setSleepSchedules([])
//     setShowResetConfirm(false)
//     toast.success('Timetable reset')
//   }

//   // Handle share
//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: 'My Timetable',
//         text: 'Check out my weekly schedule!',
//         url: window.location.href,
//       }).catch(() => {
//         navigator.clipboard.writeText(window.location.href)
//         toast.success('Link copied!')
//       })
//     } else {
//       navigator.clipboard.writeText(window.location.href)
//       toast.success('Link copied!')
//     }
//   }

//   // Handle export PDF
//   const handleExportPDF = () => {
//     toast.info('PDF export coming soon')
//   }

//   // Handle print
//   const handlePrint = () => {
//     window.print()
//   }

//   // Toggle weekends
//   const toggleWeekends = () => {
//     setTimeSettings({ ...timeSettings, showWeekends: !timeSettings.showWeekends })
//   }

//   // Get sleep stats
//   const getSleepStats = () => {
//     const activeSchedules = sleepSchedules.filter(s => s.isActive)
//     const totalSleepHours = activeSchedules.reduce((sum, s) => sum + (s.duration / 60), 0)
//     const avgSleepHours = activeSchedules.length > 0 ? totalSleepHours / activeSchedules.length : 0
//     return { totalSleepHours, avgSleepHours, daysWithSleep: activeSchedules.length }
//   }

//   // Task component
//   const TaskComponent = ({ 
//     task, 
//     onEdit,
//     onDelete,
//     onDuplicate 
//   }: { 
//     task: TimeSlot
//     onEdit: (task: TimeSlot) => void
//     onDelete: (taskId: string) => void
//     onDuplicate: (task: TimeSlot) => void
//   }) => {
//     return (
//       <div className="relative group">
//         <div
//           className={cn(
//             "p-2 rounded-lg border shadow-sm cursor-pointer transition-all",
//             "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500",
//             task.fixedCommitmentId ? "border-green-300 dark:border-green-700" : "border-gray-200 dark:border-gray-700",
//             "bg-white dark:bg-gray-800"
//           )}
//           style={{ borderLeftColor: task.color, borderLeftWidth: '4px' }}
//           onClick={() => onEdit(task)}
//         >
//           <div className="flex items-start justify-between gap-2">
//             <div className="flex-1 min-w-0">
//               <h4 className="text-sm font-semibold truncate dark:text-gray-200">{task.title}</h4>
//               <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{task.subject}</p>
//             </div>
//             {!isLocked && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
//                   <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
//                     <MoreVertical className="w-3 h-3" />
//                   </button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-32">
//                   <DropdownMenuItem onClick={() => onEdit(task)}>
//                     <Edit2 className="w-4 h-4 mr-2" />
//                     Edit
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => onDuplicate(task)}>
//                     <Copy className="w-4 h-4 mr-2" />
//                     Copy
//                   </DropdownMenuItem>
//                   <DropdownMenuItem 
//                     onClick={() => onDelete(task.id)}
//                     className="text-red-600"
//                   >
//                     <Trash2 className="w-4 h-4 mr-2" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
          
//           <div className="mt-2 flex items-center justify-between">
//             <Badge variant="outline" className="text-[10px] px-1 py-0">
//               {task.priority}
//             </Badge>
//             <span className="text-[10px] text-gray-500 dark:text-gray-400">
//               {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
//             </span>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Fixed commitment card component
//   const FixedCommitmentCard = ({ fixedTime }: { fixedTime: FixedTime }) => {
//     const Icon = FIXED_TIME_TYPES.find(t => t.id === fixedTime.type)?.icon || Clock
    
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={cn(
//           "p-3 rounded-lg border cursor-pointer transition-all",
//           getTimeSlotColor(fixedTime.type),
//           "hover:shadow-md"
//         )}
//         onClick={() => setSelectedFixedTime(fixedTime)}
//       >
//         <div className="flex items-start gap-3">
//           <div className="p-2 rounded-lg" style={{ backgroundColor: `${fixedTime.color}20` }}>
//             <Icon className="w-4 h-4" style={{ color: fixedTime.color }} />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h4 className="font-medium text-sm truncate dark:text-gray-200">{fixedTime.title}</h4>
//             <p className="text-xs text-gray-600 dark:text-gray-400">
//               {fixedTime.days.map(d => d.slice(0, 3)).join(', ')} • {formatTimeDisplay(fixedTime.startTime)} - {formatTimeDisplay(fixedTime.endTime)}
//             </p>
//             {fixedTime.freePeriods && fixedTime.freePeriods.length > 0 && (
//               <Badge variant="outline" className="mt-2 text-xs">
//                 {fixedTime.freePeriods.length} free periods
//               </Badge>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     )
//   }

//   // Goal card component
//   const GoalCard = ({ goal }: { goal: Goal }) => {
//     const Icon = GOAL_CATEGORIES.find(c => c.id === goal.category)?.icon || Target
    
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:shadow-md transition-all"
//         onClick={() => setSelectedGoalForMilestone(goal)}
//       >
//         <div className="flex items-start gap-3">
//           <div className="p-2 rounded-lg" style={{ backgroundColor: `${goal.color}20` }}>
//             <Icon className="w-4 h-4" style={{ color: goal.color }} />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h4 className="font-medium text-sm truncate dark:text-gray-200">{goal.title}</h4>
//             <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
//               {goal.progress}% • {goal.completedHours.toFixed(1)}/{goal.totalHours}h
//             </p>
//             <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//               <div 
//                 className="h-full rounded-full"
//                 style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
//               />
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     )
//   }

//   // Time cell component
//   const TimeCell = ({ day, time }: { day: string; time: string }) => {
//     const fixedTime = isTimeInFixedSlot(day, time)
//     const freePeriodInfo = isTimeInFreePeriod(day, time)
//     const tasksInCell = getTasksForCell(day, time)
//     const primaryTask = tasksInCell.find(task => 
//       convertTimeToMinutes(task.startTime) === convertTimeToMinutes(time)
//     ) || tasksInCell[0]
    
//     const isFreePeriod = !!freePeriodInfo
//     const isSleepTime = tasksInCell.some(t => t.isSleepTime)
    
//     return (
//       <div
//         className={cn(
//           "relative border-r border-b border-gray-200 dark:border-gray-700 group",
//           "transition-all duration-150 hover:bg-gray-50 dark:hover:bg-gray-800/50",
//           fixedTime && !isFreePeriod && getTimeSlotColor(fixedTime.type),
//           isFreePeriod && "bg-green-50/50 dark:bg-green-900/20",
//           isExtendedTime(time) && !fixedTime && !isSleepTime && "bg-yellow-50/30 dark:bg-yellow-900/10",
//           isSleepTime && "bg-gray-100/50 dark:bg-gray-800/50"
//         )}
//         style={{ height: `${timeSettings.cellHeight}px` }}
//         onClick={() => handleCellClick(day, time)}
//       >
//         {/* Fixed commitment indicator */}
//         {fixedTime && !isFreePeriod && !primaryTask && !isSleepTime && (
//           <div className="absolute inset-0 flex items-center justify-center p-1">
//             <div className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">
//               <div className="flex items-center justify-center gap-1">
//                 {getIconByType(fixedTime.type)}
//                 <span className="truncate">{fixedTime.title}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Free period indicator */}
//         {isFreePeriod && !primaryTask && !isSleepTime && (
//           <div className="absolute inset-0 flex items-center justify-center p-1">
//             <div className="text-xs font-medium text-green-700 dark:text-green-400">
//               <div className="flex items-center justify-center gap-1">
//                 <Coffee className="w-3 h-3" />
//                 <span>Free</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Task */}
//         {primaryTask && shouldShowTaskInCell(primaryTask, day, time) && !primaryTask.isSleepTime && (
//           <div className="absolute inset-0 p-1">
//             <TaskComponent 
//               task={primaryTask}
//               onEdit={handleEditTask}
//               onDelete={handleDeleteTask}
//               onDuplicate={handleDuplicateTask}
//             />
//           </div>
//         )}

//         {/* Multiple tasks indicator */}
//         {tasksInCell.length > 1 && !primaryTask && (
//           <div className="absolute bottom-1 right-1">
//             <Badge variant="outline" className="text-[10px] px-1 py-0">
//               +{tasksInCell.length}
//             </Badge>
//           </div>
//         )}

//         {/* Add button overlay */}
//         {!isLocked && !fixedTime && !primaryTask && !isSleepTime && (
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80">
//             <Button
//               size="sm"
//               variant="ghost"
//               className="h-6 w-6 p-0"
//               onClick={(e) => {
//                 e.stopPropagation()
//                 setTaskCreationContext({ day, time })
//                 setShowTaskCreationDialog(true)
//               }}
//             >
//               <Plus className="w-3 h-3" />
//             </Button>
//           </div>
//         )}
//       </div>
//     )
//   }

//   // Render timetable grid
//   const renderTimetableGrid = () => {
//     const cellWidth = timeSettings.displayMode === 'vertical' ? 120 : 100
    
//     if (timeSettings.displayMode === 'vertical') {
//       return (
//         <div className="overflow-x-auto pb-4">
//           <div className="inline-block min-w-full">
//             {/* Header row - Days */}
//             <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
//               <div className="w-20 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
//               {days.map((day, index) => (
//                 <div
//                   key={day}
//                   className="flex-1 min-w-[120px] p-3 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0"
//                   style={{ minWidth: cellWidth }}
//                 >
//                   <div className="flex flex-col items-center">
//                     <span className="font-bold text-sm">
//                       {day.slice(0, 3)}
//                     </span>
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                       {['SAT', 'SUN'].includes(day.slice(0, 3)) ? 'Weekend' : 'Weekday'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Time rows */}
//             <div className="flex">
//               {/* Time labels */}
//               <div className="w-20 flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-r-2 border-gray-300 dark:border-gray-700">
//                 {timeSlots.map((time) => (
//                   <div
//                     key={time}
//                     className={cn(
//                       "flex items-center justify-center border-b border-gray-200 dark:border-gray-700",
//                       isExtendedTime(time) && "bg-yellow-50 dark:bg-yellow-900/20"
//                     )}
//                     style={{ height: `${timeSettings.cellHeight}px` }}
//                   >
//                     <span className="text-xs font-medium">
//                       {formatTimeDisplay(time)}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* Day columns */}
//               {days.map(day => (
//                 <div key={day} className="flex-1 min-w-[120px]" style={{ minWidth: cellWidth }}>
//                   {timeSlots.map((time) => (
//                     <TimeCell key={`${day}-${time}`} day={day} time={time} />
//                   ))}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )
//     } else {
//       return (
//         <div className="overflow-x-auto pb-4">
//           <div className="inline-block min-w-full">
//             {/* Header row - Time */}
//             <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
//               <div className="w-24 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2">
//                 <span className="text-sm font-medium">Day / Time</span>
//               </div>
//               {timeSlots.map((time) => (
//                 <div
//                   key={time}
//                   className={cn(
//                     "flex-1 p-2 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0",
//                     isExtendedTime(time) && "bg-yellow-50 dark:bg-yellow-900/20"
//                   )}
//                   style={{ minWidth: 100 }}
//                 >
//                   <span className="text-xs">{formatTimeDisplay(time)}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Day rows */}
//             {days.map((day) => (
//               <div key={day} className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0">
//                 {/* Day label */}
//                 <div 
//                   className="w-24 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center p-2"
//                   style={{ height: `${timeSettings.cellHeight}px` }}
//                 >
//                   <div className="text-center">
//                     <span className="text-sm font-medium block">{day.slice(0, 3)}</span>
//                     <span className="text-[10px] text-gray-500">
//                       {['SAT', 'SUN'].includes(day.slice(0, 3)) ? 'Wknd' : 'Wkdy'}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Time cells */}
//                 {timeSlots.map((time) => (
//                   <div key={`${day}-${time}`} className="flex-1" style={{ minWidth: 100 }}>
//                     <TimeCell day={day} time={time} />
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       )
//     }
//   }

//   // Render compact view
//   const renderCompactView = () => {
//     return (
//       <div className="space-y-4">
//         {days.map(day => (
//           <Card key={day} className="overflow-hidden">
//             <CardContent className="p-4">
//               <h3 className="font-bold mb-3">{day.slice(0, 3)}</h3>
//               <div className="space-y-2">
//                 {tasks
//                   .filter(t => t.day === day && !t.isSleepTime)
//                   .sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))
//                   .map(task => (
//                     <div 
//                       key={task.id}
//                       className="p-2 rounded border-l-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
//                       style={{ borderLeftColor: task.color }}
//                     >
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h4 className="font-medium text-sm">{task.title}</h4>
//                           <p className="text-xs text-gray-500">{task.subject}</p>
//                         </div>
//                         <Badge variant="outline" className="text-[10px]">{task.priority}</Badge>
//                       </div>
//                       <div className="mt-1 text-xs text-gray-500">
//                         {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   const sleepStats = getSleepStats()

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-between">
//             {/* Left side */}
//             <div className="flex items-center gap-4">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="lg:hidden"
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               >
//                 <Menu className="w-5 h-5" />
//               </Button>
              
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
//                   Chronify AI
//                 </h1>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
//                   Timetable Builder
//                 </p>
//               </div>

//               {/* Tabs - Hidden on mobile */}
//               <div className="hidden lg:flex items-center gap-1">
//                 {['Dashboard', 'Timetable', 'Goals', 'Builder', 'Insights', 'Progress'].map(tab => (
//                   <Button
//                     key={tab}
//                     variant={tab === 'Builder' ? 'default' : 'ghost'}
//                     size="sm"
//                     className="text-sm"
//                   >
//                     {tab}
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             {/* Right side */}
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={toggleDarkMode}
//                 className="hidden sm:flex"
//               >
//                 {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//               </Button>

//               <Button variant="ghost" size="sm" className="hidden sm:flex">
//                 Sign In
//               </Button>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="sm" className="gap-2">
//                     <Settings className="w-4 h-4" />
//                     <span className="hidden md:inline">Settings</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem onClick={() => setShowTimeSettingsModal(true)}>
//                     Display Settings
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setShowTimeExtensionModal(true)}>
//                     Extend Hours
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setShowSleepScheduleModal(true)}>
//                     Sleep Schedule
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={toggleDarkMode}>
//                     {darkMode ? 'Light Mode' : 'Dark Mode'}
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile menu */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
//           >
//             <div className="p-4 space-y-2">
//               {['Dashboard', 'Timetable', 'Goals', 'Builder', 'Insights', 'Progress'].map(tab => (
//                 <Button
//                   key={tab}
//                   variant={tab === 'Builder' ? 'default' : 'ghost'}
//                   size="sm"
//                   className="w-full justify-start"
//                 >
//                   {tab}
//                 </Button>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main content */}
//       <main className="max-w-7xl mx-auto p-4 space-y-4">
//         {/* Stats cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
//                   <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                 </div>
//                 <div>
//                   <div className="text-xl font-bold">
//                     {(tasks.reduce((sum, t) => sum + t.duration, 0) / 60).toFixed(1)}h
//                   </div>
//                   <div className="text-xs text-gray-500">Total Hours</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
//                   <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
//                 </div>
//                 <div>
//                   <div className="text-xl font-bold">{tasks.length}</div>
//                   <div className="text-xs text-gray-500">Tasks</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
//                   <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
//                 </div>
//                 <div>
//                   <div className="text-xl font-bold">{goals.length}</div>
//                   <div className="text-xs text-gray-500">Goals</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
//                   <Bed className="w-4 h-4 text-orange-600 dark:text-orange-400" />
//                 </div>
//                 <div>
//                   <div className="text-xl font-bold">{sleepStats.avgSleepHours.toFixed(1)}h</div>
//                   <div className="text-xs text-gray-500">Avg Sleep</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Action bar */}
//         <div className="flex flex-wrap items-center gap-2">
//           <div className="flex items-center border rounded-lg bg-white dark:bg-gray-800">
//             <Button
//               variant={viewMode === 'grid' ? 'default' : 'ghost'}
//               size="sm"
//               className="rounded-r-none"
//               onClick={() => setViewMode('grid')}
//             >
//               <LayoutGrid className="w-4 h-4" />
//             </Button>
//             <Button
//               variant={viewMode === 'compact' ? 'default' : 'ghost'}
//               size="sm"
//               className="rounded-l-none"
//               onClick={() => setViewMode('compact')}
//             >
//               <LayoutList className="w-4 h-4" />
//             </Button>
//           </div>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={toggleWeekends}
//             className="gap-2"
//           >
//             {timeSettings.showWeekends ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//             <span className="hidden sm:inline">{timeSettings.showWeekends ? 'Hide' : 'Show'} Weekends</span>
//           </Button>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setShowAddFixedTimeModal(true)}
//             className="gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             <span className="hidden sm:inline">Add Fixed</span>
//           </Button>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => {
//               setTaskCreationContext({ day: 'MONDAY', time: '09:00' })
//               setShowTaskCreationDialog(true)
//             }}
//             className="gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             <span className="hidden sm:inline">Add Task</span>
//           </Button>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setShowGoalsModal(true)}
//             className="gap-2"
//           >
//             <Target className="w-4 h-4" />
//             <span className="hidden sm:inline">Goals</span>
//           </Button>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setShowSleepScheduleModal(true)}
//             className="gap-2"
//           >
//             <Bed className="w-4 h-4" />
//             <span className="hidden sm:inline">Sleep</span>
//           </Button>

//           <div className="flex-1" />

//           <Button
//             variant={isLocked ? 'outline' : 'default'}
//             size="sm"
//             onClick={isLocked ? handleUnlockTimetable : handleLockTimetable}
//             className="gap-2"
//           >
//             {isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
//             <span className="hidden sm:inline">{isLocked ? 'Unlock' : 'Lock'}</span>
//           </Button>

//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleShare}
//           >
//             <Share2 className="w-4 h-4" />
//           </Button>
//         </div>

//         {/* Fixed commitments section */}
//         {fixedTimes.length > 0 && (
//           <Card>
//             <CardContent className="p-4">
//               <h3 className="font-medium mb-3">Fixed Commitments</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {fixedTimes.map(ft => (
//                   <FixedCommitmentCard key={ft.id} fixedTime={ft} />
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Goals section */}
//         {goals.length > 0 && (
//           <Card>
//             <CardContent className="p-4">
//               <h3 className="font-medium mb-3">Active Goals</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {goals.map(goal => (
//                   <GoalCard key={goal.id} goal={goal} />
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Main timetable */}
//         <Card>
//           <CardContent className="p-4">
//             {viewMode === 'compact' ? renderCompactView() : renderTimetableGrid()}
//           </CardContent>
//         </Card>

//         {/* Footer */}
//         <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t">
//           <p>Chronify AI - Smart timetable builder for students and professionals</p>
//         </div>
//       </main>

//       {/* Task Creation Dialog */}
//       <Dialog open={showTaskCreationDialog} onOpenChange={setShowTaskCreationDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add Task</DialogTitle>
//             <DialogDescription>
//               {taskCreationContext && (
//                 <span>
//                   {taskCreationContext.day.charAt(0) + taskCreationContext.day.slice(1).toLowerCase()} at {formatTimeDisplay(taskCreationContext.time)}
//                 </span>
//               )}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <Input
//               placeholder="Task title"
//               value={newTask.title}
//               onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 placeholder="Subject"
//                 value={newTask.subject}
//                 onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
//               />
//               <Select
//                 value={newTask.duration.toString()}
//                 onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Duration" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="30">30 min</SelectItem>
//                   <SelectItem value="60">1 hour</SelectItem>
//                   <SelectItem value="90">1.5 hours</SelectItem>
//                   <SelectItem value="120">2 hours</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <Select
//               value={newTask.priority}
//               onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Priority" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="LOW">Low</SelectItem>
//                 <SelectItem value="MEDIUM">Medium</SelectItem>
//                 <SelectItem value="HIGH">High</SelectItem>
//                 <SelectItem value="CRITICAL">Critical</SelectItem>
//               </SelectContent>
//             </Select>

//             <Textarea
//               placeholder="Notes (optional)"
//               value={newTask.note}
//               onChange={(e) => setNewTask({...newTask, note: e.target.value})}
//               rows={2}
//             />
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowTaskCreationDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleAddTaskToCell} disabled={!newTask.title}>
//               Add Task
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Add Fixed Time Modal */}
//       <Dialog open={showAddFixedTimeModal} onOpenChange={setShowAddFixedTimeModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add Fixed Commitment</DialogTitle>
//             <DialogDescription>
//               Add regular commitments like college, work, gym, etc.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <Input
//               placeholder="Title (e.g., College Hours)"
//               value={newFixedTime.title}
//               onChange={(e) => setNewFixedTime({...newFixedTime, title: e.target.value})}
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 type="time"
//                 value={newFixedTime.startTime}
//                 onChange={(e) => setNewFixedTime({...newFixedTime, startTime: e.target.value})}
//               />
//               <Input
//                 type="time"
//                 value={newFixedTime.endTime}
//                 onChange={(e) => setNewFixedTime({...newFixedTime, endTime: e.target.value})}
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium mb-2 block">Type</label>
//               <div className="grid grid-cols-3 gap-2">
//                 {FIXED_TIME_TYPES.slice(0, 6).map((type) => {
//                   const Icon = type.icon
//                   return (
//                     <Button
//                       key={type.id}
//                       variant={newFixedTime.type === type.id ? 'default' : 'outline'}
//                       size="sm"
//                       className="flex-col h-auto py-2"
//                       onClick={() => setNewFixedTime({...newFixedTime, type: type.id as any, color: type.color})}
//                     >
//                       <Icon className="w-4 h-4 mb-1" />
//                       <span className="text-[10px]">{type.label}</span>
//                     </Button>
//                   )
//                 })}
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-medium mb-2 block">Days</label>
//               <div className="flex flex-wrap gap-2">
//                 {days.map(day => (
//                   <Button
//                     key={day}
//                     variant={newFixedTime.days.includes(day) ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => {
//                       const newDays = newFixedTime.days.includes(day)
//                         ? newFixedTime.days.filter(d => d !== day)
//                         : [...newFixedTime.days, day]
//                       setNewFixedTime({...newFixedTime, days: newDays})
//                     }}
//                   >
//                     {day.slice(0, 3)}
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             <Textarea
//               placeholder="Description (optional)"
//               value={newFixedTime.description}
//               onChange={(e) => setNewFixedTime({...newFixedTime, description: e.target.value})}
//               rows={2}
//             />
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowAddFixedTimeModal(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleAddFixedTime} disabled={!newFixedTime.title || newFixedTime.days.length === 0}>
//               Add
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Sleep Schedule Modal */}
//       <Dialog open={showSleepScheduleModal} onOpenChange={setShowSleepScheduleModal}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Sleep Schedule</DialogTitle>
//             <DialogDescription>
//               Manage your sleep schedule for each day
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
//             {days.map(day => {
//               const schedule = sleepSchedules.find(s => s.day === day) || {
//                 id: `temp-${day}`,
//                 day,
//                 bedtime: '23:00',
//                 wakeTime: '07:00',
//                 duration: 480,
//                 isActive: true,
//                 color: '#4B5563',
//                 type: 'REGULAR' as const
//               }
              
//               return (
//                 <Card key={day}>
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="font-medium">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
//                       <Switch
//                         checked={schedule.isActive}
//                         onCheckedChange={(checked) => {
//                           const updated = { ...schedule, isActive: checked }
//                           handleSaveSleepSchedule(updated)
//                         }}
//                       />
//                     </div>
                    
//                     {schedule.isActive && (
//                       <div className="space-y-3">
//                         <div className="grid grid-cols-2 gap-2">
//                           <div>
//                             <Label className="text-xs">Bedtime</Label>
//                             <Input
//                               type="time"
//                               value={schedule.bedtime}
//                               onChange={(e) => {
//                                 const updated = { 
//                                   ...schedule, 
//                                   bedtime: e.target.value,
//                                   duration: convertTimeToMinutes(e.target.value) < convertTimeToMinutes(schedule.wakeTime) 
//                                     ? convertTimeToMinutes(schedule.wakeTime) - convertTimeToMinutes(e.target.value)
//                                     : (24*60 - convertTimeToMinutes(e.target.value)) + convertTimeToMinutes(schedule.wakeTime)
//                                 }
//                                 handleSaveSleepSchedule(updated)
//                               }}
//                               className="mt-1"
//                             />
//                           </div>
//                           <div>
//                             <Label className="text-xs">Wake Time</Label>
//                             <Input
//                               type="time"
//                               value={schedule.wakeTime}
//                               onChange={(e) => {
//                                 const updated = { 
//                                   ...schedule, 
//                                   wakeTime: e.target.value,
//                                   duration: convertTimeToMinutes(e.target.value) > convertTimeToMinutes(schedule.bedtime)
//                                     ? convertTimeToMinutes(e.target.value) - convertTimeToMinutes(schedule.bedtime)
//                                     : (24*60 - convertTimeToMinutes(schedule.bedtime)) + convertTimeToMinutes(e.target.value)
//                                 }
//                                 handleSaveSleepSchedule(updated)
//                               }}
//                               className="mt-1"
//                             />
//                           </div>
//                         </div>
                        
//                         <div>
//                           <Label className="text-xs">Type</Label>
//                           <Select
//                             value={schedule.type}
//                             onValueChange={(value: any) => {
//                               const updated = { ...schedule, type: value }
//                               handleSaveSleepSchedule(updated)
//                             }}
//                           >
//                             <SelectTrigger className="mt-1">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {SLEEP_TYPES.map(type => (
//                                 <SelectItem key={type.id} value={type.id}>
//                                   {type.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
                        
//                         <div className="text-xs text-gray-500">
//                           Duration: {Math.floor(schedule.duration / 60)}h {schedule.duration % 60}m
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>

//           <DialogFooter>
//             <Button onClick={() => setShowSleepScheduleModal(false)}>
//               Done
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Fixed Time Details Modal */}
//       <Dialog open={!!selectedFixedTime} onOpenChange={() => setSelectedFixedTime(null)}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Fixed Commitment Details</DialogTitle>
//           </DialogHeader>
          
//           {selectedFixedTime && (
//             <div className="space-y-4 py-4">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 rounded-lg" style={{ backgroundColor: `${selectedFixedTime.color}20` }}>
//                   {getIconByType(selectedFixedTime.type)}
//                 </div>
//                 <div>
//                   <h3 className="font-medium">{selectedFixedTime.title}</h3>
//                   <p className="text-sm text-gray-500">
//                     {selectedFixedTime.days.map(d => d.slice(0, 3)).join(', ')} • {formatTimeDisplay(selectedFixedTime.startTime)} - {formatTimeDisplay(selectedFixedTime.endTime)}
//                   </p>
//                 </div>
//               </div>
              
//               {selectedFixedTime.description && (
//                 <p className="text-sm text-gray-600 dark:text-gray-400">{selectedFixedTime.description}</p>
//               )}
              
//               <div>
//                 <h4 className="font-medium mb-2">Free Periods</h4>
//                 {selectedFixedTime.freePeriods && selectedFixedTime.freePeriods.length > 0 ? (
//                   <div className="space-y-2">
//                     {selectedFixedTime.freePeriods.map(fp => (
//                       <div key={fp.id} className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                         <div className="flex items-center justify-between">
//                           <span className="font-medium text-sm">{fp.title}</span>
//                           <Badge variant="outline" className="text-xs">
//                             {fp.day.slice(0, 3)}
//                           </Badge>
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {formatTimeDisplay(fp.startTime)} - {formatTimeDisplay(fp.endTime)}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">No free periods</p>
//                 )}
//               </div>
              
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => {
//                     setSelectedFixedTimeForFreePeriod(selectedFixedTime)
//                     setSelectedFixedTime(null)
//                     setShowAddFreePeriodModal(true)
//                   }}
//                 >
//                   <Coffee className="w-4 h-4 mr-2" />
//                   Add Free Period
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => {
//                     handleEditFixedTime(selectedFixedTime)
//                     setSelectedFixedTime(null)
//                   }}
//                 >
//                   <Edit2 className="w-4 h-4 mr-2" />
//                   Edit
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => {
//                     handleDeleteFixedTime(selectedFixedTime.id)
//                     setSelectedFixedTime(null)
//                   }}
//                 >
//                   <Trash2 className="w-4 h-4 mr-2" />
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Goals Modal */}
//       <Dialog open={showGoalsModal} onOpenChange={setShowGoalsModal}>
//         <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Goals & Milestones</DialogTitle>
//             <DialogDescription>
//               Schedule tasks from your goals
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             {goals.map(goal => (
//               <Card key={goal.id}>
//                 <CardContent className="p-4">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="p-2 rounded-lg" style={{ backgroundColor: `${goal.color}20` }}>
//                       {GOAL_CATEGORIES.find(c => c.id === goal.category)?.icon && 
//                         React.createElement(GOAL_CATEGORIES.find(c => c.id === goal.category)!.icon, { className: "w-4 h-4" })
//                       }
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-medium">{goal.title}</h3>
//                       <p className="text-xs text-gray-500">{goal.progress}% complete</p>
//                     </div>
//                     <Badge className={cn(
//                       goal.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
//                       goal.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
//                       goal.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
//                       'bg-blue-100 text-blue-700'
//                     )}>
//                       {goal.priority}
//                     </Badge>
//                   </div>
                  
//                   <div className="space-y-2">
//                     {goal.milestones.map(milestone => (
//                       <div key={milestone.id} className="p-2 border rounded-lg">
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="font-medium text-sm">{milestone.title}</span>
//                           <Badge variant="outline" className="text-xs">
//                             {milestone.progress}%
//                           </Badge>
//                         </div>
//                         <p className="text-xs text-gray-500 mb-2">{milestone.description}</p>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           className="w-full"
//                           onClick={() => {
//                             setTaskCreationContext({ day: 'MONDAY', time: '10:00' })
//                             setNewTask({
//                               ...newTask,
//                               title: milestone.title,
//                               subject: goal.subject,
//                               goalId: goal.id,
//                               milestoneId: milestone.id
//                             })
//                             setShowGoalsModal(false)
//                             setShowTaskCreationDialog(true)
//                           }}
//                         >
//                           <Plus className="w-3 h-3 mr-2" />
//                           Schedule
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Add Free Period Modal */}
//       <Dialog open={showAddFreePeriodModal} onOpenChange={setShowAddFreePeriodModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add Free Period</DialogTitle>
//             <DialogDescription>
//               {selectedFixedTimeForFreePeriod && `For "${selectedFixedTimeForFreePeriod.title}"`}
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             <Input
//               placeholder="Title (e.g., Lunch Break)"
//               value={newFreePeriod.title}
//               onChange={(e) => setNewFreePeriod({...newFreePeriod, title: e.target.value})}
//             />
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label className="text-xs">Start Time</Label>
//                 <Input
//                   type="time"
//                   value={newFreePeriod.startTime}
//                   onChange={(e) => setNewFreePeriod({...newFreePeriod, startTime: e.target.value})}
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label className="text-xs">End Time</Label>
//                 <Input
//                   type="time"
//                   value={newFreePeriod.endTime}
//                   onChange={(e) => setNewFreePeriod({...newFreePeriod, endTime: e.target.value})}
//                   className="mt-1"
//                 />
//               </div>
//             </div>
            
//             <div>
//               <Label className="text-xs">Day</Label>
//               <Select
//                 value={newFreePeriod.day}
//                 onValueChange={(value) => setNewFreePeriod({...newFreePeriod, day: value})}
//               >
//                 <SelectTrigger className="mt-1">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {selectedFixedTimeForFreePeriod?.days.map(day => (
//                     <SelectItem key={day} value={day}>
//                       {day.charAt(0) + day.slice(1).toLowerCase()}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowAddFreePeriodModal(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleAddFreePeriod}>
//               Add Free Period
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Reset Confirmation */}
//       <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Reset Timetable</DialogTitle>
//             <DialogDescription>
//               This will delete all your data. This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="py-4">
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Are you sure you want to reset your timetable? All tasks, fixed commitments, and sleep schedules will be permanently deleted.
//             </p>
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={confirmReset}>
//               Reset
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Lock Progress Dialog */}
//       <Dialog open={showLockProgress} onOpenChange={setShowLockProgress}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               {lockSuccess ? (
//                 <>
//                   <CheckCircle className="w-5 h-5 text-green-500" />
//                   Saved Successfully
//                 </>
//               ) : (
//                 'Saving Timetable'
//               )}
//             </DialogTitle>
//           </DialogHeader>
          
//           <div className="py-4">
//             {lockProgress.map((step, index) => (
//               <div key={index} className="flex items-center gap-2 mb-2">
//                 {step.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
//                 {step.status === 'in-progress' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
//                 {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
//                 {step.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
//                 <span className="text-sm">{step.step}</span>
//                 {step.message && <span className="text-xs text-gray-500 ml-auto">{step.message}</span>}
//               </div>
//             ))}
//           </div>
          
//           <DialogFooter>
//             {lockSuccess && (
//               <Button onClick={() => setShowLockProgress(false)}>
//                 Close
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Time Settings Modal */}
//       <Dialog open={showTimeSettingsModal} onOpenChange={setShowTimeSettingsModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Display Settings</DialogTitle>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             <div>
//               <Label>Time Range</Label>
//               <div className="grid grid-cols-2 gap-2 mt-1">
//                 <Select
//                   value={timeSettings.startHour.toString()}
//                   onValueChange={(value) => setTimeSettings({...timeSettings, startHour: parseInt(value)})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {[5,6,7,8,9,10,11,12].map(h => (
//                       <SelectItem key={h} value={h.toString()}>{h}:00 AM</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select
//                   value={timeSettings.endHour.toString()}
//                   onValueChange={(value) => setTimeSettings({...timeSettings, endHour: parseInt(value)})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {[13,14,15,16,17,18,19,20,21,22,23].map(h => (
//                       <SelectItem key={h} value={h.toString()}>{h-12}:00 PM</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
            
//             <div>
//               <Label>Time Interval</Label>
//               <div className="grid grid-cols-3 gap-2 mt-1">
//                 {[30,60,120].map(interval => (
//                   <Button
//                     key={interval}
//                     variant={timeSettings.interval === interval ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => setTimeSettings({...timeSettings, interval})}
//                   >
//                     {interval} min
//                   </Button>
//                 ))}
//               </div>
//             </div>
            
//             <div>
//               <Label>Display Mode</Label>
//               <div className="grid grid-cols-2 gap-2 mt-1">
//                 <Button
//                   variant={timeSettings.displayMode === 'vertical' ? 'default' : 'outline'}
//                   size="sm"
//                   onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
//                 >
//                   <Columns className="w-4 h-4 mr-2" />
//                   Vertical
//                 </Button>
//                 <Button
//                   variant={timeSettings.displayMode === 'horizontal' ? 'default' : 'outline'}
//                   size="sm"
//                   onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
//                 >
//                   <Rows className="w-4 h-4 mr-2" />
//                   Horizontal
//                 </Button>
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label>Show Weekends</Label>
//                 <Switch
//                   checked={timeSettings.showWeekends}
//                   onCheckedChange={(checked) => setTimeSettings({...timeSettings, showWeekends: checked})}
//                 />
//               </div>
              
//               <div className="flex items-center justify-between">
//                 <Label>Show Sleep Blocks</Label>
//                 <Switch
//                   checked={timeSettings.showSleepBlocks}
//                   onCheckedChange={(checked) => setTimeSettings({...timeSettings, showSleepBlocks: checked})}
//                 />
//               </div>
              
//               <div className="flex items-center justify-between">
//                 <Label>Auto-lock Sleep</Label>
//                 <Switch
//                   checked={timeSettings.autoLockSleep}
//                   onCheckedChange={(checked) => setTimeSettings({...timeSettings, autoLockSleep: checked})}
//                 />
//               </div>
//             </div>
            
//             <div>
//               <Label>Cell Height</Label>
//               <Slider
//                 value={[timeSettings.cellHeight]}
//                 min={40}
//                 max={120}
//                 step={10}
//                 onValueChange={(value) => setTimeSettings({...timeSettings, cellHeight: value[0]})}
//                 className="mt-2"
//               />
//               <div className="text-xs text-gray-500 mt-1 text-center">
//                 {timeSettings.cellHeight}px
//               </div>
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowTimeSettingsModal(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveTimeSettings}>
//               Apply
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }














// // src/app/dashboard/timetable/builder/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { 
//   Calendar,
//   Clock,
//   Plus,
//   Save,
//   Lock,
//   Unlock,
//   Grid,
//   List,
//   Zap,
//   Download,
//   Share2,
//   Target,
//   Book,
//   Briefcase,
//   GraduationCap,
//   Home,
//   AlertCircle,
//   X,
//   Settings,
//   Bell,
//   RefreshCw,
//   Moon,
//   Sun,
//   CheckCircle2,
//   TrendingUp,
//   Award,
//   Trophy,
//   Flame,
//   Star,
//   School,
//   User,
//   Coffee,
//   Wind,
//   Maximize2,
//   Eye,
//   EyeOff,
//   FileText,
//   Printer,
//   Image as ImageIcon,
//   ChevronLeft,
//   ChevronRight,
//   GripVertical,
//   MoreVertical,
//   Trash2,
//   Edit2,
//   Copy,
//   ChevronUp,
//   ChevronDown,
//   PlusCircle,
//   MinusCircle,
//   Users,
//   Building,
//   Car,
//   Dumbbell,
//   Utensils,
//   Heart,
//   Music,
//   Gamepad2,
//   Bed,
//   AlarmClock,
//   MoonStar,
//   Sunrise,
//   Sunset,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Menu
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Switch } from '@/components/ui/switch'
// import { Label } from '@/components/ui/label'
// import { Slider } from '@/components/ui/slider'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu'
// import { toast } from 'sonner'
// import { Progress } from '@/components/ui/progress'

// // Types
// interface TimeSlot {
//   id: string
//   title: string
//   subject: string
//   startTime: string
//   endTime: string
//   duration: number
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   color: string
//   day: string
//   type: 'task' | 'fixed' | 'break' | 'class' | 'study' | 'meeting' | 'workout' | 'meal' | 'sleep'
//   goalId?: string
//   milestoneId?: string
//   isCompleted?: boolean
//   note?: string
//   status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
// }

// interface Goal {
//   id: string
//   title: string
//   description: string
//   category: string
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   progress: number
//   color: string
//   totalHours: number
//   completedHours: number
//   targetDate: Date
//   milestones: Milestone[]
// }

// interface Milestone {
//   id: string
//   title: string
//   description: string
//   completed: boolean
//   progress: number
//   scheduledHours: number
//   completedHours: number
// }

// interface FixedTime {
//   id: string
//   title: string
//   description?: string
//   days: string[]
//   startTime: string
//   endTime: string
//   type: string
//   color: string
//   icon?: string
// }

// // Constants
// const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
// const TIME_SLOTS = [
//   '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
// ]

// const FIXED_TIME_TYPES = [
//   { id: 'COLLEGE', label: 'College', icon: GraduationCap, color: '#EF4444' },
//   { id: 'OFFICE', label: 'Office', icon: Briefcase, color: '#3B82F6' },
//   { id: 'CLASS', label: 'Class', icon: Book, color: '#8B5CF6' },
//   { id: 'MEETING', label: 'Meeting', icon: Users, color: '#10B981' },
//   { id: 'WORKOUT', label: 'Workout', icon: Dumbbell, color: '#EC4899' },
//   { id: 'MEAL', label: 'Meal', icon: Utensils, color: '#F97316' },
//   { id: 'STUDY', label: 'Study', icon: Target, color: '#3B82F6' },
//   { id: 'OTHER', label: 'Other', icon: Clock, color: '#6B7280' }
// ]

// const PRIORITY_COLORS = {
//   LOW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
//   MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
//   HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
//   CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
// }

// export default function TimetableBuilderPage() {
//   // State
//   const [tasks, setTasks] = useState<TimeSlot[]>([])
//   const [goals, setGoals] = useState<Goal[]>([])
//   const [fixedTimes, setFixedTimes] = useState<FixedTime[]>([])
//   const [isLocked, setIsLocked] = useState(false)
//   const [darkMode, setDarkMode] = useState(false)
//   const [showMobileMenu, setShowMobileMenu] = useState(false)
//   const [selectedCell, setSelectedCell] = useState<{day: string, time: string} | null>(null)
//   const [showAddTaskModal, setShowAddTaskModal] = useState(false)
//   const [showAddFixedModal, setShowAddFixedModal] = useState(false)
//   const [showGoalsModal, setShowGoalsModal] = useState(false)
//   const [editingTask, setEditingTask] = useState<TimeSlot | null>(null)
  
//   // New task form
//   const [newTask, setNewTask] = useState({
//     title: '',
//     subject: '',
//     duration: 60,
//     priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
//     color: '#3B82F6',
//     day: 'MONDAY',
//     startTime: '9:00',
//     goalId: '',
//     note: ''
//   })

//   // New fixed time form
//   const [newFixedTime, setNewFixedTime] = useState({
//     title: '',
//     description: '',
//     days: [] as string[],
//     startTime: '9:00',
//     endTime: '17:00',
//     type: 'OTHER',
//     color: '#6B7280'
//   })

//   // Stats
//   const totalHours = tasks.reduce((sum, task) => sum + task.duration, 0) / 60
//   const completedTasks = tasks.filter(t => t.isCompleted).length
//   const totalTasks = tasks.length
//   const goalProgress = goals.length > 0 
//     ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) 
//     : 0

//   // Toggle dark mode
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }, [darkMode])

//   // Helper functions
//   const formatTime = (time: string): string => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const period = hours >= 12 ? 'PM' : 'AM'
//     const displayHour = hours % 12 || 12
//     return `${displayHour}:${minutes?.toString().padStart(2, '0') || '00'} ${period}`
//   }

//   const getTimeInMinutes = (time: string): number => {
//     const [hours, minutes = 0] = time.split(':').map(Number)
//     return hours * 60 + minutes
//   }

//   const calculateEndTime = (startTime: string, duration: number): string => {
//     const [hours, minutes = 0] = startTime.split(':').map(Number)
//     const totalMinutes = hours * 60 + minutes + duration
//     const endHours = Math.floor(totalMinutes / 60)
//     const endMinutes = totalMinutes % 60
//     return `${endHours}:${endMinutes.toString().padStart(2, '0')}`
//   }

//   const getTasksForCell = (day: string, time: string): TimeSlot[] => {
//     const timeInMinutes = getTimeInMinutes(time)
//     return tasks.filter(task => {
//       if (task.day !== day) return false
//       const taskStart = getTimeInMinutes(task.startTime)
//       const taskEnd = getTimeInMinutes(task.endTime)
//       return timeInMinutes >= taskStart && timeInMinutes < taskEnd
//     })
//   }

//   const getFixedTimeForCell = (day: string, time: string): FixedTime | null => {
//     const timeInMinutes = getTimeInMinutes(time)
//     return fixedTimes.find(ft => {
//       if (!ft.days.includes(day)) return false
//       const ftStart = getTimeInMinutes(ft.startTime)
//       const ftEnd = getTimeInMinutes(ft.endTime)
//       return timeInMinutes >= ftStart && timeInMinutes < ftEnd
//     }) || null
//   }

//   const handleCellClick = (day: string, time: string) => {
//     if (isLocked) {
//       toast.error('Timetable is locked. Unlock to make changes.')
//       return
//     }
//     setSelectedCell({ day, time })
//     setNewTask({ ...newTask, day, startTime: time })
//     setShowAddTaskModal(true)
//   }

//   const handleAddTask = () => {
//     if (!newTask.title.trim()) {
//       toast.error('Please enter a task title')
//       return
//     }

//     const task: TimeSlot = {
//       id: `task-${Date.now()}-${Math.random()}`,
//       title: newTask.title,
//       subject: newTask.subject || 'General',
//       startTime: newTask.startTime,
//       endTime: calculateEndTime(newTask.startTime, newTask.duration),
//       duration: newTask.duration,
//       priority: newTask.priority,
//       color: newTask.color,
//       day: newTask.day,
//       type: 'task',
//       goalId: newTask.goalId || undefined,
//       note: newTask.note,
//       status: 'PENDING'
//     }

//     setTasks([...tasks, task])
//     resetTaskForm()
//     setShowAddTaskModal(false)
//     toast.success('Task added successfully')
//   }

//   const handleEditTask = (task: TimeSlot) => {
//     setEditingTask(task)
//     setNewTask({
//       title: task.title,
//       subject: task.subject,
//       duration: task.duration,
//       priority: task.priority,
//       color: task.color,
//       day: task.day,
//       startTime: task.startTime,
//       goalId: task.goalId || '',
//       note: task.note || ''
//     })
//     setShowAddTaskModal(true)
//   }

//   const handleUpdateTask = () => {
//     if (!editingTask) return
    
//     const updatedTask: TimeSlot = {
//       ...editingTask,
//       title: newTask.title,
//       subject: newTask.subject,
//       duration: newTask.duration,
//       priority: newTask.priority,
//       color: newTask.color,
//       day: newTask.day,
//       startTime: newTask.startTime,
//       endTime: calculateEndTime(newTask.startTime, newTask.duration),
//       goalId: newTask.goalId || undefined,
//       note: newTask.note
//     }

//     setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
//     resetTaskForm()
//     setShowAddTaskModal(false)
//     setEditingTask(null)
//     toast.success('Task updated successfully')
//   }

//   const handleDeleteTask = (taskId: string) => {
//     setTasks(tasks.filter(t => t.id !== taskId))
//     toast.success('Task deleted')
//   }

//   const handleToggleComplete = (taskId: string) => {
//     setTasks(tasks.map(t => 
//       t.id === taskId 
//         ? { ...t, isCompleted: !t.isCompleted, status: !t.isCompleted ? 'COMPLETED' : 'PENDING' }
//         : t
//     ))
//   }

//   const handleAddFixedTime = () => {
//     if (!newFixedTime.title.trim()) {
//       toast.error('Please enter a title')
//       return
//     }
    
//     if (newFixedTime.days.length === 0) {
//       toast.error('Please select at least one day')
//       return
//     }

//     const fixedTime: FixedTime = {
//       id: `fixed-${Date.now()}-${Math.random()}`,
//       title: newFixedTime.title,
//       description: newFixedTime.description,
//       days: newFixedTime.days,
//       startTime: newFixedTime.startTime,
//       endTime: newFixedTime.endTime,
//       type: newFixedTime.type,
//       color: newFixedTime.color
//     }

//     setFixedTimes([...fixedTimes, fixedTime])
//     setNewFixedTime({
//       title: '',
//       description: '',
//       days: [],
//       startTime: '9:00',
//       endTime: '17:00',
//       type: 'OTHER',
//       color: '#6B7280'
//     })
//     setShowAddFixedModal(false)
//     toast.success('Fixed commitment added')
//   }

//   const handleDeleteFixedTime = (id: string) => {
//     setFixedTimes(fixedTimes.filter(ft => ft.id !== id))
//     toast.success('Fixed commitment deleted')
//   }

//   const resetTaskForm = () => {
//     setNewTask({
//       title: '',
//       subject: '',
//       duration: 60,
//       priority: 'MEDIUM',
//       color: '#3B82F6',
//       day: 'MONDAY',
//       startTime: '9:00',
//       goalId: '',
//       note: ''
//     })
//     setEditingTask(null)
//   }

//   const getFixedTimeIcon = (type: string) => {
//     const fixedType = FIXED_TIME_TYPES.find(t => t.id === type)
//     const Icon = fixedType?.icon || Clock
//     return <Icon className="w-4 h-4" />
//   }

//   // Sample goals for demo
//   useEffect(() => {
//     setGoals([
//       {
//         id: 'goal-1',
//         title: 'Complete DSA Course',
//         description: 'Master Data Structures and Algorithms',
//         category: 'ACADEMIC',
//         priority: 'HIGH',
//         progress: 45,
//         color: '#3B82F6',
//         totalHours: 100,
//         completedHours: 45,
//         targetDate: new Date('2024-12-31'),
//         milestones: [
//           { id: 'm1', title: 'Arrays & Strings', description: 'Complete array problems', completed: true, progress: 100, scheduledHours: 20, completedHours: 20 },
//           { id: 'm2', title: 'Linked Lists', description: 'Master linked list operations', completed: false, progress: 60, scheduledHours: 25, completedHours: 15 },
//           { id: 'm3', title: 'Trees & Graphs', description: 'Tree and graph algorithms', completed: false, progress: 20, scheduledHours: 30, completedHours: 6 }
//         ]
//       },
//       {
//         id: 'goal-2',
//         title: 'Build Portfolio Project',
//         description: 'Create a full-stack application',
//         category: 'PROFESSIONAL',
//         priority: 'CRITICAL',
//         progress: 30,
//         color: '#10B981',
//         totalHours: 80,
//         completedHours: 24,
//         targetDate: new Date('2024-11-30'),
//         milestones: [
//           { id: 'm4', title: 'Frontend Development', description: 'Build React components', completed: false, progress: 50, scheduledHours: 30, completedHours: 15 },
//           { id: 'm5', title: 'Backend API', description: 'Create REST APIs', completed: false, progress: 20, scheduledHours: 30, completedHours: 6 }
//         ]
//       }
//     ])
//   }, [])

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
//         <div className="px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
//                 Timetable Builder
//               </h1>
//               <Badge variant="outline" className="hidden sm:flex dark:border-gray-600 dark:text-gray-300">
//                 Student
//               </Badge>
//               {isLocked && (
//                 <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
//                   <Lock className="w-3 h-3 mr-1" />
//                   Locked
//                 </Badge>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               {/* Desktop Actions */}
//               <div className="hidden md:flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setShowGoalsModal(true)}
//                   className="dark:border-gray-600 dark:text-gray-300"
//                 >
//                   <Target className="w-4 h-4 mr-2" />
//                   Goals
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setShowAddFixedModal(true)}
//                   className="dark:border-gray-600 dark:text-gray-300"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Fixed
//                 </Button>
//                 <Button
//                   variant={isLocked ? "outline" : "default"}
//                   size="sm"
//                   onClick={() => {
//                     if (isLocked) {
//                       setIsLocked(false)
//                       toast.success('Timetable unlocked')
//                     } else {
//                       setIsLocked(true)
//                       toast.success('Timetable locked')
//                     }
//                   }}
//                   className={isLocked ? "dark:border-gray-600 dark:text-gray-300" : ""}
//                 >
//                   {isLocked ? (
//                     <>
//                       <Unlock className="w-4 h-4 mr-2" />
//                       Unlock
//                     </>
//                   ) : (
//                     <>
//                       <Lock className="w-4 h-4 mr-2" />
//                       Lock
//                     </>
//                   )}
//                 </Button>
//               </div>

//               {/* Theme Toggle */}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setDarkMode(!darkMode)}
//                 className="dark:text-gray-300"
//               >
//                 {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//               </Button>

//               {/* Mobile Menu Button */}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="md:hidden"
//                 onClick={() => setShowMobileMenu(!showMobileMenu)}
//               >
//                 <Menu className="w-5 h-5" />
//               </Button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           <AnimatePresence>
//             {showMobileMenu && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="md:hidden mt-4 space-y-2"
//               >
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start"
//                   onClick={() => {
//                     setShowGoalsModal(true)
//                     setShowMobileMenu(false)
//                   }}
//                 >
//                   <Target className="w-4 h-4 mr-2" />
//                   Goals
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start"
//                   onClick={() => {
//                     setShowAddFixedModal(true)
//                     setShowMobileMenu(false)
//                   }}
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Fixed
//                 </Button>
//                 <Button
//                   variant={isLocked ? "outline" : "default"}
//                   className="w-full justify-start"
//                   onClick={() => {
//                     setIsLocked(!isLocked)
//                     setShowMobileMenu(false)
//                     toast.success(isLocked ? 'Timetable unlocked' : 'Timetable locked')
//                   }}
//                 >
//                   {isLocked ? (
//                     <>
//                       <Unlock className="w-4 h-4 mr-2" />
//                       Unlock
//                     </>
//                   ) : (
//                     <>
//                       <Lock className="w-4 h-4 mr-2" />
//                       Lock
//                     </>
//                   )}
//                 </Button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </header>

//       <main className="px-4 sm:px-6 lg:px-8 py-6">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
//           <Card className="dark:bg-gray-800 dark:border-gray-700">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Total Hours</p>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
//                     {totalHours.toFixed(1)}h
//                   </p>
//                 </div>
//                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                   <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="dark:bg-gray-800 dark:border-gray-700">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Tasks</p>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
//                     {completedTasks}/{totalTasks}
//                   </p>
//                 </div>
//                 <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
//                   <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="dark:bg-gray-800 dark:border-gray-700">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Goals</p>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
//                     {goalProgress}%
//                   </p>
//                 </div>
//                 <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
//                   <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="dark:bg-gray-800 dark:border-gray-700">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">Fixed</p>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
//                     {fixedTimes.length}
//                   </p>
//                 </div>
//                 <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
//                   <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Timetable Grid */}
//         <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
//           <CardContent className="p-0 overflow-x-auto">
//             <div className="min-w-[800px] lg:min-w-full">
//               {/* Header Row */}
//               <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
//                 <div className="w-20 sm:w-24 flex-shrink-0 p-3 font-medium text-gray-600 dark:text-gray-400">
//                   Time
//                 </div>
//                 {DAYS.map((day) => (
//                   <div
//                     key={day}
//                     className="flex-1 min-w-[100px] p-3 text-center font-medium text-gray-700 dark:text-gray-300 border-l border-gray-200 dark:border-gray-700"
//                   >
//                     <div>{day.charAt(0) + day.slice(1).toLowerCase()}</div>
//                     <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                       {day === 'SATURDAY' || day === 'SUNDAY' ? 'Weekend' : 'Weekday'}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Time Rows */}
//               {TIME_SLOTS.map((time) => (
//                 <div key={time} className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0">
//                   {/* Time Label */}
//                   <div className="w-20 sm:w-24 flex-shrink-0 p-3 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
//                     {formatTime(time)}
//                   </div>

//                   {/* Day Cells */}
//                   {DAYS.map((day) => {
//                     const tasksInCell = getTasksForCell(day, time)
//                     const fixedTime = getFixedTimeForCell(day, time)
//                     const hasContent = tasksInCell.length > 0 || fixedTime
                    
//                     return (
//                       <div
//                         key={`${day}-${time}`}
//                         onClick={() => handleCellClick(day, time)}
//                         className={`
//                           flex-1 min-w-[100px] p-2 border-l border-gray-200 dark:border-gray-700
//                           transition-colors cursor-pointer relative group
//                           ${hasContent ? '' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
//                           ${fixedTime ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
//                           ${day === 'SATURDAY' || day === 'SUNDAY' ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''}
//                         `}
//                         style={fixedTime ? { backgroundColor: `${fixedTime.color}10` } : {}}
//                       >
//                         {/* Fixed Time Indicator */}
//                         {fixedTime && (
//                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                             <div 
//                               className="text-xs font-medium px-2 py-1 rounded-full bg-white dark:bg-gray-800 shadow-sm border"
//                               style={{ borderColor: fixedTime.color }}
//                             >
//                               <div className="flex items-center gap-1">
//                                 {getFixedTimeIcon(fixedTime.type)}
//                                 <span className="truncate max-w-[80px]">{fixedTime.title}</span>
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         {/* Tasks */}
//                         {!fixedTime && tasksInCell.length > 0 && (
//                           <div className="space-y-1">
//                             {tasksInCell.map((task) => (
//                               <div
//                                 key={task.id}
//                                 className={`
//                                   text-xs p-1.5 rounded border shadow-sm cursor-move
//                                   ${task.isCompleted ? 'line-through opacity-60' : ''}
//                                 `}
//                                 style={{ 
//                                   backgroundColor: `${task.color}15`,
//                                   borderLeft: `3px solid ${task.color}`
//                                 }}
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   handleEditTask(task)
//                                 }}
//                               >
//                                 <div className="font-medium truncate">{task.title}</div>
//                                 <div className="flex items-center justify-between mt-1">
//                                   <Badge className={`text-[10px] px-1 py-0 ${PRIORITY_COLORS[task.priority]}`}>
//                                     {task.duration}m
//                                   </Badge>
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       handleToggleComplete(task.id)
//                                     }}
//                                     className="text-gray-500 hover:text-green-500"
//                                   >
//                                     <CheckCircle2 className="w-3 h-3" />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}

//                         {/* Add Button Overlay */}
//                         {!isLocked && !hasContent && (
//                           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80">
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               className="h-8 w-8 p-0"
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 handleCellClick(day, time)
//                               }}
//                             >
//                               <Plus className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     )
//                   })}
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Bottom Section */}
//         <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Fixed Commitments */}
//           <Card className="dark:bg-gray-800 dark:border-gray-700 lg:col-span-1">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg flex items-center justify-between">
//                 <span>Fixed Commitments</span>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => setShowAddFixedModal(true)}
//                   className="dark:border-gray-600 dark:text-gray-300"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add
//                 </Button>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
//               {fixedTimes.length === 0 ? (
//                 <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
//                   No fixed commitments added
//                 </p>
//               ) : (
//                 fixedTimes.map((ft) => (
//                   <div
//                     key={ft.id}
//                     className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-start justify-between group"
//                   >
//                     <div className="flex items-start gap-3">
//                       <div 
//                         className="p-2 rounded-lg"
//                         style={{ backgroundColor: `${ft.color}20` }}
//                       >
//                         {getFixedTimeIcon(ft.type)}
//                       </div>
//                       <div>
//                         <h4 className="font-medium dark:text-gray-200">{ft.title}</h4>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                           {ft.days.map(d => d.slice(0, 3)).join(', ')} • {formatTime(ft.startTime)} - {formatTime(ft.endTime)}
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => handleDeleteFixedTime(ft.id)}
//                       className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))
//               )}
//             </CardContent>
//           </Card>

//           {/* Quick Tasks */}
//           <Card className="dark:bg-gray-800 dark:border-gray-700 lg:col-span-2">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-lg flex items-center justify-between">
//                 <span>Today's Tasks</span>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => {
//                     setSelectedCell({ day: 'MONDAY', time: '9:00' })
//                     setShowAddTaskModal(true)
//                   }}
//                   className="dark:border-gray-600 dark:text-gray-300"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Task
//                 </Button>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3 max-h-[300px] overflow-y-auto">
//                 {tasks.length === 0 ? (
//                   <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
//                     No tasks scheduled. Click on any time slot to add a task.
//                   </p>
//                 ) : (
//                   tasks.map((task) => (
//                     <div
//                       key={task.id}
//                       className={`
//                         p-3 rounded-lg border flex items-center justify-between
//                         ${task.isCompleted ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}
//                       `}
//                       style={{ borderLeftColor: task.color, borderLeftWidth: '4px' }}
//                     >
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2">
//                           <h4 className={`font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'dark:text-gray-200'}`}>
//                             {task.title}
//                           </h4>
//                           <Badge className={PRIORITY_COLORS[task.priority]}>
//                             {task.priority}
//                           </Badge>
//                         </div>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                           {task.day.slice(0, 3)} • {formatTime(task.startTime)} - {formatTime(task.endTime)} • {task.duration}min
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <button
//                           onClick={() => handleToggleComplete(task.id)}
//                           className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
//                             task.isCompleted ? 'text-green-500' : 'text-gray-400'
//                           }`}
//                         >
//                           <CheckCircle2 className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleEditTask(task)}
//                           className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500"
//                         >
//                           <Edit2 className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteTask(task.id)}
//                           className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </main>

//       {/* Add/Edit Task Modal */}
//       <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
//         <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
//           <DialogHeader>
//             <DialogTitle className="dark:text-gray-100">
//               {editingTask ? 'Edit Task' : 'Add New Task'}
//             </DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               {selectedCell && (
//                 <span>
//                   {selectedCell.day.charAt(0) + selectedCell.day.slice(1).toLowerCase()} at {formatTime(selectedCell.time)}
//                 </span>
//               )}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <div>
//               <Label htmlFor="title" className="dark:text-gray-300">Task Title *</Label>
//               <Input
//                 id="title"
//                 placeholder="e.g., Study React, Complete Assignment"
//                 value={newTask.title}
//                 onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//                 className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="subject" className="dark:text-gray-300">Subject</Label>
//                 <Input
//                   id="subject"
//                   placeholder="e.g., DSA, Web Dev"
//                   value={newTask.subject}
//                   onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
//                   className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
              
//               <div>
//                 <Label htmlFor="duration" className="dark:text-gray-300">Duration</Label>
//                 <Select
//                   value={newTask.duration.toString()}
//                   onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
//                 >
//                   <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                     <SelectItem value="30">30 minutes</SelectItem>
//                     <SelectItem value="60">1 hour</SelectItem>
//                     <SelectItem value="90">1.5 hours</SelectItem>
//                     <SelectItem value="120">2 hours</SelectItem>
//                     <SelectItem value="180">3 hours</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="priority" className="dark:text-gray-300">Priority</Label>
//               <Select
//                 value={newTask.priority}
//                 onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
//               >
//                 <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                   <SelectItem value="LOW">Low</SelectItem>
//                   <SelectItem value="MEDIUM">Medium</SelectItem>
//                   <SelectItem value="HIGH">High</SelectItem>
//                   <SelectItem value="CRITICAL">Critical</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="goal" className="dark:text-gray-300">Link to Goal (Optional)</Label>
//               <Select
//                 value={newTask.goalId}
//                 onValueChange={(value) => setNewTask({...newTask, goalId: value})}
//               >
//                 <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                   <SelectValue placeholder="Select a goal" />
//                 </SelectTrigger>
//                 <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                   <SelectItem value="no-goal">No Goal</SelectItem>
//                   {goals.map(goal => (
//                     <SelectItem key={goal.id} value={goal.id}>
//                       <div className="flex items-center gap-2">
//                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: goal.color }} />
//                         {goal.title}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="note" className="dark:text-gray-300">Notes (Optional)</Label>
//               <Input
//                 id="note"
//                 placeholder="Add any notes..."
//                 value={newTask.note}
//                 onChange={(e) => setNewTask({...newTask, note: e.target.value})}
//                 className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//               />
//             </div>
//           </div>

//           <DialogFooter className="gap-2">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 resetTaskForm()
//                 setShowAddTaskModal(false)
//               }}
//               className="dark:border-gray-600 dark:text-gray-300"
//             >
//               Cancel
//             </Button>
//             <Button onClick={editingTask ? handleUpdateTask : handleAddTask}>
//               {editingTask ? 'Update Task' : 'Add Task'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Add Fixed Time Modal */}
//       <Dialog open={showAddFixedModal} onOpenChange={setShowAddFixedModal}>
//         <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
//           <DialogHeader>
//             <DialogTitle className="dark:text-gray-100">Add Fixed Commitment</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Add regular commitments like college, office, gym, etc.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <div>
//               <Label htmlFor="fixed-title" className="dark:text-gray-300">Title *</Label>
//               <Input
//                 id="fixed-title"
//                 placeholder="e.g., College Hours, Office Time"
//                 value={newFixedTime.title}
//                 onChange={(e) => setNewFixedTime({...newFixedTime, title: e.target.value})}
//                 className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="start-time" className="dark:text-gray-300">Start Time</Label>
//                 <Input
//                   id="start-time"
//                   type="time"
//                   value={newFixedTime.startTime}
//                   onChange={(e) => setNewFixedTime({...newFixedTime, startTime: e.target.value})}
//                   className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
              
//               <div>
//                 <Label htmlFor="end-time" className="dark:text-gray-300">End Time</Label>
//                 <Input
//                   id="end-time"
//                   type="time"
//                   value={newFixedTime.endTime}
//                   onChange={(e) => setNewFixedTime({...newFixedTime, endTime: e.target.value})}
//                   className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label className="dark:text-gray-300">Type</Label>
//               <div className="grid grid-cols-4 gap-2 mt-2">
//                 {FIXED_TIME_TYPES.map((type) => {
//                   const Icon = type.icon
//                   return (
//                     <button
//                       key={type.id}
//                       type="button"
//                       onClick={() => setNewFixedTime({
//                         ...newFixedTime,
//                         type: type.id,
//                         color: type.color
//                       })}
//                       className={`
//                         p-2 rounded-lg border flex flex-col items-center gap-1
//                         ${newFixedTime.type === type.id 
//                           ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
//                           : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
//                         }
//                       `}
//                     >
//                       <Icon className="w-4 h-4" style={{ color: type.color }} />
//                       <span className="text-xs">{type.label}</span>
//                     </button>
//                   )
//                 })}
//               </div>
//             </div>

//             <div>
//               <Label className="dark:text-gray-300">Days *</Label>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {DAYS.map(day => (
//                   <button
//                     key={day}
//                     type="button"
//                     onClick={() => {
//                       const currentDays = newFixedTime.days
//                       const newDays = currentDays.includes(day)
//                         ? currentDays.filter(d => d !== day)
//                         : [...currentDays, day]
//                       setNewFixedTime({...newFixedTime, days: newDays})
//                     }}
//                     className={`
//                       px-3 py-1.5 rounded-full text-sm font-medium transition-all
//                       ${newFixedTime.days.includes(day)
//                         ? 'bg-blue-500 text-white'
//                         : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                       }
//                     `}
//                   >
//                     {day.slice(0, 3)}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="fixed-desc" className="dark:text-gray-300">Description (Optional)</Label>
//               <Input
//                 id="fixed-desc"
//                 placeholder="Brief description"
//                 value={newFixedTime.description}
//                 onChange={(e) => setNewFixedTime({...newFixedTime, description: e.target.value})}
//                 className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//               />
//             </div>
//           </div>

//           <DialogFooter className="gap-2">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setNewFixedTime({
//                   title: '',
//                   description: '',
//                   days: [],
//                   startTime: '9:00',
//                   endTime: '17:00',
//                   type: 'OTHER',
//                   color: '#6B7280'
//                 })
//                 setShowAddFixedModal(false)
//               }}
//               className="dark:border-gray-600 dark:text-gray-300"
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleAddFixedTime}>
//               Add Commitment
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Goals Modal */}
//       <Dialog open={showGoalsModal} onOpenChange={setShowGoalsModal}>
//         <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
//           <DialogHeader className="flex-shrink-0">
//             <DialogTitle className="dark:text-gray-100">Your Goals</DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Track progress and schedule tasks from your goals
//             </DialogDescription>
//           </DialogHeader>

//           <div className="flex-1 overflow-y-auto py-4 pr-2 space-y-4">
//             {goals.map(goal => (
//               <div key={goal.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-3">
//                     <div 
//                       className="w-3 h-3 rounded-full"
//                       style={{ backgroundColor: goal.color }}
//                     />
//                     <h3 className="font-medium dark:text-gray-200">{goal.title}</h3>
//                   </div>
//                   <Badge className={PRIORITY_COLORS[goal.priority]}>
//                     {goal.priority}
//                   </Badge>
//                 </div>

//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
//                   {goal.description}
//                 </p>

//                 <div className="mb-3">
//                   <div className="flex items-center justify-between text-sm mb-1">
//                     <span className="text-gray-600 dark:text-gray-400">Progress</span>
//                     <span className="font-medium dark:text-gray-300">{goal.progress}%</span>
//                   </div>
//                   <Progress value={goal.progress} className="h-2" />
//                 </div>

//                 <div className="space-y-2">
//                   <h4 className="text-sm font-medium dark:text-gray-300">Milestones</h4>
//                   {goal.milestones.map(milestone => (
//                     <div key={milestone.id} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-sm dark:text-gray-300">{milestone.title}</span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">
//                           {milestone.completedHours}/{milestone.scheduledHours}h
//                         </span>
//                       </div>
//                       <Progress value={milestone.progress} className="h-1" />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
//             <Button onClick={() => setShowGoalsModal(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Footer */}
//       <footer className="px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 mt-6">
//         <p>Chronify AI Timetable Builder - Create and manage your perfect schedule</p>
//       </footer>
//     </div>
//   )
// }






























// // src/app/dashboard/timetable/builder/page.tsx
// 'use client'

// import React, { useState, useRef, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { 
//   Calendar, 
//   Clock, 
//   Plus, 
//   Save, 
//   Lock, 
//   Unlock,
//   Grid,
//   List,
//   Zap,
//   Download,
//   Share2,
//   Target,
//   Book,
//   Briefcase,
//   GraduationCap,
//   Home,
//   AlertCircle,
//   X,
//   Settings,
//   Bell,
//   RefreshCw,
//   Columns,
//   Rows,
//   Coffee,
//   Wind,
//   Maximize2,
//   Eye,
//   EyeOff,
//   FileText,
//   Printer,
//   Image as ImageIcon,
//   ChevronLeft,
//   ChevronRight,
//   GripVertical,
//   MoreVertical,
//   Trash2,
//   Edit2,
//   Copy,
//   ChevronUp,
//   ChevronDown,
//   PlusCircle,
//   MinusCircle,
//   Users,
//   Building,
//   Car,
//   Dumbbell,
//   Utensils,
//   Heart,
//   Music,
//   Gamepad2,
//   Moon,
//   Sun,
//   CheckCircle2,
//   TrendingUp,
//   Award,
//   Trophy,
//   Flame,
//   Star,
//   School,
//   User,
//   ArrowRight,
//   ArrowLeft,
//   Bed,
//   AlarmClock,
//   MoonStar,
//   Sunrise,
//   Sunset,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Menu,
//   Filter,
//   Search,
//   CalendarDays,
//   LayoutGrid,
//   LayoutList,
//   Maximize,
//   Minimize,
//   ZoomIn,
//   ZoomOut,
//   ChevronDown as ChevronDownIcon,
//   ChevronRight as ChevronRightIcon
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Badge } from '@/components/ui/badge'
// import { Card, CardContent } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { 
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Switch } from '@/components/ui/switch'
// import { Label } from '@/components/ui/label'
// import { Slider } from '@/components/ui/slider'
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu'
// import { toast } from 'sonner'
// import { Progress } from '@/components/ui/progress'
// import { cn } from '@/lib/utils'

// // Types
// interface TimeSlot {
//   id: string
//   title: string
//   subject: string
//   startTime: string
//   endTime: string
//   duration: number
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   color: string
//   isCompleted?: boolean
//   day: string
//   type: 'task' | 'fixed' | 'break' | 'commute' | 'free' | 'class' | 'study' | 'health' | 'project' | 'meeting' | 'workout' | 'meal' | 'entertainment' | 'sleep'
//   isFreePeriod?: boolean
//   span?: number
//   fixedCommitmentId?: string
//   goalId?: string
//   milestoneId?: string
//   isSleepTime?: boolean
//   sleepScheduleId?: string
//   category?: string
//   note?: string
//   status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
//   completedAt?: string
//   fixedTimeId?: string | null
// }

// interface SleepSchedule {
//   id: string
//   day: string
//   bedtime: string
//   wakeTime: string
//   duration: number
//   isActive: boolean
//   color: string
//   type: 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE'
//   notes?: string
// }

// interface Milestone {
//   id: string
//   title: string
//   description: string
//   completed: boolean
//   targetDate: Date
//   progress: number
//   scheduledHours: number
//   completedHours: number
// }

// interface Goal {
//   id: string
//   title: string
//   description: string
//   category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE'
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   type: 'SHORT_TERM' | 'LONG_TERM'
//   targetDate: Date
//   createdAt: Date
//   status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
//   progress: number
//   totalHours: number
//   completedHours: number
//   milestones: Milestone[]
//   color: string
//   tags: string[]
//   isPublic: boolean
//   weeklyTarget: number
//   streak: number
//   lastUpdated: Date
//   subject: string
//   tasks: string[]
// }

// interface FixedTime {
//   id: string
//   title: string
//   description?: string
//   days: string[]
//   startTime: string
//   endTime: string
//   type: 'COLLEGE' | 'OFFICE' | 'SCHOOL' | 'COMMUTE' | 'FREE' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'FAMILY' | 'OTHER' | 'SLEEP'
//   color?: string
//   isFreePeriod?: boolean
//   isEditable?: boolean
//   icon?: string
//   freePeriods?: {
//     id: string
//     title: string
//     startTime: string
//     endTime: string
//     duration: number
//     day: string
//   }[]
//   serverId?: string
// }

// interface TimeSettings {
//   startHour: number
//   endHour: number
//   interval: number
//   displayMode: 'vertical' | 'horizontal'
//   cellHeight: number
//   showWeekends: boolean
//   compactMode: boolean
//   extendedHours: {
//     morning: boolean
//     evening: boolean
//     night: boolean
//     custom: string[]
//   }
//   showSleepBlocks: boolean
//   autoLockSleep: boolean
// }

// // Fixed Time Types with Icons
// const FIXED_TIME_TYPES = [
//   { id: 'COLLEGE', label: 'College Hours', icon: GraduationCap, color: '#EF4444' },
//   { id: 'OFFICE', label: 'Office/Work', icon: Briefcase, color: '#3B82F6' },
//   { id: 'SCHOOL', label: 'School', icon: Book, color: '#8B5CF6' },
//   { id: 'COMMUTE', label: 'Commute', icon: Car, color: '#F59E0B' },
//   { id: 'MEETING', label: 'Meeting', icon: Users, color: '#10B981' },
//   { id: 'WORKOUT', label: 'Gym/Workout', icon: Dumbbell, color: '#EC4899' },
//   { id: 'MEAL', label: 'Meal/Break', icon: Utensils, color: '#F97316' },
//   { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Gamepad2, color: '#8B5CF6' },
//   { id: 'FREE', label: 'Free Period', icon: Coffee, color: '#10B981' },
//   { id: 'FAMILY', label: 'Family Time', icon: Home, color: '#F59E0B' },
//   { id: 'HEALTH', label: 'Health/Self-care', icon: Heart, color: '#EC4899' },
//   { id: 'SLEEP', label: 'Sleep/Rest', icon: Moon, color: '#4B5563' },
//   { id: 'OTHER', label: 'Other', icon: Clock, color: '#6B7280' }
// ]

// // Sleep Types with Icons
// const SLEEP_TYPES = [
//   { id: 'REGULAR', label: 'Regular Sleep', icon: Moon, color: '#4B5563', bgColor: 'bg-gray-100 dark:bg-gray-800' },
//   { id: 'POWER_NAP', label: 'Power Nap', icon: AlarmClock, color: '#8B5CF6', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
//   { id: 'RECOVERY', label: 'Recovery Sleep', icon: Heart, color: '#EC4899', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
//   { id: 'EARLY', label: 'Early Bird', icon: Sunrise, color: '#F59E0B', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
//   { id: 'LATE', label: 'Night Owl', icon: MoonStar, color: '#3B82F6', bgColor: 'bg-blue-100 dark:bg-blue-900/30' }
// ]

// // Goal Categories with Icons
// const GOAL_CATEGORIES = [
//   { id: 'ACADEMIC', label: 'Academic', icon: School, color: '#3B82F6', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
//   { id: 'PROFESSIONAL', label: 'Professional', icon: Briefcase, color: '#10B981', bgColor: 'bg-green-50 dark:bg-green-900/20' },
//   { id: 'HEALTH', label: 'Health & Fitness', icon: Heart, color: '#EF4444', bgColor: 'bg-red-50 dark:bg-red-900/20' },
//   { id: 'PERSONAL', label: 'Personal', icon: User, color: '#8B5CF6', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
//   { id: 'SKILL', label: 'Skill Development', icon: Award, color: '#F59E0B', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
//   { id: 'FINANCIAL', label: 'Financial', icon: TrendingUp, color: '#6366F1', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
//   { id: 'SOCIAL', label: 'Social', icon: Users, color: '#EC4899', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
//   { id: 'CREATIVE', label: 'Creative', icon: Music, color: '#F97316', bgColor: 'bg-orange-50 dark:bg-orange-900/20' }
// ]

// const API_BASE_URL = 'http://localhost:8181/v0/api'

// export default function TimetableBuilderClient() {
//   const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'pdf'>('grid')
//   const [isLocked, setIsLocked] = useState(false)
//   const [darkMode, setDarkMode] = useState(false)
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [tasks, setTasks] = useState<TimeSlot[]>([])
//   const [sleepSchedules, setSleepSchedules] = useState<SleepSchedule[]>([])
//   const [goals, setGoals] = useState<Goal[]>([])
//   const [fixedTimes, setFixedTimes] = useState<FixedTime[]>([])
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [userType, setUserType] = useState<'student' | 'professional' | 'jobseeker' | 'other'>('student')
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true)
  
//   // Sample data for testing
//   useEffect(() => {
//     // Add sample fixed commitments
//     setFixedTimes([
//       {
//         id: 'fixed-1',
//         title: 'College Hours',
//         description: 'college lecture',
//         days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
//         startTime: '08:00',
//         endTime: '17:00',
//         type: 'COLLEGE',
//         color: '#EF4444',
//         isEditable: true,
//         freePeriods: [
//           {
//             id: 'free-1',
//             title: 'Lunch Break',
//             startTime: '12:00',
//             endTime: '13:00',
//             duration: 60,
//             day: 'MONDAY'
//           },
//           {
//             id: 'free-2',
//             title: 'Study Time',
//             startTime: '15:00',
//             endTime: '16:00',
//             duration: 60,
//             day: 'WEDNESDAY'
//           },
//           {
//             id: 'free-3',
//             title: 'Coffee Break',
//             startTime: '10:30',
//             endTime: '11:00',
//             duration: 30,
//             day: 'THURSDAY'
//           }
//         ]
//       },
//       {
//         id: 'fixed-2',
//         title: 'Gym',
//         description: 'gym workout',
//         days: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
//         startTime: '18:00',
//         endTime: '19:00',
//         type: 'WORKOUT',
//         color: '#EC4899',
//         isEditable: true,
//         freePeriods: []
//       }
//     ])

//     // Add sample sleep schedules
//     setSleepSchedules([
//       {
//         id: 'sleep-1',
//         day: 'MONDAY',
//         bedtime: '23:00',
//         wakeTime: '07:00',
//         duration: 480,
//         isActive: true,
//         color: '#4B5563',
//         type: 'REGULAR',
//         notes: 'Regular sleep schedule'
//       },
//       {
//         id: 'sleep-2',
//         day: 'TUESDAY',
//         bedtime: '23:30',
//         wakeTime: '07:30',
//         duration: 480,
//         isActive: true,
//         color: '#4B5563',
//         type: 'REGULAR',
//         notes: 'Slightly later'
//       },
//       {
//         id: 'sleep-3',
//         day: 'WEDNESDAY',
//         bedtime: '23:00',
//         wakeTime: '07:00',
//         duration: 480,
//         isActive: true,
//         color: '#4B5563',
//         type: 'REGULAR'
//       },
//       {
//         id: 'sleep-4',
//         day: 'THURSDAY',
//         bedtime: '23:30',
//         wakeTime: '07:30',
//         duration: 480,
//         isActive: true,
//         color: '#4B5563',
//         type: 'REGULAR'
//       },
//       {
//         id: 'sleep-5',
//         day: 'FRIDAY',
//         bedtime: '00:00',
//         wakeTime: '08:00',
//         duration: 480,
//         isActive: true,
//         color: '#4B5563',
//         type: 'LATE',
//         notes: 'Weekend mode'
//       }
//     ])

//     // Add sample goals
//     setGoals([
//       {
//         id: 'goal-1',
//         title: 'Master DSA',
//         description: 'Complete all DSA topics for interviews',
//         category: 'ACADEMIC',
//         priority: 'CRITICAL',
//         type: 'LONG_TERM',
//         targetDate: new Date('2024-12-31'),
//         createdAt: new Date(),
//         status: 'IN_PROGRESS',
//         progress: 45,
//         totalHours: 100,
//         completedHours: 45,
//         milestones: [
//           {
//             id: 'milestone-1',
//             title: 'Arrays & Strings',
//             description: 'Complete all array and string problems',
//             completed: false,
//             targetDate: new Date('2024-06-30'),
//             progress: 70,
//             scheduledHours: 30,
//             completedHours: 21
//           },
//           {
//             id: 'milestone-2',
//             title: 'Linked Lists',
//             description: 'Master linked list operations',
//             completed: false,
//             targetDate: new Date('2024-07-31'),
//             progress: 40,
//             scheduledHours: 25,
//             completedHours: 10
//           },
//           {
//             id: 'milestone-3',
//             title: 'Trees & Graphs',
//             description: 'Tree and graph algorithms',
//             completed: false,
//             targetDate: new Date('2024-08-31'),
//             progress: 30,
//             scheduledHours: 35,
//             completedHours: 10.5
//           },
//           {
//             id: 'milestone-4',
//             title: 'Dynamic Programming',
//             description: 'DP patterns and problems',
//             completed: false,
//             targetDate: new Date('2024-09-30'),
//             progress: 20,
//             scheduledHours: 40,
//             completedHours: 8
//           }
//         ],
//         color: '#3B82F6',
//         tags: ['coding', 'interview', 'algorithms'],
//         isPublic: true,
//         weeklyTarget: 10,
//         streak: 5,
//         lastUpdated: new Date(),
//         subject: 'Computer Science',
//         tasks: []
//       },
//       {
//         id: 'goal-2',
//         title: 'Learn Web Development',
//         description: 'Become a full-stack developer',
//         category: 'SKILL',
//         priority: 'HIGH',
//         type: 'LONG_TERM',
//         targetDate: new Date('2024-10-31'),
//         createdAt: new Date(),
//         status: 'IN_PROGRESS',
//         progress: 30,
//         totalHours: 150,
//         completedHours: 45,
//         milestones: [
//           {
//             id: 'milestone-5',
//             title: 'HTML/CSS Basics',
//             description: 'Learn fundamentals of HTML and CSS',
//             completed: true,
//             targetDate: new Date('2024-03-31'),
//             progress: 100,
//             scheduledHours: 20,
//             completedHours: 20
//           },
//           {
//             id: 'milestone-6',
//             title: 'JavaScript Fundamentals',
//             description: 'Core JavaScript concepts',
//             completed: false,
//             targetDate: new Date('2024-05-31'),
//             progress: 60,
//             scheduledHours: 30,
//             completedHours: 18
//           },
//           {
//             id: 'milestone-7',
//             title: 'React Framework',
//             description: 'Build apps with React',
//             completed: false,
//             targetDate: new Date('2024-07-31'),
//             progress: 20,
//             scheduledHours: 40,
//             completedHours: 8
//           },
//           {
//             id: 'milestone-8',
//             title: 'Node.js Backend',
//             description: 'Server-side development',
//             completed: false,
//             targetDate: new Date('2024-09-30'),
//             progress: 5,
//             scheduledHours: 35,
//             completedHours: 1.75
//           }
//         ],
//         color: '#10B981',
//         tags: ['web', 'frontend', 'backend'],
//         isPublic: true,
//         weeklyTarget: 8,
//         streak: 3,
//         lastUpdated: new Date(),
//         subject: 'Web Development',
//         tasks: []
//       }
//     ])

//     // Add sample tasks (only in free periods)
//     setTasks([
//       {
//         id: 'task-1',
//         title: 'Complete Arrays Problem Set',
//         subject: 'DSA',
//         startTime: '12:00',
//         endTime: '13:00',
//         duration: 60,
//         priority: 'HIGH',
//         color: '#3B82F6',
//         day: 'MONDAY',
//         type: 'task',
//         goalId: 'goal-1',
//         milestoneId: 'milestone-1',
//         status: 'PENDING',
//         note: 'Focus on two-pointer techniques',
//         fixedCommitmentId: 'fixed-1' // In free period of College Hours
//       },
//       {
//         id: 'task-2',
//         title: 'Practice Linked List Operations',
//         subject: 'DSA',
//         startTime: '15:00',
//         endTime: '16:00',
//         duration: 60,
//         priority: 'MEDIUM',
//         color: '#3B82F6',
//         day: 'WEDNESDAY',
//         type: 'task',
//         goalId: 'goal-1',
//         milestoneId: 'milestone-2',
//         status: 'PENDING',
//         fixedCommitmentId: 'fixed-1' // In free period of College Hours
//       },
//       {
//         id: 'task-3',
//         title: 'JavaScript Closures & Scope',
//         subject: 'Web Dev',
//         startTime: '10:30',
//         endTime: '11:00',
//         duration: 30,
//         priority: 'MEDIUM',
//         color: '#10B981',
//         day: 'THURSDAY',
//         type: 'task',
//         goalId: 'goal-2',
//         milestoneId: 'milestone-6',
//         status: 'PENDING',
//         fixedCommitmentId: 'fixed-1' // In free period of College Hours
//       }
//     ])
//   }, [])

//   // Lock progress states
//   const [showLockProgress, setShowLockProgress] = useState(false)
//   const [lockProgress, setLockProgress] = useState<{step: string, status: string, message?: string}[]>([
//     { step: 'Saving Timetable', status: 'pending' }
//   ])
//   const [isLocking, setIsLocking] = useState(false)
//   const [lockSuccess, setLockSuccess] = useState(false)
//   const [showResetConfirm, setShowResetConfirm] = useState(false)

//   const [showSetupModal, setShowSetupModal] = useState(false)
//   const [showEditFixedTimeModal, setShowEditFixedTimeModal] = useState(false)
//   const [showAddFixedTimeModal, setShowAddFixedTimeModal] = useState(false)
//   const [editingFixedTime, setEditingFixedTime] = useState<FixedTime | null>(null)
//   const [showAddTaskModal, setShowAddTaskModal] = useState(false)
//   const [showTimeSettingsModal, setShowTimeSettingsModal] = useState(false)
//   const [showCellTaskModal, setShowCellTaskModal] = useState(false)
//   const [showTimeExtensionModal, setShowTimeExtensionModal] = useState(false)
//   const [showAddFreePeriodModal, setShowAddFreePeriodModal] = useState(false)
//   const [showSleepScheduleModal, setShowSleepScheduleModal] = useState(false)
//   const [selectedFixedTimeForFreePeriod, setSelectedFixedTimeForFreePeriod] = useState<FixedTime | null>(null)
//   const [selectedCell, setSelectedCell] = useState<{day: string, time: string} | null>(null)
//   const [editingTask, setEditingTask] = useState<TimeSlot | null>(null)
//   const [selectedFixedTime, setSelectedFixedTime] = useState<FixedTime | null>(null)
//   const [showGoalsModal, setShowGoalsModal] = useState(false)
//   const [selectedGoalForMilestone, setSelectedGoalForMilestone] = useState<Goal | null>(null)
//   const [editingSleepSchedule, setEditingSleepSchedule] = useState<SleepSchedule | null>(null)
//   const [taskCreationFlow, setTaskCreationFlow] = useState<'simple' | 'withGoal'>('simple')
//   const [showTaskCreationDialog, setShowTaskCreationDialog] = useState(false)
//   const [taskCreationContext, setTaskCreationContext] = useState<{day: string, time: string} | null>(null)
//   const [expandedGoals, setExpandedGoals] = useState<string[]>([])

//   const [newFreePeriod, setNewFreePeriod] = useState({
//     title: 'Free Period',
//     startTime: '14:00',
//     endTime: '15:00',
//     duration: 60,
//     day: 'MONDAY'
//   })

//   const [newTask, setNewTask] = useState({
//     title: '',
//     subject: '',
//     note: '',
//     duration: 60,
//     priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
//     color: '#3B82F6',
//     day: 'MONDAY',
//     startTime: '09:00',
//     goalId: '',
//     milestoneId: '',
//     type: 'STUDY' as 'STUDY' | 'CLASS' | 'PROJECT' | 'HEALTH' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP' | 'OTHER',
//     category: 'ACADEMIC' as 'ACADEMIC' | 'PROFESSIONAL' | 'PERSONAL' | 'HEALTH' | 'OTHER'
//   })

//   const [newFixedTime, setNewFixedTime] = useState({
//     title: '',
//     description: '',
//     days: [] as string[],
//     startTime: '09:00',
//     endTime: '17:00',
//     type: 'COLLEGE' as FixedTime['type'],
//     color: '#EF4444',
//     isEditable: true,
//     freePeriods: [] as {id: string, title: string, startTime: string, endTime: string, duration: number, day: string}[]
//   })

//   // Time settings state
//   const [timeSettings, setTimeSettings] = useState<TimeSettings>({
//     startHour: 8,
//     endHour: 22,
//     interval: 60,
//     displayMode: 'horizontal',
//     cellHeight: 80,
//     showWeekends: true,
//     compactMode: false,
//     extendedHours: {
//       morning: true,
//       evening: true,
//       night: false,
//       custom: ['05:00', '06:00', '22:00', '23:00']
//     },
//     showSleepBlocks: true,
//     autoLockSleep: true
//   })

//   // Get auth token
//   const getAuthToken = (): string => {
//     const token = localStorage.getItem('access_token')
//     return token ? `Bearer ${token}` : ''
//   }

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode)
//     if (!darkMode) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }

//   // Check for system dark mode
//   useEffect(() => {
//     const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
//     setDarkMode(isDarkMode)
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark')
//     }
//   }, [])

//   // Days of week
//   const days = timeSettings.showWeekends 
//     ? ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
//     : ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

//   // Format time display
//   const formatTimeDisplay = (time: string): string => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const period = hours >= 12 ? 'PM' : 'AM'
//     const displayHours = hours % 12 || 12
//     return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
//   }

//   // Convert time to minutes
//   const convertTimeToMinutes = (time: string): number => {
//     const [hours, minutes] = time.split(':').map(Number)
//     return hours * 60 + minutes
//   }

//   // Generate time slots
//   const generateTimeSlots = () => {
//     const slots: string[] = []
//     let actualStartHour = timeSettings.startHour
//     let actualEndHour = timeSettings.endHour

//     if (timeSettings.extendedHours.morning) {
//       actualStartHour = Math.min(actualStartHour, 5)
//     }
//     if (timeSettings.extendedHours.evening) {
//       actualEndHour = Math.max(actualEndHour, 22)
//     }
//     if (timeSettings.extendedHours.night) {
//       actualEndHour = Math.max(actualEndHour, 23)
//     }

//     const totalMinutes = (actualEndHour - actualStartHour) * 60
//     for (let i = 0; i <= totalMinutes; i += timeSettings.interval) {
//       const hour = Math.floor(i / 60) + actualStartHour
//       const minute = i % 60
//       if (hour < 24) {
//         slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
//       }
//     }

//     // Add custom slots
//     timeSettings.extendedHours.custom.forEach(time => {
//       if (!slots.includes(time)) {
//         slots.push(time)
//       }
//     })

//     return slots.sort((a, b) => {
//       const [aH, aM] = a.split(':').map(Number)
//       const [bH, bM] = b.split(':').map(Number)
//       return (aH * 60 + aM) - (bH * 60 + bM)
//     })
//   }

//   const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots())

//   useEffect(() => {
//     setTimeSlots(generateTimeSlots())
//   }, [timeSettings])

//   // Calculate end time
//   const calculateEndTime = (startTime: string, duration: number): string => {
//     const [hours, minutes] = startTime.split(':').map(Number)
//     const totalMinutes = hours * 60 + minutes + duration
//     const endHours = Math.floor(totalMinutes / 60) % 24
//     const endMinutes = totalMinutes % 60
//     return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
//   }

//   // Get next time slot
//   const getNextTimeSlot = (time: string): string => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const totalMinutes = hours * 60 + minutes + timeSettings.interval
//     const nextHours = Math.floor(totalMinutes / 60) % 24
//     const nextMinutes = totalMinutes % 60
//     return `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`
//   }

//   // Check if time is in fixed slot
//   const isTimeInFixedSlot = (day: string, time: string): FixedTime | null => {
//     const timeInMinutes = convertTimeToMinutes(time)
//     for (const ft of fixedTimes) {
//       if (!ft.days.includes(day)) continue
//       const startMinutes = convertTimeToMinutes(ft.startTime)
//       const endMinutes = convertTimeToMinutes(ft.endTime)
      
//       // Handle overnight slots
//       if (endMinutes < startMinutes) {
//         // Overnight slot
//         if (timeInMinutes >= startMinutes || timeInMinutes < endMinutes) {
//           return ft
//         }
//       } else {
//         // Normal slot
//         if (timeInMinutes >= startMinutes && timeInMinutes < endMinutes) {
//           return ft
//         }
//       }
//     }
//     return null
//   }

//   // Check if time is in free period
//   const isTimeInFreePeriod = (day: string, time: string): {fixedTime: FixedTime, freePeriod: any} | null => {
//     const fixedTime = isTimeInFixedSlot(day, time)
//     if (!fixedTime) return null
//     if (!fixedTime.freePeriods) return null
    
//     const timeInMinutes = convertTimeToMinutes(time)
//     for (const fp of fixedTime.freePeriods) {
//       if (fp.day !== day) continue
      
//       const startMinutes = convertTimeToMinutes(fp.startTime)
//       const endMinutes = convertTimeToMinutes(fp.endTime)
      
//       if (timeInMinutes >= startMinutes && timeInMinutes < endMinutes) {
//         return { fixedTime, freePeriod: fp }
//       }
//     }
//     return null
//   }

//   // Get tasks for cell
//   const getTasksForCell = (day: string, time: string) => {
//     return tasks.filter(task => {
//       if (task.day !== day) return false
//       if (task.isSleepTime) return false
      
//       const taskStartMinutes = convertTimeToMinutes(task.startTime)
//       const taskEndMinutes = convertTimeToMinutes(task.endTime)
//       const cellMinutes = convertTimeToMinutes(time)
      
//       // Handle overnight tasks
//       if (taskEndMinutes < taskStartMinutes) {
//         // Overnight task
//         return cellMinutes >= taskStartMinutes || cellMinutes < taskEndMinutes
//       } else {
//         // Normal task
//         return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
//       }
//     })
//   }

//   // Get sleep tasks for cell
//   const getSleepTasksForCell = (day: string, time: string) => {
//     return tasks.filter(task => {
//       if (task.day !== day) return false
//       if (!task.isSleepTime) return false
      
//       const taskStartMinutes = convertTimeToMinutes(task.startTime)
//       const taskEndMinutes = convertTimeToMinutes(task.endTime)
//       const cellMinutes = convertTimeToMinutes(time)
      
//       // Handle overnight sleep
//       if (taskEndMinutes < taskStartMinutes) {
//         return cellMinutes >= taskStartMinutes || cellMinutes < taskEndMinutes
//       } else {
//         return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
//       }
//     })
//   }

//   // Check if task should show in cell
//   const shouldShowTaskInCell = (task: TimeSlot, day: string, time: string) => {
//     if (task.day !== day) return false
//     const taskStartMinutes = convertTimeToMinutes(task.startTime)
//     const cellMinutes = convertTimeToMinutes(time)
//     return taskStartMinutes === cellMinutes
//   }

//   // Get task span
//   const getTaskSpan = (task: TimeSlot) => {
//     const startMinutes = convertTimeToMinutes(task.startTime)
//     const endMinutes = convertTimeToMinutes(task.endTime)
//     let duration = endMinutes - startMinutes
//     if (duration < 0) duration += 24 * 60 // Handle overnight
//     return Math.ceil(duration / timeSettings.interval)
//   }

//   // Check if extended time
//   const isExtendedTime = (time: string) => {
//     const [hours] = time.split(':').map(Number)
//     if (timeSettings.extendedHours.morning && hours < 8) return true
//     if (timeSettings.extendedHours.evening && hours >= 18 && hours < 22) return true
//     if (timeSettings.extendedHours.night && hours >= 22) return true
//     if (timeSettings.extendedHours.custom.includes(time)) return true
//     return false
//   }

//   // Get icon by type
//   const getIconByType = (type: string) => {
//     const fixedTimeType = FIXED_TIME_TYPES.find(t => t.id === type)
//     if (fixedTimeType) {
//       const Icon = fixedTimeType.icon
//       return <Icon className="w-4 h-4" />
//     }
//     return <Clock className="w-4 h-4" />
//   }

//   // Get time slot color
//   const getTimeSlotColor = (type: string) => {
//     switch(type) {
//       case 'COLLEGE': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30'
//       case 'OFFICE': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30'
//       case 'SCHOOL': return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/30'
//       case 'COMMUTE': return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/30'
//       case 'MEAL': return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30'
//       case 'WORKOUT': return 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/30'
//       case 'MEETING': return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30'
//       case 'FREE': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30'
//       case 'SLEEP': return 'bg-gray-100 border-gray-300 dark:bg-gray-800/50 dark:border-gray-700'
//       default: return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
//     }
//   }

//   // Generate sleep tasks
//   const generateSleepTasks = () => {
//     const sleepTasks: TimeSlot[] = []
    
//     sleepSchedules.forEach(schedule => {
//       if (!schedule.isActive) return
      
//       const bedtimeMinutes = convertTimeToMinutes(schedule.bedtime)
//       const wakeTimeMinutes = convertTimeToMinutes(schedule.wakeTime)
      
//       if (wakeTimeMinutes < bedtimeMinutes) {
//         // Overnight sleep
//         const midnight = convertTimeToMinutes('24:00')
//         const firstDayDuration = midnight - bedtimeMinutes
        
//         sleepTasks.push({
//           id: `sleep-${schedule.id}-part1`,
//           title: schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
//           subject: 'Rest',
//           startTime: schedule.bedtime,
//           endTime: '24:00',
//           duration: firstDayDuration,
//           priority: 'MEDIUM',
//           color: schedule.color || '#4B5563',
//           day: schedule.day,
//           type: 'sleep',
//           isSleepTime: true,
//           sleepScheduleId: schedule.id,
//           isCompleted: false
//         })
        
//         const nextDayIndex = (days.indexOf(schedule.day) + 1) % days.length
//         const nextDay = days[nextDayIndex]
        
//         sleepTasks.push({
//           id: `sleep-${schedule.id}-part2`,
//           title: schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
//           subject: 'Rest',
//           startTime: '00:00',
//           endTime: schedule.wakeTime,
//           duration: wakeTimeMinutes,
//           priority: 'MEDIUM',
//           color: schedule.color || '#4B5563',
//           day: nextDay,
//           type: 'sleep',
//           isSleepTime: true,
//           sleepScheduleId: schedule.id,
//           isCompleted: false
//         })
//       } else {
//         sleepTasks.push({
//           id: `sleep-${schedule.id}`,
//           title: schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
//           subject: 'Rest',
//           startTime: schedule.bedtime,
//           endTime: schedule.wakeTime,
//           duration: schedule.duration,
//           priority: 'MEDIUM',
//           color: schedule.color || '#4B5563',
//           day: schedule.day,
//           type: 'sleep',
//           isSleepTime: true,
//           sleepScheduleId: schedule.id,
//           isCompleted: false
//         })
//       }
//     })
    
//     setTasks(prev => [...prev.filter(task => !task.isSleepTime), ...sleepTasks])
//   }

//   // Update sleep tasks when schedules change
//   useEffect(() => {
//     if (timeSettings.showSleepBlocks) {
//       generateSleepTasks()
//     } else {
//       setTasks(tasks.filter(task => !task.isSleepTime))
//     }
//   }, [sleepSchedules, timeSettings.showSleepBlocks])

//   // Handle cell click - Only allow task creation in free periods or empty cells (not in fixed commitments)
//   const handleCellClick = (day: string, time: string) => {
//     if (isLocked) return
    
//     const sleepTasks = getSleepTasksForCell(day, time)
//     if (sleepTasks.length > 0 && timeSettings.autoLockSleep) {
//       toast.warning('This is your scheduled sleep time. Adjust sleep schedule to make changes.')
//       return
//     }
    
//     const fixedTime = isTimeInFixedSlot(day, time)
//     const freePeriod = isTimeInFreePeriod(day, time)
    
//     // If in fixed commitment but NOT in free period, show details but don't allow task creation
//     if (fixedTime && !freePeriod) {
//       setSelectedFixedTime(fixedTime)
//       toast.info('This is a fixed commitment. Add a free period first to schedule tasks here.')
//       return
//     }

//     // If in free period or empty cell, allow task creation
//     setTaskCreationContext({ day, time })
//     setShowTaskCreationDialog(true)
//   }

//   // Handle add task
//   const handleAddTaskToCell = (flow: 'simple' | 'withGoal' = 'simple') => {
//     if (!newTask.title.trim()) {
//       toast.error('Please enter a task title')
//       return
//     }
    
//     if (!taskCreationContext) {
//       toast.error('No cell selected')
//       return
//     }

//     // Check if this is a free period
//     const freePeriod = isTimeInFreePeriod(taskCreationContext.day, taskCreationContext.time)
//     const fixedCommitmentId = freePeriod ? freePeriod.fixedTime.id : undefined

//     // Check for conflicts
//     const existingTasks = getTasksForCell(taskCreationContext.day, taskCreationContext.time)
//     if (existingTasks.length > 0) {
//       toast.warning('This time slot already has tasks')
//       return
//     }

//     const goalId = newTask.goalId === 'no-goal' ? undefined : newTask.goalId || undefined
//     const milestoneId = newTask.milestoneId === 'no-milestone' ? undefined : newTask.milestoneId || undefined

//     const task: TimeSlot = {
//       id: `task-${Date.now()}`,
//       title: newTask.title,
//       subject: newTask.subject || 'General',
//       startTime: taskCreationContext.time,
//       endTime: calculateEndTime(taskCreationContext.time, newTask.duration),
//       duration: newTask.duration,
//       priority: newTask.priority,
//       color: newTask.color,
//       day: taskCreationContext.day,
//       type: 'task',
//       fixedCommitmentId,
//       goalId,
//       milestoneId,
//       note: newTask.note,
//       status: 'PENDING'
//     }

//     setTasks([...tasks, task])
//     resetTaskForm()
//     setShowTaskCreationDialog(false)
//     setTaskCreationContext(null)
//     setTaskCreationFlow('simple')
    
//     if (freePeriod) {
//       toast.success(`Task added to free period in ${freePeriod.fixedTime.title}`)
//     } else {
//       toast.success('Task added to timetable')
//     }
//   }

//   // Reset task form
//   const resetTaskForm = () => {
//     setNewTask({
//       title: '',
//       subject: '',
//       note: '',
//       duration: 60,
//       priority: 'MEDIUM',
//       color: '#3B82F6',
//       day: 'MONDAY',
//       startTime: '09:00',
//       goalId: '',
//       milestoneId: '',
//       type: 'STUDY',
//       category: 'ACADEMIC'
//     })
//   }

//   // Handle delete task
//   const handleDeleteTask = (taskId: string) => {
//     setTasks(tasks.filter(task => task.id !== taskId))
//     toast.success('Task deleted')
//   }

//   // Handle edit task
//   const handleEditTask = (task: TimeSlot) => {
//     if (task.isSleepTime) {
//       const schedule = sleepSchedules.find(s => s.id === task.sleepScheduleId)
//       if (schedule) {
//         setEditingSleepSchedule(schedule)
//         setShowSleepScheduleModal(true)
//       }
//       return
//     }
    
//     setEditingTask(task)
//     setNewTask({
//       title: task.title,
//       subject: task.subject,
//       note: task.note || '',
//       duration: task.duration,
//       priority: task.priority,
//       color: task.color,
//       day: task.day,
//       startTime: task.startTime,
//       goalId: task.goalId || '',
//       milestoneId: task.milestoneId || '',
//       type: 'STUDY',
//       category: 'ACADEMIC'
//     })
//     setShowAddTaskModal(true)
//   }

//   // Handle update task
//   const handleUpdateTask = () => {
//     if (!editingTask) return
//     if (!newTask.title.trim()) {
//       toast.error('Please enter a task title')
//       return
//     }

//     const goalId = newTask.goalId === 'no-goal' ? undefined : newTask.goalId || undefined
//     const milestoneId = newTask.milestoneId === 'no-milestone' ? undefined : newTask.milestoneId || undefined

//     const updatedTask = {
//       ...editingTask,
//       ...newTask,
//       goalId,
//       milestoneId,
//       endTime: calculateEndTime(newTask.startTime, newTask.duration)
//     }

//     setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
//     setEditingTask(null)
//     setShowAddTaskModal(false)
//     resetTaskForm()
//     toast.success('Task updated')
//   }

//   // Handle duplicate task
//   const handleDuplicateTask = (task: TimeSlot) => {
//     const duplicatedTask = {
//       ...task,
//       id: `task-${Date.now()}`,
//       title: `${task.title} (Copy)`
//     }
//     setTasks([...tasks, duplicatedTask])
//     toast.success('Task duplicated')
//   }

//   // Handle add fixed time
//   const handleAddFixedTime = () => {
//     if (!newFixedTime.title.trim()) {
//       toast.error('Please enter a title')
//       return
//     }
//     if (newFixedTime.days.length === 0) {
//       toast.error('Please select at least one day')
//       return
//     }

//     const fixedTime: FixedTime = {
//       id: `fixed-${Date.now()}`,
//       title: newFixedTime.title,
//       description: newFixedTime.description,
//       days: newFixedTime.days,
//       startTime: newFixedTime.startTime,
//       endTime: newFixedTime.endTime,
//       type: newFixedTime.type,
//       color: newFixedTime.color,
//       isEditable: newFixedTime.isEditable,
//       freePeriods: []
//     }

//     setFixedTimes([...fixedTimes, fixedTime])
//     setNewFixedTime({
//       title: '',
//       description: '',
//       days: [],
//       startTime: '09:00',
//       endTime: '17:00',
//       type: 'COLLEGE',
//       color: '#EF4444',
//       isEditable: true,
//       freePeriods: []
//     })
//     setShowAddFixedTimeModal(false)
//     toast.success('Fixed commitment added')
//   }

//   // Handle delete fixed time
//   const handleDeleteFixedTime = (id: string) => {
//     setFixedTimes(fixedTimes.filter(ft => ft.id !== id))
//     setSelectedFixedTime(null)
//     toast.success('Fixed commitment deleted')
//   }

//   // Handle edit fixed time
//   const handleEditFixedTime = (fixedTime: FixedTime) => {
//     setEditingFixedTime(fixedTime)
//     setShowEditFixedTimeModal(true)
//   }

//   // Handle save fixed time
//   const handleSaveFixedTime = (updatedFixedTime: FixedTime) => {
//     setFixedTimes(fixedTimes.map(ft => 
//       ft.id === updatedFixedTime.id ? updatedFixedTime : ft
//     ))
//     setShowEditFixedTimeModal(false)
//     setEditingFixedTime(null)
//     toast.success('Fixed commitment updated')
//   }

//   // Handle add free period
//   const handleAddFreePeriod = () => {
//     if (!selectedFixedTimeForFreePeriod) {
//       toast.error('Please select a fixed commitment')
//       return
//     }
    
//     if (!newFreePeriod.title.trim()) {
//       toast.error('Please enter a title')
//       return
//     }
    
//     const startMinutes = convertTimeToMinutes(newFreePeriod.startTime)
//     const endMinutes = convertTimeToMinutes(newFreePeriod.endTime)
    
//     if (endMinutes <= startMinutes) {
//       toast.error('End time must be after start time')
//       return
//     }
    
//     const duration = endMinutes - startMinutes
    
//     const freePeriod = {
//       id: `free-${Date.now()}`,
//       title: newFreePeriod.title,
//       startTime: newFreePeriod.startTime,
//       endTime: newFreePeriod.endTime,
//       duration,
//       day: newFreePeriod.day
//     }
    
//     const updatedFixedTime = {
//       ...selectedFixedTimeForFreePeriod,
//       freePeriods: [...(selectedFixedTimeForFreePeriod.freePeriods || []), freePeriod]
//     }
    
//     setFixedTimes(fixedTimes.map(ft => 
//       ft.id === selectedFixedTimeForFreePeriod.id ? updatedFixedTime : ft
//     ))
    
//     setNewFreePeriod({
//       title: 'Free Period',
//       startTime: '14:00',
//       endTime: '15:00',
//       duration: 60,
//       day: 'MONDAY'
//     })
//     setShowAddFreePeriodModal(false)
//     setSelectedFixedTimeForFreePeriod(null)
//     toast.success('Free period added')
//   }

//   // Handle delete free period
//   const handleDeleteFreePeriod = (fixedTimeId: string, freePeriodId: string) => {
//     const fixedTime = fixedTimes.find(ft => ft.id === fixedTimeId)
//     if (!fixedTime) return
    
//     const updatedFixedTime = {
//       ...fixedTime,
//       freePeriods: fixedTime.freePeriods?.filter(fp => fp.id !== freePeriodId) || []
//     }
    
//     setFixedTimes(fixedTimes.map(ft => 
//       ft.id === fixedTimeId ? updatedFixedTime : ft
//     ))
//     toast.success('Free period deleted')
//   }

//   // Handle save sleep schedule
//   const handleSaveSleepSchedule = (schedule: SleepSchedule) => {
//     const existingIndex = sleepSchedules.findIndex(s => s.id === schedule.id)
//     let updatedSchedules
    
//     if (existingIndex >= 0) {
//       updatedSchedules = [...sleepSchedules]
//       updatedSchedules[existingIndex] = schedule
//     } else {
//       updatedSchedules = [...sleepSchedules, schedule]
//     }
    
//     setSleepSchedules(updatedSchedules)
//     toast.success('Sleep schedule updated')
//     setEditingSleepSchedule(null)
//     setShowSleepScheduleModal(false)
//   }

//   // Handle delete sleep schedule
//   const handleDeleteSleepSchedule = (id: string) => {
//     setSleepSchedules(sleepSchedules.filter(s => s.id !== id))
//     toast.success('Sleep schedule deleted')
//   }

//   // Handle save time settings
//   const handleSaveTimeSettings = () => {
//     setTimeSlots(generateTimeSlots())
//     setShowTimeSettingsModal(false)
//     toast.success('Display settings updated')
//   }

//   // Handle extend time
//   const handleExtendTime = (extensionType: 'morning' | 'evening' | 'night' | 'custom', customSlots?: string[]) => {
//     const updatedExtendedHours = { ...timeSettings.extendedHours }
//     switch(extensionType) {
//       case 'morning':
//         updatedExtendedHours.morning = !updatedExtendedHours.morning
//         break
//       case 'evening':
//         updatedExtendedHours.evening = !updatedExtendedHours.evening
//         break
//       case 'night':
//         updatedExtendedHours.night = !updatedExtendedHours.night
//         break
//       case 'custom':
//         if (customSlots) {
//           updatedExtendedHours.custom = customSlots
//         }
//         break
//     }
//     setTimeSettings({ ...timeSettings, extendedHours: updatedExtendedHours })
//     setTimeSlots(generateTimeSlots())
//   }

//   // Handle add custom time
//   const handleAddCustomTime = (time: string) => {
//     if (!time) return
    
//     if (timeSettings.extendedHours.custom.includes(time)) {
//       toast.warning('Time slot already added')
//       return
//     }
    
//     const updatedCustom = [...timeSettings.extendedHours.custom, time].sort((a, b) => {
//       const [aH, aM] = a.split(':').map(Number)
//       const [bH, bM] = b.split(':').map(Number)
//       return (aH * 60 + aM) - (bH * 60 + bM)
//     })
    
//     handleExtendTime('custom', updatedCustom)
//     toast.success(`Added ${formatTimeDisplay(time)}`)
//   }

//   // Handle remove custom time
//   const handleRemoveCustomTime = (time: string) => {
//     const updatedCustom = timeSettings.extendedHours.custom.filter(t => t !== time)
//     handleExtendTime('custom', updatedCustom)
//     toast.success(`Removed ${formatTimeDisplay(time)}`)
//   }

//   // Handle lock timetable
//   const handleLockTimetable = () => {
//     setShowLockProgress(true)
//     setIsLocking(true)
//     setLockProgress([{ step: 'Saving Timetable', status: 'in-progress', message: 'Saving...' }])
    
//     setTimeout(() => {
//       setIsLocked(true)
//       setLockSuccess(true)
//       setIsLocking(false)
//       setLockProgress([{ step: 'Saving Timetable', status: 'completed', message: 'Saved successfully' }])
//       setHasUnsavedChanges(false)
//       toast.success('Timetable locked and saved')
//     }, 1500)
//   }

//   // Handle unlock timetable
//   const handleUnlockTimetable = () => {
//     setIsLocked(false)
//     setLockSuccess(false)
//     setHasUnsavedChanges(true)
//     toast.success('Timetable unlocked')
//   }

//   // Handle reset timetable
//   const handleResetTimetable = () => {
//     setShowResetConfirm(true)
//   }

//   // Confirm reset
//   const confirmReset = () => {
//     setTasks([])
//     setFixedTimes([])
//     setSleepSchedules([])
//     setHasUnsavedChanges(true)
//     setShowResetConfirm(false)
//     toast.success('Timetable reset')
//   }

//   // Handle share
//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: 'My Timetable',
//         text: 'Check out my weekly schedule!',
//         url: window.location.href,
//       }).catch(() => {
//         navigator.clipboard.writeText(window.location.href)
//         toast.success('Link copied!')
//       })
//     } else {
//       navigator.clipboard.writeText(window.location.href)
//       toast.success('Link copied!')
//     }
//   }

//   // Handle export PDF
//   const handleExportPDF = () => {
//     toast.info('PDF export coming soon')
//   }

//   // Handle print
//   const handlePrint = () => {
//     window.print()
//   }

//   // Toggle weekends
//   const toggleWeekends = () => {
//     setTimeSettings({ ...timeSettings, showWeekends: !timeSettings.showWeekends })
//   }

//   // Get sleep stats
//   const getSleepStats = () => {
//     const activeSchedules = sleepSchedules.filter(s => s.isActive)
//     const totalSleepHours = activeSchedules.reduce((sum, s) => sum + (s.duration / 60), 0)
//     const avgSleepHours = activeSchedules.length > 0 ? totalSleepHours / activeSchedules.length : 0
//     return { totalSleepHours, avgSleepHours, daysWithSleep: activeSchedules.length }
//   }

//   // Get goal stats
//   const getGoalStats = () => {
//     const totalGoals = goals.length
//     const goalsWithTasks = tasks.filter(t => t.goalId).length
//     const totalMilestones = goals.reduce((sum, g) => sum + g.milestones.length, 0)
//     const milestonesWithTasks = tasks.filter(t => t.milestoneId).length
//     return { totalGoals, goalsWithTasks, totalMilestones, milestonesWithTasks }
//   }

//   // Toggle goal expansion
//   const toggleGoalExpansion = (goalId: string) => {
//     setExpandedGoals(prev => 
//       prev.includes(goalId) 
//         ? prev.filter(id => id !== goalId)
//         : [...prev, goalId]
//     )
//   }

//   // Task component
//   const TaskComponent = ({ 
//     task, 
//     onEdit,
//     onDelete,
//     onDuplicate 
//   }: { 
//     task: TimeSlot
//     onEdit: (task: TimeSlot) => void
//     onDelete: (taskId: string) => void
//     onDuplicate: (task: TimeSlot) => void
//   }) => {
//     const goal = goals.find(g => g.id === task.goalId)
//     const milestone = goal?.milestones.find(m => m.id === task.milestoneId)
    
//     return (
//       <div className="relative group h-full">
//         <div
//           className={cn(
//             "p-1.5 rounded border-2 shadow-sm cursor-pointer transition-all h-full",
//             "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500",
//             "bg-white dark:bg-gray-800",
//             task.fixedCommitmentId ? "border-green-300 dark:border-green-700" : "border-gray-200 dark:border-gray-700",
//             task.priority === 'CRITICAL' && "border-red-300 dark:border-red-700",
//             task.priority === 'HIGH' && "border-orange-300 dark:border-orange-700",
//             task.priority === 'MEDIUM' && "border-yellow-300 dark:border-yellow-700",
//           )}
//           style={{ borderLeftColor: task.color, borderLeftWidth: '4px' }}
//           onClick={() => onEdit(task)}
//         >
//           <div className="flex items-start justify-between gap-1">
//             <div className="flex-1 min-w-0">
//               <h4 className="text-xs font-semibold truncate dark:text-gray-200">{task.title}</h4>
//               <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{task.subject}</p>
//             </div>
//             {!isLocked && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
//                   <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
//                     <MoreVertical className="w-3 h-3" />
//                   </button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-32">
//                   <DropdownMenuItem onClick={() => onEdit(task)}>
//                     <Edit2 className="w-3 h-3 mr-2" />
//                     Edit
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => onDuplicate(task)}>
//                     <Copy className="w-3 h-3 mr-2" />
//                     Copy
//                   </DropdownMenuItem>
//                   <DropdownMenuItem 
//                     onClick={() => onDelete(task.id)}
//                     className="text-red-600"
//                   >
//                     <Trash2 className="w-3 h-3 mr-2" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
          
//           <div className="mt-1 flex items-center justify-between">
//             <Badge variant="outline" className={cn(
//               "text-[8px] px-1 py-0",
//               task.priority === 'CRITICAL' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//               task.priority === 'HIGH' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
//               task.priority === 'MEDIUM' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
//               task.priority === 'LOW' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//             )}>
//               {task.priority}
//             </Badge>
//             {milestone && (
//               <Badge variant="outline" className="text-[8px] px-1 py-0 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
//                 {milestone.title.slice(0, 8)}...
//               </Badge>
//             )}
//           </div>
          
//           {getTaskSpan(task) > 1 && (
//             <div className="absolute bottom-0.5 right-0.5 text-[8px] text-gray-400">
//               {Math.round(task.duration / 60)}h
//             </div>
//           )}
//         </div>
//       </div>
//     )
//   }

//   // Fixed commitment card component
//   const FixedCommitmentCard = ({ fixedTime }: { fixedTime: FixedTime }) => {
//     const Icon = FIXED_TIME_TYPES.find(t => t.id === fixedTime.type)?.icon || Clock
    
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={cn(
//           "p-4 rounded-lg border-2 cursor-pointer transition-all",
//           getTimeSlotColor(fixedTime.type),
//           "hover:shadow-md"
//         )}
//         onClick={() => setSelectedFixedTime(fixedTime)}
//       >
//         <div className="flex items-start gap-3">
//           <div className="p-2 rounded-lg" style={{ backgroundColor: `${fixedTime.color}20` }}>
//             <Icon className="w-5 h-5" style={{ color: fixedTime.color }} />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h4 className="font-semibold text-gray-900 dark:text-gray-100">{fixedTime.title}</h4>
//             <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//               {fixedTime.days.map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(', ')} • {formatTimeDisplay(fixedTime.startTime)} - {formatTimeDisplay(fixedTime.endTime)}
//             </p>
//             {fixedTime.description && (
//               <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">{fixedTime.description}</p>
//             )}
//             <div className="flex items-center gap-2">
//               <Badge variant="outline" className={cn(
//                 "text-xs",
//                 fixedTime.type === 'COLLEGE' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//                 fixedTime.type === 'WORKOUT' && "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
//               )}>
//                 {FIXED_TIME_TYPES.find(t => t.id === fixedTime.type)?.label}
//               </Badge>
//               {fixedTime.freePeriods && fixedTime.freePeriods.length > 0 && (
//                 <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
//                   {fixedTime.freePeriods.length} free period{fixedTime.freePeriods.length > 1 ? 's' : ''}
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     )
//   }

//   // Compact Goal card component (for bottom section)
//   const CompactGoalCard = ({ goal }: { goal: Goal }) => {
//     const Icon = GOAL_CATEGORIES.find(c => c.id === goal.category)?.icon || Target
//     const isExpanded = expandedGoals.includes(goal.id)
    
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden"
//       >
//         <div 
//           className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
//           onClick={() => toggleGoalExpansion(goal.id)}
//         >
//           <div className="flex items-center gap-2">
//             <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${goal.color}20` }}>
//               <Icon className="w-4 h-4" style={{ color: goal.color }} />
//             </div>
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center justify-between">
//                 <h4 className="font-medium text-sm truncate">{goal.title}</h4>
//                 {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//               </div>
//               <div className="flex items-center gap-2 text-xs text-gray-500">
//                 <span>{goal.progress}%</span>
//                 <span>•</span>
//                 <span>{goal.milestones.length} milestones</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <AnimatePresence>
//           {isExpanded && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 'auto', opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               className="border-t border-gray-200 dark:border-gray-700"
//             >
//               <div className="p-3 space-y-2">
//                 {goal.milestones.map(milestone => {
//                   const isScheduled = tasks.some(t => t.milestoneId === milestone.id)
//                   return (
//                     <div 
//                       key={milestone.id}
//                       className="text-xs p-2 rounded border border-gray-100 dark:border-gray-700"
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className="font-medium">{milestone.title}</span>
//                         <Badge variant="outline" className="text-[10px] px-1">
//                           {milestone.progress}%
//                         </Badge>
//                       </div>
//                       <div className="flex items-center justify-between mt-1">
//                         <span className="text-gray-500">{milestone.completedHours.toFixed(1)}/{milestone.scheduledHours}h</span>
//                         {!milestone.completed && (
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             className="h-5 px-2 text-[10px]"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               setTaskCreationContext({ day: 'MONDAY', time: '10:00' })
//                               setNewTask({
//                                 ...newTask,
//                                 title: milestone.title,
//                                 subject: goal.subject,
//                                 goalId: goal.id,
//                                 milestoneId: milestone.id
//                               })
//                               setShowTaskCreationDialog(true)
//                             }}
//                           >
//                             <Plus className="w-2 h-2 mr-1" />
//                             Schedule
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     )
//   }

//   // Time cell component
//   const TimeCell = ({ day, time }: { day: string; time: string }) => {
//     const fixedTime = isTimeInFixedSlot(day, time)
//     const freePeriodInfo = isTimeInFreePeriod(day, time)
//     const tasksInCell = getTasksForCell(day, time)
//     const sleepTasksInCell = getSleepTasksForCell(day, time)
//     const primaryTask = tasksInCell.find(task => 
//       convertTimeToMinutes(task.startTime) === convertTimeToMinutes(time)
//     ) || tasksInCell[0]
//     const sleepTask = sleepTasksInCell[0]
    
//     const isFreePeriod = !!freePeriodInfo
//     const hasSleep = sleepTasksInCell.length > 0
//     const isFixedCommitment = !!fixedTime && !isFreePeriod
    
//     return (
//       <div
//         className={cn(
//           "relative border-r border-b border-gray-200 dark:border-gray-700 group",
//           "transition-all duration-150",
//           isFixedCommitment && getTimeSlotColor(fixedTime!.type),
//           isFreePeriod && "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
//           isExtendedTime(time) && !isFixedCommitment && !hasSleep && !isFreePeriod && "bg-yellow-50/30 dark:bg-yellow-900/10",
//           hasSleep && "bg-gray-100/50 dark:bg-gray-800/50",
//           "hover:bg-gray-50 dark:hover:bg-gray-800/50"
//         )}
//         style={{ height: `${timeSettings.cellHeight}px` }}
//         onClick={() => handleCellClick(day, time)}
//       >
//         {/* Fixed commitment indicator */}
//         {isFixedCommitment && !primaryTask && !hasSleep && (
//           <div className="absolute inset-0 flex items-center justify-center p-1">
//             <div className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">
//               <div className="flex items-center justify-center gap-1">
//                 {getIconByType(fixedTime!.type)}
//                 <span className="truncate">{fixedTime!.title}</span>
//               </div>
//               <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
//                 Fixed - Add free period first
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Free period indicator */}
//         {isFreePeriod && !primaryTask && !hasSleep && (
//           <div className="absolute inset-0 flex items-center justify-center p-1">
//             <div className="text-xs font-medium text-green-700 dark:text-green-400">
//               <div className="flex items-center justify-center gap-1">
//                 <Coffee className="w-3 h-3" />
//                 <span>Free: {freePeriodInfo?.freePeriod.title}</span>
//               </div>
//               <div className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">
//                 Click to add task
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Sleep indicator */}
//         {hasSleep && !primaryTask && (
//           <div className="absolute inset-0 flex items-center justify-center p-1">
//             <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
//               <div className="flex items-center justify-center gap-1">
//                 <Moon className="w-3 h-3" />
//                 <span>Sleep Time</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Task */}
//         {primaryTask && shouldShowTaskInCell(primaryTask, day, time) && (
//           <div className="absolute inset-0 p-0.5">
//             <TaskComponent 
//               task={primaryTask}
//               onEdit={handleEditTask}
//               onDelete={handleDeleteTask}
//               onDuplicate={handleDuplicateTask}
//             />
//           </div>
//         )}

//         {/* Multiple tasks indicator */}
//         {tasksInCell.length > 1 && !primaryTask && (
//           <div className="absolute bottom-1 right-1">
//             <Badge variant="outline" className="text-[10px] px-1 py-0">
//               +{tasksInCell.length}
//             </Badge>
//           </div>
//         )}

//         {/* Add button overlay - only for free periods or empty cells (not fixed commitments) */}
//         {!isLocked && !hasSleep && !isFixedCommitment && (
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80">
//             <Button
//               size="sm"
//               variant="ghost"
//               className="h-6 w-6 p-0"
//               onClick={(e) => {
//                 e.stopPropagation()
//                 setTaskCreationContext({ day, time })
//                 setShowTaskCreationDialog(true)
//               }}
//             >
//               <Plus className="w-3 h-3" />
//             </Button>
//           </div>
//         )}
//       </div>
//     )
//   }

//   // Render timetable grid
//   const renderTimetableGrid = () => {
//     const cellWidth = timeSettings.displayMode === 'vertical' ? 140 : 120
    
//     if (timeSettings.displayMode === 'vertical') {
//       return (
//         <div className="overflow-x-auto pb-4">
//           <div className="inline-block min-w-full">
//             {/* Header row - Days */}
//             <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
//               <div className="w-24 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
//                 <span className="font-bold">Time</span>
//               </div>
//               {days.map((day) => (
//                 <div
//                   key={day}
//                   className="flex-1 min-w-[140px] p-3 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0"
//                   style={{ minWidth: cellWidth }}
//                 >
//                   <div className="flex flex-col items-center">
//                     <span className="font-bold text-sm">
//                       {day.charAt(0) + day.slice(1).toLowerCase()}
//                     </span>
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                       {['SATURDAY', 'SUNDAY'].includes(day) ? 'Weekend' : 'Weekday'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Time rows */}
//             <div className="flex">
//               {/* Time labels */}
//               <div className="w-24 flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-r-2 border-gray-300 dark:border-gray-700">
//                 {timeSlots.map((time) => (
//                   <div
//                     key={time}
//                     className={cn(
//                       "flex items-center justify-center border-b border-gray-200 dark:border-gray-700",
//                       isExtendedTime(time) && "bg-yellow-50 dark:bg-yellow-900/20"
//                     )}
//                     style={{ height: `${timeSettings.cellHeight}px` }}
//                   >
//                     <span className="text-xs font-medium">
//                       {formatTimeDisplay(time)}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* Day columns */}
//               {days.map(day => (
//                 <div key={day} className="flex-1 min-w-[140px]" style={{ minWidth: cellWidth }}>
//                   {timeSlots.map((time) => (
//                     <TimeCell key={`${day}-${time}`} day={day} time={time} />
//                   ))}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )
//     } else {
//       return (
//         <div className="overflow-x-auto pb-4">
//           <div className="inline-block min-w-full">
//             {/* Header row - Time */}
//             <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
//               <div className="w-32 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
//                 <span className="font-bold">Day / Time</span>
//               </div>
//               {timeSlots.map((time) => (
//                 <div
//                   key={time}
//                   className={cn(
//                     "flex-1 p-3 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0",
//                     isExtendedTime(time) && "bg-yellow-50 dark:bg-yellow-900/20"
//                   )}
//                   style={{ minWidth: 120 }}
//                 >
//                   <div className="flex flex-col items-center">
//                     <span className="font-bold text-sm">{formatTimeDisplay(time)}</span>
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                       to {formatTimeDisplay(getNextTimeSlot(time))}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Day rows */}
//             {days.map((day) => (
//               <div key={day} className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0">
//                 {/* Day label */}
//                 <div 
//                   className="w-32 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center p-3"
//                   style={{ height: `${timeSettings.cellHeight}px` }}
//                 >
//                   <div className="text-center">
//                     <span className="font-bold text-sm block">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
//                     <span className="text-xs text-gray-500">
//                       {['SATURDAY', 'SUNDAY'].includes(day) ? 'Weekend' : 'Weekday'}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Time cells */}
//                 {timeSlots.map((time) => (
//                   <div key={`${day}-${time}`} className="flex-1" style={{ minWidth: 120 }}>
//                     <TimeCell day={day} time={time} />
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       )
//     }
//   }

//   // Render compact view
//   const renderCompactView = () => {
//     return (
//       <div className="space-y-4">
//         {days.map(day => {
//           const dayTasks = tasks
//             .filter(t => t.day === day && !t.isSleepTime)
//             .sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))
//           const dayFixedTimes = fixedTimes.filter(ft => ft.days.includes(day))
          
//           return (
//             <Card key={day} className="overflow-hidden">
//               <CardContent className="p-4">
//                 <h3 className="font-bold text-lg mb-3">{day.charAt(0) + day.slice(1).toLowerCase()}</h3>
                
//                 {/* Fixed commitments */}
//                 {dayFixedTimes.length > 0 && (
//                   <div className="mb-4">
//                     <h4 className="text-sm font-medium text-gray-500 mb-2">Fixed Commitments</h4>
//                     {dayFixedTimes.map(ft => (
//                       <div 
//                         key={ft.id}
//                         className="p-2 mb-2 rounded border-l-4 bg-gray-50 dark:bg-gray-800 cursor-pointer"
//                         style={{ borderLeftColor: ft.color }}
//                         onClick={() => setSelectedFixedTime(ft)}
//                       >
//                         <div className="flex justify-between">
//                           <span className="font-medium">{ft.title}</span>
//                           <span className="text-sm text-gray-500">
//                             {formatTimeDisplay(ft.startTime)} - {formatTimeDisplay(ft.endTime)}
//                           </span>
//                         </div>
//                         {ft.freePeriods?.filter(fp => fp.day === day).map(fp => (
//                           <div key={fp.id} className="mt-1 ml-2 text-sm text-green-600">
//                             Free: {fp.title} ({formatTimeDisplay(fp.startTime)} - {formatTimeDisplay(fp.endTime)})
//                           </div>
//                         ))}
//                       </div>
//                     ))}
//                   </div>
//                 )}
                
//                 {/* Tasks */}
//                 {dayTasks.length > 0 ? (
//                   <div className="space-y-2">
//                     <h4 className="text-sm font-medium text-gray-500 mb-2">Tasks</h4>
//                     {dayTasks.map(task => {
//                       const goal = goals.find(g => g.id === task.goalId)
//                       return (
//                         <div 
//                           key={task.id}
//                           className="p-3 rounded border-l-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer"
//                           style={{ borderLeftColor: task.color }}
//                           onClick={() => handleEditTask(task)}
//                         >
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <h4 className="font-medium">{task.title}</h4>
//                               <p className="text-sm text-gray-500">{task.subject}</p>
//                               {goal && (
//                                 <p className="text-xs text-gray-400 mt-1">Goal: {goal.title}</p>
//                               )}
//                             </div>
//                             <Badge className={cn(
//                               task.priority === 'CRITICAL' && "bg-red-100 text-red-700",
//                               task.priority === 'HIGH' && "bg-orange-100 text-orange-700",
//                               task.priority === 'MEDIUM' && "bg-yellow-100 text-yellow-700",
//                               task.priority === 'LOW' && "bg-blue-100 text-blue-700",
//                             )}>
//                               {task.priority}
//                             </Badge>
//                           </div>
//                           <div className="mt-2 text-sm text-gray-500">
//                             {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)} ({task.duration} min)
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 ) : (
//                   <p className="text-center text-gray-500 py-4">No tasks scheduled</p>
//                 )}
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>
//     )
//   }

//   const sleepStats = getSleepStats()
//   const goalStats = getGoalStats()

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-between">
//             {/* Left side */}
//             <div className="flex items-center gap-4">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="lg:hidden"
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               >
//                 <Menu className="w-5 h-5" />
//               </Button>
              
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
//                   Chronify AI
//                 </h1>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
//                   Timetable Builder
//                 </p>
//               </div>

//               {/* Tabs */}
//               <div className="hidden lg:flex items-center gap-1">
//                 {['Dashboard', 'Timetable', 'Goals', 'Builder', 'Insights', 'Progress'].map(tab => (
//                   <Button
//                     key={tab}
//                     variant={tab === 'Builder' ? 'default' : 'ghost'}
//                     size="sm"
//                     className="text-sm"
//                   >
//                     {tab}
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             {/* Center - User type and status */}
//             <div className="hidden md:flex items-center gap-2">
//               <Badge variant="outline" className="capitalize">
//                 {userType}
//               </Badge>
//               {hasUnsavedChanges && (
//                 <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
//                   <AlertCircle className="w-3 h-3 mr-1" />
//                   Unsaved Changes
//                 </Badge>
//               )}
//             </div>

//             {/* Right side */}
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={toggleDarkMode}
//                 className="hidden sm:flex"
//               >
//                 {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//               </Button>

//               <Button variant="ghost" size="sm" className="hidden sm:flex">
//                 Sign In
//               </Button>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="sm" className="gap-2">
//                     <Settings className="w-4 h-4" />
//                     <span className="hidden md:inline">Settings</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem onClick={() => setShowTimeSettingsModal(true)}>
//                     Display Settings
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setShowTimeExtensionModal(true)}>
//                     Extend Hours
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setShowSleepScheduleModal(true)}>
//                     Sleep Schedule
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={toggleDarkMode}>
//                     {darkMode ? 'Light Mode' : 'Dark Mode'}
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>

//           {/* Mobile status */}
//           <div className="md:hidden flex items-center gap-2 mt-2">
//             <Badge variant="outline" className="capitalize">
//               {userType}
//             </Badge>
//             {hasUnsavedChanges && (
//               <Badge className="bg-yellow-100 text-yellow-800">
//                 <AlertCircle className="w-3 h-3 mr-1" />
//                 Unsaved Changes
//               </Badge>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Mobile menu */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
//           >
//             <div className="p-4 space-y-2">
//               {['Dashboard', 'Timetable', 'Goals', 'Builder', 'Insights', 'Progress'].map(tab => (
//                 <Button
//                   key={tab}
//                   variant={tab === 'Builder' ? 'default' : 'ghost'}
//                   size="sm"
//                   className="w-full justify-start"
//                 >
//                   {tab}
//                 </Button>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main content */}
//       <main className="max-w-7xl mx-auto p-4 space-y-4">
//         {/* Info bar */}
//         <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
//           <div className="flex items-center gap-2">
//             <span className="font-medium">Weekdays as {timeSettings.displayMode === 'vertical' ? 'columns' : 'rows'}, time as {timeSettings.displayMode === 'vertical' ? 'rows' : 'columns'}</span>
//             {timeSettings.showSleepBlocks && (
//               <>
//                 <span>•</span>
//                 <span>Sleep schedule active</span>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Action buttons */}
//         <div className="flex flex-wrap items-center gap-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" className="gap-2">
//                 <FileText className="w-4 h-4" />
//                 Export
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="start">
//               <DropdownMenuItem onClick={() => setViewMode('pdf')}>
//                 View as PDF
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={handleExportPDF}>
//                 Download PDF
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={handlePrint}>
//                 Print
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={handleShare}>
//                 Share
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <Button 
//             variant="outline" 
//             size="sm" 
//             className="gap-2"
//             onClick={() => setShowGoalsModal(true)}
//           >
//             <Target className="w-4 h-4" />
//             Schedule Goals
//           </Button>

//           <Button 
//             variant="outline" 
//             size="sm" 
//             className="gap-2"
//             onClick={() => setShowSleepScheduleModal(true)}
//           >
//             <Bed className="w-4 h-4" />
//             Sleep Schedule
//           </Button>

//           <Button 
//             variant="outline" 
//             size="sm" 
//             className="gap-2"
//             onClick={() => setShowTimeSettingsModal(true)}
//           >
//             <Settings className="w-4 h-4" />
//             Display Settings
//           </Button>

//           <Button 
//             variant="outline" 
//             size="sm" 
//             className="gap-2"
//             onClick={() => setShowTimeExtensionModal(true)}
//           >
//             <PlusCircle className="w-4 h-4" />
//             Extend Time
//           </Button>

//           <Button 
//             variant="outline" 
//             size="sm" 
//             className="gap-2"
//             onClick={toggleWeekends}
//           >
//             {timeSettings.showWeekends ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//             {timeSettings.showWeekends ? 'Hide' : 'Show'} Weekends
//           </Button>

//           <Button 
//             variant={isLocked ? "outline" : "default"}
//             size="sm" 
//             className="gap-2"
//             onClick={isLocked ? handleUnlockTimetable : handleLockTimetable}
//             disabled={isLocking}
//           >
//             {isLocking ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : isLocked ? (
//               <Unlock className="w-4 h-4" />
//             ) : (
//               <Lock className="w-4 h-4" />
//             )}
//             {isLocked ? 'Unlock' : 'Lock'} Timetable
//           </Button>

//           <Button 
//             variant="destructive" 
//             size="sm" 
//             className="gap-2"
//             onClick={handleResetTimetable}
//           >
//             <RefreshCw className="w-4 h-4" />
//             Reset
//           </Button>
//         </div>

//         {/* View mode toggles */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Button
//               variant={viewMode === 'grid' ? 'default' : 'outline'}
//               size="sm"
//               onClick={() => setViewMode('grid')}
//               className="gap-2"
//             >
//               <Grid className="w-4 h-4" />
//               Grid View
//             </Button>
//             <Button
//               variant={viewMode === 'compact' ? 'default' : 'outline'}
//               size="sm"
//               onClick={() => setViewMode('compact')}
//               className="gap-2"
//             >
//               <List className="w-4 h-4" />
//               Compact View
//             </Button>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <Button
//               variant={timeSettings.displayMode === 'vertical' ? 'default' : 'outline'}
//               size="sm"
//               onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
//               className="gap-2"
//             >
//               <Columns className="w-4 h-4" />
//               Vertical
//             </Button>
//             <Button
//               variant={timeSettings.displayMode === 'horizontal' ? 'default' : 'outline'}
//               size="sm"
//               onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
//               className="gap-2"
//             >
//               <Rows className="w-4 h-4" />
//               Horizontal
//             </Button>
//           </div>
//         </div>

//         {/* Stats cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
//           <Card>
//             <CardContent className="p-3">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
//                   <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold">
//                     {(tasks.reduce((sum, t) => sum + t.duration, 0) / 60).toFixed(1)}h
//                   </div>
//                   <div className="text-xs text-gray-500">Total Hours</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-3">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
//                   <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold">{tasks.length}</div>
//                   <div className="text-xs text-gray-500">Tasks Planned</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-3">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
//                   <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold">{goalStats.goalsWithTasks}/{goalStats.totalGoals}</div>
//                   <div className="text-xs text-gray-500">Goals Scheduled</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-3">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
//                   <Award className="w-4 h-4 text-orange-600 dark:text-orange-400" />
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold">{goalStats.milestonesWithTasks}/{goalStats.totalMilestones}</div>
//                   <div className="text-xs text-gray-500">Milestones</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-3">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
//                   <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold">{sleepStats.totalSleepHours.toFixed(1)}h</div>
//                   <div className="text-xs text-gray-500">Sleep Hours</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-3">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/30">
//                   <Bed className="w-4 h-4 text-pink-600 dark:text-pink-400" />
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold">{sleepStats.avgSleepHours.toFixed(1)}h</div>
//                   <div className="text-xs text-gray-500">Avg Sleep</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-3">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
//                   <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
//                 </div>
//                 <div>
//                   <div className="text-lg font-bold">{fixedTimes.length}</div>
//                   <div className="text-xs text-gray-500">Fixed Commits</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Fixed commitments section */}
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h3 className="font-bold text-lg">Fixed Commitments</h3>
//                 <p className="text-sm text-gray-500">
//                   Add your regular commitments (college, office, gym, etc.) to mark them as unavailable. 
//                   You can add free periods within these commitments for scheduling tasks.
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Badge variant="secondary">{fixedTimes.length} commitments</Badge>
//                 <Button 
//                   size="sm"
//                   onClick={() => setShowAddFixedTimeModal(true)}
//                   className="gap-2"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Fixed Commitment
//                 </Button>
//               </div>
//             </div>
            
//             {fixedTimes.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {fixedTimes.map(ft => (
//                   <FixedCommitmentCard key={ft.id} fixedTime={ft} />
//                 ))}
//                 <div 
//                   className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 cursor-pointer flex items-center justify-center"
//                   onClick={() => setShowAddFixedTimeModal(true)}
//                 >
//                   <div className="text-center">
//                     <Plus className="w-6 h-6 mx-auto mb-2 text-gray-400" />
//                     <p className="text-sm font-medium">Add Fixed Commitment</p>
//                     <p className="text-xs text-gray-500 mt-1">Add college hours, office time, gym sessions, etc.</p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div 
//                 className="p-8 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 cursor-pointer text-center"
//                 onClick={() => setShowAddFixedTimeModal(true)}
//               >
//                 <Plus className="w-8 h-8 mx-auto mb-3 text-gray-400" />
//                 <p className="font-medium">Add Your First Fixed Commitment</p>
//                 <p className="text-sm text-gray-500 mt-1">Click to add college hours, office time, gym sessions, etc.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Main timetable */}
//         <Card>
//           <CardContent className="p-4">
//             {viewMode === 'compact' ? renderCompactView() : renderTimetableGrid()}
//           </CardContent>
//         </Card>

//         {/* Goals & Milestones section - moved to bottom */}
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h3 className="font-bold text-lg">Goals & Milestones</h3>
//                 <p className="text-sm text-gray-500">
//                   Track your progress and schedule tasks from your goals
//                 </p>
//               </div>
//               <Button 
//                 size="sm"
//                 variant="outline"
//                 onClick={() => setShowGoalsModal(true)}
//                 className="gap-2"
//               >
//                 <Target className="w-4 h-4" />
//                 View All Goals
//               </Button>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//               {goals.map(goal => (
//                 <CompactGoalCard key={goal.id} goal={goal} />
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Footer */}
//         <div className="text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-800 pt-6 mt-8">
//           <p>
//             Chronify AI Timetable Builder helps you create a personalized weekly schedule with fixed commitments, 
//             free periods, tasks from goals, and sleep schedules. Perfect for students managing college schedules, 
//             professionals organizing work tasks, and anyone wanting to optimize their daily routine.
//           </p>
//           <p className="mt-2">
//             Create your perfect schedule today with Chronify AI - the smart way to organize your time and achieve your goals.
//           </p>
//         </div>
//       </main>

//       {/* Task Creation Dialog with Options */}
//       <Dialog open={showTaskCreationDialog} onOpenChange={(open) => {
//         setShowTaskCreationDialog(open)
//         if (!open) {
//           setTaskCreationContext(null)
//           resetTaskForm()
//           setTaskCreationFlow('simple')
//         }
//       }}>
//         <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
//           <DialogHeader>
//             <DialogTitle className="dark:text-gray-100">
//               Add Task to {taskCreationContext?.day.charAt(0) + taskCreationContext?.day.slice(1).toLowerCase()} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
//             </DialogTitle>
//             <DialogDescription className="dark:text-gray-400">
//               Choose how you want to add this task
//             </DialogDescription>
//           </DialogHeader>
          
//           {taskCreationFlow === 'simple' ? (
//             <div className="space-y-4 py-4">
//               <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4">
//                 <p className="text-sm text-gray-700 dark:text-gray-300">
//                   <span className="font-medium">Time Slot:</span> {taskCreationContext?.day.charAt(0) + taskCreationContext?.day.slice(1).toLowerCase()} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
//                 </p>
//                 <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                   Task will be scheduled starting at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
//                 </p>
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Task Title *</label>
//                 <Input
//                   placeholder="e.g., Study React, Complete Assignment"
//                   value={newTask.title}
//                   onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Subject</label>
//                   <Input
//                     placeholder="e.g., DSA, Web Dev"
//                     value={newTask.subject}
//                     onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Duration</label>
//                   <Select
//                     value={newTask.duration.toString()}
//                     onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
//                   >
//                     <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                       <SelectValue placeholder="Select duration" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                       <SelectItem value={timeSettings.interval.toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval} minutes</SelectItem>
//                       <SelectItem value={(timeSettings.interval * 2).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 2} minutes</SelectItem>
//                       <SelectItem value={(timeSettings.interval * 3).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 3} minutes</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Priority</label>
//                 <Select
//                   value={newTask.priority}
//                   onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
//                 >
//                   <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                     <SelectValue placeholder="Select priority" />
//                   </SelectTrigger>
//                   <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                     <SelectItem value="LOW" className="dark:text-gray-300 dark:hover:bg-gray-700">Low</SelectItem>
//                     <SelectItem value="MEDIUM" className="dark:text-gray-300 dark:hover:bg-gray-700">Medium</SelectItem>
//                     <SelectItem value="HIGH" className="dark:text-gray-300 dark:hover:bg-gray-700">High</SelectItem>
//                     <SelectItem value="CRITICAL" className="dark:text-gray-300 dark:hover:bg-gray-700">Critical</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Notes (Optional)</label>
//                 <Textarea
//                   placeholder="Add any notes..."
//                   value={newTask.note}
//                   onChange={(e) => setNewTask({...newTask, note: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   rows={2}
//                 />
//               </div>
              
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setTaskCreationFlow('withGoal')
//                     if (taskCreationContext) {
//                       setNewTask({
//                         ...newTask,
//                         day: taskCreationContext.day,
//                         startTime: taskCreationContext.time,
//                         duration: timeSettings.interval
//                       })
//                     }
//                   }}
//                   className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                 >
//                   <Target className="w-4 h-4 mr-2" />
//                   Link to Goal
//                 </Button>
//                 <Button
//                   onClick={() => handleAddTaskToCell('simple')}
//                   className="flex-1"
//                   disabled={!newTask.title.trim()}
//                 >
//                   Add Task
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4 py-4">
//               <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4">
//                 <p className="text-sm text-gray-700 dark:text-gray-300">
//                   <span className="font-medium">Time Slot:</span> {taskCreationContext?.day.charAt(0) + taskCreationContext?.day.slice(1).toLowerCase()} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
//                 </p>
//                 <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                   Link this task to a goal or milestone to track progress
//                 </p>
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Task Title *</label>
//                 <Input
//                   placeholder="e.g., Study React, Complete Assignment"
//                   value={newTask.title}
//                   onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Subject</label>
//                   <Input
//                     placeholder="e.g., DSA, Web Dev"
//                     value={newTask.subject}
//                     onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Duration</label>
//                   <Select
//                     value={newTask.duration.toString()}
//                     onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
//                   >
//                     <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                       <SelectValue placeholder="Select duration" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                       <SelectItem value={timeSettings.interval.toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval} minutes</SelectItem>
//                       <SelectItem value={(timeSettings.interval * 2).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 2} minutes</SelectItem>
//                       <SelectItem value={(timeSettings.interval * 3).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 3} minutes</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Priority</label>
//                 <Select
//                   value={newTask.priority}
//                   onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
//                 >
//                   <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                     <SelectValue placeholder="Select priority" />
//                   </SelectTrigger>
//                   <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                     <SelectItem value="LOW" className="dark:text-gray-300 dark:hover:bg-gray-700">Low</SelectItem>
//                     <SelectItem value="MEDIUM" className="dark:text-gray-300 dark:hover:bg-gray-700">Medium</SelectItem>
//                     <SelectItem value="HIGH" className="dark:text-gray-300 dark:hover:bg-gray-700">High</SelectItem>
//                     <SelectItem value="CRITICAL" className="dark:text-gray-300 dark:hover:bg-gray-700">Critical</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Link to Goal (Optional)</label>
//                 <Select
//                   value={newTask.goalId}
//                   onValueChange={(value) => {
//                     setNewTask({
//                       ...newTask,
//                       goalId: value,
//                       milestoneId: ''
//                     })
//                   }}
//                 >
//                   <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                     <SelectValue placeholder="Select a goal" />
//                   </SelectTrigger>
//                   <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                     <SelectItem value="no-goal" className="dark:text-gray-300 dark:hover:bg-gray-700">No Goal (Independent Task)</SelectItem>
//                     {goals.map(goal => (
//                       <SelectItem key={goal.id} value={goal.id} className="dark:text-gray-300 dark:hover:bg-gray-700">
//                         <div className="flex items-center gap-2">
//                           <div 
//                             className="w-2 h-2 rounded-full"
//                             style={{ backgroundColor: goal.color }}
//                           />
//                           {goal.title}
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {newTask.goalId && newTask.goalId !== 'no-goal' && (
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Link to Milestone (Optional)</label>
//                   <Select
//                     value={newTask.milestoneId}
//                     onValueChange={(value) => setNewTask({...newTask, milestoneId: value})}
//                   >
//                     <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                       <SelectValue placeholder="Select a milestone" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                       <SelectItem value="no-milestone" className="dark:text-gray-300 dark:hover:bg-gray-700">No Milestone (General Goal Task)</SelectItem>
//                       {goals
//                         .find(g => g.id === newTask.goalId)
//                         ?.milestones.map(milestone => (
//                           <SelectItem key={milestone.id} value={milestone.id} className="dark:text-gray-300 dark:hover:bg-gray-700">
//                             <div className="flex items-center gap-2">
//                               <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
//                               {milestone.title}
//                             </div>
//                           </SelectItem>
//                         ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}
              
//               <div>
//                 <label className="text-sm font-medium mb-2 block dark:text-gray-300">Notes (Optional)</label>
//                 <Textarea
//                   placeholder="Add any notes..."
//                   value={newTask.note}
//                   onChange={(e) => setNewTask({...newTask, note: e.target.value})}
//                   className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   rows={2}
//                 />
//               </div>
              
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => setTaskCreationFlow('simple')}
//                   className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                 >
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Simple Task
//                 </Button>
//                 <Button
//                   onClick={() => handleAddTaskToCell('withGoal')}
//                   className="flex-1"
//                   disabled={!newTask.title.trim()}
//                 >
//                   {newTask.goalId && newTask.goalId !== 'no-goal' ? 'Add Task with Goal' : 'Add Task'}
//                 </Button>
//               </div>
//             </div>
//           )}
          
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowTaskCreationDialog(false)
//                 setTaskCreationContext(null)
//                 resetTaskForm()
//                 setTaskCreationFlow('simple')
//               }}
//               className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//             >
//               Cancel
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Add Fixed Time Modal */}
//       <Dialog open={showAddFixedTimeModal} onOpenChange={setShowAddFixedTimeModal}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Add Fixed Commitment</DialogTitle>
//             <DialogDescription>
//               Add regular commitments like college, work, gym, etc.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
//             <Input
//               placeholder="Title (e.g., College Hours)"
//               value={newFixedTime.title}
//               onChange={(e) => setNewFixedTime({...newFixedTime, title: e.target.value})}
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label>Start Time</Label>
//                 <Input
//                   type="time"
//                   value={newFixedTime.startTime}
//                   onChange={(e) => setNewFixedTime({...newFixedTime, startTime: e.target.value})}
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label>End Time</Label>
//                 <Input
//                   type="time"
//                   value={newFixedTime.endTime}
//                   onChange={(e) => setNewFixedTime({...newFixedTime, endTime: e.target.value})}
//                   className="mt-1"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label>Type</Label>
//               <div className="grid grid-cols-3 gap-2 mt-2">
//                 {FIXED_TIME_TYPES.slice(0, 9).map((type) => {
//                   const Icon = type.icon
//                   return (
//                     <Button
//                       key={type.id}
//                       variant={newFixedTime.type === type.id ? 'default' : 'outline'}
//                       size="sm"
//                       className="flex-col h-auto py-2"
//                       onClick={() => setNewFixedTime({...newFixedTime, type: type.id as any, color: type.color})}
//                     >
//                       <Icon className="w-4 h-4 mb-1" />
//                       <span className="text-[10px]">{type.label}</span>
//                     </Button>
//                   )
//                 })}
//               </div>
//             </div>

//             <div>
//               <Label>Days</Label>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {days.map(day => (
//                   <Button
//                     key={day}
//                     variant={newFixedTime.days.includes(day) ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => {
//                       const newDays = newFixedTime.days.includes(day)
//                         ? newFixedTime.days.filter(d => d !== day)
//                         : [...newFixedTime.days, day]
//                       setNewFixedTime({...newFixedTime, days: newDays})
//                     }}
//                   >
//                     {day.slice(0, 3)}
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <Label>Description (Optional)</Label>
//               <Textarea
//                 placeholder="Brief description"
//                 value={newFixedTime.description}
//                 onChange={(e) => setNewFixedTime({...newFixedTime, description: e.target.value})}
//                 className="mt-1"
//                 rows={2}
//               />
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowAddFixedTimeModal(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleAddFixedTime} disabled={!newFixedTime.title || newFixedTime.days.length === 0}>
//               Add Commitment
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Sleep Schedule Modal */}
//       <Dialog open={showSleepScheduleModal} onOpenChange={setShowSleepScheduleModal}>
//         <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Sleep Schedule</DialogTitle>
//             <DialogDescription>
//               Manage your sleep schedule for each day
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             {days.map(day => {
//               const schedule = sleepSchedules.find(s => s.day === day) || {
//                 id: `temp-${day}`,
//                 day,
//                 bedtime: '23:00',
//                 wakeTime: '07:00',
//                 duration: 480,
//                 isActive: true,
//                 color: '#4B5563',
//                 type: 'REGULAR' as const
//               }
              
//               return (
//                 <Card key={day}>
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="font-medium">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
//                       <Switch
//                         checked={schedule.isActive}
//                         onCheckedChange={(checked) => {
//                           const updated = { ...schedule, isActive: checked }
//                           handleSaveSleepSchedule(updated)
//                         }}
//                       />
//                     </div>
                    
//                     {schedule.isActive && (
//                       <div className="space-y-3">
//                         <div className="grid grid-cols-2 gap-2">
//                           <div>
//                             <Label className="text-xs">Bedtime</Label>
//                             <Input
//                               type="time"
//                               value={schedule.bedtime}
//                               onChange={(e) => {
//                                 const bedtime = e.target.value
//                                 const wakeTime = schedule.wakeTime
//                                 const bedtimeMinutes = convertTimeToMinutes(bedtime)
//                                 const wakeTimeMinutes = convertTimeToMinutes(wakeTime)
//                                 const duration = wakeTimeMinutes > bedtimeMinutes 
//                                   ? wakeTimeMinutes - bedtimeMinutes
//                                   : (24*60 - bedtimeMinutes) + wakeTimeMinutes
//                                 const updated = { 
//                                   ...schedule, 
//                                   bedtime,
//                                   duration
//                                 }
//                                 handleSaveSleepSchedule(updated)
//                               }}
//                               className="mt-1"
//                             />
//                           </div>
//                           <div>
//                             <Label className="text-xs">Wake Time</Label>
//                             <Input
//                               type="time"
//                               value={schedule.wakeTime}
//                               onChange={(e) => {
//                                 const wakeTime = e.target.value
//                                 const bedtime = schedule.bedtime
//                                 const bedtimeMinutes = convertTimeToMinutes(bedtime)
//                                 const wakeTimeMinutes = convertTimeToMinutes(wakeTime)
//                                 const duration = wakeTimeMinutes > bedtimeMinutes 
//                                   ? wakeTimeMinutes - bedtimeMinutes
//                                   : (24*60 - bedtimeMinutes) + wakeTimeMinutes
//                                 const updated = { 
//                                   ...schedule, 
//                                   wakeTime,
//                                   duration
//                                 }
//                                 handleSaveSleepSchedule(updated)
//                               }}
//                               className="mt-1"
//                             />
//                           </div>
//                         </div>
                        
//                         <div>
//                           <Label className="text-xs">Type</Label>
//                           <Select
//                             value={schedule.type}
//                             onValueChange={(value: any) => {
//                               const updated = { ...schedule, type: value }
//                               handleSaveSleepSchedule(updated)
//                             }}
//                           >
//                             <SelectTrigger className="mt-1">
//                               <SelectValue />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {SLEEP_TYPES.map(type => (
//                                 <SelectItem key={type.id} value={type.id}>
//                                   {type.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </div>
                        
//                         <div>
//                           <Label className="text-xs">Notes (Optional)</Label>
//                           <Input
//                             value={schedule.notes || ''}
//                             onChange={(e) => {
//                               const updated = { ...schedule, notes: e.target.value }
//                               handleSaveSleepSchedule(updated)
//                             }}
//                             className="mt-1"
//                             placeholder="Add notes..."
//                           />
//                         </div>
                        
//                         <div className="text-xs text-gray-500">
//                           Duration: {Math.floor(schedule.duration / 60)}h {schedule.duration % 60}m
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>

//           <DialogFooter>
//             <Button onClick={() => setShowSleepScheduleModal(false)}>
//               Done
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Fixed Time Details Modal */}
//       <Dialog open={!!selectedFixedTime} onOpenChange={() => setSelectedFixedTime(null)}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Fixed Commitment Details</DialogTitle>
//           </DialogHeader>
          
//           {selectedFixedTime && (
//             <div className="space-y-4 py-4">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 rounded-lg" style={{ backgroundColor: `${selectedFixedTime.color}20` }}>
//                   {getIconByType(selectedFixedTime.type)}
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-lg">{selectedFixedTime.title}</h3>
//                   <p className="text-sm text-gray-500">
//                     {selectedFixedTime.days.map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(', ')} • {formatTimeDisplay(selectedFixedTime.startTime)} - {formatTimeDisplay(selectedFixedTime.endTime)}
//                   </p>
//                 </div>
//               </div>
              
//               {selectedFixedTime.description && (
//                 <p className="text-sm text-gray-600 dark:text-gray-400">{selectedFixedTime.description}</p>
//               )}
              
//               <div>
//                 <h4 className="font-medium mb-2">Free Periods</h4>
//                 {selectedFixedTime.freePeriods && selectedFixedTime.freePeriods.length > 0 ? (
//                   <div className="space-y-2 max-h-60 overflow-y-auto">
//                     {selectedFixedTime.freePeriods.map(fp => (
//                       <div key={fp.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <span className="font-medium text-sm">{fp.title}</span>
//                             <Badge variant="outline" className="ml-2 text-xs">
//                               {fp.day.charAt(0) + fp.day.slice(1).toLowerCase()}
//                             </Badge>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="h-6 w-6 p-0"
//                             onClick={() => handleDeleteFreePeriod(selectedFixedTime.id, fp.id)}
//                           >
//                             <Trash2 className="w-3 h-3 text-red-500" />
//                           </Button>
//                         </div>
//                         <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                           {formatTimeDisplay(fp.startTime)} - {formatTimeDisplay(fp.endTime)} ({fp.duration} min)
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           Tasks can be scheduled here
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">No free periods added yet</p>
//                 )}
//               </div>
              
//               <div className="flex gap-2 pt-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex-1"
//                   onClick={() => {
//                     setSelectedFixedTimeForFreePeriod(selectedFixedTime)
//                     setSelectedFixedTime(null)
//                     setShowAddFreePeriodModal(true)
//                   }}
//                 >
//                   <Coffee className="w-4 h-4 mr-2" />
//                   Add Free Period
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex-1"
//                   onClick={() => {
//                     handleEditFixedTime(selectedFixedTime)
//                     setSelectedFixedTime(null)
//                   }}
//                 >
//                   <Edit2 className="w-4 h-4 mr-2" />
//                   Edit
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   className="flex-1"
//                   onClick={() => {
//                     handleDeleteFixedTime(selectedFixedTime.id)
//                     setSelectedFixedTime(null)
//                   }}
//                 >
//                   <Trash2 className="w-4 h-4 mr-2" />
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Add Free Period Modal */}
//       <Dialog open={showAddFreePeriodModal} onOpenChange={setShowAddFreePeriodModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add Free Period</DialogTitle>
//             <DialogDescription>
//               {selectedFixedTimeForFreePeriod && `For "${selectedFixedTimeForFreePeriod.title}"`}
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             <Input
//               placeholder="Title (e.g., Lunch Break)"
//               value={newFreePeriod.title}
//               onChange={(e) => setNewFreePeriod({...newFreePeriod, title: e.target.value})}
//             />
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label>Start Time</Label>
//                 <Input
//                   type="time"
//                   value={newFreePeriod.startTime}
//                   onChange={(e) => setNewFreePeriod({...newFreePeriod, startTime: e.target.value})}
//                   className="mt-1"
//                 />
//               </div>
//               <div>
//                 <Label>End Time</Label>
//                 <Input
//                   type="time"
//                   value={newFreePeriod.endTime}
//                   onChange={(e) => setNewFreePeriod({...newFreePeriod, endTime: e.target.value})}
//                   className="mt-1"
//                 />
//               </div>
//             </div>
            
//             <div>
//               <Label>Day</Label>
//               <Select
//                 value={newFreePeriod.day}
//                 onValueChange={(value) => setNewFreePeriod({...newFreePeriod, day: value})}
//               >
//                 <SelectTrigger className="mt-1">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {selectedFixedTimeForFreePeriod?.days.map(day => (
//                     <SelectItem key={day} value={day}>
//                       {day.charAt(0) + day.slice(1).toLowerCase()}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => {
//               setShowAddFreePeriodModal(false)
//               setSelectedFixedTimeForFreePeriod(null)
//             }}>
//               Cancel
//             </Button>
//             <Button onClick={handleAddFreePeriod} disabled={!newFreePeriod.title}>
//               Add Free Period
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Goals Modal */}
//       <Dialog open={showGoalsModal} onOpenChange={setShowGoalsModal}>
//         <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Goals & Milestones</DialogTitle>
//             <DialogDescription>
//               View all goals and schedule tasks from milestones
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             {goals.map(goal => (
//               <Card key={goal.id}>
//                 <CardContent className="p-4">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="p-2 rounded-lg" style={{ backgroundColor: `${goal.color}20` }}>
//                       {GOAL_CATEGORIES.find(c => c.id === goal.category)?.icon && 
//                         React.createElement(GOAL_CATEGORIES.find(c => c.id === goal.category)!.icon, { className: "w-5 h-5", style: { color: goal.color } })
//                       }
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-bold">{goal.title}</h3>
//                       <p className="text-sm text-gray-500">{goal.description}</p>
//                     </div>
//                     <Badge className={cn(
//                       goal.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
//                       goal.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
//                       goal.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
//                       'bg-blue-100 text-blue-700'
//                     )}>
//                       {goal.priority}
//                     </Badge>
//                   </div>
                  
//                   <div className="mb-3">
//                     <div className="flex justify-between text-sm mb-1">
//                       <span>Progress</span>
//                       <span>{goal.progress}%</span>
//                     </div>
//                     <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                       <div 
//                         className="h-full rounded-full transition-all"
//                         style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
//                       />
//                     </div>
//                     <div className="flex justify-between mt-1 text-xs text-gray-500">
//                       <span>{goal.completedHours.toFixed(1)}/{goal.totalHours}h</span>
//                       <span>{goal.milestones.length} milestones</span>
//                     </div>
//                   </div>
                  
//                   <h4 className="font-medium mb-2">Milestones</h4>
//                   <div className="space-y-2">
//                     {goal.milestones.map(milestone => {
//                       const isScheduled = tasks.some(t => t.milestoneId === milestone.id)
//                       return (
//                         <div 
//                           key={milestone.id}
//                           className={cn(
//                             "p-3 rounded-lg border",
//                             isScheduled ? "border-green-300 bg-green-50 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-700"
//                           )}
//                         >
//                           <div className="flex items-start justify-between mb-2">
//                             <div>
//                               <h5 className="font-medium">{milestone.title}</h5>
//                               <p className="text-sm text-gray-500">{milestone.description}</p>
//                             </div>
//                             <Badge variant="outline">{milestone.progress}%</Badge>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <div className="text-sm text-gray-500">
//                               {milestone.completedHours.toFixed(1)}/{milestone.scheduledHours}h
//                             </div>
//                             {!milestone.completed && (
//                               <Button
//                                 size="sm"
//                                 variant={isScheduled ? "outline" : "default"}
//                                 onClick={() => {
//                                   setTaskCreationContext({ day: 'MONDAY', time: '10:00' })
//                                   setNewTask({
//                                     ...newTask,
//                                     title: milestone.title,
//                                     subject: goal.subject,
//                                     goalId: goal.id,
//                                     milestoneId: milestone.id
//                                   })
//                                   setShowGoalsModal(false)
//                                   setShowTaskCreationDialog(true)
//                                 }}
//                               >
//                                 {isScheduled ? (
//                                   <>
//                                     <CheckCircle className="w-3 h-3 mr-1" />
//                                     Reschedule
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Plus className="w-3 h-3 mr-1" />
//                                     Schedule
//                                   </>
//                                 )}
//                               </Button>
//                             )}
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Time Extension Modal */}
//       <Dialog open={showTimeExtensionModal} onOpenChange={setShowTimeExtensionModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Extend Time Slots</DialogTitle>
//             <DialogDescription>
//               Add additional time slots to your schedule
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             <div>
//               <h3 className="font-medium mb-2">Quick Extensions</h3>
//               <div className="grid grid-cols-2 gap-2">
//                 <Button
//                   variant={timeSettings.extendedHours.morning ? "default" : "outline"}
//                   onClick={() => handleExtendTime('morning')}
//                   className="flex-col h-auto py-3"
//                 >
//                   <Sunrise className="w-5 h-5 mb-1" />
//                   <span className="text-xs">Morning</span>
//                   <span className="text-[10px] opacity-75">5 AM - 8 AM</span>
//                 </Button>
                
//                 <Button
//                   variant={timeSettings.extendedHours.evening ? "default" : "outline"}
//                   onClick={() => handleExtendTime('evening')}
//                   className="flex-col h-auto py-3"
//                 >
//                   <Sunset className="w-5 h-5 mb-1" />
//                   <span className="text-xs">Evening</span>
//                   <span className="text-[10px] opacity-75">6 PM - 10 PM</span>
//                 </Button>
                
//                 <Button
//                   variant={timeSettings.extendedHours.night ? "default" : "outline"}
//                   onClick={() => handleExtendTime('night')}
//                   className="flex-col h-auto py-3 col-span-2"
//                 >
//                   <MoonStar className="w-5 h-5 mb-1" />
//                   <span className="text-xs">Night</span>
//                   <span className="text-[10px] opacity-75">10 PM - 12 AM</span>
//                 </Button>
//               </div>
//             </div>
            
//             <div>
//               <h3 className="font-medium mb-2">Custom Time Slot</h3>
//               <div className="flex gap-2">
//                 <Input
//                   type="time"
//                   placeholder="HH:MM"
//                   id="custom-time"
//                 />
//                 <Button 
//                   onClick={() => {
//                     const input = document.getElementById('custom-time') as HTMLInputElement
//                     if (input.value) {
//                       handleAddCustomTime(input.value)
//                       input.value = ''
//                     }
//                   }}
//                 >
//                   Add
//                 </Button>
//               </div>
              
//               {timeSettings.extendedHours.custom.length > 0 && (
//                 <div className="mt-3">
//                   <Label className="text-sm">Added Slots</Label>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {timeSettings.extendedHours.custom.map(time => (
//                       <Badge key={time} variant="secondary" className="px-2 py-1 gap-1">
//                         {formatTimeDisplay(time)}
//                         <button
//                           onClick={() => handleRemoveCustomTime(time)}
//                           className="ml-1 hover:text-red-500"
//                         >
//                           <X className="w-3 h-3" />
//                         </button>
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Time Settings Modal */}
//       <Dialog open={showTimeSettingsModal} onOpenChange={setShowTimeSettingsModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Display Settings</DialogTitle>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             <div>
//               <Label>Time Range</Label>
//               <div className="grid grid-cols-2 gap-2 mt-1">
//                 <Select
//                   value={timeSettings.startHour.toString()}
//                   onValueChange={(value) => setTimeSettings({...timeSettings, startHour: parseInt(value)})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {[5,6,7,8,9,10,11,12].map(h => (
//                       <SelectItem key={h} value={h.toString()}>{h}:00 {h < 12 ? 'AM' : 'PM'}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Select
//                   value={timeSettings.endHour.toString()}
//                   onValueChange={(value) => setTimeSettings({...timeSettings, endHour: parseInt(value)})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {[13,14,15,16,17,18,19,20,21,22,23].map(h => (
//                       <SelectItem key={h} value={h.toString()}>{h-12}:00 PM</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
            
//             <div>
//               <Label>Time Interval</Label>
//               <div className="grid grid-cols-3 gap-2 mt-1">
//                 {[30,60,120].map(interval => (
//                   <Button
//                     key={interval}
//                     variant={timeSettings.interval === interval ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => setTimeSettings({...timeSettings, interval})}
//                   >
//                     {interval} min
//                   </Button>
//                 ))}
//               </div>
//             </div>
            
//             <div>
//               <Label>Display Mode</Label>
//               <div className="grid grid-cols-2 gap-2 mt-1">
//                 <Button
//                   variant={timeSettings.displayMode === 'vertical' ? 'default' : 'outline'}
//                   size="sm"
//                   onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
//                 >
//                   <Columns className="w-4 h-4 mr-2" />
//                   Vertical
//                 </Button>
//                 <Button
//                   variant={timeSettings.displayMode === 'horizontal' ? 'default' : 'outline'}
//                   size="sm"
//                   onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
//                 >
//                   <Rows className="w-4 h-4 mr-2" />
//                   Horizontal
//                 </Button>
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label>Show Weekends</Label>
//                 <Switch
//                   checked={timeSettings.showWeekends}
//                   onCheckedChange={(checked) => setTimeSettings({...timeSettings, showWeekends: checked})}
//                 />
//               </div>
              
//               <div className="flex items-center justify-between">
//                 <Label>Show Sleep Blocks</Label>
//                 <Switch
//                   checked={timeSettings.showSleepBlocks}
//                   onCheckedChange={(checked) => setTimeSettings({...timeSettings, showSleepBlocks: checked})}
//                 />
//               </div>
              
//               <div className="flex items-center justify-between">
//                 <Label>Auto-lock Sleep</Label>
//                 <Switch
//                   checked={timeSettings.autoLockSleep}
//                   onCheckedChange={(checked) => setTimeSettings({...timeSettings, autoLockSleep: checked})}
//                 />
//               </div>
//             </div>
            
//             <div>
//               <Label>Cell Height</Label>
//               <Slider
//                 value={[timeSettings.cellHeight]}
//                 min={40}
//                 max={120}
//                 step={10}
//                 onValueChange={(value) => setTimeSettings({...timeSettings, cellHeight: value[0]})}
//                 className="mt-2"
//               />
//               <div className="text-xs text-gray-500 mt-1 text-center">
//                 {timeSettings.cellHeight}px
//               </div>
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowTimeSettingsModal(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSaveTimeSettings}>
//               Apply Settings
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Fixed Time Modal */}
//       <Dialog open={showEditFixedTimeModal} onOpenChange={setShowEditFixedTimeModal}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Edit Fixed Commitment</DialogTitle>
//           </DialogHeader>
          
//           {editingFixedTime && (
//             <div className="space-y-4 py-4">
//               <Input
//                 placeholder="Title"
//                 value={editingFixedTime.title}
//                 onChange={(e) => setEditingFixedTime({...editingFixedTime, title: e.target.value})}
//               />

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label>Start Time</Label>
//                   <Input
//                     type="time"
//                     value={editingFixedTime.startTime}
//                     onChange={(e) => setEditingFixedTime({...editingFixedTime, startTime: e.target.value})}
//                     className="mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label>End Time</Label>
//                   <Input
//                     type="time"
//                     value={editingFixedTime.endTime}
//                     onChange={(e) => setEditingFixedTime({...editingFixedTime, endTime: e.target.value})}
//                     className="mt-1"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label>Days</Label>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {days.map(day => (
//                     <Button
//                       key={day}
//                       variant={editingFixedTime.days.includes(day) ? 'default' : 'outline'}
//                       size="sm"
//                       onClick={() => {
//                         const newDays = editingFixedTime.days.includes(day)
//                           ? editingFixedTime.days.filter(d => d !== day)
//                           : [...editingFixedTime.days, day]
//                         setEditingFixedTime({...editingFixedTime, days: newDays})
//                       }}
//                     >
//                       {day.slice(0, 3)}
//                     </Button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <Label>Description</Label>
//                 <Textarea
//                   value={editingFixedTime.description || ''}
//                   onChange={(e) => setEditingFixedTime({...editingFixedTime, description: e.target.value})}
//                   className="mt-1"
//                   rows={2}
//                 />
//               </div>
//             </div>
//           )}
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowEditFixedTimeModal(false)}>
//               Cancel
//             </Button>
//             <Button onClick={() => editingFixedTime && handleSaveFixedTime(editingFixedTime)}>
//               Save Changes
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Add/Edit Task Modal */}
//       <Dialog open={showAddTaskModal} onOpenChange={(open) => {
//         setShowAddTaskModal(open)
//         if (!open) {
//           setEditingTask(null)
//           resetTaskForm()
//         }
//       }}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4 py-4">
//             <Input
//               placeholder="Task title"
//               value={newTask.title}
//               onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 placeholder="Subject"
//                 value={newTask.subject}
//                 onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
//               />
//               <Select
//                 value={newTask.duration.toString()}
//                 onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Duration" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="30">30 min</SelectItem>
//                   <SelectItem value="60">1 hour</SelectItem>
//                   <SelectItem value="90">1.5 hours</SelectItem>
//                   <SelectItem value="120">2 hours</SelectItem>
//                   <SelectItem value="180">3 hours</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <Select
//                 value={newTask.day}
//                 onValueChange={(value) => setNewTask({...newTask, day: value})}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Day" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {days.map(day => (
//                     <SelectItem key={day} value={day}>
//                       {day.charAt(0) + day.slice(1).toLowerCase()}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Input
//                 type="time"
//                 value={newTask.startTime}
//                 onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
//               />
//             </div>

//             <Select
//               value={newTask.priority}
//               onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Priority" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="LOW">Low</SelectItem>
//                 <SelectItem value="MEDIUM">Medium</SelectItem>
//                 <SelectItem value="HIGH">High</SelectItem>
//                 <SelectItem value="CRITICAL">Critical</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select
//               value={newTask.goalId}
//               onValueChange={(value) => {
//                 setNewTask({
//                   ...newTask,
//                   goalId: value,
//                   milestoneId: ''
//                 })
//               }}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Link to Goal (Optional)" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">No Goal</SelectItem>
//                 {goals.map(goal => (
//                   <SelectItem key={goal.id} value={goal.id}>
//                     {goal.title}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {newTask.goalId && (
//               <Select
//                 value={newTask.milestoneId}
//                 onValueChange={(value) => setNewTask({...newTask, milestoneId: value})}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Link to Milestone (Optional)" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="">No Milestone</SelectItem>
//                   {goals
//                     .find(g => g.id === newTask.goalId)
//                     ?.milestones.map(milestone => (
//                       <SelectItem key={milestone.id} value={milestone.id}>
//                         {milestone.title} ({milestone.progress}%)
//                       </SelectItem>
//                     ))}
//                 </SelectContent>
//               </Select>
//             )}

//             <Textarea
//               placeholder="Notes (optional)"
//               value={newTask.note}
//               onChange={(e) => setNewTask({...newTask, note: e.target.value})}
//               rows={2}
//             />
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => {
//               setShowAddTaskModal(false)
//               setEditingTask(null)
//               resetTaskForm()
//             }}>
//               Cancel
//             </Button>
//             <Button 
//               onClick={editingTask ? handleUpdateTask : () => {
//                 if (taskCreationContext) {
//                   handleAddTaskToCell('simple')
//                 } else {
//                   toast.error('No cell selected')
//                 }
//               }} 
//               disabled={!newTask.title}
//             >
//               {editingTask ? 'Update Task' : 'Add Task'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Lock Progress Dialog */}
//       <Dialog open={showLockProgress} onOpenChange={setShowLockProgress}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               {lockSuccess ? (
//                 <>
//                   <CheckCircle className="w-5 h-5 text-green-500" />
//                   Saved Successfully
//                 </>
//               ) : (
//                 'Saving Timetable'
//               )}
//             </DialogTitle>
//           </DialogHeader>
          
//           <div className="py-4">
//             {lockProgress.map((step, index) => (
//               <div key={index} className="flex items-center gap-2 mb-2">
//                 {step.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
//                 {step.status === 'in-progress' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
//                 {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
//                 {step.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
//                 <span className="text-sm">{step.step}</span>
//                 {step.message && <span className="text-xs text-gray-500 ml-auto">{step.message}</span>}
//               </div>
//             ))}
//           </div>
          
//           <DialogFooter>
//             {lockSuccess && (
//               <Button onClick={() => setShowLockProgress(false)}>
//                 Close
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Reset Confirmation */}
//       <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <AlertTriangle className="w-5 h-5 text-yellow-500" />
//               Reset Timetable
//             </DialogTitle>
//             <DialogDescription>
//               This will delete all your data. This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="py-4">
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               Are you sure you want to reset your timetable? All tasks, fixed commitments, free periods, sleep schedules, and goal progress will be permanently deleted.
//             </p>
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={confirmReset}>
//               Reset Everything
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }




























// src/app/dashboard/timetable/builder/page.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
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
  AlertTriangle,
  Menu,
  Filter,
  Search,
  CalendarDays,
  LayoutGrid,
  LayoutList,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  Info,
  HelpCircle,
  Check,
  AlertCircle as AlertCircleIcon
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
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
  type: 'task' | 'fixed' | 'break' | 'commute' | 'free' | 'class' | 'study' | 'health' | 'project' | 'meeting' | 'workout' | 'meal' | 'entertainment' | 'sleep'
  isFreePeriod?: boolean
  span?: number
  fixedCommitmentId?: string
  goalId?: string
  milestoneId?: string
  isSleepTime?: boolean
  sleepScheduleId?: string
  category?: string
  note?: string
  status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
  completedAt?: string
  fixedTimeId?: string | null
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
}

// Fixed Time Types with Icons
const FIXED_TIME_TYPES = [
  { id: 'COLLEGE', label: 'College', icon: GraduationCap, color: '#EF4444', bgColor: 'bg-red-50 dark:bg-red-900/20', borderColor: 'border-red-200 dark:border-red-800' },
  { id: 'OFFICE', label: 'Office', icon: Briefcase, color: '#3B82F6', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-800' },
  { id: 'SCHOOL', label: 'School', icon: Book, color: '#8B5CF6', bgColor: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-purple-200 dark:border-purple-800' },
  { id: 'COMMUTE', label: 'Commute', icon: Car, color: '#F59E0B', bgColor: 'bg-orange-50 dark:bg-orange-900/20', borderColor: 'border-orange-200 dark:border-orange-800' },
  { id: 'MEETING', label: 'Meeting', icon: Users, color: '#10B981', bgColor: 'bg-green-50 dark:bg-green-900/20', borderColor: 'border-green-200 dark:border-green-800' },
  { id: 'WORKOUT', label: 'Gym', icon: Dumbbell, color: '#EC4899', bgColor: 'bg-pink-50 dark:bg-pink-900/20', borderColor: 'border-pink-200 dark:border-pink-800' },
  { id: 'MEAL', label: 'Meal', icon: Utensils, color: '#F97316', bgColor: 'bg-orange-50 dark:bg-orange-900/20', borderColor: 'border-orange-200 dark:border-orange-800' },
  { id: 'ENTERTAINMENT', label: 'Fun', icon: Gamepad2, color: '#8B5CF6', bgColor: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-purple-200 dark:border-purple-800' },
  { id: 'FREE', label: 'Free', icon: Coffee, color: '#10B981', bgColor: 'bg-green-50 dark:bg-green-900/20', borderColor: 'border-green-200 dark:border-green-800' },
  { id: 'FAMILY', label: 'Family', icon: Home, color: '#F59E0B', bgColor: 'bg-orange-50 dark:bg-orange-900/20', borderColor: 'border-orange-200 dark:border-orange-800' },
  { id: 'HEALTH', label: 'Health', icon: Heart, color: '#EC4899', bgColor: 'bg-pink-50 dark:bg-pink-900/20', borderColor: 'border-pink-200 dark:border-pink-800' },
  { id: 'SLEEP', label: 'Sleep', icon: Moon, color: '#4B5563', bgColor: 'bg-gray-100 dark:bg-gray-800', borderColor: 'border-gray-300 dark:border-gray-700' },
  { id: 'OTHER', label: 'Other', icon: Clock, color: '#6B7280', bgColor: 'bg-gray-100 dark:bg-gray-800', borderColor: 'border-gray-300 dark:border-gray-700' }
]

// Sleep Types with Icons
const SLEEP_TYPES = [
  { id: 'REGULAR', label: 'Regular Sleep', icon: Moon, color: '#4B5563', bgColor: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'POWER_NAP', label: 'Power Nap', icon: AlarmClock, color: '#8B5CF6', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'RECOVERY', label: 'Recovery Sleep', icon: Heart, color: '#EC4899', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  { id: 'EARLY', label: 'Early Bird', icon: Sunrise, color: '#F59E0B', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  { id: 'LATE', label: 'Night Owl', icon: MoonStar, color: '#3B82F6', bgColor: 'bg-blue-100 dark:bg-blue-900/30' }
]

// Goal Categories with Icons
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

const API_BASE_URL = 'http://localhost:8181/v0/api'

export default function TimetableBuilderClient() {
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'pdf'>('grid')
  const [isLocked, setIsLocked] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [tasks, setTasks] = useState<TimeSlot[]>([])
  const [sleepSchedules, setSleepSchedules] = useState<SleepSchedule[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [fixedTimes, setFixedTimes] = useState<FixedTime[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userType, setUserType] = useState<'student' | 'professional' | 'jobseeker' | 'other'>('student')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true)
  const [expandedFixedCommitments, setExpandedFixedCommitments] = useState<string[]>([])
  
  // Sample data for testing
  useEffect(() => {
    // Add sample fixed commitments
    setFixedTimes([
      {
        id: 'fixed-1',
        title: 'College Hours',
        description: 'Regular college lectures and classes',
        days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        startTime: '08:00',
        endTime: '18:00',
        type: 'COLLEGE',
        color: '#EF4444',
        isEditable: true,
        freePeriods: [
          {
            id: 'free-1',
            title: 'Lunch Break',
            startTime: '12:00',
            endTime: '13:00',
            duration: 60,
            day: 'MONDAY'
          },
          {
            id: 'free-2',
            title: 'Study Time',
            startTime: '15:00',
            endTime: '16:00',
            duration: 60,
            day: 'WEDNESDAY'
          },
          {
            id: 'free-3',
            title: 'Coffee Break',
            startTime: '10:30',
            endTime: '11:00',
            duration: 30,
            day: 'THURSDAY'
          }
        ]
      },
      {
        id: 'fixed-2',
        title: 'Gym',
        description: 'Daily workout session',
        days: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
        startTime: '18:00',
        endTime: '19:00',
        type: 'WORKOUT',
        color: '#EC4899',
        isEditable: true,
        freePeriods: []
      },
      {
        id: 'fixed-3',
        title: 'Team Meeting',
        description: 'Weekly sync with team',
        days: ['TUESDAY', 'THURSDAY'],
        startTime: '10:00',
        endTime: '11:00',
        type: 'MEETING',
        color: '#10B981',
        isEditable: true,
        freePeriods: []
      }
    ])

    // Add sample sleep schedules
    setSleepSchedules([
      {
        id: 'sleep-1',
        day: 'MONDAY',
        bedtime: '23:00',
        wakeTime: '07:00',
        duration: 480,
        isActive: true,
        color: '#4B5563',
        type: 'REGULAR',
        notes: 'Regular sleep schedule'
      },
      {
        id: 'sleep-2',
        day: 'TUESDAY',
        bedtime: '23:30',
        wakeTime: '07:30',
        duration: 480,
        isActive: true,
        color: '#4B5563',
        type: 'REGULAR',
        notes: 'Slightly later'
      },
      {
        id: 'sleep-3',
        day: 'WEDNESDAY',
        bedtime: '23:00',
        wakeTime: '07:00',
        duration: 480,
        isActive: true,
        color: '#4B5563',
        type: 'REGULAR'
      },
      {
        id: 'sleep-4',
        day: 'THURSDAY',
        bedtime: '23:30',
        wakeTime: '07:30',
        duration: 480,
        isActive: true,
        color: '#4B5563',
        type: 'REGULAR'
      },
      {
        id: 'sleep-5',
        day: 'FRIDAY',
        bedtime: '00:00',
        wakeTime: '08:00',
        duration: 480,
        isActive: true,
        color: '#4B5563',
        type: 'LATE',
        notes: 'Weekend mode'
      }
    ])

    // Add sample goals
    setGoals([
      {
        id: 'goal-1',
        title: 'Master DSA',
        description: 'Complete all DSA topics for interviews',
        category: 'ACADEMIC',
        priority: 'CRITICAL',
        type: 'LONG_TERM',
        targetDate: new Date('2024-12-31'),
        createdAt: new Date(),
        status: 'IN_PROGRESS',
        progress: 45,
        totalHours: 100,
        completedHours: 45,
        milestones: [
          {
            id: 'milestone-1',
            title: 'Arrays & Strings',
            description: 'Complete all array and string problems',
            completed: false,
            targetDate: new Date('2024-06-30'),
            progress: 70,
            scheduledHours: 30,
            completedHours: 21
          },
          {
            id: 'milestone-2',
            title: 'Linked Lists',
            description: 'Master linked list operations',
            completed: false,
            targetDate: new Date('2024-07-31'),
            progress: 40,
            scheduledHours: 25,
            completedHours: 10
          },
          {
            id: 'milestone-3',
            title: 'Trees & Graphs',
            description: 'Tree and graph algorithms',
            completed: false,
            targetDate: new Date('2024-08-31'),
            progress: 30,
            scheduledHours: 35,
            completedHours: 10.5
          },
          {
            id: 'milestone-4',
            title: 'Dynamic Programming',
            description: 'DP patterns and problems',
            completed: false,
            targetDate: new Date('2024-09-30'),
            progress: 20,
            scheduledHours: 40,
            completedHours: 8
          }
        ],
        color: '#3B82F6',
        tags: ['coding', 'interview', 'algorithms'],
        isPublic: true,
        weeklyTarget: 10,
        streak: 5,
        lastUpdated: new Date(),
        subject: 'Computer Science',
        tasks: []
      },
      {
        id: 'goal-2',
        title: 'Learn Web Development',
        description: 'Become a full-stack developer',
        category: 'SKILL',
        priority: 'HIGH',
        type: 'LONG_TERM',
        targetDate: new Date('2024-10-31'),
        createdAt: new Date(),
        status: 'IN_PROGRESS',
        progress: 30,
        totalHours: 150,
        completedHours: 45,
        milestones: [
          {
            id: 'milestone-5',
            title: 'HTML/CSS Basics',
            description: 'Learn fundamentals of HTML and CSS',
            completed: true,
            targetDate: new Date('2024-03-31'),
            progress: 100,
            scheduledHours: 20,
            completedHours: 20
          },
          {
            id: 'milestone-6',
            title: 'JavaScript Fundamentals',
            description: 'Core JavaScript concepts',
            completed: false,
            targetDate: new Date('2024-05-31'),
            progress: 60,
            scheduledHours: 30,
            completedHours: 18
          },
          {
            id: 'milestone-7',
            title: 'React Framework',
            description: 'Build apps with React',
            completed: false,
            targetDate: new Date('2024-07-31'),
            progress: 20,
            scheduledHours: 40,
            completedHours: 8
          },
          {
            id: 'milestone-8',
            title: 'Node.js Backend',
            description: 'Server-side development',
            completed: false,
            targetDate: new Date('2024-09-30'),
            progress: 5,
            scheduledHours: 35,
            completedHours: 1.75
          }
        ],
        color: '#10B981',
        tags: ['web', 'frontend', 'backend'],
        isPublic: true,
        weeklyTarget: 8,
        streak: 3,
        lastUpdated: new Date(),
        subject: 'Web Development',
        tasks: []
      }
    ])

    // Add sample tasks (only in free periods)
    setTasks([
      {
        id: 'task-1',
        title: 'Complete Arrays Problem Set',
        subject: 'DSA',
        startTime: '12:00',
        endTime: '13:00',
        duration: 60,
        priority: 'HIGH',
        color: '#3B82F6',
        day: 'MONDAY',
        type: 'task',
        goalId: 'goal-1',
        milestoneId: 'milestone-1',
        status: 'PENDING',
        note: 'Focus on two-pointer techniques',
        fixedCommitmentId: 'fixed-1'
      },
      {
        id: 'task-2',
        title: 'Practice Linked List Operations',
        subject: 'DSA',
        startTime: '15:00',
        endTime: '16:00',
        duration: 60,
        priority: 'MEDIUM',
        color: '#3B82F6',
        day: 'WEDNESDAY',
        type: 'task',
        goalId: 'goal-1',
        milestoneId: 'milestone-2',
        status: 'PENDING',
        fixedCommitmentId: 'fixed-1'
      },
      {
        id: 'task-3',
        title: 'JavaScript Closures & Scope',
        subject: 'Web Dev',
        startTime: '10:30',
        endTime: '11:00',
        duration: 30,
        priority: 'MEDIUM',
        color: '#10B981',
        day: 'THURSDAY',
        type: 'task',
        goalId: 'goal-2',
        milestoneId: 'milestone-6',
        status: 'PENDING',
        fixedCommitmentId: 'fixed-1'
      }
    ])
  }, [])

  // Lock progress states
  const [showLockProgress, setShowLockProgress] = useState(false)
  const [lockProgress, setLockProgress] = useState<{step: string, status: string, message?: string}[]>([
    { step: 'Saving Timetable', status: 'pending' }
  ])
  const [isLocking, setIsLocking] = useState(false)
  const [lockSuccess, setLockSuccess] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

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
  const [expandedGoals, setExpandedGoals] = useState<string[]>([])

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
    type: 'COLLEGE' as FixedTime['type'],
    color: '#EF4444',
    isEditable: true,
    freePeriods: [] as {id: string, title: string, startTime: string, endTime: string, duration: number, day: string}[]
  })

  // Time settings state
  const [timeSettings, setTimeSettings] = useState<TimeSettings>({
    startHour: 8,
    endHour: 22,
    interval: 60,
    displayMode: 'horizontal',
    cellHeight: 80,
    showWeekends: true,
    compactMode: false,
    extendedHours: {
      morning: true,
      evening: true,
      night: false,
      custom: ['05:00', '06:00', '22:00', '23:00']
    },
    showSleepBlocks: true,
    autoLockSleep: true
  })

  // Get auth token
  const getAuthToken = (): string => {
    const token = localStorage.getItem('access_token')
    return token ? `Bearer ${token}` : ''
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Check for system dark mode
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Days of week
  const days = timeSettings.showWeekends 
    ? ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    : ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

  // Format time display
  const formatTimeDisplay = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  // Convert time to minutes
  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Generate time slots
  const generateTimeSlots = () => {
    const slots: string[] = []
    let actualStartHour = timeSettings.startHour
    let actualEndHour = timeSettings.endHour

    if (timeSettings.extendedHours.morning) {
      actualStartHour = Math.min(actualStartHour, 5)
    }
    if (timeSettings.extendedHours.evening) {
      actualEndHour = Math.max(actualEndHour, 22)
    }
    if (timeSettings.extendedHours.night) {
      actualEndHour = Math.max(actualEndHour, 23)
    }

    const totalMinutes = (actualEndHour - actualStartHour) * 60
    for (let i = 0; i <= totalMinutes; i += timeSettings.interval) {
      const hour = Math.floor(i / 60) + actualStartHour
      const minute = i % 60
      if (hour < 24) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
      }
    }

    // Add custom slots
    timeSettings.extendedHours.custom.forEach(time => {
      if (!slots.includes(time)) {
        slots.push(time)
      }
    })

    return slots.sort((a, b) => {
      const [aH, aM] = a.split(':').map(Number)
      const [bH, bM] = b.split(':').map(Number)
      return (aH * 60 + aM) - (bH * 60 + bM)
    })
  }

  const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots())

  useEffect(() => {
    setTimeSlots(generateTimeSlots())
  }, [timeSettings])

  // Calculate end time
  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60) % 24
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }

  // Get next time slot
  const getNextTimeSlot = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + timeSettings.interval
    const nextHours = Math.floor(totalMinutes / 60) % 24
    const nextMinutes = totalMinutes % 60
    return `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`
  }

  // Check if time is in fixed slot
  const isTimeInFixedSlot = (day: string, time: string): FixedTime | null => {
    const timeInMinutes = convertTimeToMinutes(time)
    for (const ft of fixedTimes) {
      if (!ft.days.includes(day)) continue
      const startMinutes = convertTimeToMinutes(ft.startTime)
      const endMinutes = convertTimeToMinutes(ft.endTime)
      
      // Handle overnight slots
      if (endMinutes < startMinutes) {
        if (timeInMinutes >= startMinutes || timeInMinutes < endMinutes) {
          return ft
        }
      } else {
        if (timeInMinutes >= startMinutes && timeInMinutes < endMinutes) {
          return ft
        }
      }
    }
    return null
  }

  // Check if time is in free period
  const isTimeInFreePeriod = (day: string, time: string): {fixedTime: FixedTime, freePeriod: any} | null => {
    const fixedTime = isTimeInFixedSlot(day, time)
    if (!fixedTime) return null
    if (!fixedTime.freePeriods) return null
    
    const timeInMinutes = convertTimeToMinutes(time)
    for (const fp of fixedTime.freePeriods) {
      if (fp.day !== day) continue
      
      const startMinutes = convertTimeToMinutes(fp.startTime)
      const endMinutes = convertTimeToMinutes(fp.endTime)
      
      if (timeInMinutes >= startMinutes && timeInMinutes < endMinutes) {
        return { fixedTime, freePeriod: fp }
      }
    }
    return null
  }

  // Get tasks for cell
  const getTasksForCell = (day: string, time: string) => {
    return tasks.filter(task => {
      if (task.day !== day) return false
      if (task.isSleepTime) return false
      
      const taskStartMinutes = convertTimeToMinutes(task.startTime)
      const taskEndMinutes = convertTimeToMinutes(task.endTime)
      const cellMinutes = convertTimeToMinutes(time)
      
      if (taskEndMinutes < taskStartMinutes) {
        return cellMinutes >= taskStartMinutes || cellMinutes < taskEndMinutes
      } else {
        return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
      }
    })
  }

  // Get sleep tasks for cell
  const getSleepTasksForCell = (day: string, time: string) => {
    return tasks.filter(task => {
      if (task.day !== day) return false
      if (!task.isSleepTime) return false
      
      const taskStartMinutes = convertTimeToMinutes(task.startTime)
      const taskEndMinutes = convertTimeToMinutes(task.endTime)
      const cellMinutes = convertTimeToMinutes(time)
      
      if (taskEndMinutes < taskStartMinutes) {
        return cellMinutes >= taskStartMinutes || cellMinutes < taskEndMinutes
      } else {
        return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
      }
    })
  }

  // Check if task should show in cell
  const shouldShowTaskInCell = (task: TimeSlot, day: string, time: string) => {
    if (task.day !== day) return false
    const taskStartMinutes = convertTimeToMinutes(task.startTime)
    const cellMinutes = convertTimeToMinutes(time)
    return taskStartMinutes === cellMinutes
  }

  // Get task span
  const getTaskSpan = (task: TimeSlot) => {
    const startMinutes = convertTimeToMinutes(task.startTime)
    const endMinutes = convertTimeToMinutes(task.endTime)
    let duration = endMinutes - startMinutes
    if (duration < 0) duration += 24 * 60
    return Math.ceil(duration / timeSettings.interval)
  }

  // Check if extended time
  const isExtendedTime = (time: string) => {
    const [hours] = time.split(':').map(Number)
    if (timeSettings.extendedHours.morning && hours < 8) return true
    if (timeSettings.extendedHours.evening && hours >= 18 && hours < 22) return true
    if (timeSettings.extendedHours.night && hours >= 22) return true
    if (timeSettings.extendedHours.custom.includes(time)) return true
    return false
  }

  // Get icon by type
  const getIconByType = (type: string) => {
    const fixedTimeType = FIXED_TIME_TYPES.find(t => t.id === type)
    if (fixedTimeType) {
      const Icon = fixedTimeType.icon
      return <Icon className="w-4 h-4" />
    }
    return <Clock className="w-4 h-4" />
  }

  // Get time slot color
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

  // Generate sleep tasks
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

  // Update sleep tasks when schedules change
  useEffect(() => {
    if (timeSettings.showSleepBlocks) {
      generateSleepTasks()
    } else {
      setTasks(tasks.filter(task => !task.isSleepTime))
    }
  }, [sleepSchedules, timeSettings.showSleepBlocks])

  // Handle cell click
  const handleCellClick = (day: string, time: string) => {
    if (isLocked) return
    
    const sleepTasks = getSleepTasksForCell(day, time)
    if (sleepTasks.length > 0 && timeSettings.autoLockSleep) {
      toast.warning('This is your scheduled sleep time. Adjust sleep schedule to make changes.')
      return
    }
    
    const fixedTime = isTimeInFixedSlot(day, time)
    const freePeriod = isTimeInFreePeriod(day, time)
    
    if (fixedTime && !freePeriod) {
      setSelectedFixedTime(fixedTime)
      toast.info('This is a fixed commitment. Add a free period first to schedule tasks here.')
      return
    }

    setTaskCreationContext({ day, time })
    setShowTaskCreationDialog(true)
  }

  // Handle add task
  const handleAddTaskToCell = (flow: 'simple' | 'withGoal' = 'simple') => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }
    
    if (!taskCreationContext) {
      toast.error('No cell selected')
      return
    }

    const freePeriod = isTimeInFreePeriod(taskCreationContext.day, taskCreationContext.time)
    const fixedCommitmentId = freePeriod ? freePeriod.fixedTime.id : undefined

    const existingTasks = getTasksForCell(taskCreationContext.day, taskCreationContext.time)
    if (existingTasks.length > 0) {
      toast.warning('This time slot already has tasks')
      return
    }

    const goalId = newTask.goalId === 'no-goal' ? undefined : newTask.goalId || undefined
    const milestoneId = newTask.milestoneId === 'no-milestone' ? undefined : newTask.milestoneId || undefined

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
      goalId,
      milestoneId,
      note: newTask.note,
      status: 'PENDING'
    }

    setTasks([...tasks, task])
    resetTaskForm()
    setShowTaskCreationDialog(false)
    setTaskCreationContext(null)
    setTaskCreationFlow('simple')
    
    if (freePeriod) {
      toast.success(`Task added to free period in ${freePeriod.fixedTime.title}`)
    } else {
      toast.success('Task added to timetable')
    }
  }

  // Reset task form
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
  }

  // Handle delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success('Task deleted')
  }

  // Handle edit task
  const handleEditTask = (task: TimeSlot) => {
    if (task.isSleepTime) {
      const schedule = sleepSchedules.find(s => s.id === task.sleepScheduleId)
      if (schedule) {
        setEditingSleepSchedule(schedule)
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

  // Handle update task
  const handleUpdateTask = () => {
    if (!editingTask) return
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const goalId = newTask.goalId === 'no-goal' ? undefined : newTask.goalId || undefined
    const milestoneId = newTask.milestoneId === 'no-milestone' ? undefined : newTask.milestoneId || undefined

    const updatedTask = {
      ...editingTask,
      ...newTask,
      goalId,
      milestoneId,
      endTime: calculateEndTime(newTask.startTime, newTask.duration)
    }

    setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
    setEditingTask(null)
    setShowAddTaskModal(false)
    resetTaskForm()
    toast.success('Task updated')
  }

  // Handle duplicate task
  const handleDuplicateTask = (task: TimeSlot) => {
    const duplicatedTask = {
      ...task,
      id: `task-${Date.now()}`,
      title: `${task.title} (Copy)`
    }
    setTasks([...tasks, duplicatedTask])
    toast.success('Task duplicated')
  }

  // Handle add fixed time
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
      id: `fixed-${Date.now()}`,
      title: newFixedTime.title,
      description: newFixedTime.description,
      days: newFixedTime.days,
      startTime: newFixedTime.startTime,
      endTime: newFixedTime.endTime,
      type: newFixedTime.type,
      color: newFixedTime.color,
      isEditable: newFixedTime.isEditable,
      freePeriods: []
    }

    setFixedTimes([...fixedTimes, fixedTime])
    setNewFixedTime({
      title: '',
      description: '',
      days: [],
      startTime: '09:00',
      endTime: '17:00',
      type: 'COLLEGE',
      color: '#EF4444',
      isEditable: true,
      freePeriods: []
    })
    setShowAddFixedTimeModal(false)
    toast.success('Fixed commitment added')
  }

  // Handle delete fixed time
  const handleDeleteFixedTime = (id: string) => {
    setFixedTimes(fixedTimes.filter(ft => ft.id !== id))
    setSelectedFixedTime(null)
    toast.success('Fixed commitment deleted')
  }

  // Handle edit fixed time
  const handleEditFixedTime = (fixedTime: FixedTime) => {
    setEditingFixedTime(fixedTime)
    setShowEditFixedTimeModal(true)
  }

  // Handle save fixed time
  const handleSaveFixedTime = (updatedFixedTime: FixedTime) => {
    setFixedTimes(fixedTimes.map(ft => 
      ft.id === updatedFixedTime.id ? updatedFixedTime : ft
    ))
    setShowEditFixedTimeModal(false)
    setEditingFixedTime(null)
    toast.success('Fixed commitment updated')
  }

  // Handle add free period
  const handleAddFreePeriod = () => {
    if (!selectedFixedTimeForFreePeriod) {
      toast.error('Please select a fixed commitment')
      return
    }
    
    if (!newFreePeriod.title.trim()) {
      toast.error('Please enter a title')
      return
    }
    
    const startMinutes = convertTimeToMinutes(newFreePeriod.startTime)
    const endMinutes = convertTimeToMinutes(newFreePeriod.endTime)
    
    if (endMinutes <= startMinutes) {
      toast.error('End time must be after start time')
      return
    }
    
    const duration = endMinutes - startMinutes
    
    const freePeriod = {
      id: `free-${Date.now()}`,
      title: newFreePeriod.title,
      startTime: newFreePeriod.startTime,
      endTime: newFreePeriod.endTime,
      duration,
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

  // Handle delete free period
  const handleDeleteFreePeriod = (fixedTimeId: string, freePeriodId: string) => {
    const fixedTime = fixedTimes.find(ft => ft.id === fixedTimeId)
    if (!fixedTime) return
    
    const updatedFixedTime = {
      ...fixedTime,
      freePeriods: fixedTime.freePeriods?.filter(fp => fp.id !== freePeriodId) || []
    }
    
    setFixedTimes(fixedTimes.map(ft => 
      ft.id === fixedTimeId ? updatedFixedTime : ft
    ))
    toast.success('Free period deleted')
  }

  // Handle save sleep schedule
  const handleSaveSleepSchedule = (schedule: SleepSchedule) => {
    const existingIndex = sleepSchedules.findIndex(s => s.id === schedule.id)
    let updatedSchedules
    
    if (existingIndex >= 0) {
      updatedSchedules = [...sleepSchedules]
      updatedSchedules[existingIndex] = schedule
    } else {
      updatedSchedules = [...sleepSchedules, schedule]
    }
    
    setSleepSchedules(updatedSchedules)
    toast.success('Sleep schedule updated')
    setEditingSleepSchedule(null)
    setShowSleepScheduleModal(false)
  }

  // Handle delete sleep schedule
  const handleDeleteSleepSchedule = (id: string) => {
    setSleepSchedules(sleepSchedules.filter(s => s.id !== id))
    toast.success('Sleep schedule deleted')
  }

  // Handle save time settings
  const handleSaveTimeSettings = () => {
    setTimeSlots(generateTimeSlots())
    setShowTimeSettingsModal(false)
    toast.success('Display settings updated')
  }

  // Handle extend time
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
    setTimeSettings({ ...timeSettings, extendedHours: updatedExtendedHours })
    setTimeSlots(generateTimeSlots())
  }

  // Handle add custom time
  const handleAddCustomTime = (time: string) => {
    if (!time) return
    
    if (timeSettings.extendedHours.custom.includes(time)) {
      toast.warning('Time slot already added')
      return
    }
    
    const updatedCustom = [...timeSettings.extendedHours.custom, time].sort((a, b) => {
      const [aH, aM] = a.split(':').map(Number)
      const [bH, bM] = b.split(':').map(Number)
      return (aH * 60 + aM) - (bH * 60 + bM)
    })
    
    handleExtendTime('custom', updatedCustom)
    toast.success(`Added ${formatTimeDisplay(time)}`)
  }

  // Handle remove custom time
  const handleRemoveCustomTime = (time: string) => {
    const updatedCustom = timeSettings.extendedHours.custom.filter(t => t !== time)
    handleExtendTime('custom', updatedCustom)
    toast.success(`Removed ${formatTimeDisplay(time)}`)
  }

  // Handle lock timetable
  const handleLockTimetable = () => {
    setShowLockProgress(true)
    setIsLocking(true)
    setLockProgress([{ step: 'Saving Timetable', status: 'in-progress', message: 'Saving...' }])
    
    setTimeout(() => {
      setIsLocked(true)
      setLockSuccess(true)
      setIsLocking(false)
      setLockProgress([{ step: 'Saving Timetable', status: 'completed', message: 'Saved successfully' }])
      setHasUnsavedChanges(false)
      toast.success('Timetable locked and saved')
    }, 1500)
  }

  // Handle unlock timetable
  const handleUnlockTimetable = () => {
    setIsLocked(false)
    setLockSuccess(false)
    setHasUnsavedChanges(true)
    toast.success('Timetable unlocked')
  }

  // Handle reset timetable
  const handleResetTimetable = () => {
    setShowResetConfirm(true)
  }

  // Confirm reset
  const confirmReset = () => {
    setTasks([])
    setFixedTimes([])
    setSleepSchedules([])
    setHasUnsavedChanges(true)
    setShowResetConfirm(false)
    toast.success('Timetable reset')
  }

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Timetable',
        text: 'Check out my weekly schedule!',
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied!')
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  // Handle export PDF
  const handleExportPDF = () => {
    toast.info('PDF export coming soon')
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Toggle weekends
  const toggleWeekends = () => {
    setTimeSettings({ ...timeSettings, showWeekends: !timeSettings.showWeekends })
  }

  // Toggle fixed commitment expansion
  const toggleFixedCommitmentExpansion = (id: string) => {
    setExpandedFixedCommitments(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id)
        : [...prev, id]
    )
  }

  // Get sleep stats
  const getSleepStats = () => {
    const activeSchedules = sleepSchedules.filter(s => s.isActive)
    const totalSleepHours = activeSchedules.reduce((sum, s) => sum + (s.duration / 60), 0)
    const avgSleepHours = activeSchedules.length > 0 ? totalSleepHours / activeSchedules.length : 0
    return { totalSleepHours, avgSleepHours, daysWithSleep: activeSchedules.length }
  }

  // Get goal stats
  const getGoalStats = () => {
    const totalGoals = goals.length
    const goalsWithTasks = tasks.filter(t => t.goalId).length
    const totalMilestones = goals.reduce((sum, g) => sum + g.milestones.length, 0)
    const milestonesWithTasks = tasks.filter(t => t.milestoneId).length
    return { totalGoals, goalsWithTasks, totalMilestones, milestonesWithTasks }
  }

  // Toggle goal expansion
  const toggleGoalExpansion = (goalId: string) => {
    setExpandedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  // Task component
  const TaskComponent = ({ 
    task, 
    onEdit,
    onDelete,
    onDuplicate 
  }: { 
    task: TimeSlot
    onEdit: (task: TimeSlot) => void
    onDelete: (taskId: string) => void
    onDuplicate: (task: TimeSlot) => void
  }) => {
    const goal = goals.find(g => g.id === task.goalId)
    const milestone = goal?.milestones.find(m => m.id === task.milestoneId)
    
    return (
      <div className="relative group h-full">
        <div
          className={cn(
            "p-1.5 rounded border-2 shadow-sm cursor-pointer transition-all h-full",
            "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500",
            "bg-white dark:bg-gray-800",
            task.fixedCommitmentId ? "border-green-300 dark:border-green-700" : "border-gray-200 dark:border-gray-700",
            task.priority === 'CRITICAL' && "border-red-300 dark:border-red-700",
            task.priority === 'HIGH' && "border-orange-300 dark:border-orange-700",
            task.priority === 'MEDIUM' && "border-yellow-300 dark:border-yellow-700",
          )}
          style={{ borderLeftColor: task.color, borderLeftWidth: '4px' }}
          onClick={() => onEdit(task)}
        >
          <div className="flex items-start justify-between gap-1">
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold truncate dark:text-gray-200">{task.title}</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{task.subject}</p>
            </div>
            {!isLocked && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <MoreVertical className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit2 className="w-3 h-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(task)}>
                    <Copy className="w-3 h-3 mr-2" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="mt-1 flex items-center justify-between">
            <Badge variant="outline" className={cn(
              "text-[8px] px-1 py-0",
              task.priority === 'CRITICAL' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
              task.priority === 'HIGH' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
              task.priority === 'MEDIUM' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
              task.priority === 'LOW' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            )}>
              {task.priority}
            </Badge>
            {milestone && (
              <Badge variant="outline" className="text-[8px] px-1 py-0 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                {milestone.title.slice(0, 8)}...
              </Badge>
            )}
          </div>
          
          {getTaskSpan(task) > 1 && (
            <div className="absolute bottom-0.5 right-0.5 text-[8px] text-gray-400">
              {Math.round(task.duration / 60)}h
            </div>
          )}
        </div>
      </div>
    )
  }

  // Redesigned Fixed commitment card component - Compact and intuitive
  const FixedCommitmentCard = ({ fixedTime }: { fixedTime: FixedTime }) => {
    const typeInfo = FIXED_TIME_TYPES.find(t => t.id === fixedTime.type) || FIXED_TIME_TYPES[FIXED_TIME_TYPES.length - 1]
    const Icon = typeInfo.icon
    const isExpanded = expandedFixedCommitments.includes(fixedTime.id)
    const freePeriodsCount = fixedTime.freePeriods?.length || 0
    
    // Get unique days with free periods
    const daysWithFreePeriods = fixedTime.freePeriods 
      ? [...new Set(fixedTime.freePeriods.map(fp => fp.day))]
      : []
    
    // Format days display
    const formatDaysDisplay = (days: string[]) => {
      if (days.length === 7) return 'Every day'
      if (days.length === 5 && days.includes('MONDAY') && days.includes('FRIDAY')) return 'Weekdays'
      if (days.length === 2 && days.includes('SATURDAY') && days.includes('SUNDAY')) return 'Weekends'
      
      const dayMap: Record<string, string> = {
        'MONDAY': 'Mon', 'TUESDAY': 'Tue', 'WEDNESDAY': 'Wed',
        'THURSDAY': 'Thu', 'FRIDAY': 'Fri', 'SATURDAY': 'Sat', 'SUNDAY': 'Sun'
      }
      return days.map(d => dayMap[d] || d.slice(0, 3)).join(', ')
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-lg border-2 overflow-hidden transition-all",
          typeInfo.bgColor,
          typeInfo.borderColor,
          "hover:shadow-md cursor-pointer"
        )}
        onClick={() => toggleFixedCommitmentExpansion(fixedTime.id)}
      >
        {/* Header - Always visible */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <Icon className="w-4 h-4" style={{ color: fixedTime.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm truncate">{fixedTime.title}</h4>
                <Badge 
                  className="text-[10px] px-1 py-0"
                  style={{ backgroundColor: `${fixedTime.color}20`, color: fixedTime.color }}
                >
                  {typeInfo.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                <span className="truncate">{formatDaysDisplay(fixedTime.days)}</span>
                <span>•</span>
                <span>{formatTimeDisplay(fixedTime.startTime)} - {formatTimeDisplay(fixedTime.endTime)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {freePeriodsCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                      <Coffee className="w-3 h-3" />
                      {freePeriodsCount}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{freePeriodsCount} free period{freePeriodsCount > 1 ? 's' : ''}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedFixedTime(fixedTime)
              }}
            >
              <MoreVertical className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                toggleFixedCommitmentExpansion(fixedTime.id)
              }}
            >
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </div>
        </div>

        {/* Expanded content - Shows free periods and quick actions */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
            >
              <div className="p-3 space-y-3">
                {/* Description if exists */}
                {fixedTime.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                    "{fixedTime.description}"
                  </p>
                )}

                {/* Free periods section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-medium flex items-center gap-1">
                      <Coffee className="w-3 h-3" />
                      Free Periods
                    </h5>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFixedTimeForFreePeriod(fixedTime)
                        setShowAddFreePeriodModal(true)
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>

                  {fixedTime.freePeriods && fixedTime.freePeriods.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {fixedTime.freePeriods.map(fp => (
                        <div key={fp.id} className="flex items-center justify-between text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2">
                            <Coffee className="w-3 h-3 text-green-600" />
                            <div>
                              <span className="font-medium">{fp.title}</span>
                              <span className="text-gray-500 ml-2">
                                {fp.day.slice(0, 3)} • {formatTimeDisplay(fp.startTime)} - {formatTimeDisplay(fp.endTime)}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFreePeriod(fixedTime.id, fp.id)
                            }}
                          >
                            <X className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-2 bg-gray-50 dark:bg-gray-800 rounded">
                      No free periods yet. Click "Add" to create one.
                    </p>
                  )}
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFixedTimeForFreePeriod(fixedTime)
                      setShowAddFreePeriodModal(true)
                    }}
                  >
                    <Coffee className="w-3 h-3 mr-1" />
                    Add Free Period
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditFixedTime(fixedTime)
                    }}
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Compact Goal card component (for bottom section)
  const CompactGoalCard = ({ goal }: { goal: Goal }) => {
    const Icon = GOAL_CATEGORIES.find(c => c.id === goal.category)?.icon || Target
    const isExpanded = expandedGoals.includes(goal.id)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div 
          className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
          onClick={() => toggleGoalExpansion(goal.id)}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${goal.color}20` }}>
              <Icon className="w-4 h-4" style={{ color: goal.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm truncate">{goal.title}</h4>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{goal.progress}%</span>
                <span>•</span>
                <span>{goal.milestones.length} milestones</span>
              </div>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <div className="p-3 space-y-2">
                {goal.milestones.map(milestone => {
                  const isScheduled = tasks.some(t => t.milestoneId === milestone.id)
                  return (
                    <div 
                      key={milestone.id}
                      className="text-xs p-2 rounded border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{milestone.title}</span>
                        <Badge variant="outline" className="text-[10px] px-1">
                          {milestone.progress}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-500">{milestone.completedHours.toFixed(1)}/{milestone.scheduledHours}h</span>
                        {!milestone.completed && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 px-2 text-[10px]"
                            onClick={(e) => {
                              e.stopPropagation()
                              setTaskCreationContext({ day: 'MONDAY', time: '10:00' })
                              setNewTask({
                                ...newTask,
                                title: milestone.title,
                                subject: goal.subject,
                                goalId: goal.id,
                                milestoneId: milestone.id
                              })
                              setShowTaskCreationDialog(true)
                            }}
                          >
                            <Plus className="w-2 h-2 mr-1" />
                            Schedule
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Time cell component
  const TimeCell = ({ day, time }: { day: string; time: string }) => {
    const fixedTime = isTimeInFixedSlot(day, time)
    const freePeriodInfo = isTimeInFreePeriod(day, time)
    const tasksInCell = getTasksForCell(day, time)
    const sleepTasksInCell = getSleepTasksForCell(day, time)
    const primaryTask = tasksInCell.find(task => 
      convertTimeToMinutes(task.startTime) === convertTimeToMinutes(time)
    ) || tasksInCell[0]
    const sleepTask = sleepTasksInCell[0]
    
    const isFreePeriod = !!freePeriodInfo
    const hasSleep = sleepTasksInCell.length > 0
    const isFixedCommitment = !!fixedTime && !isFreePeriod
    
    return (
      <div
        className={cn(
          "relative border-r border-b border-gray-200 dark:border-gray-700 group",
          "transition-all duration-150",
          isFixedCommitment && getTimeSlotColor(fixedTime!.type),
          isFreePeriod && "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
          isExtendedTime(time) && !isFixedCommitment && !hasSleep && !isFreePeriod && "bg-yellow-50/30 dark:bg-yellow-900/10",
          hasSleep && "bg-gray-100/50 dark:bg-gray-800/50",
          "hover:bg-gray-50 dark:hover:bg-gray-800/50"
        )}
        style={{ height: `${timeSettings.cellHeight}px` }}
        onClick={() => handleCellClick(day, time)}
      >
        {/* Fixed commitment indicator */}
        {isFixedCommitment && !primaryTask && !hasSleep && (
          <div className="absolute inset-0 flex items-center justify-center p-1">
            <div className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-center gap-1">
                {getIconByType(fixedTime!.type)}
                <span className="truncate">{fixedTime!.title}</span>
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                Fixed - Add free period first
              </div>
            </div>
          </div>
        )}

        {/* Free period indicator */}
        {isFreePeriod && !primaryTask && !hasSleep && (
          <div className="absolute inset-0 flex items-center justify-center p-1">
            <div className="text-xs font-medium text-green-700 dark:text-green-400">
              <div className="flex items-center justify-center gap-1">
                <Coffee className="w-3 h-3" />
                <span>Free: {freePeriodInfo?.freePeriod.title}</span>
              </div>
              <div className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">
                Click to add task
              </div>
            </div>
          </div>
        )}

        {/* Sleep indicator */}
        {hasSleep && !primaryTask && (
          <div className="absolute inset-0 flex items-center justify-center p-1">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center justify-center gap-1">
                <Moon className="w-3 h-3" />
                <span>Sleep Time</span>
              </div>
            </div>
          </div>
        )}

        {/* Task */}
        {primaryTask && shouldShowTaskInCell(primaryTask, day, time) && (
          <div className="absolute inset-0 p-0.5">
            <TaskComponent 
              task={primaryTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onDuplicate={handleDuplicateTask}
            />
          </div>
        )}

        {/* Multiple tasks indicator */}
        {tasksInCell.length > 1 && !primaryTask && (
          <div className="absolute bottom-1 right-1">
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              +{tasksInCell.length}
            </Badge>
          </div>
        )}

        {/* Add button overlay - only for free periods or empty cells (not fixed commitments) */}
        {!isLocked && !hasSleep && !isFixedCommitment && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                setTaskCreationContext({ day, time })
                setShowTaskCreationDialog(true)
              }}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Render timetable grid
  const renderTimetableGrid = () => {
    const cellWidth = timeSettings.displayMode === 'vertical' ? 140 : 120
    
    if (timeSettings.displayMode === 'vertical') {
      return (
        <div className="overflow-x-auto pb-4">
          <div className="inline-block min-w-full">
            {/* Header row - Days */}
            <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
              <div className="w-24 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
                <span className="font-bold">Time</span>
              </div>
              {days.map((day) => (
                <div
                  key={day}
                  className="flex-1 min-w-[140px] p-3 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0"
                  style={{ minWidth: cellWidth }}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-sm">
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {['SATURDAY', 'SUNDAY'].includes(day) ? 'Weekend' : 'Weekday'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Time rows */}
            <div className="flex">
              {/* Time labels */}
              <div className="w-24 flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-r-2 border-gray-300 dark:border-gray-700">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className={cn(
                      "flex items-center justify-center border-b border-gray-200 dark:border-gray-700",
                      isExtendedTime(time) && "bg-yellow-50 dark:bg-yellow-900/20"
                    )}
                    style={{ height: `${timeSettings.cellHeight}px` }}
                  >
                    <span className="text-xs font-medium">
                      {formatTimeDisplay(time)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {days.map(day => (
                <div key={day} className="flex-1 min-w-[140px]" style={{ minWidth: cellWidth }}>
                  {timeSlots.map((time) => (
                    <TimeCell key={`${day}-${time}`} day={day} time={time} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="overflow-x-auto pb-4">
          <div className="inline-block min-w-full">
            {/* Header row - Time */}
            <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
              <div className="w-32 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
                <span className="font-bold">Day / Time</span>
              </div>
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className={cn(
                    "flex-1 p-3 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0",
                    isExtendedTime(time) && "bg-yellow-50 dark:bg-yellow-900/20"
                  )}
                  style={{ minWidth: 120 }}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-sm">{formatTimeDisplay(time)}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      to {formatTimeDisplay(getNextTimeSlot(time))}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Day rows */}
            {days.map((day) => (
              <div key={day} className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                {/* Day label */}
                <div 
                  className="w-32 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center p-3"
                  style={{ height: `${timeSettings.cellHeight}px` }}
                >
                  <div className="text-center">
                    <span className="font-bold text-sm block">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
                    <span className="text-xs text-gray-500">
                      {['SATURDAY', 'SUNDAY'].includes(day) ? 'Weekend' : 'Weekday'}
                    </span>
                  </div>
                </div>

                {/* Time cells */}
                {timeSlots.map((time) => (
                  <div key={`${day}-${time}`} className="flex-1" style={{ minWidth: 120 }}>
                    <TimeCell day={day} time={time} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  // Render compact view
  const renderCompactView = () => {
    return (
      <div className="space-y-4">
        {days.map(day => {
          const dayTasks = tasks
            .filter(t => t.day === day && !t.isSleepTime)
            .sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))
          const dayFixedTimes = fixedTimes.filter(ft => ft.days.includes(day))
          
          return (
            <Card key={day} className="overflow-hidden">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-3">{day.charAt(0) + day.slice(1).toLowerCase()}</h3>
                
                {/* Fixed commitments */}
                {dayFixedTimes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Fixed Commitments</h4>
                    {dayFixedTimes.map(ft => (
                      <div 
                        key={ft.id}
                        className="p-2 mb-2 rounded border-l-4 bg-gray-50 dark:bg-gray-800 cursor-pointer"
                        style={{ borderLeftColor: ft.color }}
                        onClick={() => setSelectedFixedTime(ft)}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{ft.title}</span>
                          <span className="text-sm text-gray-500">
                            {formatTimeDisplay(ft.startTime)} - {formatTimeDisplay(ft.endTime)}
                          </span>
                        </div>
                        {ft.freePeriods?.filter(fp => fp.day === day).map(fp => (
                          <div key={fp.id} className="mt-1 ml-2 text-sm text-green-600">
                            Free: {fp.title} ({formatTimeDisplay(fp.startTime)} - {formatTimeDisplay(fp.endTime)})
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Tasks */}
                {dayTasks.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Tasks</h4>
                    {dayTasks.map(task => {
                      const goal = goals.find(g => g.id === task.goalId)
                      return (
                        <div 
                          key={task.id}
                          className="p-3 rounded border-l-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer"
                          style={{ borderLeftColor: task.color }}
                          onClick={() => handleEditTask(task)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-gray-500">{task.subject}</p>
                              {goal && (
                                <p className="text-xs text-gray-400 mt-1">Goal: {goal.title}</p>
                              )}
                            </div>
                            <Badge className={cn(
                              task.priority === 'CRITICAL' && "bg-red-100 text-red-700",
                              task.priority === 'HIGH' && "bg-orange-100 text-orange-700",
                              task.priority === 'MEDIUM' && "bg-yellow-100 text-yellow-700",
                              task.priority === 'LOW' && "bg-blue-100 text-blue-700",
                            )}>
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)} ({task.duration} min)
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No tasks scheduled</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  const sleepStats = getSleepStats()
  const goalStats = getGoalStats()

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Chronify AI
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    Timetable Builder
                  </p>
                </div>

                {/* Tabs */}
                <div className="hidden lg:flex items-center gap-1">
                  {['Dashboard', 'Timetable', 'Goals', 'Builder', 'Insights', 'Progress'].map(tab => (
                    <Button
                      key={tab}
                      variant={tab === 'Builder' ? 'default' : 'ghost'}
                      size="sm"
                      className="text-sm"
                    >
                      {tab}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Center - User type and status */}
              <div className="hidden md:flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {userType}
                </Badge>
                {hasUnsavedChanges && (
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Unsaved Changes
                  </Badge>
                )}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="hidden sm:flex"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>

                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Sign In
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="w-4 h-4" />
                      <span className="hidden md:inline">Settings</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowTimeSettingsModal(true)}>
                      Display Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowTimeExtensionModal(true)}>
                      Extend Hours
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowSleepScheduleModal(true)}>
                      Sleep Schedule
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={toggleDarkMode}>
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Mobile status */}
            <div className="md:hidden flex items-center gap-2 mt-2">
              <Badge variant="outline" className="capitalize">
                {userType}
              </Badge>
              {hasUnsavedChanges && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
            </div>
          </div>
        </header>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {['Dashboard', 'Timetable', 'Goals', 'Builder', 'Insights', 'Progress'].map(tab => (
                  <Button
                    key={tab}
                    variant={tab === 'Builder' ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                  >
                    {tab}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="max-w-7xl mx-auto p-4 space-y-4">
          {/* Info bar */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-medium">Weekdays as {timeSettings.displayMode === 'vertical' ? 'columns' : 'rows'}, time as {timeSettings.displayMode === 'vertical' ? 'rows' : 'columns'}</span>
              {timeSettings.showSleepBlocks && (
                <>
                  <span>•</span>
                  <span>Sleep schedule active</span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setViewMode('pdf')}>
                  View as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  Download PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                  Print
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowGoalsModal(true)}
            >
              <Target className="w-4 h-4" />
              Schedule Goals
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowSleepScheduleModal(true)}
            >
              <Bed className="w-4 h-4" />
              Sleep Schedule
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowTimeSettingsModal(true)}
            >
              <Settings className="w-4 h-4" />
              Display Settings
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowTimeExtensionModal(true)}
            >
              <PlusCircle className="w-4 h-4" />
              Extend Time
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={toggleWeekends}
            >
              {timeSettings.showWeekends ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {timeSettings.showWeekends ? 'Hide' : 'Show'} Weekends
            </Button>

            <Button 
              variant={isLocked ? "outline" : "default"}
              size="sm" 
              className="gap-2"
              onClick={isLocked ? handleUnlockTimetable : handleLockTimetable}
              disabled={isLocking}
            >
              {isLocking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isLocked ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {isLocked ? 'Unlock' : 'Lock'} Timetable
            </Button>

            <Button 
              variant="destructive" 
              size="sm" 
              className="gap-2"
              onClick={handleResetTimetable}
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {/* View mode toggles */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="gap-2"
              >
                <Grid className="w-4 h-4" />
                Grid View
              </Button>
              <Button
                variant={viewMode === 'compact' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('compact')}
                className="gap-2"
              >
                <List className="w-4 h-4" />
                Compact View
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={timeSettings.displayMode === 'vertical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
                className="gap-2"
              >
                <Columns className="w-4 h-4" />
                Vertical
              </Button>
              <Button
                variant={timeSettings.displayMode === 'horizontal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
                className="gap-2"
              >
                <Rows className="w-4 h-4" />
                Horizontal
              </Button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {(tasks.reduce((sum, t) => sum + t.duration, 0) / 60).toFixed(1)}h
                    </div>
                    <div className="text-xs text-gray-500">Total Hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{tasks.length}</div>
                    <div className="text-xs text-gray-500">Tasks Planned</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{goalStats.goalsWithTasks}/{goalStats.totalGoals}</div>
                    <div className="text-xs text-gray-500">Goals Scheduled</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Award className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{goalStats.milestonesWithTasks}/{goalStats.totalMilestones}</div>
                    <div className="text-xs text-gray-500">Milestones</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{sleepStats.totalSleepHours.toFixed(1)}h</div>
                    <div className="text-xs text-gray-500">Sleep Hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/30">
                    <Bed className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{sleepStats.avgSleepHours.toFixed(1)}h</div>
                    <div className="text-xs text-gray-500">Avg Sleep</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{fixedTimes.length}</div>
                    <div className="text-xs text-gray-500">Fixed Commits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Redesigned Fixed commitments section - Compact and intuitive */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Fixed Commitments
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Add your regular commitments and create free periods within them to schedule tasks
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-2 py-1">
                    {fixedTimes.length} total
                  </Badge>
                  <Button 
                    size="sm"
                    onClick={() => setShowAddFixedTimeModal(true)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </Button>
                </div>
              </div>
              
              {fixedTimes.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {fixedTimes.map(ft => (
                    <FixedCommitmentCard key={ft.id} fixedTime={ft} />
                  ))}
                  
                  {/* Quick add card */}
                  <div 
                    className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 cursor-pointer flex items-center justify-center p-4 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    onClick={() => setShowAddFixedTimeModal(true)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-2">
                        <Plus className="w-5 h-5 text-gray-500" />
                      </div>
                      <p className="font-medium text-sm">Quick Add Commitment</p>
                      <p className="text-xs text-gray-500 mt-1">College, Gym, Meeting, etc.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="p-8 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 cursor-pointer text-center"
                  onClick={() => setShowAddFixedTimeModal(true)}
                >
                  <Plus className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium">Add Your First Fixed Commitment</p>
                  <p className="text-sm text-gray-500 mt-1">Click to add college hours, office time, gym sessions, etc.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main timetable */}
          <Card>
            <CardContent className="p-4">
              {viewMode === 'compact' ? renderCompactView() : renderTimetableGrid()}
            </CardContent>
          </Card>

          {/* Goals & Milestones section - moved to bottom with compact design */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Goals & Milestones
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Track your progress and schedule tasks from your goals
                  </p>
                </div>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => setShowGoalsModal(true)}
                  className="gap-2"
                >
                  <Target className="w-4 h-4" />
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {goals.map(goal => (
                  <CompactGoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-800 pt-6 mt-8">
            <p>
              Chronify AI Timetable Builder helps you create a personalized weekly schedule with fixed commitments, 
              free periods, tasks from goals, and sleep schedules.
            </p>
            <p className="mt-2">
              Create your perfect schedule today with Chronify AI - the smart way to organize your time and achieve your goals.
            </p>
          </div>
        </main>

        {/* Task Creation Dialog with Options */}
        <Dialog open={showTaskCreationDialog} onOpenChange={(open) => {
          setShowTaskCreationDialog(open)
          if (!open) {
            setTaskCreationContext(null)
            resetTaskForm()
            setTaskCreationFlow('simple')
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
                  setTaskCreationFlow('simple')
                }}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Fixed Time Modal */}
        <Dialog open={showAddFixedTimeModal} onOpenChange={setShowAddFixedTimeModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Fixed Commitment</DialogTitle>
              <DialogDescription>
                Add regular commitments like college, work, gym, etc.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <Input
                placeholder="Title (e.g., College Hours)"
                value={newFixedTime.title}
                onChange={(e) => setNewFixedTime({...newFixedTime, title: e.target.value})}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={newFixedTime.startTime}
                    onChange={(e) => setNewFixedTime({...newFixedTime, startTime: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={newFixedTime.endTime}
                    onChange={(e) => setNewFixedTime({...newFixedTime, endTime: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {FIXED_TIME_TYPES.slice(0, 9).map((type) => {
                    const Icon = type.icon
                    return (
                      <Button
                        key={type.id}
                        variant={newFixedTime.type === type.id ? 'default' : 'outline'}
                        size="sm"
                        className="flex-col h-auto py-2"
                        onClick={() => setNewFixedTime({...newFixedTime, type: type.id as any, color: type.color})}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="text-[10px]">{type.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label>Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {days.map(day => (
                    <Button
                      key={day}
                      variant={newFixedTime.days.includes(day) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const newDays = newFixedTime.days.includes(day)
                          ? newFixedTime.days.filter(d => d !== day)
                          : [...newFixedTime.days, day]
                        setNewFixedTime({...newFixedTime, days: newDays})
                      }}
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  placeholder="Brief description"
                  value={newFixedTime.description}
                  onChange={(e) => setNewFixedTime({...newFixedTime, description: e.target.value})}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddFixedTimeModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFixedTime} disabled={!newFixedTime.title || newFixedTime.days.length === 0}>
                Add Commitment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sleep Schedule Modal */}
        <Dialog open={showSleepScheduleModal} onOpenChange={setShowSleepScheduleModal}>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Sleep Schedule</DialogTitle>
              <DialogDescription>
                Manage your sleep schedule for each day
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
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
                  <Card key={day}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
                        <Switch
                          checked={schedule.isActive}
                          onCheckedChange={(checked) => {
                            const updated = { ...schedule, isActive: checked }
                            handleSaveSleepSchedule(updated)
                          }}
                        />
                      </div>
                      
                      {schedule.isActive && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Bedtime</Label>
                              <Input
                                type="time"
                                value={schedule.bedtime}
                                onChange={(e) => {
                                  const bedtime = e.target.value
                                  const wakeTime = schedule.wakeTime
                                  const bedtimeMinutes = convertTimeToMinutes(bedtime)
                                  const wakeTimeMinutes = convertTimeToMinutes(wakeTime)
                                  const duration = wakeTimeMinutes > bedtimeMinutes 
                                    ? wakeTimeMinutes - bedtimeMinutes
                                    : (24*60 - bedtimeMinutes) + wakeTimeMinutes
                                  const updated = { 
                                    ...schedule, 
                                    bedtime,
                                    duration
                                  }
                                  handleSaveSleepSchedule(updated)
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Wake Time</Label>
                              <Input
                                type="time"
                                value={schedule.wakeTime}
                                onChange={(e) => {
                                  const wakeTime = e.target.value
                                  const bedtime = schedule.bedtime
                                  const bedtimeMinutes = convertTimeToMinutes(bedtime)
                                  const wakeTimeMinutes = convertTimeToMinutes(wakeTime)
                                  const duration = wakeTimeMinutes > bedtimeMinutes 
                                    ? wakeTimeMinutes - bedtimeMinutes
                                    : (24*60 - bedtimeMinutes) + wakeTimeMinutes
                                  const updated = { 
                                    ...schedule, 
                                    wakeTime,
                                    duration
                                  }
                                  handleSaveSleepSchedule(updated)
                                }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Type</Label>
                            <Select
                              value={schedule.type}
                              onValueChange={(value: any) => {
                                const updated = { ...schedule, type: value }
                                handleSaveSleepSchedule(updated)
                              }}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {SLEEP_TYPES.map(type => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Notes (Optional)</Label>
                            <Input
                              value={schedule.notes || ''}
                              onChange={(e) => {
                                const updated = { ...schedule, notes: e.target.value }
                                handleSaveSleepSchedule(updated)
                              }}
                              className="mt-1"
                              placeholder="Add notes..."
                            />
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Duration: {Math.floor(schedule.duration / 60)}h {schedule.duration % 60}m
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <DialogFooter>
              <Button onClick={() => setShowSleepScheduleModal(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Fixed Time Details Modal */}
        <Dialog open={!!selectedFixedTime} onOpenChange={() => setSelectedFixedTime(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Fixed Commitment Details</DialogTitle>
            </DialogHeader>
            
            {selectedFixedTime && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${selectedFixedTime.color}20` }}>
                    {getIconByType(selectedFixedTime.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{selectedFixedTime.title}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedFixedTime.days.map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(', ')} • {formatTimeDisplay(selectedFixedTime.startTime)} - {formatTimeDisplay(selectedFixedTime.endTime)}
                    </p>
                  </div>
                </div>
                
                {selectedFixedTime.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedFixedTime.description}</p>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Free Periods</h4>
                  {selectedFixedTime.freePeriods && selectedFixedTime.freePeriods.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedFixedTime.freePeriods.map(fp => (
                        <div key={fp.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-sm">{fp.title}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {fp.day.charAt(0) + fp.day.slice(1).toLowerCase()}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleDeleteFreePeriod(selectedFixedTime.id, fp.id)}
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {formatTimeDisplay(fp.startTime)} - {formatTimeDisplay(fp.endTime)} ({fp.duration} min)
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No free periods added yet</p>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedFixedTimeForFreePeriod(selectedFixedTime)
                      setSelectedFixedTime(null)
                      setShowAddFreePeriodModal(true)
                    }}
                  >
                    <Coffee className="w-4 h-4 mr-2" />
                    Add Free Period
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      handleEditFixedTime(selectedFixedTime)
                      setSelectedFixedTime(null)
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      handleDeleteFixedTime(selectedFixedTime.id)
                      setSelectedFixedTime(null)
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Free Period Modal */}
        <Dialog open={showAddFreePeriodModal} onOpenChange={setShowAddFreePeriodModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Free Period</DialogTitle>
              <DialogDescription>
                {selectedFixedTimeForFreePeriod && `For "${selectedFixedTimeForFreePeriod.title}"`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <Input
                placeholder="Title (e.g., Lunch Break)"
                value={newFreePeriod.title}
                onChange={(e) => setNewFreePeriod({...newFreePeriod, title: e.target.value})}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={newFreePeriod.startTime}
                    onChange={(e) => setNewFreePeriod({...newFreePeriod, startTime: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={newFreePeriod.endTime}
                    onChange={(e) => setNewFreePeriod({...newFreePeriod, endTime: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Day</Label>
                <Select
                  value={newFreePeriod.day}
                  onValueChange={(value) => setNewFreePeriod({...newFreePeriod, day: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedFixedTimeForFreePeriod?.days.map(day => (
                      <SelectItem key={day} value={day}>
                        {day.charAt(0) + day.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddFreePeriodModal(false)
                setSelectedFixedTimeForFreePeriod(null)
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddFreePeriod} disabled={!newFreePeriod.title}>
                Add Free Period
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Goals Modal */}
        <Dialog open={showGoalsModal} onOpenChange={setShowGoalsModal}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Goals & Milestones</DialogTitle>
              <DialogDescription>
                View all goals and schedule tasks from milestones
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {goals.map(goal => (
                <Card key={goal.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${goal.color}20` }}>
                        {GOAL_CATEGORIES.find(c => c.id === goal.category)?.icon && 
                          React.createElement(GOAL_CATEGORIES.find(c => c.id === goal.category)!.icon, { className: "w-5 h-5", style: { color: goal.color } })
                        }
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{goal.title}</h3>
                        <p className="text-sm text-gray-500">{goal.description}</p>
                      </div>
                      <Badge className={cn(
                        goal.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        goal.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                        goal.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      )}>
                        {goal.priority}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>{goal.completedHours.toFixed(1)}/{goal.totalHours}h</span>
                        <span>{goal.milestones.length} milestones</span>
                      </div>
                    </div>
                    
                    <h4 className="font-medium mb-2">Milestones</h4>
                    <div className="space-y-2">
                      {goal.milestones.map(milestone => {
                        const isScheduled = tasks.some(t => t.milestoneId === milestone.id)
                        return (
                          <div 
                            key={milestone.id}
                            className={cn(
                              "p-3 rounded-lg border",
                              isScheduled ? "border-green-300 bg-green-50 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-700"
                            )}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h5 className="font-medium">{milestone.title}</h5>
                                <p className="text-sm text-gray-500">{milestone.description}</p>
                              </div>
                              <Badge variant="outline">{milestone.progress}%</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500">
                                {milestone.completedHours.toFixed(1)}/{milestone.scheduledHours}h
                              </div>
                              {!milestone.completed && (
                                <Button
                                  size="sm"
                                  variant={isScheduled ? "outline" : "default"}
                                  onClick={() => {
                                    setTaskCreationContext({ day: 'MONDAY', time: '10:00' })
                                    setNewTask({
                                      ...newTask,
                                      title: milestone.title,
                                      subject: goal.subject,
                                      goalId: goal.id,
                                      milestoneId: milestone.id
                                    })
                                    setShowGoalsModal(false)
                                    setShowTaskCreationDialog(true)
                                  }}
                                >
                                  {isScheduled ? (
                                    <>
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Reschedule
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3 h-3 mr-1" />
                                      Schedule
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Time Extension Modal */}
        <Dialog open={showTimeExtensionModal} onOpenChange={setShowTimeExtensionModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Extend Time Slots</DialogTitle>
              <DialogDescription>
                Add additional time slots to your schedule
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-medium mb-2">Quick Extensions</h3>
                <div className="grid grid-cols-2 gap-2">
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
              
              <div>
                <h3 className="font-medium mb-2">Custom Time Slot</h3>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    placeholder="HH:MM"
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
                  <div className="mt-3">
                    <Label className="text-sm">Added Slots</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
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
          </DialogContent>
        </Dialog>

        {/* Time Settings Modal */}
        <Dialog open={showTimeSettingsModal} onOpenChange={setShowTimeSettingsModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Display Settings</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label>Time Range</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Select
                    value={timeSettings.startHour.toString()}
                    onValueChange={(value) => setTimeSettings({...timeSettings, startHour: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5,6,7,8,9,10,11,12].map(h => (
                        <SelectItem key={h} value={h.toString()}>{h}:00 {h < 12 ? 'AM' : 'PM'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={timeSettings.endHour.toString()}
                    onValueChange={(value) => setTimeSettings({...timeSettings, endHour: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[13,14,15,16,17,18,19,20,21,22,23].map(h => (
                        <SelectItem key={h} value={h.toString()}>{h-12}:00 PM</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Time Interval</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[30,60,120].map(interval => (
                    <Button
                      key={interval}
                      variant={timeSettings.interval === interval ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeSettings({...timeSettings, interval})}
                    >
                      {interval} min
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Display Mode</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Button
                    variant={timeSettings.displayMode === 'vertical' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
                  >
                    <Columns className="w-4 h-4 mr-2" />
                    Vertical
                  </Button>
                  <Button
                    variant={timeSettings.displayMode === 'horizontal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
                  >
                    <Rows className="w-4 h-4 mr-2" />
                    Horizontal
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Show Weekends</Label>
                  <Switch
                    checked={timeSettings.showWeekends}
                    onCheckedChange={(checked) => setTimeSettings({...timeSettings, showWeekends: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Show Sleep Blocks</Label>
                  <Switch
                    checked={timeSettings.showSleepBlocks}
                    onCheckedChange={(checked) => setTimeSettings({...timeSettings, showSleepBlocks: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Auto-lock Sleep</Label>
                  <Switch
                    checked={timeSettings.autoLockSleep}
                    onCheckedChange={(checked) => setTimeSettings({...timeSettings, autoLockSleep: checked})}
                  />
                </div>
              </div>
              
              <div>
                <Label>Cell Height</Label>
                <Slider
                  value={[timeSettings.cellHeight]}
                  min={40}
                  max={120}
                  step={10}
                  onValueChange={(value) => setTimeSettings({...timeSettings, cellHeight: value[0]})}
                  className="mt-2"
                />
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {timeSettings.cellHeight}px
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTimeSettingsModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTimeSettings}>
                Apply Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Fixed Time Modal */}
        <Dialog open={showEditFixedTimeModal} onOpenChange={setShowEditFixedTimeModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Fixed Commitment</DialogTitle>
            </DialogHeader>
            
            {editingFixedTime && (
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Title"
                  value={editingFixedTime.title}
                  onChange={(e) => setEditingFixedTime({...editingFixedTime, title: e.target.value})}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={editingFixedTime.startTime}
                      onChange={(e) => setEditingFixedTime({...editingFixedTime, startTime: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={editingFixedTime.endTime}
                      onChange={(e) => setEditingFixedTime({...editingFixedTime, endTime: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Days</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {days.map(day => (
                      <Button
                        key={day}
                        variant={editingFixedTime.days.includes(day) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const newDays = editingFixedTime.days.includes(day)
                            ? editingFixedTime.days.filter(d => d !== day)
                            : [...editingFixedTime.days, day]
                          setEditingFixedTime({...editingFixedTime, days: newDays})
                        }}
                      >
                        {day.slice(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editingFixedTime.description || ''}
                    onChange={(e) => setEditingFixedTime({...editingFixedTime, description: e.target.value})}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditFixedTimeModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => editingFixedTime && handleSaveFixedTime(editingFixedTime)}>
                Save Changes
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Subject"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                />
                <Select
                  value={newTask.duration.toString()}
                  onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={newTask.day}
                  onValueChange={(value) => setNewTask({...newTask, day: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map(day => (
                      <SelectItem key={day} value={day}>
                        {day.charAt(0) + day.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="time"
                  value={newTask.startTime}
                  onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                />
              </div>

              <Select
                value={newTask.priority}
                onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>

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
                <SelectTrigger>
                  <SelectValue placeholder="Link to Goal (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Goal</SelectItem>
                  {goals.map(goal => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {newTask.goalId && (
                <Select
                  value={newTask.milestoneId}
                  onValueChange={(value) => setNewTask({...newTask, milestoneId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Link to Milestone (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Milestone</SelectItem>
                    {goals
                      .find(g => g.id === newTask.goalId)
                      ?.milestones.map(milestone => (
                        <SelectItem key={milestone.id} value={milestone.id}>
                          {milestone.title} ({milestone.progress}%)
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}

              <Textarea
                placeholder="Notes (optional)"
                value={newTask.note}
                onChange={(e) => setNewTask({...newTask, note: e.target.value})}
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddTaskModal(false)
                setEditingTask(null)
                resetTaskForm()
              }}>
                Cancel
              </Button>
              <Button 
                onClick={editingTask ? handleUpdateTask : () => {
                  if (taskCreationContext) {
                    handleAddTaskToCell('simple')
                  } else {
                    toast.error('No cell selected')
                  }
                }} 
                disabled={!newTask.title}
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lock Progress Dialog */}
        <Dialog open={showLockProgress} onOpenChange={setShowLockProgress}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {lockSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Saved Successfully
                  </>
                ) : (
                  'Saving Timetable'
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              {lockProgress.map((step, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  {step.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                  {step.status === 'in-progress' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                  {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {step.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                  <span className="text-sm">{step.step}</span>
                  {step.message && <span className="text-xs text-gray-500 ml-auto">{step.message}</span>}
                </div>
              ))}
            </div>
            
            <DialogFooter>
              {lockSuccess && (
                <Button onClick={() => setShowLockProgress(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Confirmation */}
        <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Reset Timetable
              </DialogTitle>
              <DialogDescription>
                This will delete all your data. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to reset your timetable? All tasks, fixed commitments, free periods, sleep schedules, and goal progress will be permanently deleted.
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmReset}>
                Reset Everything
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}























































// // src/app/dashboard/timetable/builder/page.tsx
// 'use client'

// import React, { useState, useRef, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { 
//   Calendar, 
//   Clock, 
//   Plus, 
//   Save, 
//   Lock, 
//   Unlock,
//   Grid,
//   List,
//   Zap,
//   Download,
//   Share2,
//   Target,
//   Book,
//   Briefcase,
//   GraduationCap,
//   Home,
//   AlertCircle,
//   X,
//   Settings,
//   Bell,
//   RefreshCw,
//   Columns,
//   Rows,
//   Coffee,
//   Wind,
//   Maximize2,
//   Eye,
//   EyeOff,
//   FileText,
//   Printer,
//   Image as ImageIcon,
//   ChevronLeft,
//   ChevronRight,
//   GripVertical,
//   MoreVertical,
//   Trash2,
//   Edit2,
//   Copy,
//   ChevronUp,
//   ChevronDown,
//   PlusCircle,
//   MinusCircle,
//   Users,
//   Building,
//   Car,
//   Dumbbell,
//   Utensils,
//   Heart,
//   Music,
//   Gamepad2,
//   Moon,
//   Sun,
//   CheckCircle2,
//   TrendingUp,
//   Award,
//   Trophy,
//   Flame,
//   Star,
//   School,
//   User,
//   ArrowRight,
//   ArrowLeft,
//   Bed,
//   AlarmClock,
//   MoonStar,
//   Sunrise,
//   Sunset,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Menu,
//   Filter,
//   Search,
//   CalendarDays,
//   LayoutGrid,
//   LayoutList,
//   Maximize,
//   Minimize,
//   ZoomIn,
//   ZoomOut,
//   ChevronDown as ChevronDownIcon,
//   ChevronRight as ChevronRightIcon,
//   Info,
//   HelpCircle,
//   Check,
//   AlertCircle as AlertCircleIcon
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Badge } from '@/components/ui/badge'
// import { Card, CardContent } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { 
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Switch } from '@/components/ui/switch'
// import { Label } from '@/components/ui/label'
// import { Slider } from '@/components/ui/slider'
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu'
// import { toast } from 'sonner'
// import { Progress } from '@/components/ui/progress'
// import { cn } from '@/lib/utils'
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from '@/components/ui/tooltip'

// // Types
// interface TimeSlot {
//   id: string
//   title: string
//   subject: string
//   startTime: string
//   endTime: string
//   duration: number
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   color: string
//   isCompleted?: boolean
//   day: string
//   type: 'task' | 'fixed' | 'break' | 'commute' | 'free' | 'class' | 'study' | 'health' | 'project' | 'meeting' | 'workout' | 'meal' | 'entertainment' | 'sleep'
//   isFreePeriod?: boolean
//   span?: number
//   fixedCommitmentId?: string
//   goalId?: string
//   milestoneId?: string
//   isSleepTime?: boolean
//   sleepScheduleId?: string
//   category?: string
//   note?: string
//   status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
//   completedAt?: string
//   fixedTimeId?: string | null
// }

// interface SleepSchedule {
//   id: string
//   day: string
//   bedtime: string
//   wakeTime: string
//   duration: number
//   isActive: boolean
//   color: string
//   type: 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE'
//   notes?: string
// }

// interface Milestone {
//   id: string
//   title: string
//   description: string
//   completed: boolean
//   targetDate: Date
//   progress: number
//   scheduledHours: number
//   completedHours: number
// }

// interface Goal {
//   id: string
//   title: string
//   description: string
//   category: 'ACADEMIC' | 'PROFESSIONAL' | 'HEALTH' | 'PERSONAL' | 'SKILL' | 'FINANCIAL' | 'SOCIAL' | 'CREATIVE'
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   type: 'SHORT_TERM' | 'LONG_TERM'
//   targetDate: Date
//   createdAt: Date
//   status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
//   progress: number
//   totalHours: number
//   completedHours: number
//   milestones: Milestone[]
//   color: string
//   tags: string[]
//   isPublic: boolean
//   weeklyTarget: number
//   streak: number
//   lastUpdated: Date
//   subject: string
//   tasks: string[]
// }

// interface FixedTime {
//   id: string
//   title: string
//   description?: string
//   days: string[]
//   startTime: string
//   endTime: string
//   type: 'COLLEGE' | 'OFFICE' | 'SCHOOL' | 'COMMUTE' | 'FREE' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'FAMILY' | 'OTHER' | 'SLEEP'
//   color?: string
//   isFreePeriod?: boolean
//   isEditable?: boolean
//   icon?: string
//   freePeriods?: {
//     id: string
//     title: string
//     startTime: string
//     endTime: string
//     duration: number
//     day: string
//   }[]
//   serverId?: string
// }

// interface TimeSettings {
//   startHour: number
//   endHour: number
//   interval: number
//   displayMode: 'vertical' | 'horizontal'
//   cellHeight: number
//   showWeekends: boolean
//   compactMode: boolean
//   extendedHours: {
//     morning: boolean
//     evening: boolean
//     night: boolean
//     custom: string[]
//   }
//   showSleepBlocks: boolean
//   autoLockSleep: boolean
// }

// interface ApiTask {
//   title: string
//   subject: string
//   note?: string
//   startTime: string
//   endTime: string
//   duration: number
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
//   color?: string
//   day: string
//   type: 'STUDY' | 'CLASS' | 'PROJECT' | 'HEALTH' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP' | 'OTHER'
//   category?: 'ACADEMIC' | 'PROFESSIONAL' | 'PERSONAL' | 'HEALTH' | 'OTHER'
//   goalId?: string | null
//   milestoneId?: string | null
//   fixedTimeId?: string | null
//   status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS'
//   completedAt?: string | null
// }

// interface ApiFixedTime {
//   title: string
//   description?: string
//   days: string[]
//   startTime: string
//   endTime: string
//   type: 'COLLEGE' | 'OFFICE' | 'SCHOOL' | 'COMMUTE' | 'FREE' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'FAMILY' | 'OTHER' | 'SLEEP'
//   color?: string
//   isEditable?: boolean
//   freePeriods?: {
//     title: string
//     startTime: string
//     endTime: string
//     day: string
//   }[]
// }

// interface ApiSleepSchedule {
//   day: string
//   bedtime: string
//   wakeTime: string
//   isActive: boolean
//   type: 'REGULAR' | 'POWER_NAP' | 'RECOVERY' | 'EARLY' | 'LATE'
//   notes?: string
//   color?: string
//   duration?: number
// }

// interface LockProgress {
//   step: string
//   status: 'pending' | 'in-progress' | 'completed' | 'failed'
//   message?: string
//   error?: string
// }

// interface FullTimeTableSlot {
//   startTime: string
//   endTime: string
//   type: 'FIXED' | 'SLEEP' | 'TASK' | 'OTHER'
//   title: string
//   description?: string | null
//   fixedTimeId?: string
//   sleepScheduleId?: string
//   taskId?: string
// }

// interface FullTimeTableResponse {
//   day: string
//   slots: FullTimeTableSlot[]
// }

// interface LockApiResponse {
//   success: boolean
//   message: string
//   data: {
//     fixedTimesCreated: number
//     sleepSchedulesCreated: number
//     tasksCreated: number
//     totalItems: number
//   }
// }

// // Fixed Time Types with Icons
// const FIXED_TIME_TYPES = [
//   { id: 'COLLEGE', label: 'College', icon: GraduationCap, color: '#EF4444', bgColor: 'bg-red-50 dark:bg-red-900/20', borderColor: 'border-red-200 dark:border-red-800' },
//   { id: 'OFFICE', label: 'Office', icon: Briefcase, color: '#3B82F6', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-800' },
//   { id: 'SCHOOL', label: 'School', icon: Book, color: '#8B5CF6', bgColor: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-purple-200 dark:border-purple-800' },
//   { id: 'COMMUTE', label: 'Commute', icon: Car, color: '#F59E0B', bgColor: 'bg-orange-50 dark:bg-orange-900/20', borderColor: 'border-orange-200 dark:border-orange-800' },
//   { id: 'MEETING', label: 'Meeting', icon: Users, color: '#10B981', bgColor: 'bg-green-50 dark:bg-green-900/20', borderColor: 'border-green-200 dark:border-green-800' },
//   { id: 'WORKOUT', label: 'Gym', icon: Dumbbell, color: '#EC4899', bgColor: 'bg-pink-50 dark:bg-pink-900/20', borderColor: 'border-pink-200 dark:border-pink-800' },
//   { id: 'MEAL', label: 'Meal', icon: Utensils, color: '#F97316', bgColor: 'bg-orange-50 dark:bg-orange-900/20', borderColor: 'border-orange-200 dark:border-orange-800' },
//   { id: 'ENTERTAINMENT', label: 'Fun', icon: Gamepad2, color: '#8B5CF6', bgColor: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-purple-200 dark:border-purple-800' },
//   { id: 'FREE', label: 'Free', icon: Coffee, color: '#10B981', bgColor: 'bg-green-50 dark:bg-green-900/20', borderColor: 'border-green-200 dark:border-green-800' },
//   { id: 'FAMILY', label: 'Family', icon: Home, color: '#F59E0B', bgColor: 'bg-orange-50 dark:bg-orange-900/20', borderColor: 'border-orange-200 dark:border-orange-800' },
//   { id: 'HEALTH', label: 'Health', icon: Heart, color: '#EC4899', bgColor: 'bg-pink-50 dark:bg-pink-900/20', borderColor: 'border-pink-200 dark:border-pink-800' },
//   { id: 'SLEEP', label: 'Sleep', icon: Moon, color: '#4B5563', bgColor: 'bg-gray-100 dark:bg-gray-800', borderColor: 'border-gray-300 dark:border-gray-700' },
//   { id: 'OTHER', label: 'Other', icon: Clock, color: '#6B7280', bgColor: 'bg-gray-100 dark:bg-gray-800', borderColor: 'border-gray-300 dark:border-gray-700' }
// ]

// // Sleep Types with Icons
// const SLEEP_TYPES = [
//   { id: 'REGULAR', label: 'Regular Sleep', icon: Moon, color: '#4B5563', bgColor: 'bg-gray-100 dark:bg-gray-800' },
//   { id: 'POWER_NAP', label: 'Power Nap', icon: AlarmClock, color: '#8B5CF6', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
//   { id: 'RECOVERY', label: 'Recovery Sleep', icon: Heart, color: '#EC4899', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
//   { id: 'EARLY', label: 'Early Bird', icon: Sunrise, color: '#F59E0B', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
//   { id: 'LATE', label: 'Night Owl', icon: MoonStar, color: '#3B82F6', bgColor: 'bg-blue-100 dark:bg-blue-900/30' }
// ]

// // Goal Categories with Icons
// const GOAL_CATEGORIES = [
//   { id: 'ACADEMIC', label: 'Academic', icon: School, color: '#3B82F6', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
//   { id: 'PROFESSIONAL', label: 'Professional', icon: Briefcase, color: '#10B981', bgColor: 'bg-green-50 dark:bg-green-900/20' },
//   { id: 'HEALTH', label: 'Health & Fitness', icon: Heart, color: '#EF4444', bgColor: 'bg-red-50 dark:bg-red-900/20' },
//   { id: 'PERSONAL', label: 'Personal', icon: User, color: '#8B5CF6', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
//   { id: 'SKILL', label: 'Skill Development', icon: Award, color: '#F59E0B', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
//   { id: 'FINANCIAL', label: 'Financial', icon: TrendingUp, color: '#6366F1', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
//   { id: 'SOCIAL', label: 'Social', icon: Users, color: '#EC4899', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
//   { id: 'CREATIVE', label: 'Creative', icon: Music, color: '#F97316', bgColor: 'bg-orange-50 dark:bg-orange-900/20' }
// ]

// // Task Types for API
// const TASK_TYPES = [
//   { id: 'STUDY', label: 'Study', icon: Book },
//   { id: 'CLASS', label: 'Class', icon: GraduationCap },
//   { id: 'PROJECT', label: 'Project', icon: Target },
//   { id: 'HEALTH', label: 'Health', icon: Heart },
//   { id: 'MEETING', label: 'Meeting', icon: Users },
//   { id: 'WORKOUT', label: 'Workout', icon: Dumbbell },
//   { id: 'MEAL', label: 'Meal', icon: Utensils },
//   { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Gamepad2 },
//   { id: 'SLEEP', label: 'Sleep', icon: Moon },
//   { id: 'OTHER', label: 'Other', icon: Clock }
// ]

// const API_BASE_URL = 'http://localhost:8181/v0/api'

// export default function TimetableBuilderClient() {
//   const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'pdf'>('grid')
//   const [isLocked, setIsLocked] = useState(false)
//   const [darkMode, setDarkMode] = useState(false)
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [tasks, setTasks] = useState<TimeSlot[]>([])
//   const [sleepSchedules, setSleepSchedules] = useState<SleepSchedule[]>([])
//   const [goals, setGoals] = useState<Goal[]>([])
//   const [fixedTimes, setFixedTimes] = useState<FixedTime[]>([])
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [userType, setUserType] = useState<'student' | 'professional' | 'jobseeker' | 'other'>('student')
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
//   const [expandedFixedCommitments, setExpandedFixedCommitments] = useState<string[]>([])
  
//   // Lock progress states
//   const [showLockProgress, setShowLockProgress] = useState(false)
//   const [lockProgress, setLockProgress] = useState<LockProgress[]>([
//     { step: 'Saving Timetable', status: 'pending' }
//   ])
//   const [isLocking, setIsLocking] = useState(false)
//   const [lockSuccess, setLockSuccess] = useState(false)
//   const [showResetConfirm, setShowResetConfirm] = useState(false)

//   const [showSetupModal, setShowSetupModal] = useState(false)
//   const [showEditFixedTimeModal, setShowEditFixedTimeModal] = useState(false)
//   const [showAddFixedTimeModal, setShowAddFixedTimeModal] = useState(false)
//   const [editingFixedTime, setEditingFixedTime] = useState<FixedTime | null>(null)
//   const [showAddTaskModal, setShowAddTaskModal] = useState(false)
//   const [showTimeSettingsModal, setShowTimeSettingsModal] = useState(false)
//   const [showCellTaskModal, setShowCellTaskModal] = useState(false)
//   const [showTimeExtensionModal, setShowTimeExtensionModal] = useState(false)
//   const [showAddFreePeriodModal, setShowAddFreePeriodModal] = useState(false)
//   const [showSleepScheduleModal, setShowSleepScheduleModal] = useState(false)
//   const [selectedFixedTimeForFreePeriod, setSelectedFixedTimeForFreePeriod] = useState<FixedTime | null>(null)
//   const [selectedCell, setSelectedCell] = useState<{day: string, time: string} | null>(null)
//   const [editingTask, setEditingTask] = useState<TimeSlot | null>(null)
//   const [selectedFixedTime, setSelectedFixedTime] = useState<FixedTime | null>(null)
//   const [showGoalsModal, setShowGoalsModal] = useState(false)
//   const [selectedGoalForMilestone, setSelectedGoalForMilestone] = useState<Goal | null>(null)
//   const [editingSleepSchedule, setEditingSleepSchedule] = useState<SleepSchedule | null>(null)
//   const [taskCreationFlow, setTaskCreationFlow] = useState<'simple' | 'withGoal'>('simple')
//   const [showTaskCreationDialog, setShowTaskCreationDialog] = useState(false)
//   const [taskCreationContext, setTaskCreationContext] = useState<{day: string, time: string} | null>(null)
//   const [expandedGoals, setExpandedGoals] = useState<string[]>([])

//   const [newFreePeriod, setNewFreePeriod] = useState({
//     title: 'Free Period',
//     startTime: '14:00',
//     endTime: '15:00',
//     duration: 60,
//     day: 'MONDAY'
//   })

//   const [newTask, setNewTask] = useState({
//     title: '',
//     subject: '',
//     note: '',
//     duration: 60,
//     priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
//     color: '#3B82F6',
//     day: 'MONDAY',
//     startTime: '09:00',
//     goalId: '',
//     milestoneId: '',
//     type: 'STUDY' as 'STUDY' | 'CLASS' | 'PROJECT' | 'HEALTH' | 'MEETING' | 'WORKOUT' | 'MEAL' | 'ENTERTAINMENT' | 'SLEEP' | 'OTHER',
//     category: 'ACADEMIC' as 'ACADEMIC' | 'PROFESSIONAL' | 'PERSONAL' | 'HEALTH' | 'OTHER'
//   })

//   const [newFixedTime, setNewFixedTime] = useState({
//     title: '',
//     description: '',
//     days: [] as string[],
//     startTime: '09:00',
//     endTime: '17:00',
//     type: 'COLLEGE' as FixedTime['type'],
//     color: '#EF4444',
//     isEditable: true,
//     freePeriods: [] as {id: string, title: string, startTime: string, endTime: string, duration: number, day: string}[]
//   })

//   // Time settings state
//   const [timeSettings, setTimeSettings] = useState<TimeSettings>({
//     startHour: 8,
//     endHour: 22,
//     interval: 60,
//     displayMode: 'horizontal',
//     cellHeight: 80,
//     showWeekends: true,
//     compactMode: false,
//     extendedHours: {
//       morning: true,
//       evening: true,
//       night: false,
//       custom: ['05:00', '06:00', '22:00', '23:00']
//     },
//     showSleepBlocks: true,
//     autoLockSleep: true
//   })

//   // Get auth token
//   const getAuthToken = (): string => {
//     const token = localStorage.getItem('access_token')
//     return token ? `Bearer ${token}` : ''
//   }

//   // Fetch full timetable
//   const fetchFullTimeTable = async () => {
//     try {
//       const token = getAuthToken()
//       if (!token) {
//         // Use sample data for demo
//         loadSampleData()
//         return
//       }

//       const response = await fetch(`${API_BASE_URL}/time-table/full`, {
//         headers: {
//           'Authorization': token
//         }
//       })
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch timetable')
//       }
      
//       const data = await response.json()
      
//       if (data.success && data.data) {
//         // Convert API response to local state
//         const apiData: FullTimeTableResponse[] = data.data
        
//         // Extract fixed times
//         const fixedTimesMap = new Map<string, FixedTime>()
//         const sleepSchedulesMap = new Map<string, SleepSchedule>()
//         const tasksList: TimeSlot[] = []
        
//         apiData.forEach(dayData => {
//           dayData.slots.forEach(slot => {
//             if (slot.type === 'FIXED' && slot.fixedTimeId && !fixedTimesMap.has(slot.fixedTimeId)) {
//               fixedTimesMap.set(slot.fixedTimeId, {
//                 id: `fixed-${Date.now()}-${Math.random()}`,
//                 serverId: slot.fixedTimeId,
//                 title: slot.title,
//                 description: slot.description || undefined,
//                 days: [dayData.day],
//                 startTime: slot.startTime,
//                 endTime: slot.endTime,
//                 type: slot.title.includes('College') ? 'COLLEGE' : 
//                       slot.title.includes('Gym') ? 'WORKOUT' : 'OTHER',
//                 color: slot.title.includes('College') ? '#3B82F6' : '#EF4444',
//                 isEditable: true,
//                 freePeriods: []
//               })
//             }
            
//             if (slot.type === 'SLEEP' && slot.sleepScheduleId && !sleepSchedulesMap.has(slot.sleepScheduleId)) {
//               const type = slot.title.includes('LATE') ? 'LATE' : 
//                           slot.title.includes('POWER') ? 'POWER_NAP' : 'REGULAR'
//               sleepSchedulesMap.set(slot.sleepScheduleId, {
//                 id: slot.sleepScheduleId,
//                 day: dayData.day,
//                 bedtime: slot.startTime,
//                 wakeTime: slot.endTime,
//                 duration: calculateDuration(slot.startTime, slot.endTime),
//                 isActive: true,
//                 color: '#4B5563',
//                 type: type as any,
//                 notes: slot.description || undefined
//               })
//             }
            
//             if (slot.type === 'TASK' && slot.taskId) {
//               tasksList.push({
//                 id: slot.taskId,
//                 title: slot.title,
//                 subject: 'General',
//                 startTime: slot.startTime,
//                 endTime: slot.endTime,
//                 duration: calculateDuration(slot.startTime, slot.endTime),
//                 priority: 'MEDIUM',
//                 color: '#3B82F6',
//                 day: dayData.day,
//                 type: 'task',
//                 status: 'PENDING'
//               })
//             }
//           })
//         })
        
//         setFixedTimes(Array.from(fixedTimesMap.values()))
//         setSleepSchedules(Array.from(sleepSchedulesMap.values()))
//         setTasks(tasksList)
//       } else {
//         loadSampleData()
//       }
//     } catch (error) {
//       console.error('Error fetching timetable:', error)
//       toast.error('Failed to load timetable data')
//       loadSampleData()
//     }
//   }

//   // Load sample data
//   const loadSampleData = () => {
//     // Add sample fixed commitments
//     setFixedTimes([
//       {
//         id: 'fixed-1',
//         title: 'College Hours',
//         description: 'Regular college lectures and classes',
//         days: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
//         startTime: '08:00',
//         endTime: '17:00',
//         type: 'COLLEGE',
//         color: '#EF4444',
//         isEditable: true,
//         freePeriods: [
//           {
//             id: 'free-1',
//             title: 'Lunch Break',
//             startTime: '12:00',
//             endTime: '13:00',
//             duration: 60,
//             day: 'MONDAY'
//           },
//           {
//             id: 'free-2',
//             title: 'Study Time',
//             startTime: '15:00',
//             endTime: '16:00',
//             duration: 60,
//             day: 'WEDNESDAY'
//           },
//           {
//             id: 'free-3',
//             title: 'Coffee Break',
//             startTime: '10:30',
//             endTime: '11:00',
//             duration: 30,
//             day: 'THURSDAY'
//           }
//         ]
//       },
//       {
//         id: 'fixed-2',
//         title: 'Gym',
//         description: 'Daily workout session',
//         days: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
//         startTime: '18:00',
//         endTime: '19:00',
//         type: 'WORKOUT',
//         color: '#EC4899',
//         isEditable: true,
//         freePeriods: []
//       },
//       {
//         id: 'fixed-3',
//         title: 'Team Meeting',
//         description: 'Weekly sync with team',
//         days: ['TUESDAY', 'THURSDAY'],
//         startTime: '10:00',
//         endTime: '11:00',
//         type: 'MEETING',
//         color: '#10B981',
//         isEditable: true,
//         freePeriods: []
//       }
//     ])

//     // Add sample sleep schedules
//     setSleepSchedules([
//       {
//         id: 'sleep-1',
//         day: 'MONDAY',
//         bedtime: '23:00',
//         wakeTime: '07:00',
//         duration: 480,
//         isActive: true,
//         color: '#4B5563',
//         type: 'REGULAR',
//         notes: 'Regular sleep schedule'
//       },
//       {
//         id: 'sleep-2',
//         day: 'TUESDAY',
//         bedtime: '23:30',
//         wakeTime: '07:30',
//         duration: 480,
//         isActive: true,
//         color: '#4B5563',
//         type: 'REGULAR',
//         notes: 'Slightly later'
//       },
//       {
//         id: 'sleep-3',
//         day: 'WEDNESDAY',
//         bedtime: '23:00',
//         wakeTime: '07:00',
//         duration: 480,
//         isActive: true,
//         color: '#4B5563',
//         type: 'REGULAR'
//       },
//       {
//         id: 'sleep-4',
//         day: 'THURSDAY',
//         bedtime: '23:30',
//         wakeTime: '07:30',
//         duration: 480,
//         isActive: true,
//         color: '#4B5563',
//         type: 'REGULAR'
//       },
//       {
//         id: 'sleep-5',
//         day: 'FRIDAY',
//         bedtime: '00:00',
//         wakeTime: '08:00',
//         duration: 480,
//         isActive: true,
//         color: '#4B5563',
//         type: 'LATE',
//         notes: 'Weekend mode'
//       }
//     ])

//     // Add sample goals
//     setGoals([
//       {
//         id: 'goal-1',
//         title: 'Master DSA',
//         description: 'Complete all DSA topics for interviews',
//         category: 'ACADEMIC',
//         priority: 'CRITICAL',
//         type: 'LONG_TERM',
//         targetDate: new Date('2024-12-31'),
//         createdAt: new Date(),
//         status: 'IN_PROGRESS',
//         progress: 45,
//         totalHours: 100,
//         completedHours: 45,
//         milestones: [
//           {
//             id: 'milestone-1',
//             title: 'Arrays & Strings',
//             description: 'Complete all array and string problems',
//             completed: false,
//             targetDate: new Date('2024-06-30'),
//             progress: 70,
//             scheduledHours: 30,
//             completedHours: 21
//           },
//           {
//             id: 'milestone-2',
//             title: 'Linked Lists',
//             description: 'Master linked list operations',
//             completed: false,
//             targetDate: new Date('2024-07-31'),
//             progress: 40,
//             scheduledHours: 25,
//             completedHours: 10
//           },
//           {
//             id: 'milestone-3',
//             title: 'Trees & Graphs',
//             description: 'Tree and graph algorithms',
//             completed: false,
//             targetDate: new Date('2024-08-31'),
//             progress: 30,
//             scheduledHours: 35,
//             completedHours: 10.5
//           },
//           {
//             id: 'milestone-4',
//             title: 'Dynamic Programming',
//             description: 'DP patterns and problems',
//             completed: false,
//             targetDate: new Date('2024-09-30'),
//             progress: 20,
//             scheduledHours: 40,
//             completedHours: 8
//           }
//         ],
//         color: '#3B82F6',
//         tags: ['coding', 'interview', 'algorithms'],
//         isPublic: true,
//         weeklyTarget: 10,
//         streak: 5,
//         lastUpdated: new Date(),
//         subject: 'Computer Science',
//         tasks: []
//       },
//       {
//         id: 'goal-2',
//         title: 'Learn Web Development',
//         description: 'Become a full-stack developer',
//         category: 'SKILL',
//         priority: 'HIGH',
//         type: 'LONG_TERM',
//         targetDate: new Date('2024-10-31'),
//         createdAt: new Date(),
//         status: 'IN_PROGRESS',
//         progress: 30,
//         totalHours: 150,
//         completedHours: 45,
//         milestones: [
//           {
//             id: 'milestone-5',
//             title: 'HTML/CSS Basics',
//             description: 'Learn fundamentals of HTML and CSS',
//             completed: true,
//             targetDate: new Date('2024-03-31'),
//             progress: 100,
//             scheduledHours: 20,
//             completedHours: 20
//           },
//           {
//             id: 'milestone-6',
//             title: 'JavaScript Fundamentals',
//             description: 'Core JavaScript concepts',
//             completed: false,
//             targetDate: new Date('2024-05-31'),
//             progress: 60,
//             scheduledHours: 30,
//             completedHours: 18
//           },
//           {
//             id: 'milestone-7',
//             title: 'React Framework',
//             description: 'Build apps with React',
//             completed: false,
//             targetDate: new Date('2024-07-31'),
//             progress: 20,
//             scheduledHours: 40,
//             completedHours: 8
//           },
//           {
//             id: 'milestone-8',
//             title: 'Node.js Backend',
//             description: 'Server-side development',
//             completed: false,
//             targetDate: new Date('2024-09-30'),
//             progress: 5,
//             scheduledHours: 35,
//             completedHours: 1.75
//           }
//         ],
//         color: '#10B981',
//         tags: ['web', 'frontend', 'backend'],
//         isPublic: true,
//         weeklyTarget: 8,
//         streak: 3,
//         lastUpdated: new Date(),
//         subject: 'Web Development',
//         tasks: []
//       }
//     ])

//     // Add sample tasks (only in free periods)
//     setTasks([
//       {
//         id: 'task-1',
//         title: 'Complete Arrays Problem Set',
//         subject: 'DSA',
//         startTime: '12:00',
//         endTime: '13:00',
//         duration: 60,
//         priority: 'HIGH',
//         color: '#3B82F6',
//         day: 'MONDAY',
//         type: 'task',
//         goalId: 'goal-1',
//         milestoneId: 'milestone-1',
//         status: 'PENDING',
//         note: 'Focus on two-pointer techniques',
//         fixedCommitmentId: 'fixed-1'
//       },
//       {
//         id: 'task-2',
//         title: 'Practice Linked List Operations',
//         subject: 'DSA',
//         startTime: '15:00',
//         endTime: '16:00',
//         duration: 60,
//         priority: 'MEDIUM',
//         color: '#3B82F6',
//         day: 'WEDNESDAY',
//         type: 'task',
//         goalId: 'goal-1',
//         milestoneId: 'milestone-2',
//         status: 'PENDING',
//         fixedCommitmentId: 'fixed-1'
//       },
//       {
//         id: 'task-3',
//         title: 'JavaScript Closures & Scope',
//         subject: 'Web Dev',
//         startTime: '10:30',
//         endTime: '11:00',
//         duration: 30,
//         priority: 'MEDIUM',
//         color: '#10B981',
//         day: 'THURSDAY',
//         type: 'task',
//         goalId: 'goal-2',
//         milestoneId: 'milestone-6',
//         status: 'PENDING',
//         fixedCommitmentId: 'fixed-1'
//       }
//     ])
//   }

//   // Fetch goals
//   const fetchGoals = async () => {
//     try {
//       const token = getAuthToken()
//       if (!token) return

//       const response = await fetch(`${API_BASE_URL}/goals`, {
//         headers: {
//           'Authorization': token
//         }
//       })
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch goals')
//       }
      
//       const data = await response.json()
      
//       if (data.success && data.data?.goals) {
//         setGoals(data.data.goals)
//       }
//     } catch (error) {
//       console.error('Error fetching goals:', error)
//       toast.error('Failed to load goals')
//     }
//   }

//   // Load initial data
//   useEffect(() => {
//     fetchFullTimeTable()
//     fetchGoals()
//   }, [])

//   // Track unsaved changes
//   useEffect(() => {
//     setHasUnsavedChanges(tasks.length > 0 || fixedTimes.length > 0 || sleepSchedules.length > 0)
//   }, [tasks, fixedTimes, sleepSchedules])

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode)
//     if (!darkMode) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }

//   // Check for system dark mode
//   useEffect(() => {
//     const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
//     setDarkMode(isDarkMode)
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark')
//     }
//   }, [])

//   // Days of week
//   const days = timeSettings.showWeekends 
//     ? ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
//     : ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

//   // Format time display
//   const formatTimeDisplay = (time: string): string => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const period = hours >= 12 ? 'PM' : 'AM'
//     const displayHours = hours % 12 || 12
//     return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
//   }

//   // Convert time to minutes
//   const convertTimeToMinutes = (time: string): number => {
//     const [hours, minutes] = time.split(':').map(Number)
//     return hours * 60 + minutes
//   }

//   // Calculate duration
//   const calculateDuration = (startTime: string, endTime: string): number => {
//     const start = convertTimeToMinutes(startTime)
//     const end = convertTimeToMinutes(endTime)
//     return end >= start ? end - start : (24 * 60 - start) + end
//   }

//   // Generate time slots
//   const generateTimeSlots = () => {
//     const slots: string[] = []
//     let actualStartHour = timeSettings.startHour
//     let actualEndHour = timeSettings.endHour

//     if (timeSettings.extendedHours.morning) {
//       actualStartHour = Math.min(actualStartHour, 5)
//     }
//     if (timeSettings.extendedHours.evening) {
//       actualEndHour = Math.max(actualEndHour, 22)
//     }
//     if (timeSettings.extendedHours.night) {
//       actualEndHour = Math.max(actualEndHour, 23)
//     }

//     const totalMinutes = (actualEndHour - actualStartHour) * 60
//     for (let i = 0; i <= totalMinutes; i += timeSettings.interval) {
//       const hour = Math.floor(i / 60) + actualStartHour
//       const minute = i % 60
//       if (hour < 24) {
//         slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
//       }
//     }

//     // Add custom slots
//     timeSettings.extendedHours.custom.forEach(time => {
//       if (!slots.includes(time)) {
//         slots.push(time)
//       }
//     })

//     return slots.sort((a, b) => {
//       const [aH, aM] = a.split(':').map(Number)
//       const [bH, bM] = b.split(':').map(Number)
//       return (aH * 60 + aM) - (bH * 60 + bM)
//     })
//   }

//   const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots())

//   useEffect(() => {
//     setTimeSlots(generateTimeSlots())
//   }, [timeSettings])

//   // Calculate end time
//   const calculateEndTime = (startTime: string, duration: number): string => {
//     const [hours, minutes] = startTime.split(':').map(Number)
//     const totalMinutes = hours * 60 + minutes + duration
//     const endHours = Math.floor(totalMinutes / 60) % 24
//     const endMinutes = totalMinutes % 60
//     return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
//   }

//   // Get next time slot
//   const getNextTimeSlot = (time: string): string => {
//     const [hours, minutes] = time.split(':').map(Number)
//     const totalMinutes = hours * 60 + minutes + timeSettings.interval
//     const nextHours = Math.floor(totalMinutes / 60) % 24
//     const nextMinutes = totalMinutes % 60
//     return `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`
//   }

//   // Check if time is in fixed slot
//   const isTimeInFixedSlot = (day: string, time: string): FixedTime | null => {
//     const timeInMinutes = convertTimeToMinutes(time)
//     for (const ft of fixedTimes) {
//       if (!ft.days.includes(day)) continue
//       const startMinutes = convertTimeToMinutes(ft.startTime)
//       const endMinutes = convertTimeToMinutes(ft.endTime)
      
//       // Handle overnight slots
//       if (endMinutes < startMinutes) {
//         if (timeInMinutes >= startMinutes || timeInMinutes < endMinutes) {
//           return ft
//         }
//       } else {
//         if (timeInMinutes >= startMinutes && timeInMinutes < endMinutes) {
//           return ft
//         }
//       }
//     }
//     return null
//   }

//   // Check if time is in free period
//   const isTimeInFreePeriod = (day: string, time: string): {fixedTime: FixedTime, freePeriod: any} | null => {
//     const fixedTime = isTimeInFixedSlot(day, time)
//     if (!fixedTime) return null
//     if (!fixedTime.freePeriods) return null
    
//     const timeInMinutes = convertTimeToMinutes(time)
//     for (const fp of fixedTime.freePeriods) {
//       if (fp.day !== day) continue
      
//       const startMinutes = convertTimeToMinutes(fp.startTime)
//       const endMinutes = convertTimeToMinutes(fp.endTime)
      
//       if (timeInMinutes >= startMinutes && timeInMinutes < endMinutes) {
//         return { fixedTime, freePeriod: fp }
//       }
//     }
//     return null
//   }

//   // Get tasks for cell
//   const getTasksForCell = (day: string, time: string) => {
//     return tasks.filter(task => {
//       if (task.day !== day) return false
//       if (task.isSleepTime) return false
      
//       const taskStartMinutes = convertTimeToMinutes(task.startTime)
//       const taskEndMinutes = convertTimeToMinutes(task.endTime)
//       const cellMinutes = convertTimeToMinutes(time)
      
//       if (taskEndMinutes < taskStartMinutes) {
//         return cellMinutes >= taskStartMinutes || cellMinutes < taskEndMinutes
//       } else {
//         return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
//       }
//     })
//   }

//   // Get sleep tasks for cell
//   const getSleepTasksForCell = (day: string, time: string) => {
//     return tasks.filter(task => {
//       if (task.day !== day) return false
//       if (!task.isSleepTime) return false
      
//       const taskStartMinutes = convertTimeToMinutes(task.startTime)
//       const taskEndMinutes = convertTimeToMinutes(task.endTime)
//       const cellMinutes = convertTimeToMinutes(time)
      
//       if (taskEndMinutes < taskStartMinutes) {
//         return cellMinutes >= taskStartMinutes || cellMinutes < taskEndMinutes
//       } else {
//         return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
//       }
//     })
//   }

//   // Check if task should show in cell
//   const shouldShowTaskInCell = (task: TimeSlot, day: string, time: string) => {
//     if (task.day !== day) return false
//     const taskStartMinutes = convertTimeToMinutes(task.startTime)
//     const cellMinutes = convertTimeToMinutes(time)
//     return taskStartMinutes === cellMinutes
//   }

//   // Get task span
//   const getTaskSpan = (task: TimeSlot) => {
//     const startMinutes = convertTimeToMinutes(task.startTime)
//     const endMinutes = convertTimeToMinutes(task.endTime)
//     let duration = endMinutes - startMinutes
//     if (duration < 0) duration += 24 * 60
//     return Math.ceil(duration / timeSettings.interval)
//   }

//   // Check if extended time
//   const isExtendedTime = (time: string) => {
//     const [hours] = time.split(':').map(Number)
//     if (timeSettings.extendedHours.morning && hours < 8) return true
//     if (timeSettings.extendedHours.evening && hours >= 18 && hours < 22) return true
//     if (timeSettings.extendedHours.night && hours >= 22) return true
//     if (timeSettings.extendedHours.custom.includes(time)) return true
//     return false
//   }

//   // Get icon by type
//   const getIconByType = (type: string) => {
//     const fixedTimeType = FIXED_TIME_TYPES.find(t => t.id === type)
//     if (fixedTimeType) {
//       const Icon = fixedTimeType.icon
//       return <Icon className="w-4 h-4" />
//     }
//     return <Clock className="w-4 h-4" />
//   }

//   // Get time slot color
//   const getTimeSlotColor = (type: string) => {
//     switch(type) {
//       case 'COLLEGE': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30'
//       case 'OFFICE': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30'
//       case 'SCHOOL': return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/30'
//       case 'COMMUTE': return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/30'
//       case 'MEAL': return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30'
//       case 'WORKOUT': return 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800/30'
//       case 'MEETING': return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/30'
//       case 'FREE': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30'
//       case 'SLEEP': return 'bg-gray-100 border-gray-300 dark:bg-gray-800/50 dark:border-gray-700'
//       default: return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
//     }
//   }

//   // Generate sleep tasks
//   const generateSleepTasks = () => {
//     const sleepTasks: TimeSlot[] = []
    
//     sleepSchedules.forEach(schedule => {
//       if (!schedule.isActive) return
      
//       const bedtimeMinutes = convertTimeToMinutes(schedule.bedtime)
//       const wakeTimeMinutes = convertTimeToMinutes(schedule.wakeTime)
      
//       if (wakeTimeMinutes < bedtimeMinutes) {
//         const midnight = convertTimeToMinutes('24:00')
//         const firstDayDuration = midnight - bedtimeMinutes
        
//         sleepTasks.push({
//           id: `sleep-${schedule.id}-part1`,
//           title: schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
//           subject: 'Rest',
//           startTime: schedule.bedtime,
//           endTime: '24:00',
//           duration: firstDayDuration,
//           priority: 'MEDIUM',
//           color: schedule.color || '#4B5563',
//           day: schedule.day,
//           type: 'sleep',
//           isSleepTime: true,
//           sleepScheduleId: schedule.id,
//           isCompleted: false
//         })
        
//         const nextDayIndex = (days.indexOf(schedule.day) + 1) % days.length
//         const nextDay = days[nextDayIndex]
        
//         sleepTasks.push({
//           id: `sleep-${schedule.id}-part2`,
//           title: schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
//           subject: 'Rest',
//           startTime: '00:00',
//           endTime: schedule.wakeTime,
//           duration: wakeTimeMinutes,
//           priority: 'MEDIUM',
//           color: schedule.color || '#4B5563',
//           day: nextDay,
//           type: 'sleep',
//           isSleepTime: true,
//           sleepScheduleId: schedule.id,
//           isCompleted: false
//         })
//       } else {
//         sleepTasks.push({
//           id: `sleep-${schedule.id}`,
//           title: schedule.type === 'POWER_NAP' ? 'Power Nap' : 'Sleep',
//           subject: 'Rest',
//           startTime: schedule.bedtime,
//           endTime: schedule.wakeTime,
//           duration: schedule.duration,
//           priority: 'MEDIUM',
//           color: schedule.color || '#4B5563',
//           day: schedule.day,
//           type: 'sleep',
//           isSleepTime: true,
//           sleepScheduleId: schedule.id,
//           isCompleted: false
//         })
//       }
//     })
    
//     setTasks(prev => [...prev.filter(task => !task.isSleepTime), ...sleepTasks])
//   }

//   // Update sleep tasks when schedules change
//   useEffect(() => {
//     if (timeSettings.showSleepBlocks) {
//       generateSleepTasks()
//     } else {
//       setTasks(tasks.filter(task => !task.isSleepTime))
//     }
//   }, [sleepSchedules, timeSettings.showSleepBlocks])

//   // Get scheduled hours by goal
//   const getScheduledHoursByGoal = () => {
//     const goalHours: Record<string, number> = {}
    
//     tasks.forEach(task => {
//       if (task.goalId && !task.isSleepTime) {
//         if (!goalHours[task.goalId]) {
//           goalHours[task.goalId] = 0
//         }
//         goalHours[task.goalId] += task.duration / 60
//       }
//     })
    
//     return goalHours
//   }

//   // Update goal completion based on scheduled tasks
//   useEffect(() => {
//     const scheduledHoursByGoal = getScheduledHoursByGoal()
    
//     const updatedGoals = goals.map(goal => {
//       const completedHours = scheduledHoursByGoal[goal.id] || 0
      
//       const updatedMilestones = goal.milestones.map(milestone => {
//         const milestoneTasks = tasks.filter(task => 
//           task.goalId === goal.id && task.milestoneId === milestone.id
//         )
//         const milestoneHours = milestoneTasks.reduce((sum, task) => sum + (task.duration / 60), 0)
        
//         return {
//           ...milestone,
//           completedHours: milestoneHours,
//           progress: milestoneHours > 0 ? Math.min(100, (milestoneHours / milestone.scheduledHours) * 100) : milestone.progress,
//           completed: milestoneHours >= milestone.scheduledHours
//         }
//       })

//       const totalMilestoneHours = updatedMilestones.reduce((sum, m) => sum + m.scheduledHours, 0)
//       const completedMilestoneHours = updatedMilestones.reduce((sum, m) => sum + m.completedHours, 0)
//       const milestoneProgress = totalMilestoneHours > 0 ? (completedMilestoneHours / totalMilestoneHours) * 100 : 0
      
//       const timeProgress = goal.totalHours > 0 ? (completedHours / goal.totalHours) * 100 : 0
      
//       const totalProgress = Math.min(100, milestoneProgress * 0.7 + timeProgress * 0.3)
      
//       const today = new Date().toDateString()
//       const lastUpdated = new Date(goal.lastUpdated).toDateString()
//       const newStreak = today === lastUpdated ? goal.streak : goal.streak + 1
      
//       return {
//         ...goal,
//         completedHours,
//         progress: Math.round(totalProgress),
//         milestones: updatedMilestones,
//         status: totalProgress >= 100 ? 'COMPLETED' : totalProgress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
//         streak: newStreak,
//         lastUpdated: new Date()
//       }
//     })
    
//     setGoals(updatedGoals)
//   }, [tasks])

//   // Handle cell click
//   const handleCellClick = (day: string, time: string) => {
//     if (isLocked) return
    
//     const sleepTasks = getSleepTasksForCell(day, time)
//     if (sleepTasks.length > 0 && timeSettings.autoLockSleep) {
//       toast.warning('This is your scheduled sleep time. Adjust sleep schedule to make changes.')
//       return
//     }
    
//     const fixedTime = isTimeInFixedSlot(day, time)
//     const freePeriod = isTimeInFreePeriod(day, time)
    
//     if (fixedTime && !freePeriod) {
//       setSelectedFixedTime(fixedTime)
//       toast.info('This is a fixed commitment. Add a free period first to schedule tasks here.')
//       return
//     }

//     setTaskCreationContext({ day, time })
//     setShowTaskCreationDialog(true)
//   }

//   // Handle add task
//   const handleAddTaskToCell = (flow: 'simple' | 'withGoal' = 'simple') => {
//     if (!newTask.title.trim()) {
//       toast.error('Please enter a task title')
//       return
//     }
    
//     if (!taskCreationContext) {
//       toast.error('No cell selected')
//       return
//     }

//     const freePeriod = isTimeInFreePeriod(taskCreationContext.day, taskCreationContext.time)
//     const fixedCommitmentId = freePeriod ? freePeriod.fixedTime.id : undefined

//     const existingTasks = getTasksForCell(taskCreationContext.day, taskCreationContext.time)
//     if (existingTasks.length > 0) {
//       toast.warning('This time slot already has tasks')
//       return
//     }

//     const goalId = newTask.goalId === 'no-goal' ? undefined : newTask.goalId || undefined
//     const milestoneId = newTask.milestoneId === 'no-milestone' ? undefined : newTask.milestoneId || undefined

//     const task: TimeSlot = {
//       id: `task-${Date.now()}`,
//       title: newTask.title,
//       subject: newTask.subject || 'General',
//       startTime: taskCreationContext.time,
//       endTime: calculateEndTime(taskCreationContext.time, newTask.duration),
//       duration: newTask.duration,
//       priority: newTask.priority,
//       color: newTask.color,
//       day: taskCreationContext.day,
//       type: 'task',
//       fixedCommitmentId,
//       goalId,
//       milestoneId,
//       note: newTask.note,
//       status: 'PENDING'
//     }

//     setTasks([...tasks, task])
//     resetTaskForm()
//     setShowTaskCreationDialog(false)
//     setTaskCreationContext(null)
//     setTaskCreationFlow('simple')
    
//     if (freePeriod) {
//       toast.success(`Task added to free period in ${freePeriod.fixedTime.title}`)
//     } else {
//       toast.success('Task added to timetable')
//     }
//   }

//   // Reset task form
//   const resetTaskForm = () => {
//     setNewTask({
//       title: '',
//       subject: '',
//       note: '',
//       duration: 60,
//       priority: 'MEDIUM',
//       color: '#3B82F6',
//       day: 'MONDAY',
//       startTime: '09:00',
//       goalId: '',
//       milestoneId: '',
//       type: 'STUDY',
//       category: 'ACADEMIC'
//     })
//   }

//   // Handle delete task
//   const handleDeleteTask = (taskId: string) => {
//     setTasks(tasks.filter(task => task.id !== taskId))
//     toast.success('Task deleted')
//   }

//   // Handle edit task
//   const handleEditTask = (task: TimeSlot) => {
//     if (task.isSleepTime) {
//       const schedule = sleepSchedules.find(s => s.id === task.sleepScheduleId)
//       if (schedule) {
//         setEditingSleepSchedule(schedule)
//         setShowSleepScheduleModal(true)
//       }
//       return
//     }
    
//     setEditingTask(task)
//     setNewTask({
//       title: task.title,
//       subject: task.subject,
//       note: task.note || '',
//       duration: task.duration,
//       priority: task.priority,
//       color: task.color,
//       day: task.day,
//       startTime: task.startTime,
//       goalId: task.goalId || '',
//       milestoneId: task.milestoneId || '',
//       type: 'STUDY',
//       category: 'ACADEMIC'
//     })
//     setShowAddTaskModal(true)
//   }

//   // Handle update task
//   const handleUpdateTask = () => {
//     if (!editingTask) return
//     if (!newTask.title.trim()) {
//       toast.error('Please enter a task title')
//       return
//     }

//     const goalId = newTask.goalId === 'no-goal' ? undefined : newTask.goalId || undefined
//     const milestoneId = newTask.milestoneId === 'no-milestone' ? undefined : newTask.milestoneId || undefined

//     const updatedTask = {
//       ...editingTask,
//       ...newTask,
//       goalId,
//       milestoneId,
//       endTime: calculateEndTime(newTask.startTime, newTask.duration)
//     }

//     setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
//     setEditingTask(null)
//     setShowAddTaskModal(false)
//     resetTaskForm()
//     toast.success('Task updated')
//   }

//   // Handle duplicate task
//   const handleDuplicateTask = (task: TimeSlot) => {
//     const duplicatedTask = {
//       ...task,
//       id: `task-${Date.now()}`,
//       title: `${task.title} (Copy)`
//     }
//     setTasks([...tasks, duplicatedTask])
//     toast.success('Task duplicated')
//   }

//   // Handle add fixed time
//   const handleAddFixedTime = () => {
//     if (!newFixedTime.title.trim()) {
//       toast.error('Please enter a title')
//       return
//     }
//     if (newFixedTime.days.length === 0) {
//       toast.error('Please select at least one day')
//       return
//     }

//     const fixedTime: FixedTime = {
//       id: `fixed-${Date.now()}`,
//       title: newFixedTime.title,
//       description: newFixedTime.description,
//       days: newFixedTime.days,
//       startTime: newFixedTime.startTime,
//       endTime: newFixedTime.endTime,
//       type: newFixedTime.type,
//       color: newFixedTime.color,
//       isEditable: newFixedTime.isEditable,
//       freePeriods: []
//     }

//     setFixedTimes([...fixedTimes, fixedTime])
//     setNewFixedTime({
//       title: '',
//       description: '',
//       days: [],
//       startTime: '09:00',
//       endTime: '17:00',
//       type: 'COLLEGE',
//       color: '#EF4444',
//       isEditable: true,
//       freePeriods: []
//     })
//     setShowAddFixedTimeModal(false)
//     toast.success('Fixed commitment added')
//   }

//   // Handle delete fixed time
//   const handleDeleteFixedTime = (id: string) => {
//     setFixedTimes(fixedTimes.filter(ft => ft.id !== id))
//     setSelectedFixedTime(null)
//     toast.success('Fixed commitment deleted')
//   }

//   // Handle edit fixed time
//   const handleEditFixedTime = (fixedTime: FixedTime) => {
//     setEditingFixedTime(fixedTime)
//     setShowEditFixedTimeModal(true)
//   }

//   // Handle save fixed time
//   const handleSaveFixedTime = (updatedFixedTime: FixedTime) => {
//     setFixedTimes(fixedTimes.map(ft => 
//       ft.id === updatedFixedTime.id ? updatedFixedTime : ft
//     ))
//     setShowEditFixedTimeModal(false)
//     setEditingFixedTime(null)
//     toast.success('Fixed commitment updated')
//   }

//   // Handle add free period
//   const handleAddFreePeriod = () => {
//     if (!selectedFixedTimeForFreePeriod) {
//       toast.error('Please select a fixed commitment')
//       return
//     }
    
//     if (!newFreePeriod.title.trim()) {
//       toast.error('Please enter a title')
//       return
//     }
    
//     const startMinutes = convertTimeToMinutes(newFreePeriod.startTime)
//     const endMinutes = convertTimeToMinutes(newFreePeriod.endTime)
    
//     if (endMinutes <= startMinutes) {
//       toast.error('End time must be after start time')
//       return
//     }
    
//     const duration = endMinutes - startMinutes
    
//     const freePeriod = {
//       id: `free-${Date.now()}`,
//       title: newFreePeriod.title,
//       startTime: newFreePeriod.startTime,
//       endTime: newFreePeriod.endTime,
//       duration,
//       day: newFreePeriod.day
//     }
    
//     const updatedFixedTime = {
//       ...selectedFixedTimeForFreePeriod,
//       freePeriods: [...(selectedFixedTimeForFreePeriod.freePeriods || []), freePeriod]
//     }
    
//     setFixedTimes(fixedTimes.map(ft => 
//       ft.id === selectedFixedTimeForFreePeriod.id ? updatedFixedTime : ft
//     ))
    
//     setNewFreePeriod({
//       title: 'Free Period',
//       startTime: '14:00',
//       endTime: '15:00',
//       duration: 60,
//       day: 'MONDAY'
//     })
//     setShowAddFreePeriodModal(false)
//     setSelectedFixedTimeForFreePeriod(null)
//     toast.success('Free period added')
//   }

//   // Handle delete free period
//   const handleDeleteFreePeriod = (fixedTimeId: string, freePeriodId: string) => {
//     const fixedTime = fixedTimes.find(ft => ft.id === fixedTimeId)
//     if (!fixedTime) return
    
//     const updatedFixedTime = {
//       ...fixedTime,
//       freePeriods: fixedTime.freePeriods?.filter(fp => fp.id !== freePeriodId) || []
//     }
    
//     setFixedTimes(fixedTimes.map(ft => 
//       ft.id === fixedTimeId ? updatedFixedTime : ft
//     ))
//     toast.success('Free period deleted')
//   }

//   // Handle save sleep schedule
//   const handleSaveSleepSchedule = (schedule: SleepSchedule) => {
//     const existingIndex = sleepSchedules.findIndex(s => s.id === schedule.id)
//     let updatedSchedules
    
//     if (existingIndex >= 0) {
//       updatedSchedules = [...sleepSchedules]
//       updatedSchedules[existingIndex] = schedule
//     } else {
//       updatedSchedules = [...sleepSchedules, schedule]
//     }
    
//     setSleepSchedules(updatedSchedules)
//     toast.success('Sleep schedule updated')
//     setEditingSleepSchedule(null)
//     setShowSleepScheduleModal(false)
//   }

//   // Handle delete sleep schedule
//   const handleDeleteSleepSchedule = (id: string) => {
//     setSleepSchedules(sleepSchedules.filter(s => s.id !== id))
//     toast.success('Sleep schedule deleted')
//   }

//   // Handle save time settings
//   const handleSaveTimeSettings = () => {
//     setTimeSlots(generateTimeSlots())
//     setShowTimeSettingsModal(false)
//     toast.success('Display settings updated')
//   }

//   // Handle extend time
//   const handleExtendTime = (extensionType: 'morning' | 'evening' | 'night' | 'custom', customSlots?: string[]) => {
//     const updatedExtendedHours = { ...timeSettings.extendedHours }
//     switch(extensionType) {
//       case 'morning':
//         updatedExtendedHours.morning = !updatedExtendedHours.morning
//         break
//       case 'evening':
//         updatedExtendedHours.evening = !updatedExtendedHours.evening
//         break
//       case 'night':
//         updatedExtendedHours.night = !updatedExtendedHours.night
//         break
//       case 'custom':
//         if (customSlots) {
//           updatedExtendedHours.custom = customSlots
//         }
//         break
//     }
//     setTimeSettings({ ...timeSettings, extendedHours: updatedExtendedHours })
//     setTimeSlots(generateTimeSlots())
//   }

//   // Handle add custom time
//   const handleAddCustomTime = (time: string) => {
//     if (!time) return
    
//     if (timeSettings.extendedHours.custom.includes(time)) {
//       toast.warning('Time slot already added')
//       return
//     }
    
//     const updatedCustom = [...timeSettings.extendedHours.custom, time].sort((a, b) => {
//       const [aH, aM] = a.split(':').map(Number)
//       const [bH, bM] = b.split(':').map(Number)
//       return (aH * 60 + aM) - (bH * 60 + bM)
//     })
    
//     handleExtendTime('custom', updatedCustom)
//     toast.success(`Added ${formatTimeDisplay(time)}`)
//   }

//   // Handle remove custom time
//   const handleRemoveCustomTime = (time: string) => {
//     const updatedCustom = timeSettings.extendedHours.custom.filter(t => t !== time)
//     handleExtendTime('custom', updatedCustom)
//     toast.success(`Removed ${formatTimeDisplay(time)}`)
//   }

//   // Prepare lock payload
//   const prepareLockPayload = () => {
//     // Prepare fixed times with free periods
//     const apiFixedTimes: any[] = fixedTimes.map(ft => ({
//       title: ft.title,
//       description: ft.description,
//       days: ft.days,
//       startTime: ft.startTime,
//       endTime: ft.endTime,
//       type: ft.type,
//       color: ft.color,
//       isEditable: ft.isEditable ?? true,
//       freePeriods: ft.freePeriods?.map(fp => ({
//         title: fp.title,
//         startTime: fp.startTime,
//         endTime: fp.endTime,
//         day: fp.day
//       })) || []
//     }))

//     // Prepare sleep schedules
//     const apiSleepSchedules: any[] = sleepSchedules.map(s => ({
//       day: s.day,
//       bedtime: s.bedtime,
//       wakeTime: s.wakeTime,
//       duration: s.duration,
//       isActive: s.isActive,
//       type: s.type,
//       notes: s.notes,
//       color: s.color
//     }))

//     // Prepare tasks (non-sleep)
//     const apiTasks: any[] = tasks
//       .filter(t => !t.isSleepTime)
//       .map(task => {
//         const apiTask: any = {
//           title: task.title,
//           subject: task.subject,
//           note: task.note,
//           startTime: task.startTime,
//           endTime: task.endTime,
//           duration: task.duration,
//           priority: task.priority,
//           color: task.color,
//           day: task.day,
//           type: task.type === 'task' ? 'STUDY' : task.type.toUpperCase(),
//           category: task.category || 'ACADEMIC',
//           status: task.status || 'PENDING'
//         }

//         if (task.goalId) {
//           apiTask.goalId = task.goalId
//         }
//         if (task.milestoneId) {
//           apiTask.milestoneId = task.milestoneId
//         }
//         if (task.fixedCommitmentId) {
//           apiTask.fixedTimeId = task.fixedCommitmentId
//         }
//         if (task.completedAt) {
//           apiTask.completedAt = task.completedAt
//         }

//         return apiTask
//       })

//     return {
//       fixedTimes: apiFixedTimes,
//       sleepSchedules: apiSleepSchedules,
//       tasks: apiTasks
//     }
//   }

//   // Lock timetable API call
//   const lockTimetable = async (payload: any): Promise<LockApiResponse> => {
//     const token = getAuthToken()
//     if (!token) {
//       throw new Error('Please login to save timetable')
//     }

//     const response = await fetch(`${API_BASE_URL}/time-table/lock`, {
//       method: 'POST',
//       headers: {
//         'Authorization': token,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(payload)
//     })

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}))
//       throw new Error(errorData.message || `Failed to lock timetable: ${response.status}`)
//     }

//     const data = await response.json()
//     return data
//   }

//   // Handle lock timetable
//   const handleLockTimetable = () => {
//     if (!hasUnsavedChanges) {
//       toast.info('No changes to save')
//       return
//     }
//     setShowLockProgress(true)
//     setIsLocking(true)
//     setLockProgress([{ step: 'Saving Timetable', status: 'in-progress', message: 'Preparing data...' }])
//     executeLockSequence()
//   }

//   // Execute lock sequence
//   const executeLockSequence = async () => {
//     try {
//       // Prepare API payload
//       const payload = prepareLockPayload()
      
//       // Update progress
//       setLockProgress([{ 
//         step: 'Saving Timetable', 
//         status: 'in-progress', 
//         message: 'Sending data to server...' 
//       }])

//       // Call the consolidated lock API
//       const result = await lockTimetable(payload)
      
//       if (result.success) {
//         setLockProgress([{ 
//           step: 'Saving Timetable', 
//           status: 'completed', 
//           message: `Created ${result.data.totalItems} items` 
//         }])
        
//         setIsLocking(false)
//         setLockSuccess(true)
//         setIsLocked(true)
//         setHasUnsavedChanges(false)
//         toast.success(result.message || 'Timetable locked and saved successfully!')
        
//         // Refresh data
//         await fetchFullTimeTable()
//       } else {
//         throw new Error(result.message || 'Failed to save timetable')
//       }
//     } catch (error) {
//       console.error('Lock sequence failed:', error)
      
//       setLockProgress([{ 
//         step: 'Saving Timetable', 
//         status: 'failed', 
//         error: error instanceof Error ? error.message : 'Unknown error' 
//       }])
      
//       setIsLocking(false)
//       toast.error('Failed to save timetable. No changes were saved.')
//     }
//   }

//   // Handle unlock timetable
//   const handleUnlockTimetable = () => {
//     setIsLocked(false)
//     setLockSuccess(false)
//     setHasUnsavedChanges(true)
//     toast.success('Timetable unlocked')
//   }

//   // Handle reset timetable
//   const handleResetTimetable = () => {
//     setShowResetConfirm(true)
//   }

//   // Confirm reset
//   const confirmReset = async () => {
//     setShowResetConfirm(false)
    
//     try {
//       toast.loading('Resetting timetable...')
      
//       const token = getAuthToken()
//       if (!token) {
//         // If no token, just clear local state
//         setTasks([])
//         setFixedTimes([])
//         setSleepSchedules([])
//         setHasUnsavedChanges(false)
//         toast.success('Timetable reset successfully')
//         return
//       }
      
//       // Delete all fixed times (this will cascade to free periods)
//       if (fixedTimes.length > 0) {
//         const fixedTimeIds = fixedTimes
//           .map(ft => ft.serverId || ft.id)
//           .filter(id => id && !id.startsWith('fixed-')) // Only send server IDs or non-temporary IDs
//         if (fixedTimeIds.length > 0) {
//           await fetch(`${API_BASE_URL}/fixed-times/bulk-delete`, {
//             method: 'POST',
//             headers: {
//               'Authorization': token,
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ fixedTimeIds })
//           })
//         }
//       }
      
//       // Delete all sleep schedules
//       if (sleepSchedules.length > 0) {
//         const scheduleIds = sleepSchedules.map(s => s.id)
//         await fetch(`${API_BASE_URL}/sleep-schedules/bulk-delete`, {
//           method: 'POST',
//           headers: {
//             'Authorization': token,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ scheduleIds })
//         })
//       }
      
//       // Delete all tasks
//       const taskIds = tasks.filter(t => !t.isSleepTime).map(t => t.id)
//       if (taskIds.length > 0) {
//         await fetch(`${API_BASE_URL}/tasks/bulk-delete`, {
//           method: 'POST',
//           headers: {
//             'Authorization': token,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ taskIds })
//         })
//       }
      
//       // Clear local state
//       setTasks([])
//       setFixedTimes([])
//       setSleepSchedules([])
//       setHasUnsavedChanges(false)
      
//       toast.success('Timetable reset successfully')
//     } catch (error) {
//       console.error('Error resetting timetable:', error)
//       toast.error('Failed to reset timetable')
//     }
//   }

//   // Handle share
//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: 'My Timetable',
//         text: 'Check out my weekly schedule!',
//         url: window.location.href,
//       }).catch(() => {
//         navigator.clipboard.writeText(window.location.href)
//         toast.success('Link copied!')
//       })
//     } else {
//       navigator.clipboard.writeText(window.location.href)
//       toast.success('Link copied!')
//     }
//   }

//   // Handle export PDF
//   const handleExportPDF = () => {
//     toast.info('PDF export coming soon')
//   }

//   // Handle print
//   const handlePrint = () => {
//     window.print()
//   }

//   // Toggle weekends
//   const toggleWeekends = () => {
//     setTimeSettings({ ...timeSettings, showWeekends: !timeSettings.showWeekends })
//   }

//   // Toggle fixed commitment expansion
//   const toggleFixedCommitmentExpansion = (id: string) => {
//     setExpandedFixedCommitments(prev => 
//       prev.includes(id) 
//         ? prev.filter(fid => fid !== id)
//         : [...prev, id]
//     )
//   }

//   // Get sleep stats
//   const getSleepStats = () => {
//     const activeSchedules = sleepSchedules.filter(s => s.isActive)
//     const totalSleepHours = activeSchedules.reduce((sum, s) => sum + (s.duration / 60), 0)
//     const avgSleepHours = activeSchedules.length > 0 ? totalSleepHours / activeSchedules.length : 0
//     return { totalSleepHours, avgSleepHours, daysWithSleep: activeSchedules.length }
//   }

//   // Get goal stats
//   const getGoalStats = () => {
//     const totalGoals = goals.length
//     const goalsWithTasks = new Set(tasks.filter(t => t.goalId).map(t => t.goalId)).size
//     const totalMilestones = goals.reduce((sum, g) => sum + g.milestones.length, 0)
//     const milestonesWithTasks = new Set(tasks.filter(t => t.milestoneId).map(t => t.milestoneId)).size
//     return { totalGoals, goalsWithTasks, totalMilestones, milestonesWithTasks }
//   }

//   // Toggle goal expansion
//   const toggleGoalExpansion = (goalId: string) => {
//     setExpandedGoals(prev => 
//       prev.includes(goalId) 
//         ? prev.filter(id => id !== goalId)
//         : [...prev, goalId]
//     )
//   }

//   // Task component
//   const TaskComponent = ({ 
//     task, 
//     onEdit,
//     onDelete,
//     onDuplicate 
//   }: { 
//     task: TimeSlot
//     onEdit: (task: TimeSlot) => void
//     onDelete: (taskId: string) => void
//     onDuplicate: (task: TimeSlot) => void
//   }) => {
//     const goal = goals.find(g => g.id === task.goalId)
//     const milestone = goal?.milestones.find(m => m.id === task.milestoneId)
    
//     return (
//       <div className="relative group h-full">
//         <div
//           className={cn(
//             "p-1.5 rounded border-2 shadow-sm cursor-pointer transition-all h-full",
//             "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500",
//             "bg-white dark:bg-gray-800",
//             task.fixedCommitmentId ? "border-green-300 dark:border-green-700" : "border-gray-200 dark:border-gray-700",
//             task.priority === 'CRITICAL' && "border-red-300 dark:border-red-700",
//             task.priority === 'HIGH' && "border-orange-300 dark:border-orange-700",
//             task.priority === 'MEDIUM' && "border-yellow-300 dark:border-yellow-700",
//           )}
//           style={{ borderLeftColor: task.color, borderLeftWidth: '4px' }}
//           onClick={() => onEdit(task)}
//         >
//           <div className="flex items-start justify-between gap-1">
//             <div className="flex-1 min-w-0">
//               <h4 className="text-xs font-semibold truncate dark:text-gray-200">{task.title}</h4>
//               <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{task.subject}</p>
//             </div>
//             {!isLocked && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
//                   <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
//                     <MoreVertical className="w-3 h-3" />
//                   </button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-32">
//                   <DropdownMenuItem onClick={() => onEdit(task)}>
//                     <Edit2 className="w-3 h-3 mr-2" />
//                     Edit
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => onDuplicate(task)}>
//                     <Copy className="w-3 h-3 mr-2" />
//                     Copy
//                   </DropdownMenuItem>
//                   <DropdownMenuItem 
//                     onClick={() => onDelete(task.id)}
//                     className="text-red-600"
//                   >
//                     <Trash2 className="w-3 h-3 mr-2" />
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
          
//           <div className="mt-1 flex items-center justify-between">
//             <Badge variant="outline" className={cn(
//               "text-[8px] px-1 py-0",
//               task.priority === 'CRITICAL' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//               task.priority === 'HIGH' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
//               task.priority === 'MEDIUM' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
//               task.priority === 'LOW' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//             )}>
//               {task.priority}
//             </Badge>
//             {milestone && (
//               <Badge variant="outline" className="text-[8px] px-1 py-0 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
//                 {milestone.title.slice(0, 8)}...
//               </Badge>
//             )}
//           </div>
          
//           {getTaskSpan(task) > 1 && (
//             <div className="absolute bottom-0.5 right-0.5 text-[8px] text-gray-400">
//               {Math.round(task.duration / 60)}h
//             </div>
//           )}
//         </div>
//       </div>
//     )
//   }

//   // Redesigned Fixed commitment card component - Compact and intuitive
//   const FixedCommitmentCard = ({ fixedTime }: { fixedTime: FixedTime }) => {
//     const typeInfo = FIXED_TIME_TYPES.find(t => t.id === fixedTime.type) || FIXED_TIME_TYPES[FIXED_TIME_TYPES.length - 1]
//     const Icon = typeInfo.icon
//     const isExpanded = expandedFixedCommitments.includes(fixedTime.id)
//     const freePeriodsCount = fixedTime.freePeriods?.length || 0
    
//     // Get unique days with free periods
//     const daysWithFreePeriods = fixedTime.freePeriods 
//       ? [...new Set(fixedTime.freePeriods.map(fp => fp.day))]
//       : []
    
//     // Format days display
//     const formatDaysDisplay = (days: string[]) => {
//       if (days.length === 7) return 'Every day'
//       if (days.length === 5 && days.includes('MONDAY') && days.includes('FRIDAY')) return 'Weekdays'
//       if (days.length === 2 && days.includes('SATURDAY') && days.includes('SUNDAY')) return 'Weekends'
      
//       const dayMap: Record<string, string> = {
//         'MONDAY': 'Mon', 'TUESDAY': 'Tue', 'WEDNESDAY': 'Wed',
//         'THURSDAY': 'Thu', 'FRIDAY': 'Fri', 'SATURDAY': 'Sat', 'SUNDAY': 'Sun'
//       }
//       return days.map(d => dayMap[d] || d.slice(0, 3)).join(', ')
//     }

//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={cn(
//           "rounded-lg border-2 overflow-hidden transition-all",
//           typeInfo.bgColor,
//           typeInfo.borderColor,
//           "hover:shadow-md cursor-pointer"
//         )}
//         onClick={() => toggleFixedCommitmentExpansion(fixedTime.id)}
//       >
//         {/* Header - Always visible */}
//         <div className="p-3 flex items-center justify-between">
//           <div className="flex items-center gap-3 flex-1 min-w-0">
//             <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
//               <Icon className="w-4 h-4" style={{ color: fixedTime.color }} />
//             </div>
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2">
//                 <h4 className="font-semibold text-sm truncate">{fixedTime.title}</h4>
//                 <Badge 
//                   className="text-[10px] px-1 py-0"
//                   style={{ backgroundColor: `${fixedTime.color}20`, color: fixedTime.color }}
//                 >
//                   {typeInfo.label}
//                 </Badge>
//               </div>
//               <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-0.5">
//                 <span className="truncate">{formatDaysDisplay(fixedTime.days)}</span>
//                 <span>•</span>
//                 <span>{formatTimeDisplay(fixedTime.startTime)} - {formatTimeDisplay(fixedTime.endTime)}</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2">
//             {freePeriodsCount > 0 && (
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
//                       <Coffee className="w-3 h-3" />
//                       {freePeriodsCount}
//                     </Badge>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>{freePeriodsCount} free period{freePeriodsCount > 1 ? 's' : ''}</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             )}
            
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-6 w-6 p-0"
//               onClick={(e) => {
//                 e.stopPropagation()
//                 setSelectedFixedTime(fixedTime)
//               }}
//             >
//               <MoreVertical className="w-3 h-3" />
//             </Button>
            
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-6 w-6 p-0"
//               onClick={(e) => {
//                 e.stopPropagation()
//                 toggleFixedCommitmentExpansion(fixedTime.id)
//               }}
//             >
//               {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//             </Button>
//           </div>
//         </div>

//         {/* Expanded content - Shows free periods and quick actions */}
//         <AnimatePresence>
//           {isExpanded && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 'auto', opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
//             >
//               <div className="p-3 space-y-3">
//                 {/* Description if exists */}
//                 {fixedTime.description && (
//                   <p className="text-xs text-gray-600 dark:text-gray-400 italic">
//                     "{fixedTime.description}"
//                   </p>
//                 )}

//                 {/* Free periods section */}
//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <h5 className="text-xs font-medium flex items-center gap-1">
//                       <Coffee className="w-3 h-3" />
//                       Free Periods
//                     </h5>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       className="h-6 px-2 text-xs"
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         setSelectedFixedTimeForFreePeriod(fixedTime)
//                         setShowAddFreePeriodModal(true)
//                       }}
//                     >
//                       <Plus className="w-3 h-3 mr-1" />
//                       Add
//                     </Button>
//                   </div>

//                   {fixedTime.freePeriods && fixedTime.freePeriods.length > 0 ? (
//                     <div className="space-y-2 max-h-32 overflow-y-auto">
//                       {fixedTime.freePeriods.map(fp => (
//                         <div key={fp.id} className="flex items-center justify-between text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
//                           <div className="flex items-center gap-2">
//                             <Coffee className="w-3 h-3 text-green-600" />
//                             <div>
//                               <span className="font-medium">{fp.title}</span>
//                               <span className="text-gray-500 ml-2">
//                                 {fp.day.slice(0, 3)} • {formatTimeDisplay(fp.startTime)} - {formatTimeDisplay(fp.endTime)}
//                               </span>
//                             </div>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="h-5 w-5 p-0"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               handleDeleteFreePeriod(fixedTime.id, fp.id)
//                             }}
//                           >
//                             <X className="w-3 h-3 text-red-500" />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-xs text-gray-500 text-center py-2 bg-gray-50 dark:bg-gray-800 rounded">
//                       No free periods yet. Click "Add" to create one.
//                     </p>
//                   )}
//                 </div>

//                 {/* Quick actions */}
//                 <div className="flex gap-2 pt-1">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="flex-1 h-7 text-xs"
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       setSelectedFixedTimeForFreePeriod(fixedTime)
//                       setShowAddFreePeriodModal(true)
//                     }}
//                   >
//                     <Coffee className="w-3 h-3 mr-1" />
//                     Add Free Period
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="flex-1 h-7 text-xs"
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       handleEditFixedTime(fixedTime)
//                     }}
//                   >
//                     <Edit2 className="w-3 h-3 mr-1" />
//                     Edit
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     )
//   }

//   // Compact Goal card component (for bottom section)
//   const CompactGoalCard = ({ goal }: { goal: Goal }) => {
//     const Icon = GOAL_CATEGORIES.find(c => c.id === goal.category)?.icon || Target
//     const isExpanded = expandedGoals.includes(goal.id)
    
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden"
//       >
//         <div 
//           className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
//           onClick={() => toggleGoalExpansion(goal.id)}
//         >
//           <div className="flex items-center gap-2">
//             <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${goal.color}20` }}>
//               <Icon className="w-4 h-4" style={{ color: goal.color }} />
//             </div>
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center justify-between">
//                 <h4 className="font-medium text-sm truncate">{goal.title}</h4>
//                 {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
//               </div>
//               <div className="flex items-center gap-2 text-xs text-gray-500">
//                 <span>{goal.progress}%</span>
//                 <span>•</span>
//                 <span>{goal.milestones.length} milestones</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <AnimatePresence>
//           {isExpanded && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 'auto', opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               className="border-t border-gray-200 dark:border-gray-700"
//             >
//               <div className="p-3 space-y-2">
//                 {goal.milestones.map(milestone => {
//                   const isScheduled = tasks.some(t => t.milestoneId === milestone.id)
//                   return (
//                     <div 
//                       key={milestone.id}
//                       className="text-xs p-2 rounded border border-gray-100 dark:border-gray-700"
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className="font-medium">{milestone.title}</span>
//                         <Badge variant="outline" className="text-[10px] px-1">
//                           {milestone.progress}%
//                         </Badge>
//                       </div>
//                       <div className="flex items-center justify-between mt-1">
//                         <span className="text-gray-500">{milestone.completedHours.toFixed(1)}/{milestone.scheduledHours}h</span>
//                         {!milestone.completed && (
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             className="h-5 px-2 text-[10px]"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               setTaskCreationContext({ day: 'MONDAY', time: '10:00' })
//                               setNewTask({
//                                 ...newTask,
//                                 title: milestone.title,
//                                 subject: goal.subject,
//                                 goalId: goal.id,
//                                 milestoneId: milestone.id
//                               })
//                               setShowTaskCreationDialog(true)
//                             }}
//                           >
//                             <Plus className="w-2 h-2 mr-1" />
//                             Schedule
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     )
//   }

//   // Time cell component
//   const TimeCell = ({ day, time }: { day: string; time: string }) => {
//     const fixedTime = isTimeInFixedSlot(day, time)
//     const freePeriodInfo = isTimeInFreePeriod(day, time)
//     const tasksInCell = getTasksForCell(day, time)
//     const sleepTasksInCell = getSleepTasksForCell(day, time)
//     const primaryTask = tasksInCell.find(task => 
//       convertTimeToMinutes(task.startTime) === convertTimeToMinutes(time)
//     ) || tasksInCell[0]
//     const sleepTask = sleepTasksInCell[0]
    
//     const isFreePeriod = !!freePeriodInfo
//     const hasSleep = sleepTasksInCell.length > 0
//     const isFixedCommitment = !!fixedTime && !isFreePeriod
    
//     return (
//       <div
//         className={cn(
//           "relative border-r border-b border-gray-200 dark:border-gray-700 group",
//           "transition-all duration-150",
//           isFixedCommitment && getTimeSlotColor(fixedTime!.type),
//           isFreePeriod && "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
//           isExtendedTime(time) && !isFixedCommitment && !hasSleep && !isFreePeriod && "bg-yellow-50/30 dark:bg-yellow-900/10",
//           hasSleep && "bg-gray-100/50 dark:bg-gray-800/50",
//           "hover:bg-gray-50 dark:hover:bg-gray-800/50"
//         )}
//         style={{ height: `${timeSettings.cellHeight}px` }}
//         onClick={() => handleCellClick(day, time)}
//       >
//         {/* Fixed commitment indicator */}
//         {isFixedCommitment && !primaryTask && !hasSleep && (
//           <div className="absolute inset-0 flex items-center justify-center p-1">
//             <div className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">
//               <div className="flex items-center justify-center gap-1">
//                 {getIconByType(fixedTime!.type)}
//                 <span className="truncate">{fixedTime!.title}</span>
//               </div>
//               <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
//                 Fixed - Add free period first
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Free period indicator */}
//         {isFreePeriod && !primaryTask && !hasSleep && (
//           <div className="absolute inset-0 flex items-center justify-center p-1">
//             <div className="text-xs font-medium text-green-700 dark:text-green-400">
//               <div className="flex items-center justify-center gap-1">
//                 <Coffee className="w-3 h-3" />
//                 <span>Free: {freePeriodInfo?.freePeriod.title}</span>
//               </div>
//               <div className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">
//                 Click to add task
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Sleep indicator */}
//         {hasSleep && !primaryTask && (
//           <div className="absolute inset-0 flex items-center justify-center p-1">
//             <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
//               <div className="flex items-center justify-center gap-1">
//                 <Moon className="w-3 h-3" />
//                 <span>Sleep Time</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Task */}
//         {primaryTask && shouldShowTaskInCell(primaryTask, day, time) && (
//           <div className="absolute inset-0 p-0.5">
//             <TaskComponent 
//               task={primaryTask}
//               onEdit={handleEditTask}
//               onDelete={handleDeleteTask}
//               onDuplicate={handleDuplicateTask}
//             />
//           </div>
//         )}

//         {/* Multiple tasks indicator */}
//         {tasksInCell.length > 1 && !primaryTask && (
//           <div className="absolute bottom-1 right-1">
//             <Badge variant="outline" className="text-[10px] px-1 py-0">
//               +{tasksInCell.length}
//             </Badge>
//           </div>
//         )}

//         {/* Add button overlay - only for free periods or empty cells (not fixed commitments) */}
//         {!isLocked && !hasSleep && !isFixedCommitment && (
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-50/80 dark:bg-gray-800/80">
//             <Button
//               size="sm"
//               variant="ghost"
//               className="h-6 w-6 p-0"
//               onClick={(e) => {
//                 e.stopPropagation()
//                 setTaskCreationContext({ day, time })
//                 setShowTaskCreationDialog(true)
//               }}
//             >
//               <Plus className="w-3 h-3" />
//             </Button>
//           </div>
//         )}
//       </div>
//     )
//   }

//   // Render timetable grid
//   const renderTimetableGrid = () => {
//     const cellWidth = timeSettings.displayMode === 'vertical' ? 140 : 120
    
//     if (timeSettings.displayMode === 'vertical') {
//       return (
//         <div className="overflow-x-auto pb-4">
//           <div className="inline-block min-w-full">
//             {/* Header row - Days */}
//             <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
//               <div className="w-24 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
//                 <span className="font-bold">Time</span>
//               </div>
//               {days.map((day) => (
//                 <div
//                   key={day}
//                   className="flex-1 min-w-[140px] p-3 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0"
//                   style={{ minWidth: cellWidth }}
//                 >
//                   <div className="flex flex-col items-center">
//                     <span className="font-bold text-sm">
//                       {day.charAt(0) + day.slice(1).toLowerCase()}
//                     </span>
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                       {['SATURDAY', 'SUNDAY'].includes(day) ? 'Weekend' : 'Weekday'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Time rows */}
//             <div className="flex">
//               {/* Time labels */}
//               <div className="w-24 flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-r-2 border-gray-300 dark:border-gray-700">
//                 {timeSlots.map((time) => (
//                   <div
//                     key={time}
//                     className={cn(
//                       "flex items-center justify-center border-b border-gray-200 dark:border-gray-700",
//                       isExtendedTime(time) && "bg-yellow-50 dark:bg-yellow-900/20"
//                     )}
//                     style={{ height: `${timeSettings.cellHeight}px` }}
//                   >
//                     <span className="text-xs font-medium">
//                       {formatTimeDisplay(time)}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* Day columns */}
//               {days.map(day => (
//                 <div key={day} className="flex-1 min-w-[140px]" style={{ minWidth: cellWidth }}>
//                   {timeSlots.map((time) => (
//                     <TimeCell key={`${day}-${time}`} day={day} time={time} />
//                   ))}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )
//     } else {
//       return (
//         <div className="overflow-x-auto pb-4">
//           <div className="inline-block min-w-full">
//             {/* Header row - Time */}
//             <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
//               <div className="w-32 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
//                 <span className="font-bold">Day / Time</span>
//               </div>
//               {timeSlots.map((time) => (
//                 <div
//                   key={time}
//                   className={cn(
//                     "flex-1 p-3 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0",
//                     isExtendedTime(time) && "bg-yellow-50 dark:bg-yellow-900/20"
//                   )}
//                   style={{ minWidth: 120 }}
//                 >
//                   <div className="flex flex-col items-center">
//                     <span className="font-bold text-sm">{formatTimeDisplay(time)}</span>
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                       to {formatTimeDisplay(getNextTimeSlot(time))}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Day rows */}
//             {days.map((day) => (
//               <div key={day} className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0">
//                 {/* Day label */}
//                 <div 
//                   className="w-32 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center p-3"
//                   style={{ height: `${timeSettings.cellHeight}px` }}
//                 >
//                   <div className="text-center">
//                     <span className="font-bold text-sm block">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
//                     <span className="text-xs text-gray-500">
//                       {['SATURDAY', 'SUNDAY'].includes(day) ? 'Weekend' : 'Weekday'}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Time cells */}
//                 {timeSlots.map((time) => (
//                   <div key={`${day}-${time}`} className="flex-1" style={{ minWidth: 120 }}>
//                     <TimeCell day={day} time={time} />
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       )
//     }
//   }

//   // Render compact view
//   const renderCompactView = () => {
//     return (
//       <div className="space-y-4">
//         {days.map(day => {
//           const dayTasks = tasks
//             .filter(t => t.day === day && !t.isSleepTime)
//             .sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))
//           const dayFixedTimes = fixedTimes.filter(ft => ft.days.includes(day))
          
//           return (
//             <Card key={day} className="overflow-hidden">
//               <CardContent className="p-4">
//                 <h3 className="font-bold text-lg mb-3">{day.charAt(0) + day.slice(1).toLowerCase()}</h3>
                
//                 {/* Fixed commitments */}
//                 {dayFixedTimes.length > 0 && (
//                   <div className="mb-4">
//                     <h4 className="text-sm font-medium text-gray-500 mb-2">Fixed Commitments</h4>
//                     {dayFixedTimes.map(ft => (
//                       <div 
//                         key={ft.id}
//                         className="p-2 mb-2 rounded border-l-4 bg-gray-50 dark:bg-gray-800 cursor-pointer"
//                         style={{ borderLeftColor: ft.color }}
//                         onClick={() => setSelectedFixedTime(ft)}
//                       >
//                         <div className="flex justify-between">
//                           <span className="font-medium">{ft.title}</span>
//                           <span className="text-sm text-gray-500">
//                             {formatTimeDisplay(ft.startTime)} - {formatTimeDisplay(ft.endTime)}
//                           </span>
//                         </div>
//                         {ft.freePeriods?.filter(fp => fp.day === day).map(fp => (
//                           <div key={fp.id} className="mt-1 ml-2 text-sm text-green-600">
//                             Free: {fp.title} ({formatTimeDisplay(fp.startTime)} - {formatTimeDisplay(fp.endTime)})
//                           </div>
//                         ))}
//                       </div>
//                     ))}
//                   </div>
//                 )}
                
//                 {/* Tasks */}
//                 {dayTasks.length > 0 ? (
//                   <div className="space-y-2">
//                     <h4 className="text-sm font-medium text-gray-500 mb-2">Tasks</h4>
//                     {dayTasks.map(task => {
//                       const goal = goals.find(g => g.id === task.goalId)
//                       return (
//                         <div 
//                           key={task.id}
//                           className="p-3 rounded border-l-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer"
//                           style={{ borderLeftColor: task.color }}
//                           onClick={() => handleEditTask(task)}
//                         >
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <h4 className="font-medium">{task.title}</h4>
//                               <p className="text-sm text-gray-500">{task.subject}</p>
//                               {goal && (
//                                 <p className="text-xs text-gray-400 mt-1">Goal: {goal.title}</p>
//                               )}
//                             </div>
//                             <Badge className={cn(
//                               task.priority === 'CRITICAL' && "bg-red-100 text-red-700",
//                               task.priority === 'HIGH' && "bg-orange-100 text-orange-700",
//                               task.priority === 'MEDIUM' && "bg-yellow-100 text-yellow-700",
//                               task.priority === 'LOW' && "bg-blue-100 text-blue-700",
//                             )}>
//                               {task.priority}
//                             </Badge>
//                           </div>
//                           <div className="mt-2 text-sm text-gray-500">
//                             {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)} ({task.duration} min)
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 ) : (
//                   <p className="text-center text-gray-500 py-4">No tasks scheduled</p>
//                 )}
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>
//     )
//   }

//   const sleepStats = getSleepStats()
//   const goalStats = getGoalStats()

//   return (
//     <TooltipProvider>
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//         {/* Header */}
//         <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex items-center justify-between">
//               {/* Left side */}
//               <div className="flex items-center gap-4">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="lg:hidden"
//                   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 >
//                   <Menu className="w-5 h-5" />
//                 </Button>
                
//                 <div>
//                   <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
//                     Chronify AI
//                   </h1>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
//                     Timetable Builder
//                   </p>
//                 </div>

//                 {/* Tabs */}
//                 <div className="hidden lg:flex items-center gap-1">
//                   {['Dashboard', 'Timetable', 'Goals', 'Builder', 'Insights', 'Progress'].map(tab => (
//                     <Button
//                       key={tab}
//                       variant={tab === 'Builder' ? 'default' : 'ghost'}
//                       size="sm"
//                       className="text-sm"
//                     >
//                       {tab}
//                     </Button>
//                   ))}
//                 </div>
//               </div>

//               {/* Center - User type and status */}
//               <div className="hidden md:flex items-center gap-2">
//                 <Badge variant="outline" className="capitalize">
//                   {userType}
//                 </Badge>
//                 {hasUnsavedChanges && (
//                   <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
//                     <AlertCircle className="w-3 h-3 mr-1" />
//                     Unsaved Changes
//                   </Badge>
//                 )}
//               </div>

//               {/* Right side */}
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={toggleDarkMode}
//                   className="hidden sm:flex"
//                 >
//                   {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//                 </Button>

//                 <Button variant="ghost" size="sm" className="hidden sm:flex">
//                   Sign In
//                 </Button>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="outline" size="sm" className="gap-2">
//                       <Settings className="w-4 h-4" />
//                       <span className="hidden md:inline">Settings</span>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem onClick={() => setShowTimeSettingsModal(true)}>
//                       Display Settings
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => setShowTimeExtensionModal(true)}>
//                       Extend Hours
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => setShowSleepScheduleModal(true)}>
//                       Sleep Schedule
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={toggleDarkMode}>
//                       {darkMode ? 'Light Mode' : 'Dark Mode'}
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>

//             {/* Mobile status */}
//             <div className="md:hidden flex items-center gap-2 mt-2">
//               <Badge variant="outline" className="capitalize">
//                 {userType}
//               </Badge>
//               {hasUnsavedChanges && (
//                 <Badge className="bg-yellow-100 text-yellow-800">
//                   <AlertCircle className="w-3 h-3 mr-1" />
//                   Unsaved Changes
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* Mobile menu */}
//         <AnimatePresence>
//           {mobileMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
//             >
//               <div className="p-4 space-y-2">
//                 {['Dashboard', 'Timetable', 'Goals', 'Builder', 'Insights', 'Progress'].map(tab => (
//                   <Button
//                     key={tab}
//                     variant={tab === 'Builder' ? 'default' : 'ghost'}
//                     size="sm"
//                     className="w-full justify-start"
//                   >
//                     {tab}
//                   </Button>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Main content */}
//         <main className="max-w-7xl mx-auto p-4 space-y-4">
//           {/* Info bar */}
//           <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
//             <div className="flex items-center gap-2">
//               <span className="font-medium">Weekdays as {timeSettings.displayMode === 'vertical' ? 'columns' : 'rows'}, time as {timeSettings.displayMode === 'vertical' ? 'rows' : 'columns'}</span>
//               {timeSettings.showSleepBlocks && (
//                 <>
//                   <span>•</span>
//                   <span>Sleep schedule active</span>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div className="flex flex-wrap items-center gap-2">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="gap-2">
//                   <FileText className="w-4 h-4" />
//                   Export
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start">
//                 <DropdownMenuItem onClick={() => setViewMode('pdf')}>
//                   View as PDF
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={handleExportPDF}>
//                   Download PDF
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={handlePrint}>
//                   Print
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={handleShare}>
//                   Share
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <Button 
//               variant="outline" 
//               size="sm" 
//               className="gap-2"
//               onClick={() => setShowGoalsModal(true)}
//             >
//               <Target className="w-4 h-4" />
//               Schedule Goals
//             </Button>

//             <Button 
//               variant="outline" 
//               size="sm" 
//               className="gap-2"
//               onClick={() => setShowSleepScheduleModal(true)}
//             >
//               <Bed className="w-4 h-4" />
//               Sleep Schedule
//             </Button>

//             <Button 
//               variant="outline" 
//               size="sm" 
//               className="gap-2"
//               onClick={() => setShowTimeSettingsModal(true)}
//             >
//               <Settings className="w-4 h-4" />
//               Display Settings
//             </Button>

//             <Button 
//               variant="outline" 
//               size="sm" 
//               className="gap-2"
//               onClick={() => setShowTimeExtensionModal(true)}
//             >
//               <PlusCircle className="w-4 h-4" />
//               Extend Time
//             </Button>

//             <Button 
//               variant="outline" 
//               size="sm" 
//               className="gap-2"
//               onClick={toggleWeekends}
//             >
//               {timeSettings.showWeekends ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               {timeSettings.showWeekends ? 'Hide' : 'Show'} Weekends
//             </Button>

//             <Button 
//               variant={isLocked ? "outline" : "default"}
//               size="sm" 
//               className="gap-2"
//               onClick={isLocked ? handleUnlockTimetable : handleLockTimetable}
//               disabled={isLocking}
//             >
//               {isLocking ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : isLocked ? (
//                 <Unlock className="w-4 h-4" />
//               ) : (
//                 <Lock className="w-4 h-4" />
//               )}
//               {isLocked ? 'Unlock' : 'Lock'} Timetable
//             </Button>

//             <Button 
//               variant="destructive" 
//               size="sm" 
//               className="gap-2"
//               onClick={handleResetTimetable}
//             >
//               <RefreshCw className="w-4 h-4" />
//               Reset
//             </Button>
//           </div>

//           {/* View mode toggles */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Button
//                 variant={viewMode === 'grid' ? 'default' : 'outline'}
//                 size="sm"
//                 onClick={() => setViewMode('grid')}
//                 className="gap-2"
//               >
//                 <Grid className="w-4 h-4" />
//                 Grid View
//               </Button>
//               <Button
//                 variant={viewMode === 'compact' ? 'default' : 'outline'}
//                 size="sm"
//                 onClick={() => setViewMode('compact')}
//                 className="gap-2"
//               >
//                 <List className="w-4 h-4" />
//                 Compact View
//               </Button>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <Button
//                 variant={timeSettings.displayMode === 'vertical' ? 'default' : 'outline'}
//                 size="sm"
//                 onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
//                 className="gap-2"
//               >
//                 <Columns className="w-4 h-4" />
//                 Vertical
//               </Button>
//               <Button
//                 variant={timeSettings.displayMode === 'horizontal' ? 'default' : 'outline'}
//                 size="sm"
//                 onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
//                 className="gap-2"
//               >
//                 <Rows className="w-4 h-4" />
//                 Horizontal
//               </Button>
//             </div>
//           </div>

//           {/* Stats cards */}
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
//             <Card>
//               <CardContent className="p-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
//                     <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div>
//                     <div className="text-lg font-bold">
//                       {(tasks.reduce((sum, t) => sum + t.duration, 0) / 60).toFixed(1)}h
//                     </div>
//                     <div className="text-xs text-gray-500">Total Hours</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
//                     <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
//                   </div>
//                   <div>
//                     <div className="text-lg font-bold">{tasks.length}</div>
//                     <div className="text-xs text-gray-500">Tasks Planned</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
//                     <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
//                   </div>
//                   <div>
//                     <div className="text-lg font-bold">{goalStats.goalsWithTasks}/{goalStats.totalGoals}</div>
//                     <div className="text-xs text-gray-500">Goals Scheduled</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
//                     <Award className="w-4 h-4 text-orange-600 dark:text-orange-400" />
//                   </div>
//                   <div>
//                     <div className="text-lg font-bold">{goalStats.milestonesWithTasks}/{goalStats.totalMilestones}</div>
//                     <div className="text-xs text-gray-500">Milestones</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
//                     <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
//                   </div>
//                   <div>
//                     <div className="text-lg font-bold">{sleepStats.totalSleepHours.toFixed(1)}h</div>
//                     <div className="text-xs text-gray-500">Sleep Hours</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/30">
//                     <Bed className="w-4 h-4 text-pink-600 dark:text-pink-400" />
//                   </div>
//                   <div>
//                     <div className="text-lg font-bold">{sleepStats.avgSleepHours.toFixed(1)}h</div>
//                     <div className="text-xs text-gray-500">Avg Sleep</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-3">
//                 <div className="flex items-center gap-2">
//                   <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
//                     <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
//                   </div>
//                   <div>
//                     <div className="text-lg font-bold">{fixedTimes.length}</div>
//                     <div className="text-xs text-gray-500">Fixed Commits</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Redesigned Fixed commitments section - Compact and intuitive */}
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h3 className="font-bold text-lg flex items-center gap-2">
//                     <Clock className="w-5 h-5" />
//                     Fixed Commitments
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Add your regular commitments and create free periods within them to schedule tasks
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Badge variant="secondary" className="px-2 py-1">
//                     {fixedTimes.length} total
//                   </Badge>
//                   <Button 
//                     size="sm"
//                     onClick={() => setShowAddFixedTimeModal(true)}
//                     className="gap-2"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add New
//                   </Button>
//                 </div>
//               </div>
              
//               {fixedTimes.length > 0 ? (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
//                   {fixedTimes.map(ft => (
//                     <FixedCommitmentCard key={ft.id} fixedTime={ft} />
//                   ))}
                  
//                   {/* Quick add card */}
//                   <div 
//                     className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 cursor-pointer flex items-center justify-center p-4 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/10"
//                     onClick={() => setShowAddFixedTimeModal(true)}
//                   >
//                     <div className="text-center">
//                       <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-2">
//                         <Plus className="w-5 h-5 text-gray-500" />
//                       </div>
//                       <p className="font-medium text-sm">Quick Add Commitment</p>
//                       <p className="text-xs text-gray-500 mt-1">College, Gym, Meeting, etc.</p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div 
//                   className="p-8 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 cursor-pointer text-center"
//                   onClick={() => setShowAddFixedTimeModal(true)}
//                 >
//                   <Plus className="w-8 h-8 mx-auto mb-3 text-gray-400" />
//                   <p className="font-medium">Add Your First Fixed Commitment</p>
//                   <p className="text-sm text-gray-500 mt-1">Click to add college hours, office time, gym sessions, etc.</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Main timetable */}
//           <Card>
//             <CardContent className="p-4">
//               {viewMode === 'compact' ? renderCompactView() : renderTimetableGrid()}
//             </CardContent>
//           </Card>

//           {/* Goals & Milestones section - moved to bottom with compact design */}
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h3 className="font-bold text-lg flex items-center gap-2">
//                     <Target className="w-5 h-5" />
//                     Goals & Milestones
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Track your progress and schedule tasks from your goals
//                   </p>
//                 </div>
//                 <Button 
//                   size="sm"
//                   variant="outline"
//                   onClick={() => setShowGoalsModal(true)}
//                   className="gap-2"
//                 >
//                   <Target className="w-4 h-4" />
//                   View All
//                 </Button>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {goals.map(goal => (
//                   <CompactGoalCard key={goal.id} goal={goal} />
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Footer */}
//           <div className="text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-800 pt-6 mt-8">
//             <p>
//               Chronify AI Timetable Builder helps you create a personalized weekly schedule with fixed commitments, 
//               free periods, tasks from goals, and sleep schedules.
//             </p>
//             <p className="mt-2">
//               Create your perfect schedule today with Chronify AI - the smart way to organize your time and achieve your goals.
//             </p>
//           </div>
//         </main>

//         {/* Task Creation Dialog with Options */}
//         <Dialog open={showTaskCreationDialog} onOpenChange={(open) => {
//           setShowTaskCreationDialog(open)
//           if (!open) {
//             setTaskCreationContext(null)
//             resetTaskForm()
//             setTaskCreationFlow('simple')
//           }
//         }}>
//           <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
//             <DialogHeader>
//               <DialogTitle className="dark:text-gray-100">
//                 Add Task to {taskCreationContext?.day.charAt(0) + taskCreationContext?.day.slice(1).toLowerCase()} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
//               </DialogTitle>
//               <DialogDescription className="dark:text-gray-400">
//                 Choose how you want to add this task
//               </DialogDescription>
//             </DialogHeader>
            
//             {taskCreationFlow === 'simple' ? (
//               <div className="space-y-4 py-4">
//                 <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4">
//                   <p className="text-sm text-gray-700 dark:text-gray-300">
//                     <span className="font-medium">Time Slot:</span> {taskCreationContext?.day.charAt(0) + taskCreationContext?.day.slice(1).toLowerCase()} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
//                   </p>
//                   <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                     Task will be scheduled starting at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
//                   </p>
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Task Title *</label>
//                   <Input
//                     placeholder="e.g., Study React, Complete Assignment"
//                     value={newTask.title}
//                     onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium mb-2 block dark:text-gray-300">Subject</label>
//                     <Input
//                       placeholder="e.g., DSA, Web Dev"
//                       value={newTask.subject}
//                       onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium mb-2 block dark:text-gray-300">Duration</label>
//                     <Select
//                       value={newTask.duration.toString()}
//                       onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
//                     >
//                       <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                         <SelectValue placeholder="Select duration" />
//                       </SelectTrigger>
//                       <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                         <SelectItem value={timeSettings.interval.toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval} minutes</SelectItem>
//                         <SelectItem value={(timeSettings.interval * 2).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 2} minutes</SelectItem>
//                         <SelectItem value={(timeSettings.interval * 3).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 3} minutes</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Priority</label>
//                   <Select
//                     value={newTask.priority}
//                     onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
//                   >
//                     <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                       <SelectValue placeholder="Select priority" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                       <SelectItem value="LOW" className="dark:text-gray-300 dark:hover:bg-gray-700">Low</SelectItem>
//                       <SelectItem value="MEDIUM" className="dark:text-gray-300 dark:hover:bg-gray-700">Medium</SelectItem>
//                       <SelectItem value="HIGH" className="dark:text-gray-300 dark:hover:bg-gray-700">High</SelectItem>
//                       <SelectItem value="CRITICAL" className="dark:text-gray-300 dark:hover:bg-gray-700">Critical</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Notes (Optional)</label>
//                   <Textarea
//                     placeholder="Add any notes..."
//                     value={newTask.note}
//                     onChange={(e) => setNewTask({...newTask, note: e.target.value})}
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                     rows={2}
//                   />
//                 </div>
                
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       setTaskCreationFlow('withGoal')
//                       if (taskCreationContext) {
//                         setNewTask({
//                           ...newTask,
//                           day: taskCreationContext.day,
//                           startTime: taskCreationContext.time,
//                           duration: timeSettings.interval
//                         })
//                       }
//                     }}
//                     className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                   >
//                     <Target className="w-4 h-4 mr-2" />
//                     Link to Goal
//                   </Button>
//                   <Button
//                     onClick={() => handleAddTaskToCell('simple')}
//                     className="flex-1"
//                     disabled={!newTask.title.trim()}
//                   >
//                     Add Task
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-4 py-4">
//                 <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg mb-4">
//                   <p className="text-sm text-gray-700 dark:text-gray-300">
//                     <span className="font-medium">Time Slot:</span> {taskCreationContext?.day.charAt(0) + taskCreationContext?.day.slice(1).toLowerCase()} at {taskCreationContext && formatTimeDisplay(taskCreationContext.time)}
//                   </p>
//                   <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                     Link this task to a goal or milestone to track progress
//                   </p>
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Task Title *</label>
//                   <Input
//                     placeholder="e.g., Study React, Complete Assignment"
//                     value={newTask.title}
//                     onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium mb-2 block dark:text-gray-300">Subject</label>
//                     <Input
//                       placeholder="e.g., DSA, Web Dev"
//                       value={newTask.subject}
//                       onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium mb-2 block dark:text-gray-300">Duration</label>
//                     <Select
//                       value={newTask.duration.toString()}
//                       onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
//                     >
//                       <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                         <SelectValue placeholder="Select duration" />
//                       </SelectTrigger>
//                       <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                         <SelectItem value={timeSettings.interval.toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval} minutes</SelectItem>
//                         <SelectItem value={(timeSettings.interval * 2).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 2} minutes</SelectItem>
//                         <SelectItem value={(timeSettings.interval * 3).toString()} className="dark:text-gray-300 dark:hover:bg-gray-700">{timeSettings.interval * 3} minutes</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Priority</label>
//                   <Select
//                     value={newTask.priority}
//                     onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
//                   >
//                     <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                       <SelectValue placeholder="Select priority" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                       <SelectItem value="LOW" className="dark:text-gray-300 dark:hover:bg-gray-700">Low</SelectItem>
//                       <SelectItem value="MEDIUM" className="dark:text-gray-300 dark:hover:bg-gray-700">Medium</SelectItem>
//                       <SelectItem value="HIGH" className="dark:text-gray-300 dark:hover:bg-gray-700">High</SelectItem>
//                       <SelectItem value="CRITICAL" className="dark:text-gray-300 dark:hover:bg-gray-700">Critical</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Link to Goal (Optional)</label>
//                   <Select
//                     value={newTask.goalId}
//                     onValueChange={(value) => {
//                       setNewTask({
//                         ...newTask,
//                         goalId: value,
//                         milestoneId: ''
//                       })
//                     }}
//                   >
//                     <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                       <SelectValue placeholder="Select a goal" />
//                     </SelectTrigger>
//                     <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                       <SelectItem value="no-goal" className="dark:text-gray-300 dark:hover:bg-gray-700">No Goal (Independent Task)</SelectItem>
//                       {goals.map(goal => (
//                         <SelectItem key={goal.id} value={goal.id} className="dark:text-gray-300 dark:hover:bg-gray-700">
//                           <div className="flex items-center gap-2">
//                             <div 
//                               className="w-2 h-2 rounded-full"
//                               style={{ backgroundColor: goal.color }}
//                             />
//                             {goal.title}
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {newTask.goalId && newTask.goalId !== 'no-goal' && (
//                   <div>
//                     <label className="text-sm font-medium mb-2 block dark:text-gray-300">Link to Milestone (Optional)</label>
//                     <Select
//                       value={newTask.milestoneId}
//                       onValueChange={(value) => setNewTask({...newTask, milestoneId: value})}
//                     >
//                       <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
//                         <SelectValue placeholder="Select a milestone" />
//                       </SelectTrigger>
//                       <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
//                         <SelectItem value="no-milestone" className="dark:text-gray-300 dark:hover:bg-gray-700">No Milestone (General Goal Task)</SelectItem>
//                         {goals
//                           .find(g => g.id === newTask.goalId)
//                           ?.milestones.map(milestone => (
//                             <SelectItem key={milestone.id} value={milestone.id} className="dark:text-gray-300 dark:hover:bg-gray-700">
//                               <div className="flex items-center gap-2">
//                                 <div className={`w-2 h-2 rounded-full ${milestone.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
//                                 {milestone.title}
//                               </div>
//                             </SelectItem>
//                           ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
                
//                 <div>
//                   <label className="text-sm font-medium mb-2 block dark:text-gray-300">Notes (Optional)</label>
//                   <Textarea
//                     placeholder="Add any notes..."
//                     value={newTask.note}
//                     onChange={(e) => setNewTask({...newTask, note: e.target.value})}
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
//                     rows={2}
//                   />
//                 </div>
                
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => setTaskCreationFlow('simple')}
//                     className="flex-1 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//                   >
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Simple Task
//                   </Button>
//                   <Button
//                     onClick={() => handleAddTaskToCell('withGoal')}
//                     className="flex-1"
//                     disabled={!newTask.title.trim()}
//                   >
//                     {newTask.goalId && newTask.goalId !== 'no-goal' ? 'Add Task with Goal' : 'Add Task'}
//                   </Button>
//                 </div>
//               </div>
//             )}
            
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setShowTaskCreationDialog(false)
//                   setTaskCreationContext(null)
//                   resetTaskForm()
//                   setTaskCreationFlow('simple')
//                 }}
//                 className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
//               >
//                 Cancel
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Add Fixed Time Modal */}
//         <Dialog open={showAddFixedTimeModal} onOpenChange={setShowAddFixedTimeModal}>
//           <DialogContent className="sm:max-w-lg">
//             <DialogHeader>
//               <DialogTitle>Add Fixed Commitment</DialogTitle>
//               <DialogDescription>
//                 Add regular commitments like college, work, gym, etc.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
//               <Input
//                 placeholder="Title (e.g., College Hours)"
//                 value={newFixedTime.title}
//                 onChange={(e) => setNewFixedTime({...newFixedTime, title: e.target.value})}
//               />

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label>Start Time</Label>
//                   <Input
//                     type="time"
//                     value={newFixedTime.startTime}
//                     onChange={(e) => setNewFixedTime({...newFixedTime, startTime: e.target.value})}
//                     className="mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label>End Time</Label>
//                   <Input
//                     type="time"
//                     value={newFixedTime.endTime}
//                     onChange={(e) => setNewFixedTime({...newFixedTime, endTime: e.target.value})}
//                     className="mt-1"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label>Type</Label>
//                 <div className="grid grid-cols-3 gap-2 mt-2">
//                   {FIXED_TIME_TYPES.slice(0, 9).map((type) => {
//                     const Icon = type.icon
//                     return (
//                       <Button
//                         key={type.id}
//                         variant={newFixedTime.type === type.id ? 'default' : 'outline'}
//                         size="sm"
//                         className="flex-col h-auto py-2"
//                         onClick={() => setNewFixedTime({...newFixedTime, type: type.id as any, color: type.color})}
//                       >
//                         <Icon className="w-4 h-4 mb-1" />
//                         <span className="text-[10px]">{type.label}</span>
//                       </Button>
//                     )
//                   })}
//                 </div>
//               </div>

//               <div>
//                 <Label>Days</Label>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {days.map(day => (
//                     <Button
//                       key={day}
//                       variant={newFixedTime.days.includes(day) ? 'default' : 'outline'}
//                       size="sm"
//                       onClick={() => {
//                         const newDays = newFixedTime.days.includes(day)
//                           ? newFixedTime.days.filter(d => d !== day)
//                           : [...newFixedTime.days, day]
//                         setNewFixedTime({...newFixedTime, days: newDays})
//                       }}
//                     >
//                       {day.slice(0, 3)}
//                     </Button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <Label>Description (Optional)</Label>
//                 <Textarea
//                   placeholder="Brief description"
//                   value={newFixedTime.description}
//                   onChange={(e) => setNewFixedTime({...newFixedTime, description: e.target.value})}
//                   className="mt-1"
//                   rows={2}
//                 />
//               </div>
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setShowAddFixedTimeModal(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddFixedTime} disabled={!newFixedTime.title || newFixedTime.days.length === 0}>
//                 Add Commitment
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Sleep Schedule Modal */}
//         <Dialog open={showSleepScheduleModal} onOpenChange={setShowSleepScheduleModal}>
//           <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Sleep Schedule</DialogTitle>
//               <DialogDescription>
//                 Manage your sleep schedule for each day
//               </DialogDescription>
//             </DialogHeader>

//             <div className="space-y-4 py-4">
//               {days.map(day => {
//                 const schedule = sleepSchedules.find(s => s.day === day) || {
//                   id: `temp-${day}`,
//                   day,
//                   bedtime: '23:00',
//                   wakeTime: '07:00',
//                   duration: 480,
//                   isActive: true,
//                   color: '#4B5563',
//                   type: 'REGULAR' as const
//                 }
                
//                 return (
//                   <Card key={day}>
//                     <CardContent className="p-4">
//                       <div className="flex items-center justify-between mb-3">
//                         <span className="font-medium">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
//                         <Switch
//                           checked={schedule.isActive}
//                           onCheckedChange={(checked) => {
//                             const updated = { ...schedule, isActive: checked }
//                             handleSaveSleepSchedule(updated)
//                           }}
//                         />
//                       </div>
                      
//                       {schedule.isActive && (
//                         <div className="space-y-3">
//                           <div className="grid grid-cols-2 gap-2">
//                             <div>
//                               <Label className="text-xs">Bedtime</Label>
//                               <Input
//                                 type="time"
//                                 value={schedule.bedtime}
//                                 onChange={(e) => {
//                                   const bedtime = e.target.value
//                                   const wakeTime = schedule.wakeTime
//                                   const bedtimeMinutes = convertTimeToMinutes(bedtime)
//                                   const wakeTimeMinutes = convertTimeToMinutes(wakeTime)
//                                   const duration = wakeTimeMinutes > bedtimeMinutes 
//                                     ? wakeTimeMinutes - bedtimeMinutes
//                                     : (24*60 - bedtimeMinutes) + wakeTimeMinutes
//                                   const updated = { 
//                                     ...schedule, 
//                                     bedtime,
//                                     duration
//                                   }
//                                   handleSaveSleepSchedule(updated)
//                                 }}
//                                 className="mt-1"
//                               />
//                             </div>
//                             <div>
//                               <Label className="text-xs">Wake Time</Label>
//                               <Input
//                                 type="time"
//                                 value={schedule.wakeTime}
//                                 onChange={(e) => {
//                                   const wakeTime = e.target.value
//                                   const bedtime = schedule.bedtime
//                                   const bedtimeMinutes = convertTimeToMinutes(bedtime)
//                                   const wakeTimeMinutes = convertTimeToMinutes(wakeTime)
//                                   const duration = wakeTimeMinutes > bedtimeMinutes 
//                                     ? wakeTimeMinutes - bedtimeMinutes
//                                     : (24*60 - bedtimeMinutes) + wakeTimeMinutes
//                                   const updated = { 
//                                     ...schedule, 
//                                     wakeTime,
//                                     duration
//                                   }
//                                   handleSaveSleepSchedule(updated)
//                                 }}
//                                 className="mt-1"
//                               />
//                             </div>
//                           </div>
                          
//                           <div>
//                             <Label className="text-xs">Type</Label>
//                             <Select
//                               value={schedule.type}
//                               onValueChange={(value: any) => {
//                                 const updated = { ...schedule, type: value }
//                                 handleSaveSleepSchedule(updated)
//                               }}
//                             >
//                               <SelectTrigger className="mt-1">
//                                 <SelectValue />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {SLEEP_TYPES.map(type => (
//                                   <SelectItem key={type.id} value={type.id}>
//                                     {type.label}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           </div>
                          
//                           <div>
//                             <Label className="text-xs">Notes (Optional)</Label>
//                             <Input
//                               value={schedule.notes || ''}
//                               onChange={(e) => {
//                                 const updated = { ...schedule, notes: e.target.value }
//                                 handleSaveSleepSchedule(updated)
//                               }}
//                               className="mt-1"
//                               placeholder="Add notes..."
//                             />
//                           </div>
                          
//                           <div className="text-xs text-gray-500">
//                             Duration: {Math.floor(schedule.duration / 60)}h {schedule.duration % 60}m
//                           </div>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>

//             <DialogFooter>
//               <Button onClick={() => setShowSleepScheduleModal(false)}>
//                 Done
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Fixed Time Details Modal */}
//         <Dialog open={!!selectedFixedTime} onOpenChange={() => setSelectedFixedTime(null)}>
//           <DialogContent className="sm:max-w-lg">
//             <DialogHeader>
//               <DialogTitle>Fixed Commitment Details</DialogTitle>
//             </DialogHeader>
            
//             {selectedFixedTime && (
//               <div className="space-y-4 py-4">
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 rounded-lg" style={{ backgroundColor: `${selectedFixedTime.color}20` }}>
//                     {getIconByType(selectedFixedTime.type)}
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-lg">{selectedFixedTime.title}</h3>
//                     <p className="text-sm text-gray-500">
//                       {selectedFixedTime.days.map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(', ')} • {formatTimeDisplay(selectedFixedTime.startTime)} - {formatTimeDisplay(selectedFixedTime.endTime)}
//                     </p>
//                   </div>
//                 </div>
                
//                 {selectedFixedTime.description && (
//                   <p className="text-sm text-gray-600 dark:text-gray-400">{selectedFixedTime.description}</p>
//                 )}
                
//                 <div>
//                   <h4 className="font-medium mb-2">Free Periods</h4>
//                   {selectedFixedTime.freePeriods && selectedFixedTime.freePeriods.length > 0 ? (
//                     <div className="space-y-2 max-h-60 overflow-y-auto">
//                       {selectedFixedTime.freePeriods.map(fp => (
//                         <div key={fp.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <span className="font-medium text-sm">{fp.title}</span>
//                               <Badge variant="outline" className="ml-2 text-xs">
//                                 {fp.day.charAt(0) + fp.day.slice(1).toLowerCase()}
//                               </Badge>
//                             </div>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-6 w-6 p-0"
//                               onClick={() => handleDeleteFreePeriod(selectedFixedTime.id, fp.id)}
//                             >
//                               <Trash2 className="w-3 h-3 text-red-500" />
//                             </Button>
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                             {formatTimeDisplay(fp.startTime)} - {formatTimeDisplay(fp.endTime)} ({fp.duration} min)
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-500">No free periods added yet</p>
//                   )}
//                 </div>
                
//                 <div className="flex gap-2 pt-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex-1"
//                     onClick={() => {
//                       setSelectedFixedTimeForFreePeriod(selectedFixedTime)
//                       setSelectedFixedTime(null)
//                       setShowAddFreePeriodModal(true)
//                     }}
//                   >
//                     <Coffee className="w-4 h-4 mr-2" />
//                     Add Free Period
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex-1"
//                     onClick={() => {
//                       handleEditFixedTime(selectedFixedTime)
//                       setSelectedFixedTime(null)
//                     }}
//                   >
//                     <Edit2 className="w-4 h-4 mr-2" />
//                     Edit
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     className="flex-1"
//                     onClick={() => {
//                       handleDeleteFixedTime(selectedFixedTime.id)
//                       setSelectedFixedTime(null)
//                     }}
//                   >
//                     <Trash2 className="w-4 h-4 mr-2" />
//                     Delete
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>

//         {/* Add Free Period Modal */}
//         <Dialog open={showAddFreePeriodModal} onOpenChange={setShowAddFreePeriodModal}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>Add Free Period</DialogTitle>
//               <DialogDescription>
//                 {selectedFixedTimeForFreePeriod && `For "${selectedFixedTimeForFreePeriod.title}"`}
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="space-y-4 py-4">
//               <Input
//                 placeholder="Title (e.g., Lunch Break)"
//                 value={newFreePeriod.title}
//                 onChange={(e) => setNewFreePeriod({...newFreePeriod, title: e.target.value})}
//               />
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label>Start Time</Label>
//                   <Input
//                     type="time"
//                     value={newFreePeriod.startTime}
//                     onChange={(e) => setNewFreePeriod({...newFreePeriod, startTime: e.target.value})}
//                     className="mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label>End Time</Label>
//                   <Input
//                     type="time"
//                     value={newFreePeriod.endTime}
//                     onChange={(e) => setNewFreePeriod({...newFreePeriod, endTime: e.target.value})}
//                     className="mt-1"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <Label>Day</Label>
//                 <Select
//                   value={newFreePeriod.day}
//                   onValueChange={(value) => setNewFreePeriod({...newFreePeriod, day: value})}
//                 >
//                   <SelectTrigger className="mt-1">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {selectedFixedTimeForFreePeriod?.days.map(day => (
//                       <SelectItem key={day} value={day}>
//                         {day.charAt(0) + day.slice(1).toLowerCase()}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
            
//             <DialogFooter>
//               <Button variant="outline" onClick={() => {
//                 setShowAddFreePeriodModal(false)
//                 setSelectedFixedTimeForFreePeriod(null)
//               }}>
//                 Cancel
//               </Button>
//               <Button onClick={handleAddFreePeriod} disabled={!newFreePeriod.title}>
//                 Add Free Period
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Goals Modal */}
//         <Dialog open={showGoalsModal} onOpenChange={setShowGoalsModal}>
//           <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Goals & Milestones</DialogTitle>
//               <DialogDescription>
//                 View all goals and schedule tasks from milestones
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="space-y-4 py-4">
//               {goals.map(goal => (
//                 <Card key={goal.id}>
//                   <CardContent className="p-4">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="p-2 rounded-lg" style={{ backgroundColor: `${goal.color}20` }}>
//                         {GOAL_CATEGORIES.find(c => c.id === goal.category)?.icon && 
//                           React.createElement(GOAL_CATEGORIES.find(c => c.id === goal.category)!.icon, { className: "w-5 h-5", style: { color: goal.color } })
//                         }
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-bold">{goal.title}</h3>
//                         <p className="text-sm text-gray-500">{goal.description}</p>
//                       </div>
//                       <Badge className={cn(
//                         goal.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
//                         goal.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
//                         goal.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
//                         'bg-blue-100 text-blue-700'
//                       )}>
//                         {goal.priority}
//                       </Badge>
//                     </div>
                    
//                     <div className="mb-3">
//                       <div className="flex justify-between text-sm mb-1">
//                         <span>Progress</span>
//                         <span>{goal.progress}%</span>
//                       </div>
//                       <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                         <div 
//                           className="h-full rounded-full transition-all"
//                           style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
//                         />
//                       </div>
//                       <div className="flex justify-between mt-1 text-xs text-gray-500">
//                         <span>{goal.completedHours.toFixed(1)}/{goal.totalHours}h</span>
//                         <span>{goal.milestones.length} milestones</span>
//                       </div>
//                     </div>
                    
//                     <h4 className="font-medium mb-2">Milestones</h4>
//                     <div className="space-y-2">
//                       {goal.milestones.map(milestone => {
//                         const isScheduled = tasks.some(t => t.milestoneId === milestone.id)
//                         return (
//                           <div 
//                             key={milestone.id}
//                             className={cn(
//                               "p-3 rounded-lg border",
//                               isScheduled ? "border-green-300 bg-green-50 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-700"
//                             )}
//                           >
//                             <div className="flex items-start justify-between mb-2">
//                               <div>
//                                 <h5 className="font-medium">{milestone.title}</h5>
//                                 <p className="text-sm text-gray-500">{milestone.description}</p>
//                               </div>
//                               <Badge variant="outline">{milestone.progress}%</Badge>
//                             </div>
//                             <div className="flex items-center justify-between">
//                               <div className="text-sm text-gray-500">
//                                 {milestone.completedHours.toFixed(1)}/{milestone.scheduledHours}h
//                               </div>
//                               {!milestone.completed && (
//                                 <Button
//                                   size="sm"
//                                   variant={isScheduled ? "outline" : "default"}
//                                   onClick={() => {
//                                     setTaskCreationContext({ day: 'MONDAY', time: '10:00' })
//                                     setNewTask({
//                                       ...newTask,
//                                       title: milestone.title,
//                                       subject: goal.subject,
//                                       goalId: goal.id,
//                                       milestoneId: milestone.id
//                                     })
//                                     setShowGoalsModal(false)
//                                     setShowTaskCreationDialog(true)
//                                   }}
//                                 >
//                                   {isScheduled ? (
//                                     <>
//                                       <CheckCircle className="w-3 h-3 mr-1" />
//                                       Reschedule
//                                     </>
//                                   ) : (
//                                     <>
//                                       <Plus className="w-3 h-3 mr-1" />
//                                       Schedule
//                                     </>
//                                   )}
//                                 </Button>
//                               )}
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* Time Extension Modal */}
//         <Dialog open={showTimeExtensionModal} onOpenChange={setShowTimeExtensionModal}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>Extend Time Slots</DialogTitle>
//               <DialogDescription>
//                 Add additional time slots to your schedule
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="space-y-4 py-4">
//               <div>
//                 <h3 className="font-medium mb-2">Quick Extensions</h3>
//                 <div className="grid grid-cols-2 gap-2">
//                   <Button
//                     variant={timeSettings.extendedHours.morning ? "default" : "outline"}
//                     onClick={() => handleExtendTime('morning')}
//                     className="flex-col h-auto py-3"
//                   >
//                     <Sunrise className="w-5 h-5 mb-1" />
//                     <span className="text-xs">Morning</span>
//                     <span className="text-[10px] opacity-75">5 AM - 8 AM</span>
//                   </Button>
                  
//                   <Button
//                     variant={timeSettings.extendedHours.evening ? "default" : "outline"}
//                     onClick={() => handleExtendTime('evening')}
//                     className="flex-col h-auto py-3"
//                   >
//                     <Sunset className="w-5 h-5 mb-1" />
//                     <span className="text-xs">Evening</span>
//                     <span className="text-[10px] opacity-75">6 PM - 10 PM</span>
//                   </Button>
                  
//                   <Button
//                     variant={timeSettings.extendedHours.night ? "default" : "outline"}
//                     onClick={() => handleExtendTime('night')}
//                     className="flex-col h-auto py-3 col-span-2"
//                   >
//                     <MoonStar className="w-5 h-5 mb-1" />
//                     <span className="text-xs">Night</span>
//                     <span className="text-[10px] opacity-75">10 PM - 12 AM</span>
//                   </Button>
//                 </div>
//               </div>
              
//               <div>
//                 <h3 className="font-medium mb-2">Custom Time Slot</h3>
//                 <div className="flex gap-2">
//                   <Input
//                     type="time"
//                     placeholder="HH:MM"
//                     id="custom-time"
//                   />
//                   <Button 
//                     onClick={() => {
//                       const input = document.getElementById('custom-time') as HTMLInputElement
//                       if (input.value) {
//                         handleAddCustomTime(input.value)
//                         input.value = ''
//                       }
//                     }}
//                   >
//                     Add
//                   </Button>
//                 </div>
                
//                 {timeSettings.extendedHours.custom.length > 0 && (
//                   <div className="mt-3">
//                     <Label className="text-sm">Added Slots</Label>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {timeSettings.extendedHours.custom.map(time => (
//                         <Badge key={time} variant="secondary" className="px-2 py-1 gap-1">
//                           {formatTimeDisplay(time)}
//                           <button
//                             onClick={() => handleRemoveCustomTime(time)}
//                             className="ml-1 hover:text-red-500"
//                           >
//                             <X className="w-3 h-3" />
//                           </button>
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* Time Settings Modal */}
//         <Dialog open={showTimeSettingsModal} onOpenChange={setShowTimeSettingsModal}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>Display Settings</DialogTitle>
//             </DialogHeader>
            
//             <div className="space-y-4 py-4">
//               <div>
//                 <Label>Time Range</Label>
//                 <div className="grid grid-cols-2 gap-2 mt-1">
//                   <Select
//                     value={timeSettings.startHour.toString()}
//                     onValueChange={(value) => setTimeSettings({...timeSettings, startHour: parseInt(value)})}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {[5,6,7,8,9,10,11,12].map(h => (
//                         <SelectItem key={h} value={h.toString()}>{h}:00 {h < 12 ? 'AM' : 'PM'}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <Select
//                     value={timeSettings.endHour.toString()}
//                     onValueChange={(value) => setTimeSettings({...timeSettings, endHour: parseInt(value)})}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {[13,14,15,16,17,18,19,20,21,22,23].map(h => (
//                         <SelectItem key={h} value={h.toString()}>{h-12}:00 PM</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
              
//               <div>
//                 <Label>Time Interval</Label>
//                 <div className="grid grid-cols-3 gap-2 mt-1">
//                   {[30,60,120].map(interval => (
//                     <Button
//                       key={interval}
//                       variant={timeSettings.interval === interval ? 'default' : 'outline'}
//                       size="sm"
//                       onClick={() => setTimeSettings({...timeSettings, interval})}
//                     >
//                       {interval} min
//                     </Button>
//                   ))}
//                 </div>
//               </div>
              
//               <div>
//                 <Label>Display Mode</Label>
//                 <div className="grid grid-cols-2 gap-2 mt-1">
//                   <Button
//                     variant={timeSettings.displayMode === 'vertical' ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
//                   >
//                     <Columns className="w-4 h-4 mr-2" />
//                     Vertical
//                   </Button>
//                   <Button
//                     variant={timeSettings.displayMode === 'horizontal' ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
//                   >
//                     <Rows className="w-4 h-4 mr-2" />
//                     Horizontal
//                   </Button>
//                 </div>
//               </div>
              
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label>Show Weekends</Label>
//                   <Switch
//                     checked={timeSettings.showWeekends}
//                     onCheckedChange={(checked) => setTimeSettings({...timeSettings, showWeekends: checked})}
//                   />
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <Label>Show Sleep Blocks</Label>
//                   <Switch
//                     checked={timeSettings.showSleepBlocks}
//                     onCheckedChange={(checked) => setTimeSettings({...timeSettings, showSleepBlocks: checked})}
//                   />
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <Label>Auto-lock Sleep</Label>
//                   <Switch
//                     checked={timeSettings.autoLockSleep}
//                     onCheckedChange={(checked) => setTimeSettings({...timeSettings, autoLockSleep: checked})}
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <Label>Cell Height</Label>
//                 <Slider
//                   value={[timeSettings.cellHeight]}
//                   min={40}
//                   max={120}
//                   step={10}
//                   onValueChange={(value) => setTimeSettings({...timeSettings, cellHeight: value[0]})}
//                   className="mt-2"
//                 />
//                 <div className="text-xs text-gray-500 mt-1 text-center">
//                   {timeSettings.cellHeight}px
//                 </div>
//               </div>
//             </div>
            
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setShowTimeSettingsModal(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSaveTimeSettings}>
//                 Apply Settings
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Edit Fixed Time Modal */}
//         <Dialog open={showEditFixedTimeModal} onOpenChange={setShowEditFixedTimeModal}>
//           <DialogContent className="sm:max-w-lg">
//             <DialogHeader>
//               <DialogTitle>Edit Fixed Commitment</DialogTitle>
//             </DialogHeader>
            
//             {editingFixedTime && (
//               <div className="space-y-4 py-4">
//                 <Input
//                   placeholder="Title"
//                   value={editingFixedTime.title}
//                   onChange={(e) => setEditingFixedTime({...editingFixedTime, title: e.target.value})}
//                 />

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label>Start Time</Label>
//                     <Input
//                       type="time"
//                       value={editingFixedTime.startTime}
//                       onChange={(e) => setEditingFixedTime({...editingFixedTime, startTime: e.target.value})}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label>End Time</Label>
//                     <Input
//                       type="time"
//                       value={editingFixedTime.endTime}
//                       onChange={(e) => setEditingFixedTime({...editingFixedTime, endTime: e.target.value})}
//                       className="mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label>Days</Label>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {days.map(day => (
//                       <Button
//                         key={day}
//                         variant={editingFixedTime.days.includes(day) ? 'default' : 'outline'}
//                         size="sm"
//                         onClick={() => {
//                           const newDays = editingFixedTime.days.includes(day)
//                             ? editingFixedTime.days.filter(d => d !== day)
//                             : [...editingFixedTime.days, day]
//                           setEditingFixedTime({...editingFixedTime, days: newDays})
//                         }}
//                       >
//                         {day.slice(0, 3)}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <Label>Description</Label>
//                   <Textarea
//                     value={editingFixedTime.description || ''}
//                     onChange={(e) => setEditingFixedTime({...editingFixedTime, description: e.target.value})}
//                     className="mt-1"
//                     rows={2}
//                   />
//                 </div>
//               </div>
//             )}
            
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setShowEditFixedTimeModal(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={() => editingFixedTime && handleSaveFixedTime(editingFixedTime)}>
//                 Save Changes
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Add/Edit Task Modal */}
//         <Dialog open={showAddTaskModal} onOpenChange={(open) => {
//           setShowAddTaskModal(open)
//           if (!open) {
//             setEditingTask(null)
//             resetTaskForm()
//           }
//         }}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
//             </DialogHeader>

//             <div className="space-y-4 py-4">
//               <Input
//                 placeholder="Task title"
//                 value={newTask.title}
//                 onChange={(e) => setNewTask({...newTask, title: e.target.value})}
//               />

//               <div className="grid grid-cols-2 gap-4">
//                 <Input
//                   placeholder="Subject"
//                   value={newTask.subject}
//                   onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
//                 />
//                 <Select
//                   value={newTask.duration.toString()}
//                   onValueChange={(value) => setNewTask({...newTask, duration: parseInt(value)})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Duration" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="30">30 min</SelectItem>
//                     <SelectItem value="60">1 hour</SelectItem>
//                     <SelectItem value="90">1.5 hours</SelectItem>
//                     <SelectItem value="120">2 hours</SelectItem>
//                     <SelectItem value="180">3 hours</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <Select
//                   value={newTask.day}
//                   onValueChange={(value) => setNewTask({...newTask, day: value})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Day" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {days.map(day => (
//                       <SelectItem key={day} value={day}>
//                         {day.charAt(0) + day.slice(1).toLowerCase()}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Input
//                   type="time"
//                   value={newTask.startTime}
//                   onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
//                 />
//               </div>

//               <Select
//                 value={newTask.priority}
//                 onValueChange={(value: any) => setNewTask({...newTask, priority: value})}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Priority" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="LOW">Low</SelectItem>
//                   <SelectItem value="MEDIUM">Medium</SelectItem>
//                   <SelectItem value="HIGH">High</SelectItem>
//                   <SelectItem value="CRITICAL">Critical</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Select
//                 value={newTask.goalId}
//                 onValueChange={(value) => {
//                   setNewTask({
//                     ...newTask,
//                     goalId: value,
//                     milestoneId: ''
//                   })
//                 }}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Link to Goal (Optional)" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="">No Goal</SelectItem>
//                   {goals.map(goal => (
//                     <SelectItem key={goal.id} value={goal.id}>
//                       {goal.title}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {newTask.goalId && (
//                 <Select
//                   value={newTask.milestoneId}
//                   onValueChange={(value) => setNewTask({...newTask, milestoneId: value})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Link to Milestone (Optional)" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="">No Milestone</SelectItem>
//                     {goals
//                       .find(g => g.id === newTask.goalId)
//                       ?.milestones.map(milestone => (
//                         <SelectItem key={milestone.id} value={milestone.id}>
//                           {milestone.title} ({milestone.progress}%)
//                         </SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>
//               )}

//               <Textarea
//                 placeholder="Notes (optional)"
//                 value={newTask.note}
//                 onChange={(e) => setNewTask({...newTask, note: e.target.value})}
//                 rows={2}
//               />
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => {
//                 setShowAddTaskModal(false)
//                 setEditingTask(null)
//                 resetTaskForm()
//               }}>
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={editingTask ? handleUpdateTask : () => {
//                   if (taskCreationContext) {
//                     handleAddTaskToCell('simple')
//                   } else {
//                     toast.error('No cell selected')
//                   }
//                 }} 
//                 disabled={!newTask.title}
//               >
//                 {editingTask ? 'Update Task' : 'Add Task'}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Lock Progress Dialog */}
//         <Dialog open={showLockProgress} onOpenChange={setShowLockProgress}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 {lockSuccess ? (
//                   <>
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                     Saved Successfully
//                   </>
//                 ) : (
//                   'Saving Timetable'
//                 )}
//               </DialogTitle>
//             </DialogHeader>
            
//             <div className="py-4">
//               {lockProgress.map((step, index) => (
//                 <div key={index} className="flex items-center gap-2 mb-2">
//                   {step.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
//                   {step.status === 'in-progress' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
//                   {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
//                   {step.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
//                   <span className="text-sm">{step.step}</span>
//                   {step.message && <span className="text-xs text-gray-500 ml-auto">{step.message}</span>}
//                 </div>
//               ))}
//             </div>
            
//             <DialogFooter>
//               {lockSuccess && (
//                 <Button onClick={() => setShowLockProgress(false)}>
//                   Close
//                 </Button>
//               )}
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Reset Confirmation */}
//         <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <AlertTriangle className="w-5 h-5 text-yellow-500" />
//                 Reset Timetable
//               </DialogTitle>
//               <DialogDescription>
//                 This will delete all your data. This action cannot be undone.
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="py-4">
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 Are you sure you want to reset your timetable? All tasks, fixed commitments, free periods, sleep schedules, and goal progress will be permanently deleted.
//               </p>
//             </div>
            
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
//                 Cancel
//               </Button>
//               <Button variant="destructive" onClick={confirmReset}>
//                 Reset Everything
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </TooltipProvider>
//   )
// }




