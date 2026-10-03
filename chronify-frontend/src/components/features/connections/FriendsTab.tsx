'use client'

import { Users } from 'lucide-react'
import ConnectionCard from './ConnectionCard'
import type { ConnectionUser } from '@/types/connection-types'

export default function FriendsTab({ friends }: { friends: ConnectionUser[] }) {
  if (friends.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
          No connections yet
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Start connecting with people to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {friends.map((user) => (
        <ConnectionCard key={user.id} user={user} mode="friend" />
      ))}
    </div>
  )
}