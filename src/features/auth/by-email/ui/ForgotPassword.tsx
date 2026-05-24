import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/Button'
import { InputField } from '@/shared/ui/InputField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { forgotPasswordSchema, type ForgotPasswordValues } from '../model/validation'
import styles from './Auth.module.css'
import { AuthWrapper } from './AuthWrapper'

export const ForgotPassword = () => {
  const { control, handleSubmit } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = (values: ForgotPasswordValues) => {
    console.log(values)
  }

  return (
    <AuthWrapper title="Восстановление пароля">
      <form className={styles.form}>
        <InputField
          control={control}
          className={styles.input}
          name="email"
          type="email"
          placeholder="test@gmail.com"
          title="Ваша почта:"
        />

        <div className={styles.bottom}>
          <div className={styles.bottomInfo}>
            <div className={styles.switch} style={{ justifyContent: 'center' }}>
              <span>Вспомнили пароль?</span>

              <Link to={ROUTES.LOGIN} className={styles.link}>
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
            Отправить ссылку
          </Button>
        </div>
      </form>
    </AuthWrapper>
  )
}
