import { Input, type InputProps } from 'antd'
import Text from 'antd/es/typography/Text'
import clsx from 'clsx'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import styles from './InputField.module.css'

interface IInputField<T extends FieldValues> extends InputProps {
  control: Control<T>
  name: Path<T>
  title?: string
  isPassword?: boolean
}

export const InputField = <T extends FieldValues>({
  control,
  name,
  title,
  isPassword,
  className,
  ...props
}: IInputField<T>) => {
  const Component = isPassword ? Input.Password : Input

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error, isDirty } }) => (
        <div className={className}>
          {title && <div className={styles.title}>{title}</div>}

          <Component
            {...field}
            {...props}
            className={clsx(styles.input, error && styles.inputError, isDirty && !error && styles.inputSuccess)}
          />
          {error && <Text className={styles.error}>{error.message}</Text>}
        </div>
      )}
    />
  )
}
