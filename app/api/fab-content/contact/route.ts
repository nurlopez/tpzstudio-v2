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
        { error: 'Contact content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('[API] Error fetching contact content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact content' },
      { status: 500 }
    )
  }
}
