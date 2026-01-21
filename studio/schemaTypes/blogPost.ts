import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
    name: 'blogPost',
    title: 'Blog Post',
    type: 'document',
    description: 'Blog posts and news articles for SEO and content marketing.',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required().max(100),
            description: 'Main title of the blog post (max 100 characters for SEO).',
        }),

        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
            description: 'URL-friendly identifier. Used in /blog/[slug] route.',
        }),

        defineField({
            name: 'excerpt',
            title: 'Excerpt / Summary',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.required().max(300),
            description: 'Short summary for listings and meta description (max 300 characters).',
        }),

        defineField({
            name: 'body',
            title: 'Content',
            type: 'array',
            of: [
                {
                    type: 'block',
                },
                {
                    type: 'image',
                    fields: [
                        {
                            name: 'alt',
                            title: 'Alt Text',
                            type: 'string',
                            description: 'Important for SEO and accessibility.',
                        },
                    ],
                },
            ],
            validation: (Rule) => Rule.required(),
            description: 'Main content of the blog post (rich text with formatting).',
        }),

        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
            description: 'Main image for the blog post. Used in listings and social sharing.',
            fields: [
                {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                    validation: (Rule) => Rule.required(),
                    description: 'Describe the image for SEO and accessibility.',
                },
            ],
        }),

        defineField({
            name: 'author',
            title: 'Author',
            type: 'object',
            fields: [
                defineField({
                    name: 'name',
                    title: 'Author Name',
                    type: 'string',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'image',
                    title: 'Author Image',
                    type: 'image',
                    options: { hotspot: true },
                }),
            ],
            description: 'Author information for the blog post.',
        }),

        defineField({
            name: 'publishedAt',
            title: 'Published Date',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
            initialValue: () => new Date().toISOString(),
            description: 'Publication date. Used for sorting and display.',
        }),

        defineField({
            name: 'updatedAt',
            title: 'Last Updated',
            type: 'datetime',
            description: 'Last modification date. Optional, for tracking updates.',
        }),

        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
            description: 'Categories for organizing posts (e.g., "News", "Reflections", "Updates").',
        }),

        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
            description: 'Tags for additional categorization and SEO.',
        }),

        defineField({
            name: 'featured',
            title: 'Featured Post',
            type: 'boolean',
            initialValue: false,
            description: 'Featured posts appear prominently in listings.',
        }),

        defineField({
            name: 'readingTime',
            title: 'Reading Time (minutes)',
            type: 'number',
            validation: (Rule) => Rule.min(1).max(60),
            description: 'Estimated reading time in minutes. Optional, can be auto-calculated.',
        }),

        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'object',
            description: 'SEO metadata for search engines and social sharing.',
            fields: [
                defineField({
                    name: 'metaTitle',
                    title: 'Meta Title',
                    type: 'string',
                    validation: (Rule) => Rule.max(60),
                    description: 'SEO title (max 60 characters). Defaults to post title if empty.',
                }),
                defineField({
                    name: 'metaDescription',
                    title: 'Meta Description',
                    type: 'text',
                    rows: 3,
                    validation: (Rule) => Rule.max(160),
                    description: 'SEO description (max 160 characters). Defaults to excerpt if empty.',
                }),
                defineField({
                    name: 'ogImage',
                    title: 'Open Graph Image',
                    type: 'image',
                    options: { hotspot: true },
                    description: 'Custom image for social sharing. Defaults to cover image if empty.',
                }),
                defineField({
                    name: 'keywords',
                    title: 'Keywords',
                    type: 'array',
                    of: [{ type: 'string' }],
                    options: {
                        layout: 'tags',
                    },
                    description: 'SEO keywords (optional, modern SEO focuses more on content quality).',
                }),
            ],
        }),

        defineField({
            name: 'relatedPosts',
            title: 'Related Posts',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'blogPost' }],
                },
            ],
            description: 'Manually select related posts for cross-linking and SEO.',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'coverImage',
            publishedAt: 'publishedAt',
            featured: 'featured',
        },
        prepare({ title, media, publishedAt, featured }) {
            const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Draft'
            return {
                title: title || 'Untitled',
                subtitle: `${date}${featured ? ' • Featured' : ''}`,
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Published Date, Newest',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
        {
            title: 'Published Date, Oldest',
            name: 'publishedAtAsc',
            by: [{ field: 'publishedAt', direction: 'asc' }],
        },
        {
            title: 'Title, A-Z',
            name: 'titleAsc',
            by: [{ field: 'title', direction: 'asc' }],
        },
    ],
})
