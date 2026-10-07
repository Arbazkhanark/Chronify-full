// src/modules/streak/streak.service.ts
import { prisma } from '../../config/prisma'

/**
 * Update the user's streak when a task is completed.
 * Call this after marking a task as COMPLETED.
 */
export async function updateStreakOnTaskCompletion(
  userId: string,
  timezone: string = 'Asia/Kolkata'
) {
  // Today's date in user's tz, as UTC midnight (so comparisons are stable)
  const todayISO = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())
  const today = new Date(`${todayISO}T00:00:00.000Z`)

  const existing = await prisma.streak.findUnique({ where: { userId } })

  if (!existing) {
    return prisma.streak.create({
      data: {
        userId,
        current: 1,
        best: 1,
        lastActive: today,
      },
    })
  }

  const last = existing.lastActive
    ? new Date(existing.lastActive.toISOString().slice(0, 10) + 'T00:00:00.000Z')
    : null

  if (!last) {
    return prisma.streak.update({
      where: { userId },
      data: { current: 1, best: Math.max(existing.best, 1), lastActive: today },
    })
  }

  const diffDays = Math.round((today.getTime() - last.getTime()) / 86400000)

  if (diffDays === 0) {
    // Already counted today — just refresh timestamp
    return prisma.streak.update({
      where: { userId },
      data: { lastActive: today },
    })
  }

  if (diffDays === 1) {
    const next = existing.current + 1
    return prisma.streak.update({
      where: { userId },
      data: {
        current: next,
        best: Math.max(existing.best, next),
        lastActive: today,
      },
    })
  }

  // Missed days → reset
  return prisma.streak.update({
    where: { userId },
    data: {
      current: 1,
      best: Math.max(existing.best, 1),
      lastActive: today,
    },
  })
}