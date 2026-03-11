'use client'

import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Content */}
      <div className="relative bg-gradient-to-b from-purple-900 to-blue-900 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {title && (
          <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  )
}