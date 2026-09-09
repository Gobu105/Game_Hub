'use client'

import { useState } from 'react'
import { submitFeedback } from './actions'

export default function FeedbackForm({ projectId, isLoggedIn }: { projectId: string, isLoggedIn: boolean }) {
  const [type, setType] = useState('review')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl text-center">
        <p className="text-gray-400 mb-4">You must be logged in to leave feedback or report bugs.</p>
        <a href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Login to Continue
        </a>
      </div>
    )
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage('')
    
    const result = await submitFeedback(formData)
    
    if (result.error) {
      setMessage(`Error: ${result.error}`)
    } else if (result.success) {
      setMessage('Successfully submitted! Thank you.')
      // Reset form (this is a simple way without refs for now)
      document.getElementById('feedback-form')?.reset()
    }
    
    setLoading(false)
  }

  return (
    <form id="feedback-form" action={handleSubmit} className="bg-gray-900 border border-gray-800 p-6 rounded-xl mb-10">
      <h3 className="text-xl font-bold mb-4">Leave Feedback</h3>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('Error') ? 'bg-red-900/50 text-red-200 border border-red-500' : 'bg-green-900/50 text-green-200 border border-green-500'}`}>
          {message}
        </div>
      )}

      <input type="hidden" name="project_id" value={projectId} />
      
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="type" value="review" checked={type === 'review'} onChange={() => setType('review')} className="text-indigo-600 focus:ring-indigo-500 bg-gray-800 border-gray-700" />
          <span className="text-sm font-medium">Review</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="type" value="bug" checked={type === 'bug'} onChange={() => setType('bug')} className="text-red-600 focus:ring-red-500 bg-gray-800 border-gray-700" />
          <span className="text-sm font-medium text-red-400">Bug Report</span>
        </label>
      </div>

      {type === 'review' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">Rating (1-5)</label>
          <select name="rating" className="w-full bg-gray-950 border border-gray-700 rounded-lg text-white px-3 py-2" required>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Okay</option>
            <option value="2">2 - Needs Work</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">Your Message</label>
        <textarea 
          name="text" 
          rows={4} 
          required 
          className="w-full bg-gray-950 border border-gray-700 rounded-lg text-white px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
          placeholder={type === 'bug' ? 'Describe the bug in detail...' : 'What did you think of the app?'}
        ></textarea>
      </div>

      <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto">
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
