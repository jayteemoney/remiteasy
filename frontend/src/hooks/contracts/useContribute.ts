import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { contractConfig } from '@/contracts/config'

export function useContribute() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const contribute = (remittanceId: bigint, amount: string) => {
    writeContract({
      ...contractConfig,
      functionName: 'contribute',
      args: [remittanceId],
      value: parseEther(amount),
    })
  }

  return {
    contribute,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  }
}
