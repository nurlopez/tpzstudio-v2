import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.documentTypeListItem('siteSettings').title('Configuración del sitio'),
      S.documentTypeListItem('workspaceObject').title('Inicio'),
      S.documentTypeListItem('project').title('Proyectos'),
      S.documentTypeListItem('blogPost').title('Post del blog'),
      S.documentTypeListItem('aboutPage').title('Sobre mí'),
      S.documentTypeListItem('contactPage').title('Contacto'),
    ])
