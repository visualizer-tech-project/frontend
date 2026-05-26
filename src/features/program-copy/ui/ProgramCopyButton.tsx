import { mockCourses } from '@/entities/course'
import { mockProgramPrerequisites } from '@/entities/prerequisite'
import { mockPrograms, type Program } from '@/entities/program'
import { useUserState, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { notifyError, notifySuccess } from '@/shared/lib/notify'
import { wait } from '@/shared/lib/wait'
import { Button } from '@/shared/ui/Button'
import { FormModal } from '@/shared/ui/FormModal'
import { InputField } from '@/shared/ui/InputField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { CopyOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { addProgramCopyToMocks } from '../lib/addProgramCopyToMocks'
import { createProgramCopy } from '../lib/createProgramCopy'
import { getProgramCopyStats } from '../lib/getProgramCopyStats'
import { copyProgramSchema, type CopyProgramValues } from '../model/validation'
import styles from './ProgramCopyButton.module.css'

interface ProgramCopyButtonProps {
  program: Program
  className?: string
}

export const ProgramCopyButton = ({ program, className }: ProgramCopyButtonProps) => {
  const navigate = useNavigate()
  const { user } = useUserStore(useShallow(useUserState))
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const courses = useMemo(() => {
    const courseIds = new Set(
      mockCourses.filter((course) => course.program_id === program.id).map((course) => course.id),
    )

    mockProgramPrerequisites
      .filter((prerequisite) => prerequisite.program_id === program.id)
      .forEach((prerequisite) => {
        courseIds.add(prerequisite.course_id)
        courseIds.add(prerequisite.prerequisite_course_id)
      })

    return mockCourses.filter((course) => courseIds.has(course.id))
  }, [program.id])
  const prerequisites = useMemo(() => {
    const courseIds = new Set(courses.map((course) => course.id))

    return mockProgramPrerequisites.filter(
      (prerequisite) =>
        prerequisite.program_id === program.id &&
        courseIds.has(prerequisite.course_id) &&
        courseIds.has(prerequisite.prerequisite_course_id),
    )
  }, [courses, program.id])
  const stats = useMemo(() => getProgramCopyStats(courses), [courses])
  const defaultValues = useMemo<CopyProgramValues>(
    () => ({
      title: `${program.title} (копия)`,
      description: program.description ?? '',
    }),
    [program.description, program.title],
  )
  const { control, handleSubmit, reset } = useForm<CopyProgramValues>({
    defaultValues,
    mode: 'onBlur',
    resolver: zodResolver(copyProgramSchema),
  })

  const handleOpen = () => {
    reset(defaultValues)
    setIsOpen(true)
  }

  const handleClose = () => {
    if (isSubmitting) {
      return
    }

    reset(defaultValues)
    setIsOpen(false)
  }

  const handleCopyProgram = async (values: CopyProgramValues) => {
    setIsSubmitting(true)

    try {
      // TODO: заменить мок-копирование на API copy endpoint после подключения backend.
      await wait(450)

      const copiedProgram = createProgramCopy({
        values,
        sourceProgram: program,
        sourceCourses: courses,
        sourcePrerequisites: prerequisites,
        existingProgramIds: mockPrograms.map(({ id }) => id),
        existingPrerequisiteIds: mockProgramPrerequisites.map(({ id }) => id),
        user,
      })

      addProgramCopyToMocks(copiedProgram)
      notifySuccess('Программа скопирована', 'Курсы привязаны, связи скопированы.')
      setIsOpen(false)
      navigate(`${ROUTES.PROGRAMS}/${copiedProgram.program.id}`)
    } catch {
      notifyError('Не удалось скопировать программу', 'Проверьте данные и повторите попытку.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        className={clsx(styles.copyButton, className)}
        color="default"
        htmlType="button"
        icon={<CopyOutlined />}
        disabled={isSubmitting}
        variant="text"
        onClick={handleOpen}
      >
        Копировать
      </Button>

      <FormModal
        eyebrow="Копирование программы"
        isSubmitting={isSubmitting}
        open={isOpen}
        submitIcon={<CopyOutlined />}
        submitLabel="Сохранить копию"
        title="Создать копию программы"
        width={620}
        onCancel={handleClose}
        onSubmit={handleSubmit(handleCopyProgram)}
      >
        <InputField
          control={control}
          name="title"
          placeholder="Название новой программы"
          title="Название"
          disabled={isSubmitting}
        />

        <TextAreaField
          control={control}
          name="description"
          autoSize={{ minRows: 3, maxRows: 5 }}
          placeholder="Коротко о новой программе"
          title="Описание"
          disabled={isSubmitting}
        />

        <section className={styles.sourceInfo} aria-label="Информация об исходной программе">
          <div className={styles.sourceHeader}>
            <span>Исходная программа</span>
            <strong>{program.title}</strong>
            <p>{program.description || 'Описание не заполнено.'}</p>
          </div>

          <dl className={styles.stats}>
            <div>
              <dt>Всего курсов</dt>
              <dd>{stats.totalCount}</dd>
            </div>
            <div>
              <dt>Обязательных</dt>
              <dd>{stats.requiredCount}</dd>
            </div>
            <div>
              <dt>Элективных</dt>
              <dd>{stats.electiveCount}</dd>
            </div>
            <div>
              <dt>Связей</dt>
              <dd>{prerequisites.length}</dd>
            </div>
          </dl>
        </section>
      </FormModal>
    </>
  )
}
