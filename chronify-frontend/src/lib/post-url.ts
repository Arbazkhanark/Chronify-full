// // src/lib/post-url.ts
// import type { Post } from '@/types/feed'

// /* ============================================================================
//    SLUG BUILDER
//    ---------------------------------------------------------------------------
//    Build a LinkedIn-style URL:
//      /feed/posts/john_doe-finished-my-dsa-course-edfc3500
//    ============================================================================ */

// function slugify(text: string): string {
//   return text
//     .toLowerCase()
//     .normalize('NFKD')
//     .replace(/[\u0300-\u036f]/g, '') // strip accents
//     .replace(/[^a-z0-9\s-]/g, '') // remove special chars
//     .trim()
//     .replace(/\s+/g, '-')
//     .replace(/-+/g, '-')
//     .slice(0, 60) // cap length
// }

// function shortId(uuid: string): string {
//   const cleaned = uuid.replace(/-/g, '')
//   return cleaned.slice(-8).toLowerCase()
// }

// export function buildPostSlug(post: Post): string {
//   const user =
//     post.user.profile?.userName?.trim() || post.user.name || 'user'
//   const userPart = slugify(user)

//   const firstWords = post.content.split(/\s+/).slice(0, 6).join(' ')
//   const titlePart = slugify(firstWords)

//   const sid = shortId(post.id)

//   if (titlePart) return `${userPart}-${titlePart}-${sid}`
//   return `${userPart}-${sid}`
// }

// export function getPostPublicUrl(post: Post): string {
//   const slug = buildPostSlug(post)
//   const base =
//     typeof window !== 'undefined'
//       ? window.location.origin
//       : process.env.NEXT_PUBLIC_APP_URL || 'https://chronify.com'
//   return `${base}/feed/post/${slug}`
// }

// export function extractShortId(slugOrId: string): string {
//   const uuidRegex =
//     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
//   if (uuidRegex.test(slugOrId)) return slugOrId

//   const parts = slugOrId.split('-')
//   return parts[parts.length - 1] ?? slugOrId
// }









// // src/lib/post-url.ts
// import type { Post } from '@/types/feed'

// function slugify(text: string): string {
//   return text
//     .toLowerCase()
//     .normalize('NFKD')
//     .replace(/[\u0300-\u036f]/g, '')
//     .replace(/[^a-z0-9\s-]/g, '')
//     .trim()
//     .replace(/\s+/g, '-')
//     .replace(/-+/g, '-')
//     .slice(0, 60)
// }

// function shortId(uuid: string): string {
//   const cleaned = uuid.replace(/-/g, '')
//   return cleaned.slice(-8).toLowerCase()
// }

// export function buildPostSlug(post: Post): string {
//   const user =
//     post.user.profile?.userName?.trim() || post.user.name || 'user'
//   const userPart = slugify(user)
//   const firstWords = post.content.split(/\s+/).slice(0, 6).join(' ')
//   const titlePart = slugify(firstWords)
//   const sid = shortId(post.id)
//   if (titlePart) return `${userPart}-${titlePart}-${sid}`
//   return `${userPart}-${sid}`
// }

// export function getPostPublicUrl(post: Post): string {
//   const slug = buildPostSlug(post)
//   const base =
//     typeof window !== 'undefined'
//       ? window.location.origin
//       : process.env.NEXT_PUBLIC_APP_URL || 'https://chronify.com'
//   return `${base}/feed/post/${slug}`
// }

// export function extractShortId(slugOrId: string): string {
//   const uuidRegex =
//     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
//   if (uuidRegex.test(slugOrId)) return slugOrId
//   const parts = slugOrId.split('-')
//   return parts[parts.length - 1] ?? slugOrId
// }





// // src/lib/post-url.ts
// import type { Post } from '@/types/feed'

// /* ============================================================================
//    SLUG HELPERS
//    ---------------------------------------------------------------------------
//    Build LinkedIn-style URL:
//      /posts/{username}-{title-words}-{shortId}

//    Where `shortId` = FIRST 8 hex chars of the post UUID.
//    Backend then matches: WHERE id LIKE 'shortId%'
//    ============================================================================ */

// function slugify(text: string): string {
//   return text
//     .toLowerCase()
//     .normalize('NFKD')
//     .replace(/[\u0300-\u036f]/g, '') // strip accents
//     .replace(/[^a-z0-9\s-]/g, '') // remove special chars
//     .trim()
//     .replace(/\s+/g, '-')
//     .replace(/-+/g, '-')
//     .slice(0, 60)
// }

