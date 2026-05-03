const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async redirects() {
    return [
      // Loja interna pausada — toda visita a /loja* (incluindo sucesso/troca)
      // vai pra Uma Penca, que é a loja oficial em uso.
      {
        source: '/loja/:path*',
        destination: 'https://umapenca.com/fauna-conservacao',
        permanent: false,
      },
      {
        source: '/loja',
        destination: 'https://umapenca.com/fauna-conservacao',
        permanent: false,
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
