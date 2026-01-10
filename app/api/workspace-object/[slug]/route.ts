import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { workspaceObjectQuery } from '@/sanity/lib/queries/workspaceObjects'

/**
 * API Route: GET /api/workspace-object/[slug]
 * 
 * Fetches a single workspace object by slug.
 * Server-side fetch to avoid CORS issues.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    console.log('[API] Fetching workspace object with slug:', slug)
    const data = await client.fetch(workspaceObjectQuery, { slug })
    
    console.log('[API] Raw Sanity response:', JSON.stringify(data, null, 2))
    console.log('[API] Data.visual:', data?.visual)
    console.log('[API] Data.visual type:', typeof data?.visual)
    console.log('[API] Data.visual keys:', data?.visual ? Object.keys(data.visual) : 'null/undefined')
    
    if (!data) {
      return NextResponse.json(null, { status: 404 })
    }

    // Return only the fields needed for panel display
    // Preserve null/undefined values properly - don't convert null to empty string
    const content: {
      title: string
      shortIntent?: string
      description?: any[]
      visual?: {
        url: string
        alt?: string
      }
      capabilities?: Array<{
        _id: string
        _type: string
        title: string
        slug: string
      }>
    } = {
      title: data.title || '',
    }
    
    // Only include optional fields if they have values
    if (data.shortIntent) {
      content.shortIntent = data.shortIntent
    }
    if (data.description) {
      content.description = data.description
    }
    
    // Handle visual - check multiple possible structures
    if (data.visual) {
      console.log('[API] Processing visual:', JSON.stringify(data.visual, null, 2))
      
      // Check if visual has asset with url
      if (data.visual.asset?.url) {
        content.visual = {
          url: data.visual.asset.url,
          alt: data.visual.alt || undefined,
        }
        console.log('[API] Visual extracted successfully:', content.visual)
      } else {
        console.log('[API] Visual exists but no asset.url found')
        console.log('[API] Visual.asset:', data.visual.asset)
      }
    } else {
      console.log('[API] No visual field in data')
    }
    
    // Handle capabilities - links to projects
    if (data.capabilities && Array.isArray(data.capabilities) && data.capabilities.length > 0) {
      content.capabilities = data.capabilities
        .filter((cap: any) => cap && cap.title && cap.slug)
        .map((cap: any) => ({
          _id: cap._id,
          _type: cap._type,
          title: cap.title,
          slug: cap.slug,
        }))
    }

    console.log('[API] Returning content:', JSON.stringify(content, null, 2))
    console.log('[API] Content.visual:', content.visual)
    return NextResponse.json(content)
  } catch (error) {
    console.error('[API] Error fetching workspace object:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workspace object' },
      { status: 500 }
    )
  }
}
