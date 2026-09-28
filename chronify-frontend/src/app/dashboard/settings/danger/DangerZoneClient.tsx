// src/app/dashboard/settings/danger/DangerZoneClient.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'
import {
  ArrowLeft,
  AlertTriangle,
  Trash2,
  Download,
  RotateCcw,
  UserX,
  Database,
  Loader2,
  Info,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { useAuth } from '@/hooks/useAuth'
import { useSettings } from '@/hooks/useSettings'
import { clearProfileCache } from '@/lib/profile-cache'
import { clearSettings } from '@/lib/settings-storage'

/* ============================================================================
   TYPES
   ============================================================================ */

type DangerAction = 'export' | 'reset' | 'delete' | null

/* ============================================================================
   COMPONENT
   ============================================================================ */

export default function DangerZoneClient() {
  const router = useRouter()
  const { user, AuthService } = useAuth()
  const { reset: resetSettings } = useSettings()

  const [activeAction, setActiveAction] = useState<DangerAction>(null)
  const [confirmText, setConfirmText] = useState('')
  const [isWorking, setIsWorking] = useState(false)

  const userEmail = user?.email || ''
  const expectedConfirmText = 'DELETE'

  /* ---------------- Export ---------------- */
  const handleExport = async () => {
    setIsWorking(true)
    try {
      // In a real app this would hit a backend endpoint.
      // For now, gather everything from localStorage + send as JSON.
      const data = {
        exportedAt: new Date().toISOString(),
        user: JSON.parse(localStorage.getItem('current_user') || 'null'),
        profile: JSON.parse(localStorage.getItem('chronify:profile:v1') || 'null'),
        settings: JSON.parse(localStorage.getItem('chronify:settings:v1') || 'null'),
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `chronify-export-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Export downloaded', {
        description: 'Your data has been saved to your downloads.',
      })
      setActiveAction(null)
    } catch (err: any) {
      console.error('[export] failed:', err)
      toast.error('Export failed', { description: err?.message })
    } finally {
      setIsWorking(false)
    }
  }

  /* ---------------- Reset local data ---------------- */
  const handleReset = async () => {
    setIsWorking(true)
    try {
      resetSettings()
      clearProfileCache()
      clearSettings()

      toast.success('Local data reset', {
        description: 'Settings and cached data have been cleared.',
      })
      setActiveAction(null)

      // Give the toast a moment, then reload
      setTimeout(() => window.location.reload(), 800)
    } catch (err: any) {
      console.error('[reset] failed:', err)
      toast.error('Reset failed', { description: err?.message })
      setIsWorking(false)
    }
  }

  /* ---------------- Delete account ---------------- */
  const handleDeleteAccount = async () => {
    if (confirmText !== expectedConfirmText) {
      toast.error('Confirmation text does not match')
      return
    }

    setIsWorking(true)
    try {
      // In a real app this would be:
      //   await AuthService.deleteAccount()
      // For now we simulate.
      await new Promise((r) => setTimeout(r, 900))

      // Clear everything
      clearProfileCache()
      clearSettings()
      try {
        localStorage.removeItem('current_user')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      } catch {
        /* ignore */
      }

      toast.success('Account deleted', {
        description: 'We are sorry to see you go.',
        duration: 4000,
      })

      setTimeout(() => {
        router.push('/auth/login')
      }, 1200)
    } catch (err: any) {
      console.error('[delete-account] failed:', err)
      toast.error('Could not delete account', {
        description: err?.message || 'Please try again or contact support.',
      })
      setIsWorking(false)
    }
  }

  /* ---------------- Reset modal state when opened/closed ---------------- */
  const openAction = (action: DangerAction) => {
    setConfirmText('')
    setActiveAction(action)
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

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
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Danger Zone
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Irreversible actions — please read carefully
                </p>
              </div>
            </div>
          </div>

          {/* Warning banner */}
          <div className="flex items-start gap-3 p-4 rounded-lg border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-950/30">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-900 dark:text-red-100">
              <p className="font-medium">Proceed with caution</p>
              <p className="text-xs mt-1 text-red-800/90 dark:text-red-200/90">
                Actions below cannot be undone. Make sure you have a backup of
                any important data before continuing.
              </p>
            </div>
          </div>

          {/* ==================== EXPORT DATA ==================== */}
          <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <Download className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Export your data
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Download a JSON copy of your profile, settings, and
                    activity
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Take your data with you. Includes profile, preferences, and
                  activity records.
                </p>
                <Button
                  variant="outline"
                  onClick={() => openAction('export')}
                  className="gap-2 flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ==================== RESET LOCAL DATA ==================== */}
          <Card className="border-amber-200 dark:border-amber-800/60 dark:bg-gray-800">
            <CardHeader className="pb-4 border-b border-amber-100 dark:border-amber-800/60">
              <div className="flex items-start gap-3">
                <RotateCcw className="w-4 h-4 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Reset local data
                    </h2>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-amber-300 text-amber-700 dark:border-amber-700/60 dark:text-amber-400"
                    >
                      Recoverable
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Clear cached profile, settings, and locally stored
                    preferences on this device
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Your account and cloud data stay intact. Only this browser's
                  cached data is cleared.
                </div>
                <Button
                  variant="outline"
                  onClick={() => openAction('reset')}
                  className="gap-2 flex-shrink-0 border-amber-300 dark:border-amber-700/60 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ==================== DELETE ACCOUNT ==================== */}
          <Card className="border-red-200 dark:border-red-800/60 dark:bg-gray-800">
            <CardHeader className="pb-4 border-b border-red-100 dark:border-red-800/60">
              <div className="flex items-start gap-3">
                <UserX className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Delete account
                    </h2>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-red-300 text-red-700 dark:border-red-700/60 dark:text-red-400"
                    >
                      Irreversible
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Permanently delete your account and all associated data
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  This will remove your account, goals, tasks, and history.
                  <span className="block font-medium text-red-600 dark:text-red-400 mt-1">
                    This action cannot be undone.
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => openAction('delete')}
                  className="gap-2 flex-shrink-0 border-red-300 dark:border-red-700/60 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Small note */}
          <div className="flex items-start gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Need help? Contact our support team before taking any destructive
              action.
            </p>
          </div>
        </div>
      </div>

      {/* ==================== EXPORT MODAL ==================== */}
      <Dialog
        open={activeAction === 'export'}
        onOpenChange={(o) => !o && setActiveAction(null)}
      >
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-gray-100">
              <Database className="w-5 h-5" /> Export your data
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              A JSON file will be downloaded with your profile, settings, and
              activity data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setActiveAction(null)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isWorking}>
              {isWorking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparing…
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" /> Download
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== RESET MODAL ==================== */}
      <Dialog
        open={activeAction === 'reset'}
        onOpenChange={(o) => !o && setActiveAction(null)}
      >
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-gray-100">
              <RotateCcw className="w-5 h-5 text-amber-500" /> Reset local data
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              This will clear cached profile data and settings on this browser.
              Your account stays intact.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setActiveAction(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleReset}
              disabled={isWorking}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isWorking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resetting…
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==================== DELETE MODAL ==================== */}
      <Dialog
        open={activeAction === 'delete'}
        onOpenChange={(o) => !o && setActiveAction(null)}
      >
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" /> Delete your account
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              This will permanently delete your account, profile, goals, tasks,
              and all associated data.
              <span className="block mt-2 font-medium text-red-600 dark:text-red-400">
                This action cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <Label htmlFor="confirm-delete" className="text-sm">
              Type{' '}
              <span className="font-mono font-semibold text-red-600 dark:text-red-400">
                {expectedConfirmText}
              </span>{' '}
              to confirm
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={expectedConfirmText}
              className="font-mono"
              autoComplete="off"
            />
            {userEmail && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Account:{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {userEmail}
                </span>
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setActiveAction(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={isWorking || confirmText !== expectedConfirmText}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isWorking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Forever
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}