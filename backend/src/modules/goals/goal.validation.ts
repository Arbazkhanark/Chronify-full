// src/modules/goals/goal.validation.ts
import { z } from 'zod'

export const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  category: z.enum(['ACADEMIC', 'PROFESSIONAL', 'HEALTH', 'PERSONAL', 'SKILL_DEVELOPMENT', 'FINANCIAL', 'SOCIAL', 'CREATIVE']),
  subject: z.string().max(100, 'Subject is too long').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  type: z.enum(['SHORT_TERM', 'LONG_TERM']),
  targetDate: z.string().datetime().optional(),
  totalHours: z.number().int().min(0).default(0),
  weeklyTarget: z.number().int().min(0).max(168).default(5),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).default('#3B82F6'),
  tags: z.array(z.string().max(50)).default([]),
  isPublic: z.boolean().default(false),
})

export const updateGoalSchema = createGoalSchema.partial().extend({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'FAILED']).optional(),
  progress: z.number().min(0).max(100).optional(),
  completedHours: z.number().int().min(0).optional(),
  streak: z.number().int().min(0).optional(),
})

export const createMilestoneSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  targetDate: z.string().datetime().optional(),
})

export const updateMilestoneSchema = createMilestoneSchema.partial().extend({
  completed: z.boolean().optional(),
  progress: z.number().min(0).max(100).optional(),
})

export const progressUpdateSchema = z.object({
  hours: z.number().int().min(0.1).max(24),
})

export const goalFilterSchema = z.object({
  filter: z.enum(['all', 'active', 'completed', 'delayed', 'not_started', 'short', 'long']).optional(),
  search: z.string().optional(),
  sort: z.enum(['priority', 'progress', 'deadline', 'created', 'title']).optional(),
  category: z.enum(['ACADEMIC', 'PROFESSIONAL', 'HEALTH', 'PERSONAL', 'SKILL_DEVELOPMENT', 'FINANCIAL', 'SOCIAL', 'CREATIVE']).optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'FAILED']).optional(),
  type: z.enum(['SHORT_TERM', 'LONG_TERM']).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  page: z.number().int().min(1).default(1),
})