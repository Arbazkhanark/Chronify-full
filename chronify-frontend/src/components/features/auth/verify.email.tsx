// src/components/features/auth/verify-email-client.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Target,
  BarChart3,
  Rocket,
  Home,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Toaster, toast } from 'sonner'
import { cn } from '@/lib/utils'

/* ============================================================================
   CONFIG
   ============================================================================ */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:8181/v0/api'

/* ============================================================================
   TYPES
   ============================================================================ */

type VerificationStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'
  | 'missing-token'

interface VerifyResponse {
  success: boolean
  message: string
  data?: {
    id?: string
    email?: string
    verified?: boolean
    name?: string
  }
}

interface ErrorState {
  title: string
  message: string
  hint?: string
  code?: number
}

/* ============================================================================
   COMPONENT
   ============================================================================ */

export function VerifyEmailClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<VerificationStatus>('idle')
  const [successData, setSuccessData] = useState<VerifyResponse['data']>(undefined)
  const [errorState, setErrorState] = useState<ErrorState | null>(null)
  const [isResending, setIsResending] = useState(false)

  /* --------------------------------------------------------------------
     VERIFY TOKEN — runs once on mount (or when token changes)
     -------------------------------------------------------------------- */
  const verifyToken = useCallback(async (rawToken: string) => {
    setStatus('loading')
    setErrorState(null)

    try {
      const url = `${API_BASE_URL}/users/verify?token=${encodeURIComponent(rawToken)}`

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Content-Type': 'text/plain',
        },
      })

      let json: VerifyResponse | null = null
      try {
        json = (await res.json()) as VerifyResponse
      } catch {
        json = null
      }

      /* ---- Case 1: Success response ---- */
      if (res.ok && json?.success) {
        setSuccessData(json.data)
        setStatus('success')

        toast.success('Email verified successfully!', {
          description: "You're all set. Redirecting to your dashboard...",
          duration: 3000,
        })

        // Auto-redirect after 2.5s
        setTimeout(() => {
          router.push('/dashboard')
        }, 2500)
        return
      }

      /* ---- Case 2: Backend returned non-OK or success:false ---- */
      const message =
        json?.message ||
        `Verification failed (HTTP ${res.status})`

      // 401 / 400 → likely expired or invalid token
      if (res.status === 401 || res.status === 400) {
        setErrorState({
          title: 'Link expired or invalid',
          message:
            'This verification link is no longer valid. It may have already been used, or it may have expired.',
          hint: 'Request a new verification email from your dashboard.',
          code: res.status,
        })
      }
      // 409 → already verified
      else if (res.status === 409) {
        setErrorState({
          title: 'Already verified',
          message:
            'This account has already been verified. You can log in and start using Chronify.',
          hint: 'Head to the login page to continue.',
          code: res.status,
        })
      }
      // 404 → user not found
      else if (res.status === 404) {
        setErrorState({
          title: 'Account not found',
          message:
            'We couldn\'t find an account associated with this verification link.',
          hint: 'Try signing up again, or contact support if you think this is a mistake.',
          code: res.status,
        })
      }
      // Any other error
      else {
        setErrorState({
          title: 'Verification failed',
          message,
          hint: 'Please try again, or contact support if the problem persists.',
          code: res.status,
        })
      }

      setStatus('error')
    } catch (err) {
      // Network error / fetch failed
      console.error('[VerifyEmail] Verification error:', err)
      setErrorState({
        title: 'Network error',
        message:
          "We couldn't reach the server. Please check your internet connection and try again.",
        hint: 'If the problem persists, contact support.',
      })
      setStatus('error')
    }
  }, [router])

  /* --------------------------------------------------------------------
     TRIGGER VERIFICATION ON MOUNT
     -------------------------------------------------------------------- */
  useEffect(() => {
    if (!token) {
      setStatus('missing-token')
      return
    }

    void verifyToken(token)
  }, [token, verifyToken])

  /* --------------------------------------------------------------------
     RESEND VERIFICATION EMAIL
     -------------------------------------------------------------------- */
  const handleResend = async () => {
    setIsResending(true)
    try {
      // Try to get email from localStorage if available
      let email: string | null = null
      try {
        const stored = localStorage.getItem('current_user')
        if (stored) {
          const parsed = JSON.parse(stored)
          email = parsed?.email ?? null
        }
      } catch {
        // ignore
      }

      if (!email) {
        toast.error('Please log in to resend the verification email', {
          description: 'We need your email address to send a new link.',
        })
        router.push('/auth/login')
        return
      }

      const res = await fetch(
        `${API_BASE_URL}/users/resend-verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
          body: JSON.stringify({ email }),
        }
      )

      const json = await res.json().catch(() => null)

      if (res.ok && json?.success !== false) {
        toast.success('Verification email sent', {
          description: `Check your inbox at ${email} for a new link.`,
          duration: 6000,
        })
      } else {
        toast.error('Could not resend email', {
          description:
            json?.message || 'Please try again in a moment.',
        })
      }
    } catch (err) {
      console.error('[VerifyEmail] Resend error:', err)
      toast.error('Network error', {
        description: 'Please check your connection and try again.',
      })
    } finally {
      setIsResending(false)
    }
  }

  /* ================================================================
     RENDER
     ================================================================ */

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {/* ============================================================
                  LOADING STATE
                  ============================================================ */}
              {status === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="border-primary/20 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="relative inline-flex mb-6">
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Loader2 className="w-10 h-10 text-white animate-spin" />
                        </div>
                      </div>

                      <h1 className="text-2xl font-bold mb-2">
                        Verifying your email
                      </h1>
                      <p className="text-muted-foreground text-sm">
                        Please wait a moment while we confirm your verification link...
                      </p>

                      <div className="mt-6 flex justify-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* ============================================================
                  SUCCESS STATE
                  ============================================================ */}
              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-green-500/30 shadow-lg overflow-hidden">
                    {/* Top green accent bar */}
                    <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-500" />

                    <CardContent className="p-8 text-center">
                      {/* Animated check icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          damping: 15,
                          delay: 0.1,
                        }}
                        className="inline-flex w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 items-center justify-center mb-6 shadow-lg shadow-green-500/30"
                      >
                        <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h1 className="text-3xl font-bold mb-3 text-green-600 dark:text-green-400">
                          You&apos;re verified! 🎉
                        </h1>
                        <p className="text-muted-foreground mb-1">
                          Your Chronify account is now active
                          {successData?.email ? (
                            <>
                              {' '}for{' '}
                              <span className="font-medium text-foreground">
                                {successData.email}
                              </span>
                            </>
                          ) : null}
                          .
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                          You now have full access to all features.
                        </p>

                        {/* Redirect indicator */}
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Redirecting to dashboard...
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            <Home className="w-4 h-4 mr-2" />
                            Go to Dashboard
                          </Button>
                        </div>
                      </motion.div>
                    </CardContent>

                    {/* Unlocked features preview */}
                    <div className="border-t bg-muted/30 p-5">
                      <p className="text-xs font-medium text-muted-foreground mb-3 text-center">
                        ✨ What&apos;s now unlocked for you
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2">
                          <Target className="w-5 h-5 text-primary mx-auto mb-1" />
                          <p className="text-[11px] text-muted-foreground">
                            Create goals
                          </p>
                        </div>
                        <div className="p-2">
                          <BarChart3 className="w-5 h-5 text-primary mx-auto mb-1" />
                          <p className="text-[11px] text-muted-foreground">
                            Track progress
                          </p>
                        </div>
                        <div className="p-2">
                          <Rocket className="w-5 h-5 text-primary mx-auto mb-1" />
                          <p className="text-[11px] text-muted-foreground">
                            Full features
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ============================================================
                  ERROR STATE
                  ============================================================ */}
              {status === 'error' && errorState && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-red-500/30 shadow-lg overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-red-500 to-rose-500" />

                    <CardContent className="p-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          damping: 15,
                          delay: 0.1,
                        }}
                        className="inline-flex w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-rose-500 items-center justify-center mb-6 shadow-lg shadow-red-500/30"
                      >
                        {errorState.code === 409 ? (
                          <ShieldCheck className="w-14 h-14 text-white" strokeWidth={2.5} />
                        ) : (
                          <XCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
                        )}
                      </motion.div>

                      <h1 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">
                        {errorState.title}
                      </h1>

                      <p className="text-muted-foreground text-sm mb-3">
                        {errorState.message}
                      </p>

                      {errorState.hint && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 mb-6">
                          <p className="text-xs text-red-800 dark:text-red-200 flex items-start gap-2 text-left">
                            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{errorState.hint}</span>
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2 mb-4">
                        {errorState.code !== 409 && (
                          <Button
                            onClick={handleResend}
                            disabled={isResending}
                            className="flex-1"
                          >
                            {isResending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Resend Email
                              </>
                            )}
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          onClick={() => router.push('/auth/login')}
                          className="flex-1"
                        >
                          {errorState.code === 409 ? (
                            <>
                              <ArrowRight className="w-4 h-4 mr-2" />
                              Go to Login
                            </>
                          ) : (
                            <>
                              <Home className="w-4 h-4 mr-2" />
                              Back to Home
                            </>
                          )}
                        </Button>
                      </div>

                      <Link
                        href="/contact"
                        className="text-xs text-muted-foreground hover:text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        Contact support
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* ============================================================
                  MISSING TOKEN STATE
                  ============================================================ */}
              {status === 'missing-token' && (
                <motion.div
                  key="missing"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="border-amber-500/30 shadow-lg overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />

                    <CardContent className="p-8 text-center">
                      <div className="inline-flex w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 items-center justify-center mb-6 shadow-lg shadow-amber-500/30">
                        <ShieldAlert className="w-10 h-10 text-white" strokeWidth={2.5} />
                      </div>

                      <h1 className="text-2xl font-bold mb-2 text-amber-600 dark:text-amber-400">
                        No verification link found
                      </h1>

                      <p className="text-muted-foreground text-sm mb-6">
                        This page needs a verification token to work. Please open
                        the link from your verification email.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={handleResend}
                          disabled={isResending}
                          className="flex-1"
                        >
                          {isResending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Resend Email
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => router.push('/auth/login')}
                          className="flex-1"
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Go to Login
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust badge (always shown) */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                Secured by Chronify AI Security
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

