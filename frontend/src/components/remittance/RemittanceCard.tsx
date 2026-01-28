import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/common'
import { RemittanceStatus } from './RemittanceStatus'
import { RemittanceProgress } from './RemittanceProgress'
import { formatAddress, formatRelativeTime } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { Remittance } from '@/types/remittance'

export interface RemittanceCardProps {
  remittance: Remittance
  variant?: 'default' | 'compact'
  showActions?: boolean
  className?: string
}

export function RemittanceCard({
  remittance,
  variant = 'default',
  className,
}: RemittanceCardProps) {
  const isCompact = variant === 'compact'

  return (
    <Link to={`/remittance/${remittance.id.toString()}`}>
      <Card
        variant="bordered"
        className={cn(
          'transition-all hover:border-primary-300 hover:shadow-md dark:hover:border-primary-700',
          className
        )}
      >
        <CardContent className={cn('p-6', isCompact && 'p-4')}>
          {/* Header: Status and Date */}
          <div className="flex items-start justify-between">
            <RemittanceStatus
              status={remittance.status}
              progress={remittance.progress}
              size={isCompact ? 'sm' : 'sm'}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatRelativeTime(remittance.createdAt)}
            </span>
          </div>

          {/* Purpose */}
          <h3
            className={cn(
              'mt-3 font-semibold text-gray-900 dark:text-white line-clamp-2',
              isCompact ? 'text-sm' : 'text-base'
            )}
          >
            {remittance.purpose}
          </h3>

          {/* Progress Bar */}
          <div className={cn('mt-4', isCompact && 'mt-3')}>
            <RemittanceProgress
              currentAmount={remittance.currentAmount}
              targetAmount={remittance.targetAmount}
              showLabels={false}
              showPercentage={false}
              size={isCompact ? 'sm' : 'md'}
            />
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {remittance.progress}% funded
              </span>
            </div>
          </div>

          {/* Addresses */}
          {!isCompact && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Creator</p>
                <p className="font-mono text-gray-900 dark:text-white">
                  {formatAddress(remittance.creator)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Recipient</p>
                <p className="font-mono text-gray-900 dark:text-white">
                  {formatAddress(remittance.recipient)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
