import './globals.css'
import { Poppins } from 'next/font/google'
import { Metadata } from 'next'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-sans'
})

/**
 * Default SEO Metadata
 * Can be overridden by individual pages
 */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://tpzstudio.com')
  ),
  title: {
    default: 'TPZ Studio',
    template: '%s | TPZ Studio',
  },
  description: 'Creative studio specializing in film, voiceovers, branding, and strategic consulting.',
  keywords: ['creative studio', 'film production', 'voiceovers', 'branding', 'design', 'consulting'],
  authors: [{ name: 'TPZ Studio' }],
  creator: 'TPZ Studio',
  publisher: 'TPZ Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'TPZ Studio',
    title: 'TPZ Studio',
    description: 'Creative studio specializing in film, voiceovers, branding, and strategic consulting.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TPZ Studio',
    description: 'Creative studio specializing in film, voiceovers, branding, and strategic consulting.',
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
        <html lang="es" className={`${poppins.variable}`}>
            <body>
                {children}
            </body>
        </html>
    )
}
