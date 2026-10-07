// src/modules/dashboard/dashboard.controller.ts
import { Request, Response } from 'express'
import { DashboardService } from './dashboard.service'
import { AppError } from '../../utils/AppError'
import { logger } from 'patal-log'
import { insightsQuerySchema, weeklyActivityQuerySchema } from './dashboard.validation'
import { CACHE_KEYS, dashboardCache } from './dashboard.cache'

export class DashboardController {
  static async getOverview(req: Request, res: Response) {
    try {
      const userId = req.user!.id

      logger.info('Get dashboard overview called', {
        functionName: 'DashboardController.getOverview',
        metadata: { userId },
      })

      const data = await DashboardService.getOverview(userId)

      logger.info('Dashboard overview returned', {
        functionName: 'DashboardController.getOverview',
        metadata: { userId },
      })

      return res.status(200).json({
        success: true,
        data,
      })
    } catch (err: any) {
      logger.error(`Get dashboard failed: ${err.message}`, {
        functionName: 'DashboardController.getOverview',
        error: err.message,
      })

      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        })
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  }

  
    /* =========================================================
     GET /api/dashboard/weekly-activity
     ========================================================= */
  static async getWeeklyActivity(req: Request, res: Response) {
    try {
      const userId = req.user!.id
      const { weekOffset } = weeklyActivityQuerySchema.parse(req.query)

      logger.info('Get weekly activity called', {
        functionName: 'DashboardController.getWeeklyActivity',
        metadata: { userId, weekOffset },
      })

      const cacheKey = CACHE_KEYS.weekly(userId, weekOffset)
      const cached = dashboardCache.get(cacheKey)
      if (cached) {
        return res.status(200).json({ success: true, data: cached })
      }

      const data = await DashboardService.getWeeklyActivity(userId, weekOffset)
      dashboardCache.set(cacheKey, data, 60) // 60s

      return res.status(200).json({ success: true, data })
    } catch (err: any) {
      logger.error(`Get weekly activity failed: ${err.message}`, {
        functionName: 'DashboardController.getWeeklyActivity',
        error: err.message,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' })
    }
  }

  /* =========================================================
     GET /api/dashboard/insights
     ========================================================= */
  static async getInsights(req: Request, res: Response) {
    try {
      const userId = req.user!.id
      const { range } = insightsQuerySchema.parse(req.query)

      logger.info('Get insights called', {
        functionName: 'DashboardController.getInsights',
        metadata: { userId, range },
      })

      const cacheKey = CACHE_KEYS.insights(userId, range)
      const cached = dashboardCache.get(cacheKey)
      if (cached) {
        return res.status(200).json({ success: true, data: cached })
      }

      const data = await DashboardService.getInsights(userId, range)
      dashboardCache.set(cacheKey, data, 300) // 5 min

      return res.status(200).json({ success: true, data })
    } catch (err: any) {
      logger.error(`Get insights failed: ${err.message}`, {
        functionName: 'DashboardController.getInsights',
        error: err.message,
      })

      if (err instanceof AppError) {
        return res
          .status(err.statusCode)
          .json({ success: false, message: err.message })
      }

      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' })
    }
  }



}