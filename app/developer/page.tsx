import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from '../dashboard/SettingsForm';
import SubmitGameForm from './SubmitGameForm';
import DeveloperReplyForm from './DeveloperReplyForm';
import EditGameForm from './EditGameForm';
import { MessageSquare, Bug } from 'lucide-react';

export const revalidate = 0;

export default async function DeveloperDashboard() {
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

  if (profile?.role !== 'developer' && profile?.role !== 'super_admin') {
    return <div className="p-20 text-center text-red-500 text-xl">Access Denied. You are not a developer.</div>;
  }

  // Fetch developer's projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('developer_id', user.id);

  // Fetch feedback for all their projects
  const projectIds = projects?.map(p => p.id) || [];
  const { data: feedback } = await supabase
    .from('comments')
    .select('*, projects(title)')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-indigo-500/30">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-md flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">GH</span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-white">Developer Console</h1>
          </div>
          <div className="flex items-center gap-4">
            <SubmitGameForm />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 flex flex-col justify-between">
            <span className="text-sm font-medium text-gray-400">Published Games</span>
            <span className="text-4xl font-light text-white mt-4">{projects?.length || 0}</span>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 flex flex-col justify-between">
            <span className="text-sm font-medium text-gray-400">Total Feedback</span>
            <span className="text-4xl font-light text-white mt-4">{feedback?.length || 0}</span>
          </div>
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/20 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl"></div>
            <span className="text-sm font-medium text-indigo-300">Developer Status</span>
            <span className="text-2xl font-semibold text-white mt-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span> Active
            </span>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Projects Column */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-medium text-white">Your Projects</h2>
            </div>
            
            {(!projects || projects.length === 0) ? (
              <div className="border border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-[#0a0a0a]">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl">🚀</span>
                </div>
                <h3 className="text-base font-medium text-white mb-1">No projects yet</h3>
                <p className="text-sm text-gray-500 mb-6">Start building your audience by submitting your first game.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="group bg-[#111] border border-white/5 hover:border-white/20 rounded-xl p-5 transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                        <div className="w-16 h-16 bg-black border border-white/10 rounded-xl flex items-center justify-center text-3xl shadow-sm shrink-0">
                          {project.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-white truncate">{project.title}</h3>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              project.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                              project.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 truncate mt-1">{project.tagline}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <EditGameForm project={project} />
                            <a href={`/project/${project.id}`} className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                              View public page →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Inbox Column */}
          <section className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                Inbox
                {feedback && feedback.length > 0 && (
                  <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full">{feedback.length}</span>
                )}
              </h2>
            </div>
            
            <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden h-[600px] flex flex-col">
              {(!feedback || feedback.length === 0) ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <span className="text-3xl opacity-20 mb-3">📭</span>
                  <p className="text-sm text-gray-500">You're all caught up!</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {feedback.map((item) => (
                    <div key={item.id} className="bg-black border border-white/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-gray-900 flex items-center justify-center border border-white/5">
                            {item.is_bug_report ? <Bug className="w-3 h-3 text-rose-400" /> : <MessageSquare className="w-3 h-3 text-indigo-400" />}
                          </div>
                          <span className="text-sm font-medium text-gray-200">{item.user_name}</span>
                        </div>
                        {item.rating && (
                          <div className="flex text-amber-400/80 text-[10px] tracking-widest">
                            {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-2 truncate">Re: {item.projects?.title}</p>
                      
                      <div className="text-sm text-gray-300 leading-relaxed mb-4 bg-white/5 p-3 rounded-md">
                        {item.text}
                      </div>

                      {item.developer_reply ? (
                        <div className="mt-3 pl-3 border-l-2 border-indigo-500/50">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">You replied</span>
                          <p className="text-sm text-gray-400 mt-1">{item.developer_reply}</p>
                        </div>
                      ) : (
                        <DeveloperReplyForm commentId={item.id} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
        
        <div className="border-t border-white/10 pt-10">
          <SettingsForm />
        </div>
      </main>
    </div>
  );
}
