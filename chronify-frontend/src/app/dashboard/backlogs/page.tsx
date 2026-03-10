// src/app/dashboard/backlogs/page.tsx (Server Component)
import BacklogsClient from '@/components/features/backlogs/backlogs'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Backlogs - Chronify AI | Track Future Tasks & Manage Workload',
  description: 'Manage your task backlogs efficiently with Chronify AI. Track pending tasks, prioritize work, and convert backlogs to active tasks when ready. Stay organized and never miss important tasks.',
  keywords: 'task backlog, backlog management, pending tasks, task priority, workload management, task tracking, productivity tool, task organization, future tasks, task planning',
  openGraph: {
    title: 'Backlog Management - Chronify AI | Stay Organized & Productive',
    description: 'Efficiently manage your task backlogs with Chronify AI. Track, prioritize, and convert tasks seamlessly.',
    type: 'website',
    url: 'https://chronify.com/dashboard/backlogs',
    images: [
      {
        url: 'https://chronify.com/og-backlogs.jpg',
        width: 1200,
        height: 630,
        alt: 'Chronify AI Backlog Management',
      },
    ],
    siteName: 'Chronify AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Backlog Management - Chronify AI',
    description: 'Track and manage your task backlogs efficiently with Chronify AI.',
    images: ['https://chronify.com/twitter-backlogs.jpg'],
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
    canonical: 'https://chronify.com/dashboard/backlogs',
  },
  authors: [{ name: 'Chronify Team', url: 'https://chronify.com/about' }],
  category: 'productivity',
  classification: 'Task Management Software',
}

// Structured Data for Rich Snippets
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://chronify.com/dashboard/backlogs",
      "url": "https://chronify.com/dashboard/backlogs",
      "name": "Backlog Management Dashboard - Chronify AI",
      "description": "Efficiently manage your task backlogs with Chronify AI's comprehensive backlog tracking system.",
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
            "name": "Backlogs",
            "item": "https://chronify.com/dashboard/backlogs"
          }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Chronify AI Backlog Manager",
      "description": "Professional backlog management tool for tracking and organizing future tasks",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "featureList": [
        "Task backlog tracking",
        "Priority management",
        "Status tracking (Pending/In Progress/Completed)",
        "Search and filter functionality",
        "Dark mode support",
        "Task conversion to active tasks"
      ],
      "screenshot": "https://chronify.com/screenshots/backlogs-dashboard.jpg"
    },
    {
      "@type": "FAQPage",
      "@id": "https://chronify.com/dashboard/backlogs#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a task backlog?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A task backlog is a collection of tasks you plan to work on in the future. It helps you organize and prioritize work without cluttering your active task list."
          }
        },
        {
          "@type": "Question",
          "name": "How do I prioritize backlogs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use our priority system (High, Medium, Low) to mark task importance. You can also set target dates and sort by priority to focus on what matters most."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert backlogs to tasks?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! When you're ready to work on a backlog item, simply click 'Convert' to move it to your active tasks list."
          }
        },
        {
          "@type": "Question",
          "name": "How often should I review my backlog?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We recommend reviewing your backlog weekly to keep it organized, remove outdated items, and identify tasks ready for conversion."
          }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to Manage Your Task Backlogs Effectively",
      "description": "Step-by-step guide to effective backlog management",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Add Tasks to Backlog",
          "text": "Add tasks you want to do later with title, description, priority, and estimated duration"
        },
        {
          "@type": "HowToStep",
          "name": "Set Priorities",
          "text": "Assign priority levels (High, Medium, Low) to organize your backlog"
        },
        {
          "@type": "HowToStep",
          "name": "Track Progress",
          "text": "Update status as tasks move from Pending to In Progress to Completed"
        },
        {
          "@type": "HowToStep",
          "name": "Review Regularly",
          "text": "Review your backlog weekly to keep it current and relevant"
        },
        {
          "@type": "HowToStep",
          "name": "Convert When Ready",
          "text": "Move tasks to active list when you're ready to work on them"
        }
      ],
      "totalTime": "P1W",
      "tool": "Chronify AI Backlog Manager"
    }
  ]
}

export default function BacklogsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BacklogsClient />
    </>
  )
}