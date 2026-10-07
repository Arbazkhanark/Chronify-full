// src/hooks/useWeeklyActivity.ts
import { useCallback, useEffect, useState } from 'react'
import { AuthService } from '@/hooks/useAuth'

export interface WeeklyActivityDay {
  day: string
  dayFull: string
  date: string
  hours: number
  tasksCompleted: number
}

export interface WeeklyActivityResponse {
  weekStart: string
  weekEnd: string
  weekOffset: number
  totalHours: number
  totalTasksCompleted: number
  averageHoursPerDay: number
  bestDay: WeeklyActivityDay | null
  days: WeeklyActivityDay[]
}

export function useWeeklyActivity(weekOffset = 0) {
  const [data, setData] = useState<WeeklyActivityResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = AuthService.getAccessToken()
      if (!token) throw new Error('Not authenticated')

      const base =
        process.env.NEXT_PUBLIC_BACKEND_API_URL ||
        'http://localhost:8181/v0/api'

      const res = await fetch(
        `${base}/dashboard/weekly-activity?weekOffset=${weekOffset}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error(`Failed: ${res.status}`)

      const json = await res.json()
      if (!json.success) throw new Error(json.message || 'Failed to load')
      setData(json.data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [weekOffset])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}