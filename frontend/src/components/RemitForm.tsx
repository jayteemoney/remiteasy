import { useState, useEffect, FormEvent } from 'react'
import { useAccount } from 'wagmi'
import { PlusCircle, Loader2, Send, Phone, Wallet, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCreateRemittance } from '../hooks/useRemitEscrow'
import { parseCelo } from '../lib/constants'
import { VALIDATION } from '../lib/config'
import { resolvePhoneToAddress, getTestPhoneNumbers, formatPhoneNumber } from '../lib/minipay'

/**
 * RemitForm Component
 * Form for creating new remittance requests
 * Supports recipient address/phone number, target amount, and purpose
 */
export function RemitForm() {
  const { address, isConnected } = useAccount()
  const { createRemittance, isPending, isConfirming, isSuccess } = useCreateRemittance()

  const [recipient, setRecipient] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [usePhoneNumber, setUsePhoneNumber] = useState(false)
  const [resolvedAddress, setResolvedAddress] = useState<`0x${string}` | null>(null)
  const [showTestNumbers, setShowTestNumbers] = useState(false)
  const [isResolving, setIsResolving] = useState(false)

  // Reset form on success
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

    // Validate inputs
    if (!recipient || !targetAmount || !purpose) {
      toast.error('Please fill in all fields')
      return
    }

    // Validate amount
    const amount = parseFloat(targetAmount)
    if (isNaN(amount)) {
      toast.error('Please enter a valid amount')
      return
    }

    // Enforce minimum amount
    if (amount < VALIDATION.MIN_REMITTANCE_AMOUNT) {
      toast.error(`Amount must be at least ${VALIDATION.MIN_REMITTANCE_AMOUNT} CELO`)
      return
    }

    // Enforce maximum amount
    if (amount > VALIDATION.MAX_REMITTANCE_AMOUNT) {
      toast.error(`Amount cannot exceed ${VALIDATION.MAX_REMITTANCE_AMOUNT.toLocaleString()} CELO`)
      return
    }

    // Validate decimal precision (max 18 decimals)
    const decimalPlaces = targetAmount.split('.')[1]?.length || 0
    if (decimalPlaces > VALIDATION.AMOUNT_DECIMALS) {
      toast.error(`Amount can have at most ${VALIDATION.AMOUNT_DECIMALS} decimal places`)
      return
    }

    // Validate purpose length
    if (purpose.length > VALIDATION.MAX_PURPOSE_LENGTH) {
      toast.error(`Purpose must be ${VALIDATION.MAX_PURPOSE_LENGTH} characters or less`)
      return
    }

    let finalRecipientAddress: `0x${string}`

    // Resolve phone number to address if needed
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
        toast.success(`Phone resolved to ${result.address.slice(0, 6)}...${result.address.slice(-4)}`)
      } catch (error) {
        console.error('Error resolving phone:', error)
        toast.error('Failed to resolve phone number')
        setIsResolving(false)
        return
      } finally {
        setIsResolving(false)
      }
    } else {
      // Direct address input
      if (!recipient.startsWith('0x')) {
        toast.error('Please enter a valid address starting with 0x')
        return
      }
      finalRecipientAddress = recipient as `0x${string}`
    }

    try {
      const amountInWei = parseCelo(targetAmount)
      createRemittance(finalRecipientAddress, amountInWei, purpose)
      toast.loading('Creating remittance...', { id: 'create-remittance' })
    } catch (error) {
      console.error('Error creating remittance:', error)
      toast.error('Failed to create remittance')
    }
  }

  const handleTestNumberSelect = (phone: string) => {
    setRecipient(phone)
    setShowTestNumbers(false)
    toast.success(`Test number selected: ${formatPhoneNumber(phone)}`)
  }

  if (isPending || isConfirming) {
    toast.loading('Transaction pending...', { id: 'create-remittance' })
  }

  if (isSuccess) {
    toast.dismiss('create-remittance')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <PlusCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create Remittance
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start a new group contribution
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Input */}
        <div>
          <label
            htmlFor="recipient-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Recipient {usePhoneNumber ? 'Phone Number' : 'Address'}
          </label>
          <div className="space-y-2">
            {/* Input Mode Toggle */}
            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setUsePhoneNumber(false)
                  setRecipient('')
                  setResolvedAddress(null)
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all ${
                  !usePhoneNumber
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                aria-label="Use wallet address"
              >
                <Wallet className="w-4 h-4" />
                <span className="text-sm font-medium">Address</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsePhoneNumber(true)
                  setRecipient('')
                  setResolvedAddress(null)
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all ${
                  usePhoneNumber
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                aria-label="Use phone number with MiniPay"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Phone (MiniPay)</span>
              </button>
            </div>

            {/* Input Field */}
            <div className="relative">
              <input
                id="recipient-input"
                type="text"
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value)
                  setResolvedAddress(null)
                }}
                placeholder={usePhoneNumber ? '+254712345678' : '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                disabled={isPending || isConfirming || isResolving}
                aria-describedby={usePhoneNumber ? "phone-help" : "address-help"}
              />
              {isResolving && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                </div>
              )}
            </div>

            {/* Resolved Address Display */}
            <AnimatePresence>
              {resolvedAddress && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ Resolved to: <span className="font-mono">{resolvedAddress}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MiniPay Test Numbers */}
            {usePhoneNumber && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowTestNumbers(!showTestNumbers)}
                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  aria-label="Show test phone numbers"
                  aria-expanded={showTestNumbers}
                >
                  <Info className="w-4 h-4" />
                  {showTestNumbers ? 'Hide' : 'Show'} test phone numbers
                </button>

                <AnimatePresence>
                  {showTestNumbers && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2"
                      role="region"
                      aria-label="Test phone numbers"
                    >
                      <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-2">
                        Click to use a test number:
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        {getTestPhoneNumbers().slice(0, 4).map((test) => (
                          <button
                            key={test.phone}
                            type="button"
                            onClick={() => handleTestNumberSelect(test.phone)}
                            className="text-left px-2 py-1 text-xs bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded border border-blue-200 dark:border-blue-700 transition-colors"
                            aria-label={`Use test number for ${test.country}`}
                          >
                            <span className="font-mono text-blue-600 dark:text-blue-400">{test.phone}</span>
                            <span className="text-gray-600 dark:text-gray-400"> ({test.country})</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p id="phone-help" className="text-xs text-gray-500 dark:text-gray-400">
                  Enter phone number in international format (e.g., +254712345678)
                </p>
              </div>
            )}

            {!usePhoneNumber && (
              <p id="address-help" className="text-xs text-gray-500 dark:text-gray-400">
                Enter recipient's Celo wallet address (0x...)
              </p>
            )}
          </div>
        </div>

        {/* Target Amount */}
        <div>
          <label
            htmlFor="target-amount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Target Amount (CELO)
          </label>
          <input
            id="target-amount"
            type="number"
            step="0.000000000000000001"
            min={VALIDATION.MIN_REMITTANCE_AMOUNT}
            max={VALIDATION.MAX_REMITTANCE_AMOUNT}
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="100.00"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all"
            disabled={isPending || isConfirming}
            aria-describedby="amount-help"
          />
          <p id="amount-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Between {VALIDATION.MIN_REMITTANCE_AMOUNT} and {VALIDATION.MAX_REMITTANCE_AMOUNT.toLocaleString()} CELO (max {VALIDATION.AMOUNT_DECIMALS} decimals)
          </p>
        </div>

        {/* Purpose */}
        <div>
          <label
            htmlFor="purpose"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Purpose
          </label>
          <textarea
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g., Family medical expenses, School fees, Emergency fund..."
            rows={3}
            maxLength={VALIDATION.MAX_PURPOSE_LENGTH}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 transition-all resize-none"
            disabled={isPending || isConfirming}
            aria-describedby="purpose-help"
          />
          <div className="flex items-center justify-between mt-1">
            <p id="purpose-help" className="text-xs text-gray-500 dark:text-gray-400">
              Describe what this remittance is for
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {purpose.length}/{VALIDATION.MAX_PURPOSE_LENGTH}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isPending || isConfirming || !isConnected || isResolving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
          aria-label="Create remittance"
        >
          {isPending || isConfirming || isResolving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              <span>
                {isResolving
                  ? 'Resolving phone...'
                  : isPending
                  ? 'Confirm in wallet...'
                  : 'Creating...'}
              </span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" aria-hidden="true" />
              <span>Create Remittance</span>
            </>
          )}
        </motion.button>

        {!isConnected && (
          <p className="text-center text-sm text-amber-600 dark:text-amber-400" role="alert">
            Please connect your wallet to create a remittance
          </p>
        )}
      </form>
    </motion.div>
  )
}
