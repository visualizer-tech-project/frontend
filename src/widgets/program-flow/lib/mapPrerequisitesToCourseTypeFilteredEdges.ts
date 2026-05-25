import type { Course } from '@/entities/course'
import type { Prerequisite } from '@/entities/prerequisite'
import type { Edge } from '@xyflow/react'
import { dimmedEdgeOptions } from '../model/customFlowStyles'
import { mapPrerequisitesToEdges } from './mapPrerequisitesToEdges'

export const mapPrerequisitesToCourseTypeFilteredEdges = (
  prerequisites: Prerequisite[],
  dimmedCourseIdSet: ReadonlySet<Course['id']>,
): Edge[] =>
  mapPrerequisitesToEdges(prerequisites).map((edge, index) => {
    const prerequisite = prerequisites[index]
    const isDimmed =
      dimmedCourseIdSet.has(prerequisite.course_id) ||
      dimmedCourseIdSet.has(prerequisite.prerequisite_course_id)

    return {
      ...edge,
      ...(isDimmed ? dimmedEdgeOptions : {}),
      type: 'step',
    }
  })
