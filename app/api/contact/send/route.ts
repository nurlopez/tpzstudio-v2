import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const TO_EMAIL = 'tpzstudio@gmail.com'

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('[API] RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Servicio de email no configurado' },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)

    const { name, email, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: 'TPZ Studio <onboarding@resend.dev>',
      to: TO_EMAIL,
      replyTo: email,
      subject: `Nuevo mensaje de ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
    })

    if (error) {
      console.error('[API] Resend error:', error)
      return NextResponse.json(
        { error: 'Error al enviar el mensaje' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Error sending contact email:', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    )
  }
}
