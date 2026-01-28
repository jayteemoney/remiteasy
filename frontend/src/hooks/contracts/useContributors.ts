import { useReadContract, useReadContracts } from 'wagmi'
import { contractConfig } from '@/contracts/config'
import type { Address } from 'viem'

export interface Contributor {
  address: Address
  amount: bigint
}

export function useContributors(remittanceId: bigint | undefined) {
  const { data: contributorAddresses, isLoading: isLoadingAddresses, error: addressesError } = useReadContract({
    ...contractConfig,
    functionName: 'getContributors',
    args: remittanceId !== undefined ? [remittanceId] : undefined,
    query: {
      enabled: remittanceId !== undefined,
    },
  })

  const contracts = (contributorAddresses ?? []).map((address) => ({
    ...contractConfig,
    functionName: 'getContribution' as const,
    args: [remittanceId!, address] as const,
  }))

  const { data: contributionsData, isLoading: isLoadingContributions, error: contributionsError } = useReadContracts({
    contracts,
    query: {
      enabled: contracts.length > 0 && remittanceId !== undefined,
    },
  })

  const contributors: Contributor[] = (contributorAddresses ?? []).map((address, index) => ({
    address,
    amount: contributionsData?.[index]?.status === 'success'
      ? (contributionsData[index].result as bigint)
      : 0n,
  }))

  return {
    data: contributors,
    isLoading: isLoadingAddresses || isLoadingContributions,
    error: addressesError || contributionsError,
  }
}
