'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  RefreshCw,
  Pencil,
  BookOpen,
  Coffee,
  GraduationCap,
  Dumbbell,
  Briefcase,
  Utensils,
  Moon,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

type TimetableSlot = {
  id?: string
  title?: string
  subject?: string
  description?: string
  day?: string
  dayOfWeek?: number
  startTime: string
  endTime: string
  duration?: number
  type?: string
  category?: string
  priority?: string
  color?: string
  isCompleted?: boolean
}

type TimetableSummary = {
  totalStudyHours: number
  totalSessions?: number
  averageSessionDuration?: number
  completionRate?: number
}

type GeneratedTimetableData = {
  slots: TimetableSlot[]
  summary: TimetableSummary
  userInput?: string
  generatedAt?: Date | string
  settings?: Record<string, unknown>
}

type GeneratedTimetableProps = {
  timetable: GeneratedTimetableData
  onEdit: () => void
  onRegenerate: () => void | Promise<void>
}

const DAY_NAMES: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
}

function getDayName(slot: TimetableSlot): string {
  if (typeof slot.day === 'string' && slot.day.trim()) {
    return slot.day
  }

  if (typeof slot.dayOfWeek === 'number') {
    return DAY_NAMES[slot.dayOfWeek] ?? 'Unknown Day'
  }

  return 'Schedule'
}

function getSlotIcon(type?: string) {
  switch (type?.toUpperCase()) {
    case 'BREAK':
      return Coffee

    case 'CLASS':
    case 'COLLEGE':
    case 'STUDY':
      return GraduationCap

    case 'WORKOUT':
    case 'HEALTH':
      return Dumbbell

    case 'WORK':
    case 'PROJECT':
    case 'MEETING':
      return Briefcase

    case 'MEAL':
      return Utensils

    case 'SLEEP':
      return Moon

    default:
      return BookOpen
  }
}

function formatDuration(duration?: number): string {
  if (typeof duration !== 'number' || duration <= 0) {
    return ''
  }

  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`
  }

  if (hours > 0) {
    return `${hours}h`
  }

  return `${minutes}m`
}

function calculateDuration(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(':').map(Number)
  const [endHours, endMinutes] = endTime.split(':').map(Number)

  if (
    !Number.isFinite(startHours) ||
    !Number.isFinite(startMinutes) ||
    !Number.isFinite(endHours) ||
    !Number.isFinite(endMinutes)
  ) {
    return 0
  }

  let start = startHours * 60 + startMinutes
  let end = endHours * 60 + endMinutes

  if (end < start) {
    end += 24 * 60
  }

  return end - start
}

function getDuration(slot: TimetableSlot): string {
  if (typeof slot.duration === 'number') {
    return formatDuration(slot.duration)
  }

  const calculated = calculateDuration(
    slot.startTime,
    slot.endTime,
  )

  return formatDuration(calculated)
}

function formatGeneratedDate(value?: Date | string): string {
  if (!value) {
    return ''
  }

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function GeneratedTimetable({
  timetable,
  onEdit,
  onRegenerate,
}: GeneratedTimetableProps) {
  const groupedSlots = useMemo(() => {
    const groups = new Map<string, TimetableSlot[]>()

    for (const slot of timetable.slots) {
      const day = getDayName(slot)

      const existing = groups.get(day)

      if (existing) {
        existing.push(slot)
      } else {
        groups.set(day, [slot])
      }
    }

    for (const slots of groups.values()) {
      slots.sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      )
    }

    return Array.from(groups.entries())
  }, [timetable.slots])

  const totalStudyHours =
    typeof timetable.summary.totalStudyHours === 'number'
      ? timetable.summary.totalStudyHours
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>

            <div>
              <h3 className="text-xl font-bold">
                Your AI Timetable
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                Optimized around your goals, availability and
                preferences.
              </p>

              {timetable.generatedAt && (
                <p className="text-xs text-muted-foreground mt-2">
                  Generated {formatGeneratedDate(timetable.generatedAt)}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onEdit}
              className="gap-2"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Button>

            <Button
              type="button"
              onClick={() => {
                void onRegenerate()
              }}
              disabled={timetable.slots.length === 0}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Study Hours
            </span>
          </div>

          <p className="text-2xl font-bold">
            {totalStudyHours}h
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Sessions
            </span>
          </div>

          <p className="text-2xl font-bold">
            {timetable.slots.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Avg. Session
            </span>
          </div>

          <p className="text-2xl font-bold">
            {typeof timetable.summary.averageSessionDuration ===
            'number'
              ? formatDuration(
                  timetable.summary.averageSessionDuration,
                )
              : timetable.slots.length > 0
                ? formatDuration(
                    Math.round(
                      (totalStudyHours * 60) /
                        timetable.slots.length,
                    ),
                  )
                : '0m'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Completion
            </span>
          </div>

          <p className="text-2xl font-bold">
            {typeof timetable.summary.completionRate === 'number'
              ? `${Math.round(timetable.summary.completionRate)}%`
              : '—'}
          </p>
        </motion.div>
      </div>

      {/* Timetable */}
      {groupedSlots.length > 0 ? (
        <div className="space-y-6">
          {groupedSlots.map(([day, slots]) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <h4 className="font-semibold">
                      {day}
                    </h4>

                    <p className="text-xs text-muted-foreground">
                      {slots.length}{' '}
                      {slots.length === 1
                        ? 'session'
                        : 'sessions'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {slots.map((slot, index) => {
                  const Icon = getSlotIcon(slot.type)

                  return (
                    <motion.div
                      key={
                        slot.id ??
                        `${day}-${slot.startTime}-${slot.endTime}-${index}`
                      }
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.03,
                      }}
                      className="relative flex gap-4 p-4 rounded-xl border border-border bg-background/50 hover:bg-muted/30 transition-colors"
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-primary"
                        style={
                          slot.color
                            ? {
                                backgroundColor:
                                  slot.color,
                              }
                            : undefined
                        }
                      />

                      <div className="flex-shrink-0 w-20 text-center">
                        <p className="text-sm font-semibold">
                          {slot.startTime}
                        </p>

                        <div className="my-1 h-px bg-border" />

                        <p className="text-xs text-muted-foreground">
                          {slot.endTime}
                        </p>
                      </div>

                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className="font-semibold truncate">
                              {slot.title || 'Study Session'}
                            </h5>

                            {slot.type && (
                              <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                                {slot.type}
                              </span>
                            )}
                          </div>

                          {slot.subject && (
                            <p className="text-sm text-primary mt-1">
                              {slot.subject}
                            </p>
                          )}

                          {slot.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {slot.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                            {getDuration(slot) && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {getDuration(slot)}
                              </span>
                            )}

                            {slot.category && (
                              <span>
                                {slot.category}
                              </span>
                            )}

                            {slot.priority && (
                              <span>
                                Priority: {slot.priority}
                              </span>
                            )}

                            {slot.isCompleted && (
                              <span className="text-green-600">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-dashed border-border text-center">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />

          <h4 className="font-semibold">
            No timetable slots found
          </h4>

          <p className="text-sm text-muted-foreground mt-1">
            Try generating the timetable again.
          </p>

          <Button
            type="button"
            onClick={() => {
              void onRegenerate()
            }}
            className="mt-4 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generate Again
          </Button>
        </div>
      )}
    </div>
  )
}
