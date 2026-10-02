// src/app/auth/login/page.tsx
import { LoginForm } from '@/components/features/auth/login'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Chronify AI | Track Your Daily Consistency',
  description: 'Sign in to Chronify AI to track your daily goals, manage tasks, and monitor your consistency journey. Join thousands of productive users today.',
  keywords: 'login, sign in, productivity app, task manager, goal tracking, consistency tracker, daily planner, time management',
  openGraph: {
    title: 'Sign In to Chronify AI - Start Your Consistency Journey',
    description: 'Access your personalized dashboard to track goals, manage tasks, and build lasting habits.',
    type: 'website',
    url: 'https://chronify.com/auth/login',
    images: [
      {
        url: 'https://chronify.com/og-login.jpg',
        width: 1200,
        height: 630,
        alt: 'Chronify AI Login',
      },
    ],
    siteName: 'Chronify AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In to Chronify AI',
    description: 'Access your productivity dashboard and track your consistency journey.',
    images: ['https://chronify.com/twitter-login.jpg'],
    creator: '@chronify',
    site: '@chronify',
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
    canonical: 'https://chronify.com/auth/login',
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
  authors: [{ name: 'Chronify Team', url: 'https://chronify.com/about' }],
  category: 'productivity',
}

// Structured data for rich snippets
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Chronify AI Login',
  description: 'Secure login page for Chronify AI productivity platform',
  url: 'https://chronify.com/auth/login',
  publisher: {
    '@type': 'Organization',
    name: 'Chronify AI',
    logo: {
      '@type': 'ImageObject',
      url: 'https://chronify.com/logo.png',
    },
    sameAs: [
      'https://twitter.com/chronify',
      'https://linkedin.com/company/chronify',
      'https://facebook.com/chronify',
    ],
  },
  potentialAction: {
    '@type': 'EntryPoint',
    urlTemplate: 'https://chronify.com/auth/login',
    actionPlatform: [
      'http://schema.org/DesktopWebPlatform',
      'http://schema.org/MobileWebPlatform',
    ],
  },
  mainEntity: {
    '@type': 'SoftwareApplication',
    name: 'Chronify AI',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList:
      'goal tracking, task management, consistency monitoring, progress insights, daily schedule planning',
  },
}

export default function LoginPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LoginForm />
    </>
  )
}