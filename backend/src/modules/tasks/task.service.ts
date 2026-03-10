// src/modules/tasks/task.service.ts
import { TaskRepository } from "./task.repository"
import { 
  CreateTaskDTO, 
  UpdateTaskDTO, 
  TaskFilterDTO, 
  DragDropDTO,
  TaskStats,
  BulkTaskDTO
} from "./task.types"
import { AppError } from "../../utils/AppError"
import { logger } from "patal-log"
import { GoalRepository } from "../goals/goal.repository"
import { FixedTimeRepository } from "../fixed-times/fixed-time.repository"

export class TaskService {
  static async createTask(userId: string, data: CreateTaskDTO) {
    logger.info("Creating new task", {
      functionName: "TaskService.createTask",
      metadata: { userId, data }
    })

    // Validate time conflicts
    await this.validateTimeSlot(userId, data.day, data.startTime, data.duration, null, data.fixedTimeId)

    // If linked to goal, verify goal exists
    if (data.goalId) {
      const goal = await GoalRepository.findById(data.goalId, userId)
      if (!goal) {
        throw new AppError("Goal not found", 404)
      }
    }

    // If linked to fixed time, verify fixed time exists
    if (data.fixedTimeId) {
      const fixedTime = await FixedTimeRepository.findById(data.fixedTimeId, userId)
      if (!fixedTime) {
        throw new AppError("Fixed time not found", 404)
      }
    }

    const task = await TaskRepository.create(userId, data)

    logger.info("Task created successfully", {
      functionName: "TaskService.createTask",
      metadata: { userId, taskId: task.id, day: task.day }
    })

    return task
  }

  static async getTask(userId: string, taskId: string) {
    logger.info("Fetching task", {
      functionName: "TaskService.getTask",
      metadata: { userId, taskId }
    })

    const task = await TaskRepository.findById(taskId, userId)
    if (!task) {
      logger.warn("Task not found", {
        functionName: "TaskService.getTask",
        metadata: { userId, taskId }
      })
      throw new AppError("Task not found", 404)
    }

    logger.info("Task fetched successfully", {
      functionName: "TaskService.getTask",
      metadata: { userId, taskId }
    })

    return task
  }

  static async getTasks(userId: string, filters: TaskFilterDTO) {
    logger.info("Fetching tasks with filters", {
      functionName: "TaskService.getTasks",
      metadata: { userId, filters }
    })

    const result = await TaskRepository.findAll(userId, filters)

    logger.info("Tasks fetched successfully", {
      functionName: "TaskService.getTasks",
      metadata: { userId, count: result.total }
    })

    return result
  }

  static async updateTask(userId: string, taskId: string, data: UpdateTaskDTO) {
    logger.info("Updating task", {
      functionName: "TaskService.updateTask",
      metadata: { userId, taskId, data }
    })

    // Check if task exists
    const existingTask = await TaskRepository.findById(taskId, userId)
    if (!existingTask) {
      logger.warn("Task not found for update", {
        functionName: "TaskService.updateTask",
        metadata: { userId, taskId }
      })
      throw new AppError("Task not found", 404)
    }

    // Validate time conflicts (excluding current task)
    if (data.day || data.startTime || data.duration) {
      const day = data.day || existingTask.day
      const startTime = data.startTime || existingTask.startTime
      const duration = data.duration || existingTask.duration
      
      await this.validateTimeSlot(userId, day, startTime, duration, taskId, data.fixedTimeId)
    }

    const task = await TaskRepository.update(taskId, userId, data)

    logger.info("Task updated successfully", {
      functionName: "TaskService.updateTask",
      metadata: { userId, taskId }
    })

    return task
  }

  static async deleteTask(userId: string, taskId: string) {
    logger.info("Deleting task", {
      functionName: "TaskService.deleteTask",
      metadata: { userId, taskId }
    })

    // Check if task exists
    const existingTask = await TaskRepository.findById(taskId, userId)
    if (!existingTask) {
      logger.warn("Task not found for deletion", {
        functionName: "TaskService.deleteTask",
        metadata: { userId, taskId }
      })
      throw new AppError("Task not found", 404)
    }

    await TaskRepository.delete(taskId, userId)

    logger.info("Task deleted successfully", {
      functionName: "TaskService.deleteTask",
      metadata: { userId, taskId }
    })
  }

