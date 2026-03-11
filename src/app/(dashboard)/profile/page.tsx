'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setIsEditing(false)
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
        My Profile
      </h1>

      <div className="bg-white/10 rounded-2xl backdrop-blur border border-white/20 p-8">
        {!isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="text-white/50 block mb-1">Name</label>
              <p className="text-2xl text-white">{user?.name}</p>
            </div>
            <div>
              <label className="text-white/50 block mb-1">Email</label>
              <p className="text-2xl text-white">{user?.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white glow-button"
            >
              Edit Profile ✏️
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                rows={3}
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white glow-button"
              >
                Save Changes 💾
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 text-white glow-button"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}