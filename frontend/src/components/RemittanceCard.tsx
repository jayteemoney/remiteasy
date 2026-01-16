import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Target, User, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { formatCelo } from '../lib/constants'
import { Remittance } from '../hooks/useRemitEscrow'
import { ContributionTracker } from './ContributionTracker'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'

interface RemittanceCardProps {
  remittanceId: number
  remittance: Remittance
  isCreator: boolean
  isRecipient: boolean
}

export function RemittanceCard({
  remittanceId,
  remittance,
  isCreator,
  isRecipient,
}: RemittanceCardProps) {
  const progress = useMemo(
    () => Number(remittance.currentAmount * 100n / remittance.targetAmount),
    [remittance.currentAmount, remittance.targetAmount]
  )

  const isComplete = remittance.currentAmount >= remittance.targetAmount

  const createdDate = new Date(Number(remittance.createdAt) * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const getStatusBadge = () => {
    if (remittance.isCancelled) {
      return (
        <Badge variant="danger" size="sm">
          <XCircle className="w-3 h-3" />
          Cancelled
        </Badge>
      )
    }
    if (remittance.isReleased) {
      return (
        <Badge variant="success" size="sm">
          <CheckCircle2 className="w-3 h-3" />
          Released
        </Badge>
      )
    }
    if (isComplete) {
      return (
        <Badge variant="info" size="sm">
          <Target className="w-3 h-3" />
          Ready
        </Badge>
      )
    }
    return (
      <Badge variant="warning" size="sm">
        <Clock className="w-3 h-3" />
        Active
      </Badge>
    )
  }

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              #{remittanceId}
            </span>
            {getStatusBadge()}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            {remittance.purpose}
          </p>
        </div>
      </div>

      {/* Amount Row */}
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <span className="text-lg font-semibold text-neutral-900 dark:text-white">
            {formatCelo(remittance.currentAmount)}
          </span>
          <span className="text-xs text-neutral-400 ml-1">
            / {formatCelo(remittance.targetAmount)} CELO
          </span>
        </div>
        <span className="text-sm font-medium text-neutral-900 dark:text-white">
          {progress.toFixed(0)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isComplete
                ? 'bg-emerald-500'
                : 'bg-orange-500'
            }`}
          />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-neutral-500 dark:text-neutral-400 mb-3">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span className="font-mono">{truncateAddress(remittance.creator)}</span>
          {isCreator && <span className="text-orange-500">(you)</span>}
        </div>
        <div className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          <span className="font-mono">{truncateAddress(remittance.recipient)}</span>
          {isRecipient && <span className="text-emerald-500">(you)</span>}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{createdDate}</span>
        </div>
      </div>

      {/* Action Controls */}
      {!remittance.isReleased && !remittance.isCancelled && (
        <ContributionTracker
          remittanceId={remittanceId}
          remittance={remittance}
          isCreator={isCreator}
          isRecipient={isRecipient}
          isComplete={isComplete}
        />
      )}
    </Card>
  )
}
