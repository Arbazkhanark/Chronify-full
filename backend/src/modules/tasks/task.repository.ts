// src/modules/tasks/task.repository.ts
import { prisma } from "../../config/prisma"
import { Task } from "../../generated/prisma/client"
import { AppError } from "../../utils/AppError"
import { 
  CreateTaskDTO, 
  UpdateTaskDTO, 
  TaskFilterDTO,
  BulkTaskDTO,
  TaskStats
} from "./task.types"
import { logger } from "patal-log"

export class TaskRepository {
  // Task CRUD operations
  static async create(userId: string, data: CreateTaskDTO) {
    const endTime = this.calculateEndTime(data.startTime, data.duration)
    
    return prisma.task.create({
      data: {
        userId,
        ...data,
        endTime,
        status: 'PENDING'
      },
      include: {
        goal: {
          include: { milestones: true }
        },
        milestone: true,
        fixedTime: {
          include: { freePeriods: true }
        }
      }
    })
  }

  static async findById(id: string, userId: string) {
    return prisma.task.findFirst({
      where: { id, userId },
      include: {
        goal: {
          include: { milestones: true }
        },
        milestone: true,
        fixedTime: {
          include: { freePeriods: true }
        }
      }
    })
  }

  static async findAll(userId: string, filters: TaskFilterDTO) {
    const { limit = 50, page = 1, ...filterData } = filters
    const skip = (page - 1) * limit
    
    const where: any = { userId }
    
    // Apply filters
    if (filterData.day) {
      where.day = filterData.day
    }
    
    if (filterData.goalId) {
      where.goalId = filterData.goalId
    }
    
    if (filterData.fixedTimeId) {
      where.fixedTimeId = filterData.fixedTimeId
    }
    
    if (filterData.status) {
      where.status = filterData.status
    }
    
    if (filterData.type) {
      where.type = filterData.type
    }
    
    if (filterData.priority) {
      where.priority = filterData.priority
    }
    
    if (filterData.isCompleted !== undefined) {
      where.isCompleted = filterData.isCompleted
    }
    
    if (filterData.search) {
      where.OR = [
        { title: { contains: filterData.search, mode: 'insensitive' } },
        { subject: { contains: filterData.search, mode: 'insensitive' } }
      ]
    }
    
    // Date range filter
    if (filterData.fromDate || filterData.toDate) {
      where.createdAt = {}
      if (filterData.fromDate) {
        where.createdAt.gte = new Date(filterData.fromDate)
      }
      if (filterData.toDate) {
        where.createdAt.lte = new Date(filterData.toDate)
      }
    }
    
    // Build orderBy
    let orderBy: any = {}
    switch (filterData.sort) {
      case 'time':
        orderBy = { startTime: 'asc' }
        break
      case 'priority':
        const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
        // Custom sorting in service layer
        break
      case 'day':
        const dayOrder = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }
        // Custom sorting in service layer
        break
      case 'created':
        orderBy = { createdAt: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }
    
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          goal: true,
          milestone: true,
          fixedTime: true
        }
      }),
      prisma.task.count({ where })
    ])
    
    return {
      tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  static async update(id: string, userId: string, data: UpdateTaskDTO) {
    const updateData: any = { ...data }
    
    // Recalculate end time if startTime or duration changed
    if (data.startTime || data.duration) {
      const existingTask = await this.findById(id, userId)
      if (existingTask) {
        const startTime = data.startTime || existingTask.startTime
        const duration = data.duration || existingTask.duration
        updateData.endTime = this.calculateEndTime(startTime, duration)
      }
    }
    
    return prisma.task.update({
      where: { id, userId },
      data: updateData,
      include: {
        goal: {
          include: { milestones: true }
        },
        milestone: true,
        fixedTime: {
          include: { freePeriods: true }
        }
      }
    })
  }

  static async delete(id: string, userId: string) {
    return prisma.task.delete({
      where: { id, userId }
    })
  }

  // Bulk operations
  static async bulkCreate1(userId: string, tasks: BulkTaskDTO[]) {
    const tasksWithEndTime = tasks.map(task => ({
      userId,
      ...task,
      endTime: this.calculateEndTime(task.startTime, task.duration),
      status: 'PENDING' as const
    }))
    
    return prisma.task.createManyAndReturn({
      data: tasksWithEndTime,
      include: {
        goal: true,
        milestone: true,
        fixedTime: true
      }
    })
  }
 



  static async bulkCreate(userId: string, tasks: BulkTaskDTO[]) {
  const tasksWithEndTime = tasks.map(task => ({
    userId,
    ...task,
    endTime: this.calculateEndTime(task.startTime, task.duration),
    status: 'PENDING' as const
  }))
  
  return prisma.task.createManyAndReturn({
    data: tasksWithEndTime,
    include: {
      goal: true,
      milestone: true,
      fixedTime: true
    }
  })
}




static async bulkUpdate(
  userId: string,
  updates: Array<{
    taskId: string;
    title?: string;
    subject?: string;
    startTime?: string;
    endTime?: string;
    duration?: number;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    color?: string;
    day?: string;
    type?: string;
    category?: string;
    status?: string;
    isCompleted?: boolean;
    completedAt?: string | Date;
    goalId?: string | null;
    milestoneId?: string | null;
    fixedTimeId?: string | null;
    note?: string;
  }>
): Promise<Task[]> {
  return prisma.$transaction(async (tx) => {
    // Parallel ownership checks
    const existingTasks = await Promise.all(
      updates.map(u => 
        tx.task.findFirst({ where: { id: u.taskId, userId } })
      )
    );

    existingTasks.forEach((task, i) => {
      if (!task) throw new AppError(`Task not found: ${updates[i].taskId}`, 404);
    });

    // Parallel updates with undefined fields removed
    const updatePromises = updates.map((update, i) => {
      const { taskId, ...rawData } = update;

      // Remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(rawData).filter(([_, v]) => v !== undefined)
      );

      // Optional business rule
      if (existingTasks[i]?.isCompleted && cleanData.isCompleted === false) {
        throw new AppError(`Cannot reopen completed task: ${taskId}`, 403);
      }

      return tx.task.update({
        where: { id: taskId },
        data: {
          ...cleanData,
          updatedAt: new Date(),
        },
        include: {
          goal: true,
          milestone: true,
          fixedTime: true,
        },
      });
    });

    const updatedTasks = await Promise.all(updatePromises);
    return updatedTasks;
  }, {
    timeout: 60000,
    maxWait: 15000,
  });
}




