'use client'

import { useState } from 'react'
import { login, signup } from '@/app/login/actions'

export default function AuthForm({ error }: { error?: string }) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-white text-center">
        {isLogin ? 'Welcome Back' : 'Create an Account'}
      </h2>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {/* Email Form */}
      <form className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="email">Email</label>
          <input
            className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            id="email"
            name="email"
            type="email"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="password">Password</label>
          <input
            className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            id="password"
            name="password"
            type="password"
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="role">Account Type</label>
            <select
              className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              id="role"
              name="role"
            >
              <option value="user">Regular User (Play & Review)</option>
              <option value="developer">Developer (Submit Games)</option>
            </select>
          </div>
        )}

        <div className="mt-4">
          <button 
            formAction={isLogin ? login : signup} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors"
          >
            {isLogin ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </form>

      <div className="text-center mt-2">
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  )
}
