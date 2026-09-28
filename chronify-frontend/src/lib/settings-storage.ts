// src/lib/settings-storage.ts
/* ============================================================================
   SETTINGS STORAGE
   Local-first settings store. Everything lives under one key.
   Syncs across tabs via storage events.
   ============================================================================ */

const SETTINGS_KEY = 'chronify:settings:v1'

export type ThemePreference = 'light' | 'dark' | 'system'
export type EmailFrequency = 'instant' | 'daily' | 'weekly' | 'never'

export interface UserSettings {
  /* -------- Appearance -------- */
  theme: ThemePreference
  accentColor: string
  reducedMotion: boolean
  compactMode: boolean

  /* -------- Notifications -------- */
  emailNotifications: boolean
  pushNotifications: boolean
  taskReminders: boolean
  goalDeadlines: boolean
  weeklyDigest: boolean
  achievementAlerts: boolean
  emailFrequency: EmailFrequency
  notifyBeforeTask: number // minutes before task start

  /* -------- Productivity -------- */
  autoStartTasks: boolean
  defaultTaskDuration: number // minutes
  gracePeriod: number // minutes
  playSound: boolean
  autoRefreshData: boolean

  /* -------- Privacy -------- */
  profileVisibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE'
  showOnlineStatus: boolean
  showStatsPublicly: boolean
  allowMessagesFrom: 'everyone' | 'connections' | 'nobody'

  /* -------- Language & Region -------- */
  language: string
  timezone: string
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  timeFormat: '12h' | '24h'
  weekStartsOn: 0 | 1 // 0 = Sunday, 1 = Monday

  /* -------- Last updated -------- */
  updatedAt: number
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  accentColor: '#3B82F6',
  reducedMotion: false,
  compactMode: false,

  emailNotifications: true,
  pushNotifications: true,
  taskReminders: true,
  goalDeadlines: true,
  weeklyDigest: true,
  achievementAlerts: true,
  emailFrequency: 'daily',
  notifyBeforeTask: 15,

  autoStartTasks: false,
  defaultTaskDuration: 60,
  gracePeriod: 10,
  playSound: true,
  autoRefreshData: true,

  profileVisibility: 'PUBLIC',
  showOnlineStatus: true,
  showStatsPublicly: true,
  allowMessagesFrom: 'connections',

  language: 'en',
  timezone:
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'UTC',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  weekStartsOn: 1,

  updatedAt: Date.now(),
}

/* -------- In-memory mirror for fast reads -------- */
let memoryCache: UserSettings | null = null

const isBrowser = () => typeof window !== 'undefined'

export function readSettings(): UserSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS
  if (memoryCache) return memoryCache

  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS

    const parsed = JSON.parse(raw) as Partial<UserSettings>
    // Merge with defaults so newly-added fields don't break old caches
    const merged: UserSettings = { ...DEFAULT_SETTINGS, ...parsed }
    memoryCache = merged
    return merged
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function writeSettings(next: UserSettings): void {
  if (!isBrowser()) return
  const stamped: UserSettings = { ...next, updatedAt: Date.now() }
  memoryCache = stamped
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(stamped))
    // Notify other tabs
    localStorage.setItem(
      'chronify:settings-ping',
      String(stamped.updatedAt)
    )
  } catch (err) {
    console.warn('[settings-storage] write failed:', err)
  }
}

export function patchSettings(patch: Partial<UserSettings>): UserSettings {
  const current = readSettings()
  const next = { ...current, ...patch }
  writeSettings(next)
  return next
}

export function clearSettings(): void {
  if (!isBrowser()) return
  memoryCache = null
  try {
    localStorage.removeItem(SETTINGS_KEY)
  } catch {
    /* ignore */
  }
}

export function resetSettings(): UserSettings {
  writeSettings({ ...DEFAULT_SETTINGS })
  return { ...DEFAULT_SETTINGS }
}

/* -------- Cross-tab listener -------- */
type SettingsListener = (settings: UserSettings) => void
const listeners = new Set<SettingsListener>()

export function onSettingsChange(fn: SettingsListener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

function emitLocal(settings: UserSettings) {
  for (const fn of listeners) {
    try {
      fn(settings)
    } catch (err) {
      console.warn('[settings-storage] listener error:', err)
    }
  }
}

if (isBrowser()) {
  window.addEventListener('storage', (event) => {
    if (event.key !== SETTINGS_KEY || !event.newValue) return
    try {
      const parsed = JSON.parse(event.newValue) as UserSettings
      memoryCache = parsed
      emitLocal(parsed)
    } catch {
      /* ignore */
    }
  })
}

// Emit local changes too — hook wraps writeSettings/patchSettings
export function notifyLocal(settings: UserSettings) {
  emitLocal(settings)
}