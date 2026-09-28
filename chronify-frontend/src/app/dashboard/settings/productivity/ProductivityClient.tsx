// src/app/dashboard/settings/productivity/ProductivityClient.tsx
'use client'

import Link from 'next/link'
import { Toaster, toast } from 'sonner'
import {
  ArrowLeft,
  Zap,
  Timer,
  Play,
  Volume2,
  RefreshCw,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
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
   COMPONENT
   ============================================================================ */

export default function ProductivityClient() {
  const { settings, isHydrated, updateSettings, reset } = useSettings()

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(
        'Reset productivity settings to their defaults?'
      )
      if (!ok) return
    }
    reset()
    toast.success('Productivity reset to defaults')
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading productivity settings…</p>
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
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Productivity
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tune task timers, sounds, and automation
                </p>
              </div>
            </div>
          </div>

          {/* ==================== TASK BEHAVIOR ==================== */}
          <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <Play className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Task Behavior
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    How tasks auto-start and complete
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Auto-start */}
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-3 min-w-0">
                  <Play className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Auto-start tasks
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Start the timer automatically when a task begins
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.autoStartTasks}
                  onCheckedChange={(v) => {
                    updateSettings({ autoStartTasks: v })
                    toast.success(
                      v ? 'Auto-start enabled' : 'Auto-start disabled',
                      { duration: 1500 }
                    )
                  }}
                />
              </div>

              {/* Grace period */}
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-3 min-w-0">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Grace period
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Extra time before a task is marked as missed
                    </p>
                  </div>
                </div>
                <Select
                  value={String(settings.gracePeriod)}
                  onValueChange={(v) => {
                    updateSettings({ gracePeriod: Number(v) })
                    toast.success('Grace period updated', { duration: 1500 })
                  }}
                >
                  <SelectTrigger className="w-28 h-9 flex-shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="5">5 min</SelectItem>
                    <SelectItem value="10">10 min</SelectItem>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Default duration */}
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-start gap-3 min-w-0">
                  <Timer className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Default task duration
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Pre-filled duration when creating a new task
                    </p>
                  </div>
                </div>
                <Select
                  value={String(settings.defaultTaskDuration)}
                  onValueChange={(v) => {
                    updateSettings({ defaultTaskDuration: Number(v) })
                    toast.success('Default duration updated', {
                      duration: 1500,
                    })
                  }}
                >
                  <SelectTrigger className="w-28 h-9 flex-shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* ==================== SOUNDS & FEEDBACK ==================== */}
          <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <Volume2 className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Sounds & Feedback
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Audio and visual cues during sessions
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-start gap-3 min-w-0">
                  <Volume2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Play sounds
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Play audio cues on task start and completion
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.playSound}
                  onCheckedChange={(v) => {
                    updateSettings({ playSound: v })
                    toast.success(v ? 'Sounds enabled' : 'Sounds muted', {
                      duration: 1500,
                    })
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* ==================== DATA & SYNC ==================== */}
          <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Data & Sync
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Background refresh and cache behavior
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-start gap-3 min-w-0">
                  <RefreshCw className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Auto-refresh data
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Keep dashboard data fresh in the background
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.autoRefreshData}
                  onCheckedChange={(v) => {
                    updateSettings({ autoRefreshData: v })
                    toast.success(
                      v ? 'Auto-refresh enabled' : 'Auto-refresh disabled',
                      { duration: 1500 }
                    )
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* ==================== SUMMARY ==================== */}
          <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Current Configuration
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Quick summary of your productivity preferences
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Auto-start
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {settings.autoStartTasks ? 'On' : 'Off'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Grace period
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {settings.gracePeriod === 0
                      ? 'None'
                      : `${settings.gracePeriod} min`}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Default duration
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {settings.defaultTaskDuration} min
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Sounds
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {settings.playSound ? 'On' : 'Off'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ==================== RESET ==================== */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-start gap-3 min-w-0">
              <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Reset productivity settings
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Restore timers, sounds, and automation defaults
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