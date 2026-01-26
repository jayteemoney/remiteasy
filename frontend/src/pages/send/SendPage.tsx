import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Info } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/common'

export function SendPage() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')

  const platformFee = 0.5 // 0.5%
  const amountNum = parseFloat(amount) || 0
  const feeAmount = amountNum * (platformFee / 100)
  const recipientReceives = amountNum - feeAmount

  const isValidForm = recipient.length === 42 && amountNum > 0 && purpose.length > 0

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

      <Card>
        <CardHeader>
          <CardTitle>Create New Remittance</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Set up a new remittance for others to contribute to
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            label="Recipient Address"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            helperText="The Celo wallet address that will receive the funds"
          />

          <Input
            label="Target Amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            rightElement={<span className="text-sm font-medium">CELO</span>}
            helperText="The total amount you want to collect"
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Purpose
            </label>
            <textarea
              className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              placeholder="What is this remittance for?"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              maxLength={200}
            />
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              {purpose.length}/200 characters
            </p>
          </div>

          {amountNum > 0 && (
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Info className="h-4 w-4" />
                Fee Breakdown
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Platform Fee ({platformFee}%)</span>
                  <span className="text-gray-900 dark:text-white">{feeAmount.toFixed(4)} CELO</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Recipient Receives</span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    {recipientReceives.toFixed(4)} CELO
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!isValidForm}
          >
            Create Remittance
          </Button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            By creating a remittance, you agree to our terms of service.
            Funds will be held in escrow until released by the recipient.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
