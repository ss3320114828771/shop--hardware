interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 ${className}`}>
      {children}
    </div>
  )
}