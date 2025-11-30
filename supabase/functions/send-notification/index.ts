const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { channel, recipient, message } = await req.json()

    if (!channel || !recipient || !message) {
      throw new Error('Missing required fields: channel, recipient, message')
    }

    let result;

    switch (channel) {
      case 'email':
        result = await sendEmail(recipient, message);
        break;
      case 'sms':
      case 'whatsapp':
        result = await sendTwilio(channel, recipient, message);
        break;
      case 'telegram':
        result = await sendTelegram(recipient, message);
        break;
      default:
        throw new Error(`Unsupported channel: ${channel}`)
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

async function sendEmail(to: string, message: string) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
  const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev'
  
  if (!RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to,
      subject: 'Notification from AgentCommand',
      html: `<p>${message}</p>`
    })
  })

  const data = await res.json()
  if (!res.ok) throw new Error(`Resend Error: ${JSON.stringify(data)}`)
  return { success: true, data }
}

async function sendTwilio(channel: 'sms' | 'whatsapp', to: string, message: string) {
  const ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
  const AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
  const FROM_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')

  if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER) throw new Error('Missing Twilio credentials')

  const formattedTo = channel === 'whatsapp' && !to.startsWith('whatsapp:') ? `whatsapp:${to}` : to
  const formattedFrom = channel === 'whatsapp' && !FROM_NUMBER.startsWith('whatsapp:') ? `whatsapp:${FROM_NUMBER}` : FROM_NUMBER

  const body = new URLSearchParams({
    To: formattedTo,
    From: formattedFrom,
    Body: message
  })

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`)}`
    },
    body: body.toString()
  })

  const data = await res.json()
  if (!res.ok) throw new Error(`Twilio Error: ${JSON.stringify(data)}`)
  return { success: true, data }
}

async function sendTelegram(chatId: string, message: string) {
  const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
  if (!BOT_TOKEN) throw new Error('Missing TELEGRAM_BOT_TOKEN')

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  })

  const data = await res.json()
  if (!res.ok) throw new Error(`Telegram Error: ${JSON.stringify(data)}`)
  return { success: true, data }
}
