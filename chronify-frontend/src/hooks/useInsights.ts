// src/hooks/useInsights.ts
import { useCallback, useEffect, useState } from 'react'
import { AuthService } from '@/hooks/useAuth'

export type InsightsRange = '4w' | '8w' | '12w' | 'all'

export interface PeakFocusWindow {
  startHour: number
  endHour: number
  label: string
  completions: number
}

export interface InsightsDayStat {
  dayFull: string
  day: string
  completions: number
  hours: number
}

export interface InsightsCategoryStat {
  category: string
  completions: number
  hours: number
}

export interface InsightsResponse {
  range: InsightsRange
  rangeLabel: string
  fromDate: string
  toDate: string
  totalCompletedTasks: number
  totalCompletedHours: number
  mostProductiveDay: string | null
  mostProductiveTime: string | null
  averageFocusScore: number
  onTimeRate: number
  peakFocusWindows: PeakFocusWindow[]
  byDay: InsightsDayStat[]
  byCategory: InsightsCategoryStat[]
}

export function useInsights(range: InsightsRange = '8w') {
  const [data, setData] = useState<InsightsResponse | null>(null)
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

      const res = await fetch(`${base}/dashboard/insights?range=${range}`, {
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
  }, [range])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}