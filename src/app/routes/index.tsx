import { Roles } from '@/entities/user'
import { AuthPage } from '@/pages/auth'
import { Forbidden, PageNotFound } from '@/pages/error'
import { HomePage } from '@/pages/home'
import { AddProgramPage, ProgramPage } from '@/pages/program'
import { RequireRole } from '../providers/router/RequireRole'
import { AppLayout } from '../ui/AppLayout'

export const routes = [
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/admin',
        element: (
          <RequireRole roles={[Roles.ADMIN]}>
            <HomePage />,
          </RequireRole>
        ),
      },
      {
        path: '/program',
        element: <ProgramPage />,
      },
      {
        path: '/add-program',
        element: (
          <RequireRole roles={[Roles.ADMIN, Roles.TEACHER]}>
            <AddProgramPage />
          </RequireRole>
        ),
      },
      {
        path: '/forbidden',
        element: <Forbidden />,
      },
      {
        path: '/register',
        element: <AuthPage isLogin={false} />,
      },
      {
        path: '/login',
        element: <AuthPage isLogin />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
]
