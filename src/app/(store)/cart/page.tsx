'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// Define type for cart item
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  images?: string[]
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  // Load cart on page load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (saved) {
        const cartItems = JSON.parse(saved) as CartItem[]
        setItems(cartItems)
        
        // Calculate total
        const sum = cartItems.reduce((acc: number, item: CartItem) => {
          return acc + (Number(item.price) * Number(item.quantity))
        }, 0)
        setTotal(sum)
      }
    } catch (e) {
      console.log('Cart error:', e)
    }
  }, [])

  // Remove from cart
  const removeItem = (id: string) => {
    const newItems = items.filter((item: CartItem) => item.id !== id)
    setItems(newItems)
    localStorage.setItem('cart', JSON.stringify(newItems))
    
    // Recalculate total
    const sum = newItems.reduce((acc: number, item: CartItem) => {
      return acc + (Number(item.price) * Number(item.quantity))
    }, 0)
    setTotal(sum)
  }

  // Update quantity
  const updateQty = (id: string, qty: number) => {
    const newItems = items.map((item: CartItem) => 
      item.id === id ? { ...item, quantity: qty } : item
    )
    setItems(newItems)
    localStorage.setItem('cart', JSON.stringify(newItems))
    
    // Recalculate total
    const sum = newItems.reduce((acc: number, item: CartItem) => {
      return acc + (Number(item.price) * Number(item.quantity))
    }, 0)
    setTotal(sum)
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl text-white mb-4">Cart is empty</h2>
        <Link href="/products" className="px-4 py-2 bg-blue-600 text-white rounded">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl text-white text-center mb-6">Shopping Cart</h1>
      
      <div className="space-y-3">
        {items.map((item: CartItem, index: number) => (
          <div key={index} className="p-3 bg-gray-800 rounded flex gap-3">
            {/* Image Placeholder */}
            <div className="w-16 h-16 bg-gray-700 rounded"></div>
            
            {/* Details */}
            <div className="flex-1">
              <h3 className="text-white font-bold">{item.name || 'Product'}</h3>
              <p className="text-green-400">${Number(item.price).toFixed(2)}</p>
              
              <div className="flex gap-3 mt-2">
                <select
                  value={item.quantity || 1}
                  onChange={(e) => updateQty(item.id, Number(e.target.value))}
                  className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
                >
                  {[1,2,3,4,5].map((n: number) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
            
            {/* Total */}
            <div className="text-right">
              <p className="text-white font-bold">
                ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-800 rounded">
        <div className="flex justify-between text-white text-xl">
          <span>Total:</span>
          <span className="text-green-400">${total.toFixed(2)}</span>
        </div>
        
        <Link
          href="/checkout"
          className="block mt-4 w-full px-4 py-3 bg-green-600 text-white text-center rounded"
        >
          Checkout
        </Link>
      </div>
    </div>
  )
}