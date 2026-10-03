// src/hooks/usePostAuthor.ts
'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'

export interface PostAuthorDetails {
  /** Account type — STUDENT | MENTOR */
  accountType?: 'STUDENT' | 'MENTOR'

  /** Working professional: current experience */
  currentRole?: {
    role: string
    organization: string
    employmentType?: string
  }

  /** Student: current education */
  currentEducation?: {
    institution: string
    degree: string
    field?: string | null
  }

  /** Fallback profession */
  profession?: string | null
}

/** In-memory cache: username → details */
const cache = new Map<string, PostAuthorDetails>()

export function usePostAuthor(username: string | null | undefined) {
  const [details, setDetails] = useState<PostAuthorDetails | null>(
    username ? cache.get(username) ?? null : null,
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!username) {
      setDetails(null)
      return
    }

    // cached?
    if (cache.has(username)) {
      setDetails(cache.get(username)!)
      return
    }

    let cancelled = false
    setLoading(true)

    const load = async () => {
      try {
        const res = await apiClient.get<{
          accountType?: 'STUDENT' | 'MENTOR'
          profession?: string | null
          education?: Array<{
            institution: string
            degree: string
            field?: string | null
            isCurrent?: boolean
          }>
          experience?: Array<{
            role: string
            organization: string
            employmentType?: string
            isCurrent?: boolean
          }>
        }>(`/users/get-profile-by-username?username=${encodeURIComponent(username)}`)

        if (cancelled || !res.data) return

        const data = res.data

        const currentExp = data.experience?.find((e) => e.isCurrent)
          ?? data.experience?.[0]
        const currentEdu = data.education?.find((e) => e.isCurrent)
          ?? data.education?.[0]

        const parsed: PostAuthorDetails = {
          accountType: data.accountType,
          profession: data.profession ?? null,
          currentRole: currentExp
            ? {
                role: currentExp.role,
                organization: currentExp.organization,
                employmentType: currentExp.employmentType,
              }
            : undefined,
          currentEducation: currentEdu
            ? {
                institution: currentEdu.institution,
                degree: currentEdu.degree,
                field: currentEdu.field ?? null,
              }
            : undefined,
        }

        cache.set(username, parsed)
        if (!cancelled) setDetails(parsed)
      } catch {
        // Silent fail — detail line simply won't render
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [username])

  return { details, loading }
}