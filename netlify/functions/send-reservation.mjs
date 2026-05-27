import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const MAX_PER_ZONE = {
  'salon-interno': 3,
  'salon-externo': 3,
  'barra': 2,
}

const ZONE_NAMES = {
  'salon-interno': 'Salón Interno',
  'salon-externo': 'Salón Externo',
  'barra': 'Barra',
}

const DATA_PATH = join('/tmp', 'reservas-data.json')

function readCounts() {
  try {
    if (existsSync(DATA_PATH)) {
      return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
    }
  } catch {}
  return {}
}

function saveCounts(counts) {
  writeFileSync(DATA_PATH, JSON.stringify(counts))
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

    const counts = readCounts()
    if (!counts[date]) counts[date] = {}
    if (!counts[date][zone]) counts[date][zone] = {}

    const current = counts[date][zone][time] || 0
    const max = MAX_PER_ZONE[zone] || 3

    if (current >= max) {
      return {
        statusCode: 409,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Slot full', current, max }),
      }
    }

    counts[date][zone][time] = current + 1
    saveCounts(counts)

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
