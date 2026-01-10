/**
 * Contact Page
 * 
 * Route: /workspace/contact
 * 
 * This page is rendered when the contact panel is open.
 * The Panel component is rendered by WorkspaceRoot based on workspace state.
 * 
 * This page can fetch contact data and pass it to the Panel via children.
 */
export default async function ContactPage() {
  // TODO: Fetch contact data from Sanity
  // const contact = await fetchContactPage()
  
  // Panel content will be rendered by WorkspaceRoot
  return (
    <div>
      <h1>Contact</h1>
      <p>Contact form and details will be rendered here</p>
      {/* TODO: Render contact form, email, phone, social links */}
    </div>
  )
}
