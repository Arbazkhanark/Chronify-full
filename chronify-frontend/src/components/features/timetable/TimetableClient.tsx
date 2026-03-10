




// // app/dashboard/timetable/page.tsx
// 'use client'

// import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { 
//   Calendar, 
//   Clock, 
//   CheckCircle, 
//   ChevronRight, 
//   ChevronLeft,
//   Grid,
//   List,
//   Download,
//   Share2,
//   Settings,
//   Bell,
//   Zap,
//   TrendingUp,
//   Target,
//   PieChart,
//   BarChart3,
//   Timer,
//   Play,
//   Pause,
//   SkipForward,
//   RefreshCw,
//   Filter,
//   MoreVertical,
//   Star,
//   Award,
//   Coffee,
//   BookOpen,
//   Brain,
//   Code,
//   GraduationCap,
//   Laptop,
//   Smartphone,
//   Table,
//   Sun,
//   Moon,
//   Dumbbell,
//   Book,
//   Users,
//   Music,
//   Gamepad2,
//   Home,
//   Heart,
//   Car,
//   Utensils,
//   Building,
//   Plus,
//   Maximize2,
//   Minimize2,
//   Grid3x3,
//   List as ListIcon,
//   Eye,
//   EyeOff,
//   Printer,
//   Edit2,
//   Trash2,
//   Copy,
//   CheckSquare,
//   Square,
//   AlertCircle,
//   X,
//   RotateCcw,
//   FastForward,
//   PauseCircle,
//   PlayCircle,
//   StopCircle,
//   History,
//   TrendingDown,
//   Circle,
//   CircleDot,
//   CircleCheck,
//   CircleX,
//   CirclePause,
//   Clock4,
//   Clock8,
//   Clock12,
//   Hourglass,
//   CheckCheck,
//   Bed,
//   AlarmClock,
//   CalendarClock,
//   CalendarDays,
//   CalendarCheck,
//   CalendarOff,
//   CalendarX,
//   CalendarPlus,
//   CalendarMinus,
//   CalendarRange,
//   ChevronUp,
//   ChevronDown,
//   Move,
//   GripVertical,
//   Tag,
//   Repeat,
//   BellRing,
//   Clock1,
//   Clock2,
//   Clock3,
//   Clock5,
//   Clock6,
//   Clock7,
//   Clock9,
//   Clock10,
//   Clock11,
//   Archive,
//   FileText,
//   Folder,
//   FolderOpen,
//   BarChart,
//   LineChart,
//   Activity,
//   Target as TargetIcon,
//   MoonStar,
//   Sparkles,
//   Rocket,
//   Trophy,
//   Crown,
//   Coffee as CoffeeIcon,
//   Heart as HeartIcon,
//   Lightbulb,
//   Target as TargetIcon2,
//   Zap as ZapIcon,
//   Sunrise,
//   Sunset,
//   Cloud,
//   CloudRain,
//   CloudSnow,
//   Wind,
//   Thermometer,
//   Droplets,
//   Umbrella,
//   CloudSun,
//   CloudMoon,
//   Star as StarIcon,
//   Moon as MoonIcon,
//   Sun as SunIcon,
//   ThumbsUp,
//   ThumbsDown,
//   Meh,
//   Frown,
//   Smile,
//   LucideIcon,
//   Loader2,
//   School,
//   Gym,
//   Pizza,
//   PersonStanding,
//   AlarmClockCheck,
//   CalendarCheck2,
//   ClockAlert,
//   ClockFading,
//   // Clock,
//   TimerReset,
//   TimerOff,
//   // Timer,
//   Waves,
//   Wind as WindIcon,
//   Snowflake,
//   CloudFog,
//   CloudLightning,
//   CloudDrizzle,
//   CloudHail,
//   Cloudy,
//   CloudSun as CloudSunIcon,
//   CloudMoon as CloudMoonIcon,
//   Eclipse,
//   SunDim,
//   SunMedium,
//   SunSnow,
//   Sunrise as SunriseIcon,
//   Sunset as SunsetIcon,
//   MoonStar as MoonStarIcon
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Badge } from '@/components/ui/badge'
// import { Progress } from '@/components/ui/progress'
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuLabel,
//   DropdownMenuGroup,
// } from '@/components/ui/dropdown-menu'
// import { Switch } from '@/components/ui/switch'
// import { Label } from '@/components/ui/label'
// import { Separator } from '@/components/ui/separator'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { 
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'
// import { Slider } from '@/components/ui/slider'

// // API Response Types
// interface TimeSlotAPI {
//   startTime: string
//   endTime: string
//   type: 'FIXED' | 'FREE' | 'OTHER'
//   title: string
//   description?: string
//   fixedTimeId?: string
//   freePeriodId?: string
// }

// interface DayScheduleAPI {
//   day: string
//   slots: TimeSlotAPI[]
// }

// interface ApiResponse {
//   success: boolean
//   data: DayScheduleAPI[]
// }

// // Local TimeSlot type (enhanced for UI)
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
//   type: 'task' | 'fixed' | 'break' | 'commute' | 'free' | 'class' | 'study' | 'health' | 'project' | 'meeting' | 'workout' | 'meal' | 'entertainment' | 'sleep' | 'other'
//   category: 'academic' | 'professional' | 'health' | 'personal' | 'learning' | 'break' | 'commute' | 'project' | 'sleep' | 'other'
//   icon?: string
//   status: 'pending' | 'in-progress' | 'completed' | 'missed' | 'skipped' | 'delayed' | 'rescheduled'
//   notes?: string
//   completedAt?: Date
//   startedAt?: Date
//   estimatedEnd?: Date
//   actualDuration?: number
//   recurring?: boolean
//   recurringPattern?: 'daily' | 'weekly' | 'monthly'
//   tags?: string[]
//   originalStartTime?: string
//   originalEndTime?: string
//   maxDelayAllowed?: number
//   bedtime?: string
//   date?: Date
//   location?: string
//   attachments?: string[]
//   focusScore?: number
//   completedBeforeBedtime?: boolean
//   gracePeriodEndsAt?: Date
//   fixedTimeId?: string
//   freePeriodId?: string
//   description?: string
//   apiType?: 'FIXED' | 'FREE' | 'OTHER'
// }

// type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'missed' | 'skipped' | 'delayed' | 'rescheduled'

// interface LiveTimeData {
//   currentTime: Date
//   activeTasks: TimeSlot[]
//   upcomingTasks: TimeSlot[]
//   completedTasks: TimeSlot[]
//   currentProgress: number
// }

// interface SmartDelayOptions {
//   taskId: string
//   preferredDelay: number
//   availableSlots: Array<{
//     startTime: string
//     endTime: string
//     day: string
//     duration: number
//     type: 'immediate' | 'free-period' | 'evening' | 'next-day'
//   }>
//   bedtime: string
//   canExtend: boolean
//   maxExtension: number
//   suggestion: string
// }

// interface CalendarDay {
//   date: Date
//   isToday: boolean
//   isCurrentMonth: boolean
//   isWeekend: boolean
//   tasks: TimeSlot[]
// }

// interface MotivationalMessage {
//   id: string
//   message: string
//   category: 'late_night' | 'missed_task' | 'productivity' | 'success' | 'encouragement' | 'focus'
//   icon: LucideIcon
//   color: string
//   emoji: string
// }

// interface TaskFeedback {
//   taskId: string
//   focusLevel: number
//   completedWell: boolean
//   notes: string
//   timestamp: Date
// }

// // Color mapping for different slot types
// const slotTypeColors: Record<string, string> = {
//   FIXED: '#8B5CF6', // Purple for fixed schedules (college, gym, etc.)
//   FREE: '#10B981',  // Green for free periods
//   OTHER: '#9CA3AF', // Gray for unscheduled time
  
//   // Activity specific colors
//   college: '#6366F1', // Indigo
//   gym: '#EC4899',     // Pink
//   study: '#EF4444',   // Red
//   meal: '#F59E0B',    // Orange
//   meeting: '#8B5CF6', // Purple
//   project: '#3B82F6', // Blue
//   health: '#10B981',  // Green
//   sleep: '#6B7280',   // Gray
//   break: '#F59E0B',   // Orange
//   entertainment: '#EC4899', // Pink
//   task: '#3B82F6'     // Blue
// }

// // Icon mapping for different slot types and titles
// const getIconForSlot = (type: string, title: string): string => {
//   const titleLower = title.toLowerCase()
  
//   // Check title first for specific activities
//   if (titleLower.includes('college') || titleLower.includes('lecture') || titleLower.includes('class')) {
//     return 'GraduationCap'
//   }
//   if (titleLower.includes('gym') || titleLower.includes('workout') || titleLower.includes('exercise')) {
//     return 'Dumbbell'
//   }
//   if (titleLower.includes('lunch') || titleLower.includes('dinner') || titleLower.includes('breakfast') || titleLower.includes('meal')) {
//     return 'Utensils'
//   }
//   if (titleLower.includes('sleep') || titleLower.includes('bed')) {
//     return 'Bed'
//   }
//   if (titleLower.includes('study') || titleLower.includes('learning')) {
//     return 'Brain'
//   }
//   if (titleLower.includes('meeting')) {
//     return 'Users'
//   }
//   if (titleLower.includes('project')) {
//     return 'Code'
//   }
//   if (titleLower.includes('free') || titleLower.includes('break')) {
//     return 'Coffee'
//   }
  
//   // Fallback to type-based icons
//   switch(type) {
//     case 'FIXED':
//       return 'CalendarCheck'
//     case 'FREE':
//       return 'Coffee'
//     case 'OTHER':
//       return 'Clock'
//     default:
//       return 'Clock'
//   }
// }

// // Get activity type from title
// const getActivityType = (title: string): string => {
//   const titleLower = title.toLowerCase()
  
//   if (titleLower.includes('college') || titleLower.includes('lecture') || titleLower.includes('class')) {
//     return 'class'
//   }
//   if (titleLower.includes('gym') || titleLower.includes('workout') || titleLower.includes('exercise')) {
//     return 'workout'
//   }
//   if (titleLower.includes('lunch') || titleLower.includes('dinner') || titleLower.includes('breakfast') || titleLower.includes('meal')) {
//     return 'meal'
//   }
//   if (titleLower.includes('sleep') || titleLower.includes('bed')) {
//     return 'sleep'
//   }
//   if (titleLower.includes('study') || titleLower.includes('learning')) {
//     return 'study'
//   }
//   if (titleLower.includes('meeting')) {
//     return 'meeting'
//   }
//   if (titleLower.includes('project')) {
//     return 'project'
//   }
//   if (titleLower.includes('free') || titleLower.includes('break')) {
//     return 'break'
//   }
//   return 'task'
// }

// // Get category from title and type
// const getCategory = (title: string, type: string): 'academic' | 'professional' | 'health' | 'personal' | 'learning' | 'break' | 'commute' | 'project' | 'sleep' | 'other' => {
//   const titleLower = title.toLowerCase()
  
//   if (type === 'FREE') return 'break'
//   if (type === 'OTHER') return 'other'
  
//   if (titleLower.includes('college') || titleLower.includes('lecture') || titleLower.includes('class')) {
//     return 'academic'
//   }
//   if (titleLower.includes('gym') || titleLower.includes('workout')) {
//     return 'health'
//   }
//   if (titleLower.includes('study') || titleLower.includes('learning')) {
//     return 'learning'
//   }
//   if (titleLower.includes('sleep')) {
//     return 'sleep'
//   }
//   if (titleLower.includes('project')) {
//     return 'project'
//   }
//   if (titleLower.includes('break') || titleLower.includes('lunch') || titleLower.includes('dinner')) {
//     return 'break'
//   }
  
//   return 'other'
// }

// // Motivational messages for different scenarios
// const motivationalMessages: MotivationalMessage[] = [
//   {
//     id: 'msg-1',
//     message: "Completing tasks before sleep brings peace of mind and better rest! 🌙",
//     category: 'late_night',
//     icon: MoonStar,
//     color: '#8B5CF6',
//     emoji: '😴'
//   },
//   {
//     id: 'msg-2',
//     message: "Every task completed is a step closer to your dreams. Keep pushing! 💫",
//     category: 'missed_task',
//     icon: Rocket,
//     color: '#EC4899',
//     emoji: '🚀'
//   },
//   {
//     id: 'msg-3',
//     message: "Sleep can wait, but your dreams can't! You're building your future. 👑",
//     category: 'late_night',
//     icon: Crown,
//     color: '#F59E0B',
//     emoji: '👑'
//   },
//   {
//     id: 'msg-4',
//     message: "Great focus! Quality matters more than quantity. 🎯",
//     category: 'focus',
//     icon: TargetIcon2,
//     color: '#3B82F6',
//     emoji: '✅'
//   },
//   {
//     id: 'msg-5',
//     message: "The best time to complete a missed task is now. Future you will thank present you! 🙏",
//     category: 'missed_task',
//     icon: HeartIcon,
//     color: '#EF4444',
//     emoji: '❤️'
//   },
//   {
//     id: 'msg-6',
//     message: "Small progress is still progress. Every task completed matters! 🌟",
//     category: 'encouragement',
//     icon: StarIcon,
//     color: '#F59E0B',
//     emoji: '✨'
//   },
//   {
//     id: 'msg-7',
//     message: "Your dedication now will become your success story tomorrow! 📚",
//     category: 'success',
//     icon: Trophy,
//     color: '#10B981',
//     emoji: '🏆'
//   },
//   {
//     id: 'msg-8',
//     message: "The night is young for dreamers and achievers! Keep going! 🌃",
//     category: 'late_night',
//     icon: MoonIcon,
//     color: '#6366F1',
//     emoji: '🌌'
//   },
//   {
//     id: 'msg-9',
//     message: "Missed tasks are opportunities for comeback stories! 📈",
//     category: 'missed_task',
//     icon: TrendingUp,
//     color: '#8B5CF6',
//     emoji: '📊'
//   },
//   {
//     id: 'msg-10',
//     message: "Sleep well knowing you've done your best today! 😊",
//     category: 'late_night',
//     icon: Bed,
//     color: '#6B7280',
//     emoji: '🛌'
//   },
//   {
//     id: 'msg-11',
//     message: "Your consistency today builds your excellence tomorrow! 💪",
//     category: 'productivity',
//     icon: Dumbbell,
//     color: '#EC4899',
//     emoji: '🏋️'
//   },
//   {
//     id: 'msg-12',
//     message: "Every completed task is a victory against procrastination! 🎯",
//     category: 'encouragement',
//     icon: TargetIcon2,
//     color: '#EF4444',
//     emoji: '✅'
//   }
// ]

// // Get icon component
// const getIconComponent = (iconName: string): LucideIcon => {
//   const icons: Record<string, LucideIcon> = {
//     Sun: SunIcon,
//     Headphones: Music,
//     GraduationCap: GraduationCap,
//     Utensils: Utensils,
//     Dumbbell: Dumbbell,
//     Code: Code,
//     Users: Users,
//     Book: Book,
//     Home: Home,
//     Heart: HeartIcon,
//     Car: Car,
//     Building: Building,
//     Gamepad2: Gamepad2,
//     Clock: Clock,
//     Coffee: CoffeeIcon,
//     Laptop: Laptop,
//     Brain: Brain,
//     Target: TargetIcon2,
//     Zap: ZapIcon,
//     CheckCircle: CheckCircle,
//     ClipboardCheck: CheckSquare,
//     PlayCircle: PlayCircle,
//     StopCircle: StopCircle,
//     SkipForward: SkipForward,
//     CircleX: CircleX,
//     CircleDot: CircleDot,
//     Circle: Circle,
//     Bed: Bed,
//     AlarmClock: AlarmClock,
//     CalendarCheck: CalendarCheck,
//     CalendarClock: CalendarClock,
//     Calendar: Calendar,
//     CalendarDays: CalendarDays,
//     CalendarRange: CalendarRange,
//     CalendarPlus: CalendarPlus,
//     BellRing: BellRing,
//     Activity: Activity,
//     LineChart: LineChart,
//     BarChart: BarChart,
//     TargetIcon: TargetIcon2,
//     Folder: Folder,
//     FileText: FileText,
//     Archive: Archive,
//     Repeat: Repeat,
//     Tag: Tag,
//     Move: Move,
//     Rocket: Rocket,
//     Trophy: Trophy,
//     Crown: Crown,
//     Lightbulb: Lightbulb,
//     MoonStar: MoonStar,
//     Sparkles: Sparkles,
//     Star: StarIcon,
//     Moon: MoonIcon,
//     ThumbsUp: ThumbsUp,
//     ThumbsDown: ThumbsDown,
//     Meh: Meh,
//     Frown: Frown,
//     Smile: Smile,
//     CheckSquare: CheckSquare,
//     Brain: Brain,
//     Heart: HeartIcon,
//     Coffee: CoffeeIcon,
//     Car: Car,
//     Gamepad2: Gamepad2,
//     GraduationCap: GraduationCap,
//     School: School,
//     Gym: Dumbbell,
//     Pizza: Utensils,
//     PersonStanding: PersonStanding,
//     AlarmClockCheck: AlarmClockCheck,
//     CalendarCheck2: CalendarCheck2,
//     ClockAlert: ClockAlert,
//     ClockFading: ClockFading,
//     Clock: Clock,
//     TimerReset: TimerReset,
//     TimerOff: TimerOff,
//     Timer: Timer,
//     Waves: Waves,
//     WindIcon: WindIcon,
//     Snowflake: Snowflake,
//     CloudFog: CloudFog,
//     CloudLightning: CloudLightning,
//     CloudDrizzle: CloudDrizzle,
//     CloudHail: CloudHail,
//     Cloudy: Cloudy,
//     CloudSunIcon: CloudSunIcon,
//     CloudMoonIcon: CloudMoonIcon,
//     Eclipse: Eclipse,
//     SunDim: SunDim,
//     SunMedium: SunMedium,
//     SunSnow: SunSnow,
//     SunriseIcon: SunriseIcon,
//     SunsetIcon: SunsetIcon,
//     MoonStarIcon: MoonStarIcon
//   }
//   return icons[iconName] || Clock
// }

// // Helper: Convert time to minutes
// const convertTimeToMinutes = (time: string): number => {
//   const [hours, minutes] = time.split(':').map(Number)
//   return hours * 60 + minutes
// }

// // Helper: Convert minutes to time string
// const convertMinutesToTime = (minutes: number): string => {
//   const hours = Math.floor(minutes / 60)
//   const mins = minutes % 60
//   return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
// }

// // Helper: Format time for display
// const formatTimeDisplay = (time: string): string => {
//   const [hours, minutes] = time.split(':').map(Number)
//   const period = hours >= 12 ? 'PM' : 'AM'
//   const displayHours = hours % 12 || 12
//   return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
// }

// // Helper: Get current day
// const getCurrentDay = (): string => {
//   const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
//   return days[new Date().getDay()]
// }

// // Helper: Get current day full name
// const getCurrentDayFull = (): string => {
//   const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
//   return days[new Date().getDay()]
// }

// // Helper: Get empty live data
// const getEmptyLiveData = (): LiveTimeData => ({
//   currentTime: new Date(),
//   activeTasks: [],
//   upcomingTasks: [],
//   completedTasks: [],
//   currentProgress: 0
// })

// // Helper: Check if task is in grace period (1 hour after end time)
// const isInGracePeriod = (task: TimeSlot): boolean => {
//   const now = new Date()
//   const [endHour, endMinute] = task.endTime.split(':').map(Number)
//   const taskEnd = new Date(now)
//   taskEnd.setHours(endHour, endMinute, 0, 0)
  
//   const gracePeriodEnd = new Date(taskEnd)
//   gracePeriodEnd.setHours(gracePeriodEnd.getHours() + 1)
  
//   return now > taskEnd && now <= gracePeriodEnd && task.status === 'pending'
// }

// // Helper: Check if task is overdue beyond grace period
// const isOverdueBeyondGrace = (task: TimeSlot): boolean => {
//   const now = new Date()
//   const [endHour, endMinute] = task.endTime.split(':').map(Number)
//   const taskEnd = new Date(now)
//   taskEnd.setHours(endHour, endMinute, 0, 0)
  
//   const gracePeriodEnd = new Date(taskEnd)
//   gracePeriodEnd.setHours(gracePeriodEnd.getHours() + 1)
  
//   return now > gracePeriodEnd && task.status === 'pending'
// }

// // Helper: Find next available free slot
// const findFreeSlots = (
//   tasks: Record<string, TimeSlot[]>, 
//   currentTask: TimeSlot, 
//   preferredDelay: number,
//   bedtime: string
// ): SmartDelayOptions => {
//   const currentDayTasks = tasks[currentTask.day] || []
//   const currentTimeMinutes = convertTimeToMinutes(currentTask.endTime)
//   const bedtimeMinutes = convertTimeToMinutes(bedtime)
//   const taskDuration = currentTask.duration
  
//   const availableSlots: Array<{
//     startTime: string
//     endTime: string
//     day: string
//     duration: number
//     type: 'immediate' | 'free-period' | 'evening' | 'next-day'
//   }> = []
  
//   // Sort tasks by start time
//   const sortedTasks = [...currentDayTasks]
//     .filter(t => t.type !== 'sleep')
//     .sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))
  
//   // Find gaps between tasks on the same day
//   for (let i = 0; i < sortedTasks.length - 1; i++) {
//     const currentTaskEnd = convertTimeToMinutes(sortedTasks[i].endTime)
//     const nextTaskStart = convertTimeToMinutes(sortedTasks[i + 1].startTime)
    
//     if (currentTaskEnd >= currentTimeMinutes && nextTaskStart - currentTaskEnd >= taskDuration) {
//       const slotType = currentTaskEnd === currentTimeMinutes ? 'immediate' : 'free-period'
//       availableSlots.push({
//         startTime: convertMinutesToTime(currentTaskEnd),
//         endTime: convertMinutesToTime(currentTaskEnd + taskDuration),
//         day: currentTask.day,
//         duration: taskDuration,
//         type: slotType
//       })
//     }
//   }
  
//   // Check if can extend before bedtime
//   const lastTask = sortedTasks[sortedTasks.length - 1]
//   const lastTaskEnd = lastTask ? convertTimeToMinutes(lastTask.endTime) : currentTimeMinutes
  
//   if (bedtimeMinutes - lastTaskEnd >= taskDuration) {
//     availableSlots.push({
//       startTime: convertMinutesToTime(lastTaskEnd),
//       endTime: convertMinutesToTime(lastTaskEnd + taskDuration),
//       day: currentTask.day,
//       duration: taskDuration,
//       type: 'evening'
//     })
//   }
  
//   // Check next day morning (first available slot)
//   const nextDay = getNextDay(currentTask.day)
//   const nextDayTasks = tasks[nextDay] || []
//   const nextDayMorningStart = convertTimeToMinutes('06:00')
  
//   if (nextDayTasks.length > 0) {
//     const firstTaskStart = convertTimeToMinutes(nextDayTasks[0].startTime)
//     if (firstTaskStart - nextDayMorningStart >= taskDuration) {
//       availableSlots.push({
//         startTime: '06:00',
//         endTime: convertMinutesToTime(nextDayMorningStart + taskDuration),
//         day: nextDay,
//         duration: taskDuration,
//         type: 'next-day'
//       })
//     }
//   }
  
//   // Calculate max extension before bedtime
//   const canExtend = bedtimeMinutes - currentTimeMinutes >= taskDuration
//   const maxExtension = canExtend ? bedtimeMinutes - currentTimeMinutes - taskDuration : 0
  
//   let suggestion = ''
//   if (availableSlots.length > 0) {
//     const immediateSlot = availableSlots.find(s => s.type === 'immediate')
//     if (immediateSlot) {
//       suggestion = `Move to immediate free slot at ${formatTimeDisplay(immediateSlot.startTime)}`
//     } else {
//       const bestSlot = availableSlots[0]
//       suggestion = `Reschedule to ${formatTimeDisplay(bestSlot.startTime)} on ${bestSlot.day}`
//     }
//   } else if (canExtend) {
//     suggestion = `Extend current slot by ${maxExtension} minutes (complete before ${bedtime})`
//   } else {
//     suggestion = 'No available slots today. Consider reducing task duration or rescheduling for tomorrow.'
//   }
  
//   return {
//     taskId: currentTask.id,
//     preferredDelay,
//     availableSlots,
//     bedtime,
//     canExtend,
//     maxExtension,
//     suggestion
//   }
// }

// // Helper: Get next day
// const getNextDay = (currentDay: string): string => {
//   const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//   const currentIndex = days.indexOf(currentDay)
//   return days[(currentIndex + 1) % days.length]
// }

// // Helper: Check if time slot is available
// const isTimeSlotAvailable = (
//   tasks: Record<string, TimeSlot[]>,
//   day: string,
//   startTime: string,
//   endTime: string,
//   excludeTaskId?: string
// ): boolean => {
//   const dayTasks = tasks[day] || []
//   const startMinutes = convertTimeToMinutes(startTime)
//   const endMinutes = convertTimeToMinutes(endTime)
  
//   for (const task of dayTasks) {
//     if (task.id === excludeTaskId) continue
//     if (task.type === 'sleep') continue // Sleep is fixed
    
//     const taskStart = convertTimeToMinutes(task.startTime)
//     const taskEnd = convertTimeToMinutes(task.endTime)
    
//     // Check for overlap
//     if (startMinutes < taskEnd && endMinutes > taskStart) {
//       return false
//     }
//   }
  
//   return true
// }

// // Helper: Get days in month
// const getDaysInMonth = (year: number, month: number): number => {
//   return new Date(year, month + 1, 0).getDate()
// }

// // Helper: Generate calendar days
// const generateCalendarDays = (year: number, month: number, tasks: Record<string, TimeSlot[]>): CalendarDay[] => {
//   const days: CalendarDay[] = []
//   const firstDay = new Date(year, month, 1)
//   const lastDay = new Date(year, month + 1, 0)
//   const today = new Date()
  
//   // Get starting day (0 = Sunday, 1 = Monday, etc.)
//   const startDay = firstDay.getDay()
  
//   // Add days from previous month
//   const prevMonthLastDay = new Date(year, month, 0).getDate()
//   for (let i = startDay - 1; i >= 0; i--) {
//     const date = new Date(year, month - 1, prevMonthLastDay - i)
//     days.push({
//       date,
//       isToday: false,
//       isCurrentMonth: false,
//       isWeekend: date.getDay() === 0 || date.getDay() === 6,
//       tasks: []
//     })
//   }
  
//   // Add days from current month
//   const daysInMonth = getDaysInMonth(year, month)
//   const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
//   for (let day = 1; day <= daysInMonth; day++) {
//     const date = new Date(year, month, day)
//     const dayName = dayNames[date.getDay()]
//     const dayTasks = tasks[dayName] || []
    
//     // Filter tasks for this specific date
//     const dateTasks = dayTasks.filter(task => {
//       if (!task.date) return false
//       const taskDate = new Date(task.date)
//       return taskDate.getDate() === day && 
//              taskDate.getMonth() === month && 
//              taskDate.getFullYear() === year
//     })
    
//     days.push({
//       date,
//       isToday: date.getDate() === today.getDate() && 
//                date.getMonth() === today.getMonth() && 
//                date.getFullYear() === today.getFullYear(),
//       isCurrentMonth: true,
//       isWeekend: date.getDay() === 0 || date.getDay() === 6,
//       tasks: dateTasks
//     })
//   }
  
//   // Add days from next month to complete the grid (42 days total for 6 weeks)
//   const totalCells = 42 // 6 weeks * 7 days
//   const nextMonthStartDay = new Date(year, month + 1, 1)
//   for (let i = days.length; i < totalCells; i++) {
//     const date = new Date(nextMonthStartDay)
//     date.setDate(date.getDate() + (i - days.length))
//     days.push({
//       date,
//       isToday: false,
//       isCurrentMonth: false,
//       isWeekend: date.getDay() === 0 || date.getDay() === 6,
//       tasks: []
//     })
//   }
  
//   return days
// }

// // Helper: Format date
// const formatDate = (date: Date): string => {
//   return date.toLocaleDateString('en-US', { 
//     weekday: 'short', 
//     month: 'short', 
//     day: 'numeric',
//     year: 'numeric'
//   })
// }

// // Helper: Get month name
// const getMonthName = (month: number): string => {
//   return new Date(2000, month, 1).toLocaleDateString('en-US', { month: 'long' })
// }

// // Helper: Get motivational message based on time and context
// const getMotivationalMessage = (currentHour: number, isLateNight: boolean, context?: string): MotivationalMessage => {
//   const now = new Date()
//   const hour = now.getHours()
  
//   if (context === 'focus') {
//     const focusMessages = motivationalMessages.filter(msg => msg.category === 'focus')
//     return focusMessages[Math.floor(Math.random() * focusMessages.length)]
//   }
  
//   if (isLateNight && hour >= 22) {
//     // Late night messages (after 10 PM)
//     const lateNightMessages = motivationalMessages.filter(msg => msg.category === 'late_night')
//     return lateNightMessages[Math.floor(Math.random() * lateNightMessages.length)]
//   } else if (hour >= 20) {
//     // Evening messages (after 8 PM)
//     const eveningMessages = motivationalMessages.filter(msg => 
//       msg.category === 'late_night' || msg.category === 'encouragement'
//     )
//     return eveningMessages[Math.floor(Math.random() * eveningMessages.length)]
//   } else {
//     // General messages
//     return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
//   }
// }

// // Check if a slot is "Unscheduled Time" (OTHER type)
// const isUnscheduledTime = (slot: TimeSlot): boolean => {
//   return slot.apiType === 'OTHER' || slot.title === 'Unscheduled Time'
// }

// // Check if a slot is a real activity (FIXED or FREE)
// const isRealActivity = (slot: TimeSlot): boolean => {
//   return slot.apiType === 'FIXED' || slot.apiType === 'FREE'
// }

// // Transform API data to local TimeSlot format
// const transformApiDataToTimeSlots = (apiData: DayScheduleAPI[]): Record<string, TimeSlot[]> => {
//   const dayMapping: Record<string, string> = {
//     'MONDAY': 'Mon',
//     'TUESDAY': 'Tue',
//     'WEDNESDAY': 'Wed',
//     'THURSDAY': 'Thu',
//     'FRIDAY': 'Fri',
//     'SATURDAY': 'Sat',
//     'SUNDAY': 'Sun'
//   }

//   const transformed: Record<string, TimeSlot[]> = {}
  
//   apiData.forEach(daySchedule => {
//     const shortDay = dayMapping[daySchedule.day]
//     if (!shortDay) return
    
//     transformed[shortDay] = daySchedule.slots
//       .map((slot, index) => {
//         const slotType = getActivityType(slot.title)
//         const duration = convertTimeToMinutes(slot.endTime) - convertTimeToMinutes(slot.startTime)
//         const iconName = getIconForSlot(slot.type, slot.title)
//         const category = getCategory(slot.title, slot.type)
        
//         // Determine color based on activity type
//         let color = slotTypeColors[slot.type] || slotTypeColors.other
//         if (slotType === 'class') color = slotTypeColors.college
//         else if (slotType === 'workout') color = slotTypeColors.gym
//         else if (slotType === 'meal') color = slotTypeColors.meal
//         else if (slotType === 'study') color = slotTypeColors.study
//         else if (slotType === 'meeting') color = slotTypeColors.meeting
//         else if (slotType === 'project') color = slotTypeColors.project
//         else if (slotType === 'sleep') color = slotTypeColors.sleep
        
//         // Determine priority based on type
//         let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM'
//         if (slot.type === 'FIXED') priority = 'HIGH'
//         else if (slot.type === 'FREE') priority = 'LOW'
        
