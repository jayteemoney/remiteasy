import { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  title?: string
  description?: string
  action?: ReactNode
}

const maxWidths = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-full',
}

export function PageContainer({
  children,
  className,
  maxWidth = '2xl',
  title,
  description,
  action,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        'mx-auto w-full px-4 py-8 sm:px-6 lg:px-8',
        maxWidths[maxWidth],
        className
      )}
    >
      {(title || action) && (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </main>
  )
}
