// 'use client'

// import { motion } from 'framer-motion'
// import { Star, Quote } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'

// export function Testimonials() {
//   const testimonials = [
//     {
//       name: 'Arbaz Khan',
//       role: 'MCA Student',
//       content: 'Chronify AI helped me balance DSA prep with college studies. Completed 180 questions in 3 months while maintaining 8.5+ CGPA!',
//       rating: 5,
//       avatar: 'AK'
//     },
//     {
//       name: 'Priya Sharma',
//       role: 'BTech CSE',
//       content: 'The AI-generated timetable perfectly used my commute time for DSA audio learning. My productivity increased by 40%!',
//       rating: 5,
//       avatar: 'PS'
//     },
//     {
//       name: 'Rahul Verma',
//       role: 'Placement Aspirant',
//       content: 'From struggling with time management to landing 3 offers - Chronify AI made all the difference with its smart scheduling.',
//       rating: 5,
//       avatar: 'RV'
//     },
//   ]

//   return (
//     <section className="py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
//             <Quote className="w-4 h-4 text-accent" />
//             <span className="text-sm font-medium gradient-text">Trusted by 5000+ Students</span>
//           </div>
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">
//             Students Who
//             <span className="block gradient-text">Transformed Their Journey</span>
//           </h2>
//           <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//             See how Chronify AI helped students achieve their academic and placement goals.
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {testimonials.map((testimonial, index) => (
//             <motion.div
//               key={testimonial.name}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//             >
//               <Card className="h-full border-border hover:border-primary/30 transition-all hover:shadow-xl">
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//                       <span className="font-bold text-white">{testimonial.avatar}</span>
//                     </div>
//                     <div>
//                       <div className="font-bold">{testimonial.name}</div>
//                       <div className="text-sm text-muted-foreground">{testimonial.role}</div>
//                     </div>
//                   </div>
                  
//                   <div className="flex mb-4">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
//                       />
//                     ))}
//                   </div>
                  
//                   <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  
//                   <div className="text-xs text-muted-foreground">
//                     Used for: {index === 0 ? 'DSA + College Balance' : index === 1 ? 'Commute Optimization' : 'Placement Prep'}
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>

//         {/* Stats bar */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-border"
//         >
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {[
//               { value: '5000+', label: 'Active Students' },
//               { value: '95%', label: 'Satisfaction Rate' },
//               { value: '180+', label: 'Avg. DSA Questions' },
//               { value: '8.2', label: 'Avg. CGPA Improved' },
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

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle, Users, Target, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const testimonials = [
    {
      name: 'Arbaz Khan',
      role: 'MCA Student',
      university: 'Amity University',
      content: 'Chronify AI helped me balance DSA prep with college studies. Completed 180 questions in 3 months while maintaining 8.5+ CGPA!',
      rating: 5,
      avatar: 'AK',
      achievement: 'DSA + College Balance',
      stats: { dsa: '180 questions', cgpa: '8.7', time: '3 months' }
    },
    {
      name: 'Priya Sharma',
      role: 'BTech CSE',
      university: 'Delhi University',
      content: 'The AI-generated timetable perfectly used my commute time for DSA audio learning. My productivity increased by 40% in just 2 months!',
      rating: 5,
      avatar: 'PS',
      achievement: 'Commute Optimization',
      stats: { productivity: '+40%', dsa: '120 questions', time: '2 months' }
    },
    {
      name: 'Rahul Verma',
      role: 'Placement Aspirant',
      university: 'IIT Delhi',
      content: 'From struggling with time management to landing 3 offers - Chronify AI made all the difference with its smart scheduling and analytics.',
      rating: 5,
      avatar: 'RV',
      achievement: 'Placement Success',
      stats: { offers: '3 companies', dsa: '200+ questions', time: '4 months' }
    },
    {
      name: 'Neha Patel',
      role: 'MTech Student',
      university: 'VIT University',
      content: 'As a working professional studying part-time, Chronify AI optimized my limited hours perfectly. Landed a promotion and completed DSA!',
      rating: 5,
      avatar: 'NP',
      achievement: 'Work-Study Balance',
      stats: { promotion: 'Yes', dsa: '150 questions', time: '5 months' }
    },
  ]

  const stats = [
    { value: '5000+', label: 'Active Students', icon: Users },
    { value: '95%', label: 'Satisfaction Rate', icon: Star },
    { value: '180+', label: 'Avg. DSA Questions', icon: Target },
    { value: '8.2', label: 'Avg. CGPA Improved', icon: TrendingUp },
  ]

  // Auto-slide functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, testimonials.length])

  const handleNext = () => {
    setIsPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setTimeout(() => setIsPlaying(true), 3000)
  }

  const handlePrev = () => {
    setIsPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setIsPlaying(true), 3000)
  }

  const handleDotClick = (index: number) => {
    setIsPlaying(false)
    setCurrentIndex(index)
    setTimeout(() => setIsPlaying(true), 3000)
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 mb-4">
            <Quote className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Trusted by 5000+ Students
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Success Stories
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See how students transformed their academic journey with Chronify AI.
          </p>
        </motion.div>

        {/* Desktop Testimonials Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-900 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-white">{testimonial.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">{testimonial.university}</div>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-700'}`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic text-sm leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>{testimonial.achievement}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {Object.entries(testimonial.stats).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          {value} {key}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile Testimonials Carousel */}
        <div className="md:hidden mb-12">
          <div className="relative overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-900 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-white">{testimonials[currentIndex].avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{testimonials[currentIndex].name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{testimonials[currentIndex].role}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">{testimonials[currentIndex].university}</div>
                      </div>
                    </div>
                    
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < testimonials[currentIndex].rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-700'}`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic text-sm leading-relaxed">
                      "{testimonials[currentIndex].content}"
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>{testimonials[currentIndex].achievement}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {Object.entries(testimonials[currentIndex].stats).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {value} {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                className="rounded-full border-gray-300 dark:border-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex 
                        ? 'bg-gray-900 dark:bg-gray-300' 
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="rounded-full border-gray-300 dark:border-gray-700"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                      <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="max-w-2xl mx-auto p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Join Our Success Stories
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start your journey towards academic excellence and placement success.
              </p>
              <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white">
                Get Started Free
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                No credit card required • 14-day free trial
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}