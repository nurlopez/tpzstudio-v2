import { client } from '@/sanity/lib/client'
import { homePageQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import { Hero } from './_components/Hero'
import { FeaturedProjects } from './_components/FeaturedProjects'
import { TextSection } from './_components/TextSection'
import { Servicios } from './_components/Servicios'

export default async function Page() {
    const [settings, home] = await Promise.all([
        client.fetch(siteSettingsQuery),
        client.fetch(homePageQuery),
    ])

    const projects = home?.featuredProjects?.items ?? []
    const services = home?.services?.items ?? []

    return (
        <main>
            {home?.hero?.headline && (
                <Hero
                    headline={home.hero.headline}
                    subheadline={home?.hero?.subheadline}
                    ctaLabel={settings?.cta?.label}
                    ctaUrl={settings?.cta?.url}
                    background={home?.hero?.background}
                />
            )}

            {home?.introText?.body && (
                <TextSection>
                    {home.introText.body}
                </TextSection>
            )}

            {home?.services?.title && services.length > 0 && (
                <Servicios title={home.services.title} items={services} />
            )}

            {home?.filosofia?.body && (
                <TextSection title={home?.filosofia?.title}>
                    {home.filosofia.body}
                </TextSection>
            )}

            {home?.featuredProjects?.title && projects.length > 0 && (
                <FeaturedProjects title={home.featuredProjects.title} items={projects} />
            )}
        
                    
        </main>
    )
}
