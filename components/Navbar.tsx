import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Gamepad2 className="w-8 h-8 text-indigo-500" />
            <span className="font-bold text-xl tracking-tight">GameHub</span>
          </Link>
          <div className="flex space-x-4">
            <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
