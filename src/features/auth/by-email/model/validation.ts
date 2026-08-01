import { z } from 'zod'

export const registerSchema = z
  .object({
    email: z.email('Укажите корректную почту'),
    firstName: z.string().min(1, 'Укажите имя').max(100, 'Имя слишком длинное'),
    lastName: z.string().min(1, 'Укажите фамилию').max(100, 'Фамилия слишком длинная'),
    password: z
      .string()
      .min(6, 'Пароль должен содержать минимум 6 символов')
      .max(128, 'Пароль должен содержать максимум 128 символов'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли должны совпадать',
    path: ['confirmPassword'],
  })

export type RegisterValues = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.email('Укажите корректную почту'),
  password: z.string().min(1, 'Пароль не может быть пустым'),
})

export type LoginValues = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.email('Укажите корректную почту'),
})

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const verifyAccountSchema = z.object({
  code: z.uuid('Укажите UUID-код из письма'),
})

export type VerifyAccountValues = z.infer<typeof verifyAccountSchema>

export const resetPasswordSchema = z
  .object({
    code: z.uuid('Укажите UUID-код из письма'),
    newPassword: z
      .string()
      .min(6, 'Пароль должен содержать минимум 6 символов')
      .max(128, 'Пароль должен содержать максимум 128 символов'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли должны совпадать',
    path: ['confirmPassword'],
  })

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
