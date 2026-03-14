// src/modules/timetable/timetable.repository.ts

import { prisma } from '../../config/prisma'
import { FixedTimeRepository } from '../fixed-times/fixed-time.repository'
import { DayOfWeek, TaskFeedbackDTO, TaskFeedbackResponse } from './timetable.types'
import { Prisma } from '@prisma/client'
import { lockTimetableSchema } from './timetable.validation'
import z from 'zod'
import { UpdateTaskDTO } from '../tasks/task.types'
import { FixedTimeType, Priority, SleepDay, SleepType, TaskCategory, TaskStatus, TimeSlotType } from '../../generated/prisma/enums'
import { logger } from 'patal-log'
import { AppError } from '../../utils/AppError'



interface LockTimetablePayload {
  fixedTimes: any[]
  sleepSchedules: any[]
  tasks: any[]
}



interface LockTimetableResult {
  fixedTimes: any[]
  sleepSchedules: any[]
  tasks: any[]
  created: {
    fixedTimes: number
    sleepSchedules: number
    tasks: number
  }
  updated: {
    fixedTimes: number
    sleepSchedules: number
    tasks: number
  }
  skipped: {
    fixedTimes: number
    sleepSchedules: number
    tasks: number
  }
}

export class TimetableRepository {
  
  /**
   * Get tasks by day with optional time range filter
   */
  static async getTasksByDay(
    userId: string,
    day: DayOfWeek,
    options?: {
      timeRangeStart?: number
      timeRangeEnd?: number
    }
  ) {
    const where: Prisma.TaskWhereInput = {
      userId,
      day: day as any
    }

    // Add time range filter if provided
    if (options?.timeRangeStart !== undefined || options?.timeRangeEnd !== undefined) {
      where.startTime = {}
      
      if (options.timeRangeStart !== undefined) {
        const startHour = options.timeRangeStart.toString().padStart(2, '0')
        where.startTime.gte = `${startHour}:00`
      }
      
      if (options.timeRangeEnd !== undefined) {
        const endHour = options.timeRangeEnd.toString().padStart(2, '0')
        where.startTime.lte = `${endHour}:00`
      }
    }

    return prisma.task.findMany({
      where,
      orderBy: {
        startTime: 'asc'
      },
      include: {
        goal: {
          select: {
            id: true,
            title: true
          }
        },
        milestone: {
          select: {
            id: true,
            title: true
          }
        },
        fixedTime: {
          select: {
            id: true,
            title: true
          }
        },
        feedback: {
          select: {
            focusLevel: true,
            notes: true,
            completedWell: true,
            createdAt: true
          }
        }
      }
    })
  }

  /**
   * Get active tasks (currently running)
   */
  static async getActiveTasks(
    userId: string,
    day: DayOfWeek,
    currentTime: string
  ) {
    return prisma.task.findMany({
      where: {
        userId,
        day: day as any,
        startTime: { lte: currentTime },
        endTime: { gt: currentTime },
        status: { in: ['PENDING', 'ONGOING'] },
        isCompleted: false
      },
      orderBy: {
        startTime: 'asc'
      },
      include: {
        goal: {
          select: {
            id: true,
            title: true
          }
        },
        fixedTime: {
          select: {
            id: true,
            title: true
          }
        },
        feedback: {
          select: {
            focusLevel: true
          }
        }
      }
    })
  }

