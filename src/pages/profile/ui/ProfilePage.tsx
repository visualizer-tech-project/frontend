import { ROUTES } from '@/shared/config'
import { Link } from 'react-router-dom'
import styles from './ProfilePage.module.css'

export const ProfilePage = () => {
  const selectedRole = window.localStorage.getItem('selectedRole')
  const roleLabel = selectedRole === 'student' ? 'Студент' : 'Преподаватель'

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Профиль</p>
        <h1 className={styles.title}>Страница студента</h1>
        <p className={styles.description}>
          Экран из my-app - Copy встроен в текущий frontend и теперь работает внутри общего роутинга. Активная роль:{' '}
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
