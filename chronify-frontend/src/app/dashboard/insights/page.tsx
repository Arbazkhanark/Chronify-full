// app/dashboard/insights/page.tsx (Server Component)
import InsightsClient from '@/components/features/insight/InsightsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Progress Insights - Chronify AI | Track Your Study Analytics & Performance',
  description: 'Comprehensive progress tracking and analytics dashboard. Monitor your study streaks, consistency scores, productivity patterns, and goal achievements with detailed insights and AI recommendations.',
  keywords: 'progress tracking, study analytics, performance metrics, productivity insights, streak tracking, consistency score, time tracking, goal progress, learning analytics, study patterns, productivity optimization',
  openGraph: {
    title: 'Progress Insights - Chronify AI | Data-Driven Performance Analytics',
    description: 'Track your learning journey with detailed analytics. Monitor streaks, productivity scores, and get personalized AI recommendations to optimize your study routine.',
    type: 'website',
    url: 'https://chronify.com/dashboard/insights',
    images: [
      {
        url: 'https://chronify.com/og-insights.jpg',
        width: 1200,
        height: 630,
        alt: 'Chronify AI Progress Insights Dashboard',
      },
    ],
    siteName: 'Chronify AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Progress Insights - Chronify AI',
    description: 'Track your study analytics, monitor streaks, and optimize your learning with AI-powered insights.',
    images: ['https://chronify.com/twitter-insights.jpg'],
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
    canonical: 'https://chronify.com/dashboard/insights',
  },
  authors: [{ name: 'Chronify Team', url: 'https://chronify.com/about' }],
  category: 'productivity',
  classification: 'Learning Analytics Software',
}

// Structured Data for Rich Snippets
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://chronify.com/dashboard/insights",
      "url": "https://chronify.com/dashboard/insights",
      "name": "Progress Insights Dashboard - Chronify AI",
      "description": "Advanced analytics and insights dashboard for tracking study progress, productivity patterns, and goal achievements",
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
            "name": "Dashboard",
            "item": "https://chronify.com/dashboard"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Insights",
            "item": "https://chronify.com/dashboard/insights"
          }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Chronify AI Progress Insights",
      "description": "Advanced analytics platform for tracking learning progress and productivity patterns",
      "applicationCategory": "AnalyticsApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "featureList": [
        "Streak tracking",
        "Consistency scoring",
        "Productivity analysis",
        "Time distribution analytics",
        "Performance pattern detection",
        "Goal progress tracking",
        "Milestone achievements",
        "AI-powered recommendations"
      ],
      "screenshot": "https://chronify.com/screenshots/insights-dashboard.jpg"
    },
    {
      "@type": "FAQPage",
      "@id": "https://chronify.com/dashboard/insights#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is consistency score calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Consistency score is calculated based on your daily activity patterns, task completion rates, and adherence to planned schedules over time. Higher scores indicate more regular and predictable study habits."
          }
        },
        {
          "@type": "Question",
          "name": "What is productivity score?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Productivity score measures the efficiency of your study sessions based on tasks completed per hour, focus duration, and achievement of daily goals compared to planned targets."
          }
        },
        {
          "@type": "Question",
          "name": "How are streaks tracked?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Streaks track consecutive days where you've logged at least one productive activity. The system automatically maintains your longest streak and current streak."
          }
        },
        {
          "@type": "Question",
          "name": "What insights do AI recommendations provide?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AI recommendations analyze your performance patterns to suggest optimal study times, task prioritization, break schedules, and areas needing more focus."
          }
        },
        {
          "@type": "Question",
          "name": "Can I export my progress data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can export your progress data in multiple formats including PDF reports, CSV for analysis, JSON for developers, and shareable images."
          }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to Optimize Your Study Performance",
      "description": "Use Chronify AI insights to improve your learning efficiency",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Track Your Activities",
          "text": "Log your daily study sessions, tasks completed, and focus hours"
        },
        {
          "@type": "HowToStep",
          "name": "Analyze Patterns",
          "text": "Review your performance metrics to identify peak productivity times"
        },
        {
          "@type": "HowToStep",
          "name": "Follow AI Recommendations",
          "text": "Implement personalized suggestions to optimize your routine"
        },
        {
          "@type": "HowToStep",
          "name": "Monitor Progress",
          "text": "Track improvements in consistency and productivity scores"
        },
        {
          "@type": "HowToStep",
          "name": "Celebrate Milestones",
          "text": "Achieve and celebrate key milestones in your learning journey"
        }
      ],
      "totalTime": "P1M",
      "tool": "Chronify AI Insights Dashboard"
    },
    {
      "@type": "ItemList",
      "name": "Key Performance Indicators",
      "description": "Essential metrics tracked in the insights dashboard",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Study Streak",
          "description": "Consecutive days of productive activity"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Consistency Score",
          "description": "Regularity of study habits"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Productivity Score",
          "description": "Efficiency of study sessions"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Focus Hours",
          "description": "Total time spent on productive activities"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Task Completion",
          "description": "Number of completed tasks and goals"
        }
      ]
    }
  ]
}

export default function InsightsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <InsightsClient />
    </>
  )
}