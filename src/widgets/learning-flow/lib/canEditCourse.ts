import type { Course } from '@/entities/course'
import type { UserPublic } from '@/entities/user'

export const canEditCourse = (user: UserPublic | null, course: Course) =>
  user?.role === 'admin' || course.user_id === user?.id
