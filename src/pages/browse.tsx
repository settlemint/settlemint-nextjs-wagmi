import { ConnectKitButton } from "connectkit";
import Head from "next/head";
import { AttestationsTableView } from "../components/AttestationsTableView";

export default function Browse() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] font-light">
      <Head>
        <title>Browse Attestations</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <nav className="bg-[#1A1A1A] bg-opacity-80 p-4 shadow-lg z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-200">Home</a>
            <a href="/about" className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-200">About</a>
            <a href="/blog" className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-200">All Batches</a>
            <a href="/browse" className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-200">Browse Attestations</a>
          </div>
          <div className="flex items-center space-x-4">
            <input type="text" placeholder="Search..." className="px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400" />
            <ConnectKitButton />
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto my-12 px-4">
        <AttestationsTableView />
      </main>

      <footer className="bg-[#333333] text-white py-4 mt-auto">
        <div className="container mx-auto text-center text-sm">
          &copy; 2024 Coffee Batch Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}