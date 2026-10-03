// src/lib/post-parser.ts

/* ============================================================================
   POST CONTENT PARSER
   ============================================================================
   Converts raw post text into a structured list of tokens.

   Supported syntax:
     - URLs              : https://example.com, www.example.com
     - Emails            : someone@example.com
     - Hashtags          : #Hiring, #IndoreJobs
     - Mentions          : @username
     - Bold              : **bold** or __bold__
     - Italic            : *italic* or _italic_
     - Bold italic       : ***both*** or ___both___
     - Inline code       : `code`
     - Strikethrough     : ~~strike~~
   ============================================================================ */

export type TokenType =
  | 'text'
  | 'url'
  | 'email'
  | 'hashtag'
  | 'mention'
  | 'bold'
  | 'italic'
  | 'bold_italic'
  | 'code'
  | 'strike'
  | 'newline'

export interface Token {
  type: TokenType
  value: string
  /** For URL tokens, the actual href (may differ from display value) */
  href?: string
}

/* ----------------------------------------------------------------------------
   Regexes
   ---------------------------------------------------------------------------- */

// URL — captures http(s), www., or bare domain with TLD
const URL_RE =
  /\b(?:https?:\/\/[^\s<>()]+|www\.[^\s<>()]+|[a-z0-9-]+(?:\.[a-z0-9-]+)+\.(?:com|org|net|io|co|in|dev|ai|app|me|edu|gov|info|biz|xyz|tech|online|site|store|us|uk|ca|de|fr|jp|au|nz|ru|cn|br|za|mx|es|it|nl|se|no|dk|fi|pl|ch|at|be|ie|pt|gr|tr|il|sg|hk|kr|my|th|id|ph|vn|pk|bd|lk|np|sa|ae|eg|ng|ke|gh|tz|ug|zm|zw|ar|cl|pe|co)(?:\/[^\s<>()]*)?)/gi

// Email
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi

// Hashtag — starts with #, followed by unicode letters/digits/underscore
const HASHTAG_RE = /#[\p{L}\p{N}_]+/gu

// Mention — starts with @, followed by unicode letters/digits/underscore
const MENTION_RE = /@[\p{L}\p{N}_]+/gu

/* ----------------------------------------------------------------------------
   Main parser
   ---------------------------------------------------------------------------- */

/**
 * Parse raw text into tokens.
 *
 * @param text - raw post content
 * @param opts.mentionHrefs - optional map of username → href (for @mentions)
 *                           e.g. { "arbaz": "/u/arbaz" }. Defaults to `/u/<username>`.
 */
