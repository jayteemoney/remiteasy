import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Share2, Users } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { Button, Card, CardContent, Badge, Spinner } from '@/components/common'

export function RemittanceDetailPage() {
  const { id } = useParams<{ id: string }>()

  // Placeholder data - will be replaced with actual contract data
  const isLoading = false
  const remittance = null

  if (isLoading) {
    return (
      <PageContainer maxWidth="lg">
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageContainer>
    )
  }

  if (!remittance) {
    return (
      <PageContainer maxWidth="lg">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Remittance #{id}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              This remittance details will be loaded from the smart contract.
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Contract integration coming in Phase 2
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer maxWidth="lg">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="success">Active</Badge>
                  <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    Remittance #{id}
                  </h1>
                </div>
                <Button variant="outline" size="sm" leftIcon={<Share2 className="h-4 w-4" />}>
                  Share
                </Button>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    0 / 1.0 CELO (0%)
                  </span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all duration-500"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailItem label="Creator" value="0x..." />
                <DetailItem label="Recipient" value="0x..." />
                <DetailItem label="Created" value="--" />
                <DetailItem label="Purpose" value="Placeholder" />
              </div>
            </CardContent>
          </Card>

          {/* Contributors */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Contributors (0)
                </h2>
              </div>
              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No contributions yet. Be the first to contribute!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">Actions</h3>
              <div className="mt-4 space-y-3">
                <Button className="w-full">Contribute</Button>
                <Button variant="outline" className="w-full">
                  View on Explorer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

interface DetailItemProps {
  label: string
  value: string
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}
