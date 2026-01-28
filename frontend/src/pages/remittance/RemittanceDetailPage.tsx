import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { ArrowLeft, Share2, ExternalLink, Check } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { Button, Card, CardContent, Spinner } from '@/components/common'
import {
  RemittanceStatus,
  RemittanceProgress,
  ContributorsList,
  ContributeModal,
  ReleaseModal,
  CancelModal,
} from '@/components/remittance'
import { useRemittance } from '@/hooks/contracts'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { formatAddress, formatDate, formatCeloWithSymbol } from '@/lib/format'

export function RemittanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { address } = useAccount()
  const { copy, copied } = useCopyToClipboard()

  const [isContributeOpen, setIsContributeOpen] = useState(false)
  const [isReleaseOpen, setIsReleaseOpen] = useState(false)
  const [isCancelOpen, setIsCancelOpen] = useState(false)

  // Parse ID to bigint
  const remittanceId = id ? BigInt(id) : undefined

  // Fetch remittance data
  const { data: remittance, isLoading, error, refetch } = useRemittance(remittanceId)

  // Determine user role
  const isCreator = address && remittance?.creator.toLowerCase() === address.toLowerCase()
  const isRecipient = address && remittance?.recipient.toLowerCase() === address.toLowerCase()
  const canContribute = remittance?.status === 'active'
  const canRelease = isRecipient && remittance?.status === 'active' && remittance.progress >= 100
  const canCancel = isCreator && remittance?.status === 'active'

  // Share URL
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleShare = () => {
    copy(shareUrl)
  }

  // Loading state
  if (isLoading) {
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
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </PageContainer>
    )
  }

  // Error state
  if (error || !remittance) {
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
              Remittance Not Found
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {error ? 'Failed to load remittance data.' : 'This remittance does not exist.'}
            </p>
            <Link to="/dashboard" className="mt-4 inline-block">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
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
                  <RemittanceStatus
                    status={remittance.status}
                    progress={remittance.progress}
                  />
                  <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {remittance.purpose}
                  </h1>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  onClick={handleShare}
                >
                  {copied ? 'Copied!' : 'Share'}
                </Button>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <RemittanceProgress
                  currentAmount={remittance.currentAmount}
                  targetAmount={remittance.targetAmount}
                />
              </div>

              {/* Details */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Creator"
                  value={formatAddress(remittance.creator)}
                  isMono
                  isCurrentUser={isCreator}
                />
                <DetailItem
                  label="Recipient"
                  value={formatAddress(remittance.recipient)}
                  isMono
                  isCurrentUser={isRecipient}
                />
                <DetailItem
                  label="Created"
                  value={formatDate(remittance.createdAt)}
                />
                <DetailItem
                  label="Remittance ID"
                  value={`#${remittance.id.toString()}`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contributors */}
          <div className="mt-6">
            <ContributorsList
              remittanceId={remittance.id}
              totalAmount={remittance.currentAmount}
            />
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">Actions</h3>
              <div className="mt-4 space-y-3">
                {canContribute && (
                  <Button
                    className="w-full"
                    onClick={() => setIsContributeOpen(true)}
                  >
                    Contribute
                  </Button>
                )}

                {canRelease && (
                  <Button
                    className="w-full"
                    variant="primary"
                    onClick={() => setIsReleaseOpen(true)}
                  >
                    Release Funds
                  </Button>
                )}

                {canCancel && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setIsCancelOpen(true)}
                  >
                    Cancel Remittance
                  </Button>
                )}

                {remittance.status === 'released' && (
                  <p className="text-center text-sm text-green-600 dark:text-green-400">
                    Funds have been released to the recipient
                  </p>
                )}

                {remittance.status === 'cancelled' && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    This remittance has been cancelled
                  </p>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  leftIcon={<ExternalLink className="h-4 w-4" />}
                  onClick={() => window.open(`https://celoscan.io/address/${remittance.creator}`, '_blank')}
                >
                  View on Explorer
                </Button>
              </div>

              {/* Quick Info */}
              <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Quick Info
                </h4>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Target</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {formatCeloWithSymbol(remittance.targetAmount)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Collected</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {formatCeloWithSymbol(remittance.currentAmount)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Remaining</dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {formatCeloWithSymbol(
                        remittance.targetAmount > remittance.currentAmount
                          ? remittance.targetAmount - remittance.currentAmount
                          : 0n
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <ContributeModal
        remittance={remittance}
        isOpen={isContributeOpen}
        onClose={() => setIsContributeOpen(false)}
        onSuccess={() => refetch()}
      />

      <ReleaseModal
        remittance={remittance}
        isOpen={isReleaseOpen}
        onClose={() => setIsReleaseOpen(false)}
        onSuccess={() => refetch()}
      />

      <CancelModal
        remittance={remittance}
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onSuccess={() => refetch()}
      />
    </PageContainer>
  )
}

interface DetailItemProps {
  label: string
  value: string
  isMono?: boolean
  isCurrentUser?: boolean | undefined
}

function DetailItem({ label, value, isMono, isCurrentUser }: DetailItemProps) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 font-medium text-gray-900 dark:text-white ${isMono ? 'font-mono' : ''}`}>
        {value}
        {isCurrentUser && (
          <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">(You)</span>
        )}
      </p>
    </div>
  )
}
