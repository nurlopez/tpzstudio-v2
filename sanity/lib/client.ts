import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Disable CDN so on-demand revalidation always sees fresh data.
  // With tag-based revalidation, Next.js handles caching — the CDN
  // would serve stale responses and defeat the purpose.
  useCdn: false,
})
