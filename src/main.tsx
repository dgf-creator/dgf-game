import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

if (import.meta.env.DEV) {
  await import('./devtools')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
