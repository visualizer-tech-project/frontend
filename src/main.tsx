import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { setupApiClient } from './shared/api/client'

setupApiClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
