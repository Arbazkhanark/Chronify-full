// src/app/dashboard/settings/language/LanguageRegionClient.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import {
  ArrowLeft,
  Globe,
  Clock,
  Calendar,
  Languages,
  Timer,
  Sparkles,
  Check,
  Info,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils'

/* ============================================================================
   DATA
   ============================================================================ */

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
]

/** A curated list of common timezones; falls back to `Intl` list if available */
function getTimezoneList(): string[] {
  // Modern browsers support `Intl.supportedValuesOf('timeZone')`
  try {
    const supported = (Intl as any).supportedValuesOf?.('timeZone')
    if (Array.isArray(supported) && supported.length > 0) {
      return supported as string[]
    }
  } catch {
    /* ignore */
  }

  // Fallback — small curated list
  return [
    'UTC',
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'America/New_York',
    'America/Chicago',
    'America/Los_Angeles',
    'America/Sao_Paulo',
    'Australia/Sydney',
  ]
}

/* ============================================================================
   HELPERS
   ============================================================================ */

function formatTimezoneLabel(tz: string): string {
  // "Asia/Kolkata" → "Asia / Kolkata (GMT+5:30)"
  const pretty = tz.replace(/_/g, ' ').replace('/', ' / ')
  let offsetLabel = ''

  try {
    const now = new Date()
    const offsetStr = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    })
      .formatToParts(now)
      .find((p) => p.type === 'timeZoneName')?.value

    if (offsetStr) offsetLabel = ` (${offsetStr})`
  } catch {
    /* ignore */
  }

  return `${pretty}${offsetLabel}`
}

/* ============================================================================
   COMPONENT
   ============================================================================ */

export default function LanguageRegionClient() {
  const { settings, isHydrated, updateSettings } = useSettings()

  const [search, setSearch] = useState('')
  const [now, setNow] = useState(new Date())

  // Live clock (updates every second)
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timezones = useMemo(() => getTimezoneList(), [])

  const filteredTimezones = useMemo(() => {
    if (!search.trim()) return timezones
    const q = search.toLowerCase()
    return timezones.filter((tz) => tz.toLowerCase().includes(q))
  }, [timezones, search])

  const previewTime = useMemo(() => {
    const opts: Intl.DateTimeFormatOptions =
      settings.timeFormat === '24h'
        ? { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
        : { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }
    try {
      return new Intl.DateTimeFormat('en-US', {
        ...opts,
        timeZone: settings.timezone,
      }).format(now)
    } catch {
      return now.toLocaleTimeString()
    }
  }, [now, settings.timeFormat, settings.timezone])

  const previewDate = useMemo(() => {
    const d = now
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = String(d.getFullYear())

    switch (settings.dateFormat) {
      case 'MM/DD/YYYY':
        return `${mm}/${dd}/${yyyy}`
      case 'YYYY-MM-DD':
        return `${yyyy}-${mm}-${dd}`
      default:
        return `${dd}/${mm}/${yyyy}`
    }
  }, [now, settings.dateFormat])

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading preferences…</p>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Settings
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Language & Region
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Language, timezone, date, and time format
                </p>
              </div>
            </div>
          </div>

          {/* ==================== LANGUAGE ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <Languages className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Language
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Interface language — more languages coming soon
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <Select
                  value={settings.language}
                  onValueChange={(v) => {
                    updateSettings({ language: v })
                    toast.success('Language updated', { duration: 1500 })
                  }}
                >
                  <SelectTrigger className="w-full sm:w-64 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{l.label}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {l.native}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/60">
                  <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    Currently, only English has full translations. Other
                    languages will fall back to English where needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ==================== TIMEZONE ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Timezone
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Used for scheduling tasks and reminders
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <input
                  type="text"
                  placeholder="Search timezone…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    'w-full h-10 px-3 rounded-md border text-sm',
                    'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600',
                    'text-gray-900 dark:text-gray-100',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500/40'
                  )}
                />

                <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredTimezones.length === 0 && (
                    <p className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                      No timezones found
                    </p>
                  )}
                  {filteredTimezones.map((tz) => {
                    const selected = settings.timezone === tz
                    return (
                      <button
                        key={tz}
                        type="button"
                        onClick={() => {
                          updateSettings({ timezone: tz })
                          toast.success('Timezone updated', { duration: 1500 })
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors',
                          selected
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                        )}
                      >
                        <span className="truncate">
                          {formatTimezoneLabel(tz)}
                        </span>
                        {selected && (
                          <Check className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                  <Sparkles className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Detected:{' '}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {Intl.DateTimeFormat().resolvedOptions().timeZone}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ==================== DATE & TIME ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Date & Time Format
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      How dates and times are displayed across the app
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Date format
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(
                      [
                        { v: 'DD/MM/YYYY', example: '25/01/2025' },
                        { v: 'MM/DD/YYYY', example: '01/25/2025' },
                        { v: 'YYYY-MM-DD', example: '2025-01-25' },
                      ] as const
                    ).map((opt) => {
                      const active = settings.dateFormat === opt.v
                      return (
                        <button
                          key={opt.v}
                          type="button"
                          onClick={() => {
                            updateSettings({ dateFormat: opt.v })
                            toast.success('Date format updated', {
                              duration: 1500,
                            })
                          }}
                          className={cn(
                            'p-3 rounded-lg border text-left transition-all',
                            active
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {opt.v}
                            </span>
                            {active && (
                              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {opt.example}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Time format
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(
                      [
                        { v: '12h', label: '12-hour', example: '2:30 PM' },
                        { v: '24h', label: '24-hour', example: '14:30' },
                      ] as const
                    ).map((opt) => {
                      const active = settings.timeFormat === opt.v
                      return (
                        <button
                          key={opt.v}
                          type="button"
                          onClick={() => {
                            updateSettings({ timeFormat: opt.v })
                            toast.success('Time format updated', {
                              duration: 1500,
                            })
                          }}
                          className={cn(
                            'p-3 rounded-lg border text-left transition-all',
                            active
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {opt.label}
                            </span>
                            {active && (
                              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {opt.example}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Week starts on
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { v: 0, label: 'Sunday' },
                        { v: 1, label: 'Monday' },
                      ] as const
                    ).map((opt) => {
                      const active = settings.weekStartsOn === opt.v
                      return (
                        <button
                          key={opt.v}
                          type="button"
                          onClick={() => {
                            updateSettings({ weekStartsOn: opt.v })
                            toast.success('Week start updated', {
                              duration: 1500,
                            })
                          }}
                          className={cn(
                            'p-3 rounded-lg border text-left transition-all',
                            active
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {opt.label}
                            </span>
                            {active && (
                              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ==================== LIVE PREVIEW ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <Timer className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Live Preview
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      See how dates and times will look
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Time
                    </p>
                    <p className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
                      {previewTime}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Date
                    </p>
                    <p className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
                      {previewDate}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Week starts
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {settings.weekStartsOn === 0 ? 'Sunday' : 'Monday'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {settings.timezone}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {settings.dateFormat}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {settings.timeFormat === '12h' ? '12-hour' : '24-hour'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}