import './Contact.css'

export default function Contact() {
  return (
    <section className="section contact-section">
      <div className="container">
        <h1 className="section-title">Contacto</h1>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-card">
              <span className="contact-icon">📍</span>
              <h3>Dirección</h3>
              <p>Ctra. Almería, 152</p>
              <p>04230 Huércal de Almería, Almería</p>
            </div>

            <div className="contact-card">
              <span className="contact-icon">📞</span>
              <h3>Teléfono</h3>
              <a href="tel:+34614449167">614 44 91 67</a>
            </div>

            <div className="contact-card">
              <span className="contact-icon">🕐</span>
              <h3>Horario</h3>
              <p>Todos los días: 7:00 - 23:00</p>
            </div>

            <div className="contact-card">
              <h3>Síguenos</h3>
              <div className="footer-social">
                <a href="https://instagram.com/bamboucafe" target="_blank" rel="noopener noreferrer">
                  <img src="/images/instagram-new.png" alt="Instagram" className="footer-social-icon" />
                </a>
                <a href="https://facebook.com/bamboucafehuercal" target="_blank" rel="noopener noreferrer">
                  <img src="/images/facebook-new.png" alt="Facebook" className="footer-social-icon" />
                </a>
              </div>
            </div>
          </div>

          <div className="map-container">
            <iframe
              title="Ubicación"
              src="https://www.google.com/maps?q=Ctra.+Almer%C3%ADa+152+04230+Hu%C3%A9rcal+de+Almer%C3%ADa&output=embed"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
