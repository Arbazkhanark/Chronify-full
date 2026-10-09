// src/app/auth/register/page.tsx
import { RegisterForm } from '@/components/features/auth/register'
import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title:
    'Sign Up - Chronify | Create Free Account & Start Your Consistency Journey',
  description:
    'Create your free Chronify account today. Track daily goals, manage tasks, build lasting habits, and join thousands of productive users. Start your consistency journey now!',
  keywords:
    'sign up, create account, register, free trial, productivity app, goal tracking, task manager, habit tracker, consistency app, daily planner, time management, get started',
  openGraph: {
    title: 'Join Chronify - Start Building Better Habits Today',
    description:
      'Free account creation. Track goals, manage tasks, monitor progress, and build consistent habits.',
    type: 'website',
    url: 'https://chronify.com/auth/register',
    images: [
      {
        url: 'https://chronify.com/og-register.jpg',
        width: 1200,
        height: 630,
        alt: 'Chronify Registration - Start Your Journey',
      },
    ],
    siteName: 'Chronify',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join Chronify - Free Account',
    description:
      'Start tracking your daily consistency and achieving your goals with Chronify. Sign up free today!',
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
    // bing: 'YOUR_BING_VERIFICATION_CODE',
  },
  authors: [{ name: 'Chronify Team', url: 'https://chronify.com/about' }],
  category: 'productivity',
  classification: 'Productivity Software',
  referrer: 'origin-when-cross-origin',
  creator: 'Chronify',
  publisher: 'Chronify',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://chronify.com'),
  other: {
    'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
}

// Structured Data for Rich Snippets
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://chronify.com/auth/register',
      url: 'https://chronify.com/auth/register',
      name: 'Sign Up for Chronify - Free Productivity Account',
      description:
        'Create your free Chronify account to start tracking daily goals and building consistent habits.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://chronify.com/#website',
        name: 'Chronify',
        url: 'https://chronify.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://chronify.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://chronify.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Sign Up',
            item: 'https://chronify.com/auth/register',
          },
        ],
      },
    },
    {
      '@type': 'Product',
      name: 'Chronify - Free Plan',
      description:
        'Free productivity tracking software with goal setting, task management, and consistency monitoring.',
      brand: { '@type': 'Brand', name: 'Chronify' },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://chronify.com/auth/register',
        priceValidUntil: '2027-12-31',
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'US',
          returnPolicyCategory:
            'https://schema.org/MerchantReturnNotPermitted',
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '1250',
        bestRating: '5',
        worstRating: '1',
      },
      featureList: [
        'Goal Tracking',
        'Task Management',
        'Consistency Monitoring',
        'Progress Insights',
        'Daily Schedule Planning',
        'Motivation Board',
        'Personalized Recommendations',
      ],
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web, iOS, Android',
      screenshot: 'https://chronify.com/screenshots/dashboard.jpg',
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://chronify.com/auth/register#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Chronify really free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Chronify offers a robust free tier with essential features including goal tracking, task management, and basic insights. Premium plans are available for advanced features.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I create an account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Simply fill out the registration form with your name, email, and password. You can also sign up using Google, GitHub, or Facebook for quicker access.',
          },
        },
        {
          '@type': 'Question',
          name: 'What features do I get with the free account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Free accounts include goal tracking (up to 5 goals), daily task management, basic progress insights, weekly schedule planning, and motivation board access.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I upgrade later?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolutely! You can upgrade to Premium anytime to unlock unlimited goals, advanced analytics, personalized recommendations, and priority support.',
          },
        },
      ],
    },
    {
      '@type': 'HowTo',
      name: 'How to Sign Up for Chronify',
      description:
        'Simple steps to create your Chronify account and start your consistency journey.',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Fill Registration Form',
          text: 'Enter your name, email address, and create a secure password.',
        },
        {
          '@type': 'HowToStep',
          name: 'Choose Sign Up Method',
          text: 'Use email or social login with Google, GitHub, or Facebook.',
        },
        {
          '@type': 'HowToStep',
          name: 'Verify Email',
          text: 'Check your inbox and click the verification link to activate your account.',
        },
        {
          '@type': 'HowToStep',
          name: 'Complete Profile Setup',
          text: 'Tell us about your goals to get personalized recommendations.',
        },
        {
          '@type': 'HowToStep',
          name: 'Start Your Journey',
          text: 'Begin tracking tasks, setting goals, and building consistent habits.',
        },
      ],
      totalTime: 'PT5M',
      tool: 'Computer or Mobile Device',
      supply: 'Email Address',
    },
  ],
}

const faqs = [
  {
    q: 'How long does sign up take?',
    a: "Less than 2 minutes! Just fill in your details and you're ready to start.",
  },
  {
    q: 'Can I change my plan later?',
    a: 'Yes, you can upgrade or downgrade your plan anytime from account settings.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely! We use bank-level encryption and never share your data.',
  },
  {
    q: 'Do I need a credit card?',
    a: 'No credit card required for the free plan. Start with full access today!',
  },
]

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/sitemap', label: 'Sitemap' },
]

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

      {/* Split-screen registration */}
      <RegisterForm />

      {/* SEO content below the fold */}
      <section className="bg-muted/30 border-t border-border/60">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">

            {/* FAQ */}
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently Asked Questions About Signing Up
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="p-5 rounded-xl bg-card border border-border/60"
                >
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="container mx-auto px-4 py-8 border-t border-border/60">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {footerLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Chronify. All rights reserved. Made for
            consistent achievers worldwide.
          </p>
        </div>
      </section>
    </>
  )
}