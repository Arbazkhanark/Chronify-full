'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, CheckCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import type { Metadata } from 'next'
import { AuthService } from '@/hooks/useAuth'
// import { verifyEmail } from '@/hooks/useAuth'

export const metadata: Metadata = {
  title: 'Verify Email - Chronify AI',
  description: 'Verify your email address',
}

export function VerifyEmail() {
  const router = useRouter()
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleVerify = async () => {
    setIsLoading(true)
    try {
      // Simulate email verification
      const success = await AuthService.verifyEmail('mock_token')
      if (success) {
        setIsVerified(true)
        toast.success('Email verified successfully!')
        setTimeout(() => {
          router.push('/onboarding/role')
        }, 2000)
      } else {
        toast.error('Verification failed. Please try again.')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    setCountdown(30)
    toast.success('Verification email sent!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-16 h-16 rounded-full ${
                isVerified 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-br from-primary to-accent'
              } flex items-center justify-center`}>
                {isVerified ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <Mail className="w-8 h-8 text-white" />
                )}
              </div>
              <CardTitle className="text-2xl text-center">
                {isVerified ? 'Email Verified!' : 'Verify Your Email'}
              </CardTitle>
              <CardDescription className="text-center">
                {isVerified
                  ? 'Your email has been successfully verified.'
                  : 'Check your inbox for the verification email.'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {!isVerified ? (
              <>
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    We've sent a verification link to your email address. 
                    Please click the link to verify your account.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <Mail className="w-4 h-4 text-accent" />
                    <span className="text-sm">user@example.com</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleVerify}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Email'
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Didn't receive the email?
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleResend}
                      disabled={countdown > 0}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Resend Email {countdown > 0 && `(${countdown}s)`}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <p className="text-muted-foreground">
                  Redirecting you to complete your profile...
                </p>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                  />
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}