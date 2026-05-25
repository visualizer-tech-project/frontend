import { Input } from 'antd'
import type { TextAreaProps } from 'antd/es/input'
import Text from 'antd/es/typography/Text'
import clsx from 'clsx'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import styles from './TextAreaField.module.css'

interface ITextAreaField<T extends FieldValues> extends TextAreaProps {
  control: Control<T>
  name: Path<T>
  title?: string
  autoSize?: {
    maxRows?: number
    minRows?: number
  }
}

export const TextAreaField = <T extends FieldValues>({
  control,
  name,
  title,
  className,
  autoSize,
  ...props
}: ITextAreaField<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error, isDirty } }) => (
        <div className={className}>
          {title && <div className={styles.title}>{title}</div>}

          <Input.TextArea
            {...field}
            {...props}
            autoSize={autoSize}
            className={clsx(
              styles.textarea,
              error && styles.textareaError,
              isDirty && !error && styles.textareaSuccess,
            )}
          />
          {error && <Text className={styles.error}>{error.message}</Text>}
        </div>
      )}
    />
  )
}
