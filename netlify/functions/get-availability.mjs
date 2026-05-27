import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const ZONES = {
  'salon-interno': 'Salón Interno',
  'salon-externo': 'Salón Externo',
  'barra': 'Barra',
}

const MAX_PER_ZONE = {
  'salon-interno': 15,
  'salon-externo': 15,
  'barra': 8,
}

const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00',
]

const DATA_PATH = join('/tmp', 'reservas-data.json')

function readCounts() {
  try {
    if (existsSync(DATA_PATH)) {
      return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
    }
  } catch {}
  return {}
}

export async function handler(event) {
  try {
    const params = new URL(event.rawUrl).searchParams
    const date = params.get('date')

    if (!date) {
      return { statusCode: 400, body: 'Missing date param' }
    }

    const counts = readCounts()
    const dateCounts = counts[date] || {}

    const result = {}
    for (const zone of Object.keys(ZONES)) {
      const zoneCounts = dateCounts[zone] || {}
      result[zone] = {}
      for (const slot of timeSlots) {
        const current = zoneCounts[slot] || 0
        result[zone][slot] = {
          available: current < MAX_PER_ZONE[zone],
          current,
          max: MAX_PER_ZONE[zone],
        }
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zones: result, zoneNames: ZONES }),
    }
  } catch (err) {
    return { statusCode: 500, body: err.message }
  }
}
