'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Calendar, Target, Clock } from 'lucide-react'

export function ProgressChart() {
  const weeklyData = [
    { day: 'Mon', hours: 4.5, tasks: 8, focus: 85 },
    { day: 'Tue', hours: 5.2, tasks: 10, focus: 92 },
    { day: 'Wed', hours: 3.8, tasks: 7, focus: 78 },
    { day: 'Thu', hours: 6.1, tasks: 12, focus: 95 },
    { day: 'Fri', hours: 4.9, tasks: 9, focus: 88 },
    { day: 'Sat', hours: 5.5, tasks: 11, focus: 90 },
    { day: 'Sun', hours: 3.2, tasks: 6, focus: 72 },
  ]

  const maxHours = Math.max(...weeklyData.map(d => d.hours))

  const categories = [
    { icon: Clock, label: 'Study Hours', value: '32h 15m', change: '+12%', color: 'from-blue-500 to-cyan-500' },
    { icon: Target, label: 'Tasks Completed', value: '63', change: '+8%', color: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, label: 'Focus Score', value: '86%', change: '+5%', color: 'from-purple-500 to-pink-500' },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Weekly Progress</CardTitle>
            <CardDescription>Your performance over the last 7 days</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-green-500">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">+8% overall</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="mb-8">
          <div className="flex items-end h-48 gap-2 mb-4">
            {weeklyData.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ height: 0 }}
                animate={{ height: `${(day.hours / maxHours) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="flex-1 flex flex-col items-center"
              >
                <div className="relative group w-full">
                  <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/80 to-accent/80 hover:from-primary hover:to-accent transition-all cursor-pointer"
                    style={{ height: `${(day.hours / maxHours) * 100}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border rounded-lg px-2 py-1 text-xs whitespace-nowrap">
                      <div className="font-medium">{day.hours}h</div>
                      <div className="text-muted-foreground">{day.tasks} tasks</div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{day.day}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-500">{category.change}</span>
                </div>
                <div className="text-2xl font-bold mb-1">{category.value}</div>
                <div className="text-sm text-muted-foreground">{category.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Insights */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border">
          <h4 className="font-medium mb-2">Weekly Insights</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Your best day was Thursday with 6.1 hours of focused work</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Focus score improved by 5% compared to last week</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>Try to maintain consistency on weekends for better results</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}