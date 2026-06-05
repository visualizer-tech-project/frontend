import type { NotificationArgsProps } from 'antd'
import type { NotificationInstance } from 'antd/es/notification/interface'

export const notificationConfig: Pick<
  NotificationArgsProps,
  'duration' | 'pauseOnHover' | 'placement' | 'showProgress'
> = {
  duration: 4,
  pauseOnHover: true,
  placement: 'topRight',
  showProgress: true,
}

let notificationApi: NotificationInstance | null = null

export const bindNotificationApi = (api: NotificationInstance) => {
  notificationApi = api

  return () => {
    if (notificationApi === api) {
      notificationApi = null
    }
  }
}

const getDetailMessage = (detail: unknown) => {
  if (typeof detail === 'string' && detail) {
    return detail
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') {
          return item
        }

        if (typeof item !== 'object' || item === null) {
          return null
        }

        const message = 'msg' in item ? item.msg : null
        const location = 'loc' in item && Array.isArray(item.loc) ? item.loc.join('.') : null

        if (typeof message !== 'string' || !message) {
          return null
        }

        return location ? `${location}: ${message}` : message
      })
      .filter((message): message is string => Boolean(message))
      .join('; ')
  }

  return ''
}

const normalizeErrorMessage = (message: string) => {
  if (message === 'Invalid or expired token') {
    return 'Сессия истекла. Войдите снова.'
  }

  return message
}

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'detail' in error) {
    const message = getDetailMessage(error.detail)

    if (message) {
      return normalizeErrorMessage(message)
    }
  }

  if (error instanceof Error && error.message) {
    return normalizeErrorMessage(error.message)
  }

  return fallback
}

export const notifySuccess = (message: string, description?: string) => {
  notificationApi?.success({
    ...notificationConfig,
    description,
    title: message,
  })
}

export const notifyError = (message: string, description?: string) => {
  notificationApi?.error({
    ...notificationConfig,
    description,
    title: message,
  })
}
