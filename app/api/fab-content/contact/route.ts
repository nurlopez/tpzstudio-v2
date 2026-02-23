import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { contactPageQuery } from '@/sanity/lib/queries'

/**
 * API route for fetching contact content for FAB drawer
 * GET /api/fab-content/contact
 */
export async function GET() {
  try {
    const contact = await client.fetch(contactPageQuery)

    if (!contact) {
      return NextResponse.json(
        { error: 'Contenido de contacto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('[API] Error al obtener contenido de contacto:', error)
    return NextResponse.json(
      { error: 'No se pudo obtener el contenido de contacto' },
      { status: 500 }
    )
  }
}
