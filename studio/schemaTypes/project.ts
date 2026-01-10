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
