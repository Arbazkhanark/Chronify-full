// src/hooks/useConnectionStatus.ts
'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'

export type ConnectionStatus =
  | 'self'
  | 'none'
  | 'pending_sent'
  | 'pending_received'
  | 'friends'
  | 'loading'

interface ConnectionSnapshot {
  status: ConnectionStatus
  /** If pending_sent: the sent request id (for cancel) */
  requestId?: string
  /** If pending_received: the received request id (for accept/reject) */
  receivedRequestId?: string
  /** If friends: the friendship record id */
  friendshipId?: string
}

/**
 * Determine the connection status between the current user
 * and another user (by userId).
 *
 * Fetches the current user's connections once and caches them for
 * the session. If your backend has a dedicated endpoint for this
 * (e.g. `/connections/status/:userId`), swap the implementation.
 */
const snapshotCache: {
  loaded: boolean
  friends: Array<{ id: string; userId: string; friendId: string }>
  sent: Array<{ id: string; receiverId: string }>
  received: Array<{ id: string; senderId: string }>
} = {
  loaded: false,
  friends: [],
  sent: [],
  received: [],
}

let inflight: Promise<void> | null = null

async function loadSnapshot(): Promise<void> {
  if (snapshotCache.loaded) return
  if (inflight) return inflight

  inflight = (async () => {
    try {
      const [friendsRes, sentRes, recvRes] = await Promise.all([
        apiClient.get<any[]>('/connections/friends'),
        apiClient.get<any[]>('/connections/requests/sent'),
        apiClient.get<any[]>('/connections/requests/received'),
      ])

      snapshotCache.friends = (friendsRes.data ?? []).map((f) => ({
        id: f.id,
        userId: f.userId,
        friendId: f.friendId,
      }))
      snapshotCache.sent = (sentRes.data ?? []).map((r) => ({
        id: r.id,
        receiverId: r.receiverId,
      }))
      snapshotCache.received = (recvRes.data ?? []).map((r) => ({
        id: r.id,
        senderId: r.senderId,
      }))
      snapshotCache.loaded = true
    } finally {
      inflight = null
    }
  })()

  return inflight
}

export function invalidateConnectionSnapshot() {
  snapshotCache.loaded = false
  snapshotCache.friends = []
  snapshotCache.sent = []
  snapshotCache.received = []
}

export function useConnectionStatus(
  targetUserId: string | null | undefined,
  currentUserId: string | null | undefined,
) {
  const [state, setState] = useState<ConnectionSnapshot>({
    status: 'loading',
  })

  useEffect(() => {
    if (!targetUserId || !currentUserId) {
      setState({ status: 'loading' })
      return
    }

    if (targetUserId === currentUserId) {
      setState({ status: 'self' })
      return
    }

    let cancelled = false

    const run = async () => {
      try {
        await loadSnapshot()
        if (cancelled) return

        // friends?
        const friendRec = snapshotCache.friends.find(
          (f) =>
            (f.userId === currentUserId && f.friendId === targetUserId) ||
            (f.userId === targetUserId && f.friendId === currentUserId),
        )
        if (friendRec) {
          setState({ status: 'friends', friendshipId: friendRec.id })
          return
        }

        // sent pending?
        const sentRec = snapshotCache.sent.find(
          (r) => r.receiverId === targetUserId,
        )
        if (sentRec) {
          setState({ status: 'pending_sent', requestId: sentRec.id })
          return
        }

        // received pending?
        const recvRec = snapshotCache.received.find(
          (r) => r.senderId === targetUserId,
        )
        if (recvRec) {
          setState({
            status: 'pending_received',
            receivedRequestId: recvRec.id,
          })
          return
        }

        setState({ status: 'none' })
      } catch {
        if (!cancelled) setState({ status: 'none' })
      }
    }

    void run()

    return () => {
      cancelled = true
    }

    
  }, [targetUserId, currentUserId])

  return state
}