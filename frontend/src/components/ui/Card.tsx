import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
}: CardProps) {
  const baseStyles = 'rounded-xl border transition-all duration-200'

  const paddingStyles = {
    none: '',
    sm: 'p-4 sm:p-5',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }

  const backgroundStyles =
    'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'

  const hoverStyles = hover
    ? 'hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm cursor-pointer'
    : ''

  return (
    <div
      className={`${baseStyles} ${backgroundStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  )
}
