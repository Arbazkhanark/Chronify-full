// 'use client'

// import { Calendar, Target, TrendingUp, Brain, Clock, BarChart3 } from 'lucide-react'
// import { motion } from 'framer-motion'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// export function FeaturesSection() {
//   const features = [
//     {
//       icon: Calendar,
//       title: 'Smart Timetable Builder',
//       description: 'AI creates personalized schedules balancing DSA, college, projects, and rest',
//       color: 'from-blue-500 to-cyan-500'
//     },
//     {
//       icon: Target,
//       title: 'Goal-Based Planning',
//       description: 'Set targets like "180 DSA questions in 3 months" and track progress',
//       color: 'from-purple-500 to-pink-500'
//     },
//     {
//       icon: TrendingUp,
//       title: 'Progress Tracking',
//       description: 'Daily checkboxes and analytics to monitor consistency and improvement',
//       color: 'from-green-500 to-emerald-500'
//     },
//     {
//       icon: Brain,
//       title: 'Priority Management',
//       description: 'Automatic priority sorting (High: DSA, Medium: College, Low: Projects)',
//       color: 'from-orange-500 to-red-500'
//     },
//     {
//       icon: Clock,
//       title: 'Time Slot Optimization',
//       description: 'Uses commute time, free periods, and weekends efficiently',
//       color: 'from-indigo-500 to-purple-500'
//     },
//     {
//       icon: BarChart3,
//       title: 'Performance Analytics',
//       description: 'Weekly reports showing time distribution and achievement rates',
//       color: 'from-cyan-500 to-blue-500'
//     },
//   ]

