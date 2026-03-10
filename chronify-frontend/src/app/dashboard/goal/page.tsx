// src/app/dashboard/goals/page.tsx (Server Component)
import GoalClients from '@/components/features/goal/goal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Goals & Milestones - Chronify AI | Track Your Personal & Professional Goals',
  description: 'Set, track, and achieve your personal and professional goals with Chronify AI. Create SMART goals, track progress with milestones, monitor streaks, and stay motivated with visual progress tracking.',
  keywords: 'goal tracking, goal setting, SMART goals, milestones, progress tracking, personal goals, professional goals, habit tracking, productivity goals, achievement tracker, goal management, task goals',
  openGraph: {
    title: 'Goals & Milestones - Chronify AI | Achieve More Every Day',
    description: 'Powerful goal tracking system with milestones, progress visualization, and streak monitoring. Set SMART goals and track your journey to success.',
    type: 'website',
    url: 'https://chronify.com/dashboard/goals',
    images: [
      {
        url: 'https://chronify.com/og-goals.jpg',
        width: 1200,
        height: 630,
        alt: 'Chronify AI Goals Dashboard - Track Your Progress',
      },
    ],
    siteName: 'Chronify AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goals & Milestones - Chronify AI',
    description: 'Track your personal and professional goals with milestones and progress insights.',
    images: ['https://chronify.com/twitter-goals.jpg'],
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
    canonical: 'https://chronify.com/dashboard/goals',
  },
  authors: [{ name: 'Chronify Team', url: 'https://chronify.com/about' }],
  category: 'productivity',
  classification: 'Goal Management Software',
}

// Structured Data for Rich Snippets
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://chronify.com/dashboard/goals",
      "url": "https://chronify.com/dashboard/goals",
      "name": "Goals & Milestones Dashboard - Chronify AI",
      "description": "Comprehensive goal tracking system with milestones, progress tracking, and performance analytics",
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
            "name": "Goals",
            "item": "https://chronify.com/dashboard/goals"
          }
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Chronify AI Goal Tracker",
      "description": "Professional goal management system with milestone tracking and progress analytics",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "Web, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "featureList": [
        "SMART goal setting",
        "Milestone tracking",
        "Progress visualization",
        "Streak monitoring",
        "Priority management",
        "Category organization",
        "Deadline tracking",
        "Time logging",
        "Performance analytics"
      ],
      "screenshot": "https://chronify.com/screenshots/goals-dashboard.jpg"
    },
    {
      "@type": "FAQPage",
      "@id": "https://chronify.com/dashboard/goals#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are SMART goals?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound objectives. Chronify AI helps you create and track SMART goals with milestones and progress metrics."
          }
        },
        {
          "@type": "Question",
          "name": "How do I track goal progress?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Log hours, complete milestones, and update progress percentage. The system automatically calculates overall progress and tracks streaks based on consistent effort."
          }
        },
        {
          "@type": "Question",
          "name": "What are milestones?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Milestones are smaller, achievable steps that break down your main goal. Each milestone has its own title, description, target date, and progress tracking."
          }
        },
        {
          "@type": "Question",
          "name": "How are streaks calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Streaks track consecutive days of logging progress. If you log any progress (hours or milestone completion) each day, your streak continues."
          }
        },
        {
          "@type": "Question",
          "name": "Can I set different priority levels?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Goals can be set as Critical, High, Medium, or Low priority. Filter and sort by priority to focus on what matters most."
          }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to Set and Achieve Goals Effectively",
      "description": "Step-by-step guide to using Chronify AI for goal achievement",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Create Your Goal",
          "text": "Set a clear, specific goal with title, description, category, and priority level"
        },
        {
          "@type": "HowToStep",
          "name": "Add Milestones",
          "text": "Break down your goal into smaller, manageable milestones with target dates"
        },
        {
          "@type": "HowToStep",
          "name": "Log Progress",
          "text": "Regularly update progress by logging hours or completing milestones"
        },
        {
          "@type": "HowToStep",
          "name": "Track Streaks",
          "text": "Maintain consistency to build streaks and stay motivated"
        },
        {
          "@type": "HowToStep",
          "name": "Review & Adjust",
          "text": "Monitor progress, adjust targets, and celebrate achievements"
        }
      ],
      "totalTime": "P3M",
      "tool": "Chronify AI Goal Tracker"
    },
    {
      "@type": "ItemList",
      "name": "Goal Categories",
      "description": "Organize goals by different life areas",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Academic Goals",
          "description": "Educational and learning objectives"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Professional Goals",
          "description": "Career and work-related achievements"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Health & Fitness Goals",
          "description": "Wellness and physical improvement targets"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Personal Development Goals",
          "description": "Self-improvement and growth objectives"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Skill Development Goals",
          "description": "Learning new abilities and competencies"
        },
        {
          "@type": "ListItem",
          "position": 6,
          "name": "Financial Goals",
          "description": "Money management and wealth objectives"
        }
      ]
    }
  ]
}

export default function GoalsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GoalClients />
    </>
  )
}