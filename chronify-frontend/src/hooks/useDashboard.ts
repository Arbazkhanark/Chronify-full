// src/hooks/useDashboard.ts
import { useEffect, useState, useCallback } from 'react'
import { AuthService } from '@/hooks/useAuth'

export interface DashboardOverview {
  user: { id: string; name: string; email: string; verified: boolean; avatarUrl: string | null }
  date: string
  timezone: string
  stats: {
    activeGoals: number
    tasksTodayTotal: number
    tasksTodayCompleted: number
    completionRate: number
    weeklyHours: number
    currentStreak: number
    bestStreak: number
    avgSleepHours: number
  }
  todayTasks: Array<{
    id: string; title: string; subject?: string
    startTime: string; endTime: string; duration: number
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    status: 'PENDING' | 'ONGOING' | 'COMPLETED' | 'MISSED' | 'SKIPPED' | 'DELAYED' | 'RESCHEDULED'
    category: string; color: string
    goalId?: string; goalTitle?: string
  }>
  goals: Array<{
    id: string; title: string; category: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'FAILED'
    progress: number; totalHours: number; completedHours: number
    milestonesTotal: number; milestonesCompleted: number
    targetDate: string | null; color: string
  }>
  weeklyActivity: Array<{
    day: string; dayFull: string; date: string
    hours: number; tasksCompleted: number
  }>
  sleepSchedule: Array<{
    day: string; dayFull: string
    bedtime: string; wakeTime: string; duration: number; type: string
  }>
  fixedTimes: Array<{
    id: string; title: string; type: string
    startTime: string; endTime: string; days: string[]; color: string
  }>
  insights: {
    mostProductiveDay: string | null
    mostProductiveTime: string | null
    averageFocusScore: number
    onTimeRate: number
  }
}

export function useDashboard() {
  const [data, setData] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOverview = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = AuthService.getAccessToken()
      if (!token) throw new Error('Not authenticated')

      const base = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8181/v0/api'
      const res = await fetch(`${base}/dashboard/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.message || 'Failed to load')
      setData(json.data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchOverview()
  }, [fetchOverview])

  return { data, loading, error, refetch: fetchOverview }
}