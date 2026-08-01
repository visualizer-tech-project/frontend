import type { AddPrerequisiteApiV1CoursesCourseIdPrerequisitesPostData } from '@/shared/api/generated'

export const COURSE_NODE_PREFIX = 'course'
export const PREREQUISITE_PREFIX = 'prerequisite'

export type ProgramCourseConnection = {
  body: AddPrerequisiteApiV1CoursesCourseIdPrerequisitesPostData['body']
  path: AddPrerequisiteApiV1CoursesCourseIdPrerequisitesPostData['path']
}
