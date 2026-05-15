import 'normalize.css'
import { AppRouter, ThemeProvider } from './providers'
import './styles/index.css'
import './styles/variables.css'
import ResponsiveNotice from './ui/responsive-notice/ResponsiveNotice'

function App() {
  return (
    <ThemeProvider>
      <ResponsiveNotice />
      <AppRouter />
    </ThemeProvider>
  )
}

export default App
