// 'use client'

// import { motion } from 'framer-motion'
// import { Calendar, TrendingUp } from 'lucide-react'

// export function HeatmapSection() {
//   const weeks = Array.from({ length: 12 }, (_, i) => i + 1)
//   const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  
//   const getIntensity = (week: number, day: number) => {
//     // Simulate different intensity levels
//     const base = (week * 7 + day) % 10
//     if (base < 3) return 'bg-green-100 dark:bg-green-900/30'
//     if (base < 6) return 'bg-green-300 dark:bg-green-700/50'
//     if (base < 8) return 'bg-green-500 dark:bg-green-600'
//     return 'bg-green-700 dark:bg-green-500'
//   }

//   return (
//     <section className="py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="mb-12"
//         >
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//               <TrendingUp className="w-5 h-5 text-white" />
//             </div>
//             <h2 className="text-4xl font-bold">
//               Visualize Your
//               <span className="block gradient-text">Progress Heatmap</span>
//             </h2>
//           </div>
//           <p className="text-xl text-muted-foreground max-w-3xl">
//             Track your consistency with a GitHub-style heatmap. Darker colors show higher productivity days.
//           </p>
//         </motion.div>

//         <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-xl font-bold">3-Month DSA Progress</h3>
//               <p className="text-muted-foreground">Goal: 180 questions in 90 days</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 rounded-sm bg-green-100 dark:bg-green-900/30" />
//                 <span className="text-sm">1-3 questions</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 rounded-sm bg-green-500 dark:bg-green-600" />
//                 <span className="text-sm">4-6 questions</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 rounded-sm bg-green-700 dark:bg-green-500" />
//                 <span className="text-sm">7+ questions</span>
//               </div>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <div className="flex gap-2 min-w-max">
//               {/* Day labels */}
//               <div className="flex flex-col gap-2 pt-8">
//                 {days.map((day) => (
//                   <div key={day} className="h-8 w-8 flex items-center justify-center text-sm text-muted-foreground">
//                     {day}
//                   </div>
//                 ))}
//               </div>

//               {/* Heatmap grid */}
//               {weeks.map((week) => (
//                 <div key={week} className="flex flex-col gap-2">
//                   <div className="h-8 flex items-center justify-center text-sm text-muted-foreground">
//                     W{week}
//                   </div>
//                   {days.map((_, dayIndex) => {
//                     const intensity = getIntensity(week, dayIndex)
//                     const hasData = Math.random() > 0.3 // 70% filled
                    
