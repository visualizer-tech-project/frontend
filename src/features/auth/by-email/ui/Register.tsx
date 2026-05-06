import { Button } from '@/shared/ui/Button/Button'
import { InputField } from '@/shared/ui/InputField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { registerSchema, type RegisterValues } from '../model/validation'
import styles from './Auth.module.css'
import { AuthWrapper } from './AuthWrapper'

export const Register = () => {
  const { control, handleSubmit } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = (values: RegisterValues) => {
    console.log(values)
  }

  return (
    <AuthWrapper title="Регистрация">
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

        <InputField
          control={control}
          className={styles.input}
          name="confirmPassword"
          type="password"
          placeholder="Повторите пароль"
          title="Ваш повторный пароль:"
          isPassword
        />

        <div className={styles.bottom}>
          <div className={styles.bottomInfo}>
            <div className={styles.switch} style={{ justifyContent: 'center' }}>
              <span>Есть аккаунт?</span>

              <Link to="/login" className={styles.link}>
                Войти
              </Link>
            </div>
          </div>

          <Button
            className={styles.button}
            onClick={handleSubmit(onSubmit)}
            size="large"
            type="primary"
            variant="filled"
            htmlType="submit"
          >
            Зарегистрироваться
          </Button>
        </div>
      </form>
    </AuthWrapper>
  )
}
