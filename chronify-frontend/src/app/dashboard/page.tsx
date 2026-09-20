// src/app/dashboard/page.tsx (Server Component)
import DashboardClient from '@/components/features/dashboard/dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Chronify | Track Your Daily Consistency & Progress',
  description: 'Personal dashboard to track your daily goals, tasks, and consistency metrics. Monitor progress, manage schedule, and stay motivated with Chronify.',
  keywords: 'productivity dashboard, task manager, goal tracking, consistency tracker, daily schedule planner, progress insights',
  openGraph: {
    title: 'Chronify Dashboard - Your Personal Consistency Tracker',
    description: 'Track your daily goals, manage tasks, and monitor your consistency journey all in one place.',
    type: 'website',
    url: 'https://chronify.com/dashboard',
    images: [
      {
        url: 'https://chronify.com/og-dashboard.jpg',
        width: 1200,
        height: 630,
        alt: 'Chronify Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chronify Dashboard - Your Personal Consistency Tracker',
    description: 'Track your daily goals, manage tasks, and monitor your consistency journey all in one place.',
    images: ['https://chronify.com/twitter-dashboard.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://chronify.com/dashboard',
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
}

export default function DashboardPage() {
  return <DashboardClient />
}