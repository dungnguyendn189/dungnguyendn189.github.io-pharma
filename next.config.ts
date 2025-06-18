/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Bỏ qua ESLint errors trong quá trình build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Bỏ qua TypeScript errors (nếu cần)
    ignoreBuildErrors: true,
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