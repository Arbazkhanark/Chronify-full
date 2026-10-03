// src/components/feed/PostContent.tsx
'use client'

import Link from 'next/link'
import { useMemo } from 'react'

/* ============================================================================
   REGEX PATTERNS
   ---------------------------------------------------------------------------
   Combined into ONE regex so we tokenize in a single pass.
   Order matters — most-specific patterns must come first.
   ============================================================================ */

const TOKEN_REGEX = new RegExp(
  [
    // URLs (http/https)
    /(https?:\/\/[^\s<>"']+)/.source,
    // Email addresses
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/.source,
    // @mentions — letters, numbers, underscores
    /(@[a-zA-Z0-9_]{2,30})/.source,
    // #hashtags — letters, numbers, underscores
    /(#[a-zA-Z0-9_]{1,50})/.source,
  ].join('|'),
  'g',
)

/* ============================================================================
   TYPES
   ============================================================================ */

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'url'; value: string }
  | { kind: 'email'; value: string }
  | { kind: 'mention'; value: string }
  | { kind: 'hashtag'; value: string }

/* ============================================================================
   TOKENIZER
   ============================================================================ */

function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  let lastIndex = 0

  // Reset lastIndex in case regex is global
  TOKEN_REGEX.lastIndex = 0

  let match: RegExpExecArray | null

  while ((match = TOKEN_REGEX.exec(text)) !== null) {
    const [full, url, email, mention, hashtag] = match
    const start = match.index

    // Push the plain text before this match
    if (start > lastIndex) {
      tokens.push({ kind: 'text', value: text.slice(lastIndex, start) })
    }

    if (url) {
      tokens.push({ kind: 'url', value: url })
    } else if (email) {
      tokens.push({ kind: 'email', value: email })
    } else if (mention) {
      tokens.push({ kind: 'mention', value: mention })
    } else if (hashtag) {
      tokens.push({ kind: 'hashtag', value: hashtag })
    }

    lastIndex = start + full.length
  }

  // Remaining text
  if (lastIndex < text.length) {
    tokens.push({ kind: 'text', value: text.slice(lastIndex) })
  }

  return tokens
}

/* ============================================================================
   COMPONENT
   ============================================================================ */

interface PostContentProps {
  content: string
  /** Preserve line breaks (default: true) */
  preserveLineBreaks?: boolean
  /** Optional extra classes */
  className?: string
}

export default function PostContent({
  content,
  preserveLineBreaks = true,
  className = '',
}: PostContentProps) {
  const tokens = useMemo(() => tokenize(content), [content])

  return (
    <p
      className={`text-sm text-gray-800 dark:text-gray-200 leading-relaxed break-words ${className}`}
      style={preserveLineBreaks ? { whiteSpace: 'pre-wrap' } : undefined}
    >
      {tokens.map((token, i) => {
        switch (token.kind) {
          /* ------------------------------------------------ URL */
          case 'url':
            return (
              <a
                key={i}
                href={token.value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {token.value}
              </a>
            )

          /* ---------------------------------------------- EMAIL */
          case 'email':
            return (
              <a
                key={i}
                href={`mailto:${token.value}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {token.value}
              </a>
            )

          /* -------------------------------------------- MENTION */
          case 'mention': {
            const username = token.value.slice(1) // strip '@'
            return (
              <Link
                key={i}
                href={`/u/${encodeURIComponent(username)}`}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {token.value}
              </Link>
            )
          }

          /* -------------------------------------------- HASHTAG */
          case 'hashtag': {
            const tag = token.value.slice(1) // strip '#'
            return (
              <Link
                key={i}
                href={`/dashboard/search?tag=${encodeURIComponent(tag)}`}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {token.value}
              </Link>
            )
          }

          /* ----------------------------------------------- TEXT */
          case 'text':
          default:
            return <span key={i}>{token.value}</span>
        }
      })}
    </p>
  )
}