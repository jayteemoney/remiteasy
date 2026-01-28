import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { Button, Card, CardContent, Skeleton } from '@/components/common'
import { RemittanceList } from '@/components/remittance'
import { useUserRemittances, useRecipientRemittances } from '@/hooks/contracts'
import { formatCeloWithSymbol } from '@/lib/format'
import { cn } from '@/lib/cn'

type TabType = 'created' | 'receiving' | 'contributed'

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('created')
  const { address } = useAccount()

  const { data: createdRemittances, isLoading: isLoadingCreated } = useUserRemittances(address)
  const { data: receivingRemittances, isLoading: isLoadingReceiving } = useRecipientRemittances(address)

  const isLoading = isLoadingCreated || isLoadingReceiving

  // Calculate stats
  const stats = useMemo(() => {
    const created = createdRemittances?.length ?? 0
    const receiving = receivingRemittances?.length ?? 0

    // Total contributed (sum of currentAmount for created remittances)
    const totalContributed = createdRemittances?.reduce(
      (sum, r) => sum + r.currentAmount,
      0n
    ) ?? 0n

    // Total received (sum of currentAmount for released receiving remittances)
    const totalReceived = receivingRemittances
      ?.filter(r => r.isReleased)
      .reduce((sum, r) => sum + r.currentAmount, 0n) ?? 0n

    return { created, receiving, totalContributed, totalReceived }
  }, [createdRemittances, receivingRemittances])

  // Get remittances for active tab
  const activeRemittances = useMemo(() => {
    switch (activeTab) {
      case 'created':
        return createdRemittances ?? []
      case 'receiving':
        return receivingRemittances ?? []
      case 'contributed':
        // For contributed, we'd need a separate hook to track contributions
        // For now, return empty - this could be enhanced later
        return []
      default:
        return []
    }
  }, [activeTab, createdRemittances, receivingRemittances])

  const tabIsLoading = activeTab === 'created' ? isLoadingCreated :
                       activeTab === 'receiving' ? isLoadingReceiving : false

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
          value={isLoading ? undefined : stats.created.toString()}
          subtitle="remittances"
          isLoading={isLoading}
        />
        <StatsCard
          icon={<ArrowDownLeft className="h-5 w-5" />}
          label="Receiving"
          value={isLoading ? undefined : stats.receiving.toString()}
          subtitle="remittances"
          isLoading={isLoading}
        />
        <StatsCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Total Collected"
          value={isLoading ? undefined : formatCeloWithSymbol(stats.totalContributed)}
          subtitle="for your remittances"
          isLoading={isLoading}
        />
        <StatsCard
          icon={<Wallet className="h-5 w-5" />}
          label="Total Received"
          value={isLoading ? undefined : formatCeloWithSymbol(stats.totalReceived)}
          subtitle="from remittances"
          isLoading={isLoading}
        />
      </div>

      {/* Tabs Content */}
      <div className="mt-8">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="-mb-px flex gap-8">
            <TabButton
              active={activeTab === 'created'}
              onClick={() => setActiveTab('created')}
            >
              Created ({stats.created})
            </TabButton>
            <TabButton
              active={activeTab === 'receiving'}
              onClick={() => setActiveTab('receiving')}
            >
              Receiving ({stats.receiving})
            </TabButton>
            <TabButton
              active={activeTab === 'contributed'}
              onClick={() => setActiveTab('contributed')}
              disabled
            >
              Contributed (Coming Soon)
            </TabButton>
          </nav>
        </div>

        <div className="mt-8">
          <RemittanceList
            remittances={activeRemittances}
            isLoading={tabIsLoading}
            emptyTitle={getEmptyTitle(activeTab)}
            emptyDescription={getEmptyDescription(activeTab)}
            emptyAction={
              activeTab === 'created' ? (
                <Link to="/send">
                  <Button leftIcon={<Plus className="h-4 w-4" />}>
                    Create Remittance
                  </Button>
                </Link>
              ) : undefined
            }
          />
        </div>
      </div>
    </PageContainer>
  )
}

function getEmptyTitle(tab: TabType): string {
  switch (tab) {
    case 'created':
      return 'No remittances created'
    case 'receiving':
      return 'No incoming remittances'
    case 'contributed':
      return 'No contributions yet'
    default:
      return 'No remittances'
  }
}

function getEmptyDescription(tab: TabType): string {
  switch (tab) {
    case 'created':
      return 'Create your first remittance to start collecting funds for your loved ones.'
    case 'receiving':
      return "When someone creates a remittance for you, it will appear here."
    case 'contributed':
      return 'When you contribute to a remittance, it will appear here.'
    default:
      return 'No remittances to display.'
  }
}

interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: string | undefined
  subtitle: string
  isLoading?: boolean
}

function StatsCard({ icon, label, value, subtitle, isLoading }: StatsCardProps) {
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
          {isLoading ? (
            <Skeleton className="mt-1 h-8 w-24" />
          ) : (
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface TabButtonProps {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

function TabButton({ children, active, disabled, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'border-b-2 px-1 py-4 text-sm font-medium transition-colors',
        active
          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  )
}
