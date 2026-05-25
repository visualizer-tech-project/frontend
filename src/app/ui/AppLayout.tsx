import { Outlet } from 'react-router-dom'
import styles from './AppLayout.module.css'
import { AuthWelcome } from './auth-welcome/AuthWelcome'
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
      <AuthWelcome />
    </div>
  )
}
