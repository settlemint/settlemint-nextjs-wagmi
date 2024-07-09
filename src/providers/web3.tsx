"use client";

import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { polygonAmoy } from "wagmi/chains";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [polygonAmoy],
    transports: {
      // RPC URL for each chain
      [polygonAmoy.id]: http(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/proxy/blockchain-node`
      ),
    },

    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",

    // Required App Info
    appName: "My App",

    // Optional App Info
    appDescription: "My App Info",
    appUrl:
      typeof window === "undefined"
        ? (process.env.NEXT_PUBLIC_SERVER_URL as string)
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
