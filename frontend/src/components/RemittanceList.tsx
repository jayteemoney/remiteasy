import { useAccount } from 'wagmi'
import { Inbox, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMyRemittances, useGetRemittance } from '../hooks/useRemitEscrow'
import { RemittanceCard } from './RemittanceCard'

/**
 * RemittanceList Component
 * Displays all remittances created by or received by the connected user
 * Fetches and renders remittance data using custom hooks
 */
export function RemittanceList() {
  const { address, isConnected } = useAccount()
  const { created, receiving } = useMyRemittances()

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <Inbox className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your wallet to view and manage your remittances
          </p>
        </div>
      </div>
    )
  }

  // Combine created and receiving remittances, removing duplicates
  const allRemittanceIds = Array.from(
    new Set([...(created || []), ...(receiving || [])])
  )

  if (allRemittanceIds.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <Inbox className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Remittances Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create your first remittance to get started or wait for someone to add you as a
            recipient
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Remittances
        </h2>
        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {allRemittanceIds.length} Total
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

// Helper component to fetch and display individual remittance
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center"
      >
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </motion.div>
    )
  }

  if (error || !remittanceData) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load remittance #{remittanceId}
        </p>
      </div>
    )
  }

  // Type assertion for the remittance data tuple
  const remittanceArray = remittanceData as readonly [
    string, // creator
    string, // recipient
    bigint, // targetAmount
    bigint, // currentAmount
    string, // purpose
    bigint, // createdAt
    boolean, // isReleased
    boolean  // isCancelled
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
