import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
    name: 'blogPost',
    title: 'Post del blog',
    type: 'document',
    description: 'Entradas del blog y noticias para SEO y contenido.',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            validation: (Rule) => Rule.required().max(100),
            description: 'Título principal (máx 100 caracteres para SEO).',
        }),

        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
            description: 'Identificador para la URL. Se usa en /blog/[slug].',
        }),

        defineField({
            name: 'excerpt',
            title: 'Resumen',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.required().max(300),
            description: 'Resumen para listados y meta descripción (máx 300 caracteres).',
        }),

        defineField({
            name: 'body',
            title: 'Contenido',
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
                            title: 'Texto alternativo',
                            type: 'string',
                            description: 'Importante para SEO y accesibilidad.',
                        },
                    ],
                },
            ],
            validation: (Rule) => Rule.required(),
            description: 'Contenido principal del post (texto con formato).',
        }),

        defineField({
            name: 'coverImage',
            title: 'Imagen de portada',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
            description: 'Imagen principal del post. Se usa en listados y para compartir.',
            fields: [
                {
                    name: 'alt',
                    title: 'Texto alternativo',
                    type: 'string',
                    validation: (Rule) => Rule.required(),
                    description: 'Describe la imagen para SEO y accesibilidad.',
                },
            ],
        }),

        defineField({
            name: 'author',
            title: 'Autor',
            type: 'object',
            fields: [
                defineField({
                    name: 'name',
                    title: 'Nombre del autor',
                    type: 'string',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'image',
                    title: 'Imagen del autor',
                    type: 'image',
                    options: { hotspot: true },
                }),
            ],
            description: 'Información del autor del post.',
        }),

        defineField({
            name: 'publishedAt',
            title: 'Fecha de publicación',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
            initialValue: () => new Date().toISOString(),
            description: 'Fecha de publicación. Se usa para ordenar y mostrar.',
        }),

        defineField({
            name: 'updatedAt',
            title: 'Última actualización',
            type: 'datetime',
            description: 'Fecha de última modificación. Opcional.',
        }),

        defineField({
            name: 'categories',
            title: 'Categorías',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
                placeholder: 'Escribe etiqueta y pulsa Enter',
            } as Record<string, unknown>,
            description: 'Categorías para organizar posts (ej: "Noticias", "Reflexiones").',
        }),

        defineField({
            name: 'tags',
            title: 'Etiquetas',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags',
                placeholder: 'Escribe etiqueta y pulsa Enter',
            } as Record<string, unknown>,
            description: 'Etiquetas para clasificación y SEO.',
        }),

        defineField({
            name: 'featured',
            title: 'Post destacado',
            type: 'boolean',
            initialValue: false,
            description: 'Los posts destacados aparecen de forma prioritaria.',
        }),

        defineField({
            name: 'readingTime',
            title: 'Tiempo de lectura (min)',
            type: 'number',
            validation: (Rule) => Rule.min(1).max(60),
            description: 'Tiempo estimado de lectura en minutos. Opcional.',
        }),

        defineField({
            name: 'seo',
            title: 'SEO',
            type: 'object',
            description: 'Metadatos SEO para buscadores y redes.',
            fields: [
                defineField({
                    name: 'metaTitle',
                    title: 'Meta título',
                    type: 'string',
                    validation: (Rule) => Rule.max(60),
                    description: 'Título SEO (máx 60 caracteres). Si está vacío, se usa el título.',
                }),
                defineField({
                    name: 'metaDescription',
                    title: 'Meta descripción',
                    type: 'text',
                    rows: 3,
                    validation: (Rule) => Rule.max(160),
                    description: 'Descripción SEO (máx 160 caracteres). Si está vacía, se usa el resumen.',
                }),
                defineField({
                    name: 'ogImage',
                    title: 'Imagen Open Graph',
                    type: 'image',
                    options: { hotspot: true },
                    description: 'Imagen para compartir. Si está vacía, se usa la portada.',
                }),
                defineField({
                    name: 'keywords',
                    title: 'Palabras clave',
                    type: 'array',
                    of: [{ type: 'string' }],
                    options: {
                        layout: 'tags',
                    },
                    description: 'Palabras clave SEO (opcional).',
                }),
            ],
        }),

        defineField({
            name: 'relatedPosts',
            title: 'Posts relacionados',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'blogPost' }],
                },
            ],
            description: 'Selecciona posts relacionados para enlazado interno y SEO.',
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
            const date = publishedAt ? new Date(publishedAt).toLocaleDateString('es-ES') : 'Borrador'
            return {
                title: title || 'Sin título',
                subtitle: `${date}${featured ? ' • Destacado' : ''}`,
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Fecha de publicación (nuevos primero)',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
        {
            title: 'Fecha de publicación (antiguos primero)',
            name: 'publishedAtAsc',
            by: [{ field: 'publishedAt', direction: 'asc' }],
        },
        {
            title: 'Título (A-Z)',
            name: 'titleAsc',
            by: [{ field: 'title', direction: 'asc' }],
        },
    ],
})
