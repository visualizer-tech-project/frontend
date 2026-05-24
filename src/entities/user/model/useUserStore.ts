import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { TokenResponse, UserPublic } from './types'

export interface IUserState {
  user: UserPublic | null
  accessToken: TokenResponse['access_token'] | null
  tokenType: TokenResponse['token_type'] | null
}

export interface IUserActions {
  setAuth: (payload: {
    user: UserPublic
    accessToken: TokenResponse['access_token']
    tokenType: TokenResponse['token_type']
  }) => void
  setUser: (user: UserPublic | null) => void
  setAccessToken: (accessToken: TokenResponse['access_token'] | null) => void
  setTokenType: (tokenType: TokenResponse['token_type'] | null) => void
  logout: () => void
}

type UserStore = IUserState & IUserActions

// const initialState: IUserState = {
//   user: null,
//   accessToken: null,
//   tokenType: null,
// }
const initialState: IUserState = {
  user: {
    id: 10,
    email: 'teacher@example.com',
    first_name: 'Vlavla',
    last_name: 'Kommers',
    role: 'teacher',
    status: 'confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
