// src/app/dashboard/settings/productivity/page.tsx
import type { Metadata } from 'next'
import ProductivityClient from './ProductivityClient'

export const metadata: Metadata = {
  title: 'Productivity · Chronify',
  description: 'Tune task timers, sounds, and automation',
}

export default function ProductivityPage() {
  return <ProductivityClient />
}