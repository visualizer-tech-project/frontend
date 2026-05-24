import type { Course } from '@/entities/course'
import type { ProgressSelectChangePayload, ProgressStatus, UserProgress } from '@/entities/progress'
import type { UserPublic } from '@/entities/user'
import {
  deleteUsersByUserIdCoursesByCourseIdProgress,
  postUsersByUserIdCoursesByCourseIdProgress,
  putUsersByUserIdCoursesByCourseIdProgress,
} from '@/shared/api/generated'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { SelectField } from '@/shared/ui/SelectField'
import clsx from 'clsx'
import { useState } from 'react'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control } = useForm<CourseProgressFormValues>({
    defaultValues: {
      status: progress?.status ?? 'not_started',
    },
  })

  const handleStatusChange = async (status: ProgressStatus) => {
    setIsSubmitting(true)

    try {
      if (status === 'not_started') {
        if (!progress) {
          return
        }

        const { error } = await deleteUsersByUserIdCoursesByCourseIdProgress({
          path: {
            user_id: progress.user_id,
            course_id: progress.course_id,
          },
        })

        if (error) {
          throw new Error(getErrorMessage(error, 'Не удалось сбросить прогресс'))
        }

        onSelectChange({ userId, courseId, newStatus: 'not_started', type: 'deleted' })
        notifySuccess('Прогресс обновлен', 'Статус курса сброшен.')
        return
      }

      const now = new Date().toISOString()
      let newProgress: UserProgress

      if (!progress) {
        const { error } = await postUsersByUserIdCoursesByCourseIdProgress({
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

        if (error) {
          throw new Error(getErrorMessage(error, 'Не удалось создать прогресс'))
        }

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
        const { error } = await putUsersByUserIdCoursesByCourseIdProgress({
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

        if (error) {
          throw new Error(getErrorMessage(error, 'Не удалось обновить прогресс'))
        }

        newProgress = {
          ...progress,
          status,
          started_at: progress.started_at ?? now,
          completed_at: status === 'completed' ? now : null,
          grade: null,
        }
      }

      onSelectChange({ newProgress, type: 'updated' })
      notifySuccess('Прогресс обновлен', 'Новый статус курса сохранен.')
    } catch (error) {
      notifyError('Не удалось обновить прогресс', getErrorMessage(error, 'Попробуйте позже.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SelectField<CourseProgressFormValues, ProgressStatus>
      className={clsx(className, styles.select)}
      value={progress?.status ?? 'not_started'}
      control={control}
      name="status"
      options={progressStatusOptions}
      placeholder="Изменение статуса курса"
      loading={isSubmitting}
      disabled={isSubmitting}
      onChange={handleStatusChange}
    />
  )
}
