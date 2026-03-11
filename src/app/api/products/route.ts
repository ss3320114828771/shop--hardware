import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const products = await prisma.product.findMany({
      where: {
        ...(category && {
          category: {
            name: {
              equals: category,
              mode: 'insensitive'
            }
          }
        }),
        ...(search && {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        })
      },
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}