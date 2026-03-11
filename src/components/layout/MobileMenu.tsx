'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navItems: Array<{ name: string; href: string; icon: string }>
  user: any
  onLogout: () => void
  cartCount: number
}

export default function MobileMenu({ isOpen, onClose, navItems, user, onLogout, cartCount }: MobileMenuProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Menu */}
      <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-purple-900 to-blue-900 p-6 animate-slideIn">
        <div className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                pathname === item.href
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl mr-4">{item.icon}</span>
              {item.name}
            </Link>
          ))}

          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center px-4 py-3 rounded-xl bg-white/10 text-white"
          >
            <span className="text-2xl mr-4">🛒</span>
            Cart
            {cartCount > 0 && (
              <span className="ml-auto w-6 h-6 bg-red-500 rounded-full text-sm flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                href={user.role === 'ADMIN' ? '/admin' : '/profile'}
                onClick={onClose}
                className="flex items-center px-4 py-3 rounded-xl bg-white/10 text-white"
              >
                <span className="text-2xl mr-4">👤</span>
                {user.name}
              </Link>
              <button
                onClick={() => {
                  onLogout()
                  onClose()
                }}
                className="w-full flex items-center px-4 py-3 rounded-xl bg-red-500/20 text-red-300"
              >
                <span className="text-2xl mr-4">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center px-4 py-3 rounded-xl bg-white/10 text-white"
              >
                <span className="text-2xl mr-4">🔑</span>
                Login
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center px-4 py-3 rounded-xl bg-white/10 text-white"
              >
                <span className="text-2xl mr-4">📝</span>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}