import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/animations.css'
import App from './App.tsx'
import { ToastProvider } from './components/ToastProvider'
import { ThemeProvider } from './context/ThemeContext'
import { SocketProvider } from './context/SocketContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SocketProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </SocketProvider>
    </ThemeProvider>
  </StrictMode>,
)
