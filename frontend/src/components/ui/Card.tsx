import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  gradient?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({
  children,
  className = '',
  hover = false,
  glass = false,
  gradient = false,
  padding = 'md',
}: CardProps) {
  const baseStyles = 'rounded-2xl border transition-all duration-300'

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const backgroundStyles = glass
    ? 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-white/20 dark:border-gray-700/20'
    : gradient
      ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700'
      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'

  const hoverStyles = hover
    ? 'hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 hover:-translate-y-1 cursor-pointer hover:border-blue-500/20 dark:hover:border-blue-500/30'
    : 'shadow-lg'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${backgroundStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </motion.div>
  )
}
