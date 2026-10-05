// src/components/features/goal/goal.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Target,
  TrendingUp,
  Calendar,
  AlertCircle,
  Filter,
  CheckCircle2,
  Clock,
  Award,
  Flame,
  Music,
  Briefcase,
  Heart,
  School,
  User,
  Loader2,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronRight,
  Grid,
  List,
  CalendarDays,
  Search,
  Download,
  Share2,
  RefreshCw,
  Eye,
  EyeOff,
  Moon,
  Sun,
  LogOut,
  Zap,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Toaster, toast } from 'sonner'

import { useGoals, Goal } from '@/hooks/useGoal'
import { useAuth } from '@/hooks/useAuth'
import { useVerification } from '@/hooks/useVerification'
import { Label } from '@/components/ui/label'

// ============================================================
// GOAL CATEGORIES
// ============================================================

const GOAL_CATEGORIES = [
  {
    id: 'ACADEMIC',
    label: 'Academic',
    icon: School,
    color: '#3B82F6',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    id: 'PROFESSIONAL',
    label: 'Professional',
    icon: Briefcase,
    color: '#10B981',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    id: 'HEALTH',
    label: 'Health & Fitness',
    icon: Heart,
    color: '#EF4444',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
  },
  {
    id: 'PERSONAL',
    label: 'Personal',
    icon: User,
    color: '#8B5CF6',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    id: 'SKILL_DEVELOPMENT',
    label: 'Skill Development',
    icon: Award,
    color: '#F59E0B',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  {
    id: 'FINANCIAL',
    label: 'Financial',
    icon: TrendingUp,
    color: '#6366F1',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  {
    id: 'SOCIAL',
    label: 'Social',
    icon: User,
    color: '#EC4899',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
  },
  {
    id: 'CREATIVE',
    label: 'Creative',
    icon: Music,
    color: '#F97316',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
]

// ============================================================
// HELPERS
// ============================================================

const getFutureDate = (daysFromNow: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date
}

const formatDateForInput = (date: Date | string): string => {
  try {
    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return getFutureDate(30).toISOString().split('T')[0]
    }

    return parsedDate.toISOString().split('T')[0]
  } catch {
    return getFutureDate(30).toISOString().split('T')[0]
  }
}

// ============================================================
// COMPONENT
// ============================================================

export default function GoalClients() {
  const { user, AuthService } = useAuth()

  const {
    goals = [],
    loading: goalsLoading,
    stats,
    fetchGoals,
    createGoal,
    updateGoal,
    markGoalAsCompleted,
    deleteGoal,
    addMilestone,
    updateMilestone,
    toggleMilestone,
    deleteMilestone,
    logProgressHours,
    refresh,
    getDaysUntilDeadline,
    isGoalOverdue,
    getEffectiveStatus,
  } = useGoals()

  const [darkMode, setDarkMode] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('priority')
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>(
    'grid',
  )
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const [showVerifyBanner, setShowVerifyBanner] = useState(true)

  const {
    isVerified,
    isSending: isResendingVerification,
    sendVerificationEmail,
  } = useVerification({
    email: user?.email,
  })

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    targetDate: getFutureDate(7),
  })

  const [newGoal, setNewGoal] = useState<{
    title: string
    description: string
    category: Goal['category']
    priority: Goal['priority']
    type: Goal['type']
    targetDate: Date
    totalHours: number
    weeklyTarget: number
    color: string
    tags: string[]
    isPublic: boolean
  }>({
    title: '',
    description: '',
    category: 'ACADEMIC',
    priority: 'MEDIUM',
    type: 'SHORT_TERM',
    targetDate: getFutureDate(30),
    totalHours: 50,
    weeklyTarget: 5,
    color: '#3B82F6',
    tags: [],
    isPublic: true,
  })

  useEffect(() => {
    const isDark =
      localStorage.getItem('darkMode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches

    setDarkMode(isDark)

    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode((previous) => {
      const next = !previous

      if (next) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('darkMode', 'true')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('darkMode', 'false')
      }

      return next
    })
  }

  useEffect(() => {
    const filterMap: Record<string, string> = {
      active: 'active',
      completed: 'completed',
      delayed: 'delayed',
      not_started: 'not_started',
      short: 'short',
      long: 'long',
      high: 'high',
    }

    void fetchGoals({
      filter:
        filterMap[filter] ||
        (GOAL_CATEGORIES.some(
          (category) => category.id.toLowerCase() === filter,
        )
          ? filter
          : undefined),
      priority: filter === 'high' ? 'high' : undefined,
    })
  }, [filter, fetchGoals])

  const handleLogout = async () => {
    await AuthService.logout()
    window.location.href = '/auth/login'
  }

  const handleVerifyEmail = async () => {
    await sendVerificationEmail()
  }

  const handleCreateGoal = async () => {
    if (!newGoal.title.trim()) {
      return
    }

    try {
      const createdGoal = await createGoal(newGoal)

      if (createdGoal) {
        setNewGoal({
          title: '',
          description: '',
          category: 'ACADEMIC',
          priority: 'MEDIUM',
          type: 'SHORT_TERM',
          targetDate: getFutureDate(30),
          totalHours: 50,
          weeklyTarget: 5,
          color: '#3B82F6',
          tags: [],
          isPublic: true,
        })

        setShowForm(false)
      }
    } catch (error: unknown) {
      console.error('Failed to create goal:', error)
    }
  }

  const handleUpdateGoal = async (
    goalId: string,
    updates: Partial<Goal>,
  ) => {
    try {
      await updateGoal(goalId, updates)
    } catch (error: unknown) {
      console.error('Failed to update goal:', error)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    setIsDeleting(goalId)

    try {
      await deleteGoal(goalId)

      if (selectedGoal?.id === goalId) {
        setSelectedGoal(null)
      }
    } catch (error: unknown) {
      console.error('Failed to delete goal:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleUpdateProgress = async (goalId: string, hours: number) => {
    try {
      await logProgressHours(goalId, hours)
    } catch (error: unknown) {
      console.error('Failed to log progress:', error)
    }
  }

  const handleAddMilestone = async () => {
    if (!selectedGoal || !newMilestone.title.trim()) {
      return
    }

    try {
      await addMilestone(selectedGoal.id, {
        ...newMilestone,
        targetDate: new Date(newMilestone.targetDate),
      })

      setNewMilestone({
        title: '',
        description: '',
        targetDate: getFutureDate(7),
      })

      setShowMilestoneForm(false)

      const updatedGoal = goals.find((goal) => goal.id === selectedGoal.id)

      if (updatedGoal) {
        setSelectedGoal(updatedGoal)
      }
    } catch (error: unknown) {
      console.error('Failed to add milestone:', error)
    }
  }

  const handleToggleMilestone = async (
    goalId: string,
    milestoneId: string,
  ) => {
    try {
      await toggleMilestone(goalId, milestoneId)

      if (selectedGoal?.id === goalId) {
        const updatedGoal = goals.find((goal) => goal.id === goalId)

        if (updatedGoal) {
          setSelectedGoal(updatedGoal)
        }
      }
    } catch (error: unknown) {
      console.error('Failed to toggle milestone:', error)
    }
  }

  const filteredGoals = useMemo(() => {
    const goalsArray = Array.isArray(goals) ? goals : []

    if (!goalsArray.length) {
      return []
    }

    let filtered = [...goalsArray]

    if (filter !== 'all') {
      filtered = filtered.filter((goal) => {
        if (filter === 'active' && goal.status !== 'IN_PROGRESS') {
          return false
        }

        if (filter === 'completed' && goal.status !== 'COMPLETED') {
          return false
        }

        if (
          filter === 'delayed' &&
          getEffectiveStatus(goal) !== 'DELAYED'
        ) {
          return false
        }

        if (filter === 'not_started' && goal.status !== 'NOT_STARTED') {
          return false
        }

        if (filter === 'short' && goal.type !== 'SHORT_TERM') {
          return false
        }

        if (filter === 'long' && goal.type !== 'LONG_TERM') {
          return false
        }

        const categoryMatch = GOAL_CATEGORIES.find(
          (category) => category.id.toLowerCase() === filter,
        )

        if (categoryMatch && goal.category !== categoryMatch.id) {
          return false
        }

        if (
          filter === 'high' &&
          goal.priority !== 'HIGH' &&
          goal.priority !== 'CRITICAL'
        ) {
          return false
        }

        return true
      })
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()

      filtered = filtered.filter(
        (goal) =>
          goal.title.toLowerCase().includes(query) ||
          goal.description.toLowerCase().includes(query) ||
          Boolean(
            goal.tags?.some((tag) => tag.toLowerCase().includes(query)),
          ),
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority': {
          const priorityOrder = {
            CRITICAL: 4,
            HIGH: 3,
            MEDIUM: 2,
            LOW: 1,
          }

          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }

        case 'progress':
          return (b.progress || 0) - (a.progress || 0)

        case 'deadline':
          return (
            new Date(a.targetDate).getTime() -
            new Date(b.targetDate).getTime()
          )

        case 'created':
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          )

        case 'title':
          return a.title.localeCompare(b.title)

        case 'streak':
          return (b.streak || 0) - (a.streak || 0)

        default:
          return 0
      }
    })

    return filtered
  }, [goals, filter, searchQuery, sortBy, getEffectiveStatus])

  const getCategoryIcon = (category: Goal['category']) => {
    const categoryData = GOAL_CATEGORIES.find(
      (item) => item.id === category,
    )

    if (categoryData) {
      const Icon = categoryData.icon
      return <Icon className="w-4 h-4" />
    }

    return <Target className="w-4 h-4" />
  }

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'

      case 'HIGH':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'

      case 'MEDIUM':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'

      case 'LOW':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'

      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
    }
  }

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'

      case 'IN_PROGRESS':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'

      case 'DELAYED':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'

      case 'NOT_STARTED':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'

      case 'FAILED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'

      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    }
  }

  if (goalsLoading && (!Array.isArray(goals) || goals.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />

          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            Loading your goals...
          </h2>

          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    )
  }

  /* ==========================================================
     GOAL CARD
     ========================================================== */

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const daysLeft = getDaysUntilDeadline(goal.targetDate)

    const category = GOAL_CATEGORIES.find(
      (item) => item.id === goal.category,
    )

    const effectiveStatus = getEffectiveStatus(goal)
    const isOverdue = isGoalOverdue(goal)

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <div className="h-1.5" style={{ backgroundColor: goal.color }} />

        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div
                className={`p-2 sm:p-2.5 rounded-xl flex-shrink-0 ${category?.bgColor ?? 'bg-gray-100 dark:bg-gray-700'}`}
              >
                {getCategoryIcon(goal.category)}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                <Badge
                  className={`text-[10px] sm:text-xs ${getPriorityColor(goal.priority)}`}
                >
                  {goal.priority}
                </Badge>

                <Badge
                  className={`text-[10px] sm:text-xs ${getStatusColor(effectiveStatus)}`}
                >
                  {effectiveStatus.replace('_', ' ')}
                </Badge>

                {isOverdue && effectiveStatus !== 'DELAYED' && (
                  <Badge
                    variant="outline"
                    className="text-[10px] sm:text-xs border-red-200 text-red-600 dark:border-red-800 dark:text-red-400"
                  >
                    ⚠️ Overdue
                  </Badge>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 -mr-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setEditingGoal(goal)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Goal
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setSelectedGoal(goal)}>
                  <Target className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleUpdateProgress(goal.id, 1)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Log 1 Hour
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {goal.status !== 'COMPLETED' && (
                  <DropdownMenuItem
                    onClick={() => markGoalAsCompleted(goal.id)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    Mark Completed
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-red-600 focus:text-red-600"
                  disabled={isDeleting === goal.id}
                >
                  {isDeleting === goal.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete Goal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 dark:text-gray-200 line-clamp-1">
            {goal.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
            {goal.description}
          </p>

          <div className="mb-3 sm:mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs sm:text-sm font-medium dark:text-gray-300">
                Progress
              </span>

              <span className="text-xs sm:text-sm font-bold dark:text-gray-300">
                {goal.progress}%
              </span>
            </div>

            <Progress value={goal.progress} className="h-2 sm:h-2.5" />

            <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2">
              <span>
                {goal.completedHours}/{goal.totalHours} hours
              </span>

              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {goal.weeklyTarget}h/week
              </span>
            </div>
          </div>

          {goal.tags && goal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
              {goal.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={`${tag}-${index}`}
                  variant="secondary"
                  className="text-[10px] sm:text-xs"
                >
                  {tag}
                </Badge>
              ))}

              {goal.tags.length > 3 && (
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  +{goal.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm min-w-0">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span
                  className={
                    daysLeft < 0
                      ? 'text-red-600 dark:text-red-400 font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                  }
                >
                  {daysLeft < 0
                    ? `${Math.abs(daysLeft)}d overdue`
                    : `${daysLeft}d left`}
                </span>
              </div>

              {goal.streak > 0 && (
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-gray-500 dark:text-gray-400">
                    {goal.streak}d
                  </span>
                </div>
              )}

              <div className="hidden xs:flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="text-gray-500 dark:text-gray-400">
                  {goal.milestones?.filter((m) => m.completed).length ?? 0}/
                  {goal.milestones?.length ?? 0}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedGoal(goal)}
              className="gap-1 text-xs h-8 -mr-1"
            >
              Details
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  /* ==========================================================
     LIST VIEW
     ========================================================== */

  const renderListView = () => (
    <div className="space-y-2 sm:space-y-3">
      <AnimatePresence>
        {filteredGoals.map((goal, index) => {
          const daysLeft = getDaysUntilDeadline(goal.targetDate)
          const effectiveStatus = getEffectiveStatus(goal)

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-1 self-stretch rounded-full flex-shrink-0"
                  style={{ backgroundColor: goal.color }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-semibold dark:text-gray-200 text-sm sm:text-base line-clamp-1">
                      {goal.title}
                    </h3>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedGoal(goal)}
                      className="h-7 px-2 -mr-1 flex-shrink-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <Badge
                      className={`text-[10px] ${getPriorityColor(goal.priority)}`}
                    >
                      {goal.priority}
                    </Badge>

                    <Badge
                      className={`text-[10px] ${getStatusColor(effectiveStatus)}`}
                    >
                      {effectiveStatus.replace('_', ' ')}
                    </Badge>

                    {goal.streak > 0 && (
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {goal.streak}
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-1 mb-2">
                    {goal.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {goal.progress}%
                    </span>

                    <span
                      className={`flex items-center gap-1 ${
                        daysLeft < 0
                          ? 'text-red-600 dark:text-red-400'
                          : ''
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      {daysLeft < 0
                        ? `${Math.abs(daysLeft)}d overdue`
                        : `${daysLeft}d left`}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {goal.completedHours}h
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateProgress(goal.id, 1)}
                      className="gap-1 h-7 text-xs flex-1"
                    >
                      <Clock className="w-3 h-3" />
                      +1h
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedGoal(goal)}
                      className="h-7 text-xs flex-1"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )

  /* ==========================================================
     GRID VIEW
     ========================================================== */

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      <AnimatePresence>
        {filteredGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </AnimatePresence>
    </div>
  )

  /* ==========================================================
     TIMELINE VIEW
     ========================================================== */

  const renderTimelineView = () => {
    const sortedGoals = [...filteredGoals].sort(
      (a, b) =>
        new Date(a.targetDate).getTime() -
        new Date(b.targetDate).getTime(),
    )

    return (
      <div className="relative">
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

        <div className="space-y-4 sm:space-y-6">
          {sortedGoals.map((goal, index) => {
            const daysLeft = getDaysUntilDeadline(goal.targetDate)

            const category = GOAL_CATEGORIES.find(
              (item) => item.id === goal.category,
            )

            const Icon = category?.icon ?? Target

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12 sm:pl-20"
              >
                <div
                  className="absolute left-2 sm:left-6 top-5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 border-white dark:border-gray-900"
                  style={{ backgroundColor: goal.color }}
                />

                <div className="absolute left-0 top-4 text-[10px] sm:text-sm font-medium text-gray-500 dark:text-gray-400 w-10 sm:w-16 text-right">
                  {new Date(goal.targetDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>

                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="pb-3 p-3 sm:p-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div
                          className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                            category?.bgColor ?? 'bg-gray-100 dark:bg-gray-700'
                          }`}
                        >
                          <Icon
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            style={{ color: goal.color }}
                          />
                        </div>

                        <div className="min-w-0">
                          <CardTitle className="text-sm sm:text-lg dark:text-gray-200 line-clamp-1">
                            {goal.title}
                          </CardTitle>

                          <CardDescription className="mt-1 text-xs sm:text-sm line-clamp-2">
                            {goal.description}
                          </CardDescription>
                        </div>
                      </div>

                      <Badge
                        className={`text-[10px] sm:text-xs flex-shrink-0 ${getStatusColor(goal.status)}`}
                      >
                        {goal.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Progress value={goal.progress} className="h-2 flex-1" />

                        <span className="text-xs sm:text-sm font-medium dark:text-gray-300">
                          {goal.progress}%
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-sm">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          {goal.completedHours}/{goal.totalHours}h
                        </span>

                        <span
                          className={`flex items-center gap-1 ${
                            daysLeft < 0
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {daysLeft < 0
                            ? `${Math.abs(daysLeft)}d overdue`
                            : `${daysLeft}d left`}
                        </span>

                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Flame
                            className={`w-3.5 h-3.5 ${
                              goal.streak > 0 ? 'text-orange-500' : ''
                            }`}
                          />
                          {goal.streak}d
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t dark:border-gray-700 p-3 sm:p-6 sm:pt-3">
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex gap-1.5 flex-wrap min-w-0">
                        {goal.tags?.slice(0, 2).map((tag, tagIndex) => (
                          <Badge
                            key={`${tag}-${tagIndex}`}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedGoal(goal)}
                        className="gap-1 text-xs h-8 flex-shrink-0 -mr-2"
                      >
                        View
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  const hasNoGoals = !Array.isArray(goals) || goals.length === 0

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={darkMode ? 'dark' : 'light'}
        toastOptions={{
          style: {
            background: darkMode ? '#1f2937' : '#ffffff',
            color: darkMode ? '#f3f4f6' : '#111827',
            border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
          },
        }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 space-y-3 sm:space-y-6">
          {/* ==================================================
              VERIFICATION WARNING STRIP
          ================================================== */}

          {user && !isVerified && showVerifyBanner && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 rounded-xl border border-amber-300/70 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/50 shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-100">
                  <span className="font-semibold">
                    Account not verified.
                  </span>{' '}
                  Verify your email to unlock everything.
                </p>
              </div>

              <Button
                size="sm"
                onClick={handleVerifyEmail}
                disabled={isResendingVerification}
                className="bg-amber-600 hover:bg-amber-700 text-white h-7 px-2.5 text-xs flex-shrink-0"
              >
                {isResendingVerification ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <span>Verify</span>
                )}
              </Button>

              <button
                onClick={() => setShowVerifyBanner(false)}
                className="p-1 text-amber-700/70 hover:text-amber-900 dark:text-amber-300/70 flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Goals
                  </h1>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
                  >
                    {darkMode ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Track your progress and achieve your targets
                </p>
              </div>

              {/* User chip — hidden on very small screens */}
              {user && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </div>

                  <div className="hidden md:block">
                    <p className="text-sm font-medium dark:text-gray-200">
                      {user.name || user.email.split('@')[0]}
                    </p>

                    {isVerified ? (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleVerifyEmail}
                        className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 hover:underline"
                      >
                        <ShieldAlert className="w-3 h-3" />
                        Not verified
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions row — full-width on mobile */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowForm(true)}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1 sm:flex-none"
              >
                <Plus className="w-4 h-4" />
                New Goal
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Progress
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* ==================================================
              STATS
          ================================================== */}

          {!hasNoGoals && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
              {[
                {
                  label: 'Total',
                  fullLabel: 'Total Goals',
                  value: stats?.total ?? 0,
                  icon: Target,
                  iconColor: 'text-blue-600 dark:text-blue-400',
                  bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                  change: stats ? `+${stats.active} active` : '',
                },
                {
                  label: 'Done',
                  fullLabel: 'Completed',
                  value: stats?.completed ?? 0,
                  icon: CheckCircle2,
                  iconColor: 'text-green-600 dark:text-green-400',
                  bgColor: 'bg-green-50 dark:bg-green-900/20',
                  change: stats
                    ? `${(
                        ((stats.completed / stats.total) * 100) ||
                        0
                      ).toFixed(0)}%`
                    : '',
                },
                {
                  label: 'Active',
                  fullLabel: 'In Progress',
                  value: stats?.active ?? 0,
                  icon: TrendingUp,
                  iconColor: 'text-purple-600 dark:text-purple-400',
                  bgColor: 'bg-purple-50 dark:bg-purple-900/20',
                  change: 'active',
                },
                {
                  label: 'Delayed',
                  fullLabel: 'Delayed',
                  value: stats?.delayed ?? 0,
                  icon: AlertCircle,
                  iconColor: 'text-orange-600 dark:text-orange-400',
                  bgColor: 'bg-orange-50 dark:bg-orange-900/20',
                  change: stats?.delayed ? 'attention' : '',
                },
                {
                  label: 'Hours',
                  fullLabel: 'Total Hours',
                  value: stats?.totalHours ?? 0,
                  icon: Clock,
                  iconColor: 'text-indigo-600 dark:text-indigo-400',
                  bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
                  change: `${stats?.completedHours ?? 0}h done`,
                },
                {
                  label: 'Streak',
                  fullLabel: 'Best Streak',
                  value: `${stats?.streaks?.longest ?? 0}d`,
                  icon: Flame,
                  iconColor: 'text-red-600 dark:text-red-400',
                  bgColor: 'bg-red-50 dark:bg-red-900/20',
                  change: stats?.streaks?.current
                    ? `${stats.streaks.current}d now`
                    : '',
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-2.5 sm:gap-4">
                    <div
                      className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} flex-shrink-0`}
                    >
                      <stat.icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.iconColor}`}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stat.value}
                      </div>

                      <div className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        <span className="sm:hidden">{stat.label}</span>
                        <span className="hidden sm:inline">
                          {stat.fullLabel}
                        </span>
                      </div>

                      {stat.change && (
                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-0.5 truncate">
                          {stat.change}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ==================================================
              DEDICATED VERIFY CARD
          ================================================== */}

          {user && !isVerified && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-amber-300/70 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-950/30">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                          Verify your account to unlock more
                        </h3>

                        <p className="text-xs text-amber-800 dark:text-amber-200/90 mt-0.5">
                          Verified users get messaging, connections, and full
                          profile visibility.
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={handleVerifyEmail}
                      disabled={isResendingVerification}
                      className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto"
                    >
                      {isResendingVerification ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                          Send Verification
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ==================================================
              OVERALL PROGRESS
          ================================================== */}

          {!hasNoGoals && stats && (
            <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5" />

              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-1 text-sm sm:text-base">
                      Overall Progress
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Completed {stats.completedHours ?? 0} of{' '}
                      {stats.totalHours ?? 0} hours
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {stats.averageProgress?.toFixed(0) ?? 0}%
                      </div>

                      <div className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400">
                        Average
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refresh()}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="hidden sm:inline">Refresh</span>
                    </Button>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <Progress value={stats.averageProgress ?? 0} className="h-2 sm:h-3" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-6">
                  <div className="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-[10px] sm:text-sm text-blue-600 dark:text-blue-400 mb-1">
                      Upcoming
                    </div>

                    <div className="text-lg sm:text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {stats.upcomingDeadlines ?? 0}
                    </div>

                    <div className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                      within 30 days
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-[10px] sm:text-sm text-orange-600 dark:text-orange-400 mb-1">
                      High Priority
                    </div>

                    <div className="text-lg sm:text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {stats.highPriority ?? 0}
                    </div>

                    <div className="text-[10px] sm:text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                      need attention
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-[10px] sm:text-sm text-green-600 dark:text-green-400 mb-1">
                      Completion
                    </div>

                    <div className="text-lg sm:text-2xl font-bold text-green-700 dark:text-green-300">
                      {stats.total
                        ? ((stats.completed / stats.total) * 100).toFixed(0)
                        : 0}
                      %
                    </div>

                    <div className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 mt-0.5">
                      of all goals
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-[10px] sm:text-sm text-purple-600 dark:text-purple-400 mb-1">
                      Streak
                    </div>

                    <div className="text-lg sm:text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {stats.streaks?.current ?? 0}d
                    </div>

                    <div className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                      keep it up! 🔥
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ==================================================
              SEARCH & FILTERS
          ================================================== */}

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-3 sm:p-6">
              {/* Search row */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <Input
                  placeholder="Search goals..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="pl-9 dark:bg-gray-700 dark:border-gray-600 h-10"
                />
              </div>

              {/* Sort + View row */}
              <div className="flex items-center gap-2 mb-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="flex-1 sm:w-40 sm:flex-none dark:bg-gray-700 dark:border-gray-600 h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="created">Created Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="streak">Streak</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg flex-shrink-0">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('grid')}
                    size="sm"
                    className="h-8 w-8"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>

                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('list')}
                    size="sm"
                    className="h-8 w-8"
                  >
                    <List className="w-4 h-4" />
                  </Button>

                  <Button
                    variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('timeline')}
                    size="sm"
                    className="h-8 w-8"
                  >
                    <CalendarDays className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Filter chips — horizontal scroll on mobile */}
              <div className="flex items-center gap-2 overflow-x-auto -mx-3 px-3 pb-1 scrollbar-hide">
                <FilterChip
                  active={filter === 'all'}
                  onClick={() => setFilter('all')}
                  label="All"
                  count={Array.isArray(goals) ? goals.length : 0}
                />

                <FilterChip
                  active={filter === 'active'}
                  onClick={() => setFilter('active')}
                  label="Active"
                  color="green"
                  count={
                    Array.isArray(goals)
                      ? goals.filter((goal) => goal.status === 'IN_PROGRESS')
                          .length
                      : 0
                  }
                />

                <FilterChip
                  active={filter === 'completed'}
                  onClick={() => setFilter('completed')}
                  label="Completed"
                  color="purple"
                  count={
                    Array.isArray(goals)
                      ? goals.filter((goal) => goal.status === 'COMPLETED')
                          .length
                      : 0
                  }
                />

                <FilterChip
                  active={filter === 'delayed'}
                  onClick={() => setFilter('delayed')}
                  label="Delayed"
                  color="orange"
                  count={
                    Array.isArray(goals)
                      ? goals.filter(
                          (goal) => getEffectiveStatus(goal) === 'DELAYED',
                        ).length
                      : 0
                  }
                />

                <FilterChip
                  active={filter === 'not_started'}
                  onClick={() => setFilter('not_started')}
                  label="Not Started"
                  color="gray"
                  count={
                    Array.isArray(goals)
                      ? goals.filter((goal) => goal.status === 'NOT_STARTED')
                          .length
                      : 0
                  }
                />

                <FilterChip
                  active={filter === 'short'}
                  onClick={() => setFilter('short')}
                  label="Short Term"
                  color="yellow"
                />

                <FilterChip
                  active={filter === 'long'}
                  onClick={() => setFilter('long')}
                  label="Long Term"
                  color="indigo"
                />

                <FilterChip
                  active={filter === 'high'}
                  onClick={() => setFilter('high')}
                  label="High Priority"
                  color="red"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 flex-shrink-0 rounded-full h-9"
                    >
                      <Filter className="w-4 h-4" />
                      Categories
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" className="w-56">
                    {GOAL_CATEGORIES.map((category) => {
                      const Icon = category.icon
                      const count = Array.isArray(goals)
                        ? goals.filter((goal) => goal.category === category.id)
                            .length
                        : 0

                      return (
                        <DropdownMenuItem
                          key={category.id}
                          onClick={() => setFilter(category.id.toLowerCase())}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              className="w-4 h-4"
                              style={{ color: category.color }}
                            />
                            <span>{category.label}</span>
                          </div>

                          <Badge variant="outline" className="ml-auto">
                            {count}
                          </Badge>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* ==================================================
              GOALS DISPLAY
          ================================================== */}

          {filteredGoals.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
              </div>

              <h3 className="text-lg sm:text-xl font-semibold dark:text-gray-200 mb-2 px-4">
                {searchQuery ? 'No goals found' : 'No goals yet'}
              </h3>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto px-4">
                {searchQuery
                  ? `No goals matching "${searchQuery}"`
                  : filter !== 'all'
                    ? `No ${filter} goals found`
                    : 'Create your first goal to start tracking your progress'}
              </p>

              <Button
                onClick={() => setShowForm(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {searchQuery || filter !== 'all'
                  ? 'Create New Goal'
                  : 'Create Your First Goal'}
              </Button>
            </div>
          ) : (
            <div>
              {viewMode === 'grid' && renderGridView()}
              {viewMode === 'list' && renderListView()}
              {viewMode === 'timeline' && renderTimelineView()}
            </div>
          )}

          {/* ==================================================
              CATEGORY DISTRIBUTION
          ================================================== */}

          {!hasNoGoals && Array.isArray(goals) && goals.length > 0 && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="dark:text-gray-200 text-base sm:text-lg">
                  Goals by Category
                </CardTitle>

                <CardDescription className="dark:text-gray-400 text-xs sm:text-sm">
                  Distribution across different areas
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                  {GOAL_CATEGORIES.map((category) => {
                    const Icon = category.icon
                    const count = goals.filter(
                      (goal) => goal.category === category.id,
                    ).length
                    const progress =
                      goals.length > 0 ? (count / goals.length) * 100 : 0

                    if (count === 0) return null

                    return (
                      <div
                        key={category.id}
                        className="p-3 sm:p-4 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                          <div
                            className={`p-2 sm:p-2.5 rounded-lg ${category.bgColor} flex-shrink-0`}
                          >
                            <Icon
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              style={{ color: category.color }}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="text-lg sm:text-2xl font-bold dark:text-gray-100">
                              {count}
                            </div>

                            <div className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                              {category.label}
                            </div>
                          </div>
                        </div>

                        <Progress
                          value={progress}
                          className="h-1.5"
                          style={{
                            backgroundColor: `${category.color}20`,
                          }}
                        />

                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-1.5 sm:mt-2">
                          {((count / goals.length) * 100).toFixed(0)}% of goals
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ====================================================
            GOAL DETAILS MODAL — Full-screen sheet on mobile
        ==================================================== */}

        <Dialog
          open={!!selectedGoal}
          onOpenChange={() => setSelectedGoal(null)}
        >
          <DialogContent
            className="
              bg-white dark:bg-gray-800
              w-screen h-[100dvh] max-w-none rounded-none
              sm:w-auto sm:h-auto sm:max-w-2xl sm:rounded-lg
              sm:max-h-[90vh]
              p-0 flex flex-col
              [&>button]:hidden
            "
          >
            {selectedGoal && (
              <>
                <DialogHeader className="flex-shrink-0 px-4 sm:px-6 pt-4 pb-3 border-b dark:border-gray-700">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-1 h-6 rounded-full flex-shrink-0"
                        style={{ backgroundColor: selectedGoal.color }}
                      />
                      <DialogTitle className="text-base sm:text-xl dark:text-gray-100 truncate">
                        {selectedGoal.title}
                      </DialogTitle>
                    </div>

                    <button
                      onClick={() => setSelectedGoal(null)}
                      className="p-2 -mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <DialogDescription className="dark:text-gray-400 text-xs sm:text-sm line-clamp-2">
                    {selectedGoal.description}
                  </DialogDescription>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <Badge
                      className={`text-[10px] sm:text-xs ${getPriorityColor(selectedGoal.priority)}`}
                    >
                      {selectedGoal.priority}
                    </Badge>

                    <Badge
                      className={`text-[10px] sm:text-xs ${getStatusColor(getEffectiveStatus(selectedGoal))}`}
                    >
                      {getEffectiveStatus(selectedGoal).replace('_', ' ')}
                    </Badge>

                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      {selectedGoal.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">
                  {/* PROGRESS */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium dark:text-gray-300">
                          Overall Progress
                        </span>
                        <span className="text-lg font-bold dark:text-gray-100">
                          {selectedGoal.progress}%
                        </span>
                      </div>

                      <Progress value={selectedGoal.progress} className="h-2.5" />

                      <div className="flex items-center justify-between text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {selectedGoal.completedHours}/{selectedGoal.totalHours} hours
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          {selectedGoal.weeklyTarget}h/week
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateProgress(selectedGoal.id, 1)}
                        className="gap-2 text-xs sm:text-sm"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Log 1 Hour
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleUpdateProgress(selectedGoal.id, 2)}
                        className="gap-2 text-xs sm:text-sm"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Log 2 Hours
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => markGoalAsCompleted(selectedGoal.id)}
                        disabled={selectedGoal.status === 'COMPLETED'}
                        className="gap-2 col-span-2 text-xs sm:text-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        Mark as Completed
                      </Button>
                    </div>
                  </div>

                  {/* MILESTONES */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold dark:text-gray-200 flex items-center gap-2 text-sm sm:text-base">
                        <Target className="w-4 h-4" />
                        Milestones
                        <Badge variant="outline" className="ml-1 text-[10px] sm:text-xs">
                          {selectedGoal.milestones?.filter((m) => m.completed)
                            .length ?? 0}
                          /{selectedGoal.milestones?.length ?? 0}
                        </Badge>
                      </h4>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowMilestoneForm(true)}
                        className="gap-1.5 text-xs h-8"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </Button>
                    </div>

                    {selectedGoal.milestones &&
                    selectedGoal.milestones.length > 0 ? (
                      <div className="space-y-2">
                        {selectedGoal.milestones.map((milestone) => {
                          const daysLeft = getDaysUntilDeadline(
                            milestone.targetDate,
                          )

                          return (
                            <div
                              key={milestone.id}
                              className="p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <div className="flex items-start gap-2.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleMilestone(
                                      selectedGoal.id,
                                      milestone.id,
                                    )
                                  }
                                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                                    milestone.completed
                                      ? 'bg-green-500 text-white'
                                      : 'border-2 border-gray-300 dark:border-gray-600 hover:border-green-500'
                                  }`}
                                >
                                  {milestone.completed && (
                                    <CheckCircle2 className="w-3 h-3" />
                                  )}
                                </button>

                                <div className="flex-1 min-w-0">
                                  <h5
                                    className={`font-medium text-sm ${
                                      milestone.completed
                                        ? 'line-through text-gray-500 dark:text-gray-500'
                                        : 'dark:text-gray-200'
                                    }`}
                                  >
                                    {milestone.title}
                                  </h5>

                                  {milestone.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                      {milestone.description}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] sm:text-xs">
                                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(
                                        milestone.targetDate,
                                      ).toLocaleDateString()}
                                    </span>

                                    {!milestone.completed && (
                                      <span
                                        className={`flex items-center gap-1 ${
                                          daysLeft < 0
                                            ? 'text-red-600 dark:text-red-400'
                                            : daysLeft < 7
                                              ? 'text-orange-600 dark:text-orange-400'
                                              : 'text-gray-500 dark:text-gray-500'
                                        }`}
                                      >
                                        {daysLeft < 0
                                          ? `${Math.abs(daysLeft)}d overdue`
                                          : `${daysLeft}d left`}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 flex-shrink-0"
                                    >
                                      <MoreVertical className="w-3.5 h-3.5" />
                                    </Button>
                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateMilestone(
                                          selectedGoal.id,
                                          milestone.id,
                                          {
                                            completed: !milestone.completed,
                                            progress: !milestone.completed
                                              ? 100
                                              : 0,
                                          },
                                        )
                                      }
                                    >
                                      {milestone.completed
                                        ? '🔄 Mark Incomplete'
                                        : '✅ Mark Complete'}
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                      onClick={() =>
                                        deleteMilestone(
                                          selectedGoal.id,
                                          milestone.id,
                                        )
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-6 border border-dashed dark:border-gray-700 rounded-lg text-center">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Target className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          No milestones yet
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                          Break down your goal into smaller steps
                        </p>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowMilestoneForm(true)}
                          className="gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add First Milestone
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* META */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Category
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        {getCategoryIcon(selectedGoal.category)}
                        <span className="font-medium dark:text-gray-300 truncate">
                          {
                            GOAL_CATEGORIES.find(
                              (c) => c.id === selectedGoal.category,
                            )?.label
                          }
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Created
                      </div>

                      <div className="font-medium dark:text-gray-300 text-sm">
                        {new Date(selectedGoal.createdAt).toLocaleDateString(
                          'en-US',
                          { month: 'short', day: 'numeric', year: 'numeric' },
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Target
                      </div>

                      <div className="font-medium dark:text-gray-300 text-sm">
                        {new Date(selectedGoal.targetDate).toLocaleDateString(
                          'en-US',
                          { month: 'short', day: 'numeric', year: 'numeric' },
                        )}
                      </div>

                      <div className="text-[10px] sm:text-xs mt-0.5">
                        {getDaysUntilDeadline(selectedGoal.targetDate) < 0 ? (
                          <span className="text-red-600 dark:text-red-400">
                            {Math.abs(
                              getDaysUntilDeadline(selectedGoal.targetDate),
                            )}{' '}
                            days overdue
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-500">
                            {getDaysUntilDeadline(selectedGoal.targetDate)}d left
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Streak
                      </div>

                      <div className="flex items-center gap-2">
                        <Flame
                          className={`w-4 h-4 ${
                            selectedGoal.streak > 0
                              ? 'text-orange-500'
                              : 'text-gray-400'
                          }`}
                        />
                        <span className="font-medium dark:text-gray-300 text-sm">
                          {selectedGoal.streak}d
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* TAGS */}
                  {selectedGoal.tags && selectedGoal.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold dark:text-gray-200 mb-2 flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4" />
                        Tags
                      </h4>

                      <div className="flex flex-wrap gap-1.5">
                        {selectedGoal.tags.map((tag, index) => (
                          <Badge
                            key={`${tag}-${index}`}
                            variant="secondary"
                            className="px-2.5 py-1 text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PUBLIC */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="min-w-0">
                      <div className="font-medium dark:text-gray-300 flex items-center gap-2 text-sm">
                        {selectedGoal.isPublic ? (
                          <>
                            <Eye className="w-4 h-4" />
                            Public Goal
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Private Goal
                          </>
                        )}
                      </div>

                      <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {selectedGoal.isPublic
                          ? 'Visible to others'
                          : 'Only visible to you'}
                      </div>
                    </div>

                    <Switch
                      checked={selectedGoal.isPublic}
                      onCheckedChange={(checked) =>
                        handleUpdateGoal(selectedGoal.id, { isPublic: checked })
                      }
                    />
                  </div>
                </div>

                <DialogFooter className="flex-shrink-0 px-4 sm:px-6 py-3 border-t dark:border-gray-700 gap-2 flex-col-reverse sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedGoal(null)}
                    className="dark:border-gray-700 w-full sm:w-auto"
                  >
                    Close
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingGoal(selectedGoal)
                      setSelectedGoal(null)
                    }}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>

                  <Button
                    onClick={() => markGoalAsCompleted(selectedGoal.id)}
                    disabled={selectedGoal.status === 'COMPLETED'}
                    className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ====================================================
            CREATE / EDIT GOAL MODAL — Full-screen sheet on mobile
        ==================================================== */}

        <Dialog
          open={showForm || !!editingGoal}
          onOpenChange={() => {
            setShowForm(false)
            setEditingGoal(null)
          }}
        >
          <DialogContent
            className="
              bg-white dark:bg-gray-800
              w-screen h-[100dvh] max-w-none rounded-none
              sm:w-auto sm:h-auto sm:max-w-lg sm:rounded-lg
              sm:max-h-[90vh]
              p-0 flex flex-col
              [&>button]:hidden
            "
          >
            <DialogHeader className="flex-shrink-0 px-4 sm:px-6 pt-4 pb-3 border-b dark:border-gray-700">
              <div className="flex items-center justify-between gap-2">
                <DialogTitle className="text-base sm:text-xl dark:text-gray-100">
                  {editingGoal ? '✏️ Edit Goal' : '🎯 New Goal'}
                </DialogTitle>

                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingGoal(null)
                  }}
                  className="p-2 -mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <DialogDescription className="dark:text-gray-400 text-xs sm:text-sm">
                {editingGoal
                  ? 'Update your goal details and targets'
                  : 'Set a new goal with milestones and track your progress'}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              {/* TITLE */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm">
                  Goal Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Master DSA"
                  value={editingGoal ? editingGoal.title : newGoal.title}
                  onChange={(event) =>
                    editingGoal
                      ? setEditingGoal({
                          ...editingGoal,
                          title: event.target.value,
                        })
                      : setNewGoal({ ...newGoal, title: event.target.value })
                  }
                  className="dark:bg-gray-700 dark:border-gray-600 h-11"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-sm">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal..."
                  value={
                    editingGoal ? editingGoal.description : newGoal.description
                  }
                  onChange={(event) =>
                    editingGoal
                      ? setEditingGoal({
                          ...editingGoal,
                          description: event.target.value,
                        })
                      : setNewGoal({
                          ...newGoal,
                          description: event.target.value,
                        })
                  }
                  className="dark:bg-gray-700 dark:border-gray-600 resize-none"
                  rows={3}
                />
              </div>

              {/* CATEGORY + PRIORITY */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm">Category *</Label>
                  <Select
                    value={editingGoal ? editingGoal.category : newGoal.category}
                    onValueChange={(value) => {
                      const category = GOAL_CATEGORIES.find(
                        (item) => item.id === value,
                      )?.id
                      if (!category) return

                      if (editingGoal) {
                        setEditingGoal({
                          ...editingGoal,
                          category: category as Goal['category'],
                        })
                      } else {
                        setNewGoal({
                          ...newGoal,
                          category: category as Goal['category'],
                        })
                      }
                    }}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GOAL_CATEGORIES.map((category) => {
                        const Icon = category.icon
                        return (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <Icon
                                className="w-4 h-4"
                                style={{ color: category.color }}
                              />
                              {category.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">Priority *</Label>
                  <Select
                    value={editingGoal ? editingGoal.priority : newGoal.priority}
                    onValueChange={(value) => {
                      if (
                        value !== 'LOW' &&
                        value !== 'MEDIUM' &&
                        value !== 'HIGH' &&
                        value !== 'CRITICAL'
                      )
                        return

                      if (editingGoal) {
                        setEditingGoal({ ...editingGoal, priority: value })
                      } else {
                        setNewGoal({ ...newGoal, priority: value })
                      }
                    }}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">🟢 Low</SelectItem>
                      <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                      <SelectItem value="HIGH">🟠 High</SelectItem>
                      <SelectItem value="CRITICAL">🔴 Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* TYPE + TARGET DATE */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm">Type *</Label>
                  <Select
                    value={editingGoal ? editingGoal.type : newGoal.type}
                    onValueChange={(value) => {
                      if (value !== 'SHORT_TERM' && value !== 'LONG_TERM')
                        return

                      if (editingGoal) {
                        setEditingGoal({ ...editingGoal, type: value })
                      } else {
                        setNewGoal({ ...newGoal, type: value })
                      }
                    }}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHORT_TERM">
                        ⏱️ Short Term
                      </SelectItem>
                      <SelectItem value="LONG_TERM">📅 Long Term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">Target Date *</Label>
                  <Input
                    type="date"
                    value={
                      editingGoal
                        ? formatDateForInput(editingGoal.targetDate)
                        : formatDateForInput(newGoal.targetDate)
                    }
                    onChange={(event) => {
                      const dateString = event.target.value
                      if (!dateString) return

                      const date = new Date(`${dateString}T00:00:00.000Z`)
                      if (Number.isNaN(date.getTime())) return

                      if (editingGoal) {
                        setEditingGoal({ ...editingGoal, targetDate: date })
                      } else {
                        setNewGoal({ ...newGoal, targetDate: date })
                      }
                    }}
                    className="dark:bg-gray-700 dark:border-gray-600 h-11"
                  />
                </div>
              </div>

              {/* HOURS */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm">Total Hours *</Label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="100"
                    value={
                      editingGoal ? editingGoal.totalHours : newGoal.totalHours
                    }
                    onChange={(event) => {
                      const value = Number.parseInt(event.target.value, 10)
                      if (Number.isNaN(value)) return

                      if (editingGoal) {
                        setEditingGoal({ ...editingGoal, totalHours: value })
                      } else {
                        setNewGoal({ ...newGoal, totalHours: value })
                      }
                    }}
                    className="dark:bg-gray-700 dark:border-gray-600 h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">Weekly Target</Label>
                  <Input
                    type="number"
                    min="1"
                    max="40"
                    placeholder="5"
                    value={
                      editingGoal
                        ? editingGoal.weeklyTarget
                        : newGoal.weeklyTarget
                    }
                    onChange={(event) => {
                      const value = Number.parseInt(event.target.value, 10)
                      if (Number.isNaN(value)) return

                      if (editingGoal) {
                        setEditingGoal({ ...editingGoal, weeklyTarget: value })
                      } else {
                        setNewGoal({ ...newGoal, weeklyTarget: value })
                      }
                    }}
                    className="dark:bg-gray-700 dark:border-gray-600 h-11"
                  />
                </div>
              </div>

              {/* COLOR */}
              <div className="space-y-2">
                <Label className="text-sm">Color Theme</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    '#3B82F6',
                    '#10B981',
                    '#EF4444',
                    '#F59E0B',
                    '#8B5CF6',
                    '#EC4899',
                    '#6366F1',
                    '#F97316',
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        editingGoal
                          ? setEditingGoal({ ...editingGoal, color })
                          : setNewGoal({ ...newGoal, color })
                      }
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
                        (editingGoal ? editingGoal.color : newGoal.color) ===
                        color
                          ? 'border-gray-900 dark:border-white scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* TAGS */}
              <div className="space-y-1.5">
                <Label className="text-sm">Tags (comma separated)</Label>
                <Input
                  placeholder="e.g., DSA, Programming"
                  value={
                    editingGoal
                      ? editingGoal.tags?.join(', ') ?? ''
                      : newGoal.tags.join(', ')
                  }
                  onChange={(event) => {
                    const tags = event.target.value
                      .split(',')
                      .map((tag: string) => tag.trim())
                      .filter((tag: string) => tag.length > 0)

                    if (editingGoal) {
                      setEditingGoal({ ...editingGoal, tags })
                    } else {
                      setNewGoal({ ...newGoal, tags })
                    }
                  }}
                  className="dark:bg-gray-700 dark:border-gray-600 h-11"
                />
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Press comma to separate tags
                </p>
              </div>

              {/* PUBLIC */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="min-w-0">
                  <div className="font-medium dark:text-gray-300 text-sm">
                    Make Goal Public
                  </div>
                  <div className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Others can view your goal
                  </div>
                </div>

                <Switch
                  checked={
                    editingGoal ? editingGoal.isPublic : newGoal.isPublic
                  }
                  onCheckedChange={(checked) =>
                    editingGoal
                      ? setEditingGoal({ ...editingGoal, isPublic: checked })
                      : setNewGoal({ ...newGoal, isPublic: checked })
                  }
                />
              </div>

              {/* EDIT PROGRESS */}
              {editingGoal && (
                <div className="space-y-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium dark:text-gray-200 flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    Update Progress
                  </h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">
                        Progress ({editingGoal.progress}%)
                      </Label>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {editingGoal.completedHours}/{editingGoal.totalHours}h
                      </span>
                    </div>

                    <Slider
                      value={[editingGoal.progress]}
                      onValueChange={(values) => {
                        const value = values[0]
                        if (value === undefined) return

                        const newCompletedHours = Math.round(
                          (value / 100) * editingGoal.totalHours,
                        )

                        setEditingGoal({
                          ...editingGoal,
                          progress: value,
                          completedHours: newCompletedHours,
                        })
                      }}
                      max={100}
                      step={1}
                      className="py-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newProgress = Math.min(
                          100,
                          editingGoal.progress + 10,
                        )
                        const newHours = Math.round(
                          (newProgress / 100) * editingGoal.totalHours,
                        )
                        setEditingGoal({
                          ...editingGoal,
                          progress: newProgress,
                          completedHours: newHours,
                        })
                      }}
                    >
                      +10%
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newHours = Math.min(
                          editingGoal.totalHours,
                          editingGoal.completedHours + 5,
                        )
                        const newProgress = Math.round(
                          (newHours / editingGoal.totalHours) * 100,
                        )
                        setEditingGoal({
                          ...editingGoal,
                          progress: newProgress,
                          completedHours: newHours,
                        })
                      }}
                    >
                      +5 Hours
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex-shrink-0 px-4 sm:px-6 py-3 border-t dark:border-gray-700 gap-2 flex-col-reverse sm:flex-row">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingGoal(null)
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  if (editingGoal) {
                    void handleUpdateGoal(editingGoal.id, editingGoal)
                    setEditingGoal(null)
                  } else {
                    void handleCreateGoal()
                  }
                }}
                disabled={!editingGoal && !newGoal.title.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 w-full sm:w-auto"
              >
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ====================================================
            MILESTONE MODAL — Bottom sheet on mobile
        ==================================================== */}

        <Dialog open={showMilestoneForm} onOpenChange={setShowMilestoneForm}>
          <DialogContent
            className="
              bg-white dark:bg-gray-800
              w-full max-w-none rounded-t-2xl rounded-b-none
              sm:w-auto sm:max-w-md sm:rounded-lg
              max-h-[90vh]
              p-0 flex flex-col
              fixed bottom-0 left-0 right-0 top-auto
              sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:right-auto
              sm:-translate-x-1/2 sm:-translate-y-1/2
              [&>button]:hidden
            "
          >
            <DialogHeader className="flex-shrink-0 px-4 sm:px-6 pt-3 pb-3 border-b dark:border-gray-700">
              {/* Drag handle for mobile */}
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-2 sm:hidden" />

              <div className="flex items-center justify-between gap-2">
                <DialogTitle className="dark:text-gray-100 flex items-center gap-2 text-base sm:text-lg">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add Milestone
                </DialogTitle>

                <button
                  onClick={() => setShowMilestoneForm(false)}
                  className="p-2 -mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <DialogDescription className="dark:text-gray-400 text-xs sm:text-sm line-clamp-2">
                Add a milestone to "{selectedGoal?.title}"
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="milestone-title" className="text-sm">
                  Title *
                </Label>
                <Input
                  id="milestone-title"
                  placeholder="e.g., Complete Arrays & Strings"
                  value={newMilestone.title}
                  onChange={(event) =>
                    setNewMilestone({
                      ...newMilestone,
                      title: event.target.value,
                    })
                  }
                  className="dark:bg-gray-700 dark:border-gray-600 h-11"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="milestone-description" className="text-sm">
                  Description
                </Label>
                <Textarea
                  id="milestone-description"
                  placeholder="What needs to be accomplished..."
                  value={newMilestone.description}
                  onChange={(event) =>
                    setNewMilestone({
                      ...newMilestone,
                      description: event.target.value,
                    })
                  }
                  className="dark:bg-gray-700 dark:border-gray-600 resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="milestone-date" className="text-sm">
                  Target Date *
                </Label>
                <Input
                  id="milestone-date"
                  type="date"
                  value={formatDateForInput(newMilestone.targetDate)}
                  onChange={(event) => {
                    const dateString = event.target.value
                    if (!dateString) return

                    const date = new Date(`${dateString}T00:00:00.000Z`)
                    if (Number.isNaN(date.getTime())) return

                    setNewMilestone({ ...newMilestone, targetDate: date })
                  }}
                  className="dark:bg-gray-700 dark:border-gray-600 h-11"
                />
              </div>
            </div>

            <DialogFooter className="flex-shrink-0 px-4 sm:px-6 py-3 border-t dark:border-gray-700 gap-2 flex-col-reverse sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setShowMilestoneForm(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                onClick={() => void handleAddMilestone()}
                disabled={!newMilestone.title.trim()}
                className="w-full sm:w-auto"
              >
                Add Milestone
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

// ============================================================
// FILTER CHIP
// ============================================================

function FilterChip({
  active,
  onClick,
  label,
  color = 'blue',
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  color?: string
  count?: number
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white',
    orange: 'bg-orange-500 text-white',
    red: 'bg-red-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    indigo: 'bg-indigo-500 text-white',
    gray: 'bg-gray-500 text-white',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex-shrink-0 whitespace-nowrap ${
        active
          ? colorClasses[color] ??
            'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <span className="flex items-center gap-1.5">
        {label}

        {count !== undefined && (
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              active ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {count}
          </span>
        )}
      </span>
    </button>
  )
}