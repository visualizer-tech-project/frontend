import type { Token, User } from '@/shared/api/generated'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface IUserState {
  user: User | null
  accessToken: Token['access_token'] | null
  tokenType: Token['token_type'] | null
}

export interface IUserActions {
  setAuth: (payload: {
    user: User
    accessToken: Token['access_token']
    tokenType: Token['token_type']
  }) => void
  setUser: (user: User | null) => void
  setAccessToken: (accessToken: Token['access_token'] | null) => void
  setTokenType: (tokenType: Token['token_type'] | null) => void
  logout: () => void
}

type UserStore = IUserState & IUserActions

const initialState: IUserState = {
  user: {
    id: 1,
    email: 'student@example.com',
    first_name: 'Иван',
    last_name: 'Петров',
    role: 'student',
    created_at: '2026-01-01T00:00:00.000Z',
  },
  accessToken: 'mock-access-token',
  tokenType: 'bearer',
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setAuth: ({ user, accessToken, tokenType }) => {
        set({ user, accessToken, tokenType }, false, 'user/setAuth')
      },

      setUser: (user) => {
        set({ user }, false, 'user/setUser')
      },

      setAccessToken: (accessToken) => {
        set({ accessToken }, false, 'user/setAccessToken')
      },

      setTokenType: (tokenType) => {
        set({ tokenType }, false, 'user/setTokenType')
      },

      logout: () => {
        set({ user: null, accessToken: null, tokenType: null }, false, 'user/logout')
      },
    }),
    {
      name: 'user-store',
    },
  ),
)

export const useUserState = (state: UserStore) => ({
  user: state.user,
  accessToken: state.accessToken,
  tokenType: state.tokenType,
})

export const useUserActions = (state: UserStore) => ({
  setAuth: state.setAuth,
  setUser: state.setUser,
  setAccessToken: state.setAccessToken,
  setTokenType: state.setTokenType,
  logout: state.logout,
})
