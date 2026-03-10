// app/profile/ProfileClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  User, 
  Calendar, 
  Target, 
  TrendingUp, 
  Award, 
  Clock, 
  BookOpen, 
  Brain, 
  Star, 
  Trophy, 
  Edit,
  CheckCircle,
  Zap,
  Users,
  BarChart3,
  LineChart,
  PieChart,
  CalendarDays,
  Moon,
  Sun,
  Sparkles,
  AlertCircle,
  ChevronRight,
  Settings,
  LogOut,
  Share2,
  Download,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  RefreshCw,
  Loader2,
  Info,
  HelpCircle,
  ThumbsUp,
  Coffee,
  Sunrise,
  Sunset,
  Moon as MoonIcon,
  Target as TargetIcon,
  BookMarked,
  GraduationCap,
  Code,
  FolderGit2,
  Medal,
  Flame,
  Rocket,
  Brain as BrainIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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

interface UserData {
  name: string
  email: string
  role: string
  university: string
  semester: string
  streak: number
  level: number
  xp: number
  xpToNextLevel: number
  avatar: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
  }
  goals: {
    dsa: { completed: number; total: number; progress: number; topics?: Record<string, number> }
    college: { completed: number; total: number; progress: number; gpa?: number }
    projects: { completed: number; total: number; progress: number; names?: string[] }
  }
  stats: {
    weeklyHours: number
    productivity: number
    consistency: number
    focusScore: number
  }
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: any
  unlocked: boolean
  progress?: number
  category: 'streak' | 'dsa' | 'productivity' | 'early' | 'project'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface WeeklyProgress {
  day: string
  completed: number
  total: number
  focus: number
  date?: Date
}

interface StudyPattern {
  hour: string
  efficiency: number
  activity: string
  period: 'early' | 'morning' | 'afternoon' | 'evening' | 'night'
}

