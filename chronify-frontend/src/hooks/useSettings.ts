// src/hooks/useSettings.ts
'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_SETTINGS,
  onSettingsChange,
  patchSettings as patchStorage,
  readSettings,
  resetSettings as resetStorage,
  writeSettings,
  notifyLocal,
  type UserSettings,
} from '@/lib/settings-storage'

/* ============================================================================
   useSettings
   Single source of truth for user settings.
   - Hydrates from localStorage instantly
   - Applies side effects (theme class on <html>, etc.)
   - Syncs across tabs
   ============================================================================ */

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(() =>
    typeof window !== 'undefined' ? readSettings() : DEFAULT_SETTINGS
  )

  const [isHydrated, setIsHydrated] = useState(false)

  /* ---------------- Hydrate on mount ---------------- */
  useEffect(() => {
    setSettings(readSettings())
    setIsHydrated(true)
  }, [])

  /* ---------------- Cross-tab / cross-component sync ---------------- */
  useEffect(() => {
    const unsubscribe = onSettingsChange((next) => {
      setSettings(next)
    })
    return unsubscribe
  }, [])

  /* ---------------- Apply theme side effects ---------------- */
  useEffect(() => {
    if (!isHydrated) return
    if (typeof window === 'undefined') return

    const root = document.documentElement

    let effectiveTheme = settings.theme
    if (settings.theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }

    root.classList.toggle('dark', effectiveTheme === 'dark')

    // Accent color as a CSS variable (optional — good for theming)
    root.style.setProperty('--accent-color', settings.accentColor)

    // Reduced motion
    root.classList.toggle('motion-reduce', settings.reducedMotion)

    // Compact mode (a11y / density)
    root.classList.toggle('compact-mode', settings.compactMode)

    // Also persist the darkMode key used elsewhere in the app
    localStorage.setItem('darkMode', String(effectiveTheme === 'dark'))
  }, [settings, isHydrated])

  /* ---------------- Listen for system theme changes ---------------- */
  useEffect(() => {
    if (settings.theme !== 'system') return
    if (typeof window === 'undefined') return

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      // Re-run the effect by bumping state
      setSettings((prev) => ({ ...prev }))
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [settings.theme])

  /* ---------------- Updater ---------------- */
  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    const next = patchStorage(patch)
    setSettings(next)
    notifyLocal(next)
    return next
  }, [])

  const replaceSettings = useCallback((next: UserSettings) => {
    writeSettings(next)
    setSettings(next)
    notifyLocal(next)
    return next
  }, [])

  const reset = useCallback(() => {
    const next = resetStorage()
    setSettings(next)
    notifyLocal(next)
    return next
  }, [])

  return {
    settings,
    isHydrated,
    updateSettings,
    replaceSettings,
    reset,
  }
}