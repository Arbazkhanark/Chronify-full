// // src/app/dashboard/page.tsx (Updated with User Integration)
// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { AuthService } from '@/hooks/useAuth'
// import { StatsOverview } from '@/components/features/newdashboard/stats-overview'
// import { ProgressInsights } from '@/components/features/newdashboard/progress-insights'
// import { ScheduleView } from '@/components/features/newdashboard/weekly-schedule'
// import { TaskManager } from '@/components/features/newdashboard/task-manager'
// import { MotivationBoard } from '@/components/features/newdashboard/motivation-board'
// import { QuickAccess } from '@/components/features/newdashboard/quick-access'
// import { TourCompletionCelebration } from '@/components/features/newdashboard/tour-completion'
// // import { TourCompletionCelebration } from '@/components/features/dashboard/tour-completion'

// export default function DashboardPage() {
//   const router = useRouter()
//   const [user, setUser] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchUser = async () => {
//       const currentUser = await AuthService.getCurrentUser()
//       if (!currentUser) {
//         router.push('/auth/login')
//       } else {
//         setUser(currentUser)
//         setLoading(false)
//       }
//     }
//     fetchUser()
//   }, [router])

//   useEffect(() => {
//     if (user?.onboardingStep === 4) {
//       // User just completed profile setup
//       console.log('User completed profile setup, showing onboarding tour')
//     }
//   }, [user])

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   if (!user) return null

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <TourCompletionCelebration />
      
//       <div className="max-w-7xl mx-auto">
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8 dashboard-hero"
//         >
//           <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold mb-2">
//                 {user?.onboardingStep === 4 
//                   ? `Welcome to Chronify, ${user.name || user.email}! 🎉` 
//                   : `Welcome back, ${user.name || user.email}! 👋`
//                 }
//               </h1>
//               <p className="text-lg text-muted-foreground">
//                 {user?.onboardingStep === 4 
//                   ? 'Your profile is complete! Ready to start your consistency journey?'
//                   : 'Your consistency journey is on track. Let\'s make today productive.'
//                 }
//               </p>
              
//               {user?.onboardingStep === 4 && (
//                 <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
//                   <p className="text-sm text-green-600">
//                     🎯 <strong>Pro Tip:</strong> Start by setting your first goal to get personalized recommendations.
//                   </p>
//                 </div>
//               )}
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-primary">
//                   {user?.onboardingStep === 4 ? 'Day 1' : 'Day 7'}
//                 </div>
//                 <div className="text-sm text-muted-foreground">Current Streak</div>
//               </div>
//               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
//                 <div className="text-white font-bold">
//                   {user?.onboardingStep === 4 ? '✨' : '🔥'}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Stats Overview - Top Row */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="mb-8 stats-overview-section"
//         >
//           <StatsOverview />
//         </motion.div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Progress & Tasks */}
//           <div className="lg:col-span-2 space-y-8">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//               className="progress-insights-section"
//             >
//               <ProgressInsights />
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               className="schedule-view-section"
//             >
//               <ScheduleView />
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.4 }}
//               className="task-manager-section"
//             >
//               <TaskManager />
//             </motion.div>
//           </div>

//           {/* Right Column - Motivation & Quick Access */}
//           <div className="space-y-8">
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//               className="motivation-board-section"
//             >
//               <MotivationBoard />
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               className="quick-access-section"
//             >
//               <QuickAccess />
//             </motion.div>
//           </div>
//         </div>

//         {/* Onboarding Guide for New Users */}
//         {user?.onboardingStep === 4 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-border"
//           >
//             <div className="flex items-start gap-4">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
//                 <span className="text-white text-xl">🎯</span>
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-bold mb-2">Get Started Guide</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {[
//                     {
//                       step: '1',
//                       title: 'Set Your First Goal',
//                       description: 'Define what you want to achieve this month',
//                       action: 'Click "Goals" in sidebar'
//                     },
//                     {
//                       step: '2',
//                       title: 'Create Daily Tasks',
//                       description: 'Break goals into manageable daily tasks',
//                       action: 'Go to Task Manager'
//                     },
//                     {
//                       step: '3',
//                       title: 'Plan Your Week',
//                       description: 'Schedule tasks in your timetable',
//                       action: 'Use Weekly Schedule'
//                     },
//                     {
//                       step: '4',
//                       title: 'Track Progress',
//                       description: 'Monitor your consistency and growth',
//                       action: 'Check Progress Insights'
//                     }
//                   ].map((item) => (
//                     <div key={item.step} className="p-4 rounded-xl bg-background/50 border border-border hover:border-primary/30 transition-all">
//                       <div className="flex items-center gap-3 mb-2">
//                         <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                           <span className="font-bold text-primary">{item.step}</span>
//                         </div>
//                         <div className="font-medium">{item.title}</div>
//                       </div>
//                       <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
//                       <div className="text-xs text-primary font-medium">{item.action}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   )
// }




















// src/app/dashboard/page.tsx (Server Component)
import DashboardClient from '@/components/features/dashboard/dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Chronify | Track Your Daily Consistency & Progress',
  description: 'Personal dashboard to track your daily goals, tasks, and consistency metrics. Monitor progress, manage schedule, and stay motivated with Chronify.',
  keywords: 'productivity dashboard, task manager, goal tracking, consistency tracker, daily schedule planner, progress insights',
  openGraph: {
    title: 'Chronify Dashboard - Your Personal Consistency Tracker',
    description: 'Track your daily goals, manage tasks, and monitor your consistency journey all in one place.',
    type: 'website',
    url: 'https://chronify.com/dashboard',
    images: [
      {
        url: 'https://chronify.com/og-dashboard.jpg',
        width: 1200,
        height: 630,
        alt: 'Chronify Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chronify Dashboard - Your Personal Consistency Tracker',
    description: 'Track your daily goals, manage tasks, and monitor your consistency journey all in one place.',
    images: ['https://chronify.com/twitter-dashboard.jpg'],
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
    canonical: 'https://chronify.com/dashboard',
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
}

export default function DashboardPage() {
  return <DashboardClient />
}