import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Search, Download, Wallet, FileText } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { RemittanceList } from '../components/RemittanceList'

type FilterStatus = 'all' | 'active' | 'completed' | 'canceled'

export function Transactions() {
  const { isConnected } = useAccount()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  const stats = {
    all: 0,
    active: 0,
    completed: 0,
    canceled: 0,
  }

  const filters: { key: FilterStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'canceled', label: 'Canceled' },
  ]

  if (!isConnected) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="text-center max-w-sm w-full p-8">
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-6 h-6 text-orange-500" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Connect your wallet to view your transactions.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white">
              Transactions
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              View and manage all your remittances
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterStatus(filter.key)}
              className={`
                p-3 rounded-lg border text-center transition-all
                ${
                  filterStatus === filter.key
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                }
              `}
            >
              <p
                className={`text-xl font-semibold ${
                  filterStatus === filter.key
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-neutral-900 dark:text-white'
                }`}
              >
                {stats[filter.key]}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {filter.label}
              </p>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <Card padding="sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search by recipient or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterStatus(filter.key)}
                  className={`
                    px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors
                    ${
                      filterStatus === filter.key
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }
                  `}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Transactions List */}
        <RemittanceList />

        {/* Footer info */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <FileText className="w-3.5 h-3.5" />
          <span>
            Showing {stats[filterStatus]} transactions
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
        </div>
      </div>
    </div>
  )
}
