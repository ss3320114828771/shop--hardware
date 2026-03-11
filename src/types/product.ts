export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  category: Category
  images: string[]
  stock: number
  sku: string
  brand?: string
  specifications?: any
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  products?: Product[]
}