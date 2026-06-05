import { type Program } from '@/entities/program'
import { useUserState, useUserStore } from '@/entities/user'
import { useProgramsActions, useProgramsStore } from '@/features/programs'
import { createProgramApiV1ProgramsPost } from '@/shared/api/generated'
import { ROUTES } from '@/shared/config'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { Button } from '@/shared/ui/Button'
import { FormModal } from '@/shared/ui/FormModal'
import { InputField } from '@/shared/ui/InputField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { CopyOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { copyProgramSchema, type CopyProgramValues } from '../model/validation'
import styles from './ProgramCopyButton.module.css'

interface ProgramCopyButtonProps {
  program: Program
  className?: string
}

export const ProgramCopyButton = ({ program, className }: ProgramCopyButtonProps) => {
  const navigate = useNavigate()
  const { user } = useUserStore(useShallow(useUserState))
  const { upsertItem } = useProgramsStore(useShallow(useProgramsActions))
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit, reset } = useForm<CopyProgramValues>({
    defaultValues: {
      title: `${program.title} копия`,
      description: program.description ?? '',
    },
    mode: 'onBlur',
    resolver: zodResolver(copyProgramSchema),
  })

  const handleOpen = () => {
    reset({
      title: `${program.title} копия`,
      description: program.description ?? '',
    })
    setIsOpen(true)
  }

  const handleClose = () => {
    if (isSubmitting) {
      return
    }

    setIsOpen(false)
  }

  const onSubmit = async (values: CopyProgramValues) => {
    setIsSubmitting(true)

    try {
      if (!user?.id) {
        throw new Error('Пользователь не авторизован.')
      }

      const { data: copiedProgram, error } = await createProgramApiV1ProgramsPost({
        body: {
          title: values.title,
          description: values.description || undefined,
          user_id: user.id,
        },
      })

      if (error || !copiedProgram?.id) {
        throw new Error(getErrorMessage(error, 'Не удалось создать копию программы.'))
      }

      upsertItem(copiedProgram)
      notifySuccess('Программа скопирована', 'Создана копия описания программы без курсов.')
      setIsOpen(false)
      navigate(`${ROUTES.PROGRAMS}/${copiedProgram.id}`)
    } catch (error) {
      notifyError(
        'Не удалось скопировать программу',
        getErrorMessage(error, 'Проверьте название и попробуйте снова.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        className={clsx(styles.copyButton, className)}
        color="default"
        disabled={isSubmitting}
        htmlType="button"
        icon={<CopyOutlined />}
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
        submitLabel="Скопировать"
        title="Создать копию программы"
        description="Будет создана новая программа с тем же названием и описанием."
        onCancel={handleClose}
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField
          control={control}
          name="title"
          placeholder="Название копии"
          title="Название"
          disabled={isSubmitting}
        />

        <TextAreaField
          control={control}
          name="description"
          autoSize={{ minRows: 3, maxRows: 5 }}
          placeholder="Коротко о программе"
          title="Описание"
          disabled={isSubmitting}
        />
      </FormModal>
    </>
  )
}
