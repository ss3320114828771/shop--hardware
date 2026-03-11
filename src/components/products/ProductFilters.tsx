'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  _count?: {
    products: number
  }
}

interface ProductFiltersProps {
  categories: Category[]
  minPrice: number
  maxPrice: number
  selectedCategory?: string
  selectedMinPrice?: string
  selectedMaxPrice?: string
}

export default function ProductFilters({ 
  categories, 
  minPrice, 
  maxPrice,
  selectedCategory,
  selectedMinPrice,
  selectedMaxPrice 
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [priceRange, setPriceRange] = useState({
    min: selectedMinPrice ? parseInt(selectedMinPrice) : minPrice,
    max: selectedMaxPrice ? parseInt(selectedMaxPrice) : maxPrice
  })
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Update local state when props change
  useEffect(() => {
    setPriceRange({
      min: selectedMinPrice ? parseInt(selectedMinPrice) : minPrice,
      max: selectedMaxPrice ? parseInt(selectedMaxPrice) : maxPrice
    })
  }, [selectedMinPrice, selectedMaxPrice, minPrice, maxPrice])

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) {
      params.set('search', searchTerm)
    } else {
      params.delete('search')
    }
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  // Handle price range apply
  const applyPriceRange = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('minPrice', priceRange.min.toString())
    params.set('maxPrice', priceRange.max.toString())
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  // Handle category selection
  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  // Clear all filters
  const clearFilters = () => {
    router.push('/products')
    setSearchTerm('')
    setPriceRange({ min: minPrice, max: maxPrice })
  }

  // Check if any filters are active
  const hasActiveFilters = 
    searchParams.has('search') ||
    searchParams.has('category') ||
    searchParams.has('minPrice') ||
    searchParams.has('maxPrice') ||
    searchParams.has('sort')

  // Get active filter count
  const activeFilterCount = [
    searchParams.has('search'),
    searchParams.has('category'),
    searchParams.has('minPrice') || searchParams.has('maxPrice'),
    searchParams.has('sort')
  ].filter(Boolean).length

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-2xl shadow-2xl glow-button"
      >
        🔍
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-b from-purple-900 to-blue-900 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            <FiltersContent 
              categories={categories}
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
              applyPriceRange={applyPriceRange}
              handleCategoryClick={handleCategoryClick}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              selectedCategory={selectedCategory}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block sticky top-24">
        <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-purple-300 hover:text-purple-200"
              >
                Clear All
              </button>
            )}
          </div>

          <FiltersContent 
            categories={categories}
            minPrice={minPrice}
            maxPrice={maxPrice}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            applyPriceRange={applyPriceRange}
            handleCategoryClick={handleCategoryClick}
            clearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            selectedCategory={selectedCategory}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
        </div>
      </div>
    </>
  )
}

// Separate component for filter content to avoid duplication
function FiltersContent({
  categories,
  minPrice,
  maxPrice,
  priceRange,
  setPriceRange,
  searchTerm,
  setSearchTerm,
  handleSearch,
  applyPriceRange,
  handleCategoryClick,
  clearFilters,
  hasActiveFilters,
  selectedCategory,
  isExpanded,
  setIsExpanded
}: any) {
  return (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h4 className="text-white font-bold mb-3">Search</h4>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center hover:bg-purple-500/30"
          >
            🔍
          </button>
        </form>
      </div>

      {/* Categories */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-white font-bold">Categories</h4>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/50 text-sm hover:text-white"
          >
            {isExpanded ? 'Show Less' : 'Show All'}
          </button>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              !selectedCategory
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-l-4 border-purple-500'
                : 'text-white/70 hover:bg-white/5'
            }`}
          >
            All Categories
          </button>
          
          {(isExpanded ? categories : categories.slice(0, 5)).map((category: any) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                selectedCategory === category.slug
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-l-4 border-purple-500'
                  : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <span>{category.name}</span>
              {category._count?.products > 0 && (
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                  {category._count.products}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-white font-bold mb-3">Price Range</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-white/50 text-sm block mb-1">Min</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || minPrice })}
                min={minPrice}
                max={maxPrice}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              />
            </div>
            <div className="text-white/50">-</div>
            <div className="flex-1">
              <label className="text-white/50 text-sm block mb-1">Max</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || maxPrice })}
                min={minPrice}
                max={maxPrice}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
              />
            </div>
          </div>

          {/* Range Slider */}
          <div className="relative h-2 bg-white/10 rounded-full">
            <div
              className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{
                left: `${((priceRange.min - minPrice) / (maxPrice - minPrice)) * 100}%`,
                right: `${100 - ((priceRange.max - minPrice) / (maxPrice - minPrice)) * 100}%`
              }}
            />
          </div>

          <button
            onClick={applyPriceRange}
            className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white glow-button"
          >
            Apply Price Range
          </button>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-white font-bold mb-3">Availability</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-white/70">
            <input type="checkbox" className="w-4 h-4 accent-purple-500" />
            In Stock
          </label>
          <label className="flex items-center gap-3 text-white/70">
            <input type="checkbox" className="w-4 h-4 accent-purple-500" />
            Out of Stock
          </label>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-white font-bold mb-3">Customer Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-3 text-white/70">
              <input type="checkbox" className="w-4 h-4 accent-purple-500" />
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < rating ? 'text-yellow-300' : 'text-white/20'}>★</span>
                ))}
                <span className="ml-1">& Up</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters Button (Mobile) */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full lg:hidden px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}