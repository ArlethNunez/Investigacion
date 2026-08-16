import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { HomePage } from './pages/HomePage'
import { EventsPage } from './pages/EventsPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { CreateEventPage } from './pages/CreateEventPage'
import { EditEventPage } from './pages/EditEventPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/create" element={<CreateEventPage />} />
          <Route path="/events/:id/edit" element={<EditEventPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

