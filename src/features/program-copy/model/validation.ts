import { z } from 'zod'

export const copyProgramSchema = z.object({
  title: z.string().trim().min(1, 'Укажи название программы').max(255, 'Максимум 255 символов'),
  description: z.string().trim().optional(),
})

export type CopyProgramValues = z.infer<typeof copyProgramSchema>
