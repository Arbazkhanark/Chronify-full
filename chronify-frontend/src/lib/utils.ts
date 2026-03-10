// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }




// import { type ClassValue, clsx } from 'clsx'
// import { twMerge } from 'tailwind-merge'

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// export function formatDate(date: Date | string): string {
//   return new Intl.DateTimeFormat('en-US', {
//     dateStyle: 'medium',
//     timeStyle: 'short',
//   }).format(new Date(date))
// }







// import { type ClassValue, clsx } from 'clsx'
// import { twMerge } from 'tailwind-merge'

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// export function formatDate(date: Date | string): string {
//   return new Intl.DateTimeFormat('en-US', {
//     dateStyle: 'medium',
//     timeStyle: 'short',
//   }).format(new Date(date))
// }

// export function generateRandomString(length: number): string {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
//   let result = ''
//   for (let i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length))
//   }
//   return result
// }










// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'CRITICAL': return '#EF4444'
    case 'HIGH': return '#F97316'
    case 'MEDIUM': return '#EAB308'
    case 'LOW': return '#3B82F6'
    default: return '#6B7280'
  }
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function isOverdue(date: Date): boolean {
  return new Date(date) < new Date()
}

export function getDaysRemaining(date: Date): number {
  const today = new Date()
  const target = new Date(date)
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}