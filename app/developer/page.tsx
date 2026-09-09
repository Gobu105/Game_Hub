import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from '../dashboard/SettingsForm';

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Developer Dashboard</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Submit New Game
        </button>
      </div>
      
      <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
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
                    <h3 className="font-bold text-lg text-white">{project.title}</h3>
                    <p className="text-sm text-gray-400">{project.tagline}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm text-indigo-400 hover:text-indigo-300">View Feedback</button>
                  <button className="text-sm text-gray-400 hover:text-white">Edit Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SettingsForm />
    </div>
  );
}
