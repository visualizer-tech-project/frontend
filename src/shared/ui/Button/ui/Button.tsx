import { Button as AntdButton, type ButtonProps } from 'antd'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import styles from './Button.module.css'

interface IButton extends ButtonProps {
  children: ReactNode
  isPrimary?: boolean
}

export const Button = ({ children, className, isPrimary, size, onClick }: IButton) => {
  return (
    <AntdButton className={clsx(className, styles.button, isPrimary && styles.primary)} size={size} onClick={onClick}>
      {children}
    </AntdButton>
  )
}
