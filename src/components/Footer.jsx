import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/images/logo-transparent.png" alt="Bambou Café" className="footer-logo-img" />
          <p className="footer-desc">
            Tu cafetería lounge de confianza en Huércal de Almería. Disfruta de la mejor
            experiencia con shishas premium y un ambiente único.
          </p>
        </div>

        <div className="footer-col">
          <h4>Enlaces</h4>
          <Link to="/">Inicio</Link>
          <Link to="/carta">Carta</Link>
          <Link to="/reservas">Reservas</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <div className="footer-col">
          <h4>Horario</h4>
          <p>Todos los días: 7:00 - 23:00</p>
        </div>

        <div className="footer-col">
          <h4>Síguenos</h4>
          <div className="footer-social">
            <a href="https://instagram.com/bamboucafe" target="_blank" rel="noopener noreferrer">
              <img src="/images/instagram-new.png" alt="Instagram" className="footer-social-icon" />
            </a>
            <a href="https://facebook.com/bamboucafehuercal" target="_blank" rel="noopener noreferrer">
              <img src="/images/facebook-new.png" alt="Facebook" className="footer-social-icon" />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <p>Ctra. Almería, 152</p>
          <p>04230 Huércal de Almería, Almería</p>
          <a href="tel:+34614449167">614 44 91 67</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bambou Café. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
