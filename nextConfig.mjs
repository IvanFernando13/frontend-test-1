/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/ideas',
        destination: 'https://suitmedia-backend.suitdev.com/api/ideas',
      },
    ];
  },
};

export default nextConfig;