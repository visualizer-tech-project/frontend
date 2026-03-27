export const Roles = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  USER: 'user',
} as const

export type Role = (typeof Roles)[keyof typeof Roles]
