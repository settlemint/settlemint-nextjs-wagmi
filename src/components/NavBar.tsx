import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Link from "next/link";

export function NavBar() {
  return (
    <nav className="bg-[#1A1A1A] p-4 shadow-lg z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="https://img.freepik.com/free-vector/three-coffee-beans-glyph_78370-1770.jpg?t=st=1727270626~exp=1727274226~hmac=dd1f7fecb7efd267d652efae32cf5d7a166c4214aea26a5ff7c272f581747db8&w=1380"
              alt="Coffee Beans Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-white text-lg font-semibold ml-2">CBT</span>
          </Link>
          <Link
            href="/browse"
            className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-200 ml-8"
          >
            Overview
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <input type="text" placeholder="Search..." className="px-4 py-2 rounded-lg bg-[#2A2A2A] text-white" />
          <ConnectKitButton />
        </div>
      </div>
    </nav>
  );
}