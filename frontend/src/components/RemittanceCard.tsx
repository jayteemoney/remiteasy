import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Target, User, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { formatCelo } from '../lib/constants'
import { Remittance } from '../hooks/useRemitEscrow'
import { ContributionTracker } from './ContributionTracker'

interface RemittanceCardProps {
  remittanceId: number
  remittance: Remittance
  isCreator: boolean
  isRecipient: boolean
}

/**
 * RemittanceCard Component
 * Displays a single remittance with progress, status, and contribution controls
 */
export function RemittanceCard({
  remittanceId,
  remittance,
  isCreator,
  isRecipient,
}: RemittanceCardProps) {
  // Memoize progress calculation to avoid expensive BigInt arithmetic on every render
  const progress = useMemo(
    () => Number(remittance.currentAmount * 100n / remittance.targetAmount),
    [remittance.currentAmount, remittance.targetAmount]
  )

  const isComplete = remittance.currentAmount >= remittance.targetAmount

  // Format date
  const createdDate = new Date(Number(remittance.createdAt) * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  // Truncate address
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Status badge
  const getStatusBadge = () => {
    if (remittance.isCancelled) {
      return (
        <div className="flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-xs font-medium text-red-500">Cancelled</span>
        </div>
      )
    }
    if (remittance.isReleased) {
      return (
        <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-xs font-medium text-green-500">Released</span>
        </div>
      )
    }
    if (isComplete) {
      return (
        <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <Target className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-medium text-blue-500">Target Met</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-medium text-amber-500">Active</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Remittance #{remittanceId}
            </h3>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {remittance.purpose}
          </p>
        </div>
      </div>

      {/* Amount Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatCelo(remittance.currentAmount)} CELO
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Target</p>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {formatCelo(remittance.targetAmount)} CELO
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${
              isComplete
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}
          />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <User className="w-4 h-4" />
          <span>Creator:</span>
          <span className="font-mono text-gray-900 dark:text-white">
            {truncateAddress(remittance.creator)}
          </span>
          {isCreator && (
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs rounded">
              You
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Target className="w-4 h-4" />
          <span>Recipient:</span>
          <span className="font-mono text-gray-900 dark:text-white">
            {truncateAddress(remittance.recipient)}
          </span>
          {isRecipient && (
            <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded">
              You
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Created:</span>
          <span className="text-gray-900 dark:text-white">{createdDate}</span>
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
    </motion.div>
  )
}
