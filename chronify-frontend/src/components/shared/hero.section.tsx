// src/components/shared/hero.section.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  BookOpen,
  Timer,
  CheckSquare,
  Clock,
  GraduationCap,
  Laptop,
  Brain,
  Calendar,
  Home,
  BarChart3,
  Settings,
  Bell,
  Wifi,
  Signal,
  Battery,
  Layers,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

/* ============================================================================
   HERO SECTION — SIMPLIFIED + APP-LIKE MOBILE VIEW
   ============================================================================ */

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />

      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, #8882 1px, transparent 1px),
                            linear-gradient(to bottom, #8882 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart Student Productivity
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 sm:mb-6 leading-tight"
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
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-2"
          >
            Chronify helps you build personalized timetables that balance DSA,
            college studies, projects, and life—so you stay consistent and hit
            your placement goals.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4 sm:px-0"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="rounded-xl px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg gap-2 group w-full sm:w-auto"
              >
                <span>Create Your Timetable</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg w-full sm:w-auto"
              >
                See How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto mb-8"
          >
            {[
              { text: 'Smart Priority Sorting', icon: TrendingUp },
              { text: 'College Timetable Import', icon: GraduationCap },
              { text: 'Custom Study Plans', icon: Calendar },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -3 }}
                className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-left">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* ============================================================
              ✨ ATTRACTIVE LINK TO FEATURES PAGE
             ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex justify-center mb-12 sm:mb-16"
          >
            <Link href="/features" className="group">
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="relative inline-flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/30 hover:border-primary/60 transition-all cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/20"
              >
                {/* Animated shine */}
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                />

                <div className="relative z-10 p-1.5 sm:p-2 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0">
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
                </div>

                <span className="relative z-10 text-xs sm:text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Explore All Features
                </span>

                <ArrowRight className="relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* ============================================================
            MOBILE: APP MOCKUP
            DESKTOP: DASHBOARD MOCKUP
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 sm:mt-16 relative max-w-4xl mx-auto"
        >
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl opacity-50" />

          {/* ================= MOBILE: PHONE MOCKUP ================= */}
          <div className="md:hidden relative mx-auto max-w-[320px]">
            <div className="relative rounded-[2.5rem] border-[8px] border-gray-900 dark:border-gray-800 bg-gray-900 dark:bg-black shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 dark:bg-black rounded-b-2xl z-20" />

              {/* Screen */}
              <div className="bg-background pt-8 pb-20 relative min-h-[600px]">
                {/* Status bar */}
                <div className="flex items-center justify-between px-6 py-1 text-xs font-medium">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <Signal className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-4 h-4" />
                  </div>
                </div>

                {/* App header */}
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <h3 className="font-bold text-lg">Hi, Alex 👋</h3>
                    <p className="text-xs text-muted-foreground">
                      Let's crush today
                    </p>
                  </div>
                  <div className="relative p-2 rounded-full bg-secondary">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                </div>

                {/* Progress card */}
                <div className="mx-5 p-4 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium opacity-90">
                      Today's Progress
                    </span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-3xl font-bold mb-2">65%</div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1, delay: 1 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                  <p className="text-xs opacity-90 mt-3">
                    2 of 4 tasks completed
                  </p>
                </div>

                {/* Section title */}
                <div className="flex items-center justify-between px-5 mb-3">
                  <h4 className="font-semibold text-sm">Today's Tasks</h4>
                  <span className="text-xs text-primary font-medium">
                    See all
                  </span>
                </div>

                {/* Task cards */}
                <div className="px-5 space-y-2.5">
                  {[
                    {
                      time: '9:00 AM',
                      task: 'DSA — Trees',
                      icon: Laptop,
                      done: true,
                      color: 'bg-blue-500/10 text-blue-500',
                    },
                    {
                      time: '11:30 AM',
                      task: 'DBMS Lecture',
                      icon: GraduationCap,
                      done: true,
                      color: 'bg-green-500/10 text-green-500',
                    },
                    {
                      time: '3:00 PM',
                      task: 'ML Project',
                      icon: Brain,
                      done: false,
                      color: 'bg-purple-500/10 text-purple-500',
                    },
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={item.task}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                          item.done
                            ? 'bg-secondary/30 border-transparent'
                            : 'bg-card border-border'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl ${item.color} flex-shrink-0`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-medium text-sm truncate ${
                              item.done
                                ? 'line-through text-muted-foreground'
                                : ''
                            }`}
                          >
                            {item.task}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {item.time}
                          </div>
                        </div>
                        {item.done ? (
                          <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                {/* Bottom nav (fixed inside phone) */}
                <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border">
                  <div className="flex items-center justify-around py-3">
                    {[
                      { icon: Home, label: 'Home', active: true },
                      { icon: Calendar, label: 'Plan', active: false },
                      { icon: BarChart3, label: 'Stats', active: false },
                      { icon: Settings, label: 'More', active: false },
                    ].map((nav) => {
                      const Icon = nav.icon
                      return (
                        <div
                          key={nav.label}
                          className={`flex flex-col items-center gap-1 ${
                            nav.active ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[10px] font-medium">
                            {nav.label}
                          </span>
                          {nav.active && (
                            <div className="absolute bottom-1 w-6 h-1 bg-primary rounded-full" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {/* Home indicator */}
                  <div className="flex justify-center pb-2">
                    <div className="w-32 h-1 bg-foreground/30 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating decorations */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-8 w-16 h-16 bg-accent/20 rounded-full blur-xl pointer-events-none"
            />
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-4 -left-8 w-20 h-20 bg-primary/20 rounded-full blur-xl pointer-events-none"
            />
          </div>

          {/* ================= DESKTOP: DASHBOARD MOCKUP ================= */}
          <div className="hidden md:block relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
            {/* Window bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-sm text-muted-foreground">
                Today's Plan
              </span>
            </div>

            <div className="p-6">
              {/* Date + progress */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="font-bold text-xl">Good morning, Alex 👋</h3>
                  <p className="text-sm text-muted-foreground">
                    You have 4 tasks planned for today
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 w-fit">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">65% complete</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, delay: 1 }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>

              {/* Task list */}
              <div className="space-y-3">
                {[
                  {
                    time: '9:00 AM',
                    task: 'DSA Practice — Trees',
                    icon: Laptop,
                    done: true,
                    color: 'bg-blue-500/10 text-blue-500',
                  },
                  {
                    time: '11:30 AM',
                    task: 'College Lecture — DBMS',
                    icon: GraduationCap,
                    done: true,
                    color: 'bg-green-500/10 text-green-500',
                  },
                  {
                    time: '3:00 PM',
                    task: 'ML Project Work',
                    icon: Brain,
                    done: false,
                    color: 'bg-purple-500/10 text-purple-500',
                  },
                  {
                    time: '7:00 PM',
                    task: 'Revision & Planning',
                    icon: BookOpen,
                    done: false,
                    color: 'bg-orange-500/10 text-orange-500',
                  },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.task}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        item.done
                          ? 'bg-secondary/30 border-transparent'
                          : 'bg-card border-border hover:border-primary/40'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${item.color} flex-shrink-0`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-medium text-sm truncate ${
                            item.done
                              ? 'line-through text-muted-foreground'
                              : ''
                          }`}
                        >
                          {item.task}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </div>
                      </div>
                      {item.done ? (
                        <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Bottom hint — with link to features */}
              <Link href="/features" className="block group/tip mt-5">
                <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 group-hover/tip:border-primary/40 transition-all group-hover/tip:shadow-lg group-hover/tip:shadow-primary/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
                    <p className="text-sm flex-1">
                      <span className="font-medium">Tip:</span> You focus best in
                      the morning — try scheduling DSA first.
                    </p>
                    <ArrowRight className="w-4 h-4 text-primary group-hover/tip:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Floating decorations (desktop) */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden md:block absolute -top-6 -left-6 w-24 h-24 bg-accent/20 rounded-full blur-xl pointer-events-none"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="hidden md:block absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-xl pointer-events-none"
          />
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-green-500" />
            <span>Free to start</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-green-500" />
            <span>No credit card</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-green-500" />
            <span>Setup in 2 minutes</span>
          </div>
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
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}