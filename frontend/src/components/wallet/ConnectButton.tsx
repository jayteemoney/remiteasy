import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/common'
import { Wallet, ChevronDown } from 'lucide-react'
import { formatAddress } from '@/lib/format'
import { cn } from '@/lib/cn'

export interface ConnectButtonProps {
  size?: 'sm' | 'md' | 'lg'
  showBalance?: boolean
  showNetwork?: boolean
  className?: string
}

export function ConnectButton({
  size = 'md',
  showBalance = true,
  showNetwork = false,
  className,
}: ConnectButtonProps) {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            className={cn(!ready && 'pointer-events-none opacity-0', className)}
            aria-hidden={!ready}
          >
            {(() => {
              // Not connected
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    size={size}
                    leftIcon={<Wallet className="h-4 w-4" />}
                  >
                    Connect Wallet
                  </Button>
                )
              }

              // Wrong network
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="destructive"
                    size={size}
                  >
                    Wrong Network
                  </Button>
                )
              }

              // Connected
              return (
                <div className="flex items-center gap-2">
                  {/* Network button (optional) */}
                  {showNetwork && (
                    <button
                      onClick={openChainModal}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                    >
                      {chain.hasIcon && chain.iconUrl && (
                        <img
                          src={chain.iconUrl}
                          alt={chain.name ?? 'Chain icon'}
                          className="h-4 w-4 rounded-full"
                        />
                      )}
                      <span className="hidden sm:inline">{chain.name}</span>
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    </button>
                  )}

                  {/* Account button */}
                  <button
                    onClick={openAccountModal}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                  >
                    {/* Avatar */}
                    <div
                      className="h-6 w-6 rounded-full"
                      style={{
                        backgroundColor: `hsl(${parseInt(account.address.slice(2, 8), 16) % 360}, 70%, 50%)`,
                      }}
                    />
                    <div className="flex flex-col items-start">
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {account.ensName || formatAddress(account.address as `0x${string}`)}
                      </span>
                      {showBalance && account.displayBalance && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {account.displayBalance}
                        </span>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </RainbowConnectButton.Custom>
  )
}
