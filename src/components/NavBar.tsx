import { ConnectKitButton } from "connectkit";
import Link from "next/link";

export function NavBar() {
  return (
    <nav className="bg-[#1A1A1A] p-4 shadow-lg z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-200">Home</Link>
          <Link href="/browse" className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-200">Overview</Link>
        </div>
        <div className="flex items-center space-x-4">
          <input type="text" placeholder="Search..." className="px-4 py-2 rounded-lg bg-[#2A2A2A] text-white" />
          <ConnectKitButton />
        </div>
      </div>
    </nav>
  );
}