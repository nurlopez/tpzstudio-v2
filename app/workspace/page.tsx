import { getWorkspaceObjects } from '../_workspace/lib/getWorkspaceObjects'
import { Metadata } from 'next'

/**
 * Workspace Home Page
 * 
 * Canvas home: /workspace
 * 
 * All objects visible, no panel open.
 * 
 * This page renders within the persistent WorkspaceRoot container.
 * The Canvas component is rendered by WorkspaceRoot, not this page.
 * 
 * Fetches workspace objects server-side and passes to Canvas via layout.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Workspace',
    description: 'Explore our creative workspace. Discover our services in film, voiceovers, branding, courses, strategy, and more.',
    openGraph: {
      title: 'Workspace | TPZ Studio',
      description: 'Explore our creative workspace. Discover our services in film, voiceovers, branding, courses, strategy, and more.',
      url: '/workspace',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Workspace | TPZ Studio',
      description: 'Explore our creative workspace. Discover our services in film, voiceovers, branding, courses, strategy, and more.',
    },
  }
}

export default async function WorkspacePage() {
  // Fetch objects server-side (where Sanity client works reliably)
  const objects = await getWorkspaceObjects()
  
  // Pass objects to Canvas via WorkspaceRoot
  // Canvas will receive them as props
  return null
}
