// src/app/u/[username]/page.tsx
import type { Metadata } from 'next'
import PublicProfileClient from './PublicProfileClient'

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params

  // Decode + prettify for the title. Real name is fetched client-side.
  const decoded = decodeURIComponent(username).replace(/[_-]+/g, ' ')
  const prettyName = decoded
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const title = `${prettyName} · Chronify`
  const description = `View ${prettyName}'s profile on Chronify — goals, streaks, and progress.`
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/u/${username}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'profile',
      siteName: 'Chronify',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params
  return <PublicProfileClient username={username} />
}