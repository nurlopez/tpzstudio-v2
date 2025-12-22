import { client } from '@/sanity/lib/client'
import { homePageQuery, siteSettingsQuery } from '@/sanity/lib/queries'
import { Hero } from './_components/Hero'
import { FeaturedProjects } from './_components/FeaturedProjects'

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

            <FeaturedProjects title={home?.featuredProjects?.title ?? 'Proyectos'} items={projects} />
        </main>
    )
}
