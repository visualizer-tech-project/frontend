import { z } from 'zod'

export const registerSchema = z
  .object({
    email: z.email('Укажите корректную почту'),
    password: z
      .string()
      .min(8, 'Пароль должен содержать минимум 8 символов')
      .max(32, 'Пароль должен содержать максимум 32 символа')
      .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
      .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
      .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
      .regex(/[^A-Za-z0-9]/, 'Пароль должен содержать хотя бы один спецсимвол (!@#$%^&*)'),
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
