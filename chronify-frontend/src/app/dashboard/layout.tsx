// src/app/dashboard/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthService } from '@/hooks/useAuth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      try {
        const token = AuthService.getAccessToken()

        // 🔥 No token at all → straight to login.
        //    No backend call, no cached-user fallback.
        if (!token) {
          sessionStorage.setItem(
            'redirectAfterLogin',
            pathname,
          )
          router.replace('/auth/login')
          return
        }

        const user = await AuthService.getCurrentUser()

        // 🔥 Token was present but backend rejected it
        //    (invalid / expired / revoked) → login.
        if (!user) {
          sessionStorage.setItem(
            'redirectAfterLogin',
            pathname,
          )
          router.replace('/auth/login')
          return
        }

        if (isMounted) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth check failed:', error)

        if (isMounted) {
          router.replace('/auth/login')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void checkAuth()

    return () => {
      isMounted = false
    }
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative">
            {/* Animated rings */}
            <div className="w-24 h-24 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Loading your dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we verify your session...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}