import { useUserState, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import styles from './ProfilePage.module.css'

const roleLabels = {
  admin: 'Администратор',
  student: 'Студент',
  teacher: 'Преподаватель',
} as const

export const ProfilePage = () => {
  const { user } = useUserStore(useShallow(useUserState))
  const roleLabel = user ? roleLabels[user.role as keyof typeof roleLabels] : 'Гость'

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Профиль</p>
        <h1 className={styles.title}>Профиль пользователя</h1>
        <p className={styles.description}>
          Экран профиля встроен в текущий frontend и работает внутри общего роутинга. Активная роль:{' '}
          <span className={styles.role}>{roleLabel}</span>.
        </p>

        <div className={styles.actions}>
          <Link className={styles.primaryAction} to={ROUTES.PROGRAMS}>
            Открыть программы
          </Link>
          <Link className={styles.secondaryAction} to={ROUTES.ADD_PROGRAM}>
            Перейти в конструктор
          </Link>
          <Link className={styles.secondaryAction} to={ROUTES.HOME}>
            На главную
          </Link>
        </div>
      </div>
    </section>
  )
}
