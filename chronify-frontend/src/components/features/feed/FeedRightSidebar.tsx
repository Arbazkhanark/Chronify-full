// src/components/features/feed/FeedRightSidebar.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  UserPlus,
  Hash,
  Sparkles,
  Loader2,
  Lock,
  CheckCircle2,
  RefreshCw,
  X,
  UserCheck,
} from 'lucide-react'
import { toast } from 'sonner'

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

const SUGGESTIONS_LIMIT = 5

/* ============================================================================
   COMPONENT
   ============================================================================ */

export default function FeedRightSidebar() {
  const { user, loading: authLoading } = useAuth()

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null)

  // Track which users we've just sent a request to (optimistic UI)
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set())

  /* ==========================================================
     FETCH SUGGESTIONS — only when user is logged in
     ========================================================== */
  useEffect(() => {
    // Not logged in → nothing to fetch, bail out.
    if (!user) {
      setSuggestions([])
      setSuggestionsError(null)
      return
    }

    let isMounted = true

    const fetchSuggestions = async () => {
      setLoadingSuggestions(true)
      setSuggestionsError(null)

      try {
        const token = localStorage.getItem('access_token')

        if (!token) {
          // Token missing despite user being present — edge case.
          if (isMounted) {
            setSuggestionsError('Session expired. Please login again.')
            setSuggestions([])
          }
          return
        }

        const res = await fetch(
          `${API_BASE_URL}/users/suggestions?limit=${SUGGESTIONS_LIMIT}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const json = await res.json().catch(() => null)

        if (!res.ok) {
          const message =
            (json && typeof json.message === 'string' && json.message) ||
            'Failed to load suggestions'

          if (isMounted) {
            setSuggestionsError(message)
            setSuggestions([])
          }
          return
        }

        if (!json || !json.success || !Array.isArray(json.data)) {
          if (isMounted) {
            setSuggestions([])
          }
          return
        }

        if (isMounted) {
          setSuggestions(json.data as Suggestion[])
        }
      } catch (err: any) {
        console.error('[FeedRightSidebar] fetch suggestions failed:', err)
        if (isMounted) {
          setSuggestionsError('Could not load suggestions')
          setSuggestions([])
        }
      } finally {
        if (isMounted) {
          setLoadingSuggestions(false)
        }
      }
    }

    void fetchSuggestions()

    return () => {
      isMounted = false
    }
  }, [user])

  /* ==========================================================
     SEND CONNECTION REQUEST (optimistic UI)
     ==========================================================
     ⚠️ The backend endpoint for friend requests is not part of
     this file's scope. We do an optimistic "Requested" state
     and a toast so the user gets feedback.

     When you're ready, replace the fake delay with:
       POST /friends/request  { receiverId: suggestion.id }
     ========================================================== */
  const handleConnect = async (suggestion: Suggestion) => {
    if (!user) {
      toast.error('Please login to connect')
      return
    }

    // Optimistic: mark as requested immediately.
    setRequestedIds((prev) => new Set(prev).add(suggestion.id))

    try {
      const token = localStorage.getItem('access_token')

      // 🔥 TODO: Replace with your real endpoint
      // const res = await fetch(`${API_BASE_URL}/friends/request`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ receiverId: suggestion.id }),
      // })
      // if (!res.ok) throw new Error('Request failed')

      // Simulated network delay (remove when real API is wired)
      await new Promise((r) => setTimeout(r, 500))

      toast.success('Connection request sent', {
        description: `Request sent to ${suggestion.name}`,
        duration: 3000,
      })
    } catch (err: any) {
      // Rollback optimistic state on error
      setRequestedIds((prev) => {
        const next = new Set(prev)
        next.delete(suggestion.id)
        return next
      })

      toast.error('Could not send request', {
        description: err?.message || 'Please try again',
      })
    }
  }

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <>
      {/* ============ TRENDING / FOR YOU CARD ============ */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            For you
          </h3>
        </div>

        <ul className="space-y-2 text-sm">
          <li>
            <Link
              href="/explore"
              className="flex items-start gap-2 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
            >
              <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  Trending topics
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  See what's popular today
                </p>
              </div>
            </Link>
          </li>

          <li>
            <Link
              href="/goals"
              className="flex items-start gap-2 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
            >
              <Hash className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  Goal challenges
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Join a challenge, build a streak
                </p>
              </div>
            </Link>
          </li>
        </ul>
      </div>

      {/* ============ PEOPLE YOU MAY KNOW ============ */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              People you may know
            </h3>
          </div>

          {/* Small refresh button — only when logged in and has data */}
          {user && !loadingSuggestions && suggestions.length > 0 && (
            <button
              type="button"
              onClick={() => {
                // Force re-fetch by toggling user dependency indirectly
                setSuggestions([])
                setSuggestionsError(null)
                // Trigger a one-shot re-fetch by calling a stale-safe helper:
                ;(async () => {
                  try {
                    const token = localStorage.getItem('access_token')
                    if (!token) return
                    setLoadingSuggestions(true)
                    const res = await fetch(
                      `${API_BASE_URL}/users/suggestions?limit=${SUGGESTIONS_LIMIT}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      },
                    )
                    const json = await res.json()
                    if (json?.success && Array.isArray(json.data)) {
                      setSuggestions(json.data as Suggestion[])
                    }
                  } catch (e) {
                    console.error(e)
                  } finally {
                    setLoadingSuggestions(false)
                  }
                })()
              }}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Refresh suggestions"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ---------- CASE 1: AUTH LOADING ---------- */}
        {authLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        )}

        {/* ---------- CASE 2: NOT LOGGED IN → LOGIN WALL ---------- */}
        {!authLoading && !user && (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Login to see suggestions
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Discover people with shared interests, university, or company.
            </p>
            <Link href="/auth/login">
              <Button size="sm" className="w-full">
                Login to unlock
              </Button>
            </Link>
          </div>
        )}

        {/* ---------- CASE 3: LOGGED IN → LOADING ---------- */}
        {!authLoading && user && loadingSuggestions && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        )}

        {/* ---------- CASE 4: LOGGED IN → ERROR ---------- */}
        {!authLoading && user && !loadingSuggestions && suggestionsError && (
          <div className="text-center py-4">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <X className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {suggestionsError}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-1.5"
              onClick={() => {
                // Simple retry — flip state so the effect runs again
                setSuggestionsError(null)
                setSuggestions([])
                // Trigger a re-fetch by re-running effect (dirty but works)
                if (typeof window !== 'undefined') {
                  // Force remount-style refetch by triggering a state update
                  // that the effect depends on. Simplest: reload.
                  // (Better: extract fetch into a callback — see note below.)
                  window.location.reload()
                }
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try again
            </Button>
          </div>
        )}

        {/* ---------- CASE 5: LOGGED IN → EMPTY ---------- */}
        {!authLoading &&
          user &&
          !loadingSuggestions &&
          !suggestionsError &&
          suggestions.length === 0 && (
            <div className="text-center py-4">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No suggestions right now. Check back later.
              </p>
            </div>
          )}

        {/* ---------- CASE 6: LOGGED IN → SHOW SUGGESTIONS ---------- */}
        {!authLoading &&
          user &&
          !loadingSuggestions &&
          !suggestionsError &&
          suggestions.length > 0 && (
            <div className="space-y-3">
              {suggestions.map((s) => {
                const requested = requestedIds.has(s.id)

                return (
                  <div key={s.id} className="flex items-start gap-3">
                    {/* Avatar */}
                    <Link
                      href={
                        s.userName
                          ? `/u/${encodeURIComponent(s.userName)}`
                          : '#'
                      }
                      className="flex-shrink-0"
                    >
                      <UserAvatar
                        name={s.name}
                        avatarUrl={s.avatarUrl}
                        size={40}
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Link
                          href={
                            s.userName
                              ? `/u/${encodeURIComponent(s.userName)}`
                              : '#'
                          }
                          className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:underline truncate"
                        >
                          {s.name}
                        </Link>

                        {s.accountType === 'MENTOR' && (
                          <CheckCircle2
                            className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"
                            aria-label="Mentor"
                          />
                        )}
                      </div>

                      {/* Reason line — most important reason shown */}
                      {s.reasons.length > 0 ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {s.reasons[0]}
                          {s.reasons.length > 1 && (
                            <span className="text-gray-400 dark:text-gray-500">
                              {' '}
                              +{s.reasons.length - 1} more
                            </span>
                          )}
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

                      {/* Mutual connections badge */}
                      {s.mutualConnections > 0 && (
                        <p className="text-[10px] text-primary mt-0.5 font-medium">
                          {s.mutualConnections} mutual connection
                          {s.mutualConnections > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    {/* Connect button */}
                    <Button
                      size="sm"
                      variant={requested ? 'secondary' : 'outline'}
                      className="h-7 px-2 text-xs flex-shrink-0"
                      disabled={requested}
                      onClick={() => void handleConnect(s)}
                    >
                      {requested ? (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" />
                          Sent
                        </>
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}

        {/* Show more — only when logged in and has suggestions */}
        {user && suggestions.length > 0 && (
          <Link
            href="/network/suggestions"
            className="block mt-3 text-xs text-primary hover:underline"
          >
            Show more
          </Link>
        )}
      </div>

      {/* ============ FOOTER LINKS ============ */}
      <div className="px-2 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-2 gap-y-1">
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/privacy" className="hover:underline">
          Privacy
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
      </div>
    </>
  )
}