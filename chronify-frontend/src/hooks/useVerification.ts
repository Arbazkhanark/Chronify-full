// // src/hooks/useVerification.ts
// 'use client'

// import { useCallback, useEffect, useState } from 'react'
// import { toast } from 'sonner'
// import { AuthService } from '@/hooks/useAuth'
// import {
//   getFullProfile,
//   mapApiToUi,
//   type UiProfileData,
// } from '@/lib/full-profile'
// import {
//   readProfileCache,
//   writeProfileCache,
// } from '@/lib/profile-cache'
// import {
//   setUserVerified,
//   readUserCache,
//   type CachedUser,
// } from '@/lib/user-cache'
// import { emitVerificationChange, onVerificationChange } from '@/lib/verification-bus'

// /* ============================================================================
//    useVerification
//    Single hook that:
//      - Reads initial verified state from cache (instant, no flicker)
//      - Exposes `isVerified`, `email`, `isSending`, `sendVerificationEmail()`
//      - After sending, polls for verification and syncs caches + UI
//      - Reacts to global verification events (cross-component, cross-tab)
//    ============================================================================ */

// export interface UseVerificationOptions {
//   /** Email to send verification to. If omitted, reads from user cache. */
//   email?: string | null
//   /**
//    * How many times to poll after sending the email.
//    * Each poll waits `pollIntervalMs` before checking.
//    * Total wait = pollAttempts * pollIntervalMs
//    */
//   pollAttempts?: number
//   pollIntervalMs?: number
//   /** Callback fired whenever verified flips to true */
//   onVerified?: (profile: UiProfileData) => void
// }

// export function useVerification(options: UseVerificationOptions = {}) {
//   const {
//     email: emailOverride,
//     pollAttempts = 5,
//     pollIntervalMs = 3000,
//     onVerified,
//   } = options

//   // Read initial state from cache (sync, no flicker)
//   const [cachedUser, setCachedUser] = useState<CachedUser | null>(() => {
//     if (typeof window === 'undefined') return null
//     return readUserCache()
//   })

//   const [isVerified, setIsVerified] = useState<boolean>(
//     () => cachedUser?.verified === true
//   )

//   const [isSending, setIsSending] = useState(false)
//   const [justVerified, setJustVerified] = useState(false)

//   const email = emailOverride ?? cachedUser?.email ?? null

//   /* ---------------- Sync from bus events ---------------- */
//   useEffect(() => {
//     const unsubscribe = onVerificationChange((verified) => {
//       setIsVerified(verified)
//       setCachedUser((prev) => (prev ? { ...prev, verified } : prev))
//     })
//     return unsubscribe
//   }, [])

//   /* ---------------- Sync when tab regains focus ---------------- */
//   useEffect(() => {
//     if (isVerified) return // already verified, nothing to check

//     let cancelled = false

//     const checkNow = async () => {
//       if (cancelled) return
//       if (document.visibilityState !== 'visible') return

//       try {
//         const fresh = await getFullProfile()
//         if (cancelled) return

//         if (fresh.verified) {
//           const ui = mapApiToUi(fresh)
//           writeProfileCache({ apiProfile: fresh, uiProfile: ui })
//           setUserVerified(true)

//           setIsVerified(true)
//           setJustVerified(true)
//           setCachedUser((prev) => (prev ? { ...prev, verified: true } : prev))

//           emitVerificationChange(true)

//           toast.success('Email verified! 🎉', {
//             description: 'Your account is now verified.',
//             duration: 5000,
//           })

//           onVerified?.(ui)
//         }
//       } catch (err) {
//         // Silent — user probably hasn't verified yet
//         console.debug('[useVerification] focus check failed:', err)
//       }
//     }

//     document.addEventListener('visibilitychange', checkNow)
//     window.addEventListener('focus', checkNow)

//     return () => {
//       cancelled = true
//       document.removeEventListener('visibilitychange', checkNow)
//       window.removeEventListener('focus', checkNow)
//     }
//   }, [isVerified, onVerified])

//   /* ---------------- Send verification email ---------------- */
//   const sendVerificationEmail = useCallback(async () => {
//     if (!email) {
//       toast.error('No email address found on your account')
//       return false
//     }

