// src/lib/full-profile.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:8181/v0/api'

/* ============================================================================
   TYPES
   ============================================================================ */

export type AccountType = 'STUDENT' | 'MENTOR'

export type ProfileVisibility = 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE'

export type SocialPlatform =
  | 'FACEBOOK'
  | 'TWITTER'
  | 'INSTAGRAM'
  | 'LINKEDIN'
  | 'YOUTUBE'
  | 'TIKTOK'
  | 'GITHUB'
  | 'OTHER'

export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'SELF_EMPLOYED'
  | 'FREELANCE'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'APPRENTICESHIP'
  | 'SEASONAL'

export type LocationType = 'ON_SITE' | 'REMOTE' | 'HYBRID'

export interface ApiSocialLink {
  id: string
  platform: SocialPlatform
  url: string
}

export interface ApiEducation {
  id: string
  profileId: string
  institution: string
  degree: string
  field: string | null
  grade: string | null
  startYear: string | null
  endYear: string | null
  startDate: string | null
  endDate: string | null
  description: string | null
  location: string | null
  activities: string | null
  isCurrent: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface ApiExperience {
  id: string
  profileId: string
  role: string
  organization: string
  employmentType: EmploymentType
  locationType: LocationType
  startDate: string | null
  endDate: string | null
  startDateTime: string | null
  endDateTime: string | null
  isCurrent: boolean
  location: string | null
  description: string | null
  skills: string[]
  companyUrl: string | null
  companyLogo: string | null
  order: number
  createdAt: string
  updatedAt: string
}

export interface ApiProfileDetails {
  id: string
  userId: string
  userName: string
  avatarUrl: string | null
  coverPhoto: string | null
  bio: string | null
  dob: string | null
  profession: string | null
  hobbies: string[]
  city: string | null
  state: string | null
  country: string | null
  createdAt: string
  updatedAt: string
  socialLinks: ApiSocialLink[]
  education: ApiEducation[]
  experience: ApiExperience[]
}

export interface ApiFullProfile {
  id: string
  name: string
  email: string
  verified: boolean
  timezone: string | null
  accountType: AccountType
  fields: string[]
  subFields: string[]
  createdAt: string
  updatedAt: string
  lastLogin: string | null
  isOnline: boolean
  profileVisibility: ProfileVisibility
  phoneNumber: string | null
  twoFactorEnabled: boolean
  lastTimetableLockAt: string | null
  playSound: boolean
  gracePeriod: number
  notifyBeforeTask: number
  notifyAtTaskStart: boolean
  notifyAtTaskEnd: boolean
  snoozeUntil: string | null
  profile: ApiProfileDetails | null
}

export interface ApiFullProfileResponse {
  success: boolean
  message: string
  data: ApiFullProfile
}

export interface FullProfileApiError {
  success: false
  message: string
  status?: number
  errors?: Record<string, string[]>
}

/* ============================================================================
   PAYLOAD TYPES (for sending to backend)
   ============================================================================ */

export interface SocialLinkPayload {
  platform: SocialPlatform
  url: string
}

export interface EducationPayload {
  id?: string
  institution: string
  degree: string
  field?: string | null
  grade?: string | null
  startYear?: string | null
  endYear?: string | null
  description?: string | null
  location?: string | null
  activities?: string | null
  isCurrent?: boolean
  order?: number
}

export interface ExperiencePayload {
  id?: string
  role: string
  organization: string
  employmentType?: EmploymentType
  locationType?: LocationType
  startDate?: string | null
  endDate?: string | null
  isCurrent?: boolean
  location?: string | null
  description?: string | null
  skills?: string[]
  companyUrl?: string | null
  companyLogo?: string | null
  order?: number
}

export interface ProfileUpdatePayload {
  userName?: string
  bio?: string
  profession?: string
  dob?: string | null
  city?: string
  state?: string
  country?: string
  hobbies?: string[]
  avatarUrl?: string | null
  coverPhoto?: string | null
  fields?: string[]
  subFields?: string[]
  profileVisibility?: ProfileVisibility
  socialLinks?: SocialLinkPayload[]
  education?: EducationPayload[]
  experience?: ExperiencePayload[]
}

/* ============================================================================
   HELPERS
   ============================================================================ */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (isRecord(error) && typeof error.message === 'string') return error.message
  return 'An unexpected error occurred'
}

const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

/* ============================================================================
   GET FULL PROFILE (raw network call)
   ============================================================================ */