//         return {
//           id: `${shortDay}-${index}-${slot.startTime}`,
//           title: slot.title,
//           subject: slot.type === 'FIXED' ? 'Fixed Schedule' : 
//                    slot.type === 'FREE' ? 'Free Period' : 'Unscheduled',
//           startTime: slot.startTime,
//           endTime: slot.endTime,
//           duration: duration,
//           priority: priority,
//           color: color,
//           day: shortDay,
//           type: slotType as any,
//           category: category,
//           icon: iconName,
//           status: 'pending',
//           notes: slot.description || '',
//           fixedTimeId: slot.fixedTimeId,
//           freePeriodId: slot.freePeriodId,
//           description: slot.description,
//           apiType: slot.type,
//           bedtime: '23:00', // Default bedtime
//           date: new Date() // Will be updated based on actual date
//         }
//       })
//       .filter(slot => slot.apiType !== 'OTHER' || slot.title !== 'Unscheduled Time') // Filter out Unscheduled Time completely
    
//     // Sort slots by start time
//     transformed[shortDay].sort((a, b) => 
//       convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime)
//     )
//   })
  
//   return transformed
// }

// // Get current activity based on time
// const getCurrentActivity = (tasks: TimeSlot[], currentTime: Date): TimeSlot | null => {
//   const now = currentTime
//   const currentHour = now.getHours()
//   const currentMinute = now.getMinutes()
//   const currentTimeMinutes = currentHour * 60 + currentMinute
  
//   for (const task of tasks) {
//     const startMinutes = convertTimeToMinutes(task.startTime)
//     const endMinutes = convertTimeToMinutes(task.endTime)
    
//     if (currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes) {
//       return task
//     }
//   }
  
//   return null
// }

// // Get activity message for current time
// const getCurrentActivityMessage = (task: TimeSlot | null): { message: string; icon: LucideIcon; color: string } => {
//   if (!task) {
//     return {
//       message: 'No ongoing activity',
//       icon: Clock,
//       color: '#6B7280'
//     }
//   }
  
//   const titleLower = task.title.toLowerCase()
  
//   if (titleLower.includes('sleep') || titleLower.includes('bed')) {
//     return {
//       message: 'Sleeping... 😴',
//       icon: Bed,
//       color: '#6B7280'
//     }
//   }
  
//   if (titleLower.includes('college') || titleLower.includes('lecture') || titleLower.includes('class')) {
//     return {
//       message: `In ${task.title} 📚`,
//       icon: GraduationCap,
//       color: '#6366F1'
//     }
//   }
  
//   if (titleLower.includes('gym') || titleLower.includes('workout')) {
//     return {
//       message: `Working out at ${task.title} 💪`,
//       icon: Dumbbell,
//       color: '#EC4899'
//     }
//   }
  
//   if (titleLower.includes('lunch') || titleLower.includes('dinner') || titleLower.includes('breakfast')) {
//     return {
//       message: `Having ${task.title} 🍽️`,
//       icon: Utensils,
//       color: '#F59E0B'
//     }
//   }
  
//   if (titleLower.includes('study') || titleLower.includes('learning')) {
//     return {
//       message: `Studying - ${task.title} 📖`,
//       icon: Brain,
//       color: '#EF4444'
//     }
//   }
  
//   if (titleLower.includes('meeting')) {
//     return {
//       message: `In meeting - ${task.title} 👥`,
//       icon: Users,
//       color: '#8B5CF6'
//     }
//   }
  
//   if (titleLower.includes('free') || titleLower.includes('break')) {
//     return {
//       message: `On break - ${task.title} ☕`,
//       icon: Coffee,
//       color: '#10B981'
//     }
//   }
  
//   return {
//     message: task.title,
//     icon: getIconComponent(task.icon || 'Clock'),
//     color: task.color
//   }
// }

// // Default empty timetable
// const getEmptyTimetableData = (): Record<string, TimeSlot[]> => {
//   return {
//     Mon: [],
//     Tue: [],
//     Wed: [],
//     Thu: [],
//     Fri: [],
//     Sat: [],
//     Sun: []
//   }
// }

// export default function TimetableClient() {
//   // State
//   const [view, setView] = useState<'grid' | 'list' | 'calendar'>('grid')
//   const [currentDay, setCurrentDay] = useState<string>(getCurrentDay())
//   const [currentDayFull, setCurrentDayFull] = useState<string>(getCurrentDayFull())
//   const [timerRunning, setTimerRunning] = useState<boolean>(false)
//   const [darkMode, setDarkMode] = useState<boolean>(false)
//   const [showWeekends, setShowWeekends] = useState<boolean>(true)
//   const [compactMode, setCompactMode] = useState<boolean>(false)
//   const [timeRange, setTimeRange] = useState<[number, number]>([0, 24]) // Show full day by default
//   const [selectedTask, setSelectedTask] = useState<TimeSlot | null>(null)
//   const [showTaskModal, setShowTaskModal] = useState<boolean>(false)
//   const [showDelayModal, setShowDelayModal] = useState<boolean>(false)
//   const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false)
//   const [taskToDelay, setTaskToDelay] = useState<TimeSlot | null>(null)
//   const [taskForFeedback, setTaskForFeedback] = useState<TimeSlot | null>(null)
//   const [smartDelayOptions, setSmartDelayOptions] = useState<SmartDelayOptions | null>(null)
//   const [currentTime, setCurrentTime] = useState<Date>(new Date())
//   const [tasks, setTasks] = useState<Record<string, TimeSlot[]>>(getEmptyTimetableData())
//   const [liveData, setLiveData] = useState<LiveTimeData>(getEmptyLiveData())
//   const [autoRefresh, setAutoRefresh] = useState<boolean>(true)
//   const [playSound, setPlaySound] = useState<boolean>(true)
//   const [showNotifications, setShowNotifications] = useState<boolean>(true)
//   const [bedtime, setBedtime] = useState<string>('23:00')
//   const [showMotivationalMessage, setShowMotivationalMessage] = useState<boolean>(false)
//   const [currentMotivationalMessage, setCurrentMotivationalMessage] = useState<MotivationalMessage | null>(null)
  
//   // API States
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
  
//   // Feedback state
//   const [feedbackFocus, setFeedbackFocus] = useState<number>(5)
//   const [feedbackNotes, setFeedbackNotes] = useState<string>('')
//   const [feedbackCompletedWell, setFeedbackCompletedWell] = useState<boolean>(true)
  
//   // Calendar state
//   const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth())
//   const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
//   const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
//   const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month')
//   const [draggedTask, setDraggedTask] = useState<TimeSlot | null>(null)

//   // Refs to prevent infinite loops
//   const tasksRef = useRef(tasks)
//   const bedtimeRef = useRef(bedtime)

//   // Update refs when state changes
//   useEffect(() => {
//     tasksRef.current = tasks
//   }, [tasks])

//   useEffect(() => {
//     bedtimeRef.current = bedtime
//   }, [bedtime])

//   // Fetch timetable data from API
//   useEffect(() => {
//     const fetchTimetable = async () => {
//       setLoading(true)
//       setError(null)
      
//       try {
//         // Get token from localStorage
//         const token = localStorage.getItem('access_token')
        
//         if (!token) {
//           throw new Error('No access token found. Please login again.')
//         }
        
//         const response = await fetch('http://localhost:8181/v0/api/time-table/full', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         })
        
//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error('Session expired. Please login again.')
//           }
//           throw new Error(`Failed to fetch timetable: ${response.status}`)
//         }
        
//         const data: ApiResponse = await response.json()
        
//         if (data.success && data.data) {
//           const transformedData = transformApiDataToTimeSlots(data.data)
//           setTasks(transformedData)
//           toast.success('Timetable loaded successfully!')
//         } else {
//           throw new Error('Invalid response format')
//         }
//       } catch (err) {
//         console.error('Error fetching timetable:', err)
//         setError(err instanceof Error ? err.message : 'Failed to load timetable')
//         toast.error('Failed to load timetable', {
//           description: err instanceof Error ? err.message : 'Please try again later'
//         })
//         // Set empty data as fallback
//         setTasks(getEmptyTimetableData())
//       } finally {
//         setLoading(false)
//       }
//     }
    
//     fetchTimetable()
//   }, [])

//   // Get all tasks for today (excluding Unscheduled Time)
//   const todayTasks = useMemo(() => {
//     const allTasks = Object.values(tasks).flat()
//     const todayDay = getCurrentDay()
    
//     return allTasks.filter(task => 
//       task.day === todayDay && 
//       !isUnscheduledTime(task) // Exclude Unscheduled Time
//     )
//   }, [tasks])

//   // Get tasks in grace period (1 hour after end time) - only real activities
//   const gracePeriodTasks = useMemo(() => {
//     return todayTasks.filter(task => {
//       const isPending = task.status === 'pending'
//       return isPending && isInGracePeriod(task)
//     })
//   }, [todayTasks, currentTime])

//   // Get missed tasks for today (beyond grace period) - only real activities that are missed
//   const missedTasks = useMemo(() => {
//     const now = currentTime
//     const nowMinutes = now.getHours() * 60 + now.getMinutes()
    
//     return todayTasks.filter(task => {
//       // Skip free periods and unscheduled time for missed tasks
//       if (task.type === 'free' || task.type === 'break' || isUnscheduledTime(task)) {
//         return false
//       }
      
//       const endMinutes = convertTimeToMinutes(task.endTime)
//       const isMissed = task.status === 'missed' || 
//                       (nowMinutes > endMinutes && task.status === 'pending' && !isInGracePeriod(task))
      
//       // Check if task can still be completed before bedtime
//       const timeUntilBedtime = convertTimeToMinutes(bedtime) - nowMinutes
//       const canCompleteBeforeBedtime = timeUntilBedtime >= task.duration
      
//       return isMissed && canCompleteBeforeBedtime
//     })
//   }, [todayTasks, bedtime, currentTime])

//   // Get fixed time activities for today (college, gym, etc.)
//   const fixedTimeActivities = useMemo(() => {
//     return todayTasks.filter(task => 
//       task.apiType === 'FIXED' && 
//       !isUnscheduledTime(task)
//     )
//   }, [todayTasks])

//   // Get free periods for today
//   const freePeriods = useMemo(() => {
//     return todayTasks.filter(task => 
//       task.apiType === 'FREE' && 
//       !isUnscheduledTime(task)
//     )
//   }, [todayTasks])

//   // Get active tasks (current ongoing activities)
//   const activeTasks = useMemo(() => {
//     const now = currentTime
//     const nowMinutes = now.getHours() * 60 + now.getMinutes()
    
//     return todayTasks.filter(task => {
//       const startMinutes = convertTimeToMinutes(task.startTime)
//       const endMinutes = convertTimeToMinutes(task.endTime)
      
//       return nowMinutes >= startMinutes && 
//              nowMinutes < endMinutes && 
//              task.status !== 'completed' && 
//              task.status !== 'skipped' && 
//              task.status !== 'missed'
//     })
//   }, [todayTasks, currentTime])

//   // Get current activity for the active component
//   const currentActivity = useMemo(() => {
//     return getCurrentActivity(todayTasks, currentTime)
//   }, [todayTasks, currentTime])

//   const currentActivityInfo = useMemo(() => {
//     return getCurrentActivityMessage(currentActivity)
//   }, [currentActivity])

//   // Check if task is current based on live time
//   const isTaskCurrent = useCallback((task: TimeSlot): boolean => {
//     const now = currentTime
//     const [startHour, startMinute] = task.startTime.split(':').map(Number)
//     const [endHour, endMinute] = task.endTime.split(':').map(Number)
    
//     const startTime = new Date(now)
//     startTime.setHours(startHour, startMinute, 0, 0)
    
//     const endTime = new Date(now)
//     endTime.setHours(endHour, endMinute, 0, 0)
    
//     return now >= startTime && now <= endTime && task.status !== 'completed' && task.status !== 'skipped'
//   }, [currentTime])

//   // Check if task is in grace period
//   const isTaskInGracePeriod = useCallback((task: TimeSlot): boolean => {
//     return isInGracePeriod(task)
//   }, [])

//   // Check if task is upcoming
//   const isTaskUpcoming = useCallback((task: TimeSlot): boolean => {
//     const now = currentTime
//     const [startHour] = task.startTime.split(':').map(Number)
//     const taskStart = new Date(now)
//     taskStart.setHours(startHour, 0, 0, 0)
    
//     return now < taskStart && task.status === 'pending'
//   }, [currentTime])

//   // Check if task is overdue
//   const isTaskOverdue = useCallback((task: TimeSlot): boolean => {
//     const now = currentTime
//     const [endHour, endMinute] = task.endTime.split(':').map(Number)
//     const taskEnd = new Date(now)
//     taskEnd.setHours(endHour, endMinute, 0, 0)
    
//     return now > taskEnd && (task.status === 'pending' || task.status === 'in-progress')
//   }, [currentTime])

//   // Calculate live data based on current time
//   const calculateLiveData = useCallback((): LiveTimeData => {
//     const allTasks = Object.values(tasksRef.current).flat()
//     const activeTasks = allTasks.filter(task => {
//       const now = currentTime
//       const [startHour, startMinute] = task.startTime.split(':').map(Number)
//       const [endHour, endMinute] = task.endTime.split(':').map(Number)
      
//       const startTime = new Date(now)
//       startTime.setHours(startHour, startMinute, 0, 0)
      
//       const endTime = new Date(now)
//       endTime.setHours(endHour, endMinute, 0, 0)
      
//       return now >= startTime && now <= endTime && task.status !== 'completed' && task.status !== 'skipped' && task.status !== 'missed'
//     })
    
//     const upcomingTasks = allTasks.filter(task => {
//       const now = currentTime
//       const [startHour] = task.startTime.split(':').map(Number)
//       const taskStart = new Date(now)
//       taskStart.setHours(startHour, 0, 0, 0)
      
//       return now < taskStart && task.status === 'pending'
//     })
    
//     const completedTasks = allTasks.filter(task => task.status === 'completed')
    
//     // Calculate progress for current task
//     let currentProgress = 0
//     if (activeTasks.length > 0) {
//       const task = activeTasks[0]
//       const startMinutes = convertTimeToMinutes(task.startTime)
//       const endMinutes = convertTimeToMinutes(task.endTime)
//       const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
      
//       const totalDuration = endMinutes - startMinutes
//       const elapsed = nowMinutes - startMinutes
//       currentProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
//     }
    
//     return {
//       currentTime,
//       activeTasks,
//       upcomingTasks,
//       completedTasks,
//       currentProgress
//     }
//   }, [currentTime])

//   // Update live data when current time changes
//   useEffect(() => {
//     const newLiveData = calculateLiveData()
//     setLiveData(newLiveData)
//   }, [currentTime, calculateLiveData])

//   // Update current day when date changes
//   useEffect(() => {
//     setCurrentDay(getCurrentDay())
//     setCurrentDayFull(getCurrentDayFull())
//   }, [currentTime])

//   // Update task status with feedback
//   const updateTaskStatus = useCallback((
//     taskId: string, 
//     newStatus: TaskStatus, 
//     notes?: string,
//     focusScore?: number,
//     completedWell?: boolean
//   ) => {
//     setTasks(prev => {
//       const updated = { ...prev }
//       let updatedTask: TimeSlot | null = null
      
//       for (const day in updated) {
//         updated[day] = updated[day].map(task => {
//           if (task.id === taskId) {
//             updatedTask = { 
//               ...task, 
//               status: newStatus,
//               ...(notes && { notes: task.notes ? `${task.notes}\n${notes}` : notes }),
//               ...(newStatus === 'completed' && { 
//                 completedAt: new Date(),
//                 focusScore: focusScore || task.focusScore,
//                 completedBeforeBedtime: convertTimeToMinutes(task.endTime) <= convertTimeToMinutes(bedtimeRef.current)
//               }),
//               ...(newStatus === 'in-progress' && { startedAt: new Date() }),
//               ...(newStatus === 'missed' && { actualDuration: 0 })
//             }
            
//             return updatedTask
//           }
//           return task
//         })
//       }
      
//       // Show toast notification after state update
//       if (updatedTask) {
//         const statusMessages = {
//           'completed': `"${updatedTask.title}" marked as completed! 🎉`,
//           'in-progress': `Started "${updatedTask.title}"! ⏱️`,
//           'missed': `"${updatedTask.title}" marked as missed`,
//           'skipped': `"${updatedTask.title}" skipped`,
//           'delayed': `"${updatedTask.title}" delayed`,
//           'rescheduled': `"${updatedTask.title}" rescheduled`,
//           'pending': `"${updatedTask.title}" reset to pending`
//         }
        
//         setTimeout(() => {
//           toast(statusMessages[newStatus], {
//             description: newStatus === 'completed' ? `Great job! ${updatedTask!.duration} minutes completed.` : undefined,
//             action: newStatus === 'completed' ? {
//               label: "Undo",
//               onClick: () => updateTaskStatus(taskId, 'pending')
//             } : undefined,
//           })
//         }, 0)
//       }
      
//       return updated
//     })
//   }, [])

//   // Smart delay task with intelligent scheduling
//   const smartDelayTask = useCallback((task: TimeSlot, preferredDelay: number = 30) => {
//     const options = findFreeSlots(tasks, task, preferredDelay, bedtime)
//     setSmartDelayOptions(options)
//     setTaskToDelay(task)
//     setShowDelayModal(true)
//   }, [tasks, bedtime])

//   // Apply smart delay
//   const applySmartDelay = useCallback((option: SmartDelayOptions, slotIndex?: number) => {
//     if (!taskToDelay) return
    
//     const task = taskToDelay
    
//     if (slotIndex !== undefined && option.availableSlots[slotIndex]) {
//       // Move to available slot
//       const slot = option.availableSlots[slotIndex]
      
//       setTasks(prev => {
//         const updated = { ...prev }
        
//         // Remove from original position
//         updated[task.day] = updated[task.day].filter(t => t.id !== task.id)
        
//         // Add to new position
//         const delayedTask: TimeSlot = {
//           ...task,
//           startTime: slot.startTime,
//           endTime: slot.endTime,
//           day: slot.day,
//           status: 'rescheduled',
//           originalStartTime: task.originalStartTime || task.startTime,
//           originalEndTime: task.originalEndTime || task.endTime,
//           notes: task.notes ? `${task.notes}\nRescheduled to ${slot.day} ${formatTimeDisplay(slot.startTime)}` : `Rescheduled to ${slot.day} ${formatTimeDisplay(slot.startTime)}`
//         }
        
//         if (!updated[slot.day]) {
//           updated[slot.day] = []
//         }
        
//         updated[slot.day].push(delayedTask)
//         // Sort by start time
//         updated[slot.day].sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))
        
//         return updated
//       })
      
//       toast("Task rescheduled!", {
//         description: `Moved to ${slot.day} at ${formatTimeDisplay(slot.startTime)}`,
//       })
      
//     } else if (option.canExtend && option.maxExtension > 0) {
//       // Extend current task
//       const newEndTime = convertMinutesToTime(convertTimeToMinutes(task.endTime) + task.duration)
      
//       // Check if extension conflicts with bedtime
//       if (convertTimeToMinutes(newEndTime) <= convertTimeToMinutes(bedtimeRef.current)) {
//         setTasks(prev => {
//           const updated = { ...prev }
//           updated[task.day] = updated[task.day].map(t => {
//             if (t.id === task.id) {
//               return {
//                 ...t,
//                 endTime: newEndTime,
//                 duration: t.duration,
//                 status: 'rescheduled',
//                 notes: t.notes ? `${t.notes}\nExtended to complete before ${bedtimeRef.current}` : `Extended to complete before ${bedtimeRef.current}`
//               }
//             }
//             return t
//           })
//           return updated
//         })
        
//         toast("Task extended!", {
//           description: `Will complete by ${formatTimeDisplay(newEndTime)} (before ${bedtimeRef.current})`,
//         })
//       } else {
//         toast.error("Cannot extend past bedtime", {
//           description: `Bedtime is at ${bedtimeRef.current}`,
//         })
//         return
//       }
//     } else {
//       // No options available
//       toast.error("No available slots", {
//         description: "Consider reducing task duration or skipping",
//       })
//       return
//     }
    
//     setShowDelayModal(false)
//     setTaskToDelay(null)
//     setSmartDelayOptions(null)
//   }, [taskToDelay])

//   // Simple delay (for backward compatibility)
//   const simpleDelayTask = useCallback((taskId: string, minutes: number) => {
//     setTasks(prev => {
//       const updated = { ...prev }
//       for (const day in updated) {
//         updated[day] = updated[day].map(task => {
//           if (task.id === taskId) {
//             const [hours, mins] = task.startTime.split(':').map(Number)
//             const newStartMinutes = hours * 60 + mins + minutes
//             const newStartHour = Math.floor(newStartMinutes / 60)
//             const newStartMinute = newStartMinutes % 60
            
//             const newEndMinutes = newStartMinutes + task.duration
//             const newEndHour = Math.floor(newEndMinutes / 60)
//             const newEndMinute = newEndMinutes % 60
            
//             const newStartTime = `${newStartHour.toString().padStart(2, '0')}:${newStartMinute.toString().padStart(2, '0')}`
//             const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}`
            
//             // Check if new time conflicts with bedtime
//             if (convertTimeToMinutes(newEndTime) > convertTimeToMinutes(bedtimeRef.current)) {
//               setTimeout(() => {
//                 toast.error("Cannot delay past bedtime", {
//                   description: `Task would end at ${formatTimeDisplay(newEndTime)} but bedtime is ${bedtimeRef.current}`,
//                 })
//               }, 0)
//               return task
//             }
            
//             // Check if new slot is available
//             if (isTimeSlotAvailable(updated, task.day, newStartTime, newEndTime, taskId)) {
//               return {
//                 ...task,
//                 startTime: newStartTime,
//                 endTime: newEndTime,
//                 status: 'rescheduled',
//                 notes: task.notes ? `${task.notes}\nDelayed by ${minutes} minutes` : `Delayed by ${minutes} minutes`
//               }
//             } else {
//               setTimeout(() => {
//                 toast.error("Time slot not available", {
//                   description: "Another task is scheduled at that time",
//                 })
//               }, 0)
//               return task
//             }
//           }
//           return task
//         })
//       }
      
//       setTimeout(() => {
//         toast("Task delayed", {
//           description: `Task delayed by ${minutes} minutes`,
//         })
//       }, 0)
      
//       return updated
//     })
//   }, [])

//   // Start task timer
//   const startTaskTimer = useCallback((taskId: string) => {
//     updateTaskStatus(taskId, 'in-progress')
//     setTimerRunning(true)
    
//     setTimeout(() => {
//       toast("Timer started! ⏱️", {
//         description: "Task timer is now running",
//       })
//     }, 0)
//   }, [updateTaskStatus])

//   // Stop task timer with feedback
//   const stopTaskTimer = useCallback((taskId: string) => {
//     const task = Object.values(tasks).flat().find(t => t.id === taskId)
//     if (task) {
//       setTaskForFeedback(task)
//       setFeedbackFocus(5)
//       setFeedbackNotes('')
//       setFeedbackCompletedWell(true)
//       setShowFeedbackModal(true)
//     }
//   }, [tasks])

//   // Complete task with feedback
//   const completeTaskWithFeedback = useCallback(() => {
//     if (!taskForFeedback) return
    
//     const now = new Date()
//     const isLateNight = now.getHours() >= 22
    
//     updateTaskStatus(
//       taskForFeedback.id, 
//       'completed', 
//       feedbackNotes || (feedbackCompletedWell ? 'Completed successfully' : 'Completed with challenges'),
//       feedbackFocus,
//       feedbackCompletedWell
//     )
    
//     setShowFeedbackModal(false)
    
//     // Show motivational message based on focus score
//     if (feedbackFocus >= 8) {
//       const message = getMotivationalMessage(now.getHours(), isLateNight, 'focus')
//       setCurrentMotivationalMessage(message)
//       setShowMotivationalMessage(true)
      
//       setTimeout(() => {
//         toast.success("Excellent focus! 🎯", {
//           description: message.message,
//           duration: 5000,
//         })
//       }, 0)
//     } else if (isLateNight) {
//       const message = getMotivationalMessage(now.getHours(), true)
//       setTimeout(() => {
//         toast.success("Great dedication! 🌙", {
//           description: message.message,
//           duration: 5000,
//         })
//       }, 0)
//     }
    
//     setTaskForFeedback(null)
//   }, [taskForFeedback, feedbackFocus, feedbackNotes, feedbackCompletedWell, updateTaskStatus])

//   // Skip task
//   const skipTask = useCallback((taskId: string) => {
//     updateTaskStatus(taskId, 'skipped', 'Skipped by user')
    
//     setTimeout(() => {
//       toast("Task skipped", {
//         description: "Task has been skipped",
//       })
//     }, 0)
//   }, [updateTaskStatus])

//   // Mark as missed
//   const markAsMissed = useCallback((taskId: string) => {
//     updateTaskStatus(taskId, 'missed', 'Marked as missed')
//   }, [updateTaskStatus])

//   // Complete missed task (special function for late night completion)
//   const completeMissedTask = useCallback((taskId: string) => {
//     const now = new Date()
//     const isLateNight = now.getHours() >= 22 // After 10 PM
    
//     updateTaskStatus(taskId, 'completed', `Completed at night (${formatTimeDisplay(convertMinutesToTime(now.getHours() * 60 + now.getMinutes()))})`)
    
//     // Show motivational message for late night completion
//     if (isLateNight) {
//       const message = getMotivationalMessage(now.getHours(), true)
//       setCurrentMotivationalMessage(message)
//       setShowMotivationalMessage(true)
      
//       setTimeout(() => {
//         toast.success("Great dedication! 🌙", {
//           description: message.message,
//           duration: 5000,
//         })
//       }, 0)
//     }
//   }, [updateTaskStatus])

//   // Reschedule missed task to free period
//   const rescheduleMissedTaskToFreePeriod = useCallback((task: TimeSlot) => {
//     // Find free periods in the schedule
//     const freePeriods = Object.values(tasks).flat().filter(t => 
//       t.type === 'free' && 
//       t.status === 'pending' &&
//       convertTimeToMinutes(t.endTime) <= convertTimeToMinutes(bedtime)
//     )
    
//     if (freePeriods.length > 0) {
//       // Find the earliest free period that can accommodate the task
//       const suitableFreePeriod = freePeriods.find(fp => fp.duration >= task.duration)
      
//       if (suitableFreePeriod) {
//         setTasks(prev => {
//           const updated = { ...prev }
          
//           // Remove from missed status
//           updated[task.day] = updated[task.day].map(t => 
//             t.id === task.id ? { 
//               ...t, 
//               status: 'rescheduled',
//               startTime: suitableFreePeriod.startTime,
//               endTime: convertMinutesToTime(convertTimeToMinutes(suitableFreePeriod.startTime) + task.duration),
//               day: suitableFreePeriod.day,
//               notes: t.notes ? `${t.notes}\nRescheduled to free period at ${formatTimeDisplay(suitableFreePeriod.startTime)}` : `Rescheduled to free period at ${formatTimeDisplay(suitableFreePeriod.startTime)}`
//             } : t
//           )
          
//           // Remove the free period task since it's now occupied
//           updated[suitableFreePeriod.day] = updated[suitableFreePeriod.day].filter(t => t.id !== suitableFreePeriod.id)
          
//           return updated
//         })
        
//         toast.success("Task rescheduled to free period! 📅", {
//           description: `"${task.title}" moved to ${suitableFreePeriod.day} at ${formatTimeDisplay(suitableFreePeriod.startTime)}`,
//         })
//       } else {
//         // No suitable free period found, try to reschedule to evening
//         const eveningStart = convertMinutesToTime(convertTimeToMinutes(bedtime) - task.duration - 30) // 30 minutes before bedtime
//         if (convertTimeToMinutes(eveningStart) >= convertTimeToMinutes('18:00')) {
//           setTasks(prev => {
//             const updated = { ...prev }
//             updated[task.day] = updated[task.day].map(t => 
//               t.id === task.id ? { 
//                 ...t, 
//                 status: 'rescheduled',
//                 startTime: eveningStart,
//                 endTime: convertMinutesToTime(convertTimeToMinutes(eveningStart) + task.duration),
//                 notes: t.notes ? `${t.notes}\nRescheduled to evening at ${formatTimeDisplay(eveningStart)}` : `Rescheduled to evening at ${formatTimeDisplay(eveningStart)}`
//               } : t
//             )
//             return updated
//           })
          
//           toast.success("Task rescheduled to evening! 🌆", {
//             description: `"${task.title}" moved to ${formatTimeDisplay(eveningStart)}`,
//           })
//         } else {
//           toast.error("No suitable time slot found", {
//             description: "Consider completing the task now or skipping it",
//           })
//         }
//       }
//     } else {
//       // No free periods, try to reschedule to next day morning
//       const nextDay = getNextDay(task.day)
//       const morningStart = '06:00'
      
//       if (isTimeSlotAvailable(tasks, nextDay, morningStart, convertMinutesToTime(convertTimeToMinutes(morningStart) + task.duration))) {
//         setTasks(prev => {
//           const updated = { ...prev }
          
//           // Remove from current day
//           updated[task.day] = updated[task.day].filter(t => t.id !== task.id)
          
//           // Add to next day
//           const rescheduledTask = {
//             ...task,
//             day: nextDay,
//             startTime: morningStart,
//             endTime: convertMinutesToTime(convertTimeToMinutes(morningStart) + task.duration),
//             status: 'rescheduled',
//             notes: task.notes ? `${task.notes}\nRescheduled to tomorrow morning at ${formatTimeDisplay(morningStart)}` : `Rescheduled to tomorrow morning at ${formatTimeDisplay(morningStart)}`
//           }
          
//           if (!updated[nextDay]) {
//             updated[nextDay] = []
//           }
          
//           updated[nextDay].push(rescheduledTask)
//           updated[nextDay].sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))
          
//           return updated
//         })
        
//         toast.success("Task rescheduled to tomorrow morning! ☀️", {
//           description: `"${task.title}" moved to ${nextDay} at ${formatTimeDisplay(morningStart)}`,
//         })
//       } else {
//         toast.error("No suitable time slot found", {
//           description: "Try completing the task now or mark it as skipped",
//         })
//       }
//     }
//   }, [tasks, bedtime])

//   // Update current time every minute
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(new Date())
//     }, 60000) // Update every minute
    
//     return () => clearInterval(interval)
//   }, [])

//   // Auto-refresh tasks status based on time with grace period handling
//   useEffect(() => {
//     if (!autoRefresh) return
    
//     const allTasks = Object.values(tasks).flat()
//     const now = currentTime
    
//     let hasChanges = false
//     const updatedTasks = { ...tasks }
    
//     allTasks.forEach(task => {
//       const [endHour, endMinute] = task.endTime.split(':').map(Number)
//       const taskEnd = new Date(now)
//       taskEnd.setHours(endHour, endMinute, 0, 0)
      
//       const gracePeriodEnd = new Date(taskEnd)
//       gracePeriodEnd.setHours(gracePeriodEnd.getHours() + 1)
      
//       // Auto-mark as missed if past grace period and still pending (only for real activities)
//       if (now > gracePeriodEnd && task.status === 'pending' && isRealActivity(task)) {
//         updatedTasks[task.day] = updatedTasks[task.day].map(t => 
//           t.id === task.id ? { 
//             ...t, 
//             status: 'missed',
//             notes: t.notes ? `${t.notes}\nAuto-marked as missed (no update within 1 hour)` : 'Auto-marked as missed (no update within 1 hour)'
//           } : t
//         )
//         hasChanges = true
        
//         setTimeout(() => {
//           toast.warning("Task marked as missed", {
//             description: `${task.title} - No status update within 1 hour of completion`,
//           })
//         }, 0)
//       }
      
//       // Auto-start task if start time reached (only for real activities)
//       const [startHour, startMinute] = task.startTime.split(':').map(Number)
//       const taskStart = new Date(now)
//       taskStart.setHours(startHour, startMinute, 0, 0)
      
