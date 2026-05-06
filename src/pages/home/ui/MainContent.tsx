import { Roles, useUserActions, useUserState, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import styles from './HomePage.module.css'
import { HomeProgramsWidget } from './programs/HomeProgramsWidget'
import { HomeWelcome } from './welcome/HomeWelcome'

type MainContentView = 'welcome' | 'programs'

export const MainContent = () => {
  const navigate = useNavigate()
  const { user } = useUserStore(useShallow(useUserState))
  const { setUser } = useUserStore(useShallow(useUserActions))
  const [view, setView] = useState<MainContentView>('programs')
  const isProgramsView = view === 'programs' && user?.role === Roles.STUDENT

  const setUserRole = useCallback(
    (role: typeof Roles.STUDENT | typeof Roles.TEACHER) => {
      if (!user) {
        return false
      }

      setUser({ ...user, role })
      return true
    },
    [setUser, user],
  )

  const handleStudentClick = () => {
    return setUserRole(Roles.STUDENT)
  }

  const handleTeacherClick = () => {
    return setUserRole(Roles.TEACHER)
  }

  const handleBackClick = () => {
    setView('welcome')
  }

  return (
    <section className={styles.mainContent}>
      {isProgramsView ? (
        <HomeProgramsWidget onBack={handleBackClick} />
      ) : (
        <HomeWelcome
          onStudentClick={handleStudentClick}
          onStudentTransitionComplete={() => setView('programs')}
          onTeacherClick={handleTeacherClick}
          onTeacherTransitionComplete={() => navigate(ROUTES.PROGRAMS)}
        />
      )}
    </section>
  )
}
