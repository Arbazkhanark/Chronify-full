// src/lib/rich-text.tsx
'use client'

import React from 'react'
import type { Token } from './post-parser'

/* ============================================================================
   RICH TEXT RENDERER
   ============================================================================
   Takes tokens produced by `parsePostContent` and turns them into React
   elements. Keeps links safe (target=_blank, rel=noopener noreferrer),
   makes hashtags/mentions blue and clickable, and preserves whitespace.
   ============================================================================ */

interface RichTextProps {
  tokens: Token[]
  /** optional click handler — useful to intercept navigation in-app */
  onHashtagClick?: (tag: string) => void
  onMentionClick?: (username: string) => void
}

export function RichText({
  tokens,
  onHashtagClick,
  onMentionClick,
}: RichTextProps) {
  return (
    <>
      {tokens.map((token, i) => renderToken(token, i, onHashtagClick, onMentionClick))}
    </>
  )
}

function renderToken(
  token: Token,
  key: number,
  onHashtagClick?: (tag: string) => void,
  onMentionClick?: (username: string) => void,
): React.ReactNode {
  switch (token.type) {
    case 'text':
      return <React.Fragment key={key}>{token.value}</React.Fragment>

    case 'newline':
      return <br key={key} />

    case 'bold':
      return <strong key={key}>{token.value}</strong>

    case 'italic':
      return <em key={key}>{token.value}</em>

    case 'bold_italic':
      return (
        <strong key={key}>
          <em>{token.value}</em>
        </strong>
      )

    case 'strike':
      return <del key={key}>{token.value}</del>

    case 'code':
      return (
        <code
          key={key}
          className="px-1.5 py-0.5 rounded bg-muted text-[0.9em] font-mono"
        >
          {token.value}
        </code>
      )

    case 'url':
      return (
        <a
          key={key}
          href={token.href ?? token.value}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-blue-600 dark:text-blue-400 hover:underline break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {token.value}
        </a>
      )

    case 'email':
      return (
        <a
          key={key}
          href={token.href ?? `mailto:${token.value}`}
          className="text-blue-600 dark:text-blue-400 hover:underline break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {token.value}
        </a>
      )

    case 'hashtag':
      return (
        <a
          key={key}
          href={token.href ?? '#'}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          onClick={(e) => {
            if (onHashtagClick && token.value) {
              e.preventDefault()
              onHashtagClick(token.value.slice(1))
            }
          }}
        >
          {token.value}
        </a>
      )

    case 'mention':
      return (
        <a
          key={key}
          href={token.href ?? '#'}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          onClick={(e) => {
            if (onMentionClick && token.value) {
              e.preventDefault()
              onMentionClick(token.value.slice(1))
            }
          }}
        >
          {token.value}
        </a>
      )

    default:
      return null
  }
}