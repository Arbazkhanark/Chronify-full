// app/dashboard/timetable/page.tsx (Server Component)
import TimetableClient from '@/components/features/timetable/TimetableClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Smart Timetable - Chronify AI | Intelligent Task Scheduling & Time Management',
  description: 'AI-powered smart timetable with intelligent task scheduling, 1-hour grace period, bedtime protection, and smart delay options. Organize your fixed activities, free periods, and tasks efficiently.',
  keywords: 'smart timetable, intelligent scheduling, task management, time management, bedtime protection, task delay, free periods, fixed schedule, academic planner, productivity scheduler, daily planner, study schedule',
  openGraph: {
    title: 'Smart Timetable - Chronify AI | AI-Powered Schedule Management',
    description: 'Intelligent timetable with smart delay options, bedtime protection, and 1-hour grace period for task completion. Perfect for students and professionals.',
    type: 'website',
    url: 'https://chronify.com/dashboard/timetable',
    images: [
      {
        url: 'https://chronify.com/og-timetable.jpg',
        width: 1200,
        height: 630,
        alt: 'Chronify AI Smart Timetable Dashboard',
      },
    ],
    siteName: 'Chronify AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Timetable - Chronify AI',
    description: 'AI-powered schedule management with intelligent task scheduling and delay options.',
    images: ['https://chronify.com/twitter-timetable.jpg'],
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
    canonical: 'https://chronify.com/dashboard/timetable',
  },
  authors: [{ name: 'Chronify Team', url: 'https://chronify.com/about' }],
  category: 'productivity',
  classification: 'Schedule Management Software',
}

// Structured Data for Rich Snippets
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://chronify.com/dashboard/timetable",
      "url": "https://chronify.com/dashboard/timetable",
      "name": "Smart Timetable Dashboard - Chronify AI",
      "description": "AI-powered schedule management with intelligent task scheduling and smart delay options",
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
            "name": "Timetable",
            "item": "https://chronify.com/dashboard/timetable"
          }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Chronify AI Smart Timetable",
      "description": "Intelligent scheduling system with smart delay options and bedtime protection",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "featureList": [
        "Smart delay with free period detection",
        "1-hour grace period for task completion",
        "Bedtime protection (no tasks after bedtime)",
        "Multiple view modes (Grid/List/Calendar)",
        "GitHub-style calendar view",
        "Drag & drop task rescheduling",
        "Focus score tracking",
        "Missed task recovery options",
        "Auto-refresh with status updates"
      ],
      "screenshot": "https://chronify.com/screenshots/timetable-dashboard.jpg"
    },
    {
      "@type": "FAQPage",
      "@id": "https://chronify.com/dashboard/timetable#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the 1-hour grace period work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When a task ends, you have 1 hour to update its status (complete, delay, etc.). If no update is made within 1 hour, it's automatically marked as missed."
          }
        },
        {
          "@type": "Question",
          "name": "What is smart delay?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Smart delay intelligently reschedules tasks to available free periods, checks bedtime constraints, and suggests optimal time slots without conflicting with fixed activities."
          }
        },
        {
          "@type": "Question",
          "name": "How does bedtime protection work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can set your bedtime, and the system will prevent tasks from being scheduled past this time. Tasks in progress can be extended but will warn if exceeding bedtime."
          }
        },
        {
          "@type": "Question",
          "name": "Can I track task focus?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! When completing tasks, rate your focus on a scale of 1-10. This helps track productivity patterns and get insights about your most productive times."
          }
        },
        {
          "@type": "Question",
          "name": "How are missed tasks handled?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Missed tasks appear in a special section with options to complete immediately, reschedule to free periods, or smart delay. Urgency is shown based on time until bedtime."
          }
        },
        {
          "@type": "Question",
          "name": "What happens to tasks after bedtime?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tasks cannot be delayed past bedtime. Any pending tasks at bedtime are marked as missed, and you'll get motivational messages to help stay on track."
          }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to Use Smart Timetable Effectively",
      "description": "Step-by-step guide to maximizing productivity with smart scheduling",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Set Your Bedtime",
          "text": "Configure your bedtime to ensure tasks are scheduled within your active hours"
        },
        {
          "@type": "HowToStep",
          "name": "Update Task Status",
          "text": "Mark tasks as in-progress or completed, use the 1-hour grace period to update status"
        },
        {
          "@type": "HowToStep",
          "name": "Use Smart Delay",
          "text": "When tasks need rescheduling, use smart delay to find optimal free periods"
        },
        {
          "@type": "HowToStep",
          "name": "Rate Your Focus",
          "text": "After completing tasks, rate your focus to track productivity patterns"
        },
        {
          "@type": "HowToStep",
          "name": "Review Missed Tasks",
          "text": "Check the missed tasks section and use recovery options before bedtime"
        },
        {
          "@type": "HowToStep",
          "name": "Analyze Calendar",
          "text": "Use calendar view to visualize tasks and drag & drop to reschedule"
        }
      ],
      "totalTime": "P1D",
      "tool": "Chronify AI Smart Timetable"
    },
    {
      "@type": "ItemList",
      "name": "Task Status Categories",
      "description": "Different task statuses tracked in the system",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Pending",
          "description": "Task not started, waiting to begin"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "In Progress",
          "description": "Task currently being worked on"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Completed",
          "description": "Task finished with focus score"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Missed",
          "description": "Task not completed within timeframe"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Delayed",
          "description": "Task rescheduled to later time"
        },
        {
          "@type": "ListItem",
          "position": 6,
          "name": "Skipped",
          "description": "Task intentionally skipped"
        }
      ]
    }
  ]
}

export default function TimetablePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TimetableClient />
    </>
  )
}











