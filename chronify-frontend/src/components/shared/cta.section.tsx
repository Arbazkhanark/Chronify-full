// 'use client'

// import { Button } from '@/components/ui/button'
// import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
// import { motion } from 'framer-motion'
// import Link from 'next/link'

// export function CTASection() {
//   return (
//     <section className="py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-border"
//         >
//           {/* Background elements */}
//           <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          
//           <div className="relative p-8 md:p-12 lg:p-16">
//             <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
//               <div className="flex-1">
//                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
//                   <Sparkles className="w-4 h-4 text-accent" />
//                   <span className="text-sm font-medium gradient-text">Limited Time Offer</span>
//                 </div>
                
//                 <h2 className="text-4xl md:text-5xl font-bold mb-6">
//                   Start Your Journey to
//                   <span className="block gradient-text">Academic Excellence</span>
//                 </h2>
                
//                 <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
//                   Join thousands of students who transformed their academic life with Chronify AI. 
//                   Get your personalized timetable in minutes.
//                 </p>
                
//                 <div className="space-y-4 mb-8">
//                   {[
//                     'AI-generated timetable in 2 minutes',
//                     'Priority-based task scheduling',
//                     'Progress tracking with heatmaps',
//                     'Weekly performance analytics',
//                     'Mobile-friendly interface',
//                     '24/7 AI support'
//                   ].map((feature) => (
//                     <div key={feature} className="flex items-center gap-3">
//                       <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
//                       <span className="text-foreground">{feature}</span>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   <Link href="/signup">
//                     <Button size="lg" className="rounded-xl px-8 py-6 text-lg gap-2">
//                       Get Started Free
//                       <ArrowRight className="w-5 h-5" />
//                     </Button>
//                   </Link>
//                   <Link href="/demo">
//                     <Button size="lg" variant="outline" className="rounded-xl px-8 py-6 text-lg">
//                       Watch Demo
//                     </Button>
//                   </Link>
//                 </div>
                
//                 <p className="text-sm text-muted-foreground mt-6">
//                   No credit card required • 14-day free trial • Cancel anytime
//                 </p>
//               </div>
              
//               {/* CTA illustration */}
//               <div className="flex-1 relative">
//                 <div className="relative bg-card rounded-2xl p-6 border border-border shadow-2xl">
//                   <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
//                     <span className="text-white font-bold text-lg">AI</span>
//                   </div>
                  
//                   <div className="mb-6">
//                     <h4 className="font-bold text-lg mb-2">Your Sample Timetable</h4>
//                     <div className="text-sm text-muted-foreground">
//                       Based on typical MCA student schedule
//                     </div>
//                   </div>
                  
//                   <div className="space-y-3">
//                     {[
//                       { time: '6:30 AM', task: 'Wake up + Plan day', priority: 'high' },
//                       { time: '7:10 AM', task: 'Bus: DSA Audio Learning', priority: 'high' },
//                       { time: '9:30 AM', task: 'College Classes', priority: 'medium' },
//                       { time: 'Free Period', task: 'DSA Problems', priority: 'high' },
//                       { time: '5:10 PM', task: 'Bus: Revision', priority: 'medium' },
//                       { time: '8:00 PM', task: 'Projects/AI-ML', priority: 'low' },
//                       { time: '10:30 PM', task: 'DSA Deep Dive', priority: 'high' },
//                     ].map((item) => (
//                       <div key={item.time} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
//                         <div className={`w-2 h-2 rounded-full ${
//                           item.priority === 'high' ? 'bg-red-500' : 
//                           item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
//                         }`} />
//                         <div className="flex-1">
//                           <div className="font-medium">{item.task}</div>
//                           <div className="text-xs text-muted-foreground">{item.time}</div>
//                         </div>
//                         <div className={`px-2 py-1 rounded text-xs font-medium ${
//                           item.priority === 'high' ? 'bg-red-500/20 text-red-500' : 
//                           item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 
//                           'bg-green-500/20 text-green-500'
//                         }`}>
//                           {item.priority.toUpperCase()}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
                  
