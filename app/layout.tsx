import './globals.css'
import { Poppins, Lacquer } from 'next/font/google'
import { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-sans'
})

const lacquer = Lacquer({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-lacquer'
})

/**
 * Dynamic SEO Metadata — fetches favicon and site info from Sanity
 * Can be overridden by individual pages
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(siteSettingsQuery)
  const faviconUrl = settings?.branding?.favicon?.asset?.url
  const seoDescription = settings?.seo?.metaDescription || ''

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://tpzstudio.com')
    ),
    title: {
      default: 'tpz·studio',
      template: '%s | tpz·studio',
    },
    description: seoDescription,
    keywords: ['estudio creativo', 'producción audiovisual', 'locuciones', 'branding', 'diseño', 'consultoría'],
    authors: [{ name: 'TPZ Studio' }],
    creator: 'TPZ Studio',
    publisher: 'TPZ Studio',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: faviconUrl
      ? { icon: faviconUrl, apple: faviconUrl }
      : undefined,
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: '/',
      siteName: 'tpz·studio',
      title: 'tpz·studio',
      description: seoDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'tpz·studio',
      description: seoDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/**
 * Root Layout
 * 
 * Responsibility: Global app shell, fonts, metadata, providers.
 * 
 * Does NOT contain:
 * - Workspace-specific logic
 * - Header/Footer components (workspace has its own chrome)
 * - Navigation menus
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" className={`${poppins.variable} ${lacquer.variable}`}>
            <body>
                {children}
                <Analytics />
            </body>
        </html>
    )
}
