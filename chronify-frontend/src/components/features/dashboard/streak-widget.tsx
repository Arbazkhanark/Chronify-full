'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Flame, Trophy, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function StreakWidget() {
  const streakDays = 7
  const longestStreak = 14
  const weeklyGoal = 5

  // Generate streak calendar
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const hasStreak = i >= 23 // Last 7 days have streak
    const isToday = i === 29
    
    return {
      date,
      hasStreak,
      isToday,
      tasksCompleted: hasStreak ? Math.floor(Math.random() * 5) + 3 : 0,
    }
  })

  const achievements = [
    { icon: Trophy, title: '7-Day Streak', achieved: true, date: '2 days ago' },
    { icon: Star, title: 'Perfect Week', achieved: true, date: 'Yesterday' },
    { icon: Flame, title: '30-Day Master', achieved: false, progress: '7/30' },
    { icon: Zap, title: '100 Tasks', achieved: false, progress: '24/100' },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Consistency Streak
            </CardTitle>
            <CardDescription>Keep the fire burning! 🔥</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-500">{streakDays} days</div>
            <div className="text-sm text-muted-foreground">Current streak</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Streak Calendar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Last 30 Days</h4>
            <div className="text-sm text-muted-foreground">
              Longest: <span className="font-bold text-orange-500">{longestStreak} days</span>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {calendarDays.map((day, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.01 }}
                whileHover={{ scale: 1.1 }}
                className={`relative group`}
              >
                <div className={`w-full aspect-square rounded-md flex items-center justify-center ${
                  day.hasStreak
                    ? 'bg-gradient-to-br from-orange-500 to-red-500'
                    : 'bg-secondary'
                } ${day.isToday ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}>
                  {day.isToday && (
                    <span className="text-xs font-bold text-white">TODAY</span>
                  )}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <div>{day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                  <div className="text-muted-foreground">{day.tasksCompleted} tasks completed</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="font-medium mb-3">Recent Achievements</h4>
          <div className="space-y-2">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      achievement.achieved
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                        : 'bg-secondary'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        achievement.achieved ? 'text-white' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.achieved 
                          ? `Achieved ${achievement.date}`
                          : `Progress: ${achievement.progress}`
                        }
                      </div>
                    </div>
                  </div>
                  {achievement.achieved ? (
                    <div className="px-2 py-1 bg-green-500/20 text-green-500 text-xs font-medium rounded-full">
                      Unlocked
                    </div>
                  ) : (
                    <div className="px-2 py-1 bg-secondary text-muted-foreground text-xs font-medium rounded-full">
                      In Progress
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-medium">Weekly Goal</div>
              <div className="text-sm text-muted-foreground">{streakDays}/{weeklyGoal} days completed</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{Math.round((streakDays / weeklyGoal) * 100)}%</div>
            </div>
          </div>
          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(streakDays / weeklyGoal) * 100}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
          <Button className="w-full mt-4" variant="gradient">
            Continue Streak
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}