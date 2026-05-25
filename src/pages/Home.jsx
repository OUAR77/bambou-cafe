import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <img src="/images/logo-transparent.png" alt="Bambou Café" />
          <p className="hero-brand-sub">Cafetería Lounge</p>
          <div className="hero-social">
            <a href="https://instagram.com/bamboucafe" target="_blank" rel="noopener noreferrer">
              <img src="/images/instagram-new.png" alt="Instagram" className="social-icon" />
            </a>
            <a href="https://facebook.com/bamboucafehuercal" target="_blank" rel="noopener noreferrer">
              <img src="/images/facebook-new.png" alt="Facebook" className="social-icon" />
            </a>
          </div>
          <p className="hero-desc">
            Cafetería lounge en Huércal de Almería.
          </p>
          <div className="hero-buttons">
            <Link to="/reservas" className="btn btn-primary">
              Reservar
            </Link>
            <Link to="/carta" className="btn-outline-light">
              Carta
            </Link>
          </div>
        </div>
      </section>

      <section className="section features-section">
        <div className="container">
          <h2 className="section-title">Un espacio para disfrutar</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Shishas Premium</h3>
              <p>Las mejores marcas y sabores seleccionados para tu disfrute.</p>
            </div>
            <div className="feature-card">
              <h3>Ambiente Único</h3>
              <p>Música en vivo, iluminación envolvente y decoración cuidada.</p>
            </div>
            <div className="feature-card">
              <h3>Horario Extendido</h3>
              <p>Abiertos todos los días de 7:00 a 23:00.</p>
            </div>
            <div className="feature-card">
              <h3>Huércal de Almería</h3>
              <p>Fácil acceso y aparcamiento cerca del centro.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section hours-section">
        <div className="container hours-content">
          <div className="hours-info">
            <h2 className="section-title">Horarios</h2>
            <div className="hours-list">
              <div className="hours-row">
                <span>Todos los días</span>
                <span>7:00 - 23:00</span>
              </div>
            </div>
            <Link to="/reservas" className="btn btn-primary" style={{ marginTop: 24 }}>
              Reservar
            </Link>
          </div>
          <div className="hours-decoration">
            <span className="big-icon">☕</span>
          </div>
        </div>
      </section>
    </>
  )
}
