'use client'

import { Inbox } from 'lucide-react'
import ConnectionCard from './ConnectionCard'
import type { FriendRequest } from '@/types/connection-types'

interface Props {
  requests: FriendRequest[]
  onAccept: (requestId: string) => Promise<void>
  onReject: (requestId: string) => Promise<void>
}

export default function RequestsTab({ requests, onAccept, onReject }: Props) {
  const pending = requests.filter((r) => r.status === 'PENDING')

  if (pending.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No pending requests"
        description="When someone sends you a connection request, it'll show up here."
      />
    )
  }

  return (
    <div className="space-y-3">
      {pending.map((req) => {
        if (!req.sender) return null
        return (
          <ConnectionCard
            key={req.id}
            user={req.sender}
            mode="received"
            requestId={req.id}
            onAccept={onAccept}
            onReject={onReject}
          />
        )
      })}
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: any
  title: string
  description: string
}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
        {description}
      </p>
    </div>
  )
}