interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string
  height?: string
  count?: number
  animated?: boolean
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  count = 1,
  animated = true,
}: SkeletonProps) {
  const baseStyles = `bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${animated ? 'animate-shimmer' : ''}`

  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  }

  const style = {
    width: width,
    height: height,
  }

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={style}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    />
  )
}

// Specialized skeleton components for common use cases

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width="48px" height="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height="100px" />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width="100px" height="36px" />
        <Skeleton variant="rectangular" width="100px" height="36px" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width="40px" height="40px" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="50%" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-4">
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="text" width="25%" />
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="border-b border-gray-200 dark:border-gray-700 p-4 last:border-b-0"
        >
          <div className="flex gap-4">
            <Skeleton variant="text" width="25%" />
            <Skeleton variant="text" width="25%" />
            <Skeleton variant="text" width="25%" />
            <Skeleton variant="text" width="25%" />
          </div>
        </div>
      ))}
    </div>
  )
}
