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
    seo{
      metaTitle,
      metaDescription,
      ogImage
    },
    branding{
      logo,
      favicon
    }
  }
`

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    hero{
      headline,
      subheadline,
      background{
        mode,
        image,
        videoUrl
      },
      showPrimaryCta,
      secondaryCta{
        label,
        url
      }
    },
    introText{
      body
    },
    manifesto{
      title,
      body
    },
    filosofia{
      title,
      body
    },
    servicesTeaser{
      title,
      body,
      linkLabel,
      linkUrl
    },
    finalCta{
      title,
      body,
      usePrimaryCta
    },
    services{
      title,
      items[]->{
        _id,
        title,
        slug,
        icon,
        shortDescription,
        order
      }
    },
    featuredProjects{
      title,
      items[]->{
        _id,
        title,
        slug,
        excerpt,
        coverImage,
        video{
          provider,
          url
        },
        categories
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
 * Query to fetch about page data for workspace panel
 * Used for about panel in workspace
 */
export const aboutPageWorkspaceQuery = groq`
  *[_type == "aboutPage"][0]{
    title,
    body,
    image {
      asset-> {
        _id,
        url
      },
      alt
    },
    cta {
      text,
      url
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`
