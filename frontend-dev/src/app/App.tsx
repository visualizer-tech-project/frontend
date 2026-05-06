import 'normalize.css'
import { AppRouter, ThemeProvider } from './providers'
import './styles/index.css'
import './styles/variables.css'

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  )
}

export default App
