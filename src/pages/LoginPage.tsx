import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/projects', { replace: true })
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0f14] text-gray-200 font-mono flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="mb-8 text-center">
          <span className="text-[#3baaff] font-semibold text-xl">kikOS PM</span>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#13151d] border border-[#2a2d36] rounded-lg p-6 flex flex-col gap-4"
        >
          {error && (
            <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs text-gray-400">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="bg-[#0d0f14] border border-[#2a2d36] rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#3baaff]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs text-gray-400">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-[#0d0f14] border border-[#2a2d36] rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#3baaff]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#3baaff] text-[#0d0f14] font-semibold text-sm py-2 rounded hover:bg-[#5bbfff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
