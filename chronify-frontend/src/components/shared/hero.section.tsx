// 'use client'

// import { Button } from '@/components/ui/button'
// import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
// import { motion } from 'framer-motion'
// import Link from 'next/link'

// export function HeroSection() {
//   return (
//     <section className="relative overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8">
//       {/* Background effects */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
//       <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
//       <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
      
//       <div className="relative max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center max-w-4xl mx-auto"
//         >
//           {/* Badge */}
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-slide-up">
//             <Sparkles className="w-4 h-4 text-accent" />
//             <span className="text-sm font-medium gradient-text">AI-Powered Student Productivity</span>
//           </div>
          
//           {/* Main heading */}
//           <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
//             Master Your Time,
//             <span className="block gradient-text">Master Your Future</span>
//           </h1>
          
//           {/* Subheading */}
//           <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
//             Chronify AI creates personalized timetables that balance DSA, college studies, projects, 
//             and life—helping you achieve placement goals with smart time management.
//           </p>
          
//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
//             <Link href="/dashboard">
//               <Button size="lg" className="rounded-xl px-8 py-6 text-lg gap-2">
//                 Create Your Timetable
//                 <ArrowRight className="w-5 h-5" />
//               </Button>
//             </Link>
//             <Link href="/features">
//               <Button size="lg" variant="outline" className="rounded-xl px-8 py-6 text-lg">
//                 See How It Works
//               </Button>
//             </Link>
//           </div>
          
//           {/* Features list */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
//             {[
//               'Smart DSA Schedule with 180+ questions',
//               'College Studies + Project Management',
//               'AI/ML Learning Path Included'
//             ].map((feature, index) => (
//               <motion.div
//                 key={feature}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
//               >
//                 <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
//                 <span className="text-sm font-medium">{feature}</span>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
        
//         {/* Hero image/illustration */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="mt-16 relative"
//         >
//           <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
//             <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8">
//               {/* Mock timetable */}
//               <div className="bg-card rounded-xl p-6 shadow-lg">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <h3 className="font-bold text-lg">Your Smart Timetable</h3>
//                     <p className="text-sm text-muted-foreground">Week of Oct 27 - Nov 2</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <div className="w-3 h-3 rounded-full bg-green-500" />
//                     <div className="w-3 h-3 rounded-full bg-yellow-500" />
//                     <div className="w-3 h-3 rounded-full bg-red-500" />
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-7 gap-2 mb-4">
//                   {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
//                     <div key={day} className="text-center">
//                       <div className="text-xs font-medium text-muted-foreground">{day}</div>
//                       <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mt-1">
//                         <span className="text-sm">{27 + ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(day)}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="space-y-2">
//                   {[
//                     { time: '6:30-7:00', task: 'Wake Up + Plan', color: 'bg-blue-100 dark:bg-blue-900/30' },
//                     { time: '7:10-9:10', task: 'Bus: DSA Audio', color: 'bg-purple-100 dark:bg-purple-900/30' },
//                     { time: '9:30-4:45', task: 'College + DSA', color: 'bg-green-100 dark:bg-green-900/30' },
//                     { time: '9:00-10:30', task: 'DSA Problems', color: 'bg-red-100 dark:bg-red-900/30' },
//                   ].map((item, index) => (
//                     <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
//                       <div className={`w-3 h-3 rounded-full ${item.color}`} />
//                       <span className="text-sm font-medium">{item.time}</span>
//                       <span className="text-sm text-muted-foreground flex-1">{item.task}</span>
//                       <div className="w-4 h-4 rounded border border-border" />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Floating elements */}
//           <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-float" />
//           <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
//         </motion.div>
//       </div>
//     </section>
//   )
// }

















// 'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { ArrowRight, CheckCircle, Sparkles, ChevronLeft, ChevronRight, Zap, Target, Brain, Calendar, Clock, TrendingUp, BookOpen } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
// import Link from 'next/link'

// const timetableDesigns = [
//   {
//     id: 'academic',
//     title: 'Academic Focus',
//     icon: BookOpen,
//     color: 'from-blue-500/20 to-cyan-500/20',
//     borderColor: 'border-blue-200 dark:border-blue-700',
//     schedule: [
//       { time: '7:00-8:30', task: 'Morning Revision', type: 'Study', progress: 85 },
//       { time: '9:00-12:00', task: 'Core Subjects', type: 'Lecture', progress: 70 },
//       { time: '1:00-3:00', task: 'Lab Work', type: 'Practical', progress: 60 },
//       { time: '4:00-6:00', task: 'Self Study', type: 'Study', progress: 90 },
//       { time: '7:00-9:00', task: 'Project Work', type: 'Project', progress: 40 }
//     ]
//   },
//   {
//     id: 'dsa',
//     title: 'DSA Intensive',
//     icon: Brain,
//     color: 'from-purple-500/20 to-pink-500/20',
//     borderColor: 'border-purple-200 dark:border-purple-700',
//     schedule: [
//       { time: '6:30-8:30', task: 'Warm-up Problems', type: 'DSA', progress: 100 },
//       { time: '10:00-12:00', task: 'Algorithm Study', type: 'DSA', progress: 80 },
//       { time: '2:00-4:00', task: 'Problem Solving', type: 'DSA', progress: 65 },
//       { time: '5:00-7:00', task: 'Mock Interview', type: 'Practice', progress: 50 },
//       { time: '8:00-9:30', task: 'Revision & Notes', type: 'Review', progress: 95 }
//     ]
//   },
//   {
//     id: 'balanced',
//     title: 'Balanced Schedule',
//     icon: Target,
//     color: 'from-green-500/20 to-emerald-500/20',
//     borderColor: 'border-green-200 dark:border-green-700',
//     schedule: [
//       { time: '6:00-7:00', task: 'Exercise & Breakfast', type: 'Health', progress: 100 },
//       { time: '8:00-12:00', task: 'College Classes', type: 'Academic', progress: 75 },
//       { time: '2:00-4:00', task: 'DSA Practice', type: 'Coding', progress: 60 },
//       { time: '5:00-7:00', task: 'Personal Project', type: 'Project', progress: 45 },
//       { time: '8:00-9:00', task: 'Skill Development', type: 'Learning', progress: 85 }
//     ]
//   },
//   {
//     id: 'placement',
//     title: 'Placement Prep',
//     icon: Zap,
//     color: 'from-orange-500/20 to-red-500/20',
//     borderColor: 'border-orange-200 dark:border-orange-700',
//     schedule: [
//       { time: '7:00-9:00', task: 'Aptitude Practice', type: 'Test', progress: 70 },
//       { time: '10:00-1:00', task: 'Technical Subjects', type: 'Study', progress: 65 },
//       { time: '3:00-5:00', task: 'Communication Skills', type: 'Soft Skills', progress: 55 },
//       { time: '6:00-8:00', task: 'Company Research', type: 'Research', progress: 40 },
//       { time: '9:00-10:00', task: 'Daily Assessment', type: 'Review', progress: 90 }
//     ]
//   }
// ]

