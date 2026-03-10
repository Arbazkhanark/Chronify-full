// src/modules/goals/goal.service.ts
import { GoalRepository } from "./goal.repository"
import { 
  CreateGoalDTO, 
  UpdateGoalDTO, 
  GoalFilterDTO, 
  CreateMilestoneDTO, 
  UpdateMilestoneDTO,
  GoalStats 
} from "./goal.types"
import { AppError } from "../../utils/AppError"
import { logger } from "patal-log"

export class GoalService {
  static async createGoal(userId: string, data: CreateGoalDTO) {
    logger.info("Creating new goal", {
      functionName: "GoalService.createGoal",
      metadata: { userId }
    })

    const goal = await GoalRepository.create(userId, data)

    logger.info("Goal created successfully", {
      functionName: "GoalService.createGoal",
      metadata: { userId, goalId: goal.id }
    })

    return goal
  }

  static async getGoal(userId: string, goalId: string) {
    logger.info("Fetching goal", {
      functionName: "GoalService.getGoal",
      metadata: { userId, goalId }
    })

    const goal = await GoalRepository.findById(goalId, userId)
    if (!goal) {
      logger.warn("Goal not found", {
        functionName: "GoalService.getGoal",
        metadata: { userId, goalId }
      })
      throw new AppError("Goal not found", 404)
    }

    logger.info("Goal fetched successfully", {
      functionName: "GoalService.getGoal",
      metadata: { userId, goalId }
    })

    return goal
  }

  static async getGoals(userId: string, filters: GoalFilterDTO) {
    logger.info("Fetching goals with filters", {
      functionName: "GoalService.getGoals",
      metadata: { userId, filters }
    })

    const result = await GoalRepository.findAll(userId, filters)

    logger.info("Goals fetched successfully", {
      functionName: "GoalService.getGoals",
      metadata: { userId, count: result.total }
    })

    return result
  }

  static async updateGoal(userId: string, goalId: string, data: UpdateGoalDTO) {
    logger.info("Updating goal", {
      functionName: "GoalService.updateGoal",
      metadata: { userId, goalId }
    })

    // Check if goal exists
    const existingGoal = await GoalRepository.findById(goalId, userId)
    if (!existingGoal) {
      logger.warn("Goal not found for update", {
        functionName: "GoalService.updateGoal",
        metadata: { userId, goalId }
      })
      throw new AppError("Goal not found", 404)
    }

    const goal = await GoalRepository.update(goalId, userId, data)

    logger.info("Goal updated successfully", {
      functionName: "GoalService.updateGoal",
      metadata: { userId, goalId }
    })

    return goal
  }

  static async deleteGoal(userId: string, goalId: string) {
    logger.info("Deleting goal", {
      functionName: "GoalService.deleteGoal",
      metadata: { userId, goalId }
    })

    // Check if goal exists
    const existingGoal = await GoalRepository.findById(goalId, userId)
    if (!existingGoal) {
      logger.warn("Goal not found for deletion", {
        functionName: "GoalService.deleteGoal",
        metadata: { userId, goalId }
      })
      throw new AppError("Goal not found", 404)
    }

    await GoalRepository.delete(goalId, userId)

    logger.info("Goal deleted successfully", {
      functionName: "GoalService.deleteGoal",
      metadata: { userId, goalId }
    })
  }

  static async addMilestone(userId: string, goalId: string, data: CreateMilestoneDTO) {
    logger.info("Adding milestone to goal", {
      functionName: "GoalService.addMilestone",
      metadata: { userId, goalId }
    })

    // Check if goal exists and belongs to user
    const goal = await GoalRepository.findById(goalId, userId)
    if (!goal) {
      logger.warn("Goal not found for adding milestone", {
        functionName: "GoalService.addMilestone",
        metadata: { userId, goalId }
      })
      throw new AppError("Goal not found", 404)
    }

    const milestone = await GoalRepository.createMilestone(goalId, data)

    logger.info("Milestone added successfully", {
      functionName: "GoalService.addMilestone",
      metadata: { userId, goalId, milestoneId: milestone.id }
    })

    return milestone
  }

  static async updateMilestone(
    userId: string, 
    goalId: string, 
    milestoneId: string, 
    data: UpdateMilestoneDTO
  ) {
    logger.info("Updating milestone", {
      functionName: "GoalService.updateMilestone",
      metadata: { userId, goalId, milestoneId }
    })

    // Check if goal exists and belongs to user
    const goal = await GoalRepository.findById(goalId, userId)
    if (!goal) {
      logger.warn("Goal not found for updating milestone", {
        functionName: "GoalService.updateMilestone",
        metadata: { userId, goalId }
      })
      throw new AppError("Goal not found", 404)
    }

    // Check if milestone exists
    const milestone = goal.milestones.find(m => m.id === milestoneId)
    if (!milestone) {
      logger.warn("Milestone not found", {
        functionName: "GoalService.updateMilestone",
        metadata: { userId, goalId, milestoneId }
      })
      throw new AppError("Milestone not found", 404)
    }

    const updatedMilestone = await GoalRepository.updateMilestone(milestoneId, data)

    // Update goal progress if milestone completion changed
    if (data.completed !== undefined || data.progress !== undefined) {
      await this.updateGoalProgress(userId, goalId)
    }

    logger.info("Milestone updated successfully", {
      functionName: "GoalService.updateMilestone",
      metadata: { userId, goalId, milestoneId }
    })

    return updatedMilestone
  }

