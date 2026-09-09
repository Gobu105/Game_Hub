'use client'

import { useState } from 'react'
import { replyToComment } from './actions'

export default function DeveloperReplyForm({ commentId }: { commentId: string }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage('')
    
    // Auto-inject commentId
    formData.append('comment_id', commentId)
    
    const result = await replyToComment(formData)
    
    if (result.error) {
      setMessage(`Error: ${result.error}`)
    } else if (result.success) {
      setMessage('Reply posted!')
      setTimeout(() => setIsOpen(false), 2000)
    }
    
    setLoading(false)
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
      >
        Write Reply
      </button>
    )
  }

  return (
    <div className="mt-3 bg-gray-950 p-3 rounded-lg border border-gray-800">
      {message && <div className="text-sm text-green-400 mb-2">{message}</div>}
      <form action={handleSubmit} className="flex gap-2">
        <input 
          type="text" 
          name="developer_reply" 
          placeholder="Write your official developer response..." 
          className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:border-indigo-500"
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          {loading ? '...' : 'Post'}
        </button>
        <button 
          type="button" 
          onClick={() => setIsOpen(false)}
          className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </form>
    </div>
  )
}
