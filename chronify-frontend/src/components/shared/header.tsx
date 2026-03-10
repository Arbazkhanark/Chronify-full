'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">SF</span>
            </div>
            <span className="font-bold text-lg text-foreground">Chronify AI</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/timetable" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Timetable
            </Link>
            <Link href="/dashboard/goal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Goals
            </Link>
            <Link href="/dashboard/timetable/builder" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Builder
            </Link>
            <Link href="/dashboard/insights" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Insights
            </Link>
            <Link href="/dashboard/progress" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Progress
            </Link>
          </nav>

          {/* Auth Button */}
          <Link href="/auth/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-2">
              Sign In
            </Button>
          </Link>

          {/* Theme Toggle */}
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
    </header>
  )
}
