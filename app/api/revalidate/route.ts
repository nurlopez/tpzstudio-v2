import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

/**
 * On-demand revalidation webhook for Sanity.
 *
 * Instead of triggering a full Vercel deployment on every content change,
 * Sanity calls this endpoint which tells Next.js to revalidate only the
 * affected pages. Full deployments are reserved for code changes (git push).
 *
 * Setup:
 * 1. Create a webhook secret in Sanity: Manage → API → Webhooks
 * 2. Set SANITY_REVALIDATE_SECRET in Vercel env vars (same value)
 * 3. Webhook URL: https://yourdomain.com/api/revalidate
 * 4. Trigger on: Create, Update, Delete
 * 5. Projection: {_type, "slug": slug.current}
 */

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: string
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse('Bad request', { status: 400 })
    }

    // Revalidate based on document type
    switch (body._type) {
      case 'workspaceObject':
        // Workspace layout is in the (workspace) layout — revalidate the whole group
        revalidatePath('/', 'layout')
        if (body.slug) {
          revalidatePath(`/${body.slug}`)
        }
        break

      case 'blogPost':
        revalidatePath('/blog', 'page')
        if (body.slug) {
          revalidatePath(`/blog/${body.slug}`)
        }
        break

      case 'project':
        revalidatePath('/proyectos', 'page')
        if (body.slug) {
          revalidatePath(`/proyectos/${body.slug}`)
        }
        break

      case 'siteSettings':
      case 'workspaceSettings':
        // Settings affect many pages
        revalidatePath('/', 'layout')
        break

      case 'aboutPage':
      case 'contactPage':
        // FAB content is fetched client-side via API routes, but
        // revalidate home in case any server-rendered content references them
        revalidatePath('/', 'layout')
        break

      default:
        // Unknown type — revalidate home as a safe fallback
        revalidatePath('/', 'layout')
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: body._type,
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return new NextResponse('Error revalidating', { status: 500 })
  }
}
