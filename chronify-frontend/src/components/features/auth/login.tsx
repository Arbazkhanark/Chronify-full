// src/components/features/auth/login.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Quote,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AuthService } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { OAuthButtons } from './OAuthButtons'

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await AuthService.login(data.email, data.password)

      const user = AuthService.getCurrentUserFromStorage()

      if (!user) {
        toast.error('Login failed', {
          description: 'Could not load your account. Please try again.',
        })
        return
      }

      // 1️⃣ Not verified → verification page
      if (!user.verified) {
        toast.info('Email not verified', {
          description: 'Please verify your email before continuing.',
          duration: 5000,
        })
        router.push('/auth/verify-email')
        return
      }

      // 2️⃣ Verified → dashboard
      toast.success('Welcome back!', {
        description: `Logged in as ${user.name || user.email}`,
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background">
      {/* ───────────── LEFT: Photo + Testimonial ───────────── */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white">
        {/* Full-height photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80')",
          }}
          aria-hidden="true"
        />
        {/* Overlays for readability */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-primary/20 mix-blend-multiply"
          aria-hidden="true"
        />

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-2"
        >
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight">
            Chronify AI
          </span>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-lg space-y-6"
        >
          <Quote className="w-10 h-10 text-white/60" />
          <blockquote className="text-2xl xl:text-3xl font-medium leading-snug">
            Chronify helped me stay consistent for 90 days straight.
            My goals finally feel achievable, one day at a time.
          </blockquote>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-semibold">
              AS
            </div>
            <div>
              <p className="font-semibold">Aarav Sharma</p>
              <p className="text-sm text-white/70">
                Product Designer
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-white/20 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Goal tracking
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Daily planner
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Progress insights
            </span>
          </div>
        </motion.div>
      </div>

      {/* ───────────── RIGHT: Form ───────────── */}
      <div className="relative flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 xl:px-24 bg-gradient-to-br from-background via-background to-primary/5">
        {/* Mobile brand */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight">
            Chronify AI
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Heading (h1 kept for SEO) */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to Chronify AI to track your progress, manage
              tasks and achieve your daily goals.
            </p>
          </div>

          {/* OAuth Buttons */}
          <OAuthButtons
            actionText="Sign in"
            disabled={isLoading}
          />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 bg-background text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="pl-11 h-12 rounded-xl bg-background/60 border-border focus-visible:ring-primary/40"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 rounded-xl bg-background/60 border-border focus-visible:ring-primary/40"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                {...register('rememberMe')}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-primary to-primary/75 shadow-lg shadow-primary/25 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Register link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
            >
              Create new account
            </Link>
          </p>

          {/* Footer links */}
          <div className="mt-10 pt-6 border-t border-border/60">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <Link
                href="/features"
                className="hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} Chronify AI. Made for
              consistent achievers.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}