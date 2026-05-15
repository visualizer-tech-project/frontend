import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/config'
import styles from './devPage.module.css'

export const DevPage = () => {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <div className={styles.badge}>В разработке</div>

        <img className={styles.icon} src="/src/shared/assets/img/inProgress.png" alt="#" />

        <h1 className={styles.title}>
          Эта страница
          <br />
          ещё в разработке
        </h1>

        <p className={styles.description}>
          Мы уже работаем над этим разделом.
          <br />
          Скоро здесь появится новый функционал.
        </p>

        <div className={styles.actions}>
          <Link className={styles.primaryAction} to={ROUTES.HOME}>
            На главную
          </Link>

          <Link className={styles.secondaryAction} to={ROUTES.PROGRAMS}>
            Каталог программ
          </Link>
        </div>
      </div>
    </section>
  )
}
