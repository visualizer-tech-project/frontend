import type { CreateCourseValues } from '@/entities/course'
import {
  courseTypeOptions,
  createCourseSchema,
  type Course,
  type CourseCreate,
} from '@/entities/course'
import { postCourses } from '@/shared/api/generated'
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
}

const TEMP_PROGRAM_ID = 0

export const CreateCourseForm = ({ onCourseCreated }: CreateCourseFormProps) => {
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
    const course: CourseCreate = {
      ...values,
      description: values.description || undefined,
      program_id: TEMP_PROGRAM_ID,
    }

    setErrorMessage(null)
    setIsSubmitting(true)

    const { data, error } = await postCourses({
      body: course,
    })

    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.detail || 'Не удалось создать курс')
      return
    }

    if (!data) {
      setErrorMessage('Сервер не вернул созданный курс')
      return
    }

    onCourseCreated(data)
    reset()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleAddNewCourse)}>
      <div className={styles.formHeader}>
        <h2 id="course-picker-title">Новый курс</h2>
        <span>Сразу создадится новый курс</span>
      </div>

      <InputField
        control={control}
        name="title"
        placeholder="Название курса"
        title="Название"
        className={styles.inputField}
      />

      <TextAreaField
        control={control}
        name="description"
        autoSize={{ minRows: 2, maxRows: 4 }}
        placeholder="Коротко о содержании"
        title="Описание"
        className={styles.inputField}
      />

      <SelectField
        control={control}
        name="type"
        options={courseTypeOptions}
        title="Тип"
        className={styles.inputField}
      />

      {errorMessage ? <p className={styles.formError}>{errorMessage}</p> : null}

      <Button className={styles.courseActionButton} htmlType="submit" loading={isSubmitting}>
        Добавить на холст
      </Button>
    </form>
  )
}
