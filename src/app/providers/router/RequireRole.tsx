import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Roles, type Role } from '@/entities/user'

interface IRequireRole {
  children: ReactNode
  roles: Array<Role>
}

export const RequireRole = ({ children, roles }: IRequireRole) => {
  const user = {
    isAuth: true,
    role: Roles.USER,
  }

  if (!user.isAuth) {
    return <Navigate to="/auth" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />
  }

  return children
}
