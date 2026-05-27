const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    return { statusCode: 500, body: 'Telegram not configured' }
  }

  try {
    const data = JSON.parse(event.body)

    const message =
      `📋 *Nueva reserva - Bambou Café*\n\n` +
      `📅 *Fecha:* ${data.date}\n` +
      `🕐 *Hora:* ${data.time}\n` +
      `👥 *Personas:* ${data.persons}\n` +
      `👤 *Nombre:* ${data.name}\n` +
      `📞 *Teléfono:* ${data.phone}\n` +
      (data.notes ? `📝 *Notas:* ${data.notes}` : '')

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
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
