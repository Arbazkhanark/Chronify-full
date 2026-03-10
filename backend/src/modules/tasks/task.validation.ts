// src/modules/tasks/task.validation.ts
import { z } from 'zod'
import { ca } from 'zod/v4/locales'

// Time validation helper
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

// Day normalization function
const normalizeDay = (day: string): string => {
  const dayMap: Record<string, string> = {
    'mon': 'Mon', 'monday': 'Mon', 'Mon': 'Mon', 'MONDAY': 'Mon',
    'tue': 'Tue', 'tuesday': 'Tue', 'Tue': 'Tue', 'TUESDAY': 'Tue',
    'wed': 'Wed', 'wednesday': 'Wed', 'Wed': 'Wed', 'WEDNESDAY': 'Wed',
    'thu': 'Thu', 'thursday': 'Thu', 'Thu': 'Thu', 'THURSDAY': 'Thu',
    'fri': 'Fri', 'friday': 'Fri', 'Fri': 'Fri', 'FRIDAY': 'Fri',
    'sat': 'Sat', 'saturday': 'Sat', 'Sat': 'Sat', 'SATURDAY': 'Sat',
    'sun': 'Sun', 'sunday': 'Sun', 'Sun': 'Sun', 'SUNDAY': 'Sun'
  }
  
  const normalized = dayMap[day.toLowerCase()]
  if (!normalized) {
    throw new Error(`Invalid day: ${day}`)
  }
  return normalized
}

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  subject: z.string().max(100, 'Subject is too long').optional(),
  startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  duration: z.number().int().min(15, 'Minimum duration is 15 minutes').max(480, 'Maximum duration is 8 hours'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').default('#3B82F6'),
  day: z.string().transform(normalizeDay),
  type: z.enum(['TASK', 'FIXED', 'BREAK', 'COMMUTE', 'FREE', 'CLASS', 'STUDY', 'HEALTH', 'PROJECT', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT']),
  category: z.enum(['ACADEMIC', 'PROFESSIONAL', 'HEALTH', 'PERSONAL', 'LEARNING', 'BREAK', 'COMMUTE', 'PROJECT', 'SLEEP']).optional(),
  
  // Optional relationships
  goalId: z.string().uuid('Invalid goal ID').optional(),
  milestoneId: z.string().uuid('Invalid milestone ID').optional(),
  fixedTimeId: z.string().uuid('Invalid fixed time ID').optional(),
  
  // Metadata
  isFreePeriod: z.boolean().default(false),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(['PENDING', 'ONGOING', 'COMPLETED', 'MISSED']).optional(),
  isCompleted: z.boolean().optional(),
  completedAt: z.string().datetime().optional(),
  endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
})

export const bulkCreateTaskSchema = z.object({
  tasks: z.array(createTaskSchema).min(1, 'At least one task is required').max(50, 'Maximum 50 tasks per request')
})

// ────────────────────────────────────────────────
// Existing schemas (keep them as is)
// ────────────────────────────────────────────────

// ... your existing createTaskSchema, updateTaskSchema, bulkCreateTaskSchema ...

// New: Bulk Update Schema
export const bulkUpdateTaskSchema = z.object({
  updates: z.array(
    z.object({
      taskId: z.string().uuid('Invalid task ID'),
      
      // All fields are optional — only send what you want to update
      title: z.string().min(1).max(200).optional(),
      subject: z.string().max(100).optional(),
      startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
      endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
      duration: z.number().int().min(15).max(480).optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
      color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
      day: z.string().transform(normalizeDay).optional(),
      type: z.enum([
        'TASK', 'FIXED', 'BREAK', 'COMMUTE', 'FREE', 'CLASS', 'STUDY',
        'HEALTH', 'PROJECT', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT'
      ]).optional(),
      category: z.enum([
        'ACADEMIC', 'PROFESSIONAL', 'HEALTH', 'PERSONAL', 'LEARNING',
        'BREAK', 'COMMUTE', 'PROJECT', 'SLEEP'
      ]).optional(),
      
      // Status / completion fields
      status: z.enum(['PENDING', 'ONGOING', 'COMPLETED', 'MISSED']).optional(),
      isCompleted: z.boolean().optional(),
      completedAt: z.string().datetime().optional(),

      // Relations (can be updated / cleared)
      goalId: z.string().uuid().nullable().optional(),     // null = remove relation
      milestoneId: z.string().uuid().nullable().optional(),
      fixedTimeId: z.string().uuid().nullable().optional(),
      
      // Optional note field
      note: z.string().max(500).optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 1, // at least taskId + one field to update
      { message: "At least one field must be provided for update (besides taskId)" }
    )
  )
  .min(1, 'At least one task update is required')
  .max(50, 'Maximum 50 tasks can be updated in one request'),
});



// src/modules/tasks/task.validation.ts

// ... existing schemas ...

export const bulkDeleteTaskSchema = z.object({
  taskIds: z.array(
    z.string().uuid('Invalid task ID')
  )
  .min(1, 'At least one task ID is required')
  .max(100, 'Maximum 100 tasks can be deleted in one request')
  .refine(ids => new Set(ids).size === ids.length, {
    message: 'Duplicate task IDs are not allowed'
  })
});

export const dragDropSchema1 = z.object({
  taskId: z.string().uuid('Invalid task ID'),
  day: z.string().transform(normalizeDay),
  time: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  duration: z.number().int().min(15, 'Minimum duration is 15 minutes').max(480, 'Maximum duration is 8 hours'),
  fixedTimeId: z.string().uuid('Invalid fixed time ID').optional(),
})

export const taskFilterSchema = z.object({
  day: z.string().transform(normalizeDay).optional(),
  goalId: z.string().uuid('Invalid goal ID').optional(),
  fixedTimeId: z.string().uuid('Invalid fixed time ID').optional(),
  status: z.enum(['PENDING', 'ONGOING', 'COMPLETED', 'MISSED']).optional(),
  type: z.enum(['TASK', 'FIXED', 'BREAK', 'COMMUTE', 'FREE', 'CLASS', 'STUDY', 'HEALTH', 'PROJECT', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  isCompleted: z.boolean().optional(),
  search: z.string().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  sort: z.enum(['time', 'priority', 'day', 'created']).optional(),
  limit: z.number().int().min(1).max(100).default(50),
  page: z.number().int().min(1).default(1),
})





export const dragDropSchema = z.object({
  // Accept both formats
  taskId: z.string().uuid('Invalid task ID'),
  
  // Accept both 'day' and 'newDay'
  day: z.string().transform(normalizeDay).optional(),
  newDay: z.string().transform(normalizeDay).optional(),
  
  // Accept both 'time' and 'newStartTime'
  time: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
  newStartTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
  
  // Accept both 'duration' and 'newDuration'
  duration: z.number().int().min(15, 'Minimum duration is 15 minutes').max(480, 'Maximum duration is 8 hours').optional(),
  newDuration: z.number().int().min(15, 'Minimum duration is 15 minutes').max(480, 'Maximum duration is 8 hours').optional(),
  
  // Optional fields
  newEndTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
  fixedTimeId: z.string().uuid('Invalid fixed time ID').optional(),
})
.refine((data) => {
  // Ensure we have either day or newDay
  return !!(data.day || data.newDay);
}, {
  message: "Either 'day' or 'newDay' is required",
  path: ["day"]
})
.refine((data) => {
  // Ensure we have either time or newStartTime
  return !!(data.time || data.newStartTime);
}, {
  message: "Either 'time' or 'newStartTime' is required",
  path: ["time"]
})
.refine((data) => {
  // Ensure we have either duration or newDuration
  return !!(data.duration || data.newDuration);
}, {
  message: "Either 'duration' or 'newDuration' is required",
  path: ["duration"]
})
.transform((data) => {
  // Normalize to standard format
  return {
    taskId: data.taskId,
    day: data.day || data.newDay,
    time: data.time || data.newStartTime,
    duration: data.duration || data.newDuration,
    fixedTimeId: data.fixedTimeId
  }
})