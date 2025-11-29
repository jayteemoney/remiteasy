import { Layout } from './components/Layout'
import { ForexAlert } from './components/ForexAlert'
import { RemitForm } from './components/RemitForm'
import { RemittanceList } from './components/RemittanceList'

/**
 * Main App Component
 * Orchestrates the RemitEasy dApp with all core features:
 * - Wallet connection (via Layout)
 * - Forex rate monitoring (ForexAlert)
 * - Remittance creation (RemitForm)
 * - Remittance management (RemittanceList)
 */
function App() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center py-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Send Money,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Together
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Pool funds with friends and family for remittances. Low fees, powered by Celo
            blockchain. Perfect for group gifts, medical expenses, and more.
          </p>
        </section>

        {/* Forex Alert */}
        <section>
          <ForexAlert />
        </section>

        {/* Main Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Remittance Form - Left Column */}
          <div className="lg:col-span-1">
            <RemitForm />
          </div>

          {/* Remittance List - Right Columns */}
          <div className="lg:col-span-2">
            <RemittanceList />
          </div>
        </section>

        {/* Info Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-xl p-6 border border-blue-500/20">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Ultra-Low Fees
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Only 0.5% platform fee. No hidden charges. Save more on every transaction.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-xl p-6 border border-green-500/20">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Group Contributions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Multiple people can contribute to the same remittance. Perfect for family pooling.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 rounded-xl p-6 border border-amber-500/20">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Secure Escrow
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Funds held safely on-chain until target is met. Full transparency guaranteed.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default App
