import { prisma } from '@/lib/prisma'

// Define enums locally since they might not be exported from @prisma/client
enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

// Define types for order with relations
type OrderWithRelations = {
  id: string
  total: any // Decimal from Prisma
  status: OrderStatus
  paymentStatus: PaymentStatus | null
  createdAt: Date
  userId: string
  user: {
    id: string
    name: string | null
    email: string
  }
  items: Array<{
    id: string
    quantity: number
    price: any // Decimal from Prisma
    product: {
      id: string
      name: string
      price: any // Decimal from Prisma
    }
  }>
}

export default async function AdminOrdersPage() {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: { 
          include: { 
            product: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          } 
        }
      },
      orderBy: { createdAt: 'desc' }
    }) as OrderWithRelations[]

    // Helper function to safely convert Decimal to number
    const toNumber = (value: any): number => {
      if (value === null || value === undefined) return 0
      if (typeof value === 'number') return value
      if (typeof value === 'string') return parseFloat(value)
      if (value && typeof value === 'object') {
        // Handle Prisma Decimal
        if ('toNumber' in value && typeof value.toNumber === 'function') {
          return value.toNumber()
        }
        // Handle other objects with valueOf
        if ('valueOf' in value && typeof value.valueOf === 'function') {
          const num = value.valueOf()
          return typeof num === 'number' ? num : 0
        }
      }
      return 0
    }

    // Helper function to format total safely
    const formatTotal = (total: any): string => {
      const num = toNumber(total)
      return num.toFixed(2)
    }

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum: number, order) => {
      return sum + toNumber(order.total)
    }, 0)

    // Count orders by status
    const pendingCount = orders.filter(o => o.status === OrderStatus.PENDING).length
    const processingCount = orders.filter(o => o.status === OrderStatus.PROCESSING).length
    const deliveredCount = orders.filter(o => o.status === OrderStatus.DELIVERED).length
    const cancelledCount = orders.filter(o => o.status === OrderStatus.CANCELLED).length

    return (
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            Orders Management
          </h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2">
              <span>📥</span> Export
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <span>🔄</span> Refresh
            </button>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard 
            label="Total Orders" 
            value={orders.length} 
            color="purple"
            icon="📦"
          />
          <StatCard 
            label="Total Revenue" 
            value={`$${totalRevenue.toFixed(2)}`} 
            color="green"
            icon="💰"
          />
          <StatCard 
            label="Pending" 
            value={pendingCount} 
            color="yellow"
            icon="⏳"
          />
          <StatCard 
            label="Processing" 
            value={processingCount} 
            color="blue"
            icon="⚙️"
          />
          <StatCard 
            label="Delivered" 
            value={deliveredCount} 
            color="green"
            icon="✅"
          />
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <EmptyState />
        ) : (
          <OrdersTable 
            orders={orders} 
            formatTotal={formatTotal}
            orderStatusEnum={OrderStatus}
            paymentStatusEnum={PaymentStatus}
          />
        )}

        {/* Cancelled Orders Warning */}
        {cancelledCount > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-300 text-sm flex items-center gap-2">
              <span>⚠️</span>
              {cancelledCount} order{cancelledCount > 1 ? 's have' : ' has'} been cancelled. 
              Please review cancelled orders for potential issues.
            </p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading orders:', error)
    return <ErrorState />
  }
}

