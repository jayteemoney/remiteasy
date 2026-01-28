import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contractConfig } from '@/contracts/config'

export function useReleaseFunds() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const releaseFunds = (remittanceId: bigint) => {
    writeContract({
      ...contractConfig,
      functionName: 'releaseFunds',
      args: [remittanceId],
    })
  }

  return {
    releaseFunds,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  }
}
