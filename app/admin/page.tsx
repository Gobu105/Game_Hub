import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { updateProjectStatus, updateUserRole } from './actions';
import { Check, X, Shield, ShieldAlert, UserIcon, Code } from 'lucide-react';

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
    return <div className="p-20 text-center text-red-500 text-xl font-bold">Access Denied. Super-Admin Only.</div>;
  }

  // Fetch pending projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*, profiles(full_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  // Fetch all users
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-indigo-500/30">
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-white">Super-Admin Headquarters</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Game Approval Queue */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              Review Queue
              {projects && projects.length > 0 && (
                <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">{projects.length} Pending</span>
              )}
            </h2>
          </div>
          
          {(!projects || projects.length === 0) ? (
            <div className="bg-[#111] border border-white/5 rounded-xl p-12 text-center text-gray-500">
              No games pending approval.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-[#111] border border-white/10 p-5 rounded-xl flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-16 h-16 bg-black rounded-xl border border-white/5 flex items-center justify-center text-3xl shrink-0">
                    {project.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{project.tagline}</p>
                    <p className="text-xs text-gray-500 mt-2">Submitted by Developer: {project.profiles?.full_name || 'Unknown'}</p>
                    <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline mt-1 block">Test App Link →</a>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <form action={updateProjectStatus} className="flex-1 md:flex-none">
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="status" value="approved" />
                      <button className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg font-medium transition-colors">
                        <Check className="w-4 h-4" /> Approve
                      </button>
                    </form>
                    <form action={updateProjectStatus} className="flex-1 md:flex-none">
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <button className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-4 py-2 rounded-lg font-medium transition-colors">
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* User Management */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              User Management
            </h2>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black/50 text-gray-300 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Current Role</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users?.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-200">{u.full_name || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500 font-mono mt-1">{u.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          u.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          u.role === 'developer' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          u.role === 'banned' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}>
                          {u.role === 'super_admin' && <Shield className="w-3 h-3" />}
                          {u.role === 'developer' && <Code className="w-3 h-3" />}
                          {u.role === 'user' && <UserIcon className="w-3 h-3" />}
                          {u.role === 'banned' && <ShieldAlert className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        {u.role !== 'super_admin' && (
                          <>
                            {u.role !== 'developer' && (
                              <form action={updateUserRole}>
                                <input type="hidden" name="user_id" value={u.id} />
                                <input type="hidden" name="role" value="developer" />
                                <button className="text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded transition-colors">
                                  Make Dev
                                </button>
                              </form>
                            )}
                            {u.role === 'developer' && (
                              <form action={updateUserRole}>
                                <input type="hidden" name="user_id" value={u.id} />
                                <input type="hidden" name="role" value="user" />
                                <button className="text-xs bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 border border-gray-500/20 px-3 py-1.5 rounded transition-colors">
                                  Revoke Dev
                                </button>
                              </form>
                            )}
                            {u.role !== 'banned' ? (
                              <form action={updateUserRole}>
                                <input type="hidden" name="user_id" value={u.id} />
                                <input type="hidden" name="role" value="banned" />
                                <button className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded transition-colors">
                                  Ban User
                                </button>
                              </form>
                            ) : (
                              <form action={updateUserRole}>
                                <input type="hidden" name="user_id" value={u.id} />
                                <input type="hidden" name="role" value="user" />
                                <button className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded transition-colors">
                                  Unban
                                </button>
                              </form>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
