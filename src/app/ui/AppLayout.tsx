import { Outlet } from 'react-router-dom'
import styles from './AppLayout.module.css'
import { AppFooter } from './footer/AppFooter'
import { AppHeader } from './header/AppHeader'

export const AppLayout = () => {
  return (
    <div className={styles.layout}>
      <AppHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
