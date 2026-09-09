'use client'

import { useState } from 'react'
import { changePassword } from './actions'

export default function SettingsForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage('')
    
    const result = await changePassword(formData)
    
    if (result.error) {
      setMessage(`Error: ${result.error}`)
    } else if (result.success) {
      setMessage('Password updated successfully!')
      const form = document.getElementById('password-form') as HTMLFormElement
      form?.reset()
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 mt-8">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Account Settings</h2>
      
      <form id="password-form" action={handleSubmit} className="max-w-md flex flex-col gap-4">
        <h3 className="font-semibold text-lg text-white">Change Password</h3>
        
        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-900/50 text-red-200 border border-red-500' : 'bg-green-900/50 text-green-200 border border-green-500'}`}>
            {message}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="new_password">New Password</label>
          <input
            className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            id="new_password"
            name="new_password"
            type="password"
            required
            minLength={6}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="confirm_password">Confirm New Password</label>
          <input
            className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            id="confirm_password"
            name="confirm_password"
            type="password"
            required
            minLength={6}
          />
        </div>

        <button type="submit" disabled={loading} className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full mt-2 border border-gray-700">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
