// src/modules/fixed-times/fixed-time.validation.ts
import { z } from 'zod'
import { FixedTimeType } from '../../generated/prisma/enums'

// Time validation helper
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

// Day options - accept multiple formats and normalize
const dayOptions = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Function to normalize day format (store as uppercase full name)
const normalizeDay = (day: string): string => {
  const dayMap: Record<string, string> = {
    'mon': 'MONDAY', 'monday': 'MONDAY', 'Mon': 'MONDAY', 'MONDAY': 'MONDAY',
    'tue': 'TUESDAY', 'tuesday': 'TUESDAY', 'Tue': 'TUESDAY', 'TUESDAY': 'TUESDAY',
    'wed': 'WEDNESDAY', 'wednesday': 'WEDNESDAY', 'Wed': 'WEDNESDAY', 'WEDNESDAY': 'WEDNESDAY',
    'thu': 'THURSDAY', 'thursday': 'THURSDAY', 'Thu': 'THURSDAY', 'THURSDAY': 'THURSDAY',
    'fri': 'FRIDAY', 'friday': 'FRIDAY', 'Fri': 'FRIDAY', 'FRIDAY': 'FRIDAY',
    'sat': 'SATURDAY', 'saturday': 'SATURDAY', 'Sat': 'SATURDAY', 'SATURDAY': 'SATURDAY',
    'sun': 'SUNDAY', 'sunday': 'SUNDAY', 'Sun': 'SUNDAY', 'SUNDAY': 'SUNDAY'
  }
  
  const normalized = dayMap[day.toLowerCase()]
  if (!normalized) {
    throw new Error(`Invalid day: ${day}. Valid options are: ${dayOptions.join(', ')}`)
  }
  return normalized
}

// Base schema without refinements (for partial use)
const baseFixedTimeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  days: z.array(z.string())
    .min(1, 'At least one day must be selected')
    .max(7, 'Maximum 7 days')
    .transform((days) => 
      days.map(day => normalizeDay(day))
    ),
  startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  type: z.enum(['COLLEGE', 'OFFICE', 'SCHOOL', 'COMMUTE', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT', 'FREE', 'FAMILY', 'HEALTH', 'OTHER']),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').default('#6B7280'),
  isEditable: z.boolean().default(false),
  freePeriods: z.array(z.object({
    title: z.string().max(50, 'Title is too long').optional(),
    startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
    endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
    day: z.string().transform(day => normalizeDay(day))
  })).optional()
})

// Create schema with refinements
export const createFixedTimeSchema = baseFixedTimeSchema.refine(data => {
  // Validate start time is before end time
  const start = data.startTime.split(':').map(Number)
  const end = data.endTime.split(':').map(Number)
  const startMinutes = start[0] * 60 + start[1]
  const endMinutes = end[0] * 60 + end[1]
  return startMinutes < endMinutes
}, {
  message: "Start time must be before end time",
  path: ["startTime"]
})

// Update schema - simplified
export const updateFixedTimeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long').optional(),
  description: z.string().max(500, 'Description is too long').optional().optional(),
  days: z.array(z.string())
    .min(1, 'At least one day must be selected')
    .max(7, 'Maximum 7 days')
    .transform((days) => days.map(day => normalizeDay(day)))
    .optional(),
  startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
  endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)').optional(),
  type: z.enum(['COLLEGE', 'OFFICE', 'SCHOOL', 'COMMUTE', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT', 'FREE', 'FAMILY', 'HEALTH', 'OTHER']).optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
  isEditable: z.boolean().optional(),
  freePeriods: z.array(z.object({
    title: z.string().max(50, 'Title is too long').optional(),
    startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
    endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
    day: z.string().transform(day => normalizeDay(day))
  })).optional()
}).refine(data => {
  // Only validate if both times are provided
  if (data.startTime && data.endTime) {
    const start = data.startTime.split(':').map(Number)
    const end = data.endTime.split(':').map(Number)
    const startMinutes = start[0] * 60 + start[1]
    const endMinutes = end[0] * 60 + end[1]
    return startMinutes < endMinutes
  }
  return true
}, {
  message: "Start time must be before end time",
  path: ["startTime"]
})

// Base free period schema
const baseFreePeriodSchema = z.object({
  title: z.string().max(50, 'Title is too long').default('Free Period'),
  startTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  day: z.string().transform(day => normalizeDay(day))
})

