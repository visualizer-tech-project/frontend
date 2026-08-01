import type { Course } from '@/entities/course'
import type { ProgressSelectChangePayload, ProgressStatus, UserProgress } from '@/entities/progress'
import type { UserPublic } from '@/entities/user'
import {
  createProgressApiV1UsersUserIdCoursesCourseIdProgressPost,
  deleteProgressApiV1UsersUserIdCoursesCourseIdProgressDelete,
  updateProgressApiV1UsersUserIdCoursesCourseIdProgressPut,
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

const toBackendDateTime = (date = new Date()) => {
  const timezoneOffsetMs = date.getTimezoneOffset() * 60_000

  return stripBackendUnsupportedTimezone(new Date(date.getTime() - timezoneOffsetMs).toISOString())
}

const stripBackendUnsupportedTimezone = (value: string) =>
  value.replace(/(?:Z|[+-]\d{2}:\d{2})$/, '')

const normalizeBackendDateTime = (value: string | null | undefined, fallback: string) =>
  value ? stripBackendUnsupportedTimezone(value) : fallback


const isSessionExpiredMessage = (message: string) =>
  message === 'Invalid or expired token' || message.toLowerCase().includes('сессия истекла')

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
      if (!userId || !courseId) {
        throw new Error('Не удалось определить пользователя или курс.')
      }

      if (status === 'not_started') {
        if (!progress) {
          return
        }

        const { error } = await deleteProgressApiV1UsersUserIdCoursesCourseIdProgressDelete({
          path: {
            course_id: courseId,
            user_id: userId,
          },
        })

        if (error) {
          throw new Error(getErrorMessage(error, 'Не удалось сбросить прогресс'))
        }

        onSelectChange({ userId, courseId, newStatus: 'not_started', type: 'deleted' })
        notifySuccess('Статус сброшен', 'Курс снова отмечен как не начатый.')
        return
      }

      const now = toBackendDateTime()
      let newProgress: UserProgress

      if (!progress) {
        const body = {
          status,
          grade: null,
          started_at: status === 'in_progress' || status === 'completed' ? now : null,
          completed_at: status === 'completed' ? now : null,
          course_id: courseId,
          user_id: userId,
        }

        const { data, error } =
          await createProgressApiV1UsersUserIdCoursesCourseIdProgressPost({
            path: {
              course_id: courseId,
              user_id: userId,
            },
            body,
          })

        if (error || !data?.id) {
          throw new Error(getErrorMessage(error, 'Не удалось создать прогресс'))
        }

        newProgress = data as UserProgress
      } else {
        const { data, error } = await updateProgressApiV1UsersUserIdCoursesCourseIdProgressPut({
          path: {
            course_id: courseId,
            user_id: userId,
          },
          body: {
            status,
            started_at: normalizeBackendDateTime(progress.started_at, now),
            completed_at: status === 'completed' ? now : null,
            grade: null,
          },
        })

        if (error || !data?.id) {
          throw new Error(getErrorMessage(error, 'Не удалось обновить прогресс'))
        }

        newProgress = data as UserProgress
      }

      onSelectChange({ newProgress, type: 'updated' })
      notifySuccess('Прогресс обновлен', 'Статус курса сохранен.')
    } catch (error) {
      const message = getErrorMessage(error, 'Попробуйте позже.')

      if (isSessionExpiredMessage(message)) {
        notifyError('Сессия истекла', 'Войдите снова, затем повторите действие.')
        return
      }

      notifyError('Не удалось обновить прогресс', message)
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
