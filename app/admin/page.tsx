import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'super_admin') {
    return <div className="p-20 text-center text-red-500 text-xl">Access Denied. You are not an admin.</div>;
  }

  // Fetch all users
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-white mb-8 text-red-400">Super-Admin Dashboard</h1>
      
      <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">User Management</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-gray-950">
              <tr>
                <th className="px-6 py-3 rounded-tl-lg">ID</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 rounded-tr-lg">Joined</th>
              </tr>
            </thead>
            <tbody>
              {profiles?.map((p) => (
                <tr key={p.id} className="border-b border-gray-800 bg-gray-900">
                  <td className="px-6 py-4 font-medium text-white break-all">{p.id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      p.role === 'super_admin' ? 'bg-red-900/50 text-red-400' : 
                      p.role === 'developer' ? 'bg-indigo-900/50 text-indigo-400' : 
                      'bg-gray-800 text-gray-300'
                    }`}>
                      {p.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
