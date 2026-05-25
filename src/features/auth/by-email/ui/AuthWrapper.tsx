import { Content } from 'antd/es/layout/layout'
import styles from './Auth.module.css'
import type { ReactNode } from 'react'

interface IAuthWrapper {
  children: ReactNode
  title: string
}

export const AuthWrapper = ({ children, title }: IAuthWrapper) => {
  return (
    <div className={styles.page}>
      <Content className={styles.content}>
        <div className={styles.container}>
          <h1 className={styles.title}>{title}</h1>

          {children}
        </div>
      </Content>
    </div>
  )
}
