import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";

interface NavBarProps {
  isMainPage?: boolean;
}

export function NavBar({ isMainPage = false }: NavBarProps) {
  const pathname = usePathname();

  return (
    <nav className={`bg-[#1A1A1A] bg-opacity-90 p-4 shadow-lg z-20 top-0 left-0 right-0 ${isMainPage ? 'absolute' : ''}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className={`flex items-center relative group ${pathname === '/' ? '' : 'hover:text-gray-300'}`}>
            <Image
              src="https://img.freepik.com/free-vector/three-coffee-beans-glyph_78370-1770.jpg?t=st=1727270626~exp=1727274226~hmac=dd1f7fecb7efd267d652efae32cf5d7a166c4214aea26a5ff7c272f581747db8&w=1380"
              alt="Coffee Beans Logo"
              width={35}
              height={35}
              className="rounded-full"
            />
            <span className="text-white text-base font-semibold ml-2">CBT</span>
            {pathname !== '/' && (
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full blur-md transition-opacity duration-300 ease-in-out" />
            )}
          </Link>
          <Link
            href="/browse"
            className={`text-white text-base font-semibold ml-8 relative group ${pathname === '/browse' ? '' : 'hover:text-gray-300'}`}
          >
            Overview
            {pathname !== '/browse' && (
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full blur-md transition-opacity duration-300 ease-in-out" />
            )}
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <SearchBar />
          <ConnectKitButton />
        </div>
      </div>
    </nav>
  );
}