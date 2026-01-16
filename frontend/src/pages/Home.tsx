import { Link } from 'react-router-dom'
import { Users, Shield, Zap, ArrowRight, Globe, Wallet } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function Home() {
  const features = [
    {
      icon: Zap,
      title: 'Low Fees',
      description: 'Only 0.5% platform fee on every transaction.',
    },
    {
      icon: Users,
      title: 'Group Pooling',
      description: 'Pool funds with family and friends seamlessly.',
    },
    {
      icon: Shield,
      title: 'Secure Escrow',
      description: 'Funds held safely on-chain with full transparency.',
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Create',
      description: 'Set up a remittance with recipient details and target amount.',
    },
    {
      number: '02',
      title: 'Contribute',
      description: 'Share with family and friends to pool funds together.',
    },
    {
      number: '03',
      title: 'Send',
      description: 'Release funds once target is met — safe and instant.',
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-full">
              <Globe className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                Powered by Celo Blockchain
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-neutral-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
              Send Money{' '}
              <span className="text-orange-500">Together</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-400 mb-8 max-w-xl leading-relaxed">
              Pool funds with friends and family for cross-border remittances.
              Low fees, transparent, blockchain-powered.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link to="/send">
                <Button size="lg" className="gap-2">
                  Start Sending
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: '0.5%', label: 'Platform Fee' },
              { value: '10k+', label: 'Users' },
              { value: '$1M+', label: 'Volume' },
              { value: '24/7', label: 'Available' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white mb-4">
              Why RemitEasy?
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Built for the way families actually send money — together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-neutral-100 dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400">
              Simple, secure, and transparent in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(100%-1rem)] w-[calc(100%-2rem)] h-px bg-neutral-300 dark:bg-neutral-700" />
                )}

                <div className="flex flex-col">
                  <span className="text-4xl font-semibold text-neutral-200 dark:text-neutral-800 mb-4">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Card className="bg-neutral-900 dark:bg-neutral-800 border-neutral-800 dark:border-neutral-700 p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                  Ready to get started?
                </h2>
                <p className="text-neutral-400">
                  Join thousands sending money the smart way.
                </p>
              </div>
              <Link to="/send">
                <Button size="lg" className="gap-2 whitespace-nowrap">
                  <Wallet className="w-4 h-4" />
                  Create Remittance
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
