// src/modules/timetable/timetable.helpers.ts

import { DayOfWeek } from './timetable.types'

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Convert minutes since midnight to time string (HH:MM)
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/**
 * Calculate end time from start time and duration
 */
export const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + duration
  const endHours = Math.floor(totalMinutes / 60)
  const endMinutes = totalMinutes % 60
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
}

/**
 * Check if two time ranges overlap
 */
export const doTimeRangesOverlap = (
  start1: string, 
  end1: string, 
  start2: string, 
  end2: string
): boolean => {
  const s1 = timeToMinutes(start1)
  const e1 = timeToMinutes(end1)
  const s2 = timeToMinutes(start2)
  const e2 = timeToMinutes(end2)
  return s1 < e2 && s2 < e1
}

/**
 * Get today's day name (3-letter format)
 */
export const getTodayDay = (): DayOfWeek => {
  const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[new Date().getDay()]
}

/**
 * Get next day
 */
export const getNextDay = (currentDay: string): DayOfWeek => {
  const days: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const currentIndex = days.indexOf(currentDay as DayOfWeek)
  return days[(currentIndex + 1) % days.length]
}

/**
 * Normalize day string to 3-letter format
 */
export const normalizeDay = (day: string): DayOfWeek => {
  const dayMap: Record<string, DayOfWeek> = {
    'mon': 'Mon', 'monday': 'Mon', 'Mon': 'Mon', 'MONDAY': 'Mon',
    'tue': 'Tue', 'tuesday': 'Tue', 'Tue': 'Tue', 'TUESDAY': 'Tue',
    'wed': 'Wed', 'wednesday': 'Wed', 'Wed': 'Wed', 'WEDNESDAY': 'Wed',
    'thu': 'Thu', 'thursday': 'Thu', 'Thu': 'Thu', 'THURSDAY': 'Thu',
    'fri': 'Fri', 'friday': 'Fri', 'Fri': 'Fri', 'FRIDAY': 'Fri',
    'sat': 'Sat', 'saturday': 'Sat', 'Sat': 'Sat', 'SATURDAY': 'Sat',
    'sun': 'Sun', 'sunday': 'Sun', 'Sun': 'Sun', 'SUNDAY': 'Sun'
  }
  
  const normalized = dayMap[day.toLowerCase()]
  if (!normalized) {
    throw new Error(`Invalid day: ${day}`)
  }
  return normalized
}

/**
 * Convert 3-letter day to SleepDay enum
 */
export const convertToSleepDay = (day: DayOfWeek): string => {
  const map: Record<DayOfWeek, string> = {
    'Mon': 'MONDAY',
    'Tue': 'TUESDAY', 
    'Wed': 'WEDNESDAY',
    'Thu': 'THURSDAY',
    'Fri': 'FRIDAY',
    'Sat': 'SATURDAY',
    'Sun': 'SUNDAY'
  }
  return map[day]
}

/**
 * Format time for display (HH:MM AM/PM)
 */
export const formatTimeDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

/**
 * Check if task is in grace period (1 hour after end time)
 */
export const isInGracePeriod = (task: any): boolean => {
  if (task.status !== 'PENDING' && task.status !== 'ONGOING') {
    return false
  }

  const now = new Date()
  const [endHour, endMinute] = task.endTime.split(':').map(Number)
  const taskEnd = new Date(now)
  taskEnd.setHours(endHour, endMinute, 0, 0)

  const timeSinceEnd = (now.getTime() - taskEnd.getTime()) / 60000
  return timeSinceEnd > 0 && timeSinceEnd <= 60
}

/**
 * Calculate grace period end time
 */
export const calculateGracePeriodEnd = (task: any): Date | null => {
  if (task.status !== 'PENDING' && task.status !== 'ONGOING') {
    return null
  }

  const [endHour, endMinute] = task.endTime.split(':').map(Number)
  const taskEnd = new Date()
  taskEnd.setHours(endHour, endMinute, 0, 0)
  
  const gracePeriodEnd = new Date(taskEnd)
  gracePeriodEnd.setHours(gracePeriodEnd.getHours() + 1)
  
  return gracePeriodEnd
}