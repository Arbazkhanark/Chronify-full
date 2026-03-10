// components/profile-section.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  CalendarDays
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function ProfileSection() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data
  const userData = {
    name: 'Arbaz Khan',
    role: 'MCA Student',
    university: 'Amity University',
    semester: '3rd Semester',
    streak: 21,
    level: 5,
    xp: 850,
    xpToNextLevel: 150,
    avatar: 'AK',
    goals: {
      dsa: { completed: 120, total: 180, progress: 67 },
      college: { completed: 45, total: 60, progress: 75 },
      projects: { completed: 1, total: 3, progress: 33 }
    },
    stats: {
      weeklyHours: 62,
      productivity: 92,
      consistency: 85,
      focusScore: 88
    }
  }

  const achievements = [
    { id: 1, title: '7-Day Streak', description: '7 consecutive days of following schedule', icon: Trophy, unlocked: true },
    { id: 2, title: 'DSA Master', description: 'Completed 100 DSA problems', icon: Brain, unlocked: true },
    { id: 3, title: 'Early Bird', description: 'Started study sessions before 7 AM for 10 days', icon: Zap, unlocked: false },
    { id: 4, title: 'Weekend Warrior', description: 'Maintained schedule on weekends for 4 weeks', icon: CalendarDays, unlocked: true },
    { id: 5, title: 'Consistency King', description: '30-day perfect consistency streak', icon: TrendingUp, unlocked: false },
    { id: 6, title: 'Productivity Pro', description: 'Maintained 90%+ productivity for 2 weeks', icon: Star, unlocked: false }
  ]

  const weeklyProgress = [
    { day: 'Mon', completed: 8, total: 8, focus: 92 },
    { day: 'Tue', completed: 7, total: 8, focus: 88 },
    { day: 'Wed', completed: 8, total: 8, focus: 95 },
    { day: 'Thu', completed: 6, total: 8, focus: 85 },
    { day: 'Fri', completed: 7, total: 8, focus: 90 },
    { day: 'Sat', completed: 5, total: 6, focus: 82 },
    { day: 'Sun', completed: 4, total: 6, focus: 78 }
  ]

  const studyPatterns = [
    { hour: '6-8 AM', efficiency: 85, activity: 'Morning Study' },
    { hour: '8-10 AM', efficiency: 90, activity: 'College' },
    { hour: '10-12 PM', efficiency: 88, activity: 'DSA Practice' },
    { hour: '1-3 PM', efficiency: 75, activity: 'Post-lunch' },
    { hour: '3-5 PM', efficiency: 92, activity: 'Peak Focus' },
    { hour: '5-7 PM', efficiency: 70, activity: 'Evening Study' },
    { hour: '7-9 PM', efficiency: 80, activity: 'Project Work' }
  ]

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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.avatar}`} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500">
                  {userData.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  {userData.name}
                  <Badge variant="outline" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400">
                    Level {userData.level}
                  </Badge>
                </h1>
                <div className="flex items-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {userData.role}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {userData.semester}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {userData.streak} day streak
                  </span>
                </div>
              </div>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)} className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>

          {/* XP Progress */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">Progress to Level {userData.level + 1}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {userData.xp} / {userData.xp + userData.xpToNextLevel} XP
                </p>
              </div>
              <Badge variant="outline" className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                {userData.xpToNextLevel} XP to next level
              </Badge>
            </div>
            <Progress 
              value={(userData.xp / (userData.xp + userData.xpToNextLevel)) * 100} 
              className="h-3 bg-gray-200 dark:bg-gray-800"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {Object.entries(userData.stats).map(([key, value]) => (
                <div key={key} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <LineChart className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="patterns" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Patterns
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5" />
                      Weekly Progress
                    </CardTitle>
                    <CardDescription>Daily completion rate and focus scores</CardDescription>
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
                            <span className="font-medium">{day.day}</span>
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
                </Card>

                {/* Goals Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Goals Progress
                    </CardTitle>
                    <CardDescription>Track progress towards your academic goals</CardDescription>
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
                                {key === 'dsa' && <Brain className="w-4 h-4 text-blue-600" />}
                                {key === 'college' && <BookOpen className="w-4 h-4 text-green-600" />}
                                {key === 'projects' && <Users className="w-4 h-4 text-purple-600" />}
                              </div>
                              <span className="font-medium capitalize">{key}</span>
                            </div>
                            <span className="text-sm font-medium">{goal.progress}%</span>
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
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 capitalize">
                          {key === 'dsa' && <Brain className="w-5 h-5 text-blue-600" />}
                          {key === 'college' && <BookOpen className="w-5 h-5 text-green-600" />}
                          {key === 'projects' && <Users className="w-5 h-5 text-purple-600" />}
                          {key} Mastery
                        </CardTitle>
                        <CardDescription>
                          {key === 'dsa' && 'Complete 180+ DSA questions for placement preparation'}
                          {key === 'college' && 'Maintain 8.5+ CGPA throughout semester'}
                          {key === 'projects' && 'Build 3 major projects for portfolio'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold mb-2">{goal.progress}%</div>
                          <Progress value={goal.progress} className="h-3" />
                        </div>
                        <div className="space-y-2">
                          {key === 'dsa' && (
                            <>
                              <div className="flex items-center justify-between text-sm">
                                <span>Arrays</span>
                                <span className="font-medium">32/40</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Linked Lists</span>
                                <span className="font-medium">28/40</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Trees</span>
                                <span className="font-medium">25/40</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Graphs</span>
                                <span className="font-medium">18/40</span>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
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
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Time Distribution (Weekly)
                    </CardTitle>
                    <CardDescription>How you allocate your study hours</CardDescription>
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
                              <span>{item.category}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-medium">{item.hours}h</span>
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
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Productivity Metrics
                    </CardTitle>
                    <CardDescription>Performance indicators</CardDescription>
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
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                              <item.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="font-medium">{item.metric}</div>
                              <div className="text-sm text-green-600 dark:text-green-400">
                                {item.change} from last week
                              </div>
                            </div>
                          </div>
                          <div className="text-2xl font-bold">{item.value}</div>
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
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`h-full transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5' 
                        : 'opacity-70'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${
                            achievement.unlocked 
                              ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                              : 'bg-gray-200 dark:bg-gray-800'
                          }`}>
                            <achievement.icon className={`w-6 h-6 ${
                              achievement.unlocked ? 'text-white' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold mb-1">{achievement.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {achievement.description}
                            </p>
                            {achievement.unlocked ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Unlocked
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-gray-300 dark:border-gray-700">
                                Locked
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Patterns Tab */}
            <TabsContent value="patterns">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Daily Study Patterns
                    </CardTitle>
                    <CardDescription>Your productivity throughout the day</CardDescription>
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
                              <span>{pattern.activity}</span>
                              <span className="font-medium">{pattern.efficiency}% efficiency</span>
                            </div>
                            <Progress 
                              value={pattern.efficiency} 
                              className={`h-2 ${
                                pattern.efficiency >= 90 ? 'bg-green-500' :
                                pattern.efficiency >= 80 ? 'bg-blue-500' :
                                'bg-yellow-500'
                              }`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Consistency Trends
                    </CardTitle>
                    <CardDescription>Your performance over time</CardDescription>
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
                            <span className="font-medium">{week.week}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{week.consistency}%</span>
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
        </motion.div>
      </div>
    </div>
  )
}