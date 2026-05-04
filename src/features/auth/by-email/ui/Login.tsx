import { Button } from '@/shared/ui/Button'
import { InputField } from '@/shared/ui/InputField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { loginSchema, type LoginValues } from '../model/validation'
import styles from './Auth.module.css'
import { AuthWrapper } from './AuthWrapper'

export const Login = () => {
  const { control, handleSubmit } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = (values: LoginValues) => {
    console.log(values)
  }

  return (
    <AuthWrapper title="Вход">
      <form className={styles.form}>
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

            <Link to="/forgot-password" className={styles.link}>
              Забыли пароль?
            </Link>
          </div>

          <Button
            className={styles.button}
            onClick={handleSubmit(onSubmit)}
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
