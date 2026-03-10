'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthService } from '@/hooks/useAuth'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      const success = await AuthService.forgotPassword(data.email)
      
      if (success) {
        setSubmittedEmail(data.email)
        setIsSubmitted(true)
        toast.success('Reset link sent to your email!')
      } else {
        toast.error('Email not found. Please check and try again.')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
                {isSubmitted ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Mail className="w-6 h-6 text-white" />
                )}
              </motion.div>
              <CardTitle className="text-xl sm:text-2xl text-center font-bold">
                {isSubmitted ? 'Check your email' : 'Forgot password?'}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-center text-muted-foreground px-4">
                {isSubmitted 
                  ? `We've sent a reset link to ${submittedEmail}`
                  : 'Enter your email and we\'ll send you a reset link'
                }
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="forgot-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1">
                      Email Address
                      {errors.email && (
                        <span className="text-destructive text-xs">(required)</span>
                      )}
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        errors.email ? 'text-destructive' : 'text-muted-foreground'
                      }`} />
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder="you@example.com"
                        className={`pl-10 ${
                          errors.email 
                            ? 'border-destructive focus-visible:ring-destructive/50' 
                            : ''
                        }`}
                        autoComplete="email"
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive flex items-center gap-1"
                      >
                        <span>⚠️</span> {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent dark:border-gray-900 dark:border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        <span>Send reset link</span>
                      </div>
                    )}
                  </Button>

                  <div className="mt-4 text-center">
                    <Link 
                      href="/auth/login"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline group"
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Back to sign in
                    </Link>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 text-sm">
                    <p className="text-muted-foreground">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="w-full"
                    >
                      Try another email
                    </Button>
                    
                    <Link href="/auth/login">
                      <Button variant="ghost" className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to sign in
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}