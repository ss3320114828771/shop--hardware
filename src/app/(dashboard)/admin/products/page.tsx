import { prisma } from '@/lib/prisma'
import Link from 'next/link'

// Define type for product with relations
type ProductWithCategory = {
  id: string
  name: string
  description: string
  price: any // Decimal from Prisma
  categoryId: string
  category: {
    id: string
    name: string
    slug: string
  }
  images: string[]
  stock: number
  featured: boolean
  sku: string | null
  brand: string | null
  createdAt: Date
  updatedAt: Date
}

export default async function AdminProductsPage() {
  try {
    const products = await prisma.product.findMany({
      include: { 
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }) as ProductWithCategory[]

    // Helper function to safely convert Decimal to number
    const toNumber = (value: any): number => {
      if (value === null || value === undefined) return 0
      if (typeof value === 'number') return value
      if (typeof value === 'string') return parseFloat(value)
      if (value && typeof value === 'object') {
        // Handle Prisma Decimal
        if ('toNumber' in value && typeof value.toNumber === 'function') {
          return value.toNumber()
        }
        // Handle other objects with valueOf
        if ('valueOf' in value && typeof value.valueOf === 'function') {
          const num = value.valueOf()
          return typeof num === 'number' ? num : 0
        }
      }
      return 0
    }

    // Helper function to format price
    const formatPrice = (price: any): string => {
      const num = toNumber(price)
      return num.toFixed(2)
    }

    // Handle delete action (client component needed for actual delete)
    const handleDelete = async (productId: string) => {
      'use server'
      try {
        await prisma.product.delete({
          where: { id: productId }
        })
        // Revalidate the page
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }

    return (
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Products Management
            </h1>
            <p className="text-white/50 mt-2">
              Total Products: <span className="text-white font-bold">{products.length}</span>
            </p>
          </div>
          <Link
            href="/dashboard/admin/products/new"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white glow-button inline-flex items-center gap-2"
          >
            <span>➕</span> Add New Product
          </Link>
        </div>

        {/* Products Table */}
        {products.length === 0 ? (
          <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-16 text-center">
            <div className="text-7xl mb-4 animate-bounce">📦</div>
            <h3 className="text-2xl text-white mb-2">No products found</h3>
            <p className="text-white/50 mb-6">Get started by adding your first product</p>
            <Link
              href="/dashboard/admin/products/new"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl inline-flex items-center gap-2 glow-button"
            >
              <span>➕</span> Add Product
            </Link>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left p-4 text-white/50 font-medium text-sm">PRODUCT</th>
                    <th className="text-left p-4 text-white/50 font-medium text-sm">CATEGORY</th>
                    <th className="text-left p-4 text-white/50 font-medium text-sm">PRICE</th>
                    <th className="text-left p-4 text-white/50 font-medium text-sm">STOCK</th>
                    <th className="text-left p-4 text-white/50 font-medium text-sm">STATUS</th>
                    <th className="text-left p-4 text-white/50 font-medium text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr 
                      key={product.id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Product Image Placeholder */}
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🛠️</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-white/30 text-xs">ID: {product.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-bold">
                          ${formatPrice(product.price)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock > 10 
                            ? 'bg-green-500/20 text-green-300'
                            : product.stock > 0
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.featured 
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          {product.featured ? '✨ Featured' : 'Regular'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/admin/products/${product.id}`}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this product?')) {
                                await handleDelete(product.id)
                                window.location.reload()
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm"
                          >
                            Delete
                          </button>
                          <Link
                            href={`/products/${product.id}`}
                            target="_blank"
                            className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors text-sm"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5 flex justify-between items-center text-sm">
              <p className="text-white/50">
                Showing <span className="text-white font-bold">{products.length}</span> of{' '}
                <span className="text-white font-bold">{products.length}</span> products
              </p>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 rounded bg-white/10 text-white/50 cursor-not-allowed opacity-50" 
                  disabled
                >
                  Previous
                </button>
                <button 
                  className="px-3 py-1 rounded bg-white/10 text-white/50 cursor-not-allowed opacity-50" 
                  disabled
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
            <p className="text-white/50 text-sm">Total Products</p>
            <p className="text-2xl font-bold text-white">{products.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-500/20">
            <p className="text-white/50 text-sm">In Stock</p>
            <p className="text-2xl font-bold text-green-300">
              {products.filter(p => p.stock > 0).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
            <p className="text-white/50 text-sm">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-300">
              {products.filter(p => p.stock > 0 && p.stock <= 5).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-xl p-4 border border-red-500/20">
            <p className="text-white/50 text-sm">Out of Stock</p>
            <p className="text-2xl font-bold text-red-300">
              {products.filter(p => p.stock === 0).length}
            </p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading products:', error)
    return (
      <div className="space-y-8 p-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
          Products Management
        </h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-12 text-center">
          <div className="text-7xl mb-4">❌</div>
          <p className="text-red-300 text-xl mb-4">Failed to load products</p>
          <p className="text-white/50 mb-6">Please try again or contact support</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
}