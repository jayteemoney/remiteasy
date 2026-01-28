import { useWatchContractEvent } from 'wagmi'
import { contractConfig } from '@/contracts/config'
import type { Address } from 'viem'

export interface RemittanceCreatedEvent {
  remittanceId: bigint
  creator: Address
  recipient: Address
  targetAmount: bigint
  purpose: string
  timestamp: bigint
}

export interface ContributionMadeEvent {
  remittanceId: bigint
  contributor: Address
  amount: bigint
  newTotal: bigint
  timestamp: bigint
}

export interface FundsReleasedEvent {
  remittanceId: bigint
  recipient: Address
  amount: bigint
  platformFee: bigint
  timestamp: bigint
}

export interface RemittanceCancelledEvent {
  remittanceId: bigint
  creator: Address
  timestamp: bigint
}

interface UseContractEventsOptions {
  onRemittanceCreated?: (event: RemittanceCreatedEvent) => void
  onContributionMade?: (event: ContributionMadeEvent) => void
  onFundsReleased?: (event: FundsReleasedEvent) => void
  onRemittanceCancelled?: (event: RemittanceCancelledEvent) => void
}

export function useContractEvents(options: UseContractEventsOptions) {
  useWatchContractEvent({
    ...contractConfig,
    eventName: 'RemittanceCreated',
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (options.onRemittanceCreated && log.args) {
          options.onRemittanceCreated({
            remittanceId: log.args.remittanceId!,
            creator: log.args.creator!,
            recipient: log.args.recipient!,
            targetAmount: log.args.targetAmount!,
            purpose: log.args.purpose!,
            timestamp: log.args.timestamp!,
          })
        }
      })
    },
  })

  useWatchContractEvent({
    ...contractConfig,
    eventName: 'ContributionMade',
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (options.onContributionMade && log.args) {
          options.onContributionMade({
            remittanceId: log.args.remittanceId!,
            contributor: log.args.contributor!,
            amount: log.args.amount!,
            newTotal: log.args.newTotal!,
            timestamp: log.args.timestamp!,
          })
        }
      })
    },
  })

  useWatchContractEvent({
    ...contractConfig,
    eventName: 'FundsReleased',
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (options.onFundsReleased && log.args) {
          options.onFundsReleased({
            remittanceId: log.args.remittanceId!,
            recipient: log.args.recipient!,
            amount: log.args.amount!,
            platformFee: log.args.platformFee!,
            timestamp: log.args.timestamp!,
          })
        }
      })
    },
  })

  useWatchContractEvent({
    ...contractConfig,
    eventName: 'RemittanceCancelled',
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (options.onRemittanceCancelled && log.args) {
          options.onRemittanceCancelled({
            remittanceId: log.args.remittanceId!,
            creator: log.args.creator!,
            timestamp: log.args.timestamp!,
          })
        }
      })
    },
  })
}

export function useRemittanceUpdates(
  remittanceId: bigint | undefined,
  options: {
    onContribution?: (event: ContributionMadeEvent) => void
    onReleased?: (event: FundsReleasedEvent) => void
    onCancelled?: (event: RemittanceCancelledEvent) => void
  }
) {
  useWatchContractEvent({
    ...contractConfig,
    eventName: 'ContributionMade',
    args: remittanceId !== undefined ? { remittanceId } : undefined,
    enabled: remittanceId !== undefined,
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (options.onContribution && log.args) {
          options.onContribution({
            remittanceId: log.args.remittanceId!,
            contributor: log.args.contributor!,
            amount: log.args.amount!,
            newTotal: log.args.newTotal!,
            timestamp: log.args.timestamp!,
          })
        }
      })
    },
  })

  useWatchContractEvent({
    ...contractConfig,
    eventName: 'FundsReleased',
    args: remittanceId !== undefined ? { remittanceId } : undefined,
    enabled: remittanceId !== undefined,
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (options.onReleased && log.args) {
          options.onReleased({
            remittanceId: log.args.remittanceId!,
            recipient: log.args.recipient!,
            amount: log.args.amount!,
            platformFee: log.args.platformFee!,
            timestamp: log.args.timestamp!,
          })
        }
      })
    },
  })

  useWatchContractEvent({
    ...contractConfig,
    eventName: 'RemittanceCancelled',
    args: remittanceId !== undefined ? { remittanceId } : undefined,
    enabled: remittanceId !== undefined,
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (options.onCancelled && log.args) {
          options.onCancelled({
            remittanceId: log.args.remittanceId!,
            creator: log.args.creator!,
            timestamp: log.args.timestamp!,
          })
        }
      })
    },
  })
}
