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
    title: 'Workspace Object',
    type: 'document',
    description: 'Represents a capability or tool in the workspace. Appears as an interactive object on the canvas.',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Name of the capability (e.g., "Film & Social Media"). Appears as object label on hover.',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            description: 'URL identifier (e.g., "film", "voiceovers"). Used in workspace routes.',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'objectType',
            title: 'Object Type',
            type: 'string',
            description: 'Determines visual representation of the object on the canvas.',
            options: {
                list: [
                    { title: 'Camera', value: 'camera' },
                    { title: 'Waveform / Speaker', value: 'waveform' },
                    { title: 'Blueprint / Grid', value: 'blueprint' },
                    { title: 'Book / Timeline', value: 'book' },
                    { title: 'Lightbulb / Sticky Notes', value: 'lightbulb' },
                    { title: 'Stack / Archive', value: 'stack' },
                    { title: 'Envelope / Contact', value: 'envelope' },
                ],
                layout: 'dropdown',
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'shortIntent',
            title: 'Short Intent',
            type: 'text',
            rows: 2,
            description: 'Brief explanation of what this capability is (1-2 lines). Not marketing copy. Example: "Film production for social media and digital content".',
        }),

        defineField({
            name: 'capabilities',
            title: 'Capabilities',
            type: 'array',
            description: 'Links to projects, courses, or experiments that demonstrate this capability. Projects can appear under multiple objects.',
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
            title: 'Featured Capabilities',
            type: 'array',
            description: 'Featured projects or courses to highlight prominently in the object panel.',
            of: [
                {
                    type: 'reference',
                    to: [
                        { type: 'project' },
                        // TODO: Add course when schema is created
                        // { type: 'course' },
                    ],
                },
            ],
        }),

        defineField({
            name: 'visibility',
            title: 'Visible on Canvas',
            type: 'boolean',
            description: 'Whether this object appears on the workspace canvas.',
            initialValue: true,
        }),

        defineField({
            name: 'order',
            title: 'Order',
            type: 'number',
            description: 'Determines object position on canvas (lower numbers appear first). Can be used with manual positioning.',
            initialValue: 1,
            validation: (Rule) => Rule.min(1).max(100),
        }),

        defineField({
            name: 'position',
            title: 'Manual Position',
            type: 'object',
            description: 'Optional manual canvas positioning. Overrides automatic positioning.',
            fields: [
                defineField({
                    name: 'x',
                    title: 'X Position (%)',
                    type: 'number',
                    description: 'Horizontal position (0-100).',
                    validation: (Rule) => Rule.min(0).max(100),
                }),
                defineField({
                    name: 'y',
                    title: 'Y Position (%)',
                    type: 'number',
                    description: 'Vertical position (0-100).',
                    validation: (Rule) => Rule.min(0).max(100),
                }),
            ],
        }),

        defineField({
            name: 'visual',
            title: 'Object Visual',
            type: 'image',
            options: { 
                hotspot: false,
                accept: 'image/svg+xml',
            },
            description: 'Upload a single isometric SVG (transparent background). Text label remains primary if visual is set.',
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                    description: 'Alternative text for accessibility. If visual is decorative and text label fully describes object, can be empty.',
                }),
            ],
        }),

        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: { hotspot: true },
            description: 'Optional visual representation in object panel. Object type provides default visual if not set.',
        }),

        defineField({
            name: 'description',
            title: 'Description',
            type: 'array',
            of: [{ type: 'block' }],
            description: 'Longer explanation of this capability. Appears in object panel. Can include process, approach, philosophy.',
        }),

        defineField({
            name: 'cta',
            title: 'Call to Action',
            type: 'object',
            description: 'Optional CTA for this object. If empty, uses global CTA from site settings.',
            fields: [
                defineField({
                    name: 'label',
                    title: 'Label',
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
            title: 'Order (ascending)',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
        {
            title: 'Order (descending)',
            name: 'orderDesc',
            by: [{ field: 'order', direction: 'desc' }],
        },
        {
            title: 'Title (A-Z)',
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
                subtitle: `${objectType}${!visibility ? ' (hidden)' : ''}${subtitle ? ` • ${subtitle}` : ''}`,
                media,
            }
        },
    },
})
