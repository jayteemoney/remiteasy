import toast from 'react-hot-toast'
import { formatCeloWithSymbol } from '@/lib/format'

/**
 * Centralized notification service for the application.
 * Provides consistent toast notifications for transactions and events.
 */
export const notifications = {
  // Transaction state notifications
  txPending: (message = 'Transaction pending...') => {
    return toast.loading(message, { id: 'tx-pending' })
  },

  txSuccess: (message: string) => {
    toast.dismiss('tx-pending')
    return toast.success(message)
  },

  txError: (error: Error | string) => {
    toast.dismiss('tx-pending')
    const message = typeof error === 'string' ? error : parseContractError(error)
    return toast.error(message)
  },

  // Remittance event notifications
  remittanceCreated: (id: bigint) => {
    return toast.success(`Remittance #${id} created successfully!`)
  },

  contributionReceived: (amount: bigint) => {
    return toast.success(`Received ${formatCeloWithSymbol(amount)} contribution!`)
  },

  contributionSent: (amount: bigint) => {
    return toast.success(`Contributed ${formatCeloWithSymbol(amount)} successfully!`)
  },

  fundsReleased: (amount: bigint) => {
    return toast.success(`${formatCeloWithSymbol(amount)} released to recipient!`)
  },

  remittanceCancelled: () => {
    return toast.success('Remittance cancelled and funds refunded')
  },

  // Generic notifications
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast(message, { icon: 'ℹ️' }),
  warning: (message: string) => toast(message, { icon: '⚠️' }),

  // Clipboard
  copied: () => toast.success('Copied to clipboard!'),

  // Connection
  walletConnected: () => toast.success('Wallet connected'),
  walletDisconnected: () => toast('Wallet disconnected', { icon: '👋' }),
  wrongNetwork: () => toast.error('Please switch to Celo network'),
}

/**
 * Parse contract errors into user-friendly messages
 */
function parseContractError(error: Error): string {
  const message = error.message.toLowerCase()

  // User rejected transaction
  if (message.includes('user rejected') || message.includes('user denied')) {
    return 'Transaction cancelled'
  }

  // Insufficient funds
  if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
    return 'Insufficient balance for this transaction'
  }

  // Contract-specific errors
  if (message.includes('not authorized') || message.includes('not creator') || message.includes('not recipient')) {
    return 'You are not authorized for this action'
  }

  if (message.includes('already released')) {
    return 'Funds have already been released'
  }

  if (message.includes('already cancelled')) {
    return 'This remittance has already been cancelled'
  }

  if (message.includes('not active')) {
    return 'This remittance is no longer active'
  }

  if (message.includes('target not met')) {
    return 'Target amount has not been reached yet'
  }

  if (message.includes('invalid address') || message.includes('zero address')) {
    return 'Invalid wallet address'
  }

  if (message.includes('amount too low') || message.includes('zero amount')) {
    return 'Amount must be greater than zero'
  }

  // Network errors
  if (message.includes('network') || message.includes('connection')) {
    return 'Network error. Please check your connection.'
  }

  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.'
  }

  // Generic fallback
  return 'Transaction failed. Please try again.'
}

export { parseContractError }
