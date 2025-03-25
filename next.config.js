/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;
