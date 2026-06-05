import { Roles, useUserState, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { notifyError, notifySuccess } from '@/shared/lib/notify'
import { wait } from '@/shared/lib/wait'
import { Button } from '@/shared/ui/Button'
import { FormModal } from '@/shared/ui/FormModal'
import { InputField } from '@/shared/ui/InputField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { SaveOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { addTrackToMocks } from '../lib/addTrackToMocks'
import { createTrack } from '../lib/createTrack'
import { createTrackSchema, type CreateTrackValues } from '../model/validation'
import styles from './CreateTrackButton.module.css'

interface CreateTrackButtonProps {
  children?: string
  className?: string
}

export const CreateTrackButton = ({ children, className }: CreateTrackButtonProps) => {
  const navigate = useNavigate()
  const { user } = useUserStore(useShallow(useUserState))
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const canCreateTrack = user?.role === Roles.TEACHER || user?.role === Roles.ADMIN
  const { control, handleSubmit, reset } = useForm<CreateTrackValues>({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(createTrackSchema),
  })

  if (!canCreateTrack) {
    return null
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    if (isSubmitting) {
      return
    }

    reset()
    setIsOpen(false)
  }

  const handleCreateTrack = async (values: CreateTrackValues) => {
    setIsSubmitting(true)

    try {
      // TODO: заменить мок-создание на API mutation после подключения backend.
      await wait(450)

      const createdTrack = createTrack({ values, user })

      addTrackToMocks(createdTrack)
      notifySuccess('Трек создан', 'Новый карьерный трек успешно сохранен.')
      setIsOpen(false)
      navigate(`${ROUTES.TRACKS}/${createdTrack.track.id}`)
    } catch {
      notifyError('Не удалось создать трек', 'Проверьте данные и повторите попытку.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className={className}>
        <Button
          className={styles.button}
          color="default"
          htmlType="button"
          icon={<SaveOutlined />}
          variant="solid"
          onClick={handleOpen}
        >
          {children || 'Создать трек'}
        </Button>
      </div>

      <FormModal
        eyebrow="Создание трека"
        isSubmitting={isSubmitting}
        open={isOpen}
        submitIcon={<SaveOutlined />}
        submitLabel="Создать"
        title="Вы создаете новый карьерный трек"
        width={620}
        onCancel={handleClose}
        onSubmit={handleSubmit(handleCreateTrack)}
      >
        <InputField
          control={control}
          name="title"
          placeholder="Название трека"
          title="Название"
          disabled={isSubmitting}
        />

        <TextAreaField
          control={control}
          name="description"
          autoSize={{ minRows: 3, maxRows: 5 }}
          placeholder="Коротко о треке"
          title="Описание"
          disabled={isSubmitting}
        />
      </FormModal>
    </>
  )
}
