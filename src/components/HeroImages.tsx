'use client'

import Image from 'next/image'
import { useState } from 'react'

interface HeroImagesProps {
  images: { id: number; src: string; alt: string }[]
}

export default function HeroImages({ images }: HeroImagesProps) {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const handleImageError = (id: number) => {
    setImgErrors(prev => ({ ...prev, [id]: true }))
  }

  return (
    <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 gap-1">
      {images.map((img) => (
        <div key={img.id} className="relative w-full h-full overflow-hidden">
          {imgErrors[img.id] ? (
            // Fallback when image fails to load
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-4xl">
              🛠️
            </div>
          ) : (
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              priority={img.id <= 2}
              className="object-cover transition-transform duration-700 hover:scale-110"
              onError={() => handleImageError(img.id)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        </div>
      ))}
    </div>
  )
}