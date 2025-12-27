'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'


type NavItem = { label: string; href: string }

const nav: NavItem[] = [
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'Servicios', href: '/servicios' }, // lo crearemos más adelante (o lo puedes quitar)
    { label: 'Blog', href: '/blog' }, // futuro
]

export function Header() {
    const pathname = usePathname()

    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 6)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Cierra menú al navegar (por si haces click)
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])

    return (
        <>
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.10)' : '1px solid transparent',
                    background: scrolled ? 'rgba(7,7,7,0.55)' : 'rgba(7,7,7,0.18)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: 980,
                        margin: '0 auto',
                        padding: '0 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                    }}
                >
                    <Link
                        href="/"
                        style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            letterSpacing: '-0.01em',
                            fontWeight: 800,
                            fontSize: 16,
                        }}
                        onClick={() => setOpen(false)}
                    >
                        TPZ Studio
                    </Link>

                    {/* Desktop nav */}
                    <nav className="navDesktop" aria-label="Primary">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`navLink ${pathname === item.href ? 'navLinkActive' : ''}`}
                            >

                                {item.label}
                            </Link>
                        ))}
                        <a className="navCta" href="mailto:hello@tpzstudio.es">
                            Contacto
                        </a>
                    </nav>

                    {/* Mobile button */}
                    <button
                        className="navBurger"
                        type="button"
                        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                    >
                        <span style={{ display: 'block', width: 18, height: 2, background: 'rgba(255,255,255,0.85)' }} />
                        <span style={{ display: 'block', width: 18, height: 2, background: 'rgba(255,255,255,0.85)', marginTop: 5 }} />
                    </button>
                </div>
            </header>

            {/* Mobile drawer */}
            {open ? (
                <div
                    role="dialog"
                    aria-modal="true"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 60,
                        background: 'rgba(0,0,0,0.55)',
                        backdropFilter: 'blur(2px)',
                    }}
                    onClick={() => setOpen(false)}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 64,
                            left: 12,
                            right: 12,
                            borderRadius: 18,
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(7,7,7,0.92)',
                            padding: 12,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'grid', gap: 6 }}>
                            {nav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    style={{
                                        padding: '12px 12px',
                                        borderRadius: 14,
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        border: '1px solid rgba(255,255,255,0.10)',
                                        background: 'rgba(255,255,255,0.03)',
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <a
                                href="mailto:hello@tpzstudio.es"
                                style={{
                                    marginTop: 6,
                                    padding: '12px 12px',
                                    borderRadius: 999,
                                    textDecoration: 'none',
                                    color: '#0b0b0b',
                                    background: 'rgba(255,255,255,0.92)',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                }}
                                onClick={() => setOpen(false)}
                            >
                                Contacto
                            </a>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}
