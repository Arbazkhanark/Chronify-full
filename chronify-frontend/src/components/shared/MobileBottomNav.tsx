// src/components/layout/MobileBottomNav.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Rss,
  Calendar,
  Target,
  Hammer,
  House,
} from 'lucide-react'
import { toast } from 'sonner'
import { AuthService, type User } from '@/hooks/useAuth'

/* ============================================================================
   CONSTANTS
   ============================================================================ */

const BOTTOM_NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: House ,
    matchPaths: ['/'],
    excludePaths: ['/dashboard/timetable', '/dashboard/goal'],
    requiresAuth: true,
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    matchPaths: ['/dashboard'],
    excludePaths: ['/dashboard/timetable', '/dashboard/goal'],
    requiresAuth: true,
  },
  {
    href: '/feed',
    label: 'Feed',
    icon: Rss,
    matchPaths: ['/feed'],
    excludePaths: [],
    requiresAuth: false, // feed is public
  },
  {
    href: '/dashboard/timetable',
    label: 'Timetable',
    icon: Calendar,
    matchPaths: ['/dashboard/timetable'],
    excludePaths: ['/dashboard/timetable/builder'],
    requiresAuth: true,
  },
  {
    href: '/dashboard/goal',
    label: 'Goals',
    icon: Target,
    matchPaths: ['/dashboard/goal'],
    excludePaths: [],
    requiresAuth: true,
  },
  {
    href: '/dashboard/timetable/builder',
    label: 'Builder',
    icon: Hammer,
    matchPaths: ['/dashboard/timetable/builder'],
    excludePaths: [],
    requiresAuth: true,
  },
] as const

/* ============================================================================
   HELPERS
   ============================================================================ */

function isTabActive(
  pathname: string,
  tab: (typeof BOTTOM_NAV_ITEMS)[number],
): boolean {
  for (const ex of tab.excludePaths) {
    if (pathname === ex || pathname.startsWith(ex + '/')) {
      return false
    }
  }

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
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [checked, setChecked] = useState(false)

  /* --------------------------------------------------------------------
     Check auth state (once on mount + on route change)
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
  }, [pathname]) // re-check on route change (e.g. after login/logout)

  /* --------------------------------------------------------------------
     Handle click on a tab — enforce auth if needed
     -------------------------------------------------------------------- */
  const handleNavClick = (
    e: React.MouseEvent,
    item: (typeof BOTTOM_NAV_ITEMS)[number],
  ) => {
    // If the tab needs auth and user isn't logged in → send to login
    if (item.requiresAuth && !user) {
      e.preventDefault()
      toast.info('Please login to continue', {
        description: 'You need an account to access this page.',
        duration: 3000,
      })
      router.push('/auth/login')
      return
    }
  }

  // Don't render nav on auth pages (login, register, verify, callback)
  const isAuthPage =
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register') ||
    pathname.startsWith('/auth/verify-email') ||
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/auth/forgot-password') ||
    pathname.startsWith('/auth/reset-password')

  if (isAuthPage) return null

  // Wait for auth check to complete before rendering
  // (avoids flicker of "locked" state for logged-in users)
  if (!checked) {
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
            const Icon = item.icon
            return (
              <div
                key={item.href}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-muted-foreground/50"
              >
                <Icon className="w-5 h-5 stroke-2" />
                <span className="leading-none">{item.label}</span>
              </div>
            )
          })}
        </div>
      </nav>
    )
  }

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
          const locked = item.requiresAuth && !user

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-0.5
                text-[10px] font-medium
                transition-colors relative
                ${
                  active
                    ? 'text-primary'
                    : locked
                    ? 'text-muted-foreground/60'
                    : 'text-muted-foreground hover:text-foreground'
                }
              `}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                className={`w-5 h-5 ${
                  active ? 'stroke-[2.5]' : 'stroke-2'
                }`}
              />
              <span className="leading-none">{item.label}</span>

              {/* Small lock dot for locked tabs (guest users) */}
              {locked && (
                <span className="absolute top-1 right-1/2 translate-x-3 w-1 h-1 rounded-full bg-muted-foreground/40" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}