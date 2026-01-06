import { defineField, defineType } from 'sanity'

export const contactPage = defineType({
    name: 'contactPage',
    title: 'Contacto',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Page Title',
            type: 'string',
            initialValue: 'Contacto',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'introText',
            title: 'Intro Text',
            type: 'text',
            rows: 3,
            initialValue: 'Si desea contactar con nosotros aquí tiene los siguientes datos:',
            description: 'Texto introductorio que aparece antes de la información de contacto.',
        }),

        defineField({
            name: 'phone',
            title: 'Teléfono',
            type: 'object',
            fields: [
                defineField({
                    name: 'number',
                    title: 'Número de teléfono',
                    type: 'string',
                    initialValue: '(+34) 623 156 74 10',
                    validation: (Rule) => Rule.required(),
                }),
                defineField({
                    name: 'url',
                    title: 'URL (WhatsApp link)',
                    type: 'url',
                    description: 'Link de WhatsApp (opcional). Ej: https://wa.me/346231567410',
                }),
            ],
        }),

        defineField({
            name: 'email',
            title: 'Email',
            type: 'object',
            fields: [
                defineField({
                    name: 'address',
                    title: 'Dirección de email',
                    type: 'string',
                    initialValue: 'tpzstudio@gmail.com',
                    validation: (Rule) => Rule.required().email(),
                }),
                defineField({
                    name: 'label',
                    title: 'Etiqueta/Descripción',
                    type: 'string',
                    initialValue: 'informa sobre tu proyecto',
                    description: 'Texto que aparece junto al email.',
                }),
            ],
        }),

        defineField({
            name: 'socialMedia',
            title: 'Redes Sociales',
            type: 'object',
            description: 'Síguenos en nuestras redes sociales',
            fields: [
                defineField({
                    name: 'instagram',
                    title: 'Instagram',
                    type: 'url',
                }),
                defineField({
                    name: 'vimeo',
                    title: 'Vimeo',
                    type: 'url',
                }),
                defineField({
                    name: 'youtube',
                    title: 'YouTube',
                    type: 'url',
                }),
                defineField({
                    name: 'tiktok',
                    title: 'TikTok',
                    type: 'url',
                }),
                defineField({
                    name: 'linkedin',
                    title: 'LinkedIn',
                    type: 'url',
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
            ],
        }),
    ],
    preview: {
        select: {
            title: 'title',
        },
        prepare({ title }) {
            return {
                title: title || 'Contact Page',
            }
        },
    },
})
