import { redirect } from 'next/navigation'

/**
 * Root Page
 * 
 * Redirects to workspace home.
 * The workspace is the primary entry point.
 */
export default function Page() {
    redirect('/workspace')
}
