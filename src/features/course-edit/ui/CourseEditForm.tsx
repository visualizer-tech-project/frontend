import {
  courseTypeOptions,
  createCourseSchema,
  type Course,
  type CourseUpdate,
  type CreateCourseValues,
} from '@/entities/course'
import { notifyError, notifySuccess } from '@/shared/lib/notify'
import { wait } from '@/shared/lib/wait'
import { Button } from '@/shared/ui/Button'
import { SelectField } from '@/shared/ui/SelectField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useState, type FC } from 'react'
import { useForm } from 'react-hook-form'
import styles from './CourseEditForm.module.css'

interface ICourseEditForm {
  course: Course
  onCourseUpdate: (course: Course) => void
  onClose: () => void
  className?: string
}

export const CourseEditForm: FC<ICourseEditForm> = ({
  course,
  onCourseUpdate,
  onClose,
  className,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm<CreateCourseValues>({
    defaultValues: {
      title: course.title,
      description: course.description ?? '',
      type: course.type,
    },
    mode: 'onBlur',
    resolver: zodResolver(createCourseSchema),
  })

  const onSubmit = async (values: CreateCourseValues) => {
    setIsSubmitting(true)

    try {
      const courseUpdateResponse = {
        ...values,
        program_id: course.program_id,
        user_id: course.user_id,
      } satisfies CourseUpdate

      await wait(350)
      console.log(courseUpdateResponse)

      const newCourse: Course = {
        ...course,
        ...courseUpdateResponse,
        updated_at: new Date().toISOString(),
      }

      onCourseUpdate(newCourse)
      notifySuccess('Курс обновлен', 'Изменения курса успешно сохранены.')
      onClose()
    } catch {
      notifyError('Не удалось обновить курс', 'Попробуйте сохранить изменения еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={clsx(className, styles.form, 'nodrag')} onSubmit={handleSubmit(onSubmit)}>
      <TextAreaField
        control={control}
        name="title"
        className={styles.textArea}
        title="Заголовок"
        autoSize={{ minRows: 1, maxRows: 3 }}
      />

      <TextAreaField
        control={control}
        name="description"
        className={styles.textArea}
        title="Описание"
        autoSize={{ minRows: 2, maxRows: 4 }}
      />

      <SelectField control={control} name="type" title="Тип" options={courseTypeOptions} />

      <div className={styles.actions}>
        <Button
          htmlType="submit"
          type="primary"
          variant="solid"
          disabled={!isDirty || !isValid || isSubmitting}
          loading={isSubmitting}
        >
          Сохранить
        </Button>

        <Button
          htmlType="button"
          variant="text"
          type="text"
          className={styles.closeButton}
          disabled={isSubmitting}
          onClick={onClose}
        >
          Отменить
        </Button>
      </div>
    </form>
  )
}
