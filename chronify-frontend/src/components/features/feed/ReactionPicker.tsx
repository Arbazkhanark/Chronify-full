// src/components/features/feed/ReactionPicker.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ReactionKind } from '@/types/feed'

const REACTIONS: {
  kind: ReactionKind
  emoji: string
  label: string
  color: string
}[] = [
  { kind: 'LIKE', emoji: '👍', label: 'Like', color: '#3B82F6' },
  { kind: 'LOVE', emoji: '❤️', label: 'Love', color: '#EF4444' },
  { kind: 'HAHA', emoji: '😂', label: 'Haha', color: '#F59E0B' },
  { kind: 'SAD', emoji: '😢', label: 'Sad', color: '#6B7280' },
  { kind: 'ANGRY', emoji: '😡', label: 'Angry', color: '#DC2626' },
]

/* ============================================================================
   HELPERS
   ============================================================================ */

export function getReactionEmoji(kind: ReactionKind | null): string {
  if (!kind) return '👍'
  return REACTIONS.find((r) => r.kind === kind)?.emoji ?? '👍'
}

export function getReactionLabel(kind: ReactionKind | null): string {
  if (!kind) return 'Like'
  return REACTIONS.find((r) => r.kind === kind)?.label ?? 'Like'
}

export function getReactionColor(kind: ReactionKind | null): string {
  if (!kind) return '#6B7280'
  return REACTIONS.find((r) => r.kind === kind)?.color ?? '#6B7280'
}

export function getTopReactions(
  summary: Record<string, number> | undefined,
): { emoji: string; count: number }[] {
  if (!summary) return []
  return Object.entries(summary)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([kind, count]) => ({
      emoji: getReactionEmoji(kind as ReactionKind),
      count,
    }))
}

/* ============================================================================
   COMPONENT
   ============================================================================ */

export interface ReactionPickerProps {
  currentReaction: ReactionKind | null
  onSelect: (reaction: ReactionKind) => void
  onRemove: () => void
  disabled?: boolean
  /** Small variant for comments */
  compact?: boolean
}

export default function ReactionPicker({
  currentReaction,
  onSelect,
  onRemove,
  disabled = false,
  compact = false,
}: ReactionPickerProps) {
  const [show, setShow] = useState(false)

  const handleClick = () => {
    if (disabled) return
    if (currentReaction) onRemove()
    else onSelect('LIKE')
  }

  // Emoji glyph — always show something (default 👍 when nothing selected)
  const displayEmoji = currentReaction ? getReactionEmoji(currentReaction) : '👍'
  const displayLabel = currentReaction ? getReactionLabel(currentReaction) : 'Like'
  const labelColor = currentReaction ? getReactionColor(currentReaction) : undefined

  return (
    <div
      className="relative"
      onMouseEnter={() => !disabled && setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={
          compact
            ? `px-2 py-1 rounded-md text-xs font-medium transition hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1 disabled:opacity-60 ${
                currentReaction ? '' : 'text-gray-600 dark:text-gray-400'
              }`
            : `px-3 py-1.5 rounded-md text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5 disabled:opacity-60 ${
                currentReaction ? '' : 'text-gray-600 dark:text-gray-400'
              }`
        }
        style={labelColor ? { color: labelColor } : undefined}
      >
        {/* 🆕 Emoji always visible, larger */}
        <span
          className={compact ? 'text-sm leading-none' : 'text-base leading-none'}
          aria-hidden
        >
          {displayEmoji}
        </span>
        <span>{displayLabel}</span>
      </button>

      <AnimatePresence>
        {show && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            className={
              compact
                ? 'absolute bottom-full left-0 mb-1 flex items-center gap-0.5 bg-white dark:bg-gray-800 rounded-full px-1 py-0.5 shadow-lg border border-gray-200 dark:border-gray-700 z-30'
                : 'absolute bottom-full left-0 mb-1 flex items-center gap-0.5 bg-white dark:bg-gray-800 rounded-full px-1.5 py-1 shadow-lg border border-gray-200 dark:border-gray-700 z-30'
            }
          >
            {REACTIONS.map((r) => (
              <button
                key={r.kind}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(r.kind)
                  setShow(false)
                }}
                title={r.label}
                aria-label={r.label}
                className={
                  compact
                    ? 'w-7 h-7 flex items-center justify-center text-lg hover:scale-125 transition-transform'
                    : 'w-9 h-9 flex items-center justify-center text-xl hover:scale-125 transition-transform'
                }
              >
                {r.emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}



