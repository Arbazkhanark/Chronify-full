// src/hooks/useAuth.ts

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { onVerificationChange } from '@/lib/verification-bus'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:8181/v0/api'

// ============================================================
// TYPES
// ============================================================

export interface UserProfile {
  userName?: string
  avatarUrl?: string
  bio?: string
}

export interface UserStats {
  streak: number
  bestStreak: number
  totalHours: number
  completedTasks: number
  consistency: number
}

export interface User {
  id: string
  email: string
  name?: string
  timezone?: string
  verified: boolean
  createdAt?: string
  profile?: UserProfile
  stats?: UserStats
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      name: string
      email: string
      timezone: string
    }
  }
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    email: string
    timezone: string
    createdAt: string
  }
}

export interface UserResponse {
  success: boolean
  data: User
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
  status?: number
}

// ============================================================
// TYPE GUARDS
// ============================================================

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null
  )
}

function isUser(
  value: unknown,
): value is User {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.email === 'string' &&
    typeof value.verified === 'boolean'
  )
}

function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message
  }

  if (
    isRecord(error) &&
    typeof error.message === 'string'
  ) {
    return error.message
  }

  return 'An unexpected error occurred'
}

// ============================================================
// AUTH SERVICE
// ============================================================

export class AuthServiceClass {
  private static instance: AuthServiceClass

  private accessToken: string | null = null
  private refreshToken: string | null = null

  private constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken =
        localStorage.getItem('access_token')

