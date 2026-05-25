import { z } from 'zod'

export const createCourseSchema = z.object({
  title: z.string().trim().min(1, 'Укажи название курса'),
  description: z.string().trim().optional(),
  type: z.enum(['required', 'elective'], {
    error: 'Выбери тип курса',
  }),
})

export type CreateCourseValues = z.infer<typeof createCourseSchema>