// src/modules/tasks/task.repository.ts

static async bulkDelete(userId: string, taskIds: string[]) {
  // Using deleteMany + transaction for atomicity & ownership check
  return prisma.$transaction(async (tx) => {
    // Optional but recommended: verify all tasks belong to the user first
    const existingTasks = await tx.task.findMany({
      where: {
        id: { in: taskIds },
        userId,
      },
      select: { id: true },
    });

    const foundIds = new Set(existingTasks.map(t => t.id));
    const missingIds = taskIds.filter(id => !foundIds.has(id));

    if (missingIds.length > 0) {
      throw new AppError(`Some tasks not found or not owned by user: ${missingIds.join(', ')}`, 404);
    }

    // Actual bulk delete
    const deleteResult = await tx.task.deleteMany({
      where: {
        id: { in: taskIds },
        userId, // extra safety
      },
    });

    return deleteResult; // { count: number }
  }, {
    timeout: 30000,   // adjust if deleting very large batches
    maxWait: 10000,
  });
}




  // Special queries
  static async findByDay(userId: string, day: string) {
    return prisma.task.findMany({
      where: { userId, day },
      orderBy: { startTime: 'asc' },
      include: {
        goal: true,
        milestone: true,
        fixedTime: true
      }
    })
  }

  static async findByGoal(userId: string, goalId: string) {
    return prisma.task.findMany({
      where: { userId, goalId },
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
      include: {
        goal: true,
        milestone: true,
        fixedTime: true
      }
    })
  }

  static async findOverlappingTasks(
    userId: string, 
    day: string, 
    startTime: string, 
    endTime: string, 
    excludeTaskId: string | null
  ) {
    const where: any = {
      userId,
      day,
      OR: [
        // Task starts during existing task
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime }
        }
      ]
    }
    
    if (excludeTaskId) {
      where.id = { not: excludeTaskId }
    }
    
    return prisma.task.findMany({
      where,
      take: 1 // Just need to know if there's any overlap
    })
  }

  // Statistics
  static async getStats(userId: string): Promise<any> {
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        goal: true,
        milestone: true,
        fixedTime: true
      }
    })
    
    const total = tasks.length
    const completed = tasks.filter(t => t.isCompleted).length
    const pending = tasks.filter(t => !t.isCompleted).length
    const overdue = tasks.filter(t => {
      if (t.isCompleted) return false
      const taskDate = new Date()
      return false // Implement proper overdue logic
    }).length
    
    const totalHours = tasks.reduce((sum, t) => sum + (t.duration / 60), 0)
    const completedHours = tasks
      .filter(t => t.isCompleted)
      .reduce((sum, t) => sum + (t.duration / 60), 0)
    
    // Group by priority
    const byPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Group by day
    const byDay = tasks.reduce((acc, task) => {
      acc[task.day] = (acc[task.day] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Group by goal
    const byGoal = tasks.reduce((acc, task) => {
      if (task.goalId) {
        acc[task.goalId] = (acc[task.goalId] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    return {
      tasks,
      total,
      completed,
      pending,
      overdue,
      totalHours,
      completedHours,
      byPriority,
      byDay,
      byGoal
    }
  }


  // Add these methods to the existing TaskRepository class

static async findByFixedTime(userId: string, fixedTimeId: string) {
  return prisma.task.findMany({
    where: { userId, fixedTimeId },
    orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
    include: {
      goal: true,
      milestone: true,
      fixedTime: true
    }
  })
}

static async findTasksInFreePeriod(userId: string, fixedTimeId: string, day: string) {
  return prisma.task.findMany({
    where: { 
      userId, 
      fixedTimeId,
      day 
    },
    orderBy: { startTime: 'asc' },
    include: {
      goal: true,
      milestone: true
    }
  })
}

  private static calculateEndTime(startTime: string, duration: number): string {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }








//   // Add these methods to your existing TaskRepository class

// // Create sleep task

static async createSleepTask(userId: string, data: {
  title: string
  subject: string
  startTime: string
  endTime: string
  duration: number
  color: string
  day: string
  sleepScheduleId: string
  type: string
}) {
  return prisma.task.create({
    data: {
      userId,
      title: data.title,
      subject: data.subject,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      color: data.color,
      day: data.day,
      type: 'SLEEP',
      category: 'HEALTH',
      // isSleepTime: true,
      // sleepScheduleId: data.sleepScheduleId,
      status: 'PENDING',
      isCompleted: false,
      priority: 'MEDIUM'
    }
  })
}

// // Delete all sleep tasks for a user
static async deleteAllSleepTasks(userId: string) {
  return prisma.task.deleteMany({
    where: {
      userId,
      type: 'SLEEP'
    }
  })
}

// // Delete sleep tasks by sleep schedule ID
static async deleteBySleepSchedule(userId: string, sleepScheduleId: string) {
  return prisma.task.deleteMany({
    where: {
      userId,
      type: 'SLEEP',
      // isSleepTime: true
    }
  })
}

// // Find tasks that conflict with sleep time
// static async findConflictingWithSleep(userId: string, day: string, startTime: string, endTime: string, excludeTaskId?: string | null) {
//   const where: any = {
//     userId,
//     day,
//     isSleepTime: true,
//     OR: [
//       {
//         // Task starts during sleep
//         startTime: { lte: startTime },
//         endTime: { gt: startTime }
//       },
//       {
//         // Task ends during sleep
//         startTime: { lt: endTime },
//         endTime: { gte: endTime }
//       },
//       {
//         // Task completely within sleep
//         startTime: { gte: startTime },
//         endTime: { lte: endTime }
//       }
//     ]
//   }
  
//   if (excludeTaskId) {
//     where.id = { not: excludeTaskId }
//   }
  
//   return prisma.task.findMany({
//     where,
//     orderBy: { startTime: 'asc' }
//   })
// }

// // Get sleep tasks for a date range
// static async getSleepTasks(userId: string, fromDate: Date, toDate: Date) {
//   return prisma.task.findMany({
//     where: {
//       userId,
//       isSleepTime: true,
//       createdAt: {
//         gte: fromDate,
//         lte: toDate
//       }
//     },
//     orderBy: { createdAt: 'desc' }
//   })
// }







}