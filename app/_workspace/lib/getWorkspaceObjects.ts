import { WorkspaceObjectData } from '../types'
import { client } from '@/sanity/lib/client'
import { workspaceObjectsQuery } from '@/sanity/lib/queries/workspaceObjects'
import { clampObjectPosition } from './clampObjectPosition'
import { generateObjectPositions } from './generateObjectPositions'

/**
 * Slugs to exclude from canvas objects
 * These are now handled by FloatingActionButtons component
 */
const FAB_SLUGS = ['contact', 'contacto', 'sobre-mi', 'sobre-tpzstudio', 'about']

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
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  if (!projectId || !dataset) {
    const mockResult = getMockWorkspaceObjects()
    return mockResult
  }

  try {
    const sanityObjects = await client.fetch(workspaceObjectsQuery)

    if (sanityObjects && Array.isArray(sanityObjects) && sanityObjects.length > 0) {
      // Transform Sanity data to WorkspaceObjectData format
      // TEMPORARY: Clamp positions to ensure visibility (see clampObjectPosition)
      const transformed = sanityObjects
        .filter((obj: any) => {
          // Filter out objects without required fields
          if (!obj.slug || !obj.title || !obj.objectType) {
            return false
          }
          // Filter out FAB-handled objects (contact, about)
          if (FAB_SLUGS.includes(obj.slug)) {
            return false
          }
          return true
        })
        .map((obj: any) => {
          return {
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
        })

      // Generate positions for objects without coordinates
      const result = generateObjectPositions(transformed)

      return result
    }
  } catch {
    // Silently fall through to mock data
  }

  // Fallback to mock data
  const mockResult = getMockWorkspaceObjects()
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
      title: 'Film y redes sociales',
      position: { x: 20, y: 30 },
    },
    {
      id: 'voiceovers',
      slug: 'voiceovers',
      type: 'voiceovers' as const,
      title: 'Locuciones',
      position: { x: 50, y: 25 },
    },
    {
      id: 'branding',
      slug: 'branding',
      type: 'branding' as const,
      title: 'Branding y diseño',
      position: { x: 80, y: 35 },
    },
    {
      id: 'courses',
      slug: 'courses',
      type: 'courses' as const,
      title: 'Cursos y formación',
      position: { x: 30, y: 60 },
    },
    {
      id: 'strategy',
      slug: 'strategy',
      type: 'strategy' as const,
      title: 'Estrategia y consultoría',
      position: { x: 70, y: 65 },
    },
    {
      id: 'projects',
      slug: 'projects',
      type: 'projects' as const,
      title: 'Proyectos',
      position: { x: 50, y: 80 },
    },
    // Contact removed - now handled by FloatingActionButtons
  ]

  // Clamp existing positions and generate positions for any missing
  const withClampedPositions = mockObjects.map((obj) => ({
    ...obj,
    position: clampObjectPosition(obj.position),
  }))

  // Generate positions for any objects still without coordinates
  return generateObjectPositions(withClampedPositions)
}
