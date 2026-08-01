import { Roles, useUserState, useUserStore } from '@/entities/user'
import { useTracksActions, useTracksStore } from '@/features/tracks'
import { createTrackApiV1CareerTracksPost } from '@/shared/api/generated'
import { ROUTES } from '@/shared/config'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
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
import { createTrackSchema, type CreateTrackValues } from '../model/validation'
import styles from './CreateTrackButton.module.css'

interface CreateTrackButtonProps {
  children?: string
  className?: string
}

export const CreateTrackButton = ({ children, className }: CreateTrackButtonProps) => {
  const navigate = useNavigate()
  const { user } = useUserStore(useShallow(useUserState))
  const { resetCatalog } = useTracksStore(useShallow(useTracksActions))
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
      if (!user?.id) {
        throw new Error('Пользователь не авторизован.')
      }

      const { data: track, error } = await createTrackApiV1CareerTracksPost({
        body: {
          ...values,
          description: values.description || undefined,
          user_id: user.id,
        },
      })

      if (error || !track?.id) {
        throw new Error(getErrorMessage(error, 'Проверьте данные и повторите попытку.'))
      }

      notifySuccess('Трек создан', 'Открываю страницу трека.')
      resetCatalog()
      setIsOpen(false)
      reset()
      navigate(`${ROUTES.TRACKS}/${track.id}`)
    } catch (error) {
      notifyError(
        'Не удалось создать трек',
        getErrorMessage(error, 'Проверьте данные и повторите попытку.'),
      )
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