//   return (
//     <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">
//             Everything You Need to
//             <span className="block gradient-text">Excel Academically</span>
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//             From DSA prep to college grades, Chronify AI handles the planning so you can focus on execution.
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {features.map((feature, index) => (
//             <motion.div
//               key={feature.title}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//             >
//               <Card className="h-full border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
//                 <CardHeader>
//                   <div className="relative">
//                     <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 blur-xl rounded-full`} />
//                     <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
//                       <feature.icon className="w-7 h-7 text-white" />
//                     </div>
//                   </div>
//                   <CardTitle className="text-xl">{feature.title}</CardTitle>
//                   <CardDescription className="text-base">
//                     {feature.description}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <span className="h-1 w-1 rounded-full bg-accent" />
//                     <span>Click to explore</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>

//         {/* Stats */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border"
//         >
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {[
//               { value: '95%', label: 'Completion Rate' },
//               { value: '180+', label: 'DSA Questions' },
//               { value: '55%', label: 'Time on DSA' },
//               { value: '24/7', label: 'AI Assistant' },
//             ].map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
//                 <div className="text-sm text-muted-foreground">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }























'use client'

import { useState } from 'react'
import { Calendar, Target, TrendingUp, Brain, Clock, BarChart3, Sparkles, Zap, Users, Award, Rocket, Shield, Globe, Cpu, PieChart, Bell, CheckCircle, Star, ArrowRight, LineChart, Target as TargetIcon, BookOpen, Laptop, Timer, BrainCircuit, Database, Code, Cloud, Server, Smartphone, Tablet } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)
  
  const features = [
    {
      icon: Calendar,
      title: 'Smart Timetable Builder',
      description: 'AI creates personalized schedules balancing DSA, college, projects, and rest',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      details: [
        'AI-powered schedule generation',
        'Balances DSA, academics, and personal life',
        'Adapts to your college timetable',
        'Includes travel time optimization'
      ],
      stats: { timeSaved: '10+ hours/week', accuracy: '95%' }
    },
    {
      icon: TargetIcon,
      title: 'Goal-Based Planning',
      description: 'Set targets like "180 DSA questions in 3 months" and track progress',
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      details: [
        'Smart goal setting with milestones',
        'Progress tracking with analytics',
        'Adaptive planning based on performance',
        'Weekly goal adjustments'
      ],
      stats: { achievement: '92% success rate', users: '10K+' }
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Daily checkboxes and analytics to monitor consistency and improvement',
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      details: [
        'Real-time progress dashboard',
        'Consistency streak tracking',
        'Performance heatmaps',
        'Weekly improvement reports'
      ],
      stats: { consistency: '85% avg', improvement: '+40%' }
    },
    {
      icon: BrainCircuit,
      title: 'Priority Management',
      description: 'Automatic priority sorting (High: DSA, Medium: College, Low: Projects)',
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      details: [
        'AI-powered priority detection',
        'Dynamic priority adjustments',
        'Urgent vs Important matrix',
        'Time allocation optimization'
      ],
      stats: { efficiency: '88% better', focus: '3.5x increase' }
    },
    {
      icon: Timer,
      title: 'Time Slot Optimization',
      description: 'Uses commute time, free periods, and weekends efficiently',
      color: 'from-indigo-500 to-purple-500',
      gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      details: [
        'Micro-learning during commute',
        'Smart break scheduling',
        'Peak productivity detection',
        'Time blocking techniques'
      ],
      stats: { utilization: '94% optimal', productivity: '+50%' }
    },
    {
      icon: LineChart,
      title: 'Performance Analytics',
      description: 'Weekly reports showing time distribution and achievement rates',
      color: 'from-cyan-500 to-blue-500',
      gradient: 'bg-gradient-to-br from-cyan-500 to-blue-500',
      details: [
        'Comprehensive analytics dashboard',
        'Custom report generation',
        'Predictive performance insights',
        'Comparative analysis'
      ],
      stats: { insights: '100+ metrics', accuracy: '97%' }
    },
    {
      icon: BookOpen,
      title: 'DSA Roadmap Integration',
      description: 'Complete DSA learning path with company-specific question banks',
      color: 'from-violet-500 to-fuchsia-500',
      gradient: 'bg-gradient-to-br from-violet-500 to-fuchsia-500',
      details: [
        '180+ curated DSA problems',
        'Company-specific preparation',
        'Difficulty progression tracking',
        'Mock interview simulations'
      ],
      stats: { placement: '85% success', questions: '180+' }
    },
    {
      icon: Laptop,
      title: 'Multi-Device Sync',
      description: 'Access your schedule across all devices with real-time sync',
      color: 'from-amber-500 to-yellow-500',
      gradient: 'bg-gradient-to-br from-amber-500 to-yellow-500',
      details: [
        'Cross-platform compatibility',
        'Real-time synchronization',
        'Offline mode support',
        'Cloud backup & restore'
      ],
      stats: { devices: 'Unlimited', sync: 'Instant' }
    }
  ]

  const platforms = [
    { icon: Smartphone, name: 'Mobile', color: 'text-blue-500' },
    { icon: Tablet, name: 'Tablet', color: 'text-green-500' },
    { icon: Laptop, name: 'Desktop', color: 'text-purple-500' },
  ]

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Professional Productivity Suite
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="block">Advanced Features for</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Academic Excellence
            </span>
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            From intelligent scheduling to detailed analytics, Chronify AI provides everything you need to 
            master time management and achieve your placement goals.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <Card className="h-full border-2 border-transparent hover:border-primary/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className={`absolute inset-0 ${feature.gradient} opacity-20 blur-xl rounded-full`} />
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`relative w-16 h-16 rounded-xl ${feature.gradient} flex items-center justify-center mb-4 shadow-lg shadow-primary/20`}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </motion.div>
                    </div>
                    <motion.div
                      animate={activeFeature === index ? { rotate: 180 } : { rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </div>
                  
                  <CardTitle className="text-xl font-bold mb-3 flex items-center gap-2">
                    {feature.title}
                    {index < 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        Popular
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <AnimatePresence>
                    {activeFeature === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 mt-4"
                      >
                        <div className="space-y-2">
                          {feature.details.slice(0, 2).map((detail, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <div className="w-1 h-1 rounded-full bg-accent" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-border/50">
                          {Object.entries(feature.stats).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                {value}
                              </div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {activeFeature !== index && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                      <span className="h-1 w-1 rounded-full bg-accent animate-pulse" />
                      <span>Hover for details</span>
                    </div>
                  )}
                </CardContent>
                
                {/* Animated border effect */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Interactive demo */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-accent" />
                    Interactive Analytics Dashboard
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Progress bars */}
                    <div className="space-y-4">
                      {[
                        { label: 'DSA Progress', value: 78, color: 'bg-blue-500' },
                        { label: 'College Studies', value: 65, color: 'bg-green-500' },
                        { label: 'Project Work', value: 45, color: 'bg-purple-500' },
                        { label: 'Skill Development', value: 85, color: 'bg-orange-500' },
                      ].map((item, index) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.label}</span>
                            <span className="font-bold">{item.value}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.value}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                              className={`h-full rounded-full ${item.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Timer, label: 'Focus Time', value: '6.5h', color: 'text-blue-500' },
                        { icon: CheckCircle, label: 'Tasks Done', value: '24/30', color: 'text-green-500' },
                        { icon: TrendingUp, label: 'Productivity', value: '+32%', color: 'text-purple-500' },
                        { icon: Star, label: 'Streak', value: '21 days', color: 'text-orange-500' },
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                          whileHover={{ scale: 1.05 }}
                          className="bg-secondary/50 rounded-xl p-4 text-center"
                        >
                          <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Benefits */}
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Why Choose <span className="gradient-text">Chronify AI?</span>
              </h3>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Brain,
                    title: 'Intelligent Adaptation',
                    description: 'AI learns your patterns and optimizes schedules in real-time'
                  },
                  {
                    icon: Shield,
                    title: 'Privacy First',
                    description: 'Your data stays secure with enterprise-grade encryption'
                  },
                  {
                    icon: Users,
                    title: 'Community Learning',
                    description: 'Join study groups and compare progress with peers'
                  },
                  {
                    icon: Rocket,
                    title: 'Placement Ready',
                    description: 'Company-specific preparation and mock interviews'
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-transparent to-primary/5 hover:to-primary/10 transition-all group"
                  >
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">{benefit.title}</h4>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8"
              >
                <Button className="rounded-xl px-8 py-6 text-lg gap-2 group">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Platform Compatibility */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-4">Works Everywhere You Do</h3>
            <p className="text-muted-foreground">Access your schedule on all devices with seamless sync</p>
          </div>
          
          <div className="flex justify-center gap-8">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-secondary/50 border border-border shadow-lg">
                  <platform.icon className={`w-12 h-12 ${platform.color}`} />
                </div>
                <span className="font-medium">{platform.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-3xl blur-2xl opacity-50" />
          
          <div className="relative bg-card/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border shadow-2xl overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-32 -translate-y-32 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full translate-x-32 translate-y-32 blur-3xl" />
            
            <div className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: '95%', label: 'Completion Rate', icon: CheckCircle, color: 'text-green-500' },
                  { value: '180+', label: 'DSA Questions', icon: Code, color: 'text-blue-500' },
                  { value: '55%', label: 'DSA Focus Time', icon: Timer, color: 'text-purple-500' },
                  { value: '24/7', label: 'AI Assistant', icon: Cpu, color: 'text-orange-500' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-accent/10">
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 pt-8 border-t border-border/50 text-center"
              >
                <p className="text-lg text-muted-foreground">
                  Join <span className="font-bold text-primary">10,000+</span> students who have improved their 
                  productivity by <span className="font-bold text-accent">40%+</span> with Chronify AI
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold mb-6">Ready to Transform Your Academic Journey?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-xl px-8 py-6 text-lg gap-2 group">
              <Rocket className="w-5 h-5" />
              Start Free Trial - No Credit Card
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl px-8 py-6 text-lg gap-2">
              <Users className="w-5 h-5" />
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Free 14-day trial • No setup required • Cancel anytime
          </p>
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
        
        .gradient-text {
          background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)));
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  )
}