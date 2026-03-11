import { prisma } from '@/lib/prisma'

// Define types for user with relations
type UserWithCount = {
  id: string
  name: string | null
  email: string
  password: string
  role: string
  phone: string | null
  address: string | null
  createdAt: Date
  updatedAt: Date
  _count: {
    orders: number
  }
}

export default async function AdminUsersPage() {
  try {
    const users = await prisma.user.findMany({
      include: { 
        _count: { 
          select: { orders: true } 
        }
      },
      orderBy: { createdAt: 'desc' }
    }) as UserWithCount[]

    // Helper function to format date safely
    const formatDate = (date: Date): string => {
      try {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch (error) {
        return 'Invalid date'
      }
    }

    // Handle delete user
    const handleDelete = async (userId: string) => {
      'use server'
      try {
        await prisma.user.delete({
          where: { id: userId }
        })
        // Revalidate the page
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }

    // Handle role update
    const handleRoleUpdate = async (userId: string, newRole: string) => {
      'use server'
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { role: newRole }
        })
        // Revalidate the page
      } catch (error) {
        console.error('Failed to update user role:', error)
      }
    }

    // Calculate statistics
    const totalUsers = users.length
    const adminCount = users.filter(u => u.role === 'ADMIN').length
    const customerCount = users.filter(u => u.role === 'CUSTOMER').length
    const usersWithOrders = users.filter(u => u._count.orders > 0).length

    return (
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Users Management
            </h1>
            <p className="text-white/50 mt-2">
              Total Users: <span className="text-white font-bold">{totalUsers}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <span>🔄</span> Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
            <p className="text-white/50 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-white">{totalUsers}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-4 border border-green-500/20">
            <p className="text-white/50 text-sm">Active Users</p>
            <p className="text-2xl font-bold text-green-300">{totalUsers}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
            <p className="text-white/50 text-sm">Admins</p>
            <p className="text-2xl font-bold text-yellow-300">{adminCount}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
            <p className="text-white/50 text-sm">With Orders</p>
            <p className="text-2xl font-bold text-blue-300">{usersWithOrders}</p>
          </div>
        </div>

        {/* Users Table */}
        {users.length === 0 ? (
          <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-16 text-center">
            <div className="text-7xl mb-4 animate-bounce">👥</div>
            <h3 className="text-2xl text-white mb-2">No users found</h3>
            <p className="text-white/50 mb-6">Users will appear here after registration</p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left p-4 text-white/50 font-medium text-sm">USER</th>
                    <th className="text-left p-4 text-white/50 font-medium text-sm">EMAIL</th>
                    <th className="text-left p-4 text-white/50 font-medium text-sm">ROLE</th>
                    <th className="text-left p-4 text-white/50 font-medium text-sm">ORDERS</th>
                    <th className="text-left p-4 text-white/50 font-medium text-sm">JOINED</th>
                    <th className="text-left p-4 text-white/50 font-medium text-sm">STATUS</th>
                    <th className="text-left p-4 text-white/50 font-medium text-sm">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr 
                      key={user.id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar Placeholder */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${user.role === 'ADMIN' 
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                              : 'bg-gradient-to-br from-blue-500 to-green-500'
                            }`}
                          >
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {user.name || 'No Name'}
                            </p>
                            <p className="text-white/30 text-xs">ID: {user.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-white/70 text-sm">{user.email}</p>
                      </td>
                      <td className="p-4">
                        <select
                          defaultValue={user.role}
                          className={`px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20 focus:ring-purple-500/20'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/20 focus:ring-blue-500/20'
                          }`}
                          onChange={async (e) => {
                            if (confirm(`Change role for ${user.name || 'this user'} to ${e.target.value}?`)) {
                              await handleRoleUpdate(user.id, e.target.value)
                              window.location.reload()
                            }
                          }}
                        >
                          <option value="CUSTOMER" className="bg-gray-800">👤 Customer</option>
                          <option value="ADMIN" className="bg-gray-800">👑 Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white/70 text-sm">
                          {user._count.orders} orders
                        </span>
                      </td>
                      <td className="p-4 text-white/50 text-sm">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          user.email.includes('@') 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/20'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/20'
                        }`}>
                          {user.email.includes('@') ? '✅ Active' : '⚠️ Pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete user ${user.name || user.email}?`)) {
                                await handleDelete(user.id)
                                window.location.reload()
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              window.location.href = `/dashboard/admin/users/${user.id}`
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm"
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
                Showing <span className="text-white font-bold">{users.length}</span> of{' '}
                <span className="text-white font-bold">{users.length}</span> users
              </p>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 rounded bg-white/10 text-white/50 cursor-not-allowed opacity-50" 
                  disabled
                >
                  Previous
                </button>
                <button 
                  className="px-3 py-1 rounded bg-white/10 text-white/50 cursor-not-allowed opacity-50" 
                  disabled
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Role Distribution */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-medium mb-3">Role Distribution</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70">👑 Admins</span>
                <span className="text-white font-bold">{adminCount}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${(adminCount / totalUsers) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <span className="text-white/70">👤 Customers</span>
                <span className="text-white font-bold">{customerCount}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                  style={{ width: `${(customerCount / totalUsers) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-medium mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Users with orders</span>
                <span className="text-green-300">{usersWithOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Users without orders</span>
                <span className="text-yellow-300">{totalUsers - usersWithOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Conversion rate</span>
                <span className="text-blue-300">
                  {((usersWithOrders / totalUsers) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading users:', error)
    return (
      <div className="space-y-8 p-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
          Users Management
        </h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-12 text-center">
          <div className="text-7xl mb-4">❌</div>
          <p className="text-red-300 text-xl mb-4">Failed to load users</p>
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
}