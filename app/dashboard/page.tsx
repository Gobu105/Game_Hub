import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from './SettingsForm';
import { Bug, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function UserDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch their profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch their feedback history
  const { data: feedback } = await supabase
    .from('comments')
    .select('*, projects(title, icon, id)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-indigo-500/30">
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight text-white">Player Profile</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            Welcome back, <span className="text-white font-medium">{profile?.full_name || 'Gamer'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Profile Settings */}
        <section className="bg-[#111] border border-white/10 rounded-xl p-8 max-w-2xl">
          <h2 className="text-xl font-medium text-white mb-6 border-b border-white/10 pb-4">Account Settings</h2>
          <SettingsForm />
        </section>

        {/* Feedback History */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium text-white flex items-center gap-2 border-b border-white/10 pb-4">
            My Feedback History
          </h2>
          
          {(!feedback || feedback.length === 0) ? (
            <div className="bg-[#111] border border-white/5 rounded-xl p-12 text-center text-gray-500">
              You haven't left any reviews or bug reports yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedback.map((item) => (
                <div key={item.id} className="bg-[#111] border border-white/10 p-5 rounded-xl flex flex-col h-full hover:border-white/20 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <Link href={`/project/${item.projects?.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-8 h-8 bg-black rounded-lg border border-white/10 flex items-center justify-center text-sm shrink-0">
                        {item.projects?.icon}
                      </div>
                      <span className="font-semibold text-white truncate max-w-[150px]">{item.projects?.title}</span>
                    </Link>
                    <div className="flex items-center gap-2">
                      {item.is_bug_report ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full"><Bug className="w-3 h-3" /> BUG</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full"><MessageSquare className="w-3 h-3" /> REVIEW</span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed mb-4 flex-1">
                    "{item.text}"
                  </p>

                  {item.rating && !item.is_bug_report && (
                    <div className="flex text-amber-400/80 text-xs tracking-widest mb-4">
                      {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                    </div>
                  )}

                  {item.developer_reply ? (
                    <div className="mt-auto bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-lg text-sm">
                      <strong className="text-indigo-400 text-xs uppercase tracking-wider block mb-1">Developer Reply</strong>
                      <p className="text-gray-300">{item.developer_reply}</p>
                    </div>
                  ) : (
                    <div className="mt-auto text-xs text-gray-600 italic">
                      Awaiting developer response...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
