/**
 * getWorkspaceObject
 * 
 * Fetches a single workspace object by slug with full content.
 * Uses API route to avoid CORS issues (server-side fetch).
 * 
 * VALIDATION STEP: Minimal data wiring, no styling.
 */
export interface WorkspaceObjectContent {
  title: string
  shortIntent?: string
  description?: any[] // Portable text blocks from Sanity
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
}

export async function getWorkspaceObject(slug: string): Promise<WorkspaceObjectContent | null> {
  if (!slug) {
    return null
  }

  try {
    const response = await fetch(`/api/workspace-object/${slug}`)

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`No se pudo obtener: ${response.status}`)
    }

    const content = await response.json()

    if (!content) return null

    // Ensure title is a string, not null or undefined
    const normalizedContent: WorkspaceObjectContent = {
      title: content.title || '',
      ...(content.shortIntent && { shortIntent: content.shortIntent }),
      ...(content.description && { description: content.description }),
      ...(content.showThumbnails && { showThumbnails: true }),
      ...(content.visual && { visual: content.visual }),
      ...(content.capabilities && Array.isArray(content.capabilities) && content.capabilities.length > 0 && {
        capabilities: content.capabilities.map((cap: any) => ({
          _id: cap._id,
          _type: cap._type,
          title: cap.title || '',
          slug: cap.slug || '',
          ...(cap.coverImage && { coverImage: cap.coverImage }),
          ...(cap.excerpt && { excerpt: cap.excerpt }),
        }))
      }),
      ...(content.relatedPosts && Array.isArray(content.relatedPosts) && content.relatedPosts.length > 0 && {
        relatedPosts: content.relatedPosts.map((post: any) => ({
          _id: post._id,
          title: post.title || '',
          slug: post.slug || '',
          ...(post.coverImage && { coverImage: post.coverImage }),
          ...(post.excerpt && { excerpt: post.excerpt }),
        }))
      }),
    }
    
    return normalizedContent
  } catch {
    return null
  }
}
