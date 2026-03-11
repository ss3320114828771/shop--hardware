import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

// GET cart
export async function GET(req: NextRequest) {
  try {
    const user: any = await getUser(req)
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const cart = await prisma.cart.findUnique({
      where: { userId: String(user.id) },
      include: { items: { include: { product: true } } }
    })

    return NextResponse.json(cart || { items: [] })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

// POST to cart
export async function POST(req: NextRequest) {
  try {
    const user: any = await getUser(req)
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { productId, quantity = 1 } = body
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const userId = String(user.id)
    
    // Get or create cart
    let cart = await prisma.cart.findUnique({ where: { userId } })
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } })
    }

    // Check existing item
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    })

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      })
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity }
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}