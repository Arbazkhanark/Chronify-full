// src/lib/profile-cache.ts
import type { ApiFullProfile, UiProfileData } from './full-profile'

/* ============================================================================
   PROFILE CACHE — localStorage + in-memory layer
   Strategy:
     - localStorage  → survives page refresh / browser restart (source of truth)
     - in-memory     → fastest, avoids JSON.parse on every render
   ============================================================================ */

const CACHE_KEY = 'chronify:profile:v1'
const CACHE_TTL_MS = 1000 * 60 * 30 // 30 min — stale-while-revalidate window

export interface ProfileCacheEntry {
  apiProfile: ApiFullProfile
  uiProfile: UiProfileData
  cachedAt: number
}

/* -------- in-memory mirror (fast path) -------- */
let memoryCache: ProfileCacheEntry | null = null

/* -------- helpers -------- */
const isBrowser = () => typeof window !== 'undefined'

export function readProfileCache(): ProfileCacheEntry | null {
  if (!isBrowser()) return null

  // 1) memory first
  if (memoryCache) return memoryCache

  // 2) localStorage
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ProfileCacheEntry

    if (!parsed?.apiProfile || !parsed?.uiProfile) return null

    memoryCache = parsed
    return parsed
  } catch {
    return null
  }
}

export function writeProfileCache(entry: {
  apiProfile: ApiFullProfile
  uiProfile: UiProfileData
}): void {
  if (!isBrowser()) return

  const full: ProfileCacheEntry = {
    apiProfile: entry.apiProfile,
    uiProfile: entry.uiProfile,
    cachedAt: Date.now(),
  }

  memoryCache = full

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(full))
  } catch (err) {
    // Quota exceeded — silently ignore (memory cache still works)
    console.warn('[profile-cache] write failed:', err)
  }
}

/**
 * Patch only the UI profile portion (e.g. after optimistic update).
 * Also merges the given patch into the cached apiProfile.profile.
 */
export function patchProfileCache(patch: Partial<UiProfileData>): void {
  const current = readProfileCache()
  if (!current) return

  const nextUi: UiProfileData = { ...current.uiProfile, ...patch }
  const nextApi: ApiFullProfile = {
    ...current.apiProfile,
    profile: current.apiProfile.profile
      ? { ...current.apiProfile.profile, ...(patch as any) }
      : current.apiProfile.profile,
  }

  writeProfileCache({ apiProfile: nextApi, uiProfile: nextUi })
}

export function clearProfileCache(): void {
  if (!isBrowser()) return
  memoryCache = null
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    /* ignore */
  }
}

export function isCacheStale(entry: ProfileCacheEntry | null): boolean {
  if (!entry) return true
  return Date.now() - entry.cachedAt > CACHE_TTL_MS
}