  static async completeTask(userId: string, taskId: string) {
    logger.info("Completing task", {
      functionName: "TaskService.completeTask",
      metadata: { userId, taskId }
    })

    const task = await TaskRepository.findById(taskId, userId)
    if (!task) {
      throw new AppError("Task not found", 404)
    }

    const updatedTask = await TaskRepository.update(taskId, userId, {
      isCompleted: true,
      completedAt: new Date(),
      status: 'COMPLETED'
    })

    // Update goal progress if linked
    if (task.goalId) {
      await this.updateGoalProgress(task.goalId, task.duration)
    }

    logger.info("Task completed successfully", {
      functionName: "TaskService.completeTask",
      metadata: { userId, taskId }
    })

    return updatedTask
  }

  static async bulkCreateTasks(userId: string, tasks: BulkTaskDTO[]) {
    logger.info("Creating tasks in bulk", {
      functionName: "TaskService.bulkCreateTasks",
      metadata: { userId, count: tasks.length }
    })

    // Validate all tasks before creating
    for (const task of tasks) {
      await this.validateTimeSlot(userId, task.day, task.startTime, task.duration, null, task.fixedTimeId)
    }

    const createdTasks = await TaskRepository.bulkCreate(userId, tasks)

    logger.info("Bulk tasks created successfully", {
      functionName: "TaskService.bulkCreateTasks",
      metadata: { userId, count: createdTasks.length }
    })

    return createdTasks
  }



  // src/modules/tasks/task.service.ts

static async bulkUpdateTasks(
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
  ) {
    logger.info("Updating tasks in bulk", {
      functionName: "TaskService.bulkUpdateTasks",
      metadata: { userId, count: updates.length }
    });

    // Optional: extra business rules before hitting repository
    // e.g. prevent updating certain fields, log changes, etc.

    const updatedTasks = await TaskRepository.bulkUpdate(userId, updates);

    logger.info("Bulk tasks updated successfully", {
      functionName: "TaskService.bulkUpdateTasks",
      metadata: { userId, count: updatedTasks.length }
    });

    return updatedTasks;
  }




  // src/modules/tasks/task.service.ts

static async bulkDeleteTasks(userId: string, taskIds: string[]) {
  logger.info("Deleting tasks in bulk", {
    functionName: "TaskService.bulkDeleteTasks",
    metadata: { userId, count: taskIds.length }
  });

  // Optional: add extra business checks if needed
  // e.g. prevent deletion of completed tasks, or log audit, etc.

  const result = await TaskRepository.bulkDelete(userId, taskIds);

  logger.info("Bulk tasks deleted successfully", {
    functionName: "TaskService.bulkDeleteTasks",
    metadata: { userId, deletedCount: result.count }
  });

  return result;
}

  static async handleDragDrop(userId: string, data: DragDropDTO) {
    logger.info("Handling drag drop operation", {
      functionName: "TaskService.handleDragDrop",
      metadata: { userId, ...data }
    })

    // Check if task exists
    const existingTask = await TaskRepository.findById(data.taskId, userId)
    if (!existingTask) {
      throw new AppError("Task not found", 404)
    }

    // Validate time slot
    await this.validateTimeSlot(userId, data.day, data.time, data.duration, data.taskId, data.fixedTimeId)

    // Calculate end time
    const endTime = this.calculateEndTime(data.time, data.duration)

    const task = await TaskRepository.update(data.taskId, userId, {
      day: data.day,
      startTime: data.time,
      endTime,
      duration: data.duration,
      fixedTimeId: data.fixedTimeId
    })

    logger.info("Drag drop handled successfully", {
      functionName: "TaskService.handleDragDrop",
      metadata: { userId, taskId: task.id }
    })

    return task
  }

