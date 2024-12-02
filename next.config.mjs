/** @type {import('next').NextConfig} */
const nextConfig = {
  compilerOptions: {
    baseUrl: '.',
    paths: {
      '@/*': ['./src/*']
    }
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
};

export default nextConfig;
