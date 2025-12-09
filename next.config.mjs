/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  // Add if you have images
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
