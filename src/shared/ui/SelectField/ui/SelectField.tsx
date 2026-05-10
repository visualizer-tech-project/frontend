import { Select, type SelectProps } from 'antd'
import Text from 'antd/es/typography/Text'
import clsx from 'clsx'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import styles from './SelectField.module.css'

interface ISelectField<T extends FieldValues, TValue = unknown> extends SelectProps<TValue> {
  control: Control<T>
  name: Path<T>
  title?: string
}

export const SelectField = <T extends FieldValues, TValue = unknown>({
  control,
  name,
  title,
  className,
  ...props
}: ISelectField<T, TValue>) => {
  const { onChange, ...selectProps } = props

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error, isDirty } }) => {
        const handleChange: SelectProps<TValue>['onChange'] = (value, option) => {
          field.onChange(value)
          onChange?.(value, option)
        }

        return (
          <div className={className}>
            {title && <div className={styles.title}>{title}</div>}

            <Select
              {...field}
              {...selectProps}
              classNames={{
                popup: {
                  root: styles.dropdown,
                },
              }}
              className={clsx(
                styles.select,
                error && styles.selectError,
                isDirty && !error && styles.selectSuccess,
              )}
              onChange={handleChange}
            />
            {error && <Text className={styles.error}>{error.message}</Text>}
          </div>
        )
      }}
    />
  )
}
