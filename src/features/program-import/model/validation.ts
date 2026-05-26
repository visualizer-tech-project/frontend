import type { ProgramCreate } from '@/shared/api/generated'
import { z } from 'zod'

export const importProgramSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Введите название программы')
    .max(255, 'Слишком длинное название'),
  description: z.string().trim().optional(),
}) satisfies z.ZodType<ProgramCreate>

export type ImportProgramValues = ProgramCreate