//     setIsSending(true)

//     try {
//       await AuthService.resendVerificationEmail(email)

//       toast.success('Verification email sent', {
//         description: `We've sent a verification link to ${email}. Check your inbox (and spam).`,
//         duration: 6000,
//       })

//       // Poll for verification
//       for (let attempt = 0; attempt < pollAttempts; attempt++) {
//         await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))

//         try {
//           const fresh = await getFullProfile()
//           if (fresh.verified) {
//             const ui = mapApiToUi(fresh)

//             // 1️⃣ Update profile cache
//             writeProfileCache({ apiProfile: fresh, uiProfile: ui })

//             // 2️⃣ Update user cache
//             setUserVerified(true)

//             // 3️⃣ Update local state
//             setIsVerified(true)
//             setJustVerified(true)
//             setCachedUser((prev) => (prev ? { ...prev, verified: true } : prev))

//             // 4️⃣ Broadcast to all other components
//             emitVerificationChange(true)

//             toast.success('Email verified! 🎉', {
//               description: 'Your account is now verified. Enjoy full access!',
//               duration: 5000,
//             })

//             onVerified?.(ui)
//             return true
//           }
//         } catch (err) {
//           console.debug('[useVerification] poll attempt failed:', err)
//         }
//       }

//       // Still not verified after all attempts
//       toast.info('Still waiting for verification', {
//         description:
//           'Once you click the link in your email, this page will update automatically.',
//         duration: 7000,
//       })
//       return false
//     } catch (err: any) {
//       console.error('[useVerification] send failed:', err)
//       toast.error('Could not send verification email', {
//         description: err?.message || 'Please try again in a moment.',
//       })
//       return false
//     } finally {
//       setIsSending(false)
//     }
//   }, [email, pollAttempts, pollIntervalMs, onVerified])

//   /* ---------------- Manual refresh (callable from anywhere) ---------------- */
//   const refreshVerification = useCallback(async () => {
//     try {
//       const fresh = await getFullProfile()
//       if (fresh.verified && !isVerified) {
//         const ui = mapApiToUi(fresh)
//         writeProfileCache({ apiProfile: fresh, uiProfile: ui })
//         setUserVerified(true)
//         setIsVerified(true)
//         setCachedUser((prev) => (prev ? { ...prev, verified: true } : prev))
//         emitVerificationChange(true)
//         onVerified?.(ui)
//         return true
//       }
//       return fresh.verified
//     } catch (err) {
//       console.debug('[useVerification] refresh failed:', err)
//       return false
//     }
//   }, [isVerified, onVerified])

//   return {
//     /** Whether the user's email is verified */
//     isVerified,
//     /** User's email (or null) */
//     email,
//     /** Whether a send request is in flight */
//     isSending,
//     /** True right after verification succeeds (nice for animations) */
//     justVerified,
//     /** Send (or resend) the verification email + poll */
//     sendVerificationEmail,
//     /** Manually re-check the backend */
//     refreshVerification,
//   }
// }


















// src/hooks/useVerification.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { AuthService } from '@/hooks/useAuth'
import {
  getFullProfile,
  mapApiToUi,
  type UiProfileData,
} from '@/lib/full-profile'
import {
  readProfileCache,
  writeProfileCache,
} from '@/lib/profile-cache'
import {
  emitVerificationChange,
  onVerificationChange,
} from '@/lib/verification-bus'

/* ============================================================================
   useVerification
   ----------------------------------------------------------------------------
   Single source of truth for "is my email verified?" state.

   What it does:
     1. Reads initial verified state from `current_user` (localStorage) —
        instant, no flicker.
     2. `sendVerificationEmail()` — sends via AuthService, then polls the
        backend every `pollIntervalMs` for up to `pollAttempts` attempts.
        When verified, it:
          - Updates the profile-cache (`chronify:profile:v1`)
          - Updates `current_user` in localStorage
          - Updates local React state
          - Broadcasts via verification-bus so ALL components sync
     3. Auto-checks whenever the tab regains focus (covers the "user
        clicked the link in their email, tabbed back" case).
     4. Reacts to global verification events (cross-component, cross-tab).

   Usage:
     const { isVerified, isSending, sendVerificationEmail } = useVerification({
       email: user?.email,
     })
   ============================================================================ */