  static async getTasksByDay(userId: string, day: string) {
    logger.info("Fetching tasks by day", {
      functionName: "TaskService.getTasksByDay",
      metadata: { userId, day }
    })

    const tasks = await TaskRepository.findByDay(userId, day)

    logger.info("Tasks by day fetched successfully", {
      functionName: "TaskService.getTasksByDay",
      metadata: { userId, day, count: tasks.length }
    })

    return tasks
  }

  static async getTasksByGoal(userId: string, goalId: string) {
    logger.info("Fetching tasks by goal", {
      functionName: "TaskService.getTasksByGoal",
      metadata: { userId, goalId }
    })

    // Verify goal exists
    const goal = await GoalRepository.findById(goalId, userId)
    if (!goal) {
      throw new AppError("Goal not found", 404)
    }

    const tasks = await TaskRepository.findByGoal(userId, goalId)

    logger.info("Tasks by goal fetched successfully", {
      functionName: "TaskService.getTasksByGoal",
      metadata: { userId, goalId, count: tasks.length }
    })

    return tasks
  }

  static async getStatistics(userId: string): Promise<TaskStats> {
    logger.info("Fetching task statistics", {
      functionName: "TaskService.getStatistics",
      metadata: { userId }
    })

    const stats = await TaskRepository.getStats(userId)

    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    // Calculate additional stats
    const completedToday = stats.tasks.filter(t => 
      t.isCompleted && t.completedAt && 
      t.completedAt.toISOString().split('T')[0] === todayStr
    ).length

    const upcomingTasks = stats.tasks.filter(t => {
      if (t.isCompleted) return false
      const taskDate = new Date(`${todayStr.split('-')[0]}-${this.getDayMonth(t.day)}`)
      return taskDate >= today
    }).length

    const statsData: TaskStats = {
      total: stats.total,
      completed: stats.completed,
      pending: stats.pending,
      overdue: stats.overdue,
      totalHours: stats.totalHours,
      completedHours: stats.completedHours,
      completedToday,
      upcomingTasks,
      byPriority: stats.byPriority,
      byDay: stats.byDay,
      byGoal: stats.byGoal
    }

    logger.info("Task statistics fetched successfully", {
      functionName: "TaskService.getStatistics",
      metadata: { userId }
    })

    return statsData
  }

  private static async validateTimeSlot(
    userId: string, 
    day: string, 
    startTime: string, 
    duration: number, 
    excludeTaskId: string | null,
    fixedTimeId?: string
  ) {
    // Calculate end time
    const endTime = this.calculateEndTime(startTime, duration)

    // Check for overlapping tasks
    const overlappingTasks = await TaskRepository.findOverlappingTasks(
      userId, 
      day, 
      startTime, 
      endTime, 
      excludeTaskId
    )

    if (overlappingTasks.length > 0) {
      const overlappingTask = overlappingTasks[0]
      throw new AppError(
        `Time slot overlaps with existing task "${overlappingTask.title}"`, 
        409
      )
    }

    // If fixedTimeId is provided, check if time falls within fixed time
    if (fixedTimeId) {
      const fixedTime = await FixedTimeRepository.findById(fixedTimeId, userId)
      if (!fixedTime) {
        throw new AppError("Fixed time not found", 404)
      }

      // Check if this time is within a free period
      const isInFreePeriod = fixedTime.freePeriods?.some(fp => 
        fp.day === day && 
        this.isTimeBetween(startTime, fp.startTime, fp.endTime) &&
        this.isTimeBetween(endTime, fp.startTime, fp.endTime)
      )

      if (!isInFreePeriod) {
        throw new AppError("Task must be scheduled within a free period of the fixed commitment", 400)
      }
    }
  }

  private static calculateEndTime(startTime: string, duration: number): string {
    const [hours, minutes] = startTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }

