import { notification, type NotificationArgsProps } from 'antd'

const notificationConfig: Pick<
  NotificationArgsProps,
  'duration' | 'pauseOnHover' | 'placement' | 'showProgress'
> = {
  duration: 4,
  pauseOnHover: true,
  placement: 'topRight',
  showProgress: true,
}

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (typeof error === 'object' && error !== null && 'detail' in error) {
    const detail = (error as { detail?: unknown }).detail

    if (typeof detail === 'string' && detail) {
      return detail
    }
  }

  return fallback
}

export const notifySuccess = (message: string, description?: string) => {
  notification.success({
    ...notificationConfig,
    message,
    description,
  })
}

export const notifyError = (message: string, description?: string) => {
  notification.error({
    ...notificationConfig,
    message,
    description,
  })
}
