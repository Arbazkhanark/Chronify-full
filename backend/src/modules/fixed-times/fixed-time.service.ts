// src/modules/fixed-times/fixed-time.service.ts

import { FixedTimeRepository } from "./fixed-time.repository"
import { 
  CreateFixedTimeDTO, 
  UpdateFixedTimeDTO, 
  CreateFreePeriodDTO, 
  UpdateFreePeriodDTO,
  FixedTimeType
} from "./fixed-time.types"
import { AppError } from "../../utils/AppError"
import { logger } from "patal-log"
import { TaskRepository } from "../tasks/task.repository"
import z from "zod"
import { getFreePeriodsQuerySchema } from "./fixed-time.validation"

export class FixedTimeService {
  static async createFixedTime(userId: string, data: CreateFixedTimeDTO) {
    logger.info("Creating new fixed time", {
      functionName: "FixedTimeService.createFixedTime",
      metadata: { userId, data }
    })

    // Validate time consistency
    if (!this.isValidTime(data.startTime) || !this.isValidTime(data.endTime)) {
      throw new AppError("Invalid time format", 400)
    }

    // Validate start time is before end time
    if (!this.isStartBeforeEnd(data.startTime, data.endTime)) {
      throw new AppError("Start time must be before end time", 400)
    }

    // Validate at least one day is selected
    if (!data.days || data.days.length === 0) {
      throw new AppError("At least one day must be selected", 400)
    }

    const fixedTime = await FixedTimeRepository.create(userId, data)

    logger.info("Fixed time created successfully", {
      functionName: "FixedTimeService.createFixedTime",
      metadata: { userId, fixedTimeId: fixedTime.id, type: fixedTime.type }
    })

    return fixedTime
  }

  static async getFixedTime(userId: string, fixedTimeId: string) {
    logger.info("Fetching fixed time", {
      functionName: "FixedTimeService.getFixedTime",
      metadata: { userId, fixedTimeId }
    })

    const fixedTime = await FixedTimeRepository.findById(fixedTimeId, userId)
    if (!fixedTime) {
      logger.warn("Fixed time not found", {
        functionName: "FixedTimeService.getFixedTime",
        metadata: { userId, fixedTimeId }
      })
      throw new AppError("Fixed time not found", 404)
    }

    logger.info("Fixed time fetched successfully", {
      functionName: "FixedTimeService.getFixedTime",
      metadata: { userId, fixedTimeId }
    })

    return fixedTime
  }

  static async getFixedTimes(userId: string) {
    logger.info("Fetching fixed times", {
      functionName: "FixedTimeService.getFixedTimes",
      metadata: { userId }
    })

    const fixedTimes = await FixedTimeRepository.findAll(userId)

    logger.info("Fixed times fetched successfully", {
      functionName: "FixedTimeService.getFixedTimes",
      metadata: { userId, count: fixedTimes.length }
    })

    return fixedTimes
  }

  static async updateFixedTime(userId: string, fixedTimeId: string, data: UpdateFixedTimeDTO) {
    logger.info("Updating fixed time", {
      functionName: "FixedTimeService.updateFixedTime",
      metadata: { userId, fixedTimeId, data }
    })

    // Check if fixed time exists
    const existingFixedTime = await FixedTimeRepository.findById(fixedTimeId, userId)
    if (!existingFixedTime) {
      logger.warn("Fixed time not found for update", {
        functionName: "FixedTimeService.updateFixedTime",
        metadata: { userId, fixedTimeId }
      })
      throw new AppError("Fixed time not found", 404)
    }

    // Validate time if provided
    if (data.startTime && data.endTime) {
      if (!this.isStartBeforeEnd(data.startTime, data.endTime)) {
        throw new AppError("Start time must be before end time", 400)
      }
    }

    const fixedTime = await FixedTimeRepository.update(fixedTimeId, userId, data)

    logger.info("Fixed time updated successfully", {
      functionName: "FixedTimeService.updateFixedTime",
      metadata: { userId, fixedTimeId }
    })

    return fixedTime
  }

