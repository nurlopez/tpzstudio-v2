import './globals.css'
import { Header } from './_components/Header'

import { Poppins } from 'next/font/google'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-sans'
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" className={`${poppins.variable}`}>
            <body>
            <Header />
            <div style={{ paddingTop: 64 }}>
                {children}
            </div>
            </body>
        </html>
    )
}
