import { prisma } from '@/lib/prisma'
import Link from 'next/link'

// SUPER SIMPLE number converter
const toNum = (val: any): number => {
  if (!val) return 0
  if (typeof val === 'number') return val
  if (typeof val === 'string') return parseFloat(val) || 0
  if (val?.toNumber) return val.toNumber()
  return 0
}

export default async function AdminDashboardPage() {
  try {
    // Get all data
    const products = await prisma.product.count()
    const orders = await prisma.order.count()
    const users = await prisma.user.count()
    
    const revenueData = await prisma.order.aggregate({
      _sum: { total: true }
    })
    
    const recentOrdersData = await prisma.order.findMany({
      take: 5,
      include: { 
        user: { 
          select: { 
            name: true, 
            email: true 
          } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get status counts
    const pending = await prisma.order.count({ 
      where: { status: 'PENDING' } 
    })
    
    const processing = await prisma.order.count({ 
      where: { status: 'PROCESSING' } 
    })
    
    const delivered = await prisma.order.count({ 
      where: { status: 'DELIVERED' } 
    })

    // Format data
    const totalRevenue = revenueData._sum.total ? toNum(revenueData._sum.total) : 0
    
    // SAFELY map orders with proper null checks
    const recentOrders = []
    for (let i = 0; i < recentOrdersData.length; i++) {
      const o = recentOrdersData[i]
      recentOrders.push({
        id: o.id,
        status: o.status,
        total: toNum(o.total),
        createdAt: o.createdAt,
        user: {
          // FIXED: Safe user object access
          name: o.user && o.user.name ? String(o.user.name) : 'Unknown',
          email: o.user && o.user.email ? String(o.user.email) : 'No email'
        }
      })
    }

    return (
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <Link 
            href="/dashboard/admin/products/new" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Add Product
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white/10 rounded-lg">
            <div className="text-2xl mb-2">📦</div>
            <p className="text-white/70 text-sm">Products</p>
            <p className="text-2xl text-white font-bold">{products}</p>
          </div>
          
          <div className="p-4 bg-white/10 rounded-lg">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-white/70 text-sm">Orders</p>
            <p className="text-2xl text-white font-bold">{orders}</p>
          </div>
          
          <div className="p-4 bg-white/10 rounded-lg">
            <div className="text-2xl mb-2">👥</div>
            <p className="text-white/70 text-sm">Users</p>
            <p className="text-2xl text-white font-bold">{users}</p>
          </div>
          
          <div className="p-4 bg-white/10 rounded-lg">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-white/70 text-sm">Revenue</p>
            <p className="text-2xl text-white font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-yellow-900/30 p-3 rounded-lg text-center">
            <p className="text-white/70 text-sm">Pending</p>
            <p className="text-xl text-white font-bold">{pending}</p>
          </div>
          
          <div className="bg-blue-900/30 p-3 rounded-lg text-center">
            <p className="text-white/70 text-sm">Processing</p>
            <p className="text-xl text-white font-bold">{processing}</p>
          </div>
          
          <div className="bg-green-900/30 p-3 rounded-lg text-center">
            <p className="text-white/70 text-sm">Delivered</p>
            <p className="text-xl text-white font-bold">{delivered}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/dashboard/admin/products" 
            className="p-3 bg-white/5 rounded-lg text-center hover:bg-white/10"
          >
            <div className="text-2xl mb-1">📦</div>
            <p className="text-white text-sm">Products</p>
          </Link>
          
          <Link 
            href="/dashboard/admin/orders" 
            className="p-3 bg-white/5 rounded-lg text-center hover:bg-white/10"
          >
            <div className="text-2xl mb-1">📋</div>
            <p className="text-white text-sm">Orders</p>
          </Link>
          
          <Link 
            href="/dashboard/admin/users" 
            className="p-3 bg-white/5 rounded-lg text-center hover:bg-white/10"
          >
            <div className="text-2xl mb-1">👥</div>
            <p className="text-white text-sm">Users</p>
          </Link>
          
          <Link 
            href="/dashboard/admin/categories" 
            className="p-3 bg-white/5 rounded-lg text-center hover:bg-white/10"
          >
            <div className="text-2xl mb-1">🏷️</div>
            <p className="text-white text-sm">Categories</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white/10 p-4 rounded-lg">
          <h2 className="text-xl text-white mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-white/50">No orders</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((o, index) => {
                // FIXED: Simple status class logic
                let statusBg = ''
                let statusText = ''
                
                if (o.status === 'PENDING') {
                  statusBg = 'bg-yellow-500/20'
                  statusText = 'text-yellow-300'
                } else if (o.status === 'PROCESSING') {
                  statusBg = 'bg-blue-500/20'
                  statusText = 'text-blue-300'
                } else if (o.status === 'DELIVERED') {
                  statusBg = 'bg-green-500/20'
                  statusText = 'text-green-300'
                } else {
                  statusBg = 'bg-red-500/20'
                  statusText = 'text-red-300'
                }
                
                return (
                  <div key={o.id || index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                    <div>
                      <p className="text-white">{o.user.name}</p>
                      <p className="text-white/50 text-sm">{o.user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${o.total.toFixed(2)}</p>
                      <p className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${statusBg} ${statusText}`}>
                        {o.status}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Admin Info */}
        <div className="bg-purple-900/30 p-4 rounded-lg">
          <p className="text-white text-lg">👤 Hafiz Sajid Syed</p>
          <p className="text-purple-300">Administrator</p>
          <p className="text-white/50 text-sm">sajidsyed@gmail.com</p>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="p-4">
        <h1 className="text-3xl text-white mb-4">Admin Dashboard</h1>
        <div className="bg-red-900/30 p-4 rounded-lg">
          <p className="text-red-300">Failed to load dashboard</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
}