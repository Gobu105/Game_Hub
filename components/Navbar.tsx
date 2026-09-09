import Link from 'next/link';
import { Gamepad2, User } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { logout } from '@/app/login/actions';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user exists, fetch their profile to know their role
  let role = 'user';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile) {
      role = profile.role;
    }
  }

  return (
    <nav className="border-b border-gray-800 bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Gamepad2 className="w-8 h-8 text-indigo-500" />
            <span className="font-bold text-xl tracking-tight">GameHub</span>
          </Link>
          <div className="flex space-x-4 items-center">
            <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
            
            {user ? (
              <>
                {role === 'developer' && (
                  <Link href="/developer" className="text-indigo-400 hover:text-indigo-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Dev Dashboard
                  </Link>
                )}
                {role === 'super_admin' && (
                  <Link href="/admin" className="text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Admin Dashboard
                  </Link>
                )}
                {role === 'user' && (
                  <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                )}
                <form action={logout}>
                  <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                <User className="w-4 h-4 mr-2" /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
