// // src/lib/connection-service.ts
// import type {
//   ApiError,
//   ConnectionUser,
//   FriendRequest,
//   FriendRequestStatus,
// } from '@/types/connection-types'
// import { apiClient } from './api-client'

// /* ============================================================================
//    HELPERS
//    ============================================================================ */

// function normalizeUser(u: any): ConnectionUser | undefined {
//   if (!u || typeof u !== 'object') return undefined
//   return {
//     id: String(u.id ?? ''),
//     name: String(u.name ?? ''),
//     accountType: u.accountType ?? undefined,
//     fields: Array.isArray(u.fields) ? u.fields : [],
//     subFields: Array.isArray(u.subFields) ? u.subFields : [],
//     profile: u.profile
//       ? {
//           userName: String(u.profile.userName ?? ''),
//           avatarUrl: (u.profile.avatarUrl as string | null) ?? null,
//           profession: (u.profile.profession as string | null) ?? null,
//           city: (u.profile.city as string | null) ?? null,
//           country: (u.profile.country as string | null) ?? null,
//         }
//       : null,
//   }
// }

// function normalizeRequest(r: any): FriendRequest {
//   return {
//     id: String(r.id ?? ''),
//     senderId: String(r.senderId ?? ''),
//     receiverId: String(r.receiverId ?? ''),
//     status: (r.status as FriendRequest['status']) ?? 'PENDING',
//     createdAt: String(r.createdAt ?? new Date().toISOString()),
//     updatedAt: r.updatedAt ? String(r.updatedAt) : undefined,
//     sender: normalizeUser(r.sender),
//     receiver: normalizeUser(r.receiver),
//   }
// }

// /* ============================================================================
//    CONNECTION SERVICE
//    ---------------------------------------------------------------------------
//    Backend base: /connections
//    All routes require auth (Bearer token via api-client)
//    ============================================================================ */

// export const ConnectionService = {
//   /**
//    * Send a connection request
//    * POST /connections/request
//    * body: { receiverId: string }
//    */
//   async sendRequest(receiverId: string): Promise<FriendRequest> {
//     const res = await apiClient.post<{ success: boolean; data: any; message?: string }>(
//       `/connections/request`,
//       { receiverId },
//     )
//     return normalizeRequest(res.data)
//   },

//   /**
//    * Accept or reject a received request
//    * PUT /connections/request/:id
//    * body: { action: 'ACCEPT' | 'REJECT' }
//    */
//   async respond(
//     requestId: string,
//     action: 'ACCEPT' | 'REJECT',
//   ): Promise<{ status: FriendRequestStatus }> {
//     const res = await apiClient.put<{ success: boolean; data: any }>(
//       `/connections/request/${requestId}`,
//       { action },
//     )
//     return {
//       status:
//         (res.data?.data.status as FriendRequestStatus) ??
//         (action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED'),
//     }
//   },

//   /**
//    * Get sent requests
//    * GET /connections/requests/sent
//    */
//   async getSent(): Promise<FriendRequest[]> {
//     const res = await apiClient.get<{ success: boolean; data: any[] }>(
//       `/connections/requests/sent`,
//     )
//     return (res.data ?? []).map(normalizeRequest)
//   },

//   /**
//    * Get received requests
//    * GET /connections/requests/received
//    */
//   async getReceived(): Promise<FriendRequest[]> {
//     const res = await apiClient.get<{ success: boolean; data: any[] }>(
//       `/connections/requests/received`,
//     )
//     return (res.data ?? []).map(normalizeRequest)
//   },

//   /**
//    * Get friends list
//    * GET /connections/friends
//    */
//   async getFriends(): Promise<ConnectionUser[]> {
//     const res = await apiClient.get<{ success: boolean; data: any[] }>(
//       `/connections/friends`,
//     )
//     return (res.data ?? [])
//       .map(normalizeUser)
//       .filter((u): u is ConnectionUser => !!u)
//   },

//   /**
//    * Search users by name / username / profession
//    * GET /connections/search?q=...
//    */
//   async search(q: string): Promise<ConnectionUser[]> {
//     const trimmed = q.trim()
//     if (!trimmed) return []
//     const res = await apiClient.get<{ success: boolean; data: any[] }>(
//       `/connections/search?q=${encodeURIComponent(trimmed)}`,
//     )
//     return (res.data ?? [])
//       .map(normalizeUser)
//       .filter((u): u is ConnectionUser => !!u)
//   },
// }

// export type { ApiError, ConnectionUser, FriendRequest }


















// src/lib/connection-service.ts
import type {
  ApiError,
  ConnectionUser,
  FriendRequest,
  FriendRequestStatus,
} from '@/types/connection-types'
import { apiClient } from './api-client'

