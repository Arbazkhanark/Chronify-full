// src/components/dashboard/progress-insights.tsx
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, BarChart3 } from 'lucide-react'

export function ProgressInsights() {
  const weeklyData = [
    { day: 'Mon', hours: 4.5, focus: 85 },
    { day: 'Tue', hours: 5.2, focus: 92 },
    { day: 'Wed', hours: 3.8, focus: 78 },
    { day: 'Thu', hours: 6.1, focus: 95 },
    { day: 'Fri', hours: 4.9, focus: 88 },
    { day: 'Sat', hours: 5.5, focus: 90 },
    { day: 'Sun', hours: 3.2, focus: 72 },
  ]

  const maxHours = Math.max(...weeklyData.map(d => d.hours))

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Weekly Progress</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Your performance over the last 7 days
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-500 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+8% from last week</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart */}
          <div className="h-48">
            <div className="flex items-end h-full gap-2">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center">
                  <div className="relative group w-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.hours / maxHours) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 to-primary/20 hover:from-primary hover:to-primary/40 transition-all duration-300 cursor-pointer"
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card border border-border rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                        <div className="font-medium">{day.hours}h</div>
                        <div className="text-muted-foreground">{day.focus}% focus</div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">{day.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Best Day', value: 'Thursday', detail: '6.1 hours' },
              { label: 'Total Focus', value: '32h 15m', detail: '+5h 30m' },
              { label: 'Avg. Focus', value: '86%', detail: '+5% from last week' },
            ].map((insight, index) => (
              <motion.div
                key={insight.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-4 rounded-xl bg-secondary/30"
              >
                <div className="text-sm text-muted-foreground mb-1">{insight.label}</div>
                <div className="text-lg font-semibold mb-1">{insight.value}</div>
                <div className="text-sm text-muted-foreground">{insight.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}