export interface UseVerificationOptions {
  /** Email to send verification to. If omitted, reads from `current_user`. */
  email?: string | null

  /**
   * How many times to poll after sending the email.
   * Total wait = pollAttempts * pollIntervalMs.
   * Default: 5 attempts × 3000ms = 15 seconds.
   */
  pollAttempts?: number

  /** Delay between polls in milliseconds. Default: 3000. */
  pollIntervalMs?: number

  /**
   * Fired every time the user flips to verified.
   * Receives the freshly-mapped UiProfileData so the caller can
   * update its own UI state (avatar, bio, etc.) if it wants.
   */
  onVerified?: (profile: UiProfileData) => void
}

export function useVerification(options: UseVerificationOptions = {}) {
  const {
    email: emailOverride,
    pollAttempts = 5,
    pollIntervalMs = 3000,
    onVerified,
  } = options

  /* ------------------------------------------------------------------------
     INITIAL STATE — read from localStorage synchronously
     ------------------------------------------------------------------------ */
  const [email, setEmail] = useState<string | null>(() => {
    if (emailOverride) return emailOverride
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem('current_user')
      if (!raw) return null
      const parsed = JSON.parse(raw) as { email?: string }
      return parsed.email ?? null
    } catch {
      return null
    }
  })

  const [isVerified, setIsVerified] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      const raw = localStorage.getItem('current_user')
      if (!raw) return false
      const parsed = JSON.parse(raw) as { verified?: boolean }
      return parsed.verified === true
    } catch {
      return false
    }
  })

  const [isSending, setIsSending] = useState(false)
  const [justVerified, setJustVerified] = useState(false)

  // Prevent overlapping polling runs
  const pollAbortRef = useRef(false)
  const mountedRef = useRef(true)

  /* ------------------------------------------------------------------------
     Keep email in sync if the caller passes a new one
     ------------------------------------------------------------------------ */
  useEffect(() => {
    if (emailOverride && emailOverride !== email) {
      setEmail(emailOverride)
    }
  }, [emailOverride, email])

  /* ------------------------------------------------------------------------
     Cleanup on unmount — stop any in-flight polling
     ------------------------------------------------------------------------ */
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      pollAbortRef.current = true
    }
  }, [])

  /* ------------------------------------------------------------------------
     🔥 Central "we just got verified" handler
     Updates EVERY cache + notifies ALL listeners.
     ------------------------------------------------------------------------ */
  const commitVerified = useCallback(
    (uiProfile: UiProfileData) => {
      // 1️⃣ Profile cache (chronify:profile:v1)
      try {
        const fresh = readProfileCache()
        if (fresh) {
          writeProfileCache({
            apiProfile: {
              ...fresh.apiProfile,
              verified: true,
              profile:
                fresh.apiProfile.profile ?? null,
            },
            uiProfile: { ...uiProfile, verified: true },
          })
        }
      } catch (err) {
        console.warn('[useVerification] profile-cache write failed:', err)
      }

      // 2️⃣ User cache (current_user)
      try {
        const raw = localStorage.getItem('current_user')
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, unknown>
          parsed.verified = true
          localStorage.setItem('current_user', JSON.stringify(parsed))
        }
      } catch (err) {
        console.warn('[useVerification] current_user write failed:', err)
      }

      // 3️⃣ Local React state
      setIsVerified(true)
      setJustVerified(true)

      // 4️⃣ Global broadcast — every `useAuth()` and `useVerification()`
      //    instance, plus other browser tabs, will react to this.
      emitVerificationChange(true)

      // 5️⃣ Caller callback
      onVerified?.(uiProfile)
    },
    [onVerified]
  )

  /* ------------------------------------------------------------------------
     AUTO-CHECK: on tab focus / visibility change
     Covers the "user clicked the link in their inbox, came back" flow.
     ------------------------------------------------------------------------ */
  useEffect(() => {
    if (isVerified) return // already done, nothing to poll
    if (typeof window === 'undefined') return

    let cancelled = false

    const checkNow = async () => {
      if (cancelled) return
      if (document.visibilityState !== 'visible') return

      try {
        const fresh = await getFullProfile()
        if (cancelled) return

        if (fresh.verified) {
          const ui = mapApiToUi(fresh)
          commitVerified(ui)

          toast.success('Email verified! 🎉', {
            description: 'Your account is now verified.',
            duration: 5000,
          })
        }
      } catch (err) {
        // Silent — user probably hasn't verified yet
        console.debug('[useVerification] focus check failed:', err)
      }
    }

    document.addEventListener('visibilitychange', checkNow)
    window.addEventListener('focus', checkNow)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', checkNow)
      window.removeEventListener('focus', checkNow)
    }
  }, [isVerified, commitVerified])

  /* ------------------------------------------------------------------------
     REACT TO BUS EVENTS
     If another component (or another tab) verified the user,
     update our local state too.
     ------------------------------------------------------------------------ */
  useEffect(() => {
    const unsubscribe = onVerificationChange((verified) => {
      if (mountedRef.current) {
        setIsVerified(verified)
      }
    })
    return unsubscribe
  }, [])

  /* ------------------------------------------------------------------------
     SEND VERIFICATION EMAIL + POLL
     ------------------------------------------------------------------------ */
  const sendVerificationEmail = useCallback(async (): Promise<boolean> => {
    if (!email) {
      toast.error('No email address found on your account')
      return false
    }

    if (isSending) {
      // Already in flight — ignore duplicate clicks
      return false
    }

    setIsSending(true)
    pollAbortRef.current = false

    try {
      // 1️⃣ Backend call
      await AuthService.resendVerificationEmail(email)

      if (!mountedRef.current) return false

      toast.success('Verification email sent', {
        description: `We've sent a verification link to ${email}. Check your inbox (and spam folder).`,
        duration: 6000,
      })

      // 2️⃣ Poll for verification
      for (let attempt = 0; attempt < pollAttempts; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))

        if (pollAbortRef.current || !mountedRef.current) {
          return false
        }

        try {
          const fresh = await getFullProfile()
          if (fresh.verified) {
            const ui = mapApiToUi(fresh)
            commitVerified(ui)

            toast.success('Email verified! 🎉', {
              description: 'Your account is now verified. Enjoy full access!',
              duration: 5000,
            })

            return true
          }
        } catch (err) {
          // Silent — user probably hasn't verified yet
          console.debug(
            `[useVerification] poll attempt ${attempt + 1} failed:`,
            err
          )
        }
      }

      // 3️⃣ Not verified within polling window — inform user gently
      if (mountedRef.current) {
        toast.info('Still waiting for verification', {
          description:
            'Once you click the link in your email, this page will update automatically.',
          duration: 7000,
        })
      }
      return false
    } catch (err: unknown) {
      console.error('[useVerification] send failed:', err)

      const message =
        err instanceof Error
          ? err.message
          : typeof (err as { message?: string })?.message === 'string'
            ? (err as { message: string }).message
            : 'Please try again in a moment.'

      if (mountedRef.current) {
        toast.error('Could not send verification email', {
          description: message,
        })
      }
      return false
    } finally {
      if (mountedRef.current) {
        setIsSending(false)
      }
    }
  }, [
    email,
    isSending,
    pollAttempts,
    pollIntervalMs,
    commitVerified,
  ])

  /* ------------------------------------------------------------------------
     MANUAL REFRESH — check backend right now
     ------------------------------------------------------------------------ */
  const refreshVerification = useCallback(async (): Promise<boolean> => {
    try {
      const fresh = await getFullProfile()

      if (fresh.verified && !isVerified) {
        const ui = mapApiToUi(fresh)
        commitVerified(ui)
        return true
      }

      return fresh.verified
    } catch (err) {
      console.debug('[useVerification] refresh failed:', err)
      return false
    }
  }, [isVerified, commitVerified])

  return {
    /** Whether the user's email is verified */
    isVerified,

    /** User's email (or null if not available) */
    email,

    /** Whether a send/poll cycle is currently in flight */
    isSending,

    /** True right after successful verification (nice for animations) */
    justVerified,

    /** Send (or resend) the verification email + start polling */
    sendVerificationEmail,

    /** Manually re-check the backend right now */
    refreshVerification,
  }
}