// /**
//  * 🔥 FIRST 8 hex chars of a UUID.
//  *
//  * Why first, not last?
//  *   - Backend uses `id LIKE 'shortId%'` (startsWith).
//  *   - UUID starts with these chars, so `startsWith` matches.
//  *   - If we took the LAST 8, we'd need `endsWith` (slower, no index).
//  */
// function shortId(uuid: string): string {
//   const cleaned = uuid.replace(/-/g, '')
//   return cleaned.slice(0, 8).toLowerCase()
// }

// /**
//  * Build a LinkedIn-style slug.
//  *   Post: { id: "edfc3500-7a9c-...", user: { userName: "arbaazkhan23" },
//  *           content: "Iring oftware evelopment ngineering eb" }
//  *   Slug: "arbaazkhan23-iring-oftware-evelopment-ngineering-eb-edfc3500"
//  */
// export function buildPostSlug(post: Post): string {
//   const user =
//     post.user.profile?.userName?.trim() || post.user.name || 'user'
//   const userPart = slugify(user)

//   const firstWords = post.content.split(/\s+/).slice(0, 6).join(' ')
//   const titlePart = slugify(firstWords)

//   const sid = shortId(post.id)

//   if (titlePart) return `${userPart}-${titlePart}-${sid}`
//   return `${userPart}-${sid}`
// }

// /**
//  * Canonical public URL for a post.
//  *   https://chronify.com/posts/arbaazkhan23-my-post-edfc3500
//  */
// export function getPostPublicUrl(post: Post): string {
//   const slug = buildPostSlug(post)
//   const base =
//     typeof window !== 'undefined'
//       ? window.location.origin
//       : process.env.NEXT_PUBLIC_APP_URL || 'https://chronify.com'
//   return `${base}/feed/post/${slug}`
// }

// /**
//  * Given a URL slug or raw UUID, extract the short id used by the backend.
//  *   "arbaazkhan23-my-post-edfc3500"  →  "edfc3500"
//  *   "edfc3500-7a9c-42ce-8459-2ff11179df8f"  →  "edfc3500-7a9c-42ce-8459-2ff11179df8f"
//  */
// export function extractShortId(slugOrId: string): string {
//   const trimmed = String(slugOrId || '').trim()
//   if (!trimmed) return ''

//   // Full UUID → return as-is
//   const uuidRegex =
//     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
//   if (uuidRegex.test(trimmed)) return trimmed

//   // Slug form → last segment
//   const parts = trimmed.split('-')
//   return parts[parts.length - 1] ?? trimmed
// }


































// src/lib/post-url.ts
import type { Post } from '@/types/feed'

/* ============================================================================
   SLUG HELPERS
   ============================================================================ */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

/**
 * FIRST 8 hex chars of a UUID.
 * Backend uses `id LIKE 'shortId%'` → startsWith match.
 */
function shortId(uuid: string): string {
  const cleaned = String(uuid || '').replace(/-/g, '')
  return cleaned.slice(0, 8).toLowerCase()
}

/**
 * Build a LinkedIn-style slug.
 * Fully null-safe — handles missing user, profile, or content.
 */
export function buildPostSlug(post: Post): string {
  // 🔥 Defensive access — post may be partially populated
  const postId = String(post?.id ?? '')

  // User name — try multiple sources, in priority order
  const userPart = slugify(
    post?.user?.profile?.userName?.trim() ||
      post?.user?.name?.trim() ||
      'user',
  )

  // Content — guard against missing/empty content
  const content = String(post?.content ?? '').trim()
  const firstWords = content ? content.split(/\s+/).slice(0, 6).join(' ') : ''
  const titlePart = slugify(firstWords)

  const sid = shortId(postId)

  // Fallbacks in case everything is empty
  if (!sid) return 'post'
  if (titlePart) return `${userPart}-${titlePart}-${sid}`
  return `${userPart}-${sid}`
}

/**
 * Canonical public URL for a post.
 *   https://chronify.com/feed/post/arbaazkhan23-my-post-edfc3500
 */
export function getPostPublicUrl(post: Post): string {
  const slug = buildPostSlug(post)
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'https://chronify.com'
  return `${base}/feed/post/${slug}`
}

/**
 * Given a URL slug or raw UUID, extract the short id used by the backend.
 *   "arbaazkhan23-my-post-edfc3500"       →  "edfc3500"
 *   "edfc3500-7a9c-42ce-8459-2ff11179df8f" →  full UUID (returned as-is)
 */
export function extractShortId(slugOrId: string): string {
  const trimmed = String(slugOrId || '').trim()
  if (!trimmed) return ''

  // Full UUID → return as-is
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (uuidRegex.test(trimmed)) return trimmed

  // Slug form → last segment
  const parts = trimmed.split('-')
  return parts[parts.length - 1] ?? trimmed
}