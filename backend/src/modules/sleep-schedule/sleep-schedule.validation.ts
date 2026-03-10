// // src/modules/sleep-schedule/sleep-schedule.validation.ts
// import { z } from 'zod'

// // Time validation helper
// const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

// // Day normalization function (store as uppercase full name)
// const normalizeSleepDay = (day: string): string => {
//   const dayMap: Record<string, string> = {
//     'mon': 'MONDAY', 'monday': 'MONDAY', 'Mon': 'MONDAY', 'MONDAY': 'MONDAY',
//     'tue': 'TUESDAY', 'tuesday': 'TUESDAY', 'Tue': 'TUESDAY', 'TUESDAY': 'TUESDAY',
//     'wed': 'WEDNESDAY', 'wednesday': 'WEDNESDAY', 'Wed': 'WEDNESDAY', 'WEDNESDAY': 'WEDNESDAY',
//     'thu': 'THURSDAY', 'thursday': 'THURSDAY', 'Thu': 'THURSDAY', 'THURSDAY': 'THURSDAY',
//     'fri': 'FRIDAY', 'friday': 'FRIDAY', 'Fri': 'FRIDAY', 'FRIDAY': 'FRIDAY',
//     'sat': 'SATURDAY', 'saturday': 'SATURDAY', 'Sat': 'SATURDAY', 'SATURDAY': 'SATURDAY',
//     'sun': 'SUNDAY', 'sunday': 'SUNDAY', 'Sun': 'SUNDAY', 'SUNDAY': 'SUNDAY'
//   }
  
//   const normalized = dayMap[day]
//   if (!normalized) {
//     throw new Error(`Invalid day: ${day}. Must be a valid day name`)
//   }
//   return normalized
// }

// // Base sleep schedule schema
// export const createSleepScheduleSchema = z.object({
//   day: z.string().transform(normalizeSleepDay),
//   bedtime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
//   wakeTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
//   isActive: z.boolean().default(true),
//   type: z.enum(['REGULAR', 'POWER_NAP', 'RECOVERY', 'EARLY', 'LATE']).default('REGULAR'),
//   notes: z.string().max(200, 'Notes too long').optional(),
//   color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
// }).refine(data => {
//   // Validate bedtime is different from wakeTime
//   if (data.bedtime === data.wakeTime) {
//     return false
//   }
//   return true
// }, {
//   message: "Bedtime and wake time cannot be the same",
//   path: ["bedtime"]
// })

// export const updateSleepScheduleSchema = createSleepScheduleSchema.partial()

// export const bulkSleepScheduleSchema = z.object({
//   schedules: z.array(createSleepScheduleSchema).min(1).max(7)
// })

// export const applyToAllSchema = z.object({
//   bedtime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
//   wakeTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
//   type: z.enum(['REGULAR', 'POWER_NAP', 'RECOVERY', 'EARLY', 'LATE']).optional(),
//   isActive: z.boolean().optional(),
//   notes: z.string().max(200, 'Notes too long').optional(),
// }).refine(data => {
//   if (data.bedtime === data.wakeTime) {
//     return false
//   }
//   return true
// }, {
//   message: "Bedtime and wake time cannot be the same",
//   path: ["bedtime"]
// })

// export const sleepFilterSchema = z.object({
//   day: z.string().transform(normalizeSleepDay).optional(),
//   isActive: z.boolean().optional(),
//   type: z.enum(['REGULAR', 'POWER_NAP', 'RECOVERY', 'EARLY', 'LATE']).optional(),
//   fromDate: z.string().datetime().optional(),
//   toDate: z.string().datetime().optional(),
// })

// export const sleepStatsQuerySchema = z.object({
//   weeks: z.number().int().min(1).max(52).default(4)
// })






// src/modules/sleep-schedule/sleep-schedule.validation.ts
import { z } from 'zod'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

