import { useState, useCallback } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { toast } from 'react-hot-toast'
import { mapContractError, AppError } from '../lib/errors'

export type TransactionStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error'

interface UseTransactionStatusReturn {
    status: TransactionStatus
    error: AppError | null
    txHash: `0x${string}` | undefined
    handleTransaction: (txPromise: Promise<`0x${string}`>) => Promise<void>
    reset: () => void
}

/**
 * Hook to track transaction status and provide user feedback
 * Includes automatic toast notifications and error mapping
 */
export function useTransactionStatus(options?: {
    successMessage?: string
    pendingMessage?: string
    confirmingMessage?: string
}): UseTransactionStatusReturn {
    const [status, setStatus] = useState<TransactionStatus>('idle')
    const [error, setError] = useState<AppError | null>(null)
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)

    const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransactionReceipt({
        hash: txHash,
    })

    const reset = useCallback(() => {
        setStatus('idle')
        setError(null)
        setTxHash(undefined)
    }, [])

    const handleTransaction = useCallback(
        async (txPromise: Promise<`0x${string}`>) => {
            setStatus('pending')
            setError(null)

            const pendingToastId = toast.loading(options?.pendingMessage || 'Preparing transaction...')

            try {
                const hash = await txPromise
                setTxHash(hash)
                setStatus('confirming')
                toast.loading(options?.confirmingMessage || 'Waiting for confirmation...', { id: pendingToastId })
            } catch (err) {
                const mappedError = mapContractError(err)
                setError(mappedError)
                setStatus('error')
                toast.error(`${mappedError.message} ${mappedError.action || ''}`, { id: pendingToastId })
                throw err
            }
        },
        [options]
    )

    // Update status based on receipt
    if (isConfirming && status !== 'confirming') {
        setStatus('confirming')
    }

    if (isSuccess && status !== 'success') {
        setStatus('success')
        toast.success(options?.successMessage || 'Transaction successful!')
    }

    if (confirmError && status !== 'error') {
        const mappedError = mapContractError(confirmError)
        setError(mappedError)
        setStatus('error')
        toast.error(mappedError.message)
    }

    return {
        status,
        error,
        txHash,
        handleTransaction,
        reset,
    }
}
