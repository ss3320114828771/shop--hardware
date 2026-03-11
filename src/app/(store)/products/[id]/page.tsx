import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'

// Import the button dynamically to avoid potential issues
import AddToCartButton from '@/components/products/AddTocartButton'

// Helper to convert Decimal to number
const toNum = (val: any): number => {
  if (val === null || val === undefined) return 0
  if (typeof val === 'number') return val
  if (typeof val === 'string') {
    const parsed = parseFloat(val)
    return isNaN(parsed) ? 0 : parsed
  }
  if (val?.toNumber) return val.toNumber()
  return 0
}

// Helper to safely convert any value to string
const toStr = (val: any): string => {
  if (val === null || val === undefined) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number') return val.toString()
  if (typeof val === 'boolean') return val.toString()
  try {
    return String(val)
  } catch {
    return ''
  }
}

// Helper to safely process images
const getSafeImages = (images: any): string[] => {
  const result: string[] = []
  
  if (images == null) return result
  
  if (typeof images === 'string') {
    if (images) result.push(images)
    return result
  }
  
  if (Array.isArray(images)) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      if (img != null) {
        const imgStr = toStr(img)
        if (imgStr) result.push(imgStr)
      }
    }
    return result
  }
  
  // Try to convert other types
  try {
    const str = String(images)
    if (str) result.push(str)
  } catch {
    // Ignore conversion errors
  }
  
  return result
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { 
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    if (!product) {
      notFound()
      return null
    }

    // FIXED: Safe images processing without using .map()
    const safeImages = getSafeImages(product.images)
    
    // Format product for the component - convert all Decimal values
    const formattedProduct = {
      id: toStr(product.id),
      name: toStr(product.name),
      description: toStr(product.description),
      price: toNum(product.price),
      images: safeImages,
      category: {
        id: toStr(product.category?.id),
        name: toStr(product.category?.name),
        slug: toStr(product.category?.slug)
      },
      stock: toNum(product.stock),
      featured: product.featured === true,
      specifications: product.specifications || null,
      categoryId: toStr(product.categoryId),
      sku: toStr(product.sku),
      brand: toStr(product.brand),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }

    // Get the first image or placeholder
    const mainImage = formattedProduct.images.length > 0 
      ? formattedProduct.images[0] 
      : '/images/placeholder.jpg'

    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden bg-white/5">
            <Image
              src={mainImage}
              alt={formattedProduct.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-purple-300 mb-2">
                {formattedProduct.category.name || 'Uncategorized'}
              </p>
              <h1 className="text-4xl font-bold text-white mb-4">
                {formattedProduct.name}
              </h1>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
                ${formattedProduct.price.toFixed(2)}
              </p>
            </div>

            <p className="text-white/70 text-lg leading-relaxed">
              {formattedProduct.description || 'No description available.'}
            </p>

            <div className="flex items-center gap-4">
              <span className="text-white/70">
                Stock: {formattedProduct.stock}
              </span>
              {formattedProduct.stock > 0 ? (
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                  ✓ In Stock
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                  ✗ Out of Stock
                </span>
              )}
            </div>

            {/* Pass the formatted product with proper types */}
            <AddToCartButton product={formattedProduct} />

            {/* Specifications */}
            {formattedProduct.specifications && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-white mb-4">Specifications</h3>
                <div className="text-white/70 bg-white/5 p-4 rounded-xl overflow-auto">
                  <pre className="text-sm">
                    {typeof formattedProduct.specifications === 'object'
                      ? JSON.stringify(formattedProduct.specifications, null, 2)
                      : String(formattedProduct.specifications)}
                  </pre>
                </div>
              </div>
            )}

            {/* Additional product info */}
            {formattedProduct.brand && (
              <p className="text-white/50 text-sm">
                Brand: {formattedProduct.brand}
              </p>
            )}
            
            {formattedProduct.sku && (
              <p className="text-white/50 text-xs">
                SKU: {formattedProduct.sku}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading product:', error)
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl text-red-400 mb-4">Error Loading Product</h1>
        <p className="text-white/50">Please try again later</p>
      </div>
    )
  }
}