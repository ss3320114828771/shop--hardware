import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function getUser(req?: NextRequest) {
  try {
    let token: string | undefined

    if (req) {
      token = req.cookies.get('token')?.value
    } else {
      const cookieStore = await cookies()
      token = cookieStore.get('token')?.value
    }

    if (!token) return null

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)

    return payload
  } catch (error) {
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
  
  const userRole = (user as any).role
  if (userRole !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }
  
  return user
}

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