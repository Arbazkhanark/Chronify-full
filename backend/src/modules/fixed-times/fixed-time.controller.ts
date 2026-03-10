// src/modules/fixed-times/fixed-time.controller.ts
import { Request, Response } from "express"
import { FixedTimeService } from "./fixed-time.service"
import {
  createFixedTimeSchema,
  updateFixedTimeSchema,
  createFreePeriodSchema,
  updateFreePeriodSchema,
  bulkDeleteFixedTimeSchema,
  bulkUpdateFixedTimeSchema,
  bulkCreateFixedTimeSchema,
  bulkDeleteFreePeriodSchema,
  bulkUpdateFreePeriodSchema,
  bulkCreateFreePeriodSchema,
  bulkAddFreePeriodsToMultipleSchema,
  bulkAddMultipleFreePeriodsSchema,
  getFreePeriodsQuerySchema,
} from "./fixed-time.validation"
import { AuthRequest } from "../../middlewares/auth.middleware"
import { AppError } from "../../utils/AppError"
import { logger } from "patal-log"

export class FixedTimeController {
  static async createFixedTime(req: AuthRequest, res: Response) {
    try {
      const payload = createFixedTimeSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Create fixed time API called", {
        functionName: "FixedTimeController.createFixedTime",
        metadata: { userId }
      })

      const fixedTime = await FixedTimeService.createFixedTime(userId, payload)

      logger.info("Fixed time created successfully", {
        functionName: "FixedTimeController.createFixedTime",
        metadata: { userId, fixedTimeId: fixedTime.id, type: fixedTime.type }
      })

