// app/dashboard/progress/page.tsx (Server Component)
import ProgressClient from '@/components/features/progress/progressClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Progress Reports - Chronify AI | Track Your Activity & Goal Progress',
  description: 'Comprehensive progress tracking dashboard with activity heatmaps, GitHub integration, goal progress tracking, and productivity analytics. Monitor your streaks, tasks, and performance trends.',
  keywords: 'progress tracking, activity heatmap, goal progress, GitHub integration, productivity analytics, task tracking, streak monitoring, performance trends, study analytics, time tracking',
  openGraph: {
    title: 'Progress Reports - Chronify AI | Visual Activity & Goal Tracking',
    description: 'Track your daily activity with GitHub-style heatmaps, monitor goal progress, analyze productivity trends, and get AI-powered insights to improve your performance.',
    type: 'website',
    url: 'https://chronify.com/dashboard/progress',
    images: [
      {
        url: 'https://chronify.com/og-progress.jpg',
        width: 1200,
        height: 630,
        alt: 'Chronify AI Progress Reports Dashboard',
      },
    ],
    siteName: 'Chronify AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Progress Reports - Chronify AI',
    description: 'Track your activity, goals, and productivity with visual progress reports.',
    images: ['https://chronify.com/twitter-progress.jpg'],
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
    canonical: 'https://chronify.com/dashboard/progress',
  },
  authors: [{ name: 'Chronify Team', url: 'https://chronify.com/about' }],
  category: 'productivity',
  classification: 'Progress Tracking Software',
}

// Structured Data for Rich Snippets
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://chronify.com/dashboard/progress",
      "url": "https://chronify.com/dashboard/progress",
      "name": "Progress Reports Dashboard - Chronify AI",
      "description": "Advanced progress tracking with activity heatmaps, goal monitoring, and productivity analytics",
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
            "name": "Progress",
            "item": "https://chronify.com/dashboard/progress"
          }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Chronify AI Progress Tracker",
      "description": "Comprehensive progress tracking system with heatmaps and analytics",
      "applicationCategory": "AnalyticsApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "featureList": [
        "GitHub-style activity heatmaps",
        "Goal progress tracking",
        "Productivity analytics",
        "Streak monitoring",
        "GitHub integration",
        "Export capabilities",
        "Multiple view modes (heatmap/charts/list)",
        "Performance insights"
      ],
      "screenshot": "https://chronify.com/screenshots/progress-dashboard.jpg"
    },
    {
      "@type": "FAQPage",
      "@id": "https://chronify.com/dashboard/progress#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the activity heatmap work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The heatmap shows your daily activity levels with color intensity. Darker colors indicate higher activity, and you can hover over any day to see detailed metrics like tasks completed and hours logged."
          }
        },
        {
          "@type": "Question",
          "name": "Can I track my GitHub activity?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Connect your GitHub account to see your commit activity alongside your Chronify progress. Track coding streaks and contribution patterns."
          }
        },
        {
          "@type": "Question",
          "name": "How is the progress calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Progress is calculated based on completed hours vs total goal hours, task completion rates, and daily activity levels. The system provides both overall and goal-specific progress metrics."
          }
        },
        {
          "@type": "Question",
          "name": "What insights does the dashboard provide?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Get insights on your most productive days, consistency scores, pace analysis, and personalized recommendations to improve your performance based on your activity patterns."
          }
        },
        {
          "@type": "Question",
          "name": "Can I export my progress data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Export your data in JSON format or print reports for offline analysis. You can also share your progress via shareable links."
          }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to Track and Improve Your Progress",
      "description": "Step-by-step guide to using the progress tracking system",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Log Daily Activities",
          "text": "Record your tasks, study hours, and completed goals daily"
        },
        {
          "@type": "HowToStep",
          "name": "Review Heatmap",
          "text": "Use the GitHub-style heatmap to visualize your activity patterns"
        },
        {
          "@type": "HowToStep",
          "name": "Monitor Goal Progress",
          "text": "Track progress against each goal with detailed metrics"
        },
        {
          "@type": "HowToStep",
          "name": "Analyze Trends",
          "text": "Review charts and analytics to identify productive periods"
        },
        {
          "@type": "HowToStep",
          "name": "Apply Insights",
          "text": "Use recommendations to optimize your schedule and improve performance"
        }
      ],
      "totalTime": "P1M",
      "tool": "Chronify AI Progress Dashboard"
    },
    {
      "@type": "ItemList",
      "name": "Key Progress Metrics",
      "description": "Essential metrics tracked in the progress dashboard",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Active Days",
          "description": "Days with recorded activity"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Current Streak",
          "description": "Consecutive active days"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Total Hours",
          "description": "Total hours logged"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Tasks Completed",
          "description": "Total tasks finished"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Goals Progress",
          "description": "Overall goal completion percentage"
        }
      ]
    }
  ]
}

export default function ProgressPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProgressClient />
    </>
  )
}