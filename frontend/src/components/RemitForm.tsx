import { useState, useEffect, FormEvent } from 'react'
import { useAccount } from 'wagmi'
import { Loader2, Send, Phone, Wallet, ChevronDown, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCreateRemittance } from '../hooks/useRemitEscrow'
import { parseCelo } from '../lib/constants'
import { VALIDATION } from '../lib/config'
import { resolvePhoneToAddress, getTestPhoneNumbers, formatPhoneNumber } from '../lib/minipay'
import { sanitizePurpose } from '../lib/sanitize'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

export function RemitForm() {
  const { address, isConnected } = useAccount()
  const { createRemittance, status } = useCreateRemittance()

  const isPending = status === 'pending'
  const isConfirming = status === 'confirming'
  const isSuccess = status === 'success'

  const [recipient, setRecipient] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [usePhoneNumber, setUsePhoneNumber] = useState(false)
  const [resolvedAddress, setResolvedAddress] = useState<`0x${string}` | null>(null)
  const [showTestNumbers, setShowTestNumbers] = useState(false)
  const [isResolving, setIsResolving] = useState(false)

  useEffect(() => {
    if (isSuccess) {
      setRecipient('')
      setTargetAmount('')
      setPurpose('')
      setResolvedAddress(null)
      toast.success('Remittance created successfully!')
    }
  }, [isSuccess])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!isConnected || !address) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!recipient || !targetAmount || !purpose) {
      toast.error('Please fill in all fields')
      return
    }

    const amount = parseFloat(targetAmount)
    if (isNaN(amount)) {
      toast.error('Please enter a valid amount')
      return
    }

    if (amount < VALIDATION.MIN_REMITTANCE_AMOUNT) {
      toast.error(`Amount must be at least ${VALIDATION.MIN_REMITTANCE_AMOUNT} CELO`)
      return
    }

    if (amount > VALIDATION.MAX_REMITTANCE_AMOUNT) {
      toast.error(`Amount cannot exceed ${VALIDATION.MAX_REMITTANCE_AMOUNT.toLocaleString()} CELO`)
      return
    }

    const decimalPlaces = targetAmount.split('.')[1]?.length || 0
    if (decimalPlaces > VALIDATION.AMOUNT_DECIMALS) {
      toast.error(`Amount can have at most ${VALIDATION.AMOUNT_DECIMALS} decimal places`)
      return
    }

    if (purpose.length > VALIDATION.MAX_PURPOSE_LENGTH) {
      toast.error(`Purpose must be ${VALIDATION.MAX_PURPOSE_LENGTH} characters or less`)
      return
    }

    let finalRecipientAddress: `0x${string}`

    if (usePhoneNumber) {
      setIsResolving(true)
      try {
        const result = await resolvePhoneToAddress(recipient)

        if (result.error || !result.address) {
          toast.error(result.error || 'Failed to resolve phone number')
          setIsResolving(false)
          return
        }

        finalRecipientAddress = result.address
        setResolvedAddress(result.address)
        toast.success(`Resolved to ${result.address.slice(0, 6)}...${result.address.slice(-4)}`)
      } catch {
        toast.error('Failed to resolve phone number')
        setIsResolving(false)
        return
      } finally {
        setIsResolving(false)
      }
    } else {
      if (!recipient.startsWith('0x')) {
        toast.error('Please enter a valid address starting with 0x')
        return
      }
      finalRecipientAddress = recipient as `0x${string}`
    }

    try {
      const amountInWei = parseCelo(targetAmount)
      const sanitizedPurpose = sanitizePurpose(purpose)
      createRemittance(finalRecipientAddress, amountInWei, sanitizedPurpose)
      toast.loading('Creating remittance...', { id: 'create-remittance' })
    } catch {
      toast.error('Failed to create remittance')
    }
  }

  const handleTestNumberSelect = (phone: string) => {
    setRecipient(phone)
    setShowTestNumbers(false)
    toast.success(`Selected: ${formatPhoneNumber(phone)}`)
  }

  if (isPending || isConfirming) {
    toast.loading('Transaction pending...', { id: 'create-remittance' })
  }

  if (isSuccess) {
    toast.dismiss('create-remittance')
  }

  return (
    <Card className="p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Input */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Recipient
          </label>

          {/* Input Mode Toggle */}
          <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-3">
            <button
              type="button"
              onClick={() => {
                setUsePhoneNumber(false)
                setRecipient('')
                setResolvedAddress(null)
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                !usePhoneNumber
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              Address
            </button>
            <button
              type="button"
              onClick={() => {
                setUsePhoneNumber(true)
                setRecipient('')
                setResolvedAddress(null)
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                usePhoneNumber
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Phone
            </button>
          </div>

          {/* Input Field */}
          <div className="relative">
            <input
              type="text"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value)
                setResolvedAddress(null)
              }}
              placeholder={usePhoneNumber ? '+254712345678' : '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all disabled:opacity-50"
              disabled={isPending || isConfirming || isResolving}
            />
            {isResolving && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
              </div>
            )}
          </div>

          {/* Resolved Address */}
          <AnimatePresence>
            {resolvedAddress && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2"
              >
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 truncate">
                    {resolvedAddress}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Test Numbers for Phone */}
          {usePhoneNumber && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowTestNumbers(!showTestNumbers)}
                className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-orange-500 dark:hover:text-orange-400"
              >
                <ChevronDown className={`w-3 h-3 transition-transform ${showTestNumbers ? 'rotate-180' : ''}`} />
                {showTestNumbers ? 'Hide' : 'Show'} test numbers
              </button>

              <AnimatePresence>
                {showTestNumbers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-2 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {getTestPhoneNumbers().slice(0, 4).map((test) => (
                        <button
                          key={test.phone}
                          type="button"
                          onClick={() => handleTestNumberSelect(test.phone)}
                          className="text-left px-2 py-1.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
                        >
                          <span className="font-mono text-orange-600 dark:text-orange-400">{test.phone}</span>
                          <span className="text-neutral-400 ml-1">({test.country})</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Amount (CELO)
          </label>
          <input
            type="number"
            step="0.000000000000000001"
            min={VALIDATION.MIN_REMITTANCE_AMOUNT}
            max={VALIDATION.MAX_REMITTANCE_AMOUNT}
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="100.00"
            className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all disabled:opacity-50"
            disabled={isPending || isConfirming}
          />
          <p className="text-[10px] text-neutral-400 mt-1">
            Min {VALIDATION.MIN_REMITTANCE_AMOUNT} · Max {VALIDATION.MAX_REMITTANCE_AMOUNT.toLocaleString()} CELO
          </p>
        </div>

        {/* Purpose */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Purpose
            </label>
            <span className="text-[10px] text-neutral-400">
              {purpose.length}/{VALIDATION.MAX_PURPOSE_LENGTH}
            </span>
          </div>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g., Family medical expenses, School fees..."
            rows={2}
            maxLength={VALIDATION.MAX_PURPOSE_LENGTH}
            className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all resize-none disabled:opacity-50"
            disabled={isPending || isConfirming}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          disabled={isPending || isConfirming || !isConnected || isResolving}
          isLoading={isPending || isConfirming || isResolving}
          className="mt-2"
        >
          {isResolving ? (
            'Resolving...'
          ) : isPending ? (
            'Confirm in wallet...'
          ) : isConfirming ? (
            'Creating...'
          ) : (
            <>
              <Send className="w-4 h-4" />
              Create Remittance
            </>
          )}
        </Button>

        {!isConnected && (
          <p className="text-center text-xs text-amber-600 dark:text-amber-400">
            Connect your wallet to create a remittance
          </p>
        )}
      </form>
    </Card>
  )
}
