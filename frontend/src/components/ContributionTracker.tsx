import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Heart, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  useContribute,
  useReleaseFunds,
  useCancelRemittance,
  Remittance,
} from '../hooks/useRemitEscrow'
import { parseCelo } from '../lib/constants'

interface ContributionTrackerProps {
  remittanceId: number
  remittance: Remittance
  isCreator: boolean
  isRecipient: boolean
  isComplete: boolean
}

/**
 * ContributionTracker Component
 * Handles contributions, fund release, and cancellation for a remittance
 */
export function ContributionTracker({
  remittanceId,
  remittance,
  isCreator,
  isRecipient,
  isComplete,
}: ContributionTrackerProps) {
  const { address, isConnected } = useAccount()
  const [contributionAmount, setContributionAmount] = useState('')
  const [showContributeInput, setShowContributeInput] = useState(false)

  const {
    contribute,
    isPending: isContributing,
    isConfirming: isContributeConfirming,
    isSuccess: isContributeSuccess,
  } = useContribute()

  const {
    releaseFunds,
    isPending: isReleasing,
    isConfirming: isReleaseConfirming,
    isSuccess: isReleaseSuccess,
  } = useReleaseFunds()

  const {
    cancelRemittance,
    isPending: isCancelling,
    isConfirming: isCancelConfirming,
    isSuccess: isCancelSuccess,
  } = useCancelRemittance()

  const handleContribute = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet')
      return
    }

    const amount = parseFloat(contributionAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    try {
      const amountInWei = parseCelo(contributionAmount)
      contribute(remittanceId, amountInWei)
      toast.loading('Contributing...', { id: `contribute-${remittanceId}` })
      setContributionAmount('')
      setShowContributeInput(false)
    } catch (error) {
      console.error('Error contributing:', error)
      toast.error('Failed to contribute')
    }
  }

  const handleRelease = async () => {
    if (!isRecipient) {
      toast.error('Only the recipient can release funds')
      return
    }

    try {
      releaseFunds(remittanceId)
      toast.loading('Releasing funds...', { id: `release-${remittanceId}` })
    } catch (error) {
      console.error('Error releasing funds:', error)
      toast.error('Failed to release funds')
    }
  }

  const handleCancel = async () => {
    if (!isCreator) {
      toast.error('Only the creator can cancel')
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to cancel this remittance? All contributors will be refunded.'
    )
    if (!confirmed) return

    try {
      cancelRemittance(remittanceId)
      toast.loading('Cancelling...', { id: `cancel-${remittanceId}` })
    } catch (error) {
      console.error('Error cancelling:', error)
      toast.error('Failed to cancel')
    }
  }

  // Handle success states
  if (isContributeSuccess) {
    toast.dismiss(`contribute-${remittanceId}`)
    toast.success('Contribution successful!')
  }

  if (isReleaseSuccess) {
    toast.dismiss(`release-${remittanceId}`)
    toast.success('Funds released successfully!')
  }

  if (isCancelSuccess) {
    toast.dismiss(`cancel-${remittanceId}`)
    toast.success('Remittance cancelled and refunds processed!')
  }

  const remainingAmount = remittance.targetAmount - remittance.currentAmount
  const remainingFormatted = (Number(remainingAmount) / 1e18).toFixed(2)

  return (
    <div className="space-y-3">
      {/* Contribute Section */}
      {!isComplete && (
        <div className="space-y-2">
          {showContributeInput ? (
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder={`Max: ${remainingFormatted} CELO`}
                className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                disabled={isContributing || isContributeConfirming}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContribute}
                disabled={isContributing || isContributeConfirming || !contributionAmount}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white text-sm font-medium rounded-lg transition-all disabled:cursor-not-allowed"
              >
                {isContributing || isContributeConfirming ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Send'
                )}
              </motion.button>
              <button
                onClick={() => {
                  setShowContributeInput(false)
                  setContributionAmount('')
                }}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowContributeInput(true)}
              disabled={!isConnected}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg shadow-md transition-all disabled:cursor-not-allowed"
            >
              <Heart className="w-4 h-4" />
              <span>Contribute</span>
            </motion.button>
          )}
        </div>
      )}

      {/* Release Button (for recipient when target met) */}
      {isComplete && isRecipient && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleRelease}
          disabled={isReleasing || isReleaseConfirming}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg shadow-md transition-all disabled:cursor-not-allowed"
        >
          {isReleasing || isReleaseConfirming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Release Funds</span>
            </>
          )}
        </motion.button>
      )}

      {/* Cancel Button (for creator) */}
      {!isComplete && isCreator && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleCancel}
          disabled={isCancelling || isCancelConfirming}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg shadow-md transition-all disabled:cursor-not-allowed"
        >
          {isCancelling || isCancelConfirming ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cancelling...</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4" />
              <span>Cancel & Refund</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  )
}
