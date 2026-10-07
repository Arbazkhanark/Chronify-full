// src/modules/dashboard/dashboard.routes.ts
import { Router } from 'express'
import { DashboardController } from './dashboard.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { rateLimiter } from '../../middlewares/rate.limiter'

const router = Router()

router.use(authMiddleware)

// Main overview — everything for the dashboard
router.get('/overview', rateLimiter, DashboardController.getOverview)

// Weekly bar chart (lazy-loadable)
router.get(
  '/weekly-activity',
  rateLimiter,
  DashboardController.getWeeklyActivity
)

// Deep insights (heavy, cache 5 min)
router.get('/insights', rateLimiter, DashboardController.getInsights)

export default router