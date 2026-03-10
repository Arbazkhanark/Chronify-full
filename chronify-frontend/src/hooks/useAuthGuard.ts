// src/hooks/useAuthGuard.ts
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthService } from './useAuth'

export const useAuthGuard = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser()
        
        if (!currentUser) {
          // Store the attempted URL for redirect after login
          sessionStorage.setItem('redirectAfterLogin', pathname)
          router.push('/auth/login')
        } else {
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, pathname])

  return { user, isLoading }
}