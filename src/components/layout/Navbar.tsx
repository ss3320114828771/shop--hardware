'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { cartCount } = useCart()

  const navItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Products', href: '/products', icon: '🔧' },
    { name: 'About', href: '/about', icon: '📖' },
    { name: 'Contact', href: '/contact', icon: '📞' },
    { name: 'Directions', href: '/directions', icon: '🗺️' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse flex items-center justify-center">
              <span className="text-2xl">🛠️</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-green-300 bg-clip-text text-transparent animate-glow">
              Hafiz Sajid
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-6 py-3 rounded-xl transition-all duration-300 glow-button ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white glow-button"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-sm flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href={user.role === 'ADMIN' ? '/admin' : '/profile'}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white glow-button"
                >
                  👤 {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white glow-button"
                >
                  🚪
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white glow-button"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white glow-button"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center glow-button"
          >
            <div className="space-y-2">
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fadeIn">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-6 py-4 rounded-xl transition-all duration-300 ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/10 text-white/90 hover:bg-white/20'
                }`}
              >
                <span className="text-2xl mr-4">{item.icon}</span>
                <span className="text-lg">{item.name}</span>
              </Link>
            ))}
            
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white"
            >
              <span className="text-2xl mr-4">🛒</span>
              <span className="text-lg">Cart</span>
              {cartCount > 0 && (
                <span className="ml-auto w-6 h-6 bg-red-500 rounded-full text-sm flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}