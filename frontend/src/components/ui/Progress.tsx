import { motion } from 'framer-motion'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
  className?: string
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = '',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600',
    warning: 'bg-gradient-to-r from-amber-600 to-orange-600',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600',
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div className={`w-full ${sizes[size]} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`${sizes[size]} ${variants[variant]} rounded-full shadow-lg`}
          style={{
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
          }}
        />
      </div>
    </div>
  )
}
