// src/components/dashboard/task-manager.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare, Plus, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function TaskManager() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete DSA Array Problems', category: 'DSA', priority: 'high', completed: false },
    { id: 2, title: 'Finish Web Development Project', category: 'Projects', priority: 'medium', completed: true },
    { id: 3, title: 'Watch ML Course - Module 3', category: 'Learning', priority: 'low', completed: false },
    { id: 4, title: 'Complete Database Assignment', category: 'College', priority: 'high', completed: false },
    { id: 5, title: 'Prepare for Mock Interview', category: 'Interview', priority: 'medium', completed: false },
  ])

  const [filter, setFilter] = useState('all')

  const handleToggle = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    if (filter === 'high') return task.priority === 'high'
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-500'
      case 'medium': return 'bg-yellow-500/20 text-yellow-500'
      default: return 'bg-blue-500/20 text-blue-500'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DSA': return 'bg-purple-500/20 text-purple-500'
      case 'Projects': return 'bg-green-500/20 text-green-500'
      case 'Learning': return 'bg-blue-500/20 text-blue-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Task Manager</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {tasks.filter(t => !t.completed).length} pending tasks
              </p>
            </div>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'completed', 'high'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'high' && ' Priority'}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group",
                  task.completed
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-border hover:border-primary/30 hover:bg-primary/5"
                )}
              >
                <button
                  onClick={() => handleToggle(task.id)}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    task.completed
                      ? "border-green-500 bg-green-500"
                      : "border-muted-foreground/30 hover:border-primary"
                  )}
                >
                  {task.completed && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className={cn(
                      "font-medium truncate",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                      {task.category}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority} Priority
                    </div>
                  </div>
                </div>
                
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-secondary rounded-lg">
                  <Filter className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Task Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-3 gap-4"
        >
          {[
            { 
              label: 'Total', 
              value: tasks.length, 
              color: 'bg-primary/20 text-primary' 
            },
            { 
              label: 'Completed', 
              value: tasks.filter(t => t.completed).length, 
              color: 'bg-green-500/20 text-green-500' 
            },
            { 
              label: 'Pending', 
              value: tasks.filter(t => !t.completed).length, 
              color: 'bg-orange-500/20 text-orange-500' 
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-secondary/30"
            >
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  )
}