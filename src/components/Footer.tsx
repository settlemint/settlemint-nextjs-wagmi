import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#F5F5F5] py-8 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-lg">&copy; 2024 SettleMint. All rights reserved.</p>
        <p className="mt-2 text-sm opacity-75">
          Powered by{' '}
          <Link href="https://settlemint.com" target="_blank" rel="noopener noreferrer" className="text-[#D4A574] hover:underline">
            SettleMint
          </Link>
        </p>
      </div>
    </footer>
  );
}