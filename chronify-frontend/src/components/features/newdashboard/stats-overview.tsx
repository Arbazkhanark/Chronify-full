// src/components/dashboard/stats-overview.tsx
'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Clock, Target, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function StatsOverview() {
  const stats = [
    {
      title: 'Current Streak',
      value: '7 days',
      change: '+2',
      icon: Zap,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      description: 'Keep going! 🔥',
    },
    {
      title: 'Focus Time',
      value: '32h 15m',
      change: '+5h 30m',
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'This week',
    },
    {
      title: 'Task Completion',
      value: '84%',
      change: '+12%',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: '24/28 tasks',
    },
    {
      title: 'Consistency Score',
      value: '92',
      change: '+3',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'Weekly average',
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {stat.title}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}