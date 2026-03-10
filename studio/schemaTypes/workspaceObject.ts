import { defineField, defineType } from 'sanity'

/**
 * Workspace Object Schema
 * 
 * Represents a capability or tool in the Creative Workspace.
 * This is the primary content model that maps to interactive objects on the canvas.
 * 
 * Key principles:
 * - Abstract enough to represent any capability
 * - Specific enough to be useful
 * - Links to projects, courses, experiments
 * - Has visual representation (objectType)
 */
export const workspaceObject = defineType({
    name: 'workspaceObject',
    title: 'Inicio',
    type: 'document',
    description: 'Elementos del inicio (objetos interactivos del canvas).',
    fields: [
        defineField({
            name: 'title',
            title: 'Título',
            type: 'string',
            description: 'Nombre de la capacidad (ej: "Film y redes sociales"). Aparece como etiqueta al pasar el cursor.',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            description: 'Identificador de URL (ej: "film", "voiceovers"). Se usa en rutas del workspace.',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'objectType',
            title: 'Tipo de objeto',
            type: 'string',
            description: 'Determina la representación visual del objeto en el canvas.',
            options: {
                list: [
                    { title: 'Cámara', value: 'camera' },
                    { title: 'Onda / Altavoz', value: 'waveform' },
                    { title: 'Plano / Rejilla', value: 'blueprint' },
                    { title: 'Libro / Línea de tiempo', value: 'book' },
                    { title: 'Bombilla / Notas', value: 'lightbulb' },
                    { title: 'Pila / Archivo', value: 'stack' },
                    { title: 'Sobre / Contacto', value: 'envelope' },
                ],
                layout: 'dropdown',
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'shortIntent',
            title: 'Intención corta',
            type: 'text',
            rows: 2,
            description: 'Breve explicación de la capacidad (1–2 líneas). No es copy de marketing. Ej: "Producción de vídeo para redes y contenido digital".',
        }),

        defineField({
            name: 'capabilities',
            title: 'Capacidades',
            type: 'array',
            description: 'Enlaces a proyectos, cursos o experimentos que demuestran esta capacidad. Un proyecto puede aparecer en varios objetos.',
            of: [
                {
                    type: 'reference',
                    to: [
                        { type: 'project' },
                        // TODO: Add course and experiment when schemas are created
                        // { type: 'course' },
                        // { type: 'experiment' },
                    ],
                },
            ],
        }),

        defineField({
            name: 'featuredCapabilities',
            title: 'Capacidades destacadas',
            type: 'array',
            description: 'Proyectos destacados para resaltar en el panel.',
            of: [
                {
                    type: 'reference',
                    to: [
                        { type: 'project' },
                    ],
                },
            ],
        }),

        defineField({
            name: 'relatedPosts',
            title: 'Artículos relacionados',
            type: 'array',
            description: 'Blog posts relacionados con esta capacidad. Aparecen como enlaces en el panel.',
            of: [
                {
                    type: 'reference',
                    to: [{ type: 'blogPost' }],
                },
            ],
        }),

        defineField({
            name: 'showThumbnails',
            title: 'Mostrar miniaturas',
            type: 'boolean',
            description: 'Muestra miniaturas de portada de proyectos y artículos enlazados en el panel.',
            initialValue: false,
        }),

        defineField({
            name: 'visibility',
            title: 'Visible en el canvas',
            type: 'boolean',
            description: 'Define si este objeto aparece en el canvas del workspace.',
            initialValue: true,
        }),

        defineField({
            name: 'order',
            title: 'Orden',
            type: 'number',
            description: 'Determina la posición en el canvas (números menores aparecen primero).',
            initialValue: 1,
            validation: (Rule) => Rule.min(1).max(100),
        }),

        defineField({
            name: 'position',
            title: 'Posición manual',
            type: 'object',
            description: 'Posicionamiento manual opcional. Anula el posicionamiento automático.',
            fields: [
                defineField({
                    name: 'x',
                    title: 'Posición X (%)',
                    type: 'number',
                    description: 'Posición horizontal (0-100).',
                    validation: (Rule) => Rule.min(0).max(100),
                }),
                defineField({
                    name: 'y',
                    title: 'Posición Y (%)',
                    type: 'number',
                    description: 'Posición vertical (0-100).',
                    validation: (Rule) => Rule.min(0).max(100),
                }),
            ],
        }),

        defineField({
            name: 'visual',
            title: 'Visual del objeto',
            type: 'image',
            options: { 
                hotspot: false,
                accept: 'image/svg+xml',
            },
            description: 'Sube un SVG isométrico (fondo transparente). La etiqueta de texto sigue siendo la principal.',
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Texto alternativo',
                    type: 'string',
                    description: 'Texto alternativo para accesibilidad. Si es decorativo, puede estar vacío.',
                }),
            ],
        }),

        defineField({
            name: 'coverImage',
            title: 'Imagen de portada',
            type: 'image',
            options: { hotspot: true },
            description: 'Imagen opcional en el panel. Si no se define, se usa el visual del tipo de objeto.',
        }),

        defineField({
            name: 'description',
            title: 'Descripción',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'Explicación más larga de la capacidad. Aparece en el panel del objeto.',
        }),

        defineField({
            name: 'cta',
            title: 'Llamada a la acción',
            type: 'object',
            description: 'CTA opcional para este objeto. Si está vacío, se usa el CTA global.',
            fields: [
                defineField({
                    name: 'label',
                    title: 'Etiqueta',
                    type: 'string',
                }),
                defineField({
                    name: 'url',
                    title: 'URL',
                    type: 'url',
                }),
            ],
        }),
    ],
    orderings: [
        {
            title: 'Orden (ascendente)',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
        {
            title: 'Orden (descendente)',
            name: 'orderDesc',
            by: [{ field: 'order', direction: 'desc' }],
        },
        {
            title: 'Título (A-Z)',
            name: 'titleAsc',
            by: [{ field: 'title', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'shortIntent',
            objectType: 'objectType',
            visibility: 'visibility',
            media: 'coverImage',
        },
        prepare({ title, subtitle, objectType, visibility, media }) {
            return {
                title,
                subtitle: `${objectType}${!visibility ? ' (oculto)' : ''}${subtitle ? ` • ${subtitle}` : ''}`,
                media,
            }
        },
    },
})