//       if (now >= taskStart && now <= taskEnd && task.status === 'pending' && isRealActivity(task)) {
//         updatedTasks[task.day] = updatedTasks[task.day].map(t => 
//           t.id === task.id ? { 
//             ...t, 
//             status: 'in-progress',
//             startedAt: new Date()
//           } : t
//         )
//         hasChanges = true
        
//         setTimeout(() => {
//           toast.info("Task started automatically", {
//             description: `${task.title} has started`,
//           })
//         }, 0)
//       }
//     })
    
//     if (hasChanges) {
//       setTasks(updatedTasks)
//     }
//   }, [currentTime, autoRefresh])

//   // Generate time slots
//   const generateTimeSlots = useMemo(() => {
//     const slots = []
//     for (let hour = timeRange[0]; hour <= timeRange[1]; hour++) {
//       for (let minute = 0; minute < 60; minute += 30) {
//         if (hour === timeRange[1] && minute > 0) break
//         const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
//         slots.push(time)
//       }
//     }
//     return slots
//   }, [timeRange])

//   const timeSlots = generateTimeSlots
//   const days = showWeekends 
//     ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//     : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

//   // Calculate statistics
//   const stats = useMemo(() => {
//     const allTasks = Object.values(tasks).flat().filter(isRealActivity) // Only count real activities
//     const totalTasks = allTasks.length
//     const completedTasksCount = allTasks.filter(task => task.status === 'completed').length
//     const inProgressTasks = allTasks.filter(task => task.status === 'in-progress').length
//     const missedTasksCount = allTasks.filter(task => task.status === 'missed').length
//     const rescheduledTasks = allTasks.filter(task => task.status === 'rescheduled').length
//     const totalDuration = allTasks.reduce((sum, task) => sum + task.duration, 0)
//     const completedDuration = allTasks
//       .filter(task => task.status === 'completed')
//       .reduce((sum, task) => sum + task.duration, 0)
    
//     // Calculate efficiency (completed on time vs delayed/rescheduled)
//     const onTimeTasks = allTasks.filter(task => 
//       task.status === 'completed' && !task.notes?.includes('Rescheduled') && !task.notes?.includes('Delayed')
//     ).length
    
//     // Calculate average focus score
//     const completedWithScores = allTasks.filter(task => task.status === 'completed' && task.focusScore)
//     const avgFocusScore = completedWithScores.length > 0 
//       ? completedWithScores.reduce((sum, task) => sum + (task.focusScore || 0), 0) / completedWithScores.length
//       : 0
    
//     return {
//       totalTasks,
//       completedTasks: completedTasksCount,
//       inProgressTasks,
//       missedTasks: missedTasksCount,
//       rescheduledTasks,
//       onTimeTasks,
//       totalHours: (totalDuration / 60).toFixed(1),
//       completedHours: (completedDuration / 60).toFixed(1),
//       completionRate: totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0,
//       efficiencyRate: totalTasks > 0 ? Math.round((onTimeTasks / totalTasks) * 100) : 0,
//       onTimeRate: totalTasks > 0 ? Math.round((onTimeTasks / totalTasks) * 100) : 0,
//       avgFocusScore: Math.round(avgFocusScore * 10) / 10
//     }
//   }, [tasks])

//   // Check if task should be shown in cell
//   const shouldShowTaskInCell = useCallback((task: TimeSlot, day: string, time: string) => {
//     if (task.day !== day) return false
//     const taskStartMinutes = convertTimeToMinutes(task.startTime)
//     const cellMinutes = convertTimeToMinutes(time)
//     return taskStartMinutes === cellMinutes
//   }, [])

//   // Check if time is current time
//   const isCurrentTime = useCallback((time: string) => {
//     const currentHour = currentTime.getHours().toString().padStart(2, '0')
//     const currentMinute = Math.floor(currentTime.getMinutes() / 30) * 30
//     const currentTimeStr = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`
//     return time === currentTimeStr
//   }, [currentTime])

//   // Calendar functions
//   const calendarDays = useMemo(() => {
//     return generateCalendarDays(currentYear, currentMonth, tasks)
//   }, [currentYear, currentMonth, tasks])

//   const goToPreviousMonth = () => {
//     if (currentMonth === 0) {
//       setCurrentMonth(11)
//       setCurrentYear(currentYear - 1)
//     } else {
//       setCurrentMonth(currentMonth - 1)
//     }
//   }

//   const goToNextMonth = () => {
//     if (currentMonth === 11) {
//       setCurrentMonth(0)
//       setCurrentYear(currentYear + 1)
//     } else {
//       setCurrentMonth(currentMonth + 1)
//     }
//   }

//   const goToToday = () => {
//     const today = new Date()
//     setCurrentMonth(today.getMonth())
//     setCurrentYear(today.getFullYear())
//     setSelectedDate(today)
//   }

//   // Drag and drop handlers
//   const handleDragStart = (task: TimeSlot) => {
//     setDraggedTask(task)
//   }

//   const handleDragOver = (e: React.DragEvent, date: Date) => {
//     e.preventDefault()
//   }

//   const handleDrop = (e: React.DragEvent, date: Date) => {
//     e.preventDefault()
//     if (!draggedTask) return

//     const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
//     const newDay = dayNames[date.getDay()]
    
//     // Update task with new date and day
//     setTasks(prev => {
//       const updated = { ...prev }
      
//       // Remove from old day
//       updated[draggedTask.day] = updated[draggedTask.day].filter(t => t.id !== draggedTask.id)
      
//       // Add to new day
//       const updatedTask = {
//         ...draggedTask,
//         day: newDay,
//         date: date
//       }
      
//       if (!updated[newDay]) {
//         updated[newDay] = []
//       }
      
//       updated[newDay].push(updatedTask)
//       updated[newDay].sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))
      
//       setTimeout(() => {
//         toast("Task moved!", {
//           description: `Moved "${draggedTask.title}" to ${formatDate(date)}`,
//         })
//       }, 0)
      
//       return updated
//     })
    
//     setDraggedTask(null)
//   }

//   // Task cell component
//   const TaskCell = ({ 
//     task, 
//     cellHeight, 
//     isCurrent,
//     isOverdue,
//     compact = false
//   }: { 
//     task: TimeSlot, 
//     cellHeight: number, 
//     isCurrent: boolean,
//     isOverdue: boolean,
//     compact?: boolean
//   }) => {
//     const Icon = getIconComponent(task.icon || 'Clock')
//     const duration = convertTimeToMinutes(task.endTime) - convertTimeToMinutes(task.startTime)
//     const span = Math.max(1, Math.ceil(duration / 30))
//     const inGracePeriod = isTaskInGracePeriod(task)
    
//     // Status-based styling
//     const statusStyles = {
//       'completed': 'border-green-500 bg-green-500/10',
//       'in-progress': 'border-blue-500 bg-blue-500/10',
//       'missed': 'border-red-500 bg-red-500/10',
//       'skipped': 'border-gray-500 bg-gray-500/10',
//       'delayed': 'border-yellow-500 bg-yellow-500/10',
//       'rescheduled': 'border-purple-500 bg-purple-500/10',
//       'pending': inGracePeriod
//         ? 'border-yellow-400 bg-yellow-500/10 animate-pulse'
//         : isOverdue 
//         ? 'border-red-300 bg-red-500/5' 
//         : isCurrent 
//         ? 'border-blue-300 bg-blue-500/5' 
//         : 'border-gray-300 dark:border-gray-700'
//     }
    
//     // Status icons
//     const statusIcons = {
//       'completed': CheckCircle,
//       'in-progress': PlayCircle,
//       'missed': CircleX,
//       'skipped': SkipForward,
//       'delayed': Clock,
//       'rescheduled': CalendarClock,
//       'pending': inGracePeriod ? AlarmClock : (isCurrent ? CircleDot : Circle)
//     }
    
//     const StatusIcon = statusIcons[task.status] || Circle

//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className={`absolute top-0.5 left-0.5 right-0.5 rounded-lg border shadow-sm z-30 overflow-hidden cursor-pointer group/task ${statusStyles[task.status]}`}
//         style={{ 
//           height: compact ? 'auto' : `${cellHeight * span - 4}px`,
//           minHeight: compact ? 'auto' : `${cellHeight - 4}px`,
//           borderLeft: `4px solid ${task.color}`
//         }}
//         whileHover={{ scale: 1.02 }}
//         onClick={(e) => {
//           e.stopPropagation()
//           setSelectedTask(task)
//           setShowTaskModal(true)
//         }}
//         draggable
//         onDragStart={() => handleDragStart(task)}
//       >
//         <div className={cn("p-2 h-full flex flex-col", compact && "p-1")}>
//           {/* Task header */}
//           <div className="flex items-center justify-between mb-1">
//             <div className="flex items-center gap-2 flex-1 min-w-0">
//               <Icon className={cn("flex-shrink-0", compact ? "w-2 h-2" : "w-3 h-3")} style={{ color: task.color }} />
//               <h4 className={cn("font-semibold truncate", compact ? "text-xs" : "text-xs")}>{task.title}</h4>
//             </div>
//             <StatusIcon className={cn(`flex-shrink-0 ${
//               task.status === 'completed' ? 'text-green-500' :
//               task.status === 'in-progress' ? 'text-blue-500 animate-pulse' :
//               task.status === 'missed' ? 'text-red-500' :
//               task.status === 'delayed' ? 'text-yellow-500' :
//               task.status === 'rescheduled' ? 'text-purple-500' :
//               inGracePeriod ? 'text-yellow-500 animate-pulse' :
//               isCurrent ? 'text-blue-500' : 'text-gray-500'
//             }`, compact ? "w-2 h-2" : "w-3 h-3")} />
//           </div>
          
//           {/* Task details */}
//           {!compact && (
//             <div className="mt-auto">
//               <div className="flex items-center justify-between">
//                 <Badge variant="outline" className="text-[10px] truncate max-w-[60px]">
//                   {task.apiType === 'FIXED' ? 'Fixed' : 
//                    task.apiType === 'FREE' ? 'Free' : 'Other'}
//                 </Badge>
//                 {task.priority === 'HIGH' && (
//                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
//                 )}
//               </div>
              
//               {/* Time for multi-slot tasks */}
//               {span > 1 && (
//                 <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-1">
//                   {formatTimeDisplay(task.startTime)}
//                 </div>
//               )}
              
//               {/* Grace period indicator */}
//               {inGracePeriod && (
//                 <div className="text-[8px] text-yellow-600 dark:text-yellow-400 mt-1 flex items-center gap-1">
//                   <AlarmClock className="w-2 h-2" />
//                   Update status within 1 hour
//                 </div>
//               )}
              
//               {/* Focus score for completed tasks */}
//               {task.status === 'completed' && task.focusScore && (
//                 <div className="flex items-center gap-1 mt-1">
//                   <div className="flex">
//                     {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
//                       <StarIcon
//                         key={star}
//                         className={cn(
//                           "w-2 h-2",
//                           star <= (task.focusScore || 0) / 2
//                             ? "text-yellow-500 fill-yellow-500"
//                             : "text-gray-300 dark:text-gray-600"
//                         )}
//                       />
//                     ))}
//                   </div>
//                   <span className="text-[8px] text-gray-500">{(task.focusScore || 0)}/10</span>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Drag handle */}
//           <div className="absolute top-1 left-1 opacity-0 group-hover/task:opacity-100 transition-opacity">
//             <GripVertical className="w-3 h-3 text-gray-400" />
//           </div>
//         </div>

//         {/* Quick action buttons on hover */}
//         {!compact && (
//           <div className="absolute top-1 right-1 opacity-0 group-hover/task:opacity-100 transition-opacity flex gap-1">
//             {task.status === 'pending' && !inGracePeriod && isRealActivity(task) ? (
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 className="h-6 w-6 bg-white/90 dark:bg-gray-800/90 shadow-sm"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   startTaskTimer(task.id)
//                 }}
//               >
//                 <PlayCircle className="w-3 h-3" />
//               </Button>
//             ) : task.status === 'in-progress' ? (
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 className="h-6 w-6 bg-white/90 dark:bg-gray-800/90 shadow-sm"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   stopTaskTimer(task.id)
//                 }}
//               >
//                 <StopCircle className="w-3 h-3" />
//               </Button>
//             ) : inGracePeriod && isRealActivity(task) ? (
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 className="h-6 w-6 bg-white/90 dark:bg-gray-800/90 shadow-sm text-yellow-600"
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   setTaskForFeedback(task)
//                   setFeedbackFocus(5)
//                   setFeedbackNotes('')
//                   setFeedbackCompletedWell(true)
//                   setShowFeedbackModal(true)
//                 }}
//               >
//                 <Edit2 className="w-3 h-3" />
//               </Button>
//             ) : null}
//           </div>
//         )}

//         {/* Progress bar for in-progress tasks */}
//         {task.status === 'in-progress' && !compact && (
//           <div className="absolute bottom-0 left-0 right-0 h-1">
//             <div 
//               className="h-full rounded-b-lg"
//               style={{ 
//                 width: `${liveData.currentProgress}%`,
//                 backgroundColor: task.color,
//                 transition: 'width 1s linear'
//               }}
//             />
//           </div>
//         )}
//       </motion.div>
//     )
//   }

//   // Render grace period tasks section (tasks that ended in last 1 hour)
//   const renderGracePeriodSection = () => {
//     if (gracePeriodTasks.length === 0) return null

//     return (
//       <Card className="border-yellow-500/50 bg-yellow-500/5">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <AlarmClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
//             Tasks Need Your Feedback
//             <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 animate-pulse">
//               {gracePeriodTasks.length} tasks
//             </Badge>
//           </CardTitle>
//           <CardDescription>
//             These tasks ended recently. Update their status within 1 hour or they'll be marked as missed.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {gracePeriodTasks.map((task) => {
//               const Icon = getIconComponent(task.icon || 'Clock')
//               const timeSinceEnd = Math.floor((currentTime.getTime() - new Date(currentTime).setHours(
//                 ...task.endTime.split(':').map(Number)
//               )) / 60000)
//               const timeRemaining = 60 - timeSinceEnd
              
//               return (
//                 <div key={task.id} className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3">
//                       <div 
//                         className="p-2 rounded-lg"
//                         style={{ backgroundColor: `${task.color}20` }}
//                       >
//                         <Icon className="w-5 h-5" style={{ color: task.color }} />
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2 mb-1">
//                           <h3 className="font-bold">{task.title}</h3>
//                           <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 animate-pulse">
//                             {timeRemaining} min left
//                           </Badge>
//                         </div>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           Ended at {formatTimeDisplay(task.endTime)} • Duration: {task.duration} min
//                         </p>
//                         <Progress 
//                           value={(timeSinceEnd / 60) * 100} 
//                           className="h-1.5 w-48 mt-2"
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="flex gap-2">
//                       <Button
//                         size="sm"
//                         onClick={() => {
//                           setTaskForFeedback(task)
//                           setFeedbackFocus(5)
//                           setFeedbackNotes('')
//                           setFeedbackCompletedWell(true)
//                           setShowFeedbackModal(true)
//                         }}
//                         className="gap-1"
//                       >
//                         <CheckCircle className="w-4 h-4" />
//                         Update Status
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => smartDelayTask(task)}
//                         className="gap-1"
//                       >
//                         <CalendarClock className="w-4 h-4" />
//                         Reschedule
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   // Render missed tasks section - IMPROVED UI
//   const renderMissedTasksSection = () => {
//     if (missedTasks.length === 0) return null

//     const now = new Date()
//     const isLateNight = now.getHours() >= 22
//     const motivationalMessage = getMotivationalMessage(now.getHours(), isLateNight)

//     return (
//       <div className="space-y-6">
//         {/* Motivational Message Banner */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 dark:border-orange-500/20 rounded-xl p-6"
//         >
//           <div className="flex items-start gap-4">
//             <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
//               {motivationalMessage.icon && (
//                 <motivationalMessage.icon className="w-6 h-6 text-white" />
//               )}
//             </div>
//             <div className="flex-1">
//               <div className="flex items-center justify-between mb-2">
//                 <h3 className="text-lg font-bold">Recover Missed Tasks 💪</h3>
//                 <Badge className={`
//                   ${isLateNight 
//                     ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 animate-pulse' 
//                     : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
//                   }
//                 `}>
//                   {isLateNight ? '🌙 Late Night Mode' : '⏰ Still Time Left'}
//                 </Badge>
//               </div>
//               <p className="text-gray-700 dark:text-gray-300">
//                 {motivationalMessage.message} {motivationalMessage.emoji}
//               </p>
//             </div>
//           </div>
//         </motion.div>

//         {/* Missed Tasks Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {missedTasks.map((task, index) => {
//             const Icon = getIconComponent(task.icon || 'Clock')
//             const timeUntilBedtime = convertTimeToMinutes(bedtime) - (currentTime.getHours() * 60 + currentTime.getMinutes())
//             const urgencyLevel = timeUntilBedtime < 60 ? 'high' : timeUntilBedtime < 120 ? 'medium' : 'low'
            
//             return (
//               <motion.div
//                 key={task.id}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="group relative bg-white dark:bg-gray-900 rounded-xl border-2 overflow-hidden hover:shadow-xl transition-all duration-300"
//                 style={{
//                   borderColor: urgencyLevel === 'high' ? '#EF4444' : 
//                               urgencyLevel === 'medium' ? '#F59E0B' : '#10B981',
//                   boxShadow: urgencyLevel === 'high' ? '0 4px 20px rgba(239, 68, 68, 0.2)' : 
//                             urgencyLevel === 'medium' ? '0 4px 20px rgba(245, 158, 11, 0.2)' : 
//                             '0 4px 20px rgba(16, 185, 129, 0.2)'
//                 }}
//               >
//                 {/* Header with gradient */}
//                 <div 
//                   className="px-4 py-3"
//                   style={{
//                     background: `linear-gradient(135deg, ${task.color}20 0%, ${task.color}05 100%)`,
//                     borderBottom: `1px solid ${task.color}30`
//                   }}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
//                         <Icon className="w-5 h-5" style={{ color: task.color }} />
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-lg line-clamp-1">{task.title}</h3>
//                         <p className="text-xs text-gray-600 dark:text-gray-400">
//                           {task.subject} • {task.duration} min
//                         </p>
//                       </div>
//                     </div>
//                     <Badge 
//                       className={`
//                         ${urgencyLevel === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
//                           urgencyLevel === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
//                           'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}
//                       `}
//                     >
//                       {urgencyLevel === 'high' ? 'Urgent' : 
//                        urgencyLevel === 'medium' ? 'Moderate' : 'Relaxed'}
//                     </Badge>
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-4 space-y-3">
//                   {/* Time info */}
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4 text-gray-500" />
//                       <span className="text-gray-600 dark:text-gray-400">Original Time</span>
//                     </div>
//                     <span className="font-medium">{formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}</span>
//                   </div>

//                   {/* Time remaining */}
//                   <div className="space-y-1">
//                     <div className="flex items-center justify-between text-sm">
//                       <div className="flex items-center gap-2">
//                         <Timer className="w-4 h-4 text-gray-500" />
//                         <span className="text-gray-600 dark:text-gray-400">Time until bedtime</span>
//                       </div>
//                       <span className={`
//                         font-medium
//                         ${timeUntilBedtime < 30 ? 'text-red-500 animate-pulse' :
//                           timeUntilBedtime < 60 ? 'text-orange-500' :
//                           timeUntilBedtime < 120 ? 'text-yellow-500' :
//                           'text-green-500'}
//                       `}>
//                         {Math.floor(timeUntilBedtime / 60)}h {timeUntilBedtime % 60}m
//                       </span>
//                     </div>
//                     <Progress 
//                       value={(timeUntilBedtime / convertTimeToMinutes(bedtime)) * 100} 
//                       className={`
//                         h-2
//                         ${timeUntilBedtime < 30 ? 'bg-red-100 [&>div]:bg-red-500' :
//                           timeUntilBedtime < 60 ? 'bg-orange-100 [&>div]:bg-orange-500' :
//                           timeUntilBedtime < 120 ? 'bg-yellow-100 [&>div]:bg-yellow-500' :
//                           'bg-green-100 [&>div]:bg-green-500'}
//                       `}
//                     />
//                   </div>

//                   {/* Action buttons */}
//                   <div className="grid grid-cols-2 gap-2 pt-2">
//                     <Button
//                       size="sm"
//                       onClick={() => completeMissedTask(task.id)}
//                       className="gap-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
//                     >
//                       <CheckCircle className="w-4 h-4" />
//                       Complete Now
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => rescheduleMissedTaskToFreePeriod(task)}
//                       className="gap-1 border-amber-500 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/20"
//                     >
//                       <CalendarClock className="w-4 h-4" />
//                       Free Period
//                     </Button>
//                   </div>

//                   {/* More options */}
//                   <div className="flex items-center justify-between pt-1">
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => smartDelayTask(task)}
//                       className="text-xs gap-1 h-7"
//                     >
//                       <Clock className="w-3 h-3" />
//                       Smart Delay
//                     </Button>
//                     <div className="flex gap-1">
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={() => simpleDelayTask(task.id, 30)}
//                         className="text-xs h-7"
//                         disabled={convertTimeToMinutes(task.endTime) + 30 > convertTimeToMinutes(bedtime)}
//                       >
//                         +30m
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={() => skipTask(task.id)}
//                         className="text-xs h-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
//                       >
//                         <SkipForward className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Urgent indicator for high urgency */}
//                 {urgencyLevel === 'high' && (
//                   <div className="absolute top-2 right-2">
//                     <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
//                   </div>
//                 )}
//               </motion.div>
//             )
//           })}
//         </div>

//         {/* Batch actions footer */}
//         <Card>
//           <CardFooter className="py-3">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
//               <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                 <AlertCircle className="w-4 h-4" />
//                 <span>
//                   {missedTasks.length} missed {missedTasks.length === 1 ? 'task' : 'tasks'} • Complete before {formatTimeDisplay(bedtime)}
//                 </span>
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => {
//                     missedTasks.forEach(task => {
//                       if (convertTimeToMinutes(bedtime) - (currentTime.getHours() * 60 + currentTime.getMinutes()) >= task.duration) {
//                         completeMissedTask(task.id)
//                       }
//                     })
//                     setTimeout(() => {
//                       toast.success("Great job! 🎉", {
//                         description: `Completed ${missedTasks.length} missed tasks`,
//                         duration: 5000,
//                       })
//                     }, 0)
//                   }}
//                   className="gap-1"
//                 >
//                   <CheckCircle className="w-4 h-4" />
//                   Complete All
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => {
//                     missedTasks.forEach(task => {
//                       rescheduleMissedTaskToFreePeriod(task)
//                     })
//                   }}
//                   className="gap-1"
//                 >
//                   <RefreshCw className="w-4 h-4" />
//                   Delay All
//                 </Button>
//               </div>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     )
//   }

//   // Render feedback modal
//   const renderFeedbackModal = () => {
//     if (!taskForFeedback) return null

//     return (
//       <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <CheckCircle className="w-5 h-5 text-green-500" />
//               How was your task?
//             </DialogTitle>
//             <DialogDescription>
//               Rate your focus and let us know how it went
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-6 py-4">
//             {/* Task info */}
//             <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
//               <div className="flex items-center gap-3">
//                 <div 
//                   className="p-2 rounded-lg"
//                   style={{ backgroundColor: `${taskForFeedback.color}20` }}
//                 >
//                   {(() => {
//                     const Icon = getIconComponent(taskForFeedback.icon || 'Clock')
//                     return <Icon className="w-5 h-5" style={{ color: taskForFeedback.color }} />
//                   })()}
//                 </div>
//                 <div>
//                   <div className="font-bold">{taskForFeedback.title}</div>
//                   <div className="text-sm text-gray-600 dark:text-gray-400">
//                     {taskForFeedback.subject} • {taskForFeedback.duration} minutes
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Focus level slider */}
//             <div className="space-y-3">
//               <Label className="flex items-center justify-between">
//                 <span>Focus Level</span>
//                 <Badge className={`
//                   ${feedbackFocus >= 8 ? 'bg-green-100 text-green-800' :
//                     feedbackFocus >= 5 ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-red-100 text-red-800'}
//                 `}>
//                   {feedbackFocus}/10
//                 </Badge>
//               </Label>
//               <Slider
//                 value={[feedbackFocus]}
//                 onValueChange={(value) => setFeedbackFocus(value[0])}
//                 min={1}
//                 max={10}
//                 step={1}
//                 className="py-4"
//               />
//               <div className="flex justify-between text-xs text-gray-500">
//                 <span>Poor Focus</span>
//                 <span>Average</span>
//                 <span>Excellent Focus</span>
//               </div>
//             </div>

//             {/* Completed well toggle */}
//             <div className="flex items-center space-x-2">
//               <Switch
//                 id="completed-well"
//                 checked={feedbackCompletedWell}
//                 onCheckedChange={setFeedbackCompletedWell}
//               />
//               <Label htmlFor="completed-well" className="font-medium">
//                 I completed the task well
//               </Label>
//             </div>

//             {/* Notes */}
//             <div className="space-y-2">
//               <Label htmlFor="feedback-notes">Notes (optional)</Label>
//               <Textarea
//                 id="feedback-notes"
//                 placeholder="How did it go? Any challenges?"
//                 value={feedbackNotes}
//                 onChange={(e) => setFeedbackNotes(e.target.value)}
//                 rows={3}
//               />
//             </div>
//           </div>
          
//           <DialogFooter className="gap-2">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowFeedbackModal(false)
//                 setTaskForFeedback(null)
//               }}
//             >
//               Cancel
//             </Button>
//             <Button onClick={completeTaskWithFeedback}>
//               Submit Feedback
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   // Render timetable grid
//   const renderTimetableGrid = () => {
//     const cellHeight = compactMode ? 60 : 80

//     if (loading) {
//       return (
//         <Card>
//           <CardContent className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
//               <p className="text-gray-600 dark:text-gray-400">Loading your timetable...</p>
//             </div>
//           </CardContent>
//         </Card>
//       )
//     }

//     if (error) {
//       return (
//         <Card>
//           <CardContent className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//               <p className="text-red-600 dark:text-red-400 mb-2">Failed to load timetable</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
//               <Button onClick={() => window.location.reload()}>
//                 <RefreshCw className="w-4 h-4 mr-2" />
//                 Retry
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )
//     }

//     return (
//       <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
//         <div className="min-w-[1000px]">
//           {/* Header row - Days */}
//           <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
//             <div className="w-24 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 p-4">
//               <div className="font-bold text-gray-900 dark:text-gray-100">Time</div>
//             </div>
//             {days.map((day, index) => {
//               const isToday = day === getCurrentDay()
//               return (
//                 <div
//                   key={day}
//                   className={`flex-1 p-4 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0 transition-all ${
//                     isToday 
//                       ? 'bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-700 relative' 
//                       : ['Sat', 'Sun'].includes(day) 
//                       ? "bg-blue-50/50 dark:bg-blue-900/20" 
//                       : "bg-white dark:bg-gray-800"
//                   }`}
//                 >
//                   <div className="flex flex-col items-center gap-1">
//                     <div className="flex items-center gap-2">
//                       <span className={`font-bold text-lg ${
//                         isToday ? 'text-blue-700 dark:text-blue-300' :
//                         ['Sat', 'Sun'].includes(day) ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-gray-100"
//                       }`}>
//                         {day}
//                       </span>
//                       {isToday && (
//                         <>
//                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
//                           <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
//                         </>
//                       )}
//                     </div>
//                     <span className="text-sm text-gray-500 dark:text-gray-400">
//                       {isToday ? 'Today' : ['Sat', 'Sun'].includes(day) ? "Weekend" : "Weekday"}
//                     </span>
//                     {isToday && (
//                       <Badge className="mt-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
//                         Current Day
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>

//           {/* Time slots grid */}
//           <div className="flex flex-col">
//             {timeSlots.map((time, timeIndex) => {
//               const displayTime = formatTimeDisplay(time)
//               const isHourMark = time.endsWith(':00')
//               const isCurrentTimeSlot = isCurrentTime(time)
//               const isBedtime = time === bedtime
              
//               return (
//                 <div 
//                   key={time} 
//                   className={`flex border-b border-gray-200 dark:border-gray-800 last:border-b-0 ${
//                     isCurrentTimeSlot ? 'bg-yellow-50/30 dark:bg-yellow-900/10' :
//                     isBedtime ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''
//                   }`}
//                   style={{ height: `${cellHeight}px` }}
//                 >
//                   {/* Time column */}
//                   <div className={`w-24 flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 flex items-center justify-center ${
//                     isCurrentTimeSlot ? 'bg-yellow-100 dark:bg-yellow-900/20' :
//                     isBedtime ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-800'
//                   }`}>
//                     <div className={`text-center ${isHourMark ? 'font-bold' : 'text-gray-600 dark:text-gray-400'} ${
//                       isCurrentTimeSlot ? 'text-yellow-700 dark:text-yellow-300' :
//                       isBedtime ? 'text-purple-700 dark:text-purple-300' : ''
//                     }`}>
//                       <div className="flex items-center gap-1">
//                         <div className="text-sm">{displayTime}</div>
//                         {isCurrentTimeSlot && (
//                           <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
//                         )}
//                         {isBedtime && (
//                           <Bed className="w-3 h-3" />
//                         )}
//                       </div>
//                       {isHourMark && (
//                         <div className="text-xs text-gray-500 dark:text-gray-400">Hour</div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Day columns */}
//                   {days.map(day => {
//                     const dayTasks = tasks[day] || []
//                     const tasksInCell = dayTasks.filter(task => {
//                       const taskStartMinutes = convertTimeToMinutes(task.startTime)
//                       const taskEndMinutes = convertTimeToMinutes(task.endTime)
//                       const cellMinutes = convertTimeToMinutes(time)
//                       return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
//                     })
                    
//                     const primaryTask = tasksInCell.find(task => 
//                       convertTimeToMinutes(task.startTime) === convertTimeToMinutes(time)
//                     ) || tasksInCell[0]
                    
//                     return (
//                       <div
//                         key={`${day}-${time}`}
//                         className={`flex-1 border-r border-gray-200 dark:border-gray-800 last:border-r-0 relative group ${
//                           primaryTask ? 'cursor-pointer' : ''
//                         } ${isHourMark ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''}`}
//                         onClick={() => {
//                           if (primaryTask) {
//                             setSelectedTask(primaryTask)
//                             setShowTaskModal(true)
//                           }
//                         }}
//                       >
//                         {primaryTask && shouldShowTaskInCell(primaryTask, day, time) && (
//                           <TaskCell 
//                             task={primaryTask} 
//                             cellHeight={cellHeight} 
//                             isCurrent={isTaskCurrent(primaryTask)}
//                             isOverdue={isTaskOverdue(primaryTask)}
//                           />
//                         )}

//                         {/* Current time indicator line */}
//                         {isCurrentTimeSlot && !primaryTask && (
//                           <div className="absolute inset-0 border-l-2 border-yellow-500">
//                             <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
//                             <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-500 rounded-full" />
//                           </div>
//                         )}

//                         {/* Bedtime indicator */}
//                         {isBedtime && !primaryTask && (
//                           <div className="absolute inset-0 border-l-2 border-purple-500">
//                             <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-500 rounded-full" />
//                           </div>
//                         )}

//                         {/* Free period indicator */}
//                         {day === getCurrentDay() && primaryTask?.apiType === 'FREE' && (
//                           <div className="absolute top-1 right-1">
//                             <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-[8px] px-1">
//                               Free
//                             </Badge>
//                           </div>
//                         )}

//                         {/* Fixed time indicator */}
//                         {day === getCurrentDay() && primaryTask?.apiType === 'FIXED' && (
//                           <div className="absolute top-1 right-1">
//                             <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-[8px] px-1">
//                               Fixed
//                             </Badge>
//                           </div>
//                         )}
//                       </div>
//                     )
//                   })}
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Render calendar view
//   const renderCalendarView = () => {
//     const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

//     if (loading) {
//       return (
//         <Card>
//           <CardContent className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
//               <p className="text-gray-600 dark:text-gray-400">Loading calendar...</p>
//             </div>
//           </CardContent>
//         </Card>
//       )
//     }