  /**
   * Get upcoming tasks
   */
  static async getUpcomingTasks(
    userId: string,
    day: DayOfWeek,
    currentTime: string,
    limit: number = 10
  ) {
    return prisma.task.findMany({
      where: {
        userId,
        day: day as any,
        startTime: { gt: currentTime },
        status: { in: ['PENDING', 'RESCHEDULED'] },
        isCompleted: false
      },
      orderBy: {
        startTime: 'asc'
      },
      take: limit,
      include: {
        goal: {
          select: {
            id: true,
            title: true
          }
        },
        fixedTime: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
  }

  /**
   * Get tasks in date range
   */
  static async getTasksInDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    // Convert dates to day strings for the range
    const days: DayOfWeek[] = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dayNames: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const day = dayNames[currentDate.getDay()] as DayOfWeek
      days.push(day)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return prisma.task.findMany({
      where: {
        userId,
        day: { in: days as any[] },
        // Optional: Add date filter if tasks have date field
      },
      include: {
        feedback: {
          select: {
            focusLevel: true,
            notes: true,
            completedWell: true
          }
        },
        goal: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' }
      ]
    })
  }

  /**
   * Create task feedback
   */
  static async createTaskFeedback(
    userId: string,
    data: TaskFeedbackDTO
  ): Promise<TaskFeedbackResponse> {
    const feedback = await prisma.taskFeedback.create({
      data: {
        userId,
        taskId: data.taskId,
        focusLevel: data.focusLevel,
        completedWell: data.completedWell,
        notes: data.notes
      }
    })

    return {
      id: feedback.id,
      taskId: feedback.taskId,
      focusLevel: feedback.focusLevel,
      completedWell: feedback.completedWell,
      notes: feedback.notes,
      createdAt: feedback.createdAt
    }
  }

  /**
   * Get task feedback
   */
  static async getTaskFeedback(taskId: string): Promise<TaskFeedbackResponse | null> {
    const feedback = await prisma.taskFeedback.findUnique({
      where: { taskId }
    })

    if (!feedback) return null

    return {
      id: feedback.id,
      taskId: feedback.taskId,
      focusLevel: feedback.focusLevel,
      completedWell: feedback.completedWell,
      notes: feedback.notes,
      createdAt: feedback.createdAt
    }
  }

  /**
   * Update task status with last update timestamp
   */
  static async updateTaskStatus(
    taskId: string,
    userId: string,
    status: string,
    notes?: string
  ) {
    return prisma.task.update({
      where: { id: taskId, userId },
      data: {
        status: status as any,
        lastStatusUpdateAt: new Date(),
        ...(notes && { note: notes })
      },
      include: {
        goal: {
          select: {
            id: true,
            title: true
          }
        },
        fixedTime: {
          select: {
            id: true,
            title: true
          }
        },
        feedback: true
      }
    })
  }

  /**
   * Get task count by status for a user
   */
  static async getTaskCountByStatus(userId: string) {
    const result = await prisma.task.groupBy({
      by: ['status'],
      where: { userId },
      _count: true
    })

    return result.reduce((acc, curr) => {
      acc[curr.status] = curr._count
      return acc
    }, {} as Record<string, number>)
  }

  /**
   * Get completed tasks with feedback for a period
   */
  static async getCompletedTasksWithFeedback(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    // Convert dates to day strings
    const days: DayOfWeek[] = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dayNames: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const day = dayNames[currentDate.getDay()] as DayOfWeek
      days.push(day)
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return prisma.task.findMany({
      where: {
        userId,
        day: { in: days as any[] },
        status: 'COMPLETED',
        isCompleted: true,
        completedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        feedback: true
      }
    })
  }

  /**
   * Get all tasks for multiple days
   */
  static async getTasksForDays(
    userId: string,
    days: DayOfWeek[]
  ) {
    return prisma.task.findMany({
      where: {
        userId,
        day: { in: days as any[] }
      },
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' }
      ],
      include: {
        goal: {
          select: {
            id: true,
            title: true
          }
        },
        fixedTime: {
          select: {
            id: true,
            title: true
          }
        },
        feedback: {
          select: {
            focusLevel: true,
            completedWell: true
          }
        }
      }
    })
  }

  /**
   * Get sleep tasks for a day
   */
  static async getSleepTasks(userId: string, day: DayOfWeek) {
    return prisma.task.findMany({
      where: {
        userId,
        day: day as any,
        type: 'SLEEP'
      },
      orderBy: {
        startTime: 'asc'
      }
    })
  }






  // src/modules/timetable/timetable.repository.ts

// Add these methods to the TimetableRepository class

/**
 * Get all fixed times for a user
 */
static async getFixedTimes(userId: string) {
  return prisma.fixedTime.findMany({
    where: { userId },
    include: {
      freePeriods: true
    },
    orderBy: {
      startTime: 'asc'
    }
  });
}

/**
 * Get all sleep schedules for a user
 */
static async getSleepSchedules(userId: string) {
  return prisma.sleepSchedule.findMany({
    where: { userId },
    orderBy: {
      day: 'asc'
    }
  });
}

/**
 * Get all tasks for a user
 */
static async getAllTasks(userId: string) {
  return prisma.task.findMany({
    where: { userId },
    include: {
      goal: {
        select: {
          id: true,
          title: true
        }
      },
      milestone: {
        select: {
          id: true,
          title: true
        }
      },
      fixedTime: {
        select: {
          id: true,
          title: true
        }
      },
      feedback: {
        select: {
          focusLevel: true,
          notes: true
        }
      }
    },
    orderBy: [
      { day: 'asc' },
      { startTime: 'asc' }
    ]
  });
}




    /**
   * Lock timetable with proper upsert logic and week-lock mechanism
   */
  static async lockUserTimetable(
    userId: string,
    payload: LockTimetablePayload
  ): Promise<LockTimetableResult> {
    
    // Check if user already locked timetable this week
    const lastLock = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastTimetableLockAt: true }
    });

    if (lastLock?.lastTimetableLockAt) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      if (lastLock.lastTimetableLockAt > oneWeekAgo) {
        const nextAvailable = new Date(lastLock.lastTimetableLockAt);
        nextAvailable.setDate(nextAvailable.getDate() + 7);
        
        throw new AppError(
          `Timetable can only be locked once per week. Next available: ${nextAvailable.toLocaleDateString()}`,
          429
        );
      }
    }

    return prisma.$transaction(async (tx) => {
      const result: LockTimetableResult = {
        fixedTimes: [],
        sleepSchedules: [],
        tasks: [],
        created: { fixedTimes: 0, sleepSchedules: 0, tasks: 0 },
        updated: { fixedTimes: 0, sleepSchedules: 0, tasks: 0 },
        skipped: { fixedTimes: 0, sleepSchedules: 0, tasks: 0 }
      };

      // ==================== 1. PROCESS FIXED TIMES ====================
      if (payload.fixedTimes?.length) {
        for (const ft of payload.fixedTimes) {
          // Find existing fixed time by unique combination
          const existing = await tx.fixedTime.findFirst({
            where: {
              userId,
              title: ft.title,
              startTime: ft.startTime,
              endTime: ft.endTime,
              AND: ft.days.map((day: string) => ({
                days: { has: day }
              }))
            },
            include: { freePeriods: true }
          });

          if (existing) {
            // Check if data actually changed
            const hasChanges = 
              existing.description !== ft.description ||
              existing.type !== ft.type ||
              existing.color !== ft.color ||
              existing.isEditable !== (ft.isEditable ?? false);

            if (hasChanges) {
              // Update only changed fields
              const updated = await tx.fixedTime.update({
                where: { id: existing.id },
                data: {
                  description: ft.description ?? existing.description,
                  type: ft.type as FixedTimeType,
                  color: ft.color ?? existing.color,
                  isEditable: ft.isEditable ?? existing.isEditable,
                  updatedAt: new Date() // Update timestamp only
                },
                include: { freePeriods: true }
              });
              result.fixedTimes.push(updated);
              result.updated.fixedTimes++;
            } else {
              // No changes - keep existing with original createdAt
              result.fixedTimes.push(existing);
              result.skipped.fixedTimes++;
            }

            // Handle free periods (always update to match payload)
            if (ft.freePeriods?.length) {
              // Delete existing free periods
              await tx.freePeriod.deleteMany({
                where: { fixedTimeId: existing.id }
              });

              // Create new free periods
              await tx.freePeriod.createMany({
                data: ft.freePeriods.map((fp: any) => ({
                  fixedTimeId: existing.id,
                  title: fp.title ?? "Free Period",
                  startTime: fp.startTime,
                  endTime: fp.endTime,
                  day: fp.day,
                  duration: this.calculateDuration(fp.startTime, fp.endTime)
                }))
              });

              // Fetch updated fixed time with new free periods
              const updatedWithFree = await tx.fixedTime.findUnique({
                where: { id: existing.id },
                include: { freePeriods: true }
              });
              
              // Replace in results
              const index = result.fixedTimes.findIndex(ft => ft.id === existing.id);
              if (index !== -1 && updatedWithFree) {
                result.fixedTimes[index] = updatedWithFree;
              }
            }
          } else {
            // Create new fixed time
            const created = await tx.fixedTime.create({
              data: {
                userId,
                title: ft.title,
                description: ft.description,
                days: ft.days,
                startTime: ft.startTime,
                endTime: ft.endTime,
                type: ft.type as FixedTimeType,
                color: ft.color ?? "#6B7280",
                isEditable: ft.isEditable ?? false,
                freePeriods: {
                  create: (ft.freePeriods || []).map((fp: any) => ({
                    title: fp.title ?? "Free Period",
                    startTime: fp.startTime,
                    endTime: fp.endTime,
                    day: fp.day,
                    duration: this.calculateDuration(fp.startTime, fp.endTime)
                  }))
                }
              },
              include: { freePeriods: true }
            });
            result.fixedTimes.push(created);
            result.created.fixedTimes++;
          }
        }
      }

      // ==================== 2. PROCESS SLEEP SCHEDULES ====================
      if (payload.sleepSchedules?.length) {
        for (const s of payload.sleepSchedules) {
          const existing = await tx.sleepSchedule.findFirst({
            where: {
              userId,
              day: s.day as SleepDay,
              bedtime: s.bedtime,
              wakeTime: s.wakeTime
            }
          });

          if (existing) {
            // Check for changes
            const hasChanges = 
              existing.isActive !== (s.isActive ?? true) ||
              existing.type !== s.type ||
              existing.notes !== s.notes ||
              existing.color !== (s.color ?? "#4B5563");

            if (hasChanges) {
              await tx.sleepSchedule.update({
                where: { id: existing.id },
                data: {
                  isActive: s.isActive ?? existing.isActive,
                  type: s.type as SleepType,
                  notes: s.notes ?? existing.notes,
                  color: s.color ?? existing.color,
                  updatedAt: new Date()
                }
              });
              result.updated.sleepSchedules++;
            } else {
              result.skipped.sleepSchedules++;
            }
          } else {
            await tx.sleepSchedule.create({
              data: {
                userId,
                day: s.day as SleepDay,
                bedtime: s.bedtime,
                wakeTime: s.wakeTime,
                duration: this.calculateSleepDuration(s.bedtime, s.wakeTime),
                isActive: s.isActive ?? true,
                type: s.type as SleepType,
                notes: s.notes,
                color: s.color ?? "#4B5563"
              }
            });
            result.created.sleepSchedules++;
          }
        }

        // Fetch all after processing
        result.sleepSchedules = await tx.sleepSchedule.findMany({
          where: { userId }
        });
      }

      // ==================== 3. PROCESS TASKS ====================
      if (payload.tasks?.length) {
        // Get all existing tasks for user (for conflict checking)
        const existingTasks = await tx.task.findMany({
          where: { userId },
          select: { id: true, title: true, startTime: true, endTime: true, day: true, goalId: true, milestoneId: true }
        });

        const existingTaskMap = new Map(
          existingTasks.map(t => [
            `${t.day}-${t.startTime}-${t.endTime}-${t.title}-${t.goalId || ''}-${t.milestoneId || ''}`,
            t
          ])
        );

        for (const t of payload.tasks) {
          const endTime = t.endTime || this.calculateEndTime(t.startTime, t.duration);
          const taskKey = `${t.day}-${t.startTime}-${endTime}-${t.title}-${t.goalId || ''}-${t.milestoneId || ''}`;
          
          const existing = existingTaskMap.get(taskKey);

          if (existing) {
            // Task exists - check if any field changed
            const normalizedTask = {
              subject: t.subject,
              notes: t.note,
              priority: t.priority || Priority.MEDIUM,
              color: t.color || "#3B82F6",
              type: t.type as TimeSlotType,
              category: t.category as TaskCategory,
              fixedTimeId: t.fixedTimeId,
              status: t.status || TaskStatus.PENDING,
              isCompleted: t.isCompleted || false,
              completedAt: t.completedAt
            };

            // Compare with existing (simplified - in production use deep comparison)
            const hasChanges = true; // Always update timestamp for tasks
            
            if (hasChanges) {
              await tx.task.update({
                where: { id: existing.id },
                data: {
                  ...normalizedTask,
                  updatedAt: new Date() // Update timestamp only
                }
              });
              result.updated.tasks++;
            } else {
              result.skipped.tasks++;
            }
          } else {
            // Create new task
            await tx.task.create({
              data: {
                userId,
                title: t.title,
                subject: t.subject,
                notes: t.note,
                startTime: t.startTime,
                endTime,
                duration: t.duration,
                priority: t.priority || Priority.MEDIUM,
                color: t.color || "#3B82F6",
                day: t.day,
                type: t.type as TimeSlotType,
                category: t.category as TaskCategory,
                goalId: t.goalId,
                milestoneId: t.milestoneId,
                fixedTimeId: t.fixedTimeId,
                status: t.status || TaskStatus.PENDING,
                isCompleted: t.isCompleted || false,
                completedAt: t.completedAt,
                // Grace period handling
                gracePeriodEndsAt: new Date(new Date().setHours(
                  parseInt(endTime.split(':')[0]), 
                  parseInt(endTime.split(':')[1]) + 60, 
                  0, 0
                ))
              }
            });
            result.created.tasks++;
          }
        }

        // Fetch tasks created/updated in last hour
        result.tasks = await tx.task.findMany({
          where: { 
            userId,
            OR: [
              { createdAt: { gte: new Date(Date.now() - 3600000) } },
              { updatedAt: { gte: new Date(Date.now() - 3600000) } }
            ]
          },
          include: {
            goal: { select: { id: true, title: true } },
            milestone: { select: { id: true, title: true } },
            fixedTime: { select: { id: true, title: true } }
          }
        });
      }

      // ==================== 4. UPDATE LAST LOCK TIMESTAMP ====================
      await tx.user.update({
        where: { id: userId },
        data: { lastTimetableLockAt: new Date() }
      });

      logger.info("Timetable lock completed", {
        functionName: "TimetableRepository.lockUserTimetable",
        metadata: { 
          userId, 
          created: result.created,
          updated: result.updated,
          skipped: result.skipped
        }
      });

      return result;
    }, {
      timeout: 30000, // 30 seconds
      maxWait: 10000  // 10 seconds max wait for transaction
    });
  }


  


  // ==================== 🗑️ RESET TIMETABLE ====================





