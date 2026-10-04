// src/components/layout/MobileBottomNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Rss,
  Calendar,
  Target,
  Hammer,
} from 'lucide-react'
import { AuthService, type User } from '@/hooks/useAuth'

/* ============================================================================
   CONSTANTS
   ============================================================================ */

const BOTTOM_NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Home',
    icon: LayoutDashboard,
    /** Paths that should highlight this item as active */
    matchPaths: ['/dashboard'],
    /** Sub-paths that belong to OTHER tabs — never highlight this one on them */
    excludePaths: ['/dashboard/timetable', '/dashboard/goal'],
  },
  {
    href: '/feed',
    label: 'Feed',
    icon: Rss,
    matchPaths: ['/feed'],
    excludePaths: [],
  },
  {
    href: '/dashboard/timetable',
    label: 'Schedule',
    icon: Calendar,
    matchPaths: ['/dashboard/timetable'],
    // Builder is a sub-path of timetable but belongs to the Builder tab
    excludePaths: ['/dashboard/timetable/builder'],
  },
  {
    href: '/dashboard/goal',
    label: 'Goals',
    icon: Target,
    matchPaths: ['/dashboard/goal'],
    excludePaths: [],
  },
  {
    href: '/dashboard/timetable/builder',
    label: 'Builder',
    icon: Hammer,
    matchPaths: ['/dashboard/timetable/builder'],
    excludePaths: [],
  },
] as const

/* ============================================================================
   HELPERS
   ============================================================================ */

/**
 * Returns true if `pathname` matches the tab, and isn't excluded.
 *
 * Example:
 *   pathname = '/dashboard/timetable/builder'
 *   tab = 'Schedule' (match: ['/dashboard/timetable'], exclude: ['/dashboard/timetable/builder'])
 *   → false (excluded)
 *
 *   tab = 'Builder' (match: ['/dashboard/timetable/builder'])
 *   → true
 */
function isTabActive(
  pathname: string,
  tab: (typeof BOTTOM_NAV_ITEMS)[number],
): boolean {
  // Excluded? → never active
  for (const ex of tab.excludePaths) {
    if (pathname === ex || pathname.startsWith(ex + '/')) {
      return false
    }
  }

  // Matched?
  for (const m of tab.matchPaths) {
    if (pathname === m || pathname.startsWith(m + '/')) {
      return true
    }
  }

  return false
}

/* ============================================================================
   COMPONENT
   ============================================================================ */

export function MobileBottomNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [checked, setChecked] = useState(false)

  /* --------------------------------------------------------------------
     Check if user is logged in — hide nav for guests
     -------------------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false

    const check = async () => {
      try {
        const token = AuthService.getAccessToken()

        if (!token) {
          if (!cancelled) setUser(null)
          return
        }

        const u = await AuthService.getCurrentUser()
        if (!cancelled) setUser(u)
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setChecked(true)
      }
    }

    void check()

    return () => {
      cancelled = true
    }
  }, [])

  // Don't render until we know auth state (avoids flash)
  if (!checked) return null

  // Guest users → no bottom nav
  if (!user) return null

  return (
    <nav
      className="
        md:hidden
        fixed bottom-0 left-0 right-0 z-40
        bg-background/95 backdrop-blur-md
        border-t border-border
        pb-[env(safe-area-inset-bottom)]
      "
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around h-14">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const active = isTabActive(pathname, item)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex-1 flex flex-col items-center justify-center gap-0.5
                text-[10px] font-medium
                transition-colors
                ${
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }
              `}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`}
              />
              <span className="leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}