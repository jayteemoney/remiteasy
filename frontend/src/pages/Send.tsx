import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { Send as SendIcon, Info } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { RemitForm } from '../components/RemitForm'
import { ForexAlert } from '../components/ForexAlert'
import { AnimatedPage } from '../components/AnimatedPage'

export function Send() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <AnimatedPage>
        <div className="min-h-[70vh] flex items-center justify-center px-6">
          <Card className="text-center max-w-lg w-full p-12">
            <div className="text-7xl mb-6">🔗</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Please connect your wallet to create a remittance
            </p>
          </Card>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <div className="w-full min-h-screen py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 mb-6">
              <SendIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Send Money
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Create a new remittance and start collecting contributions
            </p>
          </motion.div>

          {/* Forex Alert */}
          <ForexAlert />

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card glass padding="md" className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  0.5% Fee
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Low platform cost
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card glass padding="md" className="text-center">
                <div className="text-3xl mb-3">🔒</div>
                <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Secure Escrow
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Blockchain protected
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card glass padding="md" className="text-center">
                <div className="text-3xl mb-3">👥</div>
                <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Group Pooling
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Multiple contributors
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <RemitForm />
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card glass className="p-8">
              <div className="flex gap-4">
                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    How it works
                  </h3>
                  <ul className="space-y-3 text-base text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm flex-shrink-0">
                        1
                      </span>
                      <span>
                        Fill in the recipient details and target amount you want to send
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm flex-shrink-0">
                        2
                      </span>
                      <span>
                        Share the remittance with friends and family to contribute
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm flex-shrink-0">
                        3
                      </span>
                      <span>
                        Once the target is reached, complete the remittance to release funds
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm flex-shrink-0">
                        4
                      </span>
                      <span>
                        Funds are securely held in escrow until completion or cancellation
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  )
}
