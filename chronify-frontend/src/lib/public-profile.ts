// src/lib/public-profile.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:8181/v0/api'

/* ============================================================================
   TYPES
   ============================================================================ */

export interface PublicSocialLink {
  id: string
  platform: string
  url: string
}

export interface PublicEducation {
  id: string
  institution: string
  degree: string
  field: string | null
  grade: string | null
  startYear: string | null
  endYear: string | null
  description: string | null
  location: string | null
  activities: string | null
  isCurrent: boolean
}

export interface PublicExperience {
  id: string
  role: string
  organization: string
  employmentType: string
  locationType: string
  startDate: string | null
  endDate: string | null
  isCurrent: boolean
  location: string | null
  description: string | null
  skills: string[]
  companyUrl: string | null
  companyLogo: string | null
}

export interface PublicProfileStats {
  totalGoals: number
  completedGoals: number
  currentStreak: number
  longestStreak: number
  totalHours: number
  completedTasks: number
  consistencyScore: number
}

export interface PublicProfile {
  id: string
  name: string
  userName: string
  accountType: 'STUDENT' | 'MENTOR'
  verified: boolean
  avatarUrl: string | null
  coverPhoto: string | null
  bio: string | null
  profession: string | null
  hobbies: string[]
  city: string | null
  state: string | null
  country: string | null
  fields: string[]
  subFields: string[]
  profileVisibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE'
  memberSince: string

  socialLinks: PublicSocialLink[]
  education: PublicEducation[]
  experience: PublicExperience[]

  stats?: PublicProfileStats | null

  isOwnProfile: boolean
  isConnected: boolean
  isPending: boolean
}

export interface PublicProfileApiError {
  success: false
  message: string
  status?: number
  reason?: 'NOT_FOUND' | 'PRIVATE' | 'FRIENDS_ONLY' | 'NETWORK'
}

/* ============================================================================
   HELPERS
   ============================================================================ */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

/* ============================================================================
   GET PUBLIC PROFILE
   ---------------------------------------------------------------------------
   - Uses correct URL: /users/get-profile-by-username?username=xxx
   - Sends the token if present (optional — works without login too)
   - Never caches — always fetches fresh data
   ============================================================================ */

export async function getPublicProfile(
  username: string,
  signal?: AbortSignal
): Promise<PublicProfile> {
  const trimmed = String(username ?? '').trim()

  if (!trimmed) {
    throw {
      success: false,
      message: 'Username is required',
      reason: 'NOT_FOUND',
    } satisfies PublicProfileApiError
  }

  const token = getAccessToken()

  const headers: Record<string, string> = {
    Accept: '*/*',
  }

  // Token is OPTIONAL
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  // ✅ CORRECT URL — the key "username" is REQUIRED
  const url = `${API_BASE_URL}/users/get-profile-by-username?username=${encodeURIComponent(trimmed)}`

  let response: Response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers,
      signal,
      cache: 'no-store', // always fresh
    })
  } catch (err) {
    throw {
      success: false,
      message: err instanceof Error ? err.message : 'Network error occurred',
      reason: 'NETWORK',
    } satisfies PublicProfileApiError
  }

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    let message = 'Failed to load profile'
    let reason: PublicProfileApiError['reason'] = undefined

    if (isRecord(data) && typeof data.message === 'string') {
      message = data.message
    }

    if (response.status === 404) {
      reason = 'NOT_FOUND'
      message = message || 'Profile not found'
    } else if (response.status === 403) {
      const lower = message.toLowerCase()
      if (lower.includes('private')) {
        reason = 'PRIVATE'
        message = message || 'This profile is private'
      } else if (lower.includes('connections')) {
        reason = 'FRIENDS_ONLY'
        message = message || 'This profile is visible to connections only'
      }
    }

    throw {
      success: false,
      message,
      status: response.status,
      reason,
    } satisfies PublicProfileApiError
  }

  if (!isRecord(data) || data.success !== true || !isRecord(data.data)) {
    throw {
      success: false,
      message: 'Malformed response from server',
    } satisfies PublicProfileApiError
  }

  const raw = data.data as Record<string, unknown>

  // 🔥 Normalize — make sure every field is safe (never undefined)
  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? ''),
    userName: String(raw.userName ?? ''),
    accountType: (raw.accountType as 'STUDENT' | 'MENTOR') ?? 'STUDENT',
    verified: raw.verified === true,
    avatarUrl: (raw.avatarUrl as string | null) ?? null,
    coverPhoto: (raw.coverPhoto as string | null) ?? null,
    bio: (raw.bio as string | null) ?? null,
    profession: (raw.profession as string | null) ?? null,
    hobbies: Array.isArray(raw.hobbies) ? (raw.hobbies as string[]) : [],
    city: (raw.city as string | null) ?? null,
    state: (raw.state as string | null) ?? null,
    country: (raw.country as string | null) ?? null,
    fields: Array.isArray(raw.fields) ? (raw.fields as string[]) : [],
    subFields: Array.isArray(raw.subFields) ? (raw.subFields as string[]) : [],
    profileVisibility:
      (raw.profileVisibility as 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE') ??
      'PUBLIC',
    memberSince: String(raw.memberSince ?? ''),
    socialLinks: Array.isArray(raw.socialLinks)
      ? (raw.socialLinks as PublicSocialLink[])
      : [],
    education: Array.isArray(raw.education)
      ? (raw.education as PublicEducation[])
      : [],
    experience: Array.isArray(raw.experience)
      ? (raw.experience as PublicExperience[])
      : [],
    stats:
      raw.stats && typeof raw.stats === 'object'
        ? (raw.stats as PublicProfileStats)
        : null,
    isOwnProfile: raw.isOwnProfile === true,
    isConnected: raw.isConnected === true,
    isPending: raw.isPending === true,
  }
}