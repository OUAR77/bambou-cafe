import { useState } from 'react'
import './Reservations.css'

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/3ezjonrq10gunfkhuyseylma1rd5wrpv'

const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00',
]

const today = new Date().toISOString().split('T')[0]

export default function Reservations() {
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('')
  const [persons, setPersons] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [sent, setSent] = useState(false)

  const dayName = new Date(date + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!time) return

    const data = {
      date,
      time,
      persons,
      name,
      phone,
      notes,
    }

    fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {})

    const message = encodeURIComponent(
      `¡Hola! Quiero hacer una reserva en Bambou Café:\n\n` +
      `📅 Fecha: ${dayName}\n` +
      `🕐 Hora: ${time}\n` +
      `👥 Personas: ${persons}\n` +
      `👤 Nombre: ${name}\n` +
      `📞 Teléfono: ${phone}\n` +
      `📝 Notas: ${notes || 'Ninguna'}`
    )

    window.open(`https://wa.me/34614449167?text=${message}`, '_blank')
    setSent(true)
  }

  return (
    <section className="section reservations-section">
      <div className="container">
        <h1 className="section-title">Reserva tu mesa</h1>

        <div className="reservation-card">
          {sent ? (
            <div className="reservation-sent">
              <span className="sent-icon">✅</span>
              <h2>¡Gracias por tu reserva!</h2>
              <p>Te hemos redirigido a WhatsApp para confirmar.</p>
              <button
                className="btn btn-outline"
                onClick={() => setSent(false)}
              >
                Nueva reserva
              </button>
            </div>
          ) : (
            <form className="reservation-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Fecha</label>
                  <div className="date-input-wrapper">
                    <input
                      type="date"
                      id="date"
                      value={date}
                      min={today}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <p className="date-display">{dayName}</p>
                </div>

                <div className="form-group">
                  <label>Hora</label>
                  <div className="time-slots">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`time-slot ${time === t ? 'selected' : ''}`}
                        onClick={() => setTime(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="persons">Personas</label>
                  <div className="persons-selector">
                    <button
                      type="button"
                      onClick={() => setPersons(Math.max(1, persons - 1))}
                    >
                      −
                    </button>
                    <span>{persons}</span>
                    <button
                      type="button"
                      onClick={() => setPersons(Math.min(20, persons + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 614 44 91 67"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notas (opcional)</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Alergias, preferencias, ocasión especial..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!time || !name || !phone}
              >
                Reservar por WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
