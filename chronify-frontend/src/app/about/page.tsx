// src/app/about/page.tsx
'use client'

import { motion } from 'framer-motion'
import {
  Sparkles,
  Rocket,
  Target,
  Users,
  Heart,
  Zap,
  Shield,
  TrendingUp,
  Globe,
  Lightbulb,
  Code,
  Coffee,
  Star,
  ArrowRight,
  CheckCircle,
  Linkedin,
  Github,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* ============================================================================
   ABOUT PAGE
   ============================================================================ */

const values = [
  {
    icon: Target,
    title: 'Simplicity First',
    description:
      'No clutter, no confusion. Every feature exists because it makes your life easier.',
  },
  {
    icon: Heart,
    title: 'Built With Care',
    description:
      'Every detail is designed thoughtfully — from colors to copy to interactions.',
  },
  {
    icon: Shield,
    title: 'Privacy by Default',
    description:
      'Your data belongs to you. We never sell it, share it, or use it against you.',
  },
  {
    icon: Zap,
    title: 'Speed Matters',
    description:
      'Fast, responsive, and always available. No delays, no waiting.',
  },
]

const milestones = [
  {
    year: '2024',
    title: 'The Idea',
    description:
      'Frustrated by scattered tools and messy timetables, we asked — why isn\'t there one simple place for this?',
  },
  {
    year: '2024',
    title: 'First Prototype',
    description:
      'A weekend project turned into weeks of building. The first version had just a timetable and task list.',
  },
  {
    year: '2025',
    title: 'Growing Fast',
    description:
      'Word spread. Students, professionals, and hobbyists joined to plan smarter and stay consistent.',
  },
  {
    year: '2026',
    title: 'Built for Everyone',
    description:
      'What started for students now helps anyone who wants to take control of their time.',
  },
]

const team = [
  {
    name: 'Arbaz Khan',
    role: 'Founder & Developer',
    bio: 'Built Chronify from scratch — from design to code. Passionate about clean UX and honest products.',
    avatar: 'AK',
    color: 'from-blue-500 to-cyan-500',
    linkedin: 'https://linkedin.com/in/arbaz-khan-0bb1aa1a0',
    github: 'https://github.com/Arbazkhanark',
    email: 'arbaazkhanark23@gmail.com',
  },
]

const stats = [
  { value: '10K+', label: 'Active Users', icon: Users },
  { value: '500K+', label: 'Tasks Completed', icon: CheckCircle },
  { value: '4.8★', label: 'Average Rating', icon: Star },
  { value: '24/7', label: 'Always Available', icon: Globe },
]

const principles = [
  {
    icon: Lightbulb,
    title: 'Built by users, for users',
    description:
      'We use Chronify daily. Every improvement comes from real pain points — ours and yours.',
  },
  {
    icon: Code,
    title: 'Quality over quantity',
    description:
      'We\'d rather ship 5 excellent features than 50 average ones. Every release is polished.',
  },
  {
    icon: Coffee,
    title: 'Made with love',
    description:
      'Late nights, lots of coffee, and an obsession with getting the little details right.',
  },
]

export default function AboutPage() {
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
                Our Story
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="block">We Built Chronify</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                For People Like You
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Chronify started as a personal project to solve one simple
              problem: staying consistent is hard, but it shouldn&apos;t be.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          STATS
         ============================================================ */}
      <section className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="text-center p-4 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border"
                >
                  <div className="flex justify-center mb-2 sm:mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          STORY / WHY
         ============================================================ */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Rocket className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Why We Exist
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              A Simple Idea, Built Right
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Too many apps. Too many tabs. Too many reminders scattered across
              your phone. We built Chronify because we were tired of juggling
              five different tools just to stay organized.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {[
              {
                icon: Target,
                title: 'One place for everything',
                desc: 'Timetables, tasks, goals, and progress — all together.',
              },
              {
                icon: Zap,
                title: 'Fast and simple',
                desc: 'No learning curve. Open it, use it, done.',
              },
              {
                icon: Heart,
                title: 'Designed with care',
                desc: 'Every screen, every button is intentional.',
              },
              {
                icon: TrendingUp,
                title: 'Built to grow with you',
                desc: 'Start simple, unlock more as you need it.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-card/50 border border-border hover:border-primary/30 transition-all"
                >
                  <div className="p-2 sm:p-2.5 rounded-lg bg-primary/10 flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          VALUES
         ============================================================ */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              What We Stand For
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Four simple principles that guide every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="p-5 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-all text-center"
                >
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base mb-2">
                    {value.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          TIMELINE
         ============================================================ */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Rocket className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Our Journey
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              How We Got Here
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              From weekend project to a product used by thousands.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line — desktop */}
            <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

            <div className="space-y-6 sm:space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative sm:grid sm:grid-cols-2 sm:gap-8 ${
                    index % 2 === 0 ? '' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Desktop layout */}
                  <div
                    className={`hidden sm:block ${
                      index % 2 === 0 ? 'sm:text-right sm:pr-8' : 'sm:col-start-2 sm:pl-8'
                    }`}
                  >
                    <div className="p-5 rounded-2xl bg-card/50 border border-border">
                      <span className="text-xs font-bold text-primary mb-2 inline-block">
                        {milestone.year}
                      </span>
                      <h3 className="font-bold text-base mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Center dot — desktop */}
                  <div className="hidden sm:block absolute left-1/2 top-6 w-3 h-3 rounded-full bg-primary -translate-x-1/2 border-2 border-background z-10" />

                  {/* Mobile layout */}
                  <div className="sm:hidden flex items-start gap-3">
                    <div className="flex flex-col items-center flex-shrink-0 pt-1">
                      <div className="w-3 h-3 rounded-full bg-primary border-2 border-background z-10" />
                      <div className="w-px flex-1 bg-border mt-1" />
                    </div>
                    <div className="flex-1 pb-2">
                      <span className="text-xs font-bold text-primary mb-1 inline-block">
                        {milestone.year}
                      </span>
                      <h3 className="font-bold text-sm mb-1.5">
                        {milestone.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TEAM
         ============================================================ */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Users className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                The Team
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Who&apos;s Behind Chronify
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              A small team with a big mission — help people take control of
              their time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-all text-center"
              >
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/10`}
                >
                  <span className="text-2xl font-bold text-white">
                    {member.avatar}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-1">{member.name}</h3>
                <p className="text-xs text-primary font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {member.bio}
                </p>
                <div className="flex items-center justify-center gap-2">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                      aria-label="GitHub"
                    >
                      <Github className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                      aria-label="Email"
                    >
                      <Mail className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PRINCIPLES
         ============================================================ */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              How We Build
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Principles we follow while shipping every feature.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {principles.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-5 sm:p-6 rounded-2xl bg-card/50 border border-border text-center"
                >
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base mb-2">
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
          CTA
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
                Join the Journey
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Ready to Take Control
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                of Your Time?
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of people who plan smarter and achieve more with
              Chronify.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="rounded-xl px-8 py-6 text-base gap-2 group w-full sm:w-auto"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 py-6 text-base w-full sm:w-auto"
                >
                  Contact Us
                </Button>
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground mt-4">
              No credit card • Free forever plan available
            </p>
          </motion.div>
        </div>
      </section>

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
    </div>
  )
}