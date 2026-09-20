// chronify-frontend/src/components/features/goal/goal-form.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  Calendar,
  Target,
  AlertCircle,
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

type GoalType =
  | 'SHORT_TERM'
  | 'MEDIUM_TERM'
  | 'LONG_TERM'

type GoalPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'

interface GoalFormData {
  title: string
  description: string
  type: GoalType
  priority: GoalPriority
  targetDate: string
  subjects: string
}

interface GoalSubmitData {
  title: string
  description: string
  type: GoalType
  priority: GoalPriority
  targetDate: Date
  subjects: string[]
}

interface GoalInitialData {
  title?: string
  description?: string
  type?: GoalType
  priority?: GoalPriority
  targetDate?: string | Date
  subjects?: string[]
}

interface GoalFormProps {
  onSubmit: (goal: GoalSubmitData) => void
  onClose: () => void
  initialData?: GoalInitialData
}

export function GoalForm({
  onSubmit,
  onClose,
  initialData,
}: GoalFormProps) {
  const [formData, setFormData] =
    useState<GoalFormData>({
      title: initialData?.title ?? '',
      description:
        initialData?.description ?? '',
      type:
        initialData?.type ?? 'SHORT_TERM',
      priority:
        initialData?.priority ?? 'MEDIUM',
      targetDate: initialData?.targetDate
        ? new Date(
            initialData.targetDate
          )
            .toISOString()
            .split('T')[0] ?? ''
        : '',
      subjects:
        initialData?.subjects?.join(', ') ?? '',
    })

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const subjects: string[] = formData.subjects
      .split(',')
      .map((subject: string) =>
        subject.trim()
      )
      .filter(
        (subject: string) =>
          subject.length > 0
      )

    onSubmit({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      priority: formData.priority,
      targetDate: new Date(
        formData.targetDate
      ),
      subjects,
    })

    onClose()
  }

  const updateFormData = <
    K extends keyof GoalFormData
  >(
    field: K,
    value: GoalFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
        }}
        className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  {initialData
                    ? 'Edit Goal'
                    : 'Create New Goal'}
                </h2>

                <p className="text-sm text-muted-foreground">
                  Set your target and track progress
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close goal form"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Main Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Goal Title */}
              <div className="space-y-3">
                <Label htmlFor="title">
                  Goal Title *
                </Label>

                <Input
                  id="title"
                  value={formData.title}
                  onChange={(event) =>
                    updateFormData(
                      'title',
                      event.target.value
                    )
                  }
                  placeholder="e.g., Complete DSA in 3 months"
                  required
                />
              </div>

              {/* Goal Type */}
              <div className="space-y-3">
                <Label htmlFor="type">
                  Goal Type
                </Label>

                <Select
                  value={formData.type}
                  onValueChange={(
                    value: string
                  ) => {
                    if (
                      value === 'SHORT_TERM' ||
                      value === 'MEDIUM_TERM' ||
                      value === 'LONG_TERM'
                    ) {
                      updateFormData(
                        'type',
                        value
                      )
                    }
                  }}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="SHORT_TERM">
                      Short Term (&lt; 1 month)
                    </SelectItem>

                    <SelectItem value="MEDIUM_TERM">
                      Medium Term (1-3 months)
                    </SelectItem>

                    <SelectItem value="LONG_TERM">
                      Long Term (&gt; 3 months)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <Label htmlFor="priority">
                  Priority
                </Label>

                <Select
                  value={formData.priority}
                  onValueChange={(
                    value: string
                  ) => {
                    if (
                      value === 'LOW' ||
                      value === 'MEDIUM' ||
                      value === 'HIGH' ||
                      value === 'CRITICAL'
                    ) {
                      updateFormData(
                        'priority',
                        value
                      )
                    }
                  }}
                >
                  <SelectTrigger id="priority">
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

              {/* Target Date */}
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
                  onChange={(event) =>
                    updateFormData(
                      'targetDate',
                      event.target.value
                    )
                  }
                  required
                />
              </div>
            </div>

            {/* Subjects */}
            <div className="space-y-3">
              <Label htmlFor="subjects">
                Subjects/Topics (comma separated)
              </Label>

              <Input
                id="subjects"
                value={formData.subjects}
                onChange={(event) =>
                  updateFormData(
                    'subjects',
                    event.target.value
                  )
                }
                placeholder="e.g., DSA, AI/ML, Web Development"
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="description">
                Description (Optional)
              </Label>

              <Textarea
                id="description"
                value={formData.description}
                onChange={(event) =>
                  updateFormData(
                    'description',
                    event.target.value
                  )
                }
                placeholder="Describe your goal, why it's important, and how you'll achieve it..."
                rows={3}
              />
            </div>

            {/* Warning */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />

              <p className="text-sm text-yellow-600">
                Once you create a timetable for
                this goal, it will be locked and
                cannot be edited. Make sure all
                details are correct.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="gap-2"
              >
                <Target className="w-4 h-4" />

                {initialData
                  ? 'Update Goal'
                  : 'Create Goal'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}