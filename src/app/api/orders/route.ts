import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

// SUPER SIMPLE number converter
const toNum = (val: any): number => {
  if (val === null || val === undefined) return 0
  if (typeof val === 'number') return val
  if (typeof val === 'string') return parseFloat(val) || 0
  if (val?.toNumber) return val.toNumber()
  return 0
}

// Helper to safely process images
const getImages = (images: any): string[] => {
  if (!images) return []
  if (typeof images === 'string') return [images]
  if (Array.isArray(images)) {
    const result: string[] = []
    for (let i = 0; i < images.length; i++) {
      const img = images[i]
      if (img) result.push(String(img))
    }
    return result
  }
  return []
}

// GET user orders
export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user && typeof user === 'object' && 'id' in user 
      ? String(user.id) 
      : null
      
    if (!userId) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { 
        items: { 
          include: { 
            product: true
          } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    })

    // Safe array handling
    const result = []
    for (let i = 0; i < orders.length; i++) {
      const o = orders[i]
      
      const items = []
      for (let j = 0; j < o.items.length; j++) {
        const item = o.items[j]
        
        // Safe product object
        let product = null
        if (item.product) {
          product = {
            id: String(item.product.id),
            name: String(item.product.name || ''),
            price: toNum(item.product.price),
            images: getImages(item.product.images)
          }
        }
        
        items.push({
          id: String(item.id),
          quantity: Number(item.quantity),
          price: toNum(item.price),
          productId: String(item.productId),
          orderId: String(item.orderId),
          product: product
        })
      }
      
      result.push({
        id: String(o.id),
        userId: String(o.userId),
        status: String(o.status),
        paymentStatus: String(o.paymentStatus || ''),
        total: toNum(o.total),
        shippingAddress: o.shippingAddress || {},
        phone: String(o.phone || ''),
        email: String(o.email || ''),
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        items: items
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.log('GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST create order
export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user && typeof user === 'object' && 'id' in user ? String(user.id) : null
    const userEmail = user && typeof user === 'object' && 'email' in user ? String(user.email) : null
    
    if (!userId || !userEmail) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { items, total, address, phone } = body

    if (!items?.length) return NextResponse.json({ error: 'Items required' }, { status: 400 })
    if (typeof total !== 'number') return NextResponse.json({ error: 'Total required' }, { status: 400 })
    if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 })
    if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 })

    // FIXED: Create order with transaction - using prisma directly
    const order = await prisma.$transaction(async (tx: any) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          shippingAddress: address,
          phone,
          email: userEmail,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          items: {
            create: items.map((item: any) => ({
              productId: String(item.id),
              quantity: Number(item.quantity),
              price: Number(item.price)
            }))
          }
        },
        include: { items: { include: { product: true } } }
      })

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        await tx.product.update({
          where: { id: String(item.id) },
          data: { stock: { decrement: Number(item.quantity) } }
        })
      }

      await tx.cart.deleteMany({ where: { userId } })

      return newOrder
    })

    // Safe response formatting
    const responseItems = []
    for (let i = 0; i < order.items.length; i++) {
      const item = order.items[i]
      
      let product = null
      if (item.product) {
        product = {
          id: String(item.product.id),
          name: String(item.product.name || ''),
          price: toNum(item.product.price),
          images: getImages(item.product.images)
        }
      }
      
      responseItems.push({
        id: String(item.id),
        quantity: Number(item.quantity),
        price: toNum(item.price),
        productId: String(item.productId),
        orderId: String(item.orderId),
        product: product
      })
    }

    const result = {
      id: String(order.id),
      userId: String(order.userId),
      status: String(order.status),
      paymentStatus: String(order.paymentStatus || ''),
      total: toNum(order.total),
      shippingAddress: order.shippingAddress || {},
      phone: String(order.phone || ''),
      email: String(order.email || ''),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: responseItems
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.log('POST error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

// PATCH update order status (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUser(req)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = user && typeof user === 'object' && 'role' in user ? user.role : null
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const id = req.nextUrl.pathname.split('/').pop()
    if (!id || id === 'orders') {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const body = await req.json().catch(() => null)
    if (!body?.status) {
      return NextResponse.json({ error: 'Status required' }, { status: 400 })
    }

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const existingOrder = await prisma.order.findUnique({ where: { id } })
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status: body.status },
      select: { id: true, status: true, updatedAt: true }
    })

    return NextResponse.json({ 
      success: true, 
      id: String(updated.id),
      status: String(updated.status),
      updatedAt: updated.updatedAt
    })
  } catch (error) {
    console.log('PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

// DELETE cancel order
export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser(req)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user && typeof user === 'object' && 'id' in user ? String(user.id) : null
    
    if (!userId) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 })
    }

    const id = req.nextUrl.pathname.split('/').pop()
    if (!id || id === 'orders') {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const userRole = user && typeof user === 'object' && 'role' in user ? user.role : null
    const isAdmin = userRole === 'ADMIN'

    if (order.userId !== userId && !isAdmin) {
      return NextResponse.json({ error: 'You can only cancel your own orders' }, { status: 403 })
    }

    if (order.status !== 'PENDING' && !isAdmin) {
      return NextResponse.json({ error: 'Only pending orders can be cancelled' }, { status: 400 })
    }

    const cancelled = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      select: { id: true, status: true, updatedAt: true }
    })

    return NextResponse.json({ 
      success: true, 
      id: String(cancelled.id),
      status: String(cancelled.status),
      updatedAt: cancelled.updatedAt
    })
  } catch (error) {
    console.log('DELETE error:', error)
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 })
  }
}