//     if (error) {
//       return (
//         <Card>
//           <CardContent className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//               <p className="text-red-600 dark:text-red-400 mb-2">Failed to load calendar</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
//               <Button onClick={() => window.location.reload()}>
//                 <RefreshCw className="w-4 h-4 mr-2" />
//                 Retry
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )
//     }

//     return (
//       <Card className="overflow-hidden">
//         <CardHeader className="pb-3">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//             <div>
//               <CardTitle className="flex items-center gap-2">
//                 <Calendar className="w-5 h-5" />
//                 Calendar View
//               </CardTitle>
//               <CardDescription>
//                 {getMonthName(currentMonth)} {currentYear} • Drag and drop tasks to reschedule
//               </CardDescription>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCalendarView('month')}
//                   className={calendarView === 'month' ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
//                 >
//                   Month
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCalendarView('week')}
//                   className={calendarView === 'week' ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
//                 >
//                   Week
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCalendarView('day')}
//                   className={calendarView === 'day' ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
//                 >
//                   Day
//                 </Button>
//               </div>
              
//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={goToPreviousMonth}
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={goToToday}
//                 >
//                   Today
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={goToNextMonth}
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </CardHeader>
        
//         <CardContent>
//           {/* Month View */}
//           {calendarView === 'month' && (
//             <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
//               {/* Calendar Header - Days */}
//               <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
//                 {dayHeaders.map((day, index) => (
//                   <div
//                     key={day}
//                     className="p-3 text-center font-medium bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-800 last:border-r-0"
//                   >
//                     <span className={index === 0 || index === 6 ? "text-blue-600 dark:text-blue-400" : ""}>
//                       {day}
//                     </span>
//                   </div>
//                 ))}
//               </div>
              
//               {/* Calendar Grid */}
//               <div className="grid grid-cols-7">
//                 {calendarDays.map((day, index) => (
//                   <div
//                     key={index}
//                     className={cn(
//                       "min-h-[120px] border-r border-b border-gray-200 dark:border-gray-800 p-2 relative",
//                       !day.isCurrentMonth && "bg-gray-50/50 dark:bg-gray-900/30",
//                       day.isWeekend && day.isCurrentMonth && "bg-blue-50/30 dark:bg-blue-900/10",
//                       day.isToday && "bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-500",
//                       index % 7 === 6 && "border-r-0",
//                       index >= calendarDays.length - 7 && "border-b-0"
//                     )}
//                     onDragOver={(e) => handleDragOver(e, day.date)}
//                     onDrop={(e) => handleDrop(e, day.date)}
//                     onClick={() => {
//                       setSelectedDate(day.date)
//                       if (calendarView !== 'day') {
//                         setCalendarView('day')
//                       }
//                     }}
//                   >
//                     {/* Date header */}
//                     <div className="flex items-center justify-between mb-1">
//                       <span className={cn(
//                         "font-medium text-sm",
//                         !day.isCurrentMonth && "text-gray-400 dark:text-gray-600",
//                         day.isToday && "text-blue-600 dark:text-blue-400 font-bold"
//                       )}>
//                         {day.date.getDate()}
//                       </span>
                      
//                       {day.isToday && (
//                         <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
//                       )}
                      
//                       {day.tasks.length > 0 && (
//                         <Badge variant="outline" className="h-5 px-1.5 text-xs">
//                           {day.tasks.length}
//                         </Badge>
//                       )}
//                     </div>
                    
//                     {/* Tasks for the day */}
//                     <div className="space-y-1 overflow-y-auto max-h-[80px]">
//                       {day.tasks.slice(0, 3).map((task) => (
//                         <div
//                           key={task.id}
//                           className="text-xs p-1.5 rounded border cursor-pointer hover:shadow-sm transition-shadow"
//                           style={{ 
//                             backgroundColor: `${task.color}15`,
//                             borderColor: `${task.color}30`
//                           }}
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             setSelectedTask(task)
//                             setShowTaskModal(true)
//                           }}
//                         >
//                           <div className="flex items-center gap-1">
//                             <div 
//                               className="w-2 h-2 rounded-full flex-shrink-0"
//                               style={{ backgroundColor: task.color }}
//                             />
//                             <span className="truncate font-medium">{task.title}</span>
//                           </div>
//                           <div className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
//                             {formatTimeDisplay(task.startTime)}
//                           </div>
//                         </div>
//                       ))}
                      
//                       {day.tasks.length > 3 && (
//                         <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
//                           +{day.tasks.length - 3} more
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* Week View */}
//           {calendarView === 'week' && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-bold">
//                   Week of {formatDate(calendarDays[0].date)}
//                 </h3>
//                 <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
//                   {calendarDays.filter(d => d.isCurrentMonth).length} days
//                 </Badge>
//               </div>
              
//               <div className="grid grid-cols-7 gap-2">
//                 {calendarDays.slice(0, 7).map((day, index) => (
//                   <div
//                     key={index}
//                     className={cn(
//                       "rounded-lg border p-3 min-h-[200px]",
//                       day.isToday && "border-blue-500 bg-blue-50 dark:bg-blue-900/10",
//                       !day.isCurrentMonth && "opacity-60"
//                     )}
//                   >
//                     <div className="flex items-center justify-between mb-3">
//                       <div>
//                         <div className="font-bold">{dayHeaders[index]}</div>
//                         <div className={cn(
//                           "text-2xl font-bold",
//                           day.isToday && "text-blue-600 dark:text-blue-400"
//                         )}>
//                           {day.date.getDate()}
//                         </div>
//                       </div>
//                       {day.isToday && (
//                         <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
//                       )}
//                     </div>
                    
//                     <div className="space-y-2">
//                       {day.tasks.slice(0, 4).map((task) => (
//                         <div
//                           key={task.id}
//                           className="p-2 rounded text-sm cursor-pointer hover:shadow-sm transition-shadow"
//                           style={{ 
//                             backgroundColor: `${task.color}15`,
//                             borderLeft: `3px solid ${task.color}`
//                           }}
//                           onClick={() => {
//                             setSelectedTask(task)
//                             setShowTaskModal(true)
//                           }}
//                         >
//                           <div className="font-medium truncate">{task.title}</div>
//                           <div className="text-xs text-gray-600 dark:text-gray-400">
//                             {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
//                           </div>
//                         </div>
//                       ))}
                      
//                       {day.tasks.length === 0 && (
//                         <div className="text-sm text-gray-400 dark:text-gray-600 text-center py-4">
//                           No tasks
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
          
//           {/* Day View */}
//           {calendarView === 'day' && selectedDate && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-bold text-xl">
//                   {formatDate(selectedDate)}
//                 </h3>
//                 <div className="flex items-center gap-2">
//                   <Badge className={cn(
//                     selectedDate.getDay() === 0 || selectedDate.getDay() === 6 
//                       ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
//                       : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
//                   )}>
//                     {dayHeaders[selectedDate.getDay()]}
//                   </Badge>
//                   {selectedDate.toDateString() === new Date().toDateString() && (
//                     <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 animate-pulse">
//                       Today
//                     </Badge>
//                   )}
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                 {/* Time slots */}
//                 <div className="lg:col-span-3">
//                   <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
//                     <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-800">
//                       <div className="flex items-center justify-between">
//                         <div className="font-medium">Schedule</div>
//                         <Badge>
//                           {calendarDays.find(d => 
//                             d.date.toDateString() === selectedDate.toDateString()
//                           )?.tasks.length || 0} tasks
//                         </Badge>
//                       </div>
//                     </div>
                    
//                     <div className="divide-y divide-gray-200 dark:divide-gray-800">
//                       {timeSlots.map((time) => {
//                         const dayName = dayHeaders[selectedDate.getDay()]
//                         const dayTasks = tasks[dayName] || []
//                         const tasksAtTime = dayTasks.filter(task => {
//                           if (!task.date) return false
//                           return task.date.toDateString() === selectedDate.toDateString() &&
//                                  convertTimeToMinutes(task.startTime) <= convertTimeToMinutes(time) &&
//                                  convertTimeToMinutes(task.endTime) > convertTimeToMinutes(time)
//                         })
                        
//                         return (
//                           <div 
//                             key={time}
//                             className="p-3 min-h-[60px] hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
//                           >
//                             <div className="flex">
//                               <div className="w-20 flex-shrink-0">
//                                 <div className="font-medium text-gray-700 dark:text-gray-300">
//                                   {formatTimeDisplay(time)}
//                                 </div>
//                               </div>
                              
//                               <div className="flex-1">
//                                 {tasksAtTime.map((task) => (
//                                   <div
//                                     key={task.id}
//                                     className="mb-2 last:mb-0 p-2 rounded border cursor-pointer hover:shadow-sm transition-shadow"
//                                     style={{ 
//                                       backgroundColor: `${task.color}15`,
//                                       borderColor: `${task.color}30`
//                                     }}
//                                     onClick={() => {
//                                       setSelectedTask(task)
//                                       setShowTaskModal(true)
//                                     }}
//                                   >
//                                     <div className="flex items-center justify-between">
//                                       <div className="font-medium">{task.title}</div>
//                                       <Badge className="text-xs">
//                                         {task.status}
//                                       </Badge>
//                                     </div>
//                                     <div className="text-sm text-gray-600 dark:text-gray-400">
//                                       {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)} • {task.duration} min
//                                     </div>
//                                   </div>
//                                 ))}
                                
//                                 {tasksAtTime.length === 0 && (
//                                   <div className="text-sm text-gray-400 dark:text-gray-600">
//                                     No tasks scheduled
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Day stats */}
//                 <div className="space-y-4">
//                   <Card>
//                     <CardHeader className="pb-3">
//                       <CardTitle className="text-sm">Day Summary</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</span>
//                         <span className="font-bold">
//                           {calendarDays.find(d => 
//                             d.date.toDateString() === selectedDate.toDateString()
//                           )?.tasks.length || 0}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
//                         <span className="font-bold">
//                           {(() => {
//                             const dayName = dayHeaders[selectedDate.getDay()]
//                             const dayTasks = tasks[dayName] || []
//                             const totalMinutes = dayTasks
//                               .filter(task => task.date?.toDateString() === selectedDate.toDateString())
//                               .reduce((sum, task) => sum + task.duration, 0)
//                             return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
//                           })()}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
//                         <span className="font-bold">
//                           {calendarDays.find(d => 
//                             d.date.toDateString() === selectedDate.toDateString()
//                           )?.tasks.filter(t => t.status === 'completed').length || 0}
//                         </span>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     )
//   }

//   // Render smart delay modal
//   const renderDelayModal = () => {
//     if (!taskToDelay || !smartDelayOptions) return null

//     return (
//       <Dialog open={showDelayModal} onOpenChange={setShowDelayModal}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <CalendarClock className="w-5 h-5" />
//               Smart Delay Options
//             </DialogTitle>
//             <DialogDescription>
//               Intelligent scheduling for "{taskToDelay.title}"
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             {/* Current task info */}
//             <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
//               <div className="flex items-center gap-3">
//                 <div 
//                   className="p-2 rounded-lg"
//                   style={{ backgroundColor: `${taskToDelay.color}20` }}
//                 >
//                   {(() => {
//                     const Icon = getIconComponent(taskToDelay.icon || 'Clock')
//                     return <Icon className="w-5 h-5" style={{ color: taskToDelay.color }} />
//                   })()}
//                 </div>
//                 <div>
//                   <div className="font-bold">{taskToDelay.title}</div>
//                   <div className="text-sm text-gray-600 dark:text-gray-400">
//                     Current: {taskToDelay.day} {formatTimeDisplay(taskToDelay.startTime)} - {formatTimeDisplay(taskToDelay.endTime)}
//                     <br />
//                     Duration: {taskToDelay.duration} minutes • Bedtime: {formatTimeDisplay(bedtime)}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Smart suggestion */}
//             <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
//               <div className="flex items-start gap-2">
//                 <Brain className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
//                 <div>
//                   <div className="font-medium text-green-800 dark:text-green-300">Smart Suggestion</div>
//                   <div className="text-sm text-green-700 dark:text-green-400 mt-1">
//                     {smartDelayOptions.suggestion}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Available slots */}
//             {smartDelayOptions.availableSlots.length > 0 && (
//               <div className="space-y-3">
//                 <h4 className="font-medium">Available Time Slots</h4>
//                 <div className="space-y-2 max-h-60 overflow-y-auto">
//                   {smartDelayOptions.availableSlots.map((slot, index) => (
//                     <div 
//                       key={index}
//                       className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
//                         slot.type === 'immediate' 
//                           ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
//                           : slot.type === 'free-period'
//                           ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
//                           : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
//                       }`}
//                       onClick={() => applySmartDelay(smartDelayOptions, index)}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <div className="font-medium">
//                             {slot.day} at {formatTimeDisplay(slot.startTime)}
//                           </div>
//                           <div className="text-sm text-gray-600 dark:text-gray-400">
//                             {formatTimeDisplay(slot.endTime)} • {slot.duration} min
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Badge className={`
//                             ${slot.type === 'immediate' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
//                               slot.type === 'free-period' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
//                               'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}
//                           `}>
//                             {slot.type === 'immediate' ? 'Immediate' :
//                              slot.type === 'free-period' ? 'Free Period' :
//                              slot.type === 'evening' ? 'Evening' : 'Next Day'}
//                           </Badge>
//                           <Button size="sm" variant="outline">
//                             Select
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Extension option */}
//             {smartDelayOptions.canExtend && smartDelayOptions.maxExtension > 0 && (
//               <div className="p-3 rounded-lg border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="font-medium">Extend Current Time</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-400">
//                       Complete before {formatTimeDisplay(bedtime)} • Max extension: {smartDelayOptions.maxExtension} minutes
//                     </div>
//                   </div>
//                   <Button
//                     variant="outline"
//                     onClick={() => applySmartDelay(smartDelayOptions)}
//                   >
//                     Extend Now
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {/* No options warning */}
//             {smartDelayOptions.availableSlots.length === 0 && !smartDelayOptions.canExtend && (
//               <div className="p-3 rounded-lg border border-red-500 bg-red-50 dark:bg-red-900/20">
//                 <div className="flex items-start gap-2">
//                   <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
//                   <div>
//                     <div className="font-medium text-red-800 dark:text-red-300">No Available Slots</div>
//                     <div className="text-sm text-red-700 dark:text-red-400 mt-1">
//                       Consider reducing task duration or marking as skipped.
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Quick delay buttons */}
//             <div className="pt-4 border-t">
//               <div className="text-sm font-medium mb-2">Quick Delay (if slot available)</div>
//               <div className="grid grid-cols-4 gap-2">
//                 {[15, 30, 60, 90].map((minutes) => (
//                   <Button
//                     key={minutes}
//                     variant="outline"
//                     size="sm"
//                     onClick={() => {
//                       simpleDelayTask(taskToDelay.id, minutes)
//                       setShowDelayModal(false)
//                     }}
//                     disabled={convertTimeToMinutes(taskToDelay.endTime) + minutes > convertTimeToMinutes(bedtime)}
//                   >
//                     {minutes} min
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           </div>
          
//           <DialogFooter className="gap-2">
//             <Button
//               variant="outline"
//               onClick={() => setShowDelayModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 skipTask(taskToDelay.id)
//                 setShowDelayModal(false)
//               }}
//             >
//               Skip Task
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     )
//   }

//   // Render list view
//   const renderListView = () => {
//     if (loading) {
//       return (
//         <Card>
//           <CardContent className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
//               <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
//             </div>
//           </CardContent>
//         </Card>
//       )
//     }

//     if (error) {
//       return (
//         <Card>
//           <CardContent className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//               <p className="text-red-600 dark:text-red-400 mb-2">Failed to load tasks</p>
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
//               <Button onClick={() => window.location.reload()}>
//                 <RefreshCw className="w-4 h-4 mr-2" />
//                 Retry
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )
//     }

//     const allTasks = Object.values(tasks)
//       .flat()
//       .filter(isRealActivity) // Only show real activities in list view
//       .sort((a, b) => {
//         const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//         const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
//         if (dayDiff !== 0) return dayDiff
//         return convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime)
//       })

//     if (allTasks.length === 0) {
//       return (
//         <Card>
//           <CardContent className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600 dark:text-gray-400 mb-2">No tasks found</p>
//               <p className="text-sm text-gray-500 dark:text-gray-500">
//                 Your timetable is empty. Add tasks to get started.
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       )
//     }

//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>List View</CardTitle>
//           <CardDescription>All tasks in chronological order</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {allTasks.map((task, index) => {
//               const Icon = getIconComponent(task.icon || 'Clock')
//               const isCurrent = isTaskCurrent(task)
//               const isOverdue = isTaskOverdue(task)
//               const inGracePeriod = isTaskInGracePeriod(task)
//               const isToday = task.day === getCurrentDay()
              
//               return (
//                 <motion.div
//                   key={task.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
//                     isCurrent 
//                       ? 'border-blue-500 bg-gradient-to-r from-blue-500/10 to-blue-500/5 shadow-lg shadow-blue-500/20' 
//                       : task.status === 'completed'
//                       ? 'border-green-500/30 bg-green-500/5'
//                       : inGracePeriod
//                       ? 'border-yellow-500 bg-yellow-500/5 animate-pulse'
//                       : isOverdue
//                       ? 'border-red-500/30 bg-red-500/5'
//                       : isToday
//                       ? 'border-purple-500/30 bg-purple-500/5'
//                       : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
//                   }`}
//                   onClick={() => {
//                     setSelectedTask(task)
//                     setShowTaskModal(true)
//                   }}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-start gap-3">
//                       <div 
//                         className="p-2 rounded-lg"
//                         style={{ backgroundColor: `${task.color}20` }}
//                       >
//                         <Icon className="w-5 h-5" style={{ color: task.color }} />
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2 mb-1">
//                           <h3 className="font-bold text-lg">{task.title}</h3>
//                           <Badge 
//                             className="text-xs"
//                             style={{ backgroundColor: `${task.color}20`, color: task.color }}
//                           >
//                             {task.apiType === 'FIXED' ? 'Fixed' : 'Free'}
//                           </Badge>
//                           {isCurrent && (
//                             <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse">
//                               LIVE NOW
//                             </Badge>
//                           )}
//                           {inGracePeriod && (
//                             <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 animate-pulse">
//                               ⏰ Need Feedback
//                             </Badge>
//                           )}
//                           {isOverdue && !inGracePeriod && (
//                             <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
//                               OVERDUE
//                             </Badge>
//                           )}
//                           {isToday && !isCurrent && !isOverdue && !inGracePeriod && (
//                             <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
//                               Today
//                             </Badge>
//                           )}
//                         </div>
//                         <p className="text-gray-600 dark:text-gray-400">
//                           {task.day} • {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)} • {task.duration} min
//                         </p>
//                         {task.focusScore && (
//                           <div className="flex items-center gap-1 mt-1">
//                             <div className="flex">
//                               {[1, 2, 3, 4, 5].map((star) => (
//                                 <StarIcon
//                                   key={star}
//                                   className={cn(
//                                     "w-3 h-3",
//                                     star <= (task.focusScore || 0) / 2
//                                       ? "text-yellow-500 fill-yellow-500"
//                                       : "text-gray-300 dark:text-gray-600"
//                                   )}
//                                 />
//                               ))}
//                             </div>
//                             <span className="text-xs text-gray-500">Focus: {task.focusScore}/10</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-2">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="sm">
//                             <MoreVertical className="w-4 h-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
//                           <DropdownMenuSeparator />
//                           {task.status === 'pending' && !inGracePeriod && isRealActivity(task) ? (
//                             <DropdownMenuItem onClick={() => startTaskTimer(task.id)}>
//                               <PlayCircle className="w-4 h-4 mr-2" />
//                               Start Task
//                             </DropdownMenuItem>
//                           ) : task.status === 'in-progress' ? (
//                             <DropdownMenuItem onClick={() => stopTaskTimer(task.id)}>
//                               <StopCircle className="w-4 h-4 mr-2" />
//                               Complete Task
//                             </DropdownMenuItem>
//                           ) : inGracePeriod && isRealActivity(task) ? (
//                             <DropdownMenuItem onClick={() => {
//                               setTaskForFeedback(task)
//                               setFeedbackFocus(5)
//                               setFeedbackNotes('')
//                               setFeedbackCompletedWell(true)
//                               setShowFeedbackModal(true)
//                             }}>
//                               <CheckCircle className="w-4 h-4 mr-2" />
//                               Update Status
//                             </DropdownMenuItem>
//                           ) : null}
//                           <DropdownMenuItem onClick={() => smartDelayTask(task)}>
//                             <CalendarClock className="w-4 h-4 mr-2" />
//                             Smart Delay
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => simpleDelayTask(task.id, 30)}>
//                             <Clock className="w-4 h-4 mr-2" />
//                             Delay 30 min
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => simpleDelayTask(task.id, 60)}>
//                             <Clock className="w-4 h-4 mr-2" />
//                             Delay 60 min
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
                      
//                       <Badge className={`
//                         ${task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
//                           task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse' :
//                           task.status === 'missed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
//                           task.status === 'skipped' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' :
//                           task.status === 'delayed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
//                           task.status === 'rescheduled' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
//                           inGracePeriod ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 animate-pulse' :
//                           'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}
//                       `}>
//                         {inGracePeriod ? 'Need Feedback' : task.status}
//                       </Badge>
//                     </div>
//                   </div>
//                 </motion.div>
//               )
//             })}
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     const newDarkMode = !darkMode
//     setDarkMode(newDarkMode)
//     if (newDarkMode) {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//   }

//   // Update bedtime
//   const updateBedtime = (newBedtime: string) => {
//     setBedtime(newBedtime)
    
//     // Update all tasks with new bedtime
//     setTasks(prev => {
//       const updated = { ...prev }
//       for (const day in updated) {
//         updated[day] = updated[day].map(task => ({
//           ...task,
//           bedtime: newBedtime
//         }))
//       }
//       return updated
//     })
    
//     setTimeout(() => {
//       toast("Bedtime updated", {
//         description: `All tasks will now complete before ${formatTimeDisplay(newBedtime)}`,
//       })
//     }, 0)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="space-y-8"
//         >
//           {/* Header */}
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//             <div>
//               <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
//                 <span>Dashboard</span>
//                 <ChevronRight className="w-4 h-4" />
//                 <span className="font-medium text-gray-900 dark:text-gray-100">Smart Timetable</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <h1 className="text-3xl font-bold">Intelligent Task Scheduler</h1>
//                 <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
//                   <div className="flex items-center gap-1">
//                     <Brain className="w-3 h-3" />
//                     SMART
//                   </div>
//                 </Badge>
//               </div>
//               <p className="text-gray-600 dark:text-gray-400">
//                 {loading ? 'Loading your schedule...' : 
//                  error ? 'Error loading schedule' :
//                  `${Object.values(tasks).flat().filter(isRealActivity).length} tasks • Smart delay • 1-hour grace period • Bedtime protection`}
//               </p>
//             </div>
            
//             <div className="flex items-center gap-3">
//               {/* Day indicator */}
//               <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-purple-500/20">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                   <div className="text-sm font-medium">
//                     {currentDayFull} ({currentDay})
//                   </div>
//                 </div>
//               </div>

//               {/* Bedtime Selector */}
//               <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 dark:border-pink-500/20">
//                 <div className="flex items-center gap-2">
//                   <Bed className="w-4 h-4 text-purple-600 dark:text-purple-400" />
//                   <div className="text-sm">
//                     <div className="font-medium">Bedtime</div>
//                     <Select value={bedtime} onValueChange={updateBedtime}>
//                       <SelectTrigger className="h-6 text-xs w-24">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="22:00">10:00 PM</SelectItem>
//                         <SelectItem value="23:00">11:00 PM</SelectItem>
//                         <SelectItem value="00:00">12:00 AM</SelectItem>
//                         <SelectItem value="01:00">1:00 AM</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Current Time Display */}
//               <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-purple-500/20">
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                   <div className="text-sm font-medium">
//                     {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </div>
//                 </div>
//               </div>
              
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={toggleDarkMode}
//                 className="gap-2"
//               >
//                 {darkMode ? (
//                   <>
//                     <SunIcon className="w-4 h-4" />
//                     Light
//                   </>
//                 ) : (
//                   <>
//                     <MoonIcon className="w-4 h-4" />
//                     Dark
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>

