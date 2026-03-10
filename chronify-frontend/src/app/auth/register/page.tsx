// import { LoginForm } from '@/components/features/auth/login'
// import { RegisterForm } from '@/components/features/auth/register'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Sign In - Chronify AI',
//   description: 'Sign in to your Chronify AI account',
// }

// export default function SignUpPage() {
//   return <RegisterForm />
// }



// 'use client';

// import { RegisterForm } from '@/components/features/auth/register';
// import { Toaster } from 'sonner';

// export default function RegisterPage() {
//   return (
//     <>
//       <Toaster position="top-center" richColors />
//       <RegisterForm />
//     </>
//   );
// }







// src/app/auth/register/page.tsx
import { RegisterForm } from '@/components/features/auth/register';
import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign Up - Chronify AI | Create Free Account & Start Your Consistency Journey',
  description: 'Create your free Chronify AI account today. Track daily goals, manage tasks, build lasting habits, and join thousands of productive users. Start your consistency journey now!',
  keywords: 'sign up, create account, register, free trial, productivity app, goal tracking, task manager, habit tracker, consistency app, daily planner, time management, get started',
  openGraph: {
    title: 'Join Chronify AI - Start Building Better Habits Today',
    description: 'Free account creation. Track goals, manage tasks, monitor progress, and build consistent habits with AI-powered insights.',
    type: 'website',
    url: 'https://chronify.com/auth/register',
    images: [
      {
        url: 'https://chronify.com/og-register.jpg',
        width: 1200,
        height: 630,
        alt: 'Chronify AI Registration - Start Your Journey',
      },
    ],
    siteName: 'Chronify AI',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join Chronify AI - Free Account',
    description: 'Start tracking your daily consistency and achieving your goals with Chronify AI. Sign up free today!',
    images: ['https://chronify.com/twitter-register.jpg'],
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
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://chronify.com/auth/register',
    languages: {
      'en-US': 'https://chronify.com/auth/register',
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
    bing: 'YOUR_BING_VERIFICATION_CODE',
  },
  authors: [{ name: 'Chronify Team', url: 'https://chronify.com/about' }],
  category: 'productivity',
  classification: 'Productivity Software',
  referrer: 'origin-when-cross-origin',
  creator: 'Chronify AI',
  publisher: 'Chronify AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://chronify.com'),
  other: {
    'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
};

// Structured Data for Rich Snippets
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://chronify.com/auth/register",
      "url": "https://chronify.com/auth/register",
      "name": "Sign Up for Chronify AI - Free Productivity Account",
      "description": "Create your free Chronify AI account to start tracking daily goals and building consistent habits.",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://chronify.com/#website",
        "name": "Chronify AI",
        "url": "https://chronify.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://chronify.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://chronify.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Sign Up",
            "item": "https://chronify.com/auth/register"
          }
        ]
      }
    },
    {
      "@type": "Product",
      "name": "Chronify AI - Free Plan",
      "description": "Free productivity tracking software with goal setting, task management, and consistency monitoring.",
      "brand": {
        "@type": "Brand",
        "name": "Chronify AI"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "url": "https://chronify.com/auth/register",
        "priceValidUntil": "2025-12-31",
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "US",
          "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Goal Tracking",
        "Task Management",
        "Consistency Monitoring",
        "Progress Insights",
        "Daily Schedule Planning",
        "Motivation Board",
        "AI-Powered Recommendations"
      ],
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web, iOS, Android",
      "screenshot": "https://chronify.com/screenshots/dashboard.jpg"
    },
    {
      "@type": "FAQPage",
      "@id": "https://chronify.com/auth/register#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Chronify AI really free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Chronify AI offers a robust free tier with essential features including goal tracking, task management, and basic insights. Premium plans are available for advanced features."
          }
        },
        {
          "@type": "Question",
          "name": "How do I create an account?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply fill out the registration form with your name, email, and password. You can also sign up using Google, GitHub, or Facebook for quicker access."
          }
        },
        {
          "@type": "Question",
          "name": "What features do I get with the free account?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Free accounts include goal tracking (up to 5 goals), daily task management, basic progress insights, weekly schedule planning, and motivation board access."
          }
        },
        {
          "@type": "Question",
          "name": "Can I upgrade later?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely! You can upgrade to Premium anytime to unlock unlimited goals, advanced analytics, AI recommendations, and priority support."
          }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to Sign Up for Chronify AI",
      "description": "Simple steps to create your Chronify AI account and start your consistency journey.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Fill Registration Form",
          "text": "Enter your name, email address, and create a secure password."
        },
        {
          "@type": "HowToStep",
          "name": "Choose Sign Up Method",
          "text": "Use email or social login with Google, GitHub, or Facebook."
        },
        {
          "@type": "HowToStep",
          "name": "Verify Email",
          "text": "Check your inbox and click the verification link to activate your account."
        },
        {
          "@type": "HowToStep",
          "name": "Complete Profile Setup",
          "text": "Tell us about your goals to get personalized recommendations."
        },
        {
          "@type": "HowToStep",
          "name": "Start Your Journey",
          "text": "Begin tracking tasks, setting goals, and building consistent habits."
        }
      ],
      "totalTime": "PT5M",
      "tool": "Computer or Mobile Device",
      "supply": "Email Address"
    }
  ]
};