      res.status(201).json({
        success: true,
        message: "Fixed time created successfully",
        data: fixedTime,
      })
    } catch (err: any) {
      logger.error(`Create fixed time failed: ${err.message}`, {
        functionName: "FixedTimeController.createFixedTime",
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

  // static async getFixedTime(req: AuthRequest, res: Response) {
  //   try {
  //     let { fixedTimeId } = req?.params
  //     const userId = req.user!.id

  //     if (Array.isArray(fixedTimeId)) {
  //       fixedTimeId = fixedTimeId[0]
  //     }

  //     logger.info("Get fixed time API called", {
  //       functionName: "FixedTimeController.getFixedTime",
  //       metadata: { userId, fixedTimeId }
  //     })

  //     const fixedTime = await FixedTimeService.getFixedTime(userId, fixedTimeId)

  //     logger.info("Fixed time fetched successfully", {
  //       functionName: "FixedTimeController.getFixedTime",
  //       metadata: { userId, fixedTimeId }
  //     })

  //     res.status(200).json({
  //       success: true,
  //       data: fixedTime,
  //     })
  //   } catch (err: any) {
  //     logger.error(`Get fixed time failed: ${err.message}`, {
  //       functionName: "FixedTimeController.getFixedTime",
  //       error: err.message,
  //       stack: err.stack,
  //     })

  //     if (err instanceof AppError) {
  //       return res
  //         .status(err.statusCode)
  //         .json({ success: false, message: err.message })
  //     }

  //     return res.status(500).json({
  //       success: false,
  //       message: "Internal server error",
  //     })
  //   }
  // }

  static async getFixedTimes(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id

      logger.info("Get fixed times API called", {
        functionName: "FixedTimeController.getFixedTimes",
        metadata: { userId }
      })

      const fixedTimes = await FixedTimeService.getFixedTimes(userId)

      logger.info("Fixed times fetched successfully", {
        functionName: "FixedTimeController.getFixedTimes",
        metadata: { userId, count: fixedTimes.length }
      })

      res.status(200).json({
        success: true,
        data: fixedTimes,
      })
    } catch (err: any) {
      logger.error(`Get fixed times failed: ${err.message}`, {
        functionName: "FixedTimeController.getFixedTimes",
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

  static async updateFixedTime(req: AuthRequest, res: Response) {
    try {
      const { fixedTimeId } = req.params
      const payload = updateFixedTimeSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Update fixed time API called", {
        functionName: "FixedTimeController.updateFixedTime",
        metadata: { userId, fixedTimeId }
      })

      const fixedTime = await FixedTimeService.updateFixedTime(userId, fixedTimeId, payload)

      logger.info("Fixed time updated successfully", {
        functionName: "FixedTimeController.updateFixedTime",
        metadata: { userId, fixedTimeId }
      })

      res.status(200).json({
        success: true,
        message: "Fixed time updated successfully",
        data: fixedTime,
      })
    } catch (err: any) {
      logger.error(`Update fixed time failed: ${err.message}`, {
        functionName: "FixedTimeController.updateFixedTime",
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

  static async deleteFixedTime(req: AuthRequest, res: Response) {
    try {
      const { fixedTimeId } = req.params
      const userId = req.user!.id

      logger.info("Delete fixed time API called", {
        functionName: "FixedTimeController.deleteFixedTime",
        metadata: { userId, fixedTimeId }
      })

      await FixedTimeService.deleteFixedTime(userId, fixedTimeId)

      logger.info("Fixed time deleted successfully", {
        functionName: "FixedTimeController.deleteFixedTime",
        metadata: { userId, fixedTimeId }
      })

      res.status(200).json({
        success: true,
        message: "Fixed time deleted successfully",
      })
    } catch (err: any) {
      logger.error(`Delete fixed time failed: ${err.message}`, {
        functionName: "FixedTimeController.deleteFixedTime",
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

  static async addFreePeriod(req: AuthRequest, res: Response) {
    try {
      const { fixedTimeId } = req.params
      const payload = createFreePeriodSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Add free period API called", {
        functionName: "FixedTimeController.addFreePeriod",
        metadata: { userId, fixedTimeId, day: payload.day }
      })

      const freePeriod = await FixedTimeService.addFreePeriod(userId, fixedTimeId, payload)

      logger.info("Free period added successfully", {
        functionName: "FixedTimeController.addFreePeriod",
        metadata: { userId, fixedTimeId, freePeriodId: freePeriod.id }
      })

      res.status(201).json({
        success: true,
        message: "Free period added successfully",
        data: freePeriod,
      })
    } catch (err: any) {
      logger.error(`Add free period failed: ${err.message}`, {
        functionName: "FixedTimeController.addFreePeriod",
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

  static async updateFreePeriod(req: AuthRequest, res: Response) {
    try {
      const { fixedTimeId, freePeriodId } = req.params
      const payload = updateFreePeriodSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Update free period API called", {
        functionName: "FixedTimeController.updateFreePeriod",
        metadata: { userId, fixedTimeId, freePeriodId }
      })

      const freePeriod = await FixedTimeService.updateFreePeriod(userId, fixedTimeId, freePeriodId, payload)

      logger.info("Free period updated successfully", {
        functionName: "FixedTimeController.updateFreePeriod",
        metadata: { userId, fixedTimeId, freePeriodId }
      })

      res.status(200).json({
        success: true,
        message: "Free period updated successfully",
        data: freePeriod,
      })
    } catch (err: any) {
      logger.error(`Update free period failed: ${err.message}`, {
        functionName: "FixedTimeController.updateFreePeriod",
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

  static async deleteFreePeriod(req: AuthRequest, res: Response) {
    try {
      const { fixedTimeId, freePeriodId } = req.params
      const userId = req.user!.id

      logger.info("Delete free period API called", {
        functionName: "FixedTimeController.deleteFreePeriod",
        metadata: { userId, fixedTimeId, freePeriodId }
      })

      await FixedTimeService.deleteFreePeriod(userId, fixedTimeId, freePeriodId)

      logger.info("Free period deleted successfully", {
        functionName: "FixedTimeController.deleteFreePeriod",
        metadata: { userId, fixedTimeId, freePeriodId }
      })

      res.status(200).json({
        success: true,
        message: "Free period deleted successfully",
      })
    } catch (err: any) {
      logger.error(`Delete free period failed: ${err.message}`, {
        functionName: "FixedTimeController.deleteFreePeriod",
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

  static async getTasksInFixedTime(req: AuthRequest, res: Response) {
    try {
      const { fixedTimeId } = req.params
      const userId = req.user!.id

      logger.info("Get tasks in fixed time API called", {
        functionName: "FixedTimeController.getTasksInFixedTime",
        metadata: { userId, fixedTimeId }
      })

      const tasks = await FixedTimeService.getTasksInFixedTime(userId, fixedTimeId)

      logger.info("Tasks in fixed time fetched successfully", {
        functionName: "FixedTimeController.getTasksInFixedTime",
        metadata: { userId, fixedTimeId, count: tasks.length }
      })

      res.status(200).json({
        success: true,
        data: tasks,
      })
    } catch (err: any) {
      logger.error(`Get tasks in fixed time failed: ${err.message}`, {
        functionName: "FixedTimeController.getTasksInFixedTime",
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




  // Bulk create
static async bulkCreateFixedTimes(req: AuthRequest, res: Response) {
  try {
    const payload = bulkCreateFixedTimeSchema.parse(req.body);
    const userId = req.user!.id;

    logger.info("Bulk create fixed times called", {
      functionName: "FixedTimeController.bulkCreateFixedTimes",
      metadata: { userId, count: payload.fixedTimes.length }
    });

    const created = await FixedTimeService.bulkCreateFixedTimes(userId, payload.fixedTimes);

    logger.info("Bulk fixed times created", {
      functionName: "FixedTimeController.bulkCreateFixedTimes",
      metadata: { userId, count: created.length }
    });

    res.status(201).json({
      success: true,
      message: `${created.length} fixed times created`,
      data: created
    });
  } catch (err: any) {
    logger.error("Bulk create fixed times failed", { error: err.message, stack: err.stack });
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Bulk update
static async bulkUpdateFixedTimes(req: AuthRequest, res: Response) {
  try {
    const payload = bulkUpdateFixedTimeSchema.parse(req.body);
    const userId = req.user!.id;

    logger.info("Bulk update fixed times called", {
      functionName: "FixedTimeController.bulkUpdateFixedTimes",
      metadata: { userId, count: payload.updates.length }
    });

    const updated = await FixedTimeService.bulkUpdateFixedTimes(userId, payload.updates);

    logger.info("Bulk fixed times updated", {
      functionName: "FixedTimeController.bulkUpdateFixedTimes",
      metadata: { userId, count: updated.length }
    });

    res.status(200).json({
      success: true,
      message: `${updated.length} fixed times updated`,
      data: updated
    });
  } catch (err: any) {
    logger.error("Bulk update fixed times failed", { error: err.message, stack: err.stack });
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

// Bulk delete
static async bulkDeleteFixedTimes(req: AuthRequest, res: Response) {
  try {
    const payload = bulkDeleteFixedTimeSchema.parse(req.body);
    const userId = req.user!.id;

    logger.info("Bulk delete fixed times called", {
      functionName: "FixedTimeController.bulkDeleteFixedTimes",
      metadata: { userId, count: payload.fixedTimeIds.length }
    });

    const result = await FixedTimeService.bulkDeleteFixedTimes(userId, payload.fixedTimeIds);

    logger.info("Bulk fixed times deleted", {
      functionName: "FixedTimeController.bulkDeleteFixedTimes",
      metadata: { userId, deletedCount: result.count }
    });

    res.status(200).json({
      success: true,
      message: `${result.count} fixed times deleted`,
      data: { deletedCount: result.count, deletedIds: payload.fixedTimeIds }
    });
  } catch (err: any) {
    logger.error("Bulk delete fixed times failed", { error: err.message, stack: err.stack });
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}






// Bulk Add Free Periods to a Fixed Time
static async bulkAddMultipleFreePeriods(req: AuthRequest, res: Response) {
  console.log(req.body,"BODY aa rahi h Free Periods ki ")
  try {
    const payload = bulkAddMultipleFreePeriodsSchema.parse(req.body);
    const userId = req.user!.id;

    logger.info("Bulk add multiple free periods called", {
      functionName: "FixedTimeController.bulkAddMultipleFreePeriods",
      metadata: { userId, count: payload.entries.length }
    });

    const results = await FixedTimeService.bulkAddMultipleFreePeriods(userId, payload.entries);

    res.status(201).json({
      success: true,
      message: `Processed ${results.length} free period operations`,
      data: results
    });
  } catch (err: any) {
    logger.error("Bulk add multiple free periods failed", {
      functionName: "FixedTimeController.bulkAddMultipleFreePeriods",
      metadata:err
    });
    if (err instanceof AppError) return res.status(err.statusCode).json({ success: false, message: err.message });
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


// Bulk Delete Free Periods
static async bulkDeleteFreePeriods(req: AuthRequest, res: Response) {
  try {
    const payload = bulkDeleteFreePeriodSchema.parse(req.body);
    const userId = req.user!.id;

    logger.info("Bulk delete free periods called", {
      functionName: "FixedTimeController.bulkDeleteFreePeriods",
      metadata: { userId, count: payload.freePeriodIds.length }
    });

    const result = await FixedTimeService.bulkDeleteFreePeriods(userId, payload.freePeriodIds);

    logger.info("Bulk free periods deleted successfully", {
      functionName: "FixedTimeController.bulkDeleteFreePeriods",
      metadata: { userId, deletedCount: result.count }
    });

    res.status(200).json({
      success: true,
      message: `${result.count} free periods deleted`,
      data: {
        deletedCount: result.count,
        deletedIds: payload.freePeriodIds
      }
    });
  } catch (err: any) {
    logger.error("Bulk delete free periods failed", { error: err.message, stack: err.stack });
    if (err instanceof AppError) return res.status(err.statusCode).json({ success: false, message: err.message });
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}




static async getAllFreePeriods(req: AuthRequest, res: Response) {
  try {
    const query = getFreePeriodsQuerySchema.parse(req.query);
    const userId = req.user!.id;

    logger.info("Get all free periods called", {
      functionName: "FixedTimeController.getAllFreePeriods",
      metadata: { userId, query }
    });

    const result = await FixedTimeService.getAllFreePeriods(userId, query);

    logger.info("Free periods fetched successfully", {
      functionName: "FixedTimeController.getAllFreePeriods",
      metadata: { userId, count: result.freePeriods.length, total: result.total }
    });

    res.status(200).json({
      success: true,
      data: result.freePeriods,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (err: any) {
    logger.error("Get all free periods failed", {
      functionName: "FixedTimeController.getAllFreePeriods",
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
      message: "Internal server error"
    });
  }
}



}