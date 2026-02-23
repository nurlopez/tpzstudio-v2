import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { aboutPageWorkspaceQuery } from '@/sanity/lib/queries'

/**
 * API route for fetching about content for FAB drawer
 * GET /api/fab-content/about
 */
export async function GET() {
  try {
    const about = await client.fetch(aboutPageWorkspaceQuery)

    if (!about) {
      return NextResponse.json(
        { error: 'Contenido de sobre mí no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error('[API] Error al obtener contenido de sobre mí:', error)
    return NextResponse.json(
      { error: 'No se pudo obtener el contenido de sobre mí' },
      { status: 500 }
    )
  }
}
