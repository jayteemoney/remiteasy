import { useChainId, useChains, useSwitchChain } from 'wagmi'
import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/common'
import { cn } from '@/lib/cn'

export interface NetworkBadgeProps {
  showIcon?: boolean
  showWarning?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function NetworkBadge({
  showIcon = true,
  showWarning = true,
  size = 'sm',
  className,
}: NetworkBadgeProps) {
  const chainId = useChainId()
  const chains = useChains()
  const { switchChain } = useSwitchChain()

  const currentChain = chains.find((c) => c.id === chainId)
  const isSupported = !!currentChain

  if (!isSupported && showWarning) {
    return (
      <button
        onClick={() => switchChain?.({ chainId: chains[0]?.id })}
        className={cn('flex items-center', className)}
      >
        <Badge variant="error" size={size} className="cursor-pointer gap-1.5">
          {showIcon && <AlertTriangle className="h-3 w-3" />}
          Wrong Network
        </Badge>
      </button>
    )
  }

  if (!currentChain) {
    return null
  }

  return (
    <Badge variant="default" size={size} className={cn('gap-1.5', className)}>
      {showIcon && (
        <span className="h-2 w-2 rounded-full bg-green-500" />
      )}
      {currentChain.name}
    </Badge>
  )
}
