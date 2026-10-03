// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import type { Post } from '@/types/feed'
import { buildPostSlug } from '@/lib/post-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://chronify.com'
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8181'

  try {
    const res = await fetch(`${API_BASE_URL}/posts/feed?limit=100`, {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error()
    const json = await res.json()
    const posts = (json.data ?? []) as Post[]

    return [
      {
        url: `${base}/feed`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      ...posts.map((p) => ({
        url: `${base}/posts/${buildPostSlug(p)}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
    ]
  } catch {
    return [
      {
        url: `${base}/feed`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ]
  }
}