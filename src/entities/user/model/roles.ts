export const Roles = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const

export type Role = (typeof Roles)[keyof typeof Roles]
