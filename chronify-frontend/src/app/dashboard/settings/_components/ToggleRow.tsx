// src/app/dashboard/settings/_components/ToggleRow.tsx
'use client'

import { Switch } from '@/components/ui/switch'
import { SettingRow } from './SettingRow'

interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: ToggleRowProps) {
  return (
    <SettingRow label={label} description={description}>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </SettingRow>
  )
}