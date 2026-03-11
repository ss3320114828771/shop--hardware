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

// Simple product card component (inline to avoid imports)
function SimpleProductCard({ p }: any) {
  return (
    <Link href={`/products/${p.id}`} className="block bg-white/5 p-3 rounded-lg hover:bg-white/10">
      <div className="h-32 bg-white/10 rounded mb-2"></div>
      <h3 className="text-white font-bold">{p.name}</h3>
      <p className="text-green-300">${toNum(p.price).toFixed(2)}</p>
    </Link>
  )
}

export default async function ProductsPage({ searchParams }: any) {
  try {
    // Pagination
    const page = Number(searchParams?.page) || 1
    const limit = 12
    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}
    if (searchParams?.category) filter.category = { slug: searchParams.category }
    if (searchParams?.search) {
      filter.OR = [
        { name: { contains: searchParams.search, mode: 'insensitive' } },
        { description: { contains: searchParams.search, mode: 'insensitive' } }
      ]
    }
    
    // Price filter
    if (searchParams?.minPrice || searchParams?.maxPrice) {
      filter.price = {}
      if (searchParams?.minPrice) filter.price.gte = Number(searchParams.minPrice)
      if (searchParams?.maxPrice) filter.price.lte = Number(searchParams.maxPrice)
    }

    // Sorting
    let sort: any = { createdAt: 'desc' }
    if (searchParams?.sort === 'price_asc') sort = { price: 'asc' }
    if (searchParams?.sort === 'price_desc') sort = { price: 'desc' }

    // Get data
    const [products, total, categories] = await Promise.all([
      prisma.product.findMany({ where: filter, include: { category: true }, orderBy: sort, skip, take: limit }),
      prisma.product.count({ where: filter }),
      prisma.category.findMany()
    ])

    const totalPages = Math.ceil(total / limit)

    return (
      <div className="p-4 max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl text-center mb-4 text-white">
          {searchParams?.category ? `Category: ${searchParams.category}` : 'All Products'}
        </h1>

        {/* Simple filters */}
        <div className="mb-4 flex gap-2 flex-wrap">
          <Link href="/products" className="px-3 py-1 bg-white/10 rounded text-white text-sm">All</Link>
          {categories.slice(0, 5).map((c: any) => (
            <Link 
              key={c.id} 
              href={`/products?category=${c.slug}`}
              className="px-3 py-1 bg-white/10 rounded text-white text-sm"
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Results count */}
        <div className="mb-4 text-white/70 text-sm">{total} products found</div>

        {/* Products grid */}
        {products.length === 0 ? (
          <div className="text-center py-10 text-white/50">No products found</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((p: any) => (
                <SimpleProductCard key={p.id} p={p} />
              ))}
            </div>

            {/* Simple pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <PageButton page={page - 1} disabled={page === 1} label="←" />
                <span className="px-3 py-1 text-white">{page} / {totalPages}</span>
                <PageButton page={page + 1} disabled={page === totalPages} label="→" />
              </div>
            )}
          </>
        )}
      </div>
    )
  } catch (error) {
    return <div className="p-4 text-center text-red-400">Failed to load products</div>
  }
}

// Simple page button
function PageButton({ page, disabled, label }: any) {
  return (
    <button
      onClick={() => {
        const url = new URL(window.location.href)
        url.searchParams.set('page', page)
        window.location.href = url.toString()
      }}
      disabled={disabled}
      className="px-3 py-1 bg-white/10 rounded text-white disabled:opacity-30"
    >
      {label}
    </button>
  )
}