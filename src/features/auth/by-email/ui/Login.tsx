import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/Button'
import { InputField } from '@/shared/ui/InputField'
import { notifyError, notifySuccess } from '@/shared/lib/notify'
import { wait } from '@/shared/lib/wait'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { loginSchema, type LoginValues } from '../model/validation'
import styles from './Auth.module.css'
import { AuthWrapper } from './AuthWrapper'

export const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = async (values: LoginValues) => {
    setIsSubmitting(true)

    try {
      await wait(450)
      console.log(values)
      notifySuccess('Вход выполнен', 'Вы успешно авторизовались.')
    } catch {
      notifyError('Не удалось войти', 'Проверьте почту и пароль, затем попробуйте снова.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthWrapper title="Вход">
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <InputField
          control={control}
          className={styles.input}
          name="email"
          type="email"
          placeholder="test@gmail.com"
          title="Ваша почта:"
        />

        <InputField
          control={control}
          className={styles.input}
          name="password"
          type="password"
          placeholder="Ваш пароль"
          title="Ваш пароль:"
          isPassword
        />

        <div className={styles.bottom}>
          <div className={styles.bottomInfo}>
            <div className={styles.switch}>
              <span>Нет аккаунта?</span>

              <Link to="/register" className={styles.link}>
                Создать
              </Link>
            </div>

            <Link to={ROUTES.FORGOT_PASSWORD} className={styles.link}>
              Забыли пароль?
            </Link>
          </div>

          <Button
            className={styles.button}
            loading={isSubmitting}
            size="large"
            type="primary"
            variant="filled"
            htmlType="submit"
          >
            Войти
          </Button>
        </div>
      </form>
    </AuthWrapper>
  )
}
