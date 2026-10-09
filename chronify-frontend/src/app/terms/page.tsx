// src/app/terms/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Scale,
  UserCheck,
  CreditCard,
  AlertTriangle,
  Ban,
  Shield,
  RefreshCw,
  Copyright,
  Mail,
  ArrowRight,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Gavel,
  Users,
  Globe,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* ============================================================================
   TERMS & CONDITIONS PAGE
   ============================================================================ */

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: FileText,
    content: [
      'Welcome to Chronify. These Terms & Conditions ("Terms") govern your access to and use of our platform, including our website, mobile apps, and all related services.',
      '**By accessing or using Chronify, you agree to be bound by these Terms.** If you do not agree with any part of these Terms, please do not use our services.',
      'You must be at least 13 years old (or 16 in some jurisdictions) to use Chronify. By using our service, you confirm that you meet this requirement.',
    ],
  },
  {
    id: 'account',
    title: 'Your Account',
    icon: UserCheck,
    content: [
      'To access most features of Chronify, you need to create an account. Here\'s what you need to know:',
      '**Accurate Information:** You agree to provide accurate, current, and complete information during registration.',
      '**Account Security:** You are responsible for maintaining the confidentiality of your login credentials.',
      '**Your Responsibility:** All activity that occurs under your account is your responsibility.',
      '**One Account:** Please don\'t create multiple accounts to bypass limits or restrictions.',
      '**Notify Us:** If you suspect unauthorized access, contact us immediately at arbaazkhanark23@gmail.com.',
      'We reserve the right to suspend or terminate accounts that violate these Terms.',
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    icon: CheckCircle,
    content: [
      'Chronify is designed to help you plan and stay productive. To keep the platform safe for everyone, you agree **NOT** to:',
      '**Violate laws:** Use Chronify for any illegal purpose or in violation of any laws.',
      '**Harm others:** Harass, abuse, threaten, or harm other users.',
      '**Spam or scam:** Send spam, phishing attempts, or fraudulent content.',
      '**Reverse engineer:** Attempt to decompile, disassemble, or reverse engineer any part of Chronify.',
      '**Automate access:** Use bots, scrapers, or automated tools to access our services without permission.',
      '**Overload systems:** Attempt to overwhelm our servers or infrastructure (DoS attacks).',
      '**Impersonate:** Pretend to be Chronify, our team, or another user.',
      '**Upload malware:** Transmit viruses, worms, or any harmful code.',
      'Violation of these rules may result in immediate account termination.',
    ],
  },
  {
    id: 'subscriptions',
    title: 'Plans & Payments',
    icon: CreditCard,
    content: [
      'Chronify offers both free and paid plans. Here\'s how paid plans work:',
      '**Billing:** Paid plans are billed monthly or yearly in advance, based on your selected cycle.',
      '**Auto-Renewal:** Subscriptions automatically renew unless you cancel before the renewal date.',
      '**Price Changes:** We\'ll notify you at least 30 days before any price increase.',
      '**Refunds:** We offer a 7-day refund window on first-time purchases. After that, payments are non-refundable.',
      '**Cancellation:** You can cancel anytime from your account settings. You\'ll retain access until the end of your billing period.',
      '**Failed Payments:** If payment fails, we\'ll retry and notify you. Continued failure may result in downgrade to free plan.',
      '**Taxes:** Prices may not include applicable taxes. You\'re responsible for any taxes in your jurisdiction.',
      'All payments are processed securely by third-party providers. We never store your card details.',
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    icon: Copyright,
    content: [
      'Here\'s who owns what:',
      '**Our Content:** Chronify and its logo, design, code, features, and content are owned by us and protected by copyright, trademark, and other laws.',
      '**Your Content:** You own everything you create on Chronify — your goals, tasks, notes, and schedules. We only use it to provide the service to you.',
      '**License to Us:** By using Chronify, you grant us a limited license to store, process, and display your content solely for providing our services.',
      '**Feedback:** If you send us ideas or feedback, we may use them freely without obligation to you.',
      '**No Copying:** You may not copy, modify, distribute, or resell any part of Chronify without our written permission.',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy',
    icon: Shield,
    content: [
      'Your privacy is important to us. Our collection and use of your data is described in our Privacy Policy.',
      'By using Chronify, you consent to the practices described in our Privacy Policy.',
      'You can review our full Privacy Policy at any time. If you have questions, contact us at arbaazkhanark23@gmail.com.',
    ],
  },
  {
    id: 'availability',
    title: 'Service Availability',
    icon: Globe,
    content: [
      'We work hard to keep Chronify running smoothly, but we can\'t guarantee 100% uptime:',
      '**Best Efforts:** We aim for 99.9% uptime but occasionally need downtime for maintenance and updates.',
      '**No Guarantee:** Chronify is provided "as is" and "as available" without warranties.',
      '**Scheduled Maintenance:** We try to schedule maintenance during off-peak hours and notify you in advance.',
      '**Emergency Maintenance:** Some fixes require immediate action without advance notice.',
      '**No Liability:** We\'re not responsible for any loss caused by downtime, even if we caused it.',
    ],
  },
  {
    id: 'disclaimer',
    title: 'Disclaimers',
    icon: AlertTriangle,
    content: [
      'Please read this section carefully:',
      '**No Warranty:** Chronify is provided without any warranties, express or implied, including merchantability, fitness for a particular purpose, or non-infringement.',
      '**Use At Your Own Risk:** You use Chronify at your own risk. We don\'t guarantee it will be error-free or meet your expectations.',
      '**Not Professional Advice:** Chronify provides productivity tools — not medical, legal, financial, or professional advice.',
      '**No Guaranteed Results:** We can\'t promise specific outcomes like better grades, higher income, or improved productivity.',
      '**Third-Party Links:** We\'re not responsible for content on third-party sites we may link to.',
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    icon: Scale,
    content: [
      'To the maximum extent permitted by law:',
      '**Limited Liability:** Chronify, its team, and its partners are not liable for any indirect, incidental, special, or consequential damages.',
      '**Cap on Damages:** Our total liability to you will not exceed the amount you paid us in the past 12 months (or $10 if you\'re on a free plan).',
      '**Data Loss:** We are not liable for any loss of data, revenue, or profits.',
      '**Exclusions:** Some jurisdictions don\'t allow certain liability exclusions. In such cases, our liability is limited to the fullest extent permitted.',
      'This limitation applies regardless of the legal theory under which damages are sought.',
    ],
  },
  {
    id: 'termination',
    title: 'Termination',
    icon: Ban,
    content: [
      'Either you or we can end this agreement at any time:',
      '**By You:** You can delete your account at any time from your account settings.',
      '**By Us:** We may suspend or terminate your account if you violate these Terms or for any other reason with notice.',
      '**Effect:** Upon termination, your right to use Chronify ends immediately.',
      '**Data Deletion:** Your data will be permanently deleted within 30 days of termination (unless required to keep by law).',
      '**No Refund:** If we terminate your account for violating these Terms, no refund will be issued.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    icon: RefreshCw,
    content: [
      'We may update these Terms from time to time to reflect changes in our service or for legal reasons.',
      'When we make significant changes, we will:',
      '**Notify You:** Send an email or in-app notification.',
      '**Update the Date:** The "Last Updated" date at the top will change.',
      '**Give You Time:** Material changes take effect 30 days after notice.',
      'By continuing to use Chronify after changes, you accept the updated Terms.',
      'If you don\'t agree with the changes, you can stop using Chronify and delete your account.',
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    icon: Gavel,
    content: [
      'These Terms are governed by the laws of India.',
      '**Jurisdiction:** Any disputes will be resolved in the courts located in New Delhi, India.',
      '**Dispute Resolution:** Before filing a lawsuit, both parties agree to attempt to resolve disputes informally by contacting us at arbaazkhanark23@gmail.com.',
      '**Severability:** If any part of these Terms is found unenforceable, the rest remains in full effect.',
      '**Entire Agreement:** These Terms, along with our Privacy Policy, form the entire agreement between you and Chronify.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    icon: Mail,
    content: [
      'If you have questions about these Terms & Conditions, please contact us:',
      '**Email:** arbaazkhanark23@gmail.com',
      '**Phone:** +91 82878 17916',
      '**Location:** New Delhi, India',
      'We take every legal question seriously and will respond within 30 days.',
    ],
  },
]

const highlights = [
  { icon: Shield, label: 'Fair & transparent' },
  { icon: Users, label: 'User-friendly' },
  { icon: Zap, label: 'No surprise fees' },
  { icon: CheckCircle, label: 'You own your data' },
]

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string>('acceptance')

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
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
              <FileText className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Please Read Carefully
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="block">Terms & Conditions</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Fair & Simple
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              Clear rules for using Chronify — written to be understood, not to
              confuse. No hidden traps.
            </p>

            <p className="text-xs sm:text-sm text-muted-foreground">
              Last updated: <span className="font-medium">January 2026</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          HIGHLIGHTS
         ============================================================ */}
      <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {highlights.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex items-center gap-2.5 p-3 sm:p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border"
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium leading-tight">
                    {item.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          MAIN CONTENT — sidebar + content
         ============================================================ */}
      <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
            {/* ---------- MOBILE: Horizontal tabs ---------- */}
            <div className="lg:hidden">
              <div className="overflow-x-auto -mx-4 px-4 pb-3">
                <div className="flex gap-2 min-w-max">
                  {sections.map((section) => {
                    const Icon = section.icon
                    const isActive = activeSection === section.id
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                          isActive
                            ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20'
                            : 'bg-secondary text-foreground'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{section.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ---------- DESKTOP: Sticky sidebar ---------- */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
                <h3 className="font-bold text-sm mb-3 px-2">
                  On this page
                </h3>
                <nav className="space-y-0.5">
                  {sections.map((section) => {
                    const Icon = section.icon
                    const isActive = activeSection === section.id
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{section.title}</span>
                        {isActive && (
                          <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </aside>

            {/* ---------- CONTENT ---------- */}
            <main className="lg:col-span-3 space-y-6 sm:space-y-8">
              {/* Intro card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 border border-primary/20"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">
                      Plain English Promise
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      These Terms are written to be read — not buried in legal
                      jargon. If anything is unclear, email us at{' '}
                      <a
                        href="mailto:arbaazkhanark23@gmail.com"
                        className="text-primary hover:underline"
                      >
                        arbaazkhanark23@gmail.com
                      </a>{' '}
                      and we&apos;ll explain.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Sections */}
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: index * 0.03 }}
                    className="scroll-mt-24 p-5 sm:p-7 rounded-2xl bg-card/50 backdrop-blur-sm border border-border"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4 sm:mb-5">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent flex-shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                      </div>
                      <h2 className="text-lg sm:text-2xl font-bold">
                        {section.title}
                      </h2>
                    </div>

                    {/* Content */}
                    <div className="space-y-3 sm:space-y-4">
                      {section.content.map((paragraph, pIndex) => {
                        const parts = paragraph.split(/(\*\*[^*]+\*\*)/g)
                        return (
                          <p
                            key={pIndex}
                            className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
                          >
                            {parts.map((part, partIndex) => {
                              if (
                                part.startsWith('**') &&
                                part.endsWith('**')
                              ) {
                                return (
                                  <span
                                    key={partIndex}
                                    className="font-semibold text-foreground"
                                  >
                                    {part.slice(2, -2)}
                                  </span>
                                )
                              }
                              return <span key={partIndex}>{part}</span>
                            })}
                          </p>
                        )
                      })}
                    </div>
                  </motion.section>
                )
              })}

              {/* Acceptance card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 border border-green-500/20"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">
                      By Using Chronify, You Agree
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Continued use of Chronify means you accept these Terms.
                      You can stop using our services and delete your account
                      at any time if you disagree with anything here.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Warning card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-5 sm:p-6 rounded-2xl bg-card/50 border border-border"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10 flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">
                      Important Notice
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      These Terms may change over time. We&apos;ll always notify
                      you before significant updates. Review them periodically
                      to stay informed.
                    </p>
                  </div>
                </div>
              </motion.div>
            </main>
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
              <Mail className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-medium">
                Questions About Terms?
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              We&apos;re Happy
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                to Clarify
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Have a question about our Terms? Reach out — we take legal
              clarity seriously.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="rounded-xl px-8 py-6 text-base gap-2 group w-full sm:w-auto"
                >
                  <Mail className="w-5 h-5" />
                  <span>Contact Us</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/privacy" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 py-6 text-base w-full sm:w-auto"
                >
                  Privacy Policy
                </Button>
              </Link>
            </div>
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