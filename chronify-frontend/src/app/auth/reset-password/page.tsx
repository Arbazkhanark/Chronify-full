// import { ResetPasswordForm } from '@/components/features/auth/reset-password'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Reset Password - Chronify AI',
//   description: 'Reset your Chronify AI account password',
// }

// export default function ResetPasswordPage() {
//   return <ResetPasswordForm />
// }







// src/app/auth/reset-password/page.tsx
import { ResetPasswordForm } from '@/components/features/auth/reset-password'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Reset Password - Chronify AI | Create New Password',
  description: 'Create a new strong password for your Chronify AI account. Secure password reset process to regain access to your productivity dashboard.',
  keywords: 'reset password, new password, create password, secure account, password recovery',
  openGraph: {
    title: 'Reset Password - Chronify AI | Create New Secure Password',
    description: 'Set a new password for your Chronify AI account. Ensure your account stays secure with a strong password.',
    type: 'website',
    url: 'https://chronify.com/auth/reset-password',
    images: [
      {
        url: 'https://chronify.com/og-reset-password.jpg',
        width: 1200,
        height: 630,
        alt: 'Reset Password - Chronify AI',
      },
    ],
    siteName: 'Chronify AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reset Password - Chronify AI',
    description: 'Create a new secure password for your Chronify AI account.',
    images: ['https://chronify.com/twitter-reset-password.jpg'],
  },
  robots: {
    index: false, // Don't index pages with tokens
    follow: true,
    noarchive: true,
  },
}

// Password strength guidelines structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Reset Password - Chronify AI",
  "description": "Secure password reset page",
  "url": "https://chronify.com/auth/reset-password",
  "mainEntity": {
    "@type": "HowTo",
    "name": "How to Create a Strong Password",
    "description": "Guidelines for creating a secure password",
    "step": [
      {
        "@type": "HowToStep",
        "text": "Use at least 8 characters"
      },
      {
        "@type": "HowToStep",
        "text": "Include uppercase and lowercase letters"
      },
      {
        "@type": "HowToStep",
        "text": "Add numbers and special characters"
      },
      {
        "@type": "HowToStep",
        "text": "Avoid personal information"
      },
      {
        "@type": "HowToStep",
        "text": "Don't use common words or patterns"
      }
    ]
  }
}

export default function ResetPasswordPage() {
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
                <span className="text-3xl">🔑</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Create New Password
              </h1>
              <p className="text-muted-foreground">
                Enter a strong, unique password for your account
              </p>
            </div>

            {/* Password Requirements Card */}
            <div className="mb-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
              <h2 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
                <span className="text-lg">⚡</span> Password Requirements
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <span>✓</span> Min. 8 characters
                </div>
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <span>✓</span> Uppercase letter
                </div>
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <span>✓</span> Lowercase letter
                </div>
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <span>✓</span> At least 1 number
                </div>
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <span>✓</span> Special character
                </div>
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <span>✓</span> No common words
                </div>
              </div>
            </div>

            {/* Reset Password Form */}
            <ResetPasswordForm />

            {/* Security Notice */}
            <div className="mt-6 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400 flex items-start gap-2">
                <span className="text-lg">🛡️</span>
                <span>
                  <strong>Security Notice:</strong> Never share your password with anyone. 
                  Chronify AI will never ask for your password via email or phone.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}