//           {/* Smart Stats Bar */}
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             {[
//               { 
//                 label: 'On-Time Tasks', 
//                 value: `${stats.onTimeTasks}/${stats.totalTasks}`, 
//                 icon: CheckCircle,
//                 color: 'text-green-500',
//                 bgColor: 'bg-green-500/10',
//                 progress: stats.onTimeRate
//               },
//               { 
//                 label: 'Rescheduled', 
//                 value: `${stats.rescheduledTasks}`, 
//                 icon: CalendarClock,
//                 color: 'text-purple-500',
//                 bgColor: 'bg-purple-500/10'
//               },
//               { 
//                 label: 'Active Now', 
//                 value: activeTasks.length.toString(), 
//                 icon: PlayCircle,
//                 color: 'text-blue-500',
//                 bgColor: 'bg-blue-500/10',
//                 trend: 'Live'
//               },
//               { 
//                 label: 'Focus Score', 
//                 value: `${stats.avgFocusScore}/10`, 
//                 icon: TargetIcon2,
//                 color: 'text-yellow-500',
//                 bgColor: 'bg-yellow-500/10',
//                 progress: stats.avgFocusScore * 10
//               },
//               { 
//                 label: 'Missed Tasks', 
//                 value: `${missedTasks.length}`, 
//                 icon: Clock,
//                 color: 'text-red-500',
//                 bgColor: 'bg-red-500/10'
//               },
//             ].map((stat, index) => (
//               <motion.div
//                 key={stat.label}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
//               >
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className={`p-2 rounded-lg ${stat.bgColor}`}>
//                     <stat.icon className={`w-5 h-5 ${stat.color}`} />
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-2xl font-bold">{stat.value}</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
//                   </div>
//                   {stat.trend && (
//                     <Badge className={`
//                       ${stat.trend === 'Live' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse' : ''}
//                     `}>
//                       {stat.trend}
//                     </Badge>
//                   )}
//                 </div>
//                 {stat.progress !== undefined && (
//                   <Progress value={stat.progress} className="h-2" />
//                 )}
//               </motion.div>
//             ))}
//           </div>

//           {/* Main Content */}
//           <div className="space-y-6">
//             {/* Controls */}
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//                   <div className="flex items-center gap-4">
//                     <Button
//                       variant={view === 'grid' ? 'default' : 'outline'}
//                       onClick={() => setView('grid')}
//                       className="gap-2"
//                     >
//                       <Grid3x3 className="w-4 h-4" />
//                       Grid View
//                     </Button>
//                     <Button
//                       variant={view === 'list' ? 'default' : 'outline'}
//                       onClick={() => setView('list')}
//                       className="gap-2"
//                     >
//                       <ListIcon className="w-4 h-4" />
//                       List View
//                     </Button>
//                     <Button
//                       variant={view === 'calendar' ? 'default' : 'outline'}
//                       onClick={() => setView('calendar')}
//                       className="gap-2"
//                     >
//                       <Calendar className="w-4 h-4" />
//                       Calendar View
//                     </Button>
//                   </div>
                  
//                   <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-2">
//                       <Label htmlFor="weekends" className="text-sm">
//                         Weekends
//                       </Label>
//                       <Switch
//                         id="weekends"
//                         checked={showWeekends}
//                         onCheckedChange={setShowWeekends}
//                       />
//                     </div>
                    
//                     <div className="flex items-center gap-2">
//                       <Label htmlFor="compact" className="text-sm">
//                         Compact
//                       </Label>
//                       <Switch
//                         id="compact"
//                         checked={compactMode}
//                         onCheckedChange={setCompactMode}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Current Activity Card */}
//             {currentActivity && (
//               <Card className="overflow-hidden border-2 border-blue-500/50 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
//                 <CardContent className="p-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <div className="p-3 rounded-lg bg-blue-500">
//                         {currentActivityInfo.icon && (
//                           <currentActivityInfo.icon className="w-6 h-6 text-white animate-pulse" />
//                         )}
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <h3 className="font-bold text-lg">Currently Active</h3>
//                           <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
//                         </div>
//                         <p className="text-gray-700 dark:text-gray-300">
//                           {currentActivityInfo.message}
//                         </p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {formatTimeDisplay(currentActivity.startTime)} - {formatTimeDisplay(currentActivity.endTime)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         onClick={() => {
//                           setSelectedTask(currentActivity)
//                           setShowTaskModal(true)
//                         }}
//                         className="gap-2"
//                       >
//                         View Details
//                       </Button>
//                       {currentActivity.status === 'in-progress' ? (
//                         <Button
//                           onClick={() => stopTaskTimer(currentActivity.id)}
//                           variant="destructive"
//                           className="gap-2"
//                         >
//                           <StopCircle className="w-4 h-4" />
//                           Complete
//                         </Button>
//                       ) : (
//                         <Button
//                           onClick={() => startTaskTimer(currentActivity.id)}
//                           className="gap-2"
//                         >
//                           <PlayCircle className="w-4 h-4" />
//                           Start
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Grace Period Section - Tasks that ended in last 1 hour */}
//             {gracePeriodTasks.length > 0 && renderGracePeriodSection()}

//             {/* Missed Tasks Section - Show if there are missed tasks */}
//             {missedTasks.length > 0 && renderMissedTasksSection()}

//             {/* Timetable */}
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={view}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {view === 'grid' ? renderTimetableGrid() : 
//                  view === 'calendar' ? renderCalendarView() : 
//                  renderListView()}
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {/* Stats and Sidebar Content */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left Column - Current Active Task and Delay Tips */}
//             <div className="space-y-6">
//               {/* Current Active Task (if not already shown above) */}
//               {!currentActivity && activeTasks.length > 0 && (
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <PlayCircle className="w-5 h-5 text-blue-500" />
//                       Currently Active
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-3">
//                       {activeTasks.map((task) => (
//                         <div key={task.id} className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
//                           <div className="flex items-center gap-3 mb-3">
//                             <div className="p-2 rounded-lg bg-blue-500">
//                               <PlayCircle className="w-5 h-5 text-white animate-pulse" />
//                             </div>
//                             <div>
//                               <h4 className="font-bold">{task.title}</h4>
//                               <p className="text-sm text-gray-600 dark:text-gray-400">
//                                 {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
//                               </p>
//                             </div>
//                           </div>
                          
//                           <div className="space-y-3">
//                             <div>
//                               <div className="flex justify-between text-sm mb-1">
//                                 <span>Progress</span>
//                                 <span>{Math.round(liveData.currentProgress)}%</span>
//                               </div>
//                               <Progress value={liveData.currentProgress} className="h-2" />
//                             </div>
                            
//                             <div className="flex gap-2">
//                               <Button 
//                                 className="flex-1 gap-2" 
//                                 onClick={() => stopTaskTimer(task.id)}
//                                 variant="destructive"
//                               >
//                                 <StopCircle className="w-4 h-4" />
//                                 Complete
//                               </Button>
//                               <Button 
//                                 variant="outline" 
//                                 className="flex-1 gap-2"
//                                 onClick={() => smartDelayTask(task)}
//                               >
//                                 <CalendarClock className="w-4 h-4" />
//                                 Delay
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Smart Delay Tips */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Brain className="w-5 h-5 text-purple-500" />
//                     Smart Delay Tips
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {[
//                       {
//                         tip: '1-hour grace period to update task status',
//                         icon: AlarmClock,
//                         color: 'text-yellow-500'
//                       },
//                       {
//                         tip: 'Never delayed past your bedtime',
//                         icon: Bed,
//                         color: 'text-pink-500'
//                       },
//                       {
//                         tip: 'Free periods are prioritized for delays',
//                         icon: CoffeeIcon,
//                         color: 'text-green-500'
//                       },
//                       {
//                         tip: 'Rate your focus to track progress',
//                         icon: StarIcon,
//                         color: 'text-yellow-500'
//                       },
//                     ].map((tip, index) => (
//                       <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
//                         <div className={`p-2 rounded-lg ${tip.color.replace('text-', 'bg-')}/10`}>
//                           <tip.icon className={`w-4 h-4 ${tip.color}`} />
//                         </div>
//                         <div className="text-sm">{tip.tip}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Middle Column - Upcoming Tasks */}
//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Clock className="w-5 h-5" />
//                     Upcoming Tasks
//                   </CardTitle>
//                   <CardDescription>
//                     Next tasks with smart delay options
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {Object.values(tasks)
//                       .flat()
//                       .filter(task => (task.status === 'pending' || task.status === 'rescheduled') && isRealActivity(task))
//                       .filter(task => !isInGracePeriod(task))
//                       .sort((a, b) => {
//                         const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//                         const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
//                         if (dayDiff !== 0) return dayDiff
//                         return convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime)
//                       })
//                       .slice(0, 4)
//                       .map((task, index) => {
//                         const Icon = getIconComponent(task.icon || 'Clock')
//                         const minutesUntil = Math.max(0, convertTimeToMinutes(task.startTime) - 
//                           (currentTime.getHours() * 60 + currentTime.getMinutes()))
                        
//                         return (
//                           <div key={task.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
//                             <div className="flex items-center gap-3">
//                               <div 
//                                 className="p-2 rounded-lg"
//                                 style={{ backgroundColor: `${task.color}20` }}
//                               >
//                                 <Icon className="w-4 h-4" style={{ color: task.color }} />
//                               </div>
//                               <div className="flex-1">
//                                 <div className="font-medium">{task.title}</div>
//                                 <div className="text-sm text-gray-600 dark:text-gray-400">
//                                   {task.day} at {formatTimeDisplay(task.startTime)}
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
//                                   in {minutesUntil} min
//                                 </div>
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   className="mt-1"
//                                   onClick={() => smartDelayTask(task)}
//                                 >
//                                   Delay
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Right Column - Quick Delay Actions */}
//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <ZapIcon className="w-5 h-5 text-yellow-500" />
//                     Quick Actions
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {[
//                       { icon: CalendarClock, label: 'Smart Delay All', description: 'Delay all upcoming tasks intelligently' },
//                       { icon: CheckCircle, label: 'Complete Missed', description: 'Complete all missed tasks before bedtime' },
//                       { icon: RefreshCw, label: 'Delay All Missed', description: 'Reschedule all missed tasks to free periods' },
//                     ].map((action, index) => (
//                       <Button
//                         key={index}
//                         variant="outline"
//                         className="w-full justify-start gap-3 p-3 h-auto"
//                         onClick={() => {
//                           if (action.label === 'Smart Delay All') {
//                             const upcomingTasks = Object.values(tasks)
//                               .flat()
//                               .filter(task => task.status === 'pending' && !isInGracePeriod(task) && isRealActivity(task))
//                               .slice(0, 3)
                            
//                             if (upcomingTasks.length > 0) {
//                               smartDelayTask(upcomingTasks[0])
//                               setTimeout(() => {
//                                 toast("Smart delay initiated", {
//                                   description: "Processing first upcoming task",
//                                 })
//                               }, 0)
//                             }
//                           } else if (action.label === 'Complete Missed') {
//                             missedTasks.forEach(task => {
//                               if (convertTimeToMinutes(bedtime) - (currentTime.getHours() * 60 + currentTime.getMinutes()) >= task.duration) {
//                                 completeMissedTask(task.id)
//                               }
//                             })
//                             setTimeout(() => {
//                               toast.success("Missed tasks completed! 🌟", {
//                                 description: "Great job catching up before bedtime!",
//                                 duration: 5000,
//                               })
//                             }, 0)
//                           } else if (action.label === 'Delay All Missed') {
//                             missedTasks.forEach(task => {
//                               rescheduleMissedTaskToFreePeriod(task)
//                             })
//                           }
//                         }}
//                       >
//                         <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10`}>
//                           <action.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                         </div>
//                         <div className="text-left">
//                           <div className="font-medium">{action.label}</div>
//                           <div className="text-xs text-gray-600 dark:text-gray-400">{action.description}</div>
//                         </div>
//                       </Button>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>

//           {/* Bedtime Protection Banner */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 dark:border-pink-500/20 rounded-xl p-6"
//           >
//             <div className="flex items-start gap-4">
//               <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
//                 <Bed className="w-6 h-6 text-white" />
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-bold mb-2">Bedtime Protection Active</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
//                     <div className="flex items-center gap-2 mb-2">
//                       <AlarmClock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
//                       <span className="font-medium">1-Hour Grace Period</span>
//                     </div>
//                     <p className="text-sm text-gray-700 dark:text-gray-300">
//                       Update task status within 1 hour of completion
//                     </p>
//                   </div>
//                   <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
//                     <div className="flex items-center gap-2 mb-2">
//                       <CalendarClock className="w-4 h-4 text-pink-600 dark:text-pink-400" />
//                       <span className="font-medium">Smart Scheduling</span>
//                     </div>
//                     <p className="text-sm text-gray-700 dark:text-gray-300">
//                       Tasks auto-rescheduled to free periods before bedtime
//                     </p>
//                   </div>
//                   <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
//                     <div className="flex items-center gap-2 mb-2">
//                       <StarIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
//                       <span className="font-medium">Focus Tracking</span>
//                     </div>
//                     <p className="text-sm text-gray-700 dark:text-gray-300">
//                       Rate your focus to track productivity patterns
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Task Detail Modal */}
//       {selectedTask && (
//         <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
//           <DialogContent className="sm:max-w-lg">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <div 
//                   className="p-2 rounded-lg"
//                   style={{ backgroundColor: `${selectedTask.color}20` }}
//                 >
//                   {(() => {
//                     const Icon = getIconComponent(selectedTask.icon || 'Clock')
//                     return <Icon className="w-5 h-5" style={{ color: selectedTask.color }} />
//                   })()}
//                 </div>
//                 {selectedTask.title}
//               </DialogTitle>
//               <DialogDescription>
//                 {selectedTask.subject} • {selectedTask.day}
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="space-y-4 py-4">
//               {/* Basic Info */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
//                   <div className="font-medium">
//                     {formatTimeDisplay(selectedTask.startTime)} - {formatTimeDisplay(selectedTask.endTime)}
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
//                   <div className="font-medium">{selectedTask.duration} minutes</div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="text-sm text-gray-600 dark:text-gray-400">Type</div>
//                   <Badge className={`
//                     ${selectedTask.apiType === 'FIXED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
//                       selectedTask.apiType === 'FREE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
//                       'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}
//                   `}>
//                     {selectedTask.apiType}
//                   </Badge>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="text-sm text-gray-600 dark:text-gray-400">Bedtime</div>
//                   <div className="font-medium">{formatTimeDisplay(selectedTask.bedtime || bedtime)}</div>
//                 </div>
//               </div>
              
//               {/* Date and Location */}
//               {(selectedTask.date || selectedTask.location) && (
//                 <>
//                   <Separator />
//                   <div className="grid grid-cols-2 gap-4">
//                     {selectedTask.date && (
//                       <div className="space-y-2">
//                         <div className="text-sm text-gray-600 dark:text-gray-400">Date</div>
//                         <div className="font-medium">{formatDate(selectedTask.date)}</div>
//                       </div>
//                     )}
//                     {selectedTask.location && (
//                       <div className="space-y-2">
//                         <div className="text-sm text-gray-600 dark:text-gray-400">Location</div>
//                         <div className="font-medium">{selectedTask.location}</div>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}
              
//               {/* Description from API */}
//               {selectedTask.description && (
//                 <>
//                   <Separator />
//                   <div className="space-y-2">
//                     <div className="text-sm text-gray-600 dark:text-gray-400">Description</div>
//                     <div className="text-sm">{selectedTask.description}</div>
//                   </div>
//                 </>
//               )}
              
//               {/* Status Section */}
//               <Separator />
              
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1">
//                     <div className="text-sm text-gray-600 dark:text-gray-400">Current Status</div>
//                     <Badge className={`
//                       ${selectedTask.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
//                         selectedTask.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse' :
//                         selectedTask.status === 'missed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
//                         selectedTask.status === 'skipped' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' :
//                         selectedTask.status === 'delayed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
//                         selectedTask.status === 'rescheduled' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
//                         'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}
//                     `}>
//                       {selectedTask.status}
//                     </Badge>
//                   </div>
//                 </div>
                
//                 {/* Focus score for completed tasks */}
//                 {selectedTask.status === 'completed' && selectedTask.focusScore && (
//                   <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//                         <span className="font-medium">Focus Score</span>
//                       </div>
//                       <Badge className={`
//                         ${selectedTask.focusScore >= 8 ? 'bg-green-100 text-green-800' :
//                           selectedTask.focusScore >= 5 ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-red-100 text-red-800'}
//                       `}>
//                         {selectedTask.focusScore}/10
//                       </Badge>
//                     </div>
//                     <div className="mt-2">
//                       <Progress value={selectedTask.focusScore * 10} className="h-2" />
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Notes */}
//                 {selectedTask.notes && (
//                   <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
//                     <div className="text-sm font-medium mb-1">Notes</div>
//                     <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
//                       {selectedTask.notes}
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Original time if rescheduled */}
//                 {selectedTask.originalStartTime && (
//                   <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
//                     <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-400">
//                       <CalendarClock className="w-4 h-4" />
//                       Originally scheduled for {selectedTask.day} {formatTimeDisplay(selectedTask.originalStartTime)}
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               <Separator />
              
//               {/* Delay Actions */}
//               <div className="space-y-3">
//                 <h4 className="font-medium">Delay Options</h4>
//                 <div className="grid grid-cols-2 gap-2">
//                   <Button 
//                     onClick={() => smartDelayTask(selectedTask)}
//                     className="gap-2"
//                   >
//                     <CalendarClock className="w-4 h-4" />
//                     Smart Delay
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     onClick={() => skipTask(selectedTask.id)}
//                     className="gap-2"
//                   >
//                     <SkipForward className="w-4 h-4" />
//                     Skip Task
//                   </Button>
//                 </div>
                
//                 <div className="flex gap-2">
//                   <Button 
//                     variant="outline" 
//                     className="flex-1"
//                     onClick={() => simpleDelayTask(selectedTask.id, 30)}
//                     disabled={convertTimeToMinutes(selectedTask.endTime) + 30 > convertTimeToMinutes(bedtime)}
//                   >
//                     Delay 30min
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     className="flex-1"
//                     onClick={() => simpleDelayTask(selectedTask.id, 60)}
//                     disabled={convertTimeToMinutes(selectedTask.endTime) + 60 > convertTimeToMinutes(bedtime)}
//                   >
//                     Delay 1hr
//                   </Button>
//                 </div>
//               </div>
              
//               {/* Quick Start/Stop */}
//               <div className="grid grid-cols-2 gap-2">
//                 {selectedTask.status === 'pending' && !isInGracePeriod(selectedTask) && isRealActivity(selectedTask) ? (
//                   <Button onClick={() => startTaskTimer(selectedTask.id)}>
//                     <PlayCircle className="w-4 h-4 mr-2" />
//                     Start Task
//                   </Button>
//                 ) : selectedTask.status === 'in-progress' ? (
//                   <Button onClick={() => stopTaskTimer(selectedTask.id)} variant="destructive">
//                     <StopCircle className="w-4 h-4 mr-2" />
//                     Complete Task
//                   </Button>
//                 ) : isInGracePeriod(selectedTask) && isRealActivity(selectedTask) ? (
//                   <Button onClick={() => {
//                     setTaskForFeedback(selectedTask)
//                     setFeedbackFocus(5)
//                     setFeedbackNotes('')
//                     setFeedbackCompletedWell(true)
//                     setShowFeedbackModal(true)
//                     setShowTaskModal(false)
//                   }}>
//                     <CheckCircle className="w-4 h-4 mr-2" />
//                     Update Status
//                   </Button>
//                 ) : (
//                   <Button onClick={() => updateTaskStatus(selectedTask.id, 'pending')}>
//                     <RotateCcw className="w-4 h-4 mr-2" />
//                     Reset Status
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Smart Delay Modal */}
//       {renderDelayModal()}

//       {/* Feedback Modal */}
//       {renderFeedbackModal()}
//     </div>
//   )
// }










// app/dashboard/timetable/page.tsx
'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  Grid,
  List,
  Download,
  Share2,
  Settings,
  Bell,
  Zap,
  TrendingUp,
  Target,
  PieChart,
  BarChart3,
  Timer,
  Play,
  Pause,
  SkipForward,
  RefreshCw,
  Filter,
  MoreVertical,
  Star,
  Award,
  Coffee,
  BookOpen,
  Brain,
  Code,
  GraduationCap,
  Laptop,
  Smartphone,
  Table,
  Sun,
  Moon,
  Dumbbell,
  Book,
  Users,
  Music,
  Gamepad2,
  Home,
  Heart,
  Car,
  Utensils,
  Building,
  Plus,
  Maximize2,
  Minimize2,
  Grid3x3,
  List as ListIcon,
  Eye,
  EyeOff,
  Printer,
  Edit2,
  Trash2,
  Copy,
  CheckSquare,
  Square,
  AlertCircle,
  X,
  RotateCcw,
  FastForward,
  PauseCircle,
  PlayCircle,
  StopCircle,
  History,
  TrendingDown,
  Circle,
  CircleDot,
  CircleCheck,
  CircleX,
  CirclePause,
  Clock4,
  Clock8,
  Clock12,
  Hourglass,
  CheckCheck,
  Bed,
  AlarmClock,
  CalendarClock,
  CalendarDays,
  CalendarCheck,
  CalendarOff,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  CalendarRange,
  ChevronUp,
  ChevronDown,
  Move,
  GripVertical,
  Tag,
  Repeat,
  BellRing,
  Clock1,
  Clock2,
  Clock3,
  Clock5,
  Clock6,
  Clock7,
  Clock9,
  Clock10,
  Clock11,
  Archive,
  FileText,
  Folder,
  FolderOpen,
  BarChart,
  LineChart,
  Activity,
  Target as TargetIcon,
  MoonStar,
  Sparkles,
  Rocket,
  Trophy,
  Crown,
  Coffee as CoffeeIcon,
  Heart as HeartIcon,
  Lightbulb,
  Target as TargetIcon2,
  Zap as ZapIcon,
  Sunrise,
  Sunset,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Droplets,
  Umbrella,
  CloudSun,
  CloudMoon,
  Star as StarIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Frown,
  Smile,
  LucideIcon,
  Loader2,
  School,
  Gym,
  Pizza,
  PersonStanding,
  AlarmClockCheck,
  CalendarCheck2,
  ClockAlert,
  ClockFading,
  TimerReset,
  TimerOff,
  Waves,
  Wind as WindIcon,
  Snowflake,
  CloudFog,
  CloudLightning,
  CloudDrizzle,
  CloudHail,
  Cloudy,
  CloudSun as CloudSunIcon,
  CloudMoon as CloudMoonIcon,
  Eclipse,
  SunDim,
  SunMedium,
  SunSnow,
  Sunrise as SunriseIcon,
  Sunset as SunsetIcon,
  MoonStar as MoonStarIcon,
  Rows,
  Columns
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'

// API Response Types
interface TimeSlotAPI {
  startTime: string
  endTime: string
  type: 'FIXED' | 'FREE' | 'OTHER'
  title: string
  description?: string
  fixedTimeId?: string
  freePeriodId?: string
}

interface DayScheduleAPI {
  day: string
  slots: TimeSlotAPI[]
}

interface ApiResponse {
  success: boolean
  data: DayScheduleAPI[]
}

// Local TimeSlot type (enhanced for UI)
interface TimeSlot {
  id: string
  title: string
  subject: string
  startTime: string
  endTime: string
  duration: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  color: string
  day: string
  type: 'task' | 'fixed' | 'break' | 'commute' | 'free' | 'class' | 'study' | 'health' | 'project' | 'meeting' | 'workout' | 'meal' | 'entertainment' | 'sleep' | 'other'
  category: 'academic' | 'professional' | 'health' | 'personal' | 'learning' | 'break' | 'commute' | 'project' | 'sleep' | 'other'
  icon?: string
  status: 'pending' | 'in-progress' | 'completed' | 'missed' | 'skipped' | 'delayed' | 'rescheduled'
  notes?: string
  completedAt?: Date
  startedAt?: Date
  estimatedEnd?: Date
  actualDuration?: number
  recurring?: boolean
  recurringPattern?: 'daily' | 'weekly' | 'monthly'
  tags?: string[]
  originalStartTime?: string
  originalEndTime?: string
  maxDelayAllowed?: number
  bedtime?: string
  date?: Date
  location?: string
  attachments?: string[]
  focusScore?: number
  completedBeforeBedtime?: boolean
  gracePeriodEndsAt?: Date
  fixedTimeId?: string
  freePeriodId?: string
  description?: string
  apiType?: 'FIXED' | 'FREE' | 'OTHER'
}

type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'missed' | 'skipped' | 'delayed' | 'rescheduled'

interface LiveTimeData {
  currentTime: Date
  activeTasks: TimeSlot[]
  upcomingTasks: TimeSlot[]
  completedTasks: TimeSlot[]
  currentProgress: number
}

interface SmartDelayOptions {
  taskId: string
  preferredDelay: number
  availableSlots: Array<{
    startTime: string
    endTime: string
    day: string
    duration: number
    type: 'immediate' | 'free-period' | 'evening' | 'next-day'
  }>
  bedtime: string
  canExtend: boolean
  maxExtension: number
  suggestion: string
}

interface CalendarDay {
  date: Date
  isToday: boolean
  isCurrentMonth: boolean
  isWeekend: boolean
  tasks: TimeSlot[]
}

interface MotivationalMessage {
  id: string
  message: string
  category: 'late_night' | 'missed_task' | 'productivity' | 'success' | 'encouragement' | 'focus'
  icon: LucideIcon
  color: string
  emoji: string
}

interface TaskFeedback {
  taskId: string
  focusLevel: number
  completedWell: boolean
  notes: string
  timestamp: Date
}

// Display mode types
type DisplayMode = 'vertical' | 'horizontal'

// Color mapping for different slot types
const slotTypeColors: Record<string, string> = {
  FIXED: '#8B5CF6', // Purple for fixed schedules (college, gym, etc.)
  FREE: '#10B981',  // Green for free periods
  OTHER: '#9CA3AF', // Gray for unscheduled time
  
  // Activity specific colors
  college: '#6366F1', // Indigo
  gym: '#EC4899',     // Pink
  study: '#EF4444',   // Red
  meal: '#F59E0B',    // Orange
  meeting: '#8B5CF6', // Purple
  project: '#3B82F6', // Blue
  health: '#10B981',  // Green
  sleep: '#6B7280',   // Gray
  break: '#F59E0B',   // Orange
  entertainment: '#EC4899', // Pink
  task: '#3B82F6'     // Blue
}

// Icon mapping for different slot types and titles
const getIconForSlot = (type: string, title: string): string => {
  const titleLower = title.toLowerCase()
  
  // Check title first for specific activities
  if (titleLower.includes('college') || titleLower.includes('lecture') || titleLower.includes('class')) {
    return 'GraduationCap'
  }
  if (titleLower.includes('gym') || titleLower.includes('workout') || titleLower.includes('exercise')) {
    return 'Dumbbell'
  }
  if (titleLower.includes('lunch') || titleLower.includes('dinner') || titleLower.includes('breakfast') || titleLower.includes('meal')) {
    return 'Utensils'
  }
  if (titleLower.includes('sleep') || titleLower.includes('bed')) {
    return 'Bed'
  }
  if (titleLower.includes('study') || titleLower.includes('learning')) {
    return 'Brain'
  }
  if (titleLower.includes('meeting')) {
    return 'Users'
  }
  if (titleLower.includes('project')) {
    return 'Code'
  }
  if (titleLower.includes('free') || titleLower.includes('break')) {
    return 'Coffee'
  }
  
  // Fallback to type-based icons
  switch(type) {
    case 'FIXED':
      return 'CalendarCheck'
    case 'FREE':
      return 'Coffee'
    case 'OTHER':
      return 'Clock'
    default:
      return 'Clock'
  }
}

// Get activity type from title
const getActivityType = (title: string): string => {
  const titleLower = title.toLowerCase()
  
  if (titleLower.includes('college') || titleLower.includes('lecture') || titleLower.includes('class')) {
    return 'class'
  }
  if (titleLower.includes('gym') || titleLower.includes('workout') || titleLower.includes('exercise')) {
    return 'workout'
  }
  if (titleLower.includes('lunch') || titleLower.includes('dinner') || titleLower.includes('breakfast') || titleLower.includes('meal')) {
    return 'meal'
  }
  if (titleLower.includes('sleep') || titleLower.includes('bed')) {
    return 'sleep'
  }
  if (titleLower.includes('study') || titleLower.includes('learning')) {
    return 'study'
  }
  if (titleLower.includes('meeting')) {
    return 'meeting'
  }
  if (titleLower.includes('project')) {
    return 'project'
  }
  if (titleLower.includes('free') || titleLower.includes('break')) {
    return 'break'
  }
  return 'task'
}

// Get category from title and type
const getCategory = (title: string, type: string): 'academic' | 'professional' | 'health' | 'personal' | 'learning' | 'break' | 'commute' | 'project' | 'sleep' | 'other' => {
  const titleLower = title.toLowerCase()
  
  if (type === 'FREE') return 'break'
  if (type === 'OTHER') return 'other'
  
  if (titleLower.includes('college') || titleLower.includes('lecture') || titleLower.includes('class')) {
    return 'academic'
  }
  if (titleLower.includes('gym') || titleLower.includes('workout')) {
    return 'health'
  }
  if (titleLower.includes('study') || titleLower.includes('learning')) {
    return 'learning'
  }
  if (titleLower.includes('sleep')) {
    return 'sleep'
  }
  if (titleLower.includes('project')) {
    return 'project'
  }
  if (titleLower.includes('break') || titleLower.includes('lunch') || titleLower.includes('dinner')) {
    return 'break'
  }
  
  return 'other'
}

// Motivational messages for different scenarios
const motivationalMessages: MotivationalMessage[] = [
  {
    id: 'msg-1',
    message: "Completing tasks before sleep brings peace of mind and better rest! 🌙",
    category: 'late_night',
    icon: MoonStar,
    color: '#8B5CF6',
    emoji: '😴'
  },
  {
    id: 'msg-2',
    message: "Every task completed is a step closer to your dreams. Keep pushing! 💫",
    category: 'missed_task',
    icon: Rocket,
    color: '#EC4899',
    emoji: '🚀'
  },
  {
    id: 'msg-3',
    message: "Sleep can wait, but your dreams can't! You're building your future. 👑",
    category: 'late_night',
    icon: Crown,
    color: '#F59E0B',
    emoji: '👑'
  },
  {
    id: 'msg-4',
    message: "Great focus! Quality matters more than quantity. 🎯",
    category: 'focus',
    icon: TargetIcon2,
    color: '#3B82F6',
    emoji: '✅'
  },
  {
    id: 'msg-5',
    message: "The best time to complete a missed task is now. Future you will thank present you! 🙏",
    category: 'missed_task',
    icon: HeartIcon,
    color: '#EF4444',
    emoji: '❤️'
  },
  {
    id: 'msg-6',
    message: "Small progress is still progress. Every task completed matters! 🌟",
    category: 'encouragement',
    icon: StarIcon,
    color: '#F59E0B',
    emoji: '✨'
  },
  {
    id: 'msg-7',
    message: "Your dedication now will become your success story tomorrow! 📚",
    category: 'success',
    icon: Trophy,
    color: '#10B981',
    emoji: '🏆'
  },
  {
    id: 'msg-8',
    message: "The night is young for dreamers and achievers! Keep going! 🌃",
    category: 'late_night',
    icon: MoonIcon,
    color: '#6366F1',
    emoji: '🌌'
  },
  {
    id: 'msg-9',
    message: "Missed tasks are opportunities for comeback stories! 📈",
    category: 'missed_task',
    icon: TrendingUp,
    color: '#8B5CF6',
    emoji: '📊'
  },
  {
    id: 'msg-10',
    message: "Sleep well knowing you've done your best today! 😊",
    category: 'late_night',
    icon: Bed,
    color: '#6B7280',
    emoji: '🛌'
  },
  {
    id: 'msg-11',
    message: "Your consistency today builds your excellence tomorrow! 💪",
    category: 'productivity',
    icon: Dumbbell,
    color: '#EC4899',
    emoji: '🏋️'
  },
  {
    id: 'msg-12',
    message: "Every completed task is a victory against procrastination! 🎯",
    category: 'encouragement',
    icon: TargetIcon2,
    color: '#EF4444',
    emoji: '✅'
  }
]

// Get icon component
const getIconComponent = (iconName: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    Sun: SunIcon,
    Headphones: Music,
    GraduationCap: GraduationCap,
    Utensils: Utensils,
    Dumbbell: Dumbbell,
    Code: Code,
    Users: Users,
    Book: Book,
    Home: Home,
    Heart: HeartIcon,
    Car: Car,
    Building: Building,
    Gamepad2: Gamepad2,
    Clock: Clock,
    Coffee: CoffeeIcon,
    Laptop: Laptop,
    Brain: Brain,
    Target: TargetIcon2,
    Zap: ZapIcon,
    CheckCircle: CheckCircle,
    ClipboardCheck: CheckSquare,
    PlayCircle: PlayCircle,
    StopCircle: StopCircle,
    SkipForward: SkipForward,
    CircleX: CircleX,
    CircleDot: CircleDot,
    Circle: Circle,
    Bed: Bed,
    AlarmClock: AlarmClock,
    CalendarCheck: CalendarCheck,
    CalendarClock: CalendarClock,
    Calendar: Calendar,
    CalendarDays: CalendarDays,
    CalendarRange: CalendarRange,
    CalendarPlus: CalendarPlus,
    BellRing: BellRing,
    Activity: Activity,
    LineChart: LineChart,
    BarChart: BarChart,
    TargetIcon: TargetIcon2,
    Folder: Folder,
    FileText: FileText,
    Archive: Archive,
    Repeat: Repeat,
    Tag: Tag,
    Move: Move,
    Rocket: Rocket,
    Trophy: Trophy,
    Crown: Crown,
    Lightbulb: Lightbulb,
    MoonStar: MoonStar,
    Sparkles: Sparkles,
    Star: StarIcon,
    Moon: MoonIcon,
    ThumbsUp: ThumbsUp,
    ThumbsDown: ThumbsDown,
    Meh: Meh,
    Frown: Frown,
    Smile: Smile,
    CheckSquare: CheckSquare,
    Brain: Brain,
    Heart: HeartIcon,
    Coffee: CoffeeIcon,
    Car: Car,
    Gamepad2: Gamepad2,
    GraduationCap: GraduationCap,
    School: School,
    Gym: Dumbbell,
    Pizza: Utensils,
    PersonStanding: PersonStanding,
    AlarmClockCheck: AlarmClockCheck,
    CalendarCheck2: CalendarCheck2,
    ClockAlert: ClockAlert,
    ClockFading: ClockFading,
    Clock: Clock,
    TimerReset: TimerReset,
    TimerOff: TimerOff,
    Timer: Timer,
    Waves: Waves,
    WindIcon: WindIcon,
    Snowflake: Snowflake,
    CloudFog: CloudFog,
    CloudLightning: CloudLightning,
    CloudDrizzle: CloudDrizzle,
    CloudHail: CloudHail,
    Cloudy: Cloudy,
    CloudSunIcon: CloudSunIcon,
    CloudMoonIcon: CloudMoonIcon,
    Eclipse: Eclipse,
    SunDim: SunDim,
    SunMedium: SunMedium,
    SunSnow: SunSnow,
    SunriseIcon: SunriseIcon,
    SunsetIcon: SunsetIcon,
    MoonStarIcon: MoonStarIcon,
    Rows: Rows,
    Columns: Columns
  }
  return icons[iconName] || Clock
}

// Helper: Convert time to minutes
const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Helper: Convert minutes to time string
const convertMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

// Helper: Format time for display
const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Helper: Get current day
const getCurrentDay = (): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[new Date().getDay()]
}

// Helper: Get current day full name
const getCurrentDayFull = (): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[new Date().getDay()]
}

// Helper: Get empty live data
const getEmptyLiveData = (): LiveTimeData => ({
  currentTime: new Date(),
  activeTasks: [],
  upcomingTasks: [],
  completedTasks: [],
  currentProgress: 0
})

// Helper: Check if task is in grace period (1 hour after end time)
const isInGracePeriod = (task: TimeSlot): boolean => {
  const now = new Date()
  const [endHour, endMinute] = task.endTime.split(':').map(Number)
  const taskEnd = new Date(now)
  taskEnd.setHours(endHour, endMinute, 0, 0)
  
  const gracePeriodEnd = new Date(taskEnd)
  gracePeriodEnd.setHours(gracePeriodEnd.getHours() + 1)
  
  return now > taskEnd && now <= gracePeriodEnd && task.status === 'pending'
}

// Helper: Check if task is overdue beyond grace period
const isOverdueBeyondGrace = (task: TimeSlot): boolean => {
  const now = new Date()
  const [endHour, endMinute] = task.endTime.split(':').map(Number)
  const taskEnd = new Date(now)
  taskEnd.setHours(endHour, endMinute, 0, 0)
  
  const gracePeriodEnd = new Date(taskEnd)
  gracePeriodEnd.setHours(gracePeriodEnd.getHours() + 1)
  
  return now > gracePeriodEnd && task.status === 'pending'
}

// Helper: Find next available free slot
const findFreeSlots = (
  tasks: Record<string, TimeSlot[]>, 
  currentTask: TimeSlot, 
  preferredDelay: number,
  bedtime: string
): SmartDelayOptions => {
  const currentDayTasks = tasks[currentTask.day] || []
  const currentTimeMinutes = convertTimeToMinutes(currentTask.endTime)
  const bedtimeMinutes = convertTimeToMinutes(bedtime)
  const taskDuration = currentTask.duration
  
  const availableSlots: Array<{
    startTime: string
    endTime: string
    day: string
    duration: number
    type: 'immediate' | 'free-period' | 'evening' | 'next-day'
  }> = []
  
  // Sort tasks by start time
  const sortedTasks = [...currentDayTasks]
    .filter(t => t.type !== 'sleep')
    .sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))
  
  // Find gaps between tasks on the same day
  for (let i = 0; i < sortedTasks.length - 1; i++) {
    const currentTaskEnd = convertTimeToMinutes(sortedTasks[i].endTime)
    const nextTaskStart = convertTimeToMinutes(sortedTasks[i + 1].startTime)
    
    if (currentTaskEnd >= currentTimeMinutes && nextTaskStart - currentTaskEnd >= taskDuration) {
      const slotType = currentTaskEnd === currentTimeMinutes ? 'immediate' : 'free-period'
      availableSlots.push({
        startTime: convertMinutesToTime(currentTaskEnd),
        endTime: convertMinutesToTime(currentTaskEnd + taskDuration),
        day: currentTask.day,
        duration: taskDuration,
        type: slotType
      })
    }
  }
  
  // Check if can extend before bedtime
  const lastTask = sortedTasks[sortedTasks.length - 1]
  const lastTaskEnd = lastTask ? convertTimeToMinutes(lastTask.endTime) : currentTimeMinutes
  
  if (bedtimeMinutes - lastTaskEnd >= taskDuration) {
    availableSlots.push({
      startTime: convertMinutesToTime(lastTaskEnd),
      endTime: convertMinutesToTime(lastTaskEnd + taskDuration),
      day: currentTask.day,
      duration: taskDuration,
      type: 'evening'
    })
  }
  
  // Check next day morning (first available slot)
  const nextDay = getNextDay(currentTask.day)
  const nextDayTasks = tasks[nextDay] || []
  const nextDayMorningStart = convertTimeToMinutes('06:00')
  
  if (nextDayTasks.length > 0) {
    const firstTaskStart = convertTimeToMinutes(nextDayTasks[0].startTime)
    if (firstTaskStart - nextDayMorningStart >= taskDuration) {
      availableSlots.push({
        startTime: '06:00',
        endTime: convertMinutesToTime(nextDayMorningStart + taskDuration),
        day: nextDay,
        duration: taskDuration,
        type: 'next-day'
      })
    }
  }
  
  // Calculate max extension before bedtime
  const canExtend = bedtimeMinutes - currentTimeMinutes >= taskDuration
  const maxExtension = canExtend ? bedtimeMinutes - currentTimeMinutes - taskDuration : 0
  
  let suggestion = ''
  if (availableSlots.length > 0) {
    const immediateSlot = availableSlots.find(s => s.type === 'immediate')
    if (immediateSlot) {
      suggestion = `Move to immediate free slot at ${formatTimeDisplay(immediateSlot.startTime)}`
    } else {
      const bestSlot = availableSlots[0]
      suggestion = `Reschedule to ${formatTimeDisplay(bestSlot.startTime)} on ${bestSlot.day}`
    }
  } else if (canExtend) {
    suggestion = `Extend current slot by ${maxExtension} minutes (complete before ${bedtime})`
  } else {
    suggestion = 'No available slots today. Consider reducing task duration or rescheduling for tomorrow.'
  }
  
  return {
    taskId: currentTask.id,
    preferredDelay,
    availableSlots,
    bedtime,
    canExtend,
    maxExtension,
    suggestion
  }
}

