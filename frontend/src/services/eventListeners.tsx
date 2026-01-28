import { useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { useContractEvents } from '@/hooks/contracts'
import { notifications } from './notifications'
import { formatCeloWithSymbol } from '@/lib/format'

/**
 * Hook to set up global contract event listeners.
 * Invalidates React Query cache and shows notifications on relevant events.
 */
export function useGlobalEventListeners() {
  const queryClient = useQueryClient()
  const { address } = useAccount()

  useContractEvents({
    onRemittanceCreated: (event) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['userRemittances', event.creator] })
      queryClient.invalidateQueries({ queryKey: ['recipientRemittances', event.recipient] })
      queryClient.invalidateQueries({ queryKey: ['platformInfo'] })

      // Notify if current user is involved
      if (address?.toLowerCase() === event.creator.toLowerCase()) {
        // User created this remittance - they already got a notification from the form
        console.log('Remittance created:', event.remittanceId)
      } else if (address?.toLowerCase() === event.recipient.toLowerCase()) {
        // User is the recipient of a new remittance
        notifications.info(`You have a new incoming remittance: "${event.purpose}"`)
      }
    },

    onContributionMade: (event) => {
      // Invalidate specific remittance cache
      queryClient.invalidateQueries({ queryKey: ['remittance', event.remittanceId] })
      queryClient.invalidateQueries({ queryKey: ['contributors', event.remittanceId] })

      // Invalidate user remittances to update stats
      if (address) {
        queryClient.invalidateQueries({ queryKey: ['userRemittances', address] })
        queryClient.invalidateQueries({ queryKey: ['recipientRemittances', address] })
      }

      // Notify if this is someone else's contribution to user's remittance
      // (The contributor already got notified from the modal)
      console.log('Contribution made:', event.remittanceId, formatCeloWithSymbol(event.amount))
    },

    onFundsReleased: (event) => {
      // Invalidate specific remittance cache
      queryClient.invalidateQueries({ queryKey: ['remittance', event.remittanceId] })

      // Invalidate user remittances
      if (address) {
        queryClient.invalidateQueries({ queryKey: ['userRemittances', address] })
        queryClient.invalidateQueries({ queryKey: ['recipientRemittances', address] })
      }

      console.log('Funds released:', event.remittanceId, formatCeloWithSymbol(event.amount))
    },

    onRemittanceCancelled: (event) => {
      // Invalidate specific remittance cache
      queryClient.invalidateQueries({ queryKey: ['remittance', event.remittanceId] })

      // Invalidate user remittances
      if (address) {
        queryClient.invalidateQueries({ queryKey: ['userRemittances', address] })
        queryClient.invalidateQueries({ queryKey: ['recipientRemittances', address] })
      }

      console.log('Remittance cancelled:', event.remittanceId)
    },
  })
}

/**
 * Provider component that sets up global event listeners.
 * Should be placed inside the Web3Provider.
 */
export function EventListenerProvider({ children }: { children: React.ReactNode }) {
  useGlobalEventListeners()
  return <>{children}</>
}
