'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function UpcomingTasks() {
  const [expanded, setExpanded] = useState(false)
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Complete DSA Array Problems', 
      dueDate: 'Today, 3:00 PM',
      priority: 'high',
      completed: false,
      category: 'DSA',
      timeEstimate: '2 hours',
      description: 'Solve 10 array problems from LeetCode'
    },
    { 
      id: 2, 
      title: 'Web Development Project', 
      dueDate: 'Tomorrow, 10:00 AM',
      priority: 'medium',
      completed: false,
      category: 'Projects',
      timeEstimate: '3 hours',
      description: 'Work on React components for dashboard'
    },
    { 
      id: 3, 
      title: 'Machine Learning Course', 
      dueDate: 'Dec 15, 2:00 PM',
      priority: 'low',
      completed: true,
      category: 'Learning',
      timeEstimate: '1.5 hours',
      description: 'Complete Module 3: Neural Networks'
    },
    { 
      id: 4, 
      title: 'Database Assignment', 
      dueDate: 'Dec 16, 11:59 PM',
      priority: 'high',
      completed: false,
      category: 'College',
      timeEstimate: '4 hours',
      description: 'Complete SQL queries for assignment'
    },
  ])

  const handleComplete = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <Calendar className="w-4 h-4 text-blue-500" />
    }
  }

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

  const displayedTasks = expanded ? tasks : tasks.slice(0, 3)

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>
              {tasks.filter(t => !t.completed).length} pending tasks
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="gap-2"
          >
            {expanded ? (
              <>
                Show Less
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show All
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          <div className="space-y-3">
            {displayedTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "group p-4 rounded-xl border transition-all",
                  task.completed 
                    ? "border-green-500/20 bg-green-500/5" 
                    : "border-border hover:border-primary/30 hover:bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleComplete(task.id)}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all",
                      task.completed
                        ? "border-green-500 bg-green-500"
                        : "border-muted-foreground/30 hover:border-primary"
                    )}
                  >
                    {task.completed && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-medium truncate",
                        task.completed && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-muted-foreground">{task.timeEstimate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(task.priority)}
                        <span className={`px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Add Task Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            variant="outline" 
            className="w-full mt-4 gap-2"
            onClick={() => window.location.href = '/dashboard/tasks/new'}
          >
            <Plus className="w-4 h-4" />
            Add New Task
          </Button>
        </motion.div>

        {/* Task Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Completed', value: tasks.filter(t => t.completed).length, total: tasks.length, color: 'bg-green-500' },
            { label: 'Pending', value: tasks.filter(t => !t.completed).length, total: tasks.length, color: 'bg-yellow-500' },
            { label: 'High Priority', value: tasks.filter(t => t.priority === 'high' && !t.completed).length, total: tasks.length, color: 'bg-red-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 rounded-xl bg-secondary/30"
            >
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="mt-2 w-full h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.value / stat.total) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full ${stat.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}