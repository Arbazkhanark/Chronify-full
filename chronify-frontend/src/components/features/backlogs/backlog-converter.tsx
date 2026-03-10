// src/components/features/backlogs/backlog-converter.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  ArrowRight, 
  Clock, 
  Calendar,
  Target,
  AlertCircle,
  Bookmark
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BacklogConverterProps {
  backlog?: any
  onSubmit: (data: any) => void
  onClose: () => void
}

export function BacklogConverter({ backlog, onSubmit, onClose }: BacklogConverterProps) {
  const [formData, setFormData] = useState({
    title: backlog?.title || '',
    description: backlog?.description || '',
    subject: backlog?.subject || '',
    priority: backlog?.priority || 'MEDIUM',
    estimatedDuration: backlog?.estimatedDuration || 60,
    targetDate: backlog?.targetDate 
      ? new Date(backlog.targetDate).toISOString().split('T')[0]
      : '',
    goalId: '',
    scheduleImmediately: false,
  })

  const mockGoals = [
    { id: '1', title: 'Complete DSA in 3 months' },
    { id: '2', title: 'Learn AI/ML Basics' },
    { id: '3', title: 'Build Portfolio Website' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const convertedTask = {
      ...formData,
      source: 'BACKLOG',
      backlogId: backlog?.id,
      status: 'PENDING',
      priority: formData.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
      estimatedDuration: parseInt(formData.estimatedDuration as any),
      targetDate: formData.targetDate ? new Date(formData.targetDate) : undefined,
    }
    
    onSubmit(convertedTask)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Convert to Task
                </h2>
                <p className="text-sm text-muted-foreground">
                  {backlog ? `Converting "${backlog.title}"` : 'Create new task from backlog'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Source backlog info */}
            {backlog && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Bookmark className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-medium">Converting from Backlog</h3>
                    <p className="text-sm text-muted-foreground">
                      Added on {backlog.addedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Original Priority</div>
                    <div className="font-medium">{backlog.priority}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Estimated Duration</div>
                    <div className="font-medium">{backlog.estimatedDuration || 'Not set'} minutes</div>
                  </div>
                </div>
              </div>
            )}

            {/* Task Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Solve Array Problems"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="subject">Subject/Topic</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  placeholder="e.g., DSA, AI/ML, Web Dev"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={value => setFormData({...formData, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        Low Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="MEDIUM">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        Medium Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="HIGH">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        High Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="CRITICAL">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Critical Priority
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="estimatedDuration">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Estimated Duration (minutes)
                  </div>
                </Label>
                <Input
                  id="estimatedDuration"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.estimatedDuration}
                  onChange={e => setFormData({...formData, estimatedDuration: parseInt(e.target.value)})}
                  placeholder="e.g., 60"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="goalId">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Link to Goal (Optional)
                  </div>
                </Label>
                <Select
                  value={formData.goalId}
                  onValueChange={value => setFormData({...formData, goalId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGoals.map(goal => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="targetDate">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Target Date
                  </div>
                </Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={e => setFormData({...formData, targetDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe what needs to be done, any prerequisites, or specific requirements..."
                rows={3}
              />
            </div>

            {/* Schedule options */}
            <div className="p-4 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <div>
                  <h3 className="font-medium">Scheduling Options</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose how to schedule this task
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleOption"
                    checked={!formData.scheduleImmediately}
                    onChange={() => setFormData({...formData, scheduleImmediately: false})}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <div className="font-medium">Add to Task Pool</div>
                    <div className="text-sm text-muted-foreground">
                      Task will be available in task pool for manual scheduling
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleOption"
                    checked={formData.scheduleImmediately}
                    onChange={() => setFormData({...formData, scheduleImmediately: true})}
                    className="w-4 h-4 text-primary"
                  />
                  <div>
                    <div className="font-medium">Schedule Immediately</div>
                    <div className="text-sm text-muted-foreground">
                      AI will suggest best time slot in your timetable
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent"
              >
                <ArrowRight className="w-4 h-4" />
                Convert to Task
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}