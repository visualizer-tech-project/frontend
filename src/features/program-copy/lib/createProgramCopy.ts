import type { Course } from '@/entities/course'
import type { ProgramPrerequisite } from '@/entities/prerequisite'
import type { Program } from '@/entities/program'
import type { UserPublic } from '@/entities/user'
import type { CopyProgramValues } from '../model/validation'

interface CreateProgramCopyParams {
  values: CopyProgramValues
  sourceProgram: Program
  sourceCourses: Course[]
  sourcePrerequisites: ProgramPrerequisite[]
  existingProgramIds: Program['id'][]
  existingPrerequisiteIds: ProgramPrerequisite['id'][]
  user: UserPublic | null
}

const RANDOM_ID_HEX_LENGTH = 12
const FALLBACK_RANDOM_ID_MAX = Number.MAX_SAFE_INTEGER - 1

const createRandomNumericId = () => {
  const uuid = globalThis.crypto?.randomUUID?.()

  if (uuid) {
    return Number.parseInt(uuid.replaceAll('-', '').slice(0, RANDOM_ID_HEX_LENGTH), 16)
  }

  return Math.floor(Math.random() * FALLBACK_RANDOM_ID_MAX) + 1
}

const reserveMockId = (reservedIds: Set<number>) => {
  let id = createRandomNumericId()

  while (id <= 0 || reservedIds.has(id)) {
    id = createRandomNumericId()
  }

  reservedIds.add(id)

  return id
}

export const createProgramCopy = ({
  values,
  sourceProgram,
  sourceCourses,
  sourcePrerequisites,
  existingProgramIds,
  existingPrerequisiteIds,
  user,
}: CreateProgramCopyParams) => {
  const now = new Date().toISOString()
  const programId = reserveMockId(new Set(existingProgramIds))
  const courseIds = sourceCourses.map((course) => course.id)
  const courseIdSet = new Set(courseIds)
  const reservedPrerequisiteIds = new Set(existingPrerequisiteIds)
  const prerequisites = sourcePrerequisites
    .filter(
      (prerequisite) =>
        courseIdSet.has(prerequisite.course_id) &&
        courseIdSet.has(prerequisite.prerequisite_course_id),
    )
    .map((prerequisite) => ({
      ...prerequisite,
      id: reserveMockId(reservedPrerequisiteIds),
      program_id: programId,
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
    prerequisites,
  }
}
