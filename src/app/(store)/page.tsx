import { prisma } from '@/lib/prisma'
import Link from 'next/link'

// Simple number converter
const toNum = (v: any): number => {
  if (!v) return 0
  if (typeof v === 'number') return v
  if (typeof v === 'string') return parseFloat(v) || 0
  if (v?.toNumber) return v.toNumber()
  return 0
}

// Simple product card (inline to avoid imports)
function SimpleProduct({ p }: any) {
  return (
    <Link href={`/products/${p.id}`} className="block bg-white/10 p-3 rounded-lg hover:bg-white/20">
      <div className="h-32 bg-white/20 rounded mb-2"></div>
      <h3 className="text-white font-bold">{p.name || 'Product'}</h3>
      <p className="text-green-300 font-bold">${toNum(p.price).toFixed(2)}</p>
    </Link>
  )
}

export default async function StorePage() {
  try {
    // Get data
    const [products, cats] = await Promise.all([
      prisma.product.findMany({ 
        where: { featured: true }, 
        take: 8,
        include: { category: true } 
      }),
      prisma.category.findMany({ take: 4 })
    ])

    return (
      <div className="p-4 max-w-6xl mx-auto space-y-8">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Hafiz Sajid Hardware</h1>
          <p className="text-white/70 mb-4">Your Trusted Hardware Partner Since 1995</p>
          <Link href="/products" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg">
            Shop Now
          </Link>
        </div>

        {/* Categories */}
        {cats.length > 0 && (
          <div>
            <h2 className="text-2xl text-white mb-3">Categories</h2>
            <div className="grid grid-cols-2 gap-2">
              {cats.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  className="p-4 bg-white/10 rounded-lg text-center"
                >
                  <span className="text-white font-bold">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Featured Products */}
        {products.length > 0 && (
          <div>
            <h2 className="text-2xl text-white mb-3">Featured Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {products.map((p: any) => (
                <SimpleProduct key={p.id} p={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  } catch (error) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl text-white">Hafiz Sajid Hardware</h1>
        <p className="text-white/50 mt-2">Welcome to our store</p>
        <Link href="/products" className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg">
          Browse Products
        </Link>
      </div>
    )
  }
}