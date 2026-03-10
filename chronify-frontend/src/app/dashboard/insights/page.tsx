// // app/dashboard/insights/page.tsx
// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { motion } from 'framer-motion'
// import { 
//   Calendar, 
//   TrendingUp, 
//   Target, 
//   Clock, 
//   Award, 
//   Zap, 
//   Brain, 
//   BookOpen, 
//   Users,
//   LineChart,
//   PieChart,
//   BarChart3,
//   Download,
//   Share2,
//   Filter,
//   ChevronRight
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Progress } from '@/components/ui/progress'
// import { Badge } from '@/components/ui/badge'

// export default function ProgressInsightsPage() {
//   const [timeRange, setTimeRange] = useState('month')

//   const insightsData = {
//     streak: 21,
//     consistencyScore: 92,
//     productivityScore: 88,
//     focusHours: 42,
//     completedTasks: 156,
//     timeSaved: 15,
//     improvement: '+12%'
//   }

//   const detailedAnalytics = [
//     { metric: 'DSA Completion', current: 120, target: 180, trend: '↑ 8%', color: 'bg-blue-500' },
//     { metric: 'College GPA', current: 8.7, target: 9.0, trend: '↑ 0.3', color: 'bg-green-500' },
//     { metric: 'Projects', current: 1, target: 3, trend: '→ 0', color: 'bg-purple-500' },
//     { metric: 'Skills Learned', current: 4, target: 8, trend: '↑ 2', color: 'bg-orange-500' },
//   ]

//   const weeklyBreakdown = [
//     { day: 'Mon', dsa: 4, college: 3, projects: 1, total: 8 },
//     { day: 'Tue', dsa: 3.5, college: 3, projects: 1.5, total: 8 },
//     { day: 'Wed', dsa: 4.5, college: 2.5, projects: 1, total: 8 },
//     { day: 'Thu', dsa: 3, college: 4, projects: 1, total: 8 },
//     { day: 'Fri', dsa: 4, college: 2, projects: 2, total: 8 },
//     { day: 'Sat', dsa: 5, college: 1, projects: 2, total: 8 },
//     { day: 'Sun', dsa: 4, college: 2, projects: 2, total: 8 },
//   ]

//   const performanceMetrics = [
//     { time: 'Morning (6-9 AM)', efficiency: 92, tasks: 8 },
//     { time: 'Forenoon (9-12 PM)', efficiency: 88, tasks: 12 },
//     { time: 'Afternoon (1-4 PM)', efficiency: 78, tasks: 10 },
//     { time: 'Evening (4-7 PM)', efficiency: 85, tasks: 8 },
//     { time: 'Night (7-10 PM)', efficiency: 90, tasks: 6 },
//   ]

//   const milestones = [
//     { title: '21-Day Streak', date: 'Today', description: 'Longest streak achieved!', icon: Award },
//     { title: '100 DSA Problems', date: '3 days ago', description: 'Reached major milestone', icon: Brain },
//     { title: '90%+ Consistency', date: '1 week ago', description: 'Maintained high consistency', icon: TrendingUp },
//     { title: 'Early Bird', date: '2 weeks ago', description: '5 AM starts for 7 days', icon: Zap },
//   ]

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="space-y-8"
//         >
//           {/* Header */}
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//             <div>
//               <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
//                 <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">
//                   Dashboard
//                 </Link>
//                 <ChevronRight className="w-4 h-4" />
//                 <span>Progress Insights</span>
//               </div>
//               <h1 className="text-3xl font-bold mb-2">Progress Insights</h1>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Detailed analytics and performance tracking for your study journey
//               </p>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <Button variant="outline" size="sm" className="gap-2">
//                 <Filter className="w-4 h-4" />
//                 Filter
//               </Button>
//               <Button variant="outline" size="sm" className="gap-2">
//                 <Download className="w-4 h-4" />
//                 Export
//               </Button>
//               <Button size="sm" className="gap-2">
//                 <Share2 className="w-4 h-4" />
//                 Share Progress
//               </Button>
//             </div>
//           </div>

