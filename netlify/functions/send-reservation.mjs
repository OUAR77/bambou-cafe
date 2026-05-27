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

    const lines = [
      '📋 Nueva reserva - Bambou Café',
      '',
      `📅 Fecha: ${data.date}`,
      `🕐 Hora: ${data.time}`,
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