// Create free period schema
export const createFreePeriodSchema = baseFreePeriodSchema.refine(data => {
  const start = data.startTime.split(':').map(Number)
  const end = data.endTime.split(':').map(Number)
  const startMinutes = start[0] * 60 + start[1]
  const endMinutes = end[0] * 60 + end[1]
  return startMinutes < endMinutes
}, {
  message: "Start time must be before end time",
  path: ["startTime"]
})

// Update free period schema
export const updateFreePeriodSchema = baseFreePeriodSchema.partial().refine(data => {
  if (data.startTime && data.endTime) {
    const start = data.startTime.split(':').map(Number)
    const end = data.endTime.split(':').map(Number)
    const startMinutes = start[0] * 60 + start[1]
    const endMinutes = end[0] * 60 + end[1]
    return startMinutes < endMinutes
  }
  return true
}, {
  message: "Start time must be before end time",
  path: ["startTime"]
})




// ────────────────────────────────────────────────
// Bulk Create
// ────────────────────────────────────────────────
export const bulkCreateFixedTimeSchema = z.object({
  fixedTimes: z.array(createFixedTimeSchema)
    .min(1, "At least one fixed time is required")
    .max(20, "Maximum 20 fixed times per bulk request")
});

// ────────────────────────────────────────────────
// Bulk Update
// ────────────────────────────────────────────────
export const bulkUpdateFixedTimeSchema = z.object({
  updates: z.array(
    z.object({
      fixedTimeId: z.string().uuid("Invalid fixed time ID"),
      
      title:       z.string().min(1).max(100).optional(),
      description: z.string().max(500).optional(),
      days:        z.array(z.string().transform(normalizeDay)).min(1).max(7).optional(),
      startTime:   z.string().regex(timeRegex).optional(),
      endTime:     z.string().regex(timeRegex).optional(),
      type:        z.enum(FixedTimeType) .optional(),  // tumhare FixedTimeType enum se copy karo
      color:       z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
      isEditable:  z.boolean().optional(),
    })
    .refine(d => Object.keys(d).length > 1, {
      message: "At least one field to update (besides fixedTimeId)"
    })
  )
  .min(1).max(50)
});

// ────────────────────────────────────────────────
// Bulk Delete
// ────────────────────────────────────────────────
export const bulkDeleteFixedTimeSchema = z.object({
  fixedTimeIds: z.array(z.string().uuid("Invalid fixed time ID"))
    .min(1, "At least one ID required")
    .max(50, "Maximum 50 IDs per request")
    .refine(ids => new Set(ids).size === ids.length, {
      message: "Duplicate IDs not allowed"
    })
});








// Bulk Add Free Periods
export const bulkAddMultipleFreePeriodsSchema = z.object({
  entries: z.array(
    z.object({
      fixedTimeId: z.string().uuid("Invalid fixed time ID"),
      freePeriod: createFreePeriodSchema
    })
  )
  .min(1, "At least one entry required")
  .max(50, "Maximum 50 free periods in one request")
});

// Bulk Update Free Periods
export const bulkUpdateFreePeriodSchema = z.object({
  updates: z.array(
    z.object({
      freePeriodId: z.string().uuid("Invalid free period ID"),
      title:        z.string().max(50).optional(),
      startTime:    z.string().regex(timeRegex).optional(),
      endTime:      z.string().regex(timeRegex).optional(),
      day:          z.string().transform(normalizeDay).optional(),
    })
    .refine(d => Object.keys(d).length > 1, {
      message: "At least one field to update (besides freePeriodId)"
    })
  )
  .min(1, "At least one update required")
  .max(50)
});

// Bulk Delete Free Periods
export const bulkDeleteFreePeriodSchema = z.object({
  freePeriodIds: z.array(z.string().uuid("Invalid free period ID"))
    .min(1, "At least one ID required")
    .max(50)
    .refine(ids => new Set(ids).size === ids.length, {
      message: "Duplicate IDs not allowed"
    })
});






export const getFreePeriodsQuerySchema = z.object({
  fixedTimeId: z.string().uuid("Invalid fixed time ID").optional(),
  day: z.enum([
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
    "FRIDAY", "SATURDAY", "SUNDAY"
  ]).optional(),
  title: z.string().min(1).optional(),
  startTimeFrom: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  startTimeTo:   z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["createdAt", "startTime", "day"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc")
}).refine(data => {
  if (data.startTimeFrom && data.startTimeTo) {
    const from = data.startTimeFrom.split(':').map(Number);
    const to   = data.startTimeTo.split(':').map(Number);
    return (from[0] * 60 + from[1]) <= (to[0] * 60 + to[1]);
  }
  return true;
}, {
  message: "startTimeFrom must be before startTimeTo",
  path: ["startTimeFrom"]
});