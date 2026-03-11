'use client'

import { useCart } from '@/hooks/useCart'
import Link from 'next/link'

export default function CartSummary() {
  const { items, total } = useCart()

  if (items.length === 0) return null

  return (
    <div className="p-6 bg-white/10 rounded-2xl backdrop-blur border border-white/20 sticky top-24">
      <h3 className="text-2xl font-bold text-white mb-4">Order Summary</h3>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-white/70">
          <span>Subtotal ({items.length} items)</span>
          <span>${total}</span>
        </div>
        <div className="flex justify-between text-white/70">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="border-t border-white/20 my-2"></div>
        <div className="flex justify-between text-2xl font-bold text-white">
          <span>Total</span>
          <span className="text-green-300">${total}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block w-full px-6 py-3 text-center rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white glow-button"
      >
        Checkout
      </Link>
    </div>
  )
}