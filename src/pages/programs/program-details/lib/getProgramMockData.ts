import { mockCourses } from '@/entities/course'
import { mockProgramPrerequisites } from '@/entities/prerequisite'
import { mockProgress } from '@/entities/progress'

const getProgramCourseIds = (targetProgramId: number) => {
  const courseIds = new Set(
    mockCourses
      .filter((course) => course.program_id === targetProgramId)
      .map((course) => course.id),
  )

  mockProgramPrerequisites
    .filter((prerequisite) => prerequisite.program_id === targetProgramId)
    .forEach((prerequisite) => {
      courseIds.add(prerequisite.course_id)
      courseIds.add(prerequisite.prerequisite_course_id)
    })

  return courseIds
}

export const getProgramCourses = (targetProgramId: number) => {
  const courseIds = getProgramCourseIds(targetProgramId)

  return mockCourses.filter((course) => courseIds.has(course.id))
}

export const getProgramPrerequisites = (targetProgramId: number) => {
  const courseIds = getProgramCourseIds(targetProgramId)

  return mockProgramPrerequisites.filter(
    (prerequisite) =>
      prerequisite.program_id === targetProgramId &&
      courseIds.has(prerequisite.course_id) &&
      courseIds.has(prerequisite.prerequisite_course_id),
  )
}

export const getProgramProgress = (targetProgramId: number, userId?: number) => {
  const courseIds = getProgramCourseIds(targetProgramId)

  return mockProgress.filter((item) => item.user_id === userId && courseIds.has(item.course_id))
}
