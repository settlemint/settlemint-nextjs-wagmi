import { join } from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/proxy/blockchain-node",
        destination: process.env.BLOCKCHAIN_NODE,
      },
      {
        source: "/proxy/portal/:path*",
        destination: `${process.env.PORTAL_URL}/:path*`,
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  experimental: {
    appDir: true,
  },
  webpack(config) {
    config.resolve.alias['@'] = join(__dirname, 'src');
    return config;
  },
};

export default nextConfig;
