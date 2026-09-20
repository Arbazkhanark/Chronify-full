// app/profile/page.tsx (Server Component)
import ProfileClient from '@/components/features/users/ProfileClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile - Chronify AI | Track Your Academic Journey & Achievements',
  description: 'View and manage your Chronify AI profile. Track your academic progress, study streaks, achievements, and performance analytics. Monitor DSA progress, college GPA, and project milestones.',
  keywords: 'user profile, academic progress, study streak, achievements, performance tracking, DSA progress, college GPA, project tracking, study patterns, learning analytics',
  openGraph: {
    title: 'Profile - Chronify AI | Your Academic Journey Dashboard',
    description: 'Track your academic progress, study streaks, and achievements all in one place. Monitor DSA problems solved, college performance, and project milestones.',
    type: 'website',
    url: 'https://chronify.com/profile',
    images: [
      {
        url: 'https://chronify.com/og-profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Chronify AI Profile Dashboard',
      },
    ],
    siteName: 'Chronify AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Profile - Chronify AI',
    description: 'Track your academic progress, achievements, and study patterns.',
    images: ['https://chronify.com/twitter-profile.jpg'],
    creator: '@chronify',
    site: '@chronify',
  },
  robots: {
    index: false, // Profile pages shouldn't be indexed
    follow: true,
    noarchive: true,
  },
  alternates: {
    canonical: 'https://chronify.com/profile',
  },
  authors: [{ name: 'Chronify Team', url: 'https://chronify.com/about' }],
}

// Structured Data for Rich Snippets (only for public profile information)
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": "https://chronify.com/profile",
      "url": "https://chronify.com/profile",
      "name": "User Profile - Chronify AI",
      "description": "Personal profile page showing academic progress and achievements",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://chronify.com/#website",
        "name": "Chronify AI",
        "url": "https://chronify.com"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Dashboard",
            "item": "https://chronify.com/dashboard"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Profile",
            "item": "https://chronify.com/profile"
          }
        ]
      }
    },
    {
      "@type": "ItemList",
      "name": "Academic Achievements",
      "description": "Types of achievements tracked in Chronify AI",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "DSA Master",
          "description": "Complete 100+ DSA problems"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Consistency King",
          "description": "Maintain 30-day study streak"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Early Bird",
          "description": "Start study sessions before 7 AM"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Productivity Pro",
          "description": "Maintain 90%+ productivity for 2 weeks"
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to Build a Consistent Study Streak",
      "description": "Tips for maintaining daily study consistency",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Set Daily Goals",
          "text": "Define achievable daily study targets"
        },
        {
          "@type": "HowToStep",
          "name": "Track Progress",
          "text": "Log your study hours and completed tasks"
        },
        {
          "@type": "HowToStep",
          "name": "Review Patterns",
          "text": "Analyze your study patterns and optimize"
        },
        {
          "@type": "HowToStep",
          "name": "Celebrate Milestones",
          "text": "Earn achievements and stay motivated"
        }
      ]
    }
  ]
}

export default function ProfilePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProfileClient />
    </>
  )
}