export async function getFullProfile(signal?: AbortSignal): Promise<ApiFullProfile> {
  const token = getAccessToken()

  if (!token) {
    throw {
      success: false,
      message: 'Not authenticated. Please log in again.',
      status: 401,
    } satisfies FullProfileApiError
  }

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}/users/full-profile`, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
      signal,
    })
  } catch (error) {
    throw {
      success: false,
      message: getErrorMessage(error) || 'Network error occurred',
    } satisfies FullProfileApiError
  }

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    let message = 'Failed to fetch full profile'
    let errors: Record<string, string[]> | undefined

    if (isRecord(data)) {
      if (typeof data.message === 'string') message = data.message
      if (isRecord(data.errors)) {
        const parsed: Record<string, string[]> = {}
        for (const [key, value] of Object.entries(data.errors)) {
          if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
            parsed[key] = value
          }
        }
        errors = parsed
      }
    }

    throw {
      success: false,
      message,
      errors,
      status: response.status,
    } satisfies FullProfileApiError
  }

  if (!isRecord(data) || data.success !== true || !isRecord(data.data)) {
    throw {
      success: false,
      message: 'Malformed response from server',
    } satisfies FullProfileApiError
  }

  return data.data as unknown as ApiFullProfile
}

/* ============================================================================
   CREATE / UPDATE PROFILE
   ============================================================================ */

export async function createOrUpdateProfile(
  payload: ProfileUpdatePayload
): Promise<ApiProfileDetails> {
  const token = getAccessToken()

  if (!token) {
    throw {
      success: false,
      message: 'Not authenticated. Please log in again.',
      status: 401,
    } satisfies FullProfileApiError
  }

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    throw {
      success: false,
      message: getErrorMessage(error) || 'Network error occurred',
    } satisfies FullProfileApiError
  }

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    let message = 'Failed to update profile'
    let errors: Record<string, string[]> | undefined

    if (isRecord(data)) {
      if (typeof data.message === 'string') message = data.message
      if (isRecord(data.errors)) {
        const parsed: Record<string, string[]> = {}
        for (const [key, value] of Object.entries(data.errors)) {
          if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
            parsed[key] = value
          }
        }
        errors = parsed
      }
    }

    throw {
      success: false,
      message,
      errors,
      status: response.status,
    } satisfies FullProfileApiError
  }

  if (!isRecord(data) || data.success === false) {
    throw {
      success: false,
      message:
        (isRecord(data) && typeof data.message === 'string'
          ? data.message
          : 'Malformed response from server') as string,
    } satisfies FullProfileApiError
  }

  const payloadData = isRecord(data) ? (data as Record<string, unknown>).data : null
  const payloadObj = isRecord(payloadData) ? payloadData : null
  const nestedProfile = payloadObj ? (payloadObj['profile'] as unknown) : null
  const profile =
    nestedProfile !== null && isRecord(nestedProfile)
      ? (nestedProfile as unknown as ApiProfileDetails)
      : payloadObj
        ? (payloadObj as unknown as ApiProfileDetails)
        : null

  if (!profile) {
    throw {
      success: false,
      message: 'Server did not return the updated profile',
    } satisfies FullProfileApiError
  }

  return profile
}

/* ============================================================================
   UI MAPPING — NULL-SAFE
   ============================================================================ */

export interface UiEducationEntry {
  id: string
  institution: string
  degree: string
  field: string
  grade: string
  startYear: string
  endYear: string
  description: string
  location: string
  activities: string
  isCurrent: boolean
  order: number
}

export interface UiExperienceEntry {
  id: string
  role: string
  organization: string
  employmentType: EmploymentType
  locationType: LocationType
  startDate: string
  endDate: string
  isCurrent: boolean
  location: string
  description: string
  skills: string[]
  companyUrl: string
  companyLogo: string
  order: number
}

export interface UiProfileData {
  name: string
  email: string
  accountType: AccountType
  verified: boolean
  userName: string
  bio: string
  profession: string
  dob: string
  city: string
  state: string
  country: string
  hobbies: string[]
  fields: string[]
  subFields: string[]
  avatarUrl: string
  coverPhoto: string
  profileVisibility: ProfileVisibility
  memberSince: string
  socialLinks: ApiSocialLink[]
  education: UiEducationEntry[]
  experience: UiExperienceEntry[]
  isProfileIncomplete: boolean
}

function deriveUserName(email: string, name?: string): string {
  if (name && name.trim()) {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
  }
  if (email.includes('@')) {
    return email.split('@')[0]
  }
  return 'user'
}

export function mapApiToUi(api: ApiFullProfile): UiProfileData {
  const p = api.profile ?? null
  const isProfileIncomplete = p === null

  return {
    name: api.name ?? '',
    email: api.email ?? '',
    accountType: api.accountType ?? 'STUDENT',
    verified: api.verified === true,

    userName: p?.userName || deriveUserName(api.email ?? '', api.name),
    bio: p?.bio ?? '',
    profession: p?.profession ?? '',
    dob: p?.dob ? p.dob.split('T')[0] : '',

    city: p?.city ?? '',
    state: p?.state ?? '',
    country: p?.country ?? '',
    hobbies: Array.isArray(p?.hobbies) ? p!.hobbies : [],

    fields: Array.isArray(api.fields) ? api.fields : [],
    subFields: Array.isArray(api.subFields) ? api.subFields : [],

    avatarUrl: p?.avatarUrl ?? '',
    coverPhoto: p?.coverPhoto ?? '',

    profileVisibility: api.profileVisibility ?? 'PUBLIC',
    memberSince: api.createdAt ?? '',

    socialLinks: Array.isArray(p?.socialLinks)
      ? p!.socialLinks.map((sl) => ({
          id: sl.id,
          platform: sl.platform,
          url: sl.url,
        }))
      : [],

    education: Array.isArray(p?.education)
      ? p!.education.map((e) => ({
          id: e.id,
          institution: e.institution ?? '',
          degree: e.degree ?? '',
          field: e.field ?? '',
          grade: e.grade ?? '',
          startYear: e.startYear ?? '',
          endYear: e.endYear ?? '',
          description: e.description ?? '',
          location: e.location ?? '',
          activities: e.activities ?? '',
          isCurrent: e.isCurrent === true,
          order: e.order ?? 0,
        }))
      : [],

    experience: Array.isArray(p?.experience)
      ? p!.experience.map((e) => ({
          id: e.id,
          role: e.role ?? '',
          organization: e.organization ?? '',
          employmentType: e.employmentType ?? 'FULL_TIME',
          locationType: e.locationType ?? 'ON_SITE',
          startDate: e.startDate ?? '',
          endDate: e.endDate ?? '',
          isCurrent: e.isCurrent === true,
          location: e.location ?? '',
          description: e.description ?? '',
          skills: Array.isArray(e.skills) ? e.skills : [],
          companyUrl: e.companyUrl ?? '',
          companyLogo: e.companyLogo ?? '',
          order: e.order ?? 0,
        }))
      : [],

    isProfileIncomplete,
  }
}

/* ============================================================================
   BUILD DEFAULT PROFILE PAYLOAD
   ============================================================================ */

export function buildDefaultProfilePayload(
  api: ApiFullProfile
): ProfileUpdatePayload {
  return {
    userName: deriveUserName(api.email ?? '', api.name),
    bio: '',
    profession: '',
    dob: null,
    city: '',
    state: '',
    country: '',
    hobbies: [],
    avatarUrl: '',
    coverPhoto: '',
    fields: Array.isArray(api.fields) ? api.fields : [],
    subFields: Array.isArray(api.subFields) ? api.subFields : [],
    profileVisibility: api.profileVisibility ?? 'PUBLIC',
    socialLinks: [],
    education: [],
    experience: [],
  }
}

/* ============================================================================
   🔥 CACHE-AWARE FETCH (stale-while-revalidate)
   ============================================================================ */

import {
  readProfileCache,
  writeProfileCache,
  isCacheStale,
  type ProfileCacheEntry,
} from './profile-cache'

/**
 * Returns cached profile immediately (if present), then revalidates
 * in the background. The `onFresh` callback is invoked when fresh
 * data arrives — caller can decide whether to update UI.
 */
export async function getFullProfileWithCache(options?: {
  signal?: AbortSignal
  forceRefresh?: boolean
  onFresh?: (entry: ProfileCacheEntry) => void
}): Promise<{ cached: ProfileCacheEntry | null; fresh: ApiFullProfile | null }> {
  const cached = readProfileCache()

  // If we have fresh cache and caller didn't force refresh → return early
  if (cached && !isCacheStale(cached) && !options?.forceRefresh) {
    return { cached, fresh: null }
  }

  // Fetch fresh data
  const fresh = await getFullProfile(options?.signal)
  const ui = mapApiToUi(fresh)
  writeProfileCache({ apiProfile: fresh, uiProfile: ui })

  const entry: ProfileCacheEntry = {
    apiProfile: fresh,
    uiProfile: ui,
    cachedAt: Date.now(),
  }

  options?.onFresh?.(entry)
  return { cached, fresh }
}