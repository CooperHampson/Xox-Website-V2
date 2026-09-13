import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CurrencyProvider } from './pages/Merch/currency/CurrencyContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <HashRouter>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </HashRouter>
    </HelmetProvider>
  </StrictMode>,
)
