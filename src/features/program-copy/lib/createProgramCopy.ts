import type { Course } from '@/entities/course'
import type { Prerequisite } from '@/entities/prerequisite'
import type { Program } from '@/entities/program'
import type { UserPublic } from '@/entities/user'
import type { CopyProgramValues } from '../model/validation'

interface CreateProgramCopyParams {
  values: CopyProgramValues
  sourceProgram: Program
  sourceCourses: Course[]
  sourcePrerequisites: Prerequisite[]
  user: UserPublic | null
}

export const createProgramCopy = ({
  values,
  sourceProgram,
  sourceCourses,
  sourcePrerequisites,
  user,
}: CreateProgramCopyParams) => {
  const now = new Date().toISOString()
  const programId = Date.now()
  const courseIdOffset = programId + 1000
  const prerequisiteIdOffset = programId + 5000
  const courseIdBySourceId = new Map<Course['id'], Course['id']>()

  const courses = sourceCourses.map((course, index) => {
    const courseId = courseIdOffset + index
    courseIdBySourceId.set(course.id, courseId)

    return {
      ...course,
      id: courseId,
      program_id: programId,
      user_id: user?.id ?? course.user_id,
      created_at: now,
      updated_at: now,
    }
  })

  const prerequisites = sourcePrerequisites
    .filter(
      (prerequisite) =>
        courseIdBySourceId.has(prerequisite.course_id) &&
        courseIdBySourceId.has(prerequisite.prerequisite_course_id),
    )
    .map((prerequisite, index) => ({
      ...prerequisite,
      id: prerequisiteIdOffset + index,
      course_id: courseIdBySourceId.get(prerequisite.course_id) as Course['id'],
      prerequisite_course_id: courseIdBySourceId.get(
        prerequisite.prerequisite_course_id,
      ) as Course['id'],
      created_at: now,
      updated_at: now,
    }))

  const program: Program = {
    ...sourceProgram,
    id: programId,
    title: values.title.trim(),
    description: values.description?.trim() || undefined,
    user_id: user?.id ?? sourceProgram.user_id,
    user: user ?? sourceProgram.user,
    created_at: now,
    updated_at: now,
  }

  return {
    program,
    courses,
    prerequisites,
  }
}
