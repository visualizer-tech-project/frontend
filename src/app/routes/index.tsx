import { Roles } from '@/entities/user'
import { LoginPage, RegisterPage } from '@/pages/auth'
import { Forbidden, PageNotFound } from '@/pages/error'
import { HomePage } from '@/pages/home'
import { MainPage } from '@/pages/main'
import { ProfilePage } from '@/pages/profile'
import { AddProgramPage, ProgramPage } from '@/pages/program'
import { StudentPage } from '@/pages/student'
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
        path: ROUTES.MAIN,
        element: <MainPage />,
      },
      {
        path: ROUTES.STUDENT,
        element: <StudentPage />,
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
        path: ROUTES.PROFILE,
        element: (
          <RequireRole roles={[Roles.USER, Roles.ADMIN, Roles.TEACHER]}>
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
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
]
