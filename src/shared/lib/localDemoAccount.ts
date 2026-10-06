import type { UserPublic } from '@/shared/api/generated'

export const LOCAL_DEMO_EMAIL = 'test@edumap.local'
export const LOCAL_DEMO_PASSWORD = 'Test123!'

const LOCAL_DEMO_TOKEN = 'edu-map-local-demo-session'

export const isLocalDemoToken = (token: string | null) => token === LOCAL_DEMO_TOKEN

export const createLocalDemoAuth = () => {
  const user: UserPublic = {
    id: -1,
    email: LOCAL_DEMO_EMAIL,
    first_name: 'Тестовый',
    last_name: 'Пользователь',
    role: 'student',
    status: 'confirmed',
    created_at: '2026-10-05T00:00:00',
  }

  return { user, accessToken: LOCAL_DEMO_TOKEN, tokenType: 'bearer' }
}
