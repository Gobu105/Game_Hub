import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] py-10">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-white text-center">Welcome to GameHub</h2>
        
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

          <div className="flex gap-4 mt-2">
            <button formAction={login} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors">
              Log in
            </button>
            <button formAction={signup} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
