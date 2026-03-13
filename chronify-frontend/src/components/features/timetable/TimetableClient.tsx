// // src/app/dashboard/timetable/viewer/page.tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
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
  Moon as MoonIcon,
  Target,
  Award,
  TrendingUp,
  Users,
  User,
  Zap,
  Filter,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Check,
  X,
  BarChart3,
  CalendarDays,
  ListTodo,
  Menu,
  RefreshCw,
  Settings,
  Star,
  Flame,
  Trophy,
  Bed,
  Timer,
  Sparkles,
  Rocket,
  Brain,
  Code,
  Palette,
  Music,
  Camera,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  VideoIcon,
  CheckSquare,
  Square,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Link2,
  Lock,
  Unlock,
  Grid,
  List,
  Columns,
  Rows,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  Printer,
  FileText,
  Image as ImageIcon,
  Bell,
  Eye,
  EyeOff,
  Clock3,
  Clock4,
  Clock8,
  AlarmClock,
  Sunrise,
  Sunset,
  MoonStar,
  Hourglass,
  Activity,
  Gauge,
  Compass,
  MapPin,
  Flag,
  Tag,
  Tags,
  Hash,
  AtSign,
  DollarSign,
  Percent,
  CreditCard,
  Wallet,
  ShoppingCart,
  ShoppingBag,
  Gift,
  Package,
  Box,
  Archive,
  Inbox,
  Outbox,
  Send,
  Receive,
  Upload,
  Download as DownloadIcon,
  Save,
  File,
  FilePlus,
  FileMinus,
  FileText as FileTextIcon,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FilePresentation,
  FilePdf,
  FileArchive,
  Folder,
  FolderPlus,
  FolderMinus,
  FolderOpen,
  FolderTree,
  HardDrive,
  Cpu,
  Monitor,
  MonitorSmartphone,
  Smartphone,
  Tablet,
  Laptop,
  Keyboard,
  Mouse,
  MousePointer,
  Pointer,
  Hand,
  Touchpad,
  Scan,
  ScanLine,
  ScanEye,
  ScanFace,
  QrCode,
  Barcode,
  Fingerprint,
  Key,
  KeyRound,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ShieldOff,
  Lock as LockIcon,
  LockOpen,
  LockKeyhole,
  UnlockKeyhole,
  Unlock as UnlockIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Volume1,
  Volume2,
  VolumeX,
  Volume,
  Headphones,
  Headset,
  Ear,
  Hearing,
  Speaker,
  Radio,
  Podcast,
  Disc,
  Vinyl,
  Tape,
  CassetteTape,
  Album,
  Play,
  Pause,
  Stop,
  Forward,
  Backward,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  PlaySquare,
  PauseSquare,
  StopSquare,
  Video as VideoIcon2,
  Camera as CameraIcon,
  CameraOff,
  VideoOff,
  Mic as MicIcon,
  MicOff,
  RadioTower,
  Wifi as WifiIcon,
  WifiZero,
  Router,
  Server,
  Database,
  Cloud as CloudIcon,
  CloudCog,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudMoonRain,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  Cloudy,
  Droplet,
  Droplets,
  Snowflake,
  Wind,
  Tornado,
  Hurricane,
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake,
  Waves,
  WavesLadder,
  WavesSinusoid,
  WavesSquare,
  Zap as ZapIcon,
  ZapOff,
  Sparkle,
  Sparkles as SparklesIcon,
  Flame as FlameIcon,
  FlameKindling,
  FireExtinguisher,
  Siren,
  SirenOff,
  AlarmCheck,
  AlarmClockOff,
  AlarmClockMinus,
  AlarmClockPlus,
  AlarmSmoke,
  Bell as BellIcon,
  BellDot,
  BellElectric,
  BellMinus,
  BellPlus,
  BellRing,
  BellOff,
  BellOffIcon,
  Calendar as CalendarIcon2,
  CalendarCheck,
  CalendarClock,
  CalendarDays as CalendarDaysIcon,
  CalendarFold,
  CalendarHeart,
  CalendarMinus,
  CalendarOff,
  CalendarPlus,
  CalendarRange,
  CalendarSearch,
  CalendarX,
  Clock as ClockIcon,
  ClockAlert,
  ClockArrowDown,
  ClockArrowUp,
  Clock1,
  Clock10,
  Clock11,
  Clock12,
  Clock2,
  Clock3 as Clock3Icon,
  Clock4 as Clock4Icon,
  Clock5,
  Clock6,
  Clock7,
  Clock8 as Clock8Icon,
  Clock9,
  ClockFading,
  Timer as TimerIcon,
  TimerOff,
  TimerReset,
  Hourglass as HourglassIcon,
  HourglassOff,
  Timer as TimerIcon2,
  Stopwatch,
  StopwatchIcon,
  Watch,
  WatchIcon,
  Activity as ActivityIcon,
  ActivitySquare,
  ActivitySquareIcon,
  Gauge as GaugeIcon,
  Speedometer,
  SpeedometerIcon,
  Tachometer,
  TachometerIcon,
  Compass as CompassIcon,
  CompassIcon as CompassIcon2,
  Navigation as NavigationIcon,
  NavigationIcon as NavigationIcon2,
  Map as MapIcon,
  MapIcon as MapIcon2,
  MapPin as MapPinIcon,
  MapPinIcon as MapPinIcon2,
  MapPinned,
  MapPinnedIcon,
  MapPlus,
  MapMinus,
  MapX,
  MapCheck,
  MapPinOff,
  MapPinX,
  MapPinCheck,
  MapPinPlus,
  MapPinMinus,
  Flag as FlagIcon,
  FlagIcon as FlagIcon2,
  FlagOff,
  FlagTriangleLeft,
  FlagTriangleRight,
  FlagTriangleLeftIcon,
  FlagTriangleRightIcon,
  Tag as TagIcon,
  TagIcon as TagIcon2,
  Tags as TagsIcon,
  TagsIcon as TagsIcon2,
  Hash as HashIcon,
  AtSign as AtSignIcon,
  DollarSign as DollarSignIcon,
  Percent as PercentIcon,
  CreditCard as CreditCardIcon,
  Wallet as WalletIcon,
  ShoppingCart as ShoppingCartIcon,
  ShoppingBag as ShoppingBagIcon,
  Gift as GiftIcon,
  Package as PackageIcon,
  PackageIcon as PackageIcon2,
  Box as BoxIcon,
  Archive as ArchiveIcon,
  Inbox as InboxIcon,
  Outbox as OutboxIcon,
  Send as SendIcon,
  Receive as ReceiveIcon,
  Upload as UploadIcon,
  Download as DownloadIcon2,
  Save as SaveIcon,
  File as FileIcon,
  FilePlus as FilePlusIcon,
  FileMinus as FileMinusIcon,
  FileText as FileTextIcon2,
  FileImage as FileImageIcon,
  FileVideo as FileVideoIcon,
  FileAudio as FileAudioIcon,
  FileCode as FileCodeIcon,
  FileSpreadsheet as FileSpreadsheetIcon,
  FilePresentation as FilePresentationIcon,
  FilePdf as FilePdfIcon,
  FileArchive as FileArchiveIcon,
  Folder as FolderIcon,
  FolderPlus as FolderPlusIcon,
  FolderMinus as FolderMinusIcon,
  FolderOpen as FolderOpenIcon,
  FolderTree as FolderTreeIcon,
  HardDrive as HardDriveIcon,
  Cpu as CpuIcon,
  Monitor as MonitorIcon,
  MonitorSmartphone as MonitorSmartphoneIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Laptop as LaptopIcon,
  Keyboard as KeyboardIcon,
  Mouse as MouseIcon,
  MousePointer as MousePointerIcon,
  Pointer as PointerIcon,
  Hand as HandIcon,
  Touchpad as TouchpadIcon,
  Scan as ScanIcon,
  ScanLine as ScanLineIcon,
  ScanEye as ScanEyeIcon,
  ScanFace as ScanFaceIcon,
  QrCode as QrCodeIcon,
  Barcode as BarcodeIcon,
  Fingerprint as FingerprintIcon,
  Key as KeyIcon,
  KeyRound as KeyRoundIcon,
  Shield as ShieldIcon,
  ShieldCheck as ShieldCheckIcon,
  ShieldAlert as ShieldAlertIcon,
  ShieldX as ShieldXIcon,
  ShieldOff as ShieldOffIcon,
  Car,
  School
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { format, parse, differenceInMinutes, addMinutes, isToday, isPast, isFuture, formatDistanceToNow, isSameDay } from 'date-fns'

