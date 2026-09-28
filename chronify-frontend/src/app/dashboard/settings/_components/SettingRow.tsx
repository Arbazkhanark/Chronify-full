// src/app/dashboard/settings/_components/SettingRow.tsx
'use client'

import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface SettingRowProps {
  label: string
  description?: string
  children: ReactNode
  onClick?: () => void
  href?: string
}

export function SettingRow({
  label,
  description,
  children,
  onClick,
  href,
}: SettingRowProps) {
  const content = (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {children}
        {href && <ChevronRight className="w-4 h-4 text-gray-400" />}
      </div>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        className="block px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        {content}
      </a>
    )
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        {content}
      </button>
    )
  }

  return <div className="px-4">{content}</div>
}