//                   <div className="mt-6 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10">
//                     <div className="text-sm font-medium">Weekly Time Distribution:</div>
//                     <div className="flex items-center gap-4 mt-2">
//                       <div className="flex-1">
//                         <div className="flex justify-between text-xs mb-1">
//                           <span>DSA (55%)</span>
//                           <span>32-35 hrs</span>
//                         </div>
//                         <div className="h-2 rounded-full bg-primary overflow-hidden">
//                           <div className="h-full bg-primary" style={{ width: '55%' }} />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex gap-4 mt-3">
//                       <div className="flex-1">
//                         <div className="flex justify-between text-xs mb-1">
//                           <span>College (18%)</span>
//                           <span>10-12 hrs</span>
//                         </div>
//                         <div className="h-2 rounded-full bg-green-500 overflow-hidden">
//                           <div className="h-full bg-green-500" style={{ width: '18%' }} />
//                         </div>
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex justify-between text-xs mb-1">
//                           <span>Projects (15%)</span>
//                           <span>8-10 hrs</span>
//                         </div>
//                         <div className="h-2 rounded-full bg-accent overflow-hidden">
//                           <div className="h-full bg-accent" style={{ width: '15%' }} />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }





























// 'use client'

// import { Button } from '@/components/ui/button'
// import { ArrowRight, CheckCircle, Sparkles, Calendar, Clock, TrendingUp, Target } from 'lucide-react'
// import { motion } from 'framer-motion'
// import Link from 'next/link'

// export function CTASection() {
//   const features = [
//     { text: 'AI-generated timetable in 2 minutes', icon: Calendar },
//     { text: 'Priority-based task scheduling', icon: Target },
//     { text: 'Progress tracking with analytics', icon: TrendingUp },
//     { text: 'Time optimization for maximum efficiency', icon: Clock },
//   ]

//   const timetableItems = [
//     { time: '6:30 AM', task: 'Wake up + Plan day', type: 'personal' },
//     { time: '7:10 AM', task: 'Commute: DSA Audio Learning', type: 'learning' },
//     { time: '9:30 AM', task: 'College Classes', type: 'academic' },
//     { time: '2:00 PM', task: 'DSA Practice Session', type: 'learning' },
//     { time: '5:10 PM', task: 'Commute: Revision', type: 'learning' },
//     { time: '8:00 PM', task: 'Project Work', type: 'project' },
//     { time: '10:30 PM', task: 'DSA Deep Dive', type: 'learning' },
//   ]

//   const timeDistribution = [
//     { label: 'DSA Practice', percentage: 55, hours: '32-35 hrs', color: 'bg-blue-600' },
//     { label: 'College Studies', percentage: 18, hours: '10-12 hrs', color: 'bg-green-600' },
//     { label: 'Project Work', percentage: 15, hours: '8-10 hrs', color: 'bg-purple-600' },
//     { label: 'Commute Learning', percentage: 12, hours: '8-10 hrs', color: 'bg-gray-600' },
//   ]

//   return (
//     <section className="py-16 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
//         >
//           {/* Background decorative elements */}
//           <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          
//           <div className="relative p-8 md:p-12">
//             <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
//               {/* Left Content */}
//               <div className="flex-1">
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: 0.1 }}
//                   className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 mb-6"
//                 >
//                   <Sparkles className="w-4 h-4 text-gray-700 dark:text-gray-300" />
//                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Start Your Journey Today
//                   </span>
//                 </motion.div>
                
//                 <motion.h2
//                   initial={{ opacity: 0, y: 10 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: 0.2 }}
//                   className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100"
//                 >
//                   Transform Your Academic
//                   <span className="block text-blue-600 dark:text-blue-500">Productivity</span>
//                 </motion.h2>
                
//                 <motion.p
//                   initial={{ opacity: 0, y: 10 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: 0.3 }}
//                   className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl"
//                 >
//                   Join thousands of students who have mastered time management and achieved their academic goals with Chronify AI.
//                 </motion.p>
                
//                 <div className="space-y-4 mb-8">
//                   {features.map((feature, index) => (
//                     <motion.div
//                       key={feature.text}
//                       initial={{ opacity: 0, x: -20 }}
//                       whileInView={{ opacity: 1, x: 0 }}
//                       viewport={{ once: true }}
//                       transition={{ delay: 0.1 * index + 0.4 }}
//                       className="flex items-center gap-4"
//                     >
//                       <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
//                         <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-500" />
//                       </div>
//                       <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
//                     </motion.div>
//                   ))}
//                 </div>
                
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: 0.8 }}
//                   className="flex flex-col sm:flex-row gap-4 mb-8"
//                 >
//                   <Link href="/signup" className="w-full sm:w-auto">
//                     <Button 
//                       size="lg" 
//                       className="w-full sm:w-auto rounded-lg px-8 py-6 text-base gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
//                     >
//                       Get Started Free
//                       <ArrowRight className="w-5 h-5" />
//                     </Button>
//                   </Link>
//                   <Link href="/demo" className="w-full sm:w-auto">
//                     <Button 
//                       size="lg" 
//                       variant="outline"
//                       className="w-full sm:w-auto rounded-lg px-8 py-6 text-base border-gray-300 dark:border-gray-700"
//                     >
//                       Watch Demo
//                     </Button>
//                   </Link>
//                 </motion.div>
                
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   whileInView={{ opacity: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: 1 }}
//                   className="text-sm text-gray-500 dark:text-gray-500"
//                 >
//                   No credit card required • 14-day free trial • Cancel anytime
//                 </motion.p>
//               </div>
              