      this.refreshToken =
        localStorage.getItem('refresh_token')
    }
  }

  // ==========================================================
  // SINGLETON
  // ==========================================================

  static getInstance(): AuthServiceClass {
    if (!AuthServiceClass.instance) {
      AuthServiceClass.instance =
        new AuthServiceClass()
    }

    return AuthServiceClass.instance
  }

  // ==========================================================
  // TOKEN MANAGEMENT
  // ==========================================================

  /**
   * Saves access + refresh tokens to:
   *   1. localStorage  → for client-side AuthService
   *   2. cookies       → for middleware (server/edge runtime)
   *
   * 🔥 Why cookies? Middleware runs on the edge/server and CANNOT
   *    read localStorage. It can only read cookies.
   */
  private setTokens(
    accessToken: string,
    refreshToken: string,
  ): void {
    this.accessToken = accessToken
    this.refreshToken = refreshToken

    if (typeof window !== 'undefined') {
      // 1) localStorage (client-side)
      localStorage.setItem(
        'access_token',
        accessToken,
      )

      localStorage.setItem(
        'refresh_token',
        refreshToken,
      )

      // 2) cookies (middleware-side)
      const maxAge = 60 * 60 * 24 * 7 // 7 days

      document.cookie =
        `access_token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`

      document.cookie =
        `refresh_token=${refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax`
    }
  }

  getAccessToken(): string | null {
    // 🔥 ALWAYS read from localStorage — instance cache stale ho
    //    sakta hai (jaise OAuth callback ke baad)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('access_token')
      if (stored) {
        this.accessToken = stored // keep instance in sync
        return stored
      }
      // localStorage me nahi hai → instance bhi null karo
      this.accessToken = null
      return null
    }

    // SSR fallback
    return this.accessToken
  }

  // ==========================================================
  // SESSION CLEAR (internal)
  // ==========================================================

  /**
   * Wipes the entire local session — tokens + cached user,
   * from BOTH localStorage AND cookies.
   */
  private clearSession(): void {
    this.accessToken = null
    this.refreshToken = null

    if (typeof window !== 'undefined') {
      // 1) localStorage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('current_user')

      // 2) cookies — must delete, otherwise middleware will
      //    keep seeing a stale token and consider user logged in.
      document.cookie = 'access_token=; path=/; max-age=0'
      document.cookie = 'refresh_token=; path=/; max-age=0'
    }
  }

  // ==========================================================
  // FORCE LOGOUT (public)
  // ==========================================================

  forceLogout(): void {
    this.clearSession()

    // 🔥 NOTE: Redirect is intentionally disabled here.
    //    The `dashboard/layout.tsx` (or page-level guards) handle
    //    redirects. Doing it here would cause loops on public pages.
  }

  // ==========================================================
  // GENERIC REQUEST HANDLER
  // ==========================================================

  private async handleRequest<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value
        })
      } else if (Array.isArray(options.headers)) {
        for (const [key, value] of options.headers) {
          headers[key] = value
        }
      } else {
        Object.assign(headers, options.headers)
      }
    }

    // 🔥 Always read fresh token (from localStorage)
    const token = this.getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}${url}`,
        {
          ...options,
          headers,
        },
      )

      let data: unknown

      try {
        data = await response.json()
      } catch {
        data = null
      }

      if (!response.ok) {
        let message = 'An error occurred'

        let errors:
          | Record<string, string[]>
          | undefined

        if (isRecord(data)) {
          if (
            typeof data.message === 'string'
          ) {
            message = data.message
          }

          if (isRecord(data.errors)) {
            const parsedErrors:
              Record<string, string[]> = {}

            for (const [
              key,
              value,
            ] of Object.entries(data.errors)) {
              if (
                Array.isArray(value) &&
                value.every(
                  (item) =>
                    typeof item === 'string',
                )
              ) {
                parsedErrors[key] = value
              }
            }

            errors = parsedErrors
          }
        }

        const apiError: ApiError = {
          success: false,
          message,
          errors,
          status: response.status,
        }

        // 🔥 GLOBAL 401/403 INTERCEPTOR
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          const isAuthEndpoint =
            url.startsWith('/users/login') ||
            url.startsWith('/users/signup') ||
            url.startsWith('/auth/')

          if (!isAuthEndpoint) {
            this.forceLogout()
          }
        }

        throw apiError
      }

      return data as T
    } catch (error: unknown) {
      if (
        isRecord(error) &&
        error.success === false
      ) {
        throw error
      }

      if (error instanceof Error) {
        throw {
          success: false,
          message:
            error.message ||
            'Network error occurred',
        } satisfies ApiError
      }

      throw {
        success: false,
        message: 'Network error occurred',
      } satisfies ApiError
    }
  }

  // ==========================================================
  // REGISTER
  // ==========================================================

  async register(
    email: string,
    password: string,
    name?: string,
    timezone?: string,
  ): Promise<RegisterResponse> {
    try {
      const response =
        await this.handleRequest<RegisterResponse>(
          '/users/signup',
          {
            method: 'POST',
            body: JSON.stringify({
              email,
              password,
              name:
                name ||
                email.split('@')[0],
              timezone:
                timezone ||
                Intl.DateTimeFormat()
                  .resolvedOptions()
                  .timeZone,
            }),
          },
        )

      if (response.success) {
        const user: User = {
          ...response.data,
          verified: false,
        }

        localStorage.setItem(
          'current_user',
          JSON.stringify(user),
        )

        toast.success(
          '🎉 Registration successful!',
          {
            description:
              'Please check your email to verify your account.',
            duration: 5000,
          },
        )
      }

      return response
    } catch (error: unknown) {
      const message =
        getErrorMessage(error)

      if (
        message
          .toLowerCase()
          .includes('already registered')
      ) {
        toast.error(
          'Account already exists',
          {
            description:
              'This email is already registered. Please login instead.',
            duration: 5000,
          },
        )
      } else {
        toast.error(
          'Registration failed',
          {
            description:
              message ||
              'Please try again with different credentials.',
            duration: 5000,
          },
        )
      }

      throw error
    }
  }

  // ==========================================================
  // LOGIN
  // ==========================================================

  async login(
    email: string,
    password: string,
  ): Promise<LoginResponse['data']> {
    try {
      const response =
        await this.handleRequest<LoginResponse>(
          '/users/login',
          {
            method: 'POST',
            body: JSON.stringify({
              email,
              password,
            }),
          },
        )

      if (!response.success) {
        throw new Error('Login failed')
      }

      this.setTokens(
        response.data.accessToken,
        response.data.refreshToken,
      )

      // Preserve any cached profile/stats we already had
      let cachedUser: User | null = null
      try {
        const raw = localStorage.getItem('current_user')
        if (raw) {
          const parsed: unknown = JSON.parse(raw)
          if (isUser(parsed)) {
            if (
              parsed.email === response.data.user.email
            ) {
              cachedUser = parsed
            }
          }
        }
      } catch {
        cachedUser = null
      }

      const user: User = {
        ...response.data.user,
        verified: cachedUser?.verified ?? false,
        profile: cachedUser?.profile,
        stats: cachedUser?.stats,
      }

      localStorage.setItem(
        'current_user',
        JSON.stringify(user),
      )

      // Fetch fresh user — merges authoritative `verified`
      // if backend returns it.
      await this.getCurrentUser()

      toast.success(
        '👋 Welcome back!',
        {
          description:
            `Logged in as ${
              response.data.user.name ||
              response.data.user.email
            }`,
          duration: 3000,
        },
      )

      return response.data
    } catch (error: unknown) {
      const message =
        getErrorMessage(error)

      if (
        message
          .toLowerCase()
          .includes('invalid credentials')
      ) {
        toast.error(
          'Invalid email or password',
          {
            description:
              'Please check your credentials and try again.',
            duration: 5000,
          },
        )
      } else {
        toast.error(
          'Login failed',
          {
            description:
              message ||
              'Unable to login at this time.',
            duration: 5000,
          },
        )
      }

      throw error
    }
  }

  // ==========================================================
  // GET CURRENT USER
  // ==========================================================

  async getCurrentUser(): Promise<User | null> {
    try {
      const response =
        await this.handleRequest<UserResponse>(
          '/users/me',
          {
            method: 'GET',
          },
        )

      if (!response.success) {
        return null
      }

      // Read existing cached user (same-email match only)
      const existingUserStr =
        localStorage.getItem('current_user')

      let existingUser: User | null = null

      if (existingUserStr) {
        try {
          const parsed: unknown = JSON.parse(existingUserStr)

          if (
            isUser(parsed) &&
            parsed.email === response.data.email
          ) {
            existingUser = parsed
          }
        } catch {
          existingUser = null
        }
      }

      const backendUser = response.data as User & {
        profile?: UserProfile
        stats?: UserStats
      }

      const user: User = {
        ...response.data,

        profile:
          backendUser.profile ??
          existingUser?.profile,

        stats:
          backendUser.stats ??
          existingUser?.stats,
      }

      localStorage.setItem(
        'current_user',
        JSON.stringify(user),
      )

      return user
    } catch (error: unknown) {
      console.log(
        'Failed to fetch current user:',
        getErrorMessage(error),
      )

      // 🔥 Auth failures MUST NOT fall back to the cached user.
      const status =
        isRecord(error) &&
        typeof error.status === 'number'
          ? error.status
          : undefined

      if (status === 401 || status === 403) {
        this.clearSession()
        return null
      }

      // Only fall back to cache for genuine network/transient
      // errors (backend down, offline, timeout, etc.)
      return this.getCurrentUserFromStorage()
    }
  }

  // ==========================================================
  // UPDATE USER STATS
  // ==========================================================

  updateUserStats(
    stats: Partial<UserStats>,
  ): void {
    if (typeof window === 'undefined') {
      return
    }

    const existingUserStr =
      localStorage.getItem(
        'current_user',
      )

    if (!existingUserStr) {
      return
    }

    try {
      const parsed: unknown =
        JSON.parse(existingUserStr)

      if (!isUser(parsed)) {
        return
      }

      const currentStats: UserStats = {
        streak: parsed.stats?.streak ?? 0,
        bestStreak: parsed.stats?.bestStreak ?? 0,
        totalHours: parsed.stats?.totalHours ?? 0,
        completedTasks:
          parsed.stats?.completedTasks ?? 0,
        consistency:
          parsed.stats?.consistency ?? 0,
      }

      const updatedUser: User = {
        ...parsed,
        stats: {
          ...currentStats,
          ...stats,
        },
      }

      localStorage.setItem(
        'current_user',
        JSON.stringify(updatedUser),
      )
    } catch {
      // Silent fail — not critical
    }
  }

  // ==========================================================
  // GET USER STATS
  // ==========================================================

  getUserStats(): UserStats | null {
    if (typeof window === 'undefined') {
      return null
    }

    const userStr =
      localStorage.getItem(
        'current_user',
      )

    if (!userStr) {
      return null
    }

    try {
      const parsed: unknown =
        JSON.parse(userStr)

      if (!isUser(parsed)) {
        return null
      }

      return parsed.stats ?? null
    } catch {
      return null
    }
  }

  // ==========================================================
  // GET USER FROM STORAGE
  // ==========================================================

  getCurrentUserFromStorage():
    | User
    | null {
    if (typeof window === 'undefined') {
      return null
    }

    const userStr =
      localStorage.getItem(
        'current_user',
      )

    if (!userStr) {
      return null
    }

    try {
      const parsed: unknown =
        JSON.parse(userStr)

      if (isUser(parsed)) {
        return parsed
      }

      return null
    } catch {
      return null
    }
  }

  // ==========================================================
  // MARK VERIFIED
  // ==========================================================

  markVerified(verified: boolean = true): void {
    if (typeof window === 'undefined') {
      return
    }

    const existingUserStr =
      localStorage.getItem('current_user')

    if (!existingUserStr) {
      return
    }

    try {
      const parsed: unknown =
        JSON.parse(existingUserStr)

      if (!isUser(parsed)) {
        return
      }

      const updatedUser: User = {
        ...parsed,
        verified,
      }

      localStorage.setItem(
        'current_user',
        JSON.stringify(updatedUser),
      )
    } catch {
      // Silent fail — not critical
    }
  }

  // ==========================================================
  // LOGOUT
  // ==========================================================

  async logout(): Promise<void> {
    this.clearSession()

    toast.success(
      '👋 Logged out successfully',
      {
        description:
          'Come back soon!',
        duration: 3000,
      },
    )
  }

  // ==========================================================
  // CHANGE PASSWORD
  // ==========================================================

  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const token = this.getAccessToken()

      if (!token) {
        throw new Error(
          'Authentication required',
        )
      }

      const response = await fetch(
        `${API_BASE_URL}/auth/change-password`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        },
      )

      if (response.status === 401) {
        return false
      }

      if (!response.ok) {
        const errorData: unknown =
          await response
            .json()
            .catch(() => null)

        console.error(
          'Change password request failed:',
          errorData,
        )

        return false
      }

      return true
    } catch (error: unknown) {
      console.error(
        'Change password error:',
        error,
      )

      throw error
    }
  }

  // ==========================================================
  // FORGOT PASSWORD
  // ==========================================================

  async forgotPassword(
    email: string,
  ): Promise<boolean> {
    try {
      await this.handleRequest<unknown>(
        '/auth/forgot-password',
        {
          method: 'POST',
          body: JSON.stringify({
            email,
          }),
        },
      )

      return true
    } catch (error: unknown) {
      console.error(
        'Forgot password error:',
        error,
      )

      return false
    }
  }

  // ==========================================================
  // RESET PASSWORD
  // ==========================================================

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      await this.handleRequest<unknown>(
        '/auth/reset-password',
        {
          method: 'POST',
          body: JSON.stringify({
            token,
            newPassword,
          }),
        },
      )

      return true
    } catch (error: unknown) {
      console.error(
        'Reset password error:',
        error,
      )

      return false
    }
  }

  // ==========================================================
  // VERIFY EMAIL
  // ==========================================================

  async verifyEmail(
    token: string,
  ): Promise<boolean> {
    try {
      await this.handleRequest<unknown>(
        '/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify({
            token,
          }),
        },
      )

      return true
    } catch (error: unknown) {
      console.error(
        'Verify email error:',
        error,
      )

      return false
    }
  }

  // ==========================================================
  // RESEND VERIFICATION EMAIL
  // ==========================================================

  async resendVerificationEmail(
    email: string,
  ): Promise<boolean> {
    try {
      await this.handleRequest<unknown>(
        '/users/resend-verification-link',
        {
          method: 'POST',
          body: JSON.stringify({
            email,
          }),
        },
      )

      return true
    } catch (error: unknown) {
      console.error(
        'Resend verification email error:',
        error,
      )

      return false
    }
  }
}

// ============================================================
// AUTH SERVICE INSTANCE
// ============================================================

export const AuthService =
  AuthServiceClass.getInstance()

// ============================================================
// useAuth HOOK
//
// ⚠️ IMPORTANT:
// This hook is a DATA hook only. It fetches the current user
// and exposes it. It does NOT redirect anywhere.
//
// Redirect logic for protected routes lives in:
//   - src/app/dashboard/layout.tsx
//
// This ensures public pages (home, /auth/*) can safely use
// `useAuth()` without getting force-redirected to login.
// ============================================================

export function useAuth() {
  const [user, setUser] =
    useState<User | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    let isMounted = true

    const loadUser =
      async (): Promise<void> => {
        try {
          const token =
            AuthService.getAccessToken()

          if (token) {
            const currentUser =
              await AuthService.getCurrentUser()

            // Just expose whatever we got — null if the token
            // was invalid/expired. NO redirect from here.
            if (isMounted) {
              setUser(currentUser)
            }
          } else {
            // No token → definitely logged out.
            // NO cached-user fallback. NO redirect.
            if (isMounted) {
              setUser(null)
            }
          }
        } catch (error: unknown) {
          console.error(
            'Failed to load user:',
            error,
          )

          if (isMounted) {
            setUser(null)
          }
        } finally {
          if (isMounted) {
            setLoading(false)
          }
        }
      }

    void loadUser()

    return () => {
      isMounted = false
    }
  }, [])

  /* ==========================================================
     VERIFICATION BUS LISTENER
     Keeps `user.verified` in sync across every consumer of
     useAuth() without requiring a re-fetch.
     ========================================================== */
  useEffect(() => {
    const unsubscribe = onVerificationChange((verified) => {
      setUser((prev) =>
        prev ? { ...prev, verified } : prev,
      )
    })

    return unsubscribe
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    AuthService,
  }
}