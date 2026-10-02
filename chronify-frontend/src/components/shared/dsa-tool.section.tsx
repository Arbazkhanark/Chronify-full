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
} from 'lucide-react'
import Link from 'next/link'

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
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Effects (matches FeaturesSection) */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      {/* Animated dot grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* ============ Header ============ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Free Tool by the Chronify Family
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="block">Master DSA.</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Ace Your Interviews.
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Whether you&apos;re navigating layoffs, seeking your first tech role, or aiming for a
            major career leap — <span className="font-semibold text-foreground">DSA Revision</span>{' '}
            turns the NeetCode 150 into a structured, personalized daily journey.
          </motion.p>
        </motion.div>

        {/* ============ Highlight Cards Grid ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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
              {/* Animated background */}
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

        {/* ============ Main Showcase (2-column) ============ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT — Preview Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl opacity-50" />

              <div className="relative bg-card/60 backdrop-blur-sm rounded-2xl p-8 border border-border shadow-2xl overflow-hidden">
                {/* Decorative blobs */}
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

                  {/* Mock mission list */}
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

                  {/* Progress bar */}
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

        {/* ============ Stats Strip ============ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
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

              {/* Final CTA */}
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
      </div>

      {/* Same animation CSS as FeaturesSection */}
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