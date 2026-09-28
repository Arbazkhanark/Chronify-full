// src/app/dashboard/settings/_components/SettingsSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  User,
  Bell,
  Palette,
  Shield,
  Lock,
  Trash2,
  Globe,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard/settings', label: 'General', icon: User },
  { href: '/dashboard/settings/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/settings/appearance', label: 'Appearance', icon: Palette },
  { href: '/dashboard/settings/productivity', label: 'Productivity', icon: Zap },
  { href: '/dashboard/settings/privacy', label: 'Privacy', icon: Shield },
  { href: '/dashboard/settings/security', label: 'Security', icon: Lock },
  { href: '/dashboard/settings/language', label: 'Language & Region', icon: Globe },
  { href: '/dashboard/settings/danger', label: 'Danger Zone', icon: Trash2 },
]

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard/settings' &&
              pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}