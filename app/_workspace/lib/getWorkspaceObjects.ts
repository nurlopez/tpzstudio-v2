import { WorkspaceObjectData } from '../types'
import { client } from '@/sanity/lib/client'
import { workspaceObjectsQuery } from '@/sanity/lib/queries/workspaceObjects'
import { clampObjectPosition } from './clampObjectPosition'
import { generateObjectPositions } from './generateObjectPositions'

/**
 * getWorkspaceObjects
 * 
 * Fetches workspace objects from Sanity, with fallback to mock data.
 * 
 * Returns workspace objects with:
 * - id
 * - slug
 * - type (objectType from Sanity)
 * - title
 * - position (optional)
 */
export async function getWorkspaceObjects(): Promise<WorkspaceObjectData[]> {
  // Log configuration for debugging
  console.log('[getWorkspaceObjects] Attempting to fetch from Sanity...')
  
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-12-21'
  
  console.log('[getWorkspaceObjects] Project ID:', projectId ? `${projectId.substring(0, 8)}...` : '❌ Missing')
  console.log('[getWorkspaceObjects] Dataset:', dataset || '❌ Missing')
  console.log('[getWorkspaceObjects] API Version:', apiVersion)
  
  if (!projectId || !dataset) {
    console.error('[getWorkspaceObjects] ❌ Missing required environment variables')
    console.error('[getWorkspaceObjects] NEXT_PUBLIC_SANITY_PROJECT_ID:', projectId ? 'Set' : 'Missing')
    console.error('[getWorkspaceObjects] NEXT_PUBLIC_SANITY_DATASET:', dataset ? 'Set' : 'Missing')
    console.log('[getWorkspaceObjects] Falling back to mock data...')
    const mockResult = getMockWorkspaceObjects()
    console.log('[getWorkspaceObjects] Using mock data:', mockResult.length, 'objects')
    return mockResult
  }

  try {
    // Try to fetch from Sanity
    console.log('[getWorkspaceObjects] Executing GROQ query...')
    console.log('[getWorkspaceObjects] Query:', workspaceObjectsQuery)
    
    const sanityObjects = await client.fetch(workspaceObjectsQuery)
    
    console.log('[getWorkspaceObjects] Raw Sanity response:', sanityObjects)
    console.log('[getWorkspaceObjects] Object count:', sanityObjects?.length || 0)
    
    if (sanityObjects && Array.isArray(sanityObjects) && sanityObjects.length > 0) {
      // Transform Sanity data to WorkspaceObjectData format
      // TEMPORARY: Clamp positions to ensure visibility (see clampObjectPosition)
      const transformed = sanityObjects
        .filter((obj: any) => {
          // Filter out objects without required fields
          if (!obj.slug || !obj.title || !obj.objectType) {
            console.warn('[getWorkspaceObjects] Skipping object with missing required fields:', obj)
            return false
          }
          return true
        })
        .map((obj: any) => {
          const transformed = {
            id: obj._id,
            slug: obj.slug,
            type: obj.objectType as WorkspaceObjectData['type'],
            title: obj.title,
            position: clampObjectPosition(
              obj.position ? { x: obj.position.x, y: obj.position.y } : undefined
            ),
            visual: obj.visual?.asset?.url
              ? {
                  url: obj.visual.asset.url,
                  alt: obj.visual.alt || undefined,
                }
              : undefined,
          }
          console.log('[getWorkspaceObjects] Transformed object:', transformed)
          return transformed
        })
      
      // Generate positions for objects without coordinates
      const result = generateObjectPositions(transformed)
      
      console.log('[getWorkspaceObjects] ✅ Successfully fetched from Sanity:', result.length, 'objects')
      console.log('[getWorkspaceObjects] Objects with generated positions:', result.filter(obj => !sanityObjects.find((s: any) => s._id === obj.id && s.position)).length)
      console.log('[getWorkspaceObjects] Final result:', result)
      return result
    } else {
      console.warn('[getWorkspaceObjects] ⚠️ Sanity returned empty array or null, using mock data')
    }
  } catch (error) {
    console.error('[getWorkspaceObjects] ❌ Error fetching from Sanity:', error)
    if (error instanceof Error) {
      console.error('[getWorkspaceObjects] Error name:', error.name)
      console.error('[getWorkspaceObjects] Error message:', error.message)
      console.error('[getWorkspaceObjects] Error stack:', error.stack)
      
      // Check for specific error types
      if (error.message.includes('Request error')) {
        console.error('[getWorkspaceObjects] This appears to be a network/CORS issue')
        console.error('[getWorkspaceObjects] The Sanity client may need to be configured for client-side use')
        console.error('[getWorkspaceObjects] Consider:')
        console.error('[getWorkspaceObjects] 1. Moving fetch to server component/API route')
        console.error('[getWorkspaceObjects] 2. Or ensuring CORS is enabled in Sanity project settings')
      }
    }
    
    // Log the full error object for debugging
    console.error('[getWorkspaceObjects] Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
  }

  // Fallback to mock data
  console.log('[getWorkspaceObjects] Falling back to mock data...')
  const mockResult = getMockWorkspaceObjects()
  console.log('[getWorkspaceObjects] Using mock data:', mockResult.length, 'objects')
  return mockResult
}

/**
 * Mock workspace objects (fallback)
 * TEMPORARY: Positions are clamped to ensure visibility
 */
function getMockWorkspaceObjects(): WorkspaceObjectData[] {
  const mockObjects = [
    {
      id: 'film',
      slug: 'film',
      type: 'film' as const,
      title: 'Film & Social Media',
      position: { x: 20, y: 30 },
    },
    {
      id: 'voiceovers',
      slug: 'voiceovers',
      type: 'voiceovers' as const,
      title: 'Voiceovers',
      position: { x: 50, y: 25 },
    },
    {
      id: 'branding',
      slug: 'branding',
      type: 'branding' as const,
      title: 'Branding & Design',
      position: { x: 80, y: 35 },
    },
    {
      id: 'courses',
      slug: 'courses',
      type: 'courses' as const,
      title: 'Courses & Education',
      position: { x: 30, y: 60 },
    },
    {
      id: 'strategy',
      slug: 'strategy',
      type: 'strategy' as const,
      title: 'Strategy & Consulting',
      position: { x: 70, y: 65 },
    },
    {
      id: 'projects',
      slug: 'projects',
      type: 'projects' as const,
      title: 'Projects',
      position: { x: 50, y: 80 },
    },
    {
      id: 'contact',
      slug: 'contact',
      type: 'contact' as const,
      title: 'Get in Touch',
      position: { x: 90, y: 90 },
    },
  ]

  // Clamp existing positions and generate positions for any missing
  const withClampedPositions = mockObjects.map((obj) => ({
    ...obj,
    position: clampObjectPosition(obj.position),
  }))
  
  // Generate positions for any objects still without coordinates
  return generateObjectPositions(withClampedPositions)
}
