import { useReadContract, useReadContracts } from 'wagmi'
import { contractConfig } from '@/contracts/config'
import { transformRemittance, type Remittance } from '@/types/remittance'
import type { Address } from 'viem'

export function useUserRemittances(address: Address | undefined) {
  const { data: remittanceIds, isLoading: isLoadingIds, error: idsError } = useReadContract({
    ...contractConfig,
    functionName: 'getUserRemittances',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const contracts = (remittanceIds ?? []).map((id) => ({
    ...contractConfig,
    functionName: 'getRemittance' as const,
    args: [id] as const,
  }))

  const { data: remittancesData, isLoading: isLoadingRemittances, error: remittancesError } = useReadContracts({
    contracts,
    query: {
      enabled: contracts.length > 0,
    },
  })

  const ids = remittanceIds ?? []
  const remittances: Remittance[] = []

  if (remittancesData && ids.length > 0) {
    for (let i = 0; i < remittancesData.length; i++) {
      const result = remittancesData[i]
      const id = ids[i]
      if (result && result.status === 'success' && result.result && id !== undefined) {
        remittances.push(transformRemittance(
          id,
          result.result as readonly [`0x${string}`, `0x${string}`, bigint, bigint, string, bigint, boolean, boolean]
        ))
      }
    }
  }

  return {
    data: remittances,
    isLoading: isLoadingIds || isLoadingRemittances,
    error: idsError || remittancesError,
  }
}
