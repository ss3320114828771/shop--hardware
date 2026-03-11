'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'

interface ProductCardProps {
  product: any
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <div className="product-card group">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={product.images[0] || '/images/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.featured && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-bold">
            Featured
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="text-sm text-purple-300 mb-2">{product.category.name}</div>
        <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
        <p className="text-white/70 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
            ${product.price}
          </span>
          
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white glow-button"
          >
            Add to Cart 🛒
          </button>
        </div>
      </div>

      <Link href={`/products/${product.id}`} className="absolute inset-0">
        <span className="sr-only">View Details</span>
      </Link>
    </div>
  )
}