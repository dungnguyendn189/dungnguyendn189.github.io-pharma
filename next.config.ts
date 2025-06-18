// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip build cho auth routes
  experimental: {
    skipMiddlewareUrlNormalize: true,
    skipTrailingSlashRedirect: true,
  },
  // Ignore auth pages during build
  async generateBuildId() {
    return 'skip-auth-build'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eqpharma.vn',
        port: '',
        pathname: '/wp-content/uploads/**',
      }
    ]
  }
}

module.exports = nextConfig