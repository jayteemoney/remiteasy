import { useAccount } from 'wagmi'
import { useContributors } from '@/hooks/contracts'
import { formatAddress, formatCeloWithSymbol } from '@/lib/format'
import { Skeleton, Card, CardContent } from '@/components/common'
import { Users } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface ContributorsListProps {
  remittanceId: bigint
  totalAmount?: bigint
  className?: string
}

export function ContributorsList({
  remittanceId,
  totalAmount,
  className,
}: ContributorsListProps) {
  const { address: currentUserAddress } = useAccount()
  const { data: contributors, isLoading, error } = useContributors(remittanceId)

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-sm text-red-500">Failed to load contributors</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contributors {!isLoading && `(${contributors.length})`}
          </h2>
        </div>

        {isLoading ? (
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        ) : contributors.length === 0 ? (
          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No contributions yet. Be the first to contribute!
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {contributors.map((contributor, index) => {
              const isCurrentUser = contributor.address.toLowerCase() === currentUserAddress?.toLowerCase()
              const percentage = totalAmount && totalAmount > 0n
                ? Number((contributor.amount * 100n) / totalAmount)
                : 0

              return (
                <div
                  key={contributor.address}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2',
                    isCurrentUser && 'bg-primary-50 dark:bg-primary-900/20'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-mono text-sm text-gray-900 dark:text-white">
                        {formatAddress(contributor.address)}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">
                            (You)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCeloWithSymbol(contributor.amount)}
                    </p>
                    {totalAmount && totalAmount > 0n && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {percentage}%
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
