import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import { useState, useRef, useEffect } from 'react'
import { Copy, ExternalLink, LogOut, ChevronDown, Check } from 'lucide-react'
import { formatAddress } from '@/lib/format'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { BalanceDisplay } from './BalanceDisplay'
import { cn } from '@/lib/cn'

export interface AccountInfoProps {
  showBalance?: boolean
  showAvatar?: boolean
  variant?: 'compact' | 'full'
  className?: string
}

export function AccountInfo({
  showBalance = true,
  showAvatar = true,
  variant = 'full',
  className,
}: AccountInfoProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const [isOpen, setIsOpen] = useState(false)
  const { copy, copied } = useCopyToClipboard()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!isConnected || !address) {
    return null
  }

  const displayName = ensName || formatAddress(address)
  const isCompact = variant === 'compact'

  // Generate avatar color from address
  const avatarColor = `hsl(${parseInt(address.slice(2, 8), 16) % 360}, 70%, 50%)`

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800',
          isCompact && 'px-2 py-1.5'
        )}
      >
        {showAvatar && (
          <div
            className={cn(
              'h-6 w-6 rounded-full',
              isCompact && 'h-5 w-5'
            )}
            style={{ backgroundColor: avatarColor }}
          />
        )}
        <div className="flex flex-col items-start">
          <span className={cn('font-mono text-sm text-gray-900 dark:text-white', isCompact && 'text-xs')}>
            {displayName}
          </span>
          {showBalance && !isCompact && (
            <BalanceDisplay address={address} size="sm" className="text-gray-500" />
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {/* Copy Address */}
          <button
            onClick={() => {
              copy(address)
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copied!' : 'Copy Address'}
          </button>

          {/* View on Explorer */}
          <a
            href={`https://celoscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ExternalLink className="h-4 w-4" />
            View on Explorer
          </a>

          <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

          {/* Disconnect */}
          <button
            onClick={() => {
              disconnect()
              setIsOpen(false)
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
