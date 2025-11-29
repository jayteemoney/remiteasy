import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet, LogOut, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

/**
 * WalletConnect Component
 * Single "Connect Wallet" button that connects to MetaMask
 * Shows connected address with truncation and disconnect button
 */
export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()

  // Truncate address for display (0x1234...5678)
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Handle connection errors
  if (error) {
    toast.error(error.message || 'Failed to connect wallet')
  }

  if (isConnected && address) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3"
      >
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-mono text-green-400">
            {truncateAddress(address)}
          </span>
        </div>

        <button
          onClick={() => disconnect()}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-all duration-200"
          aria-label="Disconnect wallet"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="hidden sm:inline text-sm font-medium text-red-400">
            Disconnect
          </span>
        </button>
      </motion.div>
    )
  }

  // Find MetaMask connector (injected)
  const metaMaskConnector = connectors.find(
    (connector) => connector.id === 'injected' || connector.id === 'metaMask'
  )

  const handleConnect = () => {
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector })
      toast.loading('Opening wallet...', { id: 'wallet-connect' })
    } else {
      toast.error('Please install MetaMask to connect')
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleConnect}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-lg shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
      aria-label="Connect wallet"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      <span className="text-sm font-semibold">
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </span>
    </motion.button>
  )
}
