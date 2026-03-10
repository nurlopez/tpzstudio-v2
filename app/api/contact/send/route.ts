import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { client } from '@/sanity/lib/client'

const FALLBACK_EMAIL = 'info.tpzstudio@gmail.com'

async function getRecipientEmail(): Promise<string> {
  const result = await client.fetch<{ address?: string } | null>(
    `*[_type == "contactPage"][0].email.address`
  )
  return (typeof result === 'string' && result) ? result : FALLBACK_EMAIL
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
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

    const recipientEmail = await getRecipientEmail()

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: 'TPZ Studio <onboarding@resend.dev>',
      to: recipientEmail,
      replyTo: email,
      subject: `Nuevo mensaje de ${name}`,
      text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Error al enviar el mensaje' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    )
  }
}
