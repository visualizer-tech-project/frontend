import { useUserActions, useUserState, useUserStore } from '@/entities/user'
import { getProfileApiV1UsersMeGet } from '@/shared/api/generated'
import { useEffect, useState, type ReactNode } from 'react'
import { useShallow } from 'zustand/shallow'
import styles from './AuthBootstrap.module.css'

interface AuthBootstrapProps {
  children: ReactNode
}

export const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
  const { accessToken, user } = useUserStore(useShallow(useUserState))
  const { logout, setUser } = useUserStore(useShallow(useUserActions))
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(accessToken && !user))

  useEffect(() => {
    if (!accessToken) {
      setIsBootstrapping(false)
      return
    }

    let isActive = true
    setIsBootstrapping(true)

    const syncCurrentUser = async () => {
      try {
        const { data, error } = await getProfileApiV1UsersMeGet()

        if (!isActive) {
          return
        }

        if (error) {
          logout()
          return
        }

        if (!data) {
          logout()
          return
        }

        setUser(data)
      } catch {
        if (isActive) {
          logout()
        }
      } finally {
        if (isActive) {
          setIsBootstrapping(false)
        }
      }
    }

    syncCurrentUser()

    return () => {
      isActive = false
    }
  }, [accessToken, logout, setUser])

  if (isBootstrapping) {
    return (
      <div className={styles.loadingScreen} aria-busy="true" aria-live="polite">
        <span className={styles.spinner} />
        <span>Загрузка...</span>
      </div>
    )
  }

  return children
}
