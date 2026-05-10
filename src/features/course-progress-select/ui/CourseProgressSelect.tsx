import type { Course } from '@/entities/course'
import type { ProgressStatus, UserProgress } from '@/entities/progress'
import type { ProgressSelectChangePayload } from '@/entities/progress/model/types'
import type { UserPublic } from '@/entities/user'
import {
  deleteUsersByUserIdCoursesByCourseIdProgress,
  postUsersByUserIdCoursesByCourseIdProgress,
  putUsersByUserIdCoursesByCourseIdProgress,
} from '@/shared/api/generated'
import { SelectField } from '@/shared/ui/SelectField'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { progressStatusOptions } from '../model/types'
import styles from './CourseProgressSelect.module.css'

interface CourseProgressSelectProps {
  userId: UserPublic['id']
  courseId: Course['id']
  progress: UserProgress | null
  onSelectChange: (payload: ProgressSelectChangePayload) => void
  className?: string
}

interface CourseProgressFormValues {
  status: ProgressStatus
}

export const CourseProgressSelect = ({
  progress,
  userId,
  courseId,
  onSelectChange,
  className,
}: CourseProgressSelectProps) => {
  const { control } = useForm<CourseProgressFormValues>({
    defaultValues: {
      status: progress?.status ?? 'not_started',
    },
  })

  const handleStatusChange = async (status: ProgressStatus) => {
    if (status === 'not_started') {
      if (progress) {
        await deleteUsersByUserIdCoursesByCourseIdProgress({
          path: {
            user_id: progress.user_id,
            course_id: progress.course_id,
          },
        })

        return onSelectChange({ userId, courseId, newStatus: 'not_started', type: 'deleted' })
      }
    }

    const now = new Date().toISOString()
    let newProgress: UserProgress

    if (!progress) {
      await postUsersByUserIdCoursesByCourseIdProgress({
        path: {
          course_id: courseId,
          user_id: userId,
        },
        body: {
          status,
          grade: null,
          started_at: status === 'in_progress' || status === 'completed' ? now : null,
          completed_at: status === 'completed' ? now : null,
        },
      })

      newProgress = {
        id: Date.now(),
        user_id: userId,
        course_id: courseId,
        status,
        grade: null,

        started_at: status === 'in_progress' || status === 'completed' ? now : null,

        completed_at: status === 'completed' ? now : null,

        created_at: now,
        updated_at: now,
      }
    } else {
      await putUsersByUserIdCoursesByCourseIdProgress({
        path: {
          course_id: progress.course_id,
          user_id: progress.user_id,
        },
        body: {
          status,
          started_at: progress.started_at ?? now,
          completed_at: status === 'completed' ? now : null,
          grade: null,
        },
      })

      newProgress = {
        ...progress,
        status,
        started_at: progress.started_at ?? now,
        completed_at: status === 'completed' ? now : null,
        grade: null,
      }
    }

    onSelectChange({ newProgress, type: 'updated' })
  }

  return (
    <SelectField<CourseProgressFormValues, ProgressStatus>
      className={clsx(className, styles.select)}
      value={progress?.status ?? 'not_started'}
      control={control}
      name="status"
      options={progressStatusOptions}
      placeholder="Изменение статуса курса"
      onChange={handleStatusChange}
    />
  )
}