// Utility function for className merging
const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ')
}

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

interface Milestone {
  id: string
  title: string
  description?: string
  completed: boolean
  targetDate?: string
  progress?: number
  scheduledHours?: number
  completedHours?: number
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
  milestones?: Milestone[]
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
  gracePeriodEndsAt?: string
}

interface FullTimeTableResponse {
  day: string
  slots: FullTimeTableSlot[]
}

interface CurrentTaskInfo {
  task: TimeSlot | null
  timeRemaining: number // in minutes
  progress: number // percentage
}

interface NextTaskInfo {
  task: TimeSlot | null
  timeUntil: number // in minutes
}

interface CachedData<T> {
  data: T
  timestamp: number
  userId?: string
}

const API_BASE_URL = 'http://localhost:8181/v0/api'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
const DAY_DISPLAY = {
  MONDAY: 'Mon',
  TUESDAY: 'Tue',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
  SATURDAY: 'Sat',
  SUNDAY: 'Sun'
}

const DAY_FULL_DISPLAY = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday'
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

// Map API task types to UI task types
const mapApiTaskTypeToUIType = (apiType: string): TimeSlot['type'] => {
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

const PRIORITY_COLORS = {
  LOW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

const STATUS_COLORS = {
  PENDING: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
}

const CACHE_KEYS = {
  TIMETABLE: 'timetable_cache',
  TASKS: 'tasks_cache',
  GOALS: 'goals_cache',
  STATS: 'stats_cache',
  SETTINGS: 'timetable_viewer_settings'
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

const getFixedTimeColor = (type: string): string => {
  const fixedTimeType = FIXED_TIME_TYPES.find(t => t.id === type)
  return fixedTimeType?.color || '#6B7280'
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
  const [timeSettings, setTimeSettings] = useState<TimeSettings>(() => {
    // Load settings from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CACHE_KEYS.SETTINGS)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse saved settings', e)
        }
      }
    }
    return {
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
    }
  })
  const [showSettings, setShowSettings] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCompleting, setIsCompleting] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [activeTaskTab, setActiveTaskTab] = useState<string>('current')
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const [userId, setUserId] = useState<string | null>(null)

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CACHE_KEYS.SETTINGS, JSON.stringify(timeSettings))
  }, [timeSettings])

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }

    // Get user ID from token
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        // Decode JWT to get user ID (assuming it's in the payload)
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(window.atob(base64))
        setUserId(payload.userId || payload.sub || null)
      } catch (e) {
        console.error('Failed to decode token', e)
      }
    }
  }, [])

  // Load cached data on mount
  useEffect(() => {
    loadCachedData()
  }, [])

  // Fetch data on mount and when userId changes
  useEffect(() => {
    if (userId) {
      fetchAllData()
    }
  }, [userId])

  useEffect(() => {
    generateTimeSlots()
  }, [timeSettings])

  useEffect(() => {
    if (timeSettings.showSleepBlocks) {
      generateSleepTasks()
    } else {
      setTasks(tasks.filter(task => !task.isSleepTime))
    }
  }, [sleepSchedules, timeSettings.showSleepBlocks])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const getAuthToken = (): string => {
    const token = localStorage.getItem('access_token')
    return token ? `Bearer ${token}` : ''
  }

  // Cache management functions
  const getCachedData = <T,>(key: string): T | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return null
      
      const parsed: CachedData<T> = JSON.parse(cached)
      const now = Date.now()
      
      // Check if cache is expired
      if (now - parsed.timestamp > CACHE_DURATION) {
        localStorage.removeItem(key)
        return null
      }
      
      // Check if cache belongs to current user
      if (parsed.userId && parsed.userId !== userId) {
        localStorage.removeItem(key)
        return null
      }
      
      return parsed.data
    } catch (e) {
      console.error('Failed to read cache', e)
      return null
    }
  }

  const setCachedData = <T,>(key: string, data: T): void => {
    if (typeof window === 'undefined') return
    
    try {
      const cacheData: CachedData<T> = {
        data,
        timestamp: Date.now(),
        userId: userId || undefined
      }
      localStorage.setItem(key, JSON.stringify(cacheData))
    } catch (e) {
      console.error('Failed to write cache', e)
    }
  }

  const clearCache = (): void => {
    if (typeof window === 'undefined') return
    
    Object.values(CACHE_KEYS).forEach(key => {
      if (key !== CACHE_KEYS.SETTINGS) {
        localStorage.removeItem(key)
      }
    })
  }

  const loadCachedData = (): void => {
    // Load timetable from cache
    const cachedTimetable = getCachedData<{
      tasks: TimeSlot[]
      fixedTimes: FixedTime[]
      sleepSchedules: SleepSchedule[]
    }>(CACHE_KEYS.TIMETABLE)
    
    if (cachedTimetable) {
      setTasks(cachedTimetable.tasks)
      setFixedTimes(cachedTimetable.fixedTimes)
      setSleepSchedules(cachedTimetable.sleepSchedules)
    }
    
    // Load goals from cache
    const cachedGoals = getCachedData<Goal[]>(CACHE_KEYS.GOALS)
    if (cachedGoals) {
      setGoals(cachedGoals)
    }
    
    // Load stats from cache
    const cachedStats = getCachedData<TaskStats>(CACHE_KEYS.STATS)
    if (cachedStats) {
      setStats(cachedStats)
    }
  }

  const fetchAllData = async (forceRefresh: boolean = false): Promise<void> => {
    const now = Date.now()
    
    // Throttle fetches - don't fetch more than once every 30 seconds unless forced
    if (!forceRefresh && now - lastFetchTime < 30000) {
      console.log('Skipping fetch - too soon since last fetch')
      return
    }
    
    setRefreshing(true)
    setLastFetchTime(now)
    
    try {
      await Promise.all([
        fetchFullTimeTable(forceRefresh),
        fetchGoals(forceRefresh),
        fetchStats(forceRefresh)
      ])
    } catch (error) {
      console.error('Error fetching data', error)
    } finally {
      setRefreshing(false)
      setIsLoading(false)
      setIsInitialLoad(false)
    }
  }

  const fetchFullTimeTable = async (forceRefresh: boolean = false): Promise<void> => {
    // Check cache first
    if (!forceRefresh) {
      const cached = getCachedData<{
        tasks: TimeSlot[]
        fixedTimes: FixedTime[]
        sleepSchedules: SleepSchedule[]
      }>(CACHE_KEYS.TIMETABLE)
      
      if (cached) {
        setTasks(cached.tasks)
        setFixedTimes(cached.fixedTimes)
        setSleepSchedules(cached.sleepSchedules)
        return
      }
    }

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
        const newTasks: TimeSlot[] = []
        const newFixedTimesMap = new Map<string, FixedTime>()
        const newSleepSchedulesMap = new Map<string, SleepSchedule>()
        
        apiData.forEach(dayData => {
          dayData.slots.forEach(slot => {
            // Handle FIXED slots
            if (slot.type === 'FIXED' && slot.fixedTimeId) {
              if (!newFixedTimesMap.has(slot.fixedTimeId)) {
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

                newFixedTimesMap.set(slot.fixedTimeId, {
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
                const existing = newFixedTimesMap.get(slot.fixedTimeId)
                if (existing && !existing.days.includes(dayData.day)) {
                  existing.days.push(dayData.day)
                }
              }
            }
            
            // Handle FREE slots
            if (slot.type === 'FREE' && slot.fixedTimeId && slot.freePeriodId) {
              const fixedTime = newFixedTimesMap.get(slot.fixedTimeId)
              if (fixedTime) {
                if (!fixedTime.freePeriods) {
                  fixedTime.freePeriods = []
                }
                
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
              if (!newSleepSchedulesMap.has(slot.sleepScheduleId)) {
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

                newSleepSchedulesMap.set(slot.sleepScheduleId, {
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
            
            // Handle TASK slots
            const taskTypes = ['STUDY', 'PROJECT', 'CLASS', 'HEALTH', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT']
            if (taskTypes.includes(slot.type) && slot.taskId) {
              const taskType = mapApiTaskTypeToUIType(slot.type)
              
              newTasks.push({
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
                category: slot.category || 'ACADEMIC',
                gracePeriodEndsAt: slot.gracePeriodEndsAt
              })
            }
          })
        })
        
        const newFixedTimesArray = Array.from(newFixedTimesMap.values())
        const newSleepSchedulesArray = Array.from(newSleepSchedulesMap.values())
        
        setTasks(newTasks)
        setFixedTimes(newFixedTimesArray)
        setSleepSchedules(newSleepSchedulesArray)
        
        // Save to cache
        setCachedData(CACHE_KEYS.TIMETABLE, {
          tasks: newTasks,
          fixedTimes: newFixedTimesArray,
          sleepSchedules: newSleepSchedulesArray
        })
      }
    } catch (error) {
      console.error('Error fetching timetable:', error)
      toast.error('Failed to load timetable data')
    }
  }

  const fetchGoals = async (forceRefresh: boolean = false): Promise<void> => {
    if (!forceRefresh) {
      const cached = getCachedData<Goal[]>(CACHE_KEYS.GOALS)
      if (cached) {
        setGoals(cached)
        return
      }
    }

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
        setCachedData(CACHE_KEYS.GOALS, data.data.goals)
      }
    } catch (error) {
      console.error('Error fetching goals:', error)
    }
  }

  const fetchStats = async (forceRefresh: boolean = false): Promise<void> => {
    if (!forceRefresh) {
      const cached = getCachedData<TaskStats>(CACHE_KEYS.STATS)
      if (cached) {
        setStats(cached)
        return
      }
    }

    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/tasks/stats`, {
        headers: { 'Authorization': token }
      })

      if (!response.ok) throw new Error('Failed to fetch stats')

      const data = await response.json()
      if (data.success && data.data) {
        setStats(data.data)
        setCachedData(CACHE_KEYS.STATS, data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchTaskById = async (taskId: string) => {
    try {
      const token = getAuthToken()
      if (!token) return

      // Check if we already have the task in state
      const existingTask = tasks.find(t => t.id === taskId)
      if (existingTask) {
        // Enrich task with related data
        const enrichedTask = { ...existingTask }
        
        if (existingTask.goalId) {
          const goal = goals.find(g => g.id === existingTask.goalId)
          if (goal) {
            ;(enrichedTask as any).goal = goal
          }
        }
        
        if (existingTask.milestoneId && existingTask.goalId) {
          const goal = goals.find(g => g.id === existingTask.goalId)
          const milestone = goal?.milestones?.find(m => m.id === existingTask.milestoneId)
          if (milestone) {
            ;(enrichedTask as any).milestone = milestone
          }
        }
        
        if (existingTask.fixedCommitmentId) {
          const fixedTime = fixedTimes.find(ft => ft.id === existingTask.fixedCommitmentId)
          if (fixedTime) {
            ;(enrichedTask as any).fixedTime = fixedTime
          }
        }
        
        setSelectedTask(enrichedTask)
        setShowTaskDetails(true)
        return
      }

      // If not in state, fetch from API
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: { 'Authorization': token }
      })

      if (!response.ok) throw new Error('Failed to fetch task details')

      const data = await response.json()
      if (data.success && data.data) {
        setSelectedTask(data.data)
        setShowTaskDetails(true)
      }
    } catch (error) {
      console.error('Error fetching task details:', error)
      toast.error('Failed to load task details')
    }
  }

  const markTaskComplete = async (taskId: string) => {
    setIsCompleting(taskId)
    try {
      const token = getAuthToken()
      if (!token) {
        toast.error('Please login')
        return
      }

      const completedAt = new Date().toISOString()

      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completedAt })
      })

      if (!response.ok) throw new Error('Failed to mark task as complete')

      const data = await response.json()
      if (data.success) {
        toast.success('Task marked as complete!')
        
        // Update local state
        setTasks(prev => prev.map(t => 
          t.id === taskId 
            ? { ...t, status: 'COMPLETED', isCompleted: true, completedAt }
            : t
        ))
        
        if (selectedTask?.id === taskId) {
          setSelectedTask(prev => prev ? { ...prev, status: 'COMPLETED', isCompleted: true, completedAt } : null)
        }
        
        // Update cache with new task status
        const cachedTimetable = getCachedData<{
          tasks: TimeSlot[]
          fixedTimes: FixedTime[]
          sleepSchedules: SleepSchedule[]
        }>(CACHE_KEYS.TIMETABLE)
        
        if (cachedTimetable) {
          const updatedTasks = cachedTimetable.tasks.map(t => 
            t.id === taskId ? { ...t, status: 'COMPLETED', isCompleted: true, completedAt } : t
          )
          setCachedData(CACHE_KEYS.TIMETABLE, {
            ...cachedTimetable,
            tasks: updatedTasks
          })
        }
        
        // Refresh stats
        fetchStats(true)
      }
    } catch (error) {
      console.error('Error completing task:', error)
      toast.error('Failed to mark task as complete')
    } finally {
      setIsCompleting(null)
    }
  }

  const handleRefresh = () => {
    fetchAllData(true)
    toast.success('Refreshing timetable...')
  }

  const handleClearCache = () => {
    clearCache()
    toast.success('Cache cleared')
    fetchAllData(true)
  }

  const handleTaskClick = (taskId?: string) => {
    if (taskId) {
      fetchTaskById(taskId)
    }
  }

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number)
    if (hours === 24) return '12:00 AM'
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const formatTimeDisplay = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number)
    if (hours === 24) return '12:00 AM'
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return format(date, 'MMM d, yyyy')
  }

  const convertToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = convertToMinutes(startTime)
    const end = convertToMinutes(endTime)
    return end >= start ? end - start : (24 * 60 - start) + end
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

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'CRITICAL': return <AlertTriangle className="w-4 h-4" />
      case 'HIGH': return <AlertCircle className="w-4 h-4" />
      case 'MEDIUM': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4" />
      case 'IN_PROGRESS': return <Loader2 className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const generateTimeSlots = (): void => {
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

    setTimeSlots(allSlots)
  }

  const generateSleepTasks = () => {
    const sleepTasks: TimeSlot[] = []
    
    sleepSchedules.forEach(schedule => {
      if (!schedule.isActive) return
      
      const bedtimeMinutes = convertToMinutes(schedule.bedtime)
      const wakeTimeMinutes = convertToMinutes(schedule.wakeTime)
      
      if (wakeTimeMinutes < bedtimeMinutes) {
        const midnight = convertToMinutes('24:00')
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
          isCompleted: false,
          status: 'PENDING'
        })
        
        const nextDayIndex = (DAYS.indexOf(schedule.day) + 1) % DAYS.length
        const nextDay = DAYS[nextDayIndex]
        
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
          isCompleted: false,
          status: 'PENDING'
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
          isCompleted: false,
          status: 'PENDING'
        })
      }
    })
    
    setTasks(prev => [...prev.filter(task => !task.isSleepTime), ...sleepTasks])
  }

  const isTimeInFixedSlot = (day: string, time: string): FixedTime | null => {
    const timeInMinutes = convertToMinutes(time)
    
    for (const ft of fixedTimes) {
      if (!ft.days.includes(day)) continue
      
      const startMinutes = convertToMinutes(ft.startTime)
      const endMinutes = convertToMinutes(ft.endTime)
      
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

  const isTimeInFreePeriodRange = (time: string, startTime: string, endTime: string): boolean => {
    const timeInMinutes = convertToMinutes(time)
    const startMinutes = convertToMinutes(startTime)
    const endMinutes = convertToMinutes(endTime)
    return timeInMinutes >= startMinutes && timeInMinutes < endMinutes
  }

  const getTasksForCell = (day: string, time: string) => {
    return tasks.filter(task => {
      if (task.day !== day) return false
      
      const taskStartMinutes = convertToMinutes(task.startTime)
      const taskEndMinutes = convertToMinutes(task.endTime)
      const cellMinutes = convertToMinutes(time)
      
      return cellMinutes >= taskStartMinutes && cellMinutes < taskEndMinutes
    })
  }

  const getTaskSpan = (task: TimeSlot) => {
    const startMinutes = convertToMinutes(task.startTime)
    const endMinutes = convertToMinutes(task.endTime)
    let duration = endMinutes - startMinutes
    if (duration < 0) {
      duration += 24 * 60 // Handle overnight tasks
    }
    return Math.ceil(duration / timeSettings.interval)
  }

  const shouldShowTaskInCell = (task: TimeSlot, day: string, time: string) => {
    if (task.day !== day) return false
    
    const taskStartMinutes = convertToMinutes(task.startTime)
    const cellMinutes = convertToMinutes(time)
    
    return taskStartMinutes === cellMinutes
  }

  const getNextTimeSlot = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + timeSettings.interval
    const nextHours = Math.floor(totalMinutes / 60) % 24
    const nextMinutes = totalMinutes % 60
    return `${nextHours.toString().padStart(2, '0')}:${nextMinutes.toString().padStart(2, '0')}`
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

  const getSleepTypeInfo = (type: string) => {
    return SLEEP_TYPES.find(t => t.id === type) || SLEEP_TYPES[0]
  }

  const filterSlots = (slots: TimeSlot[]): TimeSlot[] => {
    return slots.filter(slot => {
      if (filterStatus !== 'all' && slot.status) {
        if (slot.status.toLowerCase() !== filterStatus.toLowerCase()) {
          return false
        }
      }

      if (filterPriority !== 'all' && slot.priority) {
        if (slot.priority !== filterPriority) {
          return false
        }
      }

      if (filterType !== 'all' && slot.type) {
        const typeMap: Record<string, string> = {
          'study': 'STUDY',
          'class': 'CLASS',
          'project': 'PROJECT',
          'health': 'HEALTH',
          'meeting': 'MEETING',
          'workout': 'WORKOUT',
          'meal': 'MEAL',
          'entertainment': 'ENTERTAINMENT',
          'sleep': 'SLEEP',
          'task': 'OTHER',
          'fixed': 'FIXED',
          'free': 'FREE'
        }
        if (typeMap[slot.type] !== filterType && filterType !== 'all') {
          return false
        }
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return slot.title.toLowerCase().includes(query) ||
               (slot.subject?.toLowerCase().includes(query) || false) ||
               (slot.description?.toLowerCase().includes(query) || false)
      }

      return true
    })
  }

  const getFilteredDays = (): string[] => {
    return timeSettings.showWeekends ? DAYS : DAYS.slice(0, 5)
  }

  // Get current day name
  const getCurrentDay = (): string => {
    const dayIndex = currentDate.getDay()
    // Convert Sunday (0) to 6 for our array, and Monday (1) to 0, etc.
    const dayMap = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    return dayMap[dayIndex]
  }

  // Get current time in minutes
  const getCurrentTimeInMinutes = (): number => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  }

  // Get current task (task that is happening now)
  const getCurrentTask = useCallback((): CurrentTaskInfo => {
    const currentDay = getCurrentDay()
    const currentTime = getCurrentTimeInMinutes()
    
    const currentTask = tasks.find(task => {
      if (task.day !== currentDay) return false
      if (task.status === 'COMPLETED') return false
      
      const taskStart = convertToMinutes(task.startTime)
      const taskEnd = convertToMinutes(task.endTime)
      
      // Handle overnight tasks
      if (taskEnd < taskStart) {
        // Task spans across midnight
        return currentTime >= taskStart || currentTime < taskEnd
      } else {
        return currentTime >= taskStart && currentTime < taskEnd
      }
    })
    
    if (!currentTask) {
      return { task: null, timeRemaining: 0, progress: 0 }
    }
    
    const taskStart = convertToMinutes(currentTask.startTime)
    const taskEnd = convertToMinutes(currentTask.endTime)
    let taskDuration = taskEnd - taskStart
    if (taskDuration < 0) taskDuration += 24 * 60
    
    let timeElapsed = currentTime - taskStart
    if (timeElapsed < 0) timeElapsed += 24 * 60
    
    const timeRemaining = taskDuration - timeElapsed
    const progress = Math.min(100, Math.max(0, (timeElapsed / taskDuration) * 100))
    
    return { task: currentTask, timeRemaining, progress }
  }, [tasks, currentDate])

  // Get next task (next upcoming task today)
  const getNextTask = useCallback((): NextTaskInfo => {
    const currentDay = getCurrentDay()
    const currentTime = getCurrentTimeInMinutes()
    
    const todayTasks = tasks
      .filter(task => 
        task.day === currentDay && 
        task.status !== 'COMPLETED' &&
        !task.isSleepTime
      )
      .map(task => ({
        ...task,
        startMinutes: convertToMinutes(task.startTime)
      }))
      .sort((a, b) => a.startMinutes - b.startMinutes)
    
    const nextTask = todayTasks.find(task => {
      const taskStart = convertToMinutes(task.startTime)
      return taskStart > currentTime
    })
    
    if (!nextTask) {
      return { task: null, timeUntil: 0 }
    }
    
    const timeUntil = convertToMinutes(nextTask.startTime) - currentTime
    
    return { task: nextTask, timeUntil }
  }, [tasks, currentDate])

  // Get upcoming tasks (next 5 tasks across all days)
  const getUpcomingTasks = useCallback((limit: number = 5): TimeSlot[] => {
    const currentDay = getCurrentDay()
    const currentTime = getCurrentTimeInMinutes()
    const currentDayIndex = DAYS.indexOf(currentDay)
    
    const allUpcomingTasks: (TimeSlot & { sortOrder: number })[] = []
    
    // Add remaining tasks from today
    tasks
      .filter(task => 
        task.day === currentDay && 
        task.status !== 'COMPLETED' &&
        !task.isSleepTime
      )
      .forEach(task => {
        const taskStart = convertToMinutes(task.startTime)
        if (taskStart > currentTime) {
          allUpcomingTasks.push({
            ...task,
            sortOrder: taskStart
          })
        }
      })
    
    // Add tasks from future days
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7
      const nextDay = DAYS[nextDayIndex]
      
      tasks
        .filter(task => 
          task.day === nextDay && 
          task.status !== 'COMPLETED' &&
          !task.isSleepTime
        )
        .forEach(task => {
          const taskStart = convertToMinutes(task.startTime)
          allUpcomingTasks.push({
            ...task,
            sortOrder: (i * 24 * 60) + taskStart // Add day offset for sorting
          })
        })
    }
    
    return allUpcomingTasks
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, limit)
  }, [tasks, currentDate])

  // Get tasks grouped by day
  const getTasksByDay = useCallback((): Record<string, TimeSlot[]> => {
    const tasksByDay: Record<string, TimeSlot[]> = {}
    
    DAYS.forEach(day => {
      tasksByDay[day] = tasks
        .filter(task => 
          task.day === day && 
          task.status !== 'COMPLETED' &&
          !task.isSleepTime
        )
        .sort((a, b) => convertToMinutes(a.startTime) - convertToMinutes(b.startTime))
    })
    
    return tasksByDay
  }, [tasks])

  const visibleDays = useMemo(() => getFilteredDays(), [timeSettings.showWeekends])
  const sleepStats = useMemo(() => getSleepStats(), [sleepSchedules])
  const currentTaskInfo = useMemo(() => getCurrentTask(), [getCurrentTask])
  const nextTaskInfo = useMemo(() => getNextTask(), [getNextTask])
  const upcomingTasks = useMemo(() => getUpcomingTasks(5), [getUpcomingTasks])
  const tasksByDay = useMemo(() => getTasksByDay(), [getTasksByDay])

  if (isLoading && isInitialLoad) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Loading Your Timetable</h2>
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
            </div>

            <div className="flex items-center gap-2 flex-wrap">
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
                onClick={handleRefresh}
                disabled={refreshing}
                className="h-9 w-9 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleClearCache}
                className="h-9 w-9 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                title="Clear cache and refresh"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowStats(!showStats)}
                className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <BarChart3 className="w-4 h-4" />
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

          {/* Navigation */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setDate(newDate.getDate() - 7)
                  setCurrentDate(newDate)
                }}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setDate(newDate.getDate() + 7)
                  setCurrentDate(newDate)
                }}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Next Week
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={timeSettings.displayMode === 'vertical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeSettings({...timeSettings, displayMode: 'vertical'})}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Columns className="w-4 h-4 mr-1" />
                Vertical
              </Button>
              <Button
                variant={timeSettings.displayMode === 'horizontal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeSettings({...timeSettings, displayMode: 'horizontal'})}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Rows className="w-4 h-4 mr-1" />
                Horizontal
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[120px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[120px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[120px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="STUDY">Study</SelectItem>
                  <SelectItem value="CLASS">Class</SelectItem>
                  <SelectItem value="PROJECT">Project</SelectItem>
                  <SelectItem value="MEETING">Meeting</SelectItem>
                  <SelectItem value="WORKOUT">Workout</SelectItem>
                  <SelectItem value="MEAL">Meal</SelectItem>
                  <SelectItem value="SLEEP">Sleep</SelectItem>
                  <SelectItem value="FIXED">Fixed</SelectItem>
                  <SelectItem value="FREE">Free</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        {showStats && stats && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Task Statistics</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStats(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <ListTodo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.completed}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.overdue}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-3">By Priority</h3>
                    <div className="space-y-2">
                      {Object.entries(stats.byPriority || {}).map(([priority, count]) => (
                        <div key={priority} className="flex items-center justify-between">
                          <Badge className={PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS]}>
                            {priority}
                          </Badge>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-3">By Day</h3>
                    <div className="space-y-2">
                      {Object.entries(stats.byDay || {}).map(([day, count]) => (
                        <div key={day} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{DAY_DISPLAY[day as keyof typeof DAY_DISPLAY]}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-gray-200 mb-3">Hours</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Hours</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stats.totalHours.toFixed(1)}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">{stats.completedHours.toFixed(1)}h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
                        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{(stats.totalHours - stats.completedHours).toFixed(1)}h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sleep Schedule Summary - Exactly like builder */}
        {timeSettings.showSleepBlocks && sleepSchedules.length > 0 && (
          <Card className="border-gray-200 dark:border-gray-700 mb-6">
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

        {/* Time Extension Summary - Exactly like builder */}
        {(timeSettings.extendedHours.morning || 
          timeSettings.extendedHours.evening || 
          timeSettings.extendedHours.night || 
          timeSettings.extendedHours.custom.length > 0) && (
          <Card className="border-yellow-200 dark:border-yellow-800 mb-6">
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

        {/* Fixed Commitments Summary - Exactly like builder */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 mb-6">
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
                  <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">No Fixed Commitments</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  You don't have any fixed commitments added. Go to the Timetable Builder to add them.
                </p>
                <Button onClick={() => window.location.href = '/dashboard/timetable/builder'}>
                  Go to Builder
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
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current & Next Tasks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Current Task Card */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded">
                  <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                Current Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTaskInfo.task ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${currentTaskInfo.task.color}20` }}
                    >
                      {getIconByType(currentTaskInfo.task.type === 'study' ? 'STUDY' : 
                        currentTaskInfo.task.type === 'class' ? 'CLASS' :
                        currentTaskInfo.task.type === 'project' ? 'PROJECT' :
                        currentTaskInfo.task.type === 'health' ? 'HEALTH' :
                        currentTaskInfo.task.type === 'meeting' ? 'MEETING' :
                        currentTaskInfo.task.type === 'workout' ? 'WORKOUT' :
                        currentTaskInfo.task.type === 'meal' ? 'MEAL' :
                        currentTaskInfo.task.type === 'entertainment' ? 'ENTERTAINMENT' : 'OTHER')}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {currentTaskInfo.task.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentTaskInfo.task.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={PRIORITY_COLORS[currentTaskInfo.task.priority]}>
                          {currentTaskInfo.task.priority}
                        </Badge>
                        <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-400">
                          {formatTime(currentTaskInfo.task.startTime)} - {formatTime(currentTaskInfo.task.endTime)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {Math.round(currentTaskInfo.progress)}%
                      </span>
                    </div>
                    <Progress value={currentTaskInfo.progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Time Remaining</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDuration(currentTaskInfo.timeRemaining)}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => markTaskComplete(currentTaskInfo.task!.id)}
                    disabled={isCompleting === currentTaskInfo.task!.id}
                  >
                    {isCompleting === currentTaskInfo.task!.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Mark as Complete
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">No Current Task</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You don't have any tasks happening right now
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Task Card */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
                  <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                Next Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextTaskInfo.task ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${nextTaskInfo.task.color}20` }}
                    >
                      {getIconByType(nextTaskInfo.task.type === 'study' ? 'STUDY' : 
                        nextTaskInfo.task.type === 'class' ? 'CLASS' :
                        nextTaskInfo.task.type === 'project' ? 'PROJECT' :
                        nextTaskInfo.task.type === 'health' ? 'HEALTH' :
                        nextTaskInfo.task.type === 'meeting' ? 'MEETING' :
                        nextTaskInfo.task.type === 'workout' ? 'WORKOUT' :
                        nextTaskInfo.task.type === 'meal' ? 'MEAL' :
                        nextTaskInfo.task.type === 'entertainment' ? 'ENTERTAINMENT' : 'OTHER')}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {nextTaskInfo.task.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {nextTaskInfo.task.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={PRIORITY_COLORS[nextTaskInfo.task.priority]}>
                          {nextTaskInfo.task.priority}
                        </Badge>
                        <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-400">
                          {formatTime(nextTaskInfo.task.startTime)} - {formatTime(nextTaskInfo.task.endTime)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Starts in</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {nextTaskInfo.timeUntil < 60 
                        ? `${nextTaskInfo.timeUntil} minutes` 
                        : `${Math.floor(nextTaskInfo.timeUntil / 60)}h ${nextTaskInfo.timeUntil % 60}m`}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => handleTaskClick(nextTaskInfo.task!.id)}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">No Upcoming Tasks</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You don't have any tasks scheduled for today
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks Section */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded">
                  <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                Upcoming Tasks
              </div>
              <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-400">
                Next {upcomingTasks.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => {
                  const taskDay = DAY_FULL_DISPLAY[task.day as keyof typeof DAY_FULL_DISPLAY]
                  const isToday = task.day === getCurrentDay()
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all"
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${task.color}20` }}
                      >
                        {getIconByType(task.type === 'study' ? 'STUDY' : 
                          task.type === 'class' ? 'CLASS' :
                          task.type === 'project' ? 'PROJECT' :
                          task.type === 'health' ? 'HEALTH' :
                          task.type === 'meeting' ? 'MEETING' :
                          task.type === 'workout' ? 'WORKOUT' :
                          task.type === 'meal' ? 'MEAL' :
                          task.type === 'entertainment' ? 'ENTERTAINMENT' : 'OTHER')}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {task.title}
                          </h4>
                          <Badge className={PRIORITY_COLORS[task.priority]}>
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>{isToday ? 'Today' : taskDay}</span>
                          <span>•</span>
                          <span>{formatTime(task.startTime)}</span>
                          <span>•</span>
                          <span>{formatDuration(task.duration)}</span>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">All Caught Up!</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You have no upcoming tasks. Time to relax or add more tasks!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Day-wise Tasks Section */}
        <Card className="dark:bg-gray-800 dark:border-gray-700 mb-6">
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
                {visibleDays.map(day => (
                  <TabsTrigger 
                    key={day} 
                    value={day}
                    className="flex-1 dark:data-[state=active]:bg-gray-700 dark:text-gray-300"
                  >
                    {DAY_DISPLAY[day as keyof typeof DAY_DISPLAY]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {visibleDays.map(day => (
                <TabsContent key={day} value={day} className="mt-0">
                  {tasksByDay[day] && tasksByDay[day].length > 0 ? (
                    <div className="space-y-3">
                      {tasksByDay[day].map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all"
                          onClick={() => handleTaskClick(task.id)}
                        >
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${task.color}20` }}
                          >
                            {getIconByType(task.type === 'study' ? 'STUDY' : 
                              task.type === 'class' ? 'CLASS' :
                              task.type === 'project' ? 'PROJECT' :
                              task.type === 'health' ? 'HEALTH' :
                              task.type === 'meeting' ? 'MEETING' :
                              task.type === 'workout' ? 'WORKOUT' :
                              task.type === 'meal' ? 'MEAL' :
                              task.type === 'entertainment' ? 'ENTERTAINMENT' : 'OTHER')}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                {task.title}
                              </h4>
                              <Badge className={PRIORITY_COLORS[task.priority]}>
                                {task.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span>{formatTime(task.startTime)} - {formatTime(task.endTime)}</span>
                              <span>•</span>
                              <span>{task.subject}</span>
                              <span>•</span>
                              <span>{formatDuration(task.duration)}</span>
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
                              disabled={isCompleting === task.id}
                            >
                              {isCompleting === task.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-gray-400 hover:text-green-500" />
                              )}
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        No tasks scheduled for {DAY_FULL_DISPLAY[day as keyof typeof DAY_FULL_DISPLAY]}
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Main Timetable - EXACTLY like builder */}
        {tasks.length === 0 && fixedTimes.length === 0 && sleepSchedules.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">No Timetable Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              You don't have any scheduled items yet. Go to the Timetable Builder to create your schedule.
            </p>
            <Button onClick={() => window.location.href = '/dashboard/timetable/builder'}>
              Go to Builder
            </Button>
          </div>
        ) : (
          <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
            <CardContent className="p-0">
              {timeSettings.displayMode === 'vertical' ? (
                <VerticalTimetable
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
                  formatTimeDisplay={formatTimeDisplay}
                  getTimeSlotColor={getTimeSlotColor}
                  getIconByType={getIconByType}
                  formatDurationShort={formatDurationShort}
                  onTaskClick={handleTaskClick}
                  onComplete={markTaskComplete}
                  isCompleting={isCompleting}
                  isExtendedTime={isExtendedTime}
                  getNextTimeSlot={getNextTimeSlot}
                  cn={cn}
                />
              ) : (
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
                  formatTimeDisplay={formatTimeDisplay}
                  getTimeSlotColor={getTimeSlotColor}
                  getIconByType={getIconByType}
                  formatDurationShort={formatDurationShort}
                  onTaskClick={handleTaskClick}
                  onComplete={markTaskComplete}
                  isCompleting={isCompleting}
                  isExtendedTime={isExtendedTime}
                  getNextTimeSlot={getNextTimeSlot}
                  cn={cn}
                />
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Task Details Dialog */}
      <Dialog open={showTaskDetails} onOpenChange={setShowTaskDetails}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="dark:text-gray-100">Task Details</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              View detailed information about this task
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 py-4">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${selectedTask.color}20` }}
                  >
                    {getIconByType(selectedTask.type === 'sleep' ? 'SLEEP' : 
                      selectedTask.type === 'study' ? 'STUDY' :
                      selectedTask.type === 'class' ? 'CLASS' :
                      selectedTask.type === 'project' ? 'PROJECT' :
                      selectedTask.type === 'health' ? 'HEALTH' :
                      selectedTask.type === 'meeting' ? 'MEETING' :
                      selectedTask.type === 'workout' ? 'WORKOUT' :
                      selectedTask.type === 'meal' ? 'MEAL' :
                      selectedTask.type === 'entertainment' ? 'ENTERTAINMENT' : 'OTHER')}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {selectedTask.title}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={PRIORITY_COLORS[selectedTask.priority]}>
                        {getPriorityIcon(selectedTask.priority)}
                        <span className="ml-1">{selectedTask.priority}</span>
                      </Badge>
                      <Badge className={STATUS_COLORS[selectedTask.status || 'PENDING']}>
                        {getStatusIcon(selectedTask.status || 'PENDING')}
                        <span className="ml-1">
                          {selectedTask.status === 'IN_PROGRESS' ? 'In Progress' : selectedTask.status}
                        </span>
                      </Badge>
                      <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-400">
                        {selectedTask.type}
                      </Badge>
                    </div>
                  </div>
                  {selectedTask.status !== 'COMPLETED' && (
                    <Button
                      onClick={() => {
                        markTaskComplete(selectedTask.id)
                        setShowTaskDetails(false)
                      }}
                      disabled={isCompleting === selectedTask.id}
                    >
                      {isCompleting === selectedTask.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      Mark Complete
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Day & Time</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {DAY_FULL_DISPLAY[selectedTask.day as keyof typeof DAY_FULL_DISPLAY]}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {formatTime(selectedTask.startTime)} - {formatTime(selectedTask.endTime)}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDuration(selectedTask.duration)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedTask.duration} minutes
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Subject</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedTask.subject || 'Not specified'}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedTask.category || 'Not specified'}
                    </div>
                  </div>
                </div>

                {selectedTask.note && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Notes</div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedTask.note}
                    </p>
                  </div>
                )}

                {selectedTask.goalId && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                    <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-3">Linked Goal</h3>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-blue-700 dark:text-blue-400 mb-1">
                          Goal ID: {selectedTask.goalId}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTask.milestoneId && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/30">
                    <h3 className="font-medium text-purple-700 dark:text-purple-400 mb-3">Linked Milestone</h3>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-purple-700 dark:text-purple-400 mb-1">
                          Milestone ID: {selectedTask.milestoneId}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTask.fixedCommitmentId && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/30">
                    <h3 className="font-medium text-orange-700 dark:text-orange-400 mb-3">Fixed Commitment</h3>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-orange-700 dark:text-orange-400 mb-1">
                          Fixed Commitment ID: {selectedTask.fixedCommitmentId}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTask.gracePeriodEndsAt && selectedTask.status !== 'COMPLETED' && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">Due Date</div>
                    <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      {format(new Date(selectedTask.gracePeriodEndsAt), 'MMM d, yyyy h:mm a')}
                      <span className="ml-2 text-xs">
                        ({formatDistanceToNow(new Date(selectedTask.gracePeriodEndsAt), { addSuffix: true })})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={() => setShowTaskDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Timetable Settings</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Customize how your timetable looks
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-200">Display Options</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium dark:text-gray-300">Show Weekends</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Include Saturday and Sunday</div>
                </div>
                <Switch
                  checked={timeSettings.showWeekends}
                  onCheckedChange={(checked) => setTimeSettings({...timeSettings, showWeekends: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium dark:text-gray-300">24-Hour View</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Show all 24 hours of the day</div>
                </div>
                <Switch
                  checked={timeSettings.show24Hours}
                  onCheckedChange={(checked) => setTimeSettings({...timeSettings, show24Hours: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium dark:text-gray-300">Show Sleep Blocks</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Display sleep schedule in timetable</div>
                </div>
                <Switch
                  checked={timeSettings.showSleepBlocks}
                  onCheckedChange={(checked) => setTimeSettings({...timeSettings, showSleepBlocks: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium dark:text-gray-300">Compact Mode</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Reduce cell height</div>
                </div>
                <Switch
                  checked={timeSettings.compactMode}
                  onCheckedChange={(checked) => setTimeSettings({
                    ...timeSettings, 
                    compactMode: checked,
                    cellHeight: checked ? 40 : 60
                  })}
                />
              </div>
            </div>

            <Separator className="dark:bg-gray-700" />

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-200">Time Range</h3>
              
              <div>
                <Label className="text-sm dark:text-gray-300">Start Hour</Label>
                <Select
                  value={timeSettings.startHour.toString()}
                  onValueChange={(value) => setTimeSettings({...timeSettings, startHour: parseInt(value)})}
                >
                  <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(hour => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm dark:text-gray-300">End Hour</Label>
                <Select
                  value={timeSettings.endHour.toString()}
                  onValueChange={(value) => setTimeSettings({...timeSettings, endHour: parseInt(value)})}
                >
                  <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {[12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(hour => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour === 24 ? '12:00 AM' : `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm dark:text-gray-300">Time Interval</Label>
                <Select
                  value={timeSettings.interval.toString()}
                  onValueChange={(value) => setTimeSettings({...timeSettings, interval: parseInt(value)})}
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
                  onValueChange={(value) => setTimeSettings({...timeSettings, cellHeight: parseInt(value)})}
                  disabled={timeSettings.compactMode}
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

            <Separator className="dark:bg-gray-700" />

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-200">Extended Hours</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={timeSettings.extendedHours.morning ? "default" : "outline"}
                  onClick={() => setTimeSettings({
                    ...timeSettings,
                    extendedHours: {
                      ...timeSettings.extendedHours,
                      morning: !timeSettings.extendedHours.morning
                    }
                  })}
                  className="flex-col h-auto py-3"
                >
                  <Sunrise className="w-5 h-5 mb-1" />
                  <span className="text-xs">Morning</span>
                  <span className="text-[10px] opacity-75">5 AM - 8 AM</span>
                </Button>
                
                <Button
                  variant={timeSettings.extendedHours.evening ? "default" : "outline"}
                  onClick={() => setTimeSettings({
                    ...timeSettings,
                    extendedHours: {
                      ...timeSettings.extendedHours,
                      evening: !timeSettings.extendedHours.evening
                    }
                  })}
                  className="flex-col h-auto py-3"
                >
                  <Sunset className="w-5 h-5 mb-1" />
                  <span className="text-xs">Evening</span>
                  <span className="text-[10px] opacity-75">6 PM - 10 PM</span>
                </Button>
                
                <Button
                  variant={timeSettings.extendedHours.night ? "default" : "outline"}
                  onClick={() => setTimeSettings({
                    ...timeSettings,
                    extendedHours: {
                      ...timeSettings.extendedHours,
                      night: !timeSettings.extendedHours.night
                    }
                  })}
                  className="flex-col h-auto py-3 col-span-2"
                >
                  <MoonStar className="w-5 h-5 mb-1" />
                  <span className="text-xs">Night</span>
                  <span className="text-[10px] opacity-75">10 PM - 12 AM</span>
                </Button>
              </div>
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

// Vertical Timetable Component - EXACT copy from builder
function VerticalTimetable({ 
  timeSlots,
  visibleDays,
  tasks,
  fixedTimes,
  timeSettings,
  getTasksForCell,
  getTaskSpan,
  shouldShowTaskInCell,
  isTimeInFixedSlot,
  isTimeInFreePeriod,
  formatTimeDisplay,
  getTimeSlotColor,
  getIconByType,
  formatDurationShort,
  onTaskClick,
  onComplete,
  isCompleting,
  isExtendedTime,
  getNextTimeSlot,
  cn
}: { 
  timeSlots: string[]
  visibleDays: string[]
  tasks: TimeSlot[]
  fixedTimes: FixedTime[]
  timeSettings: TimeSettings
  getTasksForCell: (day: string, time: string) => TimeSlot[]
  getTaskSpan: (task: TimeSlot) => number
  shouldShowTaskInCell: (task: TimeSlot, day: string, time: string) => boolean
  isTimeInFixedSlot: (day: string, time: string) => FixedTime | null
  isTimeInFreePeriod: (day: string, time: string) => {fixedTime: FixedTime, freePeriod: any} | null
  formatTimeDisplay: (time: string) => string
  getTimeSlotColor: (type: string) => string
  getIconByType: (type: string) => JSX.Element
  formatDurationShort: (minutes: number) => string
  onTaskClick: (taskId?: string) => void
  onComplete: (taskId: string) => void
  isCompleting: string | null
  isExtendedTime: (time: string) => boolean
  getNextTimeSlot: (time: string) => string
  cn: (...classes: (string | boolean | undefined | null)[]) => string
}) {
  const cellWidth = 140

  return (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <div className="inline-block min-w-full">
        {/* Header */}
        <div className="flex border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-20">
          <div 
            className="flex-shrink-0 border-r-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4"
            style={{ width: cellWidth }}
          >
            <div className="font-bold text-gray-900 dark:text-gray-100">Time</div>
          </div>
          {visibleDays.map((day, index) => (
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

        {/* Body */}
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
            {visibleDays.map(day => (
              <div 
                key={day} 
                className="flex-shrink-0 flex flex-col relative"
                style={{ width: cellWidth }}
              >
                {timeSlots.map((time) => {
                  const fixedTime = isTimeInFixedSlot(day, time)
                  const freePeriodInfo = isTimeInFreePeriod(day, time)
                  const tasksInCell = getTasksForCell(day, time)
                  const filteredTasksInCell = tasksInCell.filter(task => {
                    return true
                  })
                  const primaryTask = filteredTasksInCell.find(task => 
                    shouldShowTaskInCell(task, day, time)
                  ) || filteredTasksInCell[0]
                  
                  const isFreePeriod = !!freePeriodInfo
                  const isSleepTime = filteredTasksInCell.some(t => t.isSleepTime)
                  const sleepTask = filteredTasksInCell.find(t => t.isSleepTime)
                  
                  return (
                    <div
                      key={`${day}-${time}`}
                      className={cn(
                        "relative border-r border-b border-gray-200 dark:border-gray-700 group transition-all duration-150",
                        fixedTime && !isFreePeriod && getTimeSlotColor(fixedTime.type),
                        isFreePeriod && "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
                        isExtendedTime(time) && !fixedTime && !isSleepTime && "bg-yellow-50/30 dark:bg-yellow-900/10",
                        isSleepTime && "bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700",
                        "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                        primaryTask && !primaryTask.isSleepTime && "cursor-pointer"
                      )}
                      style={{ 
                        height: `${timeSettings.cellHeight}px`,
                        width: cellWidth,
                        minWidth: cellWidth,
                        maxWidth: cellWidth
                      }}
                      onClick={() => primaryTask && !primaryTask.isSleepTime && primaryTask.id && onTaskClick(primaryTask.id)}
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

                      {isFreePeriod && !primaryTask && !isSleepTime && (
                        <div className="absolute inset-0 flex items-center justify-center p-0.5 cursor-pointer" onClick={() => onTaskClick()}>
                          <div className="text-[10px] font-medium text-center truncate px-0.5 text-green-700 dark:text-green-400">
                            <div className="flex items-center justify-center gap-0.5">
                              <Coffee className="w-2.5 h-2.5" />
                              <span>Free</span>
                            </div>
                            <div className="text-[8px] text-green-600 dark:text-green-400 mt-0.5">
                              Available
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
                          cellHeight={timeSettings.cellHeight}
                          cellWidth={cellWidth}
                          taskSpan={getTaskSpan(primaryTask)}
                          onComplete={onComplete}
                          isCompleting={isCompleting}
                          formatDurationShort={formatDurationShort}
                          getIconByType={getIconByType}
                          cn={cn}
                        />
                      )}

                      {sleepTask && shouldShowTaskInCell(sleepTask, day, time) && sleepTask.isSleepTime && (
                        <SleepTaskComponent 
                          task={sleepTask}
                          cellHeight={timeSettings.cellHeight}
                          cellWidth={cellWidth}
                          taskSpan={getTaskSpan(sleepTask)}
                          formatDurationShort={formatDurationShort}
                          getIconByType={getIconByType}
                          cn={cn}
                        />
                      )}

                      {tasksInCell.length > 1 && !primaryTask && !isSleepTime && (
                        <div className="absolute bottom-0.5 right-0.5">
                          <Badge variant="outline" className="text-[8px] px-1 py-0 dark:border-gray-600 dark:text-gray-400">
                            +{tasksInCell.length - 1}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Horizontal Timetable Component - EXACT copy from builder
function HorizontalTimetable({ 
  timeSlots,
  visibleDays,
  tasks,
  fixedTimes,
  timeSettings,
  getTasksForCell,
  getTaskSpan,
  shouldShowTaskInCell,
  isTimeInFixedSlot,
  isTimeInFreePeriod,
  formatTimeDisplay,
  getTimeSlotColor,
  getIconByType,
  formatDurationShort,
  onTaskClick,
  onComplete,
  isCompleting,
  isExtendedTime,
  getNextTimeSlot,
  cn
}: { 
  timeSlots: string[]
  visibleDays: string[]
  tasks: TimeSlot[]
  fixedTimes: FixedTime[]
  timeSettings: TimeSettings
  getTasksForCell: (day: string, time: string) => TimeSlot[]
  getTaskSpan: (task: TimeSlot) => number
  shouldShowTaskInCell: (task: TimeSlot, day: string, time: string) => boolean
  isTimeInFixedSlot: (day: string, time: string) => FixedTime | null
  isTimeInFreePeriod: (day: string, time: string) => {fixedTime: FixedTime, freePeriod: any} | null
  formatTimeDisplay: (time: string) => string
  getTimeSlotColor: (type: string) => string
  getIconByType: (type: string) => JSX.Element
  formatDurationShort: (minutes: number) => string
  onTaskClick: (taskId?: string) => void
  onComplete: (taskId: string) => void
  isCompleting: string | null
  isExtendedTime: (time: string) => boolean
  getNextTimeSlot: (time: string) => string
  cn: (...classes: (string | boolean | undefined | null)[]) => string
}) {
  const cellWidth = 140

  return (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <div className="inline-block min-w-full">
        {/* Header */}
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

        {/* Body */}
        <div className="flex flex-col">
          {visibleDays.map((day, dayIndex) => (
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
                {timeSlots.map((time) => {
                  const fixedTime = isTimeInFixedSlot(day, time)
                  const freePeriodInfo = isTimeInFreePeriod(day, time)
                  const tasksInCell = getTasksForCell(day, time)
                  const filteredTasksInCell = tasksInCell.filter(task => {
                    return true
                  })
                  const primaryTask = filteredTasksInCell.find(task => 
                    shouldShowTaskInCell(task, day, time)
                  ) || filteredTasksInCell[0]
                  
                  const isFreePeriod = !!freePeriodInfo
                  const isSleepTime = filteredTasksInCell.some(t => t.isSleepTime)
                  const sleepTask = filteredTasksInCell.find(t => t.isSleepTime)
                  
                  return (
                    <div
                      key={`${day}-${time}`}
                      className={cn(
                        "relative border-r border-b border-gray-200 dark:border-gray-700 group transition-all duration-150",
                        fixedTime && !isFreePeriod && getTimeSlotColor(fixedTime.type),
                        isFreePeriod && "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
                        isExtendedTime(time) && !fixedTime && !isSleepTime && "bg-yellow-50/30 dark:bg-yellow-900/10",
                        isSleepTime && "bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700",
                        "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                        primaryTask && !primaryTask.isSleepTime && "cursor-pointer"
                      )}
                      style={{ 
                        height: `${timeSettings.cellHeight}px`,
                        width: cellWidth,
                        minWidth: cellWidth,
                        maxWidth: cellWidth
                      }}
                      onClick={() => primaryTask && !primaryTask.isSleepTime && primaryTask.id && onTaskClick(primaryTask.id)}
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

                      {isFreePeriod && !primaryTask && !isSleepTime && (
                        <div className="absolute inset-0 flex items-center justify-center p-0.5 cursor-pointer" onClick={() => onTaskClick()}>
                          <div className="text-[10px] font-medium text-center truncate px-0.5 text-green-700 dark:text-green-400">
                            <div className="flex items-center justify-center gap-0.5">
                              <Coffee className="w-2.5 h-2.5" />
                              <span>Free</span>
                            </div>
                            <div className="text-[8px] text-green-600 dark:text-green-400 mt-0.5">
                              Available
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
                          cellHeight={timeSettings.cellHeight}
                          cellWidth={cellWidth}
                          taskSpan={getTaskSpan(primaryTask)}
                          onComplete={onComplete}
                          isCompleting={isCompleting}
                          formatDurationShort={formatDurationShort}
                          getIconByType={getIconByType}
                          cn={cn}
                        />
                      )}

                      {sleepTask && shouldShowTaskInCell(sleepTask, day, time) && sleepTask.isSleepTime && (
                        <SleepTaskComponent 
                          task={sleepTask}
                          cellHeight={timeSettings.cellHeight}
                          cellWidth={cellWidth}
                          taskSpan={getTaskSpan(sleepTask)}
                          formatDurationShort={formatDurationShort}
                          getIconByType={getIconByType}
                          cn={cn}
                        />
                      )}

                      {tasksInCell.length > 1 && !primaryTask && !isSleepTime && (
                        <div className="absolute bottom-0.5 right-0.5">
                          <Badge variant="outline" className="text-[8px] px-1 py-0 dark:border-gray-600 dark:text-gray-400">
                            +{tasksInCell.length - 1}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Task Component - EXACT copy from builder
function TaskComponent({ 
  task,
  cellHeight,
  cellWidth,
  taskSpan,
  onComplete,
  isCompleting,
  formatDurationShort,
  getIconByType,
  cn
}: { 
  task: TimeSlot
  cellHeight: number
  cellWidth: number
  taskSpan: number
  onComplete: (taskId: string) => void
  isCompleting: string | null
  formatDurationShort: (minutes: number) => string
  getIconByType: (type: string) => JSX.Element
  cn: (...classes: (string | boolean | undefined | null)[]) => string
}) {
  const isOverdue = task.gracePeriodEndsAt && new Date(task.gracePeriodEndsAt) < new Date() && task.status !== 'COMPLETED'
  
  // Map task type to icon type
  const iconType = task.type === 'study' ? 'STUDY' :
                   task.type === 'class' ? 'CLASS' :
                   task.type === 'project' ? 'PROJECT' :
                   task.type === 'health' ? 'HEALTH' :
                   task.type === 'meeting' ? 'MEETING' :
                   task.type === 'workout' ? 'WORKOUT' :
                   task.type === 'meal' ? 'MEAL' :
                   task.type === 'entertainment' ? 'ENTERTAINMENT' :
                   task.type === 'sleep' ? 'SLEEP' : 'OTHER'
  
  const Icon = getIconByType(iconType)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "absolute top-0.5 left-0.5 rounded border shadow-sm z-30 overflow-hidden cursor-pointer",
        "hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all",
        task.status === 'COMPLETED' && "opacity-75",
        isOverdue && "border-red-300 dark:border-red-700"
      )}
      style={{ 
        height: `${cellHeight - 4}px`,
        width: `calc(${taskSpan} * ${cellWidth}px - 8px)`,
        borderLeft: `3px solid ${task.color}`,
        backgroundColor: task.status === 'COMPLETED' 
          ? '#10B98115' 
          : `${task.color}15`
      }}
    >
      <div className="p-1 h-full flex flex-col">
        <div className="flex items-start justify-between mb-0.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-0.5">
              {Icon}
              <h4 className={cn(
                "text-[10px] font-semibold truncate",
                task.status === 'COMPLETED' ? "text-gray-500 dark:text-gray-400 line-through" : "dark:text-gray-200"
              )}>
                {task.title}
              </h4>
            </div>
          </div>
          
          {task.id && task.status !== 'COMPLETED' && (
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              onClick={(e) => {
                e.stopPropagation()
                onComplete(task.id!)
              }}
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

        <div className="mt-auto">
          <div className="flex items-center justify-between">
            {task.priority && (
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                task.priority === 'CRITICAL' ? 'bg-red-500' :
                task.priority === 'HIGH' ? 'bg-orange-500' :
                task.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
              )} />
            )}
            <span className="text-[8px] text-gray-500 dark:text-gray-400">
              {formatDurationShort(task.duration)}
            </span>
          </div>
          
          {taskSpan > 1 && (
            <div className="text-[6px] text-gray-500 dark:text-gray-400 text-right mt-0.5">
              {taskSpan} slots
            </div>
          )}
        </div>

        {task.status === 'COMPLETED' && (
          <div className="absolute top-0 right-0">
            <CheckCircle2 className="w-2 h-2 text-green-500" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Sleep Task Component - EXACT copy from builder
function SleepTaskComponent({ 
  task,
  cellHeight,
  cellWidth,
  taskSpan,
  formatDurationShort,
  getIconByType,
  cn
}: { 
  task: TimeSlot
  cellHeight: number
  cellWidth: number
  taskSpan: number
  formatDurationShort: (minutes: number) => string
  getIconByType: (type: string) => JSX.Element
  cn: (...classes: (string | boolean | undefined | null)[]) => string
}) {
  const Icon = getIconByType('SLEEP')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "absolute top-0.5 left-0.5 rounded border shadow-sm z-30 overflow-hidden",
        "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
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
          <h4 className="text-[10px] font-semibold truncate text-gray-700 dark:text-gray-300">
            Sleep
          </h4>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            <span className="text-[8px] text-gray-500 dark:text-gray-400">
              {formatDurationShort(task.duration)}
            </span>
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