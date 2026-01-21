import { env } from '@/config/env'
import { remitEscrowAbi } from './abi'

export const contractConfig = {
  address: env.VITE_CONTRACT_ADDRESS as `0x${string}`,
  abi: remitEscrowAbi,
} as const
