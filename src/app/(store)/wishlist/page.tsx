'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'

export default function WishlistPage() {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchWishlist()
    }
  }, [user])

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist')
      const data = await res.json()
      setWishlist(data)
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl text-white mb-4">Please login to view wishlist</h2>
          <Link href="/login" className="px-8 py-4 text-xl rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white glow-button">
            Login 🔑
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-2xl text-white animate-pulse">Loading...</div>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl text-white mb-4">Your wishlist is empty</h2>
          <Link href="/products" className="px-8 py-4 text-xl rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white glow-button">
            Browse Products 🛒
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <h1 className="text-5xl text-center mb-12 bg-gradient-to-r from-yellow-300 via-pink-300 to-green-300 bg-clip-text text-transparent animate-glow">
        My Wishlist
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}