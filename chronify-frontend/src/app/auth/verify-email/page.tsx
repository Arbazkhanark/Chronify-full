// import { VerifyEmail } from '@/components/features/auth/verify.email'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Verify Email - Chronify AI',
//   description: 'Verify your email address to complete your Chronify AI account setup',
// }

// export default function VerifyEmailPage() {
//   return <VerifyEmail />
// }











// src/app/auth/verify-email/page.tsx
import { VerifyEmail } from '@/components/features/auth/verify.email'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Verify Email - Chronify AI | Confirm Your Account',
  description: 'Verify your email address to complete Chronify AI account setup. Activate your account and start tracking your consistency journey.',
  keywords: 'verify email, email verification, confirm account, activate account, email confirmation, get started',
  openGraph: {
    title: 'Verify Email - Chronify AI | Activate Your Account',
    description: 'Complete your registration by verifying your email address. Start your productivity journey today.',
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
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://chronify.com/auth/verify-email",
      "url": "https://chronify.com/auth/verify-email",
      "name": "Email Verification - Chronify AI",
      "description": "Verify your email address to activate your Chronify AI account",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Chronify AI",
        "url": "https://chronify.com"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://chronify.com/auth/verify-email#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Why do I need to verify my email?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Email verification ensures account security, prevents spam, and allows us to send important updates about your account."
          }
        },
        {
          "@type": "Question",
          "name": "How long does verification take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Instant! Click the link in your email and your account will be verified immediately."
          }
        },
        {
          "@type": "Question",
          "name": "Didn't receive verification email?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Check spam folder, wait 5 minutes, or request a new verification email from your dashboard."
          }
        }
      ]
    }
  ]
}

export default function VerifyEmailPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-3 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <span className="text-3xl">📧</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Verify Your Email
              </h1>
              <p className="text-muted-foreground">
                Almost there! We need to confirm your email address
              </p>
            </div>

            {/* Benefits Card */}
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <h2 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                <span className="text-lg">✨</span> Why Verify Your Email?
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <span>✓</span> Secure your account
                </div>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <span>✓</span> Receive important updates
                </div>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <span>✓</span> Access all features
                </div>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <span>✓</span> Password recovery option
                </div>
              </div>
            </div>

            {/* Verification Component */}
            <VerifyEmail />

            {/* What Happens Next */}
            <div className="mt-8">
              <h2 className="font-semibold text-center mb-4">After Verification ✓</h2>
              <div className="grid gap-3">
                <div className="p-3 rounded-lg bg-card border flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="font-medium">Start Setting Goals</h3>
                    <p className="text-xs text-muted-foreground">Create your first goal and define what you want to achieve</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-card border flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h3 className="font-medium">Track Your Progress</h3>
                    <p className="text-xs text-muted-foreground">Monitor your consistency with detailed analytics</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-card border flex items-start gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h3 className="font-medium">Join the Community</h3>
                    <p className="text-xs text-muted-foreground">Connect with other consistent achievers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Links */}
            <div className="mt-8 text-center border-t pt-6">
              <p className="text-sm text-muted-foreground mb-3">
                Having trouble with verification?
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <Link href="/contact" className="text-primary hover:underline">
                  Contact Support
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/auth/resend-verification" className="text-primary hover:underline">
                  Resend Email
                </Link>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <span className="text-green-500">🔒</span>
                Verified by Chronify AI Security
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