export default function ProfileClient() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showAchievementDetails, setShowAchievementDetails] = useState<Achievement | null>(null)

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

  // Mock user data - In production, this would come from API/context
  const userData: UserData = {
    name: 'Arbaz Khan',
    email: 'arbaz.khan@example.com',
    role: 'MCA Student',
    university: 'Amity University',
    semester: '3rd Semester',
    streak: 21,
    level: 5,
    xp: 850,
    xpToNextLevel: 150,
    avatar: 'AK',
    bio: 'Passionate about DSA and full-stack development. Aiming for FAANG placement.',
    location: 'Mumbai, India',
    website: 'https://arbazkhan.dev',
    socialLinks: {
      github: 'https://github.com/arbazkhan',
      linkedin: 'https://linkedin.com/in/arbazkhan',
      twitter: 'https://twitter.com/arbazkhan'
    },
    goals: {
      dsa: { 
        completed: 120, 
        total: 180, 
        progress: 67,
        topics: {
          'Arrays': 32,
          'Linked Lists': 28,
          'Trees': 25,
          'Graphs': 18,
          'Dynamic Programming': 12,
          'Strings': 5
        }
      },
      college: { 
        completed: 45, 
        total: 60, 
        progress: 75,
        gpa: 8.7
      },
      projects: { 
        completed: 1, 
        total: 3, 
        progress: 33,
        names: ['Portfolio Website', 'E-commerce App', 'AI Chatbot']
      }
    },
    stats: {
      weeklyHours: 62,
      productivity: 92,
      consistency: 85,
      focusScore: 88
    }
  }

  const achievements: Achievement[] = [
    { 
      id: 1, 
      title: '7-Day Streak', 
      description: '7 consecutive days of following schedule', 
      icon: Flame, 
      unlocked: true,
      category: 'streak',
      rarity: 'common'
    },
    { 
      id: 2, 
      title: 'DSA Master', 
      description: 'Completed 100 DSA problems', 
      icon: BrainIcon, 
      unlocked: true,
      category: 'dsa',
      rarity: 'rare'
    },
    { 
      id: 3, 
      title: 'Early Bird', 
      description: 'Started study sessions before 7 AM for 10 days', 
      icon: Sunrise, 
      unlocked: false,
      progress: 7,
      category: 'early',
      rarity: 'epic'
    },
    { 
      id: 4, 
      title: 'Weekend Warrior', 
      description: 'Maintained schedule on weekends for 4 weeks', 
      icon: CalendarDays, 
      unlocked: true,
      category: 'streak',
      rarity: 'rare'
    },
    { 
      id: 5, 
      title: 'Consistency King', 
      description: '30-day perfect consistency streak', 
      icon: TrendingUp, 
      unlocked: false,
      progress: 21,
      category: 'streak',
      rarity: 'legendary'
    },
    { 
      id: 6, 
      title: 'Productivity Pro', 
      description: 'Maintained 90%+ productivity for 2 weeks', 
      icon: Star, 
      unlocked: false,
      progress: 12,
      category: 'productivity',
      rarity: 'epic'
    },
    { 
      id: 7, 
      title: 'Project Pioneer', 
      description: 'Completed first major project', 
      icon: Rocket, 
      unlocked: true,
      category: 'project',
      rarity: 'rare'
    },
    { 
      id: 8, 
      title: 'Century Club', 
      description: 'Logged 100+ hours of study', 
      icon: Medal, 
      unlocked: true,
      category: 'productivity',
      rarity: 'epic'
    },
  ]

  const weeklyProgress: WeeklyProgress[] = [
    { day: 'Mon', completed: 8, total: 8, focus: 92 },
    { day: 'Tue', completed: 7, total: 8, focus: 88 },
    { day: 'Wed', completed: 8, total: 8, focus: 95 },
    { day: 'Thu', completed: 6, total: 8, focus: 85 },
    { day: 'Fri', completed: 7, total: 8, focus: 90 },
    { day: 'Sat', completed: 5, total: 6, focus: 82 },
    { day: 'Sun', completed: 4, total: 6, focus: 78 }
  ]

  const studyPatterns: StudyPattern[] = [
    { hour: '5-8 AM', efficiency: 85, activity: 'Morning Study', period: 'early' },
    { hour: '8-10 AM', efficiency: 90, activity: 'College', period: 'morning' },
    { hour: '10-12 PM', efficiency: 88, activity: 'DSA Practice', period: 'morning' },
    { hour: '12-3 PM', efficiency: 75, activity: 'Post-lunch Study', period: 'afternoon' },
    { hour: '3-5 PM', efficiency: 92, activity: 'Peak Focus', period: 'afternoon' },
    { hour: '5-7 PM', efficiency: 70, activity: 'Evening Study', period: 'evening' },
    { hour: '7-9 PM', efficiency: 80, activity: 'Project Work', period: 'evening' },
    { hour: '9-11 PM', efficiency: 78, activity: 'Review & Planning', period: 'night' }
  ]

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
      case 'rare': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'epic': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800'
      case 'legendary': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleSaveProfile = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsEditing(false)
      toast.success('Profile updated successfully!', {
        description: 'Your changes have been saved.',
        icon: '✨'
      })
    }, 1500)
  }

  const handleShareProgress = () => {
    setShowShareModal(true)
  }

  const handleExportData = () => {
    toast.success('Data export started', {
      description: 'Your data will be downloaded shortly.',
      icon: '📥'
    })
  }

  const handleLogout = () => {
    // Implement logout logic
    toast.info('Logging out...')
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
            {/* Breadcrumb Navigation for SEO */}
            <motion.nav 
              variants={itemVariants}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2"
              aria-label="Breadcrumb"
            >
              <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-gray-200 font-medium">Profile</span>
            </motion.nav>

            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.avatar}`} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500">
                    {userData.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      {userData.name}
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
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {userData.role} at {userData.university}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {userData.semester}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {userData.streak} day streak
                    </span>
                  </div>
                  {userData.bio && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                      {userData.bio}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 border-gray-300 dark:border-gray-600"
                        onClick={handleShareProgress}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share Progress</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 border-gray-300 dark:border-gray-600"
                        onClick={handleExportData}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export Data</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 border-gray-300 dark:border-gray-600">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <DropdownMenuItem onClick={handleEditProfile}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowSettings(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button 
                  onClick={handleEditProfile} 
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </motion.div>

            {/* Social Links & Contact Info */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              {userData.location && (
                <Badge variant="outline" className="gap-1 py-1.5">
                  <MapPin className="w-3 h-3" />
                  {userData.location}
                </Badge>
              )}
              {userData.socialLinks?.github && (
                <a href={userData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <Badge variant="outline" className="gap-1 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Github className="w-3 h-3" />
                    GitHub
                  </Badge>
                </a>
              )}
              {userData.socialLinks?.linkedin && (
                <a href={userData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Badge variant="outline" className="gap-1 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Linkedin className="w-3 h-3" />
                    LinkedIn
                  </Badge>
                </a>
              )}
              {userData.socialLinks?.twitter && (
                <a href={userData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Badge variant="outline" className="gap-1 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Twitter className="w-3 h-3" />
                    Twitter
                  </Badge>
                </a>
              )}
              {userData.website && (
                <a href={userData.website} target="_blank" rel="noopener noreferrer">
                  <Badge variant="outline" className="gap-1 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Globe className="w-3 h-3" />
                    Portfolio
                  </Badge>
                </a>
              )}
              <Badge variant="outline" className="gap-1 py-1.5">
                <Mail className="w-3 h-3" />
                {userData.email}
              </Badge>
            </motion.div>

            {/* XP Progress */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-lg dark:text-gray-200 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Progress to Level {userData.level + 1}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {userData.xp} / {userData.xp + userData.xpToNextLevel} XP
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                  {userData.xpToNextLevel} XP to next level
                </Badge>
              </div>
              <Progress 
                value={(userData.xp / (userData.xp + userData.xpToNextLevel)) * 100} 
                className="h-3 bg-gray-200 dark:bg-gray-700"
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {Object.entries(userData.stats).map(([key, value]) => (
                  <TooltipProvider key={key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-help">
                          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your {key} score is {value}%</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </motion.div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-auto overflow-x-auto">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Goals</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span className="hidden sm:inline">Achievements</span>
                </TabsTrigger>
                <TabsTrigger value="patterns" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Patterns</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Weekly Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                        <CalendarDays className="w-5 h-5 text-blue-500" />
                        Weekly Progress
                      </CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Daily completion rate and focus scores
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {weeklyProgress.map((day, index) => (
                          <motion.div
                            key={day.day}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium dark:text-gray-300">{day.day}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {day.completed}/{day.total} tasks
                                </span>
                                <Badge className={`${
                                  day.focus >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                  day.focus >= 80 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                  {day.focus}% focus
                                </Badge>
                              </div>
                            </div>
                            <Progress 
                              value={(day.completed / day.total) * 100} 
                              className="h-2"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t dark:border-gray-700 pt-4">
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        <Info className="w-3 h-3 inline mr-1" />
                        Best focus day: Wednesday (95%)
                      </p>
                    </CardFooter>
                  </Card>

                  {/* Goals Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                        <Target className="w-5 h-5 text-purple-500" />
                        Goals Progress
                      </CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Track progress towards your academic goals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {Object.entries(userData.goals).map(([key, goal], index) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                                  {key === 'dsa' && <BrainIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                                  {key === 'college' && <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />}
                                  {key === 'projects' && <Rocket className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                                </div>
                                <span className="font-medium capitalize dark:text-gray-300">{key}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {key === 'college' && goal.gpa && (
                                  <Badge variant="outline" className="border-blue-200 dark:border-blue-800">
                                    GPA: {goal.gpa}
                                  </Badge>
                                )}
                                <span className="text-sm font-medium">{goal.progress}%</span>
                              </div>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {goal.completed} of {goal.total} completed
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity Feed */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Your latest achievements and progress updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { time: '2 hours ago', activity: 'Completed 5 DSA problems', icon: BrainIcon, color: 'blue' },
                        { time: 'Yesterday', activity: 'Achieved 7-day streak', icon: Flame, color: 'orange' },
                        { time: '2 days ago', activity: 'Finished project documentation', icon: Rocket, color: 'purple' },
                        { time: '3 days ago', activity: 'Scored 95% on college test', icon: Star, color: 'green' },
                      ].map((activity, index) => {
                        const Icon = activity.icon
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                          >
                            <div className={`p-2 rounded-lg bg-${activity.color}-100 dark:bg-${activity.color}-900/30`}>
                              <Icon className={`w-4 h-4 text-${activity.color}-600 dark:text-${activity.color}-400`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium dark:text-gray-200">{activity.activity}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</p>
                            </div>
                            <Badge variant="outline">New</Badge>
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Goals Tab */}
              <TabsContent value="goals">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(userData.goals).map(([key, goal], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 capitalize dark:text-gray-200">
                            {key === 'dsa' && <BrainIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                            {key === 'college' && <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />}
                            {key === 'projects' && <Rocket className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                            {key} Mastery
                          </CardTitle>
                          <CardDescription className="dark:text-gray-400">
                            {key === 'dsa' && 'Complete 180+ DSA questions for placement preparation'}
                            {key === 'college' && 'Maintain 8.5+ CGPA throughout semester'}
                            {key === 'projects' && 'Build 3 major projects for portfolio'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold mb-2 dark:text-gray-200">{goal.progress}%</div>
                            <Progress value={goal.progress} className="h-3" />
                          </div>
                          
                          {key === 'dsa' && goal.topics && (
                            <div className="space-y-3 mt-4">
                              <h4 className="text-sm font-medium dark:text-gray-300">Topic Breakdown</h4>
                              {Object.entries(goal.topics).map(([topic, count], idx) => (
                                <div key={topic} className="space-y-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">{topic}</span>
                                    <span className="font-medium dark:text-gray-300">{count} solved</span>
                                  </div>
                                  <Progress value={(count / 40) * 100} className="h-1.5" />
                                </div>
                              ))}
                            </div>
                          )}

                          {key === 'projects' && goal.names && (
                            <div className="mt-4 space-y-2">
                              {goal.names.map((project, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <div className={`w-2 h-2 rounded-full ${idx < goal.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                                  <span className={idx < goal.completed ? 'line-through text-gray-500' : ''}>
                                    {project}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="border-t dark:border-gray-700 pt-4">
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Time Distribution */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                        <PieChart className="w-5 h-5 text-blue-500" />
                        Time Distribution (Weekly)
                      </CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        How you allocate your study hours
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { category: 'DSA Practice', hours: 35, percentage: 55, color: 'bg-blue-500' },
                          { category: 'College Studies', hours: 12, percentage: 19, color: 'bg-green-500' },
                          { category: 'Project Work', hours: 10, percentage: 16, color: 'bg-purple-500' },
                          { category: 'Skill Development', hours: 6, percentage: 9, color: 'bg-orange-500' },
                        ].map((item, index) => (
                          <motion.div
                            key={item.category}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                <span className="dark:text-gray-300">{item.category}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-medium dark:text-gray-200">{item.hours}h</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                  ({item.percentage}%)
                                </span>
                              </div>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Productivity Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Productivity Metrics
                      </CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Performance indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          { metric: 'Average Focus', value: '88%', change: '+5%', icon: Zap },
                          { metric: 'Task Completion', value: '92%', change: '+8%', icon: CheckCircle },
                          { metric: 'Study Sessions', value: '28/week', change: '+3', icon: Clock },
                          { metric: 'Break Efficiency', value: '76%', change: '+12%', icon: Award },
                        ].map((item, index) => (
                          <motion.div
                            key={item.metric}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                                <item.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <div className="font-medium dark:text-gray-300">{item.metric}</div>
                                <div className="text-xs text-green-600 dark:text-green-400">
                                  {item.change} from last week
                                </div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold dark:text-gray-200">{item.value}</div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                        onClick={() => setShowAchievementDetails(achievement)}
                        className="cursor-pointer"
                      >
                        <Card className={`h-full transition-all duration-300 ${
                          achievement.unlocked 
                            ? 'border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5 hover:shadow-xl' 
                            : 'opacity-70 hover:opacity-90'
                        }`}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-lg ${
                                achievement.unlocked 
                                  ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                                  : 'bg-gray-200 dark:bg-gray-700'
                              }`}>
                                <Icon className={`w-6 h-6 ${
                                  achievement.unlocked ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-bold dark:text-gray-200">{achievement.title}</h4>
                                  <Badge className={getRarityColor(achievement.rarity)}>
                                    {achievement.rarity}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  {achievement.description}
                                </p>
                                {achievement.progress !== undefined && (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-gray-500 dark:text-gray-500">Progress</span>
                                      <span className="font-medium">{achievement.progress}/10</span>
                                    </div>
                                    <Progress value={(achievement.progress / 10) * 100} className="h-1.5" />
                                  </div>
                                )}
                                {achievement.unlocked ? (
                                  <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Unlocked
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="mt-2">
                                    Locked
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Achievement Stats */}
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                        <Medal className="w-5 h-5 text-yellow-500" />
                        Achievement Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Total Achievements', value: achievements.filter(a => a.unlocked).length, total: achievements.length },
                          { label: 'Common', value: achievements.filter(a => a.unlocked && a.rarity === 'common').length },
                          { label: 'Rare', value: achievements.filter(a => a.unlocked && a.rarity === 'rare').length },
                          { label: 'Epic', value: achievements.filter(a => a.unlocked && a.rarity === 'epic').length },
                        ].map((stat, index) => (
                          <div key={index} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                            <div className="text-2xl font-bold dark:text-gray-200">
                              {stat.value}{stat.total ? `/${stat.total}` : ''}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Patterns Tab */}
              <TabsContent value="patterns">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                        <Clock className="w-5 h-5 text-blue-500" />
                        Daily Study Patterns
                      </CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Your productivity throughout the day
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {studyPatterns.map((pattern, index) => (
                          <motion.div
                            key={pattern.hour}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4"
                          >
                            <div className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400">
                              {pattern.hour}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="dark:text-gray-300">{pattern.activity}</span>
                                <span className="font-medium dark:text-gray-200">{pattern.efficiency}% efficiency</span>
                              </div>
                              <Progress 
                                value={pattern.efficiency} 
                                className={`h-2 ${
                                  pattern.period === 'early' ? 'bg-yellow-500' :
                                  pattern.period === 'morning' ? 'bg-green-500' :
                                  pattern.period === 'afternoon' ? 'bg-blue-500' :
                                  pattern.period === 'evening' ? 'bg-purple-500' :
                                  'bg-indigo-500'
                                }`}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t dark:border-gray-700 pt-4">
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        Peak productivity: 3-5 PM (92%)
                      </p>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Consistency Trends
                      </CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Your performance over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          { week: 'Week 1', consistency: 78, improvement: '+5%' },
                          { week: 'Week 2', consistency: 82, improvement: '+4%' },
                          { week: 'Week 3', consistency: 85, improvement: '+3%' },
                          { week: 'Week 4', consistency: 88, improvement: '+3%' },
                          { week: 'Week 5', consistency: 92, improvement: '+4%' },
                          { week: 'Week 6', consistency: 94, improvement: '+2%' },
                        ].map((week, index) => (
                          <motion.div
                            key={week.week}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium dark:text-gray-300">{week.week}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold dark:text-gray-200">{week.consistency}%</span>
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  {week.improvement}
                                </Badge>
                              </div>
                            </div>
                            <Progress value={week.consistency} className="h-2" />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* SEO-friendly content */}
            <motion.div variants={itemVariants} className="text-xs text-gray-500 dark:text-gray-500 text-center border-t border-gray-200 dark:border-gray-800 pt-6 mt-4">
              <p>
                Chronify AI profile dashboard helps you track your academic journey, monitor DSA progress, 
                maintain study streaks, and earn achievements. Perfect for students preparing for placements, 
                managing college coursework, and building project portfolios.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-gray-200">
              <Edit className="w-5 h-5" />
              Edit Profile
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Update your profile information and preferences
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                defaultValue={userData.name}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                defaultValue={userData.bio}
                className="dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input 
                  id="university" 
                  defaultValue={userData.university}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input 
                  id="semester" 
                  defaultValue={userData.semester}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                defaultValue={userData.location}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                defaultValue={userData.website}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Achievement Details Modal */}
      <Dialog open={!!showAchievementDetails} onOpenChange={() => setShowAchievementDetails(null)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          {showAchievementDetails && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 dark:text-gray-200">
                  <showAchievementDetails.icon className="w-5 h-5" />
                  {showAchievementDetails.title}
                </DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  {showAchievementDetails.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="font-medium dark:text-gray-300">Status</span>
                  <Badge className={showAchievementDetails.unlocked 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }>
                    {showAchievementDetails.unlocked ? 'Unlocked' : 'Locked'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="font-medium dark:text-gray-300">Rarity</span>
                  <Badge className={getRarityColor(showAchievementDetails.rarity)}>
                    {showAchievementDetails.rarity}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="font-medium dark:text-gray-300">Category</span>
                  <Badge variant="outline">
                    {showAchievementDetails.category}
                  </Badge>
                </div>

                {showAchievementDetails.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium dark:text-gray-300">Progress</span>
                      <span className="text-sm">{showAchievementDetails.progress}/10</span>
                    </div>
                    <Progress value={(showAchievementDetails.progress / 10) * 100} className="h-2" />
                  </div>
                )}

                {!showAchievementDetails.unlocked && showAchievementDetails.category === 'streak' && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      💡 Tip: Maintain your daily streak to unlock this achievement.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Progress Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-gray-200">
              <Share2 className="w-5 h-5" />
              Share Your Progress
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Choose how you want to share your achievements
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {[
              { platform: 'Twitter', icon: Twitter, color: 'blue' },
              { platform: 'LinkedIn', icon: Linkedin, color: 'blue' },
              { platform: 'Facebook', icon: Users, color: 'blue' },
              { platform: 'Copy Link', icon: Link, color: 'gray' },
            ].map((option) => {
              const Icon = option.icon
              return (
                <Button
                  key={option.platform}
                  variant="outline"
                  className="justify-start gap-3"
                  onClick={() => {
                    toast.success(`Shared to ${option.platform}`)
                    setShowShareModal(false)
                  }}
                >
                  <Icon className="w-4 h-4" />
                  Share on {option.platform}
                </Button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}