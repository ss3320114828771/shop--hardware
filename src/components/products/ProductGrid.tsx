'use client'

import { useState, useEffect, useMemo } from 'react'
import ProductCard from './ProductCard'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: {
    id: string
    name: string
    slug: string
  }
  featured?: boolean
  stock: number
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
  showViewToggle?: boolean
  showLoadMore?: boolean
  initialItemsPerPage?: number
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  emptyMessage?: string
  className?: string
}

export default function ProductGrid({
  products,
  loading = false,
  viewMode: externalViewMode,
  onViewModeChange,
  showViewToggle = true,
  showLoadMore = false,
  initialItemsPerPage = 12,
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  },
  emptyMessage = 'No products found',
  className = ''
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(externalViewMode || 'grid')
  const [visibleItems, setVisibleItems] = useState(initialItemsPerPage)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [wishlist, setWishlist] = useState<string[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  // Handle view mode change
  useEffect(() => {
    if (externalViewMode && externalViewMode !== viewMode) {
      setViewMode(externalViewMode)
    }
  }, [externalViewMode, viewMode])

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    onViewModeChange?.(mode)
  }

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [])

  // Toggle wishlist
  const toggleWishlist = (productId: string) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId]
    
    setWishlist(newWishlist)
    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
  }

  // Load more products
  const loadMore = () => {
    setVisibleItems(prev => prev + initialItemsPerPage)
  }

  // Get visible products
  const visibleProducts = useMemo(() => {
    return showLoadMore ? products.slice(0, visibleItems) : products
  }, [products, showLoadMore, visibleItems])

  // Handle image error
  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  // Grid columns class
  const gridColsClass = {
    grid: `grid gap-6 
      grid-cols-${columns.mobile} 
      md:grid-cols-${columns.tablet} 
      lg:grid-cols-${columns.desktop}`,
    list: 'grid gap-6 grid-cols-1'
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        {/* Skeleton Loading */}
        <div className={gridColsClass[viewMode]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white/10 rounded-2xl h-64 mb-4"></div>
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl text-white mb-2">{emptyMessage}</h3>
        <p className="text-white/50 mb-6">Try adjusting your search or filters</p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white glow-button"
        >
          Browse All Products
        </Link>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Toolbar */}
      {showViewToggle && (
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <span className="font-bold">{products.length}</span> products found
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              title="Grid View"
            >
              ⊞
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              title="List View"
            >
              ☷
            </button>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      <div className={gridColsClass[viewMode]}>
        {visibleProducts.map((product, index) => (
          <div
            key={product.id}
            className="relative group animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                wishlist.includes(product.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {wishlist.includes(product.id) ? '❤️' : '🤍'}
            </button>

            {/* Quick View Button */}
            <button
              onClick={() => setQuickViewProduct(product)}
              className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/10 text-white/70 hover:bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title="Quick View"
            >
              👁️
            </button>

            {viewMode === 'grid' ? (
              // Grid View
              <div className="product-card">
                <div className="relative h-64 overflow-hidden rounded-t-2xl">
                  <img
                    src={imageErrors[product.id] ? '/images/placeholder.jpg' : product.images[0] || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => handleImageError(product.id)}
                  />
                  {product.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-bold">
                      Featured
                    </div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-4 py-2 bg-red-500/80 text-white rounded-full">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="text-sm text-purple-300 mb-2">{product.category.name}</div>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-white/70 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
                      ${product.price.toFixed(2)}
                    </span>
                    
                    <Link
                      href={`/products/${product.id}`}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white glow-button"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              // List View
              <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 overflow-hidden hover:scale-[1.02] transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-48 h-48">
                    <img
                      src={imageErrors[product.id] ? '/images/placeholder.jpg' : product.images[0] || '/images/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(product.id)}
                    />
                    {product.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-bold">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div>
                        <div className="text-sm text-purple-300 mb-2">{product.category.name}</div>
                        <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                        <p className="text-white/70 mb-4 line-clamp-2">{product.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.stock > 0 ? (
                            <p className="text-green-300 text-sm mt-1">✓ In Stock ({product.stock})</p>
                          ) : (
                            <p className="text-red-300 text-sm mt-1">✗ Out of Stock</p>
                          )}
                        </div>

                        <Link
                          href={`/products/${product.id}`}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white glow-button"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {showLoadMore && visibleItems < products.length && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white glow-button"
          >
            Load More Products ({products.length - visibleItems} remaining)
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setQuickViewProduct(null)} />
          <div className="relative bg-gradient-to-b from-purple-900 to-blue-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img
                  src={quickViewProduct.images[0] || '/images/placeholder.jpg'}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="text-sm text-purple-300 mb-2">{quickViewProduct.category.name}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{quickViewProduct.name}</h3>
                <p className="text-white/70 mb-4">{quickViewProduct.description}</p>
                
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 mb-4">
                  ${quickViewProduct.price.toFixed(2)}
                </div>

                <div className="flex gap-4">
                  <Link
                    href={`/products/${quickViewProduct.id}`}
                    className="flex-1 px-6 py-3 text-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white glow-button"
                    onClick={() => setQuickViewProduct(null)}
                  >
                    View Full Details
                  </Link>
                  <button
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      wishlist.includes(quickViewProduct.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {wishlist.includes(quickViewProduct.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}