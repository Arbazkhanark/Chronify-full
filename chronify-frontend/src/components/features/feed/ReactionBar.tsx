// src/components/features/feed/ReactionBar.tsx
'use client'

import { ThumbsUp, Heart, Laugh, Frown, Angry } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ReactionKind } from '@/types/feed'
import { useReactions } from '@/hooks/useReactions'

const REACTION_META: Record<
  ReactionKind,
  { icon: typeof ThumbsUp; label: string; color: string }
> = {
  LIKE: { icon: ThumbsUp, label: 'Like', color: 'text-blue-500' },
  LOVE: { icon: Heart, label: 'Love', color: 'text-red-500' },
  HAHA: { icon: Laugh, label: 'Haha', color: 'text-yellow-500' },
  SAD: { icon: Frown, label: 'Sad', color: 'text-orange-500' },
  ANGRY: { icon: Angry, label: 'Angry', color: 'text-red-600' },
}

interface ReactionBarProps {
  target: 'post' | 'comment'
  targetId: string
}

export function ReactionBar({ target, targetId }: ReactionBarProps) {
  const { summary, react, removeReaction } = useReactions(target, targetId)
  const myReaction = summary?.myReaction ?? null

  const handleClick = async (kind: ReactionKind) => {
    if (myReaction === kind) {
      await removeReaction()
    } else {
      await react(kind)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {Object.entries(REACTION_META).map(([kind, meta]) => {
        const Icon = meta.icon
        const isActive = myReaction === kind
        const count = summary?.counts?.[kind as ReactionKind] ?? 0

        return (
          <Button
            key={kind}
            type="button"
            size="sm"
            variant={isActive ? 'secondary' : 'ghost'}
            onClick={() => handleClick(kind as ReactionKind)}
            className={cn(
              'h-8 px-2 gap-1.5',
              isActive && 'bg-primary/10',
            )}
            title={meta.label}
          >
            <Icon
              className={cn(
                'w-4 h-4',
                isActive ? meta.color : 'text-muted-foreground',
              )}
            />
            {count > 0 && (
              <span className="text-xs font-medium">{count}</span>
            )}
          </Button>
        )
      })}
    </div>
  )
}