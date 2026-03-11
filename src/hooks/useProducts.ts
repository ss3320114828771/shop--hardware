import { useState, useEffect } from 'react'

export function useProducts(category?: string, search?: string) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams()
        if (category) params.append('category', category)
        if (search) params.append('search', search)

        const res = await fetch(`/api/products?${params}`)
        if (!res.ok) throw new Error('Failed to fetch')
        
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, search])

  return { products, loading, error }
}