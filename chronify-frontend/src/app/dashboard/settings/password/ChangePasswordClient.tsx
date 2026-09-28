// src/app/dashboard/settings/password/ChangePasswordClient.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Shield,
  AlertCircle,
  Loader2,
  KeyRound,
  CheckCircle2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AuthService } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

/* ============================================================================
   PASSWORD STRENGTH
   ============================================================================ */

interface PasswordRule {
  label: string
  test: (pw: string) => boolean
}

const RULES: PasswordRule[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'Contains uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'Contains lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'Contains number', test: (pw) => /\d/.test(pw) },
  { label: 'Contains symbol', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
]

function getStrength(pw: string): {
  score: number
  label: string
  color: string
} {
  const passed = RULES.filter((r) => r.test(pw)).length
  if (pw.length === 0) return { score: 0, label: 'Empty', color: 'text-gray-400' }
  if (passed <= 2) return { score: 1, label: 'Weak', color: 'text-red-500' }
  if (passed === 3) return { score: 2, label: 'Fair', color: 'text-amber-500' }
  if (passed === 4) return { score: 3, label: 'Good', color: 'text-blue-500' }
  return { score: 4, label: 'Strong', color: 'text-green-500' }
}

/* ============================================================================
   COMPONENT
   ============================================================================ */

export default function ChangePasswordClient() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const strength = useMemo(() => getStrength(newPassword), [newPassword])

  const passedRules = useMemo(
    () => RULES.map((r) => ({ ...r, passed: r.test(newPassword) })),
    [newPassword]
  )

  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    strength.score >= 2 &&
    passwordsMatch &&
    !isSubmitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)

    try {
      const ok = await AuthService.changePassword(currentPassword, newPassword)

      if (!ok) {
        toast.error('Could not change password', {
          description: 'Your current password is incorrect.',
        })
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
      toast.success('Password changed successfully', {
        description: 'You can now use your new password to sign in.',
      })

      // Clear the form after success
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error('[change-password] failed:', err)
      toast.error('Something went wrong', {
        description: err?.message || 'Please try again in a moment.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Settings
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Change Password
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Update your account password. Use a strong one.
                </p>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 px-4 py-3 rounded-lg border border-green-300/70 dark:border-green-500/40 bg-green-50 dark:bg-green-950/40"
            >
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-900 dark:text-green-100">
                <p className="font-medium">Password updated</p>
                <p className="text-xs mt-0.5 text-green-800/90 dark:text-green-200/90">
                  Next time you log in, use your new password.
                </p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Password Details
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    You'll stay logged in on this device after changing your password.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      autoComplete="current-password"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showCurrent ? 'Hide password' : 'Show password'}
                    >
                      {showCurrent ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-password">New Password</Label>
                    {newPassword.length > 0 && (
                      <span className={cn('text-xs font-medium', strength.color)}>
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      autoComplete="new-password"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showNew ? 'Hide password' : 'Show password'}
                    >
                      {showNew ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {newPassword.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={cn(
                            'h-1 flex-1 rounded-full transition-colors',
                            strength.score >= level
                              ? strength.score === 1
                                ? 'bg-red-500'
                                : strength.score === 2
                                  ? 'bg-amber-500'
                                  : strength.score === 3
                                    ? 'bg-blue-500'
                                    : 'bg-green-500'
                              : 'bg-gray-200 dark:bg-gray-700'
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Rules */}
                {newPassword.length > 0 && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 space-y-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password must contain:
                    </p>
                    {passedRules.map((rule) => (
                      <div
                        key={rule.label}
                        className="flex items-center gap-2 text-xs"
                      >
                        {rule.passed ? (
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        )}
                        <span
                          className={cn(
                            rule.passed
                              ? 'text-gray-700 dark:text-gray-300'
                              : 'text-gray-500 dark:text-gray-500'
                          )}
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Confirm Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    {confirmPassword.length > 0 && (
                      <span
                        className={cn(
                          'text-xs font-medium flex items-center gap-1',
                          passwordsMatch
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        )}
                      >
                        {passwordsMatch ? (
                          <>
                            <Check className="w-3 h-3" /> Match
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" /> Doesn't match
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      autoComplete="new-password"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Info note */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/60">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    For your security, choose a password you haven't used
                    elsewhere. Consider using a password manager.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Link href="/dashboard/settings">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Password Tips
              </h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  Use a unique password for Chronify — not one you use elsewhere.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  Longer is stronger. Consider a passphrase of 4+ words.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  Never share your password with anyone, not even support.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}