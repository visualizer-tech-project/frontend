import { verifyAccountApiV1AuthVerifyPost } from '@/shared/api/generated'
import { ROUTES } from '@/shared/config'
import { getErrorMessage, notifyError, notifySuccess } from '@/shared/lib/notify'
import { Button } from '@/shared/ui/Button'
import { InputField } from '@/shared/ui/InputField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { verifyAccountSchema, type VerifyAccountValues } from '../model/validation'
import styles from './Auth.module.css'
import { AuthWrapper } from './AuthWrapper'

export const VerifyAccount = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code') ?? ''
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { control, handleSubmit } = useForm<VerifyAccountValues>({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: {
      code,
    },
    mode: 'onBlur',
  })

  const onSubmit = async (values: VerifyAccountValues) => {
    setIsSubmitting(true)

    try {
      const { error } = await verifyAccountApiV1AuthVerifyPost({
        body: {
          code: values.code,
        },
      })

      if (error) {
        throw new Error(getErrorMessage(error, 'Код подтверждения недействителен.'))
      }

      notifySuccess('Аккаунт подтвержден', 'Теперь можно войти.')
      navigate(ROUTES.LOGIN)
    } catch (error) {
      notifyError(
        'Не удалось подтвердить аккаунт',
        getErrorMessage(error, 'Проверьте код из письма и попробуйте снова.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthWrapper title="Подтверждение почты">
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <InputField
          control={control}
          className={styles.input}
          name="code"
          placeholder="3fa85f64-5717-4562-b3fc-2c963f66afa6"
          title="Код подтверждения:"
        />

        <div className={styles.bottom}>
          <div className={styles.bottomInfo}>
            <div className={styles.switch} style={{ justifyContent: 'center' }}>
              <span>Уже подтвердили почту?</span>

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
            Подтвердить почту
          </Button>
        </div>
      </form>
    </AuthWrapper>
  )
}
