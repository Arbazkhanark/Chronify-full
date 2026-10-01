// src/components/layout/Header.tsx
'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Moon,
  Sun,
  User as UserIcon,
  LogOut,
  Settings,
  LayoutDashboard,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { AuthService, type User } from '@/hooks/useAuth'

/* ============================================================================
   HELPERS
   ============================================================================ */

function getInitials(name?: string, email?: string): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return 'U'
}

function getDisplayName(user: User | null): string {
  if (!user) return 'User'
  if (user.name && user.name.trim().length > 0) return user.name
  if (user.email) return user.email.split('@')[0]
  return 'User'
}

/* ============================================================================
   HEADER
   ============================================================================ */

export function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  /* --------------------------------------------------------------------
     Mount + Load User
     -------------------------------------------------------------------- */
  useEffect(() => {
    setMounted(true)

    let cancelled = false

    const loadUser = async () => {
      try {
        const token = AuthService.getAccessToken()

        // 🔥 No token → user is definitely logged out.
        //    Don't fall back to cached user (which could be stale).
        //    Don't redirect either — Header is rendered on public
        //    pages too.
        if (!token) {
          if (!cancelled) setUser(null)
          return
        }

        const currentUser = await AuthService.getCurrentUser()
        if (!cancelled) setUser(currentUser)
      } catch (err) {
        console.error('[Header] Failed to load user:', err)
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setUserLoading(false)
      }
    }

    void loadUser()

    return () => {
      cancelled = true
    }
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  /* --------------------------------------------------------------------
     Logout
     -------------------------------------------------------------------- */
  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await AuthService.logout()
      setUser(null)
      toast.success('Logged out successfully', {
        description: 'See you soon!',
      })
      router.push('/auth/login')
    } catch (err) {
      console.error('[Header] Logout failed:', err)
      toast.error('Could not log out', {
        description: 'Please try again.',
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  /* --------------------------------------------------------------------
     Nav links
     -------------------------------------------------------------------- */
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/timetable', label: 'Timetable' },
    { href: '/dashboard/goal', label: 'Goals' },
    { href: '/dashboard/timetable/builder', label: 'Builder' },
    { href: '/dashboard/insights', label: 'Insights' },
    { href: '/dashboard/progress', label: 'Progress' },
  ]

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ============================== LOGO ============================== */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">SF</span>
            </div>
            <span className="font-bold text-lg text-foreground">Chronify AI</span>
          </Link>

          {/* ============================== NAVIGATION ============================== */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ============================== RIGHT SIDE ============================== */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ---------- AUTH AREA ---------- */}
            {userLoading ? (
              <div className="w-20 h-9 rounded-lg bg-muted animate-pulse" />
            ) : user ? (
              // ==============================
              // LOGGED IN → Profile Dropdown
              // ==============================
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full pl-1 pr-2 sm:pr-3 py-1 hover:bg-accent/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="Open profile menu"
                  >
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarImage
                        src={
                          (user as any)?.avatarUrl ||
                          (user.profile as any)?.avatarUrl ||
                          undefined
                        }
                        alt={getDisplayName(user)}
                      />
                      <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {getInitials(user.name, user.email)}
                      </AvatarFallback>
                    </Avatar>

                    <span className="hidden sm:block text-sm font-medium text-foreground max-w-[100px] truncate">
                      {getDisplayName(user)}
                    </span>

                    <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 p-2"
                  sideOffset={8}
                >
                  {/* ---- User info header ---- */}
                  <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-lg bg-muted/50">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 flex-shrink-0">
                      <AvatarImage
                        src={
                          (user as any)?.avatarUrl ||
                          (user.profile as any)?.avatarUrl ||
                          undefined
                        }
                        alt={getDisplayName(user)}
                      />
                      <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {getInitials(user.name, user.email)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {getDisplayName(user)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      {!user.verified && (
                        <Badge
                          variant="outline"
                          className="mt-1 text-[10px] px-1.5 py-0 border-amber-300 text-amber-700 dark:border-amber-700/60 dark:text-amber-400"
                        >
                          Unverified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* ---- Profile ---- */}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/profile" className="flex items-center gap-2 py-2.5">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* ---- Dashboard ---- */}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard" className="flex items-center gap-2 py-2.5">
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* ---- Settings ---- */}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/settings" className="flex items-center gap-2 py-2.5">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* ---- Logout ---- */}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      void handleLogout()
                    }}
                    disabled={isLoggingOut}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 py-2.5"
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 mr-2" />
                        <span>Log out</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // ==============================
              // LOGGED OUT → Sign In button
              // ==============================
              <Link href="/auth/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 sm:px-6 py-2">
                  Sign In
                </Button>
              </Link>
            )}

            {/* ---------- THEME TOGGLE ---------- */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-10 h-10"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}