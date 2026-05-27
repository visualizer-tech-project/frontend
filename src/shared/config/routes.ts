const PROGRAMS_ROUTE = '/programs'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  REGISTER: '/register',
  ADMIN: '/admin',
  FORBIDDEN: '/forbidden',
  NOT_FOUND: '/not-found',
  PROFILE: '/profile',
  PROGRESS: '/progress',
  SETTINGS: '/settings',
  PROGRAMS: PROGRAMS_ROUTE,
  PROGRAM_DETAILS: `${PROGRAMS_ROUTE}/:programId`,
  TRACKS: '/tracks',
  DEV: '/dev',
} as const
