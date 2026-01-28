import { useEffect } from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from '@/components/common'
import { useReleaseFunds, usePlatformInfo } from '@/hooks/contracts'
import { formatCeloWithSymbol } from '@/lib/format'
import toast from 'react-hot-toast'
import type { Remittance } from '@/types/remittance'

export interface ReleaseModalProps {
  remittance: Remittance
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ReleaseModal({
  remittance,
  isOpen,
  onClose,
  onSuccess,
}: ReleaseModalProps) {
  const { platformFeePercent } = usePlatformInfo()
  const {
    releaseFunds,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  } = useReleaseFunds()

  // Calculate amounts
  const feeAmount = (remittance.currentAmount * BigInt(Math.round(platformFeePercent * 100))) / 10000n
  const recipientReceives = remittance.currentAmount - feeAmount

  const handleRelease = () => {
    releaseFunds(remittance.id)
  }

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success('Funds released successfully!')
      onSuccess?.()
      reset()
      onClose()
    }
  }, [isSuccess, onSuccess, onClose, reset])

  // Handle error
  useEffect(() => {
    if (error) {
      const message = error.message.toLowerCase()
      if (message.includes('user rejected') || message.includes('user denied')) {
        toast.error('Transaction cancelled')
      } else if (message.includes('not recipient')) {
        toast.error('Only the recipient can release funds')
      } else {
        toast.error('Failed to release funds. Please try again.')
      }
      reset()
    }
  }, [error, reset])

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const isSubmitting = isPending || isConfirming

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!isSubmitting}>
      <ModalHeader>
        <ModalTitle>Release Funds</ModalTitle>
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* Success indicator */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Remittance Fully Funded!
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You can now release the funds to your wallet.
          </p>
        </div>

        {/* Amount breakdown */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {remittance.purpose}
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Total Collected</span>
              <span className="text-gray-900 dark:text-white">
                {formatCeloWithSymbol(remittance.currentAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Platform Fee ({platformFeePercent}%)
              </span>
              <span className="text-gray-900 dark:text-white">
                -{formatCeloWithSymbol(feeAmount)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                You Receive
              </span>
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                {formatCeloWithSymbol(recipientReceives)}
              </span>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="flex gap-3 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            This action is irreversible. Once released, the funds will be sent to your wallet
            and contributors cannot be refunded.
          </p>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleRelease}
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {isPending
            ? 'Confirm in Wallet...'
            : isConfirming
              ? 'Releasing...'
              : 'Release Funds'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
