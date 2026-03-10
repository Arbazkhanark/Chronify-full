// components/features/progress/ProgressClient.tsx
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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
  Github,
  GitBranch,
  GitCommit,
  GitPullRequest,
  GitMerge,
  ExternalLink,
  Link,
  Unlink,
  Github as GithubIcon
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadarProps,
  ComposedChart,
  Legend,
  Scatter,
  ScatterChart,
  ZAxis
} from 'recharts'

// Types
interface ActivityData {
  date: string
  count: number
  intensity: 0 | 1 | 2 | 3 | 4
  tasksCompleted?: number
  hoursLogged?: number
  focusScore?: number
  githubCommits?: number
}

interface Goal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  deadline: Date
  category: 'study' | 'fitness' | 'work' | 'personal' | 'learning' | 'health'
  color: string
  icon: string
  tasks: string[]
  progress: number
  streak: number
  lastUpdated: Date
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  milestones: Array<{
    value: number
    label: string
    achieved: boolean
    achievedAt?: Date
  }>
}

interface Insight {
  id: string
  type: 'productivity' | 'consistency' | 'focus' | 'trend' | 'warning' | 'achievement'
  title: string
  description: string
  icon: LucideIcon
  color: string
  value?: string | number
  trend?: 'up' | 'down' | 'neutral'
  action?: string
}

interface GithubData {
  connected: boolean
  username?: string
  avatarUrl?: string
  repositories?: number
  totalCommits?: number
  streak?: number
  contributions?: ActivityData[]
  lastSync?: Date
}

interface ProgressStats {
  totalActiveDays: number
  currentStreak: number
  longestStreak: number
  totalHours: number
  totalTasks: number
  completedTasks: number
  goalsCompleted: number
  totalGoals: number
  averageFocusScore: number
  consistencyScore: number
  productivityScore: number
  weeklyProgress: number
  monthlyProgress: number
  yearlyProgress: number
  topCategories: Array<{
    category: string
    hours: number
    color: string
  }>
  productivityByHour: Array<{
    hour: number
    productivity: number
    tasks: number
  }>
  productivityByDay: Array<{
    day: string
    productivity: number
    tasks: number
    hours: number
  }>
}

// Mock data generator for demo
const generateMockActivityData = (days: number = 365): ActivityData[] => {
  const data: ActivityData[] = []
  const now = new Date()
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    // Generate random activity with some patterns
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseIntensity = isWeekend ? 0.3 : 0.7
    
    // Add some streaks and patterns
    const randomFactor = Math.random()
    let count = 0
    let intensity: 0 | 1 | 2 | 3 | 4 = 0
    
    if (randomFactor > 0.3) {
      if (randomFactor > 0.9) {
        count = Math.floor(Math.random() * 10) + 15
        intensity = 4
      } else if (randomFactor > 0.7) {
        count = Math.floor(Math.random() * 8) + 8
        intensity = 3
      } else if (randomFactor > 0.5) {
        count = Math.floor(Math.random() * 6) + 4
        intensity = 2
      } else {
        count = Math.floor(Math.random() * 4) + 1
        intensity = 1
      }
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      count,
      intensity,
      tasksCompleted: Math.floor(count * (0.5 + Math.random() * 0.5)),
      hoursLogged: count * (0.5 + Math.random()),
      focusScore: Math.floor(Math.random() * 5) + 5,
      githubCommits: Math.floor(Math.random() * 5)
    })
  }
  
  return data
}

