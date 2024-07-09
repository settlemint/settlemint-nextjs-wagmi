"use client";

import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { http, WagmiProvider, createConfig } from "wagmi";
import { polygonAmoy } from "wagmi/chains";

const nodeUrl = new URL(
  `/${process.env.NEXT_PUBLIC_BTP_TOKEN}`,
  process.env.NEXT_PUBLIC_BLOCKCHAIN_NODE!
);

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [polygonAmoy],
    transports: {
      // RPC URL for each chain
      [polygonAmoy.id]: http(nodeUrl.toString()), // TODO: use a proxy, don't expose api key
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

    // Required App Info
    appName: "My App",

    // Optional App Info
    appDescription: "My App Info",
    appUrl:
      typeof window === "undefined"
        ? process.env.NEXTAUTH_URL!
        : window.location.toString(),
  })
);

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      <ConnectKitProvider
        options={{
          language: "en-US",
          enforceSupportedChains: true,
        }}
        mode="auto"
      >
        {children}
      </ConnectKitProvider>
    </WagmiProvider>
  );
}