// ==================== 🗑️ RESET TIMETABLE ====================

/**
 * Reset/clear user timetable data
 */
static async resetUserTimetable(
  userId: string,
  options: {
    resetTasks: boolean;
    resetFixedTimes: boolean;
    resetSleepSchedules: boolean;
  }
) {
  return prisma.$transaction(async (tx) => {
    const result = {
      deletedTasks: 0,
      deletedFixedTimes: 0,
      deletedSleepSchedules: 0,
      deletedFreePeriods: 0
    };

    // 1. Delete Tasks (if requested)
    if (options.resetTasks) {
      const deleteTasks = await tx.task.deleteMany({
        where: { userId }
      });
      result.deletedTasks = deleteTasks.count;
    }

    // 2. Delete Fixed Times and their Free Periods (if requested)
    if (options.resetFixedTimes) {
      // First, get all fixed times to count free periods
      const fixedTimes = await tx.fixedTime.findMany({
        where: { userId },
        include: { freePeriods: true }
      });

      // Count free periods
      result.deletedFreePeriods = fixedTimes.reduce(
        (sum, ft) => sum + (ft.freePeriods?.length || 0), 
        0
      );

      // Delete fixed times (cascades to free periods)
      const deleteFixedTimes = await tx.fixedTime.deleteMany({
        where: { userId }
      });
      result.deletedFixedTimes = deleteFixedTimes.count;
    }

    // 3. Delete Sleep Schedules (if requested)
    if (options.resetSleepSchedules) {
      const deleteSleepSchedules = await tx.sleepSchedule.deleteMany({
        where: { userId }
      });
      result.deletedSleepSchedules = deleteSleepSchedules.count;
    }

    return result;
  }, {
    timeout: 60000,
    maxWait: 30000
  });
}






