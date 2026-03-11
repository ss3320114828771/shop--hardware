import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email exists' }, { status: 400 })
    }

    // Create user
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: 'CUSTOMER' }
    })

    // Create token (7 days)
    const token = await new SignJWT({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!))

    // Set cookie and return
    const response = NextResponse.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    })
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}