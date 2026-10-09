// src/app/contact/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  MessageCircle,
  MapPin,
  Phone,
  Send,
  Sparkles,
  CheckCircle,
  Clock,
  Users,
  HelpCircle,
  Linkedin,
  Github,
  Instagram,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/* ============================================================================
   CONTACT PAGE
   ============================================================================ */

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'We reply within 24 hours',
    value: 'arbaazkhanark23@gmail.com',
    href: 'mailto:arbaazkhanark23@gmail.com',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp / Chat',
    description: 'Mon–Fri, 9 AM – 6 PM IST',
    value: '+91 82878 17916',
    href: 'https://wa.me/918287817916',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Mon–Fri, 10 AM – 5 PM IST',
    value: '+91 82878 17916',
    href: 'tel:+918287817916',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: MapPin,
    title: 'Based In',
    description: 'Working remotely worldwide',
    value: 'New Delhi, India',
    href: '#',
    color: 'from-orange-500 to-red-500',
  },
]

const faqs = [
  {
    q: 'How quickly will I get a response?',
    a: 'We usually reply within 24 hours on business days. For urgent issues, message us on WhatsApp for a faster response.',
  },
  {
    q: 'Do you offer student discounts?',
    a: 'Yes! Students with a valid ID get 30% off all paid plans. Email us with your student ID and we&apos;ll send you a discount code.',
  },
  {
    q: 'Can I request a feature?',
    a: 'Absolutely. We love hearing from users. Send us your idea through this form and we&apos;ll review it for our roadmap.',
  },
  {
    q: 'How do I report a bug?',
    a: 'Use the contact form and select "Bug Report" as the subject. Include screenshots if possible — it helps us fix things faster.',
  },
  {
    q: 'Do you offer team or enterprise plans?',
    a: 'Yes. Reach out to us with your requirements and team size, and we&apos;ll get back with a custom plan.',
  },
]

const subjects = [
  'General Inquiry',
  'Technical Support',
  'Bug Report',
  'Feature Request',
  'Billing & Payments',
  'Partnership',
  'Press & Media',
  'Other',
]

const socials = [
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/arbaz-khan-0bb1aa1a0',
  },
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/Arbazkhanark',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://instagram.com/arbaazkhanark23',
  },
  {
    icon: Mail,
    label: 'Email',
    href: 'mailto:arbaazkhanark23@gmail.com',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: subjects[0],
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (formData.message.trim().length < 10) {
      setError('Message must be at least 10 characters long.')
      return
    }

    setIsSubmitting(true)

    // 🔥 YAHAN APNA API CALL LAGAO
    // Example:
    // const res = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // })
    // if (!res.ok) throw new Error('Failed')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: subjects[0],
        message: '',
      })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
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
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                We&apos;d Love to Hear From You
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="block">Get in Touch</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                With Chronify
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Questions, ideas, or feedback — we&apos;re all ears. Drop us a
              message and we&apos;ll get back to you soon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          CONTACT METHODS
         ============================================================ */}
      <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {contactMethods.map((method, i) => {
              const Icon = method.icon
              const isExternal = method.href.startsWith('http')
              return (
                <motion.a
                  key={method.title}
                  href={method.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group relative p-4 sm:p-5 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-3 shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm mb-0.5">
                    {method.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
                    {method.description}
                  </p>
                  <p className="text-[10px] sm:text-xs font-medium text-primary truncate">
                    {method.value}
                  </p>
                </motion.a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          FORM + INFO
         ============================================================ */}
      <section className="relative py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
            {/* FORM */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="p-5 sm:p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
                {!isSubmitted ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold mb-1">
                        Send Us a Message
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Fill out the form and we&apos;ll get back within 24
                        hours.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-xs sm:text-sm font-medium mb-1.5"
                          >
                            Your Name
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Om Prakaash Mirshra"
                            disabled={isSubmitting}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-xs sm:text-sm font-medium mb-1.5"
                          >
                            Your Email
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="pappludon21@gmail.com"
                            disabled={isSubmitting}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-xs sm:text-sm font-medium mb-1.5"
                        >
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm disabled:opacity-60"
                        >
                          {subjects.map((sub) => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-xs sm:text-sm font-medium mb-1.5"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us what's on your mind..."
                          disabled={isSubmitting}
                          maxLength={500}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none disabled:opacity-60"
                        />
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 text-right">
                          {formData.message.length} / 500
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                            {error}
                          </span>
                        </div>
                      )}

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full rounded-xl py-5 sm:py-6 text-sm sm:text-base gap-2 group"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>

                      <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                        By submitting, you agree to our{' '}
                        <Link
                          href="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-8 sm:py-12"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">
                      Message Sent!
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                      Thanks for reaching out. We&apos;ll get back to you at
                      your email within 24 hours.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="rounded-xl px-6 py-5 text-sm"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* INFO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 space-y-4"
            >
              {/* Response time */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">Fast Response</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We typically reply within 24 hours. For instant help,
                      message us on WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct contact */}
              <div className="p-5 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
                <h3 className="font-bold text-sm mb-4">Direct Contact</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="mailto:arbaazkhanark23@gmail.com"
                      className="flex items-start gap-2.5 text-xs group"
                    >
                      <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="break-all group-hover:text-primary transition-colors">
                        arbaazkhanark23@gmail.com
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+918287817916"
                      className="flex items-start gap-2.5 text-xs group"
                    >
                      <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="group-hover:text-primary transition-colors">
                        +91 82878 17916
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/918287817916"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2.5 text-xs group"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="group-hover:text-primary transition-colors">
                        WhatsApp Chat
                      </span>
                    </a>
                  </li>
                  <li>
                    <div className="flex items-start gap-2.5 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>New Delhi, India</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* What we help with */}
              <div className="p-5 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
                <h3 className="font-bold text-sm mb-4">What We Can Help With</h3>
                <ul className="space-y-2.5">
                  {[
                    'Account & login issues',
                    'Billing questions',
                    'Feature requests',
                    'Bug reports',
                    'Partnerships',
                    'Press inquiries',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div className="p-5 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
                <h3 className="font-bold text-sm mb-4">Follow Us</h3>
                <div className="grid grid-cols-2 gap-2">
                  {socials.map((social) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                      >
                        <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        <span className="text-xs font-medium truncate">
                          {social.label}
                        </span>
                      </a>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ
         ============================================================ */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="relative max-w-3xl mx-auto">
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
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Quick answers before you reach out.
            </p>
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
              <Users className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs sm:text-sm font-medium">
                Join Our Community
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Ready to Get
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Started?
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Take control of your time and start achieving more today.
              It&apos;s free to get started.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="rounded-xl px-8 py-6 text-base gap-2 group w-full sm:w-auto"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 py-6 text-base w-full sm:w-auto"
                >
                  View Plans
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