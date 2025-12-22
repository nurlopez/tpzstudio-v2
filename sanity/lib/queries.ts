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
    manifesto{
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
    featuredProjects{
      title,
      items[]->{
        _id,
        title,
        slug,
        featured,
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
