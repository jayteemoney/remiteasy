import type { Address } from 'viem'

export type RemittanceStatus = 'active' | 'released' | 'cancelled'

export interface Remittance {
  id: bigint
  creator: Address
  recipient: Address
  targetAmount: bigint
  currentAmount: bigint
  purpose: string
  createdAt: Date
  isReleased: boolean
  isCancelled: boolean
  status: RemittanceStatus
  progress: number
}

export interface Contributor {
  address: Address
  amount: bigint
}

export interface CreateRemittanceInput {
  recipient: Address
  targetAmount: bigint
  purpose: string
}

export function getRemittanceStatus(isReleased: boolean, isCancelled: boolean): RemittanceStatus {
  if (isCancelled) return 'cancelled'
  if (isReleased) return 'released'
  return 'active'
}

export function transformRemittance(
  id: bigint,
  data: readonly [Address, Address, bigint, bigint, string, bigint, boolean, boolean]
): Remittance {
  const [creator, recipient, targetAmount, currentAmount, purpose, createdAt, isReleased, isCancelled] = data

  return {
    id,
    creator,
    recipient,
    targetAmount,
    currentAmount,
    purpose,
    createdAt: new Date(Number(createdAt) * 1000),
    isReleased,
    isCancelled,
    status: getRemittanceStatus(isReleased, isCancelled),
    progress: targetAmount > 0n ? Number((currentAmount * 100n) / targetAmount) : 0,
  }
}
