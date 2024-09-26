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
            <div className="relative w-[35px] h-[35px]">
              <div className="absolute inset-0 bg-white rounded-full"/>
              <Image
                src="/favicon.ico"
                alt="Coffee Beans Logo"
                width={25}
                height={25}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
              />
            </div>
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