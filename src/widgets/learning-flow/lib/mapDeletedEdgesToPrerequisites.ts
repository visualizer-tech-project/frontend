import type { Prerequisite } from '@/entities/prerequisite'
import type { Edge } from '@xyflow/react'
import { COURSE_NODE_PREFIX } from '../model/types'

const getCourseIdFromNodeId = (nodeId: string) =>
  Number(nodeId.replace(`${COURSE_NODE_PREFIX}-`, ''))

export const mapDeletedEdgesToPrerequisites = (
  deletedEdges: Edge[],
  prerequisites: Prerequisite[],
): Prerequisite[] => {
  return deletedEdges
    .map((edge) => {
      const sourceCourseId = getCourseIdFromNodeId(edge.source)
      const targetCourseId = getCourseIdFromNodeId(edge.target)

      return prerequisites.find(
        (prerequisite) =>
          prerequisite.prerequisite_course_id === sourceCourseId &&
          prerequisite.course_id === targetCourseId,
      )
    })
    .filter((prerequisite): prerequisite is Prerequisite => Boolean(prerequisite))
}
