// src/components/shared/dsa-tool.section.tsx
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  ArrowRight,
  Target,
  Brain,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Zap,
  Code,
  Rocket,
  Star,
  ExternalLink,
  GraduationCap,
  Clock,
  Award,
  Layers,
  Home,
  ListChecks,
  BarChart3,
  Bell,
} from 'lucide-react'

const DSA_TOOL_URL = 'https://dsa-revision.in/'

/* ============================================================================
   HIGHLIGHTS
   ============================================================================ */

const highlights = [
  {
    icon: Target,
    title: 'NeetCode 150 Curated',
    description: 'The most crucial interview patterns, hand-picked and structured.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Calendar,
    title: 'Daily Missions',
    description: 'Configure your timeline and get personalized daily tasks.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Brain,
    title: 'Pattern-Based Learning',
    description: 'Learn the patterns behind problems, not just the solutions.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Track consistency, streaks, and improvement week over week.',
    color: 'from-orange-500 to-red-500',
  },
]

const stats = [
  { value: '150', label: 'Core Problems', icon: Code },
  { value: '16+', label: 'Patterns', icon: Layers },
  { value: 'Daily', label: 'Missions', icon: Clock },
  { value: '100%', label: 'Free Access', icon: Award },
]

const audiences = [
  '🎓 Final-year students prepping for placements',
  '💼 Working professionals switching jobs',
  '🔄 Anyone navigating layoffs & re-prepping',
  '🚀 Freshers aiming for top product companies',
]

/* ============================================================================
   COMPONENT
   ============================================================================ */

