'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Clock, Target, Zap, TrendingDown, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function StatsCards() {
  const stats = [
    {
      title: 'Current Streak',
      value: '7 days',
      change: '+2 days',
      trend: 'up',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      description: 'Keep going!',
    },
    {
      title: 'Focus Time',
      value: '32h 15m',
      change: '+5h 30m',
      trend: 'up',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      description: 'This week',
    },
    {
      title: 'Task Completion',
      value: '84%',
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      description: '24/28 tasks done',
    },
    {
      title: 'Consistency Score',
      value: '92',
      change: '-3 points',
      trend: 'down',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      description: 'Weekly average',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="border-border/50 hover:border-primary/30 transition-all hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold">{stat.value}</h3>
                      <span className={`text-sm font-medium flex items-center gap-1 ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{stat.description}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{stat.title === 'Task Completion' ? '84%' : '92%'}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: stat.title === 'Task Completion' ? '84%' : '92%' }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full rounded-full ${
                        stat.title === 'Current Streak' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                        stat.title === 'Focus Time' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        stat.title === 'Task Completion' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}