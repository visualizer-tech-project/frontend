import { ROUTES } from '@/shared/config'
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
    // const body: ProgramCreate = {
    //   ...values,
    //   description: values.description || undefined,
    // }

    // add saving program with react-query
    console.log(values)

    navigate(`${ROUTES.PROGRAMS}/${1}`)
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
