import { mockCourses, type Course } from '@/entities/course'
import { mockPrerequisites, type Prerequisite } from '@/entities/prerequisite'
import { mockPrograms, type Program } from '@/entities/program'

interface AddProgramCopyToMocksParams {
  program: Program
  courses: Course[]
  prerequisites: Prerequisite[]
}

export const addProgramCopyToMocks = ({
  program,
  courses,
  prerequisites,
}: AddProgramCopyToMocksParams) => {
  mockPrograms.push(program)
  mockCourses.push(...courses)
  mockPrerequisites.push(...prerequisites)
}
