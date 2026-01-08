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
}

export async function getWorkspaceObject(slug: string): Promise<WorkspaceObjectContent | null> {
  if (!slug) {
    return null
  }

  try {
    console.log('[getWorkspaceObject] Fetching object with slug:', slug)
    
    // Use API route to avoid CORS issues
    const response = await fetch(`/api/workspace-object/${slug}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('[getWorkspaceObject] Object not found for slug:', slug)
        return null
      }
      throw new Error(`Failed to fetch: ${response.status}`)
    }
    
    const content = await response.json()
    
    console.log('[getWorkspaceObject] Raw JSON response:', content)
    console.log('[getWorkspaceObject] Content type:', typeof content)
    console.log('[getWorkspaceObject] Content.title:', content?.title)
    console.log('[getWorkspaceObject] Content.title type:', typeof content?.title)
    console.log('[getWorkspaceObject] Content keys:', content ? Object.keys(content) : 'none')
    
    if (!content) {
      console.log('[getWorkspaceObject] No data returned for slug:', slug)
      return null
    }

    // Ensure title is a string, not null or undefined
    const normalizedContent: WorkspaceObjectContent = {
      title: content.title || '',
      ...(content.shortIntent && { shortIntent: content.shortIntent }),
      ...(content.description && { description: content.description }),
      ...(content.visual && { visual: content.visual }),
      ...(content.capabilities && Array.isArray(content.capabilities) && content.capabilities.length > 0 && {
        capabilities: content.capabilities.map((cap: any) => ({
          _id: cap._id,
          _type: cap._type,
          title: cap.title || '',
          slug: cap.slug || '',
        }))
      }),
    }
    
    console.log('[getWorkspaceObject] Normalized content:', normalizedContent)
    console.log('[getWorkspaceObject] Normalized title:', normalizedContent.title)
    console.log('[getWorkspaceObject] Normalized title truthy?', !!normalizedContent.title)
    console.log('[getWorkspaceObject] Normalized visual:', normalizedContent.visual)
    
    return normalizedContent
  } catch (error) {
    console.error('[getWorkspaceObject] Error fetching object:', error)
    if (error instanceof Error) {
      console.error('[getWorkspaceObject] Error message:', error.message)
    }
    return null
  }
}
