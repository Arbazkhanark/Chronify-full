// src/hooks/useAuth.ts

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:8181/v0/api'

// ============================================================
// TYPES
// ============================================================

export type UserRole =
  | 'student'
  | 'employed'
  | 'unemployed'
  | 'other'

export interface UserDetails {
  role: UserRole

  // Student
  educationLevel?: string
  field?: string
  institution?: string
  graduationYear?: string

  // Employed
  profession?: string
  company?: string
  experience?: string

  // Unemployed
  seeking?: string
  lastWorked?: string

  // Other
  description?: string
}

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
  onboardingStep?: number
  role?: UserRole
  details?: UserDetails
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

function isUserRole(
  value: unknown,
): value is UserRole {
  return (
    value === 'student' ||
    value === 'employed' ||
    value === 'unemployed' ||
    value === 'other'
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

  private setTokens(
    accessToken: string,
    refreshToken: string,
  ): void {
    this.accessToken = accessToken
    this.refreshToken = refreshToken

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'access_token',
        accessToken,
      )

      localStorage.setItem(
        'refresh_token',
        refreshToken,
      )
    }
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  // ==========================================================
  // TEST TOKEN
  // ==========================================================

  /**
   * Temporary helper for local development/testing.
   *
   * Remove this method before production.
   */
  setTestToken(): void {
    const testToken =
      'YOUR_TEST_TOKEN_HERE'

    this.accessToken = testToken

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'access_token',
        testToken,
      )
    }
  }

  // ==========================================================
  // GENERIC REQUEST HANDLER
  // ==========================================================

  private async handleRequest<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> {
    // FIX: Type `headers` as `Record<string, string>` instead of
    // `HeadersInit`. `HeadersInit` is a union (Headers | string[][]
    // | Record<string, string>) and TypeScript won't let you index
    // into all three with `headers['Authorization']`.
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Merge any custom headers passed by the caller
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

    if (this.accessToken) {
      headers['Authorization'] =
        `Bearer ${this.accessToken}`
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
          onboardingStep: 0,
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

      const user: User = {
        ...response.data.user,
        verified: false,
        onboardingStep: 0,
      }

      localStorage.setItem(
        'current_user',
        JSON.stringify(user),
      )

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

      const existingUserStr =
        localStorage.getItem(
          'current_user',
        )

      let existingUser:
        | User
        | null = null

      if (existingUserStr) {
        try {
          const parsed: unknown =
            JSON.parse(
              existingUserStr,
            )

          if (isUser(parsed)) {
            existingUser = parsed
          }
        } catch {
          existingUser = null
        }
      }

      const user: User = {
        ...response.data,

        onboardingStep:
          existingUser?.onboardingStep ?? 0,

        role:
          existingUser?.role,

        details:
          existingUser?.details,

        profile:
          existingUser?.profile,

        stats:
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

      return null
    }
  }

  // ==========================================================
  // SAVE ROLE
  // ==========================================================

  saveRole(
    role: UserRole,
  ): void {
    if (typeof window === 'undefined') {
      return
    }

    const existingUserStr =
      localStorage.getItem(
        'current_user',
      )

    if (!existingUserStr) {
      toast.error(
        'User session not found',
      )

      throw new Error(
        'Current user not found',
      )
    }

    let existingUser: User

    try {
      const parsed: unknown =
        JSON.parse(
          existingUserStr,
        )

      if (!isUser(parsed)) {
        throw new Error(
          'Invalid stored user data',
        )
      }

      existingUser = parsed
    } catch {
      toast.error(
        'Unable to load your account data',
      )

      throw new Error(
        'Invalid stored user data',
      )
    }

    const updatedUser: User = {
      ...existingUser,

      onboardingStep: 1,

      role,
    }

    localStorage.setItem(
      'current_user',
      JSON.stringify(updatedUser),
    )
  }

  // ==========================================================
  // SAVE ONBOARDING DETAILS
  // ==========================================================

  saveDetails(
    details: UserDetails,
  ): void {
    if (typeof window === 'undefined') {
      return
    }

    const existingUserStr =
      localStorage.getItem(
        'current_user',
      )

    if (!existingUserStr) {
      toast.error(
        'User session not found',
      )

      throw new Error(
        'Current user not found',
      )
    }

    let existingUser: User

    try {
      const parsed: unknown =
        JSON.parse(
          existingUserStr,
        )

      if (!isUser(parsed)) {
        throw new Error(
          'Invalid stored user data',
        )
      }

      existingUser = parsed
    } catch {
      toast.error(
        'Unable to load your account data',
      )

      throw new Error(
        'Invalid stored user data',
      )
    }

    const updatedUser: User = {
      ...existingUser,

      onboardingStep: 2,

      role: details.role,

      details,
    }

    localStorage.setItem(
      'current_user',
      JSON.stringify(updatedUser),
    )
  }

  // ==========================================================
  // SAVE ONBOARDING PROFILE
  // ==========================================================

  saveProfile(
    profile: UserProfile,
  ): void {
    if (typeof window === 'undefined') {
      return
    }

    const existingUserStr =
      localStorage.getItem(
        'current_user',
      )

    if (!existingUserStr) {
      toast.error(
        'User session not found',
      )

      throw new Error(
        'Current user not found',
      )
    }

    let existingUser: User

    try {
      const parsed: unknown =
        JSON.parse(
          existingUserStr,
        )

      if (!isUser(parsed)) {
        throw new Error(
          'Invalid stored user data',
        )
      }

      existingUser = parsed
    } catch {
      toast.error(
        'Unable to load your account data',
      )

      throw new Error(
        'Invalid stored user data',
      )
    }

    const updatedUser: User = {
      ...existingUser,

      onboardingStep: 3,

      profile,
    }

    localStorage.setItem(
      'current_user',
      JSON.stringify(updatedUser),
    )
  }

  // ==========================================================
  // COMPLETE ONBOARDING (Step 4)
  // ==========================================================

  completeOnboarding(): void {
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

      const updatedUser: User = {
        ...parsed,
        onboardingStep: 4,
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
  // UPDATE USER STATS
  // ==========================================================

  /**
   * Updates the current user's stats (streak, hours, tasks,
   * consistency) and persists them to localStorage.
   *
   * Called from the tutorial tour completion flow.
   */
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
  // LOGOUT
  // ==========================================================

  async logout(): Promise<void> {
    this.accessToken = null
    this.refreshToken = null

    if (typeof window !== 'undefined') {
      localStorage.removeItem(
        'access_token',
      )

      localStorage.removeItem(
        'refresh_token',
      )

      localStorage.removeItem(
        'current_user',
      )
    }

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
        '/auth/resend-verification-email',
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
// ============================================================

export function useAuth() {
  const [user, setUser] =
    useState<User | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    const loadUser =
      async (): Promise<void> => {
        try {
          const token =
            AuthService.getAccessToken()

          if (token) {
            const currentUser =
              await AuthService.getCurrentUser()

            setUser(currentUser)
          } else {
            const storedUser =
              AuthService.getCurrentUserFromStorage()

            setUser(storedUser)
          }
        } catch (error: unknown) {
          console.error(
            'Failed to load user:',
            error,
          )
        } finally {
          setLoading(false)
        }
      }

    loadUser()
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    AuthService,
  }
}