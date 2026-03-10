import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'

/**
 * Workspace Home Page
 *
 * Canvas home: /
 *
 * All objects visible, no panel open.
 *
 * This page renders within the persistent WorkspaceRoot container.
 * The Canvas component is rendered by WorkspaceRoot, not this page.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(siteSettingsQuery)
  const title = settings?.pages?.home?.metaTitle || 'tpz·studio'
  const description = settings?.pages?.home?.metaDescription || settings?.seo?.metaDescription || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function WorkspacePage() {
  return null
}
