import type { Course } from '@/entities/course'
import type { UserProgress } from '@/entities/progress'
import type { ProgressSelectChangePayload } from '@/entities/progress/model/types'
import type { UserPublic } from '@/entities/user'
import type { Node } from '@xyflow/react'
import { COURSE_NODE_PREFIX } from '../model/types'

interface createCourseNodePropsTypes {
  course: Course
  userId: UserPublic['id'] | null
  index: number
  progress: UserProgress | null
  onCourseRemove: (courseId: Course['id']) => void
  onCourseUpdate: (course: Course) => void
  onProgressChange: (payload: ProgressSelectChangePayload) => void
  canEditFlow: boolean
  canEditCourse: boolean
}

export type ICourseFlowNodeData = Omit<createCourseNodePropsTypes, 'index'>

export const createCourseNode = ({
  course,
  userId,
  progress,
  index,
  onCourseRemove,
  onCourseUpdate,
  onProgressChange,
  canEditCourse,
  canEditFlow,
}: createCourseNodePropsTypes): Node<ICourseFlowNodeData> => ({
  id: `${COURSE_NODE_PREFIX}-${course.id}`,
  type: COURSE_NODE_PREFIX,
  position: {
    x: 120 + (index % 3) * 320,
    y: 120 + Math.floor(index / 3) * 240,
  },
  data: {
    course,
    userId,
    progress,
    onCourseRemove,
    onCourseUpdate,
    onProgressChange,
    canEditFlow,
    canEditCourse,
  },
})
