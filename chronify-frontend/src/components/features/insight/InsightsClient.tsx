// app/dashboard/insights/InsightsClient.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  Zap, 
  Brain, 
  BookOpen, 
  Users,
  LineChart,
  PieChart,
  BarChart3,
  Download,
  Share2,
  Filter,
  ChevronRight,
  Moon,
  Sun,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Activity,
  Coffee,
  Sunrise,
  Sunset,
  Moon as MoonIcon,
  Loader2,
  Info,
  HelpCircle,
  ThumbsUp,
  Clock3,
  Timer,
  CalendarDays,
  Trophy,
  Medal,
  Flame,
  Star,
  Rocket,
  X,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Toaster, toast } from 'sonner'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

// Types
interface TimeRange {
  value: string
  label: string
}

interface MetricCard {
  key: string
  label: string
  value: number | string
  icon: any
  color: string
  bgColor: string
  tooltip: string
  trend?: {
    value: string
    positive: boolean
  }
}

interface DetailedMetric {
  metric: string
  current: number
  target: number
  trend: string
  color: string
  unit?: string
}

interface DailyBreakdown {
  day: string
  dsa: number
  college: number
  projects: number
  total: number
  date?: Date
}

interface PerformanceMetric {
  time: string
  efficiency: number
  tasks: number
  icon: any
  period: 'morning' | 'afternoon' | 'evening' | 'night'
}

interface Milestone {
  title: string
  date: string
  description: string
  icon: any
  achieved: boolean
  color: string
}

interface Recommendation {
  title: string
  description: string
  icon: any
  priority: 'high' | 'medium' | 'low'
  action: string
  impact: string
}