//               {/* Right Content - Timetable Preview */}
//               <div className="flex-1 w-full max-w-md">
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.5 }}
//                   className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg"
//                 >
//                   {/* Header */}
//                   <div className="flex items-center justify-between mb-8">
//                     <div>
//                       <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Smart Timetable</h3>
//                       <p className="text-sm text-gray-500 dark:text-gray-500">AI-generated for maximum efficiency</p>
//                     </div>
//                     <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
//                       <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-500" />
//                     </div>
//                   </div>
                  
//                   {/* Timetable Items */}
//                   <div className="space-y-3 mb-8">
//                     {timetableItems.map((item, index) => (
//                       <motion.div
//                         key={item.time}
//                         initial={{ opacity: 0, x: 20 }}
//                         whileInView={{ opacity: 1, x: 0 }}
//                         viewport={{ once: true }}
//                         transition={{ delay: index * 0.1 }}
//                         className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
//                       >
//                         <div className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">{item.time}</div>
//                         <div className="flex-1">
//                           <div className="font-medium text-gray-900 dark:text-gray-100">{item.task}</div>
//                           <div className="text-xs text-gray-500 dark:text-gray-500 capitalize">{item.type}</div>
//                         </div>
//                         <div className={`w-3 h-3 rounded-full ${
//                           item.type === 'learning' ? 'bg-blue-500' :
//                           item.type === 'academic' ? 'bg-green-500' :
//                           item.type === 'project' ? 'bg-purple-500' : 'bg-gray-400'
//                         }`} />
//                       </motion.div>
//                     ))}
//                   </div>
                  
//                   {/* Time Distribution */}
//                   <div className="space-y-4">
//                     <h4 className="font-medium text-gray-900 dark:text-gray-100">Weekly Time Distribution</h4>
//                     <div className="space-y-3">
//                       {timeDistribution.map((item, index) => (
//                         <div key={item.label}>
//                           <div className="flex justify-between text-sm mb-1">
//                             <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
//                             <span className="text-gray-600 dark:text-gray-400">{item.hours}</span>
//                           </div>
//                           <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
//                             <motion.div
//                               initial={{ width: 0 }}
//                               whileInView={{ width: `${item.percentage}%` }}
//                               viewport={{ once: true }}
//                               transition={{ duration: 1, delay: index * 0.1 }}
//                               className={`h-full ${item.color} rounded-full`}
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   {/* Summary */}
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: 0.5 }}
//                     className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="text-sm text-gray-500 dark:text-gray-500">Weekly Total</div>
//                         <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">60-67 hours</div>
//                       </div>
//                       <div>
//                         <div className="text-sm text-gray-500 dark:text-gray-500">Productivity Score</div>
//                         <div className="text-lg font-semibold text-green-600 dark:text-green-500">92%</div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 </motion.div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Additional CTA */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="mt-12 text-center"
//         >
//           <div className="max-w-2xl mx-auto p-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
//             <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
//               Ready to Transform Your Study Routine?
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               Join 10,000+ students who have improved their academic performance with Chronify AI.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/signup">
//                 <Button size="lg" className="rounded-lg px-8 py-6 text-base bg-blue-600 hover:bg-blue-700">
//                   Start Free Trial
//                 </Button>
//               </Link>
//               <Link href="/pricing">
//                 <Button size="lg" variant="outline" className="rounded-lg px-8 py-6 text-base border-gray-300 dark:border-gray-700">
//                   View Pricing
//                 </Button>
//               </Link>
//             </div>
//             <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
//               All plans include a 14-day free trial. No credit card required.
//             </p>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }














'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Sparkles, Calendar, Clock, TrendingUp, Target, Zap, Users, Award, Star } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import Link from 'next/link'

