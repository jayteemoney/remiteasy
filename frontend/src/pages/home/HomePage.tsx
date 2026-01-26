import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ArrowRight, Shield, Users, Zap, Globe } from 'lucide-react'
import { Button } from '@/components/common'

export function HomePage() {
  const { isConnected } = useAccount()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Send Money Home,{' '}
              <span className="text-primary-500">Together</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              RemitEasy makes it easy for family and friends to pool funds and send
              remittances securely on the Celo blockchain. Lower fees, complete
              transparency, and instant settlements.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isConnected ? (
                <Link to="/send">
                  <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Start Sending
                  </Button>
                </Link>
              ) : (
                <ConnectButton />
              )}
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute -top-40 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary-200 opacity-20 blur-3xl dark:bg-primary-900" />
        <div className="absolute -bottom-40 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-accent-400 opacity-20 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Why Choose RemitEasy?
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Built on Celo for fast, secure, and affordable cross-border payments
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Group Funding"
              description="Pool contributions from multiple family members or friends for larger remittances"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Secure Escrow"
              description="Funds are held safely in a smart contract until the target amount is reached"
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Low Fees"
              description="Only 0.5% platform fee, much lower than traditional remittance services"
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Transparent"
              description="Every transaction is recorded on the blockchain for complete transparency"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Simple steps to send money to your loved ones
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            <StepCard
              step={1}
              title="Create"
              description="Create a remittance with the recipient address and target amount"
            />
            <StepCard
              step={2}
              title="Share"
              description="Share the remittance link with family and friends who want to contribute"
            />
            <StepCard
              step={3}
              title="Contribute"
              description="Contributors send funds to the escrow until the target is reached"
            />
            <StepCard
              step={4}
              title="Release"
              description="Recipient releases the funds when they're ready to receive"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-500 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Ready to Send Money Home?
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Join thousands of users sending remittances on Celo
          </p>
          <div className="mt-8">
            {isConnected ? (
              <Link to="/send">
                <Button
                  variant="secondary"
                  size="lg"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Get Started Now
                </Button>
              </Link>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl bg-gray-50 p-6 transition-all hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  )
}

interface StepCardProps {
  step: number
  title: string
  description: string
}

function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className="relative text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-white">
        {step}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  )
}
