import { ROUTES } from '@/shared/config'
import { notifyError, notifySuccess } from '@/shared/lib/notify'
import { wait } from '@/shared/lib/wait'
import { Button } from '@/shared/ui/Button'
import { InputField } from '@/shared/ui/InputField'
import { TextAreaField } from '@/shared/ui/TextAreaField'
import { SaveOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from 'antd'
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
          htmlType="button"
          icon={<SaveOutlined />}
          variant="solid"
          onClick={handleOpen}
        >
          {children || 'Создать программу'}
        </Button>
      </div>

      <Modal
        centered
        className={styles.modal}
        open={isOpen}
        footer={null}
        title={null}
        onCancel={handleClose}
      >
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formHeader}>
            <span>Создание программы</span>
            <h2>Вы создаете новую программу</h2>
          </div>

          <InputField
            control={control}
            name="title"
            placeholder="Название программы"
            title="Название"
            className={styles.field}
          />

          <TextAreaField
            control={control}
            name="description"
            autoSize={{ minRows: 3, maxRows: 5 }}
            placeholder="Коротко о программе"
            title="Описание"
            className={styles.field}
          />

          <div className={styles.actions}>
            <Button
              className={styles.secondaryButton}
              color="default"
              disabled={isSubmitting}
              htmlType="button"
              variant="text"
              onClick={handleClose}
            >
              Отмена
            </Button>

            <Button
              className={styles.primaryButton}
              color="default"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isSubmitting}
              variant="filled"
            >
              Создать
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
