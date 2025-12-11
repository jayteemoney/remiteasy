import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { RemittanceList } from '../components/RemittanceList'
import { ForexAlert } from '../components/ForexAlert'
import { AnimatedPage } from '../components/AnimatedPage'

export function Dashboard() {
  const { isConnected } = useAccount()

  // Mock stats for now
  const stats = {
    totalRemittances: 0,
    activeRemittances: 0,
    totalAmount: '0.00',
    completedRemittances: 0,
  }

  const statCards = [
    {
      title: 'Total Remittances',
      value: stats.totalRemittances,
      change: '+12%',
      trend: 'up',
      icon: Activity,
      color: 'blue',
    },
    {
      title: 'Active',
      value: stats.activeRemittances,
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Total Volume',
      value: `${stats.totalAmount} cUSD`,
      change: '+23%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple',
    },
    {
      title: 'Completed',
      value: stats.completedRemittances,
      change: '+18%',
      trend: 'up',
      icon: Users,
      color: 'amber',
    },
  ]

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
              Please connect your wallet to view your dashboard
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
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3"
            >
              Dashboard
            </motion.h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              Welcome back! Here's your remittance overview.
            </p>
          </div>

          {/* Forex Alert */}
          <ForexAlert />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              const TrendIcon = ArrowUpRight

              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover glass className="h-full">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
                        <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                      </div>
                      <Badge variant="success" size="sm">
                        <TrendIcon className="w-3 h-3" />
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-10">
            {/* Contribution Tracker - Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="xl:col-span-1"
            >
              <Card className="h-full">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Your Contributions
                </h2>
                <div className="text-center py-16">
                  <div className="text-7xl mb-4">📊</div>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    No contributions yet
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Remittance List - Right Columns */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="xl:col-span-2"
            >
              <RemittanceList />
            </motion.div>
          </div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h2>
              <div className="text-center py-16">
                <div className="text-7xl mb-4">📋</div>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
                  No activity yet.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Create your first remittance to get started!
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  )
}
