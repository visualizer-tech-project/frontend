import { API_BASE_URL } from '@/shared/config'
import { getErrorMessage } from '@/shared/lib/notify'
import type { RefreshResponse } from './generated'
import { client } from './generated/client.gen'
import { clearApiSession, getApiAccessToken, setApiAccessToken } from './session'

type RefreshTokenPayload = Pick<RefreshResponse, 'access_token' | 'token_type'>

type RefreshAccessTokenResult =
  | {
      reason?: never
      token: RefreshTokenPayload
      type: 'success'
    }
  | {
      reason: 'invalid' | 'rate_limited' | 'unavailable'
      token?: never
      type: 'failed'
    }

const AUTHORIZATION_HEADER = 'Authorization'
const REFRESH_PATH = '/api/v1/auth/refresh'

const SESSION_EXPIRED_MESSAGE = 'Сессия истекла. Войдите снова.'
const SESSION_REFRESH_RATE_LIMITED_MESSAGE =
  'Слишком много запросов на обновление сессии. Повторите действие через несколько секунд.'
const SESSION_REFRESH_UNAVAILABLE_MESSAGE =
  'Не удалось обновить сессию. Проверьте соединение и повторите действие.'

const REFRESH_EXCLUDED_PATHS = new Set([
  '/api/v1/auth/forgot-password',
  '/api/v1/auth/login',
  '/api/v1/auth/logout',
  REFRESH_PATH,
  '/api/v1/auth/register',
  '/api/v1/auth/reset-password',
  '/api/v1/auth/verify',
])

let isConfigured = false
let refreshPromise: Promise<RefreshAccessTokenResult> | null = null

const normalizePath = (path: string) => {
  const normalized = path.replace(/\/+$/, '')
  return normalized || '/'
}

const getRequestPath = (request: Request) => {
  try {
    return normalizePath(new URL(request.url).pathname)
  } catch {
    return normalizePath(request.url.replace(API_BASE_URL, ''))
  }
}

const isRefreshExcludedRequest = (request: Request) =>
  REFRESH_EXCLUDED_PATHS.has(getRequestPath(request))

const withAccessToken = (request: Request, accessToken = getApiAccessToken()) => {
  if (
    !accessToken ||
    request.headers.has(AUTHORIZATION_HEADER) ||
    isRefreshExcludedRequest(request)
  ) {
    return request
  }

  const headers = new Headers(request.headers)
  headers.set(AUTHORIZATION_HEADER, `Bearer ${accessToken}`)

  return new Request(request, { headers })
}

const getBearerToken = (request: Request) => {
  const authorization = request.headers.get(AUTHORIZATION_HEADER)
  const [scheme, token] = authorization?.split(' ') ?? []

  return scheme?.toLowerCase() === 'bearer' && token ? token : null
}

const readRefreshPayload = (payload: unknown): RefreshTokenPayload | null => {
  if (typeof payload !== 'object' || payload === null || !('access_token' in payload)) {
    return null
  }

  const accessToken = payload.access_token
  const tokenType = 'token_type' in payload ? payload.token_type : 'bearer'

  if (typeof accessToken !== 'string' || !accessToken) {
    return null
  }

  return {
    access_token: accessToken,
    token_type: typeof tokenType === 'string' && tokenType ? tokenType : 'bearer',
  }
}

const shouldRefreshSession = async (response: Response) => {
  if (response.status === 401) {
    return true
  }

  if (response.status !== 422) {
    return false
  }

  try {
    const error = await response.clone().json()
    return getErrorMessage(error, '') === 'Not authenticated'
  } catch {
    return false
  }
}

const createAuthErrorResponse = (sourceResponse: Response, detail: string, status = 401) =>
  new Response(JSON.stringify({ detail }), {
    headers: {
      'Content-Type': 'application/json',
    },
    status,
    statusText: sourceResponse.statusText,
  })

const expireSession = () => {
  clearApiSession()
}

const refreshAccessToken = async () => {
  refreshPromise ??= (async () => {
    try {
      const response = await globalThis.fetch(`${API_BASE_URL}${REFRESH_PATH}`, {
        credentials: 'include',
        method: 'POST',
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return {
            reason: 'invalid',
            type: 'failed',
          }
        }

        if (response.status === 429) {
          return {
            reason: 'rate_limited',
            type: 'failed',
          }
        }

        return {
          reason: 'unavailable',
          type: 'failed',
        }
      }

      const token = readRefreshPayload(await response.json())

      if (!token) {
        return {
          reason: 'unavailable',
          type: 'failed',
        }
      }

      setApiAccessToken(token.access_token, token.token_type)

      return {
        token,
        type: 'success',
      }
    } catch {
      return {
        reason: 'unavailable',
        type: 'failed',
      }
    } finally {
      refreshPromise = null
    }
  })() satisfies Promise<RefreshAccessTokenResult>

  return refreshPromise
}

const retryWithToken = async (request: Request, accessToken: string) => {
  const headers = new Headers(request.headers)
  headers.set(AUTHORIZATION_HEADER, `Bearer ${accessToken}`)

  return globalThis.fetch(
    new Request(request, {
      credentials: 'include',
      headers,
    }),
  )
}

const apiFetch: typeof fetch = async (input, init) => {
  const originalRequest = input instanceof Request ? input : new Request(input, init)
  const request = withAccessToken(originalRequest)
  const retryRequest = request.clone()

  const response = await globalThis.fetch(request)

  if (isRefreshExcludedRequest(request) || !(await shouldRefreshSession(response))) {
    return response
  }

  const requestAccessToken = getBearerToken(request)
  const currentAccessToken = getApiAccessToken()

  if (currentAccessToken && currentAccessToken !== requestAccessToken) {
    const currentTokenResponse = await retryWithToken(retryRequest.clone(), currentAccessToken)

    if (!(await shouldRefreshSession(currentTokenResponse))) {
      return currentTokenResponse
    }
  }

  const refreshedTokenResult = await refreshAccessToken()

  if (refreshedTokenResult.type === 'failed') {
    if (refreshedTokenResult.reason === 'invalid') {
      expireSession()
      return createAuthErrorResponse(response, SESSION_EXPIRED_MESSAGE)
    }

    return createAuthErrorResponse(
      response,
      refreshedTokenResult.reason === 'rate_limited'
        ? SESSION_REFRESH_RATE_LIMITED_MESSAGE
        : SESSION_REFRESH_UNAVAILABLE_MESSAGE,
      refreshedTokenResult.reason === 'rate_limited' ? 429 : 503,
    )
  }

  const retryResponse = await retryWithToken(retryRequest, refreshedTokenResult.token.access_token)

  if (await shouldRefreshSession(retryResponse)) {
    expireSession()
    return createAuthErrorResponse(retryResponse, SESSION_EXPIRED_MESSAGE)
  }

  return retryResponse
}

export const setupApiClient = () => {
  if (isConfigured) {
    return
  }

  client.setConfig({
    auth: () => getApiAccessToken() ?? undefined,
    baseUrl: API_BASE_URL,
    credentials: 'include',
    fetch: apiFetch,
  })

  isConfigured = true
}
