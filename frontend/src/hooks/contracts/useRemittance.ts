import { useReadContract } from 'wagmi'
import { contractConfig } from '@/contracts/config'
import { transformRemittance } from '@/types/remittance'

export function useRemittance(remittanceId: bigint | undefined) {
  const result = useReadContract({
    ...contractConfig,
    functionName: 'getRemittance',
    args: remittanceId !== undefined ? [remittanceId] : undefined,
    query: {
      enabled: remittanceId !== undefined,
    },
  })

  return {
    ...result,
    data: result.data && remittanceId !== undefined
      ? transformRemittance(remittanceId, result.data)
      : undefined,
  }
}
