// src/app/dashboard/settings/appearance/AppearanceClient.tsx
'use client'

import Link from 'next/link'
import { Toaster, toast } from 'sonner'
import {
  ArrowLeft,
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  Sparkles,
  Layout,
  Eye,
  Type,
} from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils'

/* ============================================================================
   DATA
   ============================================================================ */

const ACCENT_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Slate', value: '#64748B' },
]

/* ============================================================================
   COMPONENT
   ============================================================================ */

export default function AppearanceClient() {
  const { settings, isHydrated, updateSettings, reset } = useSettings()

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(
        'Reset appearance settings to their defaults?'
      )
      if (!ok) return
    }
    reset()
    toast.success('Appearance reset to defaults')
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading appearance…</p>
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
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Appearance
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Theme, accent color, and display density
                </p>
              </div>
            </div>
          </div>

          {/* ==================== THEME ==================== */}
          <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Theme
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Choose how Chronify looks on this device
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(
                  [
                    {
                      v: 'light',
                      label: 'Light',
                      icon: Sun,
                      preview: 'bg-white border-gray-200',
                    },
                    {
                      v: 'dark',
                      label: 'Dark',
                      icon: Moon,
                      preview: 'bg-gray-900 border-gray-700',
                    },
                    {
                      v: 'system',
                      label: 'System',
                      icon: Monitor,
                      preview:
                        'bg-gradient-to-br from-white to-gray-900 border-gray-400',
                    },
                  ] as const
                ).map((opt) => {
                  const active = settings.theme === opt.v
                  const Icon = opt.icon
                  return (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => {
                        updateSettings({ theme: opt.v })
                        toast.success(`${opt.label} theme applied`, {
                          duration: 1500,
                        })
                      }}
                      className={cn(
                        'rounded-lg border p-3 transition-all text-left',
                        active
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      )}
                    >
                      <div
                        className={cn(
                          'w-full h-16 rounded-md border mb-3 relative overflow-hidden',
                          opt.preview
                        )}
                      >
                        {/* Mini UI preview */}
                        <div className="absolute inset-0 p-2 space-y-1">
                          <div className="h-1.5 w-8 rounded-full bg-blue-500" />
                          <div className="h-1 w-12 rounded-full bg-gray-400/60" />
                          <div className="h-1 w-10 rounded-full bg-gray-400/40" />
                          <div className="h-1 w-14 rounded-full bg-gray-400/40" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {opt.label}
                          </span>
                        </div>
                        {active && (
                          <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* ==================== ACCENT COLOR ==================== */}
          <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <Palette className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Accent Color
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Used for buttons, links, and highlights
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {ACCENT_COLORS.map((c) => {
                  const active = settings.accentColor === c.value
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => {
                        updateSettings({ accentColor: c.value })
                        toast.success(`${c.name} accent applied`, {
                          duration: 1500,
                        })
                      }}
                      className={cn(
                        'aspect-square rounded-full transition-all hover:scale-110 relative',
                        active &&
                          'ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-gray-800'
                      )}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                      aria-label={`Set accent to ${c.name}`}
                    >
                      {active && (
                        <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="mt-5 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preview
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    style={{
                      backgroundColor: settings.accentColor,
                      color: 'white',
                    }}
                  >
                    Primary
                  </Button>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: settings.accentColor,
                      color: settings.accentColor,
                    }}
                  >
                    Badge
                  </Badge>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-sm font-medium hover:underline"
                    style={{ color: settings.accentColor }}
                  >
                    Link
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ==================== DISPLAY ==================== */}
          <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <Layout className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Display
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Layout density and motion preferences
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {/* Compact mode */}
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <Layout className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Compact mode
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Tighter spacing — fits more content on screen
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(v) => {
                      updateSettings({ compactMode: v })
                      toast.success(
                        v ? 'Compact mode enabled' : 'Compact mode disabled',
                        { duration: 1500 }
                      )
                    }}
                  />
                </div>

                {/* Reduced motion */}
                <div className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <Eye className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Reduced motion
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Minimize animations and transitions
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.reducedMotion}
                    onCheckedChange={(v) => {
                      updateSettings({ reducedMotion: v })
                      toast.success(
                        v
                          ? 'Reduced motion enabled'
                          : 'Reduced motion disabled',
                        { duration: 1500 }
                      )
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ==================== RESET ==================== */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-start gap-3 min-w-0">
              <Type className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Reset appearance
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Restore theme, accent color, and display defaults
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex-shrink-0"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}