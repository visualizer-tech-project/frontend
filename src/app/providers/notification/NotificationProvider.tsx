import { notification } from 'antd'
import { useEffect, type ReactNode } from 'react'
import { bindNotificationApi, notificationConfig } from '@/shared/lib/notify'

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [api, contextHolder] = notification.useNotification(notificationConfig)

  useEffect(() => bindNotificationApi(api), [api])

  return (
    <>
      {contextHolder}
      {children}
    </>
  )
}
