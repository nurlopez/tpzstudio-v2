import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
    name: 'siteSettings',
    title: 'Configuración del Sitio',
    type: 'document',
    // Esto fuerza que solo exista 1 documento (el “singleton”)
    __experimental_formPreviewTitle: false,
    fields: [
        defineField({
            name: 'title',
            title: 'Título del sitio',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Nombre general del sitio (por defecto para SEO).',
        }),

        defineField({
            name: 'tagline',
            title: 'Lema',
            type: 'string',
            description: 'Frase corta estilo claim (opcional).',
        }),

        defineField({
            name: 'siteUrl',
            title: 'URL del sitio',
            type: 'url',
            validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
            description: 'URL oficial (ej: https://tpzstudio.es).',
        }),

        defineField({
            name: 'seo',
            title: 'SEO (predeterminado)',
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
                defineField({
                    name: 'ogImage',
                    title: 'Imagen Open Graph',
                    type: 'image',
                    options: { hotspot: true },
                    description: 'Imagen para compartir en WhatsApp/Redes (1200x630 ideal).',
                }),
            ],
        }),

        defineField({
            name: 'branding',
            title: 'Marca',
            type: 'object',
            fields: [
                defineField({
                    name: 'logo',
                    title: 'Logo',
                    type: 'image',
                    options: { hotspot: true },
                }),
                defineField({
                    name: 'favicon',
                    title: 'Favicon',
                    type: 'image',
                    description: 'Ideal: PNG cuadrado.',
                }),
            ],
        }),

        defineField({
            name: 'cta',
            title: 'CTA principal',
            type: 'object',
            fields: [
                defineField({
                    name: 'label',
                    title: 'Texto del botón',
                    type: 'string',
                    initialValue: 'Agendar llamada',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'url',
                    title: 'URL del botón',
                    type: 'url',
                    validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
                    description: 'Ej: Calendly / formulario / WhatsApp',
                }),
            ],
        }),

        defineField({
            name: 'social',
            title: 'Redes sociales',
            type: 'object',
            fields: [
                defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
                defineField({ name: 'vimeo', title: 'Vimeo', type: 'url' }),
                defineField({ name: 'youtube', title: 'YouTube', type: 'url' }),
                defineField({ name: 'tiktok', title: 'TikTok', type: 'url' }),
                defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
            ],
        }),

        defineField({
            name: 'contact',
            title: 'Contacto',
            type: 'object',
            fields: [
                defineField({ name: 'email', title: 'Correo', type: 'string' }),
                defineField({ name: 'phone', title: 'Teléfono/WhatsApp', type: 'string' }),
                defineField({ name: 'location', title: 'Ubicación', type: 'string' }),
            ],
        }),

        defineField({
            name: 'pages',
            title: 'SEO por página',
            type: 'object',
            description: 'Metadatos específicos para páginas clave.',
            fields: [
                defineField({
                    name: 'home',
                    title: 'Inicio',
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
                defineField({
                    name: 'projects',
                    title: 'Proyectos',
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
                defineField({
                    name: 'blog',
                    title: 'Blog',
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
        }),

        defineField({
            name: 'workspace',
            title: 'Espacio de trabajo',
            type: 'object',
            description: 'Configuración visual del workspace',
            fields: [
                defineField({
                    name: 'greeting',
                    title: 'Saludo del workspace',
                    type: 'string',
                    description: 'Texto de bienvenida que aparece en el canvas (ej: "Explora nuestro espacio creativo")',
                    initialValue: 'Explora nuestro espacio creativo',
                }),
            ],
        }),

        defineField({
            name: 'backgroundAudio',
            title: 'Audio de fondo',
            type: 'object',
            description: 'Audio ambiental para el workspace (controlado por FAB)',
            fields: [
                defineField({
                    name: 'url',
                    title: 'URL del audio',
                    type: 'url',
                    description: 'URL del archivo de audio (MP3 recomendado)',
                    validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
                }),
            ],
        }),
    ],
})
