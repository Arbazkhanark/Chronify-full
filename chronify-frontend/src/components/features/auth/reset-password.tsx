'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { AuthService } from '@/hooks/useAuth'

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid reset link')
      return
    }
    
    setIsLoading(true)
    try {
      const success = await AuthService.resetPassword(token, data.password)
      
      if (success) {
        setIsSuccess(true)
        toast.success('Password reset successfully!')
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } else {
        toast.error('Invalid or expired reset link')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 p-4">
        <Card className="border-border/50 shadow-2xl max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">Invalid reset link</p>
            <Link href="/auth/forgot-password">
              <Button>Request new reset link</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
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
          <CardHeader>
            <div className="flex flex-col items-center space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              >
                {isSuccess ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <KeyRound className="w-6 h-6 text-white" />
                )}
              </motion.div>
              <CardTitle className="text-2xl text-center">
                {isSuccess ? 'Password Reset!' : 'Set new password'}
              </CardTitle>
              <CardDescription className="text-center">
                {isSuccess 
                  ? 'Your password has been reset successfully'
                  : 'Enter your new password below'
                }
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {!isSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Password fields similar to change password */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Resetting...' : 'Reset password'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Redirecting you to login...
                </p>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Go to login
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}