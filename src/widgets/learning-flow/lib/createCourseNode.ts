import type { Course } from '@/entities/course'
import type { ProgressSelectChangePayload, UserProgress } from '@/entities/progress'
import type { UserPublic } from '@/entities/user'
import type { Node } from '@xyflow/react'
import { COURSE_NODE_PREFIX } from '../model/types'

interface CreateCourseNodeProps {
  course: Course
  userId: UserPublic['id'] | null
  index: number
  progress: UserProgress | null
  onCourseRemove: (courseId: number) => void
  onCourseUpdate: (course: Course) => void
  onProgressChange: (payload: ProgressSelectChangePayload) => void
  canEditFlow: boolean
  canEditCourse: boolean
  isCourseRemoving: boolean
  isDimmed: boolean
}

export type CourseFlowNodeData = Omit<CreateCourseNodeProps, 'index'>

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
  isCourseRemoving,
  isDimmed,
}: CreateCourseNodeProps): Node<CourseFlowNodeData> => ({
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
    isCourseRemoving,
    isDimmed,
  },
})
