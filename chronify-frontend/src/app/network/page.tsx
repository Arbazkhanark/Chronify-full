// src/app/network/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Users,
  UserPlus,
  Inbox,
  UserCheck,
  Loader2,
  Lock,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import UserAvatar from '@/components/shared/UserAvatar'

/* ============================================================================
   TYPES
   ============================================================================ */

interface Suggestion {
  id: string
  name: string
  userName: string | null
  avatarUrl: string | null
  bio: string | null
  profession: string | null
  city: string | null
  country: string | null
  accountType: string | null
  fields: string[]
  subFields: string[]
  profileVisibility: string
  mutualConnections: number
  score: number
  reasons: string[]
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:8181/v0/api'

const PREVIEW_LIMIT = 6
const MIN_SCORE = 2

/* ============================================================================
   PAGE
   ============================================================================ */

export default function NetworkPage() {
  const { user, loading: authLoading } = useAuth()

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  /* ==========================================================
     FETCH — preview suggestions
     ========================================================== */
  useEffect(() => {
    if (!user) {
      setSuggestions([])
      return
    }

    let isMounted = true

    const fetchPreview = async () => {
      setLoadingSuggestions(true)
      try {
        const token = localStorage.getItem('access_token')
        if (!token) return

        const res = await fetch(
          `${API_BASE_URL}/users/suggestions?limit=${PREVIEW_LIMIT}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const json = await res.json().catch(() => null)
        if (!res.ok || !json?.success || !Array.isArray(json.data)) {
          return
        }

        if (isMounted) {
          setSuggestions(json.data as Suggestion[])
        }
      } catch (err) {
        console.error('[NetworkPage] fetch failed:', err)
      } finally {
        if (isMounted) setLoadingSuggestions(false)
      }
    }

    void fetchPreview()

    return () => {
      isMounted = false
    }
  }, [user])

  /* ==========================================================
     Filtered preview
     ========================================================== */
  const visibleSuggestions = useMemo(
    () => suggestions.filter((s) => s.score >= MIN_SCORE).slice(0, PREVIEW_LIMIT),
    [suggestions],
  )

  /* ==========================================================
     Auth loading
     ========================================================== */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  /* ==========================================================
     Not logged in
     ========================================================== */
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Your network awaits
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Login to discover people you may know, manage connections, and
            respond to requests.
          </p>
          <Link href="/auth/login">
            <Button className="w-full">Login to continue</Button>
          </Link>
        </div>
      </div>
    )
  }

  /* ==========================================================
     Main render
     ========================================================== */
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ============ HEADER ============ */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            My Network
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Grow your connections, discover new people, and stay in touch.
          </p>
        </div>

        {/* ============ QUICK STATS / TABS ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Suggestions card */}
          <Link
            href="/network/suggestions"
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 hover:border-primary/40 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  People you may know
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {loadingSuggestions
                    ? 'Loading…'
                    : visibleSuggestions.length > 0
                    ? `${visibleSuggestions.length} new suggestions`
                    : 'Suggestions coming up'}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition flex-shrink-0" />
            </div>
          </Link>

          {/* Connections card (placeholder) */}
          <Link
            href="/network/connections"
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 hover:border-primary/40 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  My Connections
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  View your connections
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition flex-shrink-0" />
            </div>
          </Link>

          {/* Requests card (placeholder) */}
          <Link
            href="/network/requests"
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 hover:border-primary/40 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Inbox className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Requests
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Pending friend requests
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition flex-shrink-0" />
            </div>
          </Link>
        </div>

        {/* ============ SUGGESTIONS PREVIEW ============ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Suggested for you
              </h2>
            </div>

            <Link
              href="/network/suggestions"
              className="text-xs text-primary hover:underline font-medium"
            >
              See all
            </Link>
          </div>

          {/* Loading */}
          {loadingSuggestions && visibleSuggestions.length === 0 && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          )}

          {/* Empty */}
          {!loadingSuggestions && visibleSuggestions.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No suggestions right now.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Complete your profile to get better suggestions.
              </p>
            </div>
          )}

          {/* Grid of preview cards */}
          {!loadingSuggestions && visibleSuggestions.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {visibleSuggestions.map((s) => {
                const profileHref = s.userName
                  ? `/u/${encodeURIComponent(s.userName)}`
                  : '#'

                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                  >
                    <Link href={profileHref} className="flex-shrink-0">
                      <UserAvatar
                        name={s.name}
                        avatarUrl={s.avatarUrl}
                        size={40}
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={profileHref}
                        className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:underline truncate block"
                      >
                        {s.name}
                      </Link>
                      {s.reasons[0] ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {s.reasons[0]}
                        </p>
                      ) : s.profession ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {s.profession}
                        </p>
                      ) : s.userName ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          @{s.userName}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ============ TIP CARD ============ */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-xl border border-primary/20 dark:border-primary/30 p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Grow your network faster
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Add your education, experience, and interests to your profile.
                You'll get smarter suggestions based on shared university,
                company, and skills.
              </p>
              <Link
                href="/profile"
                className="inline-block mt-3 text-xs font-medium text-primary hover:underline"
              >
                Update profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}