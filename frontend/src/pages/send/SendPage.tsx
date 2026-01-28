import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { CreateRemittanceForm } from '@/components/remittance'

export function SendPage() {
  return (
    <PageContainer maxWidth="md">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <CreateRemittanceForm />
    </PageContainer>
  )
}
