export const Roles = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const

export const roleLabels = {
  [Roles.ADMIN]: 'Администратор',
  [Roles.TEACHER]: 'Преподаватель',
  [Roles.STUDENT]: 'Студент',
} as const

export type Role = (typeof Roles)[keyof typeof Roles]
