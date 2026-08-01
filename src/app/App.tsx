import 'normalize.css'
import { AppRouter, AuthBootstrap, NotificationProvider, ThemeProvider } from './providers'
import './styles/index.css'
import './styles/variables.css'
import ResponsiveNotice from './ui/responsive-notice/ResponsiveNotice'

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthBootstrap>
          <ResponsiveNotice />
          <AppRouter />
        </AuthBootstrap>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App
