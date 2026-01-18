import { useAccount } from 'wagmi'
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  Wallet,
  BarChart3,
  Clock,
  Send,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { RemittanceList } from '../components/RemittanceList'
import { ForexAlert } from '../components/ForexAlert'

export function Dashboard() {
  const { isConnected } = useAccount()

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
      icon: Activity,
    },
    {
      title: 'Active',
      value: stats.activeRemittances,
      change: '+5%',
      icon: TrendingUp,
    },
    {
      title: 'Total Volume',
      value: `${stats.totalAmount} cUSD`,
      change: '+23%',
      icon: DollarSign,
    },
    {
      title: 'Completed',
      value: stats.completedRemittances,
      change: '+18%',
      icon: Users,
    },
  ]

  if (!isConnected) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <Card className="text-center max-w-md w-full" padding="lg">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
            Connect Your Wallet
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Connect your wallet to view your dashboard and manage remittances.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="container-app space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Overview of your remittance activity
            </p>
          </div>
          <Link to="/send">
            <Button className="gap-2">
              <Send className="w-4 h-4" />
              New Remittance
            </Button>
          </Link>
        </div>

        {/* Forex Alert */}
        <ForexAlert />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} padding="md">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <Badge variant="success" size="sm">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {stat.value}
                </p>
              </Card>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contribution Tracker */}
          <Card className="lg:col-span-1" padding="md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Your Contributions
              </h2>
              <BarChart3 className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7 text-neutral-400" />
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                No contributions yet
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500">
                Start by creating or contributing to a remittance
              </p>
            </div>
          </Card>

          {/* Remittance List */}
          <div className="lg:col-span-2">
            <RemittanceList />
          </div>
        </div>

        {/* Activity Feed */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Recent Activity
            </h2>
            <Clock className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <Clock className="w-7 h-7 text-neutral-400" />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-2">
              No activity yet
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Your transaction history will appear here
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
