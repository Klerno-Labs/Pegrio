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
}

module.exports = nextConfig
