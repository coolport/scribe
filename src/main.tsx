import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'
import Home from './Home.tsx'
import Landing from './Landing.tsx'
import OAuth2RedirectHandler from './OAuth2RedirectHandler.tsx'
import './index.css'

console.log('main.tsx loading...');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/video/:videoUrl" element={<Home />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="*" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>404 - Not Found</h1>
              <p>The page you are looking for does not exist.</p>
              <p>Current path: {window.location.pathname}</p>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

console.log('main.tsx loaded');
