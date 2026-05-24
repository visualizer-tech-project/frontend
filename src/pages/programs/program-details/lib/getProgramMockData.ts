import { mockCourses } from '@/entities/course'
import { mockPrerequisites } from '@/entities/prerequisite'
import { mockProgress } from '@/entities/progress'

export const getProgramCourses = (targetProgramId: number) =>
  mockCourses.filter((course) => course.program_id === targetProgramId)

const getProgramCourseIds = (targetProgramId: number) =>
  new Set(getProgramCourses(targetProgramId).map((course) => course.id))

export const getProgramPrerequisites = (targetProgramId: number) => {
  const courseIds = getProgramCourseIds(targetProgramId)

  return mockPrerequisites.filter(
    (prerequisite) =>
      courseIds.has(prerequisite.course_id) && courseIds.has(prerequisite.prerequisite_course_id),
  )
}

export const getProgramProgress = (targetProgramId: number, userId?: number) => {
  const courseIds = getProgramCourseIds(targetProgramId)

  return mockProgress.filter((item) => item.user_id === userId && courseIds.has(item.course_id))
}