  static async deleteFixedTime(userId: string, fixedTimeId: string) {
    logger.info("Deleting fixed time", {
      functionName: "FixedTimeService.deleteFixedTime",
      metadata: { userId, fixedTimeId }
    })

    // Check if fixed time exists
    const existingFixedTime = await FixedTimeRepository.findById(fixedTimeId, userId)
    if (!existingFixedTime) {
      logger.warn("Fixed time not found for deletion", {
        functionName: "FixedTimeService.deleteFixedTime",
        metadata: { userId, fixedTimeId }
      })
      throw new AppError("Fixed time not found", 404)
    }

    // Check if there are tasks linked to this fixed time
    const tasks = await TaskRepository.findByFixedTime(userId, fixedTimeId)
    if (tasks.length > 0) {
      throw new AppError(
        `Cannot delete fixed time with ${tasks.length} linked tasks. Please delete or reassign tasks first.`,
        400
      )
    }

    await FixedTimeRepository.delete(fixedTimeId, userId)

    logger.info("Fixed time deleted successfully", {
      functionName: "FixedTimeService.deleteFixedTime",
      metadata: { userId, fixedTimeId }
    })
  }

  static async addFreePeriod(userId: string, fixedTimeId: string, data: CreateFreePeriodDTO) {
    logger.info("Adding free period", {
      functionName: "FixedTimeService.addFreePeriod",
      metadata: { userId, fixedTimeId, data }
    })

    // Check if fixed time exists
    const fixedTime = await FixedTimeRepository.findById(fixedTimeId, userId)
    if (!fixedTime) {
      throw new AppError("Fixed time not found", 404)
    }

    // Validate free period is within fixed time hours
    if (!this.isTimeWithinRange(data.startTime, fixedTime.startTime, fixedTime.endTime) ||
        !this.isTimeWithinRange(data.endTime, fixedTime.startTime, fixedTime.endTime)) {
      throw new AppError("Free period must be within fixed time hours", 400)
    }

    // Validate start time is before end time
    if (!this.isStartBeforeEnd(data.startTime, data.endTime)) {
      throw new AppError("Start time must be before end time", 400)
    }

    // Check for overlapping free periods on same day
    const overlappingFreePeriods = fixedTime.freePeriods?.filter(fp => 
      fp.day === data.day && 
      this.doTimeRangesOverlap(
        data.startTime, data.endTime, 
        fp.startTime, fp.endTime
      )
    )

    if (overlappingFreePeriods && overlappingFreePeriods.length > 0) {
      throw new AppError("Free period overlaps with existing free period on same day", 409)
    }

    const freePeriod = await FixedTimeRepository.addFreePeriod(fixedTimeId, data)

    logger.info("Free period added successfully", {
      functionName: "FixedTimeService.addFreePeriod",
      metadata: { userId, fixedTimeId, freePeriodId: freePeriod.id }
    })

    return freePeriod
  }

  static async updateFreePeriod(
    userId: string, 
    fixedTimeId: string, 
    freePeriodId: string, 
    data: UpdateFreePeriodDTO
  ) {
    logger.info("Updating free period", {
      functionName: "FixedTimeService.updateFreePeriod",
      metadata: { userId, fixedTimeId, freePeriodId, data }
    })

    // Check if fixed time exists
    const fixedTime = await FixedTimeRepository.findById(fixedTimeId, userId)
    if (!fixedTime) {
      throw new AppError("Fixed time not found", 404)
    }

    // Check if free period exists
    const freePeriod = fixedTime.freePeriods?.find(fp => fp.id === freePeriodId)
    if (!freePeriod) {
      throw new AppError("Free period not found", 404)
    }

    // Validate free period is within fixed time hours
    const startTime = data.startTime || freePeriod.startTime
    const endTime = data.endTime || freePeriod.endTime
    
    if (!this.isTimeWithinRange(startTime, fixedTime.startTime, fixedTime.endTime) ||
        !this.isTimeWithinRange(endTime, fixedTime.startTime, fixedTime.endTime)) {
      throw new AppError("Free period must be within fixed time hours", 400)
    }

    // Validate start time is before end time
    if (!this.isStartBeforeEnd(startTime, endTime)) {
      throw new AppError("Start time must be before end time", 400)
    }

    // Check for overlapping free periods on same day (excluding current)
    const day = data.day || freePeriod.day
    const overlappingFreePeriods = fixedTime.freePeriods?.filter(fp => 
      fp.id !== freePeriodId &&
      fp.day === day && 
      this.doTimeRangesOverlap(
        startTime, endTime, 
        fp.startTime, fp.endTime
      )
    )

    if (overlappingFreePeriods && overlappingFreePeriods.length > 0) {
      throw new AppError("Free period overlaps with existing free period on same day", 409)
    }

    const updatedFreePeriod = await FixedTimeRepository.updateFreePeriod(freePeriodId, data)

    logger.info("Free period updated successfully", {
      functionName: "FixedTimeService.updateFreePeriod",
      metadata: { userId, fixedTimeId, freePeriodId }
    })

    return updatedFreePeriod
  }

