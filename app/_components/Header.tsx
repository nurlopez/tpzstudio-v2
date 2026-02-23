'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'


type NavItem = { label: string; href: string }

const nav: NavItem[] = [
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'sobre mí', href: '/sobre-mi' },
    { label: 'Blog', href: '/blog' }, // futuro
    { label: 'contacto', href: '/contacto' },
]

export function Header() {
    const pathname = usePathname()

    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
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
                    height: 72,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: scrolled 
                        ? '1px solid rgba(255,255,255,0.12)' 
                        : '1px solid transparent',
                    background: scrolled 
                        ? 'rgba(10,10,10,0.75)' 
                        : 'rgba(10,10,10,0.25)',
                    backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(150%)',
                    WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(150%)',
                    transition: 'all var(--motion-standard) var(--ease-out)',
                    boxShadow: scrolled 
                        ? '0 4px 24px rgba(0, 0, 0, 0.3)' 
                        : 'none',
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
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            transition: 'opacity var(--motion-standard) var(--ease-out)',
                        }}
                        onClick={() => setOpen(false)}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        <Image
                            src="/logo.png"
                            alt="tpz studio"
                            width={120}
                            height={40}
                            priority
                            style={{
                                height: 'auto',
                                width: 'auto',
                                maxHeight: '40px',
                            }}
                        />
                    </Link>

                    {/* Desktop nav */}
                    <nav className="navDesktop" aria-label="Principal">
                        {nav.map((item) => {
                            const isActive = pathname === item.href || 
                                (item.href !== '/' && pathname.startsWith(item.href + '/'))
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`navLink ${isActive ? 'navLinkActive' : ''}`}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Mobile button */}
                    <button
                        className="navBurger"
                        type="button"
                        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                        style={{
                            position: 'relative',
                        }}
                    >
                        <span 
                            style={{ 
                                display: 'block', 
                                width: 20, 
                                height: 1.5, 
                                background: 'rgba(255,255,255,0.9)',
                                transition: 'all var(--motion-standard) var(--ease-out)',
                                transform: open ? 'rotate(45deg) translateY(6px)' : 'none',
                            }} 
                        />
                        <span 
                            style={{ 
                                display: 'block', 
                                width: 20, 
                                height: 1.5, 
                                background: 'rgba(255,255,255,0.9)', 
                                marginTop: 6,
                                transition: 'all var(--motion-standard) var(--ease-out)',
                                opacity: open ? 0 : 1,
                            }} 
                        />
                        <span 
                            style={{ 
                                display: 'block', 
                                width: 20, 
                                height: 1.5, 
                                background: 'rgba(255,255,255,0.9)', 
                                marginTop: 6,
                                transition: 'all var(--motion-standard) var(--ease-out)',
                                transform: open ? 'rotate(-45deg) translateY(-6px)' : 'none',
                            }} 
                        />
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
                            top: 72,
                            left: 16,
                            right: 16,
                            borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: 'rgba(10,10,10,0.95)',
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            padding: 16,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'grid', gap: 6 }}>
                            {nav.map((item) => {
                                const isActive = pathname === item.href || 
                                    (item.href !== '/' && pathname.startsWith(item.href + '/'))
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        style={{
                                            padding: '14px 16px',
                                            borderRadius: 8,
                                            textDecoration: 'none',
                                            color: isActive ? '#B34D49' : 'inherit',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderBottom: isActive ? '2px solid #B34D49' : '1px solid rgba(255,255,255,0.12)',
                                            background: 'rgba(255,255,255,0.04)',
                                            transition: 'all var(--motion-standard) var(--ease-out)',
                                            fontSize: 14,
                                            fontWeight: 500,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                                            e.currentTarget.style.borderBottomColor = '#B34D49'
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                                            e.currentTarget.style.transform = 'translateX(4px)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                                            e.currentTarget.style.borderBottomColor = isActive ? '#B34D49' : 'rgba(255,255,255,0.12)'
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                                            e.currentTarget.style.transform = 'translateX(0)'
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}
