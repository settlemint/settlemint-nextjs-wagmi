import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "../providers/query";
import Web3Provider from "../providers/web3";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coffee Bean Tracker",
  description: "Coffee beans"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Web3Provider>{children} </Web3Provider>
        </QueryProvider>
      </body>
    </html>
  );
}
