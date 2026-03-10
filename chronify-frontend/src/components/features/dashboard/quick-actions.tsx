'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Calendar, 
  Target, 
  BookOpen, 
  Timer, 
  Settings,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      icon: Plus,
      label: 'Add Task',
      description: 'Create new task',
      color: 'from-blue-500 to-cyan-500',
      href: '/dashboard/tasks/new',
    },
    {
      icon: Calendar,
      label: 'Schedule',
      description: 'Plan your week',
      color: 'from-purple-500 to-pink-500',
      href: '/dashboard/planner',
    },
    {
      icon: Target,
      label: 'Set Goal',
      description: 'Define objectives',
      color: 'from-green-500 to-emerald-500',
      href: '/dashboard/goals/new',
    },
    {
      icon: BookOpen,
      label: 'Start Session',
      description: 'Begin focused work',
      color: 'from-orange-500 to-red-500',
      href: '/dashboard/session',
    },
    {
      icon: Timer,
      label: 'Start Timer',
      description: 'Pomodoro timer',
      color: 'from-indigo-500 to-purple-500',
      href: '/dashboard/timer',
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Customize app',
      color: 'from-gray-500 to-slate-500',
      href: '/dashboard/settings',
    },
  ]

  const shortcuts = [
    { label: 'Export Data', icon: Download, action: () => console.log('Export') },
    { label: 'Sync Now', icon: RefreshCw, action: () => console.log('Sync') },
    { label: 'Share Progress', icon: Share2, action: () => console.log('Share') },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get things done faster</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Action Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                onClick={() => window.location.href = action.href}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="font-medium text-sm mb-1">{action.label}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </motion.button>
            )
          })}
        </div>

        {/* Shortcuts */}
        <div className="border-t border-border pt-6">
          <h4 className="font-medium mb-3">Quick Shortcuts</h4>
          <div className="flex flex-wrap gap-2">
            {shortcuts.map((shortcut, index) => {
              const Icon = shortcut.icon
              return (
                <motion.div
                  key={shortcut.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shortcut.action}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {shortcut.label}
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border">
          <h4 className="font-medium mb-2">💡 Quick Tip</h4>
          <p className="text-sm text-muted-foreground">
            Try breaking your study sessions into 25-minute blocks with 5-minute breaks (Pomodoro Technique) for better focus and retention.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}