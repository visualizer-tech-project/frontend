import { z } from 'zod'

export const courseDirections = [
  'Программирование',
  'Анализ данных',
  'Дизайн',
  'Менеджмент',
  'Другое',
] as const

export const courseSuggestionSchema = z.object({
  title: z.string().trim().min(3, 'Введите минимум 3 символа').max(120, 'Максимум 120 символов'),
  description: z
    .string()
    .trim()
    .min(20, 'Описание должно содержать минимум 20 символов')
    .max(2000, 'Максимум 2000 символов'),
  direction: z.enum(courseDirections, { error: 'Выберите направление' }),
  materialsUrl: z
    .string()
    .trim()
    .max(2048, 'Максимум 2048 символов')
    .refine((value) => {
      if (!value) return true
      try {
        const url = new URL(value)
        return url.protocol === 'https:' || url.protocol === 'http:'
      } catch {
        return false
      }
    }, 'Укажите ссылку с http:// или https://'),
  email: z
    .string()
    .trim()
    .min(1, 'Укажите email')
    .email('Введите корректный email')
    .max(254, 'Максимум 254 символа'),
})

export type CourseSuggestionValues = z.infer<typeof courseSuggestionSchema>