const generateMockGoals = (): Goal[] => {
  return [
    {
      id: 'goal-1',
      title: 'Study React Advanced Concepts',
      description: 'Complete advanced React course and build 3 projects',
      target: 50,
      current: 32,
      unit: 'hours',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      category: 'learning',
      color: '#8B5CF6',
      icon: 'Brain',
      tasks: ['React Hooks Deep Dive', 'Context API', 'Performance Optimization', 'Custom Hooks', 'Testing'],
      progress: 64,
      streak: 12,
      lastUpdated: new Date(),
      priority: 'HIGH',
      milestones: [
        { value: 10, label: 'Beginner', achieved: true, achievedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
        { value: 25, label: 'Intermediate', achieved: true, achievedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        { value: 40, label: 'Advanced', achieved: false },
        { value: 50, label: 'Expert', achieved: false }
      ]
    },
    {
      id: 'goal-2',
      title: 'Fitness Challenge',
      description: 'Workout consistently and improve overall fitness',
      target: 30,
      current: 18,
      unit: 'days',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      category: 'fitness',
      color: '#EC4899',
      icon: 'Dumbbell',
      tasks: ['Gym session', 'Cardio', 'Yoga', 'Stretching'],
      progress: 60,
      streak: 5,
      lastUpdated: new Date(),
      priority: 'MEDIUM',
      milestones: [
        { value: 5, label: 'Getting Started', achieved: true, achievedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
        { value: 15, label: 'Consistent', achieved: true, achievedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        { value: 25, label: 'Dedicated', achieved: false },
        { value: 30, label: 'Achiever', achieved: false }
      ]
    },
    {
      id: 'goal-3',
      title: 'Project Milestone',
      description: 'Complete core features for the new app',
      target: 100,
      current: 75,
      unit: '%',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      category: 'work',
      color: '#3B82F6',
      icon: 'Code',
      tasks: ['Authentication', 'Database integration', 'API endpoints', 'UI components', 'Testing'],
      progress: 75,
      streak: 8,
      lastUpdated: new Date(),
      priority: 'HIGH',
      milestones: [
        { value: 25, label: 'MVP', achieved: true, achievedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
        { value: 50, label: 'Alpha', achieved: true, achievedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
        { value: 75, label: 'Beta', achieved: true, achievedAt: new Date() },
        { value: 100, label: 'Release', achieved: false }
      ]
    },
    {
      id: 'goal-4',
      title: 'Read 12 Books',
      description: 'Expand knowledge through reading',
      target: 12,
      current: 7,
      unit: 'books',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      category: 'personal',
      color: '#F59E0B',
      icon: 'Book',
      tasks: ['Book 1', 'Book 2', 'Book 3', 'Book 4', 'Book 5'],
      progress: 58,
      streak: 3,
      lastUpdated: new Date(),
      priority: 'LOW',
      milestones: [
        { value: 3, label: 'Starter', achieved: true, achievedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) },
        { value: 6, label: 'Regular', achieved: true, achievedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
        { value: 9, label: 'Bookworm', achieved: false },
        { value: 12, label: 'Scholar', achieved: false }
      ]
    },
    {
      id: 'goal-5',
      title: 'Meditation Practice',
      description: 'Build a consistent meditation habit',
      target: 100,
      current: 42,
      unit: 'sessions',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      category: 'health',
      color: '#10B981',
      icon: 'Brain',
      tasks: ['Morning meditation', 'Evening meditation', 'Breathing exercises'],
      progress: 42,
      streak: 7,
      lastUpdated: new Date(),
      priority: 'MEDIUM',
      milestones: [
        { value: 20, label: 'Beginner', achieved: true, achievedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        { value: 50, label: 'Regular', achieved: false },
        { value: 75, label: 'Dedicated', achieved: false },
        { value: 100, label: 'Master', achieved: false }
      ]
    }
  ]
}

const generateMockInsights = (): Insight[] => {
  return [
    {
      id: 'insight-1',
      type: 'productivity',
      title: 'Peak Productivity Time',
      description: 'You are most productive between 9 AM and 11 AM. Schedule important tasks during this window.',
      icon: Zap,
      color: '#F59E0B',
      value: '9-11 AM',
      trend: 'up'
    },
    {
      id: 'insight-2',
      type: 'consistency',
      title: 'Consistency Streak',
      description: 'You have been consistent for 12 days! Keep the momentum going.',
      icon: TrendingUp,
      color: '#10B981',
      value: '12 days',
      trend: 'up'
    },
    {
      id: 'insight-3',
      type: 'focus',
      title: 'Focus Score Improvement',
      description: 'Your focus score has increased by 15% compared to last week.',
      icon: Brain,
      color: '#8B5CF6',
      value: '+15%',
      trend: 'up'
    },
    {
      id: 'insight-4',
      type: 'trend',
      title: 'Weekly Progress',
      description: 'You are 20% ahead of your weekly goal. Great job!',
      icon: Target,
      color: '#3B82F6',
      value: '20%',
      trend: 'up'
    },
    {
      id: 'insight-5',
      type: 'warning',
      title: 'Goal at Risk',
      description: 'Your "Project Milestone" goal needs attention. 3 tasks overdue.',
      icon: AlertCircle,
      color: '#EF4444',
      value: '3 overdue',
      trend: 'down'
    },
    {
      id: 'insight-6',
      type: 'achievement',
      title: 'Milestone Unlocked',
      description: 'You reached the Beta milestone for your project. Congratulations!',
      icon: Trophy,
      color: '#EC4899',
      value: 'Beta',
      trend: 'up'
    }
  ]
}

const generateMockStats = (): ProgressStats => {
  return {
    totalActiveDays: 187,
    currentStreak: 12,
    longestStreak: 45,
    totalHours: 245.5,
    totalTasks: 342,
    completedTasks: 287,
    goalsCompleted: 8,
    totalGoals: 12,
    averageFocusScore: 7.8,
    consistencyScore: 82,
    productivityScore: 76,
    weeklyProgress: 68,
    monthlyProgress: 72,
    yearlyProgress: 58,
    topCategories: [
      { category: 'Work', hours: 98.5, color: '#3B82F6' },
      { category: 'Learning', hours: 67.2, color: '#8B5CF6' },
      { category: 'Health', hours: 45.8, color: '#10B981' },
      { category: 'Personal', hours: 34.0, color: '#F59E0B' }
    ],
    productivityByHour: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      productivity: Math.floor(Math.random() * 60) + 20,
      tasks: Math.floor(Math.random() * 8) + 1
    })),
    productivityByDay: [
      { day: 'Mon', productivity: 75, tasks: 12, hours: 6.5 },
      { day: 'Tue', productivity: 82, tasks: 15, hours: 7.2 },
      { day: 'Wed', productivity: 78, tasks: 14, hours: 6.8 },
      { day: 'Thu', productivity: 85, tasks: 16, hours: 8.0 },
      { day: 'Fri', productivity: 70, tasks: 11, hours: 5.5 },
      { day: 'Sat', productivity: 55, tasks: 6, hours: 3.2 },
      { day: 'Sun', productivity: 60, tasks: 8, hours: 4.0 }
    ]
  }
}

// Helper functions
const getMonthDays = (year: number, month: number): Date[] => {
  const days: Date[] = []
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d))
  }
  
  return days
}

const getWeekDays = (date: Date): Date[] => {
  const days: Date[] = []
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    days.push(day)
  }
  
  return days
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const getIntensityColor = (intensity: number): string => {
  switch (intensity) {
    case 0: return 'bg-gray-100 dark:bg-gray-800'
    case 1: return 'bg-green-200 dark:bg-green-900/30'
    case 2: return 'bg-green-400 dark:bg-green-700'
    case 3: return 'bg-green-600 dark:bg-green-600'
    case 4: return 'bg-green-800 dark:bg-green-500'
    default: return 'bg-gray-100 dark:bg-gray-800'
  }
}

const getIntensityTooltip = (data: ActivityData | undefined): string => {
  if (!data) return 'No activity'
  return `${data.count} activities • ${data.tasksCompleted} tasks • ${data.hoursLogged?.toFixed(1)} hours`
}

const getCategoryIcon = (iconName: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    Brain: Brain,
    Dumbbell: Dumbbell,
    Code: Code,
    Book: Book,
    Heart: HeartIcon,
    Target: TargetIcon2,
    Trophy: Trophy,
    Crown: Crown,
    Star: StarIcon,
    Rocket: Rocket,
    Coffee: CoffeeIcon,
    Laptop: Laptop,
    GraduationCap: GraduationCap,
    Users: Users,
    Music: Music,
    Gamepad2: Gamepad2,
    Home: Home,
    Car: Car,
    Utensils: Utensils,
    Building: Building,
    Clock: Clock,
    Calendar: Calendar,
    Award: Award,
    Zap: ZapIcon
  }
  return icons[iconName] || TargetIcon2
}

