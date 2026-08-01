import { resetPasswordApiV1AuthResetPasswordPost } from '@/shared/api/generated'
import { ROUTES } from '@/shared/config'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { Button } from '@/shared/ui/Button'
import { InputField } from '@/shared/ui/InputField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPasswordSchema, type ResetPasswordValues } from '../model/validation'
import styles from './Auth.module.css'
import { AuthWrapper } from './AuthWrapper'

export const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code') ?? ''
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code,
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = async (values: ResetPasswordValues) => {
    setIsSubmitting(true)

    try {
      const { error } = await resetPasswordApiV1AuthResetPasswordPost({
        body: {
          code: values.code,
          new_password: values.newPassword,
          confirm_password: values.confirmPassword,
        },
      })

      if (error) {
        throw new Error(getErrorMessage(error, 'Не удалось изменить пароль.'))
      }

      notifySuccess('Пароль изменен', 'Теперь можно войти с новым паролем.')
      navigate(ROUTES.LOGIN)
    } catch (error) {
      notifyError(
        'Не удалось изменить пароль',
        getErrorMessage(error, 'Проверьте ссылку и попробуйте снова.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthWrapper title="Новый пароль">
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <InputField
          control={control}
          className={styles.input}
          name="code"
          placeholder="3fa85f64-5717-4562-b3fc-2c963f66afa6"
          title="Код восстановления:"
        />

        <InputField
          control={control}
          className={styles.input}
          name="newPassword"
          type="password"
          placeholder="Новый пароль"
          title="Новый пароль:"
          isPassword
        />

        <InputField
          control={control}
          className={styles.input}
          name="confirmPassword"
          type="password"
          placeholder="Повторите пароль"
          title="Повторите пароль:"
          isPassword
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
            Сохранить пароль
          </Button>
        </div>
      </form>
    </AuthWrapper>
  )
}
