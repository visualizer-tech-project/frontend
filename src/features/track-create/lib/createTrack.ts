import type { CareerTrack } from '@/entities/track'
import type { UserPublic } from '@/entities/user'
import type { CreateTrackValues } from '../model/validation'

interface CreateTrackParams {
  values: CreateTrackValues
  user: UserPublic | null
}

export const createTrack = ({ values, user }: CreateTrackParams) => {
  const now = new Date().toISOString()
  const trackId = Date.now()
  const fallbackUser: UserPublic = {
    id: 1,
    email: 'teacher@example.com',
    first_name: 'Иван',
    last_name: 'Петров',
    role: 'teacher',
    status: 'confirmed',
    created_at: now,
    updated_at: now,
  }
  const author = user ?? fallbackUser

  const track: CareerTrack = {
    id: trackId,
    title: values.title.trim(),
    description: values.description?.trim() || undefined,
    user_id: author.id,
    user: author,
    courses_count: 0,
    created_at: now,
    updated_at: now,
  }

  return {
    track,
    trackCourses: [],
  }
}
