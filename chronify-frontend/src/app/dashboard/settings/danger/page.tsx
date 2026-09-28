// src/app/dashboard/settings/danger/page.tsx
import type { Metadata } from 'next'
import DangerZoneClient from './DangerZoneClient'

export const metadata: Metadata = {
  title: 'Danger Zone · Chronify',
  description: 'Irreversible account actions',
}

export default function DangerZonePage() {
  return <DangerZoneClient />
}