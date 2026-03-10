// src/components/features/goals/goal-form.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Calendar, Target, AlertCircle } from 'lucide-react'
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

interface GoalFormProps {
  onSubmit: (goal: any) => void
  onClose: () => void
  initialData?: any
}

export function GoalForm({ onSubmit, onClose, initialData }: GoalFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'SHORT_TERM',
    priority: initialData?.priority || 'MEDIUM',
    targetDate: initialData?.targetDate 
      ? new Date(initialData.targetDate).toISOString().split('T')[0]
      : '',
    subjects: initialData?.subjects?.join(', ') || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean),
      targetDate: new Date(formData.targetDate),
    })
    onClose()
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
        className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {initialData ? 'Edit Goal' : 'Create New Goal'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Set your target and track progress
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Complete DSA in 3 months"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="type">Goal Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={value => setFormData({...formData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SHORT_TERM">Short Term (&lt; 1 month)</SelectItem>
                    <SelectItem value="MEDIUM_TERM">Medium Term (1-3 months)</SelectItem>
                    <SelectItem value="LONG_TERM">Long Term (&gt; 3 months)</SelectItem>
                  </SelectContent>
                </Select>
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
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
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
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="subjects">Subjects/Topics (comma separated)</Label>
              <Input
                id="subjects"
                value={formData.subjects}
                onChange={e => setFormData({...formData, subjects: e.target.value})}
                placeholder="e.g., DSA, AI/ML, Web Development"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your goal, why it's important, and how you'll achieve it..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <p className="text-sm text-yellow-600">
                Once you create a timetable for this goal, it will be locked and cannot be edited. Make sure all details are correct.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <Target className="w-4 h-4" />
                {initialData ? 'Update Goal' : 'Create Goal'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}