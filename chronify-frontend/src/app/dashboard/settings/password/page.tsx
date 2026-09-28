// src/app/dashboard/settings/password/page.tsx
import type { Metadata } from 'next'
import ChangePasswordClient from './ChangePasswordClient'

export const metadata: Metadata = {
  title: 'Change Password · Chronify',
}

export default function ChangePasswordPage() {
  return <ChangePasswordClient />
}