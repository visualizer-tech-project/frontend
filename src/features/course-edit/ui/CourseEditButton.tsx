import { Button } from '@/shared/ui/Button'
import { EditOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import type { FC, MouseEvent, ReactNode } from 'react'

interface ICourseEditButton {
  onClick: (e: MouseEvent) => void
  isIcon?: boolean
  className?: string
  children?: ReactNode
}

export const CourseEditButton: FC<ICourseEditButton> = ({
  onClick,
  className,
  isIcon,
  children,
}) => {
  return (
    <Button
      className={clsx(className, 'nodrag')}
      color="default"
      aria-label="Изменить курс"
      htmlType="button"
      icon={isIcon && <EditOutlined />}
      variant="solid"
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
