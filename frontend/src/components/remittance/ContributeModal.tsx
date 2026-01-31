import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button, Input } from '@/components/common'
import { RemittanceProgress } from './RemittanceProgress'
import { useContribute } from '@/hooks/contracts'
import { formatCeloWithSymbol, formatCelo } from '@/lib/format'
import toast from 'react-hot-toast'
import type { Remittance } from '@/types/remittance'

export interface ContributeModalProps {
  remittance: Remittance
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ContributeModal({
  remittance,
  isOpen,
  onClose,
  onSuccess,
}: ContributeModalProps) {
  const [amount, setAmount] = useState('')
  const { address } = useAccount()
  const { data: balance } = useBalance({
    address,
    query: {
      staleTime: 30_000,
      gcTime: 60_000,
      refetchOnWindowFocus: false,
    },
  })
  const {
    contribute,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  } = useContribute()

  const amountNum = parseFloat(amount) || 0
  const remainingAmount = remittance.targetAmount - remittance.currentAmount
  const remainingNum = Number(remainingAmount) / 1e18
  const balanceNum = balance ? Number(balance.value) / 1e18 : 0

  const isValidAmount = amountNum > 0 && amountNum <= balanceNum

  const handleContribute = () => {
    if (!isValidAmount) return
    contribute(remittance.id, amount)
  }

  const handleSetMax = () => {
    // Set to minimum of balance or remaining amount
    const maxAmount = Math.min(balanceNum, remainingNum)
    setAmount(maxAmount.toFixed(4))
  }

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success('Contribution successful!')
      onSuccess?.()
      setAmount('')
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
      } else {
        toast.error('Contribution failed. Please try again.')
      }
      reset()
    }
  }, [error, reset])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAmount('')
      reset()
    }
  }, [isOpen, reset])

  const isSubmitting = isPending || isConfirming

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!isSubmitting}>
      <ModalHeader>
        <ModalTitle>Contribute to Remittance</ModalTitle>
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* Remittance Summary */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <p className="font-medium text-gray-900 dark:text-white">
            {remittance.purpose}
          </p>
          <div className="mt-3">
            <RemittanceProgress
              currentAmount={remittance.currentAmount}
              targetAmount={remittance.targetAmount}
              size="sm"
              showLabels={false}
            />
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {remittance.progress}% funded
              </span>
              <span className="text-gray-900 dark:text-white">
                {formatCeloWithSymbol(remainingAmount)} remaining
              </span>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <Input
            label="Contribution Amount"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            rightElement={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSetMax}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  MAX
                </button>
                <span className="text-sm font-medium">CELO</span>
              </div>
            }
            error={amountNum > balanceNum ? 'Insufficient balance' : undefined}
            disabled={isSubmitting}
          />
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Balance: {balance ? formatCelo(balance.value) : '0'} CELO
          </p>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleContribute}
          disabled={!isValidAmount || isSubmitting}
          isLoading={isSubmitting}
        >
          {isPending
            ? 'Confirm in Wallet...'
            : isConfirming
              ? 'Contributing...'
              : 'Contribute'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
