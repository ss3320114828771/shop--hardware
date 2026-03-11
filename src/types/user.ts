// Import Product type if it exists in a separate file
// If you have a product.ts file, uncomment the line below:
// import { Product } from './product'

// If you don't have a separate product type, define it here
export interface Product {
  id: string
  name: string
  price: number
  description?: string
  images?: string[]
  categoryId?: string
  stock?: number
  sku?: string
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: 'CUSTOMER' | 'ADMIN' | 'MANAGER'  // Added MANAGER role for flexibility
  phone?: string
  address?: string
  avatar?: string  // Added avatar field
  emailVerified?: boolean  // Added email verification field
  lastLogin?: Date  // Added last login tracking
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  user: User
  items: OrderItem[]
  total: number
  subtotal?: number  // Added optional fields
  tax?: number
  shipping?: number
  discount?: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: string  // Added payment method
  transactionId?: string  // Added transaction ID
  shippingAddress: Address
  billingAddress?: Address  // Added billing address
  phone: string
  email: string
  notes?: string  // Added order notes
  trackingNumber?: string  // Added tracking
  estimatedDelivery?: Date  // Added estimated delivery
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string  // Added orderId for relation
  productId: string
  product: Product
  quantity: number
  price: number  // Price at time of order
  total?: number  // Calculated field (price * quantity)
  discount?: number  // Item-specific discount
  tax?: number  // Item-specific tax
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
  label?: string  // e.g., "Home", "Work"
}

// Order status enum for type safety
export type OrderStatus = 
  | 'PENDING' 
  | 'PROCESSING' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED'
  | 'REFUNDED'
  | 'ON_HOLD'

// Payment status enum
export type PaymentStatus = 
  | 'PENDING' 
  | 'PAID' 
  | 'FAILED' 
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'AUTHORIZED'
  | 'CAPTURED'

// User role enum
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER' | 'STAFF'

// Extended user interface with more fields
export interface UserProfile extends User {
  phoneNumber?: string
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  newsletter?: boolean
  marketingConsent?: boolean
  twoFactorEnabled?: boolean
  socialLogins?: SocialLogin[]
  addresses?: Address[]
  paymentMethods?: PaymentMethod[]
  wishlist?: string[]  // Array of product IDs
  recentViews?: string[]  // Array of product IDs
  orderCount?: number
  totalSpent?: number
  lastOrderDate?: Date
}

// Social login interface
export interface SocialLogin {
  provider: 'google' | 'facebook' | 'apple' | 'github'
  providerId: string
  email: string
  name?: string
  avatar?: string
  linkedAt: Date
}

// Payment method interface
export interface PaymentMethod {
  id: string
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
  last4?: string
  brand?: string  // visa, mastercard, etc.
  expiryMonth?: number
  expiryYear?: number
  isDefault?: boolean
  billingAddress?: Address
}

// Session interface for auth
export interface Session {
  user: User
  token: string
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
}

// Login credentials
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

// Registration data
export interface RegistrationData {
  name: string
  email: string
  password: string
  confirmPassword?: string
  phone?: string
  acceptTerms?: boolean
  newsletter?: boolean
}

// Password reset
export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  password: string
  confirmPassword: string
}

// Email verification
export interface EmailVerification {
  token: string
  userId: string
}

// Auth response
export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
  expiresIn: number
}

// Refresh token
export interface RefreshToken {
  token: string
  userId: string
  expiresAt: Date
  createdAt: Date
}

// Permission types
export type Permission = 
  | 'view_products'
  | 'create_products'
  | 'edit_products'
  | 'delete_products'
  | 'view_orders'
  | 'create_orders'
  | 'edit_orders'
  | 'cancel_orders'
  | 'view_users'
  | 'create_users'
  | 'edit_users'
  | 'delete_users'
  | 'manage_settings'
  | 'view_reports'
  | 'export_data'

// Role permissions mapping
export const RolePermissions: Record<UserRole, Permission[]> = {
  CUSTOMER: [
    'view_products',
    'create_orders',
    'view_orders',
    'cancel_orders'
  ],
  STAFF: [
    'view_products',
    'edit_products',
    'view_orders',
    'edit_orders',
    'view_users'
  ],
  MANAGER: [
    'view_products',
    'create_products',
    'edit_products',
    'delete_products',
    'view_orders',
    'edit_orders',
    'cancel_orders',
    'view_users',
    'create_users',
    'edit_users',
    'view_reports'
  ],
  ADMIN: [
    'view_products',
    'create_products',
    'edit_products',
    'delete_products',
    'view_orders',
    'create_orders',
    'edit_orders',
    'cancel_orders',
    'view_users',
    'create_users',
    'edit_users',
    'delete_users',
    'manage_settings',
    'view_reports',
    'export_data'
  ]
}

// User statistics
export interface UserStats {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  favoriteCategory?: string
  lastOrderDate?: Date
  memberSince: Date
  reviewCount: number
  wishlistCount: number
}

// User preferences
export interface UserPreferences {
  language: string
  currency: string
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    orderUpdates: boolean
    promotions: boolean
  }
  privacy: {
    shareProfile: boolean
    showOnline: boolean
    allowTracking: boolean
  }
}

// Type guards
export function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'email' in obj &&
    'name' in obj &&
    'role' in obj
  )
}

export function isOrder(obj: any): obj is Order {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'userId' in obj &&
    'items' in obj &&
    Array.isArray(obj.items) &&
    'total' in obj &&
    'status' in obj
  )
}

// Helper functions
export function getUserFullName(user: User): string {
  return user.name
}

export function getUserInitials(user: User): string {
  return user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatUserRole(role: UserRole): string {
  return role.charAt(0) + role.slice(1).toLowerCase()
}

export function isAdmin(user: User): boolean {
  return user.role === 'ADMIN'
}

export function isManager(user: User): boolean {
  return user.role === 'MANAGER' || user.role === 'ADMIN'
}

export function hasPermission(user: User, permission: Permission): boolean {
  const permissions = RolePermissions[user.role]
  return permissions?.includes(permission) || false
}