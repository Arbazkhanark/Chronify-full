// src/components/dashboard/sidebar.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Calendar,
  Target,
  CheckSquare,
  TrendingUp,
  BarChart3,
  BookOpen,
  Settings,
  Users,
  Clock,
  Zap,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AuthService } from '@/hooks/useAuth'
import type { User } from '@/hooks/useAuth'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  icon: typeof Home
  label: string
  href: string
  badge: string | null
}

interface QuickStat {
  label: string
  value: string
  icon: typeof Zap
  color: string
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  /**
   * AuthService.getCurrentUser() is async.
   *
   * So we cannot do:
   * const user = AuthService.getCurrentUser()
   *
   * because that gives Promise<User | null>.
   */
  useEffect(() => {
    let isMounted = true

    const loadUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()

        if (isMounted) {
          setUser(currentUser)
        }
      } catch (error: unknown) {
        console.error('Failed to load current user:', error)

        if (isMounted) {
          setUser(null)
        }
      }
    }

    void loadUser()

    return () => {
      isMounted = false
    }
  }, [])

  const navItems: NavItem[] = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/dashboard',
      badge: null,
    },
    {
      icon: Calendar,
      label: 'Timetable',
      href: '/dashboard/timetable',
      badge: null,
    },
    {
      icon: Target,
      label: 'Goals',
      href: '/dashboard/goals',
      badge: '3',
    },
    {
      icon: CheckSquare,
      label: 'Tasks',
      href: '/dashboard/tasks',
      badge: '5',
    },
    {
      icon: TrendingUp,
      label: 'Progress',
      href: '/dashboard/progress',
      badge: null,
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      href: '/dashboard/analytics',
      badge: null,
    },
    {
      icon: BookOpen,
      label: 'Learning',
      href: '/dashboard/learning',
      badge: null,
    },
    {
      icon: Users,
      label: 'Community',
      href: '/dashboard/community',
      badge: '12',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/dashboard/settings',
      badge: null,
    },
  ]

  const quickStats: QuickStat[] = [
    {
      label: 'Streak',
      value: '7 days',
      icon: Zap,
      color: 'text-orange-500',
    },
    {
      label: 'Focus Time',
      value: '32h',
      icon: Clock,
      color: 'text-blue-500',
    },
  ]

  /**
   * User display helpers
   *
   * Current User structure uses:
   * - user.name
   * - user.email
   * - user.profile?.avatarUrl
   */
  const userName = user?.name?.trim() || 'User'
  const userEmail = user?.email || ''
  const avatarUrl = user?.profile?.avatarUrl || null

  const getInitials = (name: string): string => {
    const words = name
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0)

    if (words.length === 0) {
      return 'U'
    }

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase()
    }

    return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase()
  }

  const userInitials = getInitials(userName)

  const handleLogout = () => {
    AuthService.logout()
    window.location.href = '/auth/login'
  }

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h2 className="font-bold text-lg">Chronify AI</h2>
                <p className="text-xs text-muted-foreground">
                  Consistency Platform
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="ml-auto p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* User Profile */}
      <AnimatePresence>
        {!collapsed && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 border-b border-border/50 overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {userInitials}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{userName}</h3>

                <p className="text-sm text-muted-foreground truncate">
                  {userEmail}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 border-b border-border/50 overflow-hidden"
          >
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
              Quick Stats
            </h4>

            <div className="space-y-3">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon

                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={cn('w-4 h-4', stat.color)} />
                      <span className="text-sm">{stat.label}</span>
                    </div>

                    <span className="font-bold">{stat.value}</span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative group',
                    isActive
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/20'
                      : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      {item.badge}
                    </span>
                  )}

                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-card border border-border rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border/50">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all hover:bg-destructive/10 hover:text-destructive text-muted-foreground',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" />

          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-medium overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={cn(
          'hidden lg:flex flex-col h-screen bg-card/50 backdrop-blur-sm border-r border-border/50 fixed left-0 top-0 z-40',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-50 lg:hidden"
            >
              <div className="relative h-full">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary"
                >
                  <X className="w-5 h-5" />
                </button>

                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}