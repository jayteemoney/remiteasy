import { Badge } from '@/components/common'
import type { RemittanceStatus as Status } from '@/types/remittance'
import { cn } from '@/lib/cn'

export interface RemittanceStatusProps {
  status: Status
  progress?: number
  showDot?: boolean
  size?: 'sm' | 'md'
  className?: string
}

const statusConfig: Record<Status | 'funded', { label: string; variant: 'info' | 'success' | 'default' | 'warning' }> = {
  active: { label: 'Active', variant: 'info' },
  funded: { label: 'Fully Funded', variant: 'warning' },
  released: { label: 'Released', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'default' },
}

export function RemittanceStatus({
  status,
  progress = 0,
  showDot = true,
  size = 'sm',
  className,
}: RemittanceStatusProps) {
  // Determine effective status (fully funded is a special case of active)
  const effectiveStatus = status === 'active' && progress >= 100 ? 'funded' : status
  const config = statusConfig[effectiveStatus]

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={cn('gap-1.5', className)}
    >
      {showDot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            effectiveStatus === 'active' && 'bg-blue-500 animate-pulse',
            effectiveStatus === 'funded' && 'bg-yellow-500 animate-pulse',
            effectiveStatus === 'released' && 'bg-green-500',
            effectiveStatus === 'cancelled' && 'bg-gray-500'
          )}
        />
      )}
      {config.label}
    </Badge>
  )
}
