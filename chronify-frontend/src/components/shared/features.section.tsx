// src/components/shared/features.section.tsx
'use client'

import {
  Calendar,
  TrendingUp,
  Clock,
  Sparkles,
  Users,
  Rocket,
  Shield,
  ArrowRight,
  BookOpen,
  Timer,
  Target,
  BarChart3,
  Bell,
  Home,
  ListChecks,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* ============================================================================
   FEATURES SECTION — FEATURES INSIDE DEVICE MOCKUPS
   Mobile  → inside phone frame (app list style)
   Desktop → inside laptop frame (dashboard grid style)
   ============================================================================ */

export function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: 'Smart Timetable Builder',
      description:
        'Personalized schedules that balance studies, work, and rest.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      title: 'Goal-Based Planning',
      description:
        'Set targets and track progress with clear milestones.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description:
        'Daily check-ins and simple analytics to stay consistent.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      title: 'Time Slot Optimization',
      description:
        'Uses commute, free periods, and weekends efficiently.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: BarChart3,
      title: 'Weekly Reports',
      description:
        'See where your time goes with clean, easy reports.',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: BookOpen,
      title: 'Study Roadmaps',
      description:
        'Structured paths to learn any topic step-by-step.',
      color: 'from-violet-500 to-fuchsia-500',
    },
    {
      icon: Timer,
      title: 'Focus Timer',
      description:
        'Built-in timer to keep you in deep, distraction-free work.',
      color: 'from-rose-500 to-red-500',
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description:
        'Gentle nudges so you never miss what matters.',
      color: 'from-amber-500 to-yellow-500',
    },
  ]

  const benefits = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data stays secure with strong encryption.',
    },
    {
      icon: Users,
      title: 'Community Learning',
      description: 'Join groups and grow together with peers.',
    },
    {
      icon: Rocket,
      title: 'Ready for What’s Next',
      description: 'Prepare for exams, interviews, or your next big goal.',
    },
  ]

  return (
    <section className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-40 -right-40 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* ============================================================
            HEADER
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Everything You Need
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            <span className="block">Powerful Features for</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Everyday Success
            </span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            From smart scheduling to clear reports — Chronify gives you
            everything to master your time.
          </p>
        </motion.div>

        {/* ============================================================
            MOBILE: FEATURES INSIDE PHONE MOCKUP
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:hidden flex justify-center mb-12"
        >
          <div className="relative w-[300px] rounded-[2.5rem] border-[8px] border-gray-900 dark:border-gray-800 bg-gray-900 dark:bg-black shadow-2xl overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 dark:bg-black rounded-b-2xl z-20" />

            {/* Screen */}
            <div className="bg-background pt-8 pb-20 relative min-h-[600px]">
              {/* Status bar */}
              <div className="flex items-center justify-between px-5 py-1 text-[10px] font-medium text-muted-foreground">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span>●●●</span>
                </div>
              </div>

              {/* App header */}
              <div className="px-5 py-4">
                <h4 className="font-bold text-base">Features</h4>
                <p className="text-xs text-muted-foreground">
                  Everything in one place
                </p>
              </div>

              {/* Feature list — app style */}
              <div className="px-4 space-y-2">
                {features.map((f) => {
                  const Icon = f.icon
                  return (
                    <div
                      key={f.title}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold truncate">
                          {f.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {f.description}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    </div>
                  )
                })}
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
        </motion.div>

        {/* ============================================================
            DESKTOP: FEATURES INSIDE LAPTOP MOCKUP
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="hidden md:block mb-12 sm:mb-16"
        >
          <div className="relative w-full max-w-5xl mx-auto">
            {/* Laptop screen */}
            <div className="rounded-t-2xl border-[12px] border-b-0 border-gray-900 dark:border-gray-800 bg-gray-900 dark:bg-black shadow-2xl overflow-hidden">
              <div className="bg-background">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-4 px-3 py-1 rounded-md bg-background text-xs text-muted-foreground flex-1 max-w-sm">
                    chronify.app/features
                  </div>
                </div>

                {/* App content */}
                <div className="p-8">
                  {/* App header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-bold text-2xl">Features</h4>
                      <p className="text-sm text-muted-foreground">
                        Everything you need, in one place
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">
                        {features.length} tools
                      </span>
                    </div>
                  </div>

                  {/* Feature grid inside laptop */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((f) => {
                      const Icon = f.icon
                      return (
                        <div
                          key={f.title}
                          className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all hover:shadow-lg"
                        >
                          <div
                            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3 shadow-lg shadow-primary/10`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="font-bold text-sm mb-1 leading-tight">
                            {f.title}
                          </div>
                          <div className="text-xs text-muted-foreground leading-snug">
                            {f.description}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop base */}
            <div className="h-4 bg-gray-900 dark:bg-gray-800 rounded-b-2xl shadow-2xl" />
            <div className="mx-auto w-48 h-2 bg-gray-700 dark:bg-gray-600 rounded-b-full" />
          </div>
        </motion.div>

        {/* ============================================================
            WHY CHOOSE — 3 benefits
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-3xl font-bold mb-2">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Chronify?
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-card to-secondary/30 border border-border"
              >
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm sm:text-base mb-0.5 sm:mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ============================================================
            CTA — UNIVERSAL
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-lg sm:text-2xl font-bold mb-4">
            Ready to Take Control of Your Time?
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 justify-center px-2 sm:px-0">
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="rounded-xl px-6 py-5 text-sm sm:text-base gap-2 group w-full sm:w-auto"
              >
                <Rocket className="w-4 h-4" />
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/features" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-6 py-5 text-sm sm:text-base w-full sm:w-auto"
              >
                Learn More
              </Button>
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-3">
            Free 14-day trial • No setup required • Cancel anytime
          </p>
        </motion.div>
      </div>

      {/* Custom animations */}
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