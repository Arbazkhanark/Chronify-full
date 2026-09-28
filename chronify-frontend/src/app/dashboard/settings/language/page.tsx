// src/app/dashboard/settings/language/page.tsx
import type { Metadata } from 'next'
import LanguageRegionClient from './LanguageRegionClient'

export const metadata: Metadata = {
  title: 'Language & Region · Chronify',
  description: 'Configure your language, timezone, and date formats',
}

export default function LanguageRegionPage() {
  return <LanguageRegionClient />
}