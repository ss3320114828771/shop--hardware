import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/products/ProductCard'
import HeroImages from '@/components/HeroImages'  // ← Import client component

// Helper to convert Decimal to number
const toNum = (val: any): number => {
  if (!val) return 0
  if (typeof val === 'number') return val
  if (typeof val === 'string') return parseFloat(val) || 0
  if (val?.toNumber) return val.toNumber()
  return 0
}

// Helper to safely get images
const getImages = (images: any): string[] => {
  if (!images) return []
  if (typeof images === 'string') return [images]
  if (Array.isArray(images)) {
    const result: string[] = []
    for (let i = 0; i < images.length; i++) {
      if (images[i]) result.push(String(images[i]))
    }
    return result
  }
  return []
}

export default async function HomePage() {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: { featured: true },
      take: 8,
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
    })

    // Format products
    const formattedProducts = []
    for (let i = 0; i < featuredProducts.length; i++) {
      const p = featuredProducts[i]
      formattedProducts.push({
        id: String(p.id),
        name: String(p.name || ''),
        description: String(p.description || ''),
        price: toNum(p.price),
        images: getImages(p.images),
        categoryId: String(p.categoryId || ''),
        category: {
          id: String(p.category?.id || ''),
          name: String(p.category?.name || ''),
          slug: String(p.category?.slug || '')
        },
        stock: toNum(p.stock),
        featured: p.featured === true
      })
    }

    // Hero images array
    const heroImages = [
      { id: 1, src: '/n1.jpeg', alt: 'Hardware Tools' },
      { id: 2, src: '/n2.jpeg', alt: 'Construction Materials' },
      { id: 3, src: '/n3.jpeg', alt: 'Safety Equipment' },
      { id: 4, src: '/n4.jpeg', alt: 'Power Tools' },
      { id: 5, src: '/n5.jpeg', alt: 'Hand Tools' },
      { id: 6, src: '/n6.jpeg', alt: 'Hardware Store' }
    ]

    // Safety data
    const safetyItems = [
      {
        icon: '🛡️',
        title: 'Safety First',
        desc: 'All products meet international safety standards'
      },
      {
        icon: '💪',
        title: 'Quality Materials',
        desc: 'Highest quality, non-toxic materials only'
      },
      {
        icon: '🌱',
        title: 'Eco-Friendly',
        desc: 'Sustainable products and practices'
      }
    ]

    return (
      <div className="min-h-screen">
        {/* Hero Section with Images */}
        <section className="relative h-[80vh] overflow-hidden">
          {/* Client Component for images with error handling */}
          <HeroImages images={heroImages} />
          
          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              {/* Bismillah */}
              <h1 className="text-4xl md:text-6xl font-arabic text-yellow-300 mb-4">
                ﷽
              </h1>
              
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-pink-300 to-green-300 bg-clip-text text-transparent animate-glow">
                Hafiz Sajid
              </h2>
              
              <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8">
                Your Trusted Hardware Partner Since 1995
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href="/products" 
                  className="px-8 py-4 text-lg md:text-xl rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 transition-transform shadow-lg"
                >
                  🛒 Shop Now
                </Link>
                <Link 
                  href="/about" 
                  className="px-8 py-4 text-lg md:text-xl rounded-full bg-gradient-to-r from-blue-600 to-green-600 text-white hover:scale-105 transition-transform shadow-lg"
                >
                  📚 Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Featured Products
            </h2>
            
            {formattedProducts.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-2xl">
                <p className="text-white/70">No featured products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {formattedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Health & Safety Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-center mb-12 text-yellow-300">
              Importance of Health & Safety
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {safetyItems.map((item, index) => (
                <div key={index} className="p-6 bg-white/10 rounded-2xl backdrop-blur hover:scale-105 transition-transform">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Admin Info */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl border border-white/10">
              {/* Admin Image Placeholder */}
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-4xl">
                👤
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-2">
                Hafiz Sajid Syed
              </h3>
              <p className="text-purple-300 text-xl mb-4">Founder & Administrator</p>
              <p className="text-white/70 mb-2">📧 sajidsyed@gmail.com</p>
              <p className="text-white/70">📞 +92 300 1234567</p>
            </div>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error:', error)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl text-white mb-4">Hafiz Sajid Hardware</h1>
          <p className="text-white/70 mb-8">Welcome to our store</p>
          <Link 
            href="/products" 
            className="px-6 py-3 bg-purple-600 text-white rounded-lg"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }
}