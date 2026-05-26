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
import { createProgramSchema, type CreateProgramValues } from '../model/validation'
import styles from './CreateProgramButton.module.css'

interface CreateProgramButtonProps {
  children?: string
  className?: string
}

export const CreateProgramButton = ({ className, children }: CreateProgramButtonProps) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit, reset } = useForm<CreateProgramValues>({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(createProgramSchema),
  })

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

  const onSubmit = async (values: CreateProgramValues) => {
    setIsSubmitting(true)

    try {
      // TODO: сохранить программу через API/mutation после подключения backend.
      await wait(450)
      console.log(values)
      notifySuccess('Программа создана', 'Новая программа успешно сохранена.')
      navigate(`${ROUTES.PROGRAMS}/${1}`)
    } catch {
      notifyError('Не удалось создать программу', 'Проверьте данные и повторите попытку.')
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
          disabled={isSubmitting}
          htmlType="button"
          icon={<SaveOutlined />}
          variant="solid"
          onClick={handleOpen}
        >
          {children || 'Создать программу'}
        </Button>
      </div>

      <FormModal
        eyebrow="Создание программы"
        isSubmitting={isSubmitting}
        open={isOpen}
        submitIcon={<SaveOutlined />}
        submitLabel="Создать"
        title="Вы создаете новую программу"
        onCancel={handleClose}
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputField
          control={control}
          name="title"
          placeholder="Название программы"
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
