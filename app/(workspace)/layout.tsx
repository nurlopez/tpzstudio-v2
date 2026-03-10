import { WorkspaceProvider } from '../_workspace/WorkspaceProvider'
import { WorkspaceRoot } from '../_workspace/WorkspaceRoot'
import { getWorkspaceObjects } from '../_workspace/lib/getWorkspaceObjects'
import { client } from '@/sanity/lib/client'
import { workspaceSettingsQuery } from '@/sanity/lib/queries'

/**
 * Workspace Layout
 * 
 * Persistent workspace container that wraps all workspace routes.
 * 
 * Responsibilities:
 * - Provides WorkspaceProvider (persistent state)
 * - Renders WorkspaceRoot (persistent container)
 * - Fetches workspace objects server-side
 * - Workspace-level event handlers (keyboard, resize - handled in WorkspaceRoot)
 * 
 * Key behavior: This layout NEVER UNMOUNTS when navigating between workspace routes.
 * It persists across:
 * - / (canvas home)
 * - /[objectSlug] (object expanded)
 * - /proyectos (project archive)
 * - /proyectos/[slug] (project detail)
 */
export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch workspace objects and settings server-side
  const [objects, settings] = await Promise.all([
    getWorkspaceObjects(),
    client.fetch(workspaceSettingsQuery),
  ])
  const greeting = settings?.workspace?.greeting || null

  return (
    <WorkspaceProvider>
      <WorkspaceRoot objects={objects} greeting={greeting}>{children}</WorkspaceRoot>
    </WorkspaceProvider>
  )
}
