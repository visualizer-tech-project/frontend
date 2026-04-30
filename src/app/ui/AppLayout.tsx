import { Outlet } from 'react-router-dom'
import styles from './AppLayout.module.css'

export const AppLayout = () => {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