//                     return (
//                       <motion.div
//                         key={`${week}-${dayIndex}`}
//                         initial={{ scale: 0 }}
//                         whileInView={{ scale: 1 }}
//                         viewport={{ once: true }}
//                         transition={{ duration: 0.3, delay: (week * 7 + dayIndex) * 0.01 }}
//                         className={`w-8 h-8 rounded-md border border-border/50 ${hasData ? intensity : 'bg-secondary/30'} 
//                           hover:scale-110 transition-transform cursor-pointer relative group`}
//                       >
//                         {hasData && (
//                           <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 
//                             transition-opacity bg-card border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap z-10">
//                             <div className="text-sm font-medium">Week {week}, Day {dayIndex + 1}</div>
//                             <div className="text-xs text-muted-foreground">5 DSA questions solved</div>
//                           </div>
//                         )}
//                       </motion.div>
//                     )
//                   })}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Stats below heatmap */}
//           <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[
//               { label: 'Current Streak', value: '14 days', icon: '🔥' },
//               { label: 'Total Questions', value: '67/180', icon: '📊' },
//               { label: 'Consistency', value: '85%', icon: '📈' },
//             ].map((stat, index) => (
//               <motion.div
//                 key={stat.label}
//                 initial={{ opacity: 0, x: -20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 className="p-4 rounded-xl bg-secondary/30 border border-border"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="text-sm text-muted-foreground">{stat.label}</div>
//                     <div className="text-2xl font-bold mt-1">{stat.value}</div>
//                   </div>
//                   <div className="text-2xl">{stat.icon}</div>
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

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, TrendingUp, Flame, Target, Zap, ChevronRight, Sparkles, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HeatmapSection() {
  const [weeks] = useState(Array.from({ length: 12 }, (_, i) => i + 1))
  const [days] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
  const [hoveredCell, setHoveredCell] = useState<{week: number, day: number} | null>(null)
  const [activeMonth, setActiveMonth] = useState(0)
  
  // Generate heatmap data
  const generateHeatmapData = () => {
    const data: {[key: string]: {questions: number, intensity: number}} = {}
    weeks.forEach(week => {
      days.forEach((_, day) => {
        const key = `${week}-${day}`
        let questions = 0
        
        // More realistic data distribution
        if (week >= 4 && week <= 8) {
          questions = Math.floor(Math.random() * 7) + 3
        } else {
          questions = Math.floor(Math.random() * 4)
        }
        
        // Add some rest days
        if (Math.random() > 0.9) questions = 0
        
        const intensity = Math.min(questions / 8, 1)
        data[key] = { questions, intensity }
      })
    })
    return data
  }

  const [heatmapData, setHeatmapData] = useState<{[key: string]: {questions: number, intensity: number}}>({})
  
  useEffect(() => {
    setHeatmapData(generateHeatmapData())
  }, [])

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-secondary/50'
    
    // Professional color palette
    const colors = [
      'bg-blue-100 dark:bg-blue-900/20',
      'bg-blue-200 dark:bg-blue-800/30',
      'bg-blue-300 dark:bg-blue-700/40',
      'bg-blue-400 dark:bg-blue-600/50',
      'bg-blue-500 dark:bg-blue-500',
      'bg-blue-600 dark:bg-blue-400',
    ]
    
    const index = Math.floor(intensity * (colors.length - 1))
    return colors[Math.min(index, colors.length - 1)]
  }

  const getIntensityLevel = (intensity: number) => {
    if (intensity === 0) return 'No activity'
    if (intensity < 0.25) return '1-2 questions'
    if (intensity < 0.5) return '3-4 questions'
    if (intensity < 0.75) return '5-6 questions'
    return '7+ questions'
  }

  const stats = [
    { 
      label: 'Current Streak', 
      value: '14 days', 
      icon: Flame,
      change: '+3 days',
      progress: 70
    },
    { 
      label: 'Questions Solved', 
      value: '67/180', 
      icon: Target,
      change: '37% complete',
      progress: 37
    },
    { 
      label: 'Consistency', 
      value: '85%', 
      icon: Zap,
      change: 'All-time high',
      progress: 85
    },
    { 
      label: 'Best Streak', 
      value: '21 days', 
      icon: Award,
      change: 'Record',
      progress: 100
    },
  ]

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  const cellVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: custom * 0.002,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.08,
      transition: { duration: 0.2 }
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4 p-3 rounded-2xl bg-primary/5 border border-primary/10">
            <TrendingUp className="w-6 h-6 text-primary" />
            <span className="text-primary font-medium">Progress Tracking</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Visualize Your Consistency
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Track your study journey with an interactive heatmap. Darker shades represent higher productivity.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-green-500">
                      {stat.change}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                  
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Heatmap Container */}
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold">DSA Progress Heatmap</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Goal: 180 questions in 90 days • Current: 67 questions
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium flex items-center gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  View Insights
                </motion.button>
              </div>
            </div>

            {/* Month Selector */}
            <div className="mb-6">
              <div className="flex gap-1 overflow-x-auto pb-2">
                {monthLabels.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => setActiveMonth(index)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                      activeMonth === index
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    )}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            {/* Heatmap */}
            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {/* Day labels */}
                <div className="flex flex-col gap-2 pt-8">
                  {days.map((day) => (
                    <div
                      key={day}
                      className="h-10 w-12 flex items-center justify-center text-sm text-muted-foreground font-medium"
                    >
                      {day.slice(0, 1)}
                    </div>
                  ))}
                </div>

                {/* Heatmap grid */}
                {weeks.map((week) => (
                  <div key={week} className="flex flex-col gap-2">
                    <div className="h-8 flex items-center justify-center text-sm text-muted-foreground font-medium">
                      W{week}
                    </div>
                    {days.map((_, dayIndex) => {
                      const key = `${week}-${dayIndex}`
                      const data = heatmapData[key] || { questions: 0, intensity: 0 }
                      const isHovered = hoveredCell?.week === week && hoveredCell?.day === dayIndex
                      
                      return (
                        <motion.div
                          key={key}
                          custom={week * 7 + dayIndex}
                          variants={cellVariants}
                          initial="hidden"
                          whileInView="visible"
                          whileHover="hover"
                          viewport={{ once: true }}
                          onMouseEnter={() => setHoveredCell({ week, day: dayIndex })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={cn(
                            "relative w-10 h-10 rounded-lg border border-border cursor-pointer transition-all duration-200",
                            getIntensityColor(data.intensity)
                          )}
                        >
                          {/* Hover tooltip */}
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10"
                              >
                                <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg min-w-[140px]">
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Week {week}, {days[dayIndex]}
                                  </div>
                                  <div className="font-medium">
                                    {data.questions} questions
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {getIntensityLevel(data.intensity)}
                                  </div>
                                </div>
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border rotate-45" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 pt-6 border-t border-border/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Less</span>
                  {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => (
                    <div
                      key={intensity}
                      className={cn(
                        "w-6 h-6 rounded-md border border-border/30",
                        getIntensityColor(intensity)
                      )}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground">More</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-muted-foreground">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <span className="text-muted-foreground">Rest</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Progress Summary</div>
                  <div className="text-sm text-muted-foreground">
                    You're on track to complete your goal in <span className="font-bold">52 days</span>. 
                    Keep maintaining your current consistency of <span className="text-green-500 font-medium">85%</span>.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Flame className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold">Current Streak Analysis</h4>
                  <p className="text-sm text-muted-foreground">14 days and counting</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily average</span>
                  <span className="font-medium">5.2 questions/day</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Best streak</span>
                  <span className="font-medium">21 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current pace</span>
                  <span className="font-medium text-green-500">Ahead by 2 days</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold">Weekly Progress</h4>
                  <p className="text-sm text-muted-foreground">Last 4 weeks trend</p>
                </div>
              </div>
              
              <div className="flex items-end gap-2 h-20">
                {[32, 28, 35, 42].map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(value / 50) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={cn(
                      "flex-1 rounded-t-lg min-h-[4px]",
                      index === 3 
                        ? "bg-gradient-to-t from-primary to-accent" 
                        : "bg-secondary"
                    )}
                  />
                ))}
              </div>
              
              <div className="flex justify-between mt-3 text-sm text-muted-foreground">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span className="font-medium">This Week</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}