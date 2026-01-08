/**
 * Object Expanded Page
 * 
 * Route: /workspace/[objectSlug]
 * Examples: /workspace/film, /workspace/voiceovers
 * 
 * This page is rendered when an object is expanded.
 * The Panel component is rendered by WorkspaceRoot based on workspace state.
 * 
 * This page can fetch service data and pass it to the Panel via children.
 */
interface ObjectPageProps {
  params: {
    objectSlug: string
  }
}

export default async function ObjectPage({ params }: ObjectPageProps) {
  // TODO: Fetch service data from Sanity
  // const service = await fetchService(params.objectSlug)
  
  // Panel content will be rendered by WorkspaceRoot
  // This page can provide the content as children
  return (
    <div>
      <h1>Service: {params.objectSlug}</h1>
      <p>Service content will be rendered here</p>
      {/* TODO: Render service details */}
    </div>
  )
}
