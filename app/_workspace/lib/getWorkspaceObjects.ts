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
  // Log configuration for debugging
  console.log('[getWorkspaceObjects] Intentando obtener desde Sanity...')
  
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-12-21'
  
  console.log('[getWorkspaceObjects] Project ID:', projectId ? `${projectId.substring(0, 8)}...` : '❌ Falta')
  console.log('[getWorkspaceObjects] Dataset:', dataset || '❌ Falta')
  console.log('[getWorkspaceObjects] API Version:', apiVersion)
  
  if (!projectId || !dataset) {
    console.error('[getWorkspaceObjects] ❌ Faltan variables de entorno obligatorias')
    console.error('[getWorkspaceObjects] NEXT_PUBLIC_SANITY_PROJECT_ID:', projectId ? 'Configurado' : 'Falta')
    console.error('[getWorkspaceObjects] NEXT_PUBLIC_SANITY_DATASET:', dataset ? 'Configurado' : 'Falta')
    console.log('[getWorkspaceObjects] Usando datos de respaldo...')
    const mockResult = getMockWorkspaceObjects()
    console.log('[getWorkspaceObjects] Usando datos de respaldo:', mockResult.length, 'objetos')
    return mockResult
  }

  try {
    // Try to fetch from Sanity
    console.log('[getWorkspaceObjects] Ejecutando consulta GROQ...')
    console.log('[getWorkspaceObjects] Consulta:', workspaceObjectsQuery)
    
    const sanityObjects = await client.fetch(workspaceObjectsQuery)
    
    console.log('[getWorkspaceObjects] Respuesta bruta de Sanity:', sanityObjects)
    console.log('[getWorkspaceObjects] Cantidad de objetos:', sanityObjects?.length || 0)
    
    if (sanityObjects && Array.isArray(sanityObjects) && sanityObjects.length > 0) {
      // Transform Sanity data to WorkspaceObjectData format
      // TEMPORARY: Clamp positions to ensure visibility (see clampObjectPosition)
      const transformed = sanityObjects
        .filter((obj: any) => {
          // Filter out objects without required fields
          if (!obj.slug || !obj.title || !obj.objectType) {
            console.warn('[getWorkspaceObjects] Omitiendo objeto sin campos obligatorios:', obj)
            return false
          }
          // Filter out FAB-handled objects (contact, about)
          if (FAB_SLUGS.includes(obj.slug)) {
            console.log('[getWorkspaceObjects] Excluyendo objeto gestionado por FAB:', obj.slug)
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
          console.log('[getWorkspaceObjects] Objeto transformado:', transformed)
          return transformed
        })
      
      // Generate positions for objects without coordinates
      const result = generateObjectPositions(transformed)
      
      console.log('[getWorkspaceObjects] ✅ Obtenidos desde Sanity:', result.length, 'objetos')
      console.log('[getWorkspaceObjects] Objetos con posiciones generadas:', result.filter(obj => !sanityObjects.find((s: any) => s._id === obj.id && s.position)).length)
      console.log('[getWorkspaceObjects] Resultado final:', result)
      return result
    } else {
      console.warn('[getWorkspaceObjects] ⚠️ Sanity devolvió vacío o null, usando datos de respaldo')
    }
  } catch (error) {
    console.error('[getWorkspaceObjects] ❌ Error al obtener desde Sanity:', error)
    if (error instanceof Error) {
      console.error('[getWorkspaceObjects] Nombre del error:', error.name)
      console.error('[getWorkspaceObjects] Mensaje del error:', error.message)
      console.error('[getWorkspaceObjects] Traza del error:', error.stack)
      
      // Check for specific error types
      if (error.message.includes('Request error')) {
        console.error('[getWorkspaceObjects] Parece un problema de red/CORS')
        console.error('[getWorkspaceObjects] El cliente de Sanity puede necesitar configuración para uso en cliente')
        console.error('[getWorkspaceObjects] Considera:')
        console.error('[getWorkspaceObjects] 1. Mover la carga a un componente servidor/API')
        console.error('[getWorkspaceObjects] 2. O habilitar CORS en la configuración del proyecto Sanity')
      }
    }
    
    // Log the full error object for debugging
    console.error('[getWorkspaceObjects] Objeto de error completo:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
  }

  // Fallback to mock data
  console.log('[getWorkspaceObjects] Usando datos de respaldo...')
  const mockResult = getMockWorkspaceObjects()
  console.log('[getWorkspaceObjects] Usando datos de respaldo:', mockResult.length, 'objetos')
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