// Stat Card Component
function StatCard({ label, value, color, icon }: { 
  label: string; 
  value: string | number; 
  color: string;
  icon: string;
}) {
  const colorClasses: Record<string, string> = {
    purple: 'from-purple-500/10 to-pink-500/10 border-purple-500/20',
    green: 'from-green-500/10 to-blue-500/10 border-green-500/20',
    yellow: 'from-yellow-500/10 to-orange-500/10 border-yellow-500/20',
    blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20'
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color] || colorClasses.purple} rounded-xl p-4 border`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/50 text-xs mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}

// Empty State Component
function EmptyState() {
  return (
    <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-16 text-center">
      <div className="text-7xl mb-4 animate-bounce">📦</div>
      <h3 className="text-2xl text-white mb-2">No orders found</h3>
      <p className="text-white/50 mb-6">When customers place orders, they will appear here</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  )
}

// Error State Component
function ErrorState() {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
        Orders Management
      </h1>
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-12 text-center">
        <div className="text-7xl mb-4">❌</div>
        <p className="text-red-300 text-xl mb-4">Failed to load orders</p>
        <p className="text-white/50 mb-6">Please try again or contact support</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

// Orders Table Component
function OrdersTable({ orders, formatTotal, orderStatusEnum, paymentStatusEnum }: { 
  orders: OrderWithRelations[]; 
  formatTotal: (total: any) => string;
  orderStatusEnum: typeof OrderStatus;
  paymentStatusEnum: typeof PaymentStatus;
}) {
  // Helper function to get payment status styling
  const getPaymentStatusStyle = (status: PaymentStatus | null) => {
    if (status === paymentStatusEnum.PAID) {
      return 'bg-green-500/20 text-green-300 border border-green-500/20'
    }
    if (status === paymentStatusEnum.PENDING) {
      return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/20'
    }
    if (status === paymentStatusEnum.FAILED) {
      return 'bg-red-500/20 text-red-300 border border-red-500/20'
    }
    return 'bg-gray-500/20 text-gray-300 border border-gray-500/20'
  }

  // Helper function to get payment status text
  const getPaymentStatusText = (status: PaymentStatus | null): string => {
    if (!status) return paymentStatusEnum.PENDING
    return status
  }

  return (
    <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left p-4 text-white/50 font-medium text-sm">ORDER</th>
              <th className="text-left p-4 text-white/50 font-medium text-sm">CUSTOMER</th>
              <th className="text-left p-4 text-white/50 font-medium text-sm">ITEMS</th>
              <th className="text-left p-4 text-white/50 font-medium text-sm">TOTAL</th>
              <th className="text-left p-4 text-white/50 font-medium text-sm">STATUS</th>
              <th className="text-left p-4 text-white/50 font-medium text-sm">PAYMENT</th>
              <th className="text-left p-4 text-white/50 font-medium text-sm">DATE</th>
              <th className="text-left p-4 text-white/50 font-medium text-sm">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order.id} 
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4">
                  <span className="text-white font-mono text-sm bg-white/5 px-2 py-1 rounded">
                    #{order.id.slice(0, 8)}
                  </span>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-white font-medium">{order.user.name || 'N/A'}</p>
                    <p className="text-white/50 text-xs">{order.user.email}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-white/70 text-sm">
                    <span className="font-bold text-white">{order.items.length}</span> items
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-white font-bold text-lg">
                    ${formatTotal(order.total)}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    defaultValue={order.status}
                    className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-500"
                    onChange={async (e) => {
                      try {
                        const response = await fetch(`/api/orders/${order.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: e.target.value })
                        })
                        if (!response.ok) throw new Error('Failed to update')
                        window.location.reload()
                      } catch (error) {
                        console.error('Failed to update order status:', error)
                        alert('Failed to update order status')
                      }
                    }}
                  >
                    <option value={orderStatusEnum.PENDING} className="bg-gray-800">⏳ Pending</option>
                    <option value={orderStatusEnum.PROCESSING} className="bg-gray-800">⚙️ Processing</option>
                    <option value={orderStatusEnum.SHIPPED} className="bg-gray-800">🚚 Shipped</option>
                    <option value={orderStatusEnum.DELIVERED} className="bg-gray-800">✅ Delivered</option>
                    <option value={orderStatusEnum.CANCELLED} className="bg-gray-800">❌ Cancelled</option>
                  </select>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getPaymentStatusStyle(order.paymentStatus)}`}>
                    {getPaymentStatusText(order.paymentStatus)}
                  </span>
                </td>
                <td className="p-4 text-white/50 text-sm">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      className="text-purple-300 hover:text-purple-200 transition-colors text-sm"
                      onClick={() => {
                        window.location.href = `/dashboard/admin/orders/${order.id}`
                      }}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-white/10 bg-white/5 flex justify-between items-center text-sm">
        <p className="text-white/50">
          Showing {orders.length} of {orders.length} orders
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-white/10 text-white/50 cursor-not-allowed opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1 rounded bg-white/10 text-white/50 cursor-not-allowed opacity-50" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}