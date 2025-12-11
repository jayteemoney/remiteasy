import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: ReactNode
  status?: 'online' | 'offline' | 'busy' | 'away'
  className?: string
}

export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  status,
  className = '',
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
  }

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`${sizes[size]} rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg`}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : fallback ? (
          fallback
        ) : (
          <User className="w-1/2 h-1/2" />
        )}
      </motion.div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full border-2 border-white dark:border-gray-800`}
        />
      )}
    </div>
  )
}