export function parsePostContent(
  text: string,
  opts: {
    mentionHrefs?: Record<string, string>
    hashtagHrefs?: Record<string, string>
  } = {},
): Token[] {
  if (!text) return []

  // 1) Extract markdown tokens first (they contain user text and could
  //    contain urls/hashtags inside — that's fine, we don't recurse).
  // 2) Then split remaining text on urls/emails/hashtags/mentions.
  //
  // To do both in a single pass, we build a "regex map" and iterate.

  const patterns: Array<{ type: TokenType; regex: RegExp }> = [
    // Order matters — longer/more-specific first
    { type: 'bold_italic', regex: /\*\*\*([^*\n]+)\*\*\*|___([^_\n]+)___/ },
    { type: 'bold', regex: /\*\*([^*\n]+)\*\*|__([^_\n]+)__/ },
    { type: 'italic', regex: /\*([^*\n]+)\*|_([^_\n]+)_/ },
    { type: 'code', regex: /`([^`\n]+)`/ },
    { type: 'strike', regex: /~~([^~\n]+)~~/ },
    { type: 'url', regex: URL_RE },
    { type: 'email', regex: EMAIL_RE },
    { type: 'hashtag', regex: HASHTAG_RE },
    { type: 'mention', regex: MENTION_RE },
  ]

  // We'll walk the string, finding the earliest match of any pattern.
  const tokens: Token[] = []
  let cursor = 0

  while (cursor < text.length) {
    let earliest: {
      type: TokenType
      start: number
      end: number
      match: RegExpExecArray
    } | null = null

    for (const { type, regex } of patterns) {
      // Reset lastIndex because regexes are global
      regex.lastIndex = cursor
      const m = regex.exec(text)
      if (!m) continue

      if (
        !earliest ||
        m.index < earliest.start ||
        (m.index === earliest.start && m[0].length > (earliest.match[0]?.length ?? 0))
      ) {
        earliest = { type, start: m.index, end: m.index + m[0].length, match: m }
      }
    }

    if (!earliest) {
      // No more matches — push the rest as plain text
      pushText(tokens, text.slice(cursor))
      break
    }

    // Push any plain text before the match
    if (earliest.start > cursor) {
      pushText(tokens, text.slice(cursor, earliest.start))
    }

    const { type, match } = earliest

    switch (type) {
      case 'bold_italic': {
        const inner = match[1] ?? match[2] ?? ''
        tokens.push({ type: 'bold_italic', value: inner })
        break
      }
      case 'bold': {
        const inner = match[1] ?? match[2] ?? ''
        tokens.push({ type: 'bold', value: inner })
        break
      }
      case 'italic': {
        const inner = match[1] ?? match[2] ?? ''
        tokens.push({ type: 'italic', value: inner })
        break
      }
      case 'code': {
        tokens.push({ type: 'code', value: match[1] ?? '' })
        break
      }
      case 'strike': {
        tokens.push({ type: 'strike', value: match[1] ?? '' })
        break
      }
      case 'url': {
        const raw = match[0]
        const href = normalizeUrl(raw)
        tokens.push({ type: 'url', value: raw, href })
        break
      }
      case 'email': {
        tokens.push({
          type: 'email',
          value: match[0],
          href: `mailto:${match[0]}`,
        })
        break
      }
      case 'hashtag': {
        const tag = match[0].slice(1) // strip '#'
        const href =
          opts.hashtagHrefs?.[tag] ?? `/search?q=%23${encodeURIComponent(tag)}`
        tokens.push({ type: 'hashtag', value: match[0], href })
        break
      }
      case 'mention': {
        const username = match[0].slice(1) // strip '@'
        const href =
          opts.mentionHrefs?.[username] ??
          `/u/${encodeURIComponent(username)}`
        tokens.push({ type: 'mention', value: match[0], href })
        break
      }
    }

    cursor = earliest.end
  }

  return mergeAdjacentText(tokens)
}

/* ----------------------------------------------------------------------------
   Helpers
   ---------------------------------------------------------------------------- */

function pushText(tokens: Token[], chunk: string) {
  if (!chunk) return

  // Split on newlines so each line can be rendered as a separate <br>.
  const parts = chunk.split('\n')
  parts.forEach((part, i) => {
    if (i > 0) tokens.push({ type: 'newline', value: '\n' })
    if (part) tokens.push({ type: 'text', value: part })
  })
}

function mergeAdjacentText(tokens: Token[]): Token[] {
  const out: Token[] = []
  for (const t of tokens) {
    const last = out[out.length - 1]
    if (last && last.type === 'text' && t.type === 'text') {
      last.value += t.value
    } else {
      out.push({ ...t })
    }
  }
  return out
}

function normalizeUrl(raw: string): string {
  if (/^https?:\/\//i.test(raw)) return raw
  if (/^www\./i.test(raw)) return `https://${raw}`
  return `https://${raw}`
}

/* ----------------------------------------------------------------------------
   Utilities exported for the UI
   ---------------------------------------------------------------------------- */

/** Truncate text at the nearest word boundary before `maxLen`. */
export function truncateAtWord(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  const slice = text.slice(0, maxLen)
  const lastSpace = Math.max(slice.lastIndexOf(' '), slice.lastIndexOf('\n'))
  return lastSpace > maxLen * 0.6 ? slice.slice(0, lastSpace) : slice
}

/** Fast heuristic: does this text look "long enough" to collapse? */
export function isLongPost(text: string, threshold = 320): boolean {
  if (!text) return false
  if (text.length > threshold) return true
  // Count line breaks too
  const newlines = (text.match(/\n/g) ?? []).length
  return newlines > 6
}