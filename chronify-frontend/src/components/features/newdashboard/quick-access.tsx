// src/components/dashboard/quick-access.tsx
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Calendar, Target, BookOpen, Timer, Settings } from 'lucide-react'

export function QuickAccess() {
  const actions = [
    {
      icon: Plus,
      label: 'Add Task',
      description: 'Create new task',
      color: 'from-blue-500 to-cyan-500',
      href: '#',
    },
    {
      icon: Calendar,
      label: 'Schedule',
      description: 'Plan your week',
      color: 'from-purple-500 to-pink-500',
      href: '#',
    },
    {
      icon: Target,
      label: 'Set Goal',
      description: 'Define objectives',
      color: 'from-green-500 to-emerald-500',
      href: '#',
    },
    {
      icon: BookOpen,
      label: 'Start Session',
      description: 'Begin focused work',
      color: 'from-orange-500 to-red-500',
      href: '#',
    },
    {
      icon: Timer,
      label: 'Start Timer',
      description: 'Pomodoro timer',
      color: 'from-indigo-500 to-purple-500',
      href: '#',
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Customize app',
      color: 'from-gray-500 to-slate-500',
      href: '#',
    },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Quick Access</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Get things done faster
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group"
                onClick={() => window.location.href = action.href}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-medium text-sm mb-1">{action.label}</div>
                <div className="text-xs text-muted-foreground text-center">{action.description}</div>
              </motion.button>
            )
          })}
        </div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border"
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <span className="text-primary text-sm">💡</span>
            </div>
            <div>
              <div className="font-medium text-sm mb-1">Quick Tip</div>
              <p className="text-xs text-muted-foreground">
                Try the Pomodoro Technique: 25 minutes of focused work followed by 5-minute breaks.
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}