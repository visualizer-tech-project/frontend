import { roleLabels, Roles, useUserActions, useUserState, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { formatDate } from '@/shared/lib/formatDate'
import { notifyError, notifySuccess } from '@/shared/lib/notify'
import { wait } from '@/shared/lib/wait'
import { Button } from '@/shared/ui/Button'
import { PageHero } from '@/widgets/page-hero'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import styles from './ProfilePage.module.css'

export const ProfilePage = () => {
  const navigate = useNavigate()
  const { user } = useUserStore(useShallow(useUserState))
  const { logout } = useUserStore(useShallow(useUserActions))
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!user) return <NavLink to={ROUTES.LOGIN} />

  const heroStats = [
    { label: 'Роль', value: roleLabels[user.role] },
    { label: 'Статус', value: 'Активен' },
    { label: 'С нами', value: formatDate(user.created_at) },
  ]

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await wait(350)
      logout()
      notifySuccess('Вы вышли из аккаунта', 'Сессия завершена.')
      navigate(ROUTES.HOME)
    } catch {
      notifyError('Не удалось выйти', 'Попробуйте повторить действие.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <PageHero
          description="Личный раздел пользователя Edu Map: контактные данные, роль в системе и быстрый переход к основным рабочим сценариям."
          eyebrow="Профиль"
          stats={heroStats}
          title={`${user.first_name} ${user.last_name}`}
        />

        <section className={styles.details} aria-labelledby="profile-details-title">
          <div className={styles.detailsHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Аккаунт</p>
              <h2 id="profile-details-title" className={styles.sectionTitle}>
                Короткая информация
              </h2>
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <span>Почта</span>
              <strong>{user?.email ?? '—'}</strong>
            </div>
            <div className={styles.infoCard}>
              <span>Доступ</span>
              <strong>
                {user?.role === Roles.TEACHER || user?.role === Roles.ADMIN
                  ? 'Создание новых программ и треков'
                  : 'Каталог программ'}
              </strong>
            </div>
            <div className={styles.infoCard}>
              <span>Дата регистрации</span>
              <strong>{formatDate(user.created_at)}</strong>
            </div>
          </div>
        </section>

        <nav className={styles.actions} aria-label="Действия профиля">
          <Button
            color="default"
            htmlType="button"
            variant="solid"
            onClick={() => navigate(ROUTES.PROGRAMS)}
          >
            Открыть программы
          </Button>

          <Button
            color="default"
            htmlType="button"
            variant="text"
            onClick={() => navigate(ROUTES.HOME)}
          >
            На главную
          </Button>

          <Button
            className={styles.logout}
            color="default"
            htmlType="button"
            loading={isLoggingOut}
            variant="text"
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </nav>
      </div>
    </section>
  )
}
