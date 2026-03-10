'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckSquare, 
  BarChart3, 
  Settings,
  Award,
  Clock,
  Users,
  BookOpen,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AuthService } from '@/hooks/useAuth'

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const user = AuthService.getCurrentUser()

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Timetable', href: '/dashboard/planner' },
    { icon: Target, label: 'Goals', href: '/dashboard/goals' },
    { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
    { icon: TrendingUp, label: 'Progress', href: '/dashboard/progress' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: BookOpen, label: 'Learning', href: '/dashboard/learning' },
    { icon: Users, label: 'Community', href: '/dashboard/community' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

  const quickStats = [
    { label: 'Streak', value: '7 days', icon: Zap, color: 'text-orange-500' },
    { label: 'Focus Time', value: '32h', icon: Clock, color: 'text-blue-500' },
    { label: 'Tasks Done', value: '24', icon: CheckSquare, color: 'text-green-500' },
  ]

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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
          >
            <Award className="w-5 h-5 text-white" />
          </motion.div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1"
            >
              <h2 className="font-bold text-lg">Chronify AI</h2>
              <p className="text-xs text-muted-foreground">Consistency Dashboard</p>
            </motion.div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-border/50"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 border-b border-border/50"
        >
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Quick Stats</h4>
          <div className="space-y-3">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-sm">{stat.label}</span>
                </div>
                <span className="font-bold">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/20"
                      : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive && "text-primary"
                  )} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
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
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all hover:bg-destructive/10 hover:text-destructive",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={cn(
          "hidden lg:flex flex-col h-screen bg-card/50 backdrop-blur-sm border-r border-border/50 sticky top-0",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-50 lg:hidden"
            >
              <div className="relative h-full">
                <button
                  onClick={() => setIsMobileOpen(false)}
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