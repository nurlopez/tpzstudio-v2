import { defineField, defineType } from 'sanity'

export const service = defineType({
    name: 'service',
    title: 'Servicios',
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
        }),

        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
            initialValue: 1,
            description: 'Para ordenar en listados (1, 2, 3...).',
            validation: (Rule) => Rule.min(1).max(50),
        }),

        defineField({
            name: 'icon',
            title: 'Icon',
            type: 'string',
            options: {
                list: [
                    { title: 'Monitor', value: 'monitor' },
                    { title: 'Graduation Cap', value: 'graduation-cap' },
                    { title: 'Cube', value: 'cube' },
                    { title: 'Camera', value: 'camera' },
                    { title: 'Palette', value: 'palette' },
                    { title: 'Video', value: 'video' },
                    { title: 'Lightbulb', value: 'lightbulb' },
                    { title: 'Users', value: 'users' },
                    { title: 'Code', value: 'code' },
                    { title: 'Image', value: 'image' },
                    { title: 'Film', value: 'film' },
                    { title: 'Music', value: 'music' },
                ],
                layout: 'dropdown',
            },
            description: 'Icono para mostrar en la home y listados.',
        }),

        defineField({
            name: 'shortDescription',
            title: 'Short description',
            type: 'text',
            rows: 3,
            description: '1–2 frases para cards.',
        }),

        defineField({
            name: 'body',
            title: 'Full description',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'Explicación más larga (opcional).',
        }),

        defineField({
            name: 'coverImage',
            title: 'Cover image (optional)',
            type: 'image',
            options: { hotspot: true },
        }),

        defineField({
            name: 'cta',
            title: 'Service CTA (optional)',
            type: 'object',
            fields: [
                defineField({ name: 'label', title: 'Label', type: 'string' }),
                defineField({ name: 'url', title: 'URL', type: 'url' }),
            ],
            description: 'Si lo dejas vacío, usaremos el CTA global.',
        }),
    ],
    orderings: [
        {
            title: 'Order (asc)',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
    preview: {
        select: { title: 'title', subtitle: 'shortDescription', media: 'coverImage' },
    },
})
