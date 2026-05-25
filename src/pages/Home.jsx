import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay" />
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
            Cafetería lounge en Huércal de Almería. Tu lugar de confianza para empezar el día o relajarte por la noche.
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
              <span className="feature-icon">☕</span>
              <h3>Café de Especialidad</h3>
              <p>Selección de cafés de origen para empezar el día con energía.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🌿</span>
              <h3>Ambiente Único</h3>
              <p>Música, iluminación envolvente y un espacio diseñado para ti.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🕐</span>
              <h3>Horario Extendido</h3>
              <p>Abiertos todos los días de 7:00 a 23:00.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📍</span>
              <h3>Huércal de Almería</h3>
              <p>Fácil acceso y aparcamiento cerca del centro.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section gallery-section">
        <div className="container">
          <h2 className="section-title">Nuestro espacio</h2>
          <div className="gallery-grid">
            <div className="gallery-item gallery-item-wide">
              <img src="/images/lounge-1.jpg" alt="Bambou Café interior" />
            </div>
            <div className="gallery-item">
              <img src="/images/lounge-2.jpg" alt="Bambou Café ambiente" />
            </div>
            <div className="gallery-item">
              <img src="/images/lounge-3.jpg" alt="Bambou Café detalles" />
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
                <span className="hours-time">7:00 - 23:00</span>
              </div>
            </div>
            <Link to="/reservas" className="btn btn-primary" style={{ marginTop: 32 }}>
              Reservar mesa
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
