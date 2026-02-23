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
        { error: 'El slug es obligatorio' },
        { status: 400 }
      )
    }

    const data = await client.fetch(workspaceObjectQuery, { slug })

    if (!data) {
      return NextResponse.json(null, { status: 404 })
    }

    // Return only the fields needed for panel display
    // Preserve null/undefined values properly - don't convert null to empty string
    const content: {
      title: string
      shortIntent?: string
      description?: any[]
      showThumbnails?: boolean
      visual?: {
        url: string
        alt?: string
      }
      capabilities?: Array<{
        _id: string
        _type: string
        title: string
        slug: string
        coverImage?: { url: string }
        excerpt?: string
      }>
      relatedPosts?: Array<{
        _id: string
        title: string
        slug: string
        coverImage?: { url: string }
        excerpt?: string
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
    if (data.showThumbnails) {
      content.showThumbnails = true
    }

    if (data.visual?.asset?.url) {
      content.visual = {
        url: data.visual.asset.url,
        alt: data.visual.alt || undefined,
      }
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
          ...(cap.coverImage?.asset?.url && { coverImage: { url: cap.coverImage.asset.url } }),
          ...(cap.excerpt && { excerpt: cap.excerpt }),
        }))
    }

    // Handle related blog posts
    if (data.relatedPosts && Array.isArray(data.relatedPosts) && data.relatedPosts.length > 0) {
      content.relatedPosts = data.relatedPosts
        .filter((post: any) => post && post.title && post.slug)
        .map((post: any) => ({
          _id: post._id,
          title: post.title,
          slug: post.slug,
          ...(post.coverImage?.asset?.url && { coverImage: { url: post.coverImage.asset.url } }),
          ...(post.excerpt && { excerpt: post.excerpt }),
        }))
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('[API] Error al obtener objeto del workspace:', error)
    return NextResponse.json(
      { error: 'No se pudo obtener el objeto del workspace' },
      { status: 500 }
    )
  }
}
