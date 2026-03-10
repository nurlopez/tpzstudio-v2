// sanity/lib/queries.ts
import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    title,
    siteUrl,
    cta{
      label,
      url
    },
    social,
    contact,
    pages{
      home{
        metaTitle,
        metaDescription
      },
      projects{
        metaTitle,
        metaDescription
      },
      blog{
        metaTitle,
        metaDescription
      }
    },
    seo{
      metaTitle,
      metaDescription,
      ogImage{
        asset->{
          _id,
          url
        }
      }
    },
    branding{
      logo{
        asset->{
          _id,
          url
        }
      },
      favicon{
        asset->{
          _id,
          url
        }
      }
    }
  }
`

export const contactPageQuery = groq`
  *[_type == "contactPage"][0]{
    title,
    introText,
    phone{
      number,
      url
    },
    email{
      address,
      label
    },
    socialMedia{
      instagram,
      vimeo,
      youtube,
      tiktok,
      linkedin
    },
    seo{
      metaTitle,
      metaDescription
    }
  }
`

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0]{
    title,
    body,
    image,
    cta{
      text,
      url
    },
    seo{
      metaTitle,
      metaDescription
    }
  }
`

/**
 * Query to fetch a single project by slug with all details
 * Used for project detail overlay in workspace
 */
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    video {
      provider,
      url
    },
    coverImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    categories,
    credits[] {
      role,
      name
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage {
        asset-> {
          _id,
          url
        },
        alt
      }
    }
  }
`

/**
 * Query to fetch all projects for workspace archive panel
 * Used for project archive panel in workspace
 */
export const projectsArchiveQuery = groq`
  *[_type == "project"] | order(_createdAt desc)[0...12]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage {
      asset-> {
        _id,
        url
      },
      alt
    }
  }
`

/**
 * Query to fetch related projects by shared categories
 * Used for the carousel at the bottom of project detail pages
 */
export const relatedProjectsQuery = groq`
  *[_type == "project" && slug.current != $currentSlug && count(categories[lower(@) in $categoriesLower]) > 0]
    | order(_createdAt desc)[0...8]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      coverImage {
        asset-> {
          _id,
          url
        },
        alt
      }
    }
`

/**
 * Query to fetch about page data for workspace panel
 * Used for about panel in workspace
 */
export const workspaceSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    workspace{
      greeting
    }
  }
`

