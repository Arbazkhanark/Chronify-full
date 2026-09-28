// src/app/dashboard/settings/_components/SettingSection.tsx
'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface SettingSectionProps {
  icon: LucideIcon
  title: string
  description?: string
  children: ReactNode
  accent?: string
}

export function SettingSection({
  icon: Icon,
  title,
  description,
  children,
  accent = 'text-blue-600 dark:text-blue-400',
}: SettingSectionProps) {
  return (
    <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center flex-shrink-0">
            <Icon className={`w-4 h-4 ${accent}`} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}