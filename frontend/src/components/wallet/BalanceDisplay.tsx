import { useBalance } from 'wagmi'
import { RefreshCw } from 'lucide-react'
import { formatCelo, formatCeloWithSymbol } from '@/lib/format'
import { Skeleton } from '@/components/common'
import { cn } from '@/lib/cn'
import type { Address } from 'viem'

export interface BalanceDisplayProps {
  address?: Address
  showSymbol?: boolean
  showRefresh?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg font-semibold',
}

export function BalanceDisplay({
  address,
  showSymbol = true,
  showRefresh = false,
  size = 'md',
  className,
}: BalanceDisplayProps) {
  const { data: balance, isLoading, refetch, isRefetching } = useBalance({
    address,
    query: {
      enabled: !!address,
      staleTime: 30_000, // 30 seconds
      gcTime: 60_000, // 1 minute
      refetchOnWindowFocus: false,
    },
  })

  if (!address) {
    return null
  }

  if (isLoading) {
    return <Skeleton className={cn('h-5 w-24', className)} />
  }

  const formattedBalance = balance
    ? showSymbol
      ? formatCeloWithSymbol(balance.value)
      : formatCelo(balance.value)
    : '0'

  return (
    <div className={cn('flex items-center gap-2', sizes[size], className)}>
      <span className="font-mono text-gray-900 dark:text-white">
        {formattedBalance}
      </span>
      {showRefresh && (
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          aria-label="Refresh balance"
        >
          <RefreshCw
            className={cn('h-4 w-4', isRefetching && 'animate-spin')}
          />
        </button>
      )}
    </div>
  )
}
