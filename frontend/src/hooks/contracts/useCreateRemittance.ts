import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { contractConfig } from '@/contracts/config'
import type { Address } from 'viem'

export function useCreateRemittance() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const createRemittance = (
    recipient: Address,
    targetAmount: string,
    purpose: string
  ) => {
    writeContract({
      ...contractConfig,
      functionName: 'createRemittance',
      args: [recipient, parseEther(targetAmount), purpose],
    })
  }

  return {
    createRemittance,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  }
}
