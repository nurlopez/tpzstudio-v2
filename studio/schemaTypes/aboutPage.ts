import { defineField, defineType } from 'sanity'

export const aboutPage = defineType({
    name: 'aboutPage',
    title: 'Sobre mí',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Título principal de la página.',
        }),

        defineField({
            name: 'body',
            title: 'Contenido',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                        { title: 'H4', value: 'h4' },
                        { title: 'Cita', value: 'blockquote' },
                    ],
                },
            ],
            validation: (Rule) => Rule.required(),
            description: 'Contenido principal de la página (texto con formato).',
        }),

        defineField({
            name: 'image',
            title: 'Imagen',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
            description: 'Imagen principal para la página.',
        }),

        defineField({
            name: 'cta',
            title: 'CTA del footer',
            type: 'object',
            fields: [
                defineField({
                    name: 'text',
                    title: 'Texto del CTA',
                    type: 'string',
                    validation: (Rule) => Rule.required(),
                    description: 'Texto que aparece en el botón/CTA del footer.',
                }),
                defineField({
                    name: 'url',
                    title: 'URL del CTA',
                    type: 'url',
                    validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https', 'mailto'] }),
                    description: 'URL a la que lleva el CTA (puede ser mailto: o una URL).',
                }),
            ],
        }),

        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'object',
            fields: [
                defineField({
                    name: 'metaTitle',
                    title: 'Meta título',
                    type: 'string',
                    validation: (Rule) => Rule.max(60),
                }),
                defineField({
                    name: 'metaDescription',
                    title: 'Meta descripción',
                    type: 'text',
                    rows: 3,
                    validation: (Rule) => Rule.max(160),
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
        },
        prepare({ title, media }) {
            return {
                title: title || 'Sobre mí',
                media,
            }
        },
    },
})
