interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    secondary: 'bg-white/10 text-white border border-white/20',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-xl'
  }

  return (
    <button
      className={`rounded-xl glow-button ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}