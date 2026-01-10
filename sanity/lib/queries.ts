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
