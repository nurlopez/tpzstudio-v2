import './globals.css'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-sans'
})

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
