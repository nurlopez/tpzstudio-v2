/**
 * Project Detail Page
 * 
 * Route: /workspace/projects/[slug]
 * 
 * This page is rendered when a project detail overlay is open.
 * The Overlay component is rendered by WorkspaceRoot based on workspace state.
 * 
 * This page can fetch project data and pass it to the Overlay via children.
 */
interface ProjectPageProps {
  params: {
    slug: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // TODO: Fetch project data from Sanity
  // const project = await fetchProject(params.slug)
  
  // Overlay content will be rendered by WorkspaceRoot
  return (
    <div>
      <h1>Project: {params.slug}</h1>
      <p>Project details will be rendered here</p>
      {/* TODO: Render project media, description, credits */}
    </div>
  )
}
