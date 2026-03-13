









// app/dashboard/timetable/builder/page.tsx (Server Component)
import TimetableBuilderClient from '@/components/features/timetable/builder/TimeTableBuilder'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Timetable Builder - Chronify AI | Create & Customize Your Weekly Schedule',
  description: 'Build and customize your weekly timetable with Chronify AI. Add fixed commitments, free periods, tasks, goals, and sleep schedules. Drag-and-drop interface with smart scheduling features.',
  keywords: 'timetable builder, schedule creator, weekly planner, task scheduler, goal tracking, sleep schedule, fixed commitments, free periods, academic planner, productivity tool',
  openGraph: {
    title: 'Timetable Builder - Chronify AI | Create Your Perfect Schedule',
    description: 'Design your weekly schedule with our intuitive timetable builder. Add fixed commitments, tasks from goals, free periods, and sleep schedules with drag-and-drop ease.',
    type: 'website',
    url: 'https://chronify.com/dashboard/timetable/builder',
    images: [
      {
        url: 'https://chronify.com/og-timetable-builder.jpg',
        width: 1200,
        height: 630,
        alt: 'Chronify AI Timetable Builder',
      },
    ],
    siteName: 'Chronify AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timetable Builder - Chronify AI',
    description: 'Create and customize your weekly schedule with our intuitive timetable builder.',
    images: ['https://chronify.com/twitter-timetable-builder.jpg'],
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
    canonical: 'https://chronify.com/dashboard/timetable/builder',
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
      "@id": "https://chronify.com/dashboard/timetable/builder",
      "url": "https://chronify.com/dashboard/timetable/builder",
      "name": "Timetable Builder Dashboard - Chronify AI",
      "description": "Advanced timetable builder with drag-and-drop interface for creating personalized weekly schedules",
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
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Builder",
            "item": "https://chronify.com/dashboard/timetable/builder"
          }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Chronify AI Timetable Builder",
      "description": "Interactive weekly schedule builder with drag-and-drop functionality",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "featureList": [
        "Drag-and-drop interface",
        "Fixed commitments management",
        "Free periods scheduling",
        "Task creation from goals",
        "Sleep schedule integration",
        "Multiple view modes",
        "Display customization",
        "Lock/unlock timetable",
        "PDF export"
      ],
      "screenshot": "https://chronify.com/screenshots/timetable-builder.jpg"
    },
    {
      "@type": "FAQPage",
      "@id": "https://chronify.com/dashboard/timetable/builder#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are fixed commitments?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fixed commitments are recurring time blocks like college hours, office time, or gym sessions that cannot be changed. You can add free periods within these commitments to schedule tasks."
          }
        },
        {
          "@type": "Question",
          "name": "How do free periods work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Free periods are day-specific time slots within fixed commitments where you can schedule tasks. They're shown in green and can be different for each day of the week."
          }
        },
        {
          "@type": "Question",
          "name": "Can I schedule tasks from my goals?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can drag goals and milestones directly into your timetable. Tasks created this way automatically track progress towards your goals."
          }
        },
        {
          "@type": "Question",
          "name": "What is the sleep schedule feature?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Set your bedtime and wake time for each day. Sleep blocks will be automatically generated and can be locked to prevent task scheduling during sleep hours."
          }
        },
        {
          "@type": "Question",
          "name": "How do I save my timetable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use the 'Lock Timetable' button to save all your changes to the server. The lock progress dialog will show you the status of each item being saved."
          }
        },
        {
          "@type": "Question",
          "name": "Can I customize the display?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! You can adjust start/end hours, time intervals, cell height, and switch between vertical and horizontal display modes. You can also add extended hours for morning, evening, or night."
          }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to Build Your Perfect Weekly Schedule",
      "description": "Step-by-step guide to creating a personalized timetable",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Set Your Sleep Schedule",
          "text": "Configure bedtime and wake time for each day to ensure proper rest"
        },
        {
          "@type": "HowToStep",
          "name": "Add Fixed Commitments",
          "text": "Add your regular commitments like college, work, or gym sessions"
        },
        {
          "@type": "HowToStep",
          "name": "Create Free Periods",
          "text": "Add day-specific free periods within fixed commitments for task scheduling"
        },
        {
          "@type": "HowToStep",
          "name": "Schedule Tasks",
          "text": "Drag goals, milestones, or quick tasks into your timetable"
        },
        {
          "@type": "HowToStep",
          "name": "Adjust Display",
          "text": "Customize time range, interval, and view mode for optimal visibility"
        },
        {
          "@type": "HowToStep",
          "name": "Lock Your Timetable",
          "text": "Save all changes to the server with the lock button"
        }
      ],
      "totalTime": "P1H",
      "tool": "Chronify AI Timetable Builder"
    },
    {
      "@type": "ItemList",
      "name": "Fixed Commitment Types",
      "description": "Different types of fixed commitments available",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "College/Class",
          "description": "Academic class hours"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Office/Work",
          "description": "Professional work hours"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Commute",
          "description": "Travel time"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Meeting",
          "description": "Scheduled meetings"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Workout/Gym",
          "description": "Exercise sessions"
        },
        {
          "@type": "ListItem",
          "position": 6,
          "name": "Meal/Break",
          "description": "Meal times and breaks"
        }
      ]
    },
    {
      "@type": "ItemList",
      "name": "Sleep Types",
      "description": "Different types of sleep schedules",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Regular Sleep",
          "description": "Standard overnight sleep"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Power Nap",
          "description": "Short refreshing naps"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Recovery Sleep",
          "description": "Extended rest after intense activity"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Early Bird",
          "description": "Early to bed, early to rise schedule"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Night Owl",
          "description": "Late night productivity schedule"
        }
      ]
    }
  ]
}

export default function TimetableBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <TimetableBuilderClient />
    </>
  )
}