export function DsaToolSection() {
  return (
    <section
      id="dsa-tool"
      className="relative py-14 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* ============================================================
            HEADER
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
            <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Free Tool by the Chronify Family
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="block">Master DSA.</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Ace Your Interviews.
            </span>
          </h2>

          {/* Desktop: full paragraph | Mobile: shorter */}
          <p className="hidden sm:block text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you&apos;re navigating layoffs, seeking your first tech role, or aiming for a
            major career leap — <span className="font-semibold text-foreground">DSA Revision</span>{' '}
            turns the NeetCode 150 into a structured, personalized daily journey.
          </p>
          <p className="sm:hidden text-sm text-muted-foreground max-w-md mx-auto px-2">
            Master the NeetCode 150 with a structured, personalized daily plan.
          </p>
        </motion.div>

        {/* ============================================================
            MOBILE: APP-LIKE PHONE MOCKUP
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:hidden flex justify-center mb-10"
        >
          <div className="relative w-[300px] rounded-[2.5rem] border-[8px] border-gray-900 dark:border-gray-800 bg-gray-900 dark:bg-black shadow-2xl overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 dark:bg-black rounded-b-2xl z-20" />

            {/* Screen */}
            <div className="bg-background pt-8 pb-20 relative min-h-[560px]">
              {/* Status bar */}
              <div className="flex items-center justify-between px-5 py-1 text-[10px] font-medium text-muted-foreground">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span>●●●</span>
                </div>
              </div>

              {/* App header */}
              <div className="px-5 py-4">
                <h4 className="font-bold text-base">Today&apos;s Mission</h4>
                <p className="text-xs text-muted-foreground">
                  Auto-generated for you
                </p>
              </div>

              {/* Progress card */}
              <div className="mx-4 p-4 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium opacity-90">
                    Weekly Progress
                  </span>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-3xl font-bold mb-2">50%</div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '50%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>

              {/* Tasks header */}
              <div className="flex items-center justify-between px-5 mb-3">
                <span className="font-semibold text-sm">Tasks</span>
                <span className="text-xs text-primary font-medium">See all</span>
              </div>

              {/* Task list */}
              <div className="px-4 space-y-2">
                {[
                  { title: 'Arrays & Hashing', done: true, tag: 'Warm-up' },
                  { title: 'Two Pointers', done: true, tag: 'Core' },
                  { title: 'Sliding Window', done: false, tag: 'Focus' },
                  { title: 'Review Mistakes', done: false, tag: 'Revision' },
                ].map((task, i) => (
                  <motion.div
                    key={task.title}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        task.done
                          ? 'bg-green-500 text-white'
                          : 'border-2 border-muted-foreground/30'
                      }`}
                    >
                      {task.done && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span
                      className={`flex-1 text-xs truncate ${
                        task.done
                          ? 'line-through text-muted-foreground'
                          : 'font-medium'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                      {task.tag}
                    </span>
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
        </motion.div>

        {/* ============================================================
            DESKTOP: FULL CONTENT (unchanged)
           ============================================================ */}

        {/* Highlight cards — desktop only */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="relative mb-5">
                  <div
                    className={`absolute inset-0 ${item.color} bg-gradient-to-br opacity-20 blur-xl rounded-full`}
                  />
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg shadow-primary/20`}
                  >
                    <item.icon className="w-7 h-7 text-white" />
                  </motion.div>
                </div>

                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Main showcase — desktop only */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="hidden md:block mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT — Preview Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl opacity-50" />

              <div className="relative bg-card/60 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full translate-y-16 -translate-x-16 blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                      <Zap className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Your Daily DSA Mission</h3>
                      <p className="text-sm text-muted-foreground">
                        Auto-generated. Focused. Effective.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { title: 'Arrays & Hashing — 3 problems', done: true, tag: 'Warm-up' },
                      { title: 'Two Pointers — 2 problems', done: true, tag: 'Core' },
                      { title: 'Sliding Window — 3 problems', done: false, tag: 'Focus' },
                      { title: 'Review: Week 4 mistakes', done: false, tag: 'Revision' },
                    ].map((task, i) => (
                      <motion.div
                        key={task.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 + 0.3 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/60 transition-colors"
                      >
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                            task.done
                              ? 'bg-green-500 text-white'
                              : 'border-2 border-muted-foreground/30'
                          }`}
                        >
                          {task.done && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span
                          className={`flex-1 text-sm ${
                            task.done ? 'line-through text-muted-foreground' : 'font-medium'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                          {task.tag}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium">Today&apos;s progress</span>
                      <span className="font-bold text-primary">50%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '50%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.6 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — Who it's for + CTA */}
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Perfect for <span className="gradient-text">Every Aspirant</span>
              </h3>

              <div className="space-y-4 mb-8">
                {audiences.map((line, index) => (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-transparent to-primary/5 hover:to-primary/10 transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-base">{line}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <a
                  href={DSA_TOOL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button
                    size="lg"
                    className="rounded-xl px-8 py-6 text-lg gap-2 group w-full sm:w-auto"
                  >
                    <Rocket className="w-5 h-5" />
                    Start Free Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>

                <a
                  href={DSA_TOOL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl px-8 py-6 text-lg gap-2 w-full sm:w-auto"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Tool
                  </Button>
                </a>
              </motion.div>

              <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-accent fill-accent" />
                Completely free · No signup wall · Built by developers, for developers
              </p>
            </div>
          </div>
        </motion.div>

        {/* ============================================================
            MOBILE CTA — simple and clean
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:hidden text-center mb-10"
        >
          <a
            href={DSA_TOOL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              size="lg"
              className="rounded-xl w-full py-6 text-base gap-2 group"
            >
              <Rocket className="w-5 h-5" />
              Start Free Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            100% free · No signup needed
          </p>
        </motion.div>

        {/* ============================================================
            STATS STRIP — desktop only
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="hidden md:block relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-3xl blur-2xl opacity-50" />

          <div className="relative bg-card/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-32 -translate-y-32 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full translate-x-32 translate-y-32 blur-3xl" />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  Everything You Need, In One Place
                </h3>
                <p className="text-muted-foreground">
                  Structured preparation that actually sticks
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
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
                        <stat.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                      {stat.value}
                    </div>
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
                <p className="text-lg text-muted-foreground mb-6">
                  Stop guessing what to solve next. Start your{' '}
                  <span className="font-bold text-primary">personalized DSA journey</span> today.
                </p>
                <a
                  href={DSA_TOOL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button
                    size="lg"
                    className="rounded-xl px-10 py-6 text-lg gap-2 group"
                  >
                    <GraduationCap className="w-5 h-5" />
                    Open DSA Revision Tool
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ============================================================
            MOBILE STATS — compact 2×2
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:hidden grid grid-cols-2 gap-3"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="p-3 rounded-2xl bg-card/50 border border-border text-center"
              >
                <div className="p-2 rounded-full bg-primary/10 w-fit mx-auto mb-2">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
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

        .gradient-text {
          background: linear-gradient(
            90deg,
            hsl(var(--primary)),
            hsl(var(--accent)),
            hsl(var(--primary))
          );
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