// src/app/dashboard/settings/security/page.tsx
import type { Metadata } from 'next'
import SecurityClient from './SecurityClient'

export const metadata: Metadata = {
  title: 'Security · Chronify',
}

export default function SecurityPage() {
  return <SecurityClient />
}