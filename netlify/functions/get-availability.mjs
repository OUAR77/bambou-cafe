const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY

const ZONES = {
  'salon-interno': 'Salón Interno',
  'salon-externo': 'Salón Externo',
  'barra': 'Barra',
}

// true = max por reservas, false = max por personas
const ZONE_MODE = {
  'salon-interno': 'people',
  'salon-externo': 'reservations',
  'barra': 'reservations',
}

const MAX_PER_ZONE = {
  'salon-interno': 70,
  'salon-externo': 15,
  'barra': 8,
}

const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00',
]

export async function handler(event) {
  try {
    const params = new URL(event.rawUrl).searchParams
    const date = params.get('date')

    if (!date) {
      return { statusCode: 400, body: 'Missing date param' }
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/reservations?select=zone,time,persons&date=eq.${date}&status=neq.cancelled`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    )

    if (!res.ok) {
      return { statusCode: 500, body: 'DB error' }
    }

    const rows = await res.json()
    const counts = {}
    const peopleCounts = {}
    for (const row of rows) {
      if (!counts[row.zone]) counts[row.zone] = {}
      if (!peopleCounts[row.zone]) peopleCounts[row.zone] = {}
      counts[row.zone][row.time] = (counts[row.zone][row.time] || 0) + 1
      peopleCounts[row.zone][row.time] = (peopleCounts[row.zone][row.time] || 0) + (row.persons || 1)
    }

    const result = {}
    for (const zone of Object.keys(ZONES)) {
      const mode = ZONE_MODE[zone]
      const max = MAX_PER_ZONE[zone]
      result[zone] = {}
      for (const slot of timeSlots) {
        const current = mode === 'people'
          ? (peopleCounts[zone]?.[slot] || 0)
          : (counts[zone]?.[slot] || 0)
        result[zone][slot] = {
          available: current < max,
          current,
          max,
          mode,
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