const normalizeSleepDay = (day: string): string => {
  const dayMap: Record<string, string> = {
    'mon': 'MONDAY', 'monday': 'MONDAY', 'Mon': 'MONDAY', 'MONDAY': 'MONDAY',
    'tue': 'TUESDAY', 'tuesday': 'TUESDAY', 'Tue': 'TUESDAY', 'TUESDAY': 'TUESDAY',
    'wed': 'WEDNESDAY', 'wednesday': 'WEDNESDAY', 'Wed': 'WEDNESDAY', 'WEDNESDAY': 'WEDNESDAY',
    'thu': 'THURSDAY', 'thursday': 'THURSDAY', 'Thu': 'THURSDAY', 'THURSDAY': 'THURSDAY',
    'fri': 'FRIDAY', 'friday': 'FRIDAY', 'Fri': 'FRIDAY', 'FRIDAY': 'FRIDAY',
    'sat': 'SATURDAY', 'saturday': 'SATURDAY', 'Sat': 'SATURDAY', 'SATURDAY': 'SATURDAY',
    'sun': 'SUNDAY', 'sunday': 'SUNDAY', 'Sun': 'SUNDAY', 'SUNDAY': 'SUNDAY'
  }
  
  const normalized = dayMap[day]
  if (!normalized) {
    throw new Error(`Invalid day: ${day}. Must be a valid day name`)
  }
  return normalized
}

// 🔥 Using .superRefine() - More flexible
export const createSleepScheduleSchema = z.object({
  day: z.string().transform(normalizeSleepDay),
  bedtime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  wakeTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  isActive: z.boolean().default(true),
  type: z.enum(['REGULAR', 'POWER_NAP', 'RECOVERY', 'EARLY', 'LATE']).default('REGULAR'),
  notes: z.string().max(200, 'Notes too long').optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
}).superRefine((data, ctx) => {
  if (data.bedtime === data.wakeTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Bedtime and wake time cannot be the same",
      path: ["bedtime"]
    })
  }
})

// 🔥 For update schema, we need a separate base schema
const baseSleepScheduleSchema = z.object({
  day: z.string().transform(normalizeSleepDay),
  bedtime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  wakeTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  isActive: z.boolean().default(true),
  type: z.enum(['REGULAR', 'POWER_NAP', 'RECOVERY', 'EARLY', 'LATE']).default('REGULAR'),
  notes: z.string().max(200, 'Notes too long').optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
})

export const updateSleepScheduleSchema = baseSleepScheduleSchema.partial()

export const bulkSleepScheduleSchema = z.object({
  schedules: z.array(createSleepScheduleSchema).min(1).max(7)
})

// ────────────────────────────────────────────────
// Bulk Update Schema
// ────────────────────────────────────────────────
export const bulkUpdateSleepScheduleSchema = z.object({
  updates: z.array(
    z.object({
      scheduleId: z.string().uuid("Invalid schedule ID"),
      
      // All fields optional – send only what you want to change
      bedtime:   z.string().regex(timeRegex, "Invalid time format (HH:MM)").optional(),
      wakeTime:  z.string().regex(timeRegex, "Invalid time format (HH:MM)").optional(),
      isActive:  z.boolean().optional(),
      type:      z.enum(['REGULAR', 'POWER_NAP', 'RECOVERY', 'EARLY', 'LATE']).optional(),
      notes:     z.string().max(200).optional().nullable(),
      color:     z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional().nullable(),
    })
    .refine(data => Object.keys(data).length > 1, {
      message: "At least one field must be provided for update (besides scheduleId)"
    })
  )
  .min(1, "At least one schedule update is required")
  .max(50, "Maximum 50 schedules can be updated in one request")
});

// ────────────────────────────────────────────────
// Bulk Delete Schema
// ────────────────────────────────────────────────
export const bulkDeleteSleepScheduleSchema = z.object({
  scheduleIds: z.array(
    z.string().uuid("Invalid schedule ID")
  )
  .min(1, "At least one schedule ID is required")
  .max(100, "Maximum 100 schedules can be deleted in one request")
  .refine(ids => new Set(ids).size === ids.length, {
    message: "Duplicate schedule IDs are not allowed"
  })
});

export const applyToAllSchema = z.object({
  bedtime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  wakeTime: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  type: z.enum(['REGULAR', 'POWER_NAP', 'RECOVERY', 'EARLY', 'LATE']).optional(),
  isActive: z.boolean().optional(),
  notes: z.string().max(200, 'Notes too long').optional(),
}).superRefine((data, ctx) => {
  if (data.bedtime === data.wakeTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Bedtime and wake time cannot be the same",
      path: ["bedtime"]
    })
  }
})



export const sleepFilterSchema = z.object({
  day: z.string().transform(normalizeSleepDay).optional(),

  isActive: z.coerce.boolean().optional(),

  type: z.enum([
    'REGULAR',
    'POWER_NAP',
    'RECOVERY',
    'EARLY',
    'LATE'
  ]).optional(),

  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
})


export const sleepStatsQuerySchema = z.object({
  weeks: z.coerce.number().int().min(1).max(52).default(4)
})