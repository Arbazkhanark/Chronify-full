
// src/modules/timetable/timetable.controller.ts
import { Request, Response } from 'express'
import { TimetableService } from './timetable.service'
import {
  getTimetableSchema,
  smartDelayRequestSchema,
  applySmartDelaySchema,
  taskFeedbackSchema,
  updateTaskStatusSchema,
  simpleDelaySchema,
  rescheduleToFreePeriodSchema,
  bulkCompleteTasksSchema,
  bulkDelayTasksSchema,
  timetableStatsSchema,
  lockTimetableSchema,
  resetTimetableSchema,
  timetableFilterSchema, // Make sure this is imported
} from './timetable.validation'
import { AuthRequest } from '../../middlewares/auth.middleware'
import { AppError } from '../../utils/AppError'
import { logger } from 'patal-log'
import { ApplySmartDelayDTO, GetTimetableDTO, UpdateTaskStatusDTO } from './timetable.types'

export class TimetableController {
  
  // ==================== 📅 TIMETABLE VIEWS ====================
  
  /**
   * Get timetable for today or specific day
   */
  static async getTimetable(req: AuthRequest, res: Response) {
    try {
      const query = getTimetableSchema.parse(req.query)
      const userId = req.user!.id

      logger.info('Get timetable API called', {
        functionName: 'TimetableController.getTimetable',
        metadata: { userId, day: query.day || 'today' }
      })

      const timetable = await TimetableService.getTimetable(userId, query as GetTimetableDTO)

      res.status(200).json({
        success: true,
        data: timetable
      })
    } catch (err: any) {
      logger.error(`Get timetable failed: ${err.message}`, {
        functionName: 'TimetableController.getTimetable',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }
  
  /**
   * Get full timetable with all slots (sleep, fixed, free, tasks)
   * GET /api/v1/timetable/full?day=MONDAY
   */
  static async getFullTimetable(req: AuthRequest, res: Response) {
    try {
      // First, check if timetableFilterSchema exists
      if (!timetableFilterSchema) {
        throw new Error('timetableFilterSchema is not defined in validation');
      }
      
      const filters = timetableFilterSchema.parse(req.query);
      const userId = req.user!.id;

      logger.info("Get full timetable API called", {
        functionName: "TimetableController.getFullTimetable",
        metadata: { userId, filters }
      });

      const timetable = await TimetableService.getFullTimetable(userId, filters);

      logger.info("Full timetable fetched successfully", {
        functionName: "TimetableController.getFullTimetable",
        metadata: { userId, daysCount: timetable.length }
      });

      res.status(200).json({
        success: true,
        data: timetable,
      });
    } catch (err: any) {
      logger.error(`Get full timetable failed: ${err.message}`, {
        functionName: "TimetableController.getFullTimetable",
        metadata: { error: err.message, stack: err.stack }
      });

      if (err.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: err.errors
        });
      }

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get tasks for a specific day
   */
  static async getTasksByDay(req: AuthRequest, res: Response) {
    try {
      const { day } = req.params
      const userId = req.user!.id

      logger.info('Get tasks by day API called', {
        functionName: 'TimetableController.getTasksByDay',
        metadata: { userId, day }
      })

      const tasks = await TimetableService.getTasksByDay(userId, day as string)

      res.status(200).json({
        success: true,
        data: tasks
      })
    } catch (err: any) {
      logger.error(`Get tasks by day failed: ${err.message}`, {
        functionName: 'TimetableController.getTasksByDay',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Get active tasks (currently running)
   */
  static async getActiveTasks(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id

      logger.info('Get active tasks API called', {
        functionName: 'TimetableController.getActiveTasks',
        metadata: { userId }
      })

      const tasks = await TimetableService.getActiveTasks(userId)

      res.status(200).json({
        success: true,
        data: tasks
      })
    } catch (err: any) {
      logger.error(`Get active tasks failed: ${err.message}`, {
        functionName: 'TimetableController.getActiveTasks',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Get upcoming tasks
   */
  static async getUpcomingTasks(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id
      const { limit = 10 } = req.query

      logger.info('Get upcoming tasks API called', {
        functionName: 'TimetableController.getUpcomingTasks',
        metadata: { userId, limit }
      })

      const tasks = await TimetableService.getUpcomingTasks(userId, Number(limit))

      res.status(200).json({
        success: true,
        data: tasks
      })
    } catch (err: any) {
      logger.error(`Get upcoming tasks failed: ${err.message}`, {
        functionName: 'TimetableController.getUpcomingTasks',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Get today's bedtime from sleep schedule
   */
  static async getTodayBedtime(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id

      logger.info('Get today bedtime API called', {
        functionName: 'TimetableController.getTodayBedtime',
        metadata: { userId }
      })

      const bedtime = await TimetableService.getTodayBedtime(userId)

      res.status(200).json({
        success: true,
        data: bedtime
      })
    } catch (err: any) {
      logger.error(`Get today bedtime failed: ${err.message}`, {
        functionName: 'TimetableController.getTodayBedtime',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  // ==================== ⏰ TASK ACTIONS ====================

  /**
   * Start a task
   */
  static async startTask(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params
      const userId = req.user!.id

      logger.info('Start task API called', {
        functionName: 'TimetableController.startTask',
        metadata: { userId, taskId }
      })

      const task = await TimetableService.startTask(userId, taskId as string)

      res.status(200).json({
        success: true,
        message: 'Task started successfully',
        data: task
      })
    } catch (err: any) {
      logger.error(`Start task failed: ${err.message}`, {
        functionName: 'TimetableController.startTask',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Complete a task with feedback
   */
  static async completeTask(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params
      const feedback = taskFeedbackSchema.parse({ ...req.body, taskId })
      const userId = req.user!.id

      logger.info('Complete task API called', {
        functionName: 'TimetableController.completeTask',
        metadata: { userId, taskId, focusLevel: feedback.focusLevel }
      })

      const result = await TimetableService.completeTask(userId, feedback)

      res.status(200).json({
        success: true,
        message: 'Task completed successfully',
        data: result
      })
    } catch (err: any) {
      logger.error(`Complete task failed: ${err.message}`, {
        functionName: 'TimetableController.completeTask',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Skip a task
   */
  static async skipTask(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params
      const { notes } = req.body
      const userId = req.user!.id

      logger.info('Skip task API called', {
        functionName: 'TimetableController.skipTask',
        metadata: { userId, taskId }
      })

      const task = await TimetableService.skipTask(userId, taskId as string, notes)

      res.status(200).json({
        success: true,
        message: 'Task skipped successfully',
        data: task
      })
    } catch (err: any) {
      logger.error(`Skip task failed: ${err.message}`, {
        functionName: 'TimetableController.skipTask',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Mark task as missed
   */
  static async markAsMissed(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params
      const { notes } = req.body
      const userId = req.user!.id

      logger.info('Mark as missed API called', {
        functionName: 'TimetableController.markAsMissed',
        metadata: { userId, taskId }
      })

      const task = await TimetableService.markAsMissed(userId, taskId as string, notes)

      res.status(200).json({
        success: true,
        message: 'Task marked as missed',
        data: task
      })
    } catch (err: any) {
      logger.error(`Mark as missed failed: ${err.message}`, {
        functionName: 'TimetableController.markAsMissed',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Update task status (generic)
   */
  static async updateTaskStatus(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params
      const payload = updateTaskStatusSchema.parse({ ...req.body, taskId })
      const userId = req.user!.id

      logger.info('Update task status API called', {
        functionName: 'TimetableController.updateTaskStatus',
        metadata: { userId, taskId, newStatus: payload.status }
      })

      const task = await TimetableService.updateTaskStatus(userId, payload as UpdateTaskStatusDTO)

      res.status(200).json({
        success: true,
        message: `Task status updated to ${payload.status}`,
        data: task
      })
    } catch (err: any) {
      logger.error(`Update task status failed: ${err.message}`, {
        functionName: 'TimetableController.updateTaskStatus',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  // ==================== 🎯 SMART DELAY ====================

  /**
   * Get smart delay options for a task
   */
  static async getSmartDelayOptions(req: AuthRequest, res: Response) {
    try {
      const payload = smartDelayRequestSchema.parse(req.body)
      const userId = req.user!.id

      logger.info('Get smart delay options API called', {
        functionName: 'TimetableController.getSmartDelayOptions',
        metadata: { userId, taskId: payload.taskId }
      })

      const options = await TimetableService.getSmartDelayOptions(userId, payload)

      res.status(200).json({
        success: true,
        data: options
      })
    } catch (err: any) {
      logger.error(`Get smart delay options failed: ${err.message}`, {
        functionName: 'TimetableController.getSmartDelayOptions',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Apply smart delay
   */
  static async applySmartDelay(req: AuthRequest, res: Response) {
    try {
      const payload = applySmartDelaySchema.parse(req.body)
      const userId = req.user!.id

      logger.info('Apply smart delay API called', {
        functionName: 'TimetableController.applySmartDelay',
        metadata: { userId, taskId: payload.taskId, day: payload.day, time: payload.startTime }
      })

      const task = await TimetableService.applySmartDelay(userId, payload as ApplySmartDelayDTO)

      res.status(200).json({
        success: true,
        message: 'Task delayed successfully',
        data: task
      })
    } catch (err: any) {
      logger.error(`Apply smart delay failed: ${err.message}`, {
        functionName: 'TimetableController.applySmartDelay',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Simple delay (backward compatibility)
   */
  static async simpleDelay(req: AuthRequest, res: Response) {
    try {
      const payload = simpleDelaySchema.parse(req.body)
      const userId = req.user!.id

      logger.info('Simple delay API called', {
        functionName: 'TimetableController.simpleDelay',
        metadata: { userId, taskId: payload.taskId, minutes: payload.minutes }
      })

      const task = await TimetableService.simpleDelay(userId, payload)

      res.status(200).json({
        success: true,
        message: `Task delayed by ${payload.minutes} minutes`,
        data: task
      })
    } catch (err: any) {
      logger.error(`Simple delay failed: ${err.message}`, {
        functionName: 'TimetableController.simpleDelay',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Reschedule missed task to free period
   */
  static async rescheduleToFreePeriod(req: AuthRequest, res: Response) {
    try {
      const payload = rescheduleToFreePeriodSchema.parse(req.body)
      const userId = req.user!.id

      logger.info('Reschedule to free period API called', {
        functionName: 'TimetableController.rescheduleToFreePeriod',
        metadata: { userId, taskId: payload.taskId }
      })

      const task = await TimetableService.rescheduleToFreePeriod(userId, payload)

      res.status(200).json({
        success: true,
        message: 'Task rescheduled to free period',
        data: task
      })
    } catch (err: any) {
      logger.error(`Reschedule to free period failed: ${err.message}`, {
        functionName: 'TimetableController.rescheduleToFreePeriod',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  // ==================== 📝 TASK FEEDBACK ====================

  /**
   * Submit task feedback
   */
  static async submitTaskFeedback(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params
      const payload = taskFeedbackSchema.parse({ ...req.body, taskId })
      const userId = req.user!.id

      logger.info('Submit task feedback API called', {
        functionName: 'TimetableController.submitTaskFeedback',
        metadata: { userId, taskId, focusLevel: payload.focusLevel }
      })

      const feedback = await TimetableService.submitTaskFeedback(userId, payload)

      res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        data: feedback
      })
    } catch (err: any) {
      logger.error(`Submit task feedback failed: ${err.message}`, {
        functionName: 'TimetableController.submitTaskFeedback',
        error: err.message,
        metadata:{
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Get task feedback
   */
  static async getTaskFeedback(req: AuthRequest, res: Response) {
    try {
      const { taskId } = req.params
      const userId = req.user!.id

      logger.info('Get task feedback API called', {
        functionName: 'TimetableController.getTaskFeedback',
        metadata: { userId, taskId }
      })

      const feedback = await TimetableService.getTaskFeedback(userId, taskId as string)

      res.status(200).json({
        success: true,
        data: feedback
      })
    } catch (err: any) {
      logger.error(`Get task feedback failed: ${err.message}`, {
        functionName: 'TimetableController.getTaskFeedback',
        metadata:{
            error: err.message,
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  // ==================== ⚡ GRACE PERIOD ====================

  /**
   * Get tasks in grace period (ended within last 1 hour)
   */
  static async getGracePeriodTasks(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id

      logger.info('Get grace period tasks API called', {
        functionName: 'TimetableController.getGracePeriodTasks',
        metadata: { userId }
      })

      const tasks = await TimetableService.getGracePeriodTasks(userId)

      res.status(200).json({
        success: true,
        data: tasks
      })
    } catch (err: any) {
      logger.error(`Get grace period tasks failed: ${err.message}`, {
        functionName: 'TimetableController.getGracePeriodTasks',
        metadata:{
            error: err.message,
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Get missed tasks (can still complete today)
   */
  static async getMissedTasks(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id

      logger.info('Get missed tasks API called', {
        functionName: 'TimetableController.getMissedTasks',
        metadata: { userId }
      })

      const tasks = await TimetableService.getMissedTasks(userId)

      res.status(200).json({
        success: true,
        data: tasks
      })
    } catch (err: any) {
      logger.error(`Get missed tasks failed: ${err.message}`, {
        functionName: 'TimetableController.getMissedTasks',
        metadata:{
            error: err.message,
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  // ==================== 📊 STATISTICS ====================

  /**
   * Get timetable statistics
   */
  static async getStatistics(req: AuthRequest, res: Response) {
    try {
      const query = timetableStatsSchema.parse(req.query)
      const userId = req.user!.id

      logger.info('Get timetable statistics API called', {
        functionName: 'TimetableController.getStatistics',
        metadata: { userId, weeks: query.weeks }
      })

      const stats = await TimetableService.getStatistics(userId, query)

      res.status(200).json({
        success: true,
        data: stats
      })
    } catch (err: any) {
      logger.error(`Get timetable statistics failed: ${err.message}`, {
        functionName: 'TimetableController.getStatistics',
        metadata:{
            error: err.message,
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  // ==================== 📦 BULK OPERATIONS ====================

  /**
   * Complete multiple tasks at once
   */
  static async bulkCompleteTasks(req: AuthRequest, res: Response) {
    try {
      const payload = bulkCompleteTasksSchema.parse(req.body)
      const userId = req.user!.id

      logger.info('Bulk complete tasks API called', {
        functionName: 'TimetableController.bulkCompleteTasks',
        metadata: { userId, count: payload.taskIds.length }
      })

      const result = await TimetableService.bulkCompleteTasks(userId, payload)

      res.status(200).json({
        success: true,
        message: `${result.completed} tasks completed successfully`,
        data: result
      })
    } catch (err: any) {
      logger.error(`Bulk complete tasks failed: ${err.message}`, {
        functionName: 'TimetableController.bulkCompleteTasks',
        metadata:{
            error: err.message,
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }

  /**
   * Delay multiple tasks at once
   */
  static async bulkDelayTasks(req: AuthRequest, res: Response) {
    try {
      const payload = bulkDelayTasksSchema.parse(req.body)
      const userId = req.user!.id

      logger.info('Bulk delay tasks API called', {
        functionName: 'TimetableController.bulkDelayTasks',
        metadata: { userId, count: payload.taskIds.length, minutes: payload.minutes }
      })

      const result = await TimetableService.bulkDelayTasks(userId, payload)

      res.status(200).json({
        success: true,
        message: `${result.delayed} tasks delayed by ${payload.minutes} minutes`,
        data: result
      })
    } catch (err: any) {
      logger.error(`Bulk delay tasks failed: ${err.message}`, {
        functionName: 'TimetableController.bulkDelayTasks',
        metadata:{
            error: err.message,
            stack: err.stack
        }
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
      }

      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }


  /**
   * Lock the Time Table
   */
  static async lockTimetable(req: AuthRequest, res: Response) {
    try {
      const payload = lockTimetableSchema.parse(req.body);
      const userId = req.user!.id;

      logger.info("Locking user timetable", {
        functionName: "TimetableController.lockTimetable",
        metadata: { userId, fixedTimes: payload.fixedTimes.length, tasks: payload.tasks.length }
      });

      const result = await TimetableService.lockTimetable(userId, payload);

      res.status(201).json({
        success: true,
        message: "Timetable locked successfully for this week!",
        data: {
          fixedTimesCreated: result.fixedTimes.length,
          sleepSchedulesCreated: result.sleepSchedules.length,
          tasksCreated: result.tasks.length,
          totalItems: result.fixedTimes.length + result.sleepSchedules.length + result.tasks.length
        }
      });
    } catch (err: any) {
      logger.error("Lock timetable failed", { error: err.message, stack: err.stack });

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to lock timetable. Please try again."
      });
    }
  }

  // ==================== 🗑️ RESET TIMETABLE ====================

  /**
   * Reset/clear entire user timetable
   * DELETE /api/v1/timetable/reset
   */
  static async resetTimetable(req: AuthRequest, res: Response) {
    try {
      const payload = resetTimetableSchema.parse(req.body);
      const userId = req.user!.id;

      logger.warn("Reset timetable requested - DANGEROUS OPERATION", {
        functionName: "TimetableController.resetTimetable",
        metadata: { 
          userId, 
          resetTasks: payload.resetTasks,
          resetFixedTimes: payload.resetFixedTimes,
          resetSleepSchedules: payload.resetSleepSchedules,
          confirm: payload.confirm
        }
      });

      // Optional: Require confirmation flag for safety
      if (!payload.confirm) {
        return res.status(400).json({
          success: false,
          message: "Please set confirm: true to reset timetable. This action cannot be undone."
        });
      }

      const result = await TimetableService.resetTimetable(userId, {
        resetTasks: payload.resetTasks,
        resetFixedTimes: payload.resetFixedTimes,
        resetSleepSchedules: payload.resetSleepSchedules
      });

      logger.info("Timetable reset successfully", {
        functionName: "TimetableController.resetTimetable",
        metadata: {
          userId,
          deleted: {
            tasks: result.deletedTasks,
            fixedTimes: result.deletedFixedTimes,
            sleepSchedules: result.deletedSleepSchedules,
            freePeriods: result.deletedFreePeriods
          }
        }
      });

      res.status(200).json({
        success: true,
        message: "Timetable reset successfully",
        data: result
      });
    } catch (err: any) {
      logger.error("Reset timetable failed", {
        functionName: "TimetableController.resetTimetable",
        metadata: { error: err.message, stack: err.stack }
      });

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to reset timetable"
      });
    }
  }
}