// export function HeroSection() {
//   const [currentDesign, setCurrentDesign] = useState(0)
//   const [isAnimating, setIsAnimating] = useState(false)

//   const nextDesign = () => {
//     if (isAnimating) return
//     setIsAnimating(true)
//     setCurrentDesign((prev) => (prev + 1) % timetableDesigns.length)
//     setTimeout(() => setIsAnimating(false), 500)
//   }

//   const prevDesign = () => {
//     if (isAnimating) return
//     setIsAnimating(true)
//     setCurrentDesign((prev) => (prev - 1 + timetableDesigns.length) % timetableDesigns.length)
//     setTimeout(() => setIsAnimating(false), 500)
//   }

//   const currentTimetable = timetableDesigns[currentDesign]

//   return (
//     <section className="relative overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8">
//       {/* Enhanced background effects */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
//       <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
//       <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
      
//       {/* Animated grid background */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="absolute inset-0" style={{
//           backgroundImage: `linear-gradient(to right, #8882 1px, transparent 1px),
//                           linear-gradient(to bottom, #8882 1px, transparent 1px)`,
//           backgroundSize: '40px 40px'
//         }} />
//       </div>

//       <div className="relative max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center max-w-4xl mx-auto"
//         >
//           {/* Enhanced Badge */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6 animate-slide-up"
//           >
//             <Sparkles className="w-4 h-4 text-accent" />
//             <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//               AI-Powered Student Productivity
//             </span>
//           </motion.div>
          
//           {/* Main heading with enhanced animation */}
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.1 }}
//             className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
//           >
//             <span className="block">Master Your Time,</span>
//             <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
//               Master Your Future
//             </span>
//           </motion.h1>
          
//           {/* Subheading */}
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.2 }}
//             className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
//           >
//             Chronify AI creates personalized timetables that balance DSA, college studies, projects, 
//             and life—helping you achieve placement goals with smart time management.
//           </motion.p>
          
//           {/* CTA Buttons */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.3 }}
//             className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
//           >
//             <Link href="/dashboard">
//               <Button size="lg" className="rounded-xl px-8 py-6 text-lg gap-2 group">
//                 <span>Create Your Timetable</span>
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </Link>
//             <Link href="/features">
//               <Button size="lg" variant="outline" className="rounded-xl px-8 py-6 text-lg">
//                 See How It Works
//               </Button>
//             </Link>
//           </motion.div>
          
//           {/* Features list with enhanced animations */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.4 }}
//             className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12"
//           >
//             {[
//               { text: 'Smart DSA Schedule with 180+ questions', icon: TrendingUp },
//               { text: 'College Studies + Project Management', icon: Calendar },
//               { text: 'Personalized AI Learning Path', icon: Brain }
//             ].map((feature, index) => (
//               <motion.div
//                 key={feature.text}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 whileHover={{ scale: 1.05, y: -5 }}
//                 className="flex items-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:shadow-lg"
//               >
//                 <div className="p-2 rounded-lg bg-primary/10">
//                   <feature.icon className="w-5 h-5 text-accent" />
//                 </div>
//                 <span className="text-sm font-medium">{feature.text}</span>
//               </motion.div>
//             ))}
//           </motion.div>
//         </motion.div>
        
//         {/* Interactive Timetable Showcase */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.5 }}
//           className="mt-16 relative"
//         >
//           {/* Design selector */}
//           <div className="flex flex-col items-center mb-8">
//             <h3 className="text-2xl font-bold mb-4 text-center">
//               Explore Different Timetable Styles
//             </h3>
            
//             <div className="flex items-center gap-4 mb-6">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={prevDesign}
//                 disabled={isAnimating}
//                 className="rounded-full"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
              
//               <div className="flex gap-2">
//                 {timetableDesigns.map((design, index) => (
//                   <button
//                     key={design.id}
//                     onClick={() => {
//                       if (!isAnimating) {
//                         setIsAnimating(true)
//                         setCurrentDesign(index)
//                         setTimeout(() => setIsAnimating(false), 500)
//                       }
//                     }}
//                     className={`relative px-4 py-2 rounded-full transition-all ${index === currentDesign 
//                       ? 'bg-primary text-primary-foreground shadow-lg' 
//                       : 'bg-secondary hover:bg-secondary/80'}`}
//                   >
//                     <span className="flex items-center gap-2 text-sm font-medium">
//                       <design.icon className="w-4 h-4" />
//                       {design.title}
//                     </span>
//                   </button>
//                 ))}
//               </div>
              
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={nextDesign}
//                 disabled={isAnimating}
//                 className="rounded-full"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
          
