import type { CreateCourseValues } from '@/entities/course'
import { courseTypeOptions, createCourseSchema, type Course } from '@/entities/course'
import { createCourseApiV1CoursesPost } from '@/shared/api/generated'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { Button } from '@/shared/ui/Button'
import { InputField } from '@/shared/ui/InputField'
import { SelectField } from '@/shared/ui/SelectField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './CoursePicker.module.css'

interface CreateCourseFormProps {
  onCourseCreated: (course: Course) => void
  programId: Course['program_id']
  userId?: Course['user_id']
  disabled?: boolean
  onPendingChange?: (isPending: boolean) => void
}

export const CreateCourseForm = ({
  onCourseCreated,
  programId,
  userId,
  disabled = false,
  onPendingChange,
}: CreateCourseFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit, reset } = useForm<CreateCourseValues>({
    defaultValues: {
      title: '',
      description: '',
      type: 'required',
    },
    mode: 'onBlur',
    resolver: zodResolver(createCourseSchema),
  })

  const handleAddNewCourse = async (values: CreateCourseValues) => {
    setErrorMessage(null)
    setIsSubmitting(true)
    onPendingChange?.(true)

    try {
      if (!userId) {
        throw new Error('Пользователь не авторизован.')
      }

      const { data: createdCourse, error } = await createCourseApiV1CoursesPost({
        body: {
          ...values,
          description: values.description || null,
          program_id: programId,
          user_id: userId,
        },
      })

      if (error || !createdCourse?.id) {
        throw new Error(getErrorMessage(error, 'Не удалось создать курс'))
      }

      onCourseCreated(createdCourse as Course)
      reset()
      notifySuccess('Курс добавлен на холст', 'Можно сразу связать его с другими курсами.')
    } catch (error) {
      const message = getErrorMessage(error, 'Не удалось создать курс')
      setErrorMessage(message)
      notifyError('Курс не создан', message)
    } finally {
      setIsSubmitting(false)
      onPendingChange?.(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleAddNewCourse)}>
      <div className={styles.formHeader}>
        <h2 id="course-picker-title">Новый курс</h2>
        <span>Сразу создастся новый курс</span>
      </div>

      <InputField
        control={control}
        name="title"
        placeholder="Название курса"
        title="Название"
        className={styles.inputField}
        disabled={disabled || isSubmitting}
      />

      <TextAreaField
        control={control}
        name="description"
        autoSize={{ minRows: 2, maxRows: 4 }}
        placeholder="Коротко о содержании"
        title="Описание"
        className={styles.inputField}
        disabled={disabled || isSubmitting}
      />

      <SelectField
        control={control}
        name="type"
        options={courseTypeOptions}
        title="Тип"
        className={styles.inputField}
        disabled={disabled || isSubmitting}
      />

      {errorMessage ? <p className={styles.formError}>{errorMessage}</p> : null}

      <Button
        className={styles.courseActionButton}
        htmlType="submit"
        disabled={disabled || isSubmitting}
        loading={isSubmitting}
      >
        Добавить на холст
      </Button>
    </form>
  )
}
