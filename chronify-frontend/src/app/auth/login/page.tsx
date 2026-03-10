// import { LoginForm } from '@/components/features/auth/login'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Sign In - Chronify AI',
//   description: 'Sign in to your Chronify AI account',
// }

// export default function LoginPage() {
//   return <LoginForm />
// }






// src/app/auth/login/page.tsx
import { LoginForm } from '@/components/features/auth/login'
import type { Metadata } from 'next'
import Link from 'next/link'

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

// Add structured data for rich snippets
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Chronify AI Login",
  "description": "Secure login page for Chronify AI productivity platform",
  "url": "https://chronify.com/auth/login",
  "publisher": {
    "@type": "Organization",
    "name": "Chronify AI",
    "logo": {
      "@type": "ImageObject",
      "url": "https://chronify.com/logo.png"
    },
    "sameAs": [
      "https://twitter.com/chronify",
      "https://linkedin.com/company/chronify",
      "https://facebook.com/chronify"
    ]
  },
  "potentialAction": {
    "@type": "EntryPoint",
    "urlTemplate": "https://chronify.com/auth/login",
    "actionPlatform": [
      "http://schema.org/DesktopWebPlatform",
      "http://schema.org/MobileWebPlatform"
    ]
  },
  "mainEntity": {
    "@type": "SoftwareApplication",
    "name": "Chronify AI",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": "goal tracking, task management, consistency monitoring, progress insights, daily schedule planning"
  }
}

export default function LoginPage() {
  return (
    <>
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        {/* Hero Section for SEO */}
        <div className="container mx-auto px-4 pt-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome Back to Chronify AI
            </h1>
            <p className="text-lg text-muted-foreground">
              Your journey to better consistency continues here. Sign in to track your progress, 
              manage tasks, and achieve your daily goals.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer Links for SEO */}
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            © 2024 Chronify AI. All rights reserved. Made for consistent achievers.
          </p>
        </div>
      </div>
    </>
  )
}