  static async deleteMilestone(userId: string, goalId: string, milestoneId: string) {
    logger.info("Deleting milestone", {
      functionName: "GoalService.deleteMilestone",
      metadata: { userId, goalId, milestoneId }
    })

    // Check if goal exists and belongs to user
    const goal = await GoalRepository.findById(goalId, userId)
    if (!goal) {
      logger.warn("Goal not found for deleting milestone", {
        functionName: "GoalService.deleteMilestone",
        metadata: { userId, goalId }
      })
      throw new AppError("Goal not found", 404)
    }

    // Check if milestone exists
    const milestone = goal.milestones.find(m => m.id === milestoneId)
    if (!milestone) {
      logger.warn("Milestone not found", {
        functionName: "GoalService.deleteMilestone",
        metadata: { userId, goalId, milestoneId }
      })
      throw new AppError("Milestone not found", 404)
    }

    await GoalRepository.deleteMilestone(milestoneId)

    logger.info("Milestone deleted successfully", {
      functionName: "GoalService.deleteMilestone",
      metadata: { userId, goalId, milestoneId }
    })
  }

  static async updateProgress(userId: string, goalId: string, hours: number) {
    logger.info("Updating goal progress", {
      functionName: "GoalService.updateProgress",
      metadata: { userId, goalId, hours }
    })

    const goal = await GoalRepository.findById(goalId, userId)
    if (!goal) {
      logger.warn("Goal not found for progress update", {
        functionName: "GoalService.updateProgress",
        metadata: { userId, goalId }
      })
      throw new AppError("Goal not found", 404)
    }

    // Calculate new progress
    const newCompletedHours = Math.min(goal.totalHours, goal.completedHours + hours)
    const progress = goal.totalHours > 0 ? (newCompletedHours / goal.totalHours) * 100 : 0

    // Update streak
    const today = new Date()
    const lastUpdated = new Date(goal.lastUpdated)
    const isSameDay = today.toDateString() === lastUpdated.toDateString()
    const newStreak = isSameDay ? goal.streak : goal.streak + 1

    // Determine status
    let status = goal.status
    if (progress >= 100 && goal.status !== 'COMPLETED') {
      status = 'COMPLETED'
    } else if (goal.status === 'NOT_STARTED' && progress > 0) {
      status = 'IN_PROGRESS'
    }

    const updatedGoal = await GoalRepository.update(goalId, userId, {
      completedHours: newCompletedHours,
      progress: Math.round(progress),
      status,
      streak: newStreak,
      ...(progress >= 100 && { completedAt: new Date() })
    })

    logger.info("Goal progress updated successfully", {
      functionName: "GoalService.updateProgress",
      metadata: { userId, goalId, newProgress: progress }
    })

    return updatedGoal
  }

  static async getStatistics(userId: string): Promise<GoalStats> {
    logger.info("Fetching goal statistics", {
      functionName: "GoalService.getStatistics",
      metadata: { userId }
    })

    const goals = await GoalRepository.getStats(userId)

    const total = goals.length
    const active = goals.filter(g => g.status === 'IN_PROGRESS').length
    const completed = goals.filter(g => g.status === 'COMPLETED').length
    const delayed = goals.filter(g => g.status === 'DELAYED').length
    const notStarted = goals.filter(g => g.status === 'NOT_STARTED').length
    
    const totalHours = goals.reduce((sum, g) => sum + g.totalHours, 0)
    const completedHours = goals.reduce((sum, g) => sum + g.completedHours, 0)
    const averageProgress = goals.length > 0 
      ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length 
      : 0

    // Upcoming deadlines (within 30 days)
    const today = new Date()
    const upcomingDeadlines = goals.filter(g => {
      if (!g.targetDate || g.status === 'COMPLETED') return false
      const daysUntil = Math.ceil(
        (new Date(g.targetDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysUntil <= 30 && daysUntil >= 0
    }).length

    // High priority goals
    const highPriority = goals.filter(
      g => g.priority === 'HIGH' || g.priority === 'CRITICAL'
    ).length

    // Streaks
    const currentStreak = Math.max(...goals.map(g => g.streak), 0)
    const longestStreak = Math.max(...goals.map(g => g.streak), 0)
    const totalActiveDays = goals.reduce((sum, g) => sum + g.streak, 0)

    // Category distribution
    const categoryDistribution = goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const stats: GoalStats = {
      total,
      active,
      completed,
      delayed,
      notStarted,
      totalHours,
      completedHours,
      averageProgress,
      upcomingDeadlines,
      highPriority,
      streaks: {
        current: currentStreak,
        longest: longestStreak,
        totalActiveDays
      },
      categoryDistribution
    }

    logger.info("Goal statistics fetched successfully", {
      functionName: "GoalService.getStatistics",
      metadata: { userId }
    })

    return stats
  }

  private static async updateGoalProgress(userId: string, goalId: string) {
    const goal = await GoalRepository.findById(goalId, userId)
    if (!goal || goal.milestones.length === 0) return

    const completedMilestones = goal.milestones.filter(m => m.completed).length
    const milestoneProgress = (completedMilestones / goal.milestones.length) * 100
    
    const totalProgress = Math.min(
      100, 
      milestoneProgress * 0.7 + (goal.completedHours / goal.totalHours) * 30
    )

    await GoalRepository.update(goalId, userId, {
      progress: Math.round(totalProgress)
    })
  }
}