export function CTASection() {
  const controls = useAnimation()
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const features = [
    { text: 'AI-generated timetable in 2 minutes', icon: Calendar, color: 'text-blue-600' },
    { text: 'Priority-based task scheduling', icon: Target, color: 'text-green-600' },
    { text: 'Progress tracking with analytics', icon: TrendingUp, color: 'text-purple-600' },
    { text: 'Time optimization for maximum efficiency', icon: Clock, color: 'text-orange-600' },
  ]

  const timetableItems = [
    { time: '6:30 AM', task: 'Wake up + Plan day', type: 'personal', color: 'bg-gray-400' },
    { time: '7:10 AM', task: 'Commute: DSA Audio Learning', type: 'learning', color: 'bg-blue-500' },
    { time: '9:30 AM', task: 'College Classes', type: 'academic', color: 'bg-green-500' },
    { time: '2:00 PM', task: 'DSA Practice Session', type: 'learning', color: 'bg-blue-500' },
    { time: '5:10 PM', task: 'Commute: Revision', type: 'learning', color: 'bg-blue-500' },
    { time: '8:00 PM', task: 'Project Work', type: 'project', color: 'bg-purple-500' },
    { time: '10:30 PM', task: 'DSA Deep Dive', type: 'learning', color: 'bg-blue-500' },
  ]

  const timeDistribution = [
    { label: 'DSA Practice', percentage: 55, hours: '32-35 hrs', color: 'bg-blue-600' },
    { label: 'College Studies', percentage: 18, hours: '10-12 hrs', color: 'bg-green-600' },
    { label: 'Project Work', percentage: 15, hours: '8-10 hrs', color: 'bg-purple-600' },
    { label: 'Commute Learning', percentage: 12, hours: '8-10 hrs', color: 'bg-gray-600' },
  ]

  const stats = [
    { value: '10K+', label: 'Active Students', icon: Users },
    { value: '95%', label: 'Satisfaction Rate', icon: Star },
    { value: '180+', label: 'DSA Questions Solved', icon: Target },
    { value: '40%', label: 'Productivity Gain', icon: TrendingUp },
  ]

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } })
    }
    sequence()
  }, [controls])

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
        >
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-50" />
          
          <div className="relative p-8 md:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-500/30 mb-8"
                >
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Limited Time Offer
                  </span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                  <span className="block text-gray-900 dark:text-gray-100">Master Your Time,</span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
                    Master Your Future
                  </span>
                </h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed"
                >
                  Join thousands of students who transformed their academic journey with AI-powered scheduling. 
                  Achieve placement success while maintaining academic excellence.
                </motion.p>

                {/* Features List */}
                <div className="space-y-4 mb-10">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredItem(index)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <motion.div
                        animate={hoveredItem === index ? { rotate: 10, scale: 1.1 } : { rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`flex-shrink-0 w-12 h-12 rounded-lg ${feature.color.replace('text', 'bg')}/10 flex items-center justify-center`}
                      >
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </motion.div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 mb-8"
                >
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto rounded-xl px-10 py-7 text-base font-semibold gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                    >
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/demo" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto rounded-xl px-10 py-7 text-base font-semibold border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-300"
                    >
                      Watch Live Demo
                    </Button>
                  </Link>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required • 14-day free trial • Cancel anytime</span>
                </motion.p>
              </motion.div>

              {/* Right Content - Interactive Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"
                />
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -2, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"
                />

                {/* Preview Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-2xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Smart Timetable</h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-500">AI-generated schedule for MCA students</p>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center"
                    >
                      <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                  </div>

                  {/* Timetable Items */}
                  <div className="space-y-4 mb-10">
                    {timetableItems.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 min-w-28">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.time}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100">{item.task}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 capitalize mt-1">{item.type}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Time Allocation</h4>
                    <div className="space-y-4">
                      {timeDistribution.map((item, index) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{item.hours}</span>
                          </div>
                          <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                              className={`h-full ${item.color} rounded-full relative`}
                            >
                              <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              />
                            </motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Footer */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                          whileHover={{ scale: 1.05 }}
                          className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                        >
                          <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <div className="max-w-3xl mx-auto p-12 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 border border-blue-500/20 dark:border-blue-500/30 backdrop-blur-sm">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6"
            >
              Ready to Transform Your Academic Journey?
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto"
            >
              Join 10,000+ students who have improved their academic performance and placement success.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/signup">
                <Button size="lg" className="rounded-xl px-12 py-7 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="rounded-xl px-12 py-7 text-base font-semibold border-2">
                  View All Plans
                </Button>
              </Link>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm text-gray-500 dark:text-gray-500 mt-6"
            >
              All features included in free trial • Cancel anytime • 24/7 support
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% auto;
        }
      `}</style>
    </section>
  )
}