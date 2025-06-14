/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer, dev }) => {
    // Optimizaciones para el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    // Optimizaciones para desarrollo
    if (dev) {
      config.watchOptions = {
        poll: false,
        aggregateTimeout: 300,
        ignored: [
          '**/node_modules',
          '**/.git',
          '**/.next',
          '**/dist',
          '**/build',
          '**/.turbo',
          '**/coverage',
          '**/.vercel',
          '**/public',
        ],
      }
    }

    return config
  },
  // Optimizaciones de compilación
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
}

module.exports = nextConfig 