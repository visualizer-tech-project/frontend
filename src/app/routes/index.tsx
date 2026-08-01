import { Roles } from '@/entities/user'
import { AdminPage } from '@/pages/admin'
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyAccountPage,
} from '@/pages/auth'
import { DevPage } from '@/pages/dev'
import { Forbidden, NotFound } from '@/pages/error'
import { HomePage } from '@/pages/home'
import { ProfilePage } from '@/pages/profile'
import { ProgramDetailsPage, ProgramsPage } from '@/pages/programs'
import { ProgressPage } from '@/pages/progress'
import { TrackDetailsPage, TracksPage } from '@/pages/tracks'
import { ROUTES } from '@/shared/config'
import { Navigate } from 'react-router-dom'
import { RequireRole } from '../providers/router/RequireRole'
import { AppLayout } from '../ui/AppLayout'

const authenticatedRoles = [Roles.STUDENT, Roles.TEACHER, Roles.ADMIN]

const requireRole = (element: JSX.Element, roles = authenticatedRoles) => (
  <RequireRole roles={roles}>{element}</RequireRole>
)

export const routes = [
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: requireRole(<HomePage />),
      },
      {
        path: ROUTES.ADMIN,
        element: requireRole(<AdminPage />, [Roles.ADMIN]),
      },
      {
        path: ROUTES.PROGRAMS,
        element: requireRole(<ProgramsPage />),
      },
      {
        path: ROUTES.PROGRAM_DETAILS,
        element: requireRole(<ProgramDetailsPage />),
      },
      {
        path: ROUTES.TRACKS,
        element: requireRole(<TracksPage />),
      },
      {
        path: ROUTES.TRACK_DETAILS,
        element: requireRole(<TrackDetailsPage />),
      },
      {
        path: ROUTES.FORBIDDEN,
        element: requireRole(<Forbidden />),
      },
      {
        path: ROUTES.NOT_FOUND,
        element: requireRole(<NotFound />),
      },
      {
        path: ROUTES.PROFILE,
        element: requireRole(<ProfilePage />),
      },
      {
        path: ROUTES.PROGRESS,
        element: requireRole(<ProgressPage />),
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />,
      },
      {
        path: ROUTES.RESET_PASSWORD,
        element: <ResetPasswordPage />,
      },
      {
        path: ROUTES.VERIFY_EMAIL,
        element: <VerifyAccountPage />,
      },
      {
        path: ROUTES.DEV,
        element: requireRole(<DevPage />, [Roles.ADMIN]),
      },
      {
        path: '*',
        element: requireRole(<Navigate to={ROUTES.NOT_FOUND} replace />),
      },
    ],
  },
]
