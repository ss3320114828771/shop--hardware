'use client'

import Image from 'next/image'
import { useCart } from '@/hooks/useCart'

interface CartItemProps {
  item: any
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="flex gap-4 p-4 bg-white/10 rounded-xl">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
        <Image
          src={item.images[0] || '/images/placeholder.jpg'}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-grow">
        <h3 className="text-white font-bold">{item.name}</h3>
        <p className="text-purple-300">${item.price}</p>

        <div className="flex items-center gap-4 mt-2">
          <select
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
            className="px-2 py-1 rounded bg-white/10 border border-white/20 text-white"
          >
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-300 text-sm"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="text-right">
        <span className="text-xl font-bold text-green-300">
          ${item.price * item.quantity}
        </span>
      </div>
    </div>
  )
}