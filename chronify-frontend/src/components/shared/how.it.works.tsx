// 'use client'

// import { motion } from 'framer-motion'
// import { Target, Calendar, CheckCircle, TrendingUp, UserPlus, Settings } from 'lucide-react'

// export function HowItWorks() {
//   const steps = [
//     {
//       step: '01',
//       icon: Target,
//       title: 'Set Your Goals',
//       description: 'Define priorities: DSA (High), College (Medium), Projects (Low) with deadlines',
//       color: 'from-blue-500 to-cyan-500'
//     },
//     {
//       step: '02',
//       icon: UserPlus,
//       title: 'Add Constraints',
//       description: 'Input college schedule, commute time, free periods, and personal commitments',
//       color: 'from-purple-500 to-pink-500'
//     },
//     {
//       step: '03',
//       icon: Settings,
//       title: 'AI Creates Timetable',
//       description: 'Our AI generates optimized weekly schedule balancing all priorities',
//       color: 'from-green-500 to-emerald-500'
//     },
//     {
//       step: '04',
//       icon: Calendar,
//       title: 'Follow & Track',
//       description: 'Use daily checkboxes to mark completion and track progress in real-time',
//       color: 'from-orange-500 to-red-500'
//     },
//     {
//       step: '05',
//       icon: CheckCircle,
//       title: 'Weekly Review',
//       description: 'Get insights on completion rates and adjust schedule as needed',
//       color: 'from-indigo-500 to-purple-500'
//     },
//     {
//       step: '06',
//       icon: TrendingUp,
//       title: 'Achieve Targets',
//       description: 'Reach your DSA, college, and project goals with consistent progress',
//       color: 'from-cyan-500 to-blue-500'
//     },
//   ]

//   return (
//     <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/10">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">
//             How Chronify AI
//             <span className="block gradient-text">Works for You</span>
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//             Six simple steps from goal setting to achievement. Perfect for MCA students balancing DSA, college, and projects.
//           </p>
//         </motion.div>

//         <div className="relative">
//           {/* Connecting line */}
//           <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary hidden md:block" />
          
//           <div className="space-y-8">
//             {steps.map((step, index) => (
//               <motion.div
//                 key={step.step}
//                 initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 className={`flex flex-col md:flex-row items-start gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
//               >
//                 {/* Step number and icon */}
//                 <div className="relative">
//                   <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20 blur-xl rounded-full`} />
//                   <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}>
//                     <step.icon className="w-8 h-8 text-white" />
//                     <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
//                       <span className="text-xs font-bold">{step.step}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div className={`flex-1 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
//                   <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all">
//                     <h3 className="text-xl font-bold mb-2">{step.title}</h3>
//                     <p className="text-muted-foreground">{step.description}</p>
                    
//                     {/* Example content based on step */}
//                     {index === 0 && (
//                       <div className="mt-4 space-y-2">
//                         <div className="flex items-center justify-between text-sm">
//                           <span>DSA (High Priority)</span>
//                           <span className="text-green-500 font-medium">3 months</span>
//                         </div>
//                         <div className="flex items-center justify-between text-sm">
//                           <span>College Studies (Medium)</span>
//                           <span className="text-yellow-500 font-medium">6 months</span>
//                         </div>
//                         <div className="flex items-center justify-between text-sm">
//                           <span>Projects (Low Priority)</span>
//                           <span className="text-gray-500 font-medium">Flexible</span>
//                         </div>
//                       </div>
//                     )}
                    
//                     {index === 2 && (
//                       <div className="mt-4 p-3 rounded-lg bg-secondary/30">
//                         <div className="text-sm font-medium">AI-generated Schedule:</div>
//                         <div className="text-xs text-muted-foreground mt-1">
//                           • Mon-Fri: College + DSA in free periods<br />
//                           • Weekends: Deep DSA sessions<br />
//                           • Evenings: Project work<br />
//                           • Commute: DSA audio learning
//                         </div>
//                       </div>
//                     )}
                    
//                     {index === 3 && (
//                       <div className="mt-4 flex items-center gap-4">
//                         {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
//                           <div key={day} className="text-center">
//                             <div className="text-xs mb-1">{day}</div>
//                             <div className={`w-6 h-6 rounded border ${Math.random() > 0.3 ? 'border-green-500 bg-green-500/20' : 'border-border'} 
//                               flex items-center justify-center`}>
//                               {Math.random() > 0.3 ? '✓' : ''}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }


















