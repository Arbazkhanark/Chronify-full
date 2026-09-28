// src/lib/user-cache.ts
/* ============================================================================
   USER CACHE
   Handles the `user` object that AuthService persists for fast hydration.
   Keeps it in sync with the profile-cache and verification events.
   ============================================================================ */

const USER_CACHE_KEY = 'user' // adjust if AuthService uses a different key

export interface CachedUser {
  id: string
  name?: string
  email: string
  verified?: boolean
  timezone?: string | null
  onboardingStep?: number
  [key: string]: unknown
}

export function readUserCache(): CachedUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CachedUser
  } catch {
    return null
  }
}

export function writeUserCache(user: CachedUser): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user))
  } catch {
    /* ignore */
  }
}

export function patchUserCache(patch: Partial<CachedUser>): CachedUser | null {
  const current = readUserCache()
  if (!current) return null

  const next = { ...current, ...patch }
  writeUserCache(next)
  return next
}

export function clearUserCache(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(USER_CACHE_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Mark the cached user as verified (or unverified).
 * Returns the updated user object, or null if no cache existed.
 */
export function setUserVerified(verified: boolean): CachedUser | null {
  return patchUserCache({ verified })
}