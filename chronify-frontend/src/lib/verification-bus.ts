// src/lib/verification-bus.ts
/* ============================================================================
   VERIFICATION BUS
   Lightweight pub/sub for "user just got verified" events.
   Any component can emit; any component can subscribe.
   Also syncs across browser tabs via storage events.
   ============================================================================ */

type Listener = (verified: boolean) => void

const listeners = new Set<Listener>()

export function onVerificationChange(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function emitVerificationChange(verified: boolean): void {
  // Notify in-tab listeners
  for (const fn of listeners) {
    try {
      fn(verified)
    } catch (err) {
      console.warn('[verification-bus] listener error:', err)
    }
  }

  // Notify other tabs via localStorage ping
  if (typeof window !== 'undefined') {
    try {
      // Use a timestamped ping so each emit is unique
      localStorage.setItem(
        'chronify:verify-ping',
        JSON.stringify({ verified, at: Date.now() })
      )
    } catch {
      /* ignore */
    }
  }
}

/* Cross-tab listener — set up once per page */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== 'chronify:verify-ping' || !event.newValue) return
    try {
      const parsed = JSON.parse(event.newValue) as { verified: boolean }
      for (const fn of listeners) {
        try {
          fn(parsed.verified)
        } catch (err) {
          console.warn('[verification-bus] cross-tab listener error:', err)
        }
      }
    } catch {
      /* ignore */
    }
  })
}