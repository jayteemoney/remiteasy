import RemitEscrowABI from './RemitEscrowABI.json'
import { env } from './env'

export const CONTRACT_ADDRESS = env.CONTRACT_ADDRESS

export const REMIT_ESCROW_ABI = RemitEscrowABI

export const CHAIN_ID = env.CHAIN_ID

// For displaying amounts
export const formatCelo = (value: bigint): string => {
  return (Number(value) / 1e18).toFixed(4)
}

// For parsing input amounts
export const parseCelo = (value: string): bigint => {
  return BigInt(Math.floor(parseFloat(value) * 1e18))
}
