import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button, Input } from '@/components/common'
import { useCancelRemittance, useContributors } from '@/hooks/contracts'
import { formatCeloWithSymbol, formatAddress } from '@/lib/format'
import toast from 'react-hot-toast'
import type { Remittance } from '@/types/remittance'

export interface CancelModalProps {
  remittance: Remittance
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CancelModal({
  remittance,
  isOpen,
  onClose,
  onSuccess,
}: CancelModalProps) {
  const [confirmText, setConfirmText] = useState('')
  const { data: contributors } = useContributors(remittance.id)
  const {
    cancelRemittance,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  } = useCancelRemittance()

  const isConfirmed = confirmText.toUpperCase() === 'CANCEL'

  const handleCancel = () => {
    if (!isConfirmed) return
    cancelRemittance(remittance.id)
  }

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success('Remittance cancelled. Contributors have been refunded.')
      onSuccess?.()
      setConfirmText('')
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
      } else if (message.includes('not creator')) {
        toast.error('Only the creator can cancel this remittance')
      } else if (message.includes('already released')) {
        toast.error('Cannot cancel: funds have already been released')
      } else {
        toast.error('Failed to cancel remittance. Please try again.')
      }
      reset()
    }
  }, [error, reset])

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmText('')
      reset()
    }
  }, [isOpen, reset])

  const isSubmitting = isPending || isConfirming
  const hasContributions = remittance.currentAmount > 0n

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!isSubmitting}>
      <ModalHeader>
        <ModalTitle>Cancel Remittance</ModalTitle>
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* Warning */}
        <div className="flex gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <p className="font-medium text-red-800 dark:text-red-200">
              This action cannot be undone
            </p>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              Cancelling this remittance will refund all contributors their original contributions.
            </p>
          </div>
        </div>

        {/* Remittance Info */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <p className="font-medium text-gray-900 dark:text-white">
            {remittance.purpose}
          </p>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <p>Collected: {formatCeloWithSymbol(remittance.currentAmount)}</p>
            <p>Target: {formatCeloWithSymbol(remittance.targetAmount)}</p>
          </div>
        </div>

        {/* Contributors to be refunded */}
        {hasContributions && contributors && contributors.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Contributors to be refunded ({contributors.length}):
            </p>
            <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
              {contributors.map((contributor) => (
                <div
                  key={contributor.address}
                  className="flex items-center justify-between border-b border-gray-100 px-3 py-2 last:border-0 dark:border-gray-800"
                >
                  <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                    {formatAddress(contributor.address)}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatCeloWithSymbol(contributor.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation Input */}
        <Input
          label='Type "CANCEL" to confirm'
          placeholder="CANCEL"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          disabled={isSubmitting}
        />
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Go Back
        </Button>
        <Button
          variant="destructive"
          onClick={handleCancel}
          disabled={!isConfirmed || isSubmitting}
          isLoading={isSubmitting}
        >
          {isPending
            ? 'Confirm in Wallet...'
            : isConfirming
              ? 'Cancelling...'
              : 'Cancel Remittance'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