/* ============================================================================
   TYPES
   ---------------------------------------------------------------------------
   Backend response envelope: { success: boolean, message?: string, data: T }
   ============================================================================ */

interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data: T
}

/* ============================================================================
   HELPERS
   ============================================================================ */

function normalizeUser(u: any): ConnectionUser | undefined {
  if (!u || typeof u !== 'object') return undefined
  return {
    id: String(u.id ?? ''),
    name: String(u.name ?? ''),
    accountType: u.accountType ?? undefined,
    fields: Array.isArray(u.fields) ? u.fields : [],
    subFields: Array.isArray(u.subFields) ? u.subFields : [],
    profile: u.profile
      ? {
          userName: String(u.profile.userName ?? ''),
          avatarUrl: (u.profile.avatarUrl as string | null) ?? null,
          profession: (u.profile.profession as string | null) ?? null,
          city: (u.profile.city as string | null) ?? null,
          country: (u.profile.country as string | null) ?? null,
        }
      : null,
  }
}

function normalizeRequest(r: any): FriendRequest {
  return {
    id: String(r?.id ?? ''),
    senderId: String(r?.senderId ?? ''),
    receiverId: String(r?.receiverId ?? ''),
    status: (r?.status as FriendRequest['status']) ?? 'PENDING',
    createdAt: String(r?.createdAt ?? new Date().toISOString()),
    updatedAt: r?.updatedAt ? String(r.updatedAt) : undefined,
    sender: normalizeUser(r?.sender),
    receiver: normalizeUser(r?.receiver),
  }
}

/**
 * Safely extracts an array from an API response.
 * Backend sometimes returns `{ success, data: [...] }` — we always
 * pull from `.data`. If `.data` isn't an array, returns [].
 */
function extractArray(res: any): any[] {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (Array.isArray(res.data)) return res.data
  return []
}

/* ============================================================================
   CONNECTION SERVICE
   ---------------------------------------------------------------------------
   Backend base: /connections
   All routes require auth (Bearer token via api-client)
   ============================================================================ */

export const ConnectionService = {
  /**
   * Send a connection request
   * POST /connections/request
   * body: { receiverId: string }
   */
  async sendRequest(receiverId: string): Promise<FriendRequest> {
    const res = await apiClient.post<ApiEnvelope<any>>(
      `/connections/request`,
      { receiverId },
    )
    return normalizeRequest(res?.data)
  },

  /**
   * Accept or reject a received request
   * PUT /connections/request/:id
   * body: { action: 'ACCEPT' | 'REJECT' }
   */
  async respond(
    requestId: string,
    action: 'ACCEPT' | 'REJECT',
  ): Promise<{ status: FriendRequestStatus }> {
    const res = await apiClient.put<ApiEnvelope<any>>(
      `/connections/request/${requestId}`,
      { action },
    )

    // Backend may return the status either at `res.data.status`
    // or directly as `res.status`. Handle both.
    const rawStatus =
      res?.data ??
      (res as any)?.status ??
      (action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED')

    return {
      status: rawStatus as FriendRequestStatus,
    }
  },

  /**
   * Get sent requests
   * GET /connections/requests/sent
   */
  async getSent(): Promise<FriendRequest[]> {
    const res = await apiClient.get<ApiEnvelope<any[]>>(
      `/connections/requests/sent`,
    )
    return extractArray(res).map((r) => normalizeRequest(r))
  },

  /**
   * Get received requests
   * GET /connections/requests/received
   */
  async getReceived(): Promise<FriendRequest[]> {
    const res = await apiClient.get<ApiEnvelope<any[]>>(
      `/connections/requests/received`,
    )
    return extractArray(res).map((r) => normalizeRequest(r))
  },

  /**
   * Get friends list
   * GET /connections/friends
   */
  async getFriends(): Promise<ConnectionUser[]> {
    const res = await apiClient.get<ApiEnvelope<any[]>>(
      `/connections/friends`,
    )
    return extractArray(res)
      .map((u: any) => normalizeUser(u))
      .filter((u: ConnectionUser | undefined): u is ConnectionUser => !!u)
  },

  /**
   * Search users by name / username / profession
   * GET /connections/search?q=...
   */
  async search(q: string): Promise<ConnectionUser[]> {
    const trimmed = q.trim()
    if (!trimmed) return []

    const res = await apiClient.get<ApiEnvelope<any[]>>(
      `/connections/search?q=${encodeURIComponent(trimmed)}`,
    )
    return extractArray(res)
      .map((u: any) => normalizeUser(u))
      .filter((u: ConnectionUser | undefined): u is ConnectionUser => !!u)
  },
}

export type { ApiError, ConnectionUser, FriendRequest }