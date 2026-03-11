import { Product } from './product'

// Cart Item Interface
export interface CartItem {
  id: string
  cartId: string
  productId: string
  product: Product
  quantity: number
  createdAt: Date
  updatedAt: Date
}

// Cart Interface
export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  createdAt: Date
  updatedAt: Date
}

// Cart Context Interface
export interface CartContextType {
  // State
  items: CartItem[]
  cart: Cart | null
  loading: boolean
  error: string | null
  
  // Cart Operations
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  
  // Cart Calculations
  totalItems: number
  totalPrice: number
  subtotal: number
  tax: number
  shipping: number
  grandTotal: number
  
  // Cart Status
  isEmpty: boolean
  hasItems: boolean
  
  // Sync Operations
  syncCart: () => Promise<void>
  mergeCarts: (localCart: CartItem[]) => Promise<void>
  
  // Checkout
  checkout: () => Promise<CheckoutResult>
}

// Cart Summary Interface
export interface CartSummary {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  itemCount: number
  uniqueItemCount: number
}

// Cart Item Summary
export interface CartItemSummary {
  productId: string
  productName: string
  productPrice: number
  quantity: number
  totalPrice: number
  image: string
  inStock: boolean
  maxAvailable: number
}

// Checkout Result
export interface CheckoutResult {
  success: boolean
  orderId?: string
  error?: string
  redirectUrl?: string
}

// Cart Validation
export interface CartValidation {
  isValid: boolean
  errors: CartError[]
  warnings: CartWarning[]
}

// Cart Error
export interface CartError {
  code: string
  message: string
  itemId?: string
  productId?: string
}

// Cart Warning
export interface CartWarning {
  code: string
  message: string
  itemId?: string
  productId?: string
}

// Cart Actions
export type CartAction =
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

// Cart State
export interface CartState {
  cart: Cart | null
  items: CartItem[]
  loading: boolean
  error: string | null
}

// Cart Props
export interface CartProps {
  className?: string
  showSummary?: boolean
  editable?: boolean
  onUpdate?: (cart: Cart) => void
  onCheckout?: () => void
}

// Cart Item Props
export interface CartItemProps {
  item: CartItem
  editable?: boolean
  onUpdate?: (itemId: string, quantity: number) => void
  onRemove?: (itemId: string) => void
  className?: string
}

// Cart Summary Props
export interface CartSummaryProps {
  cart: Cart
  showTax?: boolean
  showShipping?: boolean
  showDiscount?: boolean
  className?: string
}

// Cart Operations
export interface CartOperations {
  add: (productId: string, quantity: number) => Promise<CartItem>
  update: (itemId: string, quantity: number) => Promise<CartItem>
  remove: (itemId: string) => Promise<void>
  clear: () => Promise<void>
  validate: () => Promise<CartValidation>
}

// Cart Events
export interface CartEvents {
  onAdd?: (item: CartItem) => void
  onUpdate?: (item: CartItem) => void
  onRemove?: (itemId: string) => void
  onClear?: () => void
  onError?: (error: CartError) => void
}

// Cart Settings
export interface CartSettings {
  maxItems?: number
  minQuantity?: number
  maxQuantity?: number
  allowDuplicate?: boolean
  autoSave?: boolean
  taxRate?: number
  shippingRate?: number
  freeShippingThreshold?: number
}

// Cart Discount
export interface CartDiscount {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  description?: string
  expiresAt?: Date
  minimumPurchase?: number
}

// Cart Shipping
export interface CartShipping {
  method: string
  cost: number
  estimatedDays?: string
  tracking?: string
}

// Cart Payment
export interface CartPayment {
  method: string
  status: 'pending' | 'paid' | 'failed'
  transactionId?: string
  paidAt?: Date
}

// Cart Response
export interface CartResponse {
  success: boolean
  data?: Cart
  error?: string
  message?: string
}

// Cart API Request
export interface CartRequest {
  action: 'add' | 'update' | 'remove' | 'clear'
  productId?: string
  itemId?: string
  quantity?: number
}

// Local Storage Cart
export interface LocalCart {
  items: LocalCartItem[]
  lastUpdated: string
}

// Local Cart Item
export interface LocalCartItem {
  productId: string
  quantity: number
  addedAt: string
}

// Cart Utilities
export interface CartUtils {
  calculateSubtotal: (items: CartItem[]) => number
  calculateTax: (subtotal: number, taxRate: number) => number
  calculateShipping: (subtotal: number, threshold: number, rate: number) => number
  calculateDiscount: (subtotal: number, discount: CartDiscount) => number
  validateQuantity: (quantity: number, min?: number, max?: number) => boolean
  validateStock: (product: Product, quantity: number) => boolean
}

// Cart Constants
export const CART_CONSTANTS = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 99,
  MAX_ITEMS: 50,
  TAX_RATE: 0.1, // 10%
  SHIPPING_RATE: 10,
  FREE_SHIPPING_THRESHOLD: 100,
  STORAGE_KEY: 'cart',
  EXPIRY_DAYS: 7
} as const

