'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Check, X, UserPlus, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { ConnectionService } from '@/lib/connection-service'
import type { ConnectionUser } from '@/types/connection-types'
import UserAvatar from '@/components/shared/UserAvatar'

interface Props {
  user: ConnectionUser
  /** What to show as the right-side action */
  mode: 'friend' | 'received' | 'sent' | 'search'
  /** For 'received' mode — the request id */
  requestId?: string
  /** Callbacks for optimistic updates */
  onAccept?: (requestId: string) => Promise<void>
  onReject?: (requestId: string) => Promise<void>
  onSent?: (user: ConnectionUser) => void
}

export default function ConnectionCard({
  user,
  mode,
  requestId,
  onAccept,
  onReject,
  onSent,
}: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [sentNow, setSentNow] = useState(false)

  const profileHref = user.profile?.userName
    ? `/u/${encodeURIComponent(user.profile.userName)}`
    : '#'

  const handleAccept = async () => {
    if (!requestId || !onAccept) return
    setBusy(true)
    try {
      await onAccept(requestId)
      toast.success(`You're now connected with ${user.name}`)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to accept')
    } finally {
      setBusy(false)
    }
  }

  const handleReject = async () => {
    if (!requestId || !onReject) return
    setBusy(true)
    try {
      await onReject(requestId)
      toast.success('Request rejected')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject')
    } finally {
      setBusy(false)
    }
  }

  const handleConnect = async () => {
    setBusy(true)
    try {
      await ConnectionService.sendRequest(user.id)
      setSentNow(true)
      onSent?.(user)
      toast.success(`Request sent to ${user.name}`)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send request')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-sm transition-shadow">
      {/* Avatar */}
      <button
        onClick={() => profileHref !== '#' && router.push(profileHref)}
        className="flex-shrink-0"
        aria-label={`View ${user.name}'s profile`}
      >
        <UserAvatar
          name={user.name}
          avatarUrl={user.profile?.avatarUrl}
          size={56}
        />
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={profileHref}
          className="block hover:underline focus:outline-none focus:underline"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {user.name}
          </h3>
        </Link>

        {user.profile?.userName && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            @{user.profile.userName}
          </p>
        )}

        {user.profile?.profession && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 truncate">
            {user.profile.profession}
          </p>
        )}

        {(user.profile?.city || user.profile?.country) && (
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            {[user.profile?.city, user.profile?.country]
              .filter(Boolean)
              .join(', ')}
          </p>
        )}

        {/* Fields / tags */}
        {(user.fields?.length || user.subFields?.length) ? (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {[...(user.fields ?? []), ...(user.subFields ?? [])]
              .slice(0, 3)
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[10px] font-normal px-1.5 py-0"
                >
                  {tag}
                </Badge>
              ))}
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {mode === 'received' && (
          <>
            <Button
              size="sm"
              onClick={handleAccept}
              disabled={busy}
              className="gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReject}
              disabled={busy}
              className="gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Reject
            </Button>
          </>
        )}

        {mode === 'friend' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info('Messaging coming soon')}
            className="gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Message
          </Button>
        )}

        {mode === 'sent' && (
          <Badge variant="outline" className="text-xs">
            Pending
          </Badge>
        )}

        {mode === 'search' && (
          <Button
            size="sm"
            onClick={handleConnect}
            disabled={busy || sentNow}
            variant={sentNow ? 'outline' : 'default'}
            className="gap-1.5"
          >
            {sentNow ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Sent
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                Connect
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}