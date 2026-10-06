import { notifyError, notifySuccess } from '@/shared/lib/notify'
import { Button } from '@/shared/ui/Button'
import { InputField } from '@/shared/ui/InputField'
import { SelectField } from '@/shared/ui/SelectField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  courseDirections,
  courseSuggestionSchema,
  type CourseSuggestionValues,
} from '../model/validation'
import styles from './CourseSuggestionForm.module.css'

interface CourseSuggestionFormProps {
  userId: string
  email?: string
}

export const CourseSuggestionForm = ({ userId, email = '' }: CourseSuggestionFormProps) => {
  const storageKey = `edu-map:course-suggestion:${userId}`
  const [defaultValues] = useState(() => {
    const emptyForm = { title: '', description: '', direction: undefined, materialsUrl: '', email }
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const result = courseSuggestionSchema.safeParse(JSON.parse(stored))
        if (result.success) return result.data
      }
    } catch {
      return emptyForm
    }
    return emptyForm
  })
  const { control, handleSubmit } = useForm<CourseSuggestionValues>({
    resolver: zodResolver(courseSuggestionSchema),
    mode: 'onBlur',
    defaultValues,
  })

  const onSubmit = (values: CourseSuggestionValues) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(values))
      notifySuccess('Предложение сохранено', values.title)
    } catch {
      notifyError('Не удалось сохранить', 'Проверьте настройки хранилища браузера.')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <InputField
        control={control}
        name="title"
        title="Название курса *"
        aria-label="Название курса"
        placeholder="Например, основы веб-разработки"
        maxLength={120}
        aria-required="true"
      />

      <SelectField
        control={control}
        name="direction"
        title="Направление *"
        aria-label="Направление"
        placeholder="Выберите направление"
        options={courseDirections.map((value) => ({ value, label: value }))}
        aria-required="true"
      />

      <TextAreaField
        control={control}
        name="description"
        title="Описание курса *"
        aria-label="Описание курса"
        placeholder="О чём курс и кому он будет полезен?"
        autoSize={{ minRows: 5, maxRows: 10 }}
        maxLength={2000}
        aria-required="true"
      />

      <InputField
        control={control}
        name="materialsUrl"
        title="Ссылка на материалы"
        aria-label="Ссылка на материалы"
        type="url"
        placeholder="https://example.com/course"
        maxLength={2048}
      />

      <InputField
        control={control}
        name="email"
        title="Email автора *"
        aria-label="Email автора"
        type="email"
        autoComplete="email"
        placeholder="name@example.com"
        maxLength={254}
        aria-required="true"
      />

      <p className={styles.hint}>
        * Обязательные поля. Последнее предложение хранится в этом браузере для вашего аккаунта. На
        сервер оно не отправляется.
      </p>

      <Button type="primary" htmlType="submit" size="large">
        Сохранить предложение
      </Button>
    </form>
  )
}
