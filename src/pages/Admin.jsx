import { useState, useEffect, useCallback } from 'react'
import './Admin.css'

const TOKEN_KEY = 'admin_token'
const API = '/.netlify/functions'

const ZONE_NAMES = {
  'salon-interno': 'Salón Interno',
  'salon-externo': 'Salón Externo',
  'barra': 'Barra',
}

export default function Admin() {
  const [token, setToken] = useState(sessionStorage.getItem(TOKEN_KEY) || '')
  const [loggedIn, setLoggedIn] = useState(!!token)
  const [reservations, setReservations] = useState([])
  const [filterDate, setFilterDate] = useState('')
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})

  const login = () => {
    sessionStorage.setItem(TOKEN_KEY, token)
    setLoggedIn(true)
  }

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken('')
    setLoggedIn(false)
  }

  const fetchReservations = useCallback(async () => {
    const params = new URLSearchParams({ token })
    if (filterDate) params.set('date', filterDate)
    const res = await fetch(`${API}/get-reservations?${params}`)
    if (res.ok) setReservations(await res.json())
  }, [token, filterDate])

  useEffect(() => {
    if (loggedIn) fetchReservations()
  }, [loggedIn, fetchReservations])

  const handleCancel = async (id) => {
    if (!confirm('¿Cancelar esta reserva?')) return
    const res = await fetch(`${API}/cancel-reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, id }),
    })
    if (res.ok) fetchReservations()
  }

  const startEdit = (r) => {
    setEditing(r.id)
    setEditForm({ ...r })
  }

  const saveEdit = async () => {
    const res = await fetch(`${API}/update-reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, id: editing, ...editForm }),
    })
    if (res.ok) {
      setEditing(null)
      fetchReservations()
    }
  }

  if (!loggedIn) {
    return (
      <section className="section admin-section">
        <div className="container">
          <h1 className="section-title">Admin</h1>
          <div className="admin-login">
            <input
              type="password"
              placeholder="Contraseña"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
            />
            <button className="btn btn-primary" onClick={login}>Entrar</button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section admin-section">
      <div className="container">
        <div className="admin-header">
          <h1 className="section-title">Reservas</h1>
          <button className="btn btn-outline" onClick={logout}>Salir</button>
        </div>

        <div className="admin-controls">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <button className="btn btn-outline" onClick={() => { setFilterDate(''); fetchReservations() }}>
            Limpiar filtro
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Zona</th>
                <th>Personas</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Notas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 && (
                <tr><td colSpan={9} className="admin-empty">No hay reservas</td></tr>
              )}
              {reservations.map((r) => (
                editing === r.id ? (
                  <tr key={r.id} className="admin-editing">
                    <td><input value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} /></td>
                    <td><input value={editForm.time} onChange={(e) => setEditForm({ ...editForm, time: e.target.value })} /></td>
                    <td>
                      <select value={editForm.zone} onChange={(e) => setEditForm({ ...editForm, zone: e.target.value })}>
                        {Object.entries(ZONE_NAMES).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </td>
                    <td><input type="number" min={1} value={editForm.persons} onChange={(e) => setEditForm({ ...editForm, persons: +e.target.value })} /></td>
                    <td><input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></td>
                    <td><input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></td>
                    <td><input value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} /></td>
                    <td>
                      <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </td>
                    <td className="admin-actions">
                      <button className="btn-save" onClick={saveEdit}>💾</button>
                      <button className="btn-cancel" onClick={() => setEditing(null)}>✕</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={r.id} className={r.status === 'cancelled' ? 'admin-cancelled' : ''}>
                    <td>{r.date}</td>
                    <td>{r.time}</td>
                    <td>{ZONE_NAMES[r.zone] || r.zone}</td>
                    <td>{r.persons}</td>
                    <td>{r.name}</td>
                    <td>{r.phone}</td>
                    <td className="admin-notes">{r.notes}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${r.status}`}>
                        {r.status === 'pending' ? 'Pendiente' : r.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                      </span>
                    </td>
                    <td className="admin-actions">
                      <button className="btn-edit" onClick={() => startEdit(r)} title="Editar">✏️</button>
                      {r.status !== 'cancelled' && (
                        <button className="btn-cancel" onClick={() => handleCancel(r.id)} title="Cancelar">🗑️</button>
                      )}
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
