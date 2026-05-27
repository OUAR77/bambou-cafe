import { getStore } from '@netlify/blobs'

const MAX_PER_ZONE = {
  'salon-interno': 3,
  'salon-externo': 3,
  'barra': 2,
}

export async function handler(event) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!token || !chatId) {
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

    const store = getStore('reservas')
    const storeKey = `counts:${date}`
    const raw = await store.get(storeKey)
    const counts = raw ? JSON.parse(raw) : {}

    const zoneCounts = counts[zone] || {}
    const current = zoneCounts[time] || 0
    const max = MAX_PER_ZONE[zone] || 3

    if (current >= max) {
      return { statusCode: 409, body: 'Slot full' }
    }

    zoneCounts[time] = current + 1
    counts[zone] = zoneCounts
    await store.set(storeKey, JSON.stringify(counts))

    const zoneNames = {
      'salon-interno': 'Salón Interno',
      'salon-externo': 'Salón Externo',
      'barra': 'Barra',
    }

    const lines = [
      '📋 Nueva reserva - Bambou Café',
      '',
      `📍 Zona: ${zoneNames[zone] || zone}`,
      `📅 Fecha: ${date}`,
      `🕐 Hora: ${time}`,
      `👥 Personas: ${data.persons}`,
      `👤 Nombre: ${data.name}`,
      `📞 Teléfono: ${data.phone}`,
    ]
    if (data.notes) {
      lines.push(`📝 Notas: ${data.notes}`)
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return { statusCode: 500, body: `Telegram error: ${err}` }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    }
  } catch (err) {
    return { statusCode: 500, body: err.message }
  }
}
