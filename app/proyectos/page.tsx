import Link from 'next/link'
import Image from 'next/image'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PageFade } from '@/app/_components/PageFade'
import { Reveal } from '@/app/_components/Motion'

const projectsIndexQuery = groq`
  *[_type == "project"] | order(featured desc, _createdAt desc){
    _id,
    title,
    slug,
    excerpt,
    coverImage
  }
`

export default async function ProjectsPage() {
    const projects = await client.fetch(projectsIndexQuery)

    return (
        <PageFade>
            <main style={{ padding: '28px 24px 72px' }}>
                <div style={{ maxWidth: 980, margin: '0 auto' }}>
                    <Reveal y={10}>
                        <h1 style={{ fontSize: 28, margin: 0 }}>Proyectos</h1>
                    </Reveal>

                    <div style={{ marginTop: 18, display: 'grid', gap: 14 }}>
                        {projects.map((p: any, i: number) => {
                            if (!p.slug?.current) return null
                            const href = `/proyectos/${p.slug.current}`
                            const img = p.coverImage
                                ? urlFor(p.coverImage).width(1600).height(900).quality(80).url()
                                : null

                            return (
                                <Reveal key={p._id} delay={Math.min(i * 0.04, 0.2)} y={10}>
                                    <Link
                                        href={href}
                                        className="projectCard"
                                        style={{
                                            display: 'block',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: 18,
                                            overflow: 'hidden',
                                            background: 'rgba(255,255,255,0.03)',
                                        }}
                                    >
                                        <div style={{ position: 'relative', aspectRatio: '16 / 9' }}>
                                            {img ? (
                                                <Image
                                                    src={img}
                                                    alt={p.title ?? ''}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 980px"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.06)' }} />
                                            )}

                                            <div
                                                aria-hidden
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background:
                                                        'linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.06))',
                                                }}
                                            />

                                            <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12 }}>
                                                <div style={{ fontWeight: 760, letterSpacing: '-0.01em', fontSize: 18 }}>
                                                    {p.title}
                                                </div>
                                                {p.excerpt ? (
                                                    <div style={{ marginTop: 6, opacity: 0.88, lineHeight: 1.55 }}>
                                                        {p.excerpt}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </Link>
                                </Reveal>
                            )
                        })}
                    </div>
                </div>
            </main>
        </PageFade>
    )
}
