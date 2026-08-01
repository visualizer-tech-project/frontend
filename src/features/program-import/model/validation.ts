import { z } from 'zod'

export const importProgramSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Введите название программы')
    .max(255, 'Слишком длинное название'),
  description: z.string().trim().optional(),
})

export type ImportProgramValues = z.infer<typeof importProgramSchema>
