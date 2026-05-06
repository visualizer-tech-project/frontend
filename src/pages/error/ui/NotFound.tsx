import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/config'
import styles from './NotFound.module.css'

export const NotFound = () => {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Страница не найдена</h1>
        <p className={styles.description}>
          Такого маршрута нет в приложении. Можно вернуться на главную или открыть каталог программ.
        </p>

        <div className={styles.actions}>
          <Link className={styles.primaryAction} to={ROUTES.HOME}>
            На главную
          </Link>
          <Link className={styles.secondaryAction} to={ROUTES.PROGRAMS}>
            Программы
          </Link>
        </div>
      </div>
    </section>
  )
}
