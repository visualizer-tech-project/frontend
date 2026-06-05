import { Button } from '@/shared/ui/Button'
import { Modal } from 'antd'
import type { FormEventHandler, ReactNode } from 'react'
import styles from './FormModal.module.css'

interface FormModalProps {
  open: boolean
  eyebrow: string
  title: string
  submitLabel: string
  children: ReactNode
  onCancel: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
  cancelLabel?: string
  description?: string
  isSubmitting?: boolean
  submitIcon?: ReactNode
  width?: number
}

export const FormModal = ({
  open,
  eyebrow,
  title,
  submitLabel,
  children,
  onCancel,
  onSubmit,
  cancelLabel = 'Отмена',
  description,
  isSubmitting = false,
  submitIcon,
  width,
}: FormModalProps) => {
  return (
    <Modal
      centered
      className={styles.modal}
      closable={{ disabled: isSubmitting }}
      footer={null}
      keyboard={!isSubmitting}
      mask={{ closable: !isSubmitting }}
      open={open}
      title={null}
      width={width}
      onCancel={onCancel}
    >
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.formHeader}>
          <span>{eyebrow}</span>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>

        {children}

        <div className={styles.actions}>
          <Button
            className={styles.secondaryButton}
            color="default"
            disabled={isSubmitting}
            htmlType="button"
            variant="text"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>

          <Button
            className={styles.primaryButton}
            color="default"
            disabled={isSubmitting}
            htmlType="submit"
            icon={submitIcon}
            loading={isSubmitting}
            variant="filled"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
