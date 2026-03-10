// import { ChangePasswordForm } from '@/components/features/auth/change-password'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Change Password - Chronify AI',
//   description: 'Change your Chronify AI account password',
// }

// export default function ChangePasswordPage() {
//   return <ChangePasswordForm />
// }













// src/app/auth/change-password/page.tsx
import { ChangePasswordForm } from '@/components/features/auth/change-password'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Change Password - Chronify AI | Secure Account Settings',
  description: 'Change your Chronify AI account password securely. Update your password to maintain account security and protect your productivity data.',
  keywords: 'change password, update password, account security, password reset, secure account, chronify settings',
  openGraph: {
    title: 'Change Password - Chronify AI | Secure Your Account',
    description: 'Keep your account secure by regularly updating your password. Simple and secure password change process.',
    type: 'website',
    url: 'https://chronify.com/auth/change-password',
    images: [
      {
        url: 'https://chronify.com/og-change-password.jpg',
        width: 1200,
        height: 630,
        alt: 'Change Password - Chronify AI',
      },
    ],
    siteName: 'Chronify AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Change Password - Chronify AI',
    description: 'Update your password securely to protect your Chronify AI account.',
    images: ['https://chronify.com/twitter-change-password.jpg'],
  },
  robots: {
    index: false, // Don't index this page as it's private
    follow: true,
    noarchive: true,
  },
  alternates: {
    canonical: 'https://chronify.com/auth/change-password',
  },
}

// Structured data for security best practices
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Change Password - Chronify AI",
  "description": "Secure password change page for Chronify AI users",
  "url": "https://chronify.com/auth/change-password",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Chronify AI",
    "url": "https://chronify.com"
  },
  "about": {
    "@type": "Thing",
    "name": "Account Security",
    "description": "Change your password to maintain account security"
  },
  "mainEntity": {
    "@type": "HowTo",
    "name": "How to Change Your Password",
    "description": "Steps to change your Chronify AI account password securely",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter Current Password",
        "text": "Verify your identity by entering your current password"
      },
      {
        "@type": "HowToStep",
        "name": "Set New Password",
        "text": "Create a strong, unique password for your account"
      },
      {
        "@type": "HowToStep",
        "name": "Confirm New Password",
        "text": "Re-enter your new password to confirm"
      },
      {
        "@type": "HowToStep",
        "name": "Update Password",
        "text": "Submit to save your new password"
      }
    ]
  }
}

export default function ChangePasswordPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-md mx-auto">
            {/* SEO Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Change Your Password
              </h1>
              <p className="text-muted-foreground">
                Keep your account secure by updating your password regularly
              </p>
            </div>

            {/* Security Tips Banner */}
            <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <h2 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                <span className="text-lg">🔒</span> Password Security Tips
              </h2>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                <li>• Use at least 8 characters with mix of letters, numbers & symbols</li>
                <li>• Avoid using common words or personal information</li>
                <li>• Don't reuse passwords from other websites</li>
                <li>• Change password every 3-6 months for best security</li>
              </ul>
            </div>

            {/* Change Password Form */}
            <ChangePasswordForm />

            {/* Help Section */}
            <div className="mt-8 text-center">
              <div className="p-4 rounded-lg bg-card border">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  If you're having trouble changing your password or suspect unauthorized access
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <Link href="/auth/forgot-password" className="text-primary hover:underline">
                    Forgot Password?
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/contact" className="text-primary hover:underline">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}