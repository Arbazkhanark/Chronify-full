// src/modules/dashboard/dashboard.validation.ts
import { z } from 'zod'


/* GET /overview — no query params needed (uses today by default) */
export const overviewQuerySchema = z.object({
  date: z.string().optional(), // YYYY-MM-DD (optional override)
})



/* GET /weekly-activity?weekOffset=0 */
export const weeklyActivityQuerySchema = z.object({
  weekOffset: z
    .preprocess(
      v => (v === undefined || v === '' ? 0 : Number(v)),
      z.number().int().min(-52).max(52)
    )
    .default(0),
})

/* GET /insights?range=8w */
export const insightsQuerySchema = z.object({
  range: z.enum(['4w', '8w', '12w', 'all']).default('8w'),
})
