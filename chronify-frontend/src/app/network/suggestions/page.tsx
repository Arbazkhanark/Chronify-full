// src/app/network/suggestions/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Loader2,
  Lock,
  RefreshCw,
  Search,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

const FETCH_LIMIT = 50
const MIN_SCORE = 2 // hide ultra-weak suggestions

/* ============================================================================
   PAGE
   ============================================================================ */

export default function SuggestionsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [allSuggestions, setAllSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set())

  // Filters
  const [search, setSearch] = useState('')
  const [onlyWithMutuals, setOnlyWithMutuals] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'students' | 'mentors'>(
    'all',
  )

  /* ==========================================================
     FETCH
     ========================================================== */
  const fetchSuggestions = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('Session expired. Please login again.')
        setAllSuggestions([])
        return
      }

      const res = await fetch(
        `${API_BASE_URL}/users/suggestions?limit=${FETCH_LIMIT}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const json = await res.json().catch(() => null)

      if (!res.ok) {
        setError(
          (json && typeof json.message === 'string' && json.message) ||
            'Failed to load suggestions',
        )
        setAllSuggestions([])
        return
      }

      if (!json?.success || !Array.isArray(json.data)) {
        setAllSuggestions([])
        return
      }

      setAllSuggestions(json.data as Suggestion[])
    } catch (err: any) {
      console.error('[SuggestionsPage] fetch failed:', err)
      setError('Could not load suggestions')
      setAllSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      setAllSuggestions([])
      return
    }
    void fetchSuggestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  /* ==========================================================
     CONNECT
     ========================================================== */
  const handleConnect = async (s: Suggestion) => {
    if (!user) {
      toast.error('Please login to connect')
      return
    }

    // Optimistic
    setRequestedIds((prev) => new Set(prev).add(s.id))

    try {
      // 🔥 TODO: Replace with your real friend-request endpoint
      // await fetch(`${API_BASE_URL}/friends/request`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ receiverId: s.id }),
      // })

      await new Promise((r) => setTimeout(r, 500)) // simulated

      toast.success('Connection request sent', {
        description: `Request sent to ${s.name}`,
        duration: 3000,
      })
    } catch (err: any) {
      // Rollback
      setRequestedIds((prev) => {
        const next = new Set(prev)
        next.delete(s.id)
        return next
      })
      toast.error('Could not send request', {
        description: err?.message || 'Please try again',
      })
    }
  }

  /* ==========================================================
     FILTERED LIST
     ========================================================== */
  const filteredSuggestions = useMemo(() => {
    let list = allSuggestions

    // Hide ultra-weak suggestions
    list = list.filter((s) => s.score >= MIN_SCORE)

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.userName ?? '').toLowerCase().includes(q) ||
          (s.profession ?? '').toLowerCase().includes(q) ||
          (s.city ?? '').toLowerCase().includes(q) ||
          s.fields.some((f) => f.toLowerCase().includes(q)) ||
          s.subFields.some((f) => f.toLowerCase().includes(q)),
      )
    }

    // Only with mutuals
    if (onlyWithMutuals) {
      list = list.filter((s) => s.mutualConnections > 0)
    }

    // Tab
    if (activeTab === 'students') {
      list = list.filter((s) => s.accountType === 'STUDENT')
    } else if (activeTab === 'mentors') {
      list = list.filter((s) => s.accountType === 'MENTOR')
    }

    return list
  }, [allSuggestions, search, onlyWithMutuals, activeTab])

  /* ==========================================================
     COUNTS (for tabs)
     ========================================================== */
  const counts = useMemo(() => {
    const base = allSuggestions.filter((s) => s.score >= MIN_SCORE)
    return {
      all: base.length,
      students: base.filter((s) => s.accountType === 'STUDENT').length,
      mentors: base.filter((s) => s.accountType === 'MENTOR').length,
    }
  }, [allSuggestions])

  /* ==========================================================
     RENDER
     ========================================================== */

  // Auth still loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Login required
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Sign in to see people you may know and grow your network.
          </p>
          <Link href="/auth/login">
            <Button className="w-full">Login to continue</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ============ HEADER ============ */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              People you may know
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Based on mutual connections, shared interests, university, and
              company.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchSuggestions()}
            disabled={loading}
            className="gap-1.5 flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* ============ FILTERS ============ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, skill, city, profession..."
              className="pl-9 pr-9"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tabs + mutual toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                All ({counts.all})
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  activeTab === 'students'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Students ({counts.students})
              </button>
              <button
                onClick={() => setActiveTab('mentors')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  activeTab === 'mentors'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Mentors ({counts.mentors})
              </button>
            </div>

            <button
              onClick={() => setOnlyWithMutuals((v) => !v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                onlyWithMutuals
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Mutual connections only
            </button>
          </div>
        </div>

        {/* ============ CONTENT ============ */}

        {/* Loading */}
        {loading && allSuggestions.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <X className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {error}
            </p>
            <Button
              variant="outline"
              onClick={() => void fetchSuggestions()}
              className="gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try again
            </Button>
          </div>
        )}

        {/* Empty (no suggestions at all) */}
        {!loading &&
          !error &&
          allSuggestions.filter((s) => s.score >= MIN_SCORE).length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                No suggestions right now
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Complete your profile (fields, education, experience) to get
                better suggestions.
              </p>
              <Link href="/profile" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Complete your profile
                </Button>
              </Link>
            </div>
          )}

        {/* Empty after filters */}
        {!loading &&
          !error &&
          allSuggestions.filter((s) => s.score >= MIN_SCORE).length > 0 &&
          filteredSuggestions.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No results match your filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('')
                  setOnlyWithMutuals(false)
                  setActiveTab('all')
                }}
                className="mt-3"
              >
                Clear filters
              </Button>
            </div>
          )}

        {/* Grid of suggestions */}
        {!loading && !error && filteredSuggestions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuggestions.map((s) => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                requested={requestedIds.has(s.id)}
                onConnect={() => void handleConnect(s)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ============================================================================
   SUGGESTION CARD
   ============================================================================ */

function SuggestionCard({
  suggestion: s,
  requested,
  onConnect,
}: {
  suggestion: Suggestion
  requested: boolean
  onConnect: () => void
}) {
  const profileHref = s.userName
    ? `/u/${encodeURIComponent(s.userName)}`
    : '#'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
      {/* ---------- COVER ---------- */}
      <div className="h-16 bg-gradient-to-br from-primary/70 to-accent/70" />

      {/* ---------- BODY ---------- */}
      <div className="px-4 pb-4 -mt-8 flex-1 flex flex-col">
        {/* Avatar */}
        <Link href={profileHref} className="self-start">
          <div className="rounded-full ring-4 ring-white dark:ring-gray-800">
            <UserAvatar name={s.name} avatarUrl={s.avatarUrl} size={56} />
          </div>
        </Link>

        {/* Name */}
        <Link
          href={profileHref}
          className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline truncate"
        >
          {s.name}
        </Link>

        {/* Handle */}
        {s.userName && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            @{s.userName}
          </p>
        )}

        {/* Profession / location */}
        <div className="mt-1 space-y-0.5 min-h-[32px]">
          {s.profession && (
            <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {s.profession}
            </p>
          )}
          {(s.city || s.country) && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {[s.city, s.country].filter(Boolean).join(', ')}
            </p>
          )}
        </div>

        {/* Mutual connections badge */}
        {s.mutualConnections > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex -space-x-1.5">
              {Array.from({ length: Math.min(s.mutualConnections, 3) }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 ring-2 ring-white dark:ring-gray-800"
                  />
                ),
              )}
            </div>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              {s.mutualConnections} mutual
            </span>
          </div>
        )}

        {/* Reasons — show up to 2 */}
        {s.reasons.length > 0 && (
          <ul className="mt-2 space-y-0.5">
            {s.reasons.slice(0, 2).map((r, i) => (
              <li
                key={i}
                className="text-[11px] text-gray-500 dark:text-gray-400 truncate"
                title={r}
              >
                • {r}
              </li>
            ))}
            {s.reasons.length > 2 && (
              <li className="text-[11px] text-gray-400 dark:text-gray-500">
                +{s.reasons.length - 2} more
              </li>
            )}
          </ul>
        )}

        {/* Skills chips (up to 3) */}
        {s.subFields.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {s.subFields.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {skill}
              </span>
            ))}
            {s.subFields.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                +{s.subFields.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          <Link href={profileHref} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View
            </Button>
          </Link>

          <Button
            size="sm"
            variant={requested ? 'secondary' : 'default'}
            className="flex-1"
            disabled={requested}
            onClick={onConnect}
          >
            {requested ? (
              <>
                <UserCheck className="w-3.5 h-3.5 mr-1" />
                Sent
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5 mr-1" />
                Connect
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}