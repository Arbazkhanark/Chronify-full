// src/components/features/auth/register.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registerSchema,
  type RegisterFormData,
} from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  Target,
  BarChart3,
  Bot,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { AuthService } from '@/hooks/useAuth'
import { OAuthButtons } from './OAuthButtons'

const highlights = [
  {
    icon: Target,
    title: 'Smart goal tracking',
    text: 'Set goals and watch your consistency grow daily.',
  },
  {
    icon: BarChart3,
    title: 'Progress analytics',
    text: 'Clear charts that show how far you have come.',
  },
  {
    icon: Bot,
    title: 'AI recommendations',
    text: 'Personalized tips to optimize your routine.',
  },
]

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await AuthService.register(data.email, data.password)
      toast.success(
        'Registration successful! Please verify your email.',
      )
      router.push('/auth/verify-email')
    } catch (error) {
      console.error('Registration error:', error)
      // AuthService already shows a toast
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background">
      {/* ───────────── LEFT: Photo + Benefits + Testimonial ───────────── */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white">
        {/* Full-height photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
          }}
          aria-hidden="true"
        />
        {/* Overlays for readability */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/40"
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

        {/* Middle + bottom content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-lg space-y-8"
        >
          <div className="space-y-3">
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
              Build habits that actually stick.
            </h2>
            <p className="text-white/75 text-lg">
              Join thousands of productive users who are achieving
              their goals with Chronify AI.
            </p>
          </div>

          <ul className="space-y-4">
            {highlights.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <div className="mt-0.5 w-9 h-9 shrink-0 rounded-lg bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-white/70">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Testimonial card */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 space-y-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-current text-white"
                />
              ))}
            </div>
            <p className="text-base leading-relaxed">
              Setting up took two minutes, and within a week I had a
              routine I could actually follow.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-sm font-semibold">
                PM
              </div>
              <div>
                <p className="text-sm font-semibold">Priya Mehta</p>
                <p className="text-xs text-white/70">
                  Freelance Developer
                </p>
              </div>
            </div>
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
              Start your consistency journey
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create your free Chronify AI account to master your
              time and achieve your goals.
            </p>
          </div>

          {/* OAuth Buttons */}
          <OAuthButtons
            actionText="Sign up"
            disabled={isLoading}
          />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 bg-background text-muted-foreground">
                Or sign up with email
              </span>
            </div>
          </div>

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
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 rounded-xl bg-background/60 border-border focus-visible:ring-primary/40"
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 rounded-xl bg-background/60 border-border focus-visible:ring-primary/40"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
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
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Terms */}
          <p className="mt-5 text-xs text-center text-muted-foreground">
            By creating an account, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>

          {/* Login link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors"
            >
              Sign in to your account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}