import { useReadContract } from 'wagmi'
import { contractConfig } from '@/contracts/config'

export function usePlatformInfo() {
  const { data: totalRemittances, isLoading: isLoadingCounter } = useReadContract({
    ...contractConfig,
    functionName: 'getTotalRemittances',
  })

  const { data: platformFeeBps, isLoading: isLoadingFee } = useReadContract({
    ...contractConfig,
    functionName: 'platformFeeBps',
  })

  const { data: feeCollector, isLoading: isLoadingCollector } = useReadContract({
    ...contractConfig,
    functionName: 'feeCollector',
  })

  return {
    totalRemittances: totalRemittances ?? 0n,
    platformFeeBps: platformFeeBps ?? 50n,
    platformFeePercent: Number(platformFeeBps ?? 50n) / 100,
    feeCollector,
    isLoading: isLoadingCounter || isLoadingFee || isLoadingCollector,
  }
}