export default function RegisterPage() {
  return (
    <>
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
      
      {/* Main Registration Section */}
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        {/* Hero Section for SEO */}
        <div className="container mx-auto px-4 pt-8 md:pt-12">
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Start Your Consistency Journey Today
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of productive users who are building better habits, 
              achieving goals, and transforming their lives with Chronify AI.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <RegisterForm />

        {/* Trust Indicators Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { icon: "🔒", text: "256-bit SSL Security" },
                { icon: "🛡️", text: "GDPR Compliant" },
                { icon: "⚡", text: "24/7 Support" },
                { icon: "🎯", text: "30-Day Money Back" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-sm font-medium">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="text-center mb-12">
              <p className="text-sm text-muted-foreground mb-4">Trusted by professionals at</p>
              <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
                <span className="text-xl font-bold">TechCorp</span>
                <span className="text-xl font-bold">StartupX</span>
                <span className="text-xl font-bold">GrowthHub</span>
                <span className="text-xl font-bold">InnovateLabs</span>
                <span className="text-xl font-bold">FutureWorks</span>
              </div>
            </div>

            {/* Benefits Grid for SEO */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 rounded-xl bg-card border">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-bold mb-2">Smart Goal Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Set and track unlimited goals with AI-powered insights and recommendations.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-bold mb-2">Progress Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize your consistency with detailed charts and performance metrics.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-lg font-bold mb-2">AI Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized suggestions to optimize your productivity routine.
                </p>
              </div>
            </div>

            {/* FAQ Section for Rich Snippets */}
            <div className="mt-16 border-t pt-12">
              <h2 className="text-2xl font-bold text-center mb-8">
                Frequently Asked Questions About Signing Up
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    q: "How long does sign up take?",
                    a: "Less than 2 minutes! Just fill in your details and you're ready to start."
                  },
                  {
                    q: "Can I change my plan later?",
                    a: "Yes, you can upgrade or downgrade your plan anytime from account settings."
                  },
                  {
                    q: "Is my data secure?",
                    a: "Absolutely! We use bank-level encryption and never share your data."
                  },
                  {
                    q: "Do I need a credit card?",
                    a: "No credit card required for the free plan. Start with full access today!"
                  }
                ].map((faq, index) => (
                  <div key={index} className="p-4 rounded-lg bg-card/50 border">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SEO Footer Links */}
        <div className="container mx-auto px-4 py-8 border-t">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
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
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors">
              Sitemap
            </Link>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Chronify AI. All rights reserved. 
            Made with ❤️ for consistent achievers worldwide.
          </p>
        </div>
      </div>
    </>
  );
}