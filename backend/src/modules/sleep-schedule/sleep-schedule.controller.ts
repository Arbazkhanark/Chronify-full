// src/modules/sleep-schedule/sleep-schedule.controller.ts

import { Request, Response } from "express"
import { SleepScheduleService } from "./sleep-schedule.service"
import {
  createSleepScheduleSchema,
  updateSleepScheduleSchema,
  bulkSleepScheduleSchema,
  applyToAllSchema,
  sleepFilterSchema,
  sleepStatsQuerySchema,
  bulkUpdateSleepScheduleSchema,
  bulkDeleteSleepScheduleSchema,
} from "./sleep-schedule.validation"
import { AuthRequest } from "../../middlewares/auth.middleware"
import { AppError } from "../../utils/AppError"
import { logger } from "patal-log"

export class SleepScheduleController {
  // Create sleep schedule
  static async createSleepSchedule1(req: AuthRequest, res: Response) {
    try {
      const payload = createSleepScheduleSchema.parse(req.body)
      const userId = req.user!.id

      console.log("User ID:", userId,"User:")

      logger.info("Create sleep schedule API called", {
        functionName: "SleepScheduleController.createSleepSchedule",
        metadata: { userId, day: payload.day }
      })

      const schedule = await SleepScheduleService.createSleepSchedule(userId, payload)

      logger.info("Sleep schedule created successfully", {
        functionName: "SleepScheduleController.createSleepSchedule",
        metadata: { userId, scheduleId: schedule.id, day: schedule.day }
      })

      res.status(201).json({
        success: true,
        message: "Sleep schedule created successfully",
        data: schedule,
      })
    } catch (err: any) {
      logger.error(`Create sleep schedule failed: ${err.message}`, {
        functionName: "SleepScheduleController.createSleepSchedule",
        metadata:{
          error: err.message,
          stack: err.stack,
        }
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }


  static async createSleepSchedule(req: AuthRequest, res: Response) {
  try {
    const payload = createSleepScheduleSchema.parse(req.body)
    const userId = req.user!.id

    console.log("User ID:", userId, "Creating sleep schedule for:", payload.day)

    logger.info("Create sleep schedule API called", {
      functionName: "SleepScheduleController.createSleepSchedule",
      metadata: { userId, day: payload.day }
    })

    const schedule = await SleepScheduleService.createSleepSchedule(userId, payload)

    logger.info("Sleep schedule created successfully", {
      functionName: "SleepScheduleController.createSleepSchedule",
      metadata: { userId, scheduleId: schedule.id, day: schedule.day }
    })

    res.status(201).json({
      success: true,
      message: "Sleep schedule created successfully",
      data: schedule,
    })
  } catch (err: any) {
    logger.error(`Create sleep schedule failed: ${err.message}`, {
      functionName: "SleepScheduleController.createSleepSchedule",
      metadata: {
        error: err.message,
        stack: err.stack,
        conflicts: err.data?.conflicts,
        alternatives: err.data?.alternatives
      }
    })

    if (err instanceof AppError) {
      // 🔥 Send detailed error response for conflicts
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        conflicts: err.data?.conflicts,
        alternativeSlots: err.data?.alternatives
      })
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

  // Bulk create/update sleep schedules
  static async bulkCreateSleepSchedules(req: AuthRequest, res: Response) {
    try {
      const payload = bulkSleepScheduleSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Bulk create sleep schedules API called", {
        functionName: "SleepScheduleController.bulkCreateSleepSchedules",
        metadata: { userId, count: payload.schedules.length }
      })

      const schedules = await SleepScheduleService.bulkCreateSleepSchedules(userId, payload.schedules)

      logger.info("Sleep schedules bulk created successfully", {
        functionName: "SleepScheduleController.bulkCreateSleepSchedules",
        metadata: { userId, count: schedules.length }
      })

      res.status(201).json({
        success: true,
        message: `${schedules.length} sleep schedules created successfully`,
        data: schedules,
      })
    } catch (err: any) {
      logger.error(`Bulk create sleep schedules failed: ${err.message}`, {
        functionName: "SleepScheduleController.bulkCreateSleepSchedules",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }


  // Bulk update sleep schedules
static async bulkUpdateSleepSchedules(req: AuthRequest, res: Response) {
  try {
    const payload = bulkUpdateSleepScheduleSchema.parse(req.body);
    const userId = req.user!.id;

    logger.info("Bulk update sleep schedules API called", {
      functionName: "SleepScheduleController.bulkUpdateSleepSchedules",
      metadata: { userId, count: payload.updates.length }
    });

    const updatedSchedules = await SleepScheduleService.bulkUpdateSleepSchedules(
      userId,
      payload.updates
    );

    logger.info("Sleep schedules bulk updated successfully", {
      functionName: "SleepScheduleController.bulkUpdateSleepSchedules",
      metadata: { userId, count: updatedSchedules.length }
    });

    res.status(200).json({
      success: true,
      message: `${updatedSchedules.length} sleep schedules updated successfully`,
      data: updatedSchedules,
    });
  } catch (err: any) {
    logger.error(`Bulk update sleep schedules failed: ${err.message}`, {
      functionName: "SleepScheduleController.bulkUpdateSleepSchedules",
      metadata: { error: err.message, stack: err.stack }
    });

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(err.data && { data: err.data })
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Bulk delete sleep schedules
static async bulkDeleteSleepSchedules(req: AuthRequest, res: Response) {
  try {
    const payload = bulkDeleteSleepScheduleSchema.parse(req.body);
    const userId = req.user!.id;

    logger.info("Bulk delete sleep schedules API called", {
      functionName: "SleepScheduleController.bulkDeleteSleepSchedules",
      metadata: { userId, count: payload.scheduleIds.length }
    });

    const result = await SleepScheduleService.bulkDeleteSleepSchedules(
      userId,
      payload.scheduleIds
    );

    logger.info("Sleep schedules bulk deleted successfully", {
      functionName: "SleepScheduleController.bulkDeleteSleepSchedules",
      metadata: { userId, deletedCount: result.count }
    });

    res.status(200).json({
      success: true,
      message: `${result.count} sleep schedules deleted successfully`,
      data: {
        deletedCount: result.count,
        deletedIds: payload.scheduleIds
      }
    });
  } catch (err: any) {
    logger.error(`Bulk delete sleep schedules failed: ${err.message}`, {
      functionName: "SleepScheduleController.bulkDeleteSleepSchedules",
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
      message: "Internal server error",
    });
  }
}




  // Get sleep schedule by ID
  static async getSleepSchedule(req: AuthRequest, res: Response) {
    try {
      let { scheduleId } = req.params
      const userId = req.user!.id

      if (Array.isArray(scheduleId)) {
        scheduleId = scheduleId[0]
      }

      logger.info("Get sleep schedule API called", {
        functionName: "SleepScheduleController.getSleepSchedule",
        metadata: { userId, scheduleId }
      })

      const schedule = await SleepScheduleService.getSleepSchedule(userId, scheduleId)

      logger.info("Sleep schedule fetched successfully", {
        functionName: "SleepScheduleController.getSleepSchedule",
        metadata: { userId, scheduleId }
      })

      res.status(200).json({
        success: true,
        data: schedule,
      })
    } catch (err: any) {
      logger.error(`Get sleep schedule failed: ${err.message}`, {
        functionName: "SleepScheduleController.getSleepSchedule",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  // Get sleep schedule by day
  static async getSleepScheduleByDay(req: AuthRequest, res: Response) {
    try {
      const { day } = req.params
      const userId = req.user!.id

      logger.info("Get sleep schedule by day API called", {
        functionName: "SleepScheduleController.getSleepScheduleByDay",
        metadata: { userId, day }
      })

      const schedule = await SleepScheduleService.getSleepScheduleByDay(userId, day as string)

      logger.info("Sleep schedule by day fetched successfully", {
        functionName: "SleepScheduleController.getSleepScheduleByDay",
        metadata: { userId, day }
      })

      res.status(200).json({
        success: true,
        data: schedule,
      })
    } catch (err: any) {
      logger.error(`Get sleep schedule by day failed: ${err.message}`, {
        functionName: "SleepScheduleController.getSleepScheduleByDay",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  // Get all sleep schedules
  static async getSleepSchedules(req: AuthRequest, res: Response) {
    console.log("Get sleep schedules API called with query:", req.query)
    try {
      const filters = sleepFilterSchema.parse(req.query)
      const userId = req.user!.id

      logger.info("Get sleep schedules API called", {
        functionName: "SleepScheduleController.getSleepSchedules",
        metadata: { userId, filters }
      })

      const schedules = await SleepScheduleService.getSleepSchedules(userId, filters)

      logger.info("Sleep schedules fetched successfully", {
        functionName: "SleepScheduleController.getSleepSchedules",
        metadata: { userId, count: schedules.length }
      })

      res.status(200).json({
        success: true,
        data: schedules,
      })
    } catch (err: any) {
      logger.error(`Get sleep schedules failed: ${err.message}`, {
        functionName: "SleepScheduleController.getSleepSchedules",
        metadata:{
          error: err.message,
          stack: err.stack,
        }
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  // Update sleep schedule
  static async updateSleepSchedule(req: AuthRequest, res: Response) {
    try {
      const { scheduleId } = req.params
      const payload = updateSleepScheduleSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Update sleep schedule API called", {
        functionName: "SleepScheduleController.updateSleepSchedule",
        metadata: { userId, scheduleId }
      })

      const schedule = await SleepScheduleService.updateSleepSchedule(userId, scheduleId, payload)

      logger.info("Sleep schedule updated successfully", {
        functionName: "SleepScheduleController.updateSleepSchedule",
        metadata: { userId, scheduleId }
      })

      res.status(200).json({
        success: true,
        message: "Sleep schedule updated successfully",
        data: schedule,
      })
    } catch (err: any) {
      logger.error(`Update sleep schedule failed: ${err.message}`, {
        functionName: "SleepScheduleController.updateSleepSchedule",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  // Update sleep schedule by day
  static async updateSleepScheduleByDay(req: AuthRequest, res: Response) {
    try {
      const { day } = req.params
      const payload = updateSleepScheduleSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Update sleep schedule by day API called", {
        functionName: "SleepScheduleController.updateSleepScheduleByDay",
        metadata: { userId, day }
      })

      const schedule = await SleepScheduleService.updateSleepScheduleByDay(userId, day, payload)

      logger.info("Sleep schedule by day updated successfully", {
        functionName: "SleepScheduleController.updateSleepScheduleByDay",
        metadata: { userId, day }
      })

      res.status(200).json({
        success: true,
        message: `Sleep schedule for ${day} updated successfully`,
        data: schedule,
      })
    } catch (err: any) {
      logger.error(`Update sleep schedule by day failed: ${err.message}`, {
        functionName: "SleepScheduleController.updateSleepScheduleByDay",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  // Delete sleep schedule
  static async deleteSleepSchedule(req: AuthRequest, res: Response) {
    try {
      const { scheduleId } = req.params
      const userId = req.user!.id

      logger.info("Delete sleep schedule API called", {
        functionName: "SleepScheduleController.deleteSleepSchedule",
        metadata: { userId, scheduleId }
      })

      await SleepScheduleService.deleteSleepSchedule(userId, scheduleId)

      logger.info("Sleep schedule deleted successfully", {
        functionName: "SleepScheduleController.deleteSleepSchedule",
        metadata: { userId, scheduleId }
      })

      res.status(200).json({
        success: true,
        message: "Sleep schedule deleted successfully",
      })
    } catch (err: any) {
      logger.error(`Delete sleep schedule failed: ${err.message}`, {
        functionName: "SleepScheduleController.deleteSleepSchedule",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  // Delete sleep schedule by day
  static async deleteSleepScheduleByDay(req: AuthRequest, res: Response) {
    try {
      const { day } = req.params
      const userId = req.user!.id

      logger.info("Delete sleep schedule by day API called", {
        functionName: "SleepScheduleController.deleteSleepScheduleByDay",
        metadata: { userId, day }
      })

      await SleepScheduleService.deleteSleepScheduleByDay(userId, day)

      logger.info("Sleep schedule by day deleted successfully", {
        functionName: "SleepScheduleController.deleteSleepScheduleByDay",
        metadata: { userId, day }
      })

      res.status(200).json({
        success: true,
        message: `Sleep schedule for ${day} deleted successfully`,
      })
    } catch (err: any) {
      logger.error(`Delete sleep schedule by day failed: ${err.message}`, {
        functionName: "SleepScheduleController.deleteSleepScheduleByDay",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  // Toggle sleep schedule active status
  static async toggleSleepSchedule(req: AuthRequest, res: Response) {
    try {
      const { scheduleId } = req.params
      const { isActive } = req.body
      const userId = req.user!.id

      if (typeof isActive !== 'boolean') {
        throw new AppError("isActive must be a boolean", 400)
      }

      logger.info("Toggle sleep schedule API called", {
        functionName: "SleepScheduleController.toggleSleepSchedule",
        metadata: { userId, scheduleId, isActive }
      })

      const schedule = await SleepScheduleService.toggleSleepSchedule(userId, scheduleId, isActive)

      logger.info("Sleep schedule toggled successfully", {
        functionName: "SleepScheduleController.toggleSleepSchedule",
        metadata: { userId, scheduleId, isActive }
      })

      res.status(200).json({
        success: true,
        message: `Sleep schedule ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: schedule,
      })
    } catch (err: any) {
      logger.error(`Toggle sleep schedule failed: ${err.message}`, {
        functionName: "SleepScheduleController.toggleSleepSchedule",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  // Apply schedule to all days
  static async applyToAllDays(req: AuthRequest, res: Response) {
    try {
      const payload = applyToAllSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Apply to all days API called", {
        functionName: "SleepScheduleController.applyToAllDays",
        metadata: { userId, bedtime: payload.bedtime, wakeTime: payload.wakeTime }
      })

      const schedules = await SleepScheduleService.applyToAllDays(userId, payload)

      logger.info("Applied schedule to all days successfully", {
        functionName: "SleepScheduleController.applyToAllDays",
        metadata: { userId, count: schedules.length }
      })

      res.status(200).json({
        success: true,
        message: "Sleep schedule applied to all days successfully",
        data: schedules,
      })
    } catch (err: any) {
      logger.error(`Apply to all days failed: ${err.message}`, {
        functionName: "SleepScheduleController.applyToAllDays",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  // Get sleep statistics
  static async getSleepStatistics(req: AuthRequest, res: Response) {
    try {
      const query = sleepStatsQuerySchema.parse(req.query)
      const userId = req.user!.id

      logger.info("Get sleep statistics API called", {
        functionName: "SleepScheduleController.getSleepStatistics",
        metadata: { userId, weeks: query.weeks }
      })

      const stats = await SleepScheduleService.getSleepStatistics(userId, query.weeks)

      logger.info("Sleep statistics fetched successfully", {
        functionName: "SleepScheduleController.getSleepStatistics",
        metadata: { userId }
      })

      res.status(200).json({
        success: true,
        data: stats,
      })
    } catch (err: any) {
      logger.error(`Get sleep statistics failed: ${err.message}`, {
        functionName: "SleepScheduleController.getSleepStatistics",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  // Regenerate all sleep tasks
  static async regenerateSleepTasks(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id

      logger.info("Regenerate sleep tasks API called", {
        functionName: "SleepScheduleController.regenerateSleepTasks",
        metadata: { userId }
      })

      await SleepScheduleService.regenerateAllSleepTasks(userId)

      logger.info("Sleep tasks regenerated successfully", {
        functionName: "SleepScheduleController.regenerateSleepTasks",
        metadata: { userId }
      })

      res.status(200).json({
        success: true,
        message: "Sleep tasks regenerated successfully",
      })
    } catch (err: any) {
      logger.error(`Regenerate sleep tasks failed: ${err.message}`, {
        functionName: "SleepScheduleController.regenerateSleepTasks",
        error: err.message,
        stack: err.stack,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }
}