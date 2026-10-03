// src/lib/api-client.ts
'use client'

import { AuthService } from '@/hooks/useAuth'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:8181/v0/api'

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
  pagination?: {
    hasNext: boolean
    nextCursor: string | null
  }
}

export class ApiClientError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.errors = errors
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Fresh token from localStorage (via AuthService)
  const token = AuthService.getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (options.headers) {
    Object.assign(headers, options.headers)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message =
      typeof (data as any)?.message === 'string'
        ? (data as any).message
        : `Request failed with status ${response.status}`

    throw new ApiClientError(
      message,
      response.status,
      (data as any)?.errors,
    )
  }

  return data as ApiResponse<T>
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
}