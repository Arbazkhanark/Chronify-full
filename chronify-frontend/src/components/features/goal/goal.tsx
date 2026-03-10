

// src/app/dashboard/goals/page.tsx
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Target, TrendingUp, Calendar, AlertCircle, Filter, 
  CheckCircle2, Clock, Award, Trophy, Zap, Flame, Star,
  BarChart3, List, Grid, CalendarDays, ChevronRight,
  Edit2, Trash2, MoreVertical, X, Search, Download,
  Share2, RefreshCw, Eye, EyeOff, PieChart, LineChart,
  Target as TargetIcon, Moon, Sun, Book, Briefcase,
  Dumbbell, Heart, Music, Gamepad2, Home, School,
  Building, User, Coffee, Loader2, LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Toaster } from 'sonner'

// Hooks
import { useGoals, Goal, Milestone } from '@/hooks/useGoal'
import { useAuth } from '@/hooks/useAuth'
import { Label } from '@/components/ui/label'

// Categories with icons
const GOAL_CATEGORIES = [
  { id: 'ACADEMIC', label: 'Academic', icon: School, color: '#3B82F6', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'PROFESSIONAL', label: 'Professional', icon: Briefcase, color: '#10B981', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  { id: 'HEALTH', label: 'Health & Fitness', icon: Heart, color: '#EF4444', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  { id: 'PERSONAL', label: 'Personal', icon: User, color: '#8B5CF6', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
  { id: 'SKILL', label: 'Skill Development', icon: Award, color: '#F59E0B', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 'FINANCIAL', label: 'Financial', icon: TrendingUp, color: '#6366F1', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { id: 'SOCIAL', label: 'Social', icon: User, color: '#EC4899', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
  { id: 'CREATIVE', label: 'Creative', icon: Music, color: '#F97316', bgColor: 'bg-orange-50 dark:bg-orange-900/20' }
]

// Helper function to get future date in ISO format
const getFutureDateISO = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

export default function GoalClients() {
  // Auth
  const { user, isAuthenticated, AuthService } = useAuth()
  
  // Goals
  const {
    goals = [],
    loading: goalsLoading,
    error,
    stats,
    fetchGoals,
    createGoal,
    updateGoal,
    updateGoalStatus,
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


  // UI State
  const [darkMode, setDarkMode] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('priority')
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>('grid')
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  // Form State - Always use ISO format dates
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    targetDate: getFutureDateISO(7) // 7 days from now
  })
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'ACADEMIC' as Goal['category'],
    priority: 'MEDIUM' as Goal['priority'],
    type: 'SHORT_TERM' as Goal['type'],
    targetDate: getFutureDateISO(30), // 30 days from now
    totalHours: 50,
    weeklyTarget: 5,
    color: '#3B82F6',
    tags: [] as string[],
    isPublic: true
  })

  // Dark mode
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  // Refresh goals when filter changes
  useEffect(() => {
    const filterMap: Record<string, string> = {
      'active': 'active',
      'completed': 'completed',
      'delayed': 'delayed',
      'not_started': 'not_started',
      'short': 'short',
      'long': 'long',
      'high': 'high',
    }
    
    fetchGoals({
      filter: filterMap[filter] || (GOAL_CATEGORIES.some(c => c.id.toLowerCase() === filter) ? filter : undefined),
      priority: filter === 'high' ? 'high' : undefined,
    })
  }, [filter, fetchGoals])

  // Handle logout
  const handleLogout = async () => {
    await AuthService.logout()
    window.location.href = '/auth/login'
  }

  // ============= GOAL HANDLERS =============

  const handleCreateGoal = async () => {
    if (!newGoal.title.trim()) return

    try {
      const createdGoal = await createGoal(newGoal)
      if (createdGoal) {
        setNewGoal({
          title: '',
          description: '',
          category: 'ACADEMIC',
          priority: 'MEDIUM',
          type: 'SHORT_TERM',
          targetDate: getFutureDateISO(30),
          totalHours: 50,
          weeklyTarget: 5,
          color: '#3B82F6',
          tags: [],
          isPublic: true
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Failed to create goal:', error)
    }
  }

  const handleUpdateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      await updateGoal(goalId, updates)
    } catch (error) {
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
    } catch (error) {
      console.error('Failed to delete goal:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleUpdateProgress = async (goalId: string, hours: number) => {
    try {
      await logProgressHours(goalId, hours)
    } catch (error) {
      console.error('Failed to log progress:', error)
    }
  }

  // ============= MILESTONE HANDLERS =============

  const handleAddMilestone = async () => {
    if (!selectedGoal || !newMilestone.title.trim()) return

    try {
      await addMilestone(selectedGoal.id, {
        ...newMilestone,
        targetDate: new Date(newMilestone.targetDate)
      })
      
      setNewMilestone({
        title: '',
        description: '',
        targetDate: getFutureDateISO(7)
      })
      setShowMilestoneForm(false)
      
      const updatedGoal = goals?.find(g => g.id === selectedGoal.id)
      if (updatedGoal) {
        setSelectedGoal(updatedGoal)
      }
    } catch (error) {
      console.error('Failed to add milestone:', error)
    }
  }

  const handleToggleMilestone = async (goalId: string, milestoneId: string) => {
    try {
      await toggleMilestone(goalId, milestoneId)
      
      if (selectedGoal?.id === goalId) {
        const updatedGoal = goals?.find(g => g.id === goalId)
        if (updatedGoal) {
          setSelectedGoal(updatedGoal)
        }
      }
    } catch (error) {
      console.error('Failed to toggle milestone:', error)
    }
  }

  // ============= FILTERING & SORTING =============

  const filteredGoals = useMemo(() => {
    const goalsArray = Array.isArray(goals) ? goals : []
    
    if (!goalsArray.length) return []
    
    let filtered = [...goalsArray]

    if (filter !== 'all') {
      filtered = filtered.filter(goal => {
        if (filter === 'active' && goal.status !== 'IN_PROGRESS') return false
        if (filter === 'completed' && goal.status !== 'COMPLETED') return false
        if (filter === 'delayed' && getEffectiveStatus(goal) !== 'DELAYED') return false
        if (filter === 'not_started' && goal.status !== 'NOT_STARTED') return false
        if (filter === 'short' && goal.type !== 'SHORT_TERM') return false
        if (filter === 'long' && goal.type !== 'LONG_TERM') return false
        
        const categoryMatch = GOAL_CATEGORIES.find(c => c.id.toLowerCase() === filter)
        if (categoryMatch && goal.category !== categoryMatch.id) return false
        
        return true
      })
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(query) ||
        goal.description.toLowerCase().includes(query) ||
        (goal.tags && goal.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'progress':
          return (b.progress || 0) - (a.progress || 0)
        case 'deadline':
          return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  // ============= UTILITY FUNCTIONS =============

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
      case 'CRITICAL': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'HIGH': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
      case 'MEDIUM': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'LOW': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
    }
  }

  const getStatusColor = (status: Goal['status']) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'IN_PROGRESS': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'DELAYED': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'NOT_STARTED': return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
      case 'FAILED': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    }
  }

  // Format date for input field
  const formatDateForInput = (date: Date | string): string => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return getFutureDateISO(30).split('T')[0];
      }
      return d.toISOString().split('T')[0];
    } catch (error) {
      return getFutureDateISO(30).split('T')[0];
    }
  };

  // ============= LOADING STATE =============

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

  // ============= RENDER VIEWS =============

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const daysLeft = getDaysUntilDeadline(goal.targetDate)
    const category = GOAL_CATEGORIES.find(c => c.id === goal.category)
    const effectiveStatus = getEffectiveStatus(goal)
    const isOverdue = isGoalOverdue(goal)

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <div 
          className="h-2"
          style={{ backgroundColor: goal.color }}
        />
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${category?.bgColor}`}>
                {getCategoryIcon(goal.category)}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(goal.priority)}>
                    {goal.priority}
                  </Badge>
                  <Badge className={getStatusColor(effectiveStatus)}>
                    {effectiveStatus.replace('_', ' ')}
                  </Badge>
                </div>
                {isOverdue && effectiveStatus !== 'DELAYED' && (
                  <Badge variant="outline" className="border-red-200 text-red-600 dark:border-red-800 dark:text-red-400">
                    ⚠️ Overdue
                  </Badge>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
                <DropdownMenuItem onClick={() => handleUpdateProgress(goal.id, 1)}>
                  <Clock className="w-4 h-4 mr-2" />
                  Log 1 Hour
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {goal.status !== 'COMPLETED' && (
                  <DropdownMenuItem onClick={() => markGoalAsCompleted(goal.id)}>
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

          <h3 className="text-lg font-semibold mb-2 dark:text-gray-200 line-clamp-1">
            {goal.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {goal.description}
          </p>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium dark:text-gray-300">Progress</span>
              <span className="text-sm font-bold dark:text-gray-300">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2.5" />
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>{goal.completedHours}/{goal.totalHours} hours</span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {goal.weeklyTarget}h/week
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {goal.tags?.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {goal.tags?.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{goal.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-3 text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={daysLeft < 0 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Flame className={`w-4 h-4 ${goal.streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                      <span className="text-gray-500 dark:text-gray-400">{goal.streak}d</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{goal.streak} day streak</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-gray-500 dark:text-gray-400">
                  {goal.milestones?.filter(m => m.completed).length || 0}/{goal.milestones?.length || 0}
                </span>
              </div>
            </div>

            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setSelectedGoal(goal)}
              className="gap-1"
            >
              Details
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {filteredGoals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </AnimatePresence>
    </div>
  )

  const renderListView = () => (
    <div className="space-y-3">
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
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                    <h3 className="font-semibold dark:text-gray-200">{goal.title}</h3>
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                    <Badge className={getStatusColor(effectiveStatus)}>
                      {effectiveStatus.replace('_', ' ')}
                    </Badge>
                    {goal.streak > 0 && (
                      <Badge variant="outline" className="gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {goal.streak}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-1">
                    {goal.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className="dark:text-gray-300 capitalize">
                        {goal.category.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={daysLeft < 0 ? 'text-red-600 dark:text-red-400' : 'dark:text-gray-300'}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="dark:text-gray-300">{goal.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateProgress(goal.id, 1)}
                    className="gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    +1h
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedGoal(goal)}
                  >
                    View
                  </Button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )

  const renderTimelineView = () => {
    const sortedGoals = [...filteredGoals].sort((a, b) => 
      new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
    )

    return (
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="space-y-6">
          {sortedGoals.map((goal, index) => {
            const daysLeft = getDaysUntilDeadline(goal.targetDate)
            const category = GOAL_CATEGORIES.find(c => c.id === goal.category)
            const Icon = category?.icon || Target

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20"
              >
                <div 
                  className="absolute left-6 top-6 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900"
                  style={{ backgroundColor: goal.color }}
                />
                
                <div className="absolute left-0 top-5 text-sm font-medium text-gray-500 dark:text-gray-400 w-16 text-right">
                  {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>

                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category?.bgColor}`}>
                          <Icon className="w-5 h-5" style={{ color: goal.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-lg dark:text-gray-200">
                            {goal.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {goal.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <Progress value={goal.progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium dark:text-gray-300">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {goal.completedHours}/{goal.totalHours}h
                        </span>
                        <span className={`flex items-center gap-1 ${
                          daysLeft < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          <Calendar className="w-4 h-4" />
                          {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Flame className={`w-4 h-4 ${goal.streak > 0 ? 'text-orange-500' : ''}`} />
                          {goal.streak}d streak
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3 border-t dark:border-gray-700">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex gap-2">
                        {goal.tags?.slice(0, 2).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setSelectedGoal(goal)}
                        className="gap-1"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Goals & Milestones
                  </h1>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="h-9 w-9"
                  >
                    {darkMode ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your progress and achieve your targets
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {user && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium dark:text-gray-200">
                      {user.name || user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.verified ? '✅ Verified' : '🔓 Not verified'}
                    </p>
                  </div>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
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
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                onClick={() => setShowForm(true)}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4" />
                New Goal
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {!hasNoGoals && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { 
                  label: 'Total Goals', 
                  value: stats?.total || 0, 
                  icon: Target,
                  iconColor: 'text-blue-600 dark:text-blue-400',
                  bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                  change: stats ? `+${stats.active} active` : ''
                },
                { 
                  label: 'Completed', 
                  value: stats?.completed || 0, 
                  icon: CheckCircle2,
                  iconColor: 'text-green-600 dark:text-green-400',
                  bgColor: 'bg-green-50 dark:bg-green-900/20',
                  change: stats ? `${((stats.completed / stats.total) * 100 || 0).toFixed(0)}%` : ''
                },
                { 
                  label: 'In Progress', 
                  value: stats?.active || 0, 
                  icon: TrendingUp,
                  iconColor: 'text-purple-600 dark:text-purple-400',
                  bgColor: 'bg-purple-50 dark:bg-purple-900/20',
                  change: 'active'
                },
                { 
                  label: 'Delayed', 
                  value: stats?.delayed || 0, 
                  icon: AlertCircle,
                  iconColor: 'text-orange-600 dark:text-orange-400',
                  bgColor: 'bg-orange-50 dark:bg-orange-900/20',
                  change: stats?.delayed ? 'needs attention' : ''
                },
                { 
                  label: 'Total Hours', 
                  value: stats?.totalHours || 0, 
                  icon: Clock,
                  iconColor: 'text-indigo-600 dark:text-indigo-400',
                  bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
                  change: `${stats?.completedHours || 0}h completed`
                },
                { 
                  label: 'Best Streak', 
                  value: `${stats?.streaks?.longest || 0}d`, 
                  icon: Flame,
                  iconColor: 'text-red-600 dark:text-red-400',
                  bgColor: 'bg-red-50 dark:bg-red-900/20',
                  change: stats?.streaks?.current ? `${stats.streaks.current}d current` : ''
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                      {stat.change && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {stat.change}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Overall Progress Card */}
          {!hasNoGoals && stats && (
            <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2" />
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-200 mb-1">
                      Overall Progress
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You've completed {stats?.completedHours || 0} out of {stats?.totalHours || 0} hours across all goals
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {stats?.averageProgress?.toFixed(0) || 0}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Average Progress
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => refresh()}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Progress value={stats?.averageProgress || 0} className="h-3" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Upcoming Deadlines</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {stats?.upcomingDeadlines || 0}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">within 30 days</div>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-sm text-orange-600 dark:text-orange-400 mb-1">High Priority</div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {stats?.highPriority || 0}
                    </div>
                    <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">need attention</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-sm text-green-600 dark:text-green-400 mb-1">Completion Rate</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {stats?.total ? ((stats.completed / stats.total) * 100).toFixed(0) : 0}%
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">of all goals</div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Current Streak</div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {stats?.streaks?.current || 0}d
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">keep it up! 🔥</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters and Search */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search goals by title, description, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full lg:w-40 dark:bg-gray-700 dark:border-gray-600">
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

                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? "default" : "ghost"}
                      onClick={() => setViewMode('grid')}
                      size="sm"
                      className="h-8 w-8"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? "default" : "ghost"}
                      onClick={() => setViewMode('list')}
                      size="sm"
                      className="h-8 w-8"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'timeline' ? "default" : "ghost"}
                      onClick={() => setViewMode('timeline')}
                      size="sm"
                      className="h-8 w-8"
                    >
                      <CalendarDays className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <FilterChip 
                  active={filter === 'all'} 
                  onClick={() => setFilter('all')}
                  label="All Goals"
                  count={Array.isArray(goals) ? goals.length : 0}
                />
                <FilterChip 
                  active={filter === 'active'} 
                  onClick={() => setFilter('active')}
                  label="Active"
                  color="green"
                  count={Array.isArray(goals) ? goals.filter(g => g.status === 'IN_PROGRESS').length : 0}
                />
                <FilterChip 
                  active={filter === 'completed'} 
                  onClick={() => setFilter('completed')}
                  label="Completed"
                  color="purple"
                  count={Array.isArray(goals) ? goals.filter(g => g.status === 'COMPLETED').length : 0}
                />
                <FilterChip 
                  active={filter === 'delayed'} 
                  onClick={() => setFilter('delayed')}
                  label="Delayed"
                  color="orange"
                  count={Array.isArray(goals) ? goals.filter(g => getEffectiveStatus(g) === 'DELAYED').length : 0}
                />
                <FilterChip 
                  active={filter === 'not_started'} 
                  onClick={() => setFilter('not_started')}
                  label="Not Started"
                  color="gray"
                  count={Array.isArray(goals) ? goals.filter(g => g.status === 'NOT_STARTED').length : 0}
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
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Categories
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {GOAL_CATEGORIES.map(category => {
                      const Icon = category.icon
                      const count = Array.isArray(goals) ? goals.filter(g => g.category === category.id).length : 0
                      return (
                        <DropdownMenuItem 
                          key={category.id}
                          onClick={() => setFilter(category.id.toLowerCase())}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" style={{ color: category.color }} />
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

          {/* Goals Display */}
          {goalsLoading && (!Array.isArray(goals) || goals.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading your goals...</p>
            </div>
          ) : filteredGoals.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold dark:text-gray-200 mb-2">
                {searchQuery ? 'No goals found' : 'No goals yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? `No goals matching "${searchQuery}"`
                  : filter !== 'all'
                  ? `No ${filter} goals found`
                  : 'Create your first goal to start tracking your progress'
                }
              </p>
              <Button 
                onClick={() => setShowForm(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {searchQuery || filter !== 'all' ? 'Create New Goal' : 'Create Your First Goal'}
              </Button>
            </div>
          ) : (
            <div className="mt-6">
              {viewMode === 'grid' && renderGridView()}
              {viewMode === 'list' && renderListView()}
              {viewMode === 'timeline' && renderTimelineView()}
            </div>
          )}

          {/* Category Distribution */}
          {!hasNoGoals && Array.isArray(goals) && goals.length > 0 && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-gray-200">Goals by Category</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Distribution of your goals across different areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {GOAL_CATEGORIES.map(category => {
                    const Icon = category.icon
                    const count = goals.filter(g => g.category === category.id).length
                    const progress = goals.length > 0 ? (count / goals.length) * 100 : 0
                    
                    if (count === 0) return null
                    
                    return (
                      <div key={category.id} className="p-4 rounded-lg border dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2.5 rounded-lg ${category.bgColor}`}>
                            <Icon className="w-5 h-5" style={{ color: category.color }} />
                          </div>
                          <div>
                            <div className="text-2xl font-bold dark:text-gray-100">{count}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{category.label}</div>
                          </div>
                        </div>
                        <Progress value={progress} className="h-1.5" style={{ backgroundColor: `${category.color}20` }} />
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
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

        {/* Goal Details Modal */}
        <Dialog open={!!selectedGoal} onOpenChange={() => setSelectedGoal(null)}>
          <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
            {selectedGoal && (
              <>
                <DialogHeader className="flex-shrink-0 pb-4 border-b dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-1 h-8 rounded-full"
                      style={{ backgroundColor: selectedGoal.color }}
                    />
                    <DialogTitle className="text-xl dark:text-gray-100">
                      {selectedGoal.title}
                    </DialogTitle>
                  </div>
                  <DialogDescription className="dark:text-gray-400">
                    {selectedGoal.description}
                  </DialogDescription>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className={getPriorityColor(selectedGoal.priority)}>
                      {selectedGoal.priority}
                    </Badge>
                    <Badge className={getStatusColor(getEffectiveStatus(selectedGoal))}>
                      {getEffectiveStatus(selectedGoal).replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {selectedGoal.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-2">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium dark:text-gray-300">Overall Progress</span>
                        <span className="text-lg font-bold dark:text-gray-100">{selectedGoal.progress}%</span>
                      </div>
                      <Progress value={selectedGoal.progress} className="h-3" />
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {selectedGoal.completedHours}/{selectedGoal.totalHours} hours
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          {selectedGoal.weeklyTarget}h/week target
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => handleUpdateProgress(selectedGoal.id, 1)}
                      >
                        <Clock className="w-4 h-4" />
                        Log 1 Hour
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => handleUpdateProgress(selectedGoal.id, 2)}
                      >
                        <Clock className="w-4 h-4" />
                        Log 2 Hours
                      </Button>
                      <Button 
                        variant="outline" 
                        className="gap-2 col-span-2"
                        onClick={() => markGoalAsCompleted(selectedGoal.id)}
                        disabled={selectedGoal.status === 'COMPLETED'}
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Mark as Completed
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold dark:text-gray-200 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Milestones
                        <Badge variant="outline" className="ml-2">
                          {selectedGoal.milestones?.filter(m => m.completed).length || 0}/{selectedGoal.milestones?.length || 0}
                        </Badge>
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowMilestoneForm(true)}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Milestone
                      </Button>
                    </div>
                    
                    {selectedGoal.milestones && selectedGoal.milestones.length > 0 ? (
                      <div className="space-y-3">
                        {selectedGoal.milestones.map((milestone) => {
                          const daysLeft = getDaysUntilDeadline(milestone.targetDate)
                          
                          return (
                            <div 
                              key={milestone.id} 
                              className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-3">
                                  <button
                                    onClick={() => handleToggleMilestone(selectedGoal.id, milestone.id)}
                                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                                      milestone.completed
                                        ? 'bg-green-500 text-white'
                                        : 'border-2 border-gray-300 dark:border-gray-600 hover:border-green-500'
                                    }`}
                                  >
                                    {milestone.completed && <CheckCircle2 className="w-3 h-3" />}
                                  </button>
                                  <div>
                                    <h5 className={`font-medium ${
                                      milestone.completed 
                                        ? 'line-through text-gray-500 dark:text-gray-500' 
                                        : 'dark:text-gray-200'
                                    }`}>
                                      {milestone.title}
                                    </h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                      {milestone.description}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2 text-xs">
                                      <span className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        Due: {new Date(milestone.targetDate).toLocaleDateString()}
                                      </span>
                                      {!milestone.completed && (
                                        <span className={`flex items-center gap-1 ${
                                          daysLeft < 0 
                                            ? 'text-red-600 dark:text-red-400' 
                                            : daysLeft < 7 
                                            ? 'text-orange-600 dark:text-orange-400'
                                            : 'text-gray-500 dark:text-gray-500'
                                        }`}>
                                          {daysLeft < 0 
                                            ? `${Math.abs(daysLeft)}d overdue` 
                                            : `${daysLeft}d left`}
                                        </span>
                                      )}
                                      {milestone.progress > 0 && milestone.progress < 100 && (
                                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                                          <TrendingUp className="w-3 h-3" />
                                          {milestone.progress}%
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem 
                                      onClick={() => updateMilestone(selectedGoal.id, milestone.id, {
                                        completed: !milestone.completed,
                                        progress: !milestone.completed ? 100 : 0
                                      })}
                                    >
                                      {milestone.completed ? (
                                        <>🔄 Mark Incomplete</>
                                      ) : (
                                        <>✅ Mark Complete</>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => deleteMilestone(selectedGoal.id, milestone.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              
                              {!milestone.completed && milestone.progress > 0 && (
                                <div className="mt-3 ml-8">
                                  <div className="flex items-center gap-2">
                                    <Progress value={milestone.progress} className="h-1.5 flex-1" />
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                      {milestone.progress}%
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-8 border border-dashed dark:border-gray-700 rounded-lg text-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Target className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          No milestones added yet
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                          Break down your goal into smaller, achievable milestones
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Category</div>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(selectedGoal.category)}
                        <span className="font-medium dark:text-gray-300">
                          {GOAL_CATEGORIES.find(c => c.id === selectedGoal.category)?.label}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Created</div>
                      <div className="font-medium dark:text-gray-300">
                        {new Date(selectedGoal.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Target Date</div>
                      <div className="font-medium dark:text-gray-300">
                        {new Date(selectedGoal.targetDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs mt-1">
                        {getDaysUntilDeadline(selectedGoal.targetDate) < 0 ? (
                          <span className="text-red-600 dark:text-red-400">
                            {Math.abs(getDaysUntilDeadline(selectedGoal.targetDate))} days overdue
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-500">
                            {getDaysUntilDeadline(selectedGoal.targetDate)} days remaining
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Streak</div>
                      <div className="flex items-center gap-2">
                        <Flame className={`w-4 h-4 ${selectedGoal.streak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                        <span className="font-medium dark:text-gray-300">
                          {selectedGoal.streak} days
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Last updated: {new Date(selectedGoal.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {selectedGoal.tags && selectedGoal.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold dark:text-gray-200 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGoal.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <div className="font-medium dark:text-gray-300 flex items-center gap-2">
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
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {selectedGoal.isPublic 
                          ? 'Visible to others in your network'
                          : 'Only visible to you'
                        }
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
                
                <DialogFooter className="flex-shrink-0 pt-4 border-t dark:border-gray-700 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedGoal(null)}
                    className="dark:border-gray-700"
                  >
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingGoal(selectedGoal)
                      setSelectedGoal(null)
                    }}
                    className="gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Goal
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => markGoalAsCompleted(selectedGoal.id)}
                    disabled={selectedGoal.status === 'COMPLETED'}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Create/Edit Goal Modal */}
        <Dialog open={showForm || !!editingGoal} onOpenChange={() => {
          setShowForm(false)
          setEditingGoal(null)
        }}>
          <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-xl dark:text-gray-100">
                {editingGoal ? '✏️ Edit Goal' : '🎯 Create New Goal'}
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                {editingGoal 
                  ? 'Update your goal details and targets'
                  : 'Set a new goal with milestones and track your progress'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Master Data Structures & Algorithms"
                  value={editingGoal ? editingGoal.title : newGoal.title}
                  onChange={(e) => editingGoal 
                    ? setEditingGoal({...editingGoal, title: e.target.value})
                    : setNewGoal({...newGoal, title: e.target.value})
                  }
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you want to achieve and why it's important..."
                  value={editingGoal ? editingGoal.description : newGoal.description}
                  onChange={(e) => editingGoal
                    ? setEditingGoal({...editingGoal, description: e.target.value})
                    : setNewGoal({...newGoal, description: e.target.value})
                  }
                  className="dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={editingGoal ? editingGoal.category : newGoal.category}
                    onValueChange={(value: Goal['category']) => editingGoal
                      ? setEditingGoal({...editingGoal, category: value})
                      : setNewGoal({...newGoal, category: value})
                    }
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GOAL_CATEGORIES.map(category => {
                        const Icon = category.icon
                        return (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" style={{ color: category.color }} />
                              {category.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select
                    value={editingGoal ? editingGoal.priority : newGoal.priority}
                    onValueChange={(value: Goal['priority']) => editingGoal
                      ? setEditingGoal({...editingGoal, priority: value})
                      : setNewGoal({...newGoal, priority: value})
                    }
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select
                    value={editingGoal ? editingGoal.type : newGoal.type}
                    onValueChange={(value: Goal['type']) => editingGoal
                      ? setEditingGoal({...editingGoal, type: value})
                      : setNewGoal({...newGoal, type: value})
                    }
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHORT_TERM">⏱️ Short Term (1-3 months)</SelectItem>
                      <SelectItem value="LONG_TERM">📅 Long Term (3+ months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Target Date *</Label>
                  <Input
                    type="date"
                    value={editingGoal 
                      ? formatDateForInput(editingGoal.targetDate)
                      : newGoal.targetDate.split('T')[0]
                    }
                    onChange={(e) => {
                      // Create ISO string from date input
                      const dateStr = e.target.value;
                      if (dateStr) {
                        // Add time component to make it a valid ISO string
                        const isoDate = new Date(dateStr + 'T00:00:00.000Z').toISOString();
                        if (editingGoal) {
                          setEditingGoal({...editingGoal, targetDate: new Date(isoDate)});
                        } else {
                          setNewGoal({...newGoal, targetDate: isoDate});
                        }
                      }
                    }}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Hours *</Label>
                  <Input
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="e.g., 100"
                    value={editingGoal ? editingGoal.totalHours : newGoal.totalHours}
                    onChange={(e) => editingGoal
                      ? setEditingGoal({...editingGoal, totalHours: parseInt(e.target.value)})
                      : setNewGoal({...newGoal, totalHours: parseInt(e.target.value)})
                    }
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Weekly Target (hours)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="40"
                    placeholder="e.g., 5"
                    value={editingGoal ? editingGoal.weeklyTarget : newGoal.weeklyTarget}
                    onChange={(e) => editingGoal
                      ? setEditingGoal({...editingGoal, weeklyTarget: parseInt(e.target.value)})
                      : setNewGoal({...newGoal, weeklyTarget: parseInt(e.target.value)})
                    }
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color Theme</Label>
                <div className="flex flex-wrap gap-2">
                  {['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#F97316'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => editingGoal
                        ? setEditingGoal({...editingGoal, color})
                        : setNewGoal({...newGoal, color})
                      }
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        (editingGoal ? editingGoal.color : newGoal.color) === color 
                          ? 'border-gray-900 dark:border-white scale-110' 
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input
                  placeholder="e.g., DSA, Programming, Interview Prep"
                  value={editingGoal ? editingGoal.tags?.join(', ') : newGoal.tags?.join(', ')}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    editingGoal
                      ? setEditingGoal({...editingGoal, tags})
                      : setNewGoal({...newGoal, tags})
                  }}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Press comma to separate tags
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <div className="font-medium dark:text-gray-300">Make Goal Public</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Others can view your goal and progress
                  </div>
                </div>
                <Switch
                  checked={editingGoal ? editingGoal.isPublic : newGoal.isPublic}
                  onCheckedChange={(checked) => editingGoal
                    ? setEditingGoal({...editingGoal, isPublic: checked})
                    : setNewGoal({...newGoal, isPublic: checked})
                  }
                />
              </div>

              {editingGoal && (
                <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium dark:text-gray-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Update Progress
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Progress ({editingGoal.progress}%)</Label>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {editingGoal.completedHours}/{editingGoal.totalHours} hours
                      </span>
                    </div>
                    <Slider
                      value={[editingGoal.progress]}
                      onValueChange={([value]) => {
                        const newCompletedHours = Math.round((value / 100) * editingGoal.totalHours)
                        setEditingGoal({
                          ...editingGoal, 
                          progress: value,
                          completedHours: newCompletedHours
                        })
                      }}
                      max={100}
                      step={1}
                      className="py-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const newProgress = Math.min(100, editingGoal.progress + 10)
                        const newHours = Math.round((newProgress / 100) * editingGoal.totalHours)
                        setEditingGoal({
                          ...editingGoal,
                          progress: newProgress,
                          completedHours: newHours
                        })
                      }}
                    >
                      +10% Progress
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        const newHours = Math.min(editingGoal.totalHours, editingGoal.completedHours + 5)
                        const newProgress = Math.round((newHours / editingGoal.totalHours) * 100)
                        setEditingGoal({
                          ...editingGoal,
                          progress: newProgress,
                          completedHours: newHours
                        })
                      }}
                    >
                      +5 Hours
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex-shrink-0 pt-4 border-t dark:border-gray-700 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingGoal(null)
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (editingGoal) {
                    handleUpdateGoal(editingGoal.id, editingGoal)
                    setEditingGoal(null)
                  } else {
                    handleCreateGoal()
                  }
                }}
                disabled={!editingGoal && !newGoal.title.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Milestone Modal */}
        <Dialog open={showMilestoneForm} onOpenChange={setShowMilestoneForm}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Add Milestone
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Add a milestone to track progress for "{selectedGoal?.title}"
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="milestone-title">Title *</Label>
                <Input
                  id="milestone-title"
                  placeholder="e.g., Complete Arrays & Strings"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="milestone-description">Description</Label>
                <Textarea
                  id="milestone-description"
                  placeholder="Describe what needs to be accomplished..."
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                  className="dark:bg-gray-700 dark:border-gray-600"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="milestone-date">Target Date *</Label>
                <Input
                  id="milestone-date"
                  type="date"
                  value={newMilestone.targetDate.split('T')[0]}
                  onChange={(e) => {
                    const dateStr = e.target.value;
                    if (dateStr) {
                      const isoDate = new Date(dateStr + 'T00:00:00.000Z').toISOString();
                      setNewMilestone({...newMilestone, targetDate: isoDate});
                    }
                  }}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowMilestoneForm(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddMilestone}
                disabled={!newMilestone.title.trim()}
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

// Filter Chip Component
function FilterChip({ 
  active, 
  onClick, 
  label, 
  color = 'blue',
  count 
}: { 
  active: boolean; 
  onClick: () => void; 
  label: string; 
  color?: string;
  count?: number;
}) {
  const colorClasses = {
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
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active
          ? colorClasses[color as keyof typeof colorClasses] || 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <span className="flex items-center gap-2">
        {label}
        {count !== undefined && (
          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
            active ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
          }`}>
            {count}
          </span>
        )}
      </span>
    </button>
  )
}

