// src/modules/goals/goal.repository.ts
import { prisma } from "../../config/prisma"
import { CreateGoalDTO, UpdateGoalDTO, GoalFilterDTO, CreateMilestoneDTO, UpdateMilestoneDTO } from "./goal.types"

export class GoalRepository {
  // Goal CRUD operations
  static async create(userId: string, data: CreateGoalDTO) {
    return prisma.goal.create({
      data: {
        userId,
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
      },
      include: {
        milestones: true,
        tasks: true,
      },
    })
  }

  static async findById(id: string, userId: string) {
    return prisma.goal.findFirst({
      where: { id, userId },
      include: {
        milestones: {
          orderBy: { targetDate: 'asc' }
        },
        tasks: true,
      },
    })
  }

  static async findAll(userId: string, filters: GoalFilterDTO) {
    const { limit = 20, page = 1, ...filterData } = filters
    const skip = (page - 1) * limit
    
    const where: any = { userId }
    
    // Apply filters
    if (filterData.filter === 'active') {
      where.status = 'IN_PROGRESS'
    } else if (filterData.filter === 'completed') {
      where.status = 'COMPLETED'
    } else if (filterData.filter === 'delayed') {
      where.status = 'DELAYED'
    } else if (filterData.filter === 'not_started') {
      where.status = 'NOT_STARTED'
    } else if (filterData.filter === 'short') {
      where.type = 'SHORT_TERM'
    } else if (filterData.filter === 'long') {
      where.type = 'LONG_TERM'
    }
    
    if (filterData.category) {
      where.category = filterData.category
    }
    
    if (filterData.status) {
      where.status = filterData.status
    }
    
    if (filterData.type) {
      where.type = filterData.type
    }
    
    if (filterData.search) {
      where.OR = [
        { title: { contains: filterData.search, mode: 'insensitive' } },
        { description: { contains: filterData.search, mode: 'insensitive' } },
        { tags: { has: filterData.search } }
      ]
    }
    
    // Build orderBy
    let orderBy: any = {}
    switch (filterData.sort) {
      case 'priority':
        const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
        // This requires custom sorting in service layer
        break
      case 'progress':
        orderBy = { progress: 'desc' }
        break
      case 'deadline':
        orderBy = { targetDate: 'asc' }
        break
      case 'created':
        orderBy = { createdAt: 'desc' }
        break
      case 'title':
        orderBy = { title: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }
    
    const [goals, total] = await Promise.all([
      prisma.goal.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          milestones: {
            orderBy: { targetDate: 'asc' }
          },
        },
      }),
      prisma.goal.count({ where })
    ])
    
    return {
      goals,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async update(id: string, userId: string, data: UpdateGoalDTO) {
    return prisma.goal.update({
      where: { id, userId },
      data: {
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        lastUpdated: new Date(),
      },
      include: {
        milestones: {
          orderBy: { targetDate: 'asc' }
        },
      },
    })
  }

  static async delete(id: string, userId: string) {
    return prisma.goal.delete({
      where: { id, userId },
    })
  }

  // Milestone operations
  static async createMilestone(goalId: string, data: CreateMilestoneDTO) {
    return prisma.milestone.create({
      data: {
        goalId,
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
      },
    })
  }

  static async updateMilestone(milestoneId: string, data: UpdateMilestoneDTO) {
    return prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
      },
    })
  }

  static async deleteMilestone(milestoneId: string) {
    return prisma.milestone.delete({
      where: { id: milestoneId },
    })
  }

  // Statistics
  static async getStats(userId: string) {
    const goals = await prisma.goal.findMany({
      where: { userId },
      include: { milestones: true }
    })
    
    return goals
  }
}