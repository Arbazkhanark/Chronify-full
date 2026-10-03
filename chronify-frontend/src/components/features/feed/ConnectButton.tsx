// src/components/social/ConnectButton.tsx
'use client'

import { useState } from 'react'
import { UserPlus, UserCheck, Clock, Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { apiClient, ApiClientError } from '@/lib/api-client'
import {
  useConnectionStatus,
  invalidateConnectionSnapshot,
} from '@/hooks/useConnectionStatus'

interface ConnectButtonProps {
  targetUserId: string
  currentUserId: string | null | undefined
  /** compact — icon-only version for tight spaces */
  compact?: boolean
}

export function ConnectButton({
  targetUserId,
  currentUserId,
  compact = false,
}: ConnectButtonProps) {
  const snapshot = useConnectionStatus(targetUserId, currentUserId)
  const [busy, setBusy] = useState(false)

  // Don't render for self
  if (snapshot.status === 'self') return null

  const handleConnect = async () => {
    setBusy(true)
    try {
      await apiClient.post('/connections/request', {
        receiverId: targetUserId,
      })
      toast.success('Request sent')
      invalidateConnectionSnapshot()
      // Trigger re-fetch by reloading page state
      window.dispatchEvent(new Event('connection-updated'))
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : 'Failed to send'
      toast.error('Could not send request', { description: msg })
    } finally {
      setBusy(false)
    }
  }

  const handleAccept = async (requestId: string) => {
    setBusy(true)
    try {
      await apiClient.put(`/connections/request/${requestId}`, {
        action: 'ACCEPT',
      })
      toast.success('Connection accepted')
      invalidateConnectionSnapshot()
      window.dispatchEvent(new Event('connection-updated'))
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : 'Failed'
      toast.error('Could not accept', { description: msg })
    } finally {
      setBusy(false)
    }
  }

  const handleReject = async (requestId: string) => {
    setBusy(true)
    try {
      await apiClient.put(`/connections/request/${requestId}`, {
        action: 'REJECT',
      })
      toast.success('Request rejected')
      invalidateConnectionSnapshot()
      window.dispatchEvent(new Event('connection-updated'))
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : 'Failed'
      toast.error('Could not reject', { description: msg })
    } finally {
      setBusy(false)
    }
  }

  // ----- Render based on status -----

  if (snapshot.status === 'loading') {
    return (
      <Button
        size={compact ? 'icon' : 'sm'}
        variant="ghost"
        disabled
        className={compact ? 'w-8 h-8' : ''}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    )
  }

  if (snapshot.status === 'friends') {
    return (
      <Button
        size={compact ? 'icon' : 'sm'}
        variant="ghost"
        disabled
        className={compact ? 'w-8 h-8' : ''}
        title="Already connected"
      >
        <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
        {!compact && <span className="ml-1.5">Connected</span>}
      </Button>
    )
  }

  if (snapshot.status === 'pending_sent') {
    return (
      <Button
        size={compact ? 'icon' : 'sm'}
        variant="ghost"
        disabled
        className={compact ? 'w-8 h-8' : ''}
        title="Request pending"
      >
        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        {!compact && <span className="ml-1.5">Pending</span>}
      </Button>
    )
  }

  if (snapshot.status === 'pending_received') {
    return (
      <div className="flex gap-1">
        <Button
          size={compact ? 'icon' : 'sm'}
          variant="default"
          disabled={busy}
          onClick={() =>
            snapshot.receivedRequestId &&
            void handleAccept(snapshot.receivedRequestId)
          }
          className={compact ? 'w-8 h-8' : ''}
          title="Accept"
        >
          {busy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
        </Button>
        {!compact && (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() =>
              snapshot.receivedRequestId &&
              void handleReject(snapshot.receivedRequestId)
            }
            title="Reject"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  // Default: none
  return (
    <Button
      size={compact ? 'icon' : 'sm'}
      variant="outline"
      disabled={busy}
      onClick={() => void handleConnect()}
      className={compact ? 'w-8 h-8' : ''}
      title="Connect"
    >
      {busy ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          {!compact && <span className="ml-1.5">Connect</span>}
        </>
      )}
    </Button>
  )
}