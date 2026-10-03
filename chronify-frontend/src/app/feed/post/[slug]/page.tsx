// src/app/feed/post/[slug]/page.tsx
import type { Metadata } from 'next'
import type { Post } from '@/types/feed'
import SinglePostClient from './SinglePostClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8181/v0/api'

/* ------------------------------------------------------------------
   SERVER-SIDE FETCH (for OG meta tags)
   ------------------------------------------------------------------ */
async function fetchPostForMeta(slugOrId: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/posts/${encodeURIComponent(slugOrId)}`,
      { cache: 'no-store' },
    )
    if (!res.ok) return null
    const json = await res.json()
    return (json?.data as Post) ?? null
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------
   OG / TWITTER META
   ------------------------------------------------------------------ */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPostForMeta(slug)

  if (!post) {
    return {
      title: 'Post not found · Chronify',
      description: 'This post may have been deleted or is no longer available.',
    }
  }

  const firstLine = post.content.split('\n')[0].trim()
  const shortText =
    firstLine.length > 70 ? `${firstLine.slice(0, 70)}…` : firstLine

  const authorName = post.user.name || 'Someone'
  const handle = post.user.profile?.userName
    ? `@${post.user.profile.userName}`
    : ''
  const title = `${authorName}${handle ? ` (${handle})` : ''} on Chronify`
  const description = shortText || `View ${authorName}'s post on Chronify`

  const ogImage =
    post.image && post.image.length > 0
      ? post.image[0]
      : `${process.env.NEXT_PUBLIC_APP_URL || ''}/og-default.jpg`

  const canonicalUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/posts/${slug}`

  return {
    title,
    description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL || 'https://chronify.com',
    ),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonicalUrl,
      siteName: 'Chronify',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: shortText || authorName,
        },
      ],
      authors: [authorName],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  }
}

/* ------------------------------------------------------------------
   PAGE
   ------------------------------------------------------------------ */
export default async function ProfessionalPostPage({
  params,
}: PageProps) {
  const { slug } = await params
  return <SinglePostClient postId={decodeURIComponent(slug)} />
}