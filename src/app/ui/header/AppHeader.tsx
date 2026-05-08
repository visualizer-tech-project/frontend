import { Roles, useUserState, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/Button/Button'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import styles from './AppHeader.module.css'

export const AppHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { accessToken, user } = useUserStore(useShallow(useUserState))
  const isAuthorized = Boolean(user && accessToken)
  const authRoute = isAuthorized ? ROUTES.PROFILE : ROUTES.LOGIN
  const isAdmin = user?.role === Roles.ADMIN
  const canEditPrograms = user?.role === Roles.ADMIN || user?.role === Roles.TEACHER

  const navigateTo = (route: string) => {
    navigate(route)
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink className={styles.brand} to={ROUTES.HOME}>
          <span className={styles.brandMark}>EM</span>
          <span className={styles.brandText}>Edu Map</span>
        </NavLink>

        <nav className={styles.nav}>
          <Button
            aria-current={location.pathname === ROUTES.HOME ? 'page' : undefined}
            color="default"
            htmlType="button"
            variant="text"
            onClick={() => navigateTo(ROUTES.HOME)}
          >
            Главная
          </Button>

          <Button
            aria-current={location.pathname.startsWith(ROUTES.PROGRAMS) ? 'page' : undefined}
            color="default"
            htmlType="button"
            variant="text"
            onClick={() => navigateTo(ROUTES.PROGRAMS)}
          >
            Программы
          </Button>

          <Button
            aria-current={location.pathname.startsWith(ROUTES.TRACKS) ? 'page' : undefined}
            color="default"
            htmlType="button"
            variant="text"
            onClick={() => navigateTo(ROUTES.TRACKS)}
          >
            Карьерные треки
          </Button>

          {canEditPrograms ? (
            <Button
              aria-current={location.pathname === ROUTES.ADD_PROGRAM ? 'page' : undefined}
              color="default"
              htmlType="button"
              variant="text"
              onClick={() => navigateTo(ROUTES.ADD_PROGRAM)}
            >
              Конструктор
            </Button>
          ) : null}

          {isAdmin ? (
            <Button
              aria-current={location.pathname === ROUTES.ADMIN ? 'page' : undefined}
              color="default"
              htmlType="button"
              variant="text"
              onClick={() => navigateTo(ROUTES.ADMIN)}
            >
              Админ-панель
            </Button>
          ) : null}

          {!isAuthorized ? (
            <Button
              aria-current={location.pathname === ROUTES.REGISTER ? 'page' : undefined}
              color="default"
              htmlType="button"
              variant="text"
              onClick={() => navigateTo(ROUTES.REGISTER)}
            >
              Регистрация
            </Button>
          ) : null}

          <Button
            aria-current={location.pathname === authRoute ? 'page' : undefined}
            color="default"
            htmlType="button"
            variant="solid"
            onClick={() => navigateTo(authRoute)}
          >
            {isAuthorized ? 'Профиль' : 'Войти'}
          </Button>
        </nav>
      </div>
    </header>
  )
}
