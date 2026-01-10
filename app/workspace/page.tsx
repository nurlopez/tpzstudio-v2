import { getWorkspaceObjects } from '../_workspace/lib/getWorkspaceObjects'

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
export default async function WorkspacePage() {
  // Fetch objects server-side (where Sanity client works reliably)
  const objects = await getWorkspaceObjects()
  
  // Pass objects to Canvas via WorkspaceRoot
  // Canvas will receive them as props
  return null
}
