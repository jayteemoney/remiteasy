import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { Card, CardContent, EmptyState, Skeleton } from '@/components/common'
import { useUserRemittances, useRecipientRemittances } from '@/hooks/contracts'
import { formatCeloWithSymbol, formatDate } from '@/lib/format'
import type { Remittance } from '@/types/remittance'

interface TransactionItem {
  id: string
  type: 'created' | 'receiving' | 'released' | 'cancelled'
  remittance: Remittance
  date: Date
}

export function TransactionsPage() {
  const { address } = useAccount()
  const { data: createdRemittances, isLoading: isLoadingCreated } = useUserRemittances(address)
  const { data: receivingRemittances, isLoading: isLoadingReceiving } = useRecipientRemittances(address)

  const isLoading = isLoadingCreated || isLoadingReceiving

  // Combine and sort transactions
  const transactions = useMemo(() => {
    const items: TransactionItem[] = []

    // Add created remittances
    createdRemittances?.forEach((r) => {
      items.push({
        id: `created-${r.id}`,
        type: 'created',
        remittance: r,
        date: r.createdAt,
      })

      // Add cancelled if applicable
      if (r.isCancelled) {
        items.push({
          id: `cancelled-${r.id}`,
          type: 'cancelled',
          remittance: r,
          date: r.createdAt, // We don't have the actual cancel date
        })
      }
    })

    // Add receiving remittances
    receivingRemittances?.forEach((r) => {
      items.push({
        id: `receiving-${r.id}`,
        type: 'receiving',
        remittance: r,
        date: r.createdAt,
      })

      // Add released if applicable
      if (r.isReleased) {
        items.push({
          id: `released-${r.id}`,
          type: 'released',
          remittance: r,
          date: r.createdAt, // We don't have the actual release date
        })
      }
    })

    // Sort by date descending
    return items.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [createdRemittances, receivingRemittances])

  return (
    <PageContainer
      title="Transactions"
      description="View your transaction history"
    >
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="mt-1 h-3 w-24" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="mt-1 h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={<ArrowUpRight className="h-8 w-8 text-gray-400" />}
                title="No transactions yet"
                description="Your transaction history will appear here once you start using RemitEasy."
              />
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {transactions.map((tx) => (
                <TransactionRow key={tx.id} transaction={tx} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Showing activity from your remittances. For detailed transaction history, check the{' '}
        <a
          href="https://celoscan.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:underline dark:text-primary-400"
        >
          block explorer
        </a>
        .
      </p>
    </PageContainer>
  )
}

interface TransactionRowProps {
  transaction: TransactionItem
}

function TransactionRow({ transaction }: TransactionRowProps) {
  const { type, remittance, date } = transaction

  const config = getTransactionConfig(type)

  return (
    <Link
      to={`/remittance/${remittance.id}`}
      className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.bgColor}`}>
          {config.icon}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {config.label}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {remittance.purpose.length > 30
              ? `${remittance.purpose.slice(0, 30)}...`
              : remittance.purpose}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className={`font-medium ${config.amountColor}`}>
          {config.amountPrefix}{formatCeloWithSymbol(remittance.targetAmount)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(date)}
        </p>
      </div>
    </Link>
  )
}

function getTransactionConfig(type: TransactionItem['type']) {
  switch (type) {
    case 'created':
      return {
        label: 'Created Remittance',
        icon: <ArrowUpRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        amountColor: 'text-gray-900 dark:text-white',
        amountPrefix: '',
      }
    case 'receiving':
      return {
        label: 'Incoming Remittance',
        icon: <ArrowDownLeft className="h-5 w-5 text-primary-600 dark:text-primary-400" />,
        bgColor: 'bg-primary-100 dark:bg-primary-900/30',
        amountColor: 'text-primary-600 dark:text-primary-400',
        amountPrefix: '+',
      }
    case 'released':
      return {
        label: 'Funds Released',
        icon: <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />,
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        amountColor: 'text-green-600 dark:text-green-400',
        amountPrefix: '+',
      }
    case 'cancelled':
      return {
        label: 'Remittance Cancelled',
        icon: <XCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />,
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        amountColor: 'text-gray-500 dark:text-gray-400',
        amountPrefix: '',
      }
  }
}
