import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

/**
 * Object Expanded Page
 * 
 * Route: /workspace/[objectSlug]
 * Examples: /workspace/film, /workspace/voiceovers
 * 
 * This page is rendered when an object is expanded.
 * The Panel component is rendered by WorkspaceRoot based on workspace state.
 * 
 * Note: This page is not used for service panels - the Panel component
 * fetches workspace object content directly. This page exists for route
 * compatibility but returns null since Panel handles the content.
 */
interface ObjectPageProps {
  params: Promise<{
    objectSlug: string
  }>
}

const workspaceObjectQuery = groq`
  *[_type == "workspaceObject" && slug == $slug][0]{
    title,
    shortIntent,
    description
  }
`

export async function generateMetadata({ params }: ObjectPageProps): Promise<Metadata> {
  const { objectSlug } = await params
  
  // Skip metadata for special routes (handled by their own pages)
  if (objectSlug === 'contacto' || objectSlug === 'contact' || 
      objectSlug === 'sobre-mi' || objectSlug === 'sobre-tpzstudio' || objectSlug === 'about' ||
      objectSlug === 'blog-noticias' || objectSlug === 'blog' || objectSlug === 'noticias') {
    return {}
  }

  const object = await client.fetch(workspaceObjectQuery, { slug: objectSlug })
  
  if (!object) {
    return {
      title: 'Service Not Found | TPZ Studio',
    }
  }

  const title = object.title || objectSlug
  const description = object.shortIntent || object.description || `Learn more about ${title} services at TPZ Studio.`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | TPZ Studio`,
      description,
      url: `/workspace/${objectSlug}`,
    },
    twitter: {
      card: 'summary',
      title: `${title} | TPZ Studio`,
      description,
    },
  }
}

export default async function ObjectPage({ params }: ObjectPageProps) {
  const { objectSlug } = await params
  
  // Panel component handles fetching and rendering workspace object content
  // This page just needs to exist for the route to work
  // Return null - Panel will render the content
  return null
}
