// src/components/shared/how.it.works.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  SkipBack,
  Home,
  ListChecks,
  BarChart3,
  Bell,
  GraduationCap,
  Laptop,
  Brain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* ============================================================================
   HOW IT WORKS
   Mobile  → compact stepper inside phone-like layout
   Desktop → full two-column with sticky preview
   ============================================================================ */

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const steps = [
    {
      step: '01',
      icon: Target,
      title: 'Define Your Goals',
      description:
        'Set clear targets with deadlines and priority levels for studies, work, and personal life.',
      details: [
        'Add goals with target dates',
        'Set priority levels for each',
        'Break big goals into milestones',
        'Track everything in one place',
      ],
    },
    {
      step: '02',
      icon: Calendar,
      title: 'Sync Your Schedule',
      description:
        'Add your classes, work hours, and personal commitments for accurate planning.',
      details: [
        'Add college or work timetable',
        'Set commute time and mode',
        'Mark personal time blocks',
        'Define study preferences',
      ],
    },
    {
      step: '03',
      icon: Settings,
      title: 'Get Your Plan',
      description:
        'Chronify builds an optimized weekly schedule that balances all your priorities.',
      details: [
        'Balances study, work, and rest',
        'Uses commute time efficiently',
        'Adds buffer time for flexibility',
        'Schedules weekly review sessions',
      ],
    },
    {
      step: '04',
      icon: CheckCircle,
      title: 'Track Daily Progress',
      description:
        'Check off tasks and log your time to stay consistent and see your streaks grow.',
      details: [
        'One-tap daily check-ins',
        'Built-in focus timer',
        'Automatic time logging',
        'Distraction-free sessions',
      ],
    },
    {
      step: '05',
      icon: TrendingUp,
      title: 'Review Insights',
      description:
        'Get weekly reports on your performance and simple suggestions to improve.',
      details: [
        'Time distribution overview',
        'Goal achievement rates',
        'Productivity trends',
        'Personalized recommendations',
      ],
    },
    {
      step: '06',
      icon: UserPlus,
      title: 'Achieve & Grow',
      description:
        'Hit your targets and take on new challenges with continuous optimization.',
      details: [
        'Smart difficulty progression',
        'Performance-based challenges',
        'Peer comparison (optional)',
        'Achievement milestones',
      ],
    },
  ]

  /* Auto-play */
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveStep((prev) => {
          if (prev === steps.length - 1) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 3000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, steps.length])

  const handlePlayToggle = () => {
    setIsPlaying((prev) => !prev)
  }

  const handleStepClick = (index: number) => {
    setActiveStep(index)
    setIsPlaying(false)
  }

  const handleNext = () => {
    setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))
    setIsPlaying(false)
  }

  const handlePrev = () => {
    setActiveStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1))
    setIsPlaying(false)
  }

  const CurrentIcon = steps[activeStep].icon

  return (
    <section className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
      <div className="absolute -top-40 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* ============================================================
            HEADER
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Play className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Simple 6-Step Process
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            How Chronify Works
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple six-step process to turn your daily routine into real
            progress.
          </p>
        </motion.div>

        {/* ============================================================
            MOBILE: APP-LIKE STEPPER
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:hidden"
        >
          {/* Compact step tabs — horizontal scroll */}
          <div className="overflow-x-auto -mx-4 px-4 pb-3 mb-5">
            <div className="flex gap-2 min-w-max">
              {steps.map((s, index) => {
                const Icon = s.icon
                return (
                  <button
                    key={s.step}
                    onClick={() => handleStepClick(index)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      index === activeStep
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{s.step}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Phone frame with preview */}
          <div className="flex justify-center mb-4">
            <div className="relative w-[300px] rounded-[2.5rem] border-[8px] border-gray-900 dark:border-gray-800 bg-gray-900 dark:bg-black shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 dark:bg-black rounded-b-2xl z-20" />

              {/* Screen */}
              <div className="bg-background pt-8 pb-20 relative min-h-[480px]">
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 py-1 text-[10px] font-medium text-muted-foreground">
                  <span>9:41</span>
                  <span>●●●</span>
                </div>

                {/* App header with step info */}
                <div className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl bg-gradient-to-br from-primary to-accent flex-shrink-0`}
                    >
                      <CurrentIcon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-muted-foreground">
                        Step {steps[activeStep].step}
                      </div>
                      <div className="font-bold text-sm truncate">
                        {steps[activeStep].title}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
                    {steps[activeStep].description}
                  </p>
                </div>

                {/* Visualization preview */}
                <div className="px-4 pb-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Step 1 — Goals */}
                      {activeStep === 0 && (
                        <div className="space-y-2.5">
                          {[
                            { label: 'Learning Goals', progress: 65, color: 'bg-blue-500' },
                            { label: 'Study Targets', progress: 80, color: 'bg-green-500' },
                            { label: 'Project Work', progress: 45, color: 'bg-purple-500' },
                            { label: 'Skill Building', progress: 30, color: 'bg-orange-500' },
                          ].map((item, i) => (
                            <div
                              key={item.label}
                              className="p-2.5 rounded-xl bg-card border border-border"
                            >
                              <div className="flex justify-between text-[10px] mb-1.5">
                                <span className="font-medium">{item.label}</span>
                                <span className="text-muted-foreground">
                                  {item.progress}%
                                </span>
                              </div>
                              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.progress}%` }}
                                  transition={{ duration: 0.8, delay: i * 0.1 }}
                                  className={`h-full rounded-full ${item.color}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Step 2 — Schedule */}
                      {activeStep === 1 && (
                        <div className="space-y-2.5">
                          <div className="grid grid-cols-3 gap-1.5">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                              (day) => (
                                <div
                                  key={day}
                                  className="text-center p-2 rounded-lg bg-secondary"
                                >
                                  <div className="text-[10px] font-medium">
                                    {day}
                                  </div>
                                  <div className="text-[9px] text-muted-foreground">
                                    Classes
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                          {[
                            { label: 'College Hours', value: '9:30 - 4:45' },
                            { label: 'Commute', value: '2 hrs daily' },
                            { label: 'Personal Time', value: 'Evenings' },
                          ].map((row) => (
                            <div
                              key={row.label}
                              className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border text-[11px]"
                            >
                              <span className="text-muted-foreground">
                                {row.label}
                              </span>
                              <span className="font-medium">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Step 3 — Plan */}
                      {activeStep === 2 && (
                        <div className="space-y-2">
                          {[
                            { time: '6:30', task: 'Morning Routine', icon: Home },
                            { time: '7:10', task: 'Audio Learning', icon: Laptop },
                            { time: '9:30', task: 'College Hours', icon: GraduationCap },
                            { time: '5:10', task: 'Revision Time', icon: Brain },
                            { time: '9:00', task: 'Deep Work', icon: Target },
                          ].map((item, i) => {
                            const Icon = item.icon
                            return (
                              <motion.div
                                key={item.time}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-card border border-border"
                              >
                                <div className="p-1.5 rounded-lg bg-primary/10 flex-shrink-0">
                                  <Icon className="w-3 h-3 text-primary" />
                                </div>
                                <div className="text-[10px] text-muted-foreground w-10 flex-shrink-0">
                                  {item.time}
                                </div>
                                <div className="text-[11px] font-medium truncate flex-1">
                                  {item.task}
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      )}

                      {/* Step 4 — Track */}
                      {activeStep === 3 && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] opacity-90">
                                Today&apos;s Progress
                              </span>
                              <span className="text-xs font-bold">6/8</span>
                            </div>
                            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '75%' }}
                                transition={{ duration: 0.8 }}
                                className="h-full bg-white rounded-full"
                              />
                            </div>
                          </div>
                          {[
                            { task: 'Learning Session', done: true },
                            { task: 'College Notes', done: true },
                            { task: 'Project Work', done: false },
                            { task: 'Skill Learning', done: true },
                          ].map((item) => (
                            <div
                              key={item.task}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-card border border-border"
                            >
                              <div
                                className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 ${
                                  item.done
                                    ? 'bg-green-500 text-white'
                                    : 'border-2 border-muted-foreground/30'
                                }`}
                              >
                                {item.done && (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                              </div>
                              <span
                                className={`text-[11px] ${
                                  item.done
                                    ? 'line-through text-muted-foreground'
                                    : 'font-medium'
                                }`}
                              >
                                {item.task}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Step 5 — Insights */}
                      {activeStep === 4 && (
                        <div className="space-y-2.5">
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: 'Focus Time', value: '18.5h', trend: '+12%' },
                              { label: 'Study Time', value: '12h', trend: '+8%' },
                              { label: 'Productivity', value: '92%', trend: '+5%' },
                              { label: 'Consistency', value: '85%', trend: '+15%' },
                            ].map((stat) => (
                              <div
                                key={stat.label}
                                className="p-2.5 rounded-xl bg-card border border-border text-center"
                              >
                                <div className="text-[9px] text-muted-foreground">
                                  {stat.label}
                                </div>
                                <div className="text-sm font-bold">
                                  {stat.value}
                                </div>
                                <div className="text-[9px] text-green-500">
                                  {stat.trend} ↑
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 6 — Achieve */}
                      {activeStep === 5 && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 text-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-2">
                              <CheckCircle className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div className="font-bold text-xs">
                              Target Achieved!
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              You crushed your goal
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: 'Next Goal', value: 'Advanced Topic' },
                              { label: 'Time Frame', value: '6 weeks' },
                              { label: 'Your Rank', value: 'Top 15%' },
                              { label: 'New Level', value: 'Unlocked' },
                            ].map((item) => (
                              <div
                                key={item.label}
                                className="p-2 rounded-lg bg-card border border-border"
                              >
                                <div className="text-[9px] text-muted-foreground">
                                  {item.label}
                                </div>
                                <div className="text-[11px] font-medium">
                                  {item.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Bottom nav */}
                <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border">
                  <div className="flex items-center justify-around py-2.5">
                    {[Home, ListChecks, BarChart3, Bell].map((Icon, i) => (
                      <Icon
                        key={i}
                        className={`w-5 h-5 ${
                          i === 0 ? 'text-primary' : 'text-muted-foreground'
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

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-full h-9 w-9"
              aria-label="Previous step"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayToggle}
              className="rounded-full h-9 w-9"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full h-9 w-9"
              aria-label="Next step"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Step indicator dots */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                aria-label={`Go to step ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeStep
                    ? 'w-6 bg-primary'
                    : index < activeStep
                      ? 'w-1.5 bg-primary/40'
                      : 'w-1.5 bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Mobile CTA */}
          <Link href="/dashboard" className="block">
            <Button className="w-full rounded-xl py-5 text-sm gap-2">
              Start Your Journey
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-[11px] text-muted-foreground mt-3 text-center">
            Join thousands who have improved their productivity with Chronify
          </p>
        </motion.div>

        {/* ============================================================
            DESKTOP: TWO-COLUMN
           ============================================================ */}
        <div className="hidden md:block">
          {/* Step tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <button
                  key={step.step}
                  onClick={() => handleStepClick(index)}
                  className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                    activeStep === index
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {step.title.split(' ')[0]}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-full h-10 w-10"
              aria-label="Previous step"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayToggle}
              className="rounded-full h-10 w-10"
              aria-label={isPlaying ? 'Pause' : 'Play'}
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
              aria-label="Next step"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left — Steps list */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => handleStepClick(index)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer ${
                    activeStep === index
                      ? 'border-primary/40 bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                        activeStep === index
                          ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {step.step}
                        </span>
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        {activeStep === index && (
                          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground mb-3 text-sm">
                        {step.description}
                      </p>

                      <div className="space-y-1.5">
                        {step.details.map((detail, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right — Sticky preview */}
            <div className="lg:sticky lg:top-24 self-start">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <CurrentIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Step {steps[activeStep].step}
                    </div>
                    <h3 className="text-xl font-semibold">
                      {steps[activeStep].title}
                    </h3>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* Step 1 — Goals */}
                  {activeStep === 0 && (
                    <motion.div
                      key="goals"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {[
                        { label: 'Learning Goals', progress: 65, priority: 'High', color: 'bg-blue-500' },
                        { label: 'Study Targets', progress: 80, priority: 'Medium', color: 'bg-green-500' },
                        { label: 'Project Work', progress: 45, priority: 'Low', color: 'bg-purple-500' },
                        { label: 'Skill Building', progress: 30, priority: 'Flexible', color: 'bg-orange-500' },
                      ].map((item, index) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span>{item.label}</span>
                            <span className="text-muted-foreground">
                              {item.priority}
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-full rounded-full ${item.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Step 2 — Schedule */}
                  {activeStep === 1 && (
                    <motion.div
                      key="schedule"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                          (day) => (
                            <div
                              key={day}
                              className="text-center p-2 rounded bg-secondary"
                            >
                              <div className="text-sm font-medium">{day}</div>
                              <div className="text-xs text-muted-foreground">
                                Classes
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        {[
                          { label: 'College Hours', value: '9:30 AM - 4:45 PM' },
                          { label: 'Commute Time', value: '2 hours daily' },
                          { label: 'Personal Time', value: 'Evenings & Weekends' },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50"
                          >
                            <span>{row.label}</span>
                            <span className="font-medium">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 — Plan */}
                  {activeStep === 2 && (
                    <motion.div
                      key="plan"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      {[
                        { time: '6:30-7:00', task: 'Morning Routine', type: 'Personal' },
                        { time: '7:10-9:10', task: 'Commute: Audio Learning', type: 'Learning' },
                        { time: '9:30-4:45', task: 'College + Breaks', type: 'Mixed' },
                        { time: '5:10-7:30', task: 'Commute: Revision', type: 'Learning' },
                        { time: '9:00-10:30', task: 'Deep Work Session', type: 'Focus' },
                      ].map((item, index) => (
                        <motion.div
                          key={item.time}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08 }}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border"
                        >
                          <div className="w-20 text-sm font-medium">
                            {item.time}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {item.task}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.type}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Step 4 — Track */}
                  {activeStep === 3 && (
                    <motion.div
                      key="tracking"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Today&apos;s Progress</span>
                        <span className="font-semibold text-primary">
                          6/8 tasks
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {['M', 'T', 'W', 'T', 'F'].map((day, index) => (
                          <div key={index} className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">
                              {day}
                            </div>
                            <div
                              className={`h-8 w-8 rounded flex items-center justify-center mx-auto ${
                                index < 3
                                  ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                                  : 'bg-secondary text-muted-foreground border border-border'
                              }`}
                            >
                              {index < 3 ? '✓' : index === 3 ? '5' : '4'}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        {[
                          { task: 'Learning Session', completed: true },
                          { task: 'College Notes', completed: true },
                          { task: 'Project Work', completed: false },
                          { task: 'Skill Learning', completed: true },
                        ].map((item) => (
                          <div
                            key={item.task}
                            className="flex items-center gap-3"
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center ${
                                item.completed
                                  ? 'border-green-500 bg-green-500/10 text-green-600'
                                  : 'border-border'
                              }`}
                            >
                              {item.completed && (
                                <CheckCircle className="w-3 h-3" />
                              )}
                            </div>
                            <span className="text-sm">{item.task}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5 — Insights */}
                  {activeStep === 4 && (
                    <motion.div
                      key="analytics"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                          { label: 'Focus Time', value: '18.5h', change: '+12%' },
                          { label: 'Study Time', value: '12h', change: '+8%' },
                          { label: 'Productivity', value: '92%', change: '+5%' },
                          { label: 'Consistency', value: '85%', change: '+15%' },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className="p-3 rounded-lg border border-border text-center"
                          >
                            <div className="text-xs text-muted-foreground mb-1">
                              {stat.label}
                            </div>
                            <div className="text-lg font-semibold">
                              {stat.value}
                            </div>
                            <div className="text-xs text-green-600">
                              {stat.change} ↑
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground p-3 rounded-lg bg-secondary/50">
                        Based on last week&apos;s performance, we suggest
                        increasing focus time by 15%.
                      </div>
                    </motion.div>
                  )}

                  {/* Step 6 — Achieve */}
                  {activeStep === 5 && (
                    <motion.div
                      key="achievement"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <div className="font-semibold">Target Achieved!</div>
                            <div className="text-sm text-muted-foreground">
                              You completed your goal
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Next Goal', value: 'Advanced Topic' },
                          { label: 'Time Frame', value: '6 weeks' },
                          { label: 'Your Rank', value: 'Top 15%' },
                          { label: 'New Level', value: 'Unlocked' },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="p-3 rounded border border-border"
                          >
                            <div className="text-xs text-muted-foreground">
                              {item.label}
                            </div>
                            <div className="font-medium">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Progress */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      Step {activeStep + 1} of {steps.length}
                    </span>
                    <div className="flex items-center gap-1">
                      {steps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === activeStep
                              ? 'bg-primary'
                              : index < activeStep
                                ? 'bg-primary/30'
                                : 'bg-secondary'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-center"
              >
                <Link href="/dashboard" className="block">
                  <Button className="w-full rounded-lg py-6 text-base gap-2">
                    Start Your Journey
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground mt-3">
                  Join thousands who have improved their productivity with
                  Chronify
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}