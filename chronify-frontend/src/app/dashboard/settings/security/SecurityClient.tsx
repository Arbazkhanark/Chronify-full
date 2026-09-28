// src/app/dashboard/settings/security/SecurityClient.tsx
'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  Shield,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Globe,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useVerification } from '@/hooks/useVerification'
import { useSettings } from '@/hooks/useSettings'

export default function SecurityClient() {
  const { user } = useAuth()
  const { isVerified, isSending, sendVerificationEmail } = useVerification({
    email: user?.email,
  })
  const { settings } = useSettings()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Settings
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Security
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your account security and sessions
              </p>
            </div>
          </div>
        </div>

        {/* Security score */}
        <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Security Score
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isVerified ? '85' : '60'} / 100
                </p>
              </div>
              <Badge
                className={
                  isVerified
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }
              >
                {isVerified ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>

            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className={
                  isVerified
                    ? 'h-full bg-gradient-to-r from-green-500 to-emerald-500'
                    : 'h-full bg-gradient-to-r from-amber-500 to-orange-500'
                }
                style={{ width: isVerified ? '85%' : '60%' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email verification */}
        <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Email Verification
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {user?.email || 'No email on file'}
                </p>
              </div>
              {isVerified ? (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                  <ShieldAlert className="w-3 h-3" /> Unverified
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-5">
            {isVerified ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your email is verified. You have full access to all features.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Verify your email to unlock messaging, connections, and full
                  profile visibility.
                </p>
                <Button
                  onClick={sendVerificationEmail}
                  disabled={isSending}
                  size="sm"
                  className="gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isSending ? 'Sending...' : 'Send Verification Email'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Password */}
        <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <KeyRound className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Password
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Keep your account secure with a strong password
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <Link href="/dashboard/settings/password">
              <Button variant="outline" className="gap-2">
                <Lock className="w-4 h-4" />
                Change Password
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Two-factor */}
        <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <Smartphone className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Two-Factor Authentication
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Add an extra layer of security
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] border-gray-300 dark:border-gray-700"
              >
                Coming soon
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              2FA will be available soon. Until then, keep your password
              strong and unique.
            </p>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Recent Activity
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Recent sign-ins on your account
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              <div className="flex items-center gap-3 px-5 py-3">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Current session
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {settings.timezone} · this device
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px]">
                  Active
                </Badge>
              </div>
              <div className="flex items-center gap-3 px-5 py-3">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Web login
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Recent session
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] text-gray-500 dark:text-gray-400"
                >
                  Expired
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              Notice something suspicious?
            </p>
            <p>
              If you see logins you don't recognize, change your password
              immediately and contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}