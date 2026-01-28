import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAddress } from 'viem'
import { Info } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/common'
import { useCreateRemittance, usePlatformInfo } from '@/hooks/contracts'
import toast from 'react-hot-toast'
import { cn } from '@/lib/cn'

export interface CreateRemittanceFormProps {
  onSuccess?: (hash: string) => void
  onCancel?: () => void
  className?: string
}

export function CreateRemittanceForm({
  onSuccess,
  onCancel,
  className,
}: CreateRemittanceFormProps) {
  const navigate = useNavigate()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [recipientError, setRecipientError] = useState('')

  const { platformFeePercent } = usePlatformInfo()
  const {
    createRemittance,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  } = useCreateRemittance()

  // Calculate fee breakdown
  const amountNum = parseFloat(amount) || 0
  const feeAmount = amountNum * (platformFeePercent / 100)
  const recipientReceives = amountNum - feeAmount

  // Validation - only called on blur/change, not during render
  const validateRecipient = (value: string) => {
    if (!value) {
      setRecipientError('')
      return false
    }
    if (!isAddress(value)) {
      setRecipientError('Please enter a valid Ethereum address')
      return false
    }
    setRecipientError('')
    return true
  }

  // Check form validity without calling setState
  const isRecipientValid = recipient.length > 0 && isAddress(recipient)
  const isValidForm =
    isRecipientValid &&
    amountNum > 0 &&
    purpose.length > 0

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidForm) return
    if (!isAddress(recipient)) {
      setRecipientError('Please enter a valid Ethereum address')
      return
    }

    createRemittance(recipient, amount, purpose)
  }

  // Handle success
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('Remittance created successfully!')
      onSuccess?.(hash)
      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    }
  }, [isSuccess, hash, onSuccess, navigate])

  // Handle error
  useEffect(() => {
    if (error) {
      const message = error.message.toLowerCase()
      if (message.includes('user rejected') || message.includes('user denied')) {
        toast.error('Transaction cancelled')
      } else {
        toast.error('Failed to create remittance. Please try again.')
      }
      reset()
    }
  }, [error, reset])

  const isSubmitting = isPending || isConfirming

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create New Remittance</CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Set up a new remittance for others to contribute to
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Recipient Address"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value)
              if (e.target.value) validateRecipient(e.target.value)
            }}
            onBlur={() => validateRecipient(recipient)}
            error={recipientError}
            helperText={!recipientError ? 'The Celo wallet address that will receive the funds' : undefined}
            disabled={isSubmitting}
          />

          <Input
            label="Target Amount"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            rightElement={<span className="text-sm font-medium">CELO</span>}
            helperText="The total amount you want to collect"
            disabled={isSubmitting}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Purpose
            </label>
            <textarea
              className={cn(
                'flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100',
                isSubmitting && 'cursor-not-allowed opacity-50'
              )}
              placeholder="What is this remittance for?"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              maxLength={200}
              disabled={isSubmitting}
            />
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              {purpose.length}/200 characters
            </p>
          </div>

          {/* Fee Breakdown */}
          {amountNum > 0 && (
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Info className="h-4 w-4" />
                Fee Breakdown
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Platform Fee ({platformFeePercent}%)
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {feeAmount.toFixed(4)} CELO
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Recipient Receives
                  </span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    {recipientReceives.toFixed(4)} CELO
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className={cn('flex-1', !onCancel && 'w-full')}
              size="lg"
              disabled={!isValidForm || isSubmitting}
              isLoading={isSubmitting}
            >
              {isPending
                ? 'Confirm in Wallet...'
                : isConfirming
                  ? 'Creating...'
                  : 'Create Remittance'}
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            By creating a remittance, you agree to our terms of service.
            Funds will be held in escrow until released by the recipient.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
