const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' }

export async function handler(event) {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' }
    }

    const { token, id, ...fields } = JSON.parse(event.body)

    if (token !== ADMIN_PASSWORD) {
      return { statusCode: 401, body: 'Unauthorized' }
    }

    const allowed = ['date', 'time', 'zone', 'persons', 'name', 'phone', 'notes', 'status']
    const update = {}
    for (const key of allowed) {
      if (fields[key] !== undefined) update[key] = fields[key]
    }

    if (Object.keys(update).length === 0) {
      return { statusCode: 400, body: 'No fields to update' }
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${id}`, {
      method: 'PATCH',
      headers: { ...HEADERS, Prefer: 'return=representation' },
      body: JSON.stringify(update),
    })

    if (!res.ok) {
      return { statusCode: 500, body: 'Update error' }
    }

    const updated = await res.json()

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }
  } catch (err) {
    return { statusCode: 500, body: err.message }
  }
}
