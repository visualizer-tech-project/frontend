import type { UserRole } from '@/shared/api/generated'

export const Roles = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const satisfies Record<string, UserRole>

export const roleLabels: Record<UserRole, string> = {
  [Roles.ADMIN]: 'Администратор',
  [Roles.TEACHER]: 'Преподаватель',
  [Roles.STUDENT]: 'Студент',
}

export type Role = UserRole
