'use client'

import { useState } from 'react'
import { submitProject } from './actions'

export default function SubmitGameForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage('')
    
    const result = await submitProject(formData)
    
    if (result.error) {
      setMessage(`Error: ${result.error}`)
    } else if (result.success) {
      setMessage('Game submitted successfully! Waiting for Admin approval.')
      const form = document.getElementById('submit-game-form') as HTMLFormElement
      form?.reset()
      setTimeout(() => setIsOpen(false), 3000)
    }
    
    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        + Submit New Game
      </button>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Submit Game for Review</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
      </div>

      {message && (
        <div className={`p-3 mb-4 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-900/50 text-red-200 border border-red-500' : 'bg-green-900/50 text-green-200 border border-green-500'}`}>
          {message}
        </div>
      )}

      <form id="submit-game-form" action={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="title">Game Title</label>
            <input className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white" id="title" name="title" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="tagline">Short Tagline</label>
            <input className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white" id="tagline" name="tagline" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="overview">Full Overview / Description</label>
            <textarea className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white h-24" id="overview" name="overview" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="whats_new">What's New?</label>
            <textarea className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white h-24" id="whats_new" name="whats_new" placeholder="Patch notes..." />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="screenshots">Screenshot URLs (comma-separated)</label>
          <input className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white" id="screenshots" name="screenshots" placeholder="https://image1.jpg, https://image2.jpg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="icon">Emoji Icon</label>
            <input className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white" id="icon" name="icon" placeholder="e.g. 🎮" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="link">Live Game URL</label>
            <input className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white" id="link" name="link" type="url" placeholder="https://" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="github_url">GitHub URL (Optional)</label>
            <input className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white" id="github_url" name="github_url" type="url" placeholder="https://github.com/..." />
          </div>
        </div>

        <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full mt-2">
          {loading ? 'Submitting...' : 'Submit to Admin Queue'}
        </button>
      </form>
    </div>
  )
}
