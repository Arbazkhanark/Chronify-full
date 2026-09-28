// src/lib/public-profile.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:8181/v0/api'

/* ============================================================================
   TYPES — Public profile (subset of full profile, no sensitive data)
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

  /* -------- Stats (only if `showStatsPublicly` is true) -------- */
  stats?: {
    totalGoals: number
    completedGoals: number
    currentStreak: number
    longestStreak: number
    totalHours: number
    completedTasks: number
    consistencyScore: number
  } | null

  /* -------- Viewer context (if logged in) -------- */
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
   ============================================================================ */

export async function getPublicProfile(
  username: string,
  signal?: AbortSignal
): Promise<PublicProfile> {
  const token = getAccessToken()

  const headers: Record<string, string> = {
    Accept: '*/*',
  }

  // Token is OPTIONAL — public profiles should work without login
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(
      `${API_BASE_URL}/users/get-profile-by-username?${encodeURIComponent(username)}`,
      {
        method: 'GET',
        headers,
        signal,
      }
    )
  } catch (err) {
    throw {
      success: false,
      message:
        err instanceof Error ? err.message : 'Network error occurred',
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
      if (message.toLowerCase().includes('private')) {
        reason = 'PRIVATE'
        message = message || 'This profile is private'
      } else if (message.toLowerCase().includes('connections')) {
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

  return data.data as unknown as PublicProfile
}