// Helper: Get next day
const getNextDay = (currentDay: string): string => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const currentIndex = days.indexOf(currentDay)
  return days[(currentIndex + 1) % days.length]
}

// Helper: Check if time slot is available
const isTimeSlotAvailable = (
  tasks: Record<string, TimeSlot[]>,
  day: string,
  startTime: string,
  endTime: string,
  excludeTaskId?: string
): boolean => {
  const dayTasks = tasks[day] || []
  const startMinutes = convertTimeToMinutes(startTime)
  const endMinutes = convertTimeToMinutes(endTime)
  
  for (const task of dayTasks) {
    if (task.id === excludeTaskId) continue
    if (task.type === 'sleep') continue // Sleep is fixed
    
    const taskStart = convertTimeToMinutes(task.startTime)
    const taskEnd = convertTimeToMinutes(task.endTime)
    
    // Check for overlap
    if (startMinutes < taskEnd && endMinutes > taskStart) {
      return false
    }
  }
  
  return true
}

// Helper: Get days in month
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

// Helper: Generate calendar days
const generateCalendarDays = (year: number, month: number, tasks: Record<string, TimeSlot[]>): CalendarDay[] => {
  const days: CalendarDay[] = []
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const today = new Date()
  
  // Get starting day (0 = Sunday, 1 = Monday, etc.)
  const startDay = firstDay.getDay()
  
  // Add days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i)
    days.push({
      date,
      isToday: false,
      isCurrentMonth: false,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      tasks: []
    })
  }
  
  // Add days from current month
  const daysInMonth = getDaysInMonth(year, month)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dayName = dayNames[date.getDay()]
    const dayTasks = tasks[dayName] || []
    
    // Filter tasks for this specific date
    const dateTasks = dayTasks.filter(task => {
      if (!task.date) return false
      const taskDate = new Date(task.date)
      return taskDate.getDate() === day && 
             taskDate.getMonth() === month && 
             taskDate.getFullYear() === year
    })
    
    days.push({
      date,
      isToday: date.getDate() === today.getDate() && 
               date.getMonth() === today.getMonth() && 
               date.getFullYear() === today.getFullYear(),
      isCurrentMonth: true,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      tasks: dateTasks
    })
  }
  
  // Add days from next month to complete the grid (42 days total for 6 weeks)
  const totalCells = 42 // 6 weeks * 7 days
  const nextMonthStartDay = new Date(year, month + 1, 1)
  for (let i = days.length; i < totalCells; i++) {
    const date = new Date(nextMonthStartDay)
    date.setDate(date.getDate() + (i - days.length))
    days.push({
      date,
      isToday: false,
      isCurrentMonth: false,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      tasks: []
    })
  }
  
  return days
}

// Helper: Format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

// Helper: Get month name
const getMonthName = (month: number): string => {
  return new Date(2000, month, 1).toLocaleDateString('en-US', { month: 'long' })
}

// Helper: Get motivational message based on time and context
const getMotivationalMessage = (currentHour: number, isLateNight: boolean, context?: string): MotivationalMessage => {
  const now = new Date()
  const hour = now.getHours()
  
  if (context === 'focus') {
    const focusMessages = motivationalMessages.filter(msg => msg.category === 'focus')
    return focusMessages[Math.floor(Math.random() * focusMessages.length)]
  }
  
  if (isLateNight && hour >= 22) {
    // Late night messages (after 10 PM)
    const lateNightMessages = motivationalMessages.filter(msg => msg.category === 'late_night')
    return lateNightMessages[Math.floor(Math.random() * lateNightMessages.length)]
  } else if (hour >= 20) {
    // Evening messages (after 8 PM)
    const eveningMessages = motivationalMessages.filter(msg => 
      msg.category === 'late_night' || msg.category === 'encouragement'
    )
    return eveningMessages[Math.floor(Math.random() * eveningMessages.length)]
  } else {
    // General messages
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  }
}

// Check if a slot is "Unscheduled Time" (OTHER type)
const isUnscheduledTime = (slot: TimeSlot): boolean => {
  return slot.apiType === 'OTHER' || slot.title === 'Unscheduled Time'
}

// Check if a slot is a real activity (FIXED or FREE)
const isRealActivity = (slot: TimeSlot): boolean => {
  return slot.apiType === 'FIXED' || slot.apiType === 'FREE'
}

// Transform API data to local TimeSlot format
const transformApiDataToTimeSlots = (apiData: DayScheduleAPI[]): Record<string, TimeSlot[]> => {
  const dayMapping: Record<string, string> = {
    'MONDAY': 'Mon',
    'TUESDAY': 'Tue',
    'WEDNESDAY': 'Wed',
    'THURSDAY': 'Thu',
    'FRIDAY': 'Fri',
    'SATURDAY': 'Sat',
    'SUNDAY': 'Sun'
  }

  const transformed: Record<string, TimeSlot[]> = {}
  
  apiData.forEach(daySchedule => {
    const shortDay = dayMapping[daySchedule.day]
    if (!shortDay) return
    
    transformed[shortDay] = daySchedule.slots
      .map((slot, index) => {
        const slotType = getActivityType(slot.title)
        const duration = convertTimeToMinutes(slot.endTime) - convertTimeToMinutes(slot.startTime)
        const iconName = getIconForSlot(slot.type, slot.title)
        const category = getCategory(slot.title, slot.type)
        
        // Determine color based on activity type
        let color = slotTypeColors[slot.type] || slotTypeColors.other
        if (slotType === 'class') color = slotTypeColors.college
        else if (slotType === 'workout') color = slotTypeColors.gym
        else if (slotType === 'meal') color = slotTypeColors.meal
        else if (slotType === 'study') color = slotTypeColors.study
        else if (slotType === 'meeting') color = slotTypeColors.meeting
        else if (slotType === 'project') color = slotTypeColors.project
        else if (slotType === 'sleep') color = slotTypeColors.sleep
        
        // Determine priority based on type
        let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM'
        if (slot.type === 'FIXED') priority = 'HIGH'
        else if (slot.type === 'FREE') priority = 'LOW'
        
        return {
          id: `${shortDay}-${index}-${slot.startTime}`,
          title: slot.title,
          subject: slot.type === 'FIXED' ? 'Fixed Schedule' : 
                   slot.type === 'FREE' ? 'Free Period' : 'Unscheduled',
          startTime: slot.startTime,
          endTime: slot.endTime,
          duration: duration,
          priority: priority,
          color: color,
          day: shortDay,
          type: slotType as any,
          category: category,
          icon: iconName,
          status: 'pending',
          notes: slot.description || '',
          fixedTimeId: slot.fixedTimeId,
          freePeriodId: slot.freePeriodId,
          description: slot.description,
          apiType: slot.type,
          bedtime: '23:00', // Default bedtime
          date: new Date() // Will be updated based on actual date
        }
      })
      .filter(slot => slot.apiType !== 'OTHER' || slot.title !== 'Unscheduled Time') // Filter out Unscheduled Time completely
    
    // Sort slots by start time
    transformed[shortDay].sort((a, b) => 
      convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime)
    )
  })
  
  return transformed
}

// Get current activity based on time
const getCurrentActivity = (tasks: TimeSlot[], currentTime: Date): TimeSlot | null => {
  const now = currentTime
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTimeMinutes = currentHour * 60 + currentMinute
  
  for (const task of tasks) {
    const startMinutes = convertTimeToMinutes(task.startTime)
    const endMinutes = convertTimeToMinutes(task.endTime)
    
    if (currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes) {
      return task
    }
  }
  
  return null
}

// Get activity message for current time
const getCurrentActivityMessage = (task: TimeSlot | null): { message: string; icon: LucideIcon; color: string } => {
  if (!task) {
    return {
      message: 'No ongoing activity',
      icon: Clock,
      color: '#6B7280'
    }
  }
  
  const titleLower = task.title.toLowerCase()
  
  if (titleLower.includes('sleep') || titleLower.includes('bed')) {
    return {
      message: 'Sleeping... 😴',
      icon: Bed,
      color: '#6B7280'
    }
  }
  
  if (titleLower.includes('college') || titleLower.includes('lecture') || titleLower.includes('class')) {
    return {
      message: `In ${task.title} 📚`,
      icon: GraduationCap,
      color: '#6366F1'
    }
  }
  
  if (titleLower.includes('gym') || titleLower.includes('workout')) {
    return {
      message: `Working out at ${task.title} 💪`,
      icon: Dumbbell,
      color: '#EC4899'
    }
  }
  
  if (titleLower.includes('lunch') || titleLower.includes('dinner') || titleLower.includes('breakfast')) {
    return {
      message: `Having ${task.title} 🍽️`,
      icon: Utensils,
      color: '#F59E0B'
    }
  }
  
  if (titleLower.includes('study') || titleLower.includes('learning')) {
    return {
      message: `Studying - ${task.title} 📖`,
      icon: Brain,
      color: '#EF4444'
    }
  }
  
  if (titleLower.includes('meeting')) {
    return {
      message: `In meeting - ${task.title} 👥`,
      icon: Users,
      color: '#8B5CF6'
    }
  }
  
  if (titleLower.includes('free') || titleLower.includes('break')) {
    return {
      message: `On break - ${task.title} ☕`,
      icon: Coffee,
      color: '#10B981'
    }
  }
  
  return {
    message: task.title,
    icon: getIconComponent(task.icon || 'Clock'),
    color: task.color
  }
}

// Default empty timetable
const getEmptyTimetableData = (): Record<string, TimeSlot[]> => {
  return {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: []
  }
}

