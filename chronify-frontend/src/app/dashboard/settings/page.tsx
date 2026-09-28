// src/app/dashboard/settings/page.tsx
import type { Metadata } from 'next'
import SettingsClient from './SettingsClient'

export const metadata: Metadata = {
  title: 'Settings · Chronify',
  description: 'Manage your Chronify account settings and preferences',
}

export default function SettingsPage() {
  return <SettingsClient />
}