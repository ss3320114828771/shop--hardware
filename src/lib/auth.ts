import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function getUser(req?: NextRequest) {
  try {
    let token: string | undefined

    if (req) {
      // Get token from request cookies
      token = req.cookies.get('token')?.value
    } else {
      // Get token from server cookies - MUST be awaited in Next.js 14+
      const cookieStore = await cookies()
      token = cookieStore.get('token')?.value
    }

    if (!token) return null

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)

    return payload
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

export async function requireAuth(req: NextRequest) {
  const user = await getUser(req)
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireAdmin(req: NextRequest) {
  const user = await getUser(req)
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  // Check if user has admin role
  const userRole = (user as any).role
  if (userRole !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }
  
  return user
}

// Helper function to get current user in server components
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) return null
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)
    
    return payload
  } catch (error) {
    return null
  }
}

// Helper function to check if user is admin
export async function isAdmin() {
  const user = await getCurrentUser()
  return !!(user && (user as any).role === 'ADMIN')
}

// Helper function to get user ID safely
export async function getUserId() {
  const user = await getCurrentUser()
  return user ? (user as any).id : null
}