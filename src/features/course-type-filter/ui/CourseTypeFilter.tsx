import { Segmented } from 'antd'
import clsx from 'clsx'
import { courseTypeFilterOptions, type CourseTypeFilterValue } from '../model/types'
import styles from './CourseTypeFilter.module.css'

interface CourseTypeFilterProps {
  value: CourseTypeFilterValue
  onChange: (value: CourseTypeFilterValue) => void
  className?: string
  disabled?: boolean
}

export const CourseTypeFilter = ({
  value,
  onChange,
  className,
  disabled = false,
}: CourseTypeFilterProps) => {
  return (
    <Segmented
      aria-label="Фильтр типа курсов"
      className={clsx(styles.root, className)}
      disabled={disabled}
      options={courseTypeFilterOptions}
      value={value}
      onChange={(nextValue) => onChange(nextValue as CourseTypeFilterValue)}
    />
  )
}