  private static isTimeBetween(time: string, start: string, end: string): boolean {
    const timeMinutes = this.timeToMinutes(time)
    const startMinutes = this.timeToMinutes(start)
    const endMinutes = this.timeToMinutes(end)
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  private static getDayMonth(day: string): string {
    // Map day to approximate date (for demo purposes)
    const dayMap: Record<string, string> = {
      'Mon': '01-01',
      'Tue': '01-02',
      'Wed': '01-03',
      'Thu': '01-04',
      'Fri': '01-05',
      'Sat': '01-06',
      'Sun': '01-07'
    }
    return dayMap[day] || '01-01'
  }

  private static async updateGoalProgress(goalId: string, taskDuration: number) {
    try {
      const goal = await GoalRepository.findById(goalId, "system") // Using system context
      if (!goal) return

      const hours = taskDuration / 60
      const newCompletedHours = Math.min(goal.totalHours, goal.completedHours + hours)
      const progress = goal.totalHours > 0 ? (newCompletedHours / goal.totalHours) * 100 : 0

      await GoalRepository.update(goalId, goal.userId, {
        completedHours: newCompletedHours,
        progress: Math.round(progress),
        ...(progress >= 100 && { status: 'COMPLETED', completedAt: new Date() })
      })
    } catch (error) {
      logger.error("Failed to update goal progress", {
        functionName: "TaskService.updateGoalProgress",
        error: error instanceof Error ? error.message : 'Unknown error',
        goalId
      })
    }
  }



//   // Additional methods for fetching tasks by milestone, fixed time, etc.
//   // Add this method to TaskService class

// private static async validateNoSleepConflict(
//   userId: string, 
//   day: string, 
//   startTime: string, 
//   endTime: string, 
//   excludeTaskId: string | null
// ) {
//   // Check if auto-lock sleep is enabled (you might want to store this setting in user preferences)
//   const autoLockSleep = true // TODO: Get from user settings
  
//   if (!autoLockSleep) {
//     return
//   }
  
//   const conflictingSleepTasks = await TaskRepository.findConflictingWithSleep(
//     userId,
//     day,
//     startTime,
//     endTime,
//     excludeTaskId
//   )
  
//   if (conflictingSleepTasks.length > 0) {
//     const sleepTask = conflictingSleepTasks[0]
//     throw new AppError(
//       `Cannot schedule task during sleep time (${sleepTask.startTime} - ${sleepTask.endTime}). Please adjust your sleep schedule or disable auto-lock.`,
//       409
//     )
//   }
// }

// // Then call this method in validateTimeSlot:
// private static async validateTimeSlot1(
//   userId: string, 
//   day: string, 
//   startTime: string, 
//   duration: number, 
//   excludeTaskId: string | null,
//   fixedTimeId?: string
// ) {
//   // Calculate end time
//   const endTime = this.calculateEndTime(startTime, duration)

//   // Check for overlapping tasks
//   const overlappingTasks = await TaskRepository.findOverlappingTasks(
//     userId, 
//     day, 
//     startTime, 
//     endTime, 
//     excludeTaskId
//   )

//   if (overlappingTasks.length > 0) {
//     const overlappingTask = overlappingTasks[0]
//     throw new AppError(
//       `Time slot overlaps with existing task "${overlappingTask.title}"`, 
//       409
//     )
//   }

//   // Check for sleep conflicts
//   await this.validateNoSleepConflict(userId, day, startTime, endTime, excludeTaskId)

//   // If fixedTimeId is provided, check if time falls within fixed time
//   if (fixedTimeId) {
//     const fixedTime = await FixedTimeRepository.findById(fixedTimeId, userId)
//     if (!fixedTime) {
//       throw new AppError("Fixed time not found", 404)
//     }

//     // Check if this time is within a free period
//     const isInFreePeriod = fixedTime.freePeriods?.some(fp => 
//       fp.day === day && 
//       this.isTimeBetween(startTime, fp.startTime, fp.endTime) &&
//       this.isTimeBetween(endTime, fp.startTime, fp.endTime)
//     )

//     if (!isInFreePeriod) {
//       throw new AppError("Task must be scheduled within a free period of the fixed commitment", 400)
//     }
//   }
// }









}