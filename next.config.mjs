/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const nodeUrl = new URL(
      `/${process.env.BTP_TOKEN}`,
      process.env.BLOCKCHAIN_NODE
    );
    const portalUrl = new URL(
      `/${process.env.BTP_TOKEN}`,
      process.env.PORTAL_URL
    );
    return [
      {
        source: "/proxy/blockchain-node",
        destination: nodeUrl.toString(),
      },
      {
        source: "/proxy/portal/:path*",
        destination: `${portalUrl.toString()}/:path*`,
      },
    ];
  },
};

export default nextConfig;
