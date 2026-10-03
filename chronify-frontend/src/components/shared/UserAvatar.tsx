// src/components/common/UserAvatar.tsx
'use client'

import { useState } from 'react'

interface UserAvatarProps {
  /** Full name of the user (used for initials fallback) */
  name?: string | null
  /** URL of the avatar image (can be null / undefined / empty) */
  avatarUrl?: string | null
  /** Size in pixels — width = height */
  size?: number
  /** Extra classes to append */
  className?: string
  /** Optional click handler */
  onClick?: () => void
}

/**
 * UserAvatar
 * -----------------------------------------------------------------------
 * Renders a circular user avatar.
 * - Shows the image if `avatarUrl` is a non-empty string.
 * - Falls back to initials derived from `name`.
 * - If the image fails to load, falls back to initials automatically.
 * - Colour is a pleasant blue→purple gradient.
 */
export default function UserAvatar({
  name,
  avatarUrl,
  size = 40,
  className = '',
  onClick,
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false)

  const initials = (() => {
    if (!name || !name.trim()) return 'U'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (
      parts[0][0] + parts[parts.length - 1][0]
    ).toUpperCase()
  })()

  const hasValidUrl =
    typeof avatarUrl === 'string' && avatarUrl.trim().length > 0

  const showImage = hasValidUrl && !imgError

  const wrapperClass = [
    'rounded-full',
    'bg-gradient-to-br from-blue-500 to-purple-500',
    'flex items-center justify-center',
    'text-white font-semibold flex-shrink-0',
    'overflow-hidden select-none',
    onClick ? 'cursor-pointer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={wrapperClass}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl!}
          alt={name ?? 'User avatar'}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          draggable={false}
        />
      ) : (
        <span aria-hidden>{initials}</span>
      )}
    </div>
  )
}