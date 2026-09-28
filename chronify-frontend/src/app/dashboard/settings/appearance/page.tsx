// src/app/dashboard/settings/appearance/page.tsx
import type { Metadata } from 'next'
import AppearanceClient from './AppearanceClient'

export const metadata: Metadata = {
  title: 'Appearance · Chronify',
  description: 'Customize how Chronify looks and feels',
}

export default function AppearancePage() {
  return <AppearanceClient />
}