const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

const MAX_PER_ZONE = {
  'salon-interno': 70,
  'salon-externo': 15,
  'barra': 8,
}

const ZONE_NAMES = {
  'salon-interno': 'Salón Interno',
  'salon-externo': 'Salón Externo',
  'barra': 'Barra',
}

const HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' }

export async function handler(event) {
  try {
    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
      return { statusCode: 500, body: 'Telegram not configured' }
    }

    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' }
    }

    const data = JSON.parse(event.body)
    const { date, time, zone } = data

    if (!date || !time || !zone) {
      return { statusCode: 400, body: 'Missing required fields' }
    }

    const countRes = await fetch(
      `${SUPABASE_URL}/rest/v1/reservations?select=id&date=eq.${date}&time=eq.${time}&zone=eq.${zone}&status=neq.cancelled`,
      { headers: HEADERS }
    )

    if (!countRes.ok) {
      return { statusCode: 500, body: 'DB error' }
    }

    const existing = await countRes.json()
    const max = MAX_PER_ZONE[zone] || 3

    if (existing.length >= max) {
      return {
        statusCode: 409,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Slot full', current: existing.length, max }),
      }
    }

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
      method: 'POST',
      headers: { ...HEADERS, Prefer: 'return=representation' },
      body: JSON.stringify({
        date,
        time,
        zone,
        persons: data.persons,
        name: data.name,
        phone: data.phone,
        notes: data.notes || '',
      }),
    })

    if (!insertRes.ok) {
      return { statusCode: 500, body: 'Insert error' }
    }

    const lines = [
      '📋 Nueva reserva - Bambou Café',
      '',
      `📍 Zona: ${ZONE_NAMES[zone] || zone}`,
      `📅 Fecha: ${date}`,
      `🕐 Hora: ${time}`,
      `👥 Personas: ${data.persons}`,
      `👤 Nombre: ${data.name}`,
      `📞 Teléfono: ${data.phone}`,
    ]
    if (data.notes) {
      lines.push(`📝 Notas: ${data.notes}`)
    }

    const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: lines.join('\n') }),
    })

    if (!telegramRes.ok) {
      const err = await telegramRes.text()
      return { statusCode: 500, body: `Telegram error: ${err}` }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    return { statusCode: 500, body: err.message }
  }
}
