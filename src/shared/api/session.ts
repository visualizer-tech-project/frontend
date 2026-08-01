import type { TokenResponse } from './generated'

type AccessToken = TokenResponse['access_token'] | null
type TokenType = TokenResponse['token_type'] | null

interface ApiSessionHandlers {
  getAccessToken: () => AccessToken
  setAccessToken: (accessToken: AccessToken, tokenType: TokenType) => void
  clearSession: () => void
}

let handlers: ApiSessionHandlers = {
  getAccessToken: () => null,
  setAccessToken: () => undefined,
  clearSession: () => undefined,
}

export const setApiSessionHandlers = (nextHandlers: ApiSessionHandlers) => {
  handlers = nextHandlers
}

export const getApiAccessToken = () => handlers.getAccessToken()

export const setApiAccessToken = (accessToken: AccessToken, tokenType: TokenType) => {
  handlers.setAccessToken(accessToken, tokenType)
}

export const clearApiSession = () => {
  handlers.clearSession()
}