  static async deleteFreePeriod(userId: string, fixedTimeId: string, freePeriodId: string) {
    logger.info("Deleting free period", {
      functionName: "FixedTimeService.deleteFreePeriod",
      metadata: { userId, fixedTimeId, freePeriodId }
    })

    // Check if fixed time exists
    const fixedTime = await FixedTimeRepository.findById(fixedTimeId, userId)
    if (!fixedTime) {
      throw new AppError("Fixed time not found", 404)
    }

    // Check if free period exists
    const freePeriod = fixedTime.freePeriods?.find(fp => fp.id === freePeriodId)
    if (!freePeriod) {
      throw new AppError("Free period not found", 404)
    }

    // Check if there are tasks scheduled in this free period
    const tasksInFreePeriod = await TaskRepository.findTasksInFreePeriod(userId, fixedTimeId, freePeriod.day)
    const tasksInThisFreePeriod = tasksInFreePeriod.filter(task => 
      this.isTimeWithinRange(task.startTime, freePeriod.startTime, freePeriod.endTime) &&
      this.isTimeWithinRange(task.endTime, freePeriod.startTime, freePeriod.endTime)
    )

    if (tasksInThisFreePeriod.length > 0) {
      throw new AppError(
        `Cannot delete free period with ${tasksInThisFreePeriod.length} scheduled tasks. Please reschedule or delete tasks first.`,
        400
      )
    }

    await FixedTimeRepository.deleteFreePeriod(freePeriodId)

    logger.info("Free period deleted successfully", {
      functionName: "FixedTimeService.deleteFreePeriod",
      metadata: { userId, fixedTimeId, freePeriodId }
    })
  }

  static async getTasksInFixedTime(userId: string, fixedTimeId: string) {
    logger.info("Getting tasks in fixed time", {
      functionName: "FixedTimeService.getTasksInFixedTime",
      metadata: { userId, fixedTimeId }
    })

    // Check if fixed time exists
    const fixedTime = await FixedTimeRepository.findById(fixedTimeId, userId)
    if (!fixedTime) {
      throw new AppError("Fixed time not found", 404)
    }

    const tasks = await TaskRepository.findByFixedTime(userId, fixedTimeId)

    logger.info("Tasks in fixed time fetched successfully", {
      functionName: "FixedTimeService.getTasksInFixedTime",
      metadata: { userId, fixedTimeId, count: tasks.length }
    })

    return tasks
  }



