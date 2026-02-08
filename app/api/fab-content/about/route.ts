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
        { error: 'About content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error('[API] Error fetching about content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}
