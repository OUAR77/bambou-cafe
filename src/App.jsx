import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Reservations from './pages/Reservations'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="carta" element={<Menu />} />
        <Route path="reservas" element={<Reservations />} />
        <Route path="contacto" element={<Contact />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
