import { Button as AntdButton, type ButtonProps } from 'antd'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import styles from './Button.module.css'

interface IButton extends ButtonProps {
  children: ReactNode
}

export const Button = ({ children, className, ...props }: IButton) => {
  return (
    <AntdButton className={clsx(styles.button, className)} {...props}>
      {children}
    </AntdButton>
  )
}
