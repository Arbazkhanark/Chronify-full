// src/modules/dashboard/dashboard.cache.ts
import NodeCache from 'node-cache'

/**
 * Shared in-memory cache for dashboard endpoints.
 * - Insights are expensive (scan weeks of tasks) → cache 5 min
 * - Weekly activity is medium → cache 60 s
 *
 * In a multi-instance deployment, swap this for Redis.
 */
export const dashboardCache = new NodeCache({
  stdTTL: 60,               // default 60s
  checkperiod: 120,
  useClones: false,
})

/** Invalidate everything cached for a user (call after any task/goal write) */
export function invalidateUserDashboardCache(userId: string) {
  const keys = dashboardCache.keys()
  const userKeys = keys.filter(
    k =>
      k.startsWith(`dashboard:${userId}:`) ||
      k.startsWith(`weekly:${userId}:`) ||
      k.startsWith(`insights:${userId}:`)
  )
  dashboardCache.del(userKeys)
}

export const CACHE_KEYS = {
  overview: (userId: string) => `dashboard:${userId}:overview`,
  weekly: (userId: string, weekOffset: number) =>
    `weekly:${userId}:${weekOffset}`,
  insights: (userId: string, range: string) =>
    `insights:${userId}:${range}`,
}