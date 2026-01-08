/**
 * Project Archive Page
 * 
 * Route: /workspace/projects
 * 
 * This page is rendered when the project archive panel is open.
 * The Panel component is rendered by WorkspaceRoot based on workspace state.
 * 
 * This page can fetch project list and pass it to the Panel via children.
 */
export default async function ProjectsPage() {
  // TODO: Fetch projects from Sanity
  // const projects = await fetchProjects()
  
  // Panel content will be rendered by WorkspaceRoot
  return (
    <div>
      <h1>Projects</h1>
      <p>Project archive will be rendered here</p>
      {/* TODO: Render project list */}
    </div>
  )
}
