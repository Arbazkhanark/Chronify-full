// import { ForgotPasswordForm } from '@/components/features/auth/forgot-password'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Forgot Password - Chronify AI',
//   description: 'Reset your Chronify AI account password',
// }

// export default function ForgotPasswordPage() {
//   return <ForgotPasswordForm />
// }










// src/app/auth/forgot-password/page.tsx
import { ForgotPasswordForm } from '@/components/features/auth/forgot-password'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Forgot Password - Chronify AI | Reset Your Account Access',
  description: 'Forgot your Chronify AI password? No worries! Enter your email to receive password reset instructions and regain access to your account.',
  keywords: 'forgot password, reset password, recover account, password help, can\'t login, account access',
  openGraph: {
    title: 'Forgot Password - Chronify AI | Account Recovery',
    description: 'Quick and secure password reset process. Get back to tracking your consistency journey in minutes.',
    type: 'website',
    url: 'https://chronify.com/auth/forgot-password',
    images: [
      {
        url: 'https://chronify.com/og-forgot-password.jpg',
        width: 1200,
        height: 630,
        alt: 'Forgot Password - Chronify AI Password Reset',
      },
    ],
    siteName: 'Chronify AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forgot Password - Chronify AI',
    description: 'Reset your password and regain access to your Chronify AI account.',
    images: ['https://chronify.com/twitter-forgot-password.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://chronify.com/auth/forgot-password',
  },
}

// Structured data for password reset process
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://chronify.com/auth/forgot-password",
      "url": "https://chronify.com/auth/forgot-password",
      "name": "Forgot Password - Chronify AI Password Reset",
      "description": "Reset your Chronify AI account password easily and securely",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Chronify AI",
        "url": "https://chronify.com"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://chronify.com/auth/forgot-password#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long does password reset take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Password reset emails are sent instantly. Check your inbox within 2-3 minutes. Don't forget to check spam folder."
          }
        },
        {
          "@type": "Question",
          "name": "What if I don't receive the reset email?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wait 5 minutes, check spam folder, verify email address, or contact support for assistance."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data safe during password reset?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all password reset processes are encrypted and secure. We use industry-standard security protocols."
          }
        }
      ]
    }
  ]
}

export default function ForgotPasswordPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-md mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Forgot Your Password?
              </h1>
              <p className="text-muted-foreground">
                No worries! Enter your email and we'll send you reset instructions
              </p>
            </div>

            {/* Quick Tips */}
            <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <h2 className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
                <span className="text-lg">📧</span> Quick Tips
              </h2>
              <ul className="text-xs text-amber-600 dark:text-amber-400 space-y-1">
                <li>• Check your spam/junk folder if you don't see the email</li>
                <li>• Add support@chronify.com to your contacts</li>
                <li>• Reset link expires in 1 hour for security</li>
                <li>• Contact support if you need immediate help</li>
              </ul>
            </div>

            {/* Forgot Password Form */}
            <ForgotPasswordForm />

            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <Link 
                href="/auth/login" 
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                ← Back to Sign In
              </Link>
            </div>

            {/* Additional Help Section */}
            <div className="mt-8 p-6 rounded-xl bg-card border">
              <h2 className="font-semibold mb-4 text-center">Still Having Trouble?</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-primary">📋</span>
                  <div>
                    <h3 className="font-medium">Verify Your Email</h3>
                    <p className="text-muted-foreground">Make sure you're using the email associated with your Chronify account</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary">⏰</span>
                  <div>
                    <h3 className="font-medium">Wait a Few Minutes</h3>
                    <p className="text-muted-foreground">Email delivery might take 2-3 minutes. Don't request multiple times</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary">📞</span>
                  <div>
                    <h3 className="font-medium">Contact Support</h3>
                    <p className="text-muted-foreground">
                      <Link href="/contact" className="text-primary hover:underline">
                        Reach out to our support team
                      </Link> for personalized assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


