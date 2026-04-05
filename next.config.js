/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow external images from any domain so admin-supplied photo URLs work
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
