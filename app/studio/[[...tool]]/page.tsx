/**
 * Embedded Sanity Studio route
 * Serves the Sanity Studio at /studio
 */
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
