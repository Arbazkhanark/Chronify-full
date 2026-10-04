// src/components/features/feed/FeedLeftSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Compass,
  Bell,
  Bookmark,
  User,
  Settings,
  Target,
  Calendar,
  BarChart3,
  Brain,
  Pickaxe,
} from 'lucide-react'
import type { User as UserType } from '@/hooks/useAuth'
import UserAvatar from '@/components/shared/UserAvatar'

interface FeedLeftSidebarProps {
  user: UserType | null
}

const NAV_ITEMS = [
  { href: '/feed',       label: 'Home',         icon: Home },
  { href: '/explore',    label: 'Explore',      icon: Compass },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/goals',      label: 'Goals',        icon: Target },
  { href: '/dashboard/timetable',  label: 'Timetable',    icon: Calendar },
  { href: '/dashboard/insights',    label: 'Insights',      icon: Brain },
  { href: '/dashboard/progress', label: 'Progress',    icon: Pickaxe },
  { href: '/dashboard/analytics',  label: 'Analytics',    icon: BarChart3 },
  { href: '/dashboard/settings',   label: 'Settings',     icon: Settings },
]

export default function FeedLeftSidebar({ user }: FeedLeftSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* ============ PROFILE CARD ============ */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-16 bg-gradient-to-br from-primary/80 to-accent/80" />

        {/* Avatar + info */}
        <div className="px-4 pb-4 -mt-8 text-center">
          <div className="inline-block rounded-full ring-4 ring-white dark:ring-gray-800">
            <UserAvatar
              name={user?.name || 'Guest'}
              avatarUrl={user?.profile?.avatarUrl ?? null}
              size={64}
            />
          </div>

          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
            {user?.name || 'Guest User'}
          </h3>

          {user?.profile?.userName && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              @{user.profile.userName}
            </p>
          )}

          {user?.profile?.bio && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {user.profile.bio}
            </p>
          )}

          {user ? (
            <Link
              href={
                user.profile?.userName
                  ? `/u/${encodeURIComponent(user.profile.userName)}`
                  : '/dashboard/profile'
              }
              className="mt-3 inline-block w-full text-xs font-medium text-primary hover:underline"
            >
              View profile
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="mt-3 inline-block w-full text-xs font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* ============ NAV CARD ============ */}
      <nav className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}