export default function TimetableClient() {
  // State
  const [view, setView] = useState<'grid' | 'list' | 'calendar'>('grid')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('vertical') // Default to vertical
  const [currentDay, setCurrentDay] = useState<string>(getCurrentDay())
  const [currentDayFull, setCurrentDayFull] = useState<string>(getCurrentDayFull())
  const [timerRunning, setTimerRunning] = useState<boolean>(false)
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [showWeekends, setShowWeekends] = useState<boolean>(true)
  const [compactMode, setCompactMode] = useState<boolean>(false)
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 24]) // Show full day by default
  const [selectedTask, setSelectedTask] = useState<TimeSlot | null>(null)
  const [showTaskModal, setShowTaskModal] = useState<boolean>(false)
  const [showDelayModal, setShowDelayModal] = useState<boolean>(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false)
  const [taskToDelay, setTaskToDelay] = useState<TimeSlot | null>(null)
  const [taskForFeedback, setTaskForFeedback] = useState<TimeSlot | null>(null)
  const [smartDelayOptions, setSmartDelayOptions] = useState<SmartDelayOptions | null>(null)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [tasks, setTasks] = useState<Record<string, TimeSlot[]>>(getEmptyTimetableData())
  const [liveData, setLiveData] = useState<LiveTimeData>(getEmptyLiveData())
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true)
  const [playSound, setPlaySound] = useState<boolean>(true)
  const [showNotifications, setShowNotifications] = useState<boolean>(true)
  const [bedtime, setBedtime] = useState<string>('23:00')
  const [showMotivationalMessage, setShowMotivationalMessage] = useState<boolean>(false)
  const [currentMotivationalMessage, setCurrentMotivationalMessage] = useState<MotivationalMessage | null>(null)
  
  // API States
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  // Feedback state
  const [feedbackFocus, setFeedbackFocus] = useState<number>(5)
  const [feedbackNotes, setFeedbackNotes] = useState<string>('')
  const [feedbackCompletedWell, setFeedbackCompletedWell] = useState<boolean>(true)
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month')
  const [draggedTask, setDraggedTask] = useState<TimeSlot | null>(null)

  // Refs to prevent infinite loops
  const tasksRef = useRef(tasks)
  const bedtimeRef = useRef(bedtime)

  // Update refs when state changes
  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  useEffect(() => {
    bedtimeRef.current = bedtime
  }, [bedtime])

  // Fetch timetable data from API
  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Get token from localStorage
        const token = localStorage.getItem('access_token')
        
        if (!token) {
          throw new Error('No access token found. Please login again.')
        }
        
        const response = await fetch('http://localhost:8181/v0/api/time-table/full', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired. Please login again.')
          }
          throw new Error(`Failed to fetch timetable: ${response.status}`)
        }
        
        const data: ApiResponse = await response.json()
        
        if (data.success && data.data) {
          const transformedData = transformApiDataToTimeSlots(data.data)
          setTasks(transformedData)
          toast.success('Timetable loaded successfully!')
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching timetable:', err)
        setError(err instanceof Error ? err.message : 'Failed to load timetable')
        toast.error('Failed to load timetable', {
          description: err instanceof Error ? err.message : 'Please try again later'
        })
        // Set empty data as fallback
        setTasks(getEmptyTimetableData())
      } finally {
        setLoading(false)
      }
    }
    
    fetchTimetable()
  }, [])

  // Get all tasks for today (excluding Unscheduled Time)
  const todayTasks = useMemo(() => {
    const allTasks = Object.values(tasks).flat()
    const todayDay = getCurrentDay()
    
    return allTasks.filter(task => 
      task.day === todayDay && 
      !isUnscheduledTime(task) // Exclude Unscheduled Time
    )
  }, [tasks])

  // Get tasks in grace period (1 hour after end time) - only real activities
  const gracePeriodTasks = useMemo(() => {
    return todayTasks.filter(task => {
      const isPending = task.status === 'pending'
      return isPending && isInGracePeriod(task)
    })
  }, [todayTasks, currentTime])

  // Get missed tasks for today (beyond grace period) - only real activities that are missed
  const missedTasks = useMemo(() => {
    const now = currentTime
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    
    return todayTasks.filter(task => {
      // Skip free periods and unscheduled time for missed tasks
      if (task.type === 'free' || task.type === 'break' || isUnscheduledTime(task)) {
        return false
      }
      
      const endMinutes = convertTimeToMinutes(task.endTime)
      const isMissed = task.status === 'missed' || 
                      (nowMinutes > endMinutes && task.status === 'pending' && !isInGracePeriod(task))
      
      // Check if task can still be completed before bedtime
      const timeUntilBedtime = convertTimeToMinutes(bedtime) - nowMinutes
      const canCompleteBeforeBedtime = timeUntilBedtime >= task.duration
      
      return isMissed && canCompleteBeforeBedtime
    })
  }, [todayTasks, bedtime, currentTime])

  // Get fixed time activities for today (college, gym, etc.)
  const fixedTimeActivities = useMemo(() => {
    return todayTasks.filter(task => 
      task.apiType === 'FIXED' && 
      !isUnscheduledTime(task)
    )
  }, [todayTasks])

  // Get free periods for today
  const freePeriods = useMemo(() => {
    return todayTasks.filter(task => 
      task.apiType === 'FREE' && 
      !isUnscheduledTime(task)
    )
  }, [todayTasks])

  // Get active tasks (current ongoing activities)
  const activeTasks = useMemo(() => {
    const now = currentTime
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    
    return todayTasks.filter(task => {
      const startMinutes = convertTimeToMinutes(task.startTime)
      const endMinutes = convertTimeToMinutes(task.endTime)
      
      return nowMinutes >= startMinutes && 
             nowMinutes < endMinutes && 
             task.status !== 'completed' && 
             task.status !== 'skipped' && 
             task.status !== 'missed'
    })
  }, [todayTasks, currentTime])

  // Get current activity for the active component
  const currentActivity = useMemo(() => {
    return getCurrentActivity(todayTasks, currentTime)
  }, [todayTasks, currentTime])

  const currentActivityInfo = useMemo(() => {
    return getCurrentActivityMessage(currentActivity)
  }, [currentActivity])

  // Check if task is current based on live time
  const isTaskCurrent = useCallback((task: TimeSlot): boolean => {
    const now = currentTime
    const [startHour, startMinute] = task.startTime.split(':').map(Number)
    const [endHour, endMinute] = task.endTime.split(':').map(Number)
    
    const startTime = new Date(now)
    startTime.setHours(startHour, startMinute, 0, 0)
    
    const endTime = new Date(now)
    endTime.setHours(endHour, endMinute, 0, 0)
    
    return now >= startTime && now <= endTime && task.status !== 'completed' && task.status !== 'skipped'
  }, [currentTime])

  // Check if task is in grace period
  const isTaskInGracePeriod = useCallback((task: TimeSlot): boolean => {
    return isInGracePeriod(task)
  }, [])

  // Check if task is upcoming
  const isTaskUpcoming = useCallback((task: TimeSlot): boolean => {
    const now = currentTime
    const [startHour] = task.startTime.split(':').map(Number)
    const taskStart = new Date(now)
    taskStart.setHours(startHour, 0, 0, 0)
    
    return now < taskStart && task.status === 'pending'
  }, [currentTime])

  // Check if task is overdue
  const isTaskOverdue = useCallback((task: TimeSlot): boolean => {
    const now = currentTime
    const [endHour, endMinute] = task.endTime.split(':').map(Number)
    const taskEnd = new Date(now)
    taskEnd.setHours(endHour, endMinute, 0, 0)
    
    return now > taskEnd && (task.status === 'pending' || task.status === 'in-progress')
  }, [currentTime])

  // Calculate live data based on current time
  const calculateLiveData = useCallback((): LiveTimeData => {
    const allTasks = Object.values(tasksRef.current).flat()
    const activeTasks = allTasks.filter(task => {
      const now = currentTime
      const [startHour, startMinute] = task.startTime.split(':').map(Number)
      const [endHour, endMinute] = task.endTime.split(':').map(Number)
      
      const startTime = new Date(now)
      startTime.setHours(startHour, startMinute, 0, 0)
      
      const endTime = new Date(now)
      endTime.setHours(endHour, endMinute, 0, 0)
      
      return now >= startTime && now <= endTime && task.status !== 'completed' && task.status !== 'skipped' && task.status !== 'missed'
    })
    
    const upcomingTasks = allTasks.filter(task => {
      const now = currentTime
      const [startHour] = task.startTime.split(':').map(Number)
      const taskStart = new Date(now)
      taskStart.setHours(startHour, 0, 0, 0)
      
      return now < taskStart && task.status === 'pending'
    })
    
    const completedTasks = allTasks.filter(task => task.status === 'completed')
    
    // Calculate progress for current task
    let currentProgress = 0
    if (activeTasks.length > 0) {
      const task = activeTasks[0]
      const startMinutes = convertTimeToMinutes(task.startTime)
      const endMinutes = convertTimeToMinutes(task.endTime)
      const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
      
      const totalDuration = endMinutes - startMinutes
      const elapsed = nowMinutes - startMinutes
      currentProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
    }
    
    return {
      currentTime,
      activeTasks,
      upcomingTasks,
      completedTasks,
      currentProgress
    }
  }, [currentTime])

  // Update live data when current time changes
  useEffect(() => {
    const newLiveData = calculateLiveData()
    setLiveData(newLiveData)
  }, [currentTime, calculateLiveData])

  // Update current day when date changes
  useEffect(() => {
    setCurrentDay(getCurrentDay())
    setCurrentDayFull(getCurrentDayFull())
  }, [currentTime])

  // Update task status with feedback
  const updateTaskStatus = useCallback((
    taskId: string, 
    newStatus: TaskStatus, 
    notes?: string,
    focusScore?: number,
    completedWell?: boolean
  ) => {
    setTasks(prev => {
      const updated = { ...prev }
      let updatedTask: TimeSlot | null = null
      
      for (const day in updated) {
        updated[day] = updated[day].map(task => {
          if (task.id === taskId) {
            updatedTask = { 
              ...task, 
              status: newStatus,
              ...(notes && { notes: task.notes ? `${task.notes}\n${notes}` : notes }),
              ...(newStatus === 'completed' && { 
                completedAt: new Date(),
                focusScore: focusScore || task.focusScore,
                completedBeforeBedtime: convertTimeToMinutes(task.endTime) <= convertTimeToMinutes(bedtimeRef.current)
              }),
              ...(newStatus === 'in-progress' && { startedAt: new Date() }),
              ...(newStatus === 'missed' && { actualDuration: 0 })
            }
            
            return updatedTask
          }
          return task
        })
      }
      
      // Show toast notification after state update
      if (updatedTask) {
        const statusMessages = {
          'completed': `"${updatedTask.title}" marked as completed! 🎉`,
          'in-progress': `Started "${updatedTask.title}"! ⏱️`,
          'missed': `"${updatedTask.title}" marked as missed`,
          'skipped': `"${updatedTask.title}" skipped`,
          'delayed': `"${updatedTask.title}" delayed`,
          'rescheduled': `"${updatedTask.title}" rescheduled`,
          'pending': `"${updatedTask.title}" reset to pending`
        }
        
        setTimeout(() => {
          toast(statusMessages[newStatus], {
            description: newStatus === 'completed' ? `Great job! ${updatedTask!.duration} minutes completed.` : undefined,
            action: newStatus === 'completed' ? {
              label: "Undo",
              onClick: () => updateTaskStatus(taskId, 'pending')
            } : undefined,
          })
        }, 0)
      }
      
      return updated
    })
  }, [])

  // Smart delay task with intelligent scheduling
  const smartDelayTask = useCallback((task: TimeSlot, preferredDelay: number = 30) => {
    const options = findFreeSlots(tasks, task, preferredDelay, bedtime)
    setSmartDelayOptions(options)
    setTaskToDelay(task)
    setShowDelayModal(true)
  }, [tasks, bedtime])

  // Apply smart delay
  const applySmartDelay = useCallback((option: SmartDelayOptions, slotIndex?: number) => {
    if (!taskToDelay) return
    
    const task = taskToDelay
    
    if (slotIndex !== undefined && option.availableSlots[slotIndex]) {
      // Move to available slot
      const slot = option.availableSlots[slotIndex]
      
      setTasks(prev => {
        const updated = { ...prev }
        
        // Remove from original position
        updated[task.day] = updated[task.day].filter(t => t.id !== task.id)
        
        // Add to new position
        const delayedTask: TimeSlot = {
          ...task,
          startTime: slot.startTime,
          endTime: slot.endTime,
          day: slot.day,
          status: 'rescheduled',
          originalStartTime: task.originalStartTime || task.startTime,
          originalEndTime: task.originalEndTime || task.endTime,
          notes: task.notes ? `${task.notes}\nRescheduled to ${slot.day} ${formatTimeDisplay(slot.startTime)}` : `Rescheduled to ${slot.day} ${formatTimeDisplay(slot.startTime)}`
        }
        
        if (!updated[slot.day]) {
          updated[slot.day] = []
        }
        
        updated[slot.day].push(delayedTask)
        // Sort by start time
        updated[slot.day].sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))
        
        return updated
      })
      
      toast("Task rescheduled!", {
        description: `Moved to ${slot.day} at ${formatTimeDisplay(slot.startTime)}`,
      })
      
    } else if (option.canExtend && option.maxExtension > 0) {
      // Extend current task
      const newEndTime = convertMinutesToTime(convertTimeToMinutes(task.endTime) + task.duration)
      
      // Check if extension conflicts with bedtime
      if (convertTimeToMinutes(newEndTime) <= convertTimeToMinutes(bedtimeRef.current)) {
        setTasks(prev => {
          const updated = { ...prev }
          updated[task.day] = updated[task.day].map(t => {
            if (t.id === task.id) {
              return {
                ...t,
                endTime: newEndTime,
                duration: t.duration,
                status: 'rescheduled',
                notes: t.notes ? `${t.notes}\nExtended to complete before ${bedtimeRef.current}` : `Extended to complete before ${bedtimeRef.current}`
              }
            }
            return t
          })
          return updated
        })
        
        toast("Task extended!", {
          description: `Will complete by ${formatTimeDisplay(newEndTime)} (before ${bedtimeRef.current})`,
        })
      } else {
        toast.error("Cannot extend past bedtime", {
          description: `Bedtime is at ${bedtimeRef.current}`,
        })
        return
      }
    } else {
      // No options available
      toast.error("No available slots", {
        description: "Consider reducing task duration or skipping",
      })
      return
    }
    
    setShowDelayModal(false)
    setTaskToDelay(null)
    setSmartDelayOptions(null)
  }, [taskToDelay])

  // Simple delay (for backward compatibility)
  const simpleDelayTask = useCallback((taskId: string, minutes: number) => {
    setTasks(prev => {
      const updated = { ...prev }
      for (const day in updated) {
        updated[day] = updated[day].map(task => {
          if (task.id === taskId) {
            const [hours, mins] = task.startTime.split(':').map(Number)
            const newStartMinutes = hours * 60 + mins + minutes
            const newStartHour = Math.floor(newStartMinutes / 60)
            const newStartMinute = newStartMinutes % 60
            
            const newEndMinutes = newStartMinutes + task.duration
            const newEndHour = Math.floor(newEndMinutes / 60)
            const newEndMinute = newEndMinutes % 60
            
            const newStartTime = `${newStartHour.toString().padStart(2, '0')}:${newStartMinute.toString().padStart(2, '0')}`
            const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}`
            
            // Check if new time conflicts with bedtime
            if (convertTimeToMinutes(newEndTime) > convertTimeToMinutes(bedtimeRef.current)) {
              setTimeout(() => {
                toast.error("Cannot delay past bedtime", {
                  description: `Task would end at ${formatTimeDisplay(newEndTime)} but bedtime is ${bedtimeRef.current}`,
                })
              }, 0)
              return task
            }
            
            // Check if new slot is available
            if (isTimeSlotAvailable(updated, task.day, newStartTime, newEndTime, taskId)) {
              return {
                ...task,
                startTime: newStartTime,
                endTime: newEndTime,
                status: 'rescheduled',
                notes: task.notes ? `${task.notes}\nDelayed by ${minutes} minutes` : `Delayed by ${minutes} minutes`
              }
            } else {
              setTimeout(() => {
                toast.error("Time slot not available", {
                  description: "Another task is scheduled at that time",
                })
              }, 0)
              return task
            }
          }
          return task
        })
      }
      
      setTimeout(() => {
        toast("Task delayed", {
          description: `Task delayed by ${minutes} minutes`,
        })
      }, 0)
      
      return updated
    })
  }, [])

  // Start task timer
  const startTaskTimer = useCallback((taskId: string) => {
    updateTaskStatus(taskId, 'in-progress')
    setTimerRunning(true)
    
    setTimeout(() => {
      toast("Timer started! ⏱️", {
        description: "Task timer is now running",
      })
    }, 0)
  }, [updateTaskStatus])

  // Stop task timer with feedback
  const stopTaskTimer = useCallback((taskId: string) => {
    const task = Object.values(tasks).flat().find(t => t.id === taskId)
    if (task) {
      setTaskForFeedback(task)
      setFeedbackFocus(5)
      setFeedbackNotes('')
      setFeedbackCompletedWell(true)
      setShowFeedbackModal(true)
    }
  }, [tasks])

  // Complete task with feedback
  const completeTaskWithFeedback = useCallback(() => {
    if (!taskForFeedback) return
    
    const now = new Date()
    const isLateNight = now.getHours() >= 22
    
    updateTaskStatus(
      taskForFeedback.id, 
      'completed', 
      feedbackNotes || (feedbackCompletedWell ? 'Completed successfully' : 'Completed with challenges'),
      feedbackFocus,
      feedbackCompletedWell
    )
    
    setShowFeedbackModal(false)
    
    // Show motivational message based on focus score
    if (feedbackFocus >= 8) {
      const message = getMotivationalMessage(now.getHours(), isLateNight, 'focus')
      setCurrentMotivationalMessage(message)
      setShowMotivationalMessage(true)
      
      setTimeout(() => {
        toast.success("Excellent focus! 🎯", {
          description: message.message,
          duration: 5000,
        })
      }, 0)
    } else if (isLateNight) {
      const message = getMotivationalMessage(now.getHours(), true)
      setTimeout(() => {
        toast.success("Great dedication! 🌙", {
          description: message.message,
          duration: 5000,
        })
      }, 0)
    }
    
    setTaskForFeedback(null)
  }, [taskForFeedback, feedbackFocus, feedbackNotes, feedbackCompletedWell, updateTaskStatus])

  // Skip task
  const skipTask = useCallback((taskId: string) => {
    updateTaskStatus(taskId, 'skipped', 'Skipped by user')
    
    setTimeout(() => {
      toast("Task skipped", {
        description: "Task has been skipped",
      })
    }, 0)
  }, [updateTaskStatus])

  // Mark as missed
  const markAsMissed = useCallback((taskId: string) => {
    updateTaskStatus(taskId, 'missed', 'Marked as missed')
  }, [updateTaskStatus])

  // Complete missed task (special function for late night completion)
  const completeMissedTask = useCallback((taskId: string) => {
    const now = new Date()
    const isLateNight = now.getHours() >= 22 // After 10 PM
    
    updateTaskStatus(taskId, 'completed', `Completed at night (${formatTimeDisplay(convertMinutesToTime(now.getHours() * 60 + now.getMinutes()))})`)
    
    // Show motivational message for late night completion
    if (isLateNight) {
      const message = getMotivationalMessage(now.getHours(), true)
      setCurrentMotivationalMessage(message)
      setShowMotivationalMessage(true)
      
      setTimeout(() => {
        toast.success("Great dedication! 🌙", {
          description: message.message,
          duration: 5000,
        })
      }, 0)
    }
  }, [updateTaskStatus])

  // Reschedule missed task to free period
  const rescheduleMissedTaskToFreePeriod = useCallback((task: TimeSlot) => {
    // Find free periods in the schedule
    const freePeriods = Object.values(tasks).flat().filter(t => 
      t.type === 'free' && 
      t.status === 'pending' &&
      convertTimeToMinutes(t.endTime) <= convertTimeToMinutes(bedtime)
    )
    
    if (freePeriods.length > 0) {
      // Find the earliest free period that can accommodate the task
      const suitableFreePeriod = freePeriods.find(fp => fp.duration >= task.duration)
      
      if (suitableFreePeriod) {
        setTasks(prev => {
          const updated = { ...prev }
          
          // Remove from missed status
          updated[task.day] = updated[task.day].map(t => 
            t.id === task.id ? { 
              ...t, 
              status: 'rescheduled',
              startTime: suitableFreePeriod.startTime,
              endTime: convertMinutesToTime(convertTimeToMinutes(suitableFreePeriod.startTime) + task.duration),
              day: suitableFreePeriod.day,
              notes: t.notes ? `${t.notes}\nRescheduled to free period at ${formatTimeDisplay(suitableFreePeriod.startTime)}` : `Rescheduled to free period at ${formatTimeDisplay(suitableFreePeriod.startTime)}`
            } : t
          )
          
          // Remove the free period task since it's now occupied
          updated[suitableFreePeriod.day] = updated[suitableFreePeriod.day].filter(t => t.id !== suitableFreePeriod.id)
          
          return updated
        })
        
        toast.success("Task rescheduled to free period! 📅", {
          description: `"${task.title}" moved to ${suitableFreePeriod.day} at ${formatTimeDisplay(suitableFreePeriod.startTime)}`,
        })
      } else {
        // No suitable free period found, try to reschedule to evening
        const eveningStart = convertMinutesToTime(convertTimeToMinutes(bedtime) - task.duration - 30) // 30 minutes before bedtime
        if (convertTimeToMinutes(eveningStart) >= convertTimeToMinutes('18:00')) {
          setTasks(prev => {
            const updated = { ...prev }
            updated[task.day] = updated[task.day].map(t => 
              t.id === task.id ? { 
                ...t, 
                status: 'rescheduled',
                startTime: eveningStart,
                endTime: convertMinutesToTime(convertTimeToMinutes(eveningStart) + task.duration),
                notes: t.notes ? `${t.notes}\nRescheduled to evening at ${formatTimeDisplay(eveningStart)}` : `Rescheduled to evening at ${formatTimeDisplay(eveningStart)}`
              } : t
            )
            return updated
          })
          
          toast.success("Task rescheduled to evening! 🌆", {
            description: `"${task.title}" moved to ${formatTimeDisplay(eveningStart)}`,
          })
        } else {
          toast.error("No suitable time slot found", {
            description: "Consider completing the task now or skipping it",
          })
        }
      }
    } else {
      // No free periods, try to reschedule to next day morning
      const nextDay = getNextDay(task.day)
      const morningStart = '06:00'
      
      if (isTimeSlotAvailable(tasks, nextDay, morningStart, convertMinutesToTime(convertTimeToMinutes(morningStart) + task.duration))) {
        setTasks(prev => {
          const updated = { ...prev }
          
          // Remove from current day
          updated[task.day] = updated[task.day].filter(t => t.id !== task.id)
          
          // Add to next day
          const rescheduledTask = {
            ...task,
            day: nextDay,
            startTime: morningStart,
            endTime: convertMinutesToTime(convertTimeToMinutes(morningStart) + task.duration),
            status: 'rescheduled',
            notes: task.notes ? `${task.notes}\nRescheduled to tomorrow morning at ${formatTimeDisplay(morningStart)}` : `Rescheduled to tomorrow morning at ${formatTimeDisplay(morningStart)}`
          }
          
          if (!updated[nextDay]) {
            updated[nextDay] = []
          }
          
          updated[nextDay].push(rescheduledTask)
          updated[nextDay].sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))
          
          return updated
        })
        
        toast.success("Task rescheduled to tomorrow morning! ☀️", {
          description: `"${task.title}" moved to ${nextDay} at ${formatTimeDisplay(morningStart)}`,
        })
      } else {
        toast.error("No suitable time slot found", {
          description: "Try completing the task now or mark it as skipped",
        })
      }
    }
  }, [tasks, bedtime])

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  // Auto-refresh tasks status based on time with grace period handling
  useEffect(() => {
    if (!autoRefresh) return
    
    const allTasks = Object.values(tasks).flat()
    const now = currentTime
    
    let hasChanges = false
    const updatedTasks = { ...tasks }
    
    allTasks.forEach(task => {
      const [endHour, endMinute] = task.endTime.split(':').map(Number)
      const taskEnd = new Date(now)
      taskEnd.setHours(endHour, endMinute, 0, 0)
      
      const gracePeriodEnd = new Date(taskEnd)
      gracePeriodEnd.setHours(gracePeriodEnd.getHours() + 1)
      
      // Auto-mark as missed if past grace period and still pending (only for real activities)
      if (now > gracePeriodEnd && task.status === 'pending' && isRealActivity(task)) {
        updatedTasks[task.day] = updatedTasks[task.day].map(t => 
          t.id === task.id ? { 
            ...t, 
            status: 'missed',
            notes: t.notes ? `${t.notes}\nAuto-marked as missed (no update within 1 hour)` : 'Auto-marked as missed (no update within 1 hour)'
          } : t
        )
        hasChanges = true
        
        setTimeout(() => {
          toast.warning("Task marked as missed", {
            description: `${task.title} - No status update within 1 hour of completion`,
          })
        }, 0)
      }
      
      // Auto-start task if start time reached (only for real activities)
      const [startHour, startMinute] = task.startTime.split(':').map(Number)
      const taskStart = new Date(now)
      taskStart.setHours(startHour, startMinute, 0, 0)
      
      if (now >= taskStart && now <= taskEnd && task.status === 'pending' && isRealActivity(task)) {
        updatedTasks[task.day] = updatedTasks[task.day].map(t => 
          t.id === task.id ? { 
            ...t, 
            status: 'in-progress',
            startedAt: new Date()
          } : t
        )
        hasChanges = true
        
        setTimeout(() => {
          toast.info("Task started automatically", {
            description: `${task.title} has started`,
          })
        }, 0)
      }
    })
    
    if (hasChanges) {
      setTasks(updatedTasks)
    }
  }, [currentTime, autoRefresh])

  // Generate time slots
  const generateTimeSlots = useMemo(() => {
    const slots = []
    for (let hour = timeRange[0]; hour <= timeRange[1]; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === timeRange[1] && minute > 0) break
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }, [timeRange])

  const timeSlots = generateTimeSlots
  const days = showWeekends 
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

  // Calculate statistics
  const stats = useMemo(() => {
    const allTasks = Object.values(tasks).flat().filter(isRealActivity) // Only count real activities
    const totalTasks = allTasks.length
    const completedTasksCount = allTasks.filter(task => task.status === 'completed').length
    const inProgressTasks = allTasks.filter(task => task.status === 'in-progress').length
    const missedTasksCount = allTasks.filter(task => task.status === 'missed').length
    const rescheduledTasks = allTasks.filter(task => task.status === 'rescheduled').length
    const totalDuration = allTasks.reduce((sum, task) => sum + task.duration, 0)
    const completedDuration = allTasks
      .filter(task => task.status === 'completed')
      .reduce((sum, task) => sum + task.duration, 0)
    
    // Calculate efficiency (completed on time vs delayed/rescheduled)
    const onTimeTasks = allTasks.filter(task => 
      task.status === 'completed' && !task.notes?.includes('Rescheduled') && !task.notes?.includes('Delayed')
    ).length
    
    // Calculate average focus score
    const completedWithScores = allTasks.filter(task => task.status === 'completed' && task.focusScore)
    const avgFocusScore = completedWithScores.length > 0 
      ? completedWithScores.reduce((sum, task) => sum + (task.focusScore || 0), 0) / completedWithScores.length
      : 0
    
    return {
      totalTasks,
      completedTasks: completedTasksCount,
      inProgressTasks,
      missedTasks: missedTasksCount,
      rescheduledTasks,
      onTimeTasks,
      totalHours: (totalDuration / 60).toFixed(1),
      completedHours: (completedDuration / 60).toFixed(1),
      completionRate: totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0,
      efficiencyRate: totalTasks > 0 ? Math.round((onTimeTasks / totalTasks) * 100) : 0,
      onTimeRate: totalTasks > 0 ? Math.round((onTimeTasks / totalTasks) * 100) : 0,
      avgFocusScore: Math.round(avgFocusScore * 10) / 10
    }
  }, [tasks])

  // Check if task should be shown in cell
  const shouldShowTaskInCell = useCallback((task: TimeSlot, day: string, time: string) => {
    if (task.day !== day) return false
    const taskStartMinutes = convertTimeToMinutes(task.startTime)
    const cellMinutes = convertTimeToMinutes(time)
    return taskStartMinutes === cellMinutes
  }, [])

  // Check if time is current time
  const isCurrentTime = useCallback((time: string) => {
    const currentHour = currentTime.getHours().toString().padStart(2, '0')
    const currentMinute = Math.floor(currentTime.getMinutes() / 30) * 30
    const currentTimeStr = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`
    return time === currentTimeStr
  }, [currentTime])

  // Calendar functions
  const calendarDays = useMemo(() => {
    return generateCalendarDays(currentYear, currentMonth, tasks)
  }, [currentYear, currentMonth, tasks])

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setSelectedDate(today)
  }

  // Drag and drop handlers
  const handleDragStart = (task: TimeSlot) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    if (!draggedTask) return

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const newDay = dayNames[date.getDay()]
    
    // Update task with new date and day
    setTasks(prev => {
      const updated = { ...prev }
      
      // Remove from old day
      updated[draggedTask.day] = updated[draggedTask.day].filter(t => t.id !== draggedTask.id)
      
      // Add to new day
      const updatedTask = {
        ...draggedTask,
        day: newDay,
        date: date
      }
      
      if (!updated[newDay]) {
        updated[newDay] = []
      }
      
      updated[newDay].push(updatedTask)
      updated[newDay].sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime))
      
      setTimeout(() => {
        toast("Task moved!", {
          description: `Moved "${draggedTask.title}" to ${formatDate(date)}`,
        })
      }, 0)
      
      return updated
    })
    
    setDraggedTask(null)
  }

  // Calculate cell height based on compact mode
  const getCellHeight = useCallback(() => {
    return compactMode ? 40 : 60
  }, [compactMode])

  // Calculate cell width based on compact mode and number of days
  const getCellWidth = useCallback(() => {
    const baseWidth = compactMode ? 100 : 120
    return baseWidth
  }, [compactMode])

  // Task cell component
  const TaskCell = ({ 
    task, 
    cellHeight, 
    cellWidth,
    isCurrent,
    isOverdue,
    compact = false
  }: { 
    task: TimeSlot, 
    cellHeight: number, 
    cellWidth: number,
    isCurrent: boolean,
    isOverdue: boolean,
    compact?: boolean
  }) => {
    const Icon = getIconComponent(task.icon || 'Clock')
    const duration = convertTimeToMinutes(task.endTime) - convertTimeToMinutes(task.startTime)
    const span = Math.max(1, Math.ceil(duration / 30))
    const inGracePeriod = isTaskInGracePeriod(task)
    
    // Status-based styling
    const statusStyles = {
      'completed': 'border-green-500 bg-green-500/10',
      'in-progress': 'border-blue-500 bg-blue-500/10',
      'missed': 'border-red-500 bg-red-500/10',
      'skipped': 'border-gray-500 bg-gray-500/10',
      'delayed': 'border-yellow-500 bg-yellow-500/10',
      'rescheduled': 'border-purple-500 bg-purple-500/10',
      'pending': inGracePeriod
        ? 'border-yellow-400 bg-yellow-500/10 animate-pulse'
        : isOverdue 
        ? 'border-red-300 bg-red-500/5' 
        : isCurrent 
        ? 'border-blue-300 bg-blue-500/5' 
        : 'border-gray-300 dark:border-gray-700'
    }
    
    // Status icons
    const statusIcons = {
      'completed': CheckCircle,
      'in-progress': PlayCircle,
      'missed': CircleX,
      'skipped': SkipForward,
      'delayed': Clock,
      'rescheduled': CalendarClock,
      'pending': inGracePeriod ? AlarmClock : (isCurrent ? CircleDot : Circle)
    }
    
    const StatusIcon = statusIcons[task.status] || Circle

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`absolute top-0.5 left-0.5 right-0.5 rounded-lg border shadow-sm z-30 overflow-hidden cursor-pointer group/task ${statusStyles[task.status]}`}
        style={{ 
          height: compact ? 'auto' : `${cellHeight * span - 4}px`,
          minHeight: compact ? 'auto' : `${cellHeight - 4}px`,
          borderLeft: `4px solid ${task.color}`,
          width: displayMode === 'vertical' ? 'auto' : `calc(${cellWidth}px - 8px)`,
        }}
        whileHover={{ scale: 1.02 }}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedTask(task)
          setShowTaskModal(true)
        }}
        draggable
        onDragStart={() => handleDragStart(task)}
      >
        <div className={cn("p-2 h-full flex flex-col", compact && "p-1")}>
          {/* Task header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Icon className={cn("flex-shrink-0", compact ? "w-2 h-2" : "w-3 h-3")} style={{ color: task.color }} />
              <h4 className={cn("font-semibold truncate", compact ? "text-[10px]" : "text-xs")}>{task.title}</h4>
            </div>
            <StatusIcon className={cn(`flex-shrink-0 ${
              task.status === 'completed' ? 'text-green-500' :
              task.status === 'in-progress' ? 'text-blue-500 animate-pulse' :
              task.status === 'missed' ? 'text-red-500' :
              task.status === 'delayed' ? 'text-yellow-500' :
              task.status === 'rescheduled' ? 'text-purple-500' :
              inGracePeriod ? 'text-yellow-500 animate-pulse' :
              isCurrent ? 'text-blue-500' : 'text-gray-500'
            }`, compact ? "w-2 h-2" : "w-3 h-3")} />
          </div>
          
          {/* Task details */}
          {!compact && (
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[8px] truncate max-w-[50px] px-1 py-0">
                  {task.apiType === 'FIXED' ? 'Fixed' : 
                   task.apiType === 'FREE' ? 'Free' : 'Other'}
                </Badge>
                {task.priority === 'HIGH' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
              
              {/* Time for multi-slot tasks */}
              {span > 1 && (
                <div className="text-[8px] text-gray-500 dark:text-gray-400 text-center mt-1">
                  {formatTimeDisplay(task.startTime)}
                </div>
              )}
              
              {/* Grace period indicator */}
              {inGracePeriod && (
                <div className="text-[6px] text-yellow-600 dark:text-yellow-400 mt-1 flex items-center gap-1">
                  <AlarmClock className="w-1.5 h-1.5" />
                  <span>1h left</span>
                </div>
              )}
              
              {/* Focus score for completed tasks */}
              {task.status === 'completed' && task.focusScore && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={cn(
                          "w-1.5 h-1.5",
                          star <= (task.focusScore || 0) / 2
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 dark:text-gray-600"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Drag handle */}
          <div className="absolute top-0.5 left-0.5 opacity-0 group-hover/task:opacity-100 transition-opacity">
            <GripVertical className="w-2 h-2 text-gray-400" />
          </div>
        </div>

        {/* Quick action buttons on hover */}
        {!compact && (
          <div className="absolute top-0.5 right-0.5 opacity-0 group-hover/task:opacity-100 transition-opacity flex gap-0.5">
            {task.status === 'pending' && !inGracePeriod && isRealActivity(task) ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-4 w-4 bg-white/90 dark:bg-gray-800/90 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  startTaskTimer(task.id)
                }}
              >
                <PlayCircle className="w-2 h-2" />
              </Button>
            ) : task.status === 'in-progress' ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-4 w-4 bg-white/90 dark:bg-gray-800/90 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  stopTaskTimer(task.id)
                }}
              >
                <StopCircle className="w-2 h-2" />
              </Button>
            ) : inGracePeriod && isRealActivity(task) ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-4 w-4 bg-white/90 dark:bg-gray-800/90 shadow-sm text-yellow-600"
                onClick={(e) => {
                  e.stopPropagation()
                  setTaskForFeedback(task)
                  setFeedbackFocus(5)
                  setFeedbackNotes('')
                  setFeedbackCompletedWell(true)
                  setShowFeedbackModal(true)
                }}
              >
                <Edit2 className="w-2 h-2" />
              </Button>
            ) : null}
          </div>
        )}

        {/* Progress bar for in-progress tasks */}
        {task.status === 'in-progress' && !compact && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5">
            <div 
              className="h-full rounded-b-lg"
              style={{ 
                width: `${liveData.currentProgress}%`,
                backgroundColor: task.color,
                transition: 'width 1s linear'
              }}
            />
          </div>
        )}
      </motion.div>
    )
  }

  // Render grace period tasks section (tasks that ended in last 1 hour)
  const renderGracePeriodSection = () => {
    if (gracePeriodTasks.length === 0) return null

    return (
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlarmClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            Tasks Need Your Feedback
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 animate-pulse">
              {gracePeriodTasks.length} tasks
            </Badge>
          </CardTitle>
          <CardDescription>
            These tasks ended recently. Update their status within 1 hour or they'll be marked as missed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gracePeriodTasks.map((task) => {
              const Icon = getIconComponent(task.icon || 'Clock')
              const timeSinceEnd = Math.floor((currentTime.getTime() - new Date(currentTime).setHours(
                ...task.endTime.split(':').map(Number)
              )) / 60000)
              const timeRemaining = 60 - timeSinceEnd
              
              return (
                <div key={task.id} className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${task.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: task.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{task.title}</h3>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 animate-pulse">
                            {timeRemaining} min left
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ended at {formatTimeDisplay(task.endTime)} • Duration: {task.duration} min
                        </p>
                        <Progress 
                          value={(timeSinceEnd / 60) * 100} 
                          className="h-1.5 w-48 mt-2"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setTaskForFeedback(task)
                          setFeedbackFocus(5)
                          setFeedbackNotes('')
                          setFeedbackCompletedWell(true)
                          setShowFeedbackModal(true)
                        }}
                        className="gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Update Status
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => smartDelayTask(task)}
                        className="gap-1"
                      >
                        <CalendarClock className="w-4 h-4" />
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render missed tasks section - IMPROVED UI
  const renderMissedTasksSection = () => {
    if (missedTasks.length === 0) return null

    const now = new Date()
    const isLateNight = now.getHours() >= 22
    const motivationalMessage = getMotivationalMessage(now.getHours(), isLateNight)

    return (
      <div className="space-y-6">
        {/* Motivational Message Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 dark:border-orange-500/20 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
              {motivationalMessage.icon && (
                <motivationalMessage.icon className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">Recover Missed Tasks 💪</h3>
                <Badge className={`
                  ${isLateNight 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 animate-pulse' 
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  }
                `}>
                  {isLateNight ? '🌙 Late Night Mode' : '⏰ Still Time Left'}
                </Badge>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {motivationalMessage.message} {motivationalMessage.emoji}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Missed Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {missedTasks.map((task, index) => {
            const Icon = getIconComponent(task.icon || 'Clock')
            const timeUntilBedtime = convertTimeToMinutes(bedtime) - (currentTime.getHours() * 60 + currentTime.getMinutes())
            const urgencyLevel = timeUntilBedtime < 60 ? 'high' : timeUntilBedtime < 120 ? 'medium' : 'low'
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-900 rounded-xl border-2 overflow-hidden hover:shadow-xl transition-all duration-300"
                style={{
                  borderColor: urgencyLevel === 'high' ? '#EF4444' : 
                              urgencyLevel === 'medium' ? '#F59E0B' : '#10B981',
                  boxShadow: urgencyLevel === 'high' ? '0 4px 20px rgba(239, 68, 68, 0.2)' : 
                            urgencyLevel === 'medium' ? '0 4px 20px rgba(245, 158, 11, 0.2)' : 
                            '0 4px 20px rgba(16, 185, 129, 0.2)'
                }}
              >
                {/* Header with gradient */}
                <div 
                  className="px-4 py-3"
                  style={{
                    background: `linear-gradient(135deg, ${task.color}20 0%, ${task.color}05 100%)`,
                    borderBottom: `1px solid ${task.color}30`
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <Icon className="w-5 h-5" style={{ color: task.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg line-clamp-1">{task.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {task.subject} • {task.duration} min
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className={`
                        ${urgencyLevel === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          urgencyLevel === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}
                      `}
                    >
                      {urgencyLevel === 'high' ? 'Urgent' : 
                       urgencyLevel === 'medium' ? 'Moderate' : 'Relaxed'}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Time info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Original Time</span>
                    </div>
                    <span className="font-medium">{formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}</span>
                  </div>

                  {/* Time remaining */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">Time until bedtime</span>
                      </div>
                      <span className={`
                        font-medium
                        ${timeUntilBedtime < 30 ? 'text-red-500 animate-pulse' :
                          timeUntilBedtime < 60 ? 'text-orange-500' :
                          timeUntilBedtime < 120 ? 'text-yellow-500' :
                          'text-green-500'}
                      `}>
                        {Math.floor(timeUntilBedtime / 60)}h {timeUntilBedtime % 60}m
                      </span>
                    </div>
                    <Progress 
                      value={(timeUntilBedtime / convertTimeToMinutes(bedtime)) * 100} 
                      className={`
                        h-2
                        ${timeUntilBedtime < 30 ? 'bg-red-100 [&>div]:bg-red-500' :
                          timeUntilBedtime < 60 ? 'bg-orange-100 [&>div]:bg-orange-500' :
                          timeUntilBedtime < 120 ? 'bg-yellow-100 [&>div]:bg-yellow-500' :
                          'bg-green-100 [&>div]:bg-green-500'}
                      `}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => completeMissedTask(task.id)}
                      className="gap-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rescheduleMissedTaskToFreePeriod(task)}
                      className="gap-1 border-amber-500 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/20"
                    >
                      <CalendarClock className="w-4 h-4" />
                      Free Period
                    </Button>
                  </div>

                  {/* More options */}
                  <div className="flex items-center justify-between pt-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => smartDelayTask(task)}
                      className="text-xs gap-1 h-7"
                    >
                      <Clock className="w-3 h-3" />
                      Smart Delay
                    </Button>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => simpleDelayTask(task.id, 30)}
                        className="text-xs h-7"
                        disabled={convertTimeToMinutes(task.endTime) + 30 > convertTimeToMinutes(bedtime)}
                      >
                        +30m
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => skipTask(task.id)}
                        className="text-xs h-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <SkipForward className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Urgent indicator for high urgency */}
                {urgencyLevel === 'high' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Batch actions footer */}
        <Card>
          <CardFooter className="py-3">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <AlertCircle className="w-4 h-4" />
                <span>
                  {missedTasks.length} missed {missedTasks.length === 1 ? 'task' : 'tasks'} • Complete before {formatTimeDisplay(bedtime)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    missedTasks.forEach(task => {
                      if (convertTimeToMinutes(bedtime) - (currentTime.getHours() * 60 + currentTime.getMinutes()) >= task.duration) {
                        completeMissedTask(task.id)
                      }
                    })
                    setTimeout(() => {
                      toast.success("Great job! 🎉", {
                        description: `Completed ${missedTasks.length} missed tasks`,
                        duration: 5000,
                      })
                    }, 0)
                  }}
                  className="gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Complete All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    missedTasks.forEach(task => {
                      rescheduleMissedTaskToFreePeriod(task)
                    })
                  }}
                  className="gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  Delay All
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Render feedback modal
  const renderFeedbackModal = () => {
    if (!taskForFeedback) return null

    return (
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              How was your task?
            </DialogTitle>
            <DialogDescription>
              Rate your focus and let us know how it went
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Task info */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${taskForFeedback.color}20` }}
                >
                  {(() => {
                    const Icon = getIconComponent(taskForFeedback.icon || 'Clock')
                    return <Icon className="w-5 h-5" style={{ color: taskForFeedback.color }} />
                  })()}
                </div>
                <div>
                  <div className="font-bold">{taskForFeedback.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {taskForFeedback.subject} • {taskForFeedback.duration} minutes
                  </div>
                </div>
              </div>
            </div>

            {/* Focus level slider */}
            <div className="space-y-3">
              <Label className="flex items-center justify-between">
                <span>Focus Level</span>
                <Badge className={`
                  ${feedbackFocus >= 8 ? 'bg-green-100 text-green-800' :
                    feedbackFocus >= 5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}
                `}>
                  {feedbackFocus}/10
                </Badge>
              </Label>
              <Slider
                value={[feedbackFocus]}
                onValueChange={(value) => setFeedbackFocus(value[0])}
                min={1}
                max={10}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Poor Focus</span>
                <span>Average</span>
                <span>Excellent Focus</span>
              </div>
            </div>

            {/* Completed well toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="completed-well"
                checked={feedbackCompletedWell}
                onCheckedChange={setFeedbackCompletedWell}
              />
              <Label htmlFor="completed-well" className="font-medium">
                I completed the task well
              </Label>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="feedback-notes">Notes (optional)</Label>
              <Textarea
                id="feedback-notes"
                placeholder="How did it go? Any challenges?"
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowFeedbackModal(false)
                setTaskForFeedback(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={completeTaskWithFeedback}>
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Render timetable grid based on display mode
  const renderTimetableGrid = () => {
    const cellHeight = getCellHeight()
    const cellWidth = getCellWidth()

    if (loading) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading your timetable...</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (error) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400 mb-2">Failed to load timetable</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Vertical View (Days as columns, Time as rows)
    if (displayMode === 'vertical') {
      return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="min-w-[800px]">
            {/* Header row - Days */}
            <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky top-0 z-20">
              <div 
                className="flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 p-3"
                style={{ width: cellWidth }}
              >
                <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">Time</div>
              </div>
              {days.map((day, index) => {
                const isToday = day === getCurrentDay()
                return (
                  <div
                    key={day}
                    className={`flex-1 p-3 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0 transition-all ${
                      isToday 
                        ? 'bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-700 relative' 
                        : ['Sat', 'Sun'].includes(day) 
                        ? "bg-blue-50/50 dark:bg-blue-900/20" 
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <span className={`font-bold text-sm ${
                          isToday ? 'text-blue-700 dark:text-blue-300' :
                          ['Sat', 'Sun'].includes(day) ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-gray-100"
                        }`}>
                          {day}
                        </span>
                        {isToday && (
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {isToday ? 'Today' : ['Sat', 'Sun'].includes(day) ? "Weekend" : "Weekday"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Time slots grid */}
            <div className="flex flex-col">
              {timeSlots.map((time, timeIndex) => {
                const displayTime = formatTimeDisplay(time)
                const isHourMark = time.endsWith(':00')
                const isCurrentTimeSlot = isCurrentTime(time)
                const isBedtime = time === bedtime
                
                return (
                  <div 
                    key={time} 
                    className={`flex border-b border-gray-200 dark:border-gray-800 last:border-b-0 ${
                      isCurrentTimeSlot ? 'bg-yellow-50/30 dark:bg-yellow-900/10' :
                      isBedtime ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''
                    }`}
                    style={{ height: `${cellHeight}px` }}
                  >
                    {/* Time column */}
                    <div className={`flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 flex items-center justify-center ${
                      isCurrentTimeSlot ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      isBedtime ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-800'
                    }`} style={{ width: cellWidth }}>
                      <div className={`text-center ${isHourMark ? 'font-bold' : 'text-gray-600 dark:text-gray-400'} text-xs ${
                        isCurrentTimeSlot ? 'text-yellow-700 dark:text-yellow-300' :
                        isBedtime ? 'text-purple-700 dark:text-purple-300' : ''
                      }`}>
                        <div className="flex items-center gap-1">
                          <div>{displayTime}</div>
                          {isCurrentTimeSlot && (
                            <div className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse" />
                          )}
                          {isBedtime && (
                            <Bed className="w-2 h-2" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Day columns */}
                    {days.map(day => {
                      const dayTasks = tasks[day] || []
                      const tasksInCell = dayTasks.filter(task => {
                        const taskStartMinutes = convertTimeToMinutes(task.startTime)
                        const taskEndMinutes = convertTimeToMinutes(task.endTime)
                        const cellMinutes = convertTimeToMinutes(time)
                        return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
                      })
                      
                      const primaryTask = tasksInCell.find(task => 
                        convertTimeToMinutes(task.startTime) === convertTimeToMinutes(time)
                      ) || tasksInCell[0]
                      
                      return (
                        <div
                          key={`${day}-${time}`}
                          className={`flex-1 border-r border-gray-200 dark:border-gray-800 last:border-r-0 relative group ${
                            primaryTask ? 'cursor-pointer' : ''
                          } ${isHourMark ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''}`}
                          onClick={() => {
                            if (primaryTask) {
                              setSelectedTask(primaryTask)
                              setShowTaskModal(true)
                            }
                          }}
                        >
                          {primaryTask && shouldShowTaskInCell(primaryTask, day, time) && (
                            <TaskCell 
                              task={primaryTask} 
                              cellHeight={cellHeight}
                              cellWidth={cellWidth}
                              isCurrent={isTaskCurrent(primaryTask)}
                              isOverdue={isTaskOverdue(primaryTask)}
                              compact={compactMode}
                            />
                          )}

                          {/* Current time indicator line */}
                          {isCurrentTimeSlot && !primaryTask && (
                            <div className="absolute inset-0 border-l-2 border-yellow-500">
                              <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
                              <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                            </div>
                          )}

                          {/* Bedtime indicator */}
                          {isBedtime && !primaryTask && (
                            <div className="absolute inset-0 border-l-2 border-purple-500">
                              <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            </div>
                          )}

                          {/* Free period indicator */}
                          {day === getCurrentDay() && primaryTask?.apiType === 'FREE' && (
                            <div className="absolute top-0.5 right-0.5">
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-[6px] px-1 py-0">
                                Free
                              </Badge>
                            </div>
                          )}

                          {/* Fixed time indicator */}
                          {day === getCurrentDay() && primaryTask?.apiType === 'FIXED' && (
                            <div className="absolute top-0.5 right-0.5">
                              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-[6px] px-1 py-0">
                                Fixed
                              </Badge>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    // Horizontal View (Days as rows, Time as columns)
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="min-w-[1200px]">
          {/* Header row - Time slots */}
          <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky top-0 z-20">
            <div 
              className="flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 p-3"
              style={{ width: cellWidth }}
            >
              <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">Day</div>
            </div>
            {timeSlots.map((time) => {
              const isHourMark = time.endsWith(':00')
              const isCurrentTimeSlot = isCurrentTime(time)
              const isBedtime = time === bedtime
              
              return (
                <div
                  key={time}
                  className={`flex-1 p-2 text-center font-medium border-r border-gray-300 dark:border-gray-700 last:border-r-0 ${
                    isCurrentTimeSlot ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    isBedtime ? 'bg-purple-100 dark:bg-purple-900/20' :
                    isHourMark ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-medium ${
                        isCurrentTimeSlot ? 'text-yellow-700 dark:text-yellow-300' :
                        isBedtime ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {formatTimeDisplay(time)}
                      </span>
                      {isCurrentTimeSlot && (
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
                      )}
                      {isBedtime && (
                        <Bed className="w-2 h-2 text-purple-500" />
                      )}
                    </div>
                    {isHourMark && (
                      <span className="text-[8px] text-gray-500 dark:text-gray-400 mt-0.5">Hour</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Days as rows */}
          {days.map((day, dayIndex) => {
            const isToday = day === getCurrentDay()
            return (
              <div 
                key={day} 
                className={`flex border-b border-gray-200 dark:border-gray-800 last:border-b-0 ${
                  isToday ? 'bg-gradient-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-900/20 dark:to-blue-900/10' : ''
                }`}
                style={{ minHeight: `${cellHeight}px` }}
              >
                {/* Day column */}
                <div 
                  className={`flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 flex items-center justify-center ${
                    isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'
                  }`}
                  style={{ width: cellWidth }}
                >
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <span className={`font-bold text-sm ${
                        isToday ? 'text-blue-700 dark:text-blue-300' :
                        ['Sat', 'Sun'].includes(day) ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-gray-100"
                      }`}>
                        {day}
                      </span>
                      {isToday && (
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {isToday ? 'Today' : ['Sat', 'Sun'].includes(day) ? "Weekend" : "Weekday"}
                    </span>
                  </div>
                </div>

                {/* Time cells */}
                {timeSlots.map((time) => {
                  const dayTasks = tasks[day] || []
                  const tasksInCell = dayTasks.filter(task => {
                    const taskStartMinutes = convertTimeToMinutes(task.startTime)
                    const taskEndMinutes = convertTimeToMinutes(task.endTime)
                    const cellMinutes = convertTimeToMinutes(time)
                    return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
                  })
                  
                  const primaryTask = tasksInCell.find(task => 
                    convertTimeToMinutes(task.startTime) === convertTimeToMinutes(time)
                  ) || tasksInCell[0]
                  
                  const isCurrentTimeSlot = isCurrentTime(time)
                  const isBedtime = time === bedtime
                  
                  return (
                    <div
                      key={`${day}-${time}`}
                      className={`flex-1 border-r border-gray-200 dark:border-gray-800 last:border-r-0 relative group ${
                        primaryTask ? 'cursor-pointer' : ''
                      } ${isCurrentTimeSlot ? 'bg-yellow-50/30 dark:bg-yellow-900/10' : ''} ${
                        isBedtime ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''
                      }`}
                      style={{ minHeight: `${cellHeight}px` }}
                      onClick={() => {
                        if (primaryTask) {
                          setSelectedTask(primaryTask)
                          setShowTaskModal(true)
                        }
                      }}
                    >
                      {primaryTask && shouldShowTaskInCell(primaryTask, day, time) && (
                        <TaskCell 
                          task={primaryTask} 
                          cellHeight={cellHeight}
                          cellWidth={cellWidth}
                          isCurrent={isTaskCurrent(primaryTask)}
                          isOverdue={isTaskOverdue(primaryTask)}
                          compact={compactMode}
                        />
                      )}

                      {/* Free period indicator */}
                      {primaryTask?.apiType === 'FREE' && (
                        <div className="absolute top-0.5 right-0.5">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-[6px] px-1 py-0">
                            Free
                          </Badge>
                        </div>
                      )}

                      {/* Fixed time indicator */}
                      {primaryTask?.apiType === 'FIXED' && (
                        <div className="absolute top-0.5 right-0.5">
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-[6px] px-1 py-0">
                            Fixed
                          </Badge>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render calendar view
  const renderCalendarView = () => {
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    if (loading) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading calendar...</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (error) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400 mb-2">Failed to load calendar</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Calendar View
              </CardTitle>
              <CardDescription>
                {getMonthName(currentMonth)} {currentYear} • Drag and drop tasks to reschedule
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCalendarView('month')}
                  className={calendarView === 'month' ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                >
                  Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCalendarView('week')}
                  className={calendarView === 'week' ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                >
                  Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCalendarView('day')}
                  className={calendarView === 'day' ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                >
                  Day
                </Button>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousMonth}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={goToToday}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextMonth}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Month View */}
          {calendarView === 'month' && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Calendar Header - Days */}
              <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
                {dayHeaders.map((day, index) => (
                  <div
                    key={day}
                    className="p-3 text-center font-medium bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-800 last:border-r-0"
                  >
                    <span className={index === 0 || index === 6 ? "text-blue-600 dark:text-blue-400" : ""}>
                      {day}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[100px] border-r border-b border-gray-200 dark:border-gray-800 p-1 relative",
                      !day.isCurrentMonth && "bg-gray-50/50 dark:bg-gray-900/30",
                      day.isWeekend && day.isCurrentMonth && "bg-blue-50/30 dark:bg-blue-900/10",
                      day.isToday && "bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-500",
                      index % 7 === 6 && "border-r-0",
                      index >= calendarDays.length - 7 && "border-b-0"
                    )}
                    onDragOver={(e) => handleDragOver(e, day.date)}
                    onDrop={(e) => handleDrop(e, day.date)}
                    onClick={() => {
                      setSelectedDate(day.date)
                      if (calendarView !== 'day') {
                        setCalendarView('day')
                      }
                    }}
                  >
                    {/* Date header */}
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "font-medium text-xs",
                        !day.isCurrentMonth && "text-gray-400 dark:text-gray-600",
                        day.isToday && "text-blue-600 dark:text-blue-400 font-bold"
                      )}>
                        {day.date.getDate()}
                      </span>
                      
                      {day.isToday && (
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                      )}
                      
                      {day.tasks.length > 0 && (
                        <Badge variant="outline" className="h-4 px-1 text-[8px]">
                          {day.tasks.length}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Tasks for the day */}
                    <div className="space-y-1 overflow-y-auto max-h-[60px]">
                      {day.tasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className="text-[8px] p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow truncate"
                          style={{ 
                            backgroundColor: `${task.color}15`,
                            borderColor: `${task.color}30`,
                            borderLeft: `2px solid ${task.color}`
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedTask(task)
                            setShowTaskModal(true)
                          }}
                        >
                          <div className="font-medium truncate">{task.title}</div>
                        </div>
                      ))}
                      
                      {day.tasks.length > 2 && (
                        <div className="text-[6px] text-gray-500 dark:text-gray-400 text-center">
                          +{day.tasks.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Week View */}
          {calendarView === 'week' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">
                  Week of {formatDate(calendarDays[0].date)}
                </h3>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                  {calendarDays.filter(d => d.isCurrentMonth).length} days
                </Badge>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.slice(0, 7).map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      "rounded-lg border p-2 min-h-[150px]",
                      day.isToday && "border-blue-500 bg-blue-50 dark:bg-blue-900/10",
                      !day.isCurrentMonth && "opacity-60"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-bold text-xs">{dayHeaders[index]}</div>
                        <div className={cn(
                          "text-sm font-bold",
                          day.isToday && "text-blue-600 dark:text-blue-400"
                        )}>
                          {day.date.getDate()}
                        </div>
                      </div>
                      {day.isToday && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {day.tasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className="p-1 rounded text-[8px] cursor-pointer hover:shadow-sm transition-shadow truncate"
                          style={{ 
                            backgroundColor: `${task.color}15`,
                            borderLeft: `2px solid ${task.color}`
                          }}
                          onClick={() => {
                            setSelectedTask(task)
                            setShowTaskModal(true)
                          }}
                        >
                          <div className="font-medium truncate">{task.title}</div>
                          <div className="text-[6px] text-gray-600 dark:text-gray-400">
                            {formatTimeDisplay(task.startTime)}
                          </div>
                        </div>
                      ))}
                      
                      {day.tasks.length === 0 && (
                        <div className="text-[8px] text-gray-400 dark:text-gray-600 text-center py-2">
                          No tasks
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Day View */}
          {calendarView === 'day' && selectedDate && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">
                  {formatDate(selectedDate)}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    selectedDate.getDay() === 0 || selectedDate.getDay() === 6 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
                    "text-xs"
                  )}>
                    {dayHeaders[selectedDate.getDay()]}
                  </Badge>
                  {selectedDate.toDateString() === new Date().toDateString() && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 animate-pulse text-xs">
                      Today
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Time slots */}
                <div className="lg:col-span-3">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-xs">Schedule</div>
                        <Badge className="text-[8px]">
                          {calendarDays.find(d => 
                            d.date.toDateString() === selectedDate.toDateString()
                          )?.tasks.length || 0} tasks
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                      {timeSlots.slice(0, 24).map((time) => {
                        const dayName = dayHeaders[selectedDate.getDay()]
                        const dayTasks = tasks[dayName] || []
                        const tasksAtTime = dayTasks.filter(task => {
                          if (!task.date) return false
                          return task.date.toDateString() === selectedDate.toDateString() &&
                                 convertTimeToMinutes(task.startTime) <= convertTimeToMinutes(time) &&
                                 convertTimeToMinutes(task.endTime) > convertTimeToMinutes(time)
                        })
                        
                        return (
                          <div 
                            key={time}
                            className="p-2 min-h-[40px] hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                          >
                            <div className="flex">
                              <div className="w-16 flex-shrink-0">
                                <div className="font-medium text-[10px] text-gray-700 dark:text-gray-300">
                                  {formatTimeDisplay(time)}
                                </div>
                              </div>
                              
                              <div className="flex-1">
                                {tasksAtTime.map((task) => (
                                  <div
                                    key={task.id}
                                    className="mb-1 last:mb-0 p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow"
                                    style={{ 
                                      backgroundColor: `${task.color}15`,
                                      borderColor: `${task.color}30`,
                                      borderLeft: `2px solid ${task.color}`
                                    }}
                                    onClick={() => {
                                      setSelectedTask(task)
                                      setShowTaskModal(true)
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="font-medium text-[10px]">{task.title}</div>
                                      <Badge className="text-[6px] px-1 py-0">
                                        {task.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                                
                                {tasksAtTime.length === 0 && (
                                  <div className="text-[8px] text-gray-400 dark:text-gray-600">
                                    No tasks
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Day stats */}
                <div className="space-y-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs">Day Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600 dark:text-gray-400">Total Tasks</span>
                        <span className="font-bold">
                          {calendarDays.find(d => 
                            d.date.toDateString() === selectedDate.toDateString()
                          )?.tasks.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600 dark:text-gray-400">Duration</span>
                        <span className="font-bold">
                          {(() => {
                            const dayName = dayHeaders[selectedDate.getDay()]
                            const dayTasks = tasks[dayName] || []
                            const totalMinutes = dayTasks
                              .filter(task => task.date?.toDateString() === selectedDate.toDateString())
                              .reduce((sum, task) => sum + task.duration, 0)
                            return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-600 dark:text-gray-400">Completed</span>
                        <span className="font-bold">
                          {calendarDays.find(d => 
                            d.date.toDateString() === selectedDate.toDateString()
                          )?.tasks.filter(t => t.status === 'completed').length || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Render smart delay modal
  const renderDelayModal = () => {
    if (!taskToDelay || !smartDelayOptions) return null

    return (
      <Dialog open={showDelayModal} onOpenChange={setShowDelayModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5" />
              Smart Delay Options
            </DialogTitle>
            <DialogDescription>
              Intelligent scheduling for "{taskToDelay.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Current task info */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${taskToDelay.color}20` }}
                >
                  {(() => {
                    const Icon = getIconComponent(taskToDelay.icon || 'Clock')
                    return <Icon className="w-5 h-5" style={{ color: taskToDelay.color }} />
                  })()}
                </div>
                <div>
                  <div className="font-bold">{taskToDelay.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {taskToDelay.day} {formatTimeDisplay(taskToDelay.startTime)} - {formatTimeDisplay(taskToDelay.endTime)}
                    <br />
                    Duration: {taskToDelay.duration} minutes • Bedtime: {formatTimeDisplay(bedtime)}
                  </div>
                </div>
              </div>
            </div>

            {/* Smart suggestion */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <Brain className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800 dark:text-green-300">Smart Suggestion</div>
                  <div className="text-sm text-green-700 dark:text-green-400 mt-1">
                    {smartDelayOptions.suggestion}
                  </div>
                </div>
              </div>
            </div>

            {/* Available slots */}
            {smartDelayOptions.availableSlots.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Available Time Slots</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {smartDelayOptions.availableSlots.map((slot, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                        slot.type === 'immediate' 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                          : slot.type === 'free-period'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      }`}
                      onClick={() => applySmartDelay(smartDelayOptions, index)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {slot.day} at {formatTimeDisplay(slot.startTime)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatTimeDisplay(slot.endTime)} • {slot.duration} min
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`
                            ${slot.type === 'immediate' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              slot.type === 'free-period' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}
                          `}>
                            {slot.type === 'immediate' ? 'Immediate' :
                             slot.type === 'free-period' ? 'Free Period' :
                             slot.type === 'evening' ? 'Evening' : 'Next Day'}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Select
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extension option */}
            {smartDelayOptions.canExtend && smartDelayOptions.maxExtension > 0 && (
              <div className="p-3 rounded-lg border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Extend Current Time</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Complete before {formatTimeDisplay(bedtime)} • Max extension: {smartDelayOptions.maxExtension} minutes
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => applySmartDelay(smartDelayOptions)}
                  >
                    Extend Now
                  </Button>
                </div>
              </div>
            )}

            {/* No options warning */}
            {smartDelayOptions.availableSlots.length === 0 && !smartDelayOptions.canExtend && (
              <div className="p-3 rounded-lg border border-red-500 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-800 dark:text-red-300">No Available Slots</div>
                    <div className="text-sm text-red-700 dark:text-red-400 mt-1">
                      Consider reducing task duration or marking as skipped.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick delay buttons */}
            <div className="pt-4 border-t">
              <div className="text-sm font-medium mb-2">Quick Delay (if slot available)</div>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 60, 90].map((minutes) => (
                  <Button
                    key={minutes}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      simpleDelayTask(taskToDelay.id, minutes)
                      setShowDelayModal(false)
                    }}
                    disabled={convertTimeToMinutes(taskToDelay.endTime) + minutes > convertTimeToMinutes(bedtime)}
                  >
                    {minutes} min
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDelayModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                skipTask(taskToDelay.id)
                setShowDelayModal(false)
              }}
            >
              Skip Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Render list view
  const renderListView = () => {
    if (loading) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (error) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400 mb-2">Failed to load tasks</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    const allTasks = Object.values(tasks)
      .flat()
      .filter(isRealActivity) // Only show real activities in list view
      .sort((a, b) => {
        const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
        if (dayDiff !== 0) return dayDiff
        return convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime)
      })

    if (allTasks.length === 0) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">No tasks found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Your timetable is empty. Add tasks to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>List View</CardTitle>
          <CardDescription>All tasks in chronological order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allTasks.map((task, index) => {
              const Icon = getIconComponent(task.icon || 'Clock')
              const isCurrent = isTaskCurrent(task)
              const isOverdue = isTaskOverdue(task)
              const inGracePeriod = isTaskInGracePeriod(task)
              const isToday = task.day === getCurrentDay()
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isCurrent 
                      ? 'border-blue-500 bg-gradient-to-r from-blue-500/10 to-blue-500/5 shadow-lg shadow-blue-500/20' 
                      : task.status === 'completed'
                      ? 'border-green-500/30 bg-green-500/5'
                      : inGracePeriod
                      ? 'border-yellow-500 bg-yellow-500/5 animate-pulse'
                      : isOverdue
                      ? 'border-red-500/30 bg-red-500/5'
                      : isToday
                      ? 'border-purple-500/30 bg-purple-500/5'
                      : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                  }`}
                  onClick={() => {
                    setSelectedTask(task)
                    setShowTaskModal(true)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${task.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: task.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{task.title}</h3>
                          <Badge 
                            className="text-xs"
                            style={{ backgroundColor: `${task.color}20`, color: task.color }}
                          >
                            {task.apiType === 'FIXED' ? 'Fixed' : 'Free'}
                          </Badge>
                          {isCurrent && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse">
                              LIVE NOW
                            </Badge>
                          )}
                          {inGracePeriod && (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 animate-pulse">
                              ⏰ Need Feedback
                            </Badge>
                          )}
                          {isOverdue && !inGracePeriod && (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              OVERDUE
                            </Badge>
                          )}
                          {isToday && !isCurrent && !isOverdue && !inGracePeriod && (
                            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                              Today
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {task.day} • {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)} • {task.duration} min
                        </p>
                        {task.focusScore && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                  key={star}
                                  className={cn(
                                    "w-3 h-3",
                                    star <= (task.focusScore || 0) / 2
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300 dark:text-gray-600"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">Focus: {task.focusScore}/10</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {task.status === 'pending' && !inGracePeriod && isRealActivity(task) ? (
                            <DropdownMenuItem onClick={() => startTaskTimer(task.id)}>
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Start Task
                            </DropdownMenuItem>
                          ) : task.status === 'in-progress' ? (
                            <DropdownMenuItem onClick={() => stopTaskTimer(task.id)}>
                              <StopCircle className="w-4 h-4 mr-2" />
                              Complete Task
                            </DropdownMenuItem>
                          ) : inGracePeriod && isRealActivity(task) ? (
                            <DropdownMenuItem onClick={() => {
                              setTaskForFeedback(task)
                              setFeedbackFocus(5)
                              setFeedbackNotes('')
                              setFeedbackCompletedWell(true)
                              setShowFeedbackModal(true)
                            }}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem onClick={() => smartDelayTask(task)}>
                            <CalendarClock className="w-4 h-4 mr-2" />
                            Smart Delay
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => simpleDelayTask(task.id, 30)}>
                            <Clock className="w-4 h-4 mr-2" />
                            Delay 30 min
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => simpleDelayTask(task.id, 60)}>
                            <Clock className="w-4 h-4 mr-2" />
                            Delay 60 min
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Badge className={`
                        ${task.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse' :
                          task.status === 'missed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          task.status === 'skipped' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' :
                          task.status === 'delayed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          task.status === 'rescheduled' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                          inGracePeriod ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 animate-pulse' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}
                      `}>
                        {inGracePeriod ? 'Need Feedback' : task.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Update bedtime
  const updateBedtime = (newBedtime: string) => {
    setBedtime(newBedtime)
    
    // Update all tasks with new bedtime
    setTasks(prev => {
      const updated = { ...prev }
      for (const day in updated) {
        updated[day] = updated[day].map(task => ({
          ...task,
          bedtime: newBedtime
        }))
      }
      return updated
    })
    
    setTimeout(() => {
      toast("Bedtime updated", {
        description: `All tasks will now complete before ${formatTimeDisplay(newBedtime)}`,
      })
    }, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-gray-900 dark:text-gray-100">Smart Timetable</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold">Intelligent Task Scheduler</h1>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                  <div className="flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    SMART
                  </div>
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {loading ? 'Loading your schedule...' : 
                 error ? 'Error loading schedule' :
                 `${Object.values(tasks).flat().filter(isRealActivity).length} tasks • Smart delay • 1-hour grace period • Bedtime protection`}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Day indicator */}
              <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-purple-500/20">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-medium">
                    {currentDayFull} ({currentDay})
                  </div>
                </div>
              </div>

              {/* Bedtime Selector */}
              <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 dark:border-pink-500/20">
                <div className="flex items-center gap-1">
                  <Bed className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  <div className="text-xs">
                    <Select value={bedtime} onValueChange={updateBedtime}>
                      <SelectTrigger className="h-5 text-[10px] w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="22:00">10:00 PM</SelectItem>
                        <SelectItem value="23:00">11:00 PM</SelectItem>
                        <SelectItem value="00:00">12:00 AM</SelectItem>
                        <SelectItem value="01:00">1:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Current Time Display */}
              <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-purple-500/20">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <div className="text-xs font-medium">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="gap-1 h-7 px-2"
              >
                {darkMode ? (
                  <>
                    <SunIcon className="w-3 h-3" />
                    <span className="text-xs">Light</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="w-3 h-3" />
                    <span className="text-xs">Dark</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Smart Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { 
                label: 'On-Time', 
                value: `${stats.onTimeTasks}/${stats.totalTasks}`, 
                icon: CheckCircle,
                color: 'text-green-500',
                bgColor: 'bg-green-500/10',
                progress: stats.onTimeRate
              },
              { 
                label: 'Rescheduled', 
                value: `${stats.rescheduledTasks}`, 
                icon: CalendarClock,
                color: 'text-purple-500',
                bgColor: 'bg-purple-500/10'
              },
              { 
                label: 'Active', 
                value: activeTasks.length.toString(), 
                icon: PlayCircle,
                color: 'text-blue-500',
                bgColor: 'bg-blue-500/10',
                trend: 'Live'
              },
              { 
                label: 'Focus', 
                value: `${stats.avgFocusScore}/10`, 
                icon: TargetIcon2,
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-500/10',
                progress: stats.avgFocusScore * 10
              },
              { 
                label: 'Missed', 
                value: `${missedTasks.length}`, 
                icon: Clock,
                color: 'text-red-500',
                bgColor: 'bg-red-500/10'
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-3 h-3 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{stat.value}</div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                  {stat.trend && (
                    <Badge className="text-[8px] bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse px-1 py-0">
                      {stat.trend}
                    </Badge>
                  )}
                </div>
                {stat.progress !== undefined && (
                  <Progress value={stat.progress} className="h-1" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            {/* Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={view === 'grid' ? 'default' : 'outline'}
                      onClick={() => setView('grid')}
                      size="sm"
                      className="gap-1 h-7"
                    >
                      <Grid3x3 className="w-3 h-3" />
                      <span className="text-xs">Grid</span>
                    </Button>
                    <Button
                      variant={view === 'list' ? 'default' : 'outline'}
                      onClick={() => setView('list')}
                      size="sm"
                      className="gap-1 h-7"
                    >
                      <ListIcon className="w-3 h-3" />
                      <span className="text-xs">List</span>
                    </Button>
                    <Button
                      variant={view === 'calendar' ? 'default' : 'outline'}
                      onClick={() => setView('calendar')}
                      size="sm"
                      className="gap-1 h-7"
                    >
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs">Calendar</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <Button
                      variant={displayMode === 'vertical' ? 'default' : 'outline'}
                      onClick={() => setDisplayMode('vertical')}
                      size="sm"
                      className="gap-1 h-7"
                    >
                      <Columns className="w-3 h-3" />
                      <span className="text-xs">Vertical</span>
                    </Button>
                    <Button
                      variant={displayMode === 'horizontal' ? 'default' : 'outline'}
                      onClick={() => setDisplayMode('horizontal')}
                      size="sm"
                      className="gap-1 h-7"
                    >
                      <Rows className="w-3 h-3" />
                      <span className="text-xs">Horizontal</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Switch
                        id="weekends"
                        checked={showWeekends}
                        onCheckedChange={setShowWeekends}
                        className="scale-75"
                      />
                      <Label htmlFor="weekends" className="text-xs">Weekends</Label>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Switch
                        id="compact"
                        checked={compactMode}
                        onCheckedChange={setCompactMode}
                        className="scale-75"
                      />
                      <Label htmlFor="compact" className="text-xs">Compact</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Activity Card */}
            {currentActivity && (
              <Card className="overflow-hidden border-2 border-blue-500/50 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500">
                        {currentActivityInfo.icon && (
                          <currentActivityInfo.icon className="w-4 h-4 text-white animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm">Currently Active</h3>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {currentActivityInfo.message}
                        </p>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400">
                          {formatTimeDisplay(currentActivity.startTime)} - {formatTimeDisplay(currentActivity.endTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTask(currentActivity)
                          setShowTaskModal(true)
                        }}
                        className="h-7 text-xs gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      {currentActivity.status === 'in-progress' ? (
                        <Button
                          onClick={() => stopTaskTimer(currentActivity.id)}
                          variant="destructive"
                          size="sm"
                          className="h-7 text-xs gap-1"
                        >
                          <StopCircle className="w-3 h-3" />
                          Complete
                        </Button>
                      ) : (
                        <Button
                          onClick={() => startTaskTimer(currentActivity.id)}
                          size="sm"
                          className="h-7 text-xs gap-1"
                        >
                          <PlayCircle className="w-3 h-3" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grace Period Section */}
            {gracePeriodTasks.length > 0 && renderGracePeriodSection()}

            {/* Missed Tasks Section */}
            {missedTasks.length > 0 && renderMissedTasksSection()}

            {/* Timetable */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${view}-${displayMode}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {view === 'grid' ? renderTimetableGrid() : 
                 view === 'calendar' ? renderCalendarView() : 
                 renderListView()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Smart Delay Tips */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Brain className="w-4 h-4 text-purple-500" />
                  Smart Delay Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    {
                      tip: '1-hour grace period to update status',
                      icon: AlarmClock,
                      color: 'text-yellow-500'
                    },
                    {
                      tip: 'Never delayed past bedtime',
                      icon: Bed,
                      color: 'text-pink-500'
                    },
                    {
                      tip: 'Free periods prioritized for delays',
                      icon: CoffeeIcon,
                      color: 'text-green-500'
                    },
                    {
                      tip: 'Rate your focus to track progress',
                      icon: StarIcon,
                      color: 'text-yellow-500'
                    },
                  ].map((tip, index) => (
                    <div key={index} className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className={`p-1 rounded-lg ${tip.color.replace('text-', 'bg-')}/10`}>
                        <tip.icon className={`w-2.5 h-2.5 ${tip.color}`} />
                      </div>
                      <div className="text-[10px]">{tip.tip}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.values(tasks)
                    .flat()
                    .filter(task => (task.status === 'pending' || task.status === 'rescheduled') && isRealActivity(task))
                    .filter(task => !isInGracePeriod(task))
                    .sort((a, b) => {
                      const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
                      if (dayDiff !== 0) return dayDiff
                      return convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime)
                    })
                    .slice(0, 3)
                    .map((task, index) => {
                      const Icon = getIconComponent(task.icon || 'Clock')
                      const minutesUntil = Math.max(0, convertTimeToMinutes(task.startTime) - 
                        (currentTime.getHours() * 60 + currentTime.getMinutes()))
                      
                      return (
                        <div key={task.id} className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                          <div className="flex items-center gap-2">
                            <div 
                              className="p-1 rounded-lg"
                              style={{ backgroundColor: `${task.color}20` }}
                            >
                              <Icon className="w-3 h-3" style={{ color: task.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs truncate">{task.title}</div>
                              <div className="text-[10px] text-gray-600 dark:text-gray-400">
                                {task.day} at {formatTimeDisplay(task.startTime)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                                in {minutesUntil} min
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ZapIcon className="w-4 h-4 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { icon: CalendarClock, label: 'Smart Delay All' },
                    { icon: CheckCircle, label: 'Complete Missed' },
                    { icon: RefreshCw, label: 'Delay All Missed' },
                  ].map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2 h-7 text-xs"
                      onClick={() => {
                        if (action.label === 'Smart Delay All') {
                          const upcomingTasks = Object.values(tasks)
                            .flat()
                            .filter(task => task.status === 'pending' && !isInGracePeriod(task) && isRealActivity(task))
                            .slice(0, 3)
                          
                          if (upcomingTasks.length > 0) {
                            smartDelayTask(upcomingTasks[0])
                            setTimeout(() => {
                              toast("Smart delay initiated", {
                                description: "Processing first upcoming task",
                              })
                            }, 0)
                          }
                        } else if (action.label === 'Complete Missed') {
                          missedTasks.forEach(task => {
                            if (convertTimeToMinutes(bedtime) - (currentTime.getHours() * 60 + currentTime.getMinutes()) >= task.duration) {
                              completeMissedTask(task.id)
                            }
                          })
                          setTimeout(() => {
                            toast.success("Missed tasks completed! 🌟", {
                              description: "Great job catching up before bedtime!",
                              duration: 5000,
                            })
                          }, 0)
                        } else if (action.label === 'Delay All Missed') {
                          missedTasks.forEach(task => {
                            rescheduleMissedTaskToFreePeriod(task)
                          })
                        }
                      }}
                    >
                      <action.icon className="w-3 h-3" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bedtime Protection Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 dark:border-pink-500/20 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Bed className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold mb-1">Bedtime Protection Active</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-1 mb-1">
                      <AlarmClock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      <span className="text-[10px] font-medium">1-Hour Grace</span>
                    </div>
                    <p className="text-[8px] text-gray-700 dark:text-gray-300">
                      Update status within 1 hour of completion
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-1 mb-1">
                      <CalendarClock className="w-3 h-3 text-pink-600 dark:text-pink-400" />
                      <span className="text-[10px] font-medium">Smart Scheduling</span>
                    </div>
                    <p className="text-[8px] text-gray-700 dark:text-gray-300">
                      Tasks auto-rescheduled to free periods
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-1 mb-1">
                      <StarIcon className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-[10px] font-medium">Focus Tracking</span>
                    </div>
                    <p className="text-[8px] text-gray-700 dark:text-gray-300">
                      Rate your focus to track productivity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${selectedTask.color}20` }}
                >
                  {(() => {
                    const Icon = getIconComponent(selectedTask.icon || 'Clock')
                    return <Icon className="w-5 h-5" style={{ color: selectedTask.color }} />
                  })()}
                </div>
                {selectedTask.title}
              </DialogTitle>
              <DialogDescription>
                {selectedTask.subject} • {selectedTask.day}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
                  <div className="font-medium">
                    {formatTimeDisplay(selectedTask.startTime)} - {formatTimeDisplay(selectedTask.endTime)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                  <div className="font-medium">{selectedTask.duration} minutes</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Type</div>
                  <Badge className={`
                    ${selectedTask.apiType === 'FIXED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                      selectedTask.apiType === 'FREE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}
                  `}>
                    {selectedTask.apiType}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bedtime</div>
                  <div className="font-medium">{formatTimeDisplay(selectedTask.bedtime || bedtime)}</div>
                </div>
              </div>
              
              {/* Date and Location */}
              {(selectedTask.date || selectedTask.location) && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    {selectedTask.date && (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Date</div>
                        <div className="font-medium">{formatDate(selectedTask.date)}</div>
                      </div>
                    )}
                    {selectedTask.location && (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Location</div>
                        <div className="font-medium">{selectedTask.location}</div>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {/* Description from API */}
              {selectedTask.description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Description</div>
                    <div className="text-sm">{selectedTask.description}</div>
                  </div>
                </>
              )}
              
              {/* Status Section */}
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Status</div>
                    <Badge className={`
                      ${selectedTask.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        selectedTask.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse' :
                        selectedTask.status === 'missed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        selectedTask.status === 'skipped' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' :
                        selectedTask.status === 'delayed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        selectedTask.status === 'rescheduled' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}
                    `}>
                      {selectedTask.status}
                    </Badge>
                  </div>
                </div>
                
                {/* Focus score for completed tasks */}
                {selectedTask.status === 'completed' && selectedTask.focusScore && (
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">Focus Score</span>
                      </div>
                      <Badge className={`
                        ${selectedTask.focusScore >= 8 ? 'bg-green-100 text-green-800' :
                          selectedTask.focusScore >= 5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}
                      `}>
                        {selectedTask.focusScore}/10
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={selectedTask.focusScore * 10} className="h-2" />
                    </div>
                  </div>
                )}
                
                {/* Notes */}
                {selectedTask.notes && (
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="text-sm font-medium mb-1">Notes</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {selectedTask.notes}
                    </div>
                  </div>
                )}
                
                {/* Original time if rescheduled */}
                {selectedTask.originalStartTime && (
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-400">
                      <CalendarClock className="w-4 h-4" />
                      Originally scheduled for {selectedTask.day} {formatTimeDisplay(selectedTask.originalStartTime)}
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Delay Actions */}
              <div className="space-y-3">
                <h4 className="font-medium">Delay Options</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => smartDelayTask(selectedTask)}
                    className="gap-2"
                  >
                    <CalendarClock className="w-4 h-4" />
                    Smart Delay
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => skipTask(selectedTask.id)}
                    className="gap-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip Task
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => simpleDelayTask(selectedTask.id, 30)}
                    disabled={convertTimeToMinutes(selectedTask.endTime) + 30 > convertTimeToMinutes(bedtime)}
                  >
                    Delay 30min
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => simpleDelayTask(selectedTask.id, 60)}
                    disabled={convertTimeToMinutes(selectedTask.endTime) + 60 > convertTimeToMinutes(bedtime)}
                  >
                    Delay 1hr
                  </Button>
                </div>
              </div>
              
              {/* Quick Start/Stop */}
              <div className="grid grid-cols-2 gap-2">
                {selectedTask.status === 'pending' && !isInGracePeriod(selectedTask) && isRealActivity(selectedTask) ? (
                  <Button onClick={() => startTaskTimer(selectedTask.id)}>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Task
                  </Button>
                ) : selectedTask.status === 'in-progress' ? (
                  <Button onClick={() => stopTaskTimer(selectedTask.id)} variant="destructive">
                    <StopCircle className="w-4 h-4 mr-2" />
                    Complete Task
                  </Button>
                ) : isInGracePeriod(selectedTask) && isRealActivity(selectedTask) ? (
                  <Button onClick={() => {
                    setTaskForFeedback(selectedTask)
                    setFeedbackFocus(5)
                    setFeedbackNotes('')
                    setFeedbackCompletedWell(true)
                    setShowFeedbackModal(true)
                    setShowTaskModal(false)
                  }}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Update Status
                  </Button>
                ) : (
                  <Button onClick={() => updateTaskStatus(selectedTask.id, 'pending')}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Status
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Smart Delay Modal */}
      {renderDelayModal()}

      {/* Feedback Modal */}
      {renderFeedbackModal()}
    </div>
  )
}