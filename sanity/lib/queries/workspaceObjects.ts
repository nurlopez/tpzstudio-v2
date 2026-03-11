import { groq } from 'next-sanity'

/**
 * Query to fetch all visible workspace objects
 * Used for initial canvas load (SSG)
 * 
 * Note: visibility defaults to true, so we check for != false
 * This ensures objects without visibility set are included
 * Also filters out objects without slugs (required field)
 */
export const workspaceObjectsQuery = groq`
  *[_type == "workspaceObject" && defined(slug.current) && (!defined(visibility) || visibility != false)] | order(order asc, _createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    objectType,
    shortIntent,
    visibility,
    order,
    position,
    visual {
      asset-> {
        _id,
        url
      },
      alt
    },
    coverImage {
      asset-> {
        _id,
        url
      }
    }
  }
`

/**
 * Query to fetch a single workspace object with full details
 * Used when object panel is opened (runtime)
 */
export const workspaceObjectQuery = groq`
  *[_type == "workspaceObject" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    objectType,
    shortIntent,
    description[] {
      ...,
      _type == "image" => {
        ...,
        asset-> { _id, url }
      }
    },
    visibility,
    order,
    position,
    visual {
      asset-> {
        _id,
        url
      },
      alt
    },
    coverImage {
      asset-> {
        _id,
        url
      }
    },
    capabilities[]-> {
      _type,
      _id,
      title,
      "slug": slug.current,
      coverImage {
        asset-> {
          _id,
          url
        }
      },
      excerpt
    },
    featuredCapabilities[]-> {
      _type,
      _id,
      title,
      "slug": slug.current,
      coverImage {
        asset-> {
          _id,
          url
        }
      },
      excerpt
    },
    showThumbnails,
    relatedPosts[]-> {
      _type,
      _id,
      title,
      "slug": slug.current,
      coverImage {
        asset-> {
          _id,
          url
        }
      },
      excerpt
    },
    cta {
      label,
      url
    }
  }
`
