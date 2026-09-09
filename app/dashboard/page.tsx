import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from './SettingsForm';

export const revalidate = 0;

export default async function UserDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user's feedback
  const { data: feedback } = await supabase
    .from('comments')
    .select('*, projects(title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-white mb-8">My Dashboard</h1>
      
      <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">My Feedback & Bug Reports</h2>
        
        {(!feedback || feedback.length === 0) ? (
          <p className="text-gray-500">You haven't submitted any feedback yet.</p>
        ) : (
          <div className="space-y-6">
            {feedback.map((item) => (
              <div key={item.id} className="bg-gray-950 p-5 rounded-lg border border-gray-800">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-indigo-400">Project: {item.projects?.title}</span>
                  <span className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <div className="mb-2">
                  {item.is_bug_report ? (
                    <span className="inline-block bg-red-900/50 text-red-400 text-xs px-2 py-1 rounded">Bug Report • {item.status}</span>
                  ) : (
                    <span className="inline-block bg-yellow-900/50 text-yellow-500 text-xs px-2 py-1 rounded">Review • {item.rating} Stars</span>
                  )}
                </div>
                <p className="text-gray-300">{item.text}</p>
                
                {item.developer_reply && (
                  <div className="mt-4 p-3 bg-gray-900 border-l-2 border-indigo-500 rounded text-sm">
                    <strong className="text-indigo-400 block mb-1">Developer Reply:</strong>
                    <p className="text-gray-400">{item.developer_reply}</p>
                  </div>
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
