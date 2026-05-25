import { Roles } from '@/entities/user'
import { ForgotPasswordPage, LoginPage, RegisterPage } from '@/pages/auth'
import { Forbidden, NotFound } from '@/pages/error'
import { HomePage } from '@/pages/home'
import { ProfilePage } from '@/pages/profile'
import { ProgramDetailsPage, ProgramsPage } from '@/pages/programs'
import { TracksPage } from '@/pages/tracks'
import { ROUTES } from '@/shared/config'
import { Navigate } from 'react-router-dom'
import { RequireRole } from '../providers/router/RequireRole'
import { AppLayout } from '../ui/AppLayout'
import { DevPage } from '@/pages/dev'

export const routes = [
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: ROUTES.ADMIN,
        element: (
          <RequireRole roles={[Roles.ADMIN]}>
            <HomePage />
          </RequireRole>
        ),
      },
      {
        path: ROUTES.PROGRAMS,
        element: <ProgramsPage />,
      },
      {
        path: ROUTES.PROGRAM_DETAILS,
        element: <ProgramDetailsPage />,
      },
      {
        path: ROUTES.TRACKS,
        element: <TracksPage />,
      },
      {
        path: ROUTES.FORBIDDEN,
        element: <Forbidden />,
      },
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFound />,
      },
      {
        path: ROUTES.PROFILE,
        element: (
          <RequireRole roles={[Roles.STUDENT, Roles.ADMIN, Roles.TEACHER]}>
            <ProfilePage />
          </RequireRole>
        ),
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
        path: ROUTES.DEV,
        element: <DevPage />,
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.NOT_FOUND} replace />,
      },
    ],
  },
]
