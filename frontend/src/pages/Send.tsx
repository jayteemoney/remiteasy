import { useAccount } from 'wagmi'
import { Send as SendIcon, Wallet, Zap, Shield, Users, Info } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { RemitForm } from '../components/RemitForm'
import { ForexAlert } from '../components/ForexAlert'

export function Send() {
  const { isConnected } = useAccount()

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
            Connect your wallet to create a new remittance.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="container-app">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 mb-6">
              <SendIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
              Send Money
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Create a new remittance and collect contributions
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Zap, label: '0.5% Fee', sublabel: 'Low cost' },
              { icon: Shield, label: 'Escrow', sublabel: 'Secure' },
              { icon: Users, label: 'Pooling', sublabel: 'Group fund' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.label} padding="sm" className="text-center">
                  <Icon className="w-5 h-5 text-orange-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {item.label}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {item.sublabel}
                  </p>
                </Card>
              )
            })}
          </div>

          {/* Forex Alert */}
          <ForexAlert />

          {/* Main Form */}
          <RemitForm />

          {/* How it works */}
          <Card padding="md">
            <div className="flex gap-4">
              <Info className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-4">
                  How it works
                </h3>
                <ol className="space-y-3">
                  {[
                    'Fill in recipient details and target amount',
                    'Share with family and friends to contribute',
                    'Release funds once the target is reached',
                    'Funds are held in escrow until completion',
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
