import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

/**
 * Object Expanded Page
 * 
 * Route: /[objectSlug]
 * Examples: /film, /voiceovers
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
      title: 'No encontrado',
    }
  }

  const title = object.title || objectSlug
  const description = object.shortIntent || ''

  return {
    title,
    description,
    openGraph: {
      title: `${title} | tpz·studio`,
      description,
      url: `/${objectSlug}`,
    },
    twitter: {
      card: 'summary',
      title: `${title} | tpz·studio`,
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
