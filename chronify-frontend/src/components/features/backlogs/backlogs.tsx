// src/app/dashboard/backlogs/BacklogsClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bookmark, 
  Plus, 
  Clock, 
  Calendar,
  Target,
  ArrowRight,
  Filter,
  Search,
  X,
  Edit2,
  Trash2,
  ChevronDown,
  Moon,
  Sun,
  Loader2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { toast } from 'sonner'
import Link from 'next/link'

// Types
interface Backlog {
  id: string
  title: string
  description: string
  subject: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL'
  estimatedDuration: number
  addedAt: Date
  targetDate?: Date
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  tags?: string[]
}

// Mock data
const mockBacklogs: Backlog[] = [
  {
    id: '1',
    title: 'Learn React Native',
    description: 'Complete mobile app development course and build a sample project. Focus on navigation, state management, and API integration.',
    subject: 'Mobile Development',
    priority: 'MEDIUM',
    estimatedDuration: 40,
    addedAt: new Date('2024-12-01'),
    targetDate: new Date('2025-02-01'),
    status: 'PENDING',
    tags: ['Mobile', 'React']
  },
  {
    id: '2',
    title: 'System Design Concepts',
    description: 'Study distributed systems, microservices architecture, load balancing, and database scaling patterns.',
    subject: 'System Design',
    priority: 'HIGH',
    estimatedDuration: 60,
    addedAt: new Date('2024-11-15'),
    targetDate: new Date('2024-12-31'),
    status: 'IN_PROGRESS',
    tags: ['Architecture', 'Backend']
  },
  {
    id: '3',
    title: 'Docker & Kubernetes',
    description: 'Learn containerization, orchestration, and deployment strategies for microservices.',
    subject: 'DevOps',
    priority: 'MEDIUM',
    estimatedDuration: 50,
    addedAt: new Date('2024-12-10'),
    targetDate: new Date('2025-01-15'),
    status: 'PENDING',
    tags: ['DevOps', 'Containers']
  },
  {
    id: '4',
    title: 'GraphQL API Implementation',
    description: 'Build a GraphQL server with Node.js and integrate with existing REST APIs.',
    subject: 'Backend Development',
    priority: 'LOW',
    estimatedDuration: 30,
    addedAt: new Date('2024-11-20'),
    targetDate: new Date('2024-12-10'),
    status: 'COMPLETED',
    tags: ['GraphQL', 'Node.js']
  },
  {
    id: '5',
    title: 'Machine Learning Basics',
    description: 'Complete introductory course on ML algorithms, model training, and evaluation.',
    subject: 'AI/ML',
    priority: 'HIGH',
    estimatedDuration: 45,
    addedAt: new Date('2024-12-05'),
    targetDate: undefined,
    status: 'PENDING',
    tags: ['AI', 'Python']
  },
]

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const config = {
    CRITICAL: { 
      label: 'Critical', 
      className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30' 
    },
    HIGH: { 
      label: 'High', 
      className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30' 
    },
    MEDIUM: { 
      label: 'Medium', 
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30' 
    },
    LOW: { 
      label: 'Low', 
      className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30' 
    }
  }
  
  const { label, className } = config[priority as keyof typeof config] || { 
    label: priority, 
    className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700' 
  }
  
  return (
    <Badge variant="outline" className={`px-2 py-1 text-xs font-medium ${className}`}>
      {label}
    </Badge>
  )
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    PENDING: { 
      label: 'Pending', 
      className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700' 
    },
    IN_PROGRESS: { 
      label: 'In Progress', 
      className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30' 
    },
    COMPLETED: { 
      label: 'Completed', 
      className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30' 
    }
  }
  
  const { label, className } = config[status as keyof typeof config] || { 
    label: status, 
    className: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700' 
  }
  
  return (
    <Badge variant="outline" className={`px-2 py-1 text-xs font-medium ${className}`}>
      {label}
    </Badge>
  )
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Bookmark className="w-8 h-8 text-primary/50 animate-pulse" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Loading your backlogs...
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Please wait while we fetch your backlog data
      </p>
    </div>
  </div>
)

