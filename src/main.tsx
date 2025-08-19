import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Index from './Index.tsx'
import Pokemon from './review/Pokemon.tsx'
import Todo from './review/Todo.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="pokemon" element={<Pokemon />} />
        <Route path="todo" element={<Todo />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
