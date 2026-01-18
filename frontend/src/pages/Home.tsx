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
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="container-app">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-full">
              <Globe className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Powered by Celo Blockchain
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight tracking-tight">
              Send Money{' '}
              <span className="text-orange-500">Together</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Pool funds with friends and family for cross-border remittances.
              Low fees, transparent, blockchain-powered.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/send">
                <Button size="lg" className="gap-2 px-8">
                  Start Sending
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="px-8">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {[
              { value: '0.5%', label: 'Platform Fee' },
              { value: '10k+', label: 'Users' },
              { value: '$1M+', label: 'Volume' },
              { value: '24/7', label: 'Available' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 border-t border-neutral-200 dark:border-neutral-800">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Why RemitEasy?
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Built for the way families actually send money — together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} padding="lg" hover>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-neutral-100 dark:bg-neutral-900/50">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Simple, secure, and transparent in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-neutral-300 dark:bg-neutral-700" />
                )}

                <div className="flex flex-col items-center">
                  <span className="text-6xl font-bold text-neutral-200 dark:text-neutral-800 mb-6">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pb-32">
        <div className="container-app">
          <Card className="bg-neutral-900 dark:bg-neutral-800 border-neutral-800 dark:border-neutral-700" padding="lg">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Ready to get started?
                </h2>
                <p className="text-neutral-400 text-lg">
                  Join thousands sending money the smart way.
                </p>
              </div>
              <Link to="/send">
                <Button size="lg" className="gap-2 px-8 whitespace-nowrap">
                  <Wallet className="w-5 h-5" />
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