//           {/* Time Range Selector */}
//           <div className="flex items-center justify-between">
//             <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full">
//               <TabsList className="grid grid-cols-4">
//                 <TabsTrigger value="week">This Week</TabsTrigger>
//                 <TabsTrigger value="month">This Month</TabsTrigger>
//                 <TabsTrigger value="quarter">This Quarter</TabsTrigger>
//                 <TabsTrigger value="all">All Time</TabsTrigger>
//               </TabsList>
//             </Tabs>
//           </div>

//           {/* Key Metrics */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {Object.entries(insightsData).map(([key, value], index) => (
//               <motion.div
//                 key={key}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <Card className="h-full">
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-3 mb-4">
//                       <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
//                         {key === 'streak' && <Calendar className="w-5 h-5 text-blue-600" />}
//                         {key === 'consistencyScore' && <TrendingUp className="w-5 h-5 text-green-600" />}
//                         {key === 'productivityScore' && <Zap className="w-5 h-5 text-yellow-600" />}
//                         {key === 'focusHours' && <Clock className="w-5 h-5 text-purple-600" />}
//                         {key === 'completedTasks' && <Target className="w-5 h-5 text-orange-600" />}
//                         {key === 'timeSaved' && <Award className="w-5 h-5 text-cyan-600" />}
//                         {key === 'improvement' && <LineChart className="w-5 h-5 text-pink-600" />}
//                       </div>
//                       <div className="text-sm font-medium capitalize">
//                         {key.replace(/([A-Z])/g, ' $1')}
//                       </div>
//                     </div>
//                     <div className="text-2xl font-bold mb-1">
//                       {typeof value === 'number' ? value : value}
//                     </div>
//                     {key === 'improvement' && (
//                       <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
//                         {value} from last period
//                       </Badge>
//                     )}
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>

