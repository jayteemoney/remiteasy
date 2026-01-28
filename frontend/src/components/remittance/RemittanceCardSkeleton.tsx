import { Card, CardContent, Skeleton } from '@/components/common'
import { cn } from '@/lib/cn'

export interface RemittanceCardSkeletonProps {
  variant?: 'default' | 'compact'
  className?: string
}

export function RemittanceCardSkeleton({
  variant = 'default',
  className,
}: RemittanceCardSkeletonProps) {
  const isCompact = variant === 'compact'

  return (
    <Card variant="bordered" className={className}>
      <CardContent className={cn('p-6', isCompact && 'p-4')}>
        {/* Header: Status and Date */}
        <div className="flex items-start justify-between">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Purpose */}
        <Skeleton className={cn('mt-3 h-5 w-3/4', isCompact && 'h-4')} />

        {/* Progress Bar */}
        <div className={cn('mt-4', isCompact && 'mt-3')}>
          <Skeleton className={cn('h-2.5 w-full rounded-full', isCompact && 'h-1.5')} />
          <div className="mt-2 flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Addresses */}
        {!isCompact && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-12" />
              <Skeleton className="mt-1 h-4 w-28" />
            </div>
            <div>
              <Skeleton className="h-4 w-14" />
              <Skeleton className="mt-1 h-4 w-28" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
