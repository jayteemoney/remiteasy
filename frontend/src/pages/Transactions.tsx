import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { History, Search, Filter, Download } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { RemittanceList } from '../components/RemittanceList'
import { AnimatedPage } from '../components/AnimatedPage'

export function Transactions() {
  const { isConnected } = useAccount()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'completed' | 'canceled'
  >('all')

  const stats = {
    all: 0,
    active: 0,
    completed: 0,
    canceled: 0,
  }

  if (!isConnected) {
    return (
      <AnimatedPage>
        <div className="min-h-[70vh] flex items-center justify-center px-6">
          <Card className="text-center max-w-lg w-full p-12">
            <div className="text-7xl mb-6">🔗</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Please connect your wallet to view your transactions
            </p>
          </Card>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="w-full min-h-screen py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3">
                  Transactions
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                  View and manage all your remittances
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { label: 'All', value: stats.all, variant: 'default' as const },
              { label: 'Active', value: stats.active, variant: 'info' as const },
              {
                label: 'Completed',
                value: stats.completed,
                variant: 'success' as const,
              },
              {
                label: 'Canceled',
                value: stats.canceled,
                variant: 'danger' as const,
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() =>
                  setFilterStatus(stat.label.toLowerCase() as 'all' | 'active' | 'completed' | 'canceled')
                }
              >
                <Card
                  glass
                  padding="md"
                  hover
                  className={`cursor-pointer transition-all ${
                    filterStatus === stat.label.toLowerCase()
                      ? 'ring-2 ring-blue-500 shadow-lg'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <Badge variant={stat.variant} size="lg">
                      {stat.value}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card glass>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by recipient name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-5 h-5" />}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'active', 'completed', 'canceled'].map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() =>
                        setFilterStatus(
                          status as 'all' | 'active' | 'completed' | 'canceled'
                        )
                      }
                      className="capitalize gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Transactions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RemittanceList />
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card glass className="p-6">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Showing 0 transactions
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Filter: {filterStatus} • Search: {searchQuery || 'None'}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  )
}
