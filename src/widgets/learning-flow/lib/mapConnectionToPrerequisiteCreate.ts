import type { PrerequisiteCreate } from '@/entities/prerequisite'
import type { Connection } from '@xyflow/react'
import { COURSE_NODE_PREFIX } from '../model/types'

interface MapConnectionToPrerequisiteCreateResult {
  courseId: number
  payload: PrerequisiteCreate
}

export const mapConnectionToPrerequisiteCreate = (
  connection: Connection,
): MapConnectionToPrerequisiteCreateResult | null => {
  if (!connection.source || !connection.target) {
    return null
  }

  const sourceCourseId = Number(connection.source.replace(`${COURSE_NODE_PREFIX}-`, ''))

  const targetCourseId = Number(connection.target.replace(`${COURSE_NODE_PREFIX}-`, ''))

  if (!Number.isFinite(sourceCourseId) || !Number.isFinite(targetCourseId)) {
    return null
  }

  return {
    courseId: targetCourseId,
    payload: {
      prerequisite_course_id: sourceCourseId,
    },
  }
}
