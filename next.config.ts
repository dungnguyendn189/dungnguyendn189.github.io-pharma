/** @type {import('next').NextConfig} */
const nextConfig = {
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