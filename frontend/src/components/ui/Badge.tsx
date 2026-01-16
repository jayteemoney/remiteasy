import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'orange'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variants = {
    default:
      'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
    success:
      'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    warning:
      'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    danger:
      'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    info:
      'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    orange:
      'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  )
}
