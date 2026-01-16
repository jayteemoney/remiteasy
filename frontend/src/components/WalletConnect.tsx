import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet, LogOut, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (error) {
    toast.error(error.message || 'Failed to connect wallet')
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
            {truncateAddress(address)}
          </span>
        </div>

        <button
          onClick={() => disconnect()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-500 hover:text-red-500 dark:text-neutral-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          aria-label="Disconnect wallet"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-medium">Disconnect</span>
        </button>
      </div>
    )
  }

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
    <button
      onClick={handleConnect}
      disabled={isPending}
      className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
      aria-label="Connect wallet"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      <span>{isPending ? 'Connecting...' : 'Connect'}</span>
    </button>
  )
}
