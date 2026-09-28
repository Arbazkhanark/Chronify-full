// src/hooks/usePublicProfile.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getPublicProfile,
  type PublicProfile,
  type PublicProfileApiError,
} from '@/lib/public-profile'

interface CacheEntry {
  data: PublicProfile
  fetchedAt: number
}

const CACHE_TTL_MS = 1000 * 60 * 5 // 5 min
const memoryCache = new Map<string, CacheEntry>()

export interface UsePublicProfileResult {
  profile: PublicProfile | null
  isLoading: boolean
  error: PublicProfileApiError | null
  refetch: () => Promise<void>
}

export function usePublicProfile(
  username: string | null | undefined
): UsePublicProfileResult {
  const [profile, setProfile] = useState<PublicProfile | null>(() => {
    if (!username) return null
    const cached = memoryCache.get(username)
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      return cached.data
    }
    return null
  })

  const [isLoading, setIsLoading] = useState(() => {
    if (!username) return false
    const cached = memoryCache.get(username)
    return !(cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS)
  })

  const [error, setError] = useState<PublicProfileApiError | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!username) {
        setProfile(null)
        setIsLoading(false)
        setError(null)
        return
      }

      // Cache hit?
      const cached = memoryCache.get(username)
      if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
        setProfile(cached.data)
        setIsLoading(false)
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const data = await getPublicProfile(username, signal)
        if (!mountedRef.current) return

        memoryCache.set(username, { data, fetchedAt: Date.now() })
        setProfile(data)
        setError(null)
      } catch (err) {
        if (!mountedRef.current) return

        if (err instanceof Error && err.name === 'AbortError') return

        const apiError = err as PublicProfileApiError
        setError(apiError)
        setProfile(null)
      } finally {
        if (mountedRef.current) setIsLoading(false)
      }
    },
    [username]
  )

  useEffect(() => {
    const abort = new AbortController()
    void load(abort.signal)
    return () => abort.abort()
  }, [load])

  const refetch = useCallback(async () => {
    if (!username) return
    memoryCache.delete(username)
    await load()
  }, [username, load])

  return { profile, isLoading, error, refetch }
}