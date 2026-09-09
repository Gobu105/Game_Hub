'use client'

import { useState } from 'react'
import { editProject } from './actions'
import { Project } from '@/lib/data'

export default function EditGameForm({ project }: { project: any }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage('')
    
    // Auto-inject project ID
    formData.append('project_id', project.id)
    
    const result = await editProject(formData)
    
    if (result.error) {
      setMessage(`Error: ${result.error}`)
    } else if (result.success) {
      setMessage('Game updated successfully!')
      setTimeout(() => setIsOpen(false), 2000)
    }
    
    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm text-gray-400 hover:text-white"
      >
        Edit Details
      </button>
    )
  }

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 mt-4 w-full relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Edit {project.title}</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">✕</button>
      </div>

      {message && (
        <div className={`p-3 mb-4 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-900/50 text-red-200 border border-red-500' : 'bg-green-900/50 text-green-200 border border-green-500'}`}>
          {message}
        </div>
      )}

      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1" htmlFor="title">Game Title</label>
            <input className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm" id="title" name="title" defaultValue={project.title} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1" htmlFor="tagline">Short Tagline</label>
            <input className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm" id="tagline" name="tagline" defaultValue={project.tagline} required />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1" htmlFor="overview">Full Overview / Description</label>
          <textarea className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm h-20" id="overview" name="overview" defaultValue={project.overview} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1" htmlFor="icon">Emoji Icon</label>
            <input className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm" id="icon" name="icon" defaultValue={project.icon} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1" htmlFor="link">Live Game URL</label>
            <input className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm" id="link" name="link" type="url" defaultValue={project.link} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1" htmlFor="github_url">GitHub URL</label>
            <input className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm" id="github_url" name="github_url" type="url" defaultValue={project.github_url || ''} />
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => setIsOpen(false)} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
