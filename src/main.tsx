import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Home.tsx'
import Landing from './Landing.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
