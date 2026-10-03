// src/hooks/usePublicProfile.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getPublicProfile,
  type PublicProfile,
  type PublicProfileApiError,
} from '@/lib/public-profile'

export interface UsePublicProfileResult {
  profile: PublicProfile | null
  isLoading: boolean
  error: PublicProfileApiError | null
  refetch: () => Promise<void>
}

/**
 * Always fetches fresh data from the API whenever `username` changes.
 * No client-side caching — profiles reflect real-time data.
 */
export function usePublicProfile(
  username: string | null | undefined,
  loading: boolean = true
): UsePublicProfileResult {
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(!!username)
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

      setIsLoading(true)
      setError(null)

      try {
        const data = await getPublicProfile(username, signal)
        if (!mountedRef.current) return

        setProfile(data)
        setError(null)
      } catch (err) {
        if (!mountedRef.current) return

        // Ignore aborts
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
    await load()
  }, [username, load])

  return { profile, isLoading, error, refetch }
}














// // // src/hooks/usePublicProfile.ts
// // 'use client'

// // import { useCallback, useEffect, useState } from 'react'
// // import { apiClient } from '@/lib/api-client'

// // export interface PublicEducation {
// //   id: string
// //   institution: string
// //   degree: string
// //   field?: string | null
// //   grade?: string | null
// //   startYear?: string | null
// //   endYear?: string | null
// //   isCurrent?: boolean
// // }

// // export interface PublicExperience {
// //   id: string
// //   role: string
// //   organization: string
// //   employmentType?: string
// //   startDate?: string | null
// //   endDate?: string | null
// //   isCurrent?: boolean
// // }

// // export interface PublicProfile {
// //   id: string
// //   name: string
// //   userName: string
// //   avatarUrl?: string | null
// //   coverPhoto?: string | null
// //   bio?: string | null
// //   profession?: string | null
// //   city?: string | null
// //   state?: string | null
// //   country?: string | null
// //   accountType?: 'STUDENT' | 'MENTOR'
// //   verified: boolean
// //   fields?: string[]
// //   subFields?: string[]
// //   education?: PublicEducation[]
// //   experience?: PublicExperience[]
// // }

// // /**
// //  * Fetch a user's public profile by username.
// //  * Caches result in memory for the session (per username).
// //  */
// // const memoryCache = new Map<string, PublicProfile>()

// // export function usePublicProfile(username: string | null | undefined) {
// //   const [profile, setProfile] = useState<PublicProfile | null>(null)
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState<string | null>(null)

// //   const load = useCallback(async () => {
// //     if (!username) return

// //     if (memoryCache.has(username)) {
// //       setProfile(memoryCache.get(username)!)
// //       return
// //     }

// //     setLoading(true)
// //     setError(null)
// //     try {
// //       const res = await apiClient.get<PublicProfile>(
// //         `/users/get-profile-by-username?username=${encodeURIComponent(username)}`,
// //       )
// //       if (res.data) {
// //         memoryCache.set(username, res.data)
// //         setProfile(res.data)
// //       }
// //     } catch (err) {
// //       const message = err instanceof Error ? err.message : 'Failed to load'
// //       setError(message)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }, [username])

// //   useEffect(() => {
// //     void load()
// //   }, [load])

// //   return { profile, loading, error, reload: load }
// // }