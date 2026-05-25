import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Header.css'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/carta', label: 'Carta' },
  { to: '/reservas', label: 'Reservas' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="logo">
          <img src="/images/logo-transparent.png" alt="Bambou Café" className="logo-img" />
        </Link>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