  // Bulk create
static async bulkCreateFixedTimes(userId: string, items: CreateFixedTimeDTO[]) {
  logger.info("Bulk creating fixed times", {
    functionName: "FixedTimeService.bulkCreateFixedTimes",
    metadata: { userId, count: items.length }
  });

  // Business validations (same as single create)
  for (const item of items) {
    if (!this.isStartBeforeEnd(item.startTime, item.endTime)) {
      throw new AppError(`Invalid time range for "${item.title}"`, 400);
    }
    if (!item.days?.length) {
      throw new AppError(`No days selected for "${item.title}"`, 400);
    }
  }

  const created = await FixedTimeRepository.bulkCreate(userId, items);

  logger.info("Bulk fixed times created successfully", {
    functionName: "FixedTimeService.bulkCreateFixedTimes",
    metadata: { userId, count: created.length }
  });

  return created;
}

// Bulk update
static async bulkUpdateFixedTimes(
  userId: string,
  updates: Array<{
    fixedTimeId: string;
    title?: string;
    description?: string;
    days?: string[];
    startTime?: string;
    endTime?: string;
    type?: FixedTimeType;
    color?: string;
    isEditable?: boolean;
  }>
) {
  logger.info("Bulk updating fixed times", {
    functionName: "FixedTimeService.bulkUpdateFixedTimes",
    metadata: { userId, count: updates.length }
  });

  // Optional extra business validations here if needed

  const updated = await FixedTimeRepository.bulkUpdate(userId, updates);

  logger.info("Bulk fixed times updated successfully", {
    functionName: "FixedTimeService.bulkUpdateFixedTimes",
    metadata: { userId, count: updated.length }
  });

  return updated;
}

// Bulk delete
static async bulkDeleteFixedTimes(userId: string, fixedTimeIds: string[]) {
  logger.info("Bulk deleting fixed times", {
    functionName: "FixedTimeService.bulkDeleteFixedTimes",
    metadata: { userId, count: fixedTimeIds.length }
  });

  const result = await FixedTimeRepository.bulkDelete(userId, fixedTimeIds);

  logger.info("Bulk fixed times deleted successfully", {
    functionName: "FixedTimeService.bulkDeleteFixedTimes",
    metadata: { userId, deletedCount: result.count }
  });

  return result;
}






// Bulk Add Free Periods
static async bulkAddMultipleFreePeriods(
  userId: string,
  entries: Array<{
    fixedTimeId: string;
    freePeriod: CreateFreePeriodDTO;
  }>
) {
  logger.info("Bulk adding multiple free periods", {
    functionName: "FixedTimeService.bulkAddMultipleFreePeriods",
    metadata: { userId, count: entries.length }
  });

  // Optional: Add extra business validations here if needed
  // e.g. check if all fixedTimeIds belong to user (but repository already checks)

  const results = await FixedTimeRepository.bulkAddOrUpdateFreePeriods(userId, entries);

  logger.info("Bulk free periods processed successfully", {
    functionName: "FixedTimeService.bulkAddMultipleFreePeriods",
    metadata: { userId, processedCount: results.length }
  });

  return results;
}


// Bulk Delete Free Periods
static async bulkDeleteFreePeriods(userId: string, freePeriodIds: string[]) {
  logger.info("Bulk deleting free periods", {
    functionName: "FixedTimeService.bulkDeleteFreePeriods",
    metadata: { userId, count: freePeriodIds.length }
  });

  const result = await FixedTimeRepository.bulkDeleteFreePeriods(userId, freePeriodIds);

  logger.info("Bulk free periods deleted successfully", {
    functionName: "FixedTimeService.bulkDeleteFreePeriods",
    metadata: { userId, deletedCount: result.count }
  });

  return result;
}






static async getAllFreePeriods(
  userId: string,
  filters: z.infer<typeof getFreePeriodsQuerySchema>
) {
  logger.info("Fetching free periods with filters", {
    functionName: "FixedTimeService.getAllFreePeriods",
    metadata: { userId, filters }
  });

  const result = await FixedTimeRepository.getAllFreePeriods(userId, filters);

  return result;
}








  // Helper methods
  private static isValidTime(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/
    return regex.test(time)
  }

  static isStartBeforeEnd(startTime: string, endTime: string): boolean {
    const start = this.timeToMinutes(startTime)
    const end = this.timeToMinutes(endTime)
    return start < end
  }

  private static isTimeWithinRange(time: string, rangeStart: string, rangeEnd: string): boolean {
    const timeMinutes = this.timeToMinutes(time)
    const startMinutes = this.timeToMinutes(rangeStart)
    const endMinutes = this.timeToMinutes(rangeEnd)
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes
  }

  private static doTimeRangesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const s1 = this.timeToMinutes(start1)
    const e1 = this.timeToMinutes(end1)
    const s2 = this.timeToMinutes(start2)
    const e2 = this.timeToMinutes(end2)
    return s1 < e2 && s2 < e1
  }

  static  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  private static calculateDuration(startTime: string, endTime: string): number {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM]   = endTime.split(':').map(Number);

    const startMin = startH * 60 + startM;
    const endMin   = endH * 60 + endM;

    // Handle overnight (midnight cross) cases if needed
    return endMin >= startMin ? endMin - startMin : (endMin + 24*60) - startMin;
  }
}