'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, 
  Calendar, 
  CheckCircle, 
  TrendingUp, 
  UserPlus, 
  Settings,
  ArrowRight,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  SkipBack
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    {
      step: '01',
      icon: Target,
      title: 'Define Your Goals',
      description: 'Set clear academic targets with deadlines and priority levels for DSA, college, and projects.',
      details: [
        'DSA: 180+ questions in 3 months',
        'College: Maintain 8.5+ CGPA',
        'Projects: Build 2 major projects',
        'Skills: Learn AI/ML basics'
      ]
    },
    {
      step: '02',
      icon: Calendar,
      title: 'Sync Your Schedule',
      description: 'Upload college timetable and mark personal commitments for accurate scheduling.',
      details: [
        'Upload timetable (PDF/Image)',
        'Set commute time and mode',
        'Mark personal time blocks',
        'Define study preferences'
      ]
    },
    {
      step: '03',
      icon: Settings,
      title: 'AI Generates Plan',
      description: 'Our AI creates an optimized weekly schedule balancing all your priorities intelligently.',
      details: [
        'Balances DSA, college, project work',
        'Optimizes commute time usage',
        'Includes buffer time for flexibility',
        'Schedules weekly review sessions'
      ]
    },
    {
      step: '04',
      icon: CheckCircle,
      title: 'Track Daily Progress',
      description: 'Use checkboxes and time tracking to monitor completion and maintain consistency.',
      details: [
        'Daily task completion checkboxes',
        'Focus timer with Pomodoro',
        'Automatic time logging',
        'Distraction-free sessions'
      ]
    },
    {
      step: '05',
      icon: TrendingUp,
      title: 'Review Analytics',
      description: 'Get weekly insights on performance metrics and receive improvement suggestions.',
      details: [
        'Time distribution analytics',
        'Goal achievement rates',
        'Productivity trend analysis',
        'AI-powered recommendations'
      ]
    },
    {
      step: '06',
      icon: UserPlus,
      title: 'Achieve Success',
      description: 'Reach academic targets and scale up to new challenges with continuous optimization.',
      details: [
        'Automated difficulty progression',
        'Performance-based challenges',
        'Peer comparison benchmarks',
        'Achievement certifications'
      ]
    },
  ]

  const handlePlay = () => {
    setIsPlaying(true)
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev === steps.length - 1) {
          clearInterval(interval)
          setIsPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, 3000)
    
    return () => clearInterval(interval)
  }

  const handleStepClick = (index: number) => {
    setActiveStep(index)
    setIsPlaying(false)
  }

  const handleNext = () => {
    setActiveStep(prev => prev === steps.length - 1 ? 0 : prev + 1)
    setIsPlaying(false)
  }

  const handlePrev = () => {
    setActiveStep(prev => prev === 0 ? steps.length - 1 : prev - 1)
    setIsPlaying(false)
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How Chronify Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple six-step process to transform your academic routine into a productivity powerhouse.
          </p>
        </motion.div>

        {/* Steps Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {steps.map((step, index) => (
              <button
                key={step.step}
                onClick={() => handleStepClick(index)}
                className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                  activeStep === index
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <step.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{step.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-full h-10 w-10"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (isPlaying) {
                  setIsPlaying(false)
                } else {
                  handlePlay()
                }
              }}
              className="rounded-full h-10 w-10"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full h-10 w-10"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleStepClick(index)}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${
                  activeStep === index
                    ? 'border-primary/30 bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                    activeStep === index ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">{step.step}</span>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      {activeStep === index && (
                        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                          Active
                        </span>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{step.description}</p>
                    
                    <div className="space-y-2">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <ChevronRight className="w-3 h-3 text-muted-foreground" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Visualization */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-card border rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-lg ${
                  activeStep === 0 ? 'bg-blue-500/10 text-blue-600' :
                  activeStep === 1 ? 'bg-purple-500/10 text-purple-600' :
                  activeStep === 2 ? 'bg-green-500/10 text-green-600' :
                  activeStep === 3 ? 'bg-orange-500/10 text-orange-600' :
                  activeStep === 4 ? 'bg-indigo-500/10 text-indigo-600' :
                  'bg-cyan-500/10 text-cyan-600'
                }`}>
                  {React.createElement(steps[activeStep].icon, { className: "w-6 h-6" })}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Step {steps[activeStep].step}</div>
                  <h3 className="text-xl font-semibold">{steps[activeStep].title}</h3>
                </div>
              </div>

              {/* Visualizations */}
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="goals"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                      {[
                        { label: 'DSA Mastery', progress: 65, priority: 'High' },
                        { label: 'College Studies', progress: 80, priority: 'Medium' },
                        { label: 'Project Work', progress: 45, priority: 'Low' },
                        { label: 'Skill Development', progress: 30, priority: 'Flexible' },
                      ].map((item, index) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.label}</span>
                            <span className="text-muted-foreground">{item.priority}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-full rounded-full ${
                                item.priority === 'High' ? 'bg-blue-500' :
                                item.priority === 'Medium' ? 'bg-green-500' :
                                'bg-muted-foreground'
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="schedule"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center p-2 rounded bg-muted">
                          <div className="text-sm font-medium">{day}</div>
                          <div className="text-xs text-muted-foreground">Classes</div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span>College Hours</span>
                        <span>9:30 AM - 4:45 PM</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span>Commute Time</span>
                        <span>2 hours daily</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span>Personal Time</span>
                        <span>Evenings & Weekends</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="ai-schedule"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="space-y-3">
                      {[
                        { time: '6:30-7:00', task: 'Morning Routine', type: 'Personal' },
                        { time: '7:10-9:10', task: 'Commute: DSA Audio', type: 'DSA' },
                        { time: '9:30-4:45', task: 'College + DSA Breaks', type: 'Mixed' },
                        { time: '5:10-7:30', task: 'Commute: Revision', type: 'DSA' },
                        { time: '9:00-10:30', task: 'DSA Problem Solving', type: 'DSA' },
                      ].map((item, index) => (
                        <motion.div
                          key={item.time}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-lg border"
                        >
                          <div className="w-16 text-sm font-medium">{item.time}</div>
                          <div className="flex-1">
                            <div className="font-medium">{item.task}</div>
                            <div className="text-xs text-muted-foreground">{item.type}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    key="tracking"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Today's Progress</span>
                        <span className="font-semibold text-primary">6/8 tasks</span>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2">
                        {['M', 'T', 'W', 'T', 'F'].map((day, index) => (
                          <div key={day} className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">{day}</div>
                            <div className={`h-8 w-8 rounded flex items-center justify-center mx-auto ${
                              index < 3 ? 'bg-green-500/20 text-green-600 border border-green-500/30' :
                              'bg-muted text-muted-foreground border border-border'
                            }`}>
                              {index < 3 ? '✓' : index === 3 ? '5' : '4'}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        {[
                          { task: 'DSA Problems', completed: true },
                          { task: 'College Notes', completed: true },
                          { task: 'Project Work', completed: false },
                          { task: 'Skill Learning', completed: true },
                        ].map((item, index) => (
                          <div key={item.task} className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              item.completed 
                                ? 'border-green-500 bg-green-500/10' 
                                : 'border-border'
                            }`}>
                              {item.completed && '✓'}
                            </div>
                            <span className="text-sm">{item.task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 4 && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { label: 'DSA Time', value: '18.5h', change: '+12%' },
                        { label: 'College Focus', value: '12h', change: '+8%' },
                        { label: 'Productivity', value: '92%', change: '+5%' },
                        { label: 'Consistency', value: '85%', change: '+15%' },
                      ].map((stat, index) => (
                        <div key={stat.label} className="p-3 rounded-lg border text-center">
                          <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                          <div className="text-lg font-semibold">{stat.value}</div>
                          <div className="text-xs text-green-600">{stat.change} ↑</div>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Based on last week's performance, AI suggests increasing DSA practice time by 15%.
                    </div>
                  </motion.div>
                )}

                {activeStep === 5 && (
                  <motion.div
                    key="achievement"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">Target Achieved!</div>
                            <div className="text-sm text-muted-foreground">Completed 180 DSA questions in 12 weeks</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Next Goal', value: 'System Design' },
                          { label: 'Time Frame', value: '6 weeks' },
                          { label: 'Current Rank', value: 'Top 15%' },
                          { label: 'Next Level', value: 'Advanced DSA' },
                        ].map((item, index) => (
                          <div key={item.label} className="p-3 rounded border">
                            <div className="text-xs text-muted-foreground">{item.label}</div>
                            <div className="font-medium">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Indicator */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span>Step {activeStep + 1} of {steps.length}</span>
                  <div className="flex items-center gap-1">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === activeStep 
                            ? 'bg-primary' 
                            : index < activeStep 
                              ? 'bg-primary/30' 
                              : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-center"
            >
              <Button className="w-full rounded-lg py-6 text-base gap-2">
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Join 10,000+ students who have improved their productivity with Chronify
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}