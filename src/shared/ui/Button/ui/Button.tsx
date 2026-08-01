import { Button as AntdButton, type ButtonProps } from 'antd'
import clsx from 'clsx'
import { forwardRef, type ReactNode } from 'react'
import styles from './Button.module.css'

interface IButton extends ButtonProps {
  children?: ReactNode
}

export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, IButton>(
  ({ children, className, ...props }, ref) => (
    <AntdButton ref={ref} className={clsx(styles.button, className)} {...props}>
      {children}
    </AntdButton>
  ),
)

Button.displayName = 'Button'
