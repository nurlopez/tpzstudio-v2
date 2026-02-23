import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                pathname: '/images/**',
            },
        ],
    },
    async redirects() {
        return [
            { source: '/workspace', destination: '/', permanent: true },
            { source: '/workspace/:path*', destination: '/:path*', permanent: true },
            { source: '/servicios', destination: '/', permanent: true },
            { source: '/servicios/:path*', destination: '/', permanent: true },
            { source: '/projects', destination: '/proyectos', permanent: true },
            { source: '/projects/:path*', destination: '/proyectos/:path*', permanent: true },
        ]
    },
}

export default nextConfig