// Cart Error Codes
export enum CartErrorCode {
  INVALID_QUANTITY = 'INVALID_QUANTITY',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  MAX_ITEMS_EXCEEDED = 'MAX_ITEMS_EXCEEDED',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  CART_NOT_FOUND = 'CART_NOT_FOUND',
  UPDATE_FAILED = 'UPDATE_FAILED',
  REMOVE_FAILED = 'REMOVE_FAILED',
  CLEAR_FAILED = 'CLEAR_FAILED',
  SYNC_FAILED = 'SYNC_FAILED'
}

// Cart Warning Codes
export enum CartWarningCode {
  LOW_STOCK = 'LOW_STOCK',
  PRICE_CHANGED = 'PRICE_CHANGED',
  PRODUCT_UNAVAILABLE = 'PRODUCT_UNAVAILABLE',
  SHIPPING_THRESHOLD = 'SHIPPING_THRESHOLD'
}

// Cart Status
export enum CartStatus {
  ACTIVE = 'ACTIVE',
  ABANDONED = 'ABANDONED',
  CONVERTED = 'CONVERTED',
  EXPIRED = 'EXPIRED'
}

// Cart Events Enum
export enum CartEventType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  REMOVE = 'REMOVE',
  CLEAR = 'CLEAR',
  MERGE = 'MERGE',
  SYNC = 'SYNC',
  ERROR = 'ERROR',
  CHECKOUT = 'CHECKOUT'
}

// Cart Event
export interface CartEvent {
  type: CartEventType
  timestamp: Date
  data?: any
  userId?: string
}

// Cart Analytics
export interface CartAnalytics {
  totalCarts: number
  activeCarts: number
  abandonedCarts: number
  convertedCarts: number
  averageCartValue: number
  totalRevenue: number
  topProducts: Array<{
    productId: string
    productName: string
    quantity: number
    revenue: number
  }>
}

// Cart Export Format
export interface CartExport {
  carts: Cart[]
  summary: CartAnalytics
  exportedAt: Date
  format: 'json' | 'csv' | 'excel'
}

// Type Guards
export function isCart(item: any): item is Cart {
  return (
    item &&
    typeof item === 'object' &&
    'id' in item &&
    'userId' in item &&
    'items' in item &&
    Array.isArray(item.items)
  )
}

export function isCartItem(item: any): item is CartItem {
  return (
    item &&
    typeof item === 'object' &&
    'id' in item &&
    'productId' in item &&
    'quantity' in item &&
    typeof item.quantity === 'number'
  )
}

export function isCartError(error: any): error is CartError {
  return (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    'message' in error
  )
}

// Cart Hook Return Type
export interface UseCartReturn extends CartContextType {
  // Additional utilities
  getItem: (productId: string) => CartItem | undefined
  hasItem: (productId: string) => boolean
  getItemQuantity: (productId: string) => number
  getItemTotal: (itemId: string) => number
  getItemsByProduct: (productId: string) => CartItem[]
  
  // Validation
  validateCart: () => CartValidation
  validateItem: (itemId: string) => boolean
  
  // Persistence
  saveCart: () => void
  loadCart: () => void
  clearSavedCart: () => void
  
  // Sync
  syncWithServer: () => Promise<void>
  syncWithLocal: () => void
  
  // Events
  subscribe: (event: CartEventType, callback: (event: CartEvent) => void) => () => void
  unsubscribe: (event: CartEventType, callback: (event: CartEvent) => void) => void
  
  // Debug
  debug: {
    state: CartState
    actions: CartAction[]
    lastAction: CartAction | null
  }
}

// Cart Provider Props
export interface CartProviderProps {
  children: React.ReactNode
  initialState?: CartState
  settings?: CartSettings
  events?: CartEvents
  onStateChange?: (state: CartState) => void
  persistKey?: string
  syncInterval?: number
}

// Cart Reducer
export type CartReducer = (state: CartState, action: CartAction) => CartState

// Cart Selector
export type CartSelector<T> = (state: CartState) => T

// Cart Middleware
export type CartMiddleware = (store: any) => (next: any) => (action: any) => any

// Cart Storage
export interface CartStorage {
  getItem: (key: string) => Cart | null
  setItem: (key: string, cart: Cart) => void
  removeItem: (key: string) => void
  clear: () => void
}

// Default Cart State
export const defaultCartState: CartState = {
  cart: null,
  items: [],
  loading: false,
  error: null
}

// Empty Cart
export const emptyCart: Cart = {
  id: '',
  userId: '',
  items: [],
  createdAt: new Date(),
  updatedAt: new Date()
}

// Cart Factory
export const createCart = (userId: string): Cart => ({
  id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  userId,
  items: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

// Cart Item Factory
export const createCartItem = (
  cartId: string,
  product: Product,
  quantity: number
): CartItem => ({
  id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  cartId,
  productId: product.id,
  product,
  quantity,
  createdAt: new Date(),
  updatedAt: new Date()
})