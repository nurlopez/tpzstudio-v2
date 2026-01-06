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
            title: 'Site title',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'Nombre general del sitio (por defecto para SEO).',
        }),

        defineField({
            name: 'tagline',
            title: 'Tagline',
            type: 'string',
            description: 'Frase corta estilo claim (opcional).',
        }),

        defineField({
            name: 'siteUrl',
            title: 'Site URL',
            type: 'url',
            validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
            description: 'URL oficial (ej: https://tpzstudio.es).',
        }),

        defineField({
            name: 'seo',
            title: 'SEO (default)',
            type: 'object',
            fields: [
                defineField({
                    name: 'metaTitle',
                    title: 'Meta title',
                    type: 'string',
                    validation: (Rule) => Rule.max(60),
                }),
                defineField({
                    name: 'metaDescription',
                    title: 'Meta description',
                    type: 'text',
                    rows: 3,
                    validation: (Rule) => Rule.max(160),
                }),
                defineField({
                    name: 'ogImage',
                    title: 'Open Graph image',
                    type: 'image',
                    options: { hotspot: true },
                    description: 'Imagen para compartir en WhatsApp/Redes (1200x630 ideal).',
                }),
            ],
        }),

        defineField({
            name: 'branding',
            title: 'Branding',
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
            title: 'Primary CTA',
            type: 'object',
            fields: [
                defineField({
                    name: 'label',
                    title: 'Button label',
                    type: 'string',
                    initialValue: 'Agendar llamada',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'url',
                    title: 'Button URL',
                    type: 'url',
                    validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
                    description: 'Ej: Calendly / formulario / WhatsApp',
                }),
            ],
        }),

        defineField({
            name: 'social',
            title: 'Social links',
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
            title: 'Contact',
            type: 'object',
            fields: [
                defineField({ name: 'email', title: 'Email', type: 'string' }),
                defineField({ name: 'phone', title: 'Phone/WhatsApp', type: 'string' }),
                defineField({ name: 'location', title: 'Location', type: 'string' }),
            ],
        }),
    ],
})
