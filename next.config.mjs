/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const nodeUrl = new URL(
      `/${process.env.BTP_TOKEN}`,
      process.env.BLOCKCHAIN_NODE
    );
    return [
      {
        source: "/proxy/blockchain-node",
        destination: nodeUrl.toString(),
      },
    ];
  },
};

export default nextConfig;
