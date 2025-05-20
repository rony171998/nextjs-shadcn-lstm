/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    // Only optimize images in production
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Configuración para resolver problemas de timeout
  experimental: {
    largePageDataBytes: 128 * 1000, // 128KB
  },
  // Deshabilitar la generación estática para las rutas API
  output: 'standalone',
  // Enable React strict mode
  reactStrictMode: true,
  // Enable SWC minification
  swcMinify: true,
  // Disable source maps in production
  productionBrowserSourceMaps: false,
};

// Exportar la configuración directamente sin Sentry
module.exports = nextConfig;
