import { WorkspaceProvider } from '../_workspace/WorkspaceProvider'
import { WorkspaceRoot } from '../_workspace/WorkspaceRoot'
import { getWorkspaceObjects } from '../_workspace/lib/getWorkspaceObjects'

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
 * - /workspace (canvas home)
 * - /workspace/[objectSlug] (object expanded)
 * - /workspace/projects/[slug] (project detail)
 * - /workspace/contact (contact panel)
 */
export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch workspace objects server-side (where Sanity client works reliably)
  const objects = await getWorkspaceObjects()
  
  return (
    <WorkspaceProvider>
      <WorkspaceRoot objects={objects}>{children}</WorkspaceRoot>
    </WorkspaceProvider>
  )
}
