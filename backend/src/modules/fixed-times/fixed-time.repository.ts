// src/modules/fixed-times/fixed-time.repository.ts
import { prisma } from "../../config/prisma"
import { Prisma } from "../../generated/prisma/client"
import { AppError } from "../../utils/AppError"
import { FixedTimeService } from "./fixed-time.service"
import { 
  CreateFixedTimeDTO, 
  UpdateFixedTimeDTO, 
  CreateFreePeriodDTO, 
  UpdateFreePeriodDTO,
  FixedTimeType
} from "./fixed-time.types"

export class FixedTimeRepository {
  // Fixed Time CRUD operations
  static async create(userId: string, data: CreateFixedTimeDTO) {
    return prisma.fixedTime.create({
      data: {
        userId,
        ...data,
        freePeriods: {
          create: data.freePeriods || []
        }
      },
      include: {
        freePeriods: true,
        tasks: true
      }
    })
  }

  static async findById(id: string, userId: string) {
    return prisma.fixedTime.findFirst({
      where: { id, userId },
      include: {
        freePeriods: {
          orderBy: { day: 'asc' }
        },
        tasks: {
          include: {
            goal: true,
            milestone: true
          }
        }
      }
    })
  }

  static async findAll(userId: string) {
    return prisma.fixedTime.findMany({
      where: { userId },
      include: {
        freePeriods: {
          orderBy: { day: 'asc' }
        },
        tasks: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async update(id: string, userId: string, data: UpdateFixedTimeDTO) {
    return prisma.fixedTime.update({
      where: { id, userId },
      data: {
        ...data,
        freePeriods: data.freePeriods ? {
          deleteMany: {},
          create: data.freePeriods
        } : undefined
      },
      include: {
        freePeriods: true,
        tasks: true
      }
    })
  }

  static async delete(id: string, userId: string) {
    return prisma.fixedTime.delete({
      where: { id, userId }
    })
  }

  // Free Period operations
  static async addFreePeriod(fixedTimeId: string, data: CreateFreePeriodDTO) {
    return prisma.freePeriod.create({
      data: {
        fixedTimeId,
        ...data,
        duration: this.calculateDuration(data.startTime, data.endTime)
      }
    })
  }

  static async updateFreePeriod(freePeriodId: string, data: UpdateFreePeriodDTO) {
    const updateData: any = { ...data }
    
    // Recalculate duration if times changed
    if (data.startTime || data.endTime) {
      const existing = await prisma.freePeriod.findUnique({
        where: { id: freePeriodId }
      })
      if (existing) {
        const startTime = data.startTime || existing.startTime
        const endTime = data.endTime || existing.endTime
        updateData.duration = this.calculateDuration(startTime, endTime)
      }
    }
    
    return prisma.freePeriod.update({
      where: { id: freePeriodId },
      data: updateData
    })
  }

  static async deleteFreePeriod(freePeriodId: string) {
    return prisma.freePeriod.delete({
      where: { id: freePeriodId }
    })
  }





  // ────────────────────────────────────────────────
// Bulk Create
// ────────────────────────────────────────────────
static async bulkCreate(userId: string, items: CreateFixedTimeDTO[]) {
  return prisma.$transaction(async (tx) => {
    const createdItems: any[] = [];

    for (const item of items) {
      const created = await tx.fixedTime.create({
        data: {
          userId,
          title: item.title,
          description: item.description,
          days: item.days,
          startTime: item.startTime,
          endTime: item.endTime,
          type: item.type,
          color: item.color ?? '#6B7280',
          isEditable: item.isEditable ?? false,
          freePeriods: {
            create: item.freePeriods || []
          }
        },
        include: {
          freePeriods: true
        }
      });
      createdItems.push(created);
    }

    return createdItems;
  }, { timeout: 60000 });
}

// ────────────────────────────────────────────────
// Bulk Update
// ────────────────────────────────────────────────
static async bulkUpdate(
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
  return prisma.$transaction(async (tx) => {
    const updatedItems: any[] = [];

    for (const upd of updates) {
      const { fixedTimeId, ...data } = upd;

      // Ownership check
      const existing = await tx.fixedTime.findFirst({
        where: { id: fixedTimeId, userId }
      });

      if (!existing) {
        throw new AppError(`Fixed time ${fixedTimeId} not found or not owned`, 404);
      }

      // Optional: time validation (business rule)
      if (data.startTime && data.endTime) {
        const startMin = FixedTimeService.timeToMinutes(data.startTime);
        const endMin   = FixedTimeService.timeToMinutes(data.endTime);
        if (startMin >= endMin) {
          throw new AppError(`Invalid time range for fixed time ${fixedTimeId}`, 400);
        }
      }

      const updated = await tx.fixedTime.update({
        where: { id: fixedTimeId },
        data: {
          ...data,
          updatedAt: new Date()
        },
        include: {
          freePeriods: true
        }
      });

      updatedItems.push(updated);
    }

    return updatedItems;
  }, { timeout: 60000 });
}

// ────────────────────────────────────────────────
// Bulk Delete
// ────────────────────────────────────────────────
static async bulkDelete(userId: string, fixedTimeIds: string[]) {
  return prisma.$transaction(async (tx) => {
    // 1. Check existence & ownership
    const existing = await tx.fixedTime.findMany({
      where: {
        id: { in: fixedTimeIds },
        userId
      },
      select: { id: true, title: true }
    });

    const foundIds = new Set(existing.map(e => e.id));
    const missing = fixedTimeIds.filter(id => !foundIds.has(id));

    if (missing.length > 0) {
      throw new AppError(
        `Some fixed times not found or not owned: ${missing.join(", ")}`,
        404
      );
    }

    // 2. Optional: Check for linked tasks (business rule)
    const tasksCount = await tx.task.count({
      where: {
        userId,
        fixedTimeId: { in: fixedTimeIds }
      }
    });

    if (tasksCount > 0) {
      throw new AppError(
        `Cannot delete fixed times with ${tasksCount} associated tasks. Reassign or delete tasks first.`,
        409
      );
    }

    // 3. Delete
    const result = await tx.fixedTime.deleteMany({
      where: {
        id: { in: fixedTimeIds },
        userId
      }
    });

    return result; // { count: number }
  }, { timeout: 30000 });
}









// Bulk Add Free Periods
/**
 * Bulk add or update free periods for multiple fixed times
 * Each entry is processed independently in a single transaction
 */

static async bulkAddOrUpdateFreePeriods(
  userId: string,
  entries: Array<{
    fixedTimeId: string;
    freePeriod: CreateFreePeriodDTO;
  }>
) {
  return prisma.$transaction(async (tx) => {
    const results: Array<{
      fixedTimeId: string;
      freePeriodId: string;
      action: 'created' | 'updated';
      message: string;
    }> = [];

    for (const entry of entries) {
      const { fixedTimeId, freePeriod } = entry;

      // 1. Verify fixed time exists and belongs to user
      const fixedTime = await tx.fixedTime.findFirst({
        where: { id: fixedTimeId, userId },
        include: { freePeriods: true }  // Load all existing free periods
      });

      if (!fixedTime) {
        throw new AppError(`Fixed time ${fixedTimeId} not found or not owned`, 404);
      }

      // 2. Validate free period fits inside fixed time
      if (!this.isTimeWithinRange(freePeriod.startTime, fixedTime.startTime, fixedTime.endTime) ||
          !this.isTimeWithinRange(freePeriod.endTime, fixedTime.startTime, fixedTime.endTime)) {
        throw new AppError(`Free period does not fit in fixed time ${fixedTimeId}`, 400);
      }

      // 3. Check for overlaps with existing free periods
      const overlapping = fixedTime.freePeriods.some(fp => 
        fp.day === freePeriod.day && 
        this.doTimeRangesOverlap(freePeriod.startTime, freePeriod.endTime, fp.startTime, fp.endTime)
      );

      if (overlapping) {
        throw new AppError(`Overlapping free period detected on ${freePeriod.day} for fixed time ${fixedTimeId}`, 409);
      }

      // 4. Check for exact match (same day, start, end)
      const exactMatch = fixedTime.freePeriods.find(fp => 
        fp.day === freePeriod.day && 
        fp.startTime === freePeriod.startTime && 
        fp.endTime === freePeriod.endTime
      );

      let freePeriodResult;

      if (exactMatch) {
        // Update if exact match
        freePeriodResult = await tx.freePeriod.update({
          where: { id: exactMatch.id },
          data: {
            title: freePeriod.title ?? exactMatch.title,
            duration: this.calculateDuration(freePeriod.startTime, freePeriod.endTime),
            updatedAt: new Date()
          }
        });
        results.push({
          fixedTimeId,
          freePeriodId: freePeriodResult.id,
          action: 'updated',
          message: 'Existing free period updated (exact match)'
        });
      } else {
        // Create new
        freePeriodResult = await tx.freePeriod.create({
          data: {
            fixedTimeId,
            title: freePeriod.title ?? 'Free Period',
            startTime: freePeriod.startTime,
            endTime: freePeriod.endTime,
            day: freePeriod.day,
            duration: this.calculateDuration(freePeriod.startTime, freePeriod.endTime)
          }
        });
        results.push({
          fixedTimeId,
          freePeriodId: freePeriodResult.id,
          action: 'created',
          message: 'New free period created'
        });
      }
    }

    return results;
  }, { timeout: 60000 });
}

// Add these helpers if not already present in repository
private static isTimeWithinRange(time: string, rangeStart: string, rangeEnd: string): boolean {
  const timeMin = this.timeToMinutes(time);
  const startMin = this.timeToMinutes(rangeStart);
  const endMin = this.timeToMinutes(rangeEnd);
  return timeMin >= startMin && timeMin <= endMin;
}

private static doTimeRangesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  const s1 = this.timeToMinutes(start1);
  const e1 = this.timeToMinutes(end1);
  const s2 = this.timeToMinutes(start2);
  const e2 = this.timeToMinutes(end2);
  return s1 < e2 && s2 < e1;
}

private static timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}


// Bulk Delete Free Periods
static async bulkDeleteFreePeriods(userId: string, freePeriodIds: string[]) {
  return prisma.$transaction(async (tx) => {
    // 1. Find all free periods to verify ownership
    const existing = await tx.freePeriod.findMany({
      where: {
        id: { in: freePeriodIds },
        fixedTime: { userId }  // Ownership check via fixedTime relation
      },
      select: { id: true }
    });

    const foundIds = new Set(existing.map(e => e.id));
    const missing = freePeriodIds.filter(id => !foundIds.has(id));

    if (missing.length > 0) {
      throw new AppError(`Some free periods not found or not owned: ${missing.join(", ")}`, 404);
    }

    // 2. Delete
    const result = await tx.freePeriod.deleteMany({
      where: {
        id: { in: freePeriodIds },
        fixedTime: { userId }  // extra safety
      }
    });

    return result; // { count: number }
  }, { timeout: 30000 });
}





static async getAllFreePeriods(
  userId: string,
  filters: {
    fixedTimeId?: string;
    day?: string;
    title?: string;
    startTimeFrom?: string;
    startTimeTo?: string;
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "startTime" | "day";
    order?: "asc" | "desc";
  }
) {
  const { page = 1, limit = 20, ...filter } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.FreePeriodWhereInput = {
    fixedTime: { userId }  // only user's fixed times
  };

  // Apply filters
  if (filter.fixedTimeId) {
    where.fixedTimeId = filter.fixedTimeId;
  }

  if (filter.day) {
    where.day = filter.day;
  }

  if (filter.title) {
    where.title = { contains: filter.title, mode: "insensitive" };
  }

  if (filter.startTimeFrom || filter.startTimeTo) {
    where.startTime = {};
    if (filter.startTimeFrom) where.startTime.gte = filter.startTimeFrom;
    if (filter.startTimeTo)   where.startTime.lte = filter.startTimeTo;
  }

  // Sorting
  let orderBy: Prisma.FreePeriodOrderByWithRelationInput = {};
  if (filter.sortBy === "startTime") {
    orderBy = { startTime: filter.order };
  } else if (filter.sortBy === "day") {
    orderBy = { day: filter.order };
  } else {
    orderBy = { createdAt: filter.order };
  }

  const [freePeriods, total] = await Promise.all([
    prisma.freePeriod.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        fixedTime: {
          select: {
            id: true,
            title: true,
            type: true,
            startTime: true,
            endTime: true,
            days: true
          }
        }
      }
    }),
    prisma.freePeriod.count({ where })
  ]);

  return {
    freePeriods,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}




  // Helper methods
  private static calculateDuration1(startTime: string, endTime: string): number {
    const [startHours, startMinutes] = startTime.split(':').map(Number)
    const [endHours, endMinutes] = endTime.split(':').map(Number)
    
    const startTotalMinutes = startHours * 60 + startMinutes
    const endTotalMinutes = endHours * 60 + endMinutes
    
    return endTotalMinutes - startTotalMinutes
  }



  // Make it public static
  public static calculateDuration(startTime: string, endTime: string): number {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    
    let startMin = sh * 60 + sm;
    let endMin   = eh * 60 + em;
    
    if (endMin < startMin) endMin += 24 * 60; // overnight case
    return endMin - startMin;
  }




}