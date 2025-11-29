import RemitEscrowABI from './RemitEscrowABI.json'

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`

export const REMIT_ESCROW_ABI = RemitEscrowABI

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID) || 11142220

// For displaying amounts
export const formatCelo = (value: bigint): string => {
  return (Number(value) / 1e18).toFixed(4)
}

// For parsing input amounts
export const parseCelo = (value: string): bigint => {
  return BigInt(Math.floor(parseFloat(value) * 1e18))
}
