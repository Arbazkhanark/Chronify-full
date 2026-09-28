// src/app/auth/verify-email/page.tsx
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { VerifyEmailClient } from '@/components/features/auth/verify.email'

export const metadata: Metadata = {
  title: 'Verify Email - Chronify AI | Confirm Your Account',
  description:
    'Verify your email address to complete Chronify AI account setup. Activate your account and start tracking your consistency journey.',
  keywords:
    'verify email, email verification, confirm account, activate account, email confirmation, get started',
  openGraph: {
    title: 'Verify Email - Chronify AI | Activate Your Account',
    description:
      'Complete your registration by verifying your email address. Start your productivity journey today.',
    type: 'website',
    url: 'https://chronify.com/auth/verify-email',
    images: [
      {
        url: 'https://chronify.com/og-verify-email.jpg',
        width: 1200,
        height: 630,
        alt: 'Verify Email - Chronify AI',
      },
    ],
    siteName: 'Chronify AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verify Email - Chronify AI',
    description: 'Verify your email to activate your Chronify AI account.',
    images: ['https://chronify.com/twitter-verify-email.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://chronify.com/auth/verify-email',
  },
}

// Structured data for email verification process
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://chronify.com/auth/verify-email',
      url: 'https://chronify.com/auth/verify-email',
      name: 'Email Verification - Chronify AI',
      description: 'Verify your email address to activate your Chronify AI account',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Chronify AI',
        url: 'https://chronify.com',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://chronify.com/auth/verify-email#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Why do I need to verify my email?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Email verification ensures account security, prevents spam, and allows us to send important updates about your account.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does verification take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Instant! Click the link in your email and your account will be verified immediately.',
          },
        },
        {
          '@type': 'Question',
          name: "Didn't receive verification email?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Check spam folder, wait 5 minutes, or request a new verification email from your dashboard.',
          },
        },
      ],
    },
  ],
}

export default function VerifyEmailPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Suspense fallback={<VerifyEmailSkeleton />}>
        <VerifyEmailClient />
      </Suspense>
    </>
  )
}

/* Fallback while the client component loads (very brief) */
function VerifyEmailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 animate-pulse">
            <div className="inline-block w-16 h-16 rounded-full bg-muted mb-4" />
            <div className="h-8 w-64 bg-muted rounded mx-auto mb-3" />
            <div className="h-4 w-48 bg-muted rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}