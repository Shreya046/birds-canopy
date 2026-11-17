/** @type {import('next').NextConfig} */
const backendUrl = (process.env.BACKEND_URL ?? 'http://127.0.0.1:8000').replace(/\/+$/, '')

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