export default function InsightsClient() {
  const [timeRange, setTimeRange] = useState('month')
  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTips, setShowTips] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  // Dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    const isDark = savedMode ? savedMode === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  // Time range options
  const timeRanges: TimeRange[] = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ]

  // Mock data - In production, this would come from API
  const insightsData = {
    streak: 21,
    consistencyScore: 92,
    productivityScore: 88,
    focusHours: 42,
    completedTasks: 156,
    timeSaved: 15,
    improvement: '+12%',
    bestStreak: 21,
    averageDaily: 5.2,
    totalHours: 156,
    completionRate: 94
  }

  const detailedAnalytics: DetailedMetric[] = [
    { metric: 'DSA Problems Solved', current: 120, target: 180, trend: '+8%', color: 'bg-blue-500', unit: 'problems' },
    { metric: 'College GPA', current: 8.7, target: 9.0, trend: '+0.3', color: 'bg-green-500', unit: 'points' },
    { metric: 'Projects Completed', current: 1, target: 3, trend: '0', color: 'bg-purple-500', unit: 'projects' },
    { metric: 'Skills Learned', current: 4, target: 8, trend: '+2', color: 'bg-orange-500', unit: 'skills' },
    { metric: 'Hours Coded', current: 85, target: 120, trend: '+15%', color: 'bg-pink-500', unit: 'hours' },
    { metric: 'Certifications', current: 2, target: 3, trend: '+1', color: 'bg-indigo-500', unit: 'certs' },
  ]

  const weeklyBreakdown: DailyBreakdown[] = [
    { day: 'Mon', dsa: 4, college: 3, projects: 1, total: 8 },
    { day: 'Tue', dsa: 3.5, college: 3, projects: 1.5, total: 8 },
    { day: 'Wed', dsa: 4.5, college: 2.5, projects: 1, total: 8 },
    { day: 'Thu', dsa: 3, college: 4, projects: 1, total: 8 },
    { day: 'Fri', dsa: 4, college: 2, projects: 2, total: 8 },
    { day: 'Sat', dsa: 5, college: 1, projects: 2, total: 8 },
    { day: 'Sun', dsa: 4, college: 2, projects: 2, total: 8 },
  ]

  const performanceMetrics: PerformanceMetric[] = [
    { time: 'Early Morning (5-8 AM)', efficiency: 92, tasks: 8, icon: Sunrise, period: 'morning' },
    { time: 'Morning (8-12 PM)', efficiency: 88, tasks: 12, icon: Coffee, period: 'morning' },
    { time: 'Afternoon (12-4 PM)', efficiency: 78, tasks: 10, icon: Sun, period: 'afternoon' },
    { time: 'Evening (4-8 PM)', efficiency: 85, tasks: 8, icon: Sunset, period: 'evening' },
    { time: 'Night (8-12 AM)', efficiency: 90, tasks: 6, icon: MoonIcon, period: 'night' },
  ]

  const milestones: Milestone[] = [
    { title: '21-Day Streak', date: 'Today', description: 'Longest streak achieved! Keep it up!', icon: Trophy, achieved: true, color: 'yellow' },
    { title: '100 DSA Problems', date: '3 days ago', description: 'Reached major milestone in DSA', icon: Brain, achieved: true, color: 'purple' },
    { title: '90%+ Consistency', date: '1 week ago', description: 'Maintained high consistency for 2 weeks', icon: TrendingUp, achieved: true, color: 'green' },
    { title: 'Early Bird', date: '2 weeks ago', description: '5 AM starts for 7 consecutive days', icon: Zap, achieved: true, color: 'orange' },
    { title: '500 Hours Total', date: 'In progress', description: '85% complete - 425/500 hours', icon: Clock, achieved: false, color: 'blue' },
    { title: 'Perfect Week', date: 'In progress', description: '7 days with 100% task completion', icon: Star, achieved: false, color: 'pink' },
  ]

  const recommendations: Recommendation[] = [
    {
      title: 'Optimize Morning Routine',
      description: 'Your morning efficiency is 92%. Start 30 minutes earlier to add 3.5 productive hours weekly.',
      icon: Sunrise,
      priority: 'high',
      action: 'Adjust Schedule',
      impact: '+15% productivity'
    },
    {
      title: 'Balance DSA & Projects',
      description: 'Project progress is lagging. Allocate 2 more hours weekly to project work for balanced growth.',
      icon: Target,
      priority: 'high',
      action: 'Reallocate Time',
      impact: 'Complete projects 2 weeks earlier'
    },
    {
      title: 'Optimize Break Schedule',
      description: 'Afternoon efficiency drops to 78%. Try Pomodoro technique with 25-min focus, 5-min breaks.',
      icon: Coffee,
      priority: 'medium',
      action: 'Try Pomodoro',
      impact: '+15% afternoon efficiency'
    },
    {
      title: 'Evening Review Session',
      description: 'Add 30-minute evening review to improve retention and plan next day.',
      icon: MoonIcon,
      priority: 'medium',
      action: 'Add Session',
      impact: 'Better long-term retention'
    },
    {
      title: 'Weekend Deep Work',
      description: 'Schedule 4-hour deep work sessions on weekends for complex tasks.',
      icon: Brain,
      priority: 'low',
      action: 'Block Time',
      impact: 'Complete complex tasks faster'
    },
  ]

  // Key metrics cards
  const metrics: MetricCard[] = [
    {
      key: 'streak',
      label: 'Current Streak',
      value: insightsData.streak,
      icon: Flame,
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      tooltip: 'Consecutive days with productive activity',
      trend: { value: '+5 days', positive: true }
    },
    {
      key: 'consistencyScore',
      label: 'Consistency Score',
      value: `${insightsData.consistencyScore}%`,
      icon: Activity,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      tooltip: 'Regularity of your study habits',
      trend: { value: '+8%', positive: true }
    },
    {
      key: 'productivityScore',
      label: 'Productivity Score',
      value: `${insightsData.productivityScore}%`,
      icon: Zap,
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      tooltip: 'Efficiency of your study sessions',
      trend: { value: '+12%', positive: true }
    },
    {
      key: 'focusHours',
      label: 'Focus Hours',
      value: insightsData.focusHours,
      icon: Timer,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      tooltip: 'Total hours of focused work',
      trend: { value: '+5h', positive: true }
    },
    {
      key: 'completedTasks',
      label: 'Tasks Completed',
      value: insightsData.completedTasks,
      icon: CheckCircle2,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      tooltip: 'Total tasks completed this period',
      trend: { value: '+24', positive: true }
    },
    {
      key: 'completionRate',
      label: 'Completion Rate',
      value: `${insightsData.completionRate}%`,
      icon: Target,
      color: 'pink',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      tooltip: 'Percentage of planned tasks completed',
      trend: { value: '+5%', positive: true }
    },
    {
      key: 'bestStreak',
      label: 'Best Streak',
      value: insightsData.bestStreak,
      icon: Trophy,
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      tooltip: 'Longest streak ever achieved',
      trend: { value: 'Personal best', positive: true }
    },
    {
      key: 'averageDaily',
      label: 'Avg Daily Hours',
      value: insightsData.averageDaily,
      icon: Clock3,
      color: 'indigo',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      tooltip: 'Average hours per day',
      trend: { value: '+0.5h', positive: true }
    },
  ]

  // Handle export
  const handleExport = (format: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success(`Exported as ${format}`, {
        description: 'Your data has been exported successfully.',
        icon: '📥'
      })
    }, 1500)
  }

  // Handle share
  const handleShare = () => {
    toast.success('Share link copied!', {
      description: 'Share your progress with friends.',
      icon: '🔗'
    })
  }

  // Handle recommendation action
  const handleRecommendationAction = (title: string) => {
    toast.info(`Implementing: ${title}`, {
      description: 'We\'ll help you get started with this recommendation.',
      icon: '✨'
    })
  }

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

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header with Breadcrumb */}
            <motion.div variants={itemVariants}>
              {/* Breadcrumb Navigation for SEO */}
              <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
                <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 dark:text-gray-200 font-medium">Progress Insights</span>
              </nav>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      Progress Insights
                    </h1>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleDarkMode}
                      className="h-9 w-9 border-gray-300 dark:border-gray-600"
                      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                      {darkMode ? (
                        <Sun className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <Moon className="h-4 w-4 text-gray-700" />
                      )}
                    </Button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Detailed analytics and performance tracking for your study journey
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Time Range Selector */}
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {timeRanges.map(range => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10 border-gray-300 dark:border-gray-600">
                          <Filter className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Filter insights</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10 border-gray-300 dark:border-gray-600">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button 
                    size="default" 
                    onClick={handleShare}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Progress
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Welcome Banner for New Users */}
            {showTips && (
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Welcome to Progress Insights!
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Track your study patterns, monitor streaks, and get personalized recommendations to optimize your learning journey. Your data updates in real-time.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTips(false)}
                    className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-lg transition-colors"
                    aria-label="Close banner"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Key Metrics Grid */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg font-semibold mb-4 dark:text-gray-200 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Key Performance Indicators
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {metrics.map((metric, index) => {
                  const Icon = metric.icon
                  return (
                    <TooltipProvider key={metric.key}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            variants={itemVariants}
                            whileHover={{ y: -2 }}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-lg transition-all cursor-help"
                            onClick={() => setSelectedMetric(metric.key)}
                          >
                            <div className="flex flex-col items-center text-center">
                              <div className={`p-2 rounded-lg ${metric.bgColor} mb-2`}>
                                <Icon className={`w-4 h-4 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                              </div>
                              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {metric.value}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                {metric.label}
                              </div>
                              {metric.trend && (
                                <Badge className={`text-[10px] px-1 py-0 ${
                                  metric.trend.positive 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {metric.trend.value}
                                </Badge>
                              )}
                            </div>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[200px]">
                          <p className="text-sm">{metric.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            </motion.div>

            {/* Detailed Analytics and Weekly Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Overview */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      Detailed Progress Analysis
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Track progress across all your goals and targets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {detailedAnalytics.map((item, index) => (
                        <motion.div
                          key={item.metric}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${item.color}`} />
                              <span className="font-medium dark:text-gray-300">{item.metric}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold dark:text-gray-200">{item.current}</span>
                              <span className="text-gray-600 dark:text-gray-400 text-sm">
                                / {item.target} {item.unit}
                              </span>
                              <Badge className={`${
                                item.trend.startsWith('+') 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                  : item.trend === '0'
                                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {item.trend}
                              </Badge>
                            </div>
                          </div>
                          <Progress 
                            value={(item.current / item.target) * 100} 
                            className="h-2"
                            // Custom indicator color using style
                            style={{
                              '--progress-background': `var(--${item.color.replace('bg-', '')})`
                            } as any}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Weekly Breakdown */}
              <motion.div variants={itemVariants}>
                <Card className="dark:bg-gray-800 dark:border-gray-700 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                      <PieChart className="w-5 h-5 text-purple-500" />
                      Weekly Time Distribution
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Hours spent on different activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {weeklyBreakdown.map((day, index) => (
                        <motion.div
                          key={day.day}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium dark:text-gray-300">{day.day}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {day.total}h total
                            </span>
                          </div>
                          <div className="flex h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500" 
                              style={{ width: `${(day.dsa / day.total) * 100}%` }}
                            />
                            <div 
                              className="bg-green-500" 
                              style={{ width: `${(day.college / day.total) * 100}%` }}
                            />
                            <div 
                              className="bg-purple-500" 
                              style={{ width: `${(day.projects / day.total) * 100}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                            <span>DSA: {day.dsa}h</span>
                            <span>College: {day.college}h</span>
                            <span>Projects: {day.projects}h</span>
                          </div>
                        </motion.div>
                      ))}

                      {/* Legend */}
                      <div className="flex items-center gap-4 pt-2 mt-2 border-t dark:border-gray-700">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">DSA</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">College</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-purple-500 rounded-full" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Projects</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Performance Metrics and Milestones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Patterns */}
              <motion.div variants={itemVariants}>
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                      <Clock className="w-5 h-5 text-orange-500" />
                      Daily Performance Pattern
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      When you're most productive throughout the day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {performanceMetrics.map((metric, index) => {
                        const Icon = metric.icon
                        return (
                          <motion.div
                            key={metric.time}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${
                                  metric.period === 'morning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                  metric.period === 'afternoon' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                  metric.period === 'evening' ? 'bg-purple-100 dark:bg-purple-900/30' :
                                  'bg-indigo-100 dark:bg-indigo-900/30'
                                }`}>
                                  <Icon className={`w-4 h-4 ${
                                    metric.period === 'morning' ? 'text-yellow-600 dark:text-yellow-400' :
                                    metric.period === 'afternoon' ? 'text-orange-600 dark:text-orange-400' :
                                    metric.period === 'evening' ? 'text-purple-600 dark:text-purple-400' :
                                    'text-indigo-600 dark:text-indigo-400'
                                  }`} />
                                </div>
                                <span className="font-medium dark:text-gray-300">{metric.time}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {metric.tasks} tasks
                                </span>
                                <Badge className={`${
                                  metric.efficiency >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                  metric.efficiency >= 80 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                  {metric.efficiency}% efficiency
                                </Badge>
                              </div>
                            </div>
                            <Progress value={metric.efficiency} className="h-2" />
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t dark:border-gray-700 pt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      <Info className="w-3 h-3 inline mr-1" />
                      Peak productivity: Early Morning (92% efficiency)
                    </p>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Recent Milestones */}
              <motion.div variants={itemVariants}>
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Recent Milestones
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Your achievements and progress markers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {milestones.map((milestone, index) => {
                        const Icon = milestone.icon
                        return (
                          <motion.div
                            key={milestone.title}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-start gap-4 p-3 rounded-lg ${
                              milestone.achieved
                                ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20'
                                : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${
                              milestone.achieved
                                ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                                : 'bg-gray-200 dark:bg-gray-600'
                            }`}>
                              <Icon className={`w-5 h-5 ${
                                milestone.achieved ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold dark:text-gray-200">{milestone.title}</h4>
                                <Badge variant={milestone.achieved ? 'default' : 'outline'}>
                                  {milestone.date}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {milestone.description}
                              </p>
                              {!milestone.achieved && (
                                <Progress value={85} className="h-1 mt-2" />
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* AI Recommendations */}
            <motion.div variants={itemVariants}>
              <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                    <Brain className="w-5 h-5 text-purple-500" />
                    AI-Powered Recommendations
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Personalized suggestions based on your performance patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map((rec, index) => {
                      const Icon = rec.icon
                      return (
                        <motion.div
                          key={rec.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border ${
                            rec.priority === 'high'
                              ? 'border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/20'
                              : rec.priority === 'medium'
                              ? 'border-yellow-200 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-950/20'
                              : 'border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/20'
                          }`}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${
                              rec.priority === 'high'
                                ? 'bg-red-100 dark:bg-red-900/30'
                                : rec.priority === 'medium'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                : 'bg-blue-100 dark:bg-blue-900/30'
                            }`}>
                              <Icon className={`w-5 h-5 ${
                                rec.priority === 'high'
                                  ? 'text-red-600 dark:text-red-400'
                                  : rec.priority === 'medium'
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-blue-600 dark:text-blue-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold mb-1 dark:text-gray-200">{rec.title}</h4>
                              <div className="flex gap-2 mb-2">
                                <Badge className={`${
                                  rec.priority === 'high'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : rec.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                  {rec.priority} priority
                                </Badge>
                                <Badge variant="outline" className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400">
                                  {rec.impact}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {rec.description}
                              </p>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={() => handleRecommendationAction(rec.title)}
                              >
                                {rec.action}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Export & Share Section */}
            <motion.div variants={itemVariants}>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                    <Download className="w-5 h-5 text-green-500" />
                    Export & Share
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Share your progress or export data for further analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { format: 'PDF Report', description: 'Detailed progress report', icon: BookOpen, color: 'red' },
                      { format: 'CSV Data', description: 'Raw data for analysis', icon: BarChart3, color: 'green' },
                      { format: 'PNG Image', description: 'Shareable progress snapshot', icon: Share2, color: 'blue' },
                      { format: 'JSON Export', description: 'Structured data export', icon: Users, color: 'purple' },
                    ].map((format, index) => {
                      const Icon = format.icon
                      return (
                        <motion.button
                          key={format.format}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -2 }}
                          onClick={() => handleExport(format.format)}
                          disabled={isLoading}
                          className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-${format.color}-500 dark:hover:border-${format.color}-500 transition-all text-left relative ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {isLoading && (
                            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center rounded-lg">
                              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                            </div>
                          )}
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg bg-${format.color}-50 dark:bg-${format.color}-900/20`}>
                              <Icon className={`w-5 h-5 text-${format.color}-600 dark:text-${format.color}-400`} />
                            </div>
                            <span className="font-medium dark:text-gray-200">{format.format}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {format.description}
                          </p>
                        </motion.button>
                      )
                    })}
                  </div>
                </CardContent>
                <CardFooter className="border-t dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between w-full text-sm text-gray-600 dark:text-gray-400">
                    <span>Last updated: Today at 2:30 PM</span>
                    <Button variant="link" size="sm" className="gap-1" onClick={() => refresh()}>
                      <RefreshCw className="w-3 h-3" />
                      Refresh
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            {/* SEO-friendly content */}
            <motion.div variants={itemVariants} className="text-xs text-gray-500 dark:text-gray-500 text-center border-t border-gray-200 dark:border-gray-800 pt-6 mt-4">
              <p>
                Chronify AI Progress Insights provides comprehensive analytics for your learning journey. 
                Track study streaks, monitor consistency scores, analyze productivity patterns, and get 
                AI-powered recommendations. Perfect for students, professionals, and lifelong learners 
                who want to optimize their study habits and achieve their goals faster.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}