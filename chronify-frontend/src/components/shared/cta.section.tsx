'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Calendar,
  Clock,
  TrendingUp,
  Target,
  Zap,
  Users,
  Award,
  Star,
  Home,
  ListChecks,
  BarChart3,
  Bell,
} from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import Link from 'next/link'

/* ============================================================================
   CTA SECTION
   Mobile  → inside phone mockup (app-feel)
   Desktop → full laptop-style preview card
   ============================================================================ */

export function CTASection() {
  const controls = useAnimation()
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const features = [
    { text: 'Personalized timetable in 2 minutes', icon: Calendar, color: 'text-blue-600' },
    { text: 'Priority-based task scheduling', icon: Target, color: 'text-green-600' },
    { text: 'Progress tracking with analytics', icon: TrendingUp, color: 'text-purple-600' },
    { text: 'Time optimization for maximum efficiency', icon: Clock, color: 'text-orange-600' },
  ]

  const timetableItems = [
    { time: '6:30 AM', task: 'Wake up + Plan day', type: 'personal', color: 'bg-gray-400' },
    { time: '7:10 AM', task: 'Commute: Audio Learning', type: 'learning', color: 'bg-blue-500' },
    { time: '9:30 AM', task: 'College Classes', type: 'academic', color: 'bg-green-500' },
    { time: '2:00 PM', task: 'Practice Session', type: 'learning', color: 'bg-blue-500' },
    { time: '5:10 PM', task: 'Commute: Revision', type: 'learning', color: 'bg-blue-500' },
    { time: '8:00 PM', task: 'Project Work', type: 'project', color: 'bg-purple-500' },
  ]

  const timeDistribution = [
    { label: 'Practice', percentage: 55, hours: '32-35 hrs', color: 'bg-blue-600' },
    { label: 'College Studies', percentage: 18, hours: '10-12 hrs', color: 'bg-green-600' },
    { label: 'Project Work', percentage: 15, hours: '8-10 hrs', color: 'bg-purple-600' },
    { label: 'Commute Learning', percentage: 12, hours: '8-10 hrs', color: 'bg-gray-600' },
  ]

  const stats = [
    { value: '10K+', label: 'Active Users', icon: Users },
    { value: '95%', label: 'Satisfaction', icon: Star },
    { value: '40%', label: 'Productivity Gain', icon: TrendingUp },
    { value: '2 min', label: 'Setup Time', icon: Zap },
  ]

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } })
  }, [controls])

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* ============================================================
            MOBILE: APP-LIKE PHONE MOCKUP
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:hidden"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Get Started
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-3 leading-tight">
              <span className="block">Master Your Time,</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Master Your Future
              </span>
            </h2>

            <p className="text-sm text-muted-foreground max-w-sm mx-auto px-2">
              Join thousands who plan smarter and achieve more — every single
              day.
            </p>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center mb-8">
            <div className="relative w-[300px] rounded-[2.5rem] border-[8px] border-gray-900 dark:border-gray-800 bg-gray-900 dark:bg-black shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 dark:bg-black rounded-b-2xl z-20" />

              {/* Screen */}
              <div className="bg-background pt-8 pb-20 relative min-h-[520px]">
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 py-1 text-[10px] font-medium text-muted-foreground">
                  <span>9:41</span>
                  <span>●●●</span>
                </div>

                {/* App header */}
                <div className="px-5 py-4">
                  <h4 className="font-bold text-base">Today&apos;s Plan</h4>
                  <p className="text-xs text-muted-foreground">
                    Built for your routine
                  </p>
                </div>

                {/* Timetable list — compact */}
                <div className="px-4 space-y-2">
                  {timetableItems.slice(0, 5).map((item, i) => (
                    <motion.div
                      key={item.task}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">
                          {item.task}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {item.time}
                        </div>
                      </div>
                      <CheckCircle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>

                {/* Bottom nav */}
                <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border">
                  <div className="flex items-center justify-around py-2.5">
                    {[Home, ListChecks, BarChart3, Bell].map((Icon, i) => (
                      <Icon
                        key={i}
                        className={`w-5 h-5 ${
                          i === 1 ? 'text-primary' : 'text-muted-foreground'
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
          </div>

          {/* Compact feature list */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="flex items-start gap-2 p-3 rounded-2xl bg-card/50 border border-border"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-[11px] font-medium leading-tight">
                    {feature.text}
                  </span>
                </motion.div>
              )
            })}
          </div>

          {/* CTA buttons */}
          <div className="space-y-3 mb-4">
            <Link href="/auth/register" className="block">
              <Button
                size="lg"
                className="w-full rounded-xl py-6 text-base font-semibold gap-2 group"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/features" className="block">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-xl py-6 text-base font-semibold"
              >
                Learn More
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 text-center">
            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            <span>No credit card • 14-day trial • Cancel anytime</span>
          </p>
        </motion.div>

        {/* ============================================================
            DESKTOP: FULL PREVIEW CARD
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="hidden md:block relative bg-card rounded-2xl shadow-2xl overflow-hidden border border-border"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-50" />

          <div className="relative p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* LEFT — Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Limited Time Offer
                  </span>
                </div>

                <h2 className="text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                  <span className="block">Master Your Time,</span>
                  <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%] animate-gradient">
                    Master Your Future
                  </span>
                </h2>

                <p className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
                  Join thousands who transformed their daily routine with
                  smart scheduling. Achieve your goals while keeping balance in
                  life.
                </p>

                {/* Features */}
                <div className="space-y-4 mb-10">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredItem(index)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="flex items-center gap-4 p-3 rounded-xl transition-all duration-300 hover:bg-secondary/50"
                    >
                      <motion.div
                        animate={
                          hoveredItem === index
                            ? { rotate: 10, scale: 1.1 }
                            : { rotate: 0, scale: 1 }
                        }
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
                      >
                        <feature.icon className="w-6 h-6 text-primary" />
                      </motion.div>
                      <span className="text-foreground font-medium">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto rounded-xl px-10 py-7 text-base font-semibold gap-3"
                    >
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/features" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto rounded-xl px-10 py-7 text-base font-semibold border-2"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>

                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>
                    No credit card required • 14-day free trial • Cancel
                    anytime
                  </span>
                </p>
              </motion.div>

              {/* RIGHT — Preview Card */}
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl"
                />
                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                  className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl blur-xl"
                />

                <div className="bg-card rounded-2xl p-8 border border-border shadow-2xl">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold">Smart Timetable</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        A schedule built for your routine
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="w-12 h-12 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center"
                    >
                      <Award className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>

                  {/* Timetable items */}
                  <div className="space-y-3 mb-8">
                    {timetableItems.slice(0, 5).map((item, index) => (
                      <motion.div
                        key={item.task}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-4 p-3 rounded-xl border border-border bg-secondary/30"
                      >
                        <div className="flex items-center gap-3 min-w-24">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                          />
                          <span className="text-xs font-medium text-muted-foreground">
                            {item.time}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {item.task}
                          </div>
                          <div className="text-[10px] text-muted-foreground capitalize">
                            {item.type}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress bars */}
                  <div className="space-y-4 mb-8">
                    <h4 className="font-semibold text-sm">
                      Weekly Time Allocation
                    </h4>
                    <div className="space-y-3">
                      {timeDistribution.map((item, index) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">
                              {item.label}
                            </span>
                            <span className="font-medium">{item.hours}</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.percentage}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 1.2,
                                delay: index * 0.15,
                                ease: 'easeOut',
                              }}
                              className={`h-full ${item.color} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pt-6 border-t border-border grid grid-cols-2 gap-3">
                    {stats.map((stat) => {
                      const Icon = stat.icon
                      return (
                        <div
                          key={stat.label}
                          className="text-center p-3 rounded-xl bg-secondary/40"
                        >
                          <Icon className="w-4 h-4 text-primary mx-auto mb-1.5" />
                          <div className="text-lg font-bold">{stat.value}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ============================================================
            BOTTOM CTA — both mobile & desktop (compact)
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="hidden md:block mt-16 text-center"
        >
          <div className="max-w-3xl mx-auto p-12 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/20 backdrop-blur-sm">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Take Control of Your Time?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands who have improved their daily productivity and
              reached their goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="rounded-xl px-12 py-7 text-base font-semibold"
                >
                  Get Started Now
                </Button>
              </Link>
              <Link href="/features">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-12 py-7 text-base font-semibold border-2"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              All features included in free trial • Cancel anytime • 24/7
              support
            </p>
          </div>
        </motion.div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% auto;
        }
      `}</style>
    </section>
  )
}