import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import GradientGrid from './components/GradientGrid.tsx'
import './global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GradientGrid />
  </StrictMode>,
)
