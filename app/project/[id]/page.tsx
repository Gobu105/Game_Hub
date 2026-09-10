import { notFound } from 'next/navigation';
import { ArrowLeft, Play, Star, Bug, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { supabase as getSupabase } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';
import FeedbackForm from './FeedbackForm';

export const dynamic = 'force-dynamic';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const serverSupabase = await createClient();
  const { data: { user } } = await serverSupabase.auth.getUser();
  
  // Use the anon client for public reads to avoid row level security issues if configured poorly, 
  // but since we turned off RLS it doesn't matter much.
  const supabase = getSupabase;

  // Fetch project
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (!project) {
    notFound();
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('project_id', resolvedParams.id)
    .order('created_at', { ascending: false });

  const allFeedback = comments || [];
  const reviews = allFeedback.filter(f => !f.is_bug_report);
  const bugReports = allFeedback.filter(f => f.is_bug_report);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hub
      </Link>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="text-6xl bg-gray-900 w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg border border-gray-800">
            {project.icon}
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white">{project.title}</h1>
            <p className="text-xl text-gray-400 mt-2">{project.tagline}</p>
          </div>
        </div>
        <a href={project.link || '#'} className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-colors w-full md:w-auto shadow-lg shadow-indigo-900/20">
          <Play className="w-5 h-5 mr-2 fill-current" /> Open App
        </a>
      </div>

      {/* Overview & Screenshots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2">Overview</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{project.overview}</p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4 border-b border-gray-800 pb-2">What's New</h2>
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">Latest Update</span>
              </div>
              <p className="text-gray-400 whitespace-pre-wrap">{project.whats_new || `Welcome to ${project.title}!`}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2">Screenshots</h2>
          <div className="space-y-4">
            {project.screenshots && project.screenshots.length > 0 ? (
              project.screenshots.map((ss: string, idx: number) => (
                <div key={idx} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                  <img src={ss} alt={`Screenshot ${idx + 1}`} className="w-full h-auto object-cover" />
                </div>
              ))
            ) : (
              <div className="bg-gray-900 aspect-video rounded-xl flex items-center justify-center text-gray-600 border border-gray-800">
                <span className="text-sm">No screenshots uploaded</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Community Section (Play Store Style) */}
      <div className="mb-16">
        <FeedbackForm projectId={project.id} isLoggedIn={!!user} />

        <h2 className="text-3xl font-bold mb-8">Community & Feedback</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Ratings & Reviews */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-indigo-400" /> Ratings & Reviews</h3>
              <button className="text-sm text-indigo-400 hover:text-indigo-300">Write a Review</button>
            </div>
            
            <div className="space-y-6">
              {reviews.length === 0 && <p className="text-gray-500 text-sm">No reviews yet.</p>}
              {reviews.map(review => (
                <div key={review.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-900 text-indigo-200 flex items-center justify-center font-bold text-sm uppercase">
                        {review.user_name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold block">{review.user_name}</span>
                        <div className="flex text-yellow-500 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < (review.rating || 0) ? 'fill-current' : 'text-gray-700'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{review.text}</p>
                  
                  {/* Developer Reply */}
                  {review.developer_reply && (
                    <div className="mt-3 bg-gray-950 p-3 rounded-lg border-l-2 border-indigo-500 ml-4">
                      <span className="text-xs font-bold text-indigo-400 mb-1 block">Developer Reply</span>
                      <p className="text-gray-400 text-sm">{review.developer_reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bug Reports */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center"><Bug className="w-5 h-5 mr-2 text-red-400" /> Bug Reports</h3>
              <button className="text-sm text-red-400 hover:text-red-300">Report Issue</button>
            </div>

            <div className="space-y-6">
              {bugReports.length === 0 && <p className="text-gray-500 text-sm">No bugs reported.</p>}
              {bugReports.map(bug => (
                <div key={bug.id} className="bg-gray-900 rounded-xl p-5 border border-red-900/30">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-900/50 text-red-200 flex items-center justify-center font-bold text-sm uppercase">
                        {bug.user_name.charAt(0)}
                      </div>
                      <span className="font-semibold block">{bug.user_name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(bug.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="mb-3">
                    {bug.status === 'Resolved' && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-900/50 text-green-400"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</span>}
                    {bug.status === 'In Progress' && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-900/50 text-yellow-400"><Clock className="w-3 h-3 mr-1" /> In Progress</span>}
                    {bug.status === 'Open' && <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-900/50 text-red-400">Open</span>}
                  </div>

                  <p className="text-gray-300 text-sm mb-3">{bug.text}</p>
                  
                  {/* Developer Reply */}
                  {bug.developer_reply && (
                    <div className="mt-3 bg-gray-950 p-3 rounded-lg border-l-2 border-red-500 ml-4">
                      <span className="text-xs font-bold text-red-400 mb-1 block">Developer Reply</span>
                      <p className="text-gray-400 text-sm">{bug.developer_reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
