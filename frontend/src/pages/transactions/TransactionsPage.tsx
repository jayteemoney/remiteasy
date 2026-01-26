import { PageContainer } from '@/components/layout'
import { Card, CardContent, EmptyState } from '@/components/common'
import { Receipt } from 'lucide-react'

export function TransactionsPage() {
  return (
    <PageContainer
      title="Transactions"
      description="View your transaction history"
    >
      <Card>
        <CardContent className="p-6">
          <EmptyState
            icon={<Receipt className="h-8 w-8 text-gray-400" />}
            title="No transactions yet"
            description="Your transaction history will appear here once you start using RemitEasy."
          />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
