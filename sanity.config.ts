'use client'

import { defineConfig, defineLocaleResourceBundle } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

const spanishTagPlaceholders = defineLocaleResourceBundle({
  locale: 'en-US',
  namespace: 'inputs',
  resources: {
    'tags.placeholder': 'Escribe etiqueta y pulsa ENTER',
    'tags.placeholder_touch': 'Escribe etiqueta',
  },
})

export default defineConfig({
  name: 'default',
  title: 'tpzstudio',

  projectId: 'o8fr0vfj',
  dataset: 'production',

  basePath: '/studio',

  i18n: {
    bundles: [spanishTagPlaceholders],
  },

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
