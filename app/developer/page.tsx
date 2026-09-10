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
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-indigo-900/20 to-transparent border-b border-indigo-900/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Developer Studio</h1>
            <p className="text-indigo-200/60 mt-2 text-lg">Manage your games, reply to feedback, and grow your audience.</p>
          </div>
          <div className="flex-shrink-0">
            <SubmitGameForm />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: My Games */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🎮 My Games
                <span className="bg-indigo-600/20 text-indigo-400 text-xs py-1 px-3 rounded-full font-semibold">{projects?.length || 0}</span>
              </h2>
            </div>
            
            {(!projects || projects.length === 0) ? (
              <div className="bg-[#111] border border-gray-800/50 rounded-2xl p-12 text-center shadow-2xl">
                <div className="text-5xl mb-4 opacity-50">🚀</div>
                <h3 className="text-xl font-bold text-white mb-2">No games yet</h3>
                <p className="text-gray-400 max-w-md mx-auto">You haven't submitted any games to the hub. Click "Submit New Game" to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-[#111] border border-gray-800/60 rounded-2xl p-6 shadow-xl hover:border-indigo-500/30 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="text-5xl bg-black w-24 h-24 flex items-center justify-center rounded-2xl shadow-inner border border-gray-800/50 shrink-0">
                        {project.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-2xl text-white truncate">{project.title}</h3>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                            project.status === 'approved' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' : 
                            project.status === 'rejected' ? 'bg-rose-950/50 text-rose-400 border border-rose-900/50' : 
                            'bg-amber-950/50 text-amber-400 border border-amber-900/50'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.tagline}</p>
                        
                        <div className="flex gap-3 mt-auto">
                          <EditGameForm project={project} />
                          <a href={`/project/${project.id}`} className="text-sm bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors border border-gray-700/50">
                            View Page
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Feedback Inbox */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              📬 Inbox
              {feedback && feedback.length > 0 && (
                <span className="bg-red-500/20 text-red-400 text-xs py-1 px-3 rounded-full font-semibold">{feedback.length}</span>
              )}
            </h2>
            
            <div className="bg-[#111] border border-gray-800/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -z-10"></div>
              
              {(!feedback || feedback.length === 0) ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4 opacity-30">📭</div>
                  <p className="text-gray-500 font-medium">Inbox is empty</p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                  {feedback.map((item) => (
                    <div key={item.id} className="bg-black/40 p-5 rounded-xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                      <div className="flex justify-between items-start mb-3 gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            {item.is_bug_report ? 
                              <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full"><Bug className="w-3 h-3" /> BUG</span> : 
                              <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full"><MessageSquare className="w-3 h-3" /> REVIEW</span>
                            }
                            <span className="text-xs text-gray-500">on <strong className="text-gray-300">{item.projects?.title}</strong></span>
                          </div>
                          <div className="font-semibold text-gray-200 flex items-center gap-2">
                            {item.user_name}
                            {item.rating && (
                              <span className="flex text-amber-400 text-xs tracking-widest">
                                {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm leading-relaxed mb-4 bg-gray-900/50 p-3 rounded-lg border border-gray-800/50">
                        "{item.text}"
                      </p>

                      {item.developer_reply ? (
                        <div className="mt-3 bg-indigo-950/20 border-l-2 border-indigo-500 p-3 rounded-r-lg text-sm">
                          <strong className="text-indigo-400 text-xs uppercase tracking-wider block mb-1">Your Reply</strong>
                          <p className="text-gray-300">{item.developer_reply}</p>
                        </div>
                      ) : (
                        <DeveloperReplyForm commentId={item.id} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
        <SettingsForm />
      </div>
    </div>
  );
}
