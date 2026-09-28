// src/app/dashboard/settings/SettingsClient.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import {
  ArrowLeft,
  User,
  Palette,
  Bell,
  Shield,
  Lock,
  Zap,
  Globe,
  AlertCircle,
  ChevronRight,
  Save,
  RotateCcw,
  Loader2,
  Check,
  X,
  Sun,
  Moon,
  Monitor,
  Mail,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useSettings } from '@/hooks/useSettings'
import { useVerification } from '@/hooks/useVerification'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

import { SettingsSidebar } from './_components/SettingsSidebar'
import { SettingSection } from './_components/SettingSection'
import { SettingRow } from './_components/SettingRow'
import { ToggleRow } from './_components/ToggleRow'

const ACCENT_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
]

export default function SettingsClient() {
  const { user } = useAuth()
  const { settings, isHydrated, updateSettings, reset } = useSettings()
  const { isVerified } = useVerification({ email: user?.email })

  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'))
  }, [settings.theme])

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(
        'Reset all settings to their defaults? This cannot be undone.'
      )
      if (!ok) return
    }
    reset()
    toast.success('Settings reset to defaults')
  }

  const handleAccentChange = (color: string) => {
    updateSettings({ accentColor: color })
    toast.success('Accent color updated', { duration: 1500 })
  }

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={darkMode ? 'dark' : 'light'}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8 transition-colors">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Dashboard
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Settings
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage your account preferences, notifications, and privacy
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </Button>
            </div>
          </motion.div>

          {/* Body */}
          <div className="flex flex-col lg:flex-row gap-6">
            <SettingsSidebar />

            <div className="flex-1 min-w-0 space-y-6">
              {/* Verification banner */}
              {user && !isVerified && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-amber-300/70 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/40">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-100 flex-1 min-w-0">
                      <span className="font-semibold">Verify your email</span>{' '}
                      to unlock messaging and connections.
                    </p>
                    <Link
                      href="/dashboard/settings/security"
                      className="text-xs font-medium text-amber-800 dark:text-amber-200 hover:underline"
                    >
                      Go to Security
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* ==================== ACCOUNT ==================== */}
              <SettingSection
                icon={User}
                title="Account"
                description="Your basic account information"
              >
                <SettingRow label="Name" description="Displayed on your profile">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user?.name || '—'}
                  </span>
                </SettingRow>
                <SettingRow label="Email" description="Used for login and notifications">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                      {user?.email || '—'}
                    </span>
                    {isVerified ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-green-300 text-green-700 dark:border-green-700/60 dark:text-green-400"
                      >
                        <Check className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-amber-300 text-amber-700 dark:border-amber-700/60 dark:text-amber-400"
                      >
                        <X className="w-3 h-3 mr-1" /> Unverified
                      </Badge>
                    )}
                  </div>
                </SettingRow>
                <SettingRow
                  label="Profile settings"
                  description="Edit your bio, photos, and links"
                >
                  <Link
                    href="/profile"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Open Profile
                  </Link>
                </SettingRow>
              </SettingSection>

              {/* ==================== APPEARANCE ==================== */}
              <SettingSection
                icon={Palette}
                title="Appearance"
                description="Customize how Chronify looks"
              >
                <SettingRow
                  label="Theme"
                  description="Choose light, dark, or follow your system"
                >
                  <Select
                    value={settings.theme}
                    onValueChange={(v) =>
                      updateSettings({
                        theme: v as 'light' | 'dark' | 'system',
                      })
                    }
                  >
                    <SelectTrigger className="w-32 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-3.5 h-3.5" /> Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-3.5 h-3.5" /> Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-3.5 h-3.5" /> System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>

                <SettingRow
                  label="Accent color"
                  description="Used for buttons and highlights"
                >
                  <div className="flex items-center gap-1.5">
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => handleAccentChange(c.value)}
                        className={cn(
                          'w-6 h-6 rounded-full transition-transform hover:scale-110',
                          settings.accentColor === c.value &&
                            'ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-gray-800'
                        )}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                        aria-label={`Set accent color to ${c.name}`}
                      />
                    ))}
                  </div>
                </SettingRow>

                <ToggleRow
                  label="Compact mode"
                  description="Denser layout, more content per screen"
                  checked={settings.compactMode}
                  onCheckedChange={(v) => updateSettings({ compactMode: v })}
                />

                <ToggleRow
                  label="Reduced motion"
                  description="Minimize animations across the app"
                  checked={settings.reducedMotion}
                  onCheckedChange={(v) => updateSettings({ reducedMotion: v })}
                />
              </SettingSection>

              {/* ==================== NOTIFICATIONS ==================== */}
              <SettingSection
                icon={Bell}
                title="Notifications"
                description="Choose what you want to be notified about"
              >
                <ToggleRow
                  label="Email notifications"
                  description="Receive updates via email"
                  checked={settings.emailNotifications}
                  onCheckedChange={(v) =>
                    updateSettings({ emailNotifications: v })
                  }
                />

                {settings.emailNotifications && (
                  <SettingRow
                    label="Email frequency"
                    description="How often we send digest emails"
                  >
                    <Select
                      value={settings.emailFrequency}
                      onValueChange={(v) =>
                        updateSettings({
                          emailFrequency: v as
                            | 'instant'
                            | 'daily'
                            | 'weekly'
                            | 'never',
                        })
                      }
                    >
                      <SelectTrigger className="w-32 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                )}

                <ToggleRow
                  label="Push notifications"
                  description="Browser push notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(v) =>
                    updateSettings({ pushNotifications: v })
                  }
                />

                <ToggleRow
                  label="Task reminders"
                  description={`Notify ${settings.notifyBeforeTask} min before each task`}
                  checked={settings.taskReminders}
                  onCheckedChange={(v) =>
                    updateSettings({ taskReminders: v })
                  }
                />

                {settings.taskReminders && (
                  <SettingRow
                    label="Remind me before"
                    description="Minutes before task start"
                  >
                    <Select
                      value={String(settings.notifyBeforeTask)}
                      onValueChange={(v) =>
                        updateSettings({ notifyBeforeTask: Number(v) })
                      }
                    >
                      <SelectTrigger className="w-24 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 min</SelectItem>
                        <SelectItem value="10">10 min</SelectItem>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                )}

                <ToggleRow
                  label="Goal deadline alerts"
                  description="Alerts when a goal is nearing its deadline"
                  checked={settings.goalDeadlines}
                  onCheckedChange={(v) =>
                    updateSettings({ goalDeadlines: v })
                  }
                />

                <ToggleRow
                  label="Weekly digest"
                  description="Weekly summary of your progress"
                  checked={settings.weeklyDigest}
                  onCheckedChange={(v) =>
                    updateSettings({ weeklyDigest: v })
                  }
                />

                <ToggleRow
                  label="Achievement alerts"
                  description="Celebrate milestones and streaks"
                  checked={settings.achievementAlerts}
                  onCheckedChange={(v) =>
                    updateSettings({ achievementAlerts: v })
                  }
                />
              </SettingSection>

              {/* ==================== PRODUCTIVITY ==================== */}
              <SettingSection
                icon={Zap}
                title="Productivity"
                description="Tune how tasks and timers behave"
                accent="text-amber-600 dark:text-amber-400"
              >
                <ToggleRow
                  label="Auto-start tasks"
                  description="Start timer automatically when a task begins"
                  checked={settings.autoStartTasks}
                  onCheckedChange={(v) =>
                    updateSettings({ autoStartTasks: v })
                  }
                />

                <SettingRow
                  label="Default task duration"
                  description="Pre-filled duration for new tasks"
                >
                  <Select
                    value={String(settings.defaultTaskDuration)}
                    onValueChange={(v) =>
                      updateSettings({ defaultTaskDuration: Number(v) })
                    }
                  >
                    <SelectTrigger className="w-24 h-9">
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
                </SettingRow>

                <SettingRow
                  label="Grace period"
                  description="Extra time before a task is marked missed"
                >
                  <Select
                    value={String(settings.gracePeriod)}
                    onValueChange={(v) =>
                      updateSettings({ gracePeriod: Number(v) })
                    }
                  >
                    <SelectTrigger className="w-24 h-9">
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
                </SettingRow>

                <ToggleRow
                  label="Play sounds"
                  description="Audio cues on task start and completion"
                  checked={settings.playSound}
                  onCheckedChange={(v) => updateSettings({ playSound: v })}
                />

                <ToggleRow
                  label="Auto-refresh data"
                  description="Keep dashboard data fresh in the background"
                  checked={settings.autoRefreshData}
                  onCheckedChange={(v) =>
                    updateSettings({ autoRefreshData: v })
                  }
                />
              </SettingSection>

              {/* ==================== PRIVACY ==================== */}
              <SettingSection
                icon={Shield}
                title="Privacy"
                description="Control who can see your activity"
                accent="text-purple-600 dark:text-purple-400"
              >
                <SettingRow
                  label="Profile visibility"
                  description="Who can see your profile page"
                >
                  <Select
                    value={settings.profileVisibility}
                    onValueChange={(v) =>
                      updateSettings({
                        profileVisibility: v as
                          | 'PUBLIC'
                          | 'FRIENDS_ONLY'
                          | 'PRIVATE',
                      })
                    }
                  >
                    <SelectTrigger className="w-36 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="FRIENDS_ONLY">Connections</SelectItem>
                      <SelectItem value="PRIVATE">Only me</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>

                <ToggleRow
                  label="Show online status"
                  description="Let others see when you're active"
                  checked={settings.showOnlineStatus}
                  onCheckedChange={(v) =>
                    updateSettings({ showOnlineStatus: v })
                  }
                />

                <ToggleRow
                  label="Show stats publicly"
                  description="Display streaks and stats on your profile"
                  checked={settings.showStatsPublicly}
                  onCheckedChange={(v) =>
                    updateSettings({ showStatsPublicly: v })
                  }
                />

                <SettingRow
                  label="Allow messages from"
                  description="Who can send you direct messages"
                >
                  <Select
                    value={settings.allowMessagesFrom}
                    onValueChange={(v) =>
                      updateSettings({
                        allowMessagesFrom: v as
                          | 'everyone'
                          | 'connections'
                          | 'nobody',
                      })
                    }
                  >
                    <SelectTrigger className="w-32 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="connections">Connections</SelectItem>
                      <SelectItem value="nobody">Nobody</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>
              </SettingSection>

              {/* ==================== LANGUAGE ==================== */}
              <SettingSection
                icon={Globe}
                title="Language & Region"
                description="Language, timezone, and date formats"
                accent="text-teal-600 dark:text-teal-400"
              >
                <SettingRow label="Language" description="Interface language">
                  <Select
                    value={settings.language}
                    onValueChange={(v) => updateSettings({ language: v })}
                  >
                    <SelectTrigger className="w-32 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>

                <SettingRow label="Timezone" description="Used for scheduling">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {settings.timezone}
                  </span>
                </SettingRow>

                <SettingRow label="Date format">
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(v) =>
                      updateSettings({
                        dateFormat: v as
                          | 'MM/DD/YYYY'
                          | 'DD/MM/YYYY'
                          | 'YYYY-MM-DD',
                      })
                    }
                  >
                    <SelectTrigger className="w-32 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>

                <SettingRow label="Time format">
                  <Select
                    value={settings.timeFormat}
                    onValueChange={(v) =>
                      updateSettings({ timeFormat: v as '12h' | '24h' })
                    }
                  >
                    <SelectTrigger className="w-32 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>

                <SettingRow
                  label="Week starts on"
                  description="First day of the week"
                >
                  <Select
                    value={String(settings.weekStartsOn)}
                    onValueChange={(v) =>
                      updateSettings({
                        weekStartsOn: Number(v) === 0 ? 0 : 1,
                      })
                    }
                  >
                    <SelectTrigger className="w-32 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>
              </SettingSection>

              {/* ==================== SECURITY ==================== */}
              <SettingSection
                icon={Lock}
                title="Security"
                description="Password, sessions, and 2FA"
                accent="text-red-600 dark:text-red-400"
              >
                <SettingRow
                  label="Change password"
                  description="Update your account password"
                  href="/dashboard/settings/password"
                >
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </SettingRow>

                <SettingRow
                  label="Security overview"
                  description="View sessions, activity, and 2FA"
                  href="/dashboard/settings/security"
                >
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </SettingRow>
              </SettingSection>

              {/* ==================== DANGER ZONE ==================== */}
              <SettingSection
                icon={AlertCircle}
                title="Danger Zone"
                description="Irreversible actions — proceed with caution"
                accent="text-red-600 dark:text-red-400"
              >
                <SettingRow
                  label="Delete account"
                  description="Permanently delete your account and all data"
                  href="/dashboard/settings/danger"
                >
                  <Badge
                    variant="outline"
                    className="text-[10px] border-red-300 text-red-700 dark:border-red-700/60 dark:text-red-400"
                  >
                    Irreversible
                  </Badge>
                </SettingRow>
              </SettingSection>

              {/* Footer note */}
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-2">
                Settings are saved automatically and synced across your devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}