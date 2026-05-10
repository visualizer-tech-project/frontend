import type { Prerequisite } from '@/shared/api/generated'
import type { Edge } from '@xyflow/react'
import { defaultEdgeOptions } from '../model/customFlowStyles'
import { COURSE_NODE_PREFIX } from '../model/types'

export const mapPrerequisitesToEdges = (prerequisites: Prerequisite[]): Edge[] =>
  prerequisites.map((prerequisite) => ({
    id: `${prerequisite}-${prerequisite.id}`,
    source: `${COURSE_NODE_PREFIX}-${prerequisite.prerequisite_course_id}`,
    target: `${COURSE_NODE_PREFIX}-${prerequisite.course_id}`,
    ...defaultEdgeOptions,
  }))
