import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contractConfig } from '@/contracts/config'

export function useCancelRemittance() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const cancelRemittance = (remittanceId: bigint) => {
    writeContract({
      ...contractConfig,
      functionName: 'cancelRemittance',
      args: [remittanceId],
    })
  }

  return {
    cancelRemittance,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  }
}
