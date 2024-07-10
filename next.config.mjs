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
};

export default nextConfig;
