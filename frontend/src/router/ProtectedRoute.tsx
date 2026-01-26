import { ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected, isConnecting } = useAccount()

  if (isConnecting) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-primary-500" />
        <p className="mt-4 text-sm text-gray-500">Connecting wallet...</p>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
          <Wallet className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Connect Your Wallet
        </h2>
        <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
          Please connect your wallet to access this page. You need a Celo-compatible
          wallet to use RemitEasy.
        </p>
        <div className="mt-6">
          <ConnectButton />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
