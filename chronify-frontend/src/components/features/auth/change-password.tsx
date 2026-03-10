'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Eye, EyeOff, KeyRound, Shield } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { AuthService } from '@/hooks/useAuth'

const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export function ChangePasswordForm() {
  const router = useRouter()
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const newPassword = watch('newPassword', '')

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true)
    try {
      const success = await AuthService.changePassword(data.oldPassword, data.newPassword)
      
      if (success) {
        toast.success('Password changed successfully!')
        router.push('/dashboard')
      } else {
        toast.error('Current password is incorrect')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: '', color: 'bg-gray-200' }
    
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    
    const strengthMap = {
      1: { label: 'Weak', color: 'bg-red-500' },
      2: { label: 'Fair', color: 'bg-orange-500' },
      3: { label: 'Good', color: 'bg-yellow-500' },
      4: { label: 'Strong', color: 'bg-green-500' },
      5: { label: 'Very Strong', color: 'bg-emerald-500' }
    }
    
    return { 
      strength: score, 
      label: strengthMap[score as keyof typeof strengthMap]?.label || '', 
      color: strengthMap[score as keyof typeof strengthMap]?.color || 'bg-gray-200' 
    }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 dark:from-background dark:via-background dark:to-secondary/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 shadow-2xl w-full max-w-[95%] sm:max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex flex-col items-center space-y-2">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent dark:from-primary/90 dark:to-accent/90 flex items-center justify-center shadow-lg"
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-xl sm:text-2xl text-center font-bold">
                Change Password
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-center text-muted-foreground px-4">
                Update your password to keep your account secure
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Old Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  Current Password
                  {errors.oldPassword && (
                    <span className="text-destructive text-xs">(required)</span>
                  )}
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    errors.oldPassword ? 'text-destructive' : 'text-muted-foreground'
                  }`} />
                  <Input
                    {...register('oldPassword')}
                    type={showPasswords.old ? 'text' : 'password'}
                    placeholder="Enter current password"
                    className={`pl-10 pr-10 ${
                      errors.oldPassword ? 'border-destructive focus-visible:ring-destructive/50' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('old')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 sm:p-1 hover:text-foreground transition-colors"
                    aria-label={showPasswords.old ? 'Hide password' : 'Show password'}
                  >
                    {showPasswords.old ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {errors.oldPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <span>⚠️</span> {errors.oldPassword.message}
                  </motion.p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  New Password
                  {errors.newPassword && (
                    <span className="text-destructive text-xs">(required)</span>
                  )}
                </label>
                <div className="relative">
                  <KeyRound className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    errors.newPassword ? 'text-destructive' : 'text-muted-foreground'
                  }`} />
                  <Input
                    {...register('newPassword')}
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className={`pl-10 pr-10 ${
                      errors.newPassword ? 'border-destructive focus-visible:ring-destructive/50' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 sm:p-1 hover:text-foreground transition-colors"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-1 mt-2"
                  >
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength.strength >= 3 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                    }`}>
                      Password strength: {passwordStrength.label}
                    </p>
                  </motion.div>
                )}
                
                {errors.newPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <span>⚠️</span> {errors.newPassword.message}
                  </motion.p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  Confirm New Password
                  {errors.confirmPassword && (
                    <span className="text-destructive text-xs">(required)</span>
                  )}
                </label>
                <div className="relative">
                  <KeyRound className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    errors.confirmPassword ? 'text-destructive' : 'text-muted-foreground'
                  }`} />
                  <Input
                    {...register('confirmPassword')}
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className={`pl-10 pr-10 ${
                      errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive/50' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 sm:p-1 hover:text-foreground transition-colors"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <span>⚠️</span> {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>

              {/* Password Requirements */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-muted/30 dark:bg-muted/20 rounded-lg p-3 text-xs sm:text-sm"
              >
                <p className="font-medium mb-2">Password requirements:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${
                      newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${
                      /[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${
                      /[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    One lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${
                      /[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    One number
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${
                      /[^A-Za-z0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    One special character
                  </li>
                </ul>
              </motion.div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 disabled:opacity-70 mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent dark:border-gray-900 dark:border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Change Password</span>
                  </div>
                )}
              </Button>

              <div className="mt-4 text-center">
                <Link 
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to dashboard
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}