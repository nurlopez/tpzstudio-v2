import { client } from '@/sanity/lib/client'
import { homePageQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import { Hero } from './_components/Hero'
import { FeaturedProjects } from './_components/FeaturedProjects'
import { TextSection } from './_components/TextSection'

export default async function Page() {
    const [settings, home] = await Promise.all([
        client.fetch(siteSettingsQuery),
        client.fetch(homePageQuery),
    ])

    const projects = home?.featuredProjects?.items ?? []

    return (
        <main>
            <Hero
                headline={home?.hero?.headline ?? 'TPZ Studio'}
                subheadline={home?.hero?.subheadline}
                ctaLabel={settings?.cta?.label}
                ctaUrl={settings?.cta?.url}
                background={home?.hero?.background}
            />

            <TextSection>
                TPZ Studio es un espacio creativo conformado por profesionales del diseño audiovisual, la música, el
                arte gráfico y la investigación. Nos dedicamos a crear proyectos sólidos de imagen audiovisual para
                marcas y empresas.
            </TextSection>

            <FeaturedProjects title={home?.featuredProjects?.title ?? 'Proyectos'} items={projects} />

            <TextSection title=">_FILOSOFÍA">
                En TPZStudio ofrecemos servicios creativos integrales con una misión clara: convertir tu idea en una realidad. Te acompañamos en cada etapa del proceso, te asesoramos y te damos herramientas para que mañana puedas desarrollar tus propios proyectos con confianza. Además, trabajamos de la mano con una amplia red de profesionales de la comunicación: expertos, investigadores, escritores, artistas, formadores y especialistas en marketing, todos alineados para impulsar tu proyecto.
            </TextSection>
        
                    
        </main>
    )
}