// Heatmap Cell Component
const HeatmapCell = ({ 
  date, 
  activity, 
  onClick 
}: { 
  date: Date
  activity?: ActivityData
  onClick: (date: Date, activity?: ActivityData) => void
}) => {
  const dayOfWeek = date.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const isToday = formatDate(date) === formatDate(new Date())
  
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "w-4 h-4 rounded-sm cursor-pointer transition-all relative group",
        getIntensityColor(activity?.intensity || 0),
        isToday && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900",
        isWeekend && "opacity-80"
      )}
      onClick={() => onClick(date, activity)}
    >
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        <br />
        {getIntensityTooltip(activity)}
      </div>
    </motion.div>
  )
}

// Goal Card Component
const GoalCard = ({ goal, onUpdate, onView }: { 
  goal: Goal
  onUpdate: (goalId: string, progress: number) => void
  onView: (goal: Goal) => void
}) => {
  const Icon = getCategoryIcon(goal.icon)
  const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isUrgent = daysLeft <= 7 && goal.progress < 100
  const isCompleted = goal.progress >= 100
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
      onClick={() => onView(goal)}
    >
      {/* Header with gradient */}
      <div 
        className="px-4 py-3"
        style={{
          background: `linear-gradient(135deg, ${goal.color}20 0%, ${goal.color}05 100%)`,
          borderBottom: `1px solid ${goal.color}30`
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <Icon className="w-5 h-5" style={{ color: goal.color }} />
            </div>
            <div>
              <h3 className="font-bold text-lg line-clamp-1">{goal.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {goal.category} • {goal.unit}
              </p>
            </div>
          </div>
          <Badge 
            className={`
              ${goal.priority === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                goal.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}
            `}
          >
            {goal.priority}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium">{goal.current}/{goal.target} {goal.unit}</span>
          </div>
          <Progress value={goal.progress} className="h-2" style={{ backgroundColor: `${goal.color}20` }}>
            <div className="h-full rounded-full transition-all" style={{ 
              width: `${goal.progress}%`,
              backgroundColor: goal.color,
              boxShadow: `0 0 10px ${goal.color}`
            }} />
          </Progress>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">Deadline</span>
            </div>
            <div className="font-medium flex items-center gap-1">
              {daysLeft} days
              {isUrgent && !isCompleted && (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-[8px] px-1 animate-pulse">
                  URGENT
                </Badge>
              )}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
              <Zap className="w-3 h-3" />
              <span className="text-xs">Streak</span>
            </div>
            <div className="font-medium flex items-center gap-1">
              {goal.streak} days
              {goal.streak >= 7 && (
                <FireIcon className="w-3 h-3 text-orange-500" />
              )}
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Milestones</span>
            <span className="font-medium">
              {goal.milestones.filter(m => m.achieved).length}/{goal.milestones.length}
            </span>
          </div>
          <div className="flex gap-1">
            {goal.milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex-1 h-1.5 rounded-full transition-all relative group"
                style={{
                  backgroundColor: milestone.achieved ? goal.color : `${goal.color}30`
                }}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {milestone.label}: {milestone.value} {goal.unit}
                  {milestone.achieved && milestone.achievedAt && (
                    <>
                      <br />
                      Achieved: {milestone.achievedAt.toLocaleDateString()}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            Updated {goal.lastUpdated.toLocaleDateString()}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2"
            onClick={(e) => {
              e.stopPropagation()
              onUpdate(goal.id, Math.min(goal.current + 1, goal.target))
            }}
          >
            <Plus className="w-3 h-3 mr-1" />
            Update
          </Button>
        </div>
      </div>

      {/* Completion overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center pointer-events-none">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold rotate-12 shadow-lg">
            COMPLETED 🎉
          </div>
        </div>
      )}
    </motion.div>
  )
}

// GitHub Integration Component
const GitHubIntegration = ({ 
  githubData, 
  onConnect, 
  onSync 
}: { 
  githubData: GithubData
  onConnect: () => void
  onSync: () => void
}) => {
  if (!githubData.connected) {
    return (
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Github className="w-12 h-12 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Connect GitHub</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
            Track your coding activity alongside your progress. See commit streaks, contribution patterns, and sync your development work.
          </p>
          <Button onClick={onConnect} className="gap-2">
            <Github className="w-4 h-4" />
            Connect GitHub Account
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-900">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                GitHub Integration
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Connected
                </Badge>
              </CardTitle>
              <CardDescription>
                @{githubData.username} • Last synced {githubData.lastSync?.toLocaleTimeString()}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onSync} className="gap-2">
            <RefreshCw className="w-3 h-3" />
            Sync
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Repositories', value: githubData.repositories, icon: GitBranch },
            { label: 'Total Commits', value: githubData.totalCommits, icon: GitCommit },
            { label: 'Current Streak', value: `${githubData.streak} days`, icon: GitPullRequest },
            { label: 'Contributions', value: '234', icon: GitMerge }
          ].map((stat, index) => (
            <div key={index} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</span>
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* GitHub Activity Heatmap */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Contribution Activity</h4>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-600 dark:text-gray-400">Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      "w-3 h-3 rounded-sm",
                      level === 0 ? 'bg-gray-100 dark:bg-gray-800' :
                      level === 1 ? 'bg-green-200 dark:bg-green-900/30' :
                      level === 2 ? 'bg-green-400 dark:bg-green-700' :
                      level === 3 ? 'bg-green-600 dark:bg-green-600' :
                      'bg-green-800 dark:bg-green-500'
                    )}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">More</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {githubData.contributions?.slice(0, 49).map((day, index) => (
              <div
                key={index}
                className={cn(
                  "w-full aspect-square rounded-sm",
                  day.intensity === 0 ? 'bg-gray-100 dark:bg-gray-800' :
                  day.intensity === 1 ? 'bg-green-200 dark:bg-green-900/30' :
                  day.intensity === 2 ? 'bg-green-400 dark:bg-green-700' :
                  day.intensity === 3 ? 'bg-green-600 dark:bg-green-600' :
                  'bg-green-800 dark:bg-green-500'
                )}
                title={`${day.date}: ${day.githubCommits} commits`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Fire icon for streaks
const FireIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.726 2.273a.75.75 0 0 1 .468.692c0 1.406-.54 2.557-1.127 3.427-.585.869-1.288 1.55-2.076 2.256a.75.75 0 0 1-1.088-.085 1.5 1.5 0 0 1 .056-2.037 9.07 9.07 0 0 1 1.833-1.354c.672-.384 1.082-.89 1.082-1.96a.75.75 0 0 1 .852-.94zM9.75 6.75a.75.75 0 0 1 .75.75c0 1.405.504 2.445 1.125 3.221.621.776 1.398 1.365 2.25 2.029a.75.75 0 0 1 .205 1.018 1.5 1.5 0 0 1-2.085.467c-.918-.582-1.888-1.268-2.568-2.095-.68-.828-1.077-1.864-1.077-3.14a.75.75 0 0 1 .75-.75z" />
    <path d="M18.15 7.686a.75.75 0 0 1 .135 1.052c-.297.383-.63.735-1.015 1.077-.384.343-.825.671-1.325.983a.75.75 0 0 1-1.008-.155 1.5 1.5 0 0 1 .174-2.014c.524-.455 1.02-.853 1.486-1.224a.75.75 0 0 1 1.053.135z" />
    <path d="M20.25 12a.75.75 0 0 1 .75.75c0 4.5-3.75 8.25-8.25 8.25s-8.25-3.75-8.25-8.25.75-4.5 3-6.75a.75.75 0 0 1 1.163.137c.585.957 1.077 1.9 1.077 3.363 0 .828.18 1.5.6 2.1.42.6 1.05 1.2 2.25 1.8 1.2-.6 1.83-1.2 2.25-1.8.42-.6.6-1.272.6-2.1 0-1.463.492-2.406 1.077-3.363a.75.75 0 0 1 1.163-.137c2.25 2.25 3 3.75 3 6.75z" />
  </svg>
)

export default function ProgressClient() {
  // State
  const [view, setView] = useState<'heatmap' | 'goals' | 'analytics' | 'github'>('heatmap')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false)
  const [showInsightModal, setShowInsightModal] = useState<boolean>(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [showWeekends, setShowWeekends] = useState<boolean>(true)
  const [compactMode, setCompactMode] = useState<boolean>(false)
  const [showNotifications, setShowNotifications] = useState<boolean>(true)
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true)
  
  // Data states
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [githubData, setGithubData] = useState<GithubData>({
    connected: false
  })

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
  const [selectedMetric, setSelectedMetric] = useState<'tasks' | 'hours' | 'focus' | 'commits'>('tasks')

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setActivityData(generateMockActivityData(365))
        setGoals(generateMockGoals())
        setInsights(generateMockInsights())
        setStats(generateMockStats())
        
        // Randomly connect GitHub for demo
        if (Math.random() > 0.5) {
          setGithubData({
            connected: true,
            username: 'chronify-user',
            avatarUrl: 'https://github.com/identicons/chronify.png',
            repositories: 24,
            totalCommits: 1243,
            streak: 12,
            contributions: generateMockActivityData(90),
            lastSync: new Date()
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load progress data')
        toast.error('Failed to load progress data')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Get activity for a specific date
  const getActivityForDate = useCallback((date: Date): ActivityData | undefined => {
    const dateStr = formatDate(date)
    return activityData.find(d => d.date === dateStr)
  }, [activityData])

  // Get month days with activity
  const monthDays = useMemo(() => {
    return getMonthDays(currentYear, currentMonth)
  }, [currentYear, currentMonth])

  // Get week days with activity
  const weekDays = useMemo(() => {
    return getWeekDays(selectedDate)
  }, [selectedDate])

  // Calculate statistics
  const calculatedStats = useMemo(() => {
    if (!stats) return null
    
    return stats
  }, [stats])

  // Filter activities by time range
  const filteredActivities = useMemo(() => {
    if (!activityData.length) return []
    
    const now = new Date()
    const cutoff = new Date()
    
    switch (timeRange) {
      case 'week':
        cutoff.setDate(now.getDate() - 7)
        break
      case 'month':
        cutoff.setMonth(now.getMonth() - 1)
        break
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1)
        break
      default:
        return activityData
    }
    
    return activityData.filter(d => new Date(d.date) >= cutoff)
  }, [activityData, timeRange])

  // Handle cell click
  const handleCellClick = (date: Date, activity?: ActivityData) => {
    setSelectedDate(date)
    toast.info(
      <div>
        <div className="font-bold">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        {activity ? (
          <div className="text-sm mt-1">
            <div>Activities: {activity.count}</div>
            <div>Tasks: {activity.tasksCompleted}</div>
            <div>Hours: {activity.hoursLogged?.toFixed(1)}</div>
            <div>Focus: {activity.focusScore}/10</div>
            {activity.githubCommits ? <div>Commits: {activity.githubCommits}</div> : null}
          </div>
        ) : (
          <div className="text-sm mt-1">No activity recorded</div>
        )}
      </div>,
      { duration: 4000 }
    )
  }

  // Handle goal update
  const handleGoalUpdate = (goalId: string, newProgress: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = {
          ...goal,
          current: newProgress,
          progress: (newProgress / goal.target) * 100,
          lastUpdated: new Date()
        }
        
        // Check for milestone achievements
        const newMilestones = goal.milestones.map(m => ({
          ...m,
          achieved: m.value <= newProgress || m.achieved,
          achievedAt: m.value <= newProgress && !m.achieved ? new Date() : m.achievedAt
        }))
        
        toast.success(`Progress updated for "${goal.title}"!`, {
          description: `${newProgress}/${goal.target} ${goal.unit}`,
        })
        
        return { ...updatedGoal, milestones: newMilestones }
      }
      return goal
    }))
  }

  // Handle GitHub connection
  const handleGitHubConnect = () => {
    toast.info('Connecting to GitHub...', {
      description: 'This would open GitHub OAuth flow'
    })
    
    // Simulate connection after 2 seconds
    setTimeout(() => {
      setGithubData({
        connected: true,
        username: 'chronify-user',
        avatarUrl: 'https://github.com/identicons/chronify.png',
        repositories: 24,
        totalCommits: 1243,
        streak: 12,
        contributions: generateMockActivityData(90),
        lastSync: new Date()
      })
      toast.success('GitHub connected successfully!')
    }, 2000)
  }

  // Handle GitHub sync
  const handleGitHubSync = () => {
    toast.info('Syncing GitHub data...')
    
    setTimeout(() => {
      setGithubData(prev => ({
        ...prev,
        lastSync: new Date(),
        contributions: generateMockActivityData(90)
      }))
      toast.success('GitHub data synced!')
    }, 2000)
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

  // Navigate month
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

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Loading Progress Data</h2>
              <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your progress...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Failed to Load Progress</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <Button onClick={() => window.location.reload()} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-gray-900 dark:text-gray-100">Progress Reports</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Track Your Progress</h1>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    LIVE
                  </div>
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {loading ? 'Loading your progress...' : 
                 error ? 'Error loading progress' :
                 `${activityData.filter(d => d.count > 0).length} active days • ${stats?.currentStreak} day streak • ${stats?.completedTasks} tasks completed`}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Streak indicator */}
              <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 dark:border-red-500/20">
                <div className="flex items-center gap-2">
                  <FireIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <div className="text-sm font-medium">
                    <span className="text-orange-600 dark:text-orange-400">{stats?.currentStreak}</span> day streak
                  </div>
                </div>
              </div>

              {/* Time range selector */}
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="gap-2"
              >
                {darkMode ? (
                  <>
                    <SunIcon className="w-4 h-4" />
                    Light
                  </>
                ) : (
                  <>
                    <MoonIcon className="w-4 h-4" />
                    Dark
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {calculatedStats && [
              { 
                label: 'Active Days', 
                value: calculatedStats.totalActiveDays, 
                icon: Calendar,
                color: 'text-blue-500',
                bgColor: 'bg-blue-500/10'
              },
              { 
                label: 'Streak', 
                value: `${calculatedStats.currentStreak} days`, 
                icon: FireIcon,
                color: 'text-orange-500',
                bgColor: 'bg-orange-500/10',
                badge: calculatedStats.currentStreak >= 10 ? '🔥' : undefined
              },
              { 
                label: 'Total Hours', 
                value: calculatedStats.totalHours.toFixed(1), 
                icon: Clock,
                color: 'text-purple-500',
                bgColor: 'bg-purple-500/10'
              },
              { 
                label: 'Tasks Done', 
                value: calculatedStats.completedTasks, 
                icon: CheckCircle,
                color: 'text-green-500',
                bgColor: 'bg-green-500/10'
              },
              { 
                label: 'Goals', 
                value: `${calculatedStats.goalsCompleted}/${calculatedStats.totalGoals}`, 
                icon: Target,
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-500/10'
              },
              { 
                label: 'Focus Score', 
                value: calculatedStats.averageFocusScore.toFixed(1), 
                icon: Brain,
                color: 'text-pink-500',
                bgColor: 'bg-pink-500/10'
              },
              { 
                label: 'Consistency', 
                value: `${calculatedStats.consistencyScore}%`, 
                icon: Activity,
                color: 'text-indigo-500',
                bgColor: 'bg-indigo-500/10'
              },
              { 
                label: 'Productivity', 
                value: `${calculatedStats.productivityScore}%`, 
                icon: Zap,
                color: 'text-cyan-500',
                bgColor: 'bg-cyan-500/10'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-3 h-3 ${stat.color}`} />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</span>
                </div>
                <div className="text-lg font-bold flex items-center gap-1">
                  {stat.value}
                  {stat.badge && <span className="text-sm">{stat.badge}</span>}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Navigation Tabs */}
          <Tabs value={view} onValueChange={(value: any) => setView(value)} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="heatmap" className="gap-2">
                <Grid3x3 className="w-4 h-4" />
                Heatmap
              </TabsTrigger>
              <TabsTrigger value="goals" className="gap-2">
                <Target className="w-4 h-4" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="github" className="gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </TabsTrigger>
            </TabsList>

            {/* Heatmap View */}
            <TabsContent value="heatmap" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-500" />
                        Activity Heatmap
                      </CardTitle>
                      <CardDescription>
                        Track your daily activity • {timeRange === 'week' ? 'Last 7 days' : 
                                                      timeRange === 'month' ? 'This month' : 
                                                      timeRange === 'year' ? 'This year' : 'All time'}
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Less</span>
                        <div className="flex gap-1">
                          {[0, 1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={cn(
                                "w-3 h-3 rounded-sm",
                                getIntensityColor(level)
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">More</span>
                      </div>
                      
                      <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tasks">Tasks</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="focus">Focus</SelectItem>
                          <SelectItem value="commits">Commits</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Month navigation */}
                  <div className="flex items-center justify-between mb-6">
                    <Button variant="outline" size="sm" onClick={goToPreviousMonth} className="gap-1">
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">
                        {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <Button variant="outline" size="sm" onClick={goToToday}>
                        Today
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={goToNextMonth} className="gap-1">
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Day labels */}
                  <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-500 dark:text-gray-400">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center">{day}</div>
                    ))}
                  </div>

                  {/* Heatmap grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for alignment */}
                    {Array.from({ length: monthDays[0]?.getDay() || 0 }).map((_, i) => (
                      <div key={`empty-${i}`} className="w-full aspect-square" />
                    ))}
                    
                    {/* Actual days */}
                    {monthDays.map((date) => {
                      const activity = getActivityForDate(date)
                      return (
                        <HeatmapCell
                          key={date.toISOString()}
                          date={date}
                          activity={activity}
                          onClick={handleCellClick}
                        />
                      )
                    })}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Total Activities', value: activityData.reduce((sum, d) => sum + d.count, 0) },
                        { label: 'Active Days', value: activityData.filter(d => d.count > 0).length },
                        { label: 'Peak Day', value: Math.max(...activityData.map(d => d.count)) },
                        { label: 'Average', value: (activityData.reduce((sum, d) => sum + d.count, 0) / activityData.length).toFixed(1) }
                      ].map((stat, index) => (
                        <div key={index}>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                          <div className="text-xl font-bold">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Overview</CardTitle>
                  <CardDescription>Your activity pattern for this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weekDays.map(date => {
                        const activity = getActivityForDate(date)
                        return {
                          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                          tasks: activity?.tasksCompleted || 0,
                          hours: activity?.hoursLogged || 0,
                          focus: activity?.focusScore || 0,
                          commits: activity?.githubCommits || 0
                        }
                      })}>
                        <defs>
                          <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey={selectedMetric === 'tasks' ? 'tasks' : 
                                   selectedMetric === 'hours' ? 'hours' :
                                   selectedMetric === 'focus' ? 'focus' : 'commits'} 
                          stroke={selectedMetric === 'tasks' ? '#8B5CF6' : 
                                  selectedMetric === 'hours' ? '#3B82F6' :
                                  selectedMetric === 'focus' ? '#10B981' : '#6B7280'}
                          fillOpacity={1}
                          fill={selectedMetric === 'tasks' ? 'url(#colorTasks)' : 
                                selectedMetric === 'hours' ? 'url(#colorHours)' : 
                                selectedMetric === 'focus' ? '#10B98120' : '#6B728020'}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Goals View */}
            <TabsContent value="goals" className="space-y-6">
              {/* Goals Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Your Goals</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {goals.filter(g => g.progress >= 100).length} completed • {goals.filter(g => g.progress < 100).length} in progress
                  </p>
                </div>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Goal
                </Button>
              </div>

              {/* Goals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onUpdate={handleGoalUpdate}
                    onView={setSelectedGoal}
                  />
                ))}
              </div>

              {/* Overall Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Overall Goal Progress</CardTitle>
                  <CardDescription>Track your collective progress across all goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Overall progress bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Overall Completion</span>
                        <span className="font-bold">
                          {Math.round((goals.reduce((sum, g) => sum + g.progress, 0) / (goals.length * 100)) * 100)}%
                        </span>
                      </div>
                      <Progress value={goals.reduce((sum, g) => sum + g.progress, 0) / goals.length} className="h-3">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"
                          style={{ width: `${goals.reduce((sum, g) => sum + g.progress, 0) / goals.length}%` }}
                        />
                      </Progress>
                    </div>

                    {/* Category breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['study', 'fitness', 'work', 'personal', 'learning', 'health'].map((category) => {
                        const categoryGoals = goals.filter(g => g.category === category)
                        const progress = categoryGoals.length > 0 
                          ? Math.round(categoryGoals.reduce((sum, g) => sum + g.progress, 0) / categoryGoals.length)
                          : 0
                        
                        return (
                          <div key={category} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 rounded-full" style={{
                                backgroundColor: categoryGoals[0]?.color || '#6B7280'
                              }} />
                              <span className="text-sm font-medium capitalize">{category}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {categoryGoals.length} goals
                              </span>
                              <span className="text-sm font-bold">{progress}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics View */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insights.map((insight) => {
                  const Icon = insight.icon
                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 cursor-pointer"
                      onClick={() => {
                        setSelectedInsight(insight)
                        setShowInsightModal(true)
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${insight.color}20` }}>
                          <Icon className="w-5 h-5" style={{ color: insight.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{insight.title}</h3>
                            <Badge className={`
                              ${insight.type === 'achievement' ? 'bg-yellow-100 text-yellow-800' :
                                insight.type === 'warning' ? 'bg-red-100 text-red-800 animate-pulse' :
                                insight.type === 'productivity' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'}
                            `}>
                              {insight.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {insight.description}
                          </p>
                          {insight.value && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-lg font-bold" style={{ color: insight.color }}>
                                {insight.value}
                              </span>
                              {insight.trend && (
                                <Badge className={`
                                  ${insight.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                `}>
                                  {insight.trend === 'up' ? '↑' : '↓'} {insight.trend}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Productivity by Hour */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Productivity by Hour
                    </CardTitle>
                    <CardDescription>When you're most productive during the day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart data={stats?.productivityByHour || []}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                          <XAxis 
                            dataKey="hour" 
                            tickFormatter={(hour) => `${hour}:00`}
                            className="text-xs"
                          />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px'
                            }}
                            formatter={(value: any) => [`${value}%`, 'Productivity']}
                          />
                          <Bar dataKey="productivity" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                            {stats?.productivityByHour.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.productivity > 70 ? '#10B981' : 
                                      entry.productivity > 50 ? '#8B5CF6' : 
                                      entry.productivity > 30 ? '#F59E0B' : '#EF4444'}
                              />
                            ))}
                          </Bar>
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Pattern */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Weekly Pattern
                    </CardTitle>
                    <CardDescription>Your productivity by day of week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.productivityByDay || []}>
                          <defs>
                            <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                          <XAxis dataKey="day" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="productivity" 
                            stroke="#3B82F6" 
                            fillOpacity={1}
                            fill="url(#colorProductivity)" 
                          />
                          <Bar dataKey="tasks" fill="#8B5CF6" opacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Time Distribution
                    </CardTitle>
                    <CardDescription>How you spend your time by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={stats?.topCategories || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="hours"
                          >
                            {stats?.topCategories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px'
                            }}
                            formatter={(value: any) => [`${value} hours`, 'Time']}
                          />
                          <Legend />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Focus Score Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Focus Score Trend
                    </CardTitle>
                    <CardDescription>Your focus levels over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={activityData.slice(-30)}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            className="text-xs"
                          />
                          <YAxis domain={[0, 10]} className="text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px'
                            }}
                            formatter={(value: any) => [`${value}/10`, 'Focus Score']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="focusScore" 
                            stroke="#8B5CF6" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 8 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="tasksCompleted" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Productivity Score Card */}
              <Card className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Productivity Score', value: `${stats?.productivityScore}%`, icon: Zap, color: '#8B5CF6' },
                      { label: 'Consistency Score', value: `${stats?.consistencyScore}%`, icon: Activity, color: '#3B82F6' },
                      { label: 'Efficiency Rate', value: `${Math.round((stats?.completedTasks || 0) / (stats?.totalTasks || 1) * 100)}%`, icon: Target, color: '#10B981' }
                    ].map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* GitHub View */}
            <TabsContent value="github">
              <GitHubIntegration 
                githubData={githubData}
                onConnect={handleGitHubConnect}
                onSync={handleGitHubSync}
              />
            </TabsContent>
          </Tabs>

          {/* Bottom Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {calculatedStats && [
              { label: 'Longest Streak', value: `${calculatedStats.longestStreak} days`, icon: FireIcon, color: 'text-orange-500' },
              { label: 'Weekly Progress', value: `${calculatedStats.weeklyProgress}%`, icon: TrendingUp, color: 'text-green-500' },
              { label: 'Monthly Progress', value: `${calculatedStats.monthlyProgress}%`, icon: Calendar, color: 'text-blue-500' },
              { label: 'Yearly Progress', value: `${calculatedStats.yearlyProgress}%`, icon: Award, color: 'text-purple-500' }
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center gap-3">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    <div className="text-xl font-bold">{stat.value}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Goal Detail Modal */}
      {selectedGoal && (
        <Dialog open={!!selectedGoal} onOpenChange={() => setSelectedGoal(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${selectedGoal.color}20` }}
                >
                  {(() => {
                    const Icon = getCategoryIcon(selectedGoal.icon)
                    return <Icon className="w-5 h-5" style={{ color: selectedGoal.color }} />
                  })()}
                </div>
                {selectedGoal.title}
              </DialogTitle>
              <DialogDescription>
                {selectedGoal.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-bold">{selectedGoal.current}/{selectedGoal.target} {selectedGoal.unit}</span>
                </div>
                <Progress value={selectedGoal.progress} className="h-3">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${selectedGoal.progress}%`,
                      backgroundColor: selectedGoal.color
                    }}
                  />
                </Progress>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Deadline</div>
                  <div className="font-bold flex items-center gap-1">
                    {selectedGoal.deadline.toLocaleDateString()}
                    {selectedGoal.deadline < new Date() && selectedGoal.progress < 100 && (
                      <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Streak</div>
                  <div className="font-bold flex items-center gap-1">
                    {selectedGoal.streak} days
                    {selectedGoal.streak >= 7 && (
                      <FireIcon className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</div>
                  <div className="font-bold capitalize">{selectedGoal.category}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Priority</div>
                  <Badge className={`
                    ${selectedGoal.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                      selectedGoal.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'}
                  `}>
                    {selectedGoal.priority}
                  </Badge>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                <h4 className="font-medium">Associated Tasks</h4>
                <div className="space-y-2">
                  {selectedGoal.tasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-3">
                <h4 className="font-medium">Milestones</h4>
                <div className="space-y-2">
                  {selectedGoal.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        milestone.achieved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      )}>
                        {milestone.achieved ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{milestone.label}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {milestone.value} {selectedGoal.unit}
                          </span>
                        </div>
                        {milestone.achievedAt && (
                          <div className="text-xs text-gray-500">
                            Achieved on {milestone.achievedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Update Progress */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium">Update Progress</h4>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleGoalUpdate(selectedGoal.id, Math.max(0, selectedGoal.current - 1))}
                  >
                    -
                  </Button>
                  <div className="flex-1 text-center">
                    <Input 
                      type="number" 
                      value={selectedGoal.current}
                      min={0}
                      max={selectedGoal.target}
                      className="text-center"
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (!isNaN(val) && val >= 0 && val <= selectedGoal.target) {
                          handleGoalUpdate(selectedGoal.id, val)
                        }
                      }}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleGoalUpdate(selectedGoal.id, Math.min(selectedGoal.target, selectedGoal.current + 1))}
                  >
                    +
                  </Button>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => handleGoalUpdate(selectedGoal.id, selectedGoal.target)}
                >
                  Mark as Complete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <Dialog open={!!selectedInsight} onOpenChange={() => setSelectedInsight(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${selectedInsight.color}20` }}
                >
                  <selectedInsight.icon className="w-5 h-5" style={{ color: selectedInsight.color }} />
                </div>
                {selectedInsight.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <p className="text-gray-700 dark:text-gray-300">
                {selectedInsight.description}
              </p>
              
              {selectedInsight.value && (
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                  <div className="text-3xl font-bold" style={{ color: selectedInsight.color }}>
                    {selectedInsight.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Current Value
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="font-medium">Recommendations</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {selectedInsight.type === 'productivity' && (
                    <>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Schedule your most important tasks during your peak hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Take breaks during your low-energy periods</span>
                      </li>
                    </>
                  )}
                  {selectedInsight.type === 'consistency' && (
                    <>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Keep up the great work! You're building a strong habit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Try to increase your daily minimum to maintain momentum</span>
                      </li>
                    </>
                  )}
                  {selectedInsight.type === 'focus' && (
                    <>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Use the Pomodoro technique to maintain focus</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Minimize distractions during focus sessions</span>
                      </li>
                    </>
                  )}
                  {selectedInsight.type === 'warning' && (
                    <>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span>Review your pending tasks and prioritize them</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span>Consider adjusting your goal timeline if needed</span>
                      </li>
                    </>
                  )}
                  {selectedInsight.type === 'achievement' && (
                    <>
                      <li className="flex items-start gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span>Celebrate your achievement! You've earned it</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span>Set your next milestone to keep progressing</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {selectedInsight.action && (
                <Button className="w-full">
                  {selectedInsight.action}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}