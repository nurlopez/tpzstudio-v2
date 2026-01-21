import { defineField, defineType } from 'sanity'

export const project = defineType({
    name: 'project',
    title: 'Proyectos',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
            description: 'Se usa para la URL del proyecto.',
        }),

        defineField({
            name: 'featured',
            title: 'Featured (show on Home)',
            type: 'boolean',
            initialValue: false,
        }),

        defineField({
            name: 'coverImage',
            title: 'Cover image',
            type: 'image',
            options: { hotspot: true },
            description: 'Imagen de portada para listados/cards.',
        }),

        defineField({
            name: 'excerpt',
            title: 'Short description',
            type: 'text',
            rows: 3,
            description: '1–2 frases para cards y previews.',
        }),

        defineField({
            name: 'video',
            title: 'Video',
            type: 'object',
            fields: [
                defineField({
                    name: 'provider',
                    title: 'Provider',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Vimeo', value: 'vimeo' },
                            { title: 'YouTube', value: 'youtube' },
                            { title: 'Other / Embed URL', value: 'other' },
                        ],
                        layout: 'radio',
                    },
                    initialValue: 'vimeo',
                }),
                defineField({
                    name: 'url',
                    title: 'Video URL',
                    type: 'url',
                    description: 'Pega la URL del vídeo (Vimeo/YouTube o embed).',
                }),
            ],
        }),

        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
            description: 'Ej: spot, branded content, fotografía, diseño…',
        }),

        defineField({
            name: 'credits',
            title: 'Credits (optional)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'role', title: 'Role', type: 'string' }),
                        defineField({ name: 'name', title: 'Name', type: 'string' }),
                    ],
                    preview: {
                        select: { title: 'role', subtitle: 'name' },
                    },
                },
            ],
        }),

        defineField({
            name: 'body',
            title: 'Project description',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'Texto largo (opcional).',
        }),

        // SEO Fields
        defineField({
            name: 'seo',
            title: 'SEO Settings',
            type: 'object',
            description: 'Customize how this project appears in search engines and when shared on social media.',
            fields: [
                defineField({
                    name: 'metaTitle',
                    title: 'Meta Title',
                    type: 'string',
                    validation: (Rule) => Rule.max(60),
                    description: 'Custom title for search engines and social sharing (max 60 characters). If empty, the project title will be used.',
                }),
                defineField({
                    name: 'metaDescription',
                    title: 'Meta Description',
                    type: 'text',
                    rows: 3,
                    validation: (Rule) => Rule.max(160),
                    description: 'Custom description for search engines and social sharing (max 160 characters). If empty, the excerpt will be used.',
                }),
                defineField({
                    name: 'ogImage',
                    title: 'Social Sharing Image',
                    type: 'image',
                    options: { hotspot: true },
                    description: 'Custom image for social media sharing (Open Graph). Recommended: 1200x630px. If empty, the cover image will be used.',
                    fields: [
                        {
                            name: 'alt',
                            title: 'Alt Text',
                            type: 'string',
                            description: 'Describe the image for accessibility.',
                        },
                    ],
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'coverImage',
            featured: 'featured',
        },
        prepare({ title, media, featured }) {
            return {
                title,
                subtitle: featured ? '★ Featured' : '',
                media,
            }
        },
    },
})
