import { Login, Register } from '@/features/auth/by-email'

interface IAuthPage {
  isLogin: boolean
}

export const AuthPage = ({ isLogin }: IAuthPage) => {
  if (isLogin) return <Login />

  return <Register />
}
