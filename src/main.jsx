import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.scss'
import App from './app/App.jsx'
import { BrowserRouter } from 'react-router'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>,
)
