import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, REMIT_ESCROW_ABI } from '../lib/constants'
import { POLLING_INTERVALS } from '../lib/config'
import { useTransactionStatus } from './useTransactionStatus'

// Types
export interface Remittance {
  creator: `0x${string}`
  recipient: `0x${string}`
  targetAmount: bigint
  currentAmount: bigint
  purpose: string
  createdAt: bigint
  isReleased: boolean
  isCancelled: boolean
}

// Read Hooks

export function useGetRemittance(remittanceId: number | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: REMIT_ESCROW_ABI,
    functionName: 'getRemittance',
    args: remittanceId !== undefined ? [BigInt(remittanceId)] : undefined,
    query: {
      enabled: remittanceId !== undefined,
      refetchInterval: POLLING_INTERVALS.REMITTANCE_DETAILS,
    },
  })
}

export function useGetUserRemittances(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: REMIT_ESCROW_ABI,
    functionName: 'getUserRemittances',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: POLLING_INTERVALS.USER_REMITTANCES,
    },
  })
}

export function useGetRecipientRemittances(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: REMIT_ESCROW_ABI,
    functionName: 'getRecipientRemittances',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: POLLING_INTERVALS.RECIPIENT_REMITTANCES,
    },
  })
}

export function useGetContribution(remittanceId: number | undefined, contributor: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: REMIT_ESCROW_ABI,
    functionName: 'getContribution',
    args: remittanceId !== undefined && contributor ? [BigInt(remittanceId), contributor] : undefined,
    query: {
      enabled: remittanceId !== undefined && !!contributor,
    },
  })
}

export function useGetContributors(remittanceId: number | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: REMIT_ESCROW_ABI,
    functionName: 'getContributors',
    args: remittanceId !== undefined ? [BigInt(remittanceId)] : undefined,
    query: {
      enabled: remittanceId !== undefined,
    },
  })
}

export function useGetCurrentPrice() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: REMIT_ESCROW_ABI,
    functionName: 'getCurrentPrice',
  })
}

export function useGetTotalRemittances() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: REMIT_ESCROW_ABI,
    functionName: 'getTotalRemittances',
  })
}

// Write Hooks

export function useCreateRemittance() {
  const { writeContractAsync } = useWriteContract()
  const txStatus = useTransactionStatus({
    successMessage: 'Remittance request created successfully!',
    pendingMessage: 'Creating remittance request...',
    confirmingMessage: 'Confirming on blockchain...',
  })

  const createRemittance = async (recipient: `0x${string}`, targetAmount: bigint, purpose: string) => {
    await txStatus.handleTransaction(
      writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: REMIT_ESCROW_ABI,
        functionName: 'createRemittance',
        args: [recipient, targetAmount, purpose],
      })
    )
  }

  return {
    createRemittance,
    ...txStatus,
  }
}

export function useContribute() {
  const { writeContractAsync } = useWriteContract()
  const txStatus = useTransactionStatus({
    successMessage: 'Contribution successful!',
    pendingMessage: 'Preparing contribution...',
    confirmingMessage: 'Confirming contribution...',
  })

  const contribute = async (remittanceId: number, amount: bigint) => {
    await txStatus.handleTransaction(
      writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: REMIT_ESCROW_ABI,
        functionName: 'contribute',
        args: [BigInt(remittanceId)],
        value: amount,
      })
    )
  }

  return {
    contribute,
    ...txStatus,
  }
}

export function useReleaseFunds() {
  const { writeContractAsync } = useWriteContract()
  const txStatus = useTransactionStatus({
    successMessage: 'Funds released successfully!',
    pendingMessage: 'Releasing funds...',
    confirmingMessage: 'Confirming release...',
  })

  const releaseFunds = async (remittanceId: number) => {
    await txStatus.handleTransaction(
      writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: REMIT_ESCROW_ABI,
        functionName: 'releaseFunds',
        args: [BigInt(remittanceId)],
      })
    )
  }

  return {
    releaseFunds,
    ...txStatus,
  }
}

export function useCancelRemittance() {
  const { writeContractAsync } = useWriteContract()
  const txStatus = useTransactionStatus({
    successMessage: 'Remittance cancelled and refunds processed!',
    pendingMessage: 'Cancelling remittance...',
    confirmingMessage: 'Confirming cancellation...',
  })

  const cancelRemittance = async (remittanceId: number) => {
    await txStatus.handleTransaction(
      writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: REMIT_ESCROW_ABI,
        functionName: 'cancelRemittance',
        args: [BigInt(remittanceId)],
      })
    )
  }

  return {
    cancelRemittance,
    ...txStatus,
  }
}

// Combined hook for current user's remittances
export function useMyRemittances() {
  const { address } = useAccount()
  const { data: created } = useGetUserRemittances(address)
  const { data: receiving } = useGetRecipientRemittances(address)

  return {
    created: created as bigint[] | undefined,
    receiving: receiving as bigint[] | undefined,
  }
}
