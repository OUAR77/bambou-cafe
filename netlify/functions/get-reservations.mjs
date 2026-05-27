const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }

export async function handler(event) {
  try {
    const params = new URL(event.rawUrl).searchParams
    const token = params.get('token')

    if (token !== ADMIN_PASSWORD) {
      return { statusCode: 401, body: 'Unauthorized' }
    }

    const date = params.get('date') || ''
    const url = date
      ? `${SUPABASE_URL}/rest/v1/reservations?select=*&date=eq.${date}&order=time.asc`
      : `${SUPABASE_URL}/rest/v1/reservations?select=*&order=created_at.desc`

    const res = await fetch(url, { headers: HEADERS })
    const rows = await res.json()

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows),
    }
  } catch (err) {
    return { statusCode: 500, body: err.message }
  }
}