//           {/* Timetable Display */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentDesign}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//               className="relative"
//             >
//               <div className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}>
//                 <div className={`bg-gradient-to-r ${currentTimetable.color} p-8`}>
//                   {/* Timetable header */}
//                   <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
//                     <div className="flex items-center justify-between mb-8">
//                       <div className="flex items-center gap-3">
//                         <div className="p-3 rounded-lg bg-primary/10">
//                           <currentTimetable.icon className="w-6 h-6 text-primary" />
//                         </div>
//                         <div>
//                           <h3 className="font-bold text-xl">{currentTimetable.title}</h3>
//                           <p className="text-sm text-muted-foreground">
//                             Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
//                             {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className="text-right">
//                           <div className="text-sm font-medium">Productivity</div>
//                           <div className="text-2xl font-bold text-primary">92%</div>
//                         </div>
//                         <div className="relative w-12 h-12">
//                           <svg className="w-12 h-12 transform -rotate-90">
//                             <circle
//                               cx="24"
//                               cy="24"
//                               r="20"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                               className="text-secondary"
//                             />
//                             <circle
//                               cx="24"
//                               cy="24"
//                               r="20"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                               strokeDasharray="125.6"
//                               strokeDashoffset="10"
//                               className="text-accent"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Schedule days */}
//                     <div className="grid grid-cols-7 gap-2 mb-6">
//                       {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
//                         <motion.div
//                           key={day}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: index * 0.05 }}
//                           whileHover={{ scale: 1.1 }}
//                           className="text-center cursor-pointer"
//                         >
//                           <div className="text-xs font-medium text-muted-foreground mb-1">{day}</div>
//                           <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-all ${
//                             index === 2 
//                               ? 'bg-primary text-primary-foreground shadow-lg' 
//                               : 'bg-secondary hover:bg-secondary/80'
//                           }`}>
//                             <span className="text-sm font-medium">
//                               {new Date(Date.now() + index * 24 * 60 * 60 * 1000).getDate()}
//                             </span>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </div>
                    
//                     {/* Schedule items */}
//                     <div className="space-y-3">
//                       {currentTimetable.schedule.map((item, index) => (
//                         <motion.div
//                           key={index}
//                           initial={{ opacity: 0, x: -20 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.1 }}
//                           whileHover={{ x: 5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
//                           className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 backdrop-blur-sm hover:bg-secondary/70 transition-all group"
//                         >
//                           <div className="flex items-center gap-3 min-w-32">
//                             <Clock className="w-4 h-4 text-muted-foreground" />
//                             <span className="font-medium">{item.time}</span>
//                           </div>
//                           <div className="flex-1">
//                             <div className="font-medium mb-1">{item.task}</div>
//                             <div className="text-xs text-muted-foreground">{item.type}</div>
//                           </div>
//                           <div className="flex items-center gap-3">
//                             <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
//                               <motion.div
//                                 initial={{ width: 0 }}
//                                 animate={{ width: `${item.progress}%` }}
//                                 transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
//                                 className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
//                               />
//                             </div>
//                             <span className="text-sm font-medium min-w-10">{item.progress}%</span>
//                           </div>
//                           <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
//                             Start
//                           </Button>
//                         </motion.div>
//                       ))}
//                     </div>
                    
//                     {/* Stats footer */}
//                     <div className="mt-6 pt-6 border-t border-border">
//                       <div className="grid grid-cols-3 gap-4">
//                         <div className="text-center">
//                           <div className="text-2xl font-bold text-primary">6.5h</div>
//                           <div className="text-xs text-muted-foreground">Study Time</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-2xl font-bold text-accent">12</div>
//                           <div className="text-xs text-muted-foreground">Tasks Completed</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-2xl font-bold text-green-500">92%</div>
//                           <div className="text-xs text-muted-foreground">Focus Score</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Enhanced floating elements */}
//               <motion.div
//                 animate={{
//                   y: [0, -20, 0],
//                   rotate: [0, 5, 0],
//                 }}
//                 transition={{
//                   duration: 4,
//                   repeat: Infinity,
//                   ease: "easeInOut"
//                 }}
//                 className="absolute -top-6 -left-6 w-24 h-24 bg-accent/20 rounded-full blur-xl"
//               />
//               <motion.div
//                 animate={{
//                   y: [0, 20, 0],
//                   rotate: [0, -5, 0],
//                 }}
//                 transition={{
//                   duration: 5,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                   delay: 1
//                 }}
//                 className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-xl"
//               />
//             </motion.div>
//           </AnimatePresence>
          
//           {/* Design indicator */}
//           <div className="flex justify-center mt-8 gap-2">
//             {timetableDesigns.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   if (!isAnimating) {
//                     setIsAnimating(true)
//                     setCurrentDesign(index)
//                     setTimeout(() => setIsAnimating(false), 500)
//                   }
//                 }}
//                 className={`w-2 h-2 rounded-full transition-all ${index === currentDesign ? 'w-8 bg-primary' : 'bg-secondary hover:bg-primary/50'}`}
//               />
//             ))}
//           </div>
//         </motion.div>
//       </div>
      
//       {/* Add custom CSS for animations */}
//       <style jsx global>{`
//         @keyframes gradient {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
        
//         .animate-gradient {
//           animation: gradient 3s ease infinite;
//           background-size: 200% auto;
//         }
        
//         @keyframes pulse-glow {
//           0%, 100% { opacity: 0.5; }
//           50% { opacity: 0.8; }
//         }
        
//         .animate-pulse-glow {
//           animation: pulse-glow 4s ease-in-out infinite;
//         }
        
//         @keyframes slide-up {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-slide-up {
//           animation: slide-up 0.5s ease-out;
//         }
//       `}</style>
//     </section>
//   )
// }















