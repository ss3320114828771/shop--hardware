'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'

// Define the product type expected by this component
interface ProductProps {
  id: string
  name: string
  price: number
  images?: string[]
  stock?: number
}

interface AddToCartButtonProps {
  product: ProductProps
  className?: string
  showQuantity?: boolean
  onAdded?: () => void
}

export default function AddToCartButton({ 
  product, 
  className = '',
  showQuantity = false,
  onAdded 
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    if (!product?.id) return
    
    setIsAdding(true)
    
    try {
      // Add to cart with quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
      
      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
      
      // Callback if provided
      if (onAdded) onAdded()
      
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  // Check if product is out of stock
  const isOutOfStock = product.stock !== undefined && product.stock <= 0

  return (
    <div className="space-y-3">
      {/* Quantity Selector (optional) */}
      {showQuantity && !isOutOfStock && (
        <div className="flex items-center gap-3">
          <label className="text-white/70 text-sm">Quantity:</label>
          <div className="flex items-center border border-white/20 rounded-lg">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="px-3 py-1 text-white hover:bg-white/10 disabled:opacity-50"
              disabled={quantity <= 1 || isAdding}
            >
              -
            </button>
            <span className="px-4 py-1 text-white border-x border-white/20 min-w-[50px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="px-3 py-1 text-white hover:bg-white/10 disabled:opacity-50"
              disabled={isAdding || (product.stock !== undefined && quantity >= product.stock)}
            >
              +
            </button>
          </div>
          {product.stock !== undefined && (
            <span className="text-white/50 text-sm">
              Max: {product.stock}
            </span>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || isOutOfStock}
        className={`
          relative w-full px-6 py-3 rounded-xl font-medium transition-all
          ${isOutOfStock 
            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:scale-105 glow-button'
          }
          ${className}
        `}
      >
        {/* Loading State */}
        {isAdding ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none" 
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" 
              />
            </svg>
            Adding...
          </span>
        ) : isOutOfStock ? (
          <span>Out of Stock</span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            🛒 Add to Cart {showQuantity && `(${quantity})`}
          </span>
        )}
      </button>

      {/* Success Message */}
      {showSuccess && (
        <div className="text-green-400 text-sm text-center animate-fadeIn">
          ✓ Added to cart successfully!
        </div>
      )}

      {/* Quick action buttons for multiple quantities */}
      {!showQuantity && !isOutOfStock && (
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => {
              setQuantity(1)
              handleAddToCart()
            }}
            className="flex-1 py-2 bg-white/5 rounded-lg text-white/70 hover:bg-white/10"
          >
            Buy 1
          </button>
          <button
            onClick={() => {
              setQuantity(2)
              handleAddToCart()
            }}
            className="flex-1 py-2 bg-white/5 rounded-lg text-white/70 hover:bg-white/10"
          >
            Buy 2
          </button>
          <button
            onClick={() => {
              setQuantity(3)
              handleAddToCart()
            }}
            className="flex-1 py-2 bg-white/5 rounded-lg text-white/70 hover:bg-white/10"
          >
            Buy 3
          </button>
        </div>
      )}
    </div>
  )
}