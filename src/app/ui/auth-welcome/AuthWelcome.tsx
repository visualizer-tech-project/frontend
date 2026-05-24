import { useUserState, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/Button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import styles from './AuthWelcome.module.css'

export const AuthWelcome = () => {
  const navigate = useNavigate()
  const { user } = useUserStore(useShallow(useUserState))
  const [isClosed, setIsClosed] = useState(false)

  if (user || isClosed) {
    return null
  }

  const handleLoginClick = () => {
    setIsClosed(true)
    navigate(ROUTES.LOGIN)
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-welcome-title"
    >
      <div className={styles.card}>
        <span className={styles.eyebrow}>Карта учебных программ</span>
        <h2 className={styles.title} id="auth-welcome-title">
          Добро пожаловать
        </h2>
        <p className={styles.description}>
          Можно продолжить без входа. Авторизация пригодится для сохранения прогресса, управления
          программами и персональной образовательной траектории.
        </p>

        <div className={styles.actions}>
          <Button
            type="primary"
            variant="solid"
            size="large"
            htmlType="button"
            onClick={handleLoginClick}
          >
            Войти
          </Button>

          <Button
            color="default"
            variant="text"
            size="large"
            htmlType="button"
            onClick={() => setIsClosed(true)}
          >
            Продолжить без входа
          </Button>
        </div>
      </div>
    </div>
  )
}
