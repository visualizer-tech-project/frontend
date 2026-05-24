import type { Course } from '@/entities/course'

export const getProgramCopyStats = (courses: Course[]) => ({
  electiveCount: courses.filter((course) => course.type === 'elective').length,
  requiredCount: courses.filter((course) => course.type === 'required').length,
  totalCount: courses.length,
})