'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Sparkles, ChevronLeft, ChevronRight, Zap, Target, Brain, Calendar, Clock, TrendingUp, BookOpen, Grid, List, Columns, Layout, Star, Timer, Bell, CheckSquare, PieChart, BarChart3, Activity, Target as TargetIcon, Award, School, Bus, Github, Coffee, Moon, Sun, Battery, Users, FileText, PenTool, Headphones, Video, Mic, Book, Laptop, GraduationCap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const timetableDesigns = [
  {
    id: 'college-style',
    title: 'College TimeTable',
    icon: School,
    color: 'from-blue-500/20 to-indigo-500/20',
    borderColor: 'border-blue-200 dark:border-blue-700',
    description: 'Official college timetable format with subject codes',
    type: 'academic',
    data: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      periods: [
        { time: '9:30-10:25', period: '1' },
        { time: '10:25-11:20', period: '2' },
        { time: '11:20-12:15', period: '3' },
        { time: '12:15-13:10', period: '4' },
        { time: '13:10-14:00', break: 'LUNCH' },
        { time: '14:00-14:55', period: '5' },
        { time: '14:55-15:50', period: '6' },
        { time: '15:50-16:45', period: '7' },
      ],
      schedule: [
        ['CGMS LAB', 'CPUCL', 'CPUCL LAB', 'CPUCL LAB', 'DCCN Lab'],
        ['SHS', 'AN', 'AN', 'AN', 'DCCN'],
        ['ADBMS', 'CGMS', 'ADBMS', 'ADBMS', 'Foreign Language'],
        ['SP', 'ITS', 'SP', 'SP', 'MOS'],
        ['SAP', 'ANK', '', '', 'STATISTICS'],
        ['GS', 'DCCN Lab', '', '', 'Software Eng'],
        ['', 'RJT', '', '', 'Self Study'],
      ]
    }
  },
  {
    id: 'weekly-schedule',
    title: 'Weekly Routine',
    icon: Calendar,
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-200 dark:border-purple-700',
    description: 'Complete weekly plan with morning, day, evening slots',
    type: 'routine',
    data: {
      days: ['Mon-Fri', 'Saturday', 'Sunday'],
      slots: [
        { time: '6:30-7:00', type: 'morning', icon: Sun },
        { time: '7:10-9:10', type: 'travel', icon: Bus },
        { time: '9:30-4:45', type: 'college', icon: School },
        { time: '5:10-7:30', type: 'travel', icon: Bus },
        { time: '8:15-9:00', type: 'break', icon: Coffee },
        { time: '9:00-10:30', type: 'study', icon: Book },
        { time: '10:30-10:45', type: 'break', icon: Coffee },
        { time: '10:45-11:45', type: 'study', icon: Laptop },
        { time: '11:45-12:00', type: 'learning', icon: Brain },
        { time: '12:00-12:30', type: 'wind-down', icon: Moon },
      ],
      activities: [
        [
          { task: 'Wake Up + Plan', emoji: '⏰' },
          { task: 'BUS: DSA Audio/Video', emoji: '🎧' },
          { task: 'COLLEGE\nFREE TIME = DSA / CODING', emoji: '💻' },
          { task: 'BUS: DSA Revision', emoji: '📱' },
          { task: 'DINNER & BREAK', emoji: '🍽️' },
          { task: 'DSA (Concepts + Problems)', emoji: '📚' },
          { task: 'SHORT BREAK', emoji: '☕' },
          { task: 'DSA Problems Solution', emoji: '✅' },
          { task: 'AI-ML Learning', emoji: '🤖' },
          { task: 'WIND DOWN + PLAN', emoji: '✨' },
        ],
        [
          { task: 'Wake Up + Exercise', emoji: '💪' },
          { task: '', emoji: '' },
          { task: 'DSA DEEP DIVE (4hrs)', emoji: '🔍' },
          { task: 'LUNCH BREAK', emoji: '🥗' },
          { task: '', emoji: '' },
          { task: 'PROJECT WORK', emoji: '🚀' },
          { task: 'DEEP DSA TIME', emoji: '⚡' },
          { task: 'DSA REVISION', emoji: '📖' },
          { task: 'PROJECT WORK', emoji: '🔧' },
          { task: 'WIND DOWN', emoji: '🌙' },
        ],
        [
          { task: 'Wake Up + Weekly Plan', emoji: '📅' },
          { task: '', emoji: '' },
          { task: 'DSA MOCK TESTS (4hrs)', emoji: '📝' },
          { task: 'LUNCH BREAK', emoji: '🥪' },
          { task: '', emoji: '' },
          { task: 'COLLEGE STUDIES', emoji: '🎓' },
          { task: 'PROJECT WORK', emoji: '💼' },
          { task: 'DSA New Sessions', emoji: '🆕' },
          { task: 'DSA WEAK TOPICS', emoji: '🎯' },
          { task: 'WIND DOWN', emoji: '😴' },
        ],
      ]
    }
  },
  {
    id: 'time-breakdown',
    title: 'Time Allocation',
    icon: PieChart,
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-200 dark:border-green-700',
    description: 'Weekly hour distribution across categories',
    type: 'analysis',
    data: {
      categories: [
        { name: 'DSA & CODING', hours: '32-35', percentage: 55, color: 'bg-blue-500', icon: Laptop },
        { name: 'COLLEGE STUDIES', hours: '10-12', percentage: 18, color: 'bg-green-500', icon: GraduationCap },
        { name: 'PROJECTS / AI-ML', hours: '8-10', percentage: 15, color: 'bg-purple-500', icon: Brain },
        { name: 'TRAVEL LEARNING', hours: '8-10', percentage: 12, color: 'bg-orange-500', icon: Bus },
      ],
      total: '60-67 hours',
      stats: [
        { label: 'Productivity Score', value: '92%', icon: TrendingUp },
        { label: 'Focus Hours', value: '42h', icon: Timer },
        { label: 'Consistency', value: '7/7', icon: CheckSquare },
      ]
    }
  },
  {
    id: 'kanban',
    title: 'Kanban Board',
    icon: Columns,
    color: 'from-orange-500/20 to-red-500/20',
    borderColor: 'border-orange-200 dark:border-orange-700',
    description: 'Drag-and-drop task management with progress tracking',
    type: 'productivity',
    data: {
      columns: [
        {
          title: 'To Do',
          color: 'bg-blue-100 dark:bg-blue-900/30',
          tasks: [
            { task: 'DSA Tree Problems', time: '2 hrs', priority: 'High', type: 'coding' },
            { task: 'DBMS Assignment', time: '1.5 hrs', priority: 'Medium', type: 'academic' },
          ]
        },
        {
          title: 'In Progress',
          color: 'bg-yellow-100 dark:bg-yellow-900/30',
          tasks: [
            { task: 'ML Project', time: '3 hrs', progress: 60, type: 'project' },
            { task: 'System Design', time: '2 hrs', progress: 40, type: 'coding' },
          ]
        },
        {
          title: 'Review',
          color: 'bg-purple-100 dark:bg-purple-900/30',
          tasks: [
            { task: 'OS Notes', time: '1 hr', progress: 100, type: 'academic' },
          ]
        },
        {
          title: 'Done',
          color: 'bg-green-100 dark:bg-green-900/30',
          tasks: [
            { task: 'LeetCode Daily', time: '1 hr', completed: true, type: 'coding' },
            { task: 'College Lectures', time: '4 hrs', completed: true, type: 'academic' },
          ]
        }
      ]
    }
  },
  {
    id: 'priority-matrix',
    title: 'Priority Matrix',
    icon: TargetIcon,
    color: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-200 dark:border-pink-700',
    description: 'Eisenhower Matrix for task prioritization',
    type: 'planning',
    data: {
      quadrants: [
        {
          title: 'Urgent & Important',
          color: 'from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40',
          tasks: [
            { task: 'Project Deadline', time: 'Today', emoji: '🔥' },
            { task: 'DSA Assessment', time: 'Tomorrow', emoji: '⚡' },
          ]
        },
        {
          title: 'Important Not Urgent',
          color: 'from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40',
          tasks: [
            { task: 'Long-term Projects', time: 'This Week', emoji: '🚀' },
            { task: 'Skill Building', time: 'Ongoing', emoji: '📈' },
          ]
        },
        {
          title: 'Urgent Not Important',
          color: 'from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40',
          tasks: [
            { task: 'Emails', time: 'Today', emoji: '📧' },
            { task: 'Meetings', time: 'Today', emoji: '👥' },
          ]
        },
        {
          title: 'Not Urgent Not Important',
          color: 'from-gray-100 to-gray-200 dark:from-gray-900/40 dark:to-gray-800/40',
          tasks: [
            { task: 'Social Media', time: 'Limit', emoji: '📱' },
            { task: 'Entertainment', time: 'Leisure', emoji: '🎬' },
          ]
        }
      ]
    }
  },
  {
    id: 'time-blocks',
    title: 'Time Blocks',
    icon: Timer,
    color: 'from-cyan-500/20 to-teal-500/20',
    borderColor: 'border-cyan-200 dark:border-cyan-700',
    description: 'Visual time blocking with hour-by-hour scheduling',
    type: 'scheduling',
    data: {
      blocks: [
        { time: '6:00-7:00', activity: 'Morning Routine', type: 'health', color: 'bg-blue-200 dark:bg-blue-800', duration: '1h' },
        { time: '7:00-9:00', activity: 'DSA Study Session', type: 'study', color: 'bg-purple-200 dark:bg-purple-800', duration: '2h' },
        { time: '9:00-12:00', activity: 'College Lectures', type: 'academic', color: 'bg-green-200 dark:bg-green-800', duration: '3h' },
        { time: '1:00-3:00', activity: 'Project Work', type: 'project', color: 'bg-orange-200 dark:bg-orange-800', duration: '2h' },
        { time: '3:00-5:00', activity: 'Skill Development', type: 'learning', color: 'bg-red-200 dark:bg-red-800', duration: '2h' },
        { time: '5:00-7:00', activity: 'Exercise & Break', type: 'health', color: 'bg-cyan-200 dark:bg-cyan-800', duration: '2h' },
        { time: '7:00-9:00', activity: 'Revision & Planning', type: 'review', color: 'bg-indigo-200 dark:bg-indigo-800', duration: '2h' },
      ]
    }
  },
  {
    id: 'circular-wheel',
    title: 'Time Wheel',
    icon: PieChart,
    color: 'from-violet-500/20 to-fuchsia-500/20',
    borderColor: 'border-violet-200 dark:border-violet-700',
    description: 'Circular visualization of time distribution',
    type: 'visualization',
    data: {
      categories: [
        { name: 'DSA Practice', value: 25, color: 'bg-purple-500', hours: 10 },
        { name: 'College Studies', value: 30, color: 'bg-blue-500', hours: 12 },
        { name: 'Projects', value: 20, color: 'bg-green-500', hours: 8 },
        { name: 'Skill Dev', value: 15, color: 'bg-orange-500', hours: 6 },
        { name: 'Health & Breaks', value: 10, color: 'bg-pink-500', hours: 4 },
      ],
      total: '40 hours'
    }
  }
]

