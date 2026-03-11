'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-white animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-teal-950">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Dashboard</h3>
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  📊 Overview
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  👤 Profile
                </Link>
                {user.role === 'ADMIN' && (
                  <>
                    <Link
                      href="/dashboard/admin"
                      className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      🔧 Admin
                    </Link>
                    <Link
                      href="/dashboard/admin/products"
                      className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      📦 Products
                    </Link>
                    <Link
                      href="/dashboard/admin/orders"
                      className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      📋 Orders
                    </Link>
                    <Link
                      href="/dashboard/admin/users"
                      className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      👥 Users
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}