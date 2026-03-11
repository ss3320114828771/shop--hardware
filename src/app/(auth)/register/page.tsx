'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(name, email, password)
      router.push('/')
    } catch (err) {
      setError('Registration failed. Email may already exist.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
        <h2 className="text-4xl text-center mb-8 bg-gradient-to-r from-yellow-300 via-pink-300 to-green-300 bg-clip-text text-transparent animate-glow">
          Register
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              placeholder="Hafiz Sajid"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full px-8 py-4 text-xl rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white glow-button"
          >
            Register 📝
          </button>
        </form>

        <p className="mt-6 text-center text-white/70">
          Already have an account?{' '}
          <Link href="/login" className="text-purple-300 hover:text-purple-200">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}