export function HeroSection() {
  const [currentDesign, setCurrentDesign] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextDesign = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentDesign((prev) => (prev + 1) % timetableDesigns.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevDesign = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentDesign((prev) => (prev - 1 + timetableDesigns.length) % timetableDesigns.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const currentTimetable = timetableDesigns[currentDesign]

  return (
    <section className="relative overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
      
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #8882 1px, transparent 1px),
                          linear-gradient(to bottom, #8882 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Enhanced Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6 animate-slide-up"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI-Powered Student Productivity
            </span>
          </motion.div>
          
          {/* Main heading with enhanced animation */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="block">Master Your Time,</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Master Your Future
            </span>
          </motion.h1>
          
          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Chronify AI creates personalized timetables that balance DSA, college studies, projects, 
            and life—helping you achieve placement goals with smart time management.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/dashboard">
              <Button size="lg" className="rounded-xl px-8 py-6 text-lg gap-2 group">
                <span>Create Your Timetable</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline" className="rounded-xl px-8 py-6 text-lg">
                See How It Works
              </Button>
            </Link>
          </motion.div>
          
          {/* Features list with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12"
          >
            {[
              { text: '7 Different View Styles', icon: Layout },
              { text: 'College Timetable Import', icon: School },
              { text: 'Smart Priority Sorting', icon: TrendingUp }
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Interactive Timetable Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 relative"
        >
          {/* Design selector */}
          <div className="flex flex-col items-center mb-8">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Explore 7 Different Timetable Styles
            </h3>
            <p className="text-muted-foreground mb-6 text-center max-w-2xl">
              From college schedules to time wheels - find your perfect productivity view
            </p>
            
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prevDesign}
                disabled={isAnimating}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
                {timetableDesigns.map((design, index) => (
                  <motion.button
                    key={design.id}
                    onClick={() => {
                      if (!isAnimating) {
                        setIsAnimating(true)
                        setCurrentDesign(index)
                        setTimeout(() => setIsAnimating(false), 500)
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      index === currentDesign 
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20' 
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <design.icon className="w-4 h-4" />
                    <span className="text-sm font-medium whitespace-nowrap">{design.title}</span>
                  </motion.button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={nextDesign}
                disabled={isAnimating}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Timetable Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDesign}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Design 1: College Timetable */}
              {currentTimetable.id === 'college-style' && (
                <div className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}>
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <currentTimetable.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{currentTimetable.title}</h3>
                            <p className="text-sm text-muted-foreground">{currentTimetable.description}</p>
                          </div>
                        </div>
                        <div className="text-sm px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          Odd Semester 2025-26
                        </div>
                      </div>
                      
                      {/* College Timetable Grid */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="p-3 text-left text-sm font-medium text-muted-foreground">DAY</th>
                              <th className="p-3 text-left text-sm font-medium text-muted-foreground">TIME</th>
                              {currentTimetable.data.days.map((day, index) => (
                                <th key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                                  {day}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentTimetable.data.periods.map((period, periodIndex) => (
                              <motion.tr
                                key={periodIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: periodIndex * 0.05 }}
                                className="border-b border-gray-100 dark:border-gray-800"
                              >
                                {periodIndex === 0 && (
                                  <td rowSpan={currentTimetable.data.periods.length} className="p-3 align-top">
                                    <div className="text-center">
                                      <div className="font-bold text-lg">Week</div>
                                      <div className="text-sm text-muted-foreground">Schedule</div>
                                    </div>
                                  </td>
                                )}
                                <td className="p-3 whitespace-nowrap">
                                  <div className="text-sm font-medium">{period.time}</div>
                                  {period.period && (
                                    <div className="text-xs text-muted-foreground">Period {period.period}</div>
                                  )}
                                  {period.break && (
                                    <div className="text-xs text-red-500 font-medium">{period.break}</div>
                                  )}
                                </td>
                                {currentTimetable.data.days.map((day, dayIndex) => {
                                  const subject = currentTimetable.data.schedule[periodIndex]?.[dayIndex];
                                  return (
                                    <td key={dayIndex} className="p-3">
                                      {subject ? (
                                        <motion.div
                                          whileHover={{ scale: 1.02 }}
                                          className={`p-3 rounded-lg text-center cursor-pointer ${
                                            period.break 
                                              ? 'bg-red-50 dark:bg-red-900/20' 
                                              : 'bg-blue-50 dark:bg-blue-900/20'
                                          }`}
                                        >
                                          <div className="font-medium">{subject.split('\n')[0]}</div>
                                          {subject.includes('\n') && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                              {subject.split('\n')[1]}
                                            </div>
                                          )}
                                        </motion.div>
                                      ) : (
                                        <div className="p-3 text-sm text-muted-foreground text-center">-</div>
                                      )}
                                    </td>
                                  );
                                })}
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Subject Legend */}
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium mb-3">Subject Codes</h4>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { code: 'CGMS', name: 'Computer Graphics & Multimedia' },
                            { code: 'ADBMS', name: 'Advanced Database Management' },
                            { code: 'DCCN', name: 'Data Communication & Computer Networks' },
                            { code: 'CPUCL', name: 'Computer Programming Using C Language' },
                          ].map((subject, index) => (
                            <motion.div
                              key={subject.code}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm"
                            >
                              <span className="font-medium">{subject.code}</span>
                              <span className="text-muted-foreground ml-2">- {subject.name}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Design 2: Weekly Schedule */}
              {currentTimetable.id === 'weekly-schedule' && (
                <div className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}>
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <currentTimetable.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{currentTimetable.title}</h3>
                            <p className="text-sm text-muted-foreground">{currentTimetable.description}</p>
                          </div>
                        </div>
                        <div className="text-sm px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          Balanced Weekly Plan
                        </div>
                      </div>
                      
                      {/* Weekly Schedule Grid */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="p-3 text-left text-sm font-medium text-muted-foreground">TIME</th>
                              {currentTimetable.data.days.map((day, index) => (
                                <th key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                                  {day}
                                  {index > 0 && (
                                    <div className="text-xs font-normal mt-1">Weekend Focus</div>
                                  )}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentTimetable.data.slots.map((slot, slotIndex) => {
                              const SlotIcon = slot.icon;
                              return (
                                <motion.tr
                                  key={slotIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: slotIndex * 0.05 }}
                                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                  <td className="p-3">
                                    <div className="flex items-center gap-3">
                                      {SlotIcon && (
                                        <div className={`p-2 rounded-lg ${
                                          slot.type === 'morning' ? 'bg-yellow-100 dark:bg-yellow-900' :
                                          slot.type === 'travel' ? 'bg-blue-100 dark:bg-blue-900' :
                                          slot.type === 'college' ? 'bg-green-100 dark:bg-green-900' :
                                          slot.type === 'break' ? 'bg-gray-100 dark:bg-gray-900' :
                                          'bg-purple-100 dark:bg-purple-900'
                                        }`}>
                                          <SlotIcon className="w-4 h-4" />
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-medium">{slot.time}</div>
                                        <div className="text-xs text-muted-foreground capitalize">{slot.type}</div>
                                      </div>
                                    </div>
                                  </td>
                                  {currentTimetable.data.activities.map((dayActivities, dayIndex) => {
                                    const activity = dayActivities[slotIndex];
                                    return (
                                      <td key={dayIndex} className="p-3">
                                        {activity?.task ? (
                                          <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer"
                                          >
                                            <div className="flex items-start gap-2">
                                              <span className="text-xl">{activity.emoji}</span>
                                              <div>
                                                {activity.task.split('\n').map((line, i) => (
                                                  <div key={i} className={i > 0 ? 'text-xs text-muted-foreground mt-1' : 'font-medium'}>
                                                    {line}
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </motion.div>
                                        ) : (
                                          <div className="p-3 text-sm text-muted-foreground text-center">-</div>
                                        )}
                                      </td>
                                    );
                                  })}
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Weekly Goals */}
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { title: 'Weekdays Focus', desc: 'College + DSA Consistency', icon: School },
                            { title: 'Saturday Deep Dive', desc: '4hr DSA + Projects', icon: Brain },
                            { title: 'Sunday Review', desc: 'Mock Tests + Weak Topics', icon: TargetIcon },
                          ].map((goal, index) => (
                            <motion.div
                              key={goal.title}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <goal.icon className="w-5 h-5 text-primary" />
                                <h4 className="font-medium">{goal.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">{goal.desc}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Design 3: Time Breakdown */}
              {currentTimetable.id === 'time-breakdown' && (
                <div className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}>
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <currentTimetable.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{currentTimetable.title}</h3>
                            <p className="text-sm text-muted-foreground">{currentTimetable.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Total Weekly Hours</div>
                          <div className="text-2xl font-bold text-primary">{currentTimetable.data.total}</div>
                        </div>
                      </div>
                      
                      {/* Time Allocation Chart */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bar Chart */}
                        <div className="space-y-4">
                          <h4 className="font-medium">Weekly Time Distribution</h4>
                          {currentTimetable.data.categories.map((category, index) => {
                            const CategoryIcon = category.icon;
                            return (
                              <motion.div
                                key={category.name}
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: index * 0.1 }}
                                className="space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                                    <div className="flex items-center gap-2">
                                      <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                                      <span className="font-medium">{category.name}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold">{category.hours} hrs</div>
                                    <div className="text-sm text-muted-foreground">{category.percentage}%</div>
                                  </div>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${category.percentage}%` }}
                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                                    className={`h-full ${category.color} rounded-full`}
                                  />
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                        
                        {/* Stats and Priority */}
                        <div className="space-y-6">
                          {/* Stats */}
                          <div>
                            <h4 className="font-medium mb-4">Weekly Performance</h4>
                            <div className="grid grid-cols-3 gap-4">
                              {currentTimetable.data.stats.map((stat, index) => {
                                const StatIcon = stat.icon;
                                return (
                                  <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center"
                                  >
                                    <StatIcon className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Priority Order */}
                          <div>
                            <h4 className="font-medium mb-3">Priority Order</h4>
                            <div className="space-y-3">
                              {[
                                { priority: '1', task: 'DSA (55%)', desc: 'Core for placement interviews' },
                                { priority: '2', task: 'College Studies (18%)', desc: 'Maintain CGPA consistency' },
                                { priority: '3', task: 'Projects / AI-ML (15%)', desc: 'Build portfolio & experience' },
                                { priority: '4', task: 'Travel Learning (12%)', desc: 'Utilize commute time' },
                              ].map((item, index) => (
                                <motion.div
                                  key={item.priority}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50"
                                >
                                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                    {item.priority}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium">{item.task}</div>
                                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Key Notes */}
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10">
                          <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="w-5 h-5 text-accent" />
                            <h4 className="font-medium">Key Notes</h4>
                          </div>
                          <p className="text-sm">
                            "Consistency beats intensity. 1 hour DSA daily {'>'} 5 hours in one day."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Design 4: Kanban Board */}
              {currentTimetable.id === 'kanban' && (
                <div className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}>
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <currentTimetable.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{currentTimetable.title}</h3>
                            <p className="text-sm text-muted-foreground">{currentTimetable.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="animate-pulse">●</span>
                          <span>Drag tasks between columns</span>
                        </div>
                      </div>
                      
                      {/* Kanban Board */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {currentTimetable.data.columns.map((column, colIndex) => (
                          <motion.div
                            key={column.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: colIndex * 0.1 }}
                            className={`${column.color} rounded-xl p-4 min-h-[300px]`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-bold text-lg">{column.title}</h4>
                              <span className="text-sm bg-white/50 dark:bg-black/50 px-2 py-1 rounded-full">
                                {column.tasks.length} tasks
                              </span>
                            </div>
                            <div className="space-y-3">
                              {column.tasks.map((task, taskIndex) => (
                                <motion.div
                                  key={`${task.task}-${taskIndex}`}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: colIndex * 0.1 + taskIndex * 0.05 }}
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  drag
                                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                  className="bg-white/80 dark:bg-black/50 p-3 rounded-lg shadow-sm cursor-move active:cursor-grabbing"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <span className="font-medium">{task.task}</span>
                                    {task.completed && (
                                      <CheckSquare className="w-4 h-4 text-green-500" />
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{task.time}</span>
                                    {task.priority && (
                                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                                        task.priority === 'High' 
                                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                      }`}>
                                        {task.priority}
                                      </span>
                                    )}
                                    {task.progress && (
                                      <div className="flex items-center gap-1">
                                        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${task.progress}%` }}
                                          />
                                        </div>
                                        <span className="text-xs">{task.progress}%</span>
                                      </div>
                                    )}
                                  </div>
                                  {task.type && (
                                    <div className="mt-2 text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 w-fit">
                                      {task.type}
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Board Stats */}
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="text-sm text-muted-foreground">
                            Total: 7 tasks across 4 columns
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500" />
                              <span className="text-sm">To Do</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-500" />
                              <span className="text-sm">In Progress</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500" />
                              <span className="text-sm">Completed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Design 5: Priority Matrix */}
              {currentTimetable.id === 'priority-matrix' && (
                <div className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}>
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <currentTimetable.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{currentTimetable.title}</h3>
                            <p className="text-sm text-muted-foreground">{currentTimetable.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Eisenhower Matrix</div>
                          <div className="text-2xl font-bold text-accent">Priority Score: 8.7</div>
                        </div>
                      </div>
                      
                      {/* Priority Matrix Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {currentTimetable.data.quadrants.map((quadrant, index) => (
                          <motion.div
                            key={quadrant.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`bg-gradient-to-br ${quadrant.color} rounded-xl p-5 min-h-[180px]`}
                          >
                            <h4 className="font-bold text-lg mb-4">{quadrant.title}</h4>
                            <div className="space-y-3">
                              {quadrant.tasks.map((task, taskIndex) => (
                                <motion.div
                                  key={task.task}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 + taskIndex * 0.1 }}
                                  className="flex items-center justify-between p-3 bg-white/70 dark:bg-black/50 rounded-lg"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{task.emoji}</span>
                                    <span className="font-medium">{task.task}</span>
                                  </div>
                                  <span className="text-sm px-2 py-1 rounded-full bg-white dark:bg-black">
                                    {task.time}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Matrix Legend */}
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { color: 'bg-red-500', title: 'Do First', desc: 'Urgent & important tasks' },
                            { color: 'bg-green-500', title: 'Schedule', desc: 'Important but not urgent' },
                            { color: 'bg-yellow-500', title: 'Delegate', desc: 'Urgent but not important' },
                            { color: 'bg-gray-500', title: 'Eliminate', desc: 'Not urgent or important' },
                          ].map((item, index) => (
                            <div key={item.title} className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full ${item.color}`} />
                              <div>
                                <div className="font-medium text-sm">{item.title}</div>
                                <div className="text-xs text-muted-foreground">{item.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Design 6: Time Blocks */}
              {currentTimetable.id === 'time-blocks' && (
                <div className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}>
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <currentTimetable.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{currentTimetable.title}</h3>
                            <p className="text-sm text-muted-foreground">{currentTimetable.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Daily Focus Time</div>
                          <div className="text-2xl font-bold text-primary">8.5 hours</div>
                        </div>
                      </div>
                      
                      {/* Time Blocks */}
                      <div className="space-y-4">
                        {currentTimetable.data.blocks.map((block, index) => (
                          <motion.div
                            key={block.time}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4"
                          >
                            <div className="w-24">
                              <div className="text-sm font-medium">{block.time}</div>
                              <div className="text-xs text-muted-foreground">{block.duration}</div>
                            </div>
                            <div className="flex-1">
                              <div className={`${block.color} rounded-xl p-4 transition-all hover:shadow-md`}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-bold text-lg mb-1">{block.activity}</h4>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-muted-foreground capitalize">{block.type}</span>
                                      <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                                      <span className="text-sm">{block.duration}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" className="rounded-full">
                                      Start
                                    </Button>
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Daily Stats */}
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Study Hours', value: '6.5h', icon: BookOpen },
                            { label: 'Focus Time', value: '5.2h', icon: Timer },
                            { label: 'Breaks Taken', value: '4', icon: Coffee },
                            { label: 'Productivity', value: '92%', icon: TrendingUp },
                          ].map((stat, index) => (
                            <motion.div
                              key={stat.label}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center"
                            >
                              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                              <div className="text-xl font-bold">{stat.value}</div>
                              <div className="text-xs text-muted-foreground">{stat.label}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Design 7: Circular Time Wheel */}
              {currentTimetable.id === 'circular-wheel' && (
                <div className={`rounded-2xl overflow-hidden border-2 ${currentTimetable.borderColor} shadow-2xl shadow-primary/10`}>
                  <div className={`bg-gradient-to-r ${currentTimetable.color} p-6`}>
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <currentTimetable.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{currentTimetable.title}</h3>
                            <p className="text-sm text-muted-foreground">{currentTimetable.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Weekly Total</div>
                          <div className="text-2xl font-bold text-primary">{currentTimetable.data.total}</div>
                        </div>
                      </div>
                      
                      {/* Circular Chart */}
                      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        {/* Pie Chart */}
                        <div className="relative w-64 h-64">
                          <svg className="w-full h-full transform -rotate-90">
                            {currentTimetable.data.categories.reduce((acc, category, index, arr) => {
                              const prevValue = acc.prev;
                              const newValue = prevValue + category.value;
                              
                              const angle = (newValue / 100) * 360;
                              const prevAngle = (prevValue / 100) * 360;
                              
                              const largeArc = category.value > 50 ? 1 : 0;
                              
                              const x1 = 128 + 100 * Math.cos((prevAngle * Math.PI) / 180);
                              const y1 = 128 + 100 * Math.sin((prevAngle * Math.PI) / 180);
                              const x2 = 128 + 100 * Math.cos((angle * Math.PI) / 180);
                              const y2 = 128 + 100 * Math.sin((angle * Math.PI) / 180);
                              
                              acc.paths.push(
                                <motion.path
                                  key={category.name}
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 1, delay: index * 0.2 }}
                                  d={`M 128 128 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                  fill={category.color}
                                  className="opacity-80 hover:opacity-100 transition-opacity"
                                />
                              );
                              
                              acc.prev = newValue;
                              return acc;
                            }, { prev: 0, paths: [] }).paths}
                            
                            {/* Center circle */}
                            <circle cx="128" cy="128" r="50" fill="white" className="dark:bg-gray-900" />
                            <text x="128" y="128" textAnchor="middle" dy=".3em" className="text-2xl font-bold">
                              {currentTimetable.data.total}
                            </text>
                          </svg>
                        </div>
                        
                        {/* Category Details */}
                        <div className="flex-1 space-y-4">
                          {currentTimetable.data.categories.map((category, index) => (
                            <motion.div
                              key={category.name}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ x: 5 }}
                              className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
                            >
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                />
                                <div>
                                  <div className="font-medium">{category.name}</div>
                                  <div className="text-sm text-muted-foreground">{category.hours} hours/week</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold">{category.value}%</div>
                                <div className="text-sm text-muted-foreground">of time</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Balance Indicator */}
                      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10">
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-accent" />
                          <div>
                            <div className="font-medium">Optimal Balance Achieved</div>
                            <div className="text-sm text-muted-foreground">
                              Your time distribution aligns perfectly with placement preparation goals
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Floating elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-6 -left-6 w-24 h-24 bg-accent/20 rounded-full blur-xl"
              />
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-xl"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Design indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {timetableDesigns.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true)
                    setCurrentDesign(index)
                    setTimeout(() => setIsAnimating(false), 500)
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${index === currentDesign ? 'w-8 bg-primary' : 'bg-gray-300 dark:bg-gray-700 hover:bg-primary/50'}`}
              />
            ))}
          </div>
          
          {/* View All Designs Link */}
          <div className="text-center mt-6">
            <Link href="/templates">
              <Button variant="link" className="gap-2">
                View All 7 Design Templates
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Add custom CSS for animations */}
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
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </section>
  )
}