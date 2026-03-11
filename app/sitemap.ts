import type { MetadataRoute } from 'next'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://tpzstudio.com')

const sitemapBlogPostsQuery = groq`
  *[_type == "blogPost" && defined(publishedAt)] | order(publishedAt desc) {
    "slug": slug.current,
    publishedAt,
    updatedAt
  }
`

const sitemapProjectsQuery = groq`
  *[_type == "project" && defined(slug.current)] | order(_createdAt desc) {
    "slug": slug.current,
    _updatedAt
  }
`

const sitemapWorkspaceObjectsQuery = groq`
  *[_type == "workspaceObject" && defined(slug.current) && (!defined(visibility) || visibility != false)] | order(order asc) {
    "slug": slug.current,
    _updatedAt
  }
`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, projects, workspaceObjects] = await Promise.all([
    client.fetch<{ slug: string; publishedAt: string; updatedAt?: string }[]>(sitemapBlogPostsQuery),
    client.fetch<{ slug: string; _updatedAt: string }[]>(sitemapProjectsQuery),
    client.fetch<{ slug: string; _updatedAt: string }[]>(sitemapWorkspaceObjectsQuery),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/proyectos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contacto`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/sobre-mi`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/proyectos/${project.slug}`,
    lastModified: new Date(project._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const workspaceRoutes: MetadataRoute.Sitemap = workspaceObjects.map((obj) => ({
    url: `${baseUrl}/${obj.slug}`,
    lastModified: new Date(obj._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes, ...projectRoutes, ...workspaceRoutes]
}
