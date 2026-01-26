import { Link } from 'react-router-dom'
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { Button, Card, CardContent, EmptyState } from '@/components/common'

export function DashboardPage() {

  return (
    <PageContainer
      title="Dashboard"
      description="Manage your remittances and track your activity"
      action={
        <Link to="/send">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            New Remittance
          </Button>
        </Link>
      }
    >
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={<ArrowUpRight className="h-5 w-5" />}
          label="Created"
          value="0"
          subtitle="remittances"
        />
        <StatsCard
          icon={<ArrowDownLeft className="h-5 w-5" />}
          label="Receiving"
          value="0"
          subtitle="remittances"
        />
        <StatsCard
          icon={<Wallet className="h-5 w-5" />}
          label="Total Contributed"
          value="0 CELO"
          subtitle="all time"
        />
        <StatsCard
          icon={<Wallet className="h-5 w-5" />}
          label="Total Received"
          value="0 CELO"
          subtitle="all time"
        />
      </div>

      {/* Tabs Content - Placeholder */}
      <div className="mt-8">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="-mb-px flex gap-8">
            <TabButton active>Created</TabButton>
            <TabButton>Receiving</TabButton>
            <TabButton>Contributed</TabButton>
          </nav>
        </div>

        <div className="mt-8">
          <EmptyState
            title="No remittances yet"
            description="Create your first remittance to start sending money to your loved ones."
            action={
              <Link to="/send">
                <Button leftIcon={<Plus className="h-4 w-4" />}>
                  Create Remittance
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    </PageContainer>
  )
}

interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: string
  subtitle: string
}

function StatsCard({ icon, label, value, subtitle }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
            <span className="text-gray-600 dark:text-gray-400">{icon}</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface TabButtonProps {
  children: React.ReactNode
  active?: boolean
}

function TabButton({ children, active }: TabButtonProps) {
  return (
    <button
      className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
        active
          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400'
      }`}
    >
      {children}
    </button>
  )
}
