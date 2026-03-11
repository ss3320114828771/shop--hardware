import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hardwarestore.com' },
    update: {},
    create: {
      email: 'admin@hardwarestore.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin',
      role: 'ADMIN'
    }
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Tools' },
      update: {},
      create: { name: 'Tools', slug: 'tools' }
    }),
    prisma.category.upsert({
      where: { name: 'Electrical' },
      update: {},
      create: { name: 'Electrical', slug: 'electrical' }
    }),
    prisma.category.upsert({
      where: { name: 'Plumbing' },
      update: {},
      create: { name: 'Plumbing', slug: 'plumbing' }
    }),
    prisma.category.upsert({
      where: { name: 'Hardware' },
      update: {},
      create: { name: 'Hardware', slug: 'hardware' }
    })
  ])

  // Create sample products
  const products = [
    {
      name: 'Professional Hammer Set',
      description: 'High-quality hammer set for professional use',
      price: 49.99,
      categoryId: categories[0].id,
      images: ['/images/hammer.jpg'],
      stock: 50,
      featured: true,
      sku: 'HAM001'
    },
    {
      name: 'Power Drill 500W',
      description: '500W variable speed power drill',
      price: 89.99,
      categoryId: categories[1].id,
      images: ['/images/drill.jpg'],
      stock: 30,
      featured: true,
      sku: 'DRL001'
    },
    {
      name: 'Pipe Wrench Set',
      description: 'Set of 3 pipe wrenches',
      price: 59.99,
      categoryId: categories[2].id,
      images: ['/images/wrench.jpg'],
      stock: 40,
      featured: false,
      sku: 'WRN001'
    },
    {
      name: 'Screwdriver Set',
      description: '20-piece screwdriver set',
      price: 29.99,
      categoryId: categories[3].id,
      images: ['/images/screwdriver.jpg'],
      stock: 100,
      featured: true,
      sku: 'SCR001'
    }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product
    })
  }

  console.log({ admin, categories, products })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())