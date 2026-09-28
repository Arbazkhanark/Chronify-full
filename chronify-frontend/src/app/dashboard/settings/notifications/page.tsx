import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Bell } from 'lucide-react'

export const metadata: Metadata = { title: 'Notifications · Chronify' }

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Settings
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Notifications
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Notification preferences are configured on the main{' '}
          <Link href="/dashboard/settings" className="text-blue-600 dark:text-blue-400 hover:underline">
            Settings page
          </Link>
          .
        </p>
      </div>
    </div>
  )
}