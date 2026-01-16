import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { Inbox, Loader2 } from 'lucide-react'
import { useMyRemittances, useGetRemittance } from '../hooks/useRemitEscrow'
import { RemittanceCard } from './RemittanceCard'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'

export function RemittanceList() {
  const { address, isConnected } = useAccount()
  const { created, receiving } = useMyRemittances()

  if (!isConnected) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
            <Inbox className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 className="text-base font-medium text-neutral-900 dark:text-white mb-1">
            Connect Your Wallet
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Connect to view and manage your remittances
          </p>
        </div>
      </Card>
    )
  }

  const allRemittanceIds = useMemo(
    () => Array.from(new Set([...(created || []), ...(receiving || [])])),
    [created, receiving]
  )

  if (allRemittanceIds.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
            <Inbox className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 className="text-base font-medium text-neutral-900 dark:text-white mb-1">
            No Remittances Yet
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Create your first remittance to get started
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-neutral-900 dark:text-white">
          Your Remittances
        </h2>
        <Badge variant="default" size="sm">
          {allRemittanceIds.length} total
        </Badge>
      </div>

      <div className="space-y-3">
        {allRemittanceIds.map((remittanceId) => (
          <RemittanceListItem
            key={remittanceId.toString()}
            remittanceId={Number(remittanceId)}
            userAddress={address!}
          />
        ))}
      </div>
    </div>
  )
}

function RemittanceListItem({
  remittanceId,
  userAddress,
}: {
  remittanceId: number
  userAddress: string
}) {
  const { data: remittanceData, isLoading, error } = useGetRemittance(remittanceId)

  if (isLoading) {
    return (
      <Card className="p-4 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
      </Card>
    )
  }

  if (error || !remittanceData) {
    return (
      <Card className="p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="text-xs text-red-600 dark:text-red-400">
          Failed to load remittance #{remittanceId}
        </p>
      </Card>
    )
  }

  const remittanceArray = remittanceData as readonly [
    string,
    string,
    bigint,
    bigint,
    string,
    bigint,
    boolean,
    boolean
  ]

  const [creator, recipient, targetAmount, currentAmount, purpose, createdAt, isReleased, isCancelled] =
    remittanceArray

  const remittance = {
    creator: creator as `0x${string}`,
    recipient: recipient as `0x${string}`,
    targetAmount,
    currentAmount,
    purpose,
    createdAt,
    isReleased,
    isCancelled,
  }

  const isCreator = creator.toLowerCase() === userAddress.toLowerCase()
  const isRecipient = recipient.toLowerCase() === userAddress.toLowerCase()

  return (
    <RemittanceCard
      remittanceId={remittanceId}
      remittance={remittance}
      isCreator={isCreator}
      isRecipient={isRecipient}
    />
  )
}
