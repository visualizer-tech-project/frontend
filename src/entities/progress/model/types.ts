import type { Course } from '@/entities/course'
import type { UserPublic } from '@/entities/user'
import type { ProgressStatus, UserProgressPublic as UserProgress } from '@/shared/api/generated'

export type {
  ProgressCreate,
  ProgressStatus,
  ProgressUpdate,
  UserProgressPublic as UserProgress,
} from '@/shared/api/generated'

export const progressStatusLabels: Record<ProgressStatus, string> = {
  not_started: 'Не начат',
  in_progress: 'В процессе',
  completed: 'Пройден',
}

export type ProgressSelectChangePayload =
  | {
      type: 'deleted'
      userId: UserPublic['id']
      courseId: Course['id']
      newStatus: ProgressStatus
    }
  | {
      type: 'updated'
      newProgress: UserProgress
    }

export interface CourseProgressItem {
  course: Course
  progress: UserProgress | null
  status: ProgressStatus
}
