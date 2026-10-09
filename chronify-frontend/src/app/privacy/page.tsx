// src/app/privacy/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  Users,
  Mail,
  FileText,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Globe,
  UserCheck,
  Trash2,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* ============================================================================
   PRIVACY POLICY PAGE
   ============================================================================ */

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: FileText,
    content: [
      'Welcome to Chronify. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.',
      'By using Chronify, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our services.',
    ],
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    icon: Database,
    content: [
      'We collect only the information necessary to provide you with a great experience. This includes:',
      '**Account Information:** When you sign up, we collect your name, email address, and password (encrypted).',
      '**Usage Data:** We collect information about how you use Chronify — like features accessed, time spent, and general interaction patterns.',
      '**Device Information:** We collect basic device data such as browser type, operating system, and IP address for security and analytics.',
      '**Content You Create:** Goals, tasks, schedules, notes, and any other content you add to Chronify.',
      '**Payment Information:** For paid plans, we collect billing details through secure third-party processors (we never store your card details).',
    ],
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    icon: Settings,
    content: [
      'We use your information to:',
      '**Provide our services:** Create your account, sync your data across devices, and deliver the features you use.',
      '**Improve the platform:** Understand what works, fix what doesn\'t, and build features you\'ll actually use.',
      '**Communicate:** Send important updates, security alerts, and (only if you opt in) product news.',
      '**Ensure security:** Detect and prevent fraud, abuse, and unauthorized access.',
      '**Comply with law:** Meet legal obligations and enforce our terms.',
      'We never sell your personal data to third parties. Ever.',
    ],
  },
  {
    id: 'data-sharing',
    title: 'Data Sharing & Disclosure',
    icon: Users,
    content: [
      'We do not sell, rent, or trade your personal information. We only share data in these limited situations:',
      '**Service Providers:** Trusted third parties who help us run Chronify (hosting, payment processing, email delivery). They are bound by strict confidentiality agreements.',
      '**Legal Requirements:** When required by law, court order, or to protect the rights and safety of our users.',
      '**Business Transfers:** If Chronify is ever acquired or merged, your data would transfer to the new owner under the same privacy protections.',
      '**With Your Consent:** Any other sharing happens only with your explicit permission.',
    ],
  },
  {
    id: 'data-security',
    title: 'Data Security',
    icon: Lock,
    content: [
      'Your trust means everything to us. That\'s why we protect your data with:',
      '**Encryption:** All data is encrypted in transit (HTTPS/TLS) and at rest using industry-standard encryption.',
      '**Secure Authentication:** Passwords are hashed and salted — we can never see them.',
      '**Access Controls:** Only authorized team members can access user data, and only when necessary.',
      '**Regular Audits:** We regularly review our security practices and patch vulnerabilities.',
      '**No Card Storage:** Payment information is handled entirely by PCI-DSS compliant processors.',
      'While no system is 100% secure, we work hard to protect you and constantly improve our defenses.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    icon: Cookie,
    content: [
      'We use minimal cookies and similar technologies to make Chronify work well:',
      '**Essential Cookies:** Required for login, security, and core functionality.',
      '**Preference Cookies:** Remember your settings like theme and language.',
      '**Analytics Cookies:** Help us understand how Chronify is used so we can improve it.',
      '**No Ad Tracking:** We do not use third-party ad trackers. We don\'t show ads.',
      'You can control cookies through your browser settings. Disabling essential cookies may break parts of Chronify.',
    ],
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    icon: UserCheck,
    content: [
      'You have full control over your data. Here are your rights:',
      '**Access:** Request a copy of all personal data we hold about you.',
      '**Correction:** Update or fix any inaccurate information at any time.',
      '**Deletion:** Request that we delete your account and personal data.',
      '**Export:** Download your Chronify data in a portable format.',
      '**Opt-Out:** Unsubscribe from marketing emails with one click.',
      '**Portability:** Transfer your data to another service.',
      'To exercise any of these rights, email us at arbaazkhanark23@gmail.com. We respond within 30 days.',
    ],
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    icon: Trash2,
    content: [
      'We keep your data only as long as necessary:',
      '**Active Accounts:** Data is retained while your account is active.',
      '**Deleted Accounts:** We permanently delete your data within 30 days of account deletion.',
      '**Legal Requirements:** Some data may be kept longer if required by law (e.g., billing records).',
      '**Backups:** Residual data in backups is purged within 90 days.',
    ],
  },
  {
    id: 'childrens-privacy',
    title: 'Children\'s Privacy',
    icon: Shield,
    content: [
      'Chronify is not intended for children under 13 (or under 16 in some jurisdictions).',
      'We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will delete it immediately.',
      'Parents and guardians: if you have concerns, reach out to us at arbaazkhanark23@gmail.com.',
    ],
  },
  {
    id: 'international',
    title: 'International Users',
    icon: Globe,
    content: [
      'Chronify is available worldwide, and your data may be stored on servers in different countries.',
      'By using Chronify, you consent to the transfer of your information to countries outside your own, which may have different data protection laws.',
      'We take steps to ensure your data receives adequate protection regardless of where it\'s stored.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    icon: FileText,
    content: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons.',
      'When we make significant changes, we will:',
      '**Notify you:** Send an email or in-app notification.',
      '**Update the date:** The "Last Updated" date at the top will change.',
      '**Give you time:** Material changes take effect 30 days after notification.',
      'Your continued use of Chronify after changes means you accept the updated policy.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    icon: Mail,
    content: [
      'If you have questions, concerns, or feedback about this Privacy Policy or our data practices, please contact us:',
      '**Email:** arbaazkhanark23@gmail.com',
      '**Phone:** +91 82878 17916',
      '**Location:** New Delhi, India',
      'We take every privacy question seriously and will respond within 30 days.',
    ],
  },
]

const quickFacts = [
  { icon: Lock, label: 'End-to-end encrypted' },
  { icon: Shield, label: 'No data selling' },
  { icon: Eye, label: 'No ad tracking' },
  { icon: Trash2, label: 'Delete anytime' },
]

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string>('introduction')

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
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Your Privacy Matters
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="block">Privacy Policy</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Simple & Honest
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              We believe privacy should be simple to understand. Here&apos;s
              exactly how we handle your data — no confusing legal jargon.
            </p>

            <p className="text-xs sm:text-sm text-muted-foreground">
              Last updated: <span className="font-medium">January 2026</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          QUICK FACTS
         ============================================================ */}
      <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {quickFacts.map((fact, index) => {
              const Icon = fact.icon
              return (
                <motion.div
                  key={fact.label}
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
                    {fact.label}
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
            {/* ---------- MOBILE: Horizontal scroll tabs ---------- */}
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
                      We wrote this policy to be read, not skipped. If anything
                      is unclear, email us at{' '}
                      <a
                        href="mailto:arbaazkhanark23@gmail.com"
                        className="text-primary hover:underline"
                      >
                        arbaazkhanark23@gmail.com
                      </a>{' '}
                      — we&apos;ll explain.
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
                    {/* Section header */}
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
                        // Bold text between ** **
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
                      You&apos;re In Control
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      By using Chronify, you accept this Privacy Policy. You can
                      delete your account and all your data at any time from
                      your account settings — no questions asked.
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
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">
                      Important Notice
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      If you don&apos;t agree with any part of this policy,
                      please don&apos;t use Chronify. Your use of the platform
                      means you accept these terms.
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
                Questions About Privacy?
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              We&apos;re Here
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                to Answer
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Reach out with any privacy questions — we take them seriously and
              respond quickly.
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
              <Link href="/terms" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 py-6 text-base w-full sm:w-auto"
                >
                  Terms of Service
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