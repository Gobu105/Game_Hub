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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-4xl font-bold text-white">Developer Dashboard</h1>
        <div className="flex flex-col items-end">
          <SubmitGameForm />
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 mb-8">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">My Games</h2>
        
        {(!projects || projects.length === 0) ? (
          <p className="text-gray-500">You haven't submitted any games yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between bg-gray-950 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="text-3xl bg-gray-900 w-12 h-12 flex items-center justify-center rounded-lg">{project.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      {project.title} 
                      <span className={`ml-3 text-xs px-2 py-1 rounded-full ${project.status === 'approved' ? 'bg-green-900/50 text-green-400' : project.status === 'rejected' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                        {project.status?.toUpperCase()}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-400">{project.tagline}</p>
                  </div>
                </div>
                <div>
                  <EditGameForm project={project} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 mb-8">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Feedback Inbox</h2>
        
        {(!feedback || feedback.length === 0) ? (
          <p className="text-gray-500">No feedback yet.</p>
        ) : (
          <div className="space-y-6">
            {feedback.map((item) => (
              <div key={item.id} className="bg-gray-950 p-5 rounded-lg border border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {item.is_bug_report ? <Bug className="w-4 h-4 text-red-400" /> : <MessageSquare className="w-4 h-4 text-blue-400" />}
                      <span className="font-semibold text-gray-200">{item.user_name}</span>
                      <span className="text-xs text-gray-500">on {item.projects?.title}</span>
                    </div>
                    <p className="text-gray-300">{item.text}</p>
                  </div>
                  {item.rating && (
                    <div className="flex text-yellow-400 text-sm">
                      {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                    </div>
                  )}
                </div>

                {item.developer_reply ? (
                  <div className="mt-3 bg-gray-900 border-l-2 border-indigo-500 p-3 rounded text-sm">
                    <strong className="text-indigo-400 block mb-1">Your Reply:</strong>
                    <p className="text-gray-400">{item.developer_reply}</p>
                  </div>
                ) : (
                  <DeveloperReplyForm commentId={item.id} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <SettingsForm />
    </div>
  );
}
