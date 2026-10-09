// src/app/pricing/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  X,
  Sparkles,
  Crown,
  Zap,
  Rocket,
  Star,
  ArrowRight,
  HelpCircle,
  Shield,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
  Bell,
  Timer,
  BookOpen,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* ============================================================================
   PRICING PAGE
   ============================================================================ */

const plans = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Perfect to get started',
    icon: Sparkles,
    color: 'from-gray-500 to-gray-700',
    price: { monthly: 0, yearly: 0 },
    cta: 'Start Free',
    ctaHref: '/auth/register',
    popular: false,
    features: [
      { text: 'Up to 3 active goals', included: true },
      { text: 'Basic timetable builder', included: true },
      { text: 'Daily task check-ins', included: true },
      { text: 'Weekly progress report', included: true },
      { text: 'Focus timer (25 min only)', included: true },
      { text: 'Smart reminders', included: true },
      { text: 'Unlimited goals', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'Study roadmaps', included: false },
      { text: 'Calendar sync', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For serious learners',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    price: { monthly: 199, yearly: 1990 },
    cta: 'Get Pro',
    ctaHref: '/auth/register?plan=pro',
    popular: true,
    features: [
      { text: 'Unlimited active goals', included: true },
      { text: 'Advanced timetable builder', included: true },
      { text: 'Daily check-ins + streaks', included: true },
      { text: 'Detailed weekly reports', included: true },
      { text: 'Focus timer (any duration)', included: true },
      { text: 'Smart reminders', included: true },
      { text: 'Study roadmaps', included: true },
      { text: 'Calendar sync (Google, iCal)', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Advanced analytics', included: false },
      { text: 'Team features', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Everything unlocked',
    icon: Crown,
    color: 'from-purple-500 to-pink-500',
    price: { monthly: 399, yearly: 3990 },
    cta: 'Go Premium',
    ctaHref: '/auth/register?plan=premium',
    popular: false,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'Heatmap & time breakdown', included: true },
      { text: 'Custom study roadmaps', included: true },
      { text: 'Multi-device real-time sync', included: true },
      { text: 'Offline mode', included: true },
      { text: 'Data export (PDF, CSV)', included: true },
      { text: 'Priority 24/7 support', included: true },
      { text: 'Early access to new features', included: true },
      { text: 'Team features', included: false },
      { text: 'Custom integrations', included: false },
    ],
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'For study groups & teams',
    icon: Users,
    color: 'from-orange-500 to-red-500',
    price: { monthly: 999, yearly: 9990 },
    cta: 'Contact Sales',
    ctaHref: '/contact',
    popular: false,
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Up to 10 members', included: true },
      { text: 'Shared timetables', included: true },
      { text: 'Group goals & progress', included: true },
      { text: 'Team leaderboard', included: true },
      { text: 'Admin dashboard', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Onboarding & training', included: true },
      { text: 'Custom invoicing', included: true },
      { text: 'SLA & uptime guarantee', included: true },
    ],
  },
]

const comparisonFeatures = [
  {
    category: 'Core Features',
    icon: Layers,
    items: [
      { name: 'Active Goals', free: '3', pro: 'Unlimited', premium: 'Unlimited', team: 'Unlimited' },
      { name: 'Timetable Builder', free: 'Basic', pro: 'Advanced', premium: 'Advanced', team: 'Advanced' },
      { name: 'Daily Check-ins', free: true, pro: true, premium: true, team: true },
      { name: 'Streak Tracking', free: true, pro: true, premium: true, team: true },
    ],
  },
  {
    category: 'Productivity',
    icon: Timer,
    items: [
      { name: 'Focus Timer', free: '25 min', pro: 'Any duration', premium: 'Any duration', team: 'Any duration' },
      { name: 'Smart Reminders', free: true, pro: true, premium: true, team: true },
      { name: 'Study Roadmaps', free: false, pro: true, premium: true, team: true },
      { name: 'Custom Roadmaps', free: false, pro: false, premium: true, team: true },
    ],
  },
  {
    category: 'Analytics',
    icon: BarChart3,
    items: [
      { name: 'Weekly Reports', free: 'Basic', pro: 'Detailed', premium: 'Advanced', team: 'Advanced' },
      { name: 'Heatmap View', free: false, pro: false, premium: true, team: true },
      { name: 'Time Breakdown', free: false, pro: false, premium: true, team: true },
      { name: 'Data Export', free: false, pro: false, premium: true, team: true },
    ],
  },
  {
    category: 'Sync & Access',
    icon: Calendar,
    items: [
      { name: 'Multi-Device Sync', free: false, pro: 'Basic', premium: 'Real-time', team: 'Real-time' },
      { name: 'Calendar Sync', free: false, pro: true, premium: true, team: true },
      { name: 'Offline Mode', free: false, pro: false, premium: true, team: true },
      { name: 'Custom Integrations', free: false, pro: false, premium: false, team: true },
    ],
  },
  {
    category: 'Support',
    icon: Shield,
    items: [
      { name: 'Support', free: 'Community', pro: 'Email', premium: '24/7 Priority', team: 'Dedicated' },
      { name: 'Early Access', free: false, pro: false, premium: true, team: true },
      { name: 'Onboarding', free: false, pro: false, premium: false, team: true },
      { name: 'SLA Guarantee', free: false, pro: false, premium: false, team: true },
    ],
  },
]

const faqs = [
  {
    q: 'Can I switch plans anytime?',
    a: 'Yes. You can upgrade, downgrade, or cancel your plan at any time from your account settings. Changes take effect immediately, and we prorate the difference.',
  },
  {
    q: 'Do you offer a free trial?',
    a: 'Yes. All paid plans come with a 14-day free trial. No credit card required to start.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards, UPI, net banking, and PayPal. For Team plans, we also offer bank transfers and custom invoicing.',
  },
  {
    q: 'Is there a student discount?',
    a: 'Yes! Students with a valid ID get 30% off on all paid plans. Email us at support@chronify.app to get your discount code.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. No lock-in, no hidden fees. Cancel in one click and you’ll keep access until the end of your billing period.',
  },
  {
    q: 'What happens to my data if I downgrade?',
    a: 'Your data stays safe. If you downgrade, you’ll keep read-only access to everything above your new plan’s limits.',
  },
]

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const formatPrice = (amount: number) => {
    if (amount === 0) return 'Free'
    return `₹${amount}`
  }

  const getPeriod = () => {
    if (billing === 'monthly') return '/mo'
    return '/yr'
  }

  const getSavings = (monthly: number, yearly: number) => {
    if (monthly === 0) return null
    const yearlyIfMonthly = monthly * 12
    const savings = Math.round(((yearlyIfMonthly - yearly) / yearlyIfMonthly) * 100)
    return savings > 0 ? savings : null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ============================================================
          HERO
         ============================================================ */}
      <section className="relative pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
                Simple, Honest Pricing
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="block">Pick the Plan That</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Fits Your Journey
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Start free, upgrade when you&apos;re ready. No hidden fees, no
              surprises — just tools that help you get things done.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-secondary border border-border">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  billing === 'monthly'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                  billing === 'yearly'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Yearly
                <span className="hidden sm:inline px-1.5 py-0.5 text-[10px] rounded-full bg-green-500/20 text-green-600 dark:text-green-400 font-bold">
                  SAVE 17%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          PLANS GRID
         ============================================================ */}
      <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              const savings = getSavings(plan.price.monthly, plan.price.yearly)
              const price =
                billing === 'monthly' ? plan.price.monthly : plan.price.yearly

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative rounded-3xl p-5 sm:p-6 border-2 transition-all ${
                    plan.popular
                      ? 'border-primary shadow-2xl shadow-primary/20 bg-gradient-to-b from-primary/5 to-transparent'
                      : 'border-border bg-card/50 backdrop-blur-sm hover:border-primary/40'
                  }`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] sm:text-xs font-bold shadow-lg">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Icon + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg shadow-primary/10`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg">
                        {plan.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {plan.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {formatPrice(price)}
                      </span>
                      {price > 0 && (
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {getPeriod()}
                        </span>
                      )}
                    </div>
                    {billing === 'yearly' && savings && (
                      <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                        Save {savings}% vs monthly
                      </p>
                    )}
                    {plan.price.monthly === 0 && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        Free forever, no card needed
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link href={plan.ctaHref} className="block mb-5">
                    <Button
                      className={`w-full rounded-xl py-5 text-xs sm:text-sm font-semibold ${
                        plan.popular
                          ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground'
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  {/* Feature list */}
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[11px] sm:text-xs"
                      >
                        {feature.included ? (
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included
                              ? 'text-foreground'
                              : 'text-muted-foreground/60 line-through'
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          COMPARISON TABLE
         ============================================================ */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Layers className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Compare in Detail
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Full Feature Comparison
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              See exactly what&apos;s included in each plan — nothing hidden.
            </p>
          </div>

          {/* Mobile: card-based comparison | Desktop: table */}
          <div className="hidden md:block rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-secondary/50 border-b border-border">
              <div className="font-semibold text-sm">Features</div>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`text-center font-semibold text-sm ${
                    plan.popular ? 'text-primary' : ''
                  }`}
                >
                  {plan.name}
                </div>
              ))}
            </div>

            {/* Categories */}
            {comparisonFeatures.map((cat) => {
              const CatIcon = cat.icon
              return (
                <div key={cat.category}>
                  <div className="flex items-center gap-2 px-6 py-3 bg-secondary/30 border-b border-border">
                    <CatIcon className="w-4 h-4 text-primary" />
                    <span className="font-bold text-xs uppercase tracking-wide text-muted-foreground">
                      {cat.category}
                    </span>
                  </div>
                  {cat.items.map((item, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-border/50 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="text-sm">{item.name}</div>
                      {(['free', 'pro', 'premium', 'team'] as const).map(
                        (planKey) => {
                          const value = item[planKey]
                          return (
                            <div
                              key={planKey}
                              className="flex items-center justify-center text-sm"
                            >
                              {typeof value === 'boolean' ? (
                                value ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <X className="w-4 h-4 text-muted-foreground/40" />
                                )
                              ) : (
                                <span className="font-medium">{value}</span>
                              )}
                            </div>
                          )
                        }
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Mobile: stacked card comparison */}
          <div className="md:hidden space-y-4">
            {comparisonFeatures.map((cat) => {
              const CatIcon = cat.icon
              return (
                <div
                  key={cat.category}
                  className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
                    <CatIcon className="w-4 h-4 text-primary" />
                    <span className="font-bold text-xs uppercase tracking-wide">
                      {cat.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    {cat.items.map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="grid grid-cols-4 gap-1">
                          {(['free', 'pro', 'premium', 'team'] as const).map(
                            (planKey) => {
                              const value = item[planKey]
                              const planName =
                                plans.find((p) => p.id === planKey)?.name ||
                                planKey
                              return (
                                <div
                                  key={planKey}
                                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary/40"
                                >
                                  <span className="text-[9px] text-muted-foreground uppercase font-semibold">
                                    {planName}
                                  </span>
                                  {typeof value === 'boolean' ? (
                                    value ? (
                                      <Check className="w-3.5 h-3.5 text-green-500" />
                                    ) : (
                                      <X className="w-3.5 h-3.5 text-muted-foreground/40" />
                                    )
                                  ) : (
                                    <span className="text-[10px] font-medium text-center leading-tight">
                                      {value}
                                    </span>
                                  )}
                                </div>
                              )
                            }
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          WHY CHOOSE OUR PRICING
         ============================================================ */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Why People Trust Our Pricing
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              No tricks. No hidden fees. Just fair pricing for tools that
              actually work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Shield,
                title: 'No Hidden Fees',
                desc: 'What you see is what you pay. No surprise charges.',
              },
              {
                icon: Clock,
                title: 'Cancel Anytime',
                desc: 'One-click cancel. Keep access until your period ends.',
              },
              {
                icon: Users,
                title: 'Student Discount',
                desc: '30% off for students with valid ID.',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-5 sm:p-6 rounded-2xl bg-card/50 border border-border text-center"
                >
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
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
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <HelpCircle className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-medium">
                Common Questions
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left hover:bg-secondary/30 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center transition-transform ${
                      openFaq === index ? 'rotate-45' : ''
                    }`}
                  >
                    <span className="text-primary font-bold text-base leading-none">
                      +
                    </span>
                  </span>
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
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
                Ready to Start?
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Try Chronify Free for
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                14 Days
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              No credit card. No commitment. Just sign up and see if it works
              for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="rounded-xl px-8 py-6 text-base gap-2 group w-full sm:w-auto"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 py-6 text-base w-full sm:w-auto"
                >
                  Talk to Sales
                </Button>
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground mt-4">
              Free forever plan available • Cancel anytime
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