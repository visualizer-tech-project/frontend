import { forgotPasswordApiV1AuthForgotPasswordPost } from '@/shared/api/generated'
import { ROUTES } from '@/shared/config'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { Button } from '@/shared/ui/Button'
import { InputField } from '@/shared/ui/InputField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { forgotPasswordSchema, type ForgotPasswordValues } from '../model/validation'
import styles from './Auth.module.css'
import { AuthWrapper } from './AuthWrapper'

export const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsSubmitting(true)

    try {
      const { error } = await forgotPasswordApiV1AuthForgotPasswordPost({
        body: values,
      })

      if (error) {
        throw new Error(getErrorMessage(error, 'Попробуйте повторить запрос позже.'))
      }

      notifySuccess('Ссылка отправлена', 'Проверьте почту для восстановления пароля.')
    } catch (error) {
      notifyError(
        'Не удалось отправить ссылку',
        getErrorMessage(error, 'Попробуйте повторить запрос позже.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthWrapper title="Восстановление пароля">
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
            loading={isSubmitting}
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
