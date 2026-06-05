import { useUserActions, useUserStore } from '@/entities/user'
import { getProfileApiV1UsersMeGet, loginApiV1AuthLoginPost } from '@/shared/api/generated'
import { ROUTES } from '@/shared/config'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { Button } from '@/shared/ui/Button'
import { InputField } from '@/shared/ui/InputField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { loginSchema, type LoginValues } from '../model/validation'
import styles from './Auth.module.css'
import { AuthWrapper } from './AuthWrapper'

export const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, setAccessToken, setAuth, setTokenType } = useUserStore(useShallow(useUserActions))
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
      const { data, error } = await loginApiV1AuthLoginPost({
        body: values,
      })

      if (error) {
        throw new Error(getErrorMessage(error, 'Проверьте почту и пароль.'))
      }

      if (!data?.access_token) {
        throw new Error('Не удалось получить сессию. Попробуйте еще раз.')
      }

      setAccessToken(data.access_token)
      setTokenType(data.token_type)

      const meResponse = await getProfileApiV1UsersMeGet()

      if (meResponse.error) {
        logout()
        throw new Error(getErrorMessage(meResponse.error, 'Не удалось получить профиль.'))
      }

      if (!meResponse.data) {
        logout()
        throw new Error('Не удалось загрузить профиль. Попробуйте еще раз.')
      }

      setAuth({
        accessToken: data.access_token,
        tokenType: data.token_type,
        user: meResponse.data,
      })
      notifySuccess('Вход выполнен', 'Можно продолжить работу.')
      const redirectTo =
        typeof location.state === 'object' &&
        location.state &&
        'from' in location.state &&
        typeof location.state.from === 'string'
          ? location.state.from
          : ROUTES.PROFILE

      navigate(redirectTo, { replace: true })
    } catch (error) {
      notifyError(
        'Не удалось войти',
        getErrorMessage(error, 'Проверьте почту и пароль, затем попробуйте снова.'),
      )
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
