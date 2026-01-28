import { contractConfig } from '@/contracts/config'

export function useRemittanceContract() {
  return {
    address: contractConfig.address,
    abi: contractConfig.abi,
  }
}
