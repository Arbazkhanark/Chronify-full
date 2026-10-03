// // src/hooks/useConnections.ts
// 'use client'

// import { useCallback, useEffect, useState } from 'react'
// import { apiClient, ApiClientError } from '@/lib/api-client'
// import { toast } from 'sonner'
// import type { FriendRequest, Friend, ConnectionUser } from '@/types/feed'

// export function useConnections(autoLoad = true) {
//   const [friends, setFriends] = useState<Friend[]>([])
//   const [sentRequests, setSentRequests] = useState<FriendRequest[]>([])
//   const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([])
//   const [loading, setLoading] = useState(false)

//   const loadFriends = useCallback(async () => {
//     try {
//       const res = await apiClient.get<Friend[]>('/connections/friends')
//       setFriends(res.data ?? [])
//     } catch (err) {
//       const message =
//         err instanceof ApiClientError ? err.message : 'Failed to load friends'
//       toast.error('Could not load friends', { description: message })
//     }
//   }, [])

//   const loadSentRequests = useCallback(async () => {
//     try {
//       const res = await apiClient.get<FriendRequest[]>('/connections/requests/sent')
//       setSentRequests(res.data ?? [])
//     } catch (err) {
//       console.error('Failed to load sent requests', err)
//     }
//   }, [])

//   const loadReceivedRequests = useCallback(async () => {
//     try {
//       const res = await apiClient.get<FriendRequest[]>('/connections/requests/received')
//       setReceivedRequests(res.data ?? [])
//     } catch (err) {
//       console.error('Failed to load received requests', err)
//     }
//   }, [])

//   const loadAll = useCallback(async () => {
//     setLoading(true)
//     try {
//       await Promise.all([
//         loadFriends(),
//         loadSentRequests(),
//         loadReceivedRequests(),
//       ])
//     } finally {
//       setLoading(false)
//     }
//   }, [loadFriends, loadSentRequests, loadReceivedRequests])

//   const sendRequest = useCallback(
//     async (receiverId: string) => {
//       try {
//         const res = await apiClient.post<FriendRequest>('/connections/request', {
//           receiverId,
//         })
//         toast.success('Friend request sent')
//         await loadSentRequests()
//         return res.data
//       } catch (err) {
//         const message =
//           err instanceof ApiClientError ? err.message : 'Failed to send request'
//         toast.error('Could not send request', { description: message })
//         throw err
//       }
//     },
//     [loadSentRequests],
//   )

//   const respondToRequest = useCallback(
//     async (
//       requestId: string,
//       action: 'ACCEPT' | 'REJECT' | 'PENDING',
//     ) => {
//       try {
//         await apiClient.put(`/connections/request/${requestId}`, { action })
//         toast.success(
//           action === 'ACCEPT'
//             ? 'Request accepted'
//             : action === 'REJECT'
//               ? 'Request rejected'
//               : 'Request updated',
//         )
//         await Promise.all([loadFriends(), loadReceivedRequests()])
//       } catch (err) {
//         const message =
//           err instanceof ApiClientError ? err.message : 'Failed to respond'
//         toast.error('Could not respond', { description: message })
//         throw err
//       }
//     },
//     [loadFriends, loadReceivedRequests],
//   )

//   const searchUsers = useCallback(async (q: string): Promise<ConnectionUser[]> => {
//     if (!q.trim()) return []
//     try {
//       const res = await apiClient.get<ConnectionUser[]>(
//         `/connections/search?q=${encodeURIComponent(q)}`,
//       )
//       return res.data ?? []
//     } catch (err) {
//       console.error('Search failed', err)
//       return []
//     }
//   }, [])

//   useEffect(() => {
//     if (autoLoad) void loadAll()
//   }, [autoLoad, loadAll])

//   return {
//     friends,
//     sentRequests,
//     receivedRequests,
//     loading,
//     reload: loadAll,
//     sendRequest,
//     respondToRequest,
//     searchUsers,
//   }
// }











// src/hooks/useConnections.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ConnectionService,
  type ConnectionUser,
  type FriendRequest,
} from '@/lib/connection-service'

export interface UseConnectionsResult {
  friends: ConnectionUser[]
  received: FriendRequest[]
  sent: FriendRequest[]
  loading: boolean
  error: string | null
  /** Refetch everything */
  refresh: () => Promise<void>
  /** Optimistically accept a request */
  acceptRequest: (requestId: string) => Promise<void>
  /** Optimistically reject a request */
  rejectRequest: (requestId: string) => Promise<void>
}

/**
 * Central hook for connection-related data.
 * Loads friends + sent + received in parallel.
 */
export function useConnections(): UseConnectionsResult {
  const [friends, setFriends] = useState<ConnectionUser[]>([])
  const [received, setReceived] = useState<FriendRequest[]>([])
  const [sent, setSent] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [friendsRes, receivedRes, sentRes] = await Promise.all([
        ConnectionService.getFriends(),
        ConnectionService.getReceived(),
        ConnectionService.getSent(),
      ])
      if (!mountedRef.current) return
      setFriends(friendsRes)
      setReceived(receivedRes)
      setSent(sentRes)
    } catch (err: any) {
      if (!mountedRef.current) return
      setError(err?.message || 'Failed to load connections')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const acceptRequest = useCallback(
    async (requestId: string) => {
      // Optimistic — remove from received, add to friends
      const req = received.find((r) => r.id === requestId)
      if (!req) return

      const prevReceived = received
      const prevFriends = friends

      setReceived((list) => list.filter((r) => r.id !== requestId))
      if (req.sender) {
        setFriends((list) => [...list, req.sender!])
      }

      try {
        await ConnectionService.respond(requestId, 'ACCEPT')
      } catch (err: any) {
        // rollback
        if (mountedRef.current) {
          setReceived(prevReceived)
          setFriends(prevFriends)
        }
        throw err
      }
    },
    [received, friends],
  )

  const rejectRequest = useCallback(
    async (requestId: string) => {
      const prevReceived = received
      setReceived((list) => list.filter((r) => r.id !== requestId))

      try {
        await ConnectionService.respond(requestId, 'REJECT')
      } catch (err: any) {
        if (mountedRef.current) setReceived(prevReceived)
        throw err
      }
    },
    [received],
  )

  return {
    friends,
    received,
    sent,
    loading,
    error,
    refresh: load,
    acceptRequest,
    rejectRequest,
  }
}