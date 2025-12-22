import { defineField, defineType } from 'sanity'

export const homePage = defineType({
    name: 'homePage',
    title: 'Home',
    type: 'document',
    fields: [
        defineField({
            name: 'hero',
            title: 'Hero',
            type: 'object',
            fields: [
                defineField({
                    name: 'headline',
                    title: 'Headline',
                    type: 'string',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'subheadline',
                    title: 'Subheadline',
                    type: 'text',
                    rows: 3,
                }),
                defineField({
                    name: 'background',
                    title: 'Background',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'mode',
                            title: 'Background type',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Image', value: 'image' },
                                    { title: 'Video URL (YouTube/Vimeo)', value: 'videoUrl' },
                                ],
                                layout: 'radio',
                            },
                            initialValue: 'image',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'image',
                            title: 'Hero image',
                            type: 'image',
                            options: { hotspot: true },
                            hidden: ({ parent }) => parent?.mode !== 'image',
                        }),
                        defineField({
                            name: 'videoUrl',
                            title: 'Hero video URL',
                            type: 'url',
                            hidden: ({ parent }) => parent?.mode !== 'videoUrl',
                        }),
                    ],
                }),
                defineField({
                    name: 'showPrimaryCta',
                    title: 'Show primary CTA (from Site Settings)',
                    type: 'boolean',
                    initialValue: true,
                }),
                defineField({
                    name: 'secondaryCta',
                    title: 'Secondary CTA (optional)',
                    type: 'object',
                    fields: [
                        defineField({ name: 'label', title: 'Label', type: 'string' }),
                        defineField({ name: 'url', title: 'URL', type: 'url' }),
                    ],
                }),
            ],
        }),

        defineField({
            name: 'manifesto',
            title: 'Manifesto',
            type: 'object',
            fields: [
                defineField({ name: 'title', title: 'Title', type: 'string' }),
                defineField({
                    name: 'body',
                    title: 'Text',
                    type: 'array',
                    of: [{ type: 'block' }],
                }),
            ],
        }),

        defineField({
            name: 'featuredProjects',
            title: 'Featured projects',
            type: 'object',
            fields: [
                defineField({
                    name: 'title',
                    title: 'Section title',
                    type: 'string',
                    initialValue: 'Algunos proyectos',
                }),
                defineField({
                    name: 'items',
                    title: 'Projects',
                    type: 'array',
                    of: [{ type: 'reference', to: [{ type: 'project' }] }],
                    description: 'Selecciona 3–6 proyectos para la home.',
                }),
            ],
        }),

        defineField({
            name: 'servicesTeaser',
            title: 'Services teaser',
            type: 'object',
            fields: [
                defineField({ name: 'title', title: 'Title', type: 'string', initialValue: 'Servicios' }),
                defineField({ name: 'body', title: 'Text', type: 'text', rows: 3 }),
                defineField({
                    name: 'linkLabel',
                    title: 'Link label',
                    type: 'string',
                    initialValue: 'Ver servicios',
                }),
                defineField({
                    name: 'linkUrl',
                    title: 'Link URL',
                    type: 'string',
                    initialValue: '/servicios',
                }),
            ],
        }),

        defineField({
            name: 'finalCta',
            title: 'Final CTA',
            type: 'object',
            fields: [
                defineField({ name: 'title', title: 'Title', type: 'string', initialValue: '¿Hacemos algo potente?' }),
                defineField({ name: 'body', title: 'Text', type: 'text', rows: 3 }),
                defineField({
                    name: 'usePrimaryCta',
                    title: 'Use primary CTA from Site Settings',
                    type: 'boolean',
                    initialValue: true,
                }),
            ],
        }),
    ],
    preview: {
        select: { title: 'hero.headline' },
        prepare({ title }) {
            return { title: title || 'Home' }
        },
    },
})
