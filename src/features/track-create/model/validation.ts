import { z } from 'zod'

export const createTrackSchema = z.object({
  title: z.string().trim().min(1, 'Укажи название трека').max(255, 'Максимум 255 символов'),
  description: z.string().trim().optional(),
})

export type CreateTrackValues = z.infer<typeof createTrackSchema>
