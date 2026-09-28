// src/app/u/[username]/not-found.tsx
import Link from 'next/link'
import { UserX } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <UserX className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Profile not found
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            We couldn't find this profile. It may have been deleted or the URL
            is incorrect.
          </p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}