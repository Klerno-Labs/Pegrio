/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Vercel serverless functions for API routes
  experimental: {
    serverActions: {
      allowedOrigins: ['pegrio.com', 'www.pegrio.com', 'localhost:3000'],
    },
  },
  async redirects() {
    return [
      {
        source: '/services',
        destination: '/websites',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
