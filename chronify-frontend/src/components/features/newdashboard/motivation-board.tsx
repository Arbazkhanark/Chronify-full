// src/components/dashboard/motivation-board.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Trophy, TrendingUp, Quote, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MotivationBoard() {
  const [quote, setQuote] = useState('')
  const [streak, setStreak] = useState(7)

  const quotes = [
    "Consistency is what transforms average into excellence.",
    "Small disciplines repeated with consistency every day lead to great achievements.",
    "The only way to do great work is to love what you do.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future depends on what you do today.",
    "You are never too old to set another goal or to dream a new dream.",
  ]

  const milestones = [
    { days: 7, title: 'Weekly Warrior', achieved: true },
    { days: 30, title: 'Monthly Master', achieved: false },
    { days: 100, title: 'Century Club', achieved: false },
  ]

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(randomQuote)
  }, [])

  const nextQuote = () => {
    const currentIndex = quotes.indexOf(quote)
    const nextIndex = (currentIndex + 1) % quotes.length
    setQuote(quotes[nextIndex])
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Motivation</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Stay inspired on your journey
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Quote */}
        <motion.div
          key={quote}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border">
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="italic">"{quote}"</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextQuote}
                  className="mt-2 gap-2"
                >
                  <RefreshCw className="w-3 h-3" />
                  New quote
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Streak */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white text-sm">🔥</span>
              </div>
              <div>
                <div className="font-semibold">Current Streak</div>
                <div className="text-sm text-muted-foreground">{streak} days in a row</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-500">{streak}</div>
              <div className="text-sm text-muted-foreground">days</div>
            </div>
          </div>
          
          {/* Streak visualization */}
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i < streak ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-secondary'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Trophy className="w-4 h-4" />
            Milestones
          </div>
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.days}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                milestone.achieved
                  ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20'
                  : 'bg-secondary/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  milestone.achieved
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                    : 'bg-secondary'
                }`}>
                  {milestone.achieved ? (
                    <span className="text-white text-sm">🏆</span>
                  ) : (
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{milestone.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {milestone.achieved ? 'Achieved! 🎉' : `${milestone.days} days`}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{milestone.days}</div>
                <div className="text-xs text-muted-foreground">days</div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}