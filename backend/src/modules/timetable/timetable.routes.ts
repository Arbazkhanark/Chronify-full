// src/modules/timetable/timetable.routes.ts

import { Router } from 'express'
import { TimetableController } from './timetable.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { rateLimiter } from '../../middlewares/rate.limiter'

const router = Router()

// 🔒 Apply auth middleware to all routes
router.use(authMiddleware)

// ==================== 📅 TIMETABLE VIEWS ====================
/**
 * Get timetable for today or specific day
 * GET /api/v1/timetable?day=Wed&showWeekends=true&compact=false
 */
router.get('/', rateLimiter, TimetableController.getTimetable)

router.get("/full", rateLimiter, TimetableController.getFullTimetable);

/**
 * Get timetable statistics
 * GET /api/v1/timetable/stats?weeks=4
 */
router.get('/stats', rateLimiter, TimetableController.getStatistics)

/**
 * Get bedtime for today
 * GET /api/v1/timetable/bedtime
 */
router.get('/bedtime', rateLimiter, TimetableController.getTodayBedtime)

// ==================== ⏰ TASK ACTIONS ====================
/**
 * Start a task
 * POST /api/v1/timetable/tasks/:taskId/start
 */
router.post('/tasks/:taskId/start', rateLimiter, TimetableController.startTask)

/**
 * Complete a task with feedback
 * POST /api/v1/timetable/tasks/:taskId/complete
 */
router.post('/tasks/:taskId/complete', rateLimiter, TimetableController.completeTask)

/**
 * Skip a task
 * POST /api/v1/timetable/tasks/:taskId/skip
 */
router.post('/tasks/:taskId/skip', rateLimiter, TimetableController.skipTask)

/**
 * Mark task as missed
 * POST /api/v1/timetable/tasks/:taskId/missed
 */
router.post('/tasks/:taskId/missed', rateLimiter, TimetableController.markAsMissed)

/**
 * Update task status (generic)
 * PUT /api/v1/timetable/tasks/:taskId/status
 */
router.put('/tasks/:taskId/status', rateLimiter, TimetableController.updateTaskStatus)

// ==================== 🎯 SMART DELAY ====================
/**
 * Get smart delay options for a task
 * POST /api/v1/timetable/smart-delay/options
 */
router.post('/smart-delay/options', rateLimiter, TimetableController.getSmartDelayOptions)

/**
 * Apply smart delay
 * POST /api/v1/timetable/smart-delay/apply
 */
router.post('/smart-delay/apply', rateLimiter, TimetableController.applySmartDelay)

/**
 * Simple delay (backward compatibility)
 * POST /api/v1/timetable/simple-delay
 */
router.post('/simple-delay', rateLimiter, TimetableController.simpleDelay)

/**
 * Reschedule missed task to free period
 * POST /api/v1/timetable/reschedule-to-free-period
 */
router.post('/reschedule-to-free-period', rateLimiter, TimetableController.rescheduleToFreePeriod)

// ==================== 📝 TASK FEEDBACK ====================
/**
 * Submit task feedback
 * POST /api/v1/timetable/tasks/:taskId/feedback
 */
router.post('/tasks/:taskId/feedback', rateLimiter, TimetableController.submitTaskFeedback)

/**
 * Get task feedback
 * GET /api/v1/timetable/tasks/:taskId/feedback
 */
router.get('/tasks/:taskId/feedback', rateLimiter, TimetableController.getTaskFeedback)

// ==================== ⚡ GRACE PERIOD ====================
/**
 * Get tasks in grace period (ended within last 1 hour)
 * GET /api/v1/timetable/grace-period
 */
router.get('/grace-period', rateLimiter, TimetableController.getGracePeriodTasks)

/**
 * Get missed tasks (can still complete today)
 * GET /api/v1/timetable/missed-tasks
 */
router.get('/missed-tasks', rateLimiter, TimetableController.getMissedTasks)

// ==================== 📊 DAY/WEEK VIEWS ====================
/**
 * Get tasks for a specific day
 * GET /api/v1/timetable/day/:day
 */
router.get('/day/:day', rateLimiter, TimetableController.getTasksByDay)

/**
 * Get active tasks (currently running)
 * GET /api/v1/timetable/active
 */
router.get('/active', rateLimiter, TimetableController.getActiveTasks)

/**
 * Get upcoming tasks
 * GET /api/v1/timetable/upcoming
 */
router.get('/upcoming', rateLimiter, TimetableController.getUpcomingTasks)

// ==================== 📦 BULK OPERATIONS ====================
/**
 * Complete multiple tasks at once
 * POST /api/v1/timetable/bulk/complete
 */
router.post('/bulk/complete', rateLimiter, TimetableController.bulkCompleteTasks)

/**
 * Delay multiple tasks at once
 * POST /api/v1/timetable/bulk/delay
 */
router.post('/bulk/delay', rateLimiter, TimetableController.bulkDelayTasks)



// router.get('/get-all-tasks', rateLimiter, TimetableController.getAllTasks)












// ==================== 🔒 LOCK TIMETABLE ====================
/**
 * Lock the current timetable draft
 * POST /api/v1/timetable/lock
 * Body: { fixedTimes: [...], sleepSchedules: [...], tasks: [...] }
 * - Atomic: ya to sab save, ya kuch nahi
 * - After success: local draft clear ho jayega
 */
router.post('/lock', rateLimiter,authMiddleware, TimetableController.lockTimetable);



// ==================== 🗑️ RESET TIMETABLE ====================
/**
 * Reset/clear entire user timetable
 * DELETE /api/v1/timetable/reset
 * - Deletes all tasks, fixed commitments, free periods, sleep schedules for the user
 * - Cannot be undone
 */
router.delete('/reset', rateLimiter, authMiddleware, TimetableController.resetTimetable);





export default router