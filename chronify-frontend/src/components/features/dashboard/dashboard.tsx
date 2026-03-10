// src/app/dashboard/DashboardClient.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AuthService } from '@/hooks/useAuth'
import { StatsOverview } from '@/components/features/newdashboard/stats-overview'
import { ProgressInsights } from '@/components/features/newdashboard/progress-insights'
import { ScheduleView } from '@/components/features/newdashboard/weekly-schedule'
import { TaskManager } from '@/components/features/newdashboard/task-manager'
import { MotivationBoard } from '@/components/features/newdashboard/motivation-board'
import { QuickAccess } from '@/components/features/newdashboard/quick-access'
import { TourCompletionCelebration } from '@/components/features/newdashboard/tour-completion'
import Script from 'next/script'
import Head from 'next/head'

export default function DashboardClient() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pageViewTracked, setPageViewTracked] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser) {
        router.push('/auth/login')
      } else {
        setUser(currentUser)
        setLoading(false)
      }
    }
    fetchUser()
  }, [router])

  // Track page view for analytics
  useEffect(() => {
    if (!loading && user && !pageViewTracked) {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: 'Dashboard',
          page_location: window.location.href,
          user_status: user?.onboardingStep === 4 ? 'new_user' : 'returning_user'
        });
      }
      setPageViewTracked(true);
    }
  }, [loading, user, pageViewTracked]);

  // Structured data for rich snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "User Dashboard",
    "description": "Personal productivity dashboard for tracking goals and tasks",
    "publisher": {
      "@type": "Organization",
      "name": "Chronify",
      "logo": {
        "@type": "ImageObject",
        "url": "https://chronify.com/logo.png"
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Statistics Overview",
          "description": "View your consistency statistics"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Progress Insights",
          "description": "Track your progress over time"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Weekly Schedule",
          "description": "Plan your weekly tasks"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Task Manager",
          "description": "Manage daily tasks"
        }
      ]
    }
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Dashboard - Chronify</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </>
    )
  }

  if (!user) return null

  return (
    <>
      <Head>
        {/* Dynamic title based on user */}
        <title>{user?.name ? `${user.name}'s Dashboard - Chronify` : 'Dashboard - Chronify'}</title>
        <meta name="description" content={user?.name ? `${user.name}'s personal productivity dashboard on Chronify. Track daily goals, manage tasks, and monitor consistency.` : 'Personal dashboard to track your daily goals, tasks, and consistency metrics on Chronify.'} />
        
        {/* Theme Color for Browser */}
        <meta name="theme-color" content="#4F46E5" />
      </Head>

      {/* Google AdSense Auto Ads Script */}
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
        crossOrigin="anonymous"
        onLoad={() => {
          console.log('AdSense script loaded');
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (error) {
            console.error('AdSense initialization error:', error);
          }
        }}
      />

      {/* Structured Data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* AdSense Ad Unit - Top Banner */}
        <div className="max-w-7xl mx-auto mb-4">
          <ins className="adsbygoogle"
               style={{ display: 'block', textAlign: 'center' }}
               data-ad-layout="in-article"
               data-ad-format="fluid"
               data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
               data-ad-slot="TOP_BANNER_SLOT_ID"></ins>
          <Script id="top-banner-init">
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </Script>
        </div>

        <TourCompletionCelebration />
        
        <div className="max-w-7xl mx-auto">
          {/* Hero Section with Schema Markup */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 dashboard-hero"
            itemScope
            itemType="https://schema.org/WPHeader"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2" itemProp="headline">
                  {user?.onboardingStep === 4 
                    ? `Welcome to Chronify, ${user.name || user.email}! 🎉` 
                    : `Welcome back, ${user.name || user.email}! 👋`
                  }
                </h1>
                <p className="text-lg text-muted-foreground" itemProp="description">
                  {user?.onboardingStep === 4 
                    ? 'Your profile is complete! Ready to start your consistency journey?'
                    : 'Your consistency journey is on track. Let\'s make today productive.'
                  }
                </p>
                
                {user?.onboardingStep === 4 && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <p className="text-sm text-green-600">
                      🎯 <strong>Pro Tip:</strong> Start by setting your first goal to get personalized recommendations.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {user?.onboardingStep === 4 ? 'Day 1' : 'Day 7'}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Streak</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <div className="text-white font-bold">
                    {user?.onboardingStep === 4 ? '✨' : '🔥'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview with AdSense In-feed Ad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 stats-overview-section"
          >
            <StatsOverview />
            
            {/* In-feed Ad */}
            <div className="mt-4">
              <ins className="adsbygoogle"
                   style={{ display: 'block' }}
                   data-ad-format="fluid"
                   data-ad-layout-key="-fb+5w+4e-db+86"
                   data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                   data-ad-slot="IN_FEED_SLOT_ID"></ins>
              <Script id="infeed-init">
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
              </Script>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Progress & Tasks */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="progress-insights-section"
                itemScope
                itemType="https://schema.org/Analytics"
              >
                <ProgressInsights />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="schedule-view-section"
                itemScope
                itemType="https://schema.org/Schedule"
              >
                <ScheduleView />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="task-manager-section"
                itemScope
                itemType="https://schema.org/ItemList"
              >
                <TaskManager />
              </motion.div>
            </div>

            {/* Right Column - Motivation & Quick Access */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="motivation-board-section"
              >
                <MotivationBoard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="quick-access-section"
              >
                <QuickAccess />
                
                {/* Sidebar Ad */}
                <div className="mt-4">
                  <ins className="adsbygoogle"
                       style={{ display: 'block' }}
                       data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                       data-ad-slot="SIDEBAR_SLOT_ID"
                       data-ad-format="rectangle"
                       data-full-width-responsive="true"></ins>
                  <Script id="sidebar-ad-init">
                    {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                  </Script>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Onboarding Guide for New Users */}
          {user?.onboardingStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-border"
              itemScope
              itemType="https://schema.org/Guide"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold mb-2" itemProp="name">Get Started Guide</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" itemProp="itemListElement">
                    {[
                      {
                        step: '1',
                        title: 'Set Your First Goal',
                        description: 'Define what you want to achieve this month',
                        action: 'Click "Goals" in sidebar'
                      },
                      {
                        step: '2',
                        title: 'Create Daily Tasks',
                        description: 'Break goals into manageable daily tasks',
                        action: 'Go to Task Manager'
                      },
                      {
                        step: '3',
                        title: 'Plan Your Week',
                        description: 'Schedule tasks in your timetable',
                        action: 'Use Weekly Schedule'
                      },
                      {
                        step: '4',
                        title: 'Track Progress',
                        description: 'Monitor your consistency and growth',
                        action: 'Check Progress Insights'
                      }
                    ].map((item) => (
                      <div key={item.step} className="p-4 rounded-xl bg-background/50 border border-border hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-bold text-primary">{item.step}</span>
                          </div>
                          <div className="font-medium">{item.title}</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <div className="text-xs text-primary font-medium">{item.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Ad */}
        <div className="max-w-7xl mx-auto mt-8">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
               data-ad-slot="FOOTER_SLOT_ID"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <Script id="footer-ad-init">
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </Script>
        </div>
      </div>
    </>
  )
}