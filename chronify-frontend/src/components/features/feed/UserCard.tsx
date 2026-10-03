// src/components/social/UserCard.tsx
'use client'

import Link from 'next/link'
import { UserPlus, Check, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ConnectionUser } from '@/types/feed'

interface UserCardProps {
  user: ConnectionUser
  action?: 'add' | 'accept-reject' | 'none'
  onAdd?: () => void
  onAccept?: () => void
  onReject?: () => void
  busy?: boolean
}

export function UserCard({
  user,
  action = 'none',
  onAdd,
  onAccept,
  onReject,
  busy = false,
}: UserCardProps) {
  const initials = user.name?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <Card className="border-border/60 hover:border-border transition-colors">
      <CardContent className="p-4 flex items-center gap-3">
        <Link href={`/u/${user.userName ?? user.id}`}>
          <Avatar className="w-12 h-12 shrink-0">
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            href={`/u/${user.userName ?? user.id}`}
            className="block"
          >
            <p className="font-semibold text-sm truncate">
              {user.name}
            </p>
            {user.userName && (
              <p className="text-xs text-muted-foreground truncate">
                @{user.userName}
              </p>
            )}
            {user.profession && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {user.profession}
              </p>
            )}
          </Link>
        </div>

        {action === 'add' && (
          <Button
            size="sm"
            variant="outline"
            onClick={onAdd}
            disabled={busy}
            className="shrink-0"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Add
          </Button>
        )}

        {action === 'accept-reject' && (
          <div className="flex gap-1.5 shrink-0">
            <Button
              size="icon"
              variant="default"
              onClick={onAccept}
              disabled={busy}
              className="w-8 h-8"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={onReject}
              disabled={busy}
              className="w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}