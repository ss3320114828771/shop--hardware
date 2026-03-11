import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'

// Helper to convert any value to number safely
const toNum = (val: any): number => {
  if (val === null || val === undefined) return 0
  if (typeof val === 'number') return val
  if (typeof val === 'string') {
    const parsed = parseFloat(val)
    return isNaN(parsed) ? 0 : parsed
  }
  if (val && typeof val === 'object') {
    if (typeof val.toNumber === 'function') {
      try {
        return val.toNumber()
      } catch {
        return 0
      }
    }
  }
  return 0
}

// Helper to safely convert any value to string
const toStr = (val: any): string => {
  if (val === null || val === undefined) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number') return val.toString()
  if (typeof val === 'boolean') return val.toString()
  if (val && typeof val === 'object') {
    try {
      return String(val)
    } catch {
      return ''
    }
  }
  return ''
}

// Helper to safely handle images
const getSafeImages = (images: any): string[] => {
  // Return empty array for null/undefined
  if (images == null) return []
  
  // Handle string
  if (typeof images === 'string') {
    return images ? [images] : []
  }
  
  // Handle array
  if (Array.isArray(images)) {
    return images
      .filter(img => img != null) // Remove null/undefined
      .map(img => toStr(img))
      .filter(url => url !== '') // Remove empty strings
  }
  
  // Handle object that might be convertible
  try {
    const str = String(images)
    return str ? [str] : []
  } catch {
    return []
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: params.slug },
      include: { 
        products: {
          include: {
            category: true
          }
        } 
      }
    })

    if (!category) {
      notFound()
      return null
    }

    // Format products safely with ALL fields handled
    const formattedProducts = []
    
    for (let i = 0; i < category.products.length; i++) {
      const product = category.products[i]
      
      // Safe primitive values
      const safeId = toStr(product.id)
      const safeName = toStr(product.name)
      const safeDescription = toStr(product.description)
      const safePrice = toNum(product.price)
      const safeStock = toNum(product.stock)
      const safeFeatured = product.featured === true
      
      // Safe images
      const safeImages = getSafeImages(product.images)
      
      // Safe category object
      const safeCategory = {
        id: toStr(product.category?.id),
        name: toStr(product.category?.name),
        slug: toStr(product.category?.slug)
      }
      
      // Only add product if it has required fields
      if (safeId && safeName) {
        formattedProducts.push({
          id: safeId,
          name: safeName,
          description: safeDescription,
          price: safePrice,
          images: safeImages,
          category: safeCategory,
          stock: safeStock,
          featured: safeFeatured,
        })
      }
    }

    // Safe category display values
    const categoryName = toStr(category.name) || 'Category'
    const categoryDescription = toStr(category.description)

    return (
      <div className="py-12 px-4">
        <h1 className="text-5xl text-center mb-4 bg-gradient-to-r from-yellow-300 via-pink-300 to-green-300 bg-clip-text text-transparent animate-glow">
          {categoryName}
        </h1>
        
        {categoryDescription && (
          <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
            {categoryDescription}
          </p>
        )}

        {formattedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl">
            <p className="text-white/50 text-xl">No products found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {formattedProducts.map((product, index) => (
              <ProductCard 
                key={product.id || `product-${index}`} 
                product={product} 
              />
            ))}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading category:', error)
    return (
      <div className="py-12 px-4 text-center">
        <h1 className="text-3xl text-red-400 mb-4">Error Loading Category</h1>
        <p className="text-white/50">Please try again later</p>
      </div>
    )
  }
}