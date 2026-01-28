import { cn } from '@/lib/cn'
import { formatCeloWithSymbol } from '@/lib/format'

export interface RemittanceProgressProps {
  currentAmount: bigint
  targetAmount: bigint
  showLabels?: boolean
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function RemittanceProgress({
  currentAmount,
  targetAmount,
  showLabels = true,
  showPercentage = true,
  size = 'md',
  className,
}: RemittanceProgressProps) {
  const progress = targetAmount > 0n ? Number((currentAmount * 100n) / targetAmount) : 0
  const clampedProgress = Math.min(progress, 100)

  // Color based on progress
  const getProgressColor = () => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 50) return 'bg-primary-500'
    return 'bg-primary-500'
  }

  return (
    <div className={cn('w-full', className)}>
      {(showLabels || showPercentage) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {showLabels && (
            <span className="text-gray-500 dark:text-gray-400">Progress</span>
          )}
          {showPercentage && (
            <span className="font-medium text-gray-900 dark:text-white">
              {formatCeloWithSymbol(currentAmount)} / {formatCeloWithSymbol(targetAmount)} ({progress}%)
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
          sizes[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            getProgressColor()
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
}
