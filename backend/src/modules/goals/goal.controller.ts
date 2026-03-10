// src/modules/goals/goal.controller.ts
import { Request, Response } from "express"
import { GoalService } from "./goal.service"
import {
  createGoalSchema,
  updateGoalSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  progressUpdateSchema,
  goalFilterSchema,
} from "./goal.validation"
import { AuthRequest } from "../../middlewares/auth.middleware"
import { AppError } from "../../utils/AppError"
import { logger } from "patal-log"
import { GoalFilterDTO, UpdateGoalDTO } from "./goal.types"

export class GoalController {
  static async createGoal(req: AuthRequest, res: Response) {
    try {
      const payload = createGoalSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Create goal API called", {
        functionName: "GoalController.createGoal",
        metadata: { userId }
      })

      const goal = await GoalService.createGoal(userId, payload)

      logger.info("Goal created successfully", {
        functionName: "GoalController.createGoal",
        metadata: { userId, goalId: goal.id }
      })

      res.status(201).json({
        success: true,
        message: "Goal created successfully",
        data: goal,
      })
    } catch (err: any) {
      logger.error(`Create goal failed: ${err.message}`, {
        functionName: "GoalController.createGoal",
        error: err.message,
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

  static async getGoal(req: AuthRequest, res: Response) {
    try {
      let { goalId } = req.params
      const userId = req.user!.id

      if (Array.isArray(goalId)) {
        goalId = goalId[0]
      }

      logger.info("Get goal API called", {
        functionName: "GoalController.getGoal",
        metadata: { userId, goalId }
      })

      const goal = await GoalService.getGoal(userId, goalId)

      logger.info("Goal fetched successfully", {
        functionName: "GoalController.getGoal",
        metadata: { userId, goalId }
      })

      res.status(200).json({
        success: true,
        data: goal,
      })
    } catch (err: any) {
      logger.error(`Get goal failed: ${err.message}`, {
        functionName: "GoalController.getGoal",
        error: err.message,
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

  static async getGoals(req: AuthRequest, res: Response) {
    try {
      const filters = goalFilterSchema.parse(req.query)
      const userId = req.user!.id

      logger.info("Get goals API called", {
        functionName: "GoalController.getGoals",
        metadata: { userId, filters }
      })

      const result = await GoalService.getGoals(userId, filters as GoalFilterDTO)

      logger.info("Goals fetched successfully", {
        functionName: "GoalController.getGoals",
        metadata: { userId, count: result.total }
      })

      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (err: any) {
      logger.error(`Get goals failed: ${err.message}`, {
        functionName: "GoalController.getGoals",
        error: err.message,
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

  static async updateGoal(req: AuthRequest, res: Response) {
    try {
      const { goalId } = req.params
      const payload = updateGoalSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Update goal API called", {
        functionName: "GoalController.updateGoal",
        metadata: { userId, goalId }
      })

      const goal = await GoalService.updateGoal(userId, goalId as string, payload as UpdateGoalDTO)

      logger.info("Goal updated successfully", {
        functionName: "GoalController.updateGoal",
        metadata: { userId, goalId }
      })

      res.status(200).json({
        success: true,
        message: "Goal updated successfully",
        data: goal,
      })
    } catch (err: any) {
      logger.error(`Update goal failed: ${err.message}`, {
        functionName: "GoalController.updateGoal",
        error: err.message,
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

  static async deleteGoal(req: AuthRequest, res: Response) {
    try {
      const { goalId } = req.params
      const userId = req.user!.id

      logger.info("Delete goal API called", {
        functionName: "GoalController.deleteGoal",
        metadata: { userId, goalId }
      })

      await GoalService.deleteGoal(userId, goalId as string)

      logger.info("Goal deleted successfully", {
        functionName: "GoalController.deleteGoal",
        metadata: { userId, goalId }
      })

      res.status(200).json({
        success: true,
        message: "Goal deleted successfully",
      })
    } catch (err: any) {
      logger.error(`Delete goal failed: ${err.message}`, {
        functionName: "GoalController.deleteGoal",
        error: err.message,
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

  static async addMilestone(req: AuthRequest, res: Response) {
    try {
      const { goalId } = req.params
      const payload = createMilestoneSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Add milestone API called", {
        functionName: "GoalController.addMilestone",
        metadata: { userId, goalId }
      })

      const milestone = await GoalService.addMilestone(userId, goalId as string, payload)

      logger.info("Milestone added successfully", {
        functionName: "GoalController.addMilestone",
        metadata: { userId, goalId, milestoneId: milestone.id }
      })

      res.status(201).json({
        success: true,
        message: "Milestone added successfully",
        data: milestone,
      })
    } catch (err: any) {
      logger.error(`Add milestone failed: ${err.message}`, {
        functionName: "GoalController.addMilestone",
        error: err.message,
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

  static async updateMilestone(req: AuthRequest, res: Response) {
    try {
      const { goalId, milestoneId } = req.params
      const payload = updateMilestoneSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Update milestone API called", {
        functionName: "GoalController.updateMilestone",
        metadata: { userId, goalId, milestoneId }
      })

      const milestone = await GoalService.updateMilestone(
        userId, 
        goalId as string, 
        milestoneId as string, 
        payload
      )

      logger.info("Milestone updated successfully", {
        functionName: "GoalController.updateMilestone",
        metadata: { userId, goalId, milestoneId }
      })

      res.status(200).json({
        success: true,
        message: "Milestone updated successfully",
        data: milestone,
      })
    } catch (err: any) {
      logger.error(`Update milestone failed: ${err.message}`, {
        functionName: "GoalController.updateMilestone",
        error: err.message,
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

  static async deleteMilestone(req: AuthRequest, res: Response) {
    try {
      const { goalId, milestoneId } = req.params
      const userId = req.user!.id

      logger.info("Delete milestone API called", {
        functionName: "GoalController.deleteMilestone",
        metadata: { userId, goalId, milestoneId }
      })

      await GoalService.deleteMilestone(userId, goalId as string, milestoneId as string)

      logger.info("Milestone deleted successfully", {
        functionName: "GoalController.deleteMilestone",
        metadata: { userId, goalId, milestoneId }
      })

      res.status(200).json({
        success: true,
        message: "Milestone deleted successfully",
      })
    } catch (err: any) {
      logger.error(`Delete milestone failed: ${err.message}`, {
        functionName: "GoalController.deleteMilestone",
        error: err.message,
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

  static async updateProgress(req: AuthRequest, res: Response) {
    try {
      const { goalId } = req.params
      const { hours } = progressUpdateSchema.parse(req.body)
      const userId = req.user!.id

      logger.info("Update progress API called", {
        functionName: "GoalController.updateProgress",
        metadata: { userId, goalId, hours }
      })

      const goal = await GoalService.updateProgress(userId, goalId as string, hours)

      logger.info("Progress updated successfully", {
        functionName: "GoalController.updateProgress",
        // metadata: { userId, goalId, newProgress: goal?.progress }
        metadata: { userId, goalId, newProgress: goal }
      })

      res.status(200).json({
        success: true,
        message: "Progress updated successfully",
        data: goal,
      })
    } catch (err: any) {
      logger.error(`Update progress failed: ${err.message}`, {
        functionName: "GoalController.updateProgress",
        error: err.message,
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

  static async getStatistics(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id

      logger.info("Get statistics API called", {
        functionName: "GoalController.getStatistics",
        metadata: { userId }
      })

      const stats = await GoalService.getStatistics(userId)

      logger.info("Statistics fetched successfully", {
        functionName: "GoalController.getStatistics",
        metadata: { userId }
      })

      res.status(200).json({
        success: true,
        data: stats,
      })
    } catch (err: any) {
      logger.error(`Get statistics failed: ${err.message}`, {
        functionName: "GoalController.getStatistics",
        error: err.message,
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