// src/app/auth/callback/page.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://localhost:8181/v0/api'

/* ============================================================================
   CALLBACK HANDLER — reads tokens from URL, stores them, fetches user,
   then redirects to /dashboard (or /auth/verify-email if needed).
   ============================================================================ */

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  )
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    const handleCallback = async () => {
      try {
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const error = searchParams.get('error')

        // 1️⃣ Backend sent an error
        if (error) {
          if (cancelled) return
          setStatus('error')
          setErrorMessage('Authentication failed. Please try again.')
          toast.error('Authentication failed', {
            description: 'Please try signing in again.',
          })
          setTimeout(() => router.replace('/auth/login'), 2000)
          return
        }

        // 2️⃣ Tokens missing
        if (!accessToken || !refreshToken) {
          if (cancelled) return
          setStatus('error')
          setErrorMessage('Missing authentication tokens.')
          toast.error('Authentication failed', {
            description: 'Missing tokens in callback URL.',
          })
          setTimeout(() => router.replace('/auth/login'), 2000)
          return
        }

        // 3️⃣ Store tokens in localStorage (same keys as AuthService)
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)

        // 4️⃣ Fetch fresh user profile
        const userRes = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!userRes.ok) {
          throw new Error(
            `Failed to fetch user profile (${userRes.status})`,
          )
        }

        const userData = await userRes.json()

        if (!userData?.data) {
          throw new Error('Invalid user data from backend')
        }

        // 5️⃣ Cache user in localStorage
        const user = userData.data
        localStorage.setItem('current_user', JSON.stringify(user))

        if (cancelled) return

        setStatus('success')
        toast.success('Signed in successfully!', {
          description: 'Redirecting...',
        })

        // 6️⃣ Redirect based on state
        const step = user.onboardingStep ?? 0
        const isVerified = user.verified === true

        setTimeout(() => {
          if (!isVerified) {
            router.replace('/auth/verify-email')
          } else if (step < 4) {
            if (step === 0) router.replace('/onboarding/role')
            else if (step === 1) router.replace('/onboarding/details')
            else if (step === 2) router.replace('/onboarding/profile')
            else if (step === 3) router.replace('/onboarding/complete')
            else router.replace('/onboarding/role')
          } else {
            router.replace('/dashboard')
          }
        }, 800)
      } catch (err) {
        console.error('[OAuth Callback] Failed:', err)
        if (cancelled) return
        setStatus('error')
        setErrorMessage(
          err instanceof Error ? err.message : 'Something went wrong.',
        )
        toast.error('Authentication failed', {
          description: 'Please try signing in again.',
        })
        setTimeout(() => router.replace('/auth/login'), 2000)
      }
    }

    void handleCallback()

    return () => {
      cancelled = true
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 p-4">
      <div className="text-center max-w-md">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Signing you in...
            </h1>
            <p className="text-sm text-muted-foreground">
              Please wait while we finish authentication.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Welcome to Chronify!
            </h1>
            <p className="text-sm text-muted-foreground">
              Redirecting...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Authentication failed
            </h1>
            <p className="text-sm text-muted-foreground">
              {errorMessage || 'Redirecting back to login...'}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

/* ============================================================================
   PAGE WRAPPER — useSearchParams() must be inside <Suspense>
   in Next.js App Router.
   ============================================================================ */

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  )
}