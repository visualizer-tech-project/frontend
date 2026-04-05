import { Roles } from '@/entities/user'
import { LoginPage, RegisterPage } from '@/pages/auth'
import { Forbidden, PageNotFound } from '@/pages/error'
import { HomePage } from '@/pages/home'
import { AddProgramPage, ProgramPage } from '@/pages/program'
import { ROUTES } from '@/shared/config'
import { RequireRole } from '../providers/router/RequireRole'
import { AppLayout } from '../ui/AppLayout'

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
        element: <ProgramPage />,
      },
      {
        path: ROUTES.ADD_PROGRAM,
        element: (
          <RequireRole roles={[Roles.ADMIN, Roles.TEACHER]}>
            <AddProgramPage />
          </RequireRole>
        ),
      },
      {
        path: ROUTES.FORBIDDEN,
        element: <Forbidden />,
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
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
]
