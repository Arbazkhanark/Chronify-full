'use client'

import { Send } from 'lucide-react'
import ConnectionCard from './ConnectionCard'
import type { FriendRequest } from '@/types/connection-types'

export default function SentTab({ requests }: { requests: FriendRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
          No sent requests
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Requests you send will appear here until they're accepted.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => {
        if (!req.receiver) return null
        return (
          <ConnectionCard
            key={req.id}
            user={req.receiver}
            mode="sent"
          />
        )
      })}
    </div>
  )
}