// Helper functions (add these in the same file)
private static calculateDuration1(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;
  if (endMin < startMin) endMin += 24 * 60;
  return endMin - startMin;
}



private static calculateDuration(startTime: string, endTime: string): number {
  let startMin = this.timeToMinutes(startTime);
  let endMin = this.timeToMinutes(endTime);
  
  // Handle midnight crossing
  if (endMin < startMin) {
    endMin += 24 * 60;
  }
  
  return endMin - startMin;
}

private static timeToMinutes(time: string): number {
  let [hours, minutes] = time.split(':').map(Number);
  
  // Handle 24:00 as 00:00 (next day)
  if (hours === 24) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
}



private static calculateEndTime(startTime: string, duration: number): string {
  const [sh, sm] = startTime.split(':').map(Number);
  let totalMin = sh * 60 + sm + duration;
  const eh = Math.floor(totalMin / 60) % 24;
  const em = totalMin % 60;
  return `${eh.toString().padStart(2, '0')}:${em.toString().padStart(2, '0')}`;
}

private static calculateSleepDuration(bedtime: string, wakeTime: string): number {
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let bedMin = bh * 60 + bm;
  let wakeMin = wh * 60 + wm;
  if (wakeMin < bedMin) wakeMin += 24 * 60;
  return wakeMin - bedMin;
}


}