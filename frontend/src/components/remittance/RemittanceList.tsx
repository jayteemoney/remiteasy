import { ReactNode } from 'react'
import { RemittanceCard } from './RemittanceCard'
import { RemittanceCardSkeleton } from './RemittanceCardSkeleton'
import { EmptyState } from '@/components/common'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Remittance } from '@/types/remittance'

export interface RemittanceListProps {
  remittances: Remittance[]
  isLoading?: boolean
  variant?: 'default' | 'compact'
  emptyIcon?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  skeletonCount?: number
  className?: string
}

export function RemittanceList({
  remittances,
  isLoading = false,
  variant = 'default',
  emptyIcon,
  emptyTitle = 'No remittances found',
  emptyDescription = 'There are no remittances to display.',
  emptyAction,
  skeletonCount = 6,
  className,
}: RemittanceListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
          className
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <RemittanceCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    )
  }

  // Empty state
  if (remittances.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon || <Inbox className="h-8 w-8 text-gray-400" />}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    )
  }

  // Remittance grid
  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {remittances.map((remittance) => (
        <RemittanceCard
          key={remittance.id.toString()}
          remittance={remittance}
          variant={variant}
        />
      ))}
    </div>
  )
}
