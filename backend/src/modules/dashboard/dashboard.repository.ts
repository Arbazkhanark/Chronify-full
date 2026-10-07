// src/modules/dashboard/dashboard.repository.ts
import { prisma } from "../../config/prisma"

export class DashboardRepository {
  /** Basic user info + streak */
  static async getUserOverview(userId: string) {
    const [user, streak] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          verified: true,
          avatarUrl: true,
          timezone: true,
        },
      }),
      prisma.streak.findUnique({
        where: { userId },
      }),
    ])
    return { user, streak }
  }

  /** All goals with their milestones (for stats + goal cards) */
  static async getUserGoals(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      include: {
        milestones: {
          select: {
            id: true,
            completed: true,
            scheduledHours: true,
            completedHours: true,
          },
        },
      },
    })
  }

  /** Today's tasks (excludes FIXED + SLEEP slots) */
  static async getTodayTasks(userId: string, dayName: string) {
    return prisma.task.findMany({
      where: {
        userId,
        day: dayName,
        type: { notIn: ['FIXED', 'SLEEP'] },
      },
      include: {
        goal: {
          select: { id: true, title: true },
        },
      },
      orderBy: { startTime: 'asc' },
    })
  }

  /** All tasks for the current week (for weekly activity + insights) */
  static async getWeekTasks(userId: string, startDate: Date, endDate: Date) {
    return prisma.task.findMany({
      where: {
        userId,
        type: { notIn: ['FIXED', 'SLEEP'] },
        OR: [
          // Completed this week
          {
            completedAt: { gte: startDate, lte: endDate },
          },
          // Or tasks assigned to days this week (via updatedAt fallback)
          {
            updatedAt: { gte: startDate, lte: endDate },
          },
        ],
      },
      select: {
        id: true,
        day: true,
        startTime: true,
        endTime: true,
        duration: true,
        status: true,
        completedAt: true,
        updatedAt: true,
      },
    })
  }

  /** Completed tasks in last 8 weeks (for insights) */
  static async getRecentCompletedTasks(userId: string, since: Date) {
    return prisma.task.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { gte: since },
      },
      select: {
        id: true,
        day: true,
        startTime: true,
        endTime: true,
        duration: true,
        completedAt: true,
      },
    })
  }

  /** Active sleep schedules */
  static async getSleepSchedules(userId: string) {
    return prisma.sleepSchedule.findMany({
      where: { userId, isActive: true },
    })
  }

  /** Fixed commitments (max 10 for dashboard card) */
  static async getFixedTimes(userId: string, take = 10) {
    return prisma.fixedTime.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take,
    })
  }






    /* =========================================================
     NEW: Fetch all tasks in a given UTC range (for weekly)
     ========================================================= */
  static async getTasksInRange(
    userId: string,
    from: Date,
    to: Date
  ) {
    return prisma.task.findMany({
      where: {
        userId,
        type: { notIn: ['FIXED', 'SLEEP'] },
        OR: [
          { completedAt: { gte: from, lte: to } },
          {
            status: { in: ['PENDING', 'ONGOING'] },
            updatedAt: { gte: from, lte: to },
          },
        ],
      },
      select: {
        id: true,
        day: true,
        startTime: true,
        endTime: true,
        duration: true,
        status: true,
        category: true,
        completedAt: true,
        updatedAt: true,
      },
    })
  }

  /* =========================================================
     NEW: Fetch completed tasks for insights (with category)
     ========================================================= */
  static async getCompletedTasksInRange(
    userId: string,
    from: Date,
    to: Date
  ) {
    return prisma.task.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { gte: from, lte: to },
      },
      select: {
        id: true,
        day: true,
        startTime: true,
        endTime: true,
        duration: true,
        category: true,
        completedAt: true,
      },
    })
  }
  





}