export default function BacklogsClient() {
  const { user, isLoading } = useAuthGuard()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showConverter, setShowConverter] = useState(false)
  const [selectedBacklog, setSelectedBacklog] = useState<Backlog | null>(null)
  const [backlogs, setBacklogs] = useState<Backlog[]>(mockBacklogs)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'title'>('priority')

  // Check for system dark mode preference
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

  // Filter and sort backlogs
  const filteredBacklogs = backlogs
    .filter(backlog => {
      const searchLower = search.toLowerCase()
      if (search && 
          !backlog.title.toLowerCase().includes(searchLower) && 
          !backlog.description?.toLowerCase().includes(searchLower) &&
          !backlog.subject?.toLowerCase().includes(searchLower)) {
        return false
      }
      
      if (filter === 'all') return true
      if (filter === 'critical') return backlog.priority === 'CRITICAL'
      if (filter === 'high') return backlog.priority === 'HIGH'
      if (filter === 'medium') return backlog.priority === 'MEDIUM'
      if (filter === 'low') return backlog.priority === 'LOW'
      if (filter === 'overdue') {
        return backlog.targetDate && backlog.targetDate < new Date() && backlog.status === 'PENDING'
      }
      return backlog.status.toLowerCase() === filter
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      if (sortBy === 'date') {
        return (b.targetDate?.getTime() || 0) - (a.targetDate?.getTime() || 0)
      }
      return a.title.localeCompare(b.title)
    })

  const handleConvertToTask = (backlog: Backlog) => {
    setSelectedBacklog(backlog)
    setShowConverter(true)
  }

  const handleDeleteBacklog = async (id: string) => {
    setIsDeleting(id)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setBacklogs(backlogs.filter(backlog => backlog.id !== id))
      toast.success('Backlog deleted successfully', {
        description: 'The item has been removed from your backlog.',
      })
    } catch (error) {
      toast.error('Failed to delete backlog', {
        description: 'Please try again later.',
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditBacklog = (backlog: Backlog) => {
    setSelectedBacklog(backlog)
    setShowConverter(true)
  }

  const handleConverterSubmit = (data: any) => {
    if (selectedBacklog) {
      // Update existing backlog
      setBacklogs(backlogs.map(b => 
        b.id === selectedBacklog.id ? { ...b, ...data } : b
      ))
      toast.success('Backlog updated successfully')
    } else {
      // Add new backlog
      const newBacklog: Backlog = {
        id: Date.now().toString(),
        ...data,
        addedAt: new Date(),
        status: 'PENDING',
      }
      setBacklogs([newBacklog, ...backlogs])
      toast.success('Added to backlog successfully')
    }
    
    setShowConverter(false)
    setSelectedBacklog(null)
  }

  const stats = {
    total: backlogs.length,
    critical: backlogs.filter(b => b.priority === 'CRITICAL').length,
    highPriority: backlogs.filter(b => b.priority === 'HIGH').length,
    overdue: backlogs.filter(b => 
      b.targetDate && b.targetDate < new Date() && b.status === 'PENDING'
    ).length,
    completed: backlogs.filter(b => b.status === 'COMPLETED').length,
    inProgress: backlogs.filter(b => b.status === 'IN_PROGRESS').length,
    totalHours: backlogs.reduce((acc, b) => acc + b.estimatedDuration, 0),
  }

  const filterOptions = [
    { id: 'all', label: 'All Backlogs', icon: Bookmark, count: stats.total },
    { id: 'critical', label: 'Critical', icon: AlertCircle, count: stats.critical },
    { id: 'high', label: 'High Priority', icon: Target, count: stats.highPriority },
    { id: 'pending', label: 'Pending', icon: Clock, count: backlogs.filter(b => b.status === 'PENDING').length },
    { id: 'in-progress', label: 'In Progress', icon: TrendingUp, count: stats.inProgress },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: stats.completed },
    { id: 'overdue', label: 'Overdue', icon: AlertCircle, count: stats.overdue },
  ]

  // Stat cards
  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: Bookmark, color: 'gray' },
    { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'blue' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'green' },
    { label: 'Total Hours', value: stats.totalHours, icon: Clock, color: 'purple', suffix: 'h' },
  ]

  // Show loading spinner
  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation for SEO */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-200 font-medium">Backlogs</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                  Task Backlogs
                </h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="h-8 w-8 border-gray-300 dark:border-gray-600"
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-gray-700" />
                  )}
                </Button>
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {user.name ? `${user.name.split(' ')[0]}, ` : ''} track tasks for future. Organize, prioritize, and convert when ready.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="gap-2 border-gray-300 dark:border-gray-600"
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
              <Button 
                onClick={() => {
                  setSelectedBacklog(null)
                  setShowConverter(true)
                }} 
                className="gap-2 w-full sm:w-auto bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-700 dark:to-gray-600 hover:from-gray-800 hover:to-gray-600 text-white shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                <Plus className="w-4 h-4" />
                Add to Backlog
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stat.value}{stat.suffix || ''}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search & Filter Section */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search backlogs by title, description, or subject..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 border-gray-300 dark:border-gray-600">
                    Sort by: {sortBy === 'priority' ? 'Priority' : sortBy === 'date' ? 'Date' : 'Title'}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem onClick={() => setSortBy('priority')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('date')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    Target Date
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('title')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    Title
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden gap-2 border-gray-300 dark:border-gray-600"
              >
                <Filter className="w-4 h-4" />
                Filter
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileFilterOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {/* Desktop Filters */}
              <div className="hidden md:flex gap-2">
                {filterOptions.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                      filter === f.id
                        ? 'bg-gray-900 dark:bg-gray-700 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <f.icon className="w-4 h-4" />
                    <span>{f.label}</span>
                    {f.count > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        filter === f.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {f.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Filter Dropdown */}
            <AnimatePresence>
              {mobileFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden grid grid-cols-2 gap-2"
                >
                  {filterOptions.map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFilter(f.id)
                        setMobileFilterOpen(false)
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        filter === f.id
                          ? 'bg-gray-900 dark:bg-gray-700 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <f.icon className="w-4 h-4" />
                      <span>{f.label}</span>
                      {f.count > 0 && (
                        <span className={`ml-auto px-1.5 py-0.5 rounded-full text-xs ${
                          filter === f.id
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {f.count}
                        </span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Backlog List/Grid */}
          {viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredBacklogs.map((backlog, index) => (
                <motion.div
                  key={backlog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {backlog.title}
                            </h3>
                            <div className="flex gap-2">
                              <PriorityBadge priority={backlog.priority} />
                              <StatusBadge status={backlog.status} />
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {backlog.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Bookmark className="w-4 h-4" />
                              <span>{backlog.subject}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{backlog.estimatedDuration}h estimated</span>
                            </div>
                            {backlog.targetDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Target: {backlog.targetDate.toLocaleDateString()}</span>
                              </div>
                            )}
                            {backlog.tags && backlog.tags.length > 0 && (
                              <div className="flex gap-1">
                                {backlog.tags.map(tag => (
                                  <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBacklog(backlog)}
                            className="gap-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConvertToTask(backlog)}
                            className="gap-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <ArrowRight className="w-4 h-4" />
                            <span className="hidden sm:inline">Convert</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBacklog(backlog.id)}
                            disabled={isDeleting === backlog.id}
                            className="gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800/30"
                          >
                            {isDeleting === backlog.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">
                              {isDeleting === backlog.id ? 'Deleting...' : 'Delete'}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBacklogs.map((backlog, index) => (
                <motion.div
                  key={backlog.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
                          {backlog.title}
                        </h3>
                        <div className="flex gap-1 ml-2">
                          <PriorityBadge priority={backlog.priority} />
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {backlog.description}
                      </p>
                      
                      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Bookmark className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{backlog.subject}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{backlog.estimatedDuration}h estimated</span>
                        </div>
                        {backlog.targetDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>{backlog.targetDate.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <StatusBadge status={backlog.status} />
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBacklog(backlog)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConvertToTask(backlog)}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBacklog(backlog.id)}
                            disabled={isDeleting === backlog.id}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            {isDeleting === backlog.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredBacklogs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {search ? 'No matching backlogs found' : 'Your backlog is empty'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {search 
                  ? 'Try adjusting your search terms or filters'
                  : 'Start by adding tasks you plan to work on in the future'
                }
              </p>
              <Button 
                onClick={() => {
                  setSelectedBacklog(null)
                  setShowConverter(true)
                }} 
                size="lg"
                className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-700 dark:to-gray-600 hover:from-gray-800 hover:to-gray-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Backlog
              </Button>
            </motion.div>
          )}

          {/* Tips Section with Schema */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-6"
            itemScope
            itemType="https://schema.org/HowTo"
          >
            <meta itemProp="name" content="Effective Backlog Management Tips" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-3" itemProp="description">
                  Smart Backlog Management Tips
                </h2>
                <div className="grid md:grid-cols-2 gap-3" itemProp="step" itemScope itemType="https://schema.org/ItemList">
                  {[
                    "Use backlogs for future tasks, not urgent ones",
                    "Review and prioritize your backlog weekly",
                    "Add detailed descriptions for clarity",
                    "Set realistic target dates for planning",
                    "Tag tasks by category for easy filtering",
                    "Convert to active tasks when ready to start"
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                      <span itemProp="itemListElement" itemScope itemType="https://schema.org/HowToStep">
                        <meta itemProp="position" content={(index + 1).toString()} />
                        <span itemProp="text">{tip}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* SEO-friendly content */}
          <div className="text-xs text-gray-500 dark:text-gray-500 text-center border-t border-gray-200 dark:border-gray-800 pt-6">
            <p>
              Chronify AI Backlog Manager helps you organize future tasks efficiently. 
              Track pending items, set priorities, and convert to active tasks when ready. 
              Perfect for developers, project managers, and productivity enthusiasts.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Backlog Converter Modal */}
      <AnimatePresence>
        {showConverter && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {selectedBacklog ? 'Edit Backlog' : 'Add to Backlog'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowConverter(false)
                      setSelectedBacklog(null)
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleConverterSubmit({
                    title: formData.get('title'),
                    description: formData.get('description'),
                    subject: formData.get('subject'),
                    priority: formData.get('priority'),
                    estimatedDuration: parseInt(formData.get('duration') as string),
                    targetDate: formData.get('targetDate') ? new Date(formData.get('targetDate') as string) : undefined,
                  })
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title *
                      </label>
                      <Input
                        name="title"
                        placeholder="e.g., Learn React Native"
                        defaultValue={selectedBacklog?.title}
                        required
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        placeholder="Describe the task..."
                        defaultValue={selectedBacklog?.description}
                        rows={4}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-transparent resize-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Priority *
                        </label>
                        <select 
                          name="priority"
                          defaultValue={selectedBacklog?.priority?.toLowerCase() || 'medium'}
                          required
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
                        >
                          <option value="critical">Critical</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subject *
                        </label>
                        <Input
                          name="subject"
                          placeholder="e.g., Development"
                          defaultValue={selectedBacklog?.subject}
                          required
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Est. Hours *
                        </label>
                        <Input
                          name="duration"
                          type="number"
                          placeholder="40"
                          defaultValue={selectedBacklog?.estimatedDuration}
                          required
                          min="1"
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Target Date
                        </label>
                        <Input
                          name="targetDate"
                          type="date"
                          defaultValue={selectedBacklog?.targetDate?.toISOString().split('T')[0]}
                          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => {
                          setShowConverter(false)
                          setSelectedBacklog(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-700 dark:to-gray-600 hover:from-gray-800 hover:to-gray-600 text-white"
                      >
                        {selectedBacklog ? 'Update Backlog' : 'Add to Backlog'}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}