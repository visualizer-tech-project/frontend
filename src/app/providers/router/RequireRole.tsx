import { type Role, useUserState, useUserStore } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'

interface IRequireRole {
  children: ReactNode
  roles: Array<Role>
}

export const RequireRole = ({ children, roles }: IRequireRole) => {
  const { accessToken, user } = useUserStore(useShallow(useUserState))

  if (!accessToken || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />
  }

  return children
}
