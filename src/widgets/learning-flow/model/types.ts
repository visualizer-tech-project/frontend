import type { PostCoursesByCourseIdPrerequisitesData } from '@/shared/api/generated'

export const COURSE_NODE_PREFIX = 'course'
export const PREREQUISITE_PREFIX = 'prerequisite'

export type ProgramCourseConnection = {
  body: PostCoursesByCourseIdPrerequisitesData['body']
  path: PostCoursesByCourseIdPrerequisitesData['path']
}
