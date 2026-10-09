'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Users,
  Target,
  TrendingUp,
  Home,
  ListChecks,
  BarChart3,
  Bell,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/* ============================================================================
   TESTIMONIALS
   ============================================================================ */

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const testimonials = [
    {
      name: 'Arbaz Khan',
      role: 'MCA Student',
      university: 'Amity University',
      content:
        'Chronify helped me balance DSA prep with college studies. Completed 180 questions in 3 months while maintaining 8.5+ CGPA!',
      rating: 5,
      avatar: 'AK',
      achievement: 'DSA + College Balance',
      stats: { dsa: '180 questions', cgpa: '8.7', time: '3 months' },
    },
    {
      name: 'Priya Sharma',
      role: 'BTech CSE',
      university: 'Delhi University',
      content:
        'The personalized timetable perfectly used my commute time for audio learning. My productivity increased by 40% in just 2 months!',
      rating: 5,
      avatar: 'PS',
      achievement: 'Commute Optimization',
      stats: { productivity: '+40%', dsa: '120 questions', time: '2 months' },
    },
    {
      name: 'Rahul Verma',
      role: 'Placement Aspirant',
      university: 'IIT Delhi',
      content:
        'From struggling with time management to landing 3 offers — Chronify made all the difference with its smart scheduling and analytics.',
      rating: 5,
      avatar: 'RV',
      achievement: 'Placement Success',
      stats: { offers: '3 companies', dsa: '200+ questions', time: '4 months' },
    },
    {
      name: 'Neha Patel',
      role: 'MTech Student',
      university: 'VIT University',
      content:
        'As a working professional studying part-time, Chronify optimized my limited hours perfectly. Landed a promotion and completed DSA!',
      rating: 5,
      avatar: 'NP',
      achievement: 'Work-Study Balance',
      stats: { promotion: 'Yes', dsa: '150 questions', time: '5 months' },
    },
  ]

  const stats = [
    { value: '5+', label: 'Active Users', icon: Users },
    { value: 'NA', label: 'Satisfaction Rate', icon: Star },
    { value: '10+', label: 'Avg. Questions', icon: Target },
    { value: '40%', label: 'Avg. Productivity Boost', icon: TrendingUp },
  ]

  /* Auto-slide */
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
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
    setTimeout(() => setIsPlaying(true), 3000)
  }

  const handleDotClick = (index: number) => {
    setIsPlaying(false)
    setCurrentIndex(index)
    setTimeout(() => setIsPlaying(true), 3000)
  }

  return (
    <section className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute -top-40 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* ============================================================
            HEADER
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Quote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Trusted by 5000+ Users
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
            Success Stories
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            See how people transformed their journey with Chronify.
          </p>
        </motion.div>

        {/* ============================================================
            DESKTOP: 4-card grid
           ============================================================ */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border border-border hover:border-primary/30 transition-colors bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-primary-foreground text-sm">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-muted-foreground/70">
                        {testimonial.university}
                      </div>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 italic leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-border/50">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span>{testimonial.achievement}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ============================================================
            MOBILE: APP-LIKE PHONE MOCKUP
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:hidden flex justify-center mb-8"
        >
          <div className="relative w-[300px] rounded-[2.5rem] border-[8px] border-gray-900 dark:border-gray-800 bg-gray-900 dark:bg-black shadow-2xl overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 dark:bg-black rounded-b-2xl z-20" />

            {/* Screen */}
            <div className="bg-background pt-8 pb-20 relative min-h-[520px]">
              {/* Status bar */}
              <div className="flex items-center justify-between px-5 py-1 text-[10px] font-medium text-muted-foreground">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span>●●●</span>
                </div>
              </div>

              {/* App header */}
              <div className="px-5 py-4">
                <h4 className="font-bold text-base">Success Stories</h4>
                <p className="text-xs text-muted-foreground">
                  Real people, real results
                </p>
              </div>

              {/* Testimonial card — swipe style */}
              <div className="px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 rounded-2xl bg-card border border-border"
                  >
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-primary-foreground text-xs">
                          {testimonials[currentIndex].avatar}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs truncate">
                          {testimonials[currentIndex].name}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {testimonials[currentIndex].role}
                        </div>
                      </div>
                      <div className="flex flex-shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2.5 h-2.5 ${
                              i < testimonials[currentIndex].rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quote */}
                    <p className="text-xs text-muted-foreground italic leading-relaxed mb-3">
                      &ldquo;{testimonials[currentIndex].content}&rdquo;
                    </p>

                    {/* Achievement */}
                    <div className="flex items-center gap-1.5 pt-3 border-t border-border/50">
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span className="text-[10px] font-medium truncate">
                        {testimonials[currentIndex].achievement}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Controls — compact */}
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={handlePrev}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        aria-label={`Go to ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentIndex
                            ? 'w-4 bg-primary'
                            : 'w-1.5 bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom nav */}
              <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border">
                <div className="flex items-center justify-around py-2.5">
                  {[Home, ListChecks, BarChart3, Bell].map((Icon, i) => (
                    <Icon
                      key={i}
                      className={`w-5 h-5 ${
                        i === 2 ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-center pb-1.5">
                  <div className="w-24 h-1 bg-foreground/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ============================================================
            STATS — 2×2 mobile, 4-col desktop
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-14"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="text-center p-3 sm:p-5 rounded-2xl bg-card/50 backdrop-blur-sm border border-border"
                >
                  <div className="flex justify-center mb-2 sm:mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* ============================================================
            CTA
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 border border-border">
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              Join Our Success Stories
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-5">
              Start your journey towards better productivity and success.
            </p>
            <Button className="rounded-xl px-6 py-5 text-sm sm:text-base">
              Get Started Free
            </Button>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-3">
              No credit card required • 14-day free trial
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}