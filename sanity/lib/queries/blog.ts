import { groq } from 'next-sanity'

/**
 * Query to fetch all blog posts for listing page
 * Ordered by published date (newest first)
 */
export const blogPostsQuery = groq`
  *[_type == "blogPost" && defined(publishedAt)] | order(publishedAt desc) {
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
    },
    author {
      name,
      image {
        asset-> {
          _id,
          url
        }
      }
    },
    publishedAt,
    updatedAt,
    categories,
    tags,
    featured,
    readingTime,
    seo {
      metaTitle,
      metaDescription
    }
  }
`

/**
 * Query to fetch a single blog post by slug with full details
 * Used for blog detail page
 */
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body[] {
      ...,
      _type == "image" => {
        ...,
        asset-> { _id, url }
      }
    },
    coverImage {
      asset-> {
        _id,
        url
      },
      alt
    },
    author {
      name,
      image {
        asset-> {
          _id,
          url
        }
      }
    },
    publishedAt,
    updatedAt,
    categories,
    tags,
    featured,
    readingTime,
    seo {
      metaTitle,
      metaDescription,
      ogImage {
        asset-> {
          _id,
          url
        },
        alt
      },
      keywords
    },
    relatedPosts[]-> {
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
      },
      publishedAt
    }
  }
`

/**
 * Query to fetch featured blog posts
 * Used for homepage or featured sections
 */
export const featuredBlogPostsQuery = groq`
  *[_type == "blogPost" && featured == true && defined(publishedAt)] | order(publishedAt desc) [0...3] {
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
    },
    publishedAt,
    categories
  }
`