//           {/* Detailed Analytics */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Progress Overview */}
//             <Card className="lg:col-span-2">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <BarChart3 className="w-5 h-5" />
//                   Detailed Progress Analysis
//                 </CardTitle>
//                 <CardDescription>Track progress across all your goals</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   {detailedAnalytics.map((item, index) => (
//                     <motion.div
//                       key={item.metric}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="space-y-2"
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <div className={`w-3 h-3 rounded-full ${item.color}`} />
//                           <span className="font-medium">{item.metric}</span>
//                         </div>
//                         <div className="text-right">
//                           <span className="font-bold">{item.current}</span>
//                           <span className="text-gray-600 dark:text-gray-400 text-sm ml-2">
//                             / {item.target} target
//                           </span>
//                           <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
//                             {item.trend}
//                           </Badge>
//                         </div>
//                       </div>
//                       <Progress value={(item.current / item.target) * 100} className="h-2" />
//                     </motion.div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Weekly Breakdown */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <PieChart className="w-5 h-5" />
//                   Weekly Time Distribution
//                 </CardTitle>
//                 <CardDescription>Hours spent on different activities</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {weeklyBreakdown.map((day, index) => (
//                     <motion.div
//                       key={day.day}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       className="space-y-2"
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className="font-medium">{day.day}</span>
//                         <span className="text-sm text-gray-600 dark:text-gray-400">
//                           {day.total}h total
//                         </span>
//                       </div>
//                       <div className="flex h-2 rounded-full overflow-hidden">
//                         <div 
//                           className="bg-blue-500" 
//                           style={{ width: `${(day.dsa / day.total) * 100}%` }}
//                         />
//                         <div 
//                           className="bg-green-500" 
//                           style={{ width: `${(day.college / day.total) * 100}%` }}
//                         />
//                         <div 
//                           className="bg-purple-500" 
//                           style={{ width: `${(day.projects / day.total) * 100}%` }}
//                         />
//                       </div>
//                       <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
//                         <span>DSA: {day.dsa}h</span>
//                         <span>College: {day.college}h</span>
//                         <span>Projects: {day.projects}h</span>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Performance Metrics */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Clock className="w-5 h-5" />
//                   Daily Performance Pattern
//                 </CardTitle>
//                 <CardDescription>When you're most productive</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {performanceMetrics.map((metric, index) => (
//                     <motion.div
//                       key={metric.time}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="space-y-2"
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className="font-medium">{metric.time}</span>
//                         <div className="flex items-center gap-4">
//                           <span className="text-sm text-gray-600 dark:text-gray-400">
//                             {metric.tasks} tasks
//                           </span>
//                           <Badge className={`${
//                             metric.efficiency >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/30' :
//                             metric.efficiency >= 80 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30' :
//                             'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30'
//                           }`}>
//                             {metric.efficiency}% efficiency
//                           </Badge>
//                         </div>
//                       </div>
//                       <Progress value={metric.efficiency} className="h-2" />
//                     </motion.div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Award className="w-5 h-5" />
//                   Recent Milestones
//                 </CardTitle>
//                 <CardDescription>Your achievements and progress markers</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {milestones.map((milestone, index) => (
//                     <motion.div
//                       key={milestone.title}
//                       initial={{ opacity: 0, x: 20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="flex items-start gap-4 p-3 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20"
//                     >
//                       <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
//                         <milestone.icon className="w-5 h-5 text-white" />
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between mb-1">
//                           <h4 className="font-bold">{milestone.title}</h4>
//                           <span className="text-sm text-gray-600 dark:text-gray-400">
//                             {milestone.date}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {milestone.description}
//                         </p>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Recommendations */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Brain className="w-5 h-5" />
//                 AI Recommendations
//               </CardTitle>
//               <CardDescription>Personalized suggestions based on your data</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {[
//                   {
//                     title: 'Increase Morning Focus',
//                     description: 'Your morning efficiency is 92%. Try starting 30 minutes earlier for even better results.',
//                     icon: Zap,
//                     priority: 'high'
//                   },
//                   {
//                     title: 'Balance DSA & Projects',
//                     description: 'Project progress is lagging. Allocate 2 more hours weekly to project work.',
//                     icon: Target,
//                     priority: 'medium'
//                   },
//                   {
//                     title: 'Optimize Break Times',
//                     description: 'Afternoon efficiency drops to 78%. Try shorter, more frequent breaks.',
//                     icon: Clock,
//                     priority: 'medium'
//                   },
//                 ].map((rec, index) => (
//                   <motion.div
//                     key={rec.title}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     className="p-4 rounded-lg border border-gray-200 dark:border-gray-800"
//                   >
//                     <div className="flex items-start gap-3 mb-3">
//                       <div className={`p-2 rounded-lg ${
//                         rec.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
//                         'bg-blue-100 dark:bg-blue-900/30'
//                       }`}>
//                         <rec.icon className={`w-5 h-5 ${
//                           rec.priority === 'high' ? 'text-red-600 dark:text-red-400' :
//                           'text-blue-600 dark:text-blue-400'
//                         }`} />
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="font-bold mb-1">{rec.title}</h4>
//                         <Badge className={`mb-2 ${
//                           rec.priority === 'high' 
//                             ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
//                             : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
//                         }`}>
//                           {rec.priority} priority
//                         </Badge>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {rec.description}
//                         </p>
//                       </div>
//                     </div>
//                     <Button size="sm" variant="outline" className="w-full mt-2">
//                       Implement Suggestion
//                     </Button>
//                   </motion.div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Export Section */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Download className="w-5 h-5" />
//                 Export & Share
//               </CardTitle>
//               <CardDescription>Share your progress or export data for analysis</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { format: 'PDF Report', description: 'Detailed progress report', icon: BookOpen },
//                   { format: 'CSV Data', description: 'Raw data for analysis', icon: BarChart3 },
//                   { format: 'Image', description: 'Shareable progress image', icon: Share2 },
//                   { format: 'JSON', description: 'Structured data export', icon: Users },
//                 ].map((format, index) => (
//                   <motion.button
//                     key={format.format}
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: index * 0.1 }}
//                     className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left"
//                   >
//                     <div className="flex items-center gap-3 mb-2">
//                       <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
//                         <format.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                       </div>
//                       <span className="font-medium">{format.format}</span>
//                     </div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       {format.description}
//                     </p>
//                   </motion.button>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

















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