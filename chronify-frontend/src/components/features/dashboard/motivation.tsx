'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Trophy, 
  TrendingUp, 
  Target, 
  Quote,
  RefreshCw,
  Share2,
  Zap,
  Star
} from 'lucide-react'

export function MotivationWidget() {
  const [currentQuote, setCurrentQuote] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)

  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future depends on what you do today. - Mahatma Gandhi",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The secret of getting ahead is getting started. - Mark Twain",
    "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  ]

  const milestones = [
    { days: 7, title: 'Weekly Warrior', achieved: true },
    { days: 30, title: 'Monthly Master', achieved: false, progress: '7/30' },
    { days: 100, title: 'Century Club', achieved: false, progress: '7/100' },
  ]

  const achievements = [
    { icon: Trophy, title: 'Early Bird', description: 'Complete 5 morning sessions', progress: 3/5 },
    { icon: Target, title: 'Focused Pro', description: 'Maintain 90% focus for 7 days', progress: 0.86 },
    { icon: TrendingUp, title: 'Consistency King', description: '30-day streak', progress: 7/30 },
  ]

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setCurrentQuote(randomQuote)
  }, [])

  const nextQuote = () => {
    const currentIndex = quotes.indexOf(currentQuote)
    const nextIndex = (currentIndex + 1) % quotes.length
    setCurrentQuote(quotes[nextIndex])
  }

  const celebrate = () => {
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 2000)
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <CardTitle>Daily Motivation</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextQuote}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Quote
          </Button>
        </div>
        <CardDescription>Stay inspired on your journey</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Quote of the Day */}
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border">
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="italic text-lg mb-2">"{currentQuote.split(' - ')[0]}"</p>
                <p className="text-sm text-muted-foreground text-right">- {currentQuote.split(' - ')[1]}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Celebration Effect */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 1 }}
                  className="absolute"
                >
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Milestones */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Upcoming Milestones
          </h4>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.days}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    milestone.achieved
                      ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                      : 'bg-secondary'
                  }`}>
                    <Zap className={`w-5 h-5 ${
                      milestone.achieved ? 'text-white' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{milestone.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {milestone.achieved 
                        ? 'Achieved! 🎉'
                        : `${milestone.progress} days`
                      }
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{milestone.days}</div>
                  <div className="text-xs text-muted-foreground">days</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements Progress */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-purple-500" />
            Achievements Progress
          </h4>
          <div className="space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{achievement.title}</span>
                    </div>
                    <span className="text-sm font-bold">{Math.round(achievement.progress * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="gradient"
            className="flex-1 gap-2"
            onClick={celebrate}
          >
            <Sparkles className="w-4 h-4" />
            Celebrate Progress
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => console.log('Share progress')}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}