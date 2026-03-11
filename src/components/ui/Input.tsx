'use client'

import { forwardRef, InputHTMLAttributes, useState } from 'react'

// Define the props interface - Simplified
type InputProps = {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
  success?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  variant?: 'default' | 'filled' | 'outline' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  containerClassName?: string
  onRightIconClick?: () => void
  onLeftIconClick?: () => void
} & InputHTMLAttributes<HTMLInputElement>

// Main Input Component
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      loading = false,
      success = false,
      rounded = 'lg',
      variant = 'default',
      size = 'md',
      className = '',
      containerClassName = '',
      onRightIconClick,
      onLeftIconClick,
      disabled,
      required,
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    // Determine input type (for password toggle)
    const inputType = type === 'password' 
      ? (showPassword ? 'text' : 'password')
      : type

    // Size classes
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg'
    }

    // Variant classes
    const variantClasses = {
      default: 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20',
      filled: 'bg-white/20 border border-transparent text-white placeholder-white/50 focus:bg-white/30 focus:border-purple-500',
      outline: 'bg-transparent border-2 border-white/30 text-white placeholder-white/50 focus:border-purple-500',
      ghost: 'bg-transparent border border-transparent text-white placeholder-white/50 focus:bg-white/10'
    }

    // Rounded classes
    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded',
      md: 'rounded-lg',
      lg: 'rounded-xl',
      full: 'rounded-full'
    }

    // Get class based on size
    const getSizeClass = () => {
      switch (size) {
        case 'xs': return 'px-2 py-1 text-xs'
        case 'sm': return 'px-3 py-2 text-sm'
        case 'lg': return 'px-6 py-4 text-lg'
        default: return 'px-4 py-3 text-base'
      }
    }

    // Get class based on variant
    const getVariantClass = () => {
      switch (variant) {
        case 'filled':
          return 'bg-white/20 border border-transparent text-white placeholder-white/50 focus:bg-white/30 focus:border-purple-500'
        case 'outline':
          return 'bg-transparent border-2 border-white/30 text-white placeholder-white/50 focus:border-purple-500'
        case 'ghost':
          return 'bg-transparent border border-transparent text-white placeholder-white/50 focus:bg-white/10'
        default:
          return 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
      }
    }

    // Get class based on rounded
    const getRoundedClass = () => {
      switch (rounded) {
        case 'none': return 'rounded-none'
        case 'sm': return 'rounded'
        case 'md': return 'rounded-lg'
        case 'full': return 'rounded-full'
        default: return 'rounded-xl'
      }
    }

    // State classes
    const stateClasses = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : success
      ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
      : ''

    const disabledClasses = disabled || loading
      ? 'opacity-50 cursor-not-allowed'
      : ''

    // Animation classes
    const focusClasses = isFocused ? 'scale-[1.02]' : ''

    return (
      <div className={`w-full ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-white/80 mb-2"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div
          className={`
            relative flex items-center transition-all duration-300
            ${getSizeClass()}
            ${getVariantClass()}
            ${getRoundedClass()}
            ${stateClasses}
            ${disabledClasses}
            ${focusClasses}
          `}
        >
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={`
                absolute left-3 text-white/50
                ${onLeftIconClick ? 'cursor-pointer hover:text-white' : ''}
              `}
              onClick={onLeftIconClick}
            >
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled || loading}
            required={required}
            className={`
              w-full bg-transparent outline-none
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || type === 'password' ? 'pr-10' : ''}
              ${className}
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Right Icon / Loading / Success / Password Toggle */}
          <div className="absolute right-3 flex items-center gap-2">
            {/* Loading Spinner */}
            {loading && (
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            )}

            {/* Success Check */}
            {success && !loading && (
              <div className="text-green-400 animate-bounce">✓</div>
            )}

            {/* Password Toggle */}
            {type === 'password' && !loading && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/50 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !loading && type !== 'password' && (
              <div
                className={`
                  text-white/50
                  ${onRightIconClick ? 'cursor-pointer hover:text-white' : ''}
                `}
                onClick={onRightIconClick}
              >
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {/* Error / Helper Text */}
        {(error || helperText) && (
          <div
            className={`
              mt-2 text-sm flex items-center gap-1
              ${error ? 'text-red-400' : 'text-white/50'}
              animate-fadeIn
            `}
          >
            {error && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {error || helperText}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Password Strength Meter Component
export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [strength, setStrength] = useState(0)

    const calculateStrength = (password: string) => {
      let score = 0
      if (!password) return 0
      if (password.length > 7) score++
      if (password.length > 11) score++
      if (/[A-Z]/.test(password)) score++
      if (/[a-z]/.test(password)) score++
      if (/[0-9]/.test(password)) score++
      if (/[^A-Za-z0-9]/.test(password)) score++
      return Math.min(score, 5)
    }

    const getStrengthColor = (score: number) => {
      if (score === 0) return 'bg-gray-400'
      if (score <= 2) return 'bg-red-500'
      if (score <= 3) return 'bg-yellow-500'
      if (score <= 4) return 'bg-blue-500'
      return 'bg-green-500'
    }

    const getStrengthText = (score: number) => {
      if (score === 0) return 'Enter password'
      if (score <= 2) return 'Weak'
      if (score <= 3) return 'Fair'
      if (score <= 4) return 'Good'
      return 'Strong'
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPassword = e.target.value
      setStrength(calculateStrength(newPassword))
      onChange?.(e)
    }

    return (
      <div className="space-y-2">
        <Input
          ref={ref}
          type="password"
          onChange={handleChange}
          value={value}
          {...props}
        />
        
        {/* Password Strength Meter */}
        {value && (
          <div className="space-y-1 animate-fadeIn">
            <div className="flex gap-1 h-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`
                    flex-1 h-full rounded-full transition-all duration-300
                    ${i <= strength ? getStrengthColor(strength) : 'bg-white/10'}
                  `}
                />
              ))}
            </div>
            <p className={`text-xs ${getStrengthColor(strength).replace('bg-', 'text-')}`}>
              {getStrengthText(strength)} password
            </p>
          </div>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

// Search Input Component
export const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  ({ onRightIconClick, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<span className="text-lg">🔍</span>}
        rightIcon={<span className="text-lg">⌕</span>}
        rounded="full"
        variant="filled"
        onRightIconClick={onRightIconClick}
        {...props}
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'

// Phone Input Component
export const PhoneInput = forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, ...props }, ref) => {
    const formatPhoneNumber = (value: string): string => {
      const numbers = value.replace(/\D/g, '')
      if (numbers.length <= 3) return numbers
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value)
      e.target.value = formatted
      onChange?.(e)
    }

    return (
      <Input
        ref={ref}
        type="tel"
        leftIcon={<span className="text-lg">📞</span>}
        placeholder="123-456-7890"
        onChange={handleChange}
        {...props}
      />
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

// Currency Input Component
export const CurrencyInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 font-medium">$</span>
        <Input
          ref={ref}
          type="number"
          step="0.01"
          min="0"
          className={`pl-8 ${className || ''}`}
          {...props}
        />
      </div>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'

export default Input