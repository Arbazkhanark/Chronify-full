// src/app/features/page.tsx
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
  CheckCircle,
  Layers,
  Zap,
  Smartphone,
  Laptop,
  RefreshCw,
  Lock,
  PieChart,
  ListChecks,
  Award,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { HeatmapSection } from '@/components/shared/heatmap.section'

/* ============================================================================
   FEATURES PAGE — FULL DETAILS
   ============================================================================ */

const detailedFeatures = [
  {
    icon: Calendar,
    title: 'Smart Timetable Builder',
    color: 'from-blue-500 to-cyan-500',
    description:
      'Build a timetable that actually fits your life. Chronify lets you add your classes, work hours, study sessions, and personal time — then automatically arranges them into a clean, conflict-free weekly plan.',
    points: [
      'Drag-and-drop blocks for any activity',
      'Auto-adjusts when you add or move tasks',
      'Supports college, work, and self-study schedules',
      'Color-coded categories for instant clarity',
      'Import your existing college timetable in seconds',
      'Works for any timezone or routine',
    ],
  },
  {
    icon: Target,
    title: 'Goal-Based Planning',
    color: 'from-purple-500 to-pink-500',
    description:
      'Set any goal — finish a course, prepare for an exam, learn a new skill — and Chronify breaks it into weekly milestones. Track progress and stay motivated with clear checkpoints.',
    points: [
      'Create goals with deadlines and priorities',
      'Automatic weekly and daily breakdown',
      'Progress bars to see how far you’ve come',
      'Reorder goals as your priorities shift',
      'Celebrate milestones with streak tracking',
      'Works for personal, academic, or career goals',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    color: 'from-green-500 to-emerald-500',
    description:
      'Stay consistent with simple daily check-ins. Mark tasks done, see your streaks grow, and watch your productivity improve week after week.',
    points: [
      'One-tap task completion',
      'Daily and weekly streak counters',
      'Visual progress rings for each goal',
      'Missed task alerts with easy reschedule',
      'Monthly overview of everything you’ve done',
      'No clutter — just what matters',
    ],
  },
  {
    icon: Clock,
    title: 'Time Slot Optimization',
    color: 'from-indigo-500 to-purple-500',
    description:
      'Chronify finds hidden time in your day — commute, lunch breaks, free periods — and suggests small, productive tasks to fill them without overwhelming you.',
    points: [
      'Smart suggestions for short free slots',
      'Uses travel and waiting time productively',
      'Balance between work and rest',
      'Detects when you’re overloading yourself',
      'Suggests breaks before burnout hits',
      'Flexible to your daily rhythm',
    ],
  },
  {
    icon: BarChart3,
    title: 'Weekly Reports',
    color: 'from-cyan-500 to-blue-500',
    description:
      'Every week, get a clean report showing where your time actually went. No confusing charts — just simple, honest insights you can act on.',
    points: [
      'Time distribution across categories',
      'Completed vs planned tasks',
      'Productivity trend over time',
      'Most productive day and hour',
      'Suggestions to improve next week',
      'Exportable as PDF or image',
    ],
  },
  {
    icon: BookOpen,
    title: 'Study Roadmaps',
    color: 'from-violet-500 to-fuchsia-500',
    description:
      'Follow structured, step-by-step roadmaps for any subject. Whether you’re learning to code, preparing for an exam, or picking up a new skill — you always know what to do next.',
    points: [
      'Pre-built roadmaps for popular topics',
      'Custom roadmap creation',
      'Ordered steps with time estimates',
      'Mark steps complete as you go',
      'Share roadmaps with friends',
      'Add your own notes to each step',
    ],
  },
  {
    icon: Timer,
    title: 'Focus Timer',
    color: 'from-rose-500 to-red-500',
    description:
      'A built-in focus timer that helps you enter deep work. Choose your session length, get gentle break reminders, and let Chronify track your focus time automatically.',
    points: [
      'Adjustable session lengths (25/45/60 min)',
      'Automatic break reminders',
      'Silent mode during focus sessions',
      'Tracks total focus time per day',
      'Integrates with your timetable',
      'No ads, no distractions',
    ],
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    color: 'from-amber-500 to-yellow-500',
    description:
      'Gentle nudges that respect your time. Chronify reminds you of upcoming tasks, deadlines, and breaks — without spamming you.',
    points: [
      'Customizable reminder timing',
      'Priority-based reminders',
      'Snooze without losing track',
      'Daily morning summary',
      'End-of-day wrap-up',
      'Works across all devices',
    ],
  },
]

const benefits = [
  {
    icon: Shield,
    title: 'Privacy First',
    description:
      'Your data belongs to you. We use strong encryption, never sell your data, and give you full control to export or delete everything at any time.',
  },
  {
    icon: Users,
    title: 'Community Learning',
    description:
      'Join study groups, share roadmaps, and compare progress with friends. Learning is easier when you’re not alone.',
  },
  {
    icon: Rocket,
    title: 'Ready for What’s Next',
    description:
      'Whether it’s exams, a new job, or a personal project — Chronify helps you prepare with structure and consistency.',
  },
  {
    icon: Smartphone,
    title: 'Anywhere Access',
    description:
      'Open Chronify on your phone, laptop, or tablet. Everything stays in sync so you never lose a beat.',
  },
  {
    icon: RefreshCw,
    title: 'Real-Time Sync',
    description:
      'Mark a task done on your phone and it updates everywhere instantly. No refresh button, no waiting.',
  },
  {
    icon: Lock,
    title: 'Offline Ready',
    description:
      'No internet? No problem. Keep working offline and everything syncs the moment you’re back online.',
  },
]

const stats = [
  { value: '8+', label: 'Built-in Tools' },
  { value: '100%', label: 'Free to Start' },
  { value: '0', label: 'Ads or Spam' },
  { value: '24/7', label: 'Always Available' },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ============================================================
          HERO
         ============================================================ */}
      <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                All Features
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="block">Everything You Need to</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Master Your Time
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Chronify is built from the ground up to help you plan smarter,
              stay consistent, and reach your goals — whatever they may be.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="rounded-xl px-6 py-5 gap-2 group w-full sm:w-auto"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-6 py-5 w-full sm:w-auto"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          STATS
         ============================================================ */}
      <section className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center p-4 sm:p-6 rounded-2xl bg-card/50 border border-border"
              >
                <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          DETAILED FEATURES
         ============================================================ */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Explore Every Feature
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              A deep dive into each tool — what it does and how it helps you.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {detailedFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="relative p-5 sm:p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg shadow-primary/10`}
                      >
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                        {feature.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {feature.points.map((point, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs sm:text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          WHY CHOOSE
         ============================================================ */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Chronify?
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Built with principles that put you first.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="p-5 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-all"
                >
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
         ============================================================ */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Get started in less than 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                step: '01',
                icon: ListChecks,
                title: 'Add Your Routine',
                description:
                  'Enter your classes, work hours, and personal commitments.',
              },
              {
                step: '02',
                icon: Zap,
                title: 'Let Chronify Plan',
                description:
                  'Get a personalized weekly timetable with smart time slots.',
              },
              {
                step: '03',
                icon: Award,
                title: 'Track & Improve',
                description:
                  'Check off tasks, follow your streak, and watch progress grow.',
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative p-5 sm:p-6 rounded-2xl bg-card/50 border border-border text-center"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold">
                    {item.step}
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4 mt-2">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ
         ============================================================ */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              {
                q: 'Is Chronify free to use?',
                a: 'Yes. You can start completely free with no credit card required. Premium features may be added later, but the core experience will always be accessible.',
              },
              {
                q: 'Does it work on mobile and desktop?',
                a: 'Yes. Chronify works on any device — phone, tablet, or laptop — and stays in sync automatically.',
              },
              {
                q: 'Can I use it for goals other than studying?',
                a: 'Absolutely. Chronify is built for anyone who wants to manage time better — students, professionals, hobbyists, and more.',
              },
              {
                q: 'Is my data safe?',
                a: 'Yes. We use strong encryption and never sell your data. You can export or delete everything at any time.',
              },
              {
                q: 'Do I need to be tech-savvy to use it?',
                a: 'Not at all. Chronify is designed to be simple and intuitive. If you can use a calendar app, you can use Chronify.',
              },
            ].map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="p-4 sm:p-5 rounded-2xl bg-card/50 border border-border"
              >
                <h3 className="font-bold text-sm sm:text-base mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
         ============================================================ */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <Rocket className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-medium">
                Start Today
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Take Control of Your Time,
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Starting Now
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of people who use Chronify to plan smarter, stay
              consistent, and reach their goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="rounded-xl px-8 py-6 text-base gap-2 group w-full sm:w-auto"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 py-6 text-base w-full sm:w-auto"
                >
                  Back to Home
                </Button>
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground mt-4">
              Free to start • No credit card • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>


      {/* ============================================================
    HEATMAP SECTION
   ============================================================ */}
<section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-5xl mx-auto">
    <div className="text-center mb-10 sm:mb-14">
      <h2 className="text-2xl sm:text-4xl font-bold mb-3">
        See Your Progress at a Glance
      </h2>
      <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
        Our heatmap shows your daily activity over time — spot your streaks,
        notice your slumps, and stay consistent.
      </p>
    </div>

    <HeatmapSection />
  </div>
</section>

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
    </div>
  )
}