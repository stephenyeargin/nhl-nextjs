/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization
  staticPageGenerationTimeout: 120,
  experimental: {
    // Enable dynamic IO improvements
    dynamicIO: true,
  },
  rewrites: async () => {
    return [
      {
        source: '/api/nhl/:path*',
        destination: 'https://api-web.nhle.com/v1/:path*',
      },
    ];
  },
  images: {
    unoptimized: true,
    // Next.js 16 changes: minimumCacheTTL default is now 4 hours (14400s)
    // and imageSizes no longer includes 16 by default
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api-web.nhle.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.nhle.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.d3.nhle.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Turbopack is now the default bundler in Next.js 16
  // To use webpack instead, run: next dev --webpack or next build --webpack
};

export default nextConfig;
