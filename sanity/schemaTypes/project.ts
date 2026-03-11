import { defineField, defineType } from 'sanity'

export const project = defineType({
    name: 'project',
    title: 'Proyectos',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
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
            title: 'Destacado (mostrar en Inicio)',
            type: 'boolean',
            initialValue: false,
        }),

        defineField({
            name: 'coverImage',
            title: 'Imagen de portada',
            type: 'image',
            options: { hotspot: true },
            description: 'Imagen de portada para listados/tarjetas.',
        }),

        defineField({
            name: 'excerpt',
            title: 'Descripción corta',
            type: 'text',
            rows: 3,
            description: '1–2 frases para tarjetas y vistas previas.',
        }),

        defineField({
            name: 'video',
            title: 'Vídeo',
            type: 'object',
            fields: [
                defineField({
                    name: 'provider',
                    title: 'Proveedor',
                    type: 'string',
                    options: {
                        list: [
                            { title: 'Vimeo', value: 'vimeo' },
                            { title: 'YouTube', value: 'youtube' },
                            { title: 'Otro / URL embed', value: 'other' },
                        ],
                        layout: 'radio',
                    },
                    initialValue: 'vimeo',
                }),
                defineField({
                    name: 'url',
                    title: 'URL del vídeo',
                    type: 'url',
                    description: 'Pega la URL del vídeo (Vimeo/YouTube o embed).',
                }),
            ],
        }),

        defineField({
            name: 'categories',
            title: 'Categorías',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
            },
            description: 'Escribe etiqueta y pulsa Enter',
        }),

        defineField({
            name: 'credits',
            title: 'Créditos (opcional)',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'role', title: 'Rol', type: 'string' }),
                        defineField({ name: 'name', title: 'Nombre', type: 'string' }),
                    ],
                    preview: {
                        select: { title: 'role', subtitle: 'name' },
                    },
                },
            ],
        }),

        defineField({
            name: 'body',
            title: 'Descripción del proyecto',
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
                {
                    type: 'image',
                    fields: [
                        {
                            name: 'alt',
                            title: 'Texto alternativo',
                            type: 'string',
                            description: 'Importante para SEO y accesibilidad.',
                        },
                    ],
                },
                {
                    name: 'video',
                    type: 'object',
                    title: 'Vídeo',
                    fields: [
                        {
                            name: 'url',
                            title: 'URL del vídeo',
                            type: 'url',
                            description: 'URL de YouTube, Vimeo o archivo .mp4',
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: 'caption',
                            title: 'Pie de vídeo',
                            type: 'string',
                            description: 'Texto descriptivo debajo del vídeo (opcional).',
                        },
                    ],
                    preview: {
                        select: { title: 'caption', subtitle: 'url' },
                        prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
                            return {
                                title: title || 'Vídeo',
                                subtitle: subtitle || '',
                            }
                        },
                    },
                },
            ],
            description: 'Texto largo (opcional).',
        }),

        // SEO Fields
        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'object',
            description: 'Configura cómo aparece este proyecto en buscadores y redes sociales.',
            fields: [
                defineField({
                    name: 'metaTitle',
                    title: 'Meta título',
                    type: 'string',
                    validation: (Rule) => Rule.max(60),
                    description: 'Título para buscadores y redes (máx 60 caracteres). Si está vacío, se usa el título del proyecto.',
                }),
                defineField({
                    name: 'metaDescription',
                    title: 'Meta descripción',
                    type: 'text',
                    rows: 3,
                    validation: (Rule) => Rule.max(160),
                    description: 'Descripción para buscadores y redes (máx 160 caracteres). Si está vacío, se usa el resumen.',
                }),
                defineField({
                    name: 'ogImage',
                    title: 'Imagen para compartir',
                    type: 'image',
                    options: { hotspot: true },
                    description: 'Imagen para redes sociales (Open Graph). Recomendado: 1200x630px. Si está vacío, se usa la portada.',
                    fields: [
                        {
                            name: 'alt',
                            title: 'Texto alternativo',
                            type: 'string',
                            description: 'Describe la imagen para accesibilidad.',
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
                subtitle: featured ? '★ Destacado' : '